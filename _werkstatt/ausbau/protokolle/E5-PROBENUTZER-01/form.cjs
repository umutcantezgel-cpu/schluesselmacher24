const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open('desktop');
  await page.goto('http://localhost:3000' + process.argv[2], { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const fields = [...main.querySelectorAll('input, select, textarea')].map((el) => {
      const id = el.id; const lab = id ? document.querySelector(`label[for="${id}"]`) : null;
      const wrap = el.closest('label');
      return { tag: el.tagName, type: el.type, name: el.name, id, value: el.value, checked: el.checked, label: ((lab && lab.innerText) || (wrap && wrap.innerText) || el.getAttribute('aria-label') || '').trim().replace(/\s+/g,' ').slice(0,120), req: el.required, hidden: el.closest('[hidden]') ? 1 : 0, opts: el.tagName==='SELECT' ? [...el.options].map(o=>o.value+':'+o.text) : undefined };
    });
    return { text: main.innerText.replace(/\n{2,}/g, '\n').slice(0, 3000), fields };
  });
  console.log(info.text); console.log('---FIELDS'); info.fields.forEach((f) => console.log(JSON.stringify(f)));
  await browser.close();
})();
