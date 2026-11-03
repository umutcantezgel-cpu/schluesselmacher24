const { open, buttons } = require('./lib.cjs');
(async () => {
  const { browser, page, blocked } = await open('desktop');
  const url = process.argv[2];
  await page.goto('http://localhost:3000' + url, { waitUntil: 'networkidle' });
  console.log('URL', page.url(), 'TITLE', await page.title());
  const b = await buttons(page);
  b.forEach((x) => console.log(x.tag, '|', x.label, '|', x.href, '|', x.type));
  console.log('blocked', blocked.length);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
