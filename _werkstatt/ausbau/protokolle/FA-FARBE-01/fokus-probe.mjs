// Fokusprobe FA-FARBE-01: Ring der ersten Tab-Ziele auf neuem Stand (3000) und Messstand (3200), Kachel per Tab.
const lib = await import(new URL('../../werkzeuge/lib.mjs', import.meta.url).href);
const browser = await lib.chromium.launch({ executablePath: lib.CHROMIUM, headless: true, args: ['--no-sandbox'] });
for (const basis of ['http://localhost:3000', 'http://localhost:3200']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await lib.attrappenSetzen(ctx);
  const page = await ctx.newPage();
  await page.goto(basis + '/', { waitUntil: 'networkidle' });
  const zeilen = [];
  for (let i = 0; i < 14; i += 1) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(50);
    zeilen.push(await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return `${e.tagName} ${(e.getAttribute('aria-label') || e.textContent).trim().slice(0, 25)} | fv=${e.matches(':focus-visible')} | ${cs.boxShadow.slice(0, 70)} | outline ${cs.outlineStyle} ${cs.outlineColor}`; }));
  }
  if (basis.endsWith('3000')) await page.screenshot({ path: new URL('./bilder/kachel-fokus-tab-1280.png', import.meta.url).pathname });
  console.log(basis, '\n' + zeilen.join('\n'));
  await ctx.close();
}
await browser.close();
