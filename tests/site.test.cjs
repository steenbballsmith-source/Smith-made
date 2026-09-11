const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('every sitemap page retains its search metadata, valid structured data, and local assets', () => {
  const sitemap = new JSDOM(read('sitemap.xml'), { contentType: 'text/xml' });
  const urls = [...sitemap.window.document.querySelectorAll('loc')].map(el => el.textContent);
  sitemap.window.close();
  assert.equal(urls.length, 14);
  assert.equal(new Set(urls).size, urls.length);
  for (const url of urls) {
    const location = new URL(url);
    assert.equal(location.origin, 'https://smithmadesc.com');
    const filename = location.pathname === '/' ? 'index.html' : location.pathname.slice(1);
    const page = new JSDOM(read(filename), { url });
    try {
      const d = page.window.document;
      assert.equal(d.querySelectorAll('link[rel="canonical"]').length, 1, filename);
      assert.equal(d.querySelector('link[rel="canonical"]').href, url, filename);
      assert.ok(d.title.trim(), filename + ' title');
      assert.ok(d.querySelector('meta[name="description"]')?.content.trim(), filename + ' description');
      assert.equal(d.querySelectorAll('h1').length, 1, filename + ' main heading');
      assert.equal(d.querySelectorAll('a[href^="tel:"]').length, 0, filename + ' email-first contact');
      for (const schema of d.querySelectorAll('script[type="application/ld+json"]')) {
        assert.doesNotThrow(() => JSON.parse(schema.textContent), filename + ' structured data');
      }
      for (const el of d.querySelectorAll('[href], [src]')) {
        const raw = el.getAttribute('href') ?? el.getAttribute('src');
        const target = new URL(raw, url);
        if (target.origin !== location.origin) continue;
        const targetFile = decodeURIComponent(target.pathname).replace(/^\//, '') || 'index.html';
        assert.ok(fs.existsSync(path.join(root, targetFile)), filename + ' → ' + raw);
      }
    } finally { page.window.close(); }
  }
});

test('the sitemap remains advertised to crawlers', () => {
  assert.match(read('robots.txt'), /Sitemap: https:\/\/smithmadesc\.com\/sitemap\.xml/);
});
