const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('desktop');
  await page.goto('http://localhost:3000/gleichschliessende-zylinder/konfigurator', { waitUntil: 'networkidle' });
  for (let p = 2; p <= 3; p++) await page.getByRole('button', { name: 'Weitere Tür hinzufügen', exact: true }).click();
  await page.locator('input[name="bauform-position-3"]').nth(2).check({ force: true });
  const s = await page.evaluate(() => [...document.querySelectorAll('select')].map((e, i) => i + ':' + e.value + ':' + e.options.length + ':' + e.options[0].value + '..' + e.options[e.options.length-1].value + ':' + (e.closest('fieldset,li,section') ? (e.closest('fieldset,li,section').innerText.slice(0,40).replace(/\n/g,' ')) : '')));
  console.log(s.join('\n'));
  await browser.close();
})();
