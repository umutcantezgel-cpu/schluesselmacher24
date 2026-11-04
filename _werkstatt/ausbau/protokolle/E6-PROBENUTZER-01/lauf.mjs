// E6-PROBENUTZER-01: acht Probeläufe (vier Personas × mobil, desktop). Nie absenden, nie bezahlen.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import zlib from 'node:zlib';
import { browserStarten, kontextFuer, attrappenSetzen, laden, GERAETE, BASIS_URL, ordner } from '../../werkzeuge/lib.mjs';

const PROT = path.dirname(fileURLToPath(import.meta.url));
const BILD = ordner(path.join(PROT, 'bilder'));
const TERMIN = 'SM24-T-2026-9999';
const PERSON = [
  [/Vorname|^Ihr Name|^Name\b/i, 'Erika'],
  [/Nachname|^Name\b/i, 'Testkundin'],
  [/e-?mail/i, 'test@example.invalid'],
  [/Telefon|Rufnummer/i, '0000 000000'],
  [/PLZ|Postleitzahl/i, '12345'],
  [/^Ort\b|^Stadt/i, 'Musterstadt'],
  [/Stra(ß|ss)e/i, 'Musterweg 1'],
];
const ZUSTIMM = [/Datenschutz|einverstanden|zustimm|gelesen|akzeptier|bestätig|Berechtig|Nachweis/i];
const TEXT = 'Probelauf mit erfundenen Angaben.';

// Sperre: keine Klicks auf Knöpfe, die absenden, bezahlen oder zur Kasse führen.
const VERBOTEN = /absenden|abschicken|\bsenden\b|bezahlen|zur kasse|jetzt kaufen|kostenpflichtig|zahlungspflichtig|verbindlich buchen|kauf abschlie|jetzt zahlen/i;
const SUBMIT_OK = /abfrag|abruf|prüf|anzeig|such|finden|weiter|status|bestellen|warenkorb|zeigen|code/i;
const SICHTBAR = 'a:visible, button:visible, [role=button]:visible, [role=link]:visible, [role=radio]:visible, [role=option]:visible';
const KOSTEN = /€|kostenlos|kostet|Kosten|Preis|Gebühr|unverbindlich|Anzahlung|Pauschale/i;

// Erfundene Testbilddatei (PNG, ohne Abhängigkeiten)
const CRC = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (b) => { let c = 0xffffffff; for (const x of b) c = CRC[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (typ, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(typ, 'ascii'), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
function pngBauen() {
  const w = 120, h = 80, s = 1 + w * 3; const raw = Buffer.alloc(h * s);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = y * s + 1 + x * 3; raw[o] = (x * 2) & 255; raw[o + 1] = 120; raw[o + 2] = (200 - y * 2) & 255; }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const PNG = path.join(PROT, 'testbild-erfunden.png');
writeFileSync(PNG, pngBauen());

const pfad = (c) => new URL(c.p.url()).pathname;
const schnitt = (t, n = 300) => (t || '').replace(/\s+/g, ' ').trim().slice(0, n);
const ereignis = (c, art, text) => c.L.stolpersteine.push({ art, text, seite: pfad(c) });

async function bild(c, name) {
  c.bildNr += 1;
  const datei = path.join(BILD, `${c.L.id}-${String(c.bildNr).padStart(2, '0')}-${name}.jpg`);
  await c.p.screenshot({ path: datei, type: 'jpeg', quality: 55 }).catch(() => {});
  return path.relative(PROT, datei);
}

async function seiteErfassen(c) {
  const p = c.p;
  await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  const i = await p.evaluate(() => {
    const main = (document.querySelector('main') || document.body).innerText;
    const h1 = document.querySelector('h1')?.innerText ?? null;
    const erster = [...document.querySelectorAll('main p, p')].map((e) => e.innerText.trim()).find((t) => t.length > 30) ?? null;
    const anruf = [...document.querySelectorAll('a, button')].filter((e) => e.offsetParent && (/Rückruf|Anrufen/i.test(e.innerText || '') || (e.getAttribute('href') || '').startsWith('tel:')))
      .map((e) => { const b = e.getBoundingClientRect(); return { text: (e.innerText || e.getAttribute('href') || '').trim().slice(0, 40), ohneScrollen: b.top >= 0 && b.bottom <= innerHeight }; });
    const eingabe = [...document.querySelectorAll('input:not([type=hidden]),textarea,select')].some((e) => e.offsetParent && !e.closest('header') && e.name !== 'website');
    return { h1, main, erster, anruf, eingabe };
  });
  if (i.eingabe && c.L.tippsBisEingabe === null) c.L.tippsBisEingabe = c.tipps;
  c.L.seiten.push({ pfad: pfad(c), h1: schnitt(i.h1, 120), erster: schnitt(i.erster, 260), kostenGenannt: KOSTEN.test(i.main), anruf: { vorhanden: i.anruf.length > 0, ohneScrollen: i.anruf.some((a) => a.ohneScrollen) }, eingabe: i.eingabe, text: i.main.slice(0, 2500) });
}

async function pruefeEingabe(c) {
  const ja = await c.p.evaluate(() => [...document.querySelectorAll('input:not([type=hidden]),textarea,select')].some((e) => e.offsetParent && !e.closest('header') && e.name !== 'website'));
  if (ja && c.L.tippsBisEingabe === null) c.L.tippsBisEingabe = c.tipps;
}

async function klick(c, rx, { fallback = null } = {}) {
  const p = c.p;
  const t0 = Date.now();
  for (let versuch = 0; versuch < 2; versuch++) {
    const loc = p.locator(SICHTBAR).filter({ hasText: rx });
    try { await loc.first().waitFor({ state: 'visible', timeout: versuch === 0 ? 5000 : 2500 }); } catch { /* weiter */ }
    if (await loc.count()) {
      const el = loc.first();
      const txt = schnitt(await el.innerText().catch(() => ''), 80);
      const typ = await el.evaluate((e) => e.getAttribute('type') || '').catch(() => '');
      if (VERBOTEN.test(txt) || (typ === 'submit' && !SUBMIT_OK.test(txt))) {
        ereignis(c, 'verweigert', `Klick auf „${txt}“ vom Probelauf nicht ausgeführt (Absendeschutz)`);
        c.L.bilder.push(await bild(c, 'verweigert'));
        return false;
      }
      if (Date.now() - t0 > 5000) { ereignis(c, 'zoegern', `Weg „${txt}“ brauchte über 5 s bis zur Sichtbarkeit`); c.L.bilder.push(await bild(c, 'zoegern')); }
      const vorher = p.url();
      try {
        await el.click({ timeout: 10000 });
      } catch (e) {
        ereignis(c, 'blockiert', `Weg „${txt}“ zunächst nicht anklickbar (offenes Menü verdeckt ihn), Menü wird geschlossen: ${schnitt(e.message.split('\n').find((z) => /intercepts|outside|not visible|another element|covered|subtree/.test(z)) || e.message, 160)}`);
        c.L.bilder.push(await bild(c, 'blockiert'));
        const schliessen = p.locator('button:visible').filter({ hasText: /Menü schließen|Schließen/ }).first();
        if (await schliessen.count()) await schliessen.click().catch(() => {}); else await p.keyboard.press('Escape').catch(() => {});
        c.tipps += 1;
        await p.waitForTimeout(500);
        if (await el.click({ timeout: 8000 }).then(() => true).catch(() => false)) {
          c.tipps += 1; c.L.schritte.push({ tipp: c.tipps, knopf: txt, von: pfad(c), nachMenue: true });
          await p.waitForTimeout(300);
          if (p.url() !== vorher) await seiteErfassen(c); else await p.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
          return true;
        }
        if (fallback) { await p.goto(BASIS_URL + fallback, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {}); ereignis(c, 'direkt', `Seite ${fallback} über die Adresse aufgerufen, kein Tipp gezählt`); await seiteErfassen(c); }
        return false;
      }
      c.tipps += 1;
      c.L.schritte.push({ tipp: c.tipps, knopf: txt, von: pfad(c) });
      await p.waitForTimeout(300);
      if (p.url() !== vorher) await seiteErfassen(c); else await p.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      await pruefeEingabe(c);
      return true;
    }
    if (versuch === 0) {
      const menu = p.locator('button:visible').filter({ hasText: /Menü öffnen/ });
      if (await menu.count()) { ereignis(c, 'menue', 'Menü musste erst geöffnet werden, bevor der Weg sichtbar war'); const ok = await menu.first().click({ timeout: 3000 }).then(() => true).catch(() => false); if (!ok) { await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300); } c.tipps += 1; await p.waitForTimeout(400); continue; }
    }
    break;
  }
  ereignis(c, 'nicht_gefunden', `Kein sichtbarer Weg für ${rx}`);
  c.L.bilder.push(await bild(c, 'nicht-gefunden'));
  if (fallback) {
    await p.goto(BASIS_URL + fallback, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
    ereignis(c, 'direkt', `Seite ${fallback} über die Adresse aufgerufen (kein sichtbarer Weg), kein Tipp gezählt`);
    await seiteErfassen(c);
  }
  return false;
}

async function klickFormular(c, rx) {
  const loc = c.p.locator('main button:visible, form button:visible, form [type=submit]:visible').filter({ hasText: rx });
  if (!(await loc.count())) return false;
  const el = loc.first();
  const txt = schnitt(await el.innerText().catch(() => ''), 80);
  if (VERBOTEN.test(txt) || !SUBMIT_OK.test(txt)) { ereignis(c, 'verweigert', `Formularknopf „${txt}“ nicht gedrückt (Absendeschutz)`); return false; }
  await el.click({ timeout: 10000 });
  c.tipps += 1;
  c.L.schritte.push({ tipp: c.tipps, knopf: txt, von: pfad(c), formularSchritt: true });
  await c.p.waitForTimeout(800);
  await c.p.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  return true;
}

// Eingabefeld über Beschriftung oder Platzhalter; Honigtopf („website“) wird nie befüllt.
async function feld(c, rx) {
  for (const basis of [c.p.getByLabel(rx), c.p.getByPlaceholder(rx)]) {
    const n = Math.min(await basis.count().catch(() => 0), 6);
    for (let i = 0; i < n; i += 1) {
      const l = basis.nth(i);
      const ok = await l.evaluate((e) => ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.tagName) && e.name !== 'website' && !!e.offsetParent && !e.closest('header')).catch(() => false);
      if (ok) return l;
    }
  }
  return null;
}

async function fuell(c, rx, wert) {
  const el = await feld(c, rx);
  if (!el) return false;
  const tag = await el.evaluate((e) => e.tagName + ':' + (e.type || '')).catch(() => '');
  if (tag.startsWith('SELECT')) {
    const opts = await el.locator('option').allTextContents();
    const gueltig = opts.map((o) => o.trim()).filter((o) => o && !/^(bitte|--|auswählen)/i.test(o));
    const treffer = gueltig.find((o) => new RegExp(wert, 'i').test(o)) ?? gueltig[0];
    if (treffer) { await el.selectOption({ label: treffer }).catch(() => {}); c.L.befunde.auswahl = [...(c.L.befunde.auswahl || []), `${schnitt(String(rx.source), 30)} = ${treffer}`]; }
  } else if (tag === 'INPUT:checkbox') await el.check().catch(() => {});
  else if (tag === 'INPUT:file') await el.setInputFiles(PNG).catch((e) => ereignis(c, 'fehler', `Foto: ${e.message.slice(0, 80)}`));
  else await el.fill(wert).catch((e) => ereignis(c, 'fehler', `Eingabe ${rx.source}: ${e.message.slice(0, 80)}`));
  await pruefeEingabe(c);
  return true;
}

// Pflichtfelder (Beschriftung mit „Pflichtangabe“ oder required) mit erfundenen Werten füllen; Ergebnis je Feld protokolliert.
const PFLICHT_WERTE = [
  [/Firma|Betrieb/i, 'Testbetrieb Musterstadt'], [/Nachname/i, 'Testkundin'], [/Vorname|Ihr Name|^Name/i, 'Erika'],
  [/e-?mail/i, 'test@example.invalid'], [/Telefon|Rufnummer|Handy/i, '0000 000000'], [/PLZ|Postleitzahl/i, '12345'],
  [/^Ort\b|Stadt/i, 'Musterstadt'], [/Stra(ß|ss)e/i, 'Musterweg 1'], [/Vorgang|Auftrag/i, TERMIN],
  [/Anzahl|Türen|Stück/i, '20'], [/Anliegen|Nachricht|Was ist|Text|Beschreibung|Thema/i, TEXT],
];
async function pflichtFuellen(c) {
  const leer = await c.p.evaluate(() => {
    const lab = (e) => (e.id && document.querySelector('label[for="' + CSS.escape(e.id) + '"]')?.innerText) || e.closest('label')?.innerText || e.getAttribute('aria-label') || e.placeholder || '';
    return [...document.querySelectorAll('main input, main textarea, main select')]
      .filter((e) => e.offsetParent && !e.disabled && e.name !== 'website' && !['hidden', 'file', 'checkbox', 'radio'].includes(e.type) && !e.value && (e.required || /Pflichtangabe/.test(lab(e))))
      .map((e, i) => ({ i, label: lab(e).replace(/\s+/g, ' ').trim().slice(0, 60), tag: e.tagName, typ: e.type, id: e.id }));
  });
  const gefuellt = [];
  for (const z of leer) {
    if (/Kilometer|Radius|Entfernung/i.test(z.label)) { await c.p.locator(`main [id="${z.id}"]`).first().fill('30').catch(() => {}); gefuellt.push(z.label + ' = 30'); continue; }
    const el = c.p.locator(`main [id="${z.id}"]`).first();
    if (z.tag === 'SELECT') { await el.selectOption({ index: 1 }).catch(() => {}); gefuellt.push(z.label + ' = Option 2'); continue; }
    const regel = PFLICHT_WERTE.find(([rx]) => rx.test(z.label));
    const wert = regel ? regel[1] : 'Testangabe';
    if (z.typ === 'email' || /e-?mail/i.test(z.label)) await el.fill('test@example.invalid').catch(() => {});
    else await el.fill(wert).catch(() => {});
    gefuellt.push(z.label + ' = ' + (regel ? 'erfundener Wert' : 'Testangabe'));
  }
  // Pflicht-Auswahlgruppe (Radio ohne Vorauswahl): erste sichtbare Option, protokolliert
  if (!(await c.p.locator('main input[type=radio]:checked').count()) && (await c.p.locator('main label:has(input[type=radio]):visible').count())) {
    const alle = c.p.locator('main label:has(input[type=radio]):visible');
    const vorliebe = c.radioVorliebe ? alle.filter({ hasText: c.radioVorliebe }) : null;
    const r = vorliebe && (await vorliebe.count()) ? vorliebe.first() : alle.first();
    gefuellt.push('Auswahlgruppe ohne Vorauswahl = ' + schnitt(await r.innerText(), 50));
    await r.click().catch(() => {});
  }
  if (gefuellt.length) c.L.befunde.pflichtfelder = [...(c.L.befunde.pflichtfelder || []), ...gefuellt];
  await pruefeEingabe(c);
}

// Mehrstufiges Formular: auf jedem Schritt befüllen, Pflichtfelder ergänzen, „Weiter“ drücken; auf dem letzten Schritt anhalten.
async function formular(c, paare, zustimm = ZUSTIMM, { weitere = [] } = {}) {
  const gefunden = new Set();
  for (let schritt = 1; schritt <= 5; schritt += 1) {
    for (const [rx, wert] of [...paare, ...weitere]) if (!gefunden.has(rx.source) && await fuell(c, rx, wert)) gefunden.add(rx.source);
    for (const rx of zustimm) { const el = await feld(c, rx); if (el) { await el.check().catch(() => {}); gefunden.add(rx.source); } }
    await pflichtFuellen(c);
    for (const [rx] of paare) { if (gefunden.has(rx.source)) continue; const el = await feld(c, rx); if (el && (await el.inputValue().catch(() => ''))) gefunden.add(rx.source); }
    const weiter = c.p.locator('main button:visible, form button:visible').filter({ hasText: /^\s*Weiter\s*$/ }).first();
    if (!(await weiter.count())) break;
    if (await weiter.isDisabled()) {
      // Leere Textfelder ohne Pflichtmarkierung: einmal mit Testtext füllen, danach erneut prüfen
      const leereTexte = c.p.locator('main textarea:visible').filter({ hasNot: c.p.locator('xpath=self::*[string-length(normalize-space(.))>0]') });
      const n = await c.p.locator('main textarea:visible').evaluateAll((els) => els.filter((e) => !e.value && e.name !== 'website').length);
      if (n) { await c.p.locator('main textarea:visible').evaluateAll((els) => els.forEach((e) => { if (!e.value && e.name !== 'website') e.dispatchEvent(new Event('focus')); })); for (const t of await c.p.locator('main textarea:visible').all()) { if (!(await t.inputValue())) await t.fill(TEXT).catch(() => {}); } c.L.befunde[`leere_textfelder_schritt_${schritt}`] = n; }
      if (n && !(await weiter.isDisabled())) { c.L.formularSchritte = (c.L.formularSchritte || 0) + 1; await klickFormular(c, /^\s*Weiter\s*$/); c.letzterKnopf = 'Weiter'; continue; }
      ereignis(c, 'weiter_gesperrt', `„Weiter“ bleibt auf Schritt ${schritt} deaktiviert, obwohl die sichtbaren Pflichtfelder gefüllt sind`);
      c.L.bilder.push(await bild(c, 'weiter-gesperrt'));
      c.L.befunde[`steuerelemente_schritt_${schritt}_${pfad(c)}`] = await c.p.evaluate(() => {
        const lab = (e) => (e.id && document.querySelector('label[for="' + CSS.escape(e.id) + '"]')?.innerText) || e.closest('label')?.innerText || e.getAttribute('aria-label') || e.placeholder || '';
        return [...document.querySelectorAll('main input, main textarea, main select, main button')].filter((e) => e.offsetParent && e.type !== 'hidden' && e.name !== 'website').map((e) => `${e.tagName}/${e.type || ''} req=${e.required} leer=${!e.value} an=${!!e.checked} dis=${!!e.disabled} | ${(lab(e) || e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70)}`).slice(0, 40);
      });
      break;
    }
    c.L.formularSchritte = (c.L.formularSchritte || 0) + 1;
    await klickFormular(c, /^\s*Weiter\s*$/);
    c.letzterKnopf = 'Weiter';
  }
  for (const [rx] of paare) if (!gefunden.has(rx.source)) ereignis(c, 'feld_fehlt', `Feld ${rx.source} auf keinem Schritt gefunden`);
  c.L.letzterKnopf = await c.p.locator('main button:visible, form button:visible').allTextContents().then((t) => t.map((x) => schnitt(x, 40)).filter((x) => /absenden|senden|anfrage|weiter|rückruf/i.test(x)));
  c.L.befunde[`letzterSchritt_${c.L.stopps.length + 1}`] = c.L.letzterKnopf;
}

async function ankreuzen(c, rx) { const el = await feld(c, rx); if (el) await el.check().catch(() => {}); }

async function stopp(c, grund) {
  c.L.stopps.push({ grund, seite: pfad(c), bild: await bild(c, 'stopp') });
}

async function befund(c, label, rx) {
  const t = await c.p.locator('main').innerText().catch(() => '');
  c.L.befunde[label] = t.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => rx.test(s)).slice(0, 6).map((s) => schnitt(s, 240));
}

// Autoschlüssel-Assistent: Auswahl je Schritt (erste Option, Auswahl 2 bei Liste), dann „Weiter“. Nie Zahlung, nie Knöpfe außerhalb.
async function assistent(c) {
  const p = c.p;
  c.L.befunde.assistent = [];
  for (let i = 0; i < 14; i += 1) {
    const text = await p.locator('main').innerText().catch(() => '');
    if (/Fotos hochladen|Foto aufnehmen/.test(text) && (await p.locator('main input[type=file]').count()) && !c.L.befunde.assistent.includes('Foto hochgeladen')) {
      await p.locator('main input[type=file]').first().setInputFiles(PNG).catch(() => {}); c.tipps += 1; c.L.befunde.assistent.push('Foto hochgeladen (erfundene Testdatei)');
      await p.waitForTimeout(800);
    }
    if (/(?<!An)Zahlung|bezahlen|Kreditkarte|Lastschrift|jetzt zahlen/i.test(text)) { ereignis(c, 'stopp', 'Assistent: Zahlungsschritt erreicht, nicht weiter'); break; }
    if (!(await p.locator('main label:has(input[type=radio]):visible').count()) && (await p.locator('main button:visible').filter({ hasText: /Marke wählen/i }).count())) {
      await p.locator('main button:visible').filter({ hasText: /Marke wählen/i }).first().click().catch(() => {}); c.tipps += 1; c.L.befunde.assistent.push('Marke wählen (Liste öffnen)');
    }
    if (!(await p.locator('main input[type=radio]:checked').count()) && (await p.locator('main label:has(input[type=radio]):visible').count())) {
      const r = p.locator('main label:has(input[type=radio]):visible').first();
      const t = schnitt(await r.innerText(), 50); await r.click(); c.tipps += 1; c.L.befunde.assistent.push(t);
    } else if (await p.locator('main select:visible').count()) {
      const s = p.locator('main select:visible').first();
      if (!(await s.evaluate((e) => e.value))) { await s.selectOption({ index: 1 }).catch(() => {}); c.tipps += 1; c.L.befunde.assistent.push('Auswahl Liste, Option 2'); }
    }
    const weiter = p.locator('main button:visible, form button:visible').filter({ hasText: /^\s*Weiter\s*$/ }).first();
    if (!(await weiter.count())) break;
    await weiter.click({ timeout: 8000 }).catch(() => {});
    c.tipps += 1; c.L.befunde.assistent.push('Weiter');
    await p.waitForTimeout(500); await p.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  }
  c.L.befunde.assistentEnde = schnitt(await p.locator('main').innerText().catch(() => ''), 900);
  c.L.bilder.push(await bild(c, 'assistent'));
  await seiteErfassen(c);
}

async function terminstatus(c) {
  await klick(c, /^Terminstatus$/, { fallback: '/service-und-termin/terminstatus' });
  await fuell(c, /Vorgangsnummer|Nummer|Auftrag/i, TERMIN);
  await fuell(c, /e-?mail/i, 'test@example.invalid');
  const ok = await klickFormular(c, /abrufen|abfrag|prüf|anzeig|status|zeigen/i);
  await c.p.waitForTimeout(800);
  c.L.befunde.terminstatus = (await c.p.locator('main').innerText().catch(() => '')).slice(0, 1200);
  c.L.befunde.terminstatusAbgesendet = ok;
  c.L.bilder.push(await bild(c, 'terminstatus'));
}

async function rentnerin(c) {
  c.radioVorliebe = /Weiß ich nicht/;
  await klick(c, /Schlüssel nach Foto/, { fallback: '/schluessel-nach-vorlage' });
  await klick(c, /Schlüssel einschicken/, { fallback: '/schluessel-einschicken' });
  await klick(c, /Einsendung anmelden/, { fallback: '/schluessel-einschicken/anmelden' });
  await formular(c, PERSON);
  await stopp(c, 'Einsendung-Anmeldung bis vor Absenden');
  await klick(c, /^Beratung$/, { fallback: '/beratung' });
  await formular(c, PERSON, ZUSTIMM, { weitere: [[/Thema|Anliegen|Art/i, 'Rückruf|Beratung|Schlüssel'], [/Ihr Anliegen|Nachricht|Was ist/i, TEXT]] });
  await stopp(c, 'Beratung mit Rückruf bis vor Absenden');
  await terminstatus(c);
}

async function eilige(c) {
  await klick(c, /^Autoschlüssel$/, { fallback: '/autoschluessel' });
  await klick(c, /Autoschlüssel-Termin anfragen/, { fallback: '/autoschluessel/anfrage' });
  await assistent(c);
  await klick(c, /^Motorradschlüssel$/, { fallback: '/motorradschluessel' });
  await befund(c, 'motorrad', /Anfrage|Rückfrage|Prüfung|warum|weil|Vorlauf|Angebot|Foto/i);
  await klick(c, /SCHLÜSSELMACHER/, { fallback: '/' });
  await klick(c, /^Schlüsselgehäuse$/, { fallback: '/autoschluessel/gehaeuse' });
  await befund(c, 'gehaeuse', /Anfrage|Rückfrage|Prüfung|warum|weil|Vorlauf|Angebot|Foto/i);
  await klick(c, /^Schlüssel nach Code$/, { fallback: '/schluessel-nach-code' });
  await fuell(c, /Suche|Code|Anwendung/i, '0812');
  await c.p.waitForTimeout(800);
  await klick(c, /Nach Code bestellen\s*:/, { fallback: null });
  await klick(c, /In den Warenkorb/, { fallback: null });
  await klick(c, /Warenkorb/, { fallback: '/warenkorb' });
  await befund(c, 'warenkorb', /Warenkorb|Kasse|Anzahl|Summe|leer|Gesamt|Menge/i);
  await stopp(c, 'Warenkorb, nicht zur Kasse');
  await terminstatus(c);
}

async function verwalterin(c) {
  await klick(c, /Schlüsseldienst vor Ort/, { fallback: '/service-und-termin/vor-ort' });
  await klick(c, /Einsatz anfragen/, { fallback: null });
  await formular(c, PERSON, ZUSTIMM, { weitere: [[/Anliegen|Leistung|Art/i, 'Zylinder|Schloss|Tausch'], [/Was ist zu tun/i, 'Zylindertausch an 20 Türen, erfundene Angaben.']] });
  await stopp(c, 'Einsatz-Anfrage Zylindertausch bis vor Absenden');
  await klick(c, /^Kontakt$/, { fallback: '/service-und-termin/kontakt' });
  await fuell(c, /Datei auswählen/, PNG);
  await formular(c, PERSON, ZUSTIMM, { weitere: [[/Anliegen/i, 'Sonstiges|Frage|Termin'], [/Ihre Nachricht|Nachricht/i, TEXT]] });
  await stopp(c, 'Kontakt mit Foto bis vor Absenden');
  await terminstatus(c);
}

async function partner(c) {
  await klick(c, /Partner werden/, { fallback: '/partner-werden' });
  await befund(c, 'partnerseite', /Partner|Auftrag|Provision|Vermittlung|verdien|garantier|Umsatz|Kunde/i);
  await formular(c, [[/Firmenname|Firma|Betrieb/i, 'Testbetrieb Musterstadt'], ...PERSON], ZUSTIMM, { weitere: [[/Nachricht|Anliegen/i, TEXT], [/Datei auswählen/i, PNG]] });
  await stopp(c, 'Partneranfrage bis vor Absenden');
  await klick(c, /Schlüsseldienst vor Ort/, { fallback: '/service-und-termin/vor-ort' });
  await befund(c, 'vorOrtPartner', /Partner/i);
  await terminstatus(c);
}

const PERSONEN = [
  { id: 'rentnerin', name: 'Frau Testrentnerin', ablauf: rentnerin, erwartet: 2 },
  { id: 'eilige', name: 'Herr Testeilig', ablauf: eilige, erwartet: 1 },
  { id: 'verwalterin', name: 'Frau Testverwalterin', ablauf: verwalterin, erwartet: 2 },
  { id: 'partner', name: 'Herr Testpartner', ablauf: partner, erwartet: 1 },
];
const GERAETE_LAUF = [GERAETE.find((g) => g.id === 'mobil'), GERAETE.find((g) => g.id === 'desktop')];
const FORM_ART = ['post-sonstig', 'upload', 'action-schreibend', 'action-unbekannt'];
const NUR = process.env.E6_NUR ? process.env.E6_NUR.split(',') : null;

const browser = await browserStarten();
const alle = [];
for (const persona of PERSONEN) {
  for (const geraet of GERAETE_LAUF) {
    const id = `${persona.id}-${geraet.id}`;
    if (NUR && !NUR.includes(id)) continue;
    const ctx = await kontextFuer(browser, geraet);
    const abgefangen = await attrappenSetzen(ctx);
    const p = await ctx.newPage();
    const c = { p, tipps: 0, bildNr: 0, letzterKnopf: null, L: { id, persona: persona.name, geraet: `${geraet.id} ${geraet.breite}×${geraet.hoehe}`, tippsBisEingabe: null, tippsBisZiel: 0, schritte: [], seiten: [], stolpersteine: [], stopps: [], befunde: {}, konsole: [], bilder: [], posts: [], fehler: null } };
    p.on('console', (m) => { if (m.type() === 'error') c.L.konsole.push(schnitt(m.text(), 160)); });
    p.on('pageerror', (e) => c.L.konsole.push('Seitenfehler: ' + schnitt(e.message, 160)));
    p.on('request', (r) => {
      if (r.method() !== 'GET' && r.url().startsWith(BASIS_URL)) c.L.posts.push({ seite: pfad(c), url: new URL(r.url()).pathname, aktion: Boolean(r.headers()['next-action']), laenge: (r.postData() || '').length, kopf: (r.postData() || '').slice(0, 40).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '<mail>'), nachKnopf: c.letzterKnopf });
    });
    const t0 = Date.now();
    try {
      await laden(p, '/');
      await seiteErfassen(c);
      await persona.ablauf(c);
    } catch (e) {
      c.L.fehler = schnitt(e.message, 300);
      c.L.bilder.push(await bild(c, 'fehler'));
    }
    c.L.ms = Date.now() - t0;
    c.L.tippsBisZiel = c.tipps;
    c.L.zielErreicht = c.L.stopps.length >= persona.erwartet && !c.L.fehler;
    c.L.abgefangen = abgefangen.filter((a) => a.art !== 'fremd');
    c.L.fremdAbgebrochen = abgefangen.filter((a) => a.art === 'fremd').length;
    c.L.formularSendungen = abgefangen.filter((a) => FORM_ART.includes(a.art));
    c.L.konsole = [...new Set(c.L.konsole)];
    writeFileSync(path.join(PROT, `lauf-${id}.json`), JSON.stringify(c.L, null, 2));
    alle.push(c.L);
    await ctx.close();
    console.log(`${id} ${c.L.ms}ms Eingabe=${c.L.tippsBisEingabe} Ziel=${c.L.tippsBisZiel} Stopps=${c.L.stopps.length} zielOK=${c.L.zielErreicht} Stolper=${c.L.stolpersteine.length} POST=${c.L.posts.length} fremd=${c.L.fremdAbgebrochen} Fehler=${c.L.fehler ?? '-'}`);
  }
}
await browser.close();
writeFileSync(path.join(PROT, 'zusammenfassung.json'), JSON.stringify(alle.map((l) => ({ id: l.id, persona: l.persona, geraet: l.geraet, ms: l.ms, tippsBisEingabe: l.tippsBisEingabe, tippsBisZiel: l.tippsBisZiel, zielErreicht: l.zielErreicht, stopps: l.stopps.map((s) => s.grund), stolpersteine: l.stolpersteine, posts: l.posts, abgefangen: l.abgefangen, fremdAbgebrochen: l.fremdAbgebrochen, konsole: l.konsole, fehler: l.fehler, befunde: l.befunde, schritte: l.schritte.length })), null, 2));
console.log('FERTIG');
