#!/usr/bin/env node
// leistung.mjs – Mobile Leistung mit festem Maßstab über die wichtigen Ansichten (Paket FA-SEO-03, FA-25-13, FA-25-15).
// Aufruf: node leistung.mjs [--basis http://localhost:3200] [--ansichten start,shop|/pfad] [--laeufe 3]
//                           [--methode simulate|devtools] [--marke vorher|nachher|…] [--vorher <json>]
//                           [--ziel <ordner>] [--roh <ordner>]
// Basis: --basis, sonst Umgebungsvariable BASIS, sonst http://localhost:3000. Nur localhost (G1).
//
// Maßstab (fest, im Bericht FA-SEO-03 genannt):
//   Lighthouse 12.6.1 aus /root/sm24-werkzeuge, Standardprofil mobil (Moto G Power, 412 × 823, DPR 1,75),
//   simulierte Drosselung (Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach), nur Kategorie Leistung.
//   Je Lauf ein frischer Chrome (/opt/pw-browsers, --headless=new --no-sandbox --disable-gpu) mit Attrappen nach G5
//   (attrappenSetzen aus lib.mjs, auf die Basis dieses Laufs gestellt). Drei Läufe je Ansicht, Median je Kennwert;
//   der Medianlauf (mittlere Leistung, bei Gleichstand niedrigerer LCP) liefert die Ursachen.
//   Zweiter Maßstab (--methode devtools): dieselben Drosselwerte, aber im Browser angewandt statt simuliert
//   (Latenz 562,5 ms je Anfrage, 1.474,6 kbit/s, CPU 4-fach). Er zeigt, wann Text und Bild wirklich erscheinen;
//   der Standard bleibt simulate, damit Zahlen mit PageSpeed Insights vergleichbar bleiben.
// Kennwerte: Leistung, FCP, LCP, Speed Index, TBT, CLS; dazu Gewicht und Zahl der Dateien, JavaScript-Gewicht,
//   HTML-Gewicht, LCP-Element mit Phasen, blockierende Dateien, Skripte mit Ausführungszeit, lange Aufgaben.
// Ausgabe: <ziel>/leistung-<marke>-<zeit>.json und .md (Standard protokolle/FA-SEO-03/), volle LHR nach <roh>
//   (Standard protokolle/roh/FA-SEO-03/, nicht für den Commit).
// Attrappen: Je Lauf werden die abgefangenen Anfragen gezählt (fremd, upload, action-*, post-sonstig) und mit
//   JSON und Markdown ausgegeben (G5-Beleg). --vorher muss mit derselben Methode gemessen sein; eine Datei ohne
//   Feld „methode“ (Vorfassung) gilt als simulate.
// Exit: 0 Lauf fertig (auch mit Befunden), 1 technischer Fehler, 2 Bedienfehler.
import { writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const STANDARD_BASIS = 'http://localhost:3000';
const LOKAL = new Set(['localhost', '127.0.0.1', '[::1]']);

/** Die neun Ansichten des Pakets FA-SEO-03 (So bauen, Punkt 1). */
export const ANSICHTEN = [
  { id: 'start', name: 'Startseite', pfad: '/' },
  { id: 'autoschluessel', name: 'Autoschlüssel', pfad: '/autoschluessel' },
  { id: 'assistent', name: 'Assistent Autoschlüssel', pfad: '/autoschluessel/anfrage' },
  { id: 'code', name: 'Schlüssel nach Code (Liste)', pfad: '/schluessel-nach-code' },
  { id: 'konfigurator', name: 'Konfigurator Sperrschließung', pfad: '/gleichschliessende-zylinder/konfigurator' },
  { id: 'shop', name: 'Shop', pfad: '/shop' },
  { id: 'ort', name: 'Ortsseite Wetzlar', pfad: '/standorte/wetzlar' },
  { id: 'ratgeber', name: 'Ratgeber Zylinder messen', pfad: '/ratgeber/zylinder-richtig-ausmessen' },
  { id: 'kontakt', name: 'Kontakt', pfad: '/service-und-termin/kontakt' },
];

export const KENNWERTE = [
  { k: 'leistung', name: 'Leistung', stellen: 0, einheit: '' },
  { k: 'fcp', name: 'FCP', stellen: 0, einheit: ' ms' },
  { k: 'lcp', name: 'LCP', stellen: 0, einheit: ' ms' },
  { k: 'si', name: 'Speed Index', stellen: 0, einheit: ' ms' },
  { k: 'tbt', name: 'TBT', stellen: 0, einheit: ' ms' },
  { k: 'cls', name: 'CLS', stellen: 3, einheit: '' },
  { k: 'gesamtKB', name: 'Gewicht', stellen: 0, einheit: ' KB' },
  { k: 'dateien', name: 'Dateien', stellen: 0, einheit: '' },
  { k: 'jsKB', name: 'JS', stellen: 0, einheit: ' KB' },
  { k: 'htmlKB', name: 'HTML', stellen: 0, einheit: ' KB' },
];

export const METHODEN = ['simulate', 'devtools'];

export class Bedienfehler extends Error {}

/** Methode einer gespeicherten Messung. Ältere Dateien ohne Feld „methode“ (Vorfassung des Werkzeugs) gelten als simulate. */
export function methodeVon(messung) {
  return messung?.methode ?? 'simulate';
}

/** Arten der Attrappen aus lib.mjs (G5), wie in lighthouse.mjs. */
export const ATTRAPPEN_ARTEN = ['fremd', 'upload', 'action-schreibend', 'action-unbekannt', 'post-sonstig'];

/** Zählt die von attrappenSetzen() abgefangenen Anfragen eines Laufs je Art, mit fremden Hosts. */
export function zaehleAttrappen(liste) {
  const zaehl = Object.fromEntries(ATTRAPPEN_ARTEN.map((a) => [a, 0]));
  const hosts = new Set();
  for (const e of liste ?? []) {
    zaehl[e.art] = (zaehl[e.art] ?? 0) + 1;
    if (e.art === 'fremd') {
      try { hosts.add(new URL(e.url).host); } catch { /* ungültige Adresse: nur gezählt */ }
    }
  }
  return { ...zaehl, fremdHosts: [...hosts] };
}

/** Summe der Attrappen über die Läufe einer Ansicht; null, wenn kein Lauf eine Zählung hat. */
export function summeAttrappen(laeufe) {
  const mit = laeufe.filter((l) => l.attrappen);
  if (!mit.length) return null;
  const summe = Object.fromEntries(ATTRAPPEN_ARTEN.map((a) => [a, mit.reduce((n, l) => n + (l.attrappen[a] ?? 0), 0)]));
  return { ...summe, fremdHosts: [...new Set(mit.flatMap((l) => l.attrappen.fremdHosts ?? []))], laeufe: mit.length };
}

export function methodeWaehlen(text) {
  const m = text === undefined ? 'simulate' : String(text);
  if (!METHODEN.includes(m)) throw new Bedienfehler(`--methode „${m}“ ist nicht erlaubt (simulate oder devtools)`);
  return m;
}

/** Basis aus Argument, Umgebung (BASIS) oder Standard; nur localhost. Ohne Schrägstrich am Ende. */
export function basisWaehlen(arg, umgebung = process.env.BASIS) {
  const roh = (typeof arg === 'string' && arg) || umgebung || STANDARD_BASIS;
  let u;
  try { u = new URL(roh); } catch { throw new Bedienfehler(`Basis „${roh}“ ist keine Adresse`); }
  if (!LOKAL.has(u.hostname)) throw new Bedienfehler(`nur localhost ist erlaubt (G1), nicht ${u.hostname}`);
  if (u.pathname !== '/' || u.search) throw new Bedienfehler('Basis ohne Pfad angeben, z. B. http://localhost:3200');
  return u.origin;
}

export function ansichtenWaehlen(text) {
  if (text === undefined) return ANSICHTEN.map((a) => ({ ...a }));
  if (text === true || String(text).trim() === '') throw new Bedienfehler('--ansichten braucht eine Liste, z. B. start,shop');
  return String(text).split(',').map((t) => t.trim()).filter(Boolean).map((t) => {
    const a = ANSICHTEN.find((x) => x.id === t || x.pfad === t);
    if (a) return { ...a };
    if (t.startsWith('/')) return { id: t.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'start', name: t, pfad: t };
    throw new Bedienfehler(`unbekannte Ansicht „${t}“`);
  });
}

export function median(liste) {
  const v = liste.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

export function statistik(liste) {
  const v = liste.filter((x) => typeof x === 'number' && Number.isFinite(x));
  return v.length ? { median: median(v), min: Math.min(...v), max: Math.max(...v), n: v.length } : null;
}

/** Medianlauf: mittlere Leistung, bei Gleichstand der niedrigere LCP (wie Lighthouse CI). */
export function medianLauf(laeufe) {
  const g = laeufe.filter((l) => l?.werte && typeof l.werte.leistung === 'number');
  if (!g.length) return null;
  const s = [...g].sort((a, b) => (a.werte.leistung - b.werte.leistung) || ((a.werte.lcp ?? Infinity) - (b.werte.lcp ?? Infinity)));
  return s[Math.floor((s.length - 1) / 2)];
}

const items = (lhr, id) => (Array.isArray(lhr?.audits?.[id]?.details?.items) ? lhr.audits[id].details.items : []);
const num = (lhr, id) => (typeof lhr?.audits?.[id]?.numericValue === 'number' ? lhr.audits[id].numericValue : null);
const r0 = (n) => (typeof n === 'number' && Number.isFinite(n) ? Math.round(n) : null);
const kbWert = (b) => (typeof b === 'number' ? Math.round(b / 102.4) / 10 : null);

/** Kennwerte eines Laufs aus dem Lighthouse-Ergebnis. Fehlende Werte bleiben null. */
export function werteAus(lhr) {
  const score = lhr?.categories?.performance?.score;
  const netz = items(lhr, 'network-requests');
  const summe = (liste) => liste.reduce((s, r) => s + (r.transferSize ?? 0), 0);
  const dok = netz.find((r) => r.resourceType === 'Document');
  return {
    leistung: typeof score === 'number' ? Math.round(score * 100) : null,
    fcp: num(lhr, 'first-contentful-paint'),
    lcp: num(lhr, 'largest-contentful-paint'),
    si: num(lhr, 'speed-index'),
    tbt: num(lhr, 'total-blocking-time'),
    cls: num(lhr, 'cumulative-layout-shift'),
    gesamtKB: netz.length ? kbWert(summe(netz)) : null,
    dateien: netz.length || null,
    jsKB: netz.length ? kbWert(summe(netz.filter((r) => r.resourceType === 'Script'))) : null,
    htmlKB: dok ? kbWert(dok.transferSize ?? 0) : null,
  };
}

/** Ursachen eines Laufs: LCP-Element und Phasen, Blockierendes, Skripte, lange Aufgaben, Befunde. */
export function ursachenAus(lhr, basis = '') {
  const kurz = (u) => (typeof u === 'string' && basis && u.startsWith(basis) ? u.slice(basis.length) || '/' : u);
  const tabellen = items(lhr, 'largest-contentful-paint-element');
  const knoten = tabellen.find((t) => t?.items?.[0]?.node)?.items[0].node ?? null;
  const phasen = Object.fromEntries((tabellen.find((t) => t?.items?.[0]?.phase !== undefined)?.items ?? [])
    .map((p) => [p.phase, r0(p.timing)]));
  const boot = new Map(items(lhr, 'bootup-time').map((i) => [i.url, i]));
  const ungenutzt = new Map(items(lhr, 'unused-javascript').map((i) => [i.url, i]));
  const netz = items(lhr, 'network-requests');
  const skripte = netz.filter((r) => r.resourceType === 'Script').map((r) => ({
    datei: kurz(r.url),
    kb: kbWert(r.transferSize ?? 0),
    ausfuehrungMs: r0(boot.get(r.url)?.scripting),
    ungenutztKB: kbWert(ungenutzt.get(r.url)?.wastedBytes),
    prioritaet: r.priority ?? null,
  })).sort((a, b) => (b.kb ?? 0) - (a.kb ?? 0));
  const dokUrl = netz.find((r) => r.resourceType === 'Document')?.url;
  return {
    lcpElement: knoten ? { selektor: knoten.selector ?? null, ausschnitt: (knoten.snippet ?? '').slice(0, 160) } : null,
    lcpPhasen: {
      serverantwort: phasen.TTFB ?? null,
      ladeverzoegerung: phasen['Load Delay'] ?? null,
      ladedauer: phasen['Load Time'] ?? null,
      darstellungsverzoegerung: phasen['Render Delay'] ?? null,
    },
    blockierend: items(lhr, 'render-blocking-resources').map((i) => ({ datei: kurz(i.url), kb: kbWert(i.totalBytes), ms: r0(i.wastedMs) })),
    skripte: skripte.slice(0, 12),
    dokumentSkriptMs: r0(boot.get(dokUrl)?.scripting),
    hauptthreadMs: r0(num(lhr, 'mainthread-work-breakdown')),
    hauptthread: items(lhr, 'mainthread-work-breakdown').map((i) => ({ gruppe: i.groupLabel ?? i.group, ms: r0(i.duration) })),
    langeAufgaben: items(lhr, 'long-tasks').map((i) => ({ datei: kurz(i.url), startMs: r0(i.startTime), dauerMs: r0(i.duration) }))
      .sort((a, b) => (b.dauerMs ?? 0) - (a.dauerMs ?? 0)).slice(0, 8),
    verschiebungen: items(lhr, 'layout-shifts').map((i) => ({ selektor: i.node?.selector ?? null, wert: typeof i.score === 'number' ? Number(i.score.toFixed(4)) : null })).slice(0, 5),
    befunde: (lhr?.categories?.performance?.auditRefs ?? [])
      .map((r) => ({ r, a: lhr.audits?.[r.id] }))
      .filter(({ a }) => a && typeof a.score === 'number' && a.score < 0.9 && !['informative', 'manual', 'notApplicable'].includes(a.scoreDisplayMode))
      .map(({ r, a }) => ({ id: r.id, anzeige: a.displayValue ?? null, einsparungMs: r0(a.details?.overallSavingsMs), einsparungKB: kbWert(a.details?.overallSavingsBytes) }))
      .sort((x, y) => (y.einsparungMs ?? 0) - (x.einsparungMs ?? 0)).slice(0, 8),
  };
}

/** Zusammenfassung je Ansicht aus den Läufen ({ lauf, werte, ursachen, fehler }). */
export function fasseZusammen(ansicht, laeufe) {
  const gueltig = laeufe.filter((l) => l.werte);
  const stat = Object.fromEntries(KENNWERTE.map(({ k }) => [k, statistik(gueltig.map((l) => l.werte[k]))]));
  const m = medianLauf(gueltig);
  return {
    ...ansicht,
    gueltig: gueltig.length,
    laeufe: laeufe.map(({ lauf, werte, fehler, attrappen }) => ({ lauf, werte, fehler: fehler ?? null, attrappen: attrappen ?? null })),
    attrappen: summeAttrappen(laeufe),
    statistik: stat,
    medianLauf: m ? { lauf: m.lauf, werte: m.werte, ursachen: m.ursachen } : null,
  };
}

/** Vergleich zweier Messungen je Ansicht und Kennwert (Median nachher minus vorher). */
export function vergleiche(vorher, nachher) {
  return nachher.map((n) => {
    const v = vorher.find((x) => x.pfad === n.pfad);
    const diff = Object.fromEntries(KENNWERTE.map(({ k }) => {
      const a = v?.statistik?.[k]?.median;
      const b = n.statistik?.[k]?.median;
      return [k, typeof a === 'number' && typeof b === 'number' ? { vorher: a, nachher: b, differenz: b - a } : null];
    }));
    return { id: n.id, pfad: n.pfad, diff };
  });
}

const fmt = (n, stellen = 0) => (typeof n === 'number' && Number.isFinite(n)
  ? n.toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen }) : 'n. g.');
const zelle = (v) => String(v ?? 'n. g.').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
export function tabelle(kopf, zeilen) {
  return [`| ${kopf.join(' | ')} |`, `|${kopf.map(() => '---').join('|')}|`, ...zeilen.map((z) => `| ${z.map(zelle).join(' | ')} |`)].join('\n');
}
const spanne = (s, w) => (s ? `${fmt(s.median, w.stellen)}${w.einheit} (${fmt(s.min, w.stellen)} bis ${fmt(s.max, w.stellen)})` : 'n. g.');

export function markdown(kopf, ansichten, vergleich) {
  const z = [];
  z.push(`# Leistung mobil · ${kopf.marke}`, '');
  z.push(`Stand ${kopf.zeit} · Basis ${kopf.basis} · Lighthouse ${kopf.lighthouse} · Chrome ${kopf.chrome} · ${kopf.laeufe} Läufe je Ansicht, Median`, '');
  const d = kopf.drosselung;
  z.push(kopf.methode === 'devtools'
    ? `Maßstab: Lighthouse-Standardprofil mobil (${kopf.geraet}), angewandte Drosselung (devtools): Latenz ${fmt(d?.requestLatencyMs, 1)} ms je Anfrage, ${fmt(d?.downloadThroughputKbps, 1)} kbit/s, CPU ${fmt(d?.cpuSlowdownMultiplier)}-fach. Zeiten und Gewichte gemessen.`
    : `Maßstab: Lighthouse-Standardprofil mobil (${kopf.geraet}), simulierte Drosselung: Rundlaufzeit ${fmt(d?.rttMs)} ms, ${fmt(d?.throughputKbps, 1)} kbit/s, CPU ${fmt(d?.cpuSlowdownMultiplier)}-fach. Gewicht und Dateien gemessen (Übertragung), Zeiten simuliert.`, '');
  z.push('## Übersicht (Median, Spanne)', '');
  z.push(tabelle(['Ansicht', 'Läufe', ...KENNWERTE.map((w) => w.name)], ansichten.map((a) => [
    `${a.name} (${a.pfad})`, `${a.gueltig}/${kopf.laeufe}`, ...KENNWERTE.map((w) => spanne(a.statistik[w.k], w)),
  ])), '');
  if (vergleich) {
    z.push('## Vergleich mit der Vorher-Messung (Median)', '');
    z.push(tabelle(['Ansicht', ...KENNWERTE.map((w) => w.name)], vergleich.map((v) => [
      v.pfad, ...KENNWERTE.map((w) => (v.diff[w.k] ? `${fmt(v.diff[w.k].vorher, w.stellen)} → ${fmt(v.diff[w.k].nachher, w.stellen)}` : 'n. g.')),
    ])), '');
  }
  for (const a of ansichten) {
    z.push(`## ${a.name} · ${a.pfad}`, '');
    const m = a.medianLauf;
    if (!m) { z.push('Keine gültige Messung.', ''); continue; }
    const u = m.ursachen;
    const p = u.lcpPhasen;
    z.push(`Medianlauf ${m.lauf}: Leistung ${fmt(m.werte.leistung)}, LCP ${fmt(m.werte.lcp)} ms, TBT ${fmt(m.werte.tbt)} ms.`, '');
    z.push(`- LCP-Element: ${zelle(u.lcpElement?.selektor)} · ${zelle(u.lcpElement?.ausschnitt)}`);
    z.push(`- LCP-Phasen (${kopf.methode === 'devtools' ? 'gemessen' : 'simuliert'}): Serverantwort ${fmt(p.serverantwort)} ms, Ladeverzögerung ${fmt(p.ladeverzoegerung)} ms, Ladedauer ${fmt(p.ladedauer)} ms, Darstellungsverzögerung ${fmt(p.darstellungsverzoegerung)} ms`);
    z.push(`- Hauptthread ${fmt(u.hauptthreadMs)} ms; Inline-Skripte im Dokument ${fmt(u.dokumentSkriptMs)} ms`);
    const at = a.attrappen;
    z.push(at
      ? `- Attrappen (G5) in ${at.laeufe} Läufen: ${ATTRAPPEN_ARTEN.map((k) => `${k} ${at[k]}`).join(', ')}${at.fremdHosts.length ? ` (fremde Hosts: ${at.fremdHosts.join(', ')})` : ''}`
      : '- Attrappen (G5): nicht gezählt');
    z.push(`- Blockierend: ${u.blockierend.length ? u.blockierend.map((b) => `${b.datei} (${fmt(b.kb, 1)} KB, ${fmt(b.ms)} ms)`).join('; ') : 'nichts'}`, '');
    if (u.skripte.length) {
      z.push(tabelle(['Skript', 'KB', 'Ausführung ms', 'ungenutzt KB', 'Priorität'], u.skripte.map((s) => [s.datei, fmt(s.kb, 1), s.ausfuehrungMs, fmt(s.ungenutztKB, 1), s.prioritaet])), '');
    }
    if (u.langeAufgaben.length) {
      z.push(tabelle(['Lange Aufgabe', 'Start ms', 'Dauer ms'], u.langeAufgaben.map((t) => [t.datei, t.startMs, t.dauerMs])), '');
    }
    if (u.befunde.length) {
      z.push(tabelle(['Befund (Score unter 0,9)', 'Anzeige', 'Einsparung ms', 'Einsparung KB'], u.befunde.map((b) => [b.id, b.anzeige, b.einsparungMs, fmt(b.einsparungKB, 1)])), '');
    }
  }
  return `${z.join('\n')}\n`;
}

/** Argumente wie lib.mjs; eigene Fassung, weil lib.mjs erst nach dem Setzen der Basis geladen werden darf. */
export function argumente(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const naechstes = argv[i + 1];
      if (naechstes === undefined || naechstes.startsWith('--')) a[t.slice(2)] = true;
      else { a[t.slice(2)] = naechstes; i += 1; }
    } else a._.push(t);
  }
  return a;
}

// ---------------------------------------------------------------------------
// Lauf (nur beim direkten Aufruf; der Selbsttest lädt weder Lighthouse noch Playwright)
// ---------------------------------------------------------------------------
async function main() {
  const args = argumente(process.argv.slice(2));
  for (const k of ['basis', 'ansichten', 'laeufe', 'methode', 'marke', 'vorher', 'ziel', 'roh']) {
    if (args[k] === true) throw new Bedienfehler(`--${k} braucht einen Wert`);
  }
  const basis = basisWaehlen(args.basis);
  // Attrappen und Ursprungsprüfung in lib.mjs richten sich nach SM24_BASIS_URL: vor dem Laden setzen.
  process.env.SM24_BASIS_URL = basis;
  const lib = await import('./lib.mjs');
  const { default: lighthouse } = await import('lighthouse');
  const { launch } = await import('chrome-launcher');

  const laeufe = args.laeufe === undefined ? 3 : Number(args.laeufe);
  if (!Number.isInteger(laeufe) || laeufe < 1 || laeufe > 10) throw new Bedienfehler('--laeufe braucht eine ganze Zahl von 1 bis 10');
  const methode = methodeWaehlen(args.methode);
  const marke = String(args.marke ?? 'messung').replace(/[^a-zA-Z0-9-]+/g, '-');
  const ansichten = ansichtenWaehlen(args.ansichten);
  const vorherDatei = args.vorher ? JSON.parse(readFileSync(path.resolve(args.vorher), 'utf8')) : null;
  if (vorherDatei && methodeVon(vorherDatei) !== methode) {
    throw new Bedienfehler(`--vorher wurde mit --methode ${methodeVon(vorherDatei)} gemessen, dieser Lauf mit ${methode}; nur gleiche Maßstäbe vergleichen`);
  }
  const vorher = vorherDatei?.ansichten ?? null;
  const ziel = lib.ordner(path.resolve(args.ziel ?? path.join(lib.PROTOKOLLE, 'FA-SEO-03')));
  const roh = lib.ordner(path.resolve(args.roh ?? path.join(lib.PROTOKOLLE, 'roh', 'FA-SEO-03')));
  const stamm = `${marke}-${lib.zeitstempel()}`;

  let info = null;
  async function einLauf(url) {
    const chrome = await launch({ chromePath: lib.CHROMIUM, chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'], logLevel: 'silent' });
    let verbindung = null;
    try {
      verbindung = await lib.chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
      const abgefangen = await lib.attrappenSetzen(verbindung.contexts()[0]);
      const e = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance'], throttlingMethod: methode });
      return { lhr: e.lhr, abgefangen };
    } finally {
      await verbindung?.close().catch(() => {});
      await chrome.kill();
    }
  }

  const ergebnisse = [];
  for (const a of ansichten) {
    const daten = [];
    for (let n = 1; n <= laeufe; n += 1) {
      const t0 = Date.now();
      try {
        const { lhr, abgefangen } = await einLauf(basis + a.pfad);
        const attrappen = zaehleAttrappen(abgefangen);
        info ??= {
          lighthouse: lhr.lighthouseVersion,
          chrome: (lhr.userAgent ?? '').match(/Chrome\/([\d.]+)/)?.[1] ?? 'n. g.',
          drosselung: lhr.configSettings?.throttling ?? null,
          geraet: `${lhr.configSettings?.screenEmulation?.width} × ${lhr.configSettings?.screenEmulation?.height}, DPR ${lhr.configSettings?.screenEmulation?.deviceScaleFactor}, ${lhr.configSettings?.formFactor}`,
        };
        const fehler = lhr.runtimeError ? `${lhr.runtimeError.code}: ${lhr.runtimeError.message}`.slice(0, 300) : null;
        writeFileSync(path.join(roh, `${stamm}-${a.id}-lauf${n}.lhr.json`), JSON.stringify(lhr));
        daten.push({ lauf: n, fehler, attrappen, werte: fehler ? null : werteAus(lhr), ursachen: fehler ? null : ursachenAus(lhr, basis) });
        const w = daten.at(-1).werte;
        process.stderr.write(`[${a.id}] Lauf ${n}: ${fehler ?? `Leistung ${w.leistung}, LCP ${Math.round(w.lcp)} ms, TBT ${Math.round(w.tbt)} ms`} (${Math.round((Date.now() - t0) / 1000)} s)\n`);
      } catch (e) {
        daten.push({ lauf: n, fehler: `Technischer Fehler: ${String(e?.message ?? e).slice(0, 300)}`, werte: null, ursachen: null });
        process.stderr.write(`[${a.id}] Lauf ${n}: ${daten.at(-1).fehler}\n`);
      }
    }
    ergebnisse.push(fasseZusammen(a, daten));
  }

  const kopf = {
    skript: 'leistung', marke, methode, zeit: new Date().toISOString(), basis, laeufe,
    lighthouse: info?.lighthouse ?? 'n. g.', chrome: info?.chrome ?? 'n. g.', drosselung: info?.drosselung ?? null, geraet: info?.geraet ?? 'n. g.',
  };
  const vergleich = vorher ? vergleiche(vorher, ergebnisse) : null;
  const jsonDatei = path.join(ziel, `leistung-${stamm}.json`);
  const mdDatei = path.join(ziel, `leistung-${stamm}.md`);
  writeFileSync(jsonDatei, `${JSON.stringify({ ...kopf, ansichten: ergebnisse, vergleich }, null, 2)}\n`);
  writeFileSync(mdDatei, markdown(kopf, ergebnisse, vergleich));
  console.log(tabelle(['Ansicht', 'Läufe', 'Leistung', 'LCP ms', 'TBT ms', 'CLS', 'Attrappen (G5)'], ergebnisse.map((a) => [
    a.pfad, `${a.gueltig}/${laeufe}`, fmt(a.statistik.leistung?.median), fmt(a.statistik.lcp?.median), fmt(a.statistik.tbt?.median), fmt(a.statistik.cls?.median, 3),
    a.attrappen ? ATTRAPPEN_ARTEN.map((k) => a.attrappen[k]).reduce((x, y) => x + y, 0) : 'n. g.',
  ])));
  console.log(`\nJSON: ${jsonDatei}\nMarkdown: ${mdDatei}\nRohdaten: ${roh}`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().then((c) => { process.exitCode = c; }).catch((e) => {
    if (e instanceof Bedienfehler) { console.error(`Bedienfehler: ${e.message}`); process.exitCode = 2; return; }
    console.error(`Technischer Fehler: ${e?.stack ?? e}`);
    process.exitCode = 1;
  });
}
