const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open(process.argv[2] || 'desktop');
  await page.goto('http://localhost:3000/gleichschliessende-zylinder/konfigurator', { waitUntil: 'networkidle' });
  const dump = async (tag) => {
    const t = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{2,}/g,'\n').slice(0, 2500));
    console.log('=== ' + tag + '\n' + t);
  };
  await dump('STEP1');
  for (let i = 2; i <= 5; i++) {
    const w = page.getByRole('button', { name: 'Weiter' }).first();
    if (await w.count()) { await w.click().catch(e=>console.log('click fail', e.message.slice(0,100))); }
    await page.waitForTimeout(500);
    await dump('after Weiter -> ' + i);
  }
  await browser.close();
})();
