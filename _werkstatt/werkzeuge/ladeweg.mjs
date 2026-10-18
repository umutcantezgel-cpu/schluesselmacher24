#!/usr/bin/env node
// ladeweg.mjs – Ladeweg je Ansicht (mobil, Drosselung und Gerät wie messung.mjs): Anfragen, Schriften, FCP, LCP,
// Long Tasks vor FCP, DOM-Größe, HTML-Größe.
// Aufruf: node ladeweg.mjs [--routen <pfad,pfad>] [--laeufe 3] [--basis <url>] [--json <datei>]
// Gerät: 390×844, Prozessor 4-fach gedrosselt (CDP), Netz „langsames 4G“ (150 ms, 1,6 Mbit/s herunter, 0,75 Mbit/s hoch).
// Je Lauf ein frischer Kontext. Laden bis das Netz ruht (networkidle), kein Durchscrollen, kein Klick.
// Anfragen über CDP (Network.requestWillBeSent, responseReceived, loadingFinished, loadingFailed).
//   Start = Wanduhrzeit der Anfrage minus performance.timeOrigin der Seite; Ende = Start + Dauer bis loadingFinished
//   (Monotonuhr des CDP); Bytes = encodedDataLength (übertragen, mit Kopfzeilen).
// FCP, LCP und Long Tasks: PerformanceObserver im Browser, dieselbe Zeitbasis (ms ab Navigationsbeginn).
// Schriften bei FCP: document.fonts im Augenblick des FCP-Eintrags; „nein (x von y)“ = nicht alle Schnitte geladen.
// Bytes vor FCP: nur Anfragen, die vor FCP abgeschlossen sind; laufende zählen als „unvollständig vor FCP“.
// Ausgabe: je Route Median der Läufe, Bytes vor FCP je Typ, Wasserfall des mittleren Laufs (Dokument, CSS, Schriften, Skripte).
// Mittlerer Lauf: der Lauf, dessen LCP dem Median am nächsten liegt (bei gleichem Abstand der frühere).
// --basis überschreibt BASIS_URL (z. B. http://localhost:3100 für E0); nur der Ursprung wird verwendet.
// Exit: 0 fertig (auch mit Befunden), 1 ein Lauf technisch gescheitert (Daten werden trotzdem geschrieben), 2 Bedienfehler.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  REPO, BASIS_URL, HAUPTANSICHTEN, GERAETE, PROTOKOLLE, argumente, browserStarten, kontextFuer, zeitstempel, ordner,
} from './lib.mjs';

const DROSSEL = { cpu: 4, latenzMs: 150, herunterMbit: 1.6, heraufMbit: 0.75 };
const SICHTBARE_TYPEN = ['Document', 'Stylesheet', 'Font', 'Script'];

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const slug = (p) => (p === '/' ? 'start' : p.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase());
const zelle = (v) => String(v ?? '–').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
const fmt = (n, stellen) => n.toFixed(stellen).replace('.', ',');
const zahl = (n, stellen) => (Number.isFinite(n) ? fmt(n, stellen) : '–');
const kb = (bytes) => bytes / 1024;
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
  if (text === true) bedienfehler('--routen braucht eine Liste, z. B. --routen /,/schliessanlagen');
  return text.split(',').map((t) => t.trim()).filter(Boolean).map((t) => {
    const v = HAUPTANSICHTEN.find((h) => h.id === t || h.pfad === t);
    if (v) return { id: v.id, pfad: v.pfad };
    if (t.startsWith('/')) return { id: slug(t), pfad: t };
    return bedienfehler(`unbekannte Route „${t}“`);
  });
}
function basisWaehlen(text) {
  if (text === undefined) return new URL(BASIS_URL).origin;
  if (text === true) bedienfehler('--basis braucht eine Adresse, z. B. --basis http://localhost:3100');
  let u = null;
  try { u = new URL(text); } catch { u = null; }
  if (!u || !['http:', 'https:'].includes(u.protocol)) bedienfehler(`--basis „${text}“ ist keine http(s)-Adresse`);
  return u.origin;
}
/** Median über endliche Zahlen; null, wenn keine vorhanden ist. */
function medianVon(liste) {
  const s = liste.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (!s.length) return null;
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
/** Adresse ohne Host, gekürzt; Anfragen an fremde Ursprünge mit Marke „[extern]“. */
function kurzUrl(text, basis) {
  try {
    const u = new URL(text);
    const p = `${u.pathname}${u.search}`;
    const teil = p.length > 72 ? `${p.slice(0, 69)}…` : p;
    return `${u.origin === basis ? '' : '[extern] '}${teil}`;
  } catch {
    return String(text).slice(0, 72);
  }
}

/**
 * Gleiche Regeln wie attrappenSetzen() aus lib.mjs, aber für den Ursprung `basis` (--basis).
 * lib.mjs bleibt unverändert; daher hier eine Kopie der Regeln.
 */
function leseActions() {
  const verzeichnisse = [process.env.SM24_NEXT_DIR, path.join(REPO, '.next'), path.join(REPO, '.next', 'dev'), '/root/sm24-e0/.next'].filter(Boolean);
  const ids = new Set();
  for (const v of verzeichnisse) {
    const datei = path.join(v, 'server', 'server-reference-manifest.json');
    if (!existsSync(datei)) continue;
    try {
      const m = JSON.parse(readFileSync(datei, 'utf8'));
      for (const [id, eintrag] of Object.entries(m.node ?? {})) {
        if (eintrag.filename === 'src/lib/actions/booking.ts' && /^fetch[A-Z]/.test(eintrag.exportedName)) ids.add(id);
      }
    } catch {
      // Unlesbares Manifest: keine Lese-Kennungen, also wird jede Action abgefangen.
    }
  }
  return ids;
}

async function attrappenFuer(context, basis) {
  const eigen = new URL(basis).origin;
  const abgefangen = [];
  let lesend = leseActions();
  await context.route('**/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const methode = req.method();
    if (url.origin !== eigen) {
      if (methode === 'GET' && /fonts\.(gstatic|googleapis)\.com$/.test(url.hostname)) return route.continue();
      abgefangen.push({ art: 'fremd', methode, url: url.hostname });
      return route.abort();
    }
    if (methode === 'GET' || methode === 'HEAD') return route.continue();
    if (url.pathname.startsWith('/api/kunden-upload')) {
      abgefangen.push({ art: 'upload', methode, url: url.pathname });
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, id: 'attrappe-upload', schluessel: 'attrappe' }),
      });
    }
    const action = req.headers()['next-action'];
    if (action && !lesend.has(action)) lesend = leseActions();
    if (action && lesend.has(action)) return route.continue();
    if (action) {
      abgefangen.push({ art: 'action', methode, url: url.pathname });
      return route.fulfill({ status: 200, contentType: 'text/x-component', body: '0:{"a":"$@1","f":"","b":"attrappe"}\n1:null\n' });
    }
    abgefangen.push({ art: 'post-sonstig', methode, url: url.pathname });
    return route.fulfill({ status: 204, body: '' });
  });
  return abgefangen;
}

/** Vor jedem Dokument: FCP mit Schriftstand, LCP mit Element, Long Tasks. Läuft im Browser ohne äußere Bezüge. */
function beobachtenLadeweg() {
  const m = (window.__sm24Ladeweg = { fcp: null, fcpSchriften: null, lcp: null, aufgaben: [] });
  const beobachte = (typ, fn) => {
    try { new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type: typ, buffered: true }); } catch (e) {}
  };
  beobachte('paint', (e) => {
    if (e.name !== 'first-contentful-paint' || m.fcp !== null) return;
    m.fcp = e.startTime;
    try {
      m.fcpSchriften = [...document.fonts].map((f) => ({ familie: String(f.family).replace(/["']/g, ''), status: f.status }));
    } catch (err) {
      m.fcpSchriften = null;
    }
  });
  beobachte('largest-contentful-paint', (e) => {
    const el = e.element;
    m.lcp = {
      zeit: e.startTime,
      tag: el ? el.tagName.toLowerCase() : null,
      klasse: el ? String(el.getAttribute('class') ?? '') : '',
      text: el ? String(el.textContent ?? '') : '',
      url: e.url || '',
    };
  });
  beobachte('longtask', (e) => { m.aufgaben.push({ start: e.startTime, dauer: e.duration }); });
}

/** Läuft im Browser nach dem Laden. Gibt Zeitbasis, Ereignisse und Zählungen zurück. */
function messenInPage() {
  const m = window.__sm24Ladeweg ?? { fcp: null, fcpSchriften: null, lcp: null, aufgaben: [] };
  return {
    timeOrigin: performance.timeOrigin,
    fcp: m.fcp,
    fcpSchriften: m.fcpSchriften,
    lcp: m.lcp,
    aufgaben: m.aufgaben,
    dom: document.querySelectorAll('*').length,
    schriftenEnde: [...document.fonts].map((f) => ({ familie: String(f.family).replace(/["']/g, ''), status: f.status })),
  };
}

/**
 * Schriften bei FCP je Familie. Angefordert = Schnitte, die nicht „unloaded“ sind (ungenutzte Schnitte zählen nicht).
 * ja: alle angeforderten geladen; nein (x von y): y angefordert, x geladen; ungenutzt: nichts angefordert.
 */
function schriftenText(liste) {
  if (liste === null) return '–';
  if (liste.length === 0) return 'keine Schrift registriert';
  const familien = new Map();
  for (const f of liste) {
    const e = familien.get(f.familie) ?? { angefordert: 0, geladen: 0 };
    if (f.status !== 'unloaded') e.angefordert += 1;
    if (f.status === 'loaded') e.geladen += 1;
    familien.set(f.familie, e);
  }
  return [...familien].map(([name, e]) => {
    if (e.angefordert === 0) return `${name} ungenutzt`;
    return `${name} ${e.geladen === e.angefordert ? 'ja' : `nein (${e.geladen} von ${e.angefordert})`}`;
  }).join('; ');
}

async function einLauf(browser, route, basis) {
  const context = await kontextFuer(browser, GERAETE[0]);
  try {
    const abgefangen = await attrappenFuer(context, basis);
    const page = await context.newPage();
    await page.addInitScript(beobachtenLadeweg);
    const cdp = await context.newCDPSession(page);
    const anfragen = new Map();
    cdp.on('Network.requestWillBeSent', (e) => {
      const vorhanden = anfragen.get(e.requestId);
      if (vorhanden) {
        // Weiterleitung: gleiche Kennung, neue Adresse; Start bleibt.
        vorhanden.url = e.request.url;
        return;
      }
      anfragen.set(e.requestId, {
        id: e.requestId,
        typ: e.type ?? null,
        prioritaet: e.request.initialPriority ?? null,
        url: e.request.url,
        t0: e.timestamp,
        wall: e.wallTime,
        dauerMs: null,
        bytes: 0,
        fehler: null,
      });
    });
    cdp.on('Network.responseReceived', (e) => {
      const a = anfragen.get(e.requestId);
      if (a && !a.typ) a.typ = e.type ?? null;
    });
    cdp.on('Network.loadingFinished', (e) => {
      const a = anfragen.get(e.requestId);
      if (!a) return;
      a.dauerMs = (e.timestamp - a.t0) * 1000;
      a.bytes = e.encodedDataLength ?? 0;
    });
    cdp.on('Network.loadingFailed', (e) => {
      const a = anfragen.get(e.requestId);
      if (!a) return;
      a.dauerMs = (e.timestamp - a.t0) * 1000;
      a.fehler = e.errorText ?? 'fehlgeschlagen';
    });
    await cdp.send('Network.enable');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: DROSSEL.cpu });
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: DROSSEL.latenzMs,
      downloadThroughput: (DROSSEL.herunterMbit * 1e6) / 8,
      uploadThroughput: (DROSSEL.heraufMbit * 1e6) / 8,
    });
    await page.goto(basis + route.pfad, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate(() => document.fonts?.ready);
    const seite = await page.evaluate(messenInPage);

    const origin = seite.timeOrigin;
    const liste = [...anfragen.values()].map((a) => {
      const start = a.wall * 1000 - origin;
      const ende = a.dauerMs === null ? null : start + a.dauerMs;
      return {
        id: a.id,
        typ: a.typ ?? 'Sonstige',
        prioritaet: a.prioritaet,
        url: kurzUrl(a.url, basis),
        start,
        ende,
        bytes: a.bytes,
        fehler: a.fehler,
      };
    }).sort((x, y) => x.start - y.start);

    const fcp = seite.fcp;
    const bytesVorFcpJeTyp = {};
    let unvollstaendigVorFcp = 0;
    for (const a of liste) {
      if (fcp !== null && a.start < fcp && (a.ende === null || a.ende > fcp)) unvollstaendigVorFcp += 1;
      if (fcp !== null && a.ende !== null && a.ende <= fcp) {
        bytesVorFcpJeTyp[a.typ] = (bytesVorFcpJeTyp[a.typ] ?? 0) + a.bytes;
      }
      a.vorFcp = fcp !== null && a.ende !== null && a.ende <= fcp;
    }
    const schriftenAnfragen = liste.filter((a) => a.typ === 'Font');
    const aufgabenVorFcp = fcp === null ? [] : seite.aufgaben.filter((t) => t.start < fcp);
    const dokument = liste.find((a) => a.typ === 'Document') ?? null;
    const lcp = seite.lcp
      ? {
        zeit: seite.lcp.zeit,
        element: [
          seite.lcp.tag ?? '–',
          seite.lcp.klasse ? `.${seite.lcp.klasse.trim().split(/\s+/).slice(0, 3).join('.').slice(0, 40)}` : '',
          seite.lcp.text.replace(/\s+/g, ' ').trim() ? ` „${seite.lcp.text.replace(/\s+/g, ' ').trim().slice(0, 50)}“` : '',
          !seite.lcp.text.trim() && seite.lcp.url ? ` ${kurzUrl(seite.lcp.url, basis)}` : '',
        ].join(''),
      }
      : null;

    return {
      fcp,
      lcp,
      dom: seite.dom,
      htmlKB: dokument && dokument.bytes ? kb(dokument.bytes) : null,
      fcpSchriften: seite.fcpSchriften,
      schriftenEnde: seite.schriftenEnde,
      schriftenAnfragen: {
        gesamt: schriftenAnfragen.length,
        vorFcp: schriftenAnfragen.filter((a) => a.vorFcp).length,
      },
      langeAufgabenVorFcp: {
        anzahl: aufgabenVorFcp.length,
        summe: aufgabenVorFcp.reduce((s, t) => s + t.dauer, 0),
      },
      bytesVorFcpJeTyp,
      bytesVorFcpKB: kb(Object.values(bytesVorFcpJeTyp).reduce((s, v) => s + v, 0)),
      unvollstaendigVorFcp,
      abgefangen: abgefangen.length,
      anfragen: liste,
    };
  } finally {
    await context.close();
  }
}

/** Der Lauf, dessen LCP (ersatzweise FCP) dem Median am nächsten liegt; bei gleichem Abstand der frühere. */
function mittlererLauf(laeufe) {
  const mit = laeufe
    .map((l, i) => ({ i, wert: l.lcp ? l.lcp.zeit : l.fcp }))
    .filter((e) => Number.isFinite(e.wert));
  if (!mit.length) return null;
  const m = medianVon(mit.map((e) => e.wert));
  const bester = mit.reduce((b, e) => (Math.abs(e.wert - m) < Math.abs(b.wert - m) ? e : b), mit[0]);
  return { index: bester.i, lauf: laeufe[bester.i] };
}

async function main() {
  const args = argumente();
  for (const k of ['routen', 'laeufe', 'json', 'basis']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const routen = routenWaehlen(args.routen);
  const laeufe = Number(args.laeufe ?? 3);
  if (!Number.isInteger(laeufe) || laeufe < 1) bedienfehler('--laeufe braucht eine ganze Zahl ab 1');
  const basis = basisWaehlen(args.basis);

  const serien = [];
  const browser = await browserStarten();
  try {
    for (const r of routen) {
      const serie = { ansicht: r.id, pfad: r.pfad, laeufe: [], fehler: [] };
      for (let i = 0; i < laeufe; i += 1) {
        try {
          serie.laeufe.push(await einLauf(browser, r, basis));
        } catch (e) {
          serie.fehler.push(String(e.message ?? e).split('\n')[0]);
        }
      }
      serien.push(serie);
    }
  } finally {
    await browser.close();
  }

  const typenAlle = [...new Set(serien.flatMap((s) => s.laeufe.flatMap((l) => Object.keys(l.bytesVorFcpJeTyp))))].sort();
  const zusammenfassung = serien.map((s) => {
    const l = s.laeufe;
    const mitte = mittlererLauf(l);
    return {
      ansicht: s.ansicht,
      pfad: s.pfad,
      laeufe: `${l.length} von ${l.length + s.fehler.length}`,
      fcp: medianVon(l.map((x) => x.fcp)),
      lcp: medianVon(l.map((x) => (x.lcp ? x.lcp.zeit : null))),
      langeAufgabenAnzahl: medianVon(l.map((x) => x.langeAufgabenVorFcp.anzahl)),
      langeAufgabenSumme: medianVon(l.map((x) => x.langeAufgabenVorFcp.summe)),
      dom: medianVon(l.map((x) => x.dom)),
      htmlKB: medianVon(l.map((x) => x.htmlKB)),
      bytesVorFcpKB: medianVon(l.map((x) => x.bytesVorFcpKB)),
      bytesVorFcpJeTypKB: Object.fromEntries(typenAlle.map((t) => [t, medianVon(l.map((x) => kb(x.bytesVorFcpJeTyp[t] ?? 0)))])),
      mittlererLauf: mitte ? mitte.index + 1 : null,
      lcpElement: mitte && mitte.lauf.lcp ? mitte.lauf.lcp.element : '–',
      schriftenFcp: mitte ? schriftenText(mitte.lauf.fcpSchriften) : '–',
    };
  });

  const technischFehler = serien.reduce((s, x) => s + x.fehler.length, 0);
  const protokoll = jsonSchreiben('ladeweg', args, {
    basis,
    geraet: `mobil ${GERAETE[0].breite} × ${GERAETE[0].hoehe}`,
    drosselung: { cpu: DROSSEL.cpu, latenzMs: DROSSEL.latenzMs, herunterMbit: DROSSEL.herunterMbit, heraufMbit: DROSSEL.heraufMbit },
    hinweis: 'Zeiten in ms ab Navigationsbeginn; Start unter 0 = Anfrage vor Navigationsbeginn. Median über die Läufe; bei Schriften nein (x von y) = nicht alle Schnitte geladen (ungenutzte Schnitte bleiben ungeladen).',
    serien,
    zusammenfassung,
  });

  const ms = (v) => zahl(v, 0);
  console.log(`# Ladeweg · ${new Date().toISOString()} · Server ${basis} · mobil ${GERAETE[0].breite} × ${GERAETE[0].hoehe}, CPU ${DROSSEL.cpu}-fach, Netz ${DROSSEL.latenzMs} ms, ${fmt(DROSSEL.herunterMbit, 1)}/${fmt(DROSSEL.heraufMbit, 2)} Mbit/s · ${laeufe} Läufe je Route\n`);
  console.log(tabelle(
    ['Ansicht', 'Läufe', 'FCP ms', 'LCP ms', 'LCP-Element (mittlerer Lauf)', 'Long Tasks vor FCP (Anzahl · Summe ms)', 'DOM-Elemente', 'HTML KB (übertragen)', 'Bytes vor FCP KB', 'Schriften bei FCP (mittlerer Lauf)'],
    zusammenfassung.map((z) => [
      z.ansicht, z.laeufe, ms(z.fcp), ms(z.lcp), z.lcpElement,
      `${zahl(z.langeAufgabenAnzahl, 1)} · ${ms(z.langeAufgabenSumme)}`,
      zahl(z.dom, 0), zahl(z.htmlKB, 1), zahl(z.bytesVorFcpKB, 1), z.schriftenFcp,
    ]),
  ));
  console.log('\n### Bytes vor FCP je Typ (Median, KB)\n');
  console.log(tabelle(
    ['Ansicht', 'Typ', 'Bytes vor FCP KB'],
    zusammenfassung.flatMap((z) => typenAlle
      .filter((t) => (z.bytesVorFcpJeTypKB[t] ?? 0) > 0)
      .map((t) => [z.ansicht, t, zahl(z.bytesVorFcpJeTypKB[t], 1)])),
  ));
  for (const s of serien) {
    const mitte = mittlererLauf(s.laeufe);
    if (!mitte) continue;
    console.log(`\n### Wasserfall · ${s.ansicht} · mittlerer Lauf ${mitte.index + 1} von ${s.laeufe.length} (LCP ${ms(mitte.lauf.lcp ? mitte.lauf.lcp.zeit : null)} ms)\n`);
    const zeilen = mitte.lauf.anfragen
      .filter((a) => SICHTBARE_TYPEN.includes(a.typ))
      .map((a, i) => [
        i + 1, a.typ, a.prioritaet ?? '–', a.url,
        ms(a.start), a.ende === null ? (a.fehler ? `Fehler: ${a.fehler}` : 'offen') : ms(a.ende),
        zahl(kb(a.bytes), 1), a.vorFcp ? 'ja' : 'nein',
      ]);
    console.log(tabelle(['#', 'Typ', 'Priorität', 'Adresse', 'Start ms', 'Ende ms', 'KB', 'vor FCP'], zeilen));
  }
  console.log('\nHinweise: Start unter 0 = Anfrage vor Navigationsbeginn. „nein (x von y)“ bei Schriften = nicht alle Schnitte geladen; ungenutzte Schnitte bleiben ungeladen. Bytes = übertragen (mit Kopfzeilen). Fremde Anfragen außer Google-Schriften sind abgebrochen (Fehler in der Tabelle).');
  if (technischFehler) {
    console.log('\nFehlgeschlagene Läufe:');
    for (const s of serien) for (const f of s.fehler) console.log(`- ${s.ansicht}: ${f}`);
  }
  console.log(`\nJSON-Protokoll: ${protokoll}`);
  if (technischFehler) process.exitCode = 1;
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
