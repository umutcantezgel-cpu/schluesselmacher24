const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('mobil');
  await page.goto('http://localhost:3000/schliessanlagen/konfigurator/schliessplan', { waitUntil: 'networkidle' });
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  for (let i=0;i<3;i++){ await page.getByRole('button', { name: 'Weiter', exact: true }).click(); await page.waitForTimeout(300); }
  const info = await page.evaluate(() => [...document.querySelectorAll('button, a')].filter(e => /PDF|Link|Angebot|Zurück/.test(e.innerText)).map(e => ({ tag: e.tagName, txt: e.innerText.trim(), vis: e.getBoundingClientRect().width > 0, aria: e.getAttribute('aria-label') })));
  console.log(JSON.stringify(info, null, 1));
  await page.screenshot({ path: '/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E5-PROBENUTZER-01/bilder/probe-mobil-schritt5.png', fullPage: true });
  await browser.close();
})();
