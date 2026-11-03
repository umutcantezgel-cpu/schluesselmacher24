// Persona Rentnerin, Sperrschließungs-Konfigurator. Usage: node rent.cjs <mobil|desktop>
const { open, DIR } = require('./lib.cjs');
const fs = require('fs'); const path = require('path');
const dev = process.argv[2] || 'desktop';
const tag = 'rent-' + dev;
const logFile = path.join(DIR, tag + '-log.txt');
fs.writeFileSync(logFile, '');
const t0 = Date.now();
const L = (s) => fs.appendFileSync(logFile, `[${((Date.now() - t0) / 1000).toFixed(1)}s] ${s}\n`);
const shot = async (page, name) => {
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  L(`Bild ${name}: Seitenbreite ${m.sw}/${m.cw}${m.sw > m.cw ? ' ÜBERLAUF' : ''}`);
  return page.screenshot({ path: path.join(DIR, 'bilder', `${tag}-${name}.png`) });
};
const mainText = (page) => page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{2,}/g, '\n'));
(async () => {
  const { browser, page, posts, blocked } = await open(dev);
  page.on('dialog', async (d) => { L('DIALOG ' + d.message()); await d.dismiss(); });
  page.on('request', (r) => { if (r.method() !== 'GET') L('REQ ' + r.method() + ' ' + r.url()); });
  page.setDefaultTimeout(8000);
  const W = (n) => page.getByRole('button', { name: n, exact: true });
  await page.goto('http://localhost:3000/schliessanlagen', { waitUntil: 'networkidle' });
  L('Start /schliessanlagen');
  await shot(page, '01-start');
  // Weg zur Sperrschließung nur über sichtbare Knöpfe und Links
  if (dev === 'mobil') {
    await page.getByRole('button', { name: 'Menü öffnen', exact: true }).click();
    L('Mobil: "Menü öffnen" geklickt');
    await page.waitForTimeout(500);
    const menu = await page.evaluate(() => [...document.querySelectorAll('a')].filter(e => e.getBoundingClientRect().width > 0 && /Sperr|Zylinder/i.test(e.innerText)).map(e => e.innerText.trim().replace(/\s+/g, ' ').slice(0, 60) + ' -> ' + e.getAttribute('href')));
    L('Mobil sichtbare Menü-Links: ' + JSON.stringify(menu));
    await shot(page, '02-menue');
  } else {
    await page.getByRole('button', { name: 'Sperrschließungen', exact: true }).click();
    await page.waitForTimeout(500);
    L('Kopfmenü "Sperrschließungen" geöffnet');
    await shot(page, '02-menue');
  }
  const vis = page.locator('a[href="/gleichschliessende-zylinder"]').filter({ visible: true });
  L('Sichtbare Links zur Sperrschließung: ' + (await vis.count()));
  await vis.first().click();
  await page.waitForURL('**/gleichschliessende-zylinder');
  L('Landingpage Sperrschließung über sichtbaren Link: ' + page.url());
  await shot(page, '03-landing');
  await page.getByRole('link', { name: 'Zum Konfigurator', exact: true }).click();
  await page.waitForURL('**/gleichschliessende-zylinder/konfigurator');
  L('"Zum Konfigurator" -> Schritt 1');
  // Schritt 1: Haustür, Kellertür, Garage; alle Maße 35/35, Garage Halbzylinder
  const doorsNames = ['Haustür', 'Kellertür', 'Garage'];
  for (let p = 2; p <= 3; p++) { await page.getByRole('button', { name: 'Weitere Tür hinzufügen', exact: true }).click(); L('Weitere Tür hinzufügen -> Position ' + p); }
  const bauforms = [0, 0, 2];
  for (let p = 1; p <= 3; p++) {
    await page.locator(`input[name="bauform-position-${p}"]`).nth(bauforms[p - 1]).check({ force: true });
    const sel = page.locator('select');
    await sel.nth(2 * (p - 1)).selectOption('35');
    if (p < 3) await sel.nth(2 * (p - 1) + 1).selectOption('35');
    L(p < 3 ? `Position ${p} (${doorsNames[p - 1]}): Doppelzylinder, Maß A/B 35/35` : `Position ${p} (Garage): Halbzylinder, nur Maß A 35 (Maß B entfällt)`);
  }
  await shot(page, '04-zylinder-ausgefuellt');
  L('Schritt-1-Hinweise: ' + JSON.stringify((await mainText(page)).match(/Sperrschließung[^\n]*|Maß[^\n]*(?:Pflicht|muss|bitte)[^\n]*/g) || []));
  await W('Weiter').click();
  L('Weiter -> Schritt 2 Schlüssel');
  await page.locator('input[type=number]').first().fill('4');
  L('Anzahl gemeinsamer Schlüssel auf 4 gesetzt');
  await shot(page, '05-schluessel');
  await W('Weiter').click();
  L('Weiter -> Schritt 3 Optionen (ohne Auswahl)');
  await W('Weiter').click();
  L('Weiter -> Schritt 4 Erweiterung');
  await page.waitForTimeout(300);
  L('Schritt 4: Weiter ist vor Auswahl deaktiviert: ' + (await W('Weiter').isDisabled().catch(() => 'unbekannt')));
  await page.getByText('Nein, abgeschlossener Satz', { exact: false }).first().click();
  L('"Nein, abgeschlossener Satz" gewählt');
  await W('Weiter').click();
  L('Weiter -> Schritt 5 Zusammenfassung');
  await shot(page, '06-zusammenfassung');
  const t5 = await mainText(page);
  fs.writeFileSync(path.join(DIR, tag + '-schritt5-text.txt'), t5);
  const btns = await page.evaluate(() => [...document.querySelectorAll('button, a')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim().replace(/\s+/g, ' ')).filter(Boolean));
  fs.writeFileSync(path.join(DIR, tag + '-schritt5-knoepfe.txt'), btns.join('\n'));
  L('Schritt 5 Knöpfe gespeichert');
  const cartBtn = page.getByRole('button', { name: /in den warenkorb/i });
  if ((await cartBtn.count()) > 0 && (await cartBtn.first().isVisible())) {
    await cartBtn.first().click();
    await page.waitForTimeout(800);
    L('In den Warenkorb geklickt -> ' + page.url());
    const ct = await mainText(page);
    fs.writeFileSync(path.join(DIR, tag + '-warenkorb-text.txt'), ct);
    L('Warenkorb-Text: ' + JSON.stringify(ct.split('\n').filter(x => /Position|Schlüssel|Zylinder|Summe|Gesamt|Stück|€/.test(x)).slice(0, 25)));
    L('Kasse NICHT angeklickt');
  } else {
    L('KEIN sichtbarer "In den Warenkorb"-Knopf auf Schritt 5, siehe Knöpfe-Datei');
  }
  await shot(page, '07-nach-warenkorb');
  L('POST/Aktionen: ' + JSON.stringify(posts));
  L('blockiert: ' + blocked.length);
  await browser.close();
})().catch((e) => { fs.appendFileSync(logFile, 'FEHLER ' + e.message.split('\n')[0] + '\n'); console.error(e.message.split('\n')[0]); process.exit(1); });
