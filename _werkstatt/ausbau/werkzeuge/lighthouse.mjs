#!/usr/bin/env node
// lighthouse.mjs – Lighthouse je Hauptansicht als Median aus frischen Läufen (Auftrag Abschnitt 0 und 16).
// Aufruf: node lighthouse.mjs [--routen <pfad,pfad>] [--laeufe 3] [--profil mobil|desktop] [--json <datei>]
// Standard: alle Hauptansichten aus lib.mjs, 3 Läufe, Profil mobil. Je Lauf ein frischer Chrome: chrome-launcher
// startet CHROMIUM aus lib.mjs mit --headless=new --no-sandbox --disable-gpu. Playwright verbindet sich per CDP
// mit diesem Chrome und setzt attrappenSetzen() (G5); danach misst Lighthouse im selben Browser.
// Kategorien: Leistung, Barrierefreiheit, Best Practices, SEO; dazu LCP, CLS, TBT und INP (falls vorhanden, sonst „–“).
// Je Route: Median (Minimum–Maximum) je Wert und „erfüllt“ auf Basis des Medians.
// Budget (Auftrag Abschnitt 0): Leistung mobil mindestens 90; Barrierefreiheit, Best Practices und SEO je 100;
// mobil LCP höchstens 2.500 ms, CLS höchstens 0,1 und INP höchstens 200 ms (INP nur, wenn gemessen).
// Exit: 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import lighthouse, { desktopConfig } from 'lighthouse';
import { launch } from 'chrome-launcher';
import {
  HAUPTANSICHTEN, PROTOKOLLE, BASIS_URL, CHROMIUM, argumente, chromium, attrappenSetzen, zeitstempel, ordner,
} from './lib.mjs';

const KATEGORIEN = ['performance', 'accessibility', 'best-practices', 'seo'];
const CHROME_FLAGS = ['--headless=new', '--no-sandbox', '--disable-gpu'];
const PROFILE = { mobil: undefined, desktop: desktopConfig };
const BUDGET = { leistung: 90, kategorie: 100, lcp: 2500, cls: 0.1, inp: 200 };
const WERTE = [
  { schluessel: 'leistung', name: 'Leistung', stellen: 0, einheit: '' },
  { schluessel: 'barrierefreiheit', name: 'Barrierefreiheit', stellen: 0, einheit: '' },
  { schluessel: 'bestPractices', name: 'Best Practices', stellen: 0, einheit: '' },
  { schluessel: 'seo', name: 'SEO', stellen: 0, einheit: '' },
  { schluessel: 'lcp', name: 'LCP', stellen: 0, einheit: ' ms' },
  { schluessel: 'cls', name: 'CLS', stellen: 3, einheit: '' },
  { schluessel: 'tbt', name: 'TBT', stellen: 0, einheit: ' ms' },
  { schluessel: 'inp', name: 'INP', stellen: 0, einheit: ' ms' },
];
const ATTRAPEN_ARTEN = ['fremd', 'upload', 'action-schreibend', 'action-unbekannt', 'post-sonstig'];

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const slug = (p) => (p === '/' ? 'start' : p.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase());
const zelle = (v) => String(v ?? '–').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
function tabelle(kopf, zeilen) {
  return [
    `| ${kopf.join(' | ')} |`,
    `|${kopf.map(() => '---').join('|')}|`,
    ...zeilen.map((z) => `| ${z.map(zelle).join(' | ')} |`),
  ].join('\n');
}
function jsonSchreiben(skript, args, daten) {
  const datei = typeof args.json === 'string' ? path.resolve(args.json) : path.join(PROTOKOLLE, `${skript}-${zeitstempel()}.json`);
  ordner(path.dirname(datei));
  writeFileSync(datei, `${JSON.stringify({ skript, zeit: new Date().toISOString(), argumente: args, ...daten }, null, 2)}\n`);
  return datei;
}
function routenWaehlen(text) {
  if (text === undefined) return HAUPTANSICHTEN.map((v) => ({ id: v.id, pfad: v.pfad }));
  if (text === true) bedienfehler('--routen braucht eine Liste, z. B. --routen /,/autoschluessel');
  return text.split(',').map((t) => t.trim()).filter(Boolean).map((t) => {
    const v = HAUPTANSICHTEN.find((h) => h.id === t || h.pfad === t);
    if (v) return { id: v.id, pfad: v.pfad };
    if (t.startsWith('/')) return { id: slug(t), pfad: t };
    return bedienfehler(`unbekannte Route „${t}“`);
  });
}
const med = (liste) => {
  const s = [...liste].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const fmt = (n, stellen) => n.toFixed(stellen).replace('.', ',');
const statistik = (liste) => {
  const v = liste.filter((x) => typeof x === 'number' && Number.isFinite(x));
  return v.length ? { median: med(v), min: Math.min(...v), max: Math.max(...v), n: v.length } : null;
};
const spanneZelle = (s, w) => (s ? `${fmt(s.median, w.stellen)}${w.einheit} (${fmt(s.min, w.stellen)}–${fmt(s.max, w.stellen)})` : '–');

/** Werte eines erfolgreichen Laufs. Fehlt ein Wert, bleibt er null. */
function werteAus(lhr) {
  const kat = (id) => (typeof lhr.categories?.[id]?.score === 'number' ? Math.round(lhr.categories[id].score * 100) : null);
  const wert = (id) => (typeof lhr.audits?.[id]?.numericValue === 'number' ? lhr.audits[id].numericValue : null);
  return {
    leistung: kat('performance'),
    barrierefreiheit: kat('accessibility'),
    bestPractices: kat('best-practices'),
    seo: kat('seo'),
    lcp: wert('largest-contentful-paint'),
    cls: wert('cumulative-layout-shift'),
    tbt: wert('total-blocking-time'),
    inp: wert('interaction-to-next-paint'),
  };
}

/** Budget auf dem Median. ok ist true, false oder null (nicht gemessen). INP ist nicht Pflicht, wenn es fehlt. */
function budgetPruefen(s, profil) {
  const m = (k) => s[k]?.median ?? null;
  const pruefungen = [];
  const pruefe = (name, wert, grenze, ok, pflicht = true) => pruefungen.push({
    name, wert, grenze, ok: wert === null ? null : ok(wert), pflicht,
  });
  if (profil === 'mobil') {
    pruefe('Leistung', m('leistung'), `mindestens ${BUDGET.leistung}`, (v) => v >= BUDGET.leistung);
    pruefe('LCP', m('lcp'), `höchstens ${BUDGET.lcp} ms`, (v) => v <= BUDGET.lcp);
    pruefe('CLS', m('cls'), `höchstens ${fmt(BUDGET.cls, 1)}`, (v) => v <= BUDGET.cls);
    pruefe('INP', m('inp'), `höchstens ${BUDGET.inp} ms`, (v) => v <= BUDGET.inp, false);
  }
  pruefe('Barrierefreiheit', m('barrierefreiheit'), `${BUDGET.kategorie}`, (v) => v >= BUDGET.kategorie);
  pruefe('Best Practices', m('bestPractices'), `${BUDGET.kategorie}`, (v) => v >= BUDGET.kategorie);
  pruefe('SEO', m('seo'), `${BUDGET.kategorie}`, (v) => v >= BUDGET.kategorie);
  return pruefungen;
}

function erfuelltText(pruefungen) {
  const nein = pruefungen.filter((p) => p.ok === false);
  if (nein.length) return `nein (${nein.map((p) => p.name).join(', ')})`;
  const offen = pruefungen.filter((p) => p.ok === null && p.pflicht);
  if (offen.length) return `offen (${offen.map((p) => p.name).join(', ')} nicht gemessen)`;
  return 'ja';
}

function zaehleAttrappen(liste) {
  const zaehl = Object.fromEntries(ATTRAPEN_ARTEN.map((a) => [a, 0]));
  const hosts = new Set();
  for (const e of liste) {
    zaehl[e.art] = (zaehl[e.art] ?? 0) + 1;
    if (e.art === 'fremd') {
      try { hosts.add(new URL(e.url).host); } catch { /* ungültige Adresse: nur gezählt */ }
    }
  }
  return { ...zaehl, fremdHosts: [...hosts] };
}

/** Ein frischer Chrome, Attrappen über CDP, dann Lighthouse im selben Browser. */
async function einLauf(url, profil) {
  const chrome = await launch({ chromePath: CHROMIUM, chromeFlags: CHROME_FLAGS, logLevel: 'silent' });
  let verbindung = null;
  try {
    verbindung = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
    const abgefangen = await attrappenSetzen(verbindung.contexts()[0]);
    const ergebnis = await lighthouse(url, {
      port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: KATEGORIEN,
    }, PROFILE[profil]);
    return { lhr: ergebnis.lhr, abgefangen };
  } finally {
    await verbindung?.close().catch(() => {});
    await chrome.kill();
  }
}

async function messeRoute(r, profil, laeufe) {
  const url = BASIS_URL + r.pfad;
  const laufDaten = [];
  for (let n = 1; n <= laeufe; n += 1) {
    const { lhr, abgefangen } = await einLauf(url, profil);
    const fehler = lhr.runtimeError ? `${lhr.runtimeError.code}: ${lhr.runtimeError.message}`.slice(0, 300) : null;
    laufDaten.push({
      lauf: n,
      endadresse: lhr.finalDisplayedUrl ?? lhr.finalUrl ?? url,
      fehler,
      werte: fehler ? null : werteAus(lhr),
      attrappen: zaehleAttrappen(abgefangen),
      lighthouse: lhr.lighthouseVersion,
      browser: lhr.userAgent,
    });
  }
  const gueltig = laufDaten.filter((l) => l.werte);
  const stat = Object.fromEntries(WERTE.map((w) => [w.schluessel, statistik(gueltig.map((l) => l.werte[w.schluessel]))]));
  const pruefungen = budgetPruefen(stat, profil);
  return {
    ansicht: r.id,
    pfad: r.pfad,
    profil,
    gueltigeLaeufe: gueltig.length,
    laeufe: laufDaten,
    statistik: stat,
    pruefungen,
    erfuellt: erfuelltText(pruefungen),
  };
}

async function main() {
  const args = argumente();
  for (const k of ['routen', 'laeufe', 'profil', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const laeufe = args.laeufe === undefined ? 3 : Number(args.laeufe);
  if (!Number.isInteger(laeufe) || laeufe < 1 || laeufe > 10) bedienfehler('--laeufe braucht eine ganze Zahl von 1 bis 10');
  const profil = args.profil ?? 'mobil';
  if (!Object.hasOwn(PROFILE, profil)) bedienfehler(`--profil „${profil}“ ist nicht erlaubt (mobil oder desktop)`);
  const routen = routenWaehlen(args.routen);

  const ergebnisse = [];
  for (const r of routen) ergebnisse.push(await messeRoute(r, profil, laeufe));

  const protokoll = jsonSchreiben('lighthouse', args, { profil, laeufe, budget: BUDGET, routen: ergebnisse });
  const version = ergebnisse[0]?.laeufe[0]?.lighthouse ?? '–';
  const chromeVersion = (ergebnisse[0]?.laeufe[0]?.browser ?? '').match(/(?:HeadlessChrome|Chrome)\/([\d.]+)/)?.[1] ?? '–';
  console.log(`Lighthouse ${version} · Chrome ${chromeVersion} · Profil ${profil} · ${laeufe} Läufe je Ansicht\n`);
  console.log(tabelle(
    ['Ansicht', 'Läufe', ...WERTE.map((w) => w.name), 'erfüllt'],
    ergebnisse.map((r) => [
      r.ansicht, `${r.gueltigeLaeufe}/${laeufe}`,
      ...WERTE.map((w) => spanneZelle(r.statistik[w.schluessel], w)),
      r.erfuellt,
    ]),
  ));
  const abweichungen = ergebnisse.flatMap((r) => [
    ...r.pruefungen.filter((p) => p.ok === false).map((p) => `- ${r.ansicht}: ${p.name} ${fmt(p.wert, p.name === 'CLS' ? 3 : 0)} (Grenze ${p.grenze})`),
    ...r.laeufe.filter((l) => l.fehler).map((l) => `- ${r.ansicht}, Lauf ${l.lauf}: Lighthouse meldet ${l.fehler}`),
  ]);
  if (abweichungen.length) {
    console.log('\n### Befunde auf dem Median und fehlgeschlagene Läufe\n');
    console.log(abweichungen.join('\n'));
  }
  console.log('\n### Attrappen-Abbrüche je Ansicht (alle Läufe)\n');
  for (const r of ergebnisse) {
    const summe = (art) => r.laeufe.reduce((s, l) => s + (l.attrappen[art] ?? 0), 0);
    const hosts = [...new Set(r.laeufe.flatMap((l) => l.attrappen.fremdHosts))];
    console.log(`- ${r.ansicht}: fremd ${summe('fremd')}${hosts.length ? ` (${hosts.join(', ')})` : ''}, schreibend ${summe('action-schreibend') + summe('upload') + summe('post-sonstig')}, unbekannte Aktionen ${summe('action-unbekannt')}`);
  }
  console.log(`\nJSON-Protokoll: ${protokoll}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
