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
async function fixture(t, fetchReply = async () => response(true), query = '', source = html) {
  const dom = new JSDOM(source, {
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

test('all four homepage pieces carry the selected finish into the existing inquiry without sending', async t => {
  const f = await fixture(t);
  const pieces = [...f.d.querySelectorAll('li.piece')];
  assert.equal(pieces.length, 4);
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

test('every pairing selects its exact pieces and preserves entered notes and an open review', async t => {
  const f = await fixture(t);
  const pairings = {
    'warm-welcome': ['The Arched Welcome', 'Seating Chart Wall'],
    'ceremony-moment': ['The Arched Welcome', 'Ceremony Arch Set'],
    'time-to-toast': ['Champagne Wall', 'The Mobile Bar']
  };
  for (const [id, expected] of Object.entries(pairings)) {
    f.form.reset(); f.fill();
    f.form.querySelectorAll('[name="pieces"]').forEach(box => { box.checked = false; });
    f.form.querySelector('[data-form-review]').click();
    const message = f.field('message').value;
    f.d.querySelector('[data-book-set="' + id + '"]').click();
    assert.deepEqual([...f.form.querySelectorAll('[name="pieces"]:checked')].map(box => box.value), expected);
    assert.equal(f.field('message').value, message);
    assert.equal(f.field('names').value, 'Example Planner');
    assert.ok(f.field('requested_set').value);
    assert.ok(f.form.querySelector('[data-inquiry-summary]').value.includes(f.field('requested_set').value));
    assert.equal(f.d.querySelector('[data-selection-note]').hidden, false);
    const box = f.form.querySelector('[name="pieces"]:checked');
    box.checked = false; box.dispatchEvent(new f.w.Event('input', { bubbles: true }));
    assert.equal(f.field('requested_set').value, '');
    assert.equal(f.d.querySelector('[data-selection-note]').hidden, true);
  }
  await flush(); assert.equal(f.calls.length, 0);
});

test('pairing and product finish deep links prefill safely without sending', async t => {
  const paired = await fixture(t, undefined, '?set=time-to-toast');
  assert.equal(paired.field('requested_set').value, 'Time to toast');
  assert.equal(paired.form.querySelectorAll('[name="pieces"]:checked').length, 2);
  const piece = await fixture(t, undefined, '?piece=ceremony-arch-set&finish=Walnut%20Trio');
  assert.equal(piece.form.querySelector('[name="pieces"]:checked').value, 'Ceremony Arch Set');
  assert.match(piece.field('message').value, /Ceremony Arch Set — Walnut Trio/);
  const unknown = await fixture(t, undefined, '?set=__proto__&piece=constructor&finish=Unknown');
  assert.equal(unknown.form.querySelectorAll('[name="pieces"]:checked').length, 0);
  assert.equal(unknown.field('message').value, '');
  assert.equal(paired.calls.length + piece.calls.length + unknown.calls.length, 0);
});

test('inquiry reference and pairing survive failure, email fallback, and manual retry', async t => {
  let attempt = 0;
  const f = await fixture(t, async () => response(++attempt > 1), '?set=warm-welcome');
  f.fill(); f.field('event_type').value = 'Wedding';
  const reference = f.field('submission_id').value;
  assert.match(reference, /^SM-/);
  f.submit(); await flush();
  const body = new URL(f.draft.href).searchParams.get('body');
  assert.ok(body.includes(reference));
  assert.ok(body.includes('Event type: Wedding'));
  assert.ok(body.includes('Suggested pairing: A warm welcome'));
  assert.equal(f.calls[0][1].body.get('submission_id'), reference);
  f.submit(); await flush();
  assert.equal(f.calls[1][1].body.get('submission_id'), reference);
  assert.equal(f.success.hidden, false);
  assert.ok(f.d.querySelector('[data-inquiry-reference]').textContent.includes(reference));
  f.d.querySelector('[data-book-set="time-to-toast"]').click();
  assert.equal(f.success.hidden, true);
  assert.equal(f.field('requested_set').value, 'Time to toast');
  assert.notEqual(f.field('submission_id').value, reference);
  assert.equal(f.field('email').value, '');
});

test('selection cannot mutate a request while it is sending', async t => {
  const pending = deferred();
  const f = await fixture(t, () => pending.promise);
  f.fill(); f.submit(); await flush();
  const before = [...f.form.querySelectorAll('[name="pieces"]:checked')].map(box => box.value);
  f.d.querySelector('[data-book-set="ceremony-moment"]').click();
  assert.deepEqual([...f.form.querySelectorAll('[name="pieces"]:checked')].map(box => box.value), before);
  pending.resolve(response(true)); await flush();
});

test('private preview reviews the new fields without making a request', async t => {
  const f = await fixture(t, undefined, '?set=warm-welcome', html.replace('method="POST"', 'method="dialog"'));
  f.fill(); f.submit(); await flush();
  assert.equal(f.calls.length, 0);
  assert.equal(f.success.hidden, true);
  assert.equal(f.recovery.hidden, false);
  assert.match(f.form.querySelector('[data-inquiry-summary]').value, /Suggested pairing: A warm welcome/);
  assert.match(f.status.textContent, /has not been sent/);
});

test('all eight detail galleries and full catalog carry a selected finish to the correct inquiry URL', async t => {
  const catalog = fs.readFileSync(path.join(root, 'collection/index.html'), 'utf8');
  const cat = new JSDOM(catalog);
  const ids = [...cat.window.document.querySelectorAll('li.piece')].map(el => el.id.replace('piece-', ''));
  cat.window.close();
  assert.equal(ids.length, 8);
  const pages = ['index', ...ids];
  for (const id of pages) {
    const dom = new JSDOM(fs.readFileSync(path.join(root, 'collection', id + '.html'), 'utf8'), {
      url: 'https://smithmadesc.com/collection/' + id + '.html', runScripts: 'outside-only'
    });
    const w = dom.window, d = w.document;
    t.after(() => w.close());
    w.matchMedia = () => ({ matches: true });
    w.HTMLElement.prototype.scrollIntoView = function () {};
    d.addEventListener('click', event => { if (event.target.closest('[data-book], [data-piece-inquiry]')) event.preventDefault(); });
    w.eval(scripts[scripts.length - 1]);
    const openers = id === 'index' ? [...d.querySelectorAll('li.piece [data-staged]')] : [d.querySelector('[data-staged]')];
    for (const opener of openers) {
      opener.click();
      const dialog = d.querySelector('#staged');
      const dots = [...dialog.querySelectorAll('.staged-dots button')];
      dots[dots.length - 1].click();
      const finish = dots[dots.length - 1].textContent;
      const button = dialog.querySelector('[data-staged-inquire]');
      assert.equal(button.hidden, false);
      button.click();
      const target = id === 'index' ? opener.closest('li.piece').querySelector('[data-book]') : d.querySelector('[data-piece-inquiry]');
      const url = new URL(target.href);
      assert.equal(url.origin, 'https://smithmadesc.com');
      assert.equal(url.pathname, '/index.html');
      assert.equal(url.hash, '#inquire');
      assert.equal(url.searchParams.get('piece'), id === 'index' ? opener.closest('li.piece').id.replace('piece-', '') : id);
      assert.equal(url.searchParams.get('finish'), finish);
      assert.equal(dialog.hidden, true);
    }
  }
});
