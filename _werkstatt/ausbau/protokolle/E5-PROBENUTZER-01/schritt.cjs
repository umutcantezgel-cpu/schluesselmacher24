// Dumps visible main text and form fields of current planner step; usage: node schritt.cjs <device> <outprefix> <steps-json>
const { open } = require('./lib.cjs');
(async () => {
  const device = process.argv[2];
  const { browser, page, blocked, posts } = await open(device);
  await page.goto('http://localhost:3000/schliessanlagen/konfigurator/schliessplan', { waitUntil: 'networkidle' });
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  await page.getByRole('button', { name: 'Weiter' }).first().click();
  await page.waitForTimeout(800);
  const main = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{2,}/g,'\n').slice(0, 5000));
  console.log(main);
  console.log('---FIELDS');
  const f = await page.evaluate(() => [...document.querySelectorAll('main input, main select, main textarea')].map((el) => `${el.tagName} ${el.type} name=${el.name} value=${el.value} checked=${el.checked} aria=${el.getAttribute('aria-label')||''}`));
  console.log(f.join('\n'));
  console.log('---BTN');
  const b = await page.evaluate(() => [...document.querySelectorAll('main button, main a')].map((el)=> (el.innerText||el.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,80)).filter(Boolean));
  console.log(b.join(' | '));
  await page.screenshot({ path: '/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E5-PROBENUTZER-01/bilder/probe-schritt2.png', fullPage: false });
  await browser.close();
})();
