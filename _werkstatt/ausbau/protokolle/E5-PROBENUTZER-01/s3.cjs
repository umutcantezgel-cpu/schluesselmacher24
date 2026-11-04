const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open(process.argv[2] || 'desktop');
  await page.goto('http://localhost:3000/schliessanlagen/konfigurator/schliessplan', { waitUntil: 'networkidle' });
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  await page.getByRole('button', { name: 'Weiter' }).first().click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Weiter' }).first().click();
  await page.waitForTimeout(800);
  const main = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{2,}/g,'\n').slice(0, 6000));
  console.log(main);
  console.log('---FIELDS');
  const f = await page.evaluate(() => [...document.querySelectorAll('main input, main select, main textarea')].map((el) => `${el.tagName} ${el.type} value=${el.value} checked=${el.checked} aria=${el.getAttribute('aria-label')||''}`));
  console.log(f.slice(0,60).join('\n'));
  await browser.close();
})();
