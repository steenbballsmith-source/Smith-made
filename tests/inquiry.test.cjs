const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = ['manifest', 'track', 'main', 'form', 'staged'].map(name =>
  fs.readFileSync(path.join(root, 'js', name + '.js'), 'utf8'));
const flush = () => new Promise(setImmediate);
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
const response = success => ({ ok: true, json: async () => ({ success }) });

// Only our local markup/scripts execute. jsdom's external resource loading is
// disabled; fetch is replaced before any script runs. No inquiry is sent.
async function fixture(t, fetchReply = async () => response(true), query = '') {
  const dom = new JSDOM(html, {
    url: 'https://smithmadesc.com/' + query,
    runScripts: 'outside-only'
  });
  const w = dom.window;
  t.after(() => w.close());
  await new Promise(resolve => w.document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  w.matchMedia = () => ({ matches: true, addEventListener() {} });
  w.requestAnimationFrame = callback => w.setTimeout(() => callback(0), 0);
  w.cancelAnimationFrame = id => w.clearTimeout(id);
  w.HTMLElement.prototype.scrollIntoView = function () {};
  const calls = [];
  w.fetch = (...args) => { calls.push(args); return fetchReply(...args); };
  let deadline;
  let cleared = false;
  const nativeTimeout = w.setTimeout.bind(w);
  const nativeClear = w.clearTimeout.bind(w);
  w.setTimeout = (fn, delay, ...args) => {
    if (delay === 20000) { deadline = fn; return 999999; }
    return nativeTimeout(fn, delay, ...args);
  };
  w.clearTimeout = id => {
    if (id === 999999) { cleared = true; return; }
    nativeClear(id);
  };
  scripts.forEach(source => w.eval(source));
  const d = w.document;
  const form = d.querySelector('[data-inquiry-form]');
  const field = name => form.elements.namedItem(name);
  const fill = () => {
    field('names').value = 'Example Planner';
    field('email').value = 'qa@example.test';
    field('planning_role').value = 'Planner / coordinator';
    field('venue').value = 'Example venue';
    field('transport').value = 'Not sure yet - please advise';
    field('message').value = 'Green & ivory — please advise.\nTwo options?';
    form.querySelector('input[name="pieces"][value="The Arched Welcome"]').checked = true;
    form.querySelector('input[name="pieces"][value="The Mobile Bar"]').checked = true;
  };
  return {
    w, d, form, field, fill, calls,
    submit: () => form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })),
    expire: () => { assert.equal(typeof deadline, 'function'); deadline(); },
    cleared: () => cleared,
    status: d.querySelector('[data-form-status]'),
    recovery: d.querySelector('[data-form-recovery]'),
    draft: d.querySelector('[data-form-email-draft]'),
    success: d.querySelector('[data-form-success]'),
    send: form.querySelector('[type="submit"]')
  };
}

for (const accepted of [true, 'true']) {
  test('confirmed inquiry accepts ' + JSON.stringify(accepted) + ' and keeps attribution for another inquiry', async t => {
    const f = await fixture(t, async () => response(accepted), '?utm_source=planner&utm_campaign=fall');
    f.fill();
    f.submit();
    assert.equal(f.send.disabled, true);
    assert.equal(f.form.getAttribute('aria-busy'), 'true');
    await flush();
    assert.equal(f.calls.length, 1);
    assert.equal(f.calls[0][1].body.get('planning_role'), 'Planner / coordinator');
    assert.equal(f.calls[0][1].body.get('utm_source'), 'planner');
    assert.equal(f.success.hidden, false);
    assert.equal(f.d.activeElement, f.success);
    assert.equal(f.form.style.display, 'none');
    assert.equal(f.field('email').value, '');
    assert.equal(f.field('utm_source').value, 'planner');
    assert.equal(f.field('utm_campaign').value, 'fall');
    assert.equal(f.recovery.hidden, true);
    assert.equal(f.send.disabled, false);
    assert.equal(f.form.hasAttribute('aria-busy'), false);
    assert.equal(f.cleared(), true);
    f.d.querySelector('[data-form-again]').click();
    assert.equal(f.success.hidden, true);
    assert.equal(f.form.style.display, '');
    assert.equal(f.d.activeElement, f.field('names'));
  });
}

test('a tracking exception cannot turn a confirmed inquiry into an error', async t => {
  const f = await fixture(t);
  f.w.smTrack = () => { throw new Error('optional analytics unavailable'); };
  f.fill(); f.submit(); await flush();
  assert.equal(f.success.hidden, false);
  assert.equal(f.recovery.hidden, true);
});

const failures = {
  'HTTP rejection': async () => ({ ok: false, status: 503 }),
  'service-declared failure': async () => response(false),
  'HTML activation response': async () => ({ ok: true, json: async () => { throw new SyntaxError('HTML'); } }),
  'lost connection': async () => { throw new TypeError('network unavailable'); }
};
for (const [name, reply] of Object.entries(failures)) {
  test(name + ' preserves details and prepares a complete email draft', async t => {
    const f = await fixture(t, reply, '?utm_source=venue&utm_content=partner');
    f.fill(); f.submit(); await flush();
    assert.equal(f.success.hidden, true);
    assert.equal(f.send.disabled, false);
    assert.equal(f.form.hasAttribute('aria-busy'), false);
    assert.equal(f.field('email').value, 'qa@example.test');
    assert.equal(f.recovery.hidden, false);
    assert.match(f.status.textContent, /couldn’t confirm/);
    const draft = new URL(f.draft.href);
    assert.equal(draft.protocol, 'mailto:');
    assert.equal(draft.pathname, f.w.SMITH_MADE.email);
    const body = draft.searchParams.get('body');
    for (const detail of ['Example Planner', 'qa@example.test', 'Planner / coordinator',
      'The Arched Welcome, The Mobile Bar', 'Not sure yet - please advise', 'Green & ivory — please advise.\nTwo options?',
      'utm_source: venue', 'utm_content: partner']) assert.ok(body.includes(detail), detail);
    assert.equal(f.cleared(), true);
    f.field('message').value = 'Revised & preserved';
    f.field('message').dispatchEvent(new f.w.Event('input', { bubbles: true }));
    assert.match(new URL(f.draft.href).searchParams.get('body'), /Revised & preserved/);
  });
}

for (const stage of ['fetch', 'response parsing']) {
  test('timeout during ' + stage + ' restores the form and ignores a late success', async t => {
    const pending = deferred();
    const f = await fixture(t, stage === 'fetch'
      ? () => pending.promise
      : async () => ({ ok: true, json: () => pending.promise }));
    f.fill(); f.submit(); await flush(); f.expire(); await flush();
    assert.equal(f.calls[0][1].signal.aborted, true);
    assert.equal(f.send.disabled, false);
    assert.equal(f.recovery.hidden, false);
    assert.equal(f.field('names').value, 'Example Planner');
    pending.resolve(stage === 'fetch' ? response(true) : { success: true });
    await flush();
    assert.equal(f.success.hidden, true);
    assert.equal(f.recovery.hidden, false);
  });
}

test('repeated submit events create only one pending request', async t => {
  const pending = deferred();
  const f = await fixture(t, () => pending.promise);
  f.fill(); f.submit(); f.submit(); await flush();
  assert.equal(f.calls.length, 1);
  pending.resolve(response(true)); await flush();
  assert.equal(f.success.hidden, false);
});

test('invalid email and the honeypot never send an inquiry', async t => {
  const f = await fixture(t);
  f.fill(); f.field('email').value = 'invalid'; f.submit(); await flush();
  assert.equal(f.calls.length, 0);
  f.field('email').value = 'qa@example.test';
  f.field('company').value = 'bot'; f.submit(); await flush();
  assert.equal(f.calls.length, 0);
  assert.equal(f.recovery.hidden, true);
});

test('a visitor can retry manually after an unconfirmed response', async t => {
  let attempt = 0;
  const f = await fixture(t, async () => response(++attempt > 1));
  f.fill(); f.submit(); await flush();
  assert.equal(f.recovery.hidden, false);
  f.submit(); await flush();
  assert.equal(f.calls.length, 2);
  assert.equal(f.success.hidden, false);
  assert.equal(f.recovery.hidden, true);
});

test('all eight catalog pieces carry the selected finish into the existing inquiry without sending', async t => {
  const f = await fixture(t);
  const pieces = [...f.d.querySelectorAll('li.piece')];
  assert.equal(pieces.length, 8);
  for (const piece of pieces) {
    f.form.reset(); f.field('message').value = 'Keep my event details';
    const opener = piece.querySelector('[data-staged]');
    const looks = JSON.parse(opener.getAttribute('data-staged'));
    const title = piece.querySelector('h3').textContent.trim();
    const selected = looks.length - 1;
    opener.click();
    const dialog = f.d.querySelector('#staged');
    assert.equal(dialog.hidden, false);
    assert.equal(dialog.getAttribute('aria-label'), title + ' design finishes');
    const dots = [...dialog.querySelectorAll('.staged-dots button')];
    dots[selected].click();
    assert.equal(dots[selected].getAttribute('aria-pressed'), 'true');
    assert.equal(dots.filter(dot => dot.getAttribute('aria-pressed') === 'true').length, 1);
    dialog.querySelector('[data-staged-inquire]').click();
    assert.equal(dialog.hidden, true);
    const expected = 'Interested in finish: ' + title + ' — ' + looks[selected].finish;
    assert.ok(f.field('message').value.includes(expected));
    assert.ok(f.field('message').value.startsWith('Keep my event details'));
    assert.equal(f.form.querySelector('input[name="pieces"][value="' + piece.querySelector('[data-book]').dataset.book + '"]').checked, true);
    assert.equal(f.d.activeElement, f.field('names'));
    opener.click(); dots[selected] && dialog.querySelectorAll('.staged-dots button')[selected].click();
    dialog.querySelector('[data-staged-inquire]').click();
    assert.equal(f.field('message').value.split(expected).length - 1, 1);
  }
  await flush(); assert.equal(f.calls.length, 0);
});

test('finish arrow keys update the selection and Escape restores the opener', async t => {
  const f = await fixture(t);
  const opener = [...f.d.querySelectorAll('li.piece [data-staged]')]
    .find(el => JSON.parse(el.dataset.staged).length > 1);
  opener.click();
  const dialog = f.d.querySelector('#staged');
  const dots = [...dialog.querySelectorAll('.staged-dots button')];
  f.d.dispatchEvent(new f.w.KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
  assert.equal(dots[1].getAttribute('aria-pressed'), 'true');
  f.d.dispatchEvent(new f.w.KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true }));
  assert.equal(dots[0].getAttribute('aria-pressed'), 'true');
  f.d.dispatchEvent(new f.w.KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
  assert.equal(dialog.hidden, true);
  assert.equal(f.d.activeElement, opener);
});

test('choosing another piece after confirmation reopens the inquiry form', async t => {
  const f = await fixture(t);
  f.fill(); f.submit(); await flush();
  assert.equal(f.success.hidden, false);
  f.d.querySelector('li.piece [data-staged]').click();
  f.d.querySelector('[data-staged-inquire]').click();
  assert.equal(f.success.hidden, true);
  assert.equal(f.form.style.display, '');
  assert.match(f.field('message').value, /Interested in finish:/);
  assert.equal(f.d.activeElement, f.field('names'));
  assert.equal(f.calls.length, 1);
});

test('optional analytics errors do not interrupt the finish viewer', async t => {
  const f = await fixture(t);
  f.w.gtag = () => { throw new Error('analytics unavailable'); };
  assert.doesNotThrow(() => f.w.smTrack('finish_view', {}));
  f.d.querySelector('li.piece [data-staged]').click();
  assert.equal(f.d.querySelector('#staged').hidden, false);
});
