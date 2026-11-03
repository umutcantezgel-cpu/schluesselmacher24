// Persona Hausverwaltung, Schließplan-Planer. Usage: node hv.cjs <mobil|desktop> [stopAt]
const { open, DIR } = require('./lib.cjs');
const fs = require('fs');
const path = require('path');
const dev = process.argv[2] || 'desktop';
const stopAt = process.argv[3] || 'angebot';
const tag = 'hv-' + dev;
const logFile = path.join(DIR, tag + '-log.txt');
fs.writeFileSync(logFile, '');
const t0 = Date.now();
const L = (s) => { const line = `[${((Date.now() - t0) / 1000).toFixed(1)}s] ${s}`; fs.appendFileSync(logFile, line + '\n'); };
const shot = async (page, name) => {
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, tapSmall: [...document.querySelectorAll('button, a, input[type=checkbox], input[type=radio]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24); }).length }));
  L(`Bild ${name}: Seitenbreite ${m.sw}/${m.cw}${m.sw > m.cw ? ' ÜBERLAUF' : ''}, Ziele unter 24 px: ${m.tapSmall}`);
  return page.screenshot({ path: path.join(DIR, 'bilder', `${tag}-${name}.png`), fullPage: false });
};
const stepText = async (page) => page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\n{2,}/g, '\n'));
const diffText = (a, b) => { const A = new Set(a.split('\n')); return b.split('\n').filter(x => x && !A.has(x)); };
const alerts = async (page) => page.evaluate(() => [...document.querySelectorAll('[role=alert], [aria-live=assertive], [aria-invalid=true]')].map(e => (e.innerText || e.getAttribute('aria-label') || e.name || 'invalid').trim().slice(0, 160)));

(async () => {
  const { browser, page, posts, blocked } = await open(dev);
  page.on('request', (r) => { if (r.method() !== 'GET') L('REQ ' + r.method() + ' ' + r.url() + ' next-action=' + (r.headers()['next-action'] ? 'ja' : 'nein') + ' ct=' + (r.headers()['content-type'] || '')); });
  page.on('dialog', async (d) => { L('DIALOG ' + d.message()); await d.dismiss(); });
  page.setDefaultTimeout(8000);
  const W = (n) => page.getByRole('button', { name: n, exact: true });
  await page.goto('http://localhost:3000/schliessanlagen', { waitUntil: 'networkidle' });
  L('Start /schliessanlagen geladen');
  await shot(page, '01-startseite');
  await page.getByRole('link', { name: 'Schließplan selbst anlegen', exact: true }).click(); await page.waitForURL('**/schliessplan');
  await page.waitForLoadState('networkidle');
  L('Link "Schließplan selbst anlegen" -> ' + page.url());
  await shot(page, '02-planer-start');
  await page.locator('input[name=start][value=mehrfamilienhaus]').check({ force: true });
  L('Vorlage "Mehrfamilienhaus mit vier Wohnungen" gewählt (Radio, Label über sichtbare Karte)');
  await W('Weiter').click();
  L('Weiter -> Schritt 2 Türen');
  // Schritt 2: 20 Türen
  const fieldsetCount = () => page.locator('main fieldset').count();
  // Template liefert 6 Türen; 14 hinzufügen
  let n = await page.locator('main fieldset:has(legend)').filter({ hasText: /^Tür \d+/ }).count();
  L('Türen nach Vorlage: ' + n);
  while (n < 20) {
    await page.getByRole('button', { name: 'Tür hinzufügen', exact: true }).click();
    n++;
  }
  L('Tür hinzufügen, bis 20 Türen');
  const doorNames = ['Haustür', 'Keller', 'Müllraum', 'Fahrradraum'];
  for (let i = 1; i <= 16; i++) doorNames.push('Wohnung ' + i);
  const doors = page.locator('main ol > li > fieldset');
  for (let i = 0; i < 20; i++) {
    const fs_ = doors.nth(i);
    const name = fs_.locator('input:not([type])').first();
    await name.fill(doorNames[i]);
    const sels = fs_.locator('select');
    if (i === 0) {
      await sels.nth(2).selectOption('40');
      await sels.nth(3).selectOption('35');
      await fs_.getByRole('checkbox').first().check().catch(() => {});
    }
  }
  L('20 Türen benannt: ' + doorNames.join(', '));
  await shot(page, '03-tueren-ausgefuellt');
  L('Schritt-2-Warnungen: ' + JSON.stringify(await alerts(page)));
  await W('Weiter').click();
  L('Weiter -> Schritt 3 Schlüssel');
  // Schritt 3: Schlüssel 17 (1 Verwaltung + 16 Wohnungen)
  let k = await page.locator('main fieldset').filter({ hasText: /^Schlüssel \d+/ }).count();
  L('Schlüssel nach Vorlage: ' + k);
  while (k < 17) {
    await page.getByRole('button', { name: 'Schlüssel hinzufügen', exact: true }).click();
    k++;
  }
  const keys = page.locator('main ol > li > fieldset').filter({ has: page.locator('input[type=number]') });
  const keyNames = ['Hausverwaltung'];
  for (let i = 1; i <= 16; i++) keyNames.push('Wohnung ' + i);
  const keyFs = page.locator('main fieldset').filter({ has: page.getByLabel('Anzahl jetzt', { exact: true }) });
  const kc = await keyFs.count();
  L('Schlüssel-Felder gefunden: ' + kc);
  for (let i = 0; i < 17; i++) {
    const f = keyFs.nth(i);
    await f.locator('input:not([type])').first().fill(keyNames[i]);
    await f.getByLabel('Anzahl jetzt', { exact: true }).fill(i === 0 ? '2' : '3');
    await f.getByLabel('Für später vormerken', { exact: true }).fill(i === 0 ? '2' : '0');
  }
  L('17 Schlüssel angelegt: Verwaltung 2 plus 2 vorgemerkt, je Wohnung 3');
  // Matrix: Verwaltung alle Türen; Wohnung n: Haustür, Keller, Müllraum, Fahrradraum, eigene Wohnung
  let fehlt = 0;
  if (dev === 'mobil') {
    // Mobil: Tabelle ausgeblendet, je Schlüssel eine Liste mit Türen (Verwaltung: "alle Türen")
    for (let i = 0; i < 17; i++) {
      const f = keyFs.nth(i);
      if (i === 0) {
        await f.getByLabel('alle Türen', { exact: true }).setChecked(true);
      } else {
        for (let d = 0; d < 20; d++) {
          const want = (d <= 3 || d === 3 + i);
          const cb = f.getByLabel(doorNames[d], { exact: true });
          if ((await cb.count()) !== 1) { fehlt++; continue; }
          await cb.setChecked(want);
        }
      }
    }
  } else {
    for (let i = 0; i < 17; i++) {
      for (let d = 0; d < 20; d++) {
        const want = i === 0 ? true : (d <= 3 || d === 3 + i);
        const cb = page.getByRole('checkbox', { name: `„${keyNames[i]}“ schließt „${doorNames[d]}“`, exact: true });
        if ((await cb.count()) !== 1) { fehlt++; continue; }
        await cb.setChecked(want);
      }
    }
  }
  L('Fehlende Matrixfelder: ' + fehlt);
  L('Matrix 17 × 20 gesetzt');
  await shot(page, '04-schluessel-matrix');
  L('Schritt-3-Warnungen: ' + JSON.stringify(await alerts(page)));
  await W('Weiter').click();
  L('Weiter -> Schritt 4 Prüfen');
  await page.waitForTimeout(400);
  L('Schritt 4 ohne Maß-Häkchen: Weiter gedrückt, bleibt auf Schritt 4? ' + (await stepText(page)).match(/Schritt \d von 5 · \S+/));
  await page.getByLabel(/Maße geprüft/).check();
  L('Häkchen "Maße geprüft" gesetzt');
  await shot(page, '05-pruefen');
  await W('Weiter').click();
  L('Weiter -> Schritt 5 Abschluss');
  await page.waitForTimeout(400);
  await shot(page, '06-abschluss-leer');
  const t5 = await stepText(page);
  fs.writeFileSync(path.join(DIR, tag + '-schritt5-text.txt'), t5);
  const inputs = await page.evaluate(() => [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].map(e => `${e.tagName}|${e.type}|${e.getAttribute('aria-label') || ''}|${e.labels && e.labels[0] ? e.labels[0].innerText.slice(0,60) : ''}|req=${e.required}`));
  fs.writeFileSync(path.join(DIR, tag + '-schritt5-felder.txt'), inputs.join('\n'));
  L('Schritt 5 Felder: ' + inputs.length);
  // Kontaktdaten (erfundene Testdaten), Anfrage NICHT absenden
  const g = (name) => page.getByLabel(name, { exact: false });
  const nameTexts = ['Vorname', 'Nachname', 'Firma oder Hausverwaltung', 'E-Mail-Adresse', 'Telefon'];
  const vals = ['Erika', 'Testkundin', 'Testverwaltung', 'test@example.invalid', '0000 000000'];
  for (let i = 0; i < nameTexts.length; i++) {
    const f = page.getByLabel(new RegExp('^' + nameTexts[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    const c = await f.count();
    if (c !== 1) L(`Feld "${nameTexts[i]}" Treffer: ${c}`);
    if (c >= 1) await f.first().fill(vals[i]);
  }
  await page.getByLabel(/Datenschutzerklärung/).check();
  L('Kontaktdaten (Testdaten) eingetragen, Datenschutz-Häkchen gesetzt; Angebot anfragen NICHT geklickt');
  await shot(page, '07-abschluss-ausgefuellt');
  // Plan als Link speichern
  const linkBtn = page.getByRole('button', { name: 'Plan als Link speichern', exact: true });
  const pdfLink = page.getByRole('link', { name: 'Schließplan als PDF', exact: true });
  const linkVis = await linkBtn.isVisible().catch(() => false);
  const pdfVis = await pdfLink.isVisible().catch(() => false);
  L(`Sichtbar auf diesem Gerät: "Plan als Link speichern" ${linkVis ? 'ja' : 'NEIN'} · "Schließplan als PDF" ${pdfVis ? 'ja' : 'NEIN'}`);
  if (linkVis) {
    const before = await stepText(page);
    await linkBtn.click();
    await page.waitForTimeout(900);
    L('Plan als Link speichern geklickt. Neue Texte: ' + JSON.stringify(diffText(before, await stepText(page))) + ' URL: ' + page.url());
  }
  await shot(page, '08-link-gespeichert');
  if (pdfVis) {
    const dlP = page.waitForEvent('download', { timeout: 8000 });
    await pdfLink.click();
    const dl = await dlP.catch(() => null);
    L('Schließplan als PDF (Link, download-Attribut): ' + (dl ? dl.suggestedFilename() : 'kein Download'));
    if (dl) { const p = path.join(DIR, 'hv-' + dev + '-schliessplan.pdf'); await dl.saveAs(p); L('PDF gespeichert: ' + p); }
  } else {
    const trail = await page.evaluate(() => { const el = [...document.querySelectorAll('a')].find(e => e.innerText.trim() === 'Schließplan als PDF'); return el ? 'vorhanden, nicht sichtbar, Ahnen: ' + ((el.closest('[class*="hidden"]') || {}).className || '').slice(0, 120) : 'nicht im DOM'; });
    L('PDF-Link auf diesem Gerät nicht erreichbar: ' + trail);
  }
  await page.waitForTimeout(500);
  await shot(page, '09-nach-pdf');
  L('Endzustand URL: ' + page.url());
  L('Schritt-Zeile Ende: ' + (await stepText(page)).match(/Schritt \d von 5 · \S+/));
  L('POST-Anfragen bisher: ' + JSON.stringify(posts));
  L('blockiert: ' + blocked.length);
  await browser.close();
})().catch((e) => { fs.appendFileSync(logFile, 'FEHLER ' + e.message + '\n'); console.error(e); process.exit(1); });
