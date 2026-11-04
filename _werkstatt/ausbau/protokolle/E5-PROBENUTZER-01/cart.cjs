const { open, DIR } = require('./lib.cjs');
const fs = require('fs'); const path = require('path');
(async () => {
  const dev = process.argv[2]; const { browser, page } = await open(dev);
  await page.goto('http://localhost:3000/warenkorb', { waitUntil: 'networkidle' });
  const t = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{2,}/g, '\n'));
  fs.writeFileSync(path.join(DIR, 'rent-' + dev + '-warenkorb-text.txt'), t);
  console.log(t.slice(0, 1500));
  await browser.close();
})();
