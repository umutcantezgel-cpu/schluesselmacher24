const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('desktop');
  await page.goto('http://localhost:3000/schliessanlagen/konfigurator/schliessplan', { waitUntil: 'networkidle' });
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.waitForTimeout(400);
  console.log('main:', await page.locator('main').count(), 'ol>li>fieldset:', await page.locator('ol > li > fieldset').count(), 'main ol>li>fieldset', await page.locator('main ol > li > fieldset').count(), 'fieldset', await page.locator('fieldset').count());
  console.log('legends', await page.locator('legend').allInnerTexts());
  await page.getByRole('button', { name: 'Tür hinzufügen', exact: true }).click();
  await page.waitForTimeout(300);
  console.log('after add fieldsets', await page.locator('fieldset').count(), await page.locator('legend').allInnerTexts());
  await browser.close();
})();
