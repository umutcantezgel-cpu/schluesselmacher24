#!/usr/bin/env node
// leistung-diagnose.mjs – Leistungsdiagnose mobil je Hauptansicht (Paket E5-PRUEFER-02, Anforderung EL-33, Kriterien Z-15 und Z-16).
// Aufruf: node leistung-diagnose.mjs [--routen a,b] [--laeufe 3] [--ziel <ordner>] [--roh <ordner>]
// Messung wie lighthouse.mjs: je Lauf ein frischer Chrome, attrappenSetzen() aus lib.mjs (G5), Profil mobil,
// Lighthouse-Standard mit simulierter Drosselung. Gewertet wird der Medianlauf: der Lauf mit der mittleren Leistung,
// bei Gleichstand der mit dem niedrigeren LCP (so wählt Lighthouse CI seinen Medianlauf). Medianwerte je Kennzahl wie
// in lighthouse.mjs (Median, Minimum, Maximum).
// Zusammenfassung als JSON und Markdown nach --ziel (Standard protokolle/E5-PRUEFER-02/).
// Volles Lighthouse-JSON je Lauf und Trace des Medianlaufs nach --roh (Standard protokolle/roh/E5-PRUEFER-02/, nie committet).
// Exit: 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import {
  HAUPTANSICHTEN, PROTOKOLLE, BASIS_URL, CHROMIUM, argumente, chromium, attrappenSetzen, zeitstempel, ordner,
} from './lib.mjs';

const KATEGORIEN = ['performance', 'accessibility', 'best-practices', 'seo'];
const CHROME_FLAGS = ['--headless=new', '--no-sandbox', '--disable-gpu'];
const BUDGET = { leistung: 90, kategorie: 100, lcp: 2500, cls: 0.1, inp: 200 };
const ZIEL_STANDARD = path.join(PROTOKOLLE, 'E5-PRUEFER-02');
const ROH_STANDARD = path.join(PROTOKOLLE, 'roh', 'E5-PRUEFER-02');
const ATTRAPEN_ARTEN = ['fremd', 'upload', 'action-schreibend', 'action-unbekannt', 'post-sonstig'];
const NICHT_GEWERTET = ['informative', 'manual', 'notApplicable'];
const WERTE = ['leistung', 'barrierefreiheit', 'bestPractices', 'seo', 'lcp', 'cls', 'tbt', 'inp'];

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const slug = (p) => (p === '/' ? 'start' : p.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase());
const kurz = (s, n = 180) => (typeof s === 'string' && s.length > n ? `${s.slice(0, n - 3)}...` : (s ?? null));
const r0 = (n) => (typeof n === 'number' && Number.isFinite(n) ? Math.round(n) : null);
const fmt = (n, stellen = 0) => (typeof n === 'number' && Number.isFinite(n)
  ? n.toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen }) : 'n. g.');
const kb = (b) => (typeof b === 'number' ? `${fmt(b / 1024, 1)} KB` : 'n. g.');
const zelle = (v) => String(v ?? 'n. g.').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const adresse = (u) => {
  if (typeof u !== 'string') return 'n. g.';
  if (u === 'Unattributable') return 'nicht zuordenbar';
  try {
    const x = new URL(u);
    return x.origin === BASIS_URL ? `${x.pathname}${x.search}` : `${x.host}${x.pathname}`;
  } catch { return kurz(u, 120); }
};
function tabelle(kopf, zeilen) {
  return [
    `| ${kopf.join(' | ')} |`,
    `|${kopf.map(() => '---').join('|')}|`,
    ...zeilen.map((z) => `| ${z.map(zelle).join(' | ')} |`),
  ].join('\n');
}

const med = (liste) => {
  const s = [...liste].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
function statistik(liste) {
  const v = liste.filter((x) => typeof x === 'number' && Number.isFinite(x));
  return v.length ? { median: med(v), min: Math.min(...v), max: Math.max(...v), n: v.length } : null;
}
const spanne = (s, stellen = 0, einheit = '') => (s
  ? `${fmt(s.median, stellen)}${einheit} (${fmt(s.min, stellen)} bis ${fmt(s.max, stellen)})` : 'n. g.');

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

/** Werte eines erfolgreichen Laufs (wie lighthouse.mjs). */
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

/** Budgetverfehlungen auf den Medianwerten. */
function verfehlt(s) {
  const m = (k) => s[k]?.median ?? null;
  const liste = [];
  if (m('leistung') !== null && m('leistung') < BUDGET.leistung) liste.push(`Leistung ${fmt(m('leistung'))}`);
  if (m('lcp') !== null && m('lcp') > BUDGET.lcp) liste.push(`LCP ${fmt(m('lcp'))} ms`);
  if (m('cls') !== null && m('cls') > BUDGET.cls) liste.push(`CLS ${fmt(m('cls'), 3)}`);
  if (m('inp') !== null && m('inp') > BUDGET.inp) liste.push(`INP ${fmt(m('inp'))} ms`);
  for (const [k, name] of [['barrierefreiheit', 'Barrierefreiheit'], ['bestPractices', 'Best Practices'], ['seo', 'SEO']]) {
    if (m(k) !== null && m(k) < BUDGET.kategorie) liste.push(`${name} ${fmt(m(k))}`);
  }
  return liste;
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

const eintraege = (lhr, id) => (Array.isArray(lhr.audits?.[id]?.details?.items) ? lhr.audits[id].details.items : []);
const wert = (lhr, id) => (typeof lhr.audits?.[id]?.numericValue === 'number' ? lhr.audits[id].numericValue : null);

/**
 * LCP-Element, Art und Phasen aus dem Lighthouse-Audit largest-contentful-paint-element.
 * Im Modus simulate summieren sich die Phasen auf den berichteten (simulierten) LCP.
 */
function lcpAnalyse(lhr, artifacts) {
  const element = artifacts?.TraceElements?.find((e) => e.traceEventType === 'largest-contentful-paint') ?? null;
  const tabellen = eintraege(lhr, 'largest-contentful-paint-element');
  const knoten = tabellen.find((t) => t?.items?.[0]?.node)?.items[0].node ?? element?.node ?? null;
  const phasenListe = tabellen.find((t) => t?.items?.[0]?.phase !== undefined)?.items ?? [];
  const phasen = Object.fromEntries(phasenListe.map((p) => [p.phase, typeof p.timing === 'number' ? r0(p.timing) : null]));
  const teile = {
    serverantwort: phasen.TTFB ?? null,
    ladeverzoegerung: phasen['Load Delay'] ?? null,
    ladedauer: phasen['Load Time'] ?? null,
    darstellungsverzoegerung: phasen['Render Delay'] ?? null,
  };
  const werte = Object.values(teile);
  const summeMs = werte.every((v) => typeof v === 'number') ? werte.reduce((s, v) => s + v, 0) : null;
  const tag = (knoten?.snippet ?? '').match(/^<\s*([a-zA-Z][\w-]*)/)?.[1]?.toLowerCase() ?? null;
  const quelle = (knoten?.snippet ?? '').match(/\ssrc="([^"]+)"/)?.[1] ?? null;
  const traceTyp = element?.type ?? null;
  let typ = 'unbekannt';
  if (tag === 'svg') typ = 'SVG (Element)';
  else if (tag === 'img' && quelle && /\.svg(\?|$)/i.test(quelle)) typ = 'Bild (SVG-Datei)';
  else if (traceTyp === 'text') typ = 'Text';
  else if (traceTyp === 'image' && ['img', 'picture', 'source'].includes(tag)) typ = 'Bild';
  else if (traceTyp === 'image') typ = 'Bild (CSS oder sonstiges Element)';
  const anteil = (v) => (summeMs && typeof v === 'number' ? Math.round((100 * v) / summeMs) : null);
  return {
    selektor: knoten?.selector ?? null,
    bezeichnung: knoten?.nodeLabel ?? null,
    ausschnitt: kurz(knoten?.snippet ?? null, 200),
    typ,
    traceTyp,
    quelle,
    lcpMs: r0(wert(lhr, 'largest-contentful-paint')),
    summeMs,
    phasen: Object.fromEntries(Object.entries(teile).map(([k, v]) => [k, { ms: v, anteilProzent: anteil(v) }])),
  };
}

function befundeLeistung(lhr) {
  return (lhr.categories?.performance?.auditRefs ?? [])
    .map((r) => ({ r, a: lhr.audits?.[r.id] }))
    .filter(({ a }) => a && a.score !== null && a.score < 1 && !NICHT_GEWERTET.includes(a.scoreDisplayMode))
    .map(({ r, a }) => ({
      id: r.id,
      titel: a.title,
      gruppe: r.group,
      gewicht: r.weight,
      anzeige: a.displayValue ?? null,
      einsparungMs: r0(a.details?.overallSavingsMs),
      einsparungBytes: r0(a.details?.overallSavingsBytes),
      anzahl: Array.isArray(a.details?.items) ? a.details.items.length : null,
    }))
    .sort((x, y) => (y.einsparungMs ?? 0) - (x.einsparungMs ?? 0));
}

function eintragText(i) {
  if (typeof i === 'string') return kurz(i, 200);
  if (i && typeof i === 'object') {
    if (i.node) return kurz(`${i.node.selector ?? ''} ${i.node.snippet ?? ''}`.trim(), 200);
    if (i.source?.type === 'node') return kurz(`${i.source.selector ?? ''} ${i.source.snippet ?? ''}`.trim(), 200);
    if (i.source?.url) return kurz(`${i.source.url}${i.source.line !== undefined ? `, Zeile ${i.source.line + 1}` : ''}`, 200);
    if (typeof i.href === 'string') return kurz(`Link ${i.href}${i.text !== undefined ? ` mit Text „${i.text}“` : ''}`, 200);
    return kurz(JSON.stringify(i), 200);
  }
  return String(i);
}

function befundeSeo(lhr) {
  return (lhr.categories?.seo?.auditRefs ?? [])
    .map((r) => ({ r, a: lhr.audits?.[r.id] }))
    .filter(({ a }) => a && a.score !== null && a.score < 1 && !NICHT_GEWERTET.includes(a.scoreDisplayMode))
    .map(({ r, a }) => ({
      id: r.id,
      titel: a.title,
      gewicht: r.weight,
      erklaerung: kurz(a.explanation ?? null, 300),
      anzahl: Array.isArray(a.details?.items) ? a.details.items.length : null,
      betroffen: (a.details?.items ?? []).slice(0, 10).map(eintragText),
    }));
}

/** Auswertung eines Laufs: Ursachen nach Kategorien, alle Zahlen aus dem Lighthouse-JSON. */
function analysiere(lhr, artifacts) {
  const lcp = lcpAnalyse(lhr, artifacts);
  const netz = eintraege(lhr, 'network-requests');
  const nachTyp = (typ) => netz.filter((r) => r.resourceType === typ).map((r) => ({
    url: r.url, uebertragungBytes: r.transferSize ?? null, ressourceBytes: r.resourceSize ?? null,
  }));
  // Je Adresse das Skript-Eintrag bevorzugen: dieselbe Adresse kann auch als Fetch vorkommen.
  const netzPerUrl = new Map();
  for (const r of netz) {
    if (r.resourceType === 'Script' || !netzPerUrl.has(r.url)) netzPerUrl.set(r.url, r);
  }
  const boot = new Map(eintraege(lhr, 'bootup-time').map((i) => [i.url, i]));
  const ungenutzt = new Map(eintraege(lhr, 'unused-javascript').map((i) => [i.url, i]));
  const dokumentEintrag = netz.find((r) => r.resourceType === 'Document') ?? null;
  const dokumentUrl = dokumentEintrag?.url ?? lhr.finalUrl ?? null;
  const skriptUrls = [...new Set([...nachTyp('Script').map((s) => s.url), ...boot.keys()])]
    .filter((url) => url !== 'Unattributable' && url !== dokumentUrl);
  const skripte = skriptUrls.map((url) => {
    const n = netzPerUrl.get(url);
    const b = boot.get(url);
    const u = ungenutzt.get(url);
    return {
      url,
      uebertragungBytes: n?.transferSize ?? null,
      ausfuehrungMs: r0(b?.scripting),
      parsenMs: r0(b?.scriptParseCompile),
      gesamtMs: r0(b?.total),
      ungenutztBytes: r0(u?.wastedBytes),
      ungenutztProzent: typeof u?.wastedPercent === 'number' ? Math.round(u.wastedPercent) : null,
    };
  }).sort((a, b) => (b.uebertragungBytes ?? 0) - (a.uebertragungBytes ?? 0));
  const dokumentBoot = boot.get(dokumentUrl);
  const dokument = dokumentUrl ? {
    url: dokumentUrl,
    uebertragungBytes: dokumentEintrag?.transferSize ?? null,
    inlineAusfuehrungMs: r0(dokumentBoot?.scripting),
    inlineParsenMs: r0(dokumentBoot?.scriptParseCompile),
  } : null;
  const lange = eintraege(lhr, 'long-tasks')
    .map((i) => ({ url: i.url ?? null, startMs: r0(i.startTime), dauerMs: r0(i.duration) }))
    .sort((a, b) => (b.dauerMs ?? 0) - (a.dauerMs ?? 0));
  const lcpMs = lcp.lcpMs;
  const bisLcp = lange.filter((t) => t.startMs !== null && lcpMs !== null && t.startMs <= lcpMs);
  const layoutShifts = eintraege(lhr, 'layout-shifts').map((i) => ({
    selektor: i.node?.selector ?? null,
    ausschnitt: kurz(i.node?.snippet ?? null, 140),
    wert: typeof i.score === 'number' ? Number(i.score.toFixed(4)) : null,
    ursachen: (i.subItems?.items ?? []).map((s) => kurz(JSON.stringify(s), 200)),
  })).sort((a, b) => (b.wert ?? 0) - (a.wert ?? 0));
  return {
    lcp,
    dokument,
    blockierend: eintraege(lhr, 'render-blocking-resources').map((i) => ({
      url: i.url, bytes: i.totalBytes ?? null, verzoegerungMs: r0(i.wastedMs),
    })).sort((a, b) => (b.verzoegerungMs ?? 0) - (a.verzoegerungMs ?? 0)),
    skripte,
    stylesheets: nachTyp('Stylesheet'),
    schriften: {
      dateien: nachTyp('Font'),
      fontDisplay: eintraege(lhr, 'font-display').map((i) => ({ url: i.url, verzoegerungMs: r0(i.wastedMs) })),
    },
    hauptthread: {
      gesamtMs: r0(wert(lhr, 'mainthread-work-breakdown')),
      gruppen: eintraege(lhr, 'mainthread-work-breakdown').map((i) => ({ gruppe: i.groupLabel, ms: r0(i.duration) })),
      nichtZugeordnetMs: r0(boot.get('Unattributable')?.scripting),
    },
    langeAufgaben: {
      anzahl: lange.length,
      bisLcpAnzahl: bisLcp.length,
      bisLcpSummeMs: bisLcp.reduce((s, t) => s + (t.dauerMs ?? 0), 0),
      groesste: lange.slice(0, 8),
    },
    tbt: {
      ms: r0(wert(lhr, 'total-blocking-time')),
      verursacher: lange.slice(0, 5).map((t) => ({ ...t, blockierendMs: Math.max(0, (t.dauerMs ?? 0) - 50) })),
    },
    cls: { wert: wert(lhr, 'cumulative-layout-shift'), verursacher: layoutShifts.slice(0, 8) },
    befundeLeistung: befundeLeistung(lhr),
    befundeSeo: befundeSeo(lhr),
  };
}

/** Ein frischer Chrome, Attrappen über CDP, dann Lighthouse im selben Browser (wie lighthouse.mjs). */
async function einLauf(url) {
  const chrome = await launch({ chromePath: CHROMIUM, chromeFlags: CHROME_FLAGS, logLevel: 'silent' });
  let verbindung = null;
  try {
    verbindung = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
    const abgefangen = await attrappenSetzen(verbindung.contexts()[0]);
    const ergebnis = await lighthouse(url, {
      port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: KATEGORIEN,
    });
    return { lhr: ergebnis.lhr, artifacts: ergebnis.artifacts, abgefangen };
  } finally {
    await verbindung?.close().catch(() => {});
    await chrome.kill();
  }
}

/** Medianlauf: mittlere Leistung, bei Gleichstand niedrigerer LCP. */
function medianLauf(laufe) {
  const gueltig = laufe.filter((l) => l.werte && typeof l.werte.leistung === 'number');
  if (!gueltig.length) return null;
  const sortiert = [...gueltig].sort((a, b) => (a.werte.leistung - b.werte.leistung)
    || ((a.werte.lcp ?? Infinity) - (b.werte.lcp ?? Infinity)));
  return sortiert[Math.floor((sortiert.length - 1) / 2)];
}

async function messeRoute(r, laeufe, rohOrdner) {
  const url = BASIS_URL + r.pfad;
  const daten = [];
  for (let n = 1; n <= laeufe; n += 1) {
    const start = Date.now();
    process.stderr.write(`[${r.id}] Lauf ${n} von ${laeufe} ...\n`);
    try {
      const { lhr, artifacts, abgefangen } = await einLauf(url);
      const fehler = lhr.runtimeError ? `${lhr.runtimeError.code}: ${lhr.runtimeError.message}`.slice(0, 300) : null;
      const werte = fehler ? null : werteAus(lhr);
      const analyse = fehler ? null : analysiere(lhr, artifacts);
      daten.push({
        kompakt: {
          lauf: n,
          endadresse: lhr.finalDisplayedUrl ?? lhr.finalUrl ?? url,
          fehler,
          werte,
          lcp: analyse?.lcp ?? null,
          attrappen: zaehleAttrappen(abgefangen),
          lighthouse: lhr.lighthouseVersion,
          browser: lhr.userAgent,
          drosselung: lhr.configSettings?.throttling ?? null,
          dauerSek: Math.round((Date.now() - start) / 1000),
        },
        lhr,
        trace: artifacts?.Trace ?? null,
        analyse,
      });
      const w = werte ?? {};
      process.stderr.write(`[${r.id}] Lauf ${n}: ${fehler ? `Befund ${fehler}` : `Leistung ${w.leistung}, LCP ${fmt(w.lcp)} ms`} (${Math.round((Date.now() - start) / 1000)} s)\n`);
    } catch (e) {
      const meldung = `Technischer Fehler: ${String(e?.message ?? e).slice(0, 300)}`;
      daten.push({
        kompakt: {
          lauf: n, endadresse: url, fehler: meldung, werte: null, lcp: null, attrappen: null,
          lighthouse: null, browser: null, drosselung: null, dauerSek: Math.round((Date.now() - start) / 1000),
        },
        lhr: null, trace: null, analyse: null,
      });
      process.stderr.write(`[${r.id}] Lauf ${n}: ${meldung}\n`);
    }
  }
  const gueltig = daten.filter((d) => d.kompakt.werte);
  const stat = Object.fromEntries(WERTE.map((k) => [k, statistik(gueltig.map((d) => d.kompakt.werte[k]))]));
  const median = medianLauf(gueltig.map((d) => ({ lauf: d.kompakt.lauf, werte: d.kompakt.werte, eintrag: d })));
  for (const d of daten) {
    if (!d.lhr) continue;
    writeFileSync(path.join(rohOrdner, `${r.id}-lauf${d.kompakt.lauf}.lhr.json`), JSON.stringify(d.lhr));
  }
  let medianAnalyse = null;
  if (median) {
    const e = median.eintrag;
    if (e.trace) {
      writeFileSync(path.join(rohOrdner, `${r.id}-medianlauf${e.kompakt.lauf}.trace.json`), JSON.stringify(e.trace));
    }
    medianAnalyse = e.analyse;
  }
  return {
    ansicht: r.id,
    pfad: r.pfad,
    gueltigeLaeufe: gueltig.length,
    laeufe: daten.map((d) => d.kompakt),
    statistik: stat,
    verfehlt: verfehlt(stat),
    median: median ? { lauf: median.lauf, werte: median.werte, analyse: medianAnalyse } : null,
  };
}

/** Gemeinsame Ressourcen: Dateien, die in mehreren Ansichten im Medianlauf vorkommen. */
function gemeinsameRessourcen(ansichten) {
  const karte = new Map();
  for (const a of ansichten) {
    const an = a.median?.analyse;
    if (!an) continue;
    const liste = [
      ...an.blockierend.map((r) => ({ url: r.url, typ: 'blockierend', bytes: r.bytes, verzoegerungMs: r.verzoegerungMs, ausfuehrungMs: null })),
      ...an.skripte.map((s) => ({ url: s.url, typ: 'Skript', bytes: s.uebertragungBytes, verzoegerungMs: null, ausfuehrungMs: s.ausfuehrungMs })),
      ...an.stylesheets.map((s) => ({ url: s.url, typ: 'Stylesheet', bytes: s.uebertragungBytes, verzoegerungMs: null, ausfuehrungMs: null })),
      ...an.schriften.dateien.map((s) => ({ url: s.url, typ: 'Schrift', bytes: s.uebertragungBytes, verzoegerungMs: null, ausfuehrungMs: null })),
    ];
    for (const e of liste) {
      const k = karte.get(e.url) ?? {
        url: e.url, typen: new Set(), ansichten: new Set(), bytes: 0, verzoegerungMs: 0, ausfuehrungMs: 0,
      };
      k.typen.add(e.typ);
      k.ansichten.add(a.ansicht);
      k.bytes = Math.max(k.bytes, e.bytes ?? 0);
      k.verzoegerungMs = Math.max(k.verzoegerungMs, e.verzoegerungMs ?? 0);
      k.ausfuehrungMs = Math.max(k.ausfuehrungMs, e.ausfuehrungMs ?? 0);
      karte.set(e.url, k);
    }
  }
  return [...karte.values()]
    .map((k) => ({
      url: k.url,
      typen: [...k.typen],
      ansichten: k.ansichten.size,
      ansichtenListe: [...k.ansichten],
      bytes: k.bytes,
      verzoegerungMs: k.verzoegerungMs,
      ausfuehrungMs: k.ausfuehrungMs,
    }))
    .sort((a, b) => b.ansichten - a.ansichten || b.bytes - a.bytes || b.verzoegerungMs - a.verzoegerungMs);
}

function markdown(kopf, ansichten, gemeinsam) {
  const z = [];
  const d = kopf.drosselung;
  z.push('# Leistungsdiagnose mobil (E5-PRUEFER-02)', '');
  z.push(`Stand ${kopf.zeit} · Lighthouse ${kopf.lighthouse} · Chrome ${kopf.chrome} · ${kopf.laeufe} Läufe je Ansicht · Medianlauf: Lauf mit mittlerer Leistung, bei Gleichstand mit niedrigerem LCP`, '');
  z.push(`Budget: Leistung mindestens ${BUDGET.leistung}, LCP höchstens ${fmt(BUDGET.lcp)} ms, SEO ${BUDGET.kategorie}. Barrierefreiheit und Best Practices je ${BUDGET.kategorie}, CLS höchstens ${fmt(BUDGET.cls, 1)}.`, '');
  z.push(`Messung wie lighthouse.mjs: frischer Chrome je Lauf, Attrappen nach G5, Profil mobil. Drosselung der Lighthouse-Simulation: Netz-Rundlaufzeit ${d ? fmt(d.rttMs) : 'n. g.'} ms, Durchsatz ${d ? fmt(d.throughputKbps) : 'n. g.'} kbit/s, CPU ${d ? fmt(d.cpuSlowdownMultiplier) : 'n. g.'}-fach.`, '');
  z.push('Zeiten des LCP, seiner Phasen, der Blockierzeit (TBT) und des Hauptthreads stammen aus dieser Simulation. Die Phasen des LCP summieren sich auf den berichteten LCP. Übertragungsgrößen sind gemessen.', '');
  z.push('Der simulierte LCP ist der späteste Endzeitpunkt aller Netzanfragen (außer Bildern mit niedriger Priorität) und CPU-Aufgaben, die im beobachteten Lauf vor dem LCP enden. Dazu zählen Webschriften und Skripte, die vor der ersten Darstellung des Textes fertig werden. Median und LCP des Medianlaufs können abweichen; beide stehen in der Übersicht.', '');
  z.push('## Übersicht', '');
  z.push(tabelle(
    ['Ansicht', 'Läufe', 'Leistung Median (Spanne)', 'LCP Median (Spanne)', 'LCP des Medianlaufs', 'LCP-Element (Medianlauf)', 'LCP-Typ', 'SEO', 'CLS', 'TBT ms', 'Budget verfehlt'],
    ansichten.map((a) => [
      a.ansicht,
      `${a.gueltigeLaeufe} von ${kopf.laeufe}`,
      spanne(a.statistik.leistung, 0),
      spanne(a.statistik.lcp, 0, ' ms'),
      a.median ? `${fmt(a.median.werte.lcp)} ms` : 'n. g.',
      a.median?.analyse?.lcp.selektor ?? 'n. g.',
      a.median?.analyse?.lcp.typ ?? 'n. g.',
      a.statistik.seo ? fmt(a.statistik.seo.median) : 'n. g.',
      a.statistik.cls ? fmt(a.statistik.cls.median, 3) : 'n. g.',
      a.statistik.tbt ? fmt(a.statistik.tbt.median) : 'n. g.',
      a.verfehlt.length ? a.verfehlt.join(', ') : 'keine',
    ]),
  ), '');
  for (const a of ansichten) {
    z.push(`## ${a.ansicht} · ${a.pfad}`, '');
    const m = a.median;
    if (!m) { z.push('Keine gültige Messung.', ''); continue; }
    const an = m.analyse;
    const l = an.lcp;
    const p = l.phasen;
    const summe = (feld) => a.laeufe.reduce((s, x) => s + (x.attrappen?.[feld] ?? 0), 0);
    z.push(`Gültige Läufe ${a.gueltigeLaeufe} von ${kopf.laeufe}. Medianlauf: Lauf ${m.lauf} (Leistung ${fmt(m.werte.leistung)}, LCP ${fmt(m.werte.lcp)} ms, SEO ${fmt(m.werte.seo)}). Attrappen über alle Läufe: fremd ${summe('fremd')}, schreibend ${summe('action-schreibend') + summe('upload') + summe('post-sonstig')}, unbekannte Aktionen ${summe('action-unbekannt')}.`, '');
    z.push(`Budget verfehlt: ${a.verfehlt.length ? a.verfehlt.join(', ') : 'keine'}.`, '');
    z.push('### LCP', '');
    z.push(`- Element: ${l.selektor ?? 'n. g.'}, Typ ${l.typ}, Ausschnitt: ${zelle(l.ausschnitt)}`);
    z.push(`- Phasen (simuliert, Summe ${fmt(l.summeMs)} ms): Serverantwort ${fmt(p.serverantwort.ms)} ms (${p.serverantwort.anteilProzent ?? 'n. g.'} %); Ladeverzögerung ${fmt(p.ladeverzoegerung.ms)} ms (${p.ladeverzoegerung.anteilProzent ?? 'n. g.'} %); Ladedauer ${fmt(p.ladedauer.ms)} ms (${p.ladedauer.anteilProzent ?? 'n. g.'} %); Darstellungsverzögerung ${fmt(p.darstellungsverzoegerung.ms)} ms (${p.darstellungsverzoegerung.anteilProzent ?? 'n. g.'} %).`, '');
    z.push(`- Berichteter LCP ${fmt(l.lcpMs)} ms.`, '');
    if (an.dokument) {
      z.push('### HTML-Dokument', '');
      z.push(`Übertragung ${kb(an.dokument.uebertragungBytes)}; Inline-Skripte ${fmt(an.dokument.inlineAusfuehrungMs)} ms Ausführung, ${fmt(an.dokument.inlineParsenMs)} ms Parsen.`, '');
    }
    z.push('### Blockierende Ressourcen', '');
    z.push(an.blockierend.length
      ? tabelle(['Ressource', 'Größe', 'Verzögerung ms'], an.blockierend.map((r) => [adresse(r.url), kb(r.bytes), r.verzoegerungMs]))
      : 'Keine blockierenden Ressourcen.', '');
    z.push('### JavaScript je Skript', '');
    z.push(an.skripte.length
      ? tabelle(['Skript', 'Übertragung', 'Ausführung ms', 'Parsen ms', 'Ungenutzt', 'Ungenutzt %'], an.skripte.map((s) => [
        adresse(s.url), kb(s.uebertragungBytes), s.ausfuehrungMs, s.parsenMs, kb(s.ungenutztBytes), s.ungenutztProzent,
      ]))
      : 'Keine Skripte.', '');
    z.push('### Stylesheets und Schriften', '');
    z.push(an.stylesheets.length
      ? tabelle(['Stylesheet', 'Übertragung'], an.stylesheets.map((s) => [adresse(s.url), kb(s.uebertragungBytes)]))
      : 'Keine externen Stylesheets.', '');
    z.push(an.schriften.dateien.length
      ? tabelle(['Schrift', 'Übertragung'], an.schriften.dateien.map((s) => [adresse(s.url), kb(s.uebertragungBytes)]))
      : 'Keine Schriftdateien.', '');
    if (an.schriften.fontDisplay.length) {
      z.push('', tabelle(['Schrift (font-display)', 'Verzögerung ms'], an.schriften.fontDisplay.map((s) => [adresse(s.url), s.verzoegerungMs])), '');
    }
    z.push('### Hauptthread nach Kategorien', '');
    z.push(tabelle(['Kategorie', 'Zeit ms'], [...an.hauptthread.gruppen.map((g) => [g.gruppe, g.ms]), ['Gesamt', an.hauptthread.gesamtMs]]), '');
    z.push('### Lange Aufgaben bis zum LCP', '');
    z.push(`Lange Aufgaben insgesamt ${an.langeAufgaben.anzahl}, davon bis zum LCP ${an.langeAufgaben.bisLcpAnzahl} mit zusammen ${fmt(an.langeAufgaben.bisLcpSummeMs)} ms.`, '');
    if (an.langeAufgaben.groesste.length) {
      z.push(tabelle(['Start ms', 'Dauer ms', 'Zuordnung'], an.langeAufgaben.groesste.map((t) => [t.startMs, t.dauerMs, adresse(t.url)])), '');
    }
    z.push(`### Blockierzeit (TBT ${fmt(an.tbt.ms)} ms) und Verschiebungen (CLS ${fmt(an.cls.wert, 3)})`, '');
    if (an.tbt.verursacher.length) {
      z.push(tabelle(['TBT-Verursacher', 'Dauer ms', 'Blockierend ms'], an.tbt.verursacher.map((t) => [adresse(t.url), t.dauerMs, t.blockierendMs])), '');
    }
    if (an.cls.verursacher.length) {
      z.push(tabelle(['CLS-Element', 'Wert', 'Ursache'], an.cls.verursacher.map((c) => [c.selektor ?? c.ausschnitt, c.wert, c.ursachen.join('; ') || 'n. g.'])), '');
    } else {
      z.push('Keine Verschiebungen mit Verursacher.', '');
    }
    z.push('### Leistungsbefunde, nicht bestanden', '');
    z.push(an.befundeLeistung.length
      ? tabelle(['Audit', 'Wert', 'Einsparung ms', 'Einsparung KB', 'Anzahl'], an.befundeLeistung.map((b) => [
        `${b.id} (${b.titel})`, b.anzeige, b.einsparungMs, b.einsparungBytes !== null ? fmt(b.einsparungBytes / 1024, 1) : null, b.anzahl,
      ]))
      : 'Keine.', '');
    z.push('### SEO, nicht bestanden', '');
    if (an.befundeSeo.length) {
      for (const s of an.befundeSeo) {
        z.push(`- ${s.id} (${s.titel}), Gewicht ${fmt(s.gewicht, 1)}, Anzahl ${s.anzahl ?? 'n. g.'}${s.erklaerung ? `: ${s.erklaerung}` : ''}`);
        for (const b of s.betroffen) z.push(`  - ${zelle(b)}`);
      }
      z.push('');
    } else {
      z.push('Keine.', '');
    }
  }
  z.push('## Gemeinsame Ressourcen (Medianläufe)', '');
  z.push(tabelle(['Ressource', 'Typ', 'Ansichten', 'Größe', 'Verzögerung ms', 'Ausführung ms'], gemeinsam.slice(0, 40).map((g) => [
    adresse(g.url), g.typen.join(', '), `${g.ansichten} von ${ansichten.length}`, kb(g.bytes), g.verzoegerungMs, g.ausfuehrungMs,
  ])), '');
  return `${z.join('\n')}\n`;
}

async function main() {
  const args = argumente();
  for (const k of ['routen', 'laeufe', 'ziel', 'roh']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const laeufe = args.laeufe === undefined ? 3 : Number(args.laeufe);
  if (!Number.isInteger(laeufe) || laeufe < 1 || laeufe > 10) bedienfehler('--laeufe braucht eine ganze Zahl von 1 bis 10');
  const routen = routenWaehlen(args.routen);
  const zielOrdner = ordner(path.resolve(args.ziel ?? ZIEL_STANDARD));
  const rohOrdner = ordner(path.resolve(args.roh ?? ROH_STANDARD));

  const ansichten = [];
  for (const r of routen) ansichten.push(await messeRoute(r, laeufe, rohOrdner));

  const ersterLauf = ansichten.flatMap((a) => a.laeufe).find((l) => l.lighthouse);
  const version = ersterLauf?.lighthouse ?? 'n. g.';
  const chromeVersion = (ersterLauf?.browser ?? '').match(/(?:HeadlessChrome|Chrome)\/([\d.]+)/)?.[1] ?? 'n. g.';
  const kopf = {
    skript: 'leistung-diagnose',
    zeit: new Date().toISOString(),
    argumente: args,
    profil: 'mobil',
    laeufe,
    budget: BUDGET,
    lighthouse: version,
    chrome: chromeVersion,
    drosselung: ersterLauf?.drosselung ?? null,
    rohOrdner,
  };
  const gemeinsam = gemeinsameRessourcen(ansichten);
  const stamm = zeitstempel();
  const jsonDatei = path.join(zielOrdner, `leistung-diagnose-${stamm}.json`);
  const mdDatei = path.join(zielOrdner, `leistung-diagnose-${stamm}.md`);
  writeFileSync(jsonDatei, `${JSON.stringify({ ...kopf, routen: ansichten, gemeinsam }, null, 2)}\n`);
  writeFileSync(mdDatei, markdown(kopf, ansichten, gemeinsam));

  console.log(`Lighthouse ${version} · Chrome ${chromeVersion} · Profil mobil · ${laeufe} Läufe je Ansicht\n`);
  console.log(tabelle(
    ['Ansicht', 'Läufe', 'Leistung', 'LCP ms', 'SEO', 'Budget verfehlt'],
    ansichten.map((a) => [
      a.ansicht,
      `${a.gueltigeLaeufe}/${laeufe}`,
      spanne(a.statistik.leistung, 0),
      spanne(a.statistik.lcp, 0),
      a.statistik.seo ? fmt(a.statistik.seo.median) : 'n. g.',
      a.verfehlt.length ? a.verfehlt.join(', ') : 'keine',
    ]),
  ));
  console.log(`\nZusammenfassung JSON: ${jsonDatei}`);
  console.log(`Zusammenfassung Markdown: ${mdDatei}`);
  console.log(`Volle Berichte: ${rohOrdner}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
