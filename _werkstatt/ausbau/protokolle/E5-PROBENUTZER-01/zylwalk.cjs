const { open } = require('./lib.cjs');
(async () => {
  const { browser, page } = await open(process.argv[2] || 'desktop');
  await page.goto('http://localhost:3000/gleichschliessende-zylinder', { waitUntil: 'networkidle' });
  const links = await page.evaluate(() => [...document.querySelectorAll('a, button')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim().replace(/\s+/g,' ').slice(0,70)).filter(t => /onfig|Zusammen|Warenkorb|starten|jetzt|Zylinder/i.test(t)));
  console.log('LANDING', JSON.stringify(links));
  await page.goto('http://localhost:3000/gleichschliessende-zylinder/konfigurator', { waitUntil: 'networkidle' });
  for (let step = 2; step <= 5; step++) {
    await page.getByRole('button', { name: 'Weiter', exact: true }).click();
    await page.waitForTimeout(400);
    const t = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{2,}/g,'\n'));
    const head = t.match(/Schritt \d von 5 · \S+/);
    const btns = await page.evaluate(() => [...document.querySelectorAll('button, a, input, select')].filter(e => e.getBoundingClientRect().width > 0).map(e => (e.tagName + ':' + (e.innerText||e.getAttribute('aria-label')||e.name||e.value||'')).trim().slice(0,60)).filter(x => !/Startseite|Kontakt|Erklärung/.test(x)));
    console.log('STEP', step, head && head[0], '\n', btns.slice(0, 80).join(' | '));
    console.log(t.slice(0, 900).replace(/\n/g, ' / '));
  }
  await browser.close();
})();
