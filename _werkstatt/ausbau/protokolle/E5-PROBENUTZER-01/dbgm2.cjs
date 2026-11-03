const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('mobil');
  await page.goto('http://localhost:3000/schliessanlagen/konfigurator/schliessplan', { waitUntil: 'networkidle' });
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => {
    const cbs = [...document.querySelectorAll('input[type=checkbox]')].filter(c => c.getBoundingClientRect().width > 0);
    return cbs.map(c => { const row = c.closest('tr, li, div'); return { lab: c.getAttribute('aria-label'), txt: (c.closest('label')||{}).innerText || '', row: (row ? row.innerText : '').slice(0, 60).replace(/\n/g,' / '), idx: [...document.querySelectorAll('input[type=checkbox]')].indexOf(c) }; });
  });
  console.log(info.length, JSON.stringify(info.slice(0, 6), null, 1));
  const ex = await page.evaluate(() => { const m = [...document.querySelectorAll('table')][0]; return m ? m.parentElement.parentElement.innerText.slice(0, 1500) : 'none'; });
  console.log(ex);
  await page.screenshot({ path: '/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E5-PROBENUTZER-01/bilder/probe-mobil-schritt3.png', fullPage: false });
  await browser.close();
})();
