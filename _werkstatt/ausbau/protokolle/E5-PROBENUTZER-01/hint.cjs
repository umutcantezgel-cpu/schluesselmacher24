const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open(process.argv[2]);
  await page.goto('http://localhost:3000/gleichschliessende-zylinder/konfigurator', { waitUntil: 'networkidle' });
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  const t = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{2,}/g, '\n'));
  console.log(t.slice(0, 400).replace(/\n/g,' / '), '...', t.slice(-500).replace(/\n/g,' / '));
  await browser.close();
})();
