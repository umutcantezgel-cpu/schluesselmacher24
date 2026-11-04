const { open } = require('./lib.cjs');
(async () => {
  const { browser, page, ctx } = await open('desktop');
  page.on('response', (r) => { if (/pdf|link|save/i.test(r.url())) console.log('RES', r.status(), r.headers()['content-type'], r.url().slice(0,120)); });
  page.on('popup', (p) => console.log('POPUP', p.url().slice(0,120)));
  page.on('download', (d) => console.log('DL', d.suggestedFilename()));
  await page.goto('http://localhost:3000/schliessanlagen/konfigurator/schliessplan', { waitUntil: 'networkidle' });
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.waitForTimeout(300);
  const a = page.getByRole('link', { name: 'Schließplan als PDF', exact: true });
  console.log('target', await a.getAttribute('target'), 'download', await a.getAttribute('download'));
  // Only count, to avoid a real navigation: fetch the same URL from the page context
  const href = await a.getAttribute('href');
  const resp = await page.request.get('http://localhost:3000' + href);
  console.log('GET pdf status', resp.status(), resp.headers()['content-type'], (await resp.body()).length);
  await a.click();
  await page.waitForTimeout(3000);
  console.log('URL after click', page.url().slice(0,100));
  await browser.close();
})();
