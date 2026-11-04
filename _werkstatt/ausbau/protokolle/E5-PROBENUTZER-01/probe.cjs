const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('desktop');
  await page.goto('http://localhost:3000/schliessanlagen/konfigurator/schliessplan', { waitUntil: 'networkidle' });
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.waitForTimeout(400);
  const html = await page.evaluate(() => {
    const el = [...document.querySelectorAll('main input[type=text]')][0];
    let c = el; for (let i=0;i<3;i++) c = c.parentElement;
    return c.outerHTML.slice(0, 3000);
  });
  console.log(html);
  console.log('----');
  const r = await page.evaluate(() => [...document.querySelectorAll('main input[type=text], main select, main input[type=checkbox]')].slice(0, 12).map(e => `${e.tagName}|${e.type}|${e.id}|${e.getAttribute('aria-labelledby')||''}|${e.getAttribute('aria-describedby')||''}|${e.name}`));
  console.log(r.join('\n'));
  await browser.close();
})();
