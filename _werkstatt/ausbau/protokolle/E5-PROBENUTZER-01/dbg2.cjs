const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('desktop');
  page.on('request', (r) => { if (r.method() !== 'GET') console.log('REQ', r.method(), r.url(), (r.postData()||'').slice(0,200)); });
  page.on('response', (r) => { if (r.request().method() !== 'GET') console.log('RES', r.status(), r.url()); });
  await page.goto('http://localhost:3000/schliessanlagen/konfigurator/schliessplan', { waitUntil: 'networkidle' });
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  await page.waitForTimeout(500);
  console.log('--- after radio');
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.waitForTimeout(500);
  const pdf = await page.evaluate(() => [...document.querySelectorAll('button, a')].filter(e => /PDF|Link speichern/.test(e.innerText)).map(e => ({tag: e.tagName, text: e.innerText, href: e.getAttribute('href'), disabled: e.disabled, type: e.type, html: e.outerHTML.slice(0,300)})));
  console.log(pdf);
  await browser.close();
})();
