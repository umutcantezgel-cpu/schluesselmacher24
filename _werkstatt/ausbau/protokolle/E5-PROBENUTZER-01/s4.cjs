const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('desktop');
  await page.goto('http://localhost:3000/gleichschliessende-zylinder/konfigurator', { waitUntil: 'networkidle' });
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E5-PROBENUTZER-01/bilder/rent-desktop-08-schritt4-weiter-aus.png' });
  await browser.close();
})();
