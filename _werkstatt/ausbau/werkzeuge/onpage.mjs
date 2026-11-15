#!/usr/bin/env node
// onpage.mjs – Eigene Onpage- und Technikprüfung über alle Seiten der Sitemap (FA-SEO-02).
// Aufruf: node onpage.mjs [--nur /pfad] [--grenze 95] [--aus id,id]
// Adressen: /sitemap.xml des laufenden Servers (verschachtelte Sitemaps werden gelesen) plus die Startseite.
// Kein Abruf nach außen (G1): nur localhost. Der HTML-Text wird ohne Skripte in einem Chromium ausgewertet
// (JavaScript aus, keine Ressourcen geladen; fremde Adressen werden im Browser abgefangen).
// Je Prüfung ein Status (ok, gelb, rot, nicht_bewertet, nicht_zutreffend, aus) und ein Gewicht.
// Wert je Seite: 100 · (Summe Gewicht × Anteil) / Summe Gewicht der bewerteten Prüfungen,
// Anteil 1 für ok, 0,5 für gelb, 0 für rot. Das ist eine eigene Ableitung (Stufe C), kein Seobility-Score.
// Der Wert wird ungerundet mit der Grenze verglichen; nur die Anzeige rundet ab (eine Nachkommastelle).
// Ausgabe: protokolle/onpage.json (alle Werte) und berichte/FA-SEO-02-onpage.md.
// Exit: 0 alle Seiten auf oder über der Grenze und kein roter seitenübergreifender Befund
//       1 mindestens eine Seite darunter ODER mindestens ein roter seitenübergreifender Befund
//       2 Bedienfehler · 3 technischer Fehler.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { BASIS_URL, PROTOKOLLE, WERKSTATT, argumente, ordner, zeitstempel, browserStarten } from './lib.mjs';

const UA = 'SM24-Onpage-Pruefung/1.0 (lokal)';
const ZEITLIMIT_MS = 15000;
const LOKAL = new Set(['localhost', '127.0.0.1', '[::1]']);
/** Schwelle des Projekts: Titelbreite höchstens 580 px in 20px Arial, gemessen wie in snippet.mjs (LAGEBILD Abschnitt 4). */
const TITEL_MAX_PX = 580;
/** Rückfall, nur wenn keine Breitenmessung möglich ist: höchstens 60 Zeichen (Schwelle des Projekts). */
const TITEL_MAX_ZEICHEN = 60;
/** Schwelle des Projekts (LAGEBILD.md Abschnitt 4: Beschreibung 120 bis 160 Zeichen). */
const BESCHR_MIN_ZEICHEN = 120;
const BESCHR_MAX_ZEICHEN = 160;
/** Generische Ankertexte. Festlegung des Projekts; Seobility nennt „mehr lesen“ als wenig wirksam (FA-RECHERCHE-05 §2, B). */
const ANKER_GENERISCH = new Set([
  'hier', 'hier klicken', 'klicken', 'mehr', 'mehr lesen', 'mehr erfahren', 'mehr infos', 'weiter', 'weiterlesen',
  'link', 'here', 'click here', 'more', 'read more',
]);

const bedienfehler = (text) => { console.error(`Bedienfehler: ${text}`); process.exit(2); };

// ---------------------------------------------------------------------------
// Prüfungen. Jede Prüfung: id, Titel, Gewicht, Quelle und eine Funktion (f = Seitenbefund, c = Kontext).
// ---------------------------------------------------------------------------
const r = (status, detail = '') => ({ status, detail });

export const PRUEFUNGEN = [
  {
    id: 'status', titel: 'Statuscode 200 und HTML', gewicht: 3,
    quelle: 'Eigene Festlegung (Stufe C); Prüfbereich Serverkonfiguration laut Seobility (B, FA-RECHERCHE-05 §1)',
    pruefe: (f, c) => {
      if (c.status !== 200) return r('rot', `HTTP ${c.status}`);
      if (!c.htmlOk) return r('rot', 'Antwort ist kein HTML');
      return r('ok', 'HTTP 200, HTML');
    },
  },
  {
    id: 'titel_einzeln', titel: 'Genau ein Titel', gewicht: 2,
    quelle: 'Seobility Meta-Informationen (B, FA-RECHERCHE-05 §2); Anzahl als Festlegung (C)',
    pruefe: (f) => {
      const n = f.titel.length;
      if (n === 1) return r('ok', '1 Titel');
      if (n === 0) return r('rot', 'kein Titel');
      return r('rot', `${n} Titel`);
    },
  },
  {
    id: 'titel_laenge', titel: 'Titellänge', gewicht: 1,
    quelle: `Schwelle des Projekts: Breite höchstens ${TITEL_MAX_PX} px in 20px Arial, gemessen wie in snippet.mjs (LAGEBILD Abschnitt 4); Rückfall höchstens ${TITEL_MAX_ZEICHEN} Zeichen, nur ohne Messung. Seobility-Wiki 55 bis 65 Zeichen (B); Schriftbelegung durch fc-match, Ersatz Liberation Sans`,
    pruefe: (f) => {
      const t = (f.titel[0] ?? '').trim();
      const len = [...t].length;
      if (len === 0) return r('rot', 'Titel leer');
      const px = f.titelPx?.[0];
      if (typeof px === 'number' && Number.isFinite(px)) {
        const gerundet = Math.round(px);
        if (px > TITEL_MAX_PX) return r('gelb', `${gerundet} px, Schwelle ${TITEL_MAX_PX} px`);
        return r('ok', `${gerundet} px, ${len} Zeichen`);
      }
      if (len > TITEL_MAX_ZEICHEN) return r('gelb', `${len} Zeichen ohne Messung, Schwelle ${TITEL_MAX_ZEICHEN}`);
      return r('ok', `${len} Zeichen ohne Messung`);
    },
  },
  {
    id: 'beschreibung_vorhanden', titel: 'Beschreibung vorhanden', gewicht: 2,
    quelle: 'Seobility Meta-Description, fehlend oder falsch (B, FA-RECHERCHE-05 §2)',
    pruefe: (f) => {
      const n = f.beschreibung.length;
      if (n === 0) return r('rot', 'fehlt');
      if (n > 1) return r('rot', `${n} Beschreibungen`);
      if ((f.beschreibung[0] ?? '').trim() === '') return r('rot', 'leer');
      return r('ok', 'vorhanden');
    },
  },
  {
    id: 'beschreibung_laenge', titel: 'Beschreibungslänge', gewicht: 1,
    quelle: `Schwelle des Projekts: ${BESCHR_MIN_ZEICHEN} bis ${BESCHR_MAX_ZEICHEN} Zeichen (LAGEBILD Abschnitt 4). Widerspruch zu 1850 Pixel bei Seobility (OFFENE FRAGE)`,
    pruefe: (f) => {
      const t = (f.beschreibung[0] ?? '').trim();
      const len = [...t].length;
      if (len === 0) return r('nicht_zutreffend', 'keine Beschreibung');
      if (len < BESCHR_MIN_ZEICHEN || len > BESCHR_MAX_ZEICHEN) {
        return r('gelb', `${len} Zeichen, Schwelle ${BESCHR_MIN_ZEICHEN} bis ${BESCHR_MAX_ZEICHEN}`);
      }
      return r('ok', `${len} Zeichen`);
    },
  },
  {
    id: 'h1', titel: 'Genau eine h1', gewicht: 2,
    quelle: 'Seobility H1: Empfehlung eine H1 je Seite (B, FA-RECHERCHE-05 §2); Zählung als Festlegung (C)',
    pruefe: (f) => {
      const n = f.h1.length;
      if (n !== 1) return r('rot', `${n} h1`);
      if (f.h1[0] === '') return r('rot', 'h1 leer');
      return r('ok', '1 h1');
    },
  },
  {
    id: 'ueberschriften', titel: 'Überschriften ohne Sprung', gewicht: 1,
    quelle: 'Seobility Überschriftenhierarchie (B, ohne Zahlen); Sprung über mehr als eine Ebene als Festlegung (C)',
    pruefe: (f) => {
      if (f.ueberschriften.length === 0) return r('nicht_zutreffend', 'keine Überschriften');
      let vorher = 1;
      const spruenge = [];
      for (const ebene of f.ueberschriften) {
        if (ebene > vorher + 1) spruenge.push(`h${vorher} zu h${ebene}`);
        vorher = ebene;
      }
      if (spruenge.length > 0) return r('gelb', spruenge.join(', '));
      return r('ok', 'keine Sprünge');
    },
  },
  {
    id: 'lang', titel: 'Sprachangabe de', gewicht: 1,
    quelle: 'Seobility Sprachangabe, inkonsistent (B); lang="de" als Festlegung des Projekts (C)',
    pruefe: (f) => {
      const l = (f.lang ?? '').trim();
      if (!l) return r('rot', 'lang fehlt');
      if (/^de(-|$)/i.test(l)) return r('ok', `lang="${l}"`);
      return r('gelb', `lang="${l}"`);
    },
  },
  {
    id: 'canonical', titel: 'Canonical auf die eigene Adresse', gewicht: 2,
    quelle: 'Seobility Canonical, fehlend oder fehlerhaft (B, FA-RECHERCHE-05 §2)',
    pruefe: (f, c) => {
      const n = f.canonical.length;
      if (n === 0) return r('gelb', 'fehlt');
      if (n > 1) return r('rot', `${n} canonical`);
      let abs;
      try { abs = new URL(f.canonical[0], c.url); } catch { return r('rot', `ungültig: ${f.canonical[0]}`); }
      abs.hash = '';
      if (abs.href === c.url) return r('ok', 'auf die eigene Adresse');
      return r('rot', `zeigt auf ${abs.href}`);
    },
  },
  {
    id: 'noindex', titel: 'Kein noindex in der Sitemap', gewicht: 3,
    quelle: 'Google: noindex im Meta-Tag oder X-Robots-Tag, Wirkung gleich (B, block-indexing); Seobility Indexierung (B). Die Prüfung gilt nur für Adressen der Sitemap; sonst nicht zutreffend',
    pruefe: (f, c) => {
      if (c.inSitemap === false) return r('nicht_zutreffend', 'nicht in der Sitemap');
      const werte = [...f.robots, ...(c.xRobots ? [c.xRobots] : [])];
      if (werte.some((w) => /\b(noindex|none)\b/i.test(w))) return r('rot', 'noindex auf einer Seite der Sitemap');
      return r('ok', 'indexierbar');
    },
  },
  {
    id: 'alt', titel: 'Bilder mit Alt-Attribut', gewicht: 1,
    quelle: 'Seobility Alt-Texte, ohne Zeichenzahl (B); Alt-Attribut vorhanden, leerer Wert für Zierbilder erlaubt (C)',
    pruefe: (f) => {
      const relevant = f.bilder.filter((b) => !b.versteckt && !['presentation', 'none'].includes((b.rolle ?? '').toLowerCase()));
      if (relevant.length === 0) return r('nicht_zutreffend', 'keine Bilder');
      const fehlend = relevant.filter((b) => b.alt === null).length;
      if (fehlend > 0) return r('gelb', `${fehlend} von ${relevant.length} ohne alt`);
      return r('ok', `${relevant.length} Bilder mit alt`);
    },
  },
  {
    id: 'interne_links', titel: 'Interne Verweise ohne Fehlerziel', gewicht: 2,
    quelle: 'Seobility Interne Links (B, FA-RECHERCHE-05 §2); Prüfung je Ziel gegen Sitemap und HEAD-Abruf am lokalen Server (C)',
    pruefe: (f, c) => {
      const lb = c.linkBefunde;
      if (lb.length === 0) return r('nicht_zutreffend', 'keine internen Verweise');
      const rot = lb.filter((x) => x.klasse === 'rot');
      const gelb = lb.filter((x) => x.klasse === 'gelb');
      if (rot.length > 0) {
        const beispiele = rot.slice(0, 3).map((x) => `${x.ziel} (${x.status})`).join(', ');
        return r('rot', `${rot.length} Fehlerziele, z. B. ${beispiele}`);
      }
      if (gelb.length > 0) return r('gelb', `${gelb.length} Weiterleitungen`);
      return r('ok', `${lb.length} Ziele geprüft`);
    },
  },
  {
    id: 'ankertext', titel: 'Sprechende Ankertexte', gewicht: 1,
    quelle: 'Seobility Interne Links und Link-Text, allgemeine Texte wenig wirksam (B); Wortliste als Festlegung (C)',
    pruefe: (f) => {
      const verweise = f.links.filter((l) => !/^(#|mailto:|tel:|javascript:)/i.test(l.href.trim()));
      if (verweise.length === 0) return r('nicht_zutreffend', 'keine Verweise');
      const probleme = new Set();
      for (const l of verweise) {
        // Zugänglicher Name nach ARIA: aria-label geht dem Inhalt vor, danach Text, title, Bild-alt.
        const name = l.aria || l.text || l.titel || (l.bild ? 'Bild' : '');
        if (name === '') probleme.add('ohne Text');
        else if (ANKER_GENERISCH.has(name.toLowerCase())) probleme.add(`„${name}“`);
      }
      if (probleme.size > 0) return r('gelb', `${probleme.size} Arten: ${[...probleme].slice(0, 3).join(', ')}`);
      return r('ok', `${verweise.length} Verweise`);
    },
  },
  {
    id: 'titel_eindeutig', titel: 'Titel über alle Seiten eindeutig', gewicht: 1,
    quelle: 'Seobility doppelter Inhalt (B, ohne Grenze); Eindeutigkeit der Titel als Festlegung (C)',
    pruefe: (f, c) => {
      if (f.titel.length === 0 || f.titel[0] === '') return r('nicht_zutreffend', 'kein Titel');
      return c.doppeltTitel ? r('gelb', 'Titel kommt auch auf anderen Seiten vor') : r('ok', 'eindeutig');
    },
  },
  {
    id: 'beschreibung_eindeutig', titel: 'Beschreibung über alle Seiten eindeutig', gewicht: 1,
    quelle: 'Seobility doppelter Inhalt (B, ohne Grenze); Eindeutigkeit der Beschreibungen als Festlegung (C)',
    pruefe: (f, c) => {
      if ((f.beschreibung[0] ?? '').trim() === '') return r('nicht_zutreffend', 'keine Beschreibung');
      return c.doppeltBeschr ? r('gelb', 'Beschreibung kommt auch auf anderen Seiten vor') : r('ok', 'eindeutig');
    },
  },
  {
    id: 'eingehend', titel: 'Interner Verweis von einer anderen Seite', gewicht: 1,
    quelle: 'Festlegung (C); Seobility führt keine Schwelle (FA-RECHERCHE-05 §2 Interne Links, B)',
    pruefe: (f, c) => {
      if (c.istStartseite) return r('nicht_zutreffend', 'Startseite');
      if (c.eingehend === null) return r('nicht_bewertet', 'nur im Gesamtlauf');
      return c.eingehend ? r('ok', 'verlinkt') : r('gelb', 'kein interner Verweis von einer anderen Seite');
    },
  },
  {
    id: 'textmenge', titel: 'Textmenge im Hauptinhalt', gewicht: 0,
    quelle: 'Seobility Textmenge, ohne Wortgrenze (B); keine belegte Schwelle, daher nur Anzeige (OFFENE FRAGE)',
    pruefe: (f) => r('nicht_bewertet', `${f.woerter} Wörter, keine belegte Schwelle`),
  },
  {
    id: 'strukturdaten', titel: 'Strukturierte Daten als gültiges JSON', gewicht: 1,
    quelle: 'Nicht in den gelesenen Seobility-Seiten belegt (FA-RECHERCHE-05 Abschnitt 2); eigene Festlegung (C)',
    pruefe: (f) => {
      if (f.jsonld.length === 0) return r('nicht_zutreffend', 'keine strukturierten Daten');
      const fehler = f.jsonld.filter((t) => { try { JSON.parse(t); return false; } catch { return true; } });
      if (fehler.length > 0) return r('rot', `${fehler.length} von ${f.jsonld.length} JSON-LD-Blöcken ungültig`);
      return r('ok', `${f.jsonld.length} JSON-LD-Blöcke gültig`);
    },
  },
  {
    id: 'viewport', titel: 'Viewport-Angabe', gewicht: 2,
    quelle: 'Seobility Mobiloptimierung, ohne Messgrenze (B); width=device-width als Festlegung (C)',
    pruefe: (f) => {
      if (f.viewport === null) return r('rot', 'fehlt');
      if (/width\s*=\s*device-width/i.test(f.viewport)) return r('ok', 'device-width');
      return r('gelb', `ohne width=device-width: ${f.viewport}`);
    },
  },
  {
    id: 'favicon', titel: 'Favicon angegeben', gewicht: 1,
    quelle: 'Nicht in den gelesenen Seobility-Seiten belegt (FA-RECHERCHE-05 OFFENE FRAGE 4); eigene Festlegung (C)',
    pruefe: (f) => (f.favicon ? r('ok', 'vorhanden') : r('gelb', 'kein link rel="icon"')),
  },
  {
    id: 'html_groesse', titel: 'Größe des HTML-Dokuments', gewicht: 0,
    quelle: 'Seobility Dateigröße, ohne Grenzwert (B); keine belegte Schwelle, daher nur Anzeige',
    pruefe: (f, c) => r('nicht_bewertet', `${c.bytes} Byte, keine belegte Schwelle`),
  },
];

/**
 * Bewertung: ok = 1, gelb = 0,5, rot = 0; nicht bewertete und abgeschaltete Prüfungen zählen nicht.
 * Der Wert wird NICHT gerundet, damit die Grenze (z. B. 95) ungerundet geprüft wird (94,83 liegt unter 95).
 */
export function bewerte(ergebnisse) {
  let summe = 0;
  let gewicht = 0;
  for (const e of ergebnisse) {
    if (!['ok', 'gelb', 'rot'].includes(e.status) || !(e.gewicht > 0)) continue;
    gewicht += e.gewicht;
    summe += e.gewicht * (e.status === 'ok' ? 1 : e.status === 'gelb' ? 0.5 : 0);
  }
  return gewicht === 0 ? 100 : (100 * summe) / gewicht;
}

/** Anzeige mit einer Nachkommastelle, immer abgerundet: ein Wert unter der Grenze erscheint nie als Grenze. */
export function anzeige(wert) {
  return Math.floor(wert * 10 + 1e-9) / 10;
}

/** Rückgabewert des Werkzeugs: 1 bei einer Seite unter der Grenze oder einem roten seitenübergreifenden Befund. */
export function exitCode(unterAnzahl, uebergreifend) {
  return (unterAnzahl > 0 || uebergreifend.some((u) => u.stufe === 'rot')) ? 1 : 0;
}

/**
 * Prüft eine Seite. f = Befund aus extrahiere() (null, wenn kein HTML), c = Kontext:
 * { url, status, htmlOk, xRobots, linkBefunde, eingehend, istStartseite, inSitemap, doppeltTitel, doppeltBeschr, bytes }.
 * inSitemap: false, wenn die Adresse nicht in der Sitemap steht (dann keine noindex-Bewertung).
 */
export function pruefeSeite(f, c, aus = new Set()) {
  const ergebnisse = PRUEFUNGEN.map((p) => {
    if (aus.has(p.id)) return { id: p.id, titel: p.titel, gewicht: p.gewicht, status: 'aus', detail: 'abgeschaltet' };
    const erg = !f && p.id !== 'status' ? r('nicht_zutreffend', 'keine HTML-Auswertung') : p.pruefe(f, c);
    return { id: p.id, titel: p.titel, gewicht: p.gewicht, status: erg.status, detail: erg.detail };
  });
  return { ergebnisse, wert: bewerte(ergebnisse) };
}

// ---------------------------------------------------------------------------
// HTML auswerten: Chromium ohne Skripte, keine Ressourcen außer about:/data:.
// ---------------------------------------------------------------------------
/** Läuft im Browser. Gibt nur Rohdaten zurück; alle Entscheidungen fallen in pruefeSeite(). */
function seiteAuslesen() {
  const XHTML = 'http://www.w3.org/1999/xhtml';
  const alle = (sel) => Array.from(document.querySelectorAll(sel));
  const meta = (name) => alle('meta').filter((m) => (m.getAttribute('name') || '').toLowerCase() === name);
  const rel = (wert) => alle('link[rel]').filter((l) => (l.getAttribute('rel') || '').toLowerCase().split(/\s+/).includes(wert));
  const kopie = document.body ? document.body.cloneNode(true) : null;
  if (kopie) kopie.querySelectorAll('script,style,noscript,nav,header,footer,svg,template').forEach((e) => e.remove());
  const hauptteil = kopie ? (kopie.querySelector('main') || kopie) : null;
  const text = hauptteil ? hauptteil.textContent : '';
  const woerter = (text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length;
  const viewport = meta('viewport')[0];
  const titelListe = alle('title').filter((t) => t.namespaceURI === XHTML).map((t) => t.textContent.trim());
  // Breite wie in snippet.mjs: 20px Arial, canvas.measureText. Ohne Canvas bleibt die Liste leer (Rückfall).
  const messKontext = document.createElement('canvas').getContext('2d');
  const titelPx = messKontext ? titelListe.map((t) => {
    messKontext.font = '20px Arial';
    return messKontext.measureText(t).width;
  }) : [];
  return {
    lang: document.documentElement.getAttribute('lang'),
    titel: titelListe,
    titelPx,
    beschreibung: meta('description').map((m) => m.getAttribute('content') || ''),
    robots: [...meta('robots'), ...meta('googlebot')].map((m) => m.getAttribute('content') || ''),
    viewport: viewport ? (viewport.getAttribute('content') || '') : null,
    favicon: rel('icon').length > 0,
    canonical: rel('canonical').map((l) => l.getAttribute('href') || ''),
    ueberschriften: alle('h1,h2,h3,h4,h5,h6').map((h) => Number(h.tagName.slice(1))),
    h1: alle('h1').map((h) => h.textContent.trim()),
    // Versteckt: aria-hidden am Bild selbst oder an einem umgebenden Element.
    bilder: alle('img').map((i) => ({
      alt: i.getAttribute('alt'),
      rolle: i.getAttribute('role'),
      versteckt: i.getAttribute('aria-hidden') === 'true' || i.closest('[aria-hidden="true"]') !== null,
    })),
    links: alle('a[href]').map((a) => ({
      href: a.getAttribute('href') || '',
      text: (a.textContent || '').replace(/\s+/g, ' ').trim(),
      aria: a.getAttribute('aria-label') || '',
      titel: a.getAttribute('title') || '',
      // Bild mit Alt-Text, das zum Namen beiträgt (nicht versteckt).
      bild: Array.from(a.querySelectorAll('img')).some((i) => (i.getAttribute('alt') || '').trim() !== ''
        && i.getAttribute('aria-hidden') !== 'true' && i.closest('[aria-hidden="true"]') === null),
    })),
    jsonld: alle('script[type="application/ld+json"]').map((s) => s.textContent || ''),
    woerter,
  };
}

/** Browser-Seite ohne JavaScript; fremde Adressen werden abgefangen (G1). */
export async function vorbereiten(browser) {
  const kontext = await browser.newContext({ javaScriptEnabled: false, locale: 'de-DE', viewport: { width: 1280, height: 800 } });
  await kontext.route('**/*', (route) => {
    const protokoll = new URL(route.request().url()).protocol;
    return (protokoll === 'about:' || protokoll === 'data:') ? route.continue() : route.abort();
  });
  const seite = await kontext.newPage();
  return { kontext, seite };
}

/** Wertet HTML-Text aus. */
export async function extrahiere(seite, html, url) {
  await seite.setContent(html, { waitUntil: 'domcontentloaded', timeout: 20000 });
  const roh = await seite.evaluate(seiteAuslesen);
  return { ...roh, url, bytes: Buffer.byteLength(html, 'utf8') };
}

// ---------------------------------------------------------------------------
// Abrufe am lokalen Server und Adressen
// ---------------------------------------------------------------------------
async function holen(url, methode = 'GET') {
  const res = await fetch(url, {
    method: methode,
    redirect: 'manual',
    headers: { 'user-agent': UA, accept: 'text/html,application/xml;q=0.9,*/*;q=0.8' },
    signal: AbortSignal.timeout(ZEITLIMIT_MS),
  });
  const text = methode === 'HEAD' ? '' : await res.text();
  return {
    status: res.status,
    type: res.headers.get('content-type') || '',
    location: res.headers.get('location'),
    xRobots: res.headers.get('x-robots-tag'),
    text,
  };
}

const ohneAnker = (u) => { const x = new URL(u); x.hash = ''; return x.href; };
const schluessel = (u) => new URL(u).pathname.replace(/\/+$/, '') || '/';

/** Sitemap lesen, verschachtelte Sitemaps folgen, Startseite ergänzen. Fremde Ursprünge werden als Befund vermerkt. */
async function sitemapLesen(basis) {
  const befunde = [];
  const adressen = new Set();
  const fremd = [];
  async function lese(url, tiefe) {
    if (tiefe > 3) return;
    let res;
    try { res = await holen(url); } catch (e) { befunde.push({ id: 'sitemap_erreichbar', adresse: url, detail: e.message }); return; }
    if (res.status !== 200) { befunde.push({ id: 'sitemap_erreichbar', adresse: url, detail: `HTTP ${res.status}` }); return; }
    for (const m of res.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      let u;
      try { u = new URL(m[1].trim()); } catch { befunde.push({ id: 'sitemap_erreichbar', adresse: m[1], detail: 'ungültige Adresse' }); continue; }
      if (u.origin !== basis.origin) { fremd.push(u.href); continue; }
      if (u.pathname.endsWith('.xml')) await lese(u.href, tiefe + 1);
      else adressen.add(ohneAnker(u.href));
    }
  }
  await lese(new URL('/sitemap.xml', basis).href, 0);
  adressen.add(new URL('/', basis).href);
  return { adressen: [...adressen], fremd, befunde };
}

/** Interne Ziele einer Seite (absolut, ohne Anker), eindeutig in Dokumentreihenfolge. */
function internZiele(f, url, origin) {
  const ziele = [];
  for (const l of f.links) {
    const href = l.href.trim();
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) continue;
    let abs;
    try { abs = new URL(href, url); } catch { continue; }
    if (abs.origin !== origin) continue;
    ziele.push(ohneAnker(abs.href));
  }
  return [...new Set(ziele)];
}

/**
 * Ein internes Ziel prüfen (Paket FA-SEO-02, So bauen Punkt 3: HEAD). Sitemap-Adressen gelten ohne Abruf
 * (ihr Status wird auf der eigenen Seite geprüft). Sonst HEAD; nur bei 405 (HEAD nicht erlaubt) ein GET.
 */
export async function zielPruefen(ziel, sitemapPfade, cache) {
  const u = new URL(ziel);
  if (!u.search && sitemapPfade.has(u.pathname)) return { ziel, status: 200, klasse: 'ok', via: 'sitemap' };
  if (cache.has(ziel)) return cache.get(ziel);
  let erg;
  try {
    let res = await holen(ziel, 'HEAD');
    let via = 'head';
    if (res.status === 405) { res = await holen(ziel, 'GET'); via = 'get-nach-405'; }
    erg = { ziel, status: res.status, klasse: res.status >= 400 ? 'rot' : (res.status >= 300 ? 'gelb' : 'ok'), via };
  } catch (e) {
    erg = { ziel, status: 'Fehler', klasse: 'rot', via: 'abruf', fehler: e.message };
  }
  cache.set(ziel, erg);
  return erg;
}

/** Doppelte Werte (normalisiert) über alle Seiten: Menge der betroffenen Adressen und die Gruppen. */
function doppelte(paare) {
  const gruppen = new Map();
  for (const { url, wert } of paare) {
    const k = wert.trim().toLowerCase();
    if (!k) continue;
    if (!gruppen.has(k)) gruppen.set(k, []);
    gruppen.get(k).push(url);
  }
  const betroffen = new Set();
  const liste = [];
  for (const [wert, urls] of gruppen) {
    if (urls.length > 1) { urls.forEach((u) => betroffen.add(u)); liste.push({ wert, seiten: urls }); }
  }
  return { betroffen, liste };
}

// ---------------------------------------------------------------------------
// Lauf
// ---------------------------------------------------------------------------
function median(werte) {
  if (werte.length === 0) return null;
  const s = [...werte].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Anzeige einer Zahl mit einer Nachkommastelle (abgerundet, siehe anzeige()). */
const fmt = (x) => (x === null ? '–' : anzeige(x).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }));

function markdown({ zeit, basis, grenze, aus, nur, seiten, uebergreifend, zusammenfassung }) {
  const zeilen = [];
  zeilen.push('# FA-SEO-02 · Onpage-Prüfung über alle Seiten des Builds');
  zeilen.push('');
  zeilen.push('Stand: ' + zeit + ' · Basis: ' + basis + ' · Grenze: ' + grenze + (nur ? ' · nur ' + nur : '') + (aus.length ? ' · abgeschaltet: ' + aus.join(', ') : ''));
  zeilen.push('');
  zeilen.push('Der Wert (0 bis 100) ist eine eigene Ableitung aus den Prüfungen dieses Werkzeugs (Stufe C). Er ist nicht der Seobility-Score und nicht mit ihm vergleichbar. Gewichte und Teilwertung sind Festlegungen; die Gewichtung von Seobility ist nicht bekannt (FA-RECHERCHE-05, OFFENE FRAGE 1). Ein gelber Befund zählt halb, ein roter gar nicht.');
  zeilen.push('');
  zeilen.push('## Zusammenfassung');
  zeilen.push('');
  zeilen.push(`- Seiten: ${zusammenfassung.seiten}`);
  zeilen.push(`- Median des Werts: ${fmt(zusammenfassung.median)}`);
  zeilen.push(`- Seiten unter ${grenze}: ${zusammenfassung.unterGrenze}`);
  zeilen.push(`- Rote Befunde: ${zusammenfassung.rot} · gelbe Befunde: ${zusammenfassung.gelb}`);
  zeilen.push('');
  zeilen.push('Zehn häufigste Befunde (Zahl der Seiten):');
  zeilen.push('');
  if (zusammenfassung.haeufig.length === 0) zeilen.push('keine');
  for (const h of zusammenfassung.haeufig) zeilen.push(`- ${h.id} (${h.stufe}): ${h.seiten} Seiten`);
  zeilen.push('');
  zeilen.push('## Seiten');
  zeilen.push('');
  zeilen.push('| Adresse | Wert | Rot | Gelb | Befunde |');
  zeilen.push('|---|---|---|---|---|');
  for (const s of seiten) {
    const b = s.befunde.map((x) => `${x.id} (${x.status}: ${x.detail})`).join('; ').replace(/\|/g, '\\|') || '–';
    zeilen.push(`| ${s.adresse.replace(BASIS_URL, '')} | ${fmt(s.wert)} | ${s.rot} | ${s.gelb} | ${b} |`);
  }
  zeilen.push('');
  zeilen.push('## Seitenübergreifend');
  zeilen.push('');
  if (uebergreifend.length === 0) zeilen.push('keine Befunde');
  for (const u of uebergreifend) zeilen.push(`- ${u.id} (${u.stufe}): ${u.detail}`);
  zeilen.push('');
  zeilen.push('Rückgabewert: 1, wenn eine Seite unter der Grenze liegt oder ein seitenübergreifender Befund rot ist; sonst 0.');
  zeilen.push('');
  zeilen.push('Belege: protokolle/onpage.json (alle Werte und Einzelprüfungen). Selbsttest: werkzeuge/onpage.test.mjs.');
  zeilen.push('');
  return zeilen.join('\n');
}

export async function main() {
  const args = argumente();
  for (const k of ['nur', 'grenze', 'aus']) {
    if (args[k] === true) bedienfehler(`--${k} braucht einen Wert`);
  }
  const grenze = args.grenze === undefined ? 95 : Number(args.grenze);
  if (!Number.isFinite(grenze) || grenze < 0 || grenze > 100) bedienfehler('--grenze muss zwischen 0 und 100 liegen');
  const aus = args.aus ? String(args.aus).split(',').map((s) => s.trim()).filter(Boolean) : [];
  for (const id of aus) if (!PRUEFUNGEN.some((p) => p.id === id)) bedienfehler(`unbekannte Prüfung „${id}“`);
  const basis = new URL(BASIS_URL);
  if (!LOKAL.has(basis.hostname)) bedienfehler(`nur localhost ist erlaubt (G1), nicht ${basis.hostname}`);
  let nur = null;
  if (args.nur !== undefined) {
    try { nur = ohneAnker(new URL(args.nur, basis).href); } catch { bedienfehler(`--nur „${args.nur}“ ist keine Adresse`); }
    if (new URL(nur).origin !== basis.origin) bedienfehler('--nur muss eine Adresse des Basis-Servers sein');
  }
  const zeit = new Date().toISOString();

  const sm = await sitemapLesen(basis);
  const adressen = nur ? [nur] : sm.adressen;
  const sitemapPfade = new Set(sm.adressen.map((a) => new URL(a).pathname));
  const sitemapAdressen = new Set(sm.adressen.map(ohneAnker));

  // 1. Seiten abrufen und auswerten
  const browser = await browserStarten();
  let daten;
  try {
    const { kontext, seite } = await vorbereiten(browser);
    daten = [];
    for (const url of adressen) {
      let res;
      try { res = await holen(url); } catch (e) { daten.push({ url, status: 0, fehler: e.message, htmlOk: false, xRobots: null, f: null }); continue; }
      const htmlOk = res.status === 200 && /html/i.test(res.type);
      const f = htmlOk ? await extrahiere(seite, res.text, url) : null;
      daten.push({ url, status: res.status, location: res.location, htmlOk, xRobots: res.xRobots, f });
    }
    await kontext.close();
  } finally {
    await browser.close();
  }

  // 2. Verweise: Eingänge je Seite, Ziele prüfen
  const eingang = new Map();
  for (const s of daten) {
    if (!s.f) continue;
    for (const ziel of internZiele(s.f, s.url, basis.origin)) {
      const k = schluessel(ziel);
      if (k === schluessel(s.url)) continue;
      if (!eingang.has(k)) eingang.set(k, new Set());
      eingang.get(k).add(s.url);
    }
  }
  const cache = new Map();
  for (const s of daten) {
    s.linkBefunde = [];
    if (!s.f) continue;
    for (const ziel of internZiele(s.f, s.url, basis.origin)) {
      s.linkBefunde.push(await zielPruefen(ziel, sitemapPfade, cache));
    }
  }

  // 3. Seitenübergreifend: doppelte Titel und Beschreibungen
  const dTitel = doppelte(daten.filter((s) => s.f).map((s) => ({ url: s.url, wert: s.f.titel[0] ?? '' })));
  const dBeschr = doppelte(daten.filter((s) => s.f).map((s) => ({ url: s.url, wert: s.f.beschreibung[0] ?? '' })));

  // 4. Prüfen
  const ausSet = new Set(aus);
  const seiten = [];
  for (const s of daten) {
    const c = {
      url: ohneAnker(s.url),
      status: s.status,
      htmlOk: s.htmlOk,
      xRobots: s.xRobots,
      linkBefunde: s.linkBefunde,
      eingehend: nur ? null : (eingang.get(schluessel(s.url))?.size ?? 0) > 0,
      istStartseite: schluessel(s.url) === '/',
      inSitemap: sitemapAdressen.has(ohneAnker(s.url)),
      doppeltTitel: dTitel.betroffen.has(s.url),
      doppeltBeschr: dBeschr.betroffen.has(s.url),
      bytes: s.f ? s.f.bytes : 0,
    };
    const { ergebnisse, wert } = pruefeSeite(s.f, c, ausSet);
    const befunde = ergebnisse.filter((e) => e.status === 'rot' || e.status === 'gelb')
      .map((e) => ({ id: e.id, status: e.status, detail: e.detail }));
    seiten.push({
      adresse: s.url,
      status: s.status,
      wert,
      rot: befunde.filter((b) => b.status === 'rot').length,
      gelb: befunde.filter((b) => b.status === 'gelb').length,
      befunde,
      woerter: s.f ? s.f.woerter : null,
      html_bytes: c.bytes,
      interne_ziele: s.linkBefunde.length,
      eingehend: c.eingehend,
      ergebnisse,
    });
  }

  // 5. Seitenübergreifende Befunde
  const uebergreifend = [];
  const rob = await holen(new URL('/robots.txt', basis).href).catch((e) => ({ status: 0, text: '', fehler: e.message }));
  if (rob.status !== 200) uebergreifend.push({ id: 'robots_erreichbar', stufe: 'rot', detail: `robots.txt: HTTP ${rob.status}` });
  else if (!/^sitemap:/im.test(rob.text)) uebergreifend.push({ id: 'robots_erreichbar', stufe: 'gelb', detail: 'robots.txt ohne Sitemap-Zeile' });
  for (const b of sm.befunde) uebergreifend.push({ id: 'sitemap_erreichbar', stufe: 'rot', detail: `${b.adresse}: ${b.detail}` });
  if (sm.adressen.length === 0) uebergreifend.push({ id: 'sitemap_erreichbar', stufe: 'rot', detail: 'keine Adresse in der Sitemap' });
  if (sm.fremd.length > 0) uebergreifend.push({ id: 'sitemap_fremde_adressen', stufe: 'rot', detail: sm.fremd.slice(0, 5).join(', ') });
  const fehlerAdressen = seiten.filter((s) => s.status !== 200 && nur === null).map((s) => `${s.adresse} (${s.status})`);
  if (fehlerAdressen.length > 0) uebergreifend.push({ id: 'sitemap_fehleradressen', stufe: 'rot', detail: `${fehlerAdressen.length}: ${fehlerAdressen.slice(0, 5).join(', ')}` });
  for (const g of dTitel.liste) uebergreifend.push({ id: 'titel_doppelt', stufe: 'gelb', detail: `„${g.wert}“ auf ${g.seiten.length} Seiten` });
  for (const g of dBeschr.liste) uebergreifend.push({ id: 'beschreibung_doppelt', stufe: 'gelb', detail: `„${g.wert.slice(0, 60)}…“ auf ${g.seiten.length} Seiten` });
  if (nur) uebergreifend.push({ id: 'gesamtlauf', stufe: 'hinweis', detail: '--nur: nur eine Seite geprüft, Eingänge nicht bewertet' });

  // 6. Zusammenfassung
  const werte = seiten.map((s) => s.wert);
  const unter = seiten.filter((s) => s.wert < grenze);
  const zaehler = new Map();
  for (const s of seiten) for (const b of s.befunde) {
    if (!zaehler.has(b.id)) zaehler.set(b.id, { id: b.id, seiten: 0, rot: 0, gelb: 0 });
    const z = zaehler.get(b.id);
    z.seiten += 1;
    if (b.status === 'rot') z.rot += 1; else z.gelb += 1;
  }
  const haeufig = [...zaehler.values()].sort((a, b) => b.seiten - a.seiten || a.id.localeCompare(b.id)).slice(0, 10)
    .map((z) => ({ id: z.id, stufe: z.rot && z.gelb ? 'rot und gelb' : z.rot ? 'rot' : 'gelb', seiten: z.seiten }));
  const zusammenfassung = {
    seiten: seiten.length,
    median: median(werte),
    unterGrenze: unter.length,
    rot: seiten.reduce((a, s) => a + s.rot, 0),
    gelb: seiten.reduce((a, s) => a + s.gelb, 0),
    haeufig,
    unterGrenzeAdressen: unter.map((s) => s.adresse),
  };

  // 7. Ausgabe
  const protokoll = path.join(PROTOKOLLE, 'onpage.json');
  const bericht = path.join(WERKSTATT, 'berichte', 'FA-SEO-02-onpage.md');
  ordner(PROTOKOLLE);
  ordner(path.dirname(bericht));
  const daten2 = {
    skript: 'onpage',
    zeit,
    argumente: { nur, grenze, aus },
    basis: BASIS_URL,
    hinweis: 'Wert ist eine eigene Ableitung (Stufe C), nicht der Seobility-Score.',
    pruefungen: PRUEFUNGEN.map((p) => ({ id: p.id, titel: p.titel, gewicht: p.gewicht, quelle: p.quelle, aus: aus.includes(p.id) })),
    zusammenfassung,
    seitenuebergreifend: uebergreifend,
    seiten,
  };
  writeFileSync(protokoll, `${JSON.stringify(daten2, null, 2)}\n`);
  writeFileSync(bericht, markdown({
    zeit: zeitstempel(), basis: BASIS_URL, grenze, aus, nur, seiten, uebergreifend, zusammenfassung,
  }));

  console.log(`Seiten: ${zusammenfassung.seiten} · Median: ${fmt(zusammenfassung.median)} · unter ${grenze}: ${zusammenfassung.unterGrenze}`);
  console.log(`Rote Befunde: ${zusammenfassung.rot} · gelbe Befunde: ${zusammenfassung.gelb}`);
  for (const h of haeufig) console.log(`  ${h.id} (${h.stufe}): ${h.seiten} Seiten`);
  console.log(`Protokoll: ${protokoll}`);
  console.log(`Bericht: ${bericht}`);
  return exitCode(unter.length, uebergreifend);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().then((code) => { process.exitCode = code; }).catch((e) => {
    console.error(`Technischer Fehler: ${e?.stack ?? e}`);
    process.exitCode = 3;
  });
}
