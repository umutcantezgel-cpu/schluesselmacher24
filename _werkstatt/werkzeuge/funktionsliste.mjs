#!/usr/bin/env node
// funktionsliste.mjs – prüft die Funktionen F-01 bis F-14 aus _werkstatt/LAGEBILD.md im Browser.
// Aufruf: node _werkstatt/werkzeuge/funktionsliste.mjs [--nur F-01,F-04] [--json <datei>]
// Je Funktion: eigene Kontexte (kontextFuer), Zeitlimit 60 s, Fehler einer Funktion beenden das Skript nicht.
// Schreibende Anfragen fängt attrappenSetzen() aus lib.mjs ab; Formulare tragen PRUEF_EMAIL.
// Optional SM24_SCHRITTBILDER=<Ordner>: ein Bild je Ablaufschritt (Beleg der Darstellung, schreibt nichts ins Repo).
// Wartet vor dem Start, solange /tmp/sm24-messfenster.lock existiert (höchstens 40 min).
// Exit: 0 fertig (auch mit NICHT BESTANDEN), 2 Bedienfehler, 1 technischer Fehler.
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { deflateSync } from 'node:zlib';
import {
  REPO, BASIS_URL, GERAETE, PROTOKOLLE, PRUEF_EMAIL, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, zeitstempel, ordner,
} from './lib.mjs';

const SPERRE = '/tmp/sm24-messfenster.lock';
// Server-Log und Vorgangsdatei des geprüften Stands; über Umgebungsvariablen anpassbar (Ausgangswert: E0-Server auf 3100).
const SERVERLOG = process.env.SM24_SERVERLOG ?? '/tmp/sm24-next.log';
const RECORDS = process.env.SM24_RECORDS ?? path.join(REPO, 'content', 'records.json');
const FOTO = '/tmp/sm24-funktionsliste-foto.png';
const ZEITLIMIT_MS = 60_000;
const SPERRE_MAX_MS = 40 * 60_000;
const SPERRE_PRUEF_MS = 2 * 60_000;

const FREIWILLIG = /freiwillig/i;
const ZUSTIMMUNG = /zur Kenntnis|einverstanden|bestätig|akzeptier|Ich habe|Ich bin|Ich stimme|zustimm|Mir ist bekannt|gelesen|verstanden/i;

class Zeitlimit extends Error {}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wartet, bis die Bedingung wahr wird; gibt false zurück, wenn die Zeit abläuft. */
async function warteBis(bedingung, ms = 6000, schritt = 200) {
  const ende = Date.now() + ms;
  while (Date.now() < ende) {
    try { if (await bedingung()) return true; } catch { /* noch nicht bereit */ }
    await pause(schritt);
  }
  return false;
}

/** „16,00 €“ → 1600 */
function euroZuCent(text) {
  const m = /(-?\d{1,3}(?:\.\d{3})*,\d{2}|-?\d+,\d{2})\s*€/.exec(text ?? '');
  if (!m) return null;
  return Math.round(parseFloat(m[1].replace(/\./g, '').replace(',', '.')) * 100);
}
const centText = (c) => (c === null ? '–' : `${(c / 100).toFixed(2).replace('.', ',')} €`);

async function dlWerte(page) {
  return page.evaluate(() => {
    const out = {};
    for (const dt of document.querySelectorAll('dt')) {
      const dd = dt.nextElementSibling;
      if (dd && dd.tagName === 'DD') out[dt.textContent.trim()] = dd.textContent.trim();
    }
    return out;
  });
}

function summeWerte(dl) {
  const finde = (vorn) => {
    const k = Object.keys(dl).find((schluessel) => schluessel.startsWith(vorn));
    return k ? euroZuCent(dl[k]) : null;
  };
  return { zwischen: finde('Zwischensumme'), versand: finde('Versand'), gesamt: finde('Gesamtsumme') };
}

async function hauptText(page) {
  return page.evaluate(() => document.querySelector('main')?.innerText ?? '');
}

/* ---------- Prüfbild für den Foto-Upload (PNG, ohne Fremdbibliothek) ---------- */

const CRC_TABELLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABELLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(typ, daten) {
  const laenge = Buffer.alloc(4);
  laenge.writeUInt32BE(daten.length);
  const td = Buffer.concat([Buffer.from(typ, 'ascii'), daten]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([laenge, td, crc]);
}
function pngSchreiben(datei) {
  const b = 200;
  const h = 200;
  const roh = Buffer.alloc((1 + b * 3) * h);
  for (let y = 0; y < h; y += 1) {
    const o = y * (1 + b * 3);
    for (let x = 0; x < b; x += 1) {
      const p = o + 1 + x * 3;
      roh[p] = Math.floor((x * 255) / b);
      roh[p + 1] = Math.floor((y * 255) / h);
      roh[p + 2] = 128;
    }
  }
  const kopf = Buffer.alloc(13);
  kopf.writeUInt32BE(b, 0);
  kopf.writeUInt32BE(h, 4);
  kopf[8] = 8;
  kopf[9] = 2;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', kopf),
    chunk('IDAT', deflateSync(roh)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  writeFileSync(datei, png);
}

/* ---------- Formularfelder: erfassen, füllen, weiterschalten ---------- */

/** Läuft im Browser: beschreibt alle Eingabefelder in <main> und markiert sie mit data-sm24-idx. */
function beschreibeFelder() {
  const main = document.querySelector('main') || document.body;
  const ergebnis = [];
  [...main.querySelectorAll('input, select, textarea')].forEach((el, i) => {
    const typ = (el.type || el.tagName.toLowerCase()).toLowerCase();
    if (['hidden', 'submit', 'button', 'reset', 'image'].includes(typ)) return;
    if (el.disabled) return;
    el.setAttribute('data-sm24-idx', String(i));
    let label = '';
    if (el.labels && el.labels.length) label = [...el.labels].map((l) => l.textContent).join(' ');
    if (!label) label = el.getAttribute('aria-label') || '';
    if (!label && el.getAttribute('aria-labelledby')) {
      label = el.getAttribute('aria-labelledby').split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent || '').join(' ');
    }
    if (!label) {
      const eltern = el.closest('label');
      if (eltern) label = eltern.textContent;
    }
    if (!label) {
      const gruppe = el.closest('fieldset');
      if (gruppe) label = gruppe.querySelector('legend')?.textContent || '';
    }
    label = label.replace(/\s+/g, ' ').trim();
    ergebnis.push({
      idx: i,
      tag: el.tagName,
      typ,
      name: el.name || '',
      label,
      wert: el.value ?? '',
      checked: !!el.checked,
      capture: el.hasAttribute('capture'),
      min: el.getAttribute('min'),
      dateien: el.files ? el.files.length : 0,
      optionen: el.tagName === 'SELECT'
        ? [...el.options].map((o) => ({ wert: o.value, text: o.textContent.trim(), disabled: o.disabled }))
        : null,
    });
  });
  return ergebnis;
}

function wertFuer(f, emailWert) {
  const l = f.label;
  if (FREIWILLIG.test(l)) return null;
  if (/anrede|firma|fahrgestell|\bFIN\b|suche|nachricht|hinweis|bemerkung|kommentar/i.test(l)) return null;
  if (f.typ === 'email' || /^e-mail/i.test(l)) return emailWert;
  if (f.typ === 'tel' || /telefon/i.test(l)) return '030 1234567';
  if (/vorname/i.test(l)) return 'Erika';
  if (/nachname/i.test(l)) return 'Mustermann';
  if (/straße/i.test(l)) return 'Musterstraße 1';
  if (/postleitzahl|^plz/i.test(l)) return '10115';
  if (/^ort\b/i.test(l)) return 'Berlin';
  if (/^land\b/i.test(l)) return 'Deutschland';
  if (/baujahr|erstzulassung/i.test(l)) return '2015';
  if (/modell/i.test(l)) return 'Golf';
  if (/code/i.test(l)) return '0812';
  if (f.typ === 'date') return '2015-03-01';
  if (f.typ === 'number' || f.typ === 'range') return f.min ?? '1';
  if (f.tag === 'TEXTAREA') return 'Prüfeingabe für den Funktionstest. Die Angabe ist vollständig und nachvollziehbar.';
  if (f.typ === 'text' || f.typ === '') return 'Prüfeingabe';
  return null;
}

async function warteAufUploads(page) {
  await warteBis(async () => {
    const weiter = page.getByRole('button', { name: 'Weiter', exact: true });
    return (await weiter.count()) === 0 || (await weiter.first().isEnabled());
  }, 15000, 300);
}

/** Füllt alle leeren Pflichtfelder sichtbar im <main>. stufe 2: zusätzlich eine Auswahl je Gruppe. */
/**
 * Aktiviert ein Auswahlfeld per DOM-Klick auf den Eingang selbst. Ein Zeigerklick träfe in den Auswahlkarten
 * oft einen Link oder Rahmen daneben (dann navigiert die Seite weg), darum kein check() mit Mausklick.
 */
async function aktivieren(loc) {
  try {
    await loc.dispatchEvent('click', undefined, { timeout: 4000 });
  } catch { /* nicht vorhanden oder nicht bedienbar */ }
  return loc.isChecked().catch(() => false);
}

let letzteFehler = [];
/** Letzter Schritt eines Ablaufs, damit ein Zeitlimit nennen kann, wo es hängt. */
let zuletzt = '';

async function felderFuellen(page, { emailWert, stufe }) {
  letzteFehler = [];
  const felder = await page.evaluate(beschreibeFelder);
  const sel = (f) => page.locator(`[data-sm24-idx="${f.idx}"]`);
  let gesetzt = 0;
  let datei = false;

  const radioGruppen = new Map();
  const cbGruppen = new Map();
  for (const f of felder) {
    if (f.typ === 'radio' && f.name) radioGruppen.set(f.name, [...(radioGruppen.get(f.name) ?? []), f]);
    if (f.typ === 'checkbox' && f.name) cbGruppen.set(f.name, [...(cbGruppen.get(f.name) ?? []), f]);
  }
  for (const gruppen of [radioGruppen, ...(stufe === 2 ? [cbGruppen] : [])]) {
    for (const mitglieder of gruppen.values()) {
      if (mitglieder.some((m) => m.checked)) continue;
      if (await aktivieren(sel(mitglieder[0]))) gesetzt += 1;
    }
  }

  for (const f of felder) {
    try {
      if (f.typ === 'file') {
        if (!f.capture && f.dateien === 0) {
          await sel(f).setInputFiles(FOTO);
          gesetzt += 1;
          datei = true;
        }
      } else if (f.typ === 'radio') {
        continue;
      } else if (f.typ === 'checkbox') {
        if (!f.checked && ZUSTIMMUNG.test(f.label)) {
          if (await aktivieren(sel(f))) gesetzt += 1;
        }
      } else if (f.tag === 'SELECT') {
        if (f.wert !== '' || FREIWILLIG.test(f.label)) continue;
        const index = f.optionen.findIndex((o, i) => i > 0 && o.wert !== '' && !o.disabled);
        if (index > 0) {
          await sel(f).selectOption({ index });
          gesetzt += 1;
        }
      } else if (f.wert === '') {
        const wert = wertFuer(f, emailWert);
        if (wert !== null) {
          await sel(f).fill(wert);
          gesetzt += 1;
        }
      }
    } catch (e) { letzteFehler.push(String(e.message).split('\n')[0].slice(0, 160)); }
  }
  if (datei) await warteAufUploads(page);
  return gesetzt;
}

async function stepTitel(page) {
  return page.evaluate(() => {
    const h = [...document.querySelectorAll('main h2')]
      .find((e) => e.getBoundingClientRect().height > 0);
    return h ? h.textContent.replace(/\s+/g, ' ').trim() : '';
  });
}

/**
 * Wählt im Termin-Schritt den ersten freien Zeitpunkt. Ergebnis: „gewaehlt“, „keine“ (die Seite meldet, dass
 * nichts frei ist oder nicht geladen werden konnte) oder „kein-ui“ (der Schritt hat keine Zeitfenster).
 */
async function terminWaehlen(page) {
  const zeit = /\b\d{1,2}[:.]\d{2}\b/;
  const tag = /\b\d{1,2}\.\d{1,2}\.?|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag/;
  const klicken = async (muster) => {
    const kandidaten = page.getByRole('button', { name: muster }).or(page.getByRole('radio', { name: muster }));
    const n = await kandidaten.count();
    for (let i = 0; i < n; i += 1) {
      const k = kandidaten.nth(i);
      if ((await k.isVisible().catch(() => false)) && (await k.isEnabled().catch(() => false))) {
        await k.click({ force: true }).catch(() => {});
        await pause(400);
        return true;
      }
    }
    return false;
  };
  const laedt = () => page.getByText('Freie Termine werden geladen').count();
  if ((await laedt()) > 0) await warteBis(async () => (await laedt()) === 0, 8000, 300);
  if (await klicken(zeit)) return { status: 'gewaehlt' };
  if (await klicken(tag)) {
    await pause(500);
    if (await klicken(zeit)) return { status: 'gewaehlt' };
  }
  const text = await hauptText(page);
  const hinweis = (text.match(/Im buchbaren Zeitraum[^\n]*|Termine konnten nicht geladen werden[^\n]*/) ?? [])[0];
  if (hinweis) return { status: 'keine', hinweis };
  return { status: 'kein-ui' };
}

async function absendeKnopf(page) {
  const kandidaten = page.getByRole('button').filter({ hasText: /absenden|bestellen|abschicken|senden|buchen|warenkorb/i });
  const n = await kandidaten.count();
  for (let i = n - 1; i >= 0; i -= 1) {
    const k = kandidaten.nth(i);
    if ((await k.isVisible().catch(() => false)) && (await k.isEnabled().catch(() => false))) return k;
  }
  return null;
}

const SCHRITTBILDER = process.env.SM24_SCHRITTBILDER ?? null;
let schrittBildNr = 0;

/**
 * Ganzseitiges Bild des aktuellen Schritts, nur mit SM24_SCHRITTBILDER. Fehler sind unerheblich.
 * Wartet vorher 400 ms (`--dauer-slow`), damit das Bild den ruhenden Schritt zeigt und keinen Übergang (B-11, B-20).
 */
async function schrittBild(page, titel) {
  if (!SCHRITTBILDER) return;
  await page.waitForTimeout(400);
  schrittBildNr += 1;
  const name = `${String(schrittBildNr).padStart(2, '0')}-${(titel || 'ohne-titel').toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').slice(0, 40)}.jpg`;
  await page.screenshot({ path: path.join(SCHRITTBILDER, name), type: 'jpeg', quality: 60, fullPage: true }).catch(() => {});
}

/**
 * Geht Schritt für Schritt vor: füllen, Termin wählen, „Weiter“ klicken.
 * Klickt NIE den Absende-Knopf; er wird zurückgegeben. Grund ist gesetzt, wenn der Ablauf vorher endet.
 */
async function durchlaufe(page, { emailWert = PRUEF_EMAIL, maxSchritte = 20, nurEinSchritt = false } = {}) {
  const schritte = [];
  let absende = null;
  let grund = null;
  for (let n = 0; n < maxSchritte; n += 1) {
    const titel = await stepTitel(page);
    const t0 = Date.now();
    zuletzt = titel;
    await felderFuellen(page, { emailWert, stufe: 1 });
    if (/termin/i.test(titel)) {
      const t = await terminWaehlen(page);
      if (t.status === 'keine') {
        grund = `keine Zeitfenster im Schritt „${titel}“ [Hinweis der Seite: ${t.hinweis}]`;
        schritte.push({ titel, aktion: 'keine-termine' });
        break;
      }
    }
    const weiter = page.getByRole('button', { name: 'Weiter', exact: true });
    if ((await weiter.count()) > 0) {
      let bereit = await weiter.first().isEnabled().catch(() => false);
      if (!bereit) {
        await felderFuellen(page, { emailWert, stufe: 2 });
        await warteAufUploads(page);
        bereit = await warteBis(() => weiter.first().isEnabled(), 2500, 250);
      }
      if (!bereit) {
        // Diagnose: Zustand der Felder, damit das Blockieren nachvollziehbar ist.
        const felder = await page.evaluate(beschreibeFelder);
        const diag = felder.slice(0, 8)
          .map((f) => `${f.typ}${f.name ? `(${f.name})` : ''}=${f.checked ? 'an' : (f.wert || 'leer')}`)
          .join(', ');
        await schrittBild(page, `${titel}-gesperrt`);
        grund = `„Weiter“ gesperrt im Schritt „${titel}“ [Felder: ${diag}]${letzteFehler.length ? ` [Fehler: ${letzteFehler[0]}]` : ''}`;
        schritte.push({ titel, aktion: 'gesperrt' });
        break;
      }
      await schrittBild(page, titel);
      await weiter.first().click();
      schritte.push({ titel, aktion: 'weiter' });
      console.error(`    · „${titel}“ in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
      if (nurEinSchritt) break;
      await warteBis(async () => (await stepTitel(page)) !== titel, 6000, 200);
      continue;
    }
    await schrittBild(page, titel);
    absende = await absendeKnopf(page);
    schritte.push({ titel, aktion: absende ? 'letzter' : 'ohne-weiter-und-absenden' });
    if (!absende) grund = `weder „Weiter“ noch Absende-Knopf in „${titel}“`;
    break;
  }
  return { schritte, absende, grund, letzterTitel: schritte.at(-1)?.titel ?? '' };
}

const zusammenfassung = (w) => w.schritte.map((s) => `${s.titel || '(ohne Titel)'}: ${s.aktion}`).join(' → ');

/* ---------- Schritte des Warenkorbs ---------- */

async function ms01Eintragen(page, menge) {
  await laden(page, '/schluessel-nach-code/ms-01');
  await page.getByLabel(/^Schlüsselcode/).fill('0812');
  await page.getByRole('spinbutton', { name: /^Stückzahl/ }).fill(String(menge));
  const knopf = page.getByRole('button', { name: 'In den Warenkorb', exact: true });
  if (!(await warteBis(() => knopf.isEnabled(), 5000))) {
    throw new Error('Knopf „In den Warenkorb“ bleibt gesperrt (Code oder Menge ungültig)');
  }
  await knopf.click();
  await pause(800);
}

/* ---------- Funktionen F-01 bis F-14 ---------- */

async function f01({ page }) {
  const pr = [];
  const pruefe = (name, ok, detail = '') => pr.push({ name, ok, detail });
  await ms01Eintragen(page, 2);
  await laden(page, '/warenkorb');
  const zeile = page.getByText('Büroschrank und Rollcontainer').first();
  pruefe('Eintrag erscheint', await warteBis(() => zeile.isVisible(), 8000));
  const menge = page.getByRole('spinbutton', { name: /^Stückzahl Büroschrank/ });
  const mengeWert = await menge.inputValue().catch(() => '');
  pruefe('Menge 2', mengeWert === '2', mengeWert);
  let s = summeWerte(await dlWerte(page));
  pruefe('Zwischensumme 2 × 8,00 €', s.zwischen === 1600, centText(s.zwischen));
  await page.getByRole('radio').first().check({ force: true });
  await pause(600);
  s = summeWerte(await dlWerte(page));
  pruefe('Summe = Zwischensumme + Versand', s.gesamt !== null && s.gesamt === (s.zwischen ?? 0) + (s.versand ?? 0),
    `${centText(s.zwischen)} + ${centText(s.versand)} = ${centText(s.gesamt)}`);
  await menge.fill('3');
  await warteBis(async () => summeWerte(await dlWerte(page)).zwischen === 2160, 6000, 300);
  s = summeWerte(await dlWerte(page));
  pruefe('Menge 3 mit Staffelpreis 3 × 7,20 €', s.zwischen === 2160, centText(s.zwischen));
  await page.getByRole('button', { name: 'Position entfernen' }).first().click();
  pruefe('Entfernen zeigt „leer“', await warteBis(() => page.getByText('Ihr Warenkorb ist leer').isVisible(), 6000));
  return {
    ok: pr.every((p) => p.ok),
    begruendung: pr.map((p) => `${p.name}: ${p.ok ? 'ja' : 'nein'}${p.detail ? ` (${p.detail})` : ''}`).join('; '),
  };
}

async function f02({ page, ziel }) {
  await ms01Eintragen(page, 2);
  await laden(page, '/warenkorb');
  await warteBis(() => page.getByRole('radio').first().isVisible(), 8000, 200);
  await page.getByRole('radio').first().check({ force: true });
  await pause(400);
  await laden(page, '/kasse');
  if (!(await warteBis(() => page.getByRole('heading', { name: 'Kontaktdaten' }).isVisible(), 10000))) {
    return { ok: false, begruendung: 'Kasse zeigt keine Kontaktdaten (Warenkorb leer?)' };
  }
  await page.getByLabel(/^Vorname/).fill('Erika');
  await page.getByLabel(/^Nachname/).fill('Mustermann');
  await page.getByLabel(/^E-Mail/).fill(PRUEF_EMAIL);
  await page.getByLabel(/^Telefon/).fill('030 1234567');
  await page.getByLabel(/^Straße/).fill('Musterstraße 1');
  await page.getByLabel(/^Postleitzahl/).fill('10115');
  await page.getByLabel(/^Ort/).fill('Berlin');
  await page.getByRole('checkbox', { name: /zur Kenntnis genommen/ }).check({ force: true });
  await page.getByRole('checkbox', { name: /Mir ist bekannt/ }).check({ force: true });
  const knopf = page.getByRole('button', { name: 'Zahlungspflichtig bestellen', exact: true });
  if (!(await warteBis(() => knopf.isEnabled(), 5000))) {
    return { ok: false, begruendung: 'Knopf „Zahlungspflichtig bestellen“ bleibt gesperrt (Versandart?)' };
  }
  await knopf.click();
  const gesendet = await warteBis(() => ziel.liste().some((a) => a.art === 'action-schreibend'), 12000, 300);
  const meldungen = await page.evaluate(() => [...document.querySelectorAll('main [role="alert"], main p')]
    .map((e) => e.textContent.trim()).filter((t) => /Bitte|Fehler|konnte/.test(t)).slice(0, 2).join(' | '));
  return {
    ok: gesendet,
    begruendung: gesendet
      ? 'Absenden als Attrappe abgefangen (action-schreibend, Prüf-E-Mail im Inhalt)'
      : `keine abgefangene Bestellung; Meldungen: ${meldungen || 'keine'}`,
  };
}

async function f03({ page }) {
  const antwort = await laden(page, '/bestellung/x?t=falsch');
  const status = antwort?.status();
  return { ok: status === 404, begruendung: `HTTP ${status}` };
}

async function f04({ page, ziel }) {
  await laden(page, '/autoschluessel/anfrage');
  const w = await durchlaufe(page, { maxSchritte: 20 });
  if (w.absende) {
    await w.absende.click();
    const gesendet = await warteBis(() => ziel.liste().some((a) => a.art === 'action-schreibend'), 10000, 300);
    return {
      ok: gesendet,
      begruendung: gesendet
        ? `Absenden als Attrappe erreicht; ${w.schritte.length} Schritte: ${zusammenfassung(w)}`
        : `Absende-Knopf geklickt, keine Attrappe; Schritte: ${zusammenfassung(w)}`,
    };
  }
  if (/keine Zeitfenster/.test(w.grund ?? '')) {
    return {
      ok: true,
      begruendung: `eingeschränkt: bis zum letzten erreichbaren Schritt „${w.letzterTitel}“ (keine Zeitfenster aus der lesenden Zeitfenster-Action); Absenden nicht erreicht; ${zusammenfassung(w)}`,
    };
  }
  return { ok: false, begruendung: `${w.grund}; Schritte: ${zusammenfassung(w)}` };
}

async function f05({ page, ziel }) {
  await laden(page, '/gleichschliessende-zylinder/konfigurator');
  const w = await durchlaufe(page, { maxSchritte: 12 });
  if (!w.absende) return { ok: false, begruendung: w.grund ?? 'kein Übernahme-Knopf', messwert: zusammenfassung(w) };
  await w.absende.click();
  await pause(1200);
  // Beleg ist der gespeicherte Warenkorb, nicht ein Text: „Gleichschließende Zylinder“ steht auch
  // in Kopf, Fuß und leerem Warenkorb und wäre ohne Eintrag sichtbar.
  const eintraege = () =>
    page.evaluate(() => {
      try {
        const roh = JSON.parse(window.localStorage.getItem('sm24-warenkorb') ?? 'null');
        return (roh?.state?.items ?? []).length;
      } catch {
        return -1;
      }
    });
  const gespeichert = await warteBis(async () => (await eintraege()) > 0, 8000);
  await laden(page, '/warenkorb');
  const leer = await page.locator('main').getByText(/Warenkorb ist leer/i).first().isVisible().catch(() => false);
  const da = gespeichert && !leer;
  return {
    ok: da,
    begruendung: da
      ? `Warenkorb gespeichert mit ${await eintraege()} Eintrag/Einträgen, Seite nicht leer; Schritte: ${zusammenfassung(w)}`
      : `Warenkorb gespeichert: ${gespeichert ? 'ja' : 'nein'}, Seite leer: ${leer ? 'ja' : 'nein'}; Schritte: ${zusammenfassung(w)}`,
    messwert: `Attrappen: ${ziel.liste().length}`,
  };
}

async function f06({ page, ziel }) {
  await laden(page, '/schliessanlagen/konfigurator');
  const w = await durchlaufe(page, { maxSchritte: 20 });
  if (!w.absende) return { ok: false, begruendung: `${w.grund ?? 'kein Absende-Knopf'}; Schritte: ${zusammenfassung(w)}` };
  await w.absende.click();
  const gesendet = await warteBis(() => ziel.liste().some((a) => a.art === 'action-schreibend'), 12000, 300);
  return {
    ok: gesendet,
    begruendung: gesendet
      ? `Projekt-Absenden als Attrappe abgefangen; ${w.schritte.length} Schritte`
      : `kein abgefangenes Absenden; Schritte: ${zusammenfassung(w)}`,
  };
}

async function f07({ page, ziel }) {
  const routen = [
    '/schluessel-nach-vorlage/anfrage',
    '/sicherheitstechnik/sicherheitscheck',
    '/elektronische-zutrittsloesungen/konfigurator',
    '/service-und-termin/anfrage',
  ];
  const teile = [];
  let alleOk = true;
  for (const r of routen) {
    await laden(page, r);
    const w = await durchlaufe(page, { maxSchritte: 20 });
    let abgesendet = '';
    if (w.absende) {
      const vorher = ziel.liste().length;
      await w.absende.click();
      await warteBis(() => ziel.liste().length > vorher, 8000, 300);
      abgesendet = ziel.liste().length > vorher ? ', Absenden als Attrappe' : ', Absenden ohne Attrappe';
    }
    const ok = w.grund === null && w.schritte.length > 0;
    alleOk = alleOk && ok;
    teile.push(`${r}: ${ok ? 'ok' : 'nein'} (${w.schritte.length} Schritte, erster „${w.schritte[0]?.titel ?? '–'}“, letzter „${w.letzterTitel || '–'}“${abgesendet})${w.grund ? ` – ${w.grund}` : ''}`);
  }
  return { ok: alleOk, begruendung: teile.join(' · ') };
}

async function f08({ page }) {
  await laden(page, '/service-und-termin/terminstatus');
  await page.getByLabel(/^Vorgangsnummer/).fill('SM24-PRUEF-0000');
  // Eigene Adresse ohne Bestandteil der Prüf-E-Mail, damit die lesende Status-Action den echten Server erreicht.
  await page.getByLabel(/^E-Mail/).fill('status-kontrolle@example.invalid');
  const vorher = await hauptText(page);
  await page.getByRole('button', { name: 'Stand abrufen', exact: true }).click();
  const geaendert = await warteBis(async () => (await hauptText(page)) !== vorher, 10000, 300);
  const meldung = await page.evaluate(() => [...document.querySelectorAll('main [role="alert"], main [aria-live]')]
    .map((e) => e.textContent.trim()).filter(Boolean).join(' | ').slice(0, 200));
  return {
    ok: geaendert,
    begruendung: geaendert ? `Rückmeldung erscheint: „${meldung || 'Textänderung im Hauptbereich'}“` : 'keine Rückmeldung nach dem Abrufen',
  };
}

async function f09({ page }) {
  const KEY = 'sm24-cookie-einwilligung';
  await laden(page, '/rechtliches/cookie-einstellungen');
  const lese = () => page.evaluate((k) => {
    try { return window.localStorage.getItem(k); } catch { return 'ZUGRIFF-VERWEIGERT'; }
  }, KEY);
  await page.evaluate((k) => { try { window.localStorage.removeItem(k); } catch { /* ignorieren */ } }, KEY);
  // Komfort und Statistik sind im Quelltext derzeit deaktiviert (active: false); nur ein aktiver Schalter wird umgelegt.
  const schalter = page.getByRole('switch');
  let umgelegt = false;
  for (let i = 0; i < (await schalter.count()); i += 1) {
    if (await schalter.nth(i).isEnabled()) {
      await schalter.nth(i).click();
      umgelegt = true;
      break;
    }
  }
  await page.getByRole('button', { name: 'Auswahl speichern', exact: true }).click();
  const gesetzt = await warteBis(async () => (await lese()) !== null, 4000, 200);
  const nachSpeichern = await lese();
  await page.getByRole('button', { name: /Gespeicherte Daten löschen/ }).click();
  const entfernt = await warteBis(async () => (await lese()) === null, 4000, 200);
  return {
    ok: gesetzt && entfernt,
    begruendung: `nach Speichern gesetzt: ${gesetzt ? 'ja' : 'nein'} (${String(nachSpeichern).slice(0, 80)}); nach Löschen entfernt: ${entfernt ? 'ja' : 'nein'}; aktiver Schalter umgelegt: ${umgelegt ? 'ja' : 'nein (Komfort und Statistik deaktiviert)'}`,
  };
}

async function f10({ page }) {
  await laden(page, '/schluessel-nach-vorlage/anfrage');
  const w = await durchlaufe(page, { maxSchritte: 1, nurEinSchritt: true });
  const gespeichert = await warteBis(() => page.evaluate(() => Object.keys(window.localStorage)
    .some((k) => k.startsWith('sm24:flow:'))), 5000, 250);
  await page.reload({ waitUntil: 'networkidle' });
  const angebot = await warteBis(() => page.getByRole('button', { name: 'Weitermachen', exact: true }).isVisible(), 8000, 250);
  return {
    ok: gespeichert && angebot,
    begruendung: `Zwischenstand im Browser: ${gespeichert ? 'ja' : 'nein'}; nach Neuladen „Weitermachen“: ${angebot ? 'ja' : 'nein'} (Schritt 1: ${zusammenfassung(w)})`,
  };
}

async function f11({ page, neuerKontext }) {
  const pr = [];
  const pruefe = (name, ok, detail = '') => pr.push({ name, ok, detail });
  // Mobil (390 px, Kontext aus der Funktion)
  await laden(page, '/');
  await page.keyboard.press('Tab');
  const fokus = await page.evaluate(() => {
    const a = document.activeElement;
    return { text: a?.textContent?.trim() ?? '', href: a?.getAttribute('href') ?? '' };
  });
  pruefe('Sprunglink ist erstes Ziel nach Tab', fokus.text === 'Zum Inhalt springen', fokus.text || 'kein Fokus');
  await page.keyboard.press('Enter');
  await pause(300);
  const hash = await page.evaluate(() => window.location.hash);
  pruefe('Sprunglink springt nach #inhalt', hash === '#inhalt', hash || 'kein Hash');
  await page.getByRole('button', { name: 'Menü öffnen' }).click();
  // Zwei Knöpfe mit diesem Namen: der erste liegt als Kopfzeilen-Fläche über dem Drawer, der letzte ist das X.
  const schliessen = page.getByRole('button', { name: 'Menü schließen' }).last();
  pruefe('Mobiler Drawer öffnet', await warteBis(() => schliessen.isVisible(), 3000, 150));
  await schliessen.click();
  pruefe('Mobiler Drawer schließt', await warteBis(async () => !(await schliessen.isVisible().catch(() => false)), 3000, 150));
  const leiste = page.getByRole('navigation', { name: 'Schnellzugriff' });
  const leisteOk = await leiste.evaluate((e) => {
    const r = e.getBoundingClientRect();
    return r.height > 0 && r.bottom <= window.innerHeight + 1;
  }).catch(() => false);
  pruefe('Mobile Aktionsleiste sichtbar (390 px)', leisteOk);
  // Desktop (1440 px, eigener Kontext)
  const dp = await neuerKontext(2);
  await laden(dp, '/');
  const bereich = dp.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('button', { name: 'Autoschlüssel', exact: true });
  await bereich.focus();
  await dp.keyboard.press('Enter');
  pruefe('Megamenü öffnet (aria-expanded)', await warteBis(async () => (await bereich.getAttribute('aria-expanded')) === 'true', 3000, 150));
  pruefe('Megamenü zeigt Link', await warteBis(() => dp.getByRole('link', { name: /^Autoschlüssel nachmachen/ }).first().isVisible(), 3000, 150));
  await dp.keyboard.press('Enter');
  pruefe('Megamenü schließt', await warteBis(async () => (await bereich.getAttribute('aria-expanded')) === 'false', 3000, 150));
  return {
    ok: pr.every((p) => p.ok),
    begruendung: pr.map((p) => `${p.name}: ${p.ok ? 'ja' : 'nein'}${p.detail ? ` (${p.detail})` : ''}`).join('; '),
  };
}

async function f12({ page }) {
  const sm = await page.request.get(`${BASIS_URL}/sitemap.xml`);
  const smText = await sm.text();
  const locs = (smText.match(/<loc>/g) ?? []).length;
  const rb = await page.request.get(`${BASIS_URL}/robots.txt`);
  const rbText = await rb.text();
  const disallow = rbText.split(/\r?\n/).filter((z) => /^\s*disallow:/i.test(z)).length;
  const ll = await page.request.get(`${BASIS_URL}/llms.txt`);
  await laden(page, '/');
  const jsonStart = await page.locator('script[type="application/ld+json"]').count();
  await laden(page, '/schluessel-nach-code/ms-01');
  const jsonProdukt = await page.locator('script[type="application/ld+json"]').count();
  const ok = sm.status() === 200 && locs > 0 && rb.status() === 200 && disallow > 0
    && ll.status() === 200 && jsonStart > 0 && jsonProdukt > 0;
  return {
    ok,
    begruendung: `sitemap.xml ${sm.status()}, ${locs} <loc>; robots.txt ${rb.status()}, ${disallow} Disallow; llms.txt ${ll.status()}; JSON-LD Start ${jsonStart}, MS-01 ${jsonProdukt}`,
  };
}

async function rechnerPruefen(page) {
  const vorher = await hauptText(page);
  const kandidaten = page.locator('main [role="radio"][aria-checked="false"], main input[type="radio"]:not(:checked), main [aria-pressed="false"], main input[type="checkbox"]:not(:checked)');
  const zahl = await kandidaten.count();
  let getan = 0;
  for (let i = 0; i < Math.min(zahl, 4) && getan < 2; i += 1) {
    try {
      await kandidaten.nth(i).click({ force: true, timeout: 3000 });
      getan += 1;
      await pause(500);
    } catch { /* nicht klickbar */ }
  }
  const auswahl = page.locator('main select').first();
  if (getan < 2 && (await auswahl.count()) > 0) {
    try {
      await auswahl.selectOption({ index: 1 });
      getan += 1;
    } catch { /* keine Auswahl möglich */ }
  }
  await pause(800);
  const geaendert = (await hauptText(page)) !== vorher;
  return { getan, geaendert };
}

async function f13({ page }) {
  const teile = [];
  let alleOk = true;
  for (const pfad of ['/tuer-und-schliesstechnik', '/service-und-termin']) {
    await laden(page, pfad);
    const r = await rechnerPruefen(page);
    const ok = r.getan > 0 && r.geaendert;
    alleOk = alleOk && ok;
    teile.push(`${pfad}: ${r.getan} Auswahl(en), Ergebnisbereich ${r.geaendert ? 'ändert sich' : 'bleibt unverändert'}`);
  }
  return { ok: alleOk, begruendung: teile.join(' · ') };
}

async function f14({ page }) {
  await laden(page, '/schluessel-nach-code');
  const zaehle = () => page.evaluate(() => [...document.querySelectorAll('main a[href^="/schluessel-nach-code/"]')]
    .filter((a) => a.getBoundingClientRect().height > 0).length);
  const vorher = await zaehle();
  let nachher = vorher;
  const typ = page.getByLabel(/^Schlüsseltyp/);
  let weg = '';
  if ((await typ.count()) > 0) {
    await typ.selectOption({ index: 1 });
    await pause(600);
    nachher = await zaehle();
    weg = 'Filter Schlüsseltyp';
  }
  if (nachher === vorher) {
    await page.getByLabel(/^Suche/).fill('Briefkasten');
    await pause(600);
    nachher = await zaehle();
    weg += `${weg ? ' · ' : ''}Suche „Briefkasten“`;
  }
  return {
    ok: nachher !== vorher,
    begruendung: `sichtbare Einträge ${vorher} → ${nachher} (${weg || 'kein Filter gefunden'})`,
    messwert: `${vorher} → ${nachher}`,
  };
}

const FUNKTIONEN = [
  { id: 'F-01', name: 'Warenkorb: Code-Schlüssel hinzufügen, Menge ändern, entfernen, Versandart, Summe', geraet: 2, lauf: f01 },
  { id: 'F-02', name: 'Kasse: Pflichtfelder, zwei Bestätigungen, Absenden', geraet: 2, lauf: f02 },
  { id: 'F-03', name: 'Bestellseite nur mit gültigem Zugangsschlüssel', geraet: 2, lauf: f03 },
  { id: 'F-04', name: 'Autoschlüssel-Assistent: Schritte, Fotos, Preis, Termin, Absenden', geraet: 0, lauf: f04 },
  { id: 'F-05', name: 'Zylinder-Konfigurator in den Warenkorb', geraet: 2, lauf: f05 },
  { id: 'F-06', name: 'Schließanlagen-Konfigurator bis Zusammenfassung und Absenden', geraet: 2, lauf: f06 },
  { id: 'F-07', name: 'Weitere Abläufe: vorlage, Sicherheitscheck, Zutritt, Service-Anfrage', geraet: 2, lauf: f07 },
  { id: 'F-08', name: 'Terminstatus abfragen', geraet: 2, lauf: f08 },
  { id: 'F-09', name: 'Cookie-Einstellungen speichern und löschen', geraet: 2, lauf: f09 },
  { id: 'F-10', name: 'Zwischenspeicherung in Abläufen („Weitermachen“)', geraet: 0, lauf: f10 },
  { id: 'F-11', name: 'Navigation: Megamenü, mobiler Drawer, Sprunglink, mobile Aktionsleiste', geraet: 0, lauf: f11 },
  { id: 'F-12', name: 'robots.txt, sitemap.xml, llms.txt, JSON-LD', geraet: 2, lauf: f12 },
  { id: 'F-13', name: 'Rechner Türabsicherung und Serviceeinsatz', geraet: 2, lauf: f13 },
  { id: 'F-14', name: 'Shop-Filter und Liste der Codelinien', geraet: 2, lauf: f14 },
];

/* ---------- Ablauf ---------- */

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };

async function messfensterAbwarten() {
  const start = Date.now();
  let hinweis = false;
  while (existsSync(SPERRE)) {
    if (Date.now() - start > SPERRE_MAX_MS) {
      throw new Error(`Messfenster-Sperre ${SPERRE} besteht länger als 40 min (OFFENE FRAGE)`);
    }
    if (!hinweis) {
      console.error(`Messfenster: ${SPERRE} existiert; warte, prüfe alle 2 min.`);
      hinweis = true;
    }
    await pause(SPERRE_PRUEF_MS);
  }
}

async function serverPruefen() {
  try {
    const r = await fetch(`${BASIS_URL}/`, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
    if (r.status >= 500 || r.status === 0) throw new Error(`HTTP ${r.status}`);
  } catch (e) {
    throw new Error(`Server auf ${BASIS_URL} antwortet nicht (${e.message}); server.sh status prüfen`);
  }
}

async function fuehreAus(browser, f) {
  const t0 = Date.now();
  const kontexte = [];
  const listen = [];
  let timer = null;
  zuletzt = '';
  const ziel = { liste: () => listen.flat() };
  const neuerKontext = async (geraetIndex) => {
    const ctx = await kontextFuer(browser, GERAETE[geraetIndex]);
    ctx.setDefaultTimeout(10_000);
    kontexte.push(ctx);
    listen.push(await attrappenSetzen(ctx));
    const page = await ctx.newPage();
    page.on('dialog', (d) => { d.accept().catch(() => {}); });
    return page;
  };
  let ergebnis;
  try {
    const page = await neuerKontext(f.geraet);
    const lauf = Promise.resolve().then(() => f.lauf({ page, neuerKontext, ziel }));
    lauf.catch(() => {});
    const zeit = new Promise((_, rej) => { timer = setTimeout(() => rej(new Zeitlimit()), ZEITLIMIT_MS); });
    ergebnis = await Promise.race([lauf, zeit]);
  } catch (e) {
    if (e instanceof Zeitlimit) ergebnis = { ok: false, begruendung: `Zeitlimit 60 s überschritten${zuletzt ? ` (zuletzt im Schritt „${zuletzt}“)` : ''}` };
    else ergebnis = { ok: false, begruendung: `Fehler: ${String(e.message ?? e).split('\n')[0].slice(0, 300)}` };
  } finally {
    clearTimeout(timer);
    for (const c of kontexte) await c.close().catch(() => {});
  }
  return {
    id: f.id,
    funktion: f.name,
    geraet: GERAETE[f.geraet].id,
    ergebnis: ergebnis.ok ? 'BESTANDEN' : 'NICHT BESTANDEN',
    begruendung: ergebnis.begruendung,
    messwert: ergebnis.messwert ?? null,
    dauer_ms: Date.now() - t0,
    attrappen: ziel.liste(),
  };
}

const zelle = (v) => String(v ?? '–').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
const logGroesse = () => (existsSync(SERVERLOG) ? statSync(SERVERLOG).size : 0);

async function main() {
  const args = argumente();
  for (const k of ['nur', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const gewaehlt = typeof args.nur === 'string'
    ? args.nur.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean)
    : FUNKTIONEN.map((f) => f.id);
  const unbekannt = gewaehlt.filter((id) => !FUNKTIONEN.some((f) => f.id === id));
  if (unbekannt.length) bedienfehler(`unbekannte Funktion: ${unbekannt.join(', ')}`);
  const laufen = FUNKTIONEN.filter((f) => gewaehlt.includes(f.id));

  try {
    await messfensterAbwarten();
    await serverPruefen();
  } catch (e) {
    console.error(`Technischer Fehler: ${e.message}`);
    process.exit(1);
  }

  pngSchreiben(FOTO);
  const recordsVorher = existsSync(RECORDS);
  const logVorher = logGroesse();
  const zeitbeginn = new Date().toISOString();

  const ergebnisse = [];
  // Je Funktion ein eigener Browser, und vorher die Messfenster-Sperre prüfen (kein Lauf während einer Messung).
  for (const f of laufen) {
    try {
      await messfensterAbwarten();
    } catch (e) {
      console.error(`Technischer Fehler: ${e.message}`);
      process.exit(1);
    }
    const browser = await browserStarten();
    try {
      ergebnisse.push(await fuehreAus(browser, f));
    } finally {
      await browser.close().catch(() => {});
    }
  }

  const recordsNachher = existsSync(RECORDS);
  const logNeu = existsSync(SERVERLOG)
    ? readFileSync(SERVERLOG).subarray(logVorher).toString('utf8')
    : '';
  const logTreffer = (logNeu.match(/Vorgang|record|Bestellung|Anfrage|POST/gi) ?? []).length;

  const stempel = zeitstempel();
  const datei = typeof args.json === 'string'
    ? path.resolve(args.json)
    : path.join(PROTOKOLLE, `funktionsliste-${stempel}.json`);
  const mdDatei = path.join(PROTOKOLLE, `funktionsliste-${stempel}.md`);
  const bestanden = ergebnisse.filter((e) => e.ergebnis === 'BESTANDEN').length;

  const tabelle = [
    '| F-Nr. | Funktion | Ergebnis | Begründung oder Messwert | Dauer |',
    '|---|---|---|---|---|',
    ...ergebnisse.map((e) => `| ${zelle(e.id)} | ${zelle(e.funktion)} | ${e.ergebnis} | ${zelle(e.begruendung)} | ${(e.dauer_ms / 1000).toFixed(1)} s |`),
  ].join('\n');
  const kopf = `# Funktionsliste (E0-PRUEFER-04)\n\nLauf: ${zeitbeginn} · Server ${BASIS_URL} · Bestanden ${bestanden} von ${ergebnisse.length}\n`;
  const fuss = `\nVorher/Nachher: content/records.json vorhanden ${recordsVorher ? 'ja' : 'nein'} → ${recordsNachher ? 'ja' : 'nein'}; Serverlog neu ${logNeu.length} Zeichen, Treffer Vorgang/Anfrage/POST: ${logTreffer}\n`;
  const md = `${kopf}\n${tabelle}\n${fuss}`;
  ordner(PROTOKOLLE);
  writeFileSync(mdDatei, md);
  writeFileSync(datei, `${JSON.stringify({
    skript: 'funktionsliste',
    zeit: zeitbeginn,
    argumente: args,
    server: BASIS_URL,
    records: { vorher: recordsVorher, nachher: recordsNachher },
    serverlog: { neuZeichen: logNeu.length, treffer: logTreffer },
    ergebnisse,
  }, null, 2)}\n`);

  console.log(md);
  console.log(`Markdown: ${mdDatei}`);
  console.log(`JSON-Protokoll: ${datei}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
