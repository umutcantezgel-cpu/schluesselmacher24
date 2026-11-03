const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
async function open(device) {
  const browser = await chromium.launch();
  const opts = device === 'mobil'
    ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }
    : { viewport: { width: 1440, height: 900 } };
  const ctx = await browser.newContext({ ...opts, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await ctx.newPage();
  const blocked = [];
  await ctx.route('**/*', (route) => {
    const u = route.request().url();
    if (u.startsWith('http://localhost:3000') || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    blocked.push({ url: u, method: route.request().method() });
    return route.abort();
  });
  const posts = [];
  page.on('request', (r) => { if (r.method() !== 'GET') posts.push(r.method() + ' ' + r.url()); });
  return { browser, ctx, page, blocked, posts };
}
function log(file, line) { fs.appendFileSync(path.join(DIR, file), line + '\n'); }
async function buttons(page) {
  return page.evaluate(() => {
    const out = [];
    document.querySelectorAll('a, button, [role=button], input, select, textarea').forEach((el) => {
      const r = el.getBoundingClientRect();
      const vis = r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
      if (!vis) return;
      const label = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.name || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      out.push({ tag: el.tagName.toLowerCase(), label, href: el.getAttribute('href') || '', type: el.getAttribute('type') || '' });
    });
    return out;
  });
}
module.exports = { open, log, buttons, DIR };
