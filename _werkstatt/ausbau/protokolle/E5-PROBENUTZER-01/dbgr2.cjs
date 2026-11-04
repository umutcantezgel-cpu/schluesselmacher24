const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('desktop');
  await page.goto('http://localhost:3000/gleichschliessende-zylinder/konfigurator', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Weitere Tür hinzufügen', exact: true }).click();
  await page.locator('input[name="bauform-position-2"]').nth(2).check({ force: true });
  await page.waitForTimeout(300);
  const t = await page.evaluate(() => { const h = [...document.querySelectorAll('h2,h3,p,label,legend')].find(e => e.innerText && e.innerText.trim() === 'Position 2'); let c = h; for (let i=0;i<3&&c;i++) c = c.parentElement; return (c||document.body).innerText.replace(/\n{2,}/g,'\n').slice(0, 1800); });
  console.log(t);
  await browser.close();
})();
