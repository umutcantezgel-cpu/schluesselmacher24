#!/usr/bin/env node
// inventar.mjs – Inventar der Seiten: welche Adressen es gibt, was sie antworten und was Suchmaschinen lesen.
// Aufruf: node inventar.mjs [--basis http://localhost:3000] [--max 2000] [--manifest <datei>] [--json <datei>]
// Adressen aus /sitemap.xml (mit verschachtelten Sitemaps), aus .next/prerender-manifest.json (Schlüssel „routes“)
// und aus den Links der besuchten Seiten. Übernommen werden nur Adressen desselben Ursprungs, ohne Parameter und
// Anker; /api/ bleibt außen vor. Je Adresse ein Abruf per fetch (redirect: 'manual'), Weiterleitungen werden Sprung
// für Sprung verfolgt. HTML wertet ein Chromium per DOMParser aus; das lädt keine Ressourcen. Höchstens 4 Abrufe
// gleichzeitig. Nur localhost (G1).
// indexierbar: Status 200, HTML, kein noindex in Meta oder Kopf, canonical leer oder auf dieselbe Adresse. Ein canonical
// mit anderem Ursprung und gleichem Pfad gilt als gleich und wird im Befund vermerkt.
// Ausgabe: protokolle/inventar-<zeitstempel>.json und .tsv; Zusammenfassung und Dubletten auf stdout.
// Exit: 0 fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  GERAETE, PROTOKOLLE, REPO, BASIS_URL, argumente, zeitstempel, ordner, browserStarten, kontextFuer, attrappenSetzen,
} from './lib.mjs';

const GLEICHZEITIG = 4;
const ZEITLIMIT_MS = 15000;
const MAX_SPRUENGE = 10;
const LOKAL = new Set(['localhost', '127.0.0.1', '[::1]']);
const UA = 'Mozilla/5.0 (compatible; SM24-Inventar/1.0; lokale Prüfung)';
const DESKTOP = GERAETE.find((g) => g.id === 'desktop');
const KANONISCH_OK = new Set(['leer', 'gleich', 'gleicher Pfad, anderer Ursprung']);
const SPALTEN = [
  'adresse', 'status', 'ziel', 'status_ziel', 'spruenge', 'indexierbar', 'grund', 'quellen', 'eingehend', 'html',
  'content_type', 'titel', 'titel_zeichen', 'description', 'description_zeichen', 'robots', 'x_robots_tag', 'canonical',
  'canonical_status', 'h1_anzahl', 'h1', 'og_image', 'lang', 'jsonld_typen', 'jsonld_fehler', 'wortzahl', 'befunde',
];

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };
const sauber = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const entitaeten = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const zelle = (v) => String(v ?? '–').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
const tsvZelle = (v) => (Array.isArray(v) ? v.join(' | ') : (v ?? '')).toString().replace(/[\t\r\n]+/g, ' ');
const istHtml = (typ) => /text\/html|application\/xhtml\+xml/i.test(typ ?? '');
const holen = (url) => fetch(url, {
  redirect: 'manual',
  signal: AbortSignal.timeout(ZEITLIMIT_MS),
  headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
});
const netzText = (err) => sauber(err?.cause?.code ?? err?.message ?? err).slice(0, 160);
function tabelle(kopf, zeilen) {
  return [
    `| ${kopf.join(' | ')} |`,
    `|${kopf.map(() => '---').join('|')}|`,
    ...zeilen.map((z) => `| ${z.map(zelle).join(' | ')} |`),
  ].join('\n');
}

/**
 * Läuft im Browser. Keine äußeren Bezüge, weil die Funktion als Text in die Seite gereicht wird.
 * DOMParser lädt keine Ressourcen. Rückgabe sind nur Rohwerte; die Auswertung folgt in Node.
 */
function htmlAuswertenImBrowser(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const saeubern = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
  const metaWerte = (attr, name) => [...doc.querySelectorAll(`meta[${attr}]`)]
    .filter((m) => (m.getAttribute(attr) ?? '').trim().toLowerCase() === name)
    .map((m) => m.getAttribute('content') ?? '');
  let mainWoerter = null;
  const main = doc.querySelector('main');
  if (main) {
    const kopie = main.cloneNode(true);
    kopie.querySelectorAll('script, style, noscript, template').forEach((el) => el.remove());
    mainWoerter = saeubern(kopie.textContent).split(' ').filter(Boolean).length;
  }
  const canon = doc.querySelector('link[rel~="canonical"]');
  return {
    titel: saeubern(doc.title),
    description: metaWerte('name', 'description')[0] ?? null,
    robots: metaWerte('name', 'robots'),
    kanonisch: canon ? (canon.getAttribute('href') ?? '') : null,
    h1: [...doc.querySelectorAll('h1')].map((h) => saeubern(h.textContent)),
    ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null,
    lang: doc.documentElement.getAttribute('lang') || null,
    jsonLd: [...doc.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? ''),
    mainWoerter,
    links: [...doc.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? ''),
  };
}

function kanonischPruefen(roh, adresse) {
  if (roh === null || roh.trim() === '') return 'leer';
  let u;
  try { u = new URL(roh.trim(), adresse); } catch { return 'ungültig'; }
  const a = new URL(adresse);
  if (u.href === a.href) return 'gleich';
  if (u.pathname === a.pathname && u.search === a.search) return 'gleicher Pfad, anderer Ursprung';
  return 'abweichend';
}

/** Sammelt alle @type-Werte aus einem JSON-LD-Baum, auch aus @graph und verschachtelten Objekten. */
function typenSammeln(wert, typen) {
  if (Array.isArray(wert)) {
    for (const w of wert) typenSammeln(w, typen);
  } else if (wert && typeof wert === 'object') {
    const t = wert['@type'];
    for (const x of Array.isArray(t) ? t : [t]) {
      if (typeof x === 'string') typen.add(x);
    }
    for (const v of Object.values(wert)) typenSammeln(v, typen);
  }
  return typen;
}

/** Adresse ohne Parameter und Anker; null für fremde Ursprünge, Nicht-Web-Adressen und /api/. */
function normalisieren(text, von, ursprung) {
  let u;
  try { u = new URL(text, von); } catch { return null; }
  if ((u.protocol !== 'http:' && u.protocol !== 'https:') || u.origin !== ursprung) return null;
  if (u.pathname === '/api' || u.pathname.startsWith('/api/')) return null;
  u.search = '';
  u.hash = '';
  return u.href;
}

const leer = (adresse) => ({
  adresse, status: null, ziel: null, statusZiel: null, spruenge: 0, xRobots: '', typ: '', html: false,
  titel: '', description: null, robots: [], noindexMeta: false, noindexKopf: false,
  canonical: null, canonicalStatus: 'leer', h1: [], ogImage: null, lang: null, jsonLdTypen: [], jsonLdFehler: [],
  wortzahl: null, netzfehler: null, befunde: [], grund: '', indexierbar: false, quellen: [], eingehend: 0, links: [],
});

/** Befunde und die Begründung für „nicht indexierbar“ aus den Rohwerten bilden. */
function bewerten(e) {
  const b = [];
  if (e.netzfehler) b.push(`Netzfehler: ${e.netzfehler}`);
  if (typeof e.statusZiel === 'string' && e.statusZiel.startsWith('fremd')) b.push('Weiterleitung auf fremden Ursprung');
  if (e.statusZiel === 'Schleife') b.push('Weiterleitungsschleife oder mehr als 10 Sprünge');
  if (e.statusZiel === 'ohne Ziel') b.push('Weiterleitung ohne Ziel');
  if (e.statusZiel === 'ungültiges Ziel') b.push('Weiterleitungsziel ungültig');
  if (typeof e.statusZiel === 'number' && e.statusZiel >= 400) b.push(`Weiterleitung führt auf Status ${e.statusZiel}`);
  if (e.html && e.status === 200) {
    if (!e.titel) b.push('title fehlt oder ist leer');
    if (e.description === null) b.push('meta description fehlt');
    else if (e.description === '') b.push('meta description ist leer');
    if (e.h1.length !== 1) b.push(`h1: ${e.h1.length} Stück`);
    if (e.wortzahl === null) b.push('kein main-Element');
    if (!e.lang) b.push('html lang fehlt');
    if (e.jsonLdFehler.length) b.push(`JSON-LD: ${e.jsonLdFehler.length} Parsefehler`);
    if (e.canonicalStatus === 'gleicher Pfad, anderer Ursprung') b.push('canonical zeigt auf anderen Ursprung (gleicher Pfad)');
    if (e.canonicalStatus === 'abweichend' || e.canonicalStatus === 'ungültig') b.push(`canonical ${e.canonicalStatus}`);
  }
  e.befunde = b;
  let grund = '';
  if (e.netzfehler) grund = 'Netzfehler';
  else if (e.status !== 200) grund = `Status ${e.status}`;
  else if (!e.html) grund = 'kein HTML';
  else if (e.noindexMeta) grund = 'noindex in Meta';
  else if (e.noindexKopf) grund = 'noindex im Kopf';
  else if (!KANONISCH_OK.has(e.canonicalStatus)) grund = `canonical ${e.canonicalStatus}`;
  e.grund = grund;
  e.indexierbar = grund === '';
  return e;
}

async function main() {
  const args = argumente();
  for (const k of ['basis', 'max', 'manifest', 'json']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  let basis;
  try { basis = new URL(args.basis ?? BASIS_URL); } catch { bedienfehler('--basis ist keine gültige Adresse'); }
  if (!['http:', 'https:'].includes(basis.protocol) || !LOKAL.has(basis.hostname)) {
    bedienfehler(`--basis muss auf localhost zeigen (G1), nicht auf ${basis.hostname}`);
  }
  const ursprung = basis.origin;
  const max = args.max === undefined ? 2000 : Number(args.max);
  if (!Number.isInteger(max) || max < 1) bedienfehler('--max braucht eine ganze Zahl ab 1');
  const manifestDatei = args.manifest ?? path.join(REPO, '.next', 'prerender-manifest.json');

  try {
    const erreichbar = await holen(`${ursprung}/`);
    await erreichbar.body?.cancel();
  } catch (err) {
    throw new Error(`Server unter ${ursprung} antwortet nicht: ${netzText(err)}`);
  }

  // Adressen sammeln: Map aus Adresse, Quellen und eingehenden Links; Warteschlange in Entdeckungsreihenfolge.
  const eintraege = new Map();
  const warteschlange = [];
  const verworfen = new Set();
  function aufnehmen(adresse, quelle, von = null) {
    let eintrag = eintraege.get(adresse);
    if (!eintrag) {
      if (eintraege.size >= max) { verworfen.add(adresse); return; }
      eintrag = { quellen: new Set(), eingehend: new Set() };
      eintraege.set(adresse, eintrag);
      warteschlange.push(adresse);
    }
    eintrag.quellen.add(quelle);
    if (von && von !== adresse) eintrag.eingehend.add(von);
  }

  const sitemapStand = { url: `${ursprung}/sitemap.xml`, besucht: new Set(), eintraege: 0, fremd: 0, befunde: [] };
  async function sitemapLesen(url, tiefe) {
    if (tiefe > 3 || sitemapStand.besucht.has(url)) return;
    sitemapStand.besucht.add(url);
    let text;
    try {
      const antwort = await holen(url);
      if (antwort.status !== 200) {
        await antwort.body?.cancel();
        sitemapStand.befunde.push(`${url} antwortet mit Status ${antwort.status}`);
        return;
      }
      text = await antwort.text();
    } catch (err) {
      sitemapStand.befunde.push(`${url}: ${netzText(err)}`);
      return;
    }
    const verschachtelt = /<sitemapindex[\s>]/.test(text);
    for (const m of text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
      const roh = entitaeten(m[1]);
      let u;
      try { u = new URL(roh); } catch {
        sitemapStand.befunde.push(`ungültige Adresse in der Sitemap: ${roh.slice(0, 120)}`);
        continue;
      }
      if (u.origin !== ursprung) { sitemapStand.fremd += 1; continue; }
      if (verschachtelt) { await sitemapLesen(u.href, tiefe + 1); continue; }
      sitemapStand.eintraege += 1;
      const adresse = normalisieren(u.href, ursprung, ursprung);
      if (adresse) aufnehmen(adresse, 'sitemap');
    }
  }
  await sitemapLesen(sitemapStand.url, 0);

  const prerenderStand = { datei: manifestDatei, routen: 0, intern: 0, dynamisch: 0, befunde: [] };
  if (!existsSync(manifestDatei)) {
    prerenderStand.befunde.push('Prerender-Manifest fehlt');
  } else {
    const manifest = JSON.parse(readFileSync(manifestDatei, 'utf8'));
    const routen = Object.keys(manifest.routes ?? {});
    prerenderStand.routen = routen.length;
    prerenderStand.dynamisch = Object.keys(manifest.dynamicRoutes ?? {}).length;
    for (const k of routen) {
      if (k.startsWith('/_')) { prerenderStand.intern += 1; continue; }
      const adresse = normalisieren(k, ursprung, ursprung);
      if (adresse) aufnehmen(adresse, 'prerender');
    }
  }

  const ergebnisse = new Map();
  const browser = await browserStarten();
  try {
    const context = await kontextFuer(browser, DESKTOP);
    await attrappenSetzen(context);
    const seite = await context.newPage();
    await seite.setContent('<!doctype html><title>Inventar</title>');

    async function pruefeAdresse(adresse) {
      const e = leer(adresse);
      let erste;
      try {
        erste = await holen(adresse);
      } catch (err) {
        e.netzfehler = netzText(err);
        return bewerten(e);
      }
      e.status = erste.status;
      e.xRobots = erste.headers.get('x-robots-tag') ?? '';
      e.typ = erste.headers.get('content-type') ?? '';
      if (erste.status === 200 && istHtml(e.typ)) {
        e.html = true;
        let html;
        try {
          html = await erste.text();
        } catch (err) {
          e.netzfehler = netzText(err);
          return bewerten(e);
        }
        const h = await seite.evaluate(htmlAuswertenImBrowser, html);
        e.titel = sauber(h.titel);
        e.description = h.description === null ? null : sauber(h.description);
        e.robots = h.robots.map(sauber).filter(Boolean);
        e.noindexMeta = h.robots.some((r) => /noindex/i.test(r));
        e.noindexKopf = /noindex/i.test(e.xRobots);
        e.canonical = h.kanonisch === null ? null : sauber(h.kanonisch);
        e.canonicalStatus = kanonischPruefen(h.kanonisch, adresse);
        e.h1 = h.h1;
        e.ogImage = h.ogImage;
        e.lang = h.lang;
        e.wortzahl = h.mainWoerter;
        const typen = new Set();
        for (const text of h.jsonLd) {
          try { typenSammeln(JSON.parse(text), typen); } catch (err) { e.jsonLdFehler.push(sauber(err.message).slice(0, 120)); }
        }
        e.jsonLdTypen = [...typen].sort();
        for (const href of h.links) {
          const ziel = normalisieren(href, adresse, ursprung);
          if (ziel) aufnehmen(ziel, 'link', adresse);
        }
      } else if (erste.status >= 300 && erste.status < 400) {
        await weiterleitungFolgen(e, erste);
      } else {
        await erste.body?.cancel();
      }
      return bewerten(e);
    }

    async function weiterleitungFolgen(e, erste) {
      let antwort = erste;
      let aktuell = e.adresse;
      const kette = [e.adresse];
      try {
        while (antwort.status >= 300 && antwort.status < 400) {
          const lage = antwort.headers.get('location');
          await antwort.body?.cancel();
          if (!lage) { e.statusZiel = 'ohne Ziel'; return; }
          let naechste;
          try { naechste = new URL(lage, aktuell).href; } catch { e.statusZiel = 'ungültiges Ziel'; return; }
          e.spruenge += 1;
          e.ziel = naechste;
          if (new URL(naechste).origin !== ursprung) { e.statusZiel = 'fremd, nicht abgerufen'; return; }
          if (kette.includes(naechste) || e.spruenge > MAX_SPRUENGE) { e.statusZiel = 'Schleife'; return; }
          kette.push(naechste);
          aktuell = naechste;
          antwort = await holen(aktuell);
        }
        e.statusZiel = antwort.status;
        await antwort.body?.cancel();
      } catch (err) {
        e.statusZiel = `Netzfehler: ${netzText(err)}`;
      }
    }

    // Alle Arbeiter teilen sich Zeiger und Warteschlange; die Warteschlange wächst, wenn Links neue Adressen liefern.
    let gemeinsamerZeiger = 0;
    let aktive = 0;
    const arbeiter = async () => {
      for (;;) {
        if (gemeinsamerZeiger < warteschlange.length) {
          const adresse = warteschlange[gemeinsamerZeiger];
          gemeinsamerZeiger += 1;
          aktive += 1;
          try {
            ergebnisse.set(adresse, await pruefeAdresse(adresse));
          } finally {
            aktive -= 1;
          }
        } else if (aktive === 0) {
          return;
        } else {
          await new Promise((r) => setTimeout(r, 10));
        }
      }
    };
    await Promise.all(Array.from({ length: GLEICHZEITIG }, arbeiter));
    await context.close();
  } finally {
    await browser.close();
  }

  const liste = [...eintraege.keys()].sort().map((adresse) => {
    const e = ergebnisse.get(adresse);
    const eintrag = eintraege.get(adresse);
    e.quellen = [...eintrag.quellen].sort();
    e.eingehend = eintrag.eingehend.size;
    delete e.links;
    return e;
  });

  const zaehl = (f) => liste.filter(f).length;
  const seitenOk = (e) => e.status === 200 && e.html;
  const statusVerteilung = new Map();
  for (const e of liste) {
    const schluessel = e.netzfehler ? 'Netzfehler' : String(e.status);
    statusVerteilung.set(schluessel, (statusVerteilung.get(schluessel) ?? 0) + 1);
  }
  const zusammenfassung = {
    gesamt: liste.length,
    indexierbar: zaehl((e) => e.indexierbar),
    noindex: zaehl((e) => e.noindexMeta || e.noindexKopf),
    weiterleitungen: zaehl((e) => e.status >= 300 && e.status < 400),
    fehlerstatus: zaehl((e) => e.netzfehler || e.status >= 400),
    weiterleitungAufFehler: zaehl((e) => typeof e.statusZiel === 'number' && e.statusZiel >= 400),
    ohneHtml: zaehl((e) => e.status === 200 && !e.html),
    titelFehlt: zaehl((e) => seitenOk(e) && !e.titel),
    descriptionFehlt: zaehl((e) => seitenOk(e) && !e.description),
    h1NichtEine: zaehl((e) => seitenOk(e) && e.h1.length !== 1),
    keinMain: zaehl((e) => seitenOk(e) && e.wortzahl === null),
    jsonLdFehler: zaehl((e) => e.jsonLdFehler.length > 0),
    canonicalAnderesUrsprung: zaehl((e) => e.canonicalStatus === 'gleicher Pfad, anderer Ursprung'),
    canonicalAbweichend: zaehl((e) => e.canonicalStatus === 'abweichend' || e.canonicalStatus === 'ungültig'),
    statusVerteilung: Object.fromEntries([...statusVerteilung.entries()].sort()),
  };

  function dubletten(feld) {
    const karte = new Map();
    for (const e of liste) {
      if (!e.indexierbar) continue;
      const wert = feld(e);
      if (!wert) continue;
      if (!karte.has(wert)) karte.set(wert, []);
      karte.get(wert).push(e.adresse);
    }
    return [...karte.entries()].filter(([, a]) => a.length > 1).map(([wert, adressenListe]) => ({ wert, adressen: adressenListe }));
  }
  const dubl = {
    titel: dubletten((e) => e.titel),
    description: dubletten((e) => e.description),
    h1: dubletten((e) => e.h1[0] ?? ''),
  };

  const quellen = {
    sitemap: { ...sitemapStand, besucht: [...sitemapStand.besucht] },
    prerender: prerenderStand,
    nurLinks: zaehl((e) => e.quellen.length === 1 && e.quellen[0] === 'link'),
    grenze: max,
    verworfen: verworfen.size,
  };

  const protokollDatei = typeof args.json === 'string' ? path.resolve(args.json) : path.join(PROTOKOLLE, `inventar-${zeitstempel()}.json`);
  ordner(path.dirname(protokollDatei));
  const tsvDatei = protokollDatei.endsWith('.json') ? `${protokollDatei.slice(0, -5)}.tsv` : `${protokollDatei}.tsv`;
  writeFileSync(protokollDatei, `${JSON.stringify({
    skript: 'inventar', zeit: new Date().toISOString(), argumente: args, basis: ursprung,
    quellen, zusammenfassung, dubletten: dubl, seiten: liste,
  }, null, 2)}\n`);
  writeFileSync(tsvDatei, `${[
    SPALTEN.join('\t'),
    ...liste.map((e) => [
      e.adresse, e.status ?? '', e.ziel ?? '', e.statusZiel ?? '', e.spruenge, e.indexierbar ? 'ja' : 'nein', e.grund,
      e.quellen, e.eingehend, e.html ? 'ja' : 'nein', e.typ, e.titel, e.titel.length, e.description ?? '',
      e.description === null ? '' : [...e.description].length, e.robots, e.xRobots, e.canonical ?? '', e.canonicalStatus,
      e.h1.length, e.h1[0] ?? '', e.ogImage ?? '', e.lang ?? '', e.jsonLdTypen, e.jsonLdFehler, e.wortzahl ?? '', e.befunde,
    ].map(tsvZelle).join('\t')),
  ].join('\n')}\n`);

  console.log(`Inventar ${ursprung} · ${zusammenfassung.gesamt} Adressen · ${zusammenfassung.indexierbar} indexierbar\n`);
  console.log(tabelle(['Kennzahl', 'Zahl'], [
    ['Adressen gesamt', zusammenfassung.gesamt],
    ['indexierbar', zusammenfassung.indexierbar],
    ['noindex (Meta oder Kopf)', zusammenfassung.noindex],
    ['Weiterleitungen (Status 3xx)', zusammenfassung.weiterleitungen],
    ['Fehlerstatus (4xx, 5xx, Netzfehler)', zusammenfassung.fehlerstatus],
    ['Weiterleitung auf Fehlerziel', zusammenfassung.weiterleitungAufFehler],
    ['Status 200 ohne HTML', zusammenfassung.ohneHtml],
    ['title fehlt oder leer (HTML-Seiten)', zusammenfassung.titelFehlt],
    ['description fehlt oder leer (HTML-Seiten)', zusammenfassung.descriptionFehlt],
    ['h1 nicht genau eine (HTML-Seiten)', zusammenfassung.h1NichtEine],
    ['kein main-Element (HTML-Seiten)', zusammenfassung.keinMain],
    ['JSON-LD mit Parsefehler', zusammenfassung.jsonLdFehler],
    ['canonical auf anderen Ursprung (gleicher Pfad)', zusammenfassung.canonicalAnderesUrsprung],
    ['canonical abweichend oder ungültig', zusammenfassung.canonicalAbweichend],
  ]));
  console.log(`\n${tabelle(['Status', 'Adressen'], Object.entries(zusammenfassung.statusVerteilung))}`);
  console.log('\n### Dubletten unter indexierbaren Seiten\n');
  const dublZeilen = [
    ...dubl.titel.map((d) => `- Titel „${d.wert}“ (${d.adressen.length}): ${d.adressen.join(', ')}`),
    ...dubl.description.map((d) => `- Beschreibung „${d.wert.slice(0, 80)}…“ (${d.adressen.length}): ${d.adressen.join(', ')}`),
    ...dubl.h1.map((d) => `- h1 „${d.wert}“ (${d.adressen.length}): ${d.adressen.join(', ')}`),
  ];
  console.log(dublZeilen.length ? dublZeilen.join('\n') : 'keine');
  console.log('\n### Quellen und Grenzen\n');
  console.log(`- Sitemap: ${sitemapStand.eintraege} Einträge übernommen, ${sitemapStand.fremd} fremder Ursprung (nicht geprüft)${sitemapStand.befunde.length ? `, Befunde: ${sitemapStand.befunde.join('; ')}` : ''}`);
  console.log(`- Prerender-Manifest: ${prerenderStand.routen} Routen, ${prerenderStand.intern} interne (/_) übersprungen, ${prerenderStand.dynamisch} dynamische Vorlagen übersprungen${prerenderStand.befunde.length ? `, ${prerenderStand.befunde.join('; ')}` : ''}`);
  console.log(`- Nur aus Links gefunden: ${quellen.nurLinks}`);
  console.log(`- Grenze --max ${max}: ${verworfen.size} weitere Adressen nicht aufgenommen`);
  console.log(`\nJSON-Protokoll: ${protokollDatei}`);
  console.log(`TSV: ${tsvDatei}`);
}

main().catch((e) => {
  console.error(`Technischer Fehler: ${e.stack ?? e}`);
  process.exit(1);
});
