const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('mobil');
  await page.goto('http://localhost:3000/schliessanlagen/konfigurator/schliessplan', { waitUntil: 'networkidle' });
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  for (let i=0;i<3;i++){ await page.getByRole('button', { name: 'Weiter', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByLabel(/Maße geprüft/).check();
  await page.getByRole('button', { name: 'Weiter', exact: true }).click(); await page.waitForTimeout(400);
  const info = await page.evaluate(() => {
    const el = [...document.querySelectorAll('button, a')].find(e => e.innerText.trim() === 'Plan als Link speichern');
    if (!el) return 'none';
    const chain = []; let c = el; for (let i = 0; i < 6 && c; i++) { const cs = getComputedStyle(c); chain.push(`${c.tagName}.${(c.className||'').toString().slice(0,80)} display=${cs.display}`); c = c.parentElement; }
    return { chain, rect: el.getBoundingClientRect().toJSON() };
  });
  console.log(JSON.stringify(info, null, 1));
  const txt = await page.evaluate(() => [...document.querySelectorAll('summary, details, [aria-expanded]')].map(e => e.innerText.trim().slice(0,60) + ' exp=' + e.getAttribute('aria-expanded') + ' open=' + e.open));
  console.log(txt);
  await page.screenshot({ path: '/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E5-PROBENUTZER-01/bilder/probe-mobil-schritt5b.png', fullPage: false });
  await browser.close();
})();
