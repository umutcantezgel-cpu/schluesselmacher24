#!/usr/bin/env node
// messung.mjs – Leistungsmessung der Hauptansichten: LCP, CLS, INP-Näherung, TBT, JS-Menge, Übertragung.
// Aufruf: node messung.mjs [--routen <pfad,pfad>] [--laeufe 3] [--profil mobil|desktop|beide] [--json <datei>]
//   [--vergleich <url>]: misst je Ansicht und Profil abwechselnd Lauf um Lauf gegen den zweiten Server (z. B. http://localhost:3100)
//   und gibt zusätzlich eine Vergleichstabelle aus; ohne die Option unverändert.
// Je Lauf ein frischer Kontext. Profil mobil: 390×844, Prozessor 4-fach gedrosselt (CDP),
// Netz „langsames 4G“ (150 ms Latenz, 1,6 Mbit/s herunter, 0,75 Mbit/s hoch). Profil desktop: 1440×900 ohne Drosselung.
// Ablauf je Lauf: laden, einmal durchscrollen, ein Klick auf den ersten sichtbaren Knopf außerhalb
// von Formularen (kein Absende-Knopf), Tab-Taste, bis 5,2 s nach Ladebeginn warten, dann messen.
// TBT = Summe (Dauer − 50 ms) der Long Tasks, die bis 5 s nach Ladebeginn beginnen.
// JS-Menge = übertragene Größe der Skript-Ressourcen (komprimiert), Gesamt = alle Ressourcen.
// Ausgabe je Ansicht und Profil: Median (Minimum–Maximum) über die Läufe und Budgetverstöße am Median.
// Budgets: LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms. Exit: 0 fertig (auch mit Verstößen),
// 1 wenn ein Lauf technisch scheiterte (Daten werden trotzdem geschrieben), 2 Bedienfehler.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  REPO, BASIS_URL, HAUPTANSICHTEN, GERAETE, PROTOKOLLE, argumente, browserStarten, kontextFuer,
  attrappenSetzen, laden, durchscrollen, zeitstempel, ordner,
} from './lib.mjs';

const BUDGET = { lcp: 2500, cls: 0.1, inp: 200 };

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
const spanne = (liste, stellen) => (liste.length
  ? `${fmt(med(liste), stellen)} (${fmt(Math.min(...liste), stellen)}–${fmt(Math.max(...liste), stellen)})`
  : '–');

/** Vor jedem Dokument: Beobachter für LCP, CLS, Ereignisse und Long Tasks. */
const INIT = `(() => {
  try { performance.setResourceTimingBufferSize(2000); } catch (e) {}
  const m = (window.__sm24 = { lcp: null, cls: 0, ereignisse: [], aufgaben: [] });
  const beobachte = (typ, opt, fn) => {
    try { new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type: typ, buffered: true, ...opt }); } catch (e) {}
  };
  beobachte('largest-contentful-paint', {}, (e) => { m.lcp = e.startTime; });
  beobachte('layout-shift', {}, (e) => { if (!e.hadRecentInput) m.cls += e.value; });
  beobachte('event', { durationThreshold: 16 }, (e) => { m.ereignisse.push({ start: e.startTime, dauer: e.duration }); });
  beobachte('longtask', {}, (e) => { m.aufgaben.push({ start: e.startTime, dauer: e.duration }); });
})();`;

/** Läuft im Browser nach der Interaktion. Muss ohne äußere Bezüge auskommen. */
function messenInPage(tStart) {
  const m = window.__sm24;
  const res = performance.getEntriesByType('resource');
  const nav = performance.getEntriesByType('navigation')[0];
  const summe = (liste) => liste.reduce((s, e) => s + (e.transferSize || 0), 0);
  const js = res.filter((e) => e.initiatorType === 'script' || /\.m?js([?#]|$)/.test(e.name));
  const inp = m.ereignisse.filter((e) => e.start >= tStart).reduce((mx, e) => Math.max(mx, e.dauer), 0);
  const tbt = m.aufgaben.filter((e) => e.start <= 5000).reduce((s, e) => s + Math.max(0, e.dauer - 50), 0);
  return {
    lcp: m.lcp,
    cls: m.cls,
    inp,
    tbt,
    jsKB: summe(js) / 1024,
    gesamtKB: (summe(res) + (nav ? nav.transferSize || 0 : 0)) / 1024,
    ressourcen: res.length,
  };
}

/** Klick auf den ersten sichtbaren Knopf, der kein Formularknopf ist, danach Tab-Taste. */
async function interagieren(page) {
  const url0 = page.url();
  const tStart = await page.evaluate(() => performance.now());
  const markiert = await page.evaluate(() => {
    const knopf = [...document.querySelectorAll('button')].find((b) => {
      const r = b.getBoundingClientRect();
      const cs = getComputedStyle(b);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'
        && !b.disabled && b.getAttribute('type') !== 'submit' && !b.closest('form');
    });
    if (!knopf) return false;
    knopf.setAttribute('data-sm24-messung', '1');
    return true;
  });
  if (markiert) await page.locator('[data-sm24-messung="1"]').click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  return { tStart, klick: markiert, navigiert: page.url() !== url0 };
}

/**
 * Gleiche Regeln wie attrappenSetzen() aus lib.mjs, aber für den Vergleichsursprung.
 * lib.mjs bleibt unverändert; daher hier eine Kopie der Regeln (Lese-Kennungen aus denselben Manifesten).
 */
function leseActionsVergleich() {
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
  let lesend = leseActionsVergleich();
  await context.route('**/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const methode = req.method();
    if (url.origin !== eigen) {
      if (methode === 'GET' && /fonts\.(gstatic|googleapis)\.com$/.test(url.hostname)) return route.continue();
      return route.abort();
    }
    if (methode === 'GET' || methode === 'HEAD') return route.continue();
    if (url.pathname.startsWith('/api/kunden-upload')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, id: 'attrappe-upload', schluessel: 'attrappe' }),
      });
    }
    const action = req.headers()['next-action'];
    if (action && !lesend.has(action)) lesend = leseActionsVergleich();
    if (action && lesend.has(action)) return route.continue();
    if (action) {
      return route.fulfill({ status: 200, contentType: 'text/x-component', body: '0:{"a":"$@1","f":"","b":"attrappe"}\n1:null\n' });
    }
    return route.fulfill({ status: 204, body: '' });
  });
}

async function ladenUnter(page, basis, pfad) {
  await page.goto(basis + pfad, { waitUntil: 'networkidle', timeout: 45000 });
  await page.evaluate(() => document.fonts?.ready);
}

async function einLauf(browser, route, profil, basis = null) {
  const g = profil === 'mobil' ? GERAETE[0] : GERAETE[2];
  const context = await kontextFuer(browser, g);
  try {
    if (basis) await attrappenFuer(context, basis);
    else await attrappenSetzen(context);
    const page = await context.newPage();
    await page.addInitScript(INIT);
    if (profil === 'mobil') {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 150,
        downloadThroughput: 1.6e6 / 8,
        uploadThroughput: 0.75e6 / 8,
      });
    }
    if (basis) await ladenUnter(page, basis, route.pfad);
    else await laden(page, route.pfad);
    await durchscrollen(page);
    const { tStart, klick, navigiert } = await interagieren(page);
    await page.waitForFunction(() => performance.now() > 5200, null, { timeout: 60000 });
    const werte = await page.evaluate(messenInPage, tStart);
    return { ...werte, klick, navigiert };
  } finally {
    await context.close();
  }
}

const VERGLEICH_WERTE = [
  { name: 'LCP', schluessel: 'lcp', einheit: ' ms', stellen: 0 },
  { name: 'CLS', schluessel: 'cls', einheit: '', stellen: 3 },
  { name: 'INP', schluessel: 'inp', einheit: ' ms', stellen: 0 },
];
const werteAus = (serie, schluessel) => serie.laeufe
  .map((l) => l[schluessel])
  .filter((v) => typeof v === 'number' && Number.isFinite(v));
const mitVorzeichen = (d, stellen) => {
  const r = Number(d.toFixed(stellen));
  return `${r > 0 ? '+' : r < 0 ? '−' : ''}${fmt(Math.abs(r), stellen)}`;
};

/**
 * Je Ansicht, Profil und Wert: Median jetzt, Median Vergleich, Spanne Vergleich (max − min),
 * Differenz (jetzt − Vergleich) und erfüllt (Differenz ≤ Spanne oder Differenz ≤ 0), mit ungerundeten Werten.
 * Die Spanne gibt es erst ab zwei Werten der Vergleichsserie; sonst ist sie unbekannt (null) und erfüllt
 * ist „nicht bewertbar“ (null). Je Serie stehen die Läufe insgesamt (gelungen und fehlgeschlagen) und die
 * Läufe mit gültigem Wert, damit fehlende Werte nicht unbemerkt bleiben.
 */
function vergleichZeilenBauen(serien, vergleichSerien) {
  const zeilen = [];
  serien.forEach((s, k) => {
    const v = vergleichSerien[k];
    for (const w of VERGLEICH_WERTE) {
      const jetzt = werteAus(s, w.schluessel);
      const vgl = werteAus(v, w.schluessel);
      const medianJetzt = jetzt.length ? med(jetzt) : null;
      const medianVergleich = vgl.length ? med(vgl) : null;
      const spanne = vgl.length >= 2 ? Math.max(...vgl) - Math.min(...vgl) : null;
      const differenz = medianJetzt !== null && medianVergleich !== null ? medianJetzt - medianVergleich : null;
      const erfuellt = differenz === null || spanne === null ? null : (differenz <= spanne || differenz <= 0);
      zeilen.push({
        ansicht: s.ansicht, profil: s.profil, wert: w.name, einheit: w.einheit, stellen: w.stellen,
        medianJetzt, medianVergleich, spanne, differenz, erfuellt,
        laeufeJetzt: s.laeufe.length + s.fehler.length,
        werteJetzt: jetzt.length,
        laeufeVergleich: v.laeufe.length + v.fehler.length,
        werteVergleich: vgl.length,
      });
    }
  });
  return zeilen;
}

/** Zwei Adressen zeigen auf denselben Server, wenn Protokoll, Port und Rechner übereinstimmen; Loopback-Namen zählen als gleich. */
const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
const portVon = (u) => u.port || (u.protocol === 'https:' ? '443' : '80');
function gleicherServer(a, b) {
  const rechner = (u) => (LOOPBACK.has(u.hostname) ? 'loopback' : u.hostname);
  return a.protocol === b.protocol && portVon(a) === portVon(b) && rechner(a) === rechner(b);
}

async function main() {
  const args = argumente();
  for (const k of ['routen', 'laeufe', 'profil', 'json', 'vergleich']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const routen = routenWaehlen(args.routen);
  const laeufe = Number(args.laeufe ?? 3);
  if (!Number.isInteger(laeufe) || laeufe < 1) bedienfehler('--laeufe braucht eine ganze Zahl ab 1');
  const profilWahl = args.profil ?? 'beide';
  if (!['mobil', 'desktop', 'beide'].includes(profilWahl)) bedienfehler(`--profil „${profilWahl}“ ist nicht erlaubt`);
  const profile = profilWahl === 'beide' ? ['mobil', 'desktop'] : [profilWahl];
  let vergleich = null;
  if (args.vergleich !== undefined) {
    let u = null;
    try { u = new URL(args.vergleich); } catch { u = null; }
    if (!u || !['http:', 'https:'].includes(u.protocol)) {
      bedienfehler(`--vergleich „${args.vergleich}“ ist keine http(s)-Adresse, z. B. --vergleich http://localhost:3100`);
    }
    if (gleicherServer(u, new URL(BASIS_URL))) {
      bedienfehler(`--vergleich zeigt auf denselben Server wie die Messung (${BASIS_URL}; localhost, 127.0.0.1 und ::1 gelten als gleich); ein zweiter Server ist nötig (z. B. http://localhost:3100)`);
    }
    vergleich = u.origin;
  }

  const serien = [];
  const vergleichSerien = [];
  const browser = await browserStarten();
  try {
    for (const r of routen) {
      for (const p of profile) {
        const serie = { ansicht: r.id, pfad: r.pfad, profil: p, laeufe: [], fehler: [] };
        const vserie = vergleich ? { ansicht: r.id, pfad: r.pfad, profil: p, laeufe: [], fehler: [] } : null;
        for (let i = 0; i < laeufe; i += 1) {
          try {
            serie.laeufe.push(await einLauf(browser, r, p));
          } catch (e) {
            serie.fehler.push(String(e.message ?? e).split('\n')[0]);
          }
          if (vserie) {
            try {
              vserie.laeufe.push(await einLauf(browser, r, p, vergleich));
            } catch (e) {
              vserie.fehler.push(String(e.message ?? e).split('\n')[0]);
            }
          }
        }
        serien.push(serie);
        if (vserie) vergleichSerien.push(vserie);
      }
    }
  } finally {
    await browser.close();
  }

  const werteVon = (serie, schluessel) => serie.laeufe
    .map((l) => l[schluessel])
    .filter((v) => typeof v === 'number' && Number.isFinite(v));

  const zeilen = serien.map((s) => {
    const lcp = werteVon(s, 'lcp');
    const cls = werteVon(s, 'cls');
    const inp = werteVon(s, 'inp');
    const tbt = werteVon(s, 'tbt');
    const js = werteVon(s, 'jsKB');
    const gesamt = werteVon(s, 'gesamtKB');
    const verstoesse = [];
    if (lcp.length && med(lcp) > BUDGET.lcp) verstoesse.push('LCP');
    if (cls.length && med(cls) > BUDGET.cls) verstoesse.push('CLS');
    if (inp.length && med(inp) > BUDGET.inp) verstoesse.push('INP');
    const budgetText = !s.laeufe.length
      ? 'kein Lauf gelungen'
      : (verstoesse.length ? `ÜBER: ${verstoesse.join(', ')}` : 'eingehalten');
    return {
      ansicht: s.ansicht,
      profil: s.profil,
      laeufe: `${s.laeufe.length} von ${s.laeufe.length + s.fehler.length}`,
      lcp: spanne(lcp, 0),
      cls: spanne(cls, 3),
      inp: spanne(inp, 0),
      tbt: spanne(tbt, 0),
      jsKB: spanne(js, 1),
      gesamtKB: spanne(gesamt, 1),
      budget: budgetText,
      verstoesse,
    };
  });

  const technischFehler = serien.reduce((s, x) => s + x.fehler.length, 0)
    + vergleichSerien.reduce((s, x) => s + x.fehler.length, 0);
  const vergleichZeilen = vergleich ? vergleichZeilenBauen(serien, vergleichSerien) : null;
  const protokoll = jsonSchreiben('messung', args, {
    budget: BUDGET,
    hinweis: 'Werte: Median (Minimum–Maximum) je Ansicht und Profil; INP 0 = kein Ereignis über 16 ms',
    serien,
    zusammenfassung: zeilen,
    ...(vergleich ? { vergleich: vergleichSerien, vergleichZusammenfassung: vergleichZeilen } : {}),
  });

  console.log(tabelle(
    ['Ansicht', 'Profil', 'Läufe', 'LCP ms', 'CLS', 'INP ms', 'TBT ms', 'JS KB', 'Gesamt KB', 'Budget (Median)'],
    zeilen.map((z) => [z.ansicht, z.profil, z.laeufe, z.lcp, z.cls, z.inp, z.tbt, z.jsKB, z.gesamtKB, z.budget]),
  ));
  console.log('\nBudgets: LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms (am Median). Das Bewegungscode-Budget (60 KB) wird nicht gesondert gemessen; „JS KB“ ist die Gesamtmenge aller Skript-Ressourcen.');
  if (vergleich) {
    console.log(`\nVergleich gegen ${vergleich} (Lauf um Lauf abwechselnd mit ${BASIS_URL}):\n`);
    const bewertbar = vergleichZeilen.filter((z) => z.erfuellt !== null);
    const ja = bewertbar.filter((z) => z.erfuellt).length;
    const nichtBewertbar = vergleichZeilen.length - bewertbar.length;
    const kopf = ['Ansicht', 'Profil', 'Wert', 'Läufe jetzt (mit Wert)', 'Läufe Vergleich (mit Wert)', 'Median jetzt', 'Median Vergleich', 'Spanne Vergleich (max − min)', 'Differenz', 'erfüllt'];
    const summe = ['Summe', '–', '–', '–', '–', '–', '–', '–', '–', `${ja} von ${bewertbar.length} erfüllt${nichtBewertbar ? ` · ${nichtBewertbar} nicht bewertbar` : ''}`];
    console.log(tabelle(
      kopf,
      [
        ...vergleichZeilen.map((z) => [
          z.ansicht, z.profil, z.wert,
          `${z.werteJetzt} von ${z.laeufeJetzt}`,
          `${z.werteVergleich} von ${z.laeufeVergleich}`,
          z.medianJetzt === null ? '–' : `${fmt(z.medianJetzt, z.stellen)}${z.einheit}`,
          z.medianVergleich === null ? '–' : `${fmt(z.medianVergleich, z.stellen)}${z.einheit}`,
          z.spanne === null ? '–' : `${fmt(z.spanne, z.stellen)}${z.einheit}`,
          z.differenz === null ? '–' : `${mitVorzeichen(z.differenz, z.stellen)}${z.einheit}`,
          z.erfuellt === null ? 'nicht bewertbar' : (z.erfuellt ? 'ja' : 'nein'),
        ]),
        summe,
      ],
    ));
    console.log('Läufe (mit Wert) = Läufe mit gültigem Wert von allen Läufen der Serie (gelungen und fehlgeschlagen). Differenz = Median jetzt − Median Vergleich (+ heißt: jetzt höher). erfüllt = Differenz ≤ Spanne Vergleich oder Differenz ≤ 0. Spanne „–“ und erfüllt „nicht bewertbar“, wenn die Vergleichsserie weniger als zwei Werte hat oder ein Median fehlt.');
  }
  if (technischFehler) {
    console.log('\nFehlgeschlagene Läufe:');
    for (const s of serien) for (const f of s.fehler) console.log(`- ${s.ansicht} · ${s.profil}: ${f}`);
    for (const s of vergleichSerien) for (const f of s.fehler) console.log(`- ${s.ansicht} · ${s.profil} (Vergleich): ${f}`);
  }
  console.log(`\nJSON-Protokoll: ${protokoll}`);
  if (technischFehler) process.exitCode = 1;
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
