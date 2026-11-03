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
    const cbs = [...document.querySelectorAll('input[type=checkbox]')];
    const labelled = cbs.filter(c => c.getAttribute('aria-label')).map(c => c.getAttribute('aria-label'));
    const hidden = cbs.filter(c => { const r = c.getBoundingClientRect(); return r.width === 0; }).length;
    const sample = cbs.slice(0, 3).map(c => c.outerHTML.slice(0, 200));
    const matrixTxt = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /schließt/.test(e.textContent)).slice(0,3).map(e => e.textContent.slice(0,80));
    return { total: cbs.length, labelled: labelled.length, sampleLabels: labelled.slice(0, 5), hiddenCount: hidden, sample, matrixTxt, mx: [...document.querySelectorAll('table')].map(t => t.getBoundingClientRect().width + ':' + t.parentElement.className.slice(0, 60)) };
  });
  console.log(JSON.stringify(info, null, 1));
  await browser.close();
})();
