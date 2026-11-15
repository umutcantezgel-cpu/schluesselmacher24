import { readFileSync } from 'node:fs';
import path from 'node:path';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import type { PageContent, ServicePage } from '@/lib/types';
import { pages } from './defaults/content';
import { servicePages } from './defaults/service-pages';

/*
 * Suchergebnis-Texte der Rubrik-, Bereichs- und Leistungsseiten (FA-SEO-01A, FA-25).
 *
 * Quellen: content/seo.json mit Rückfall pages() und content/service-pages.json mit Rückfall
 * servicePages().
 *
 * Zählweise wie auf der Seite: Das Wurzel-Layout hängt „ | SCHLÜSSELMACHER24“ an jeden Titel
 * (Vorlage „%s | SCHLÜSSELMACHER24“). Nur die Startseite setzt ihren Titel absolut und trägt die
 * Marke selbst. Gezählt werden Unicode-Zeichen wie in werkzeuge/onpage.mjs.
 *
 * Regeln:
 * - Titel samt Marke höchstens 60 Zeichen, die Marke genau einmal, kein senkrechter Strich außer
 *   vor der Marke.
 * - Beschreibung 120 bis 160 Zeichen. Ausnahme: Seiten mit `seo.noindex` erscheinen nicht in
 *   Suchergebnissen; ihre Beschreibung darf kürzer sein, aber nicht leer und nicht länger als 160.
 * - Kein Titel und keine Beschreibung doppelt über beide Quellen.
 * - Kein Gedankenstrich (– oder —, auch nicht als „ - “).
 * - Keine Zusagen, die die Seite nicht belegt: schnell, zuverlässig, günstig, sofort,
 *   24 Stunden, rund um die Uhr, keine Preise und keine Fristen in Zahlen (R9).
 */

const MARKE = 'SCHLÜSSELMACHER24';
const VORLAGE = ` | ${MARKE}`;
const TITEL_MAX = 60;
const BESCHR_MIN = 120;
const BESCHR_MAX = 160;
const VERBOTEN =
  /schnell|zuverlässig|günstig|sofort|24\s?(stunden|h\b|\/\s?7)|rund um die uhr|€|\beuro\b|\d+\s?(minuten|stunden|tage|werktage)/i;

const lies = <T,>(datei: string) =>
  JSON.parse(readFileSync(path.join(process.cwd(), 'content', datei), 'utf8')) as T;

const seiten = lies<PageContent[]>('seo.json');
const leistungen = lies<ServicePage[]>('service-pages.json');

interface Eintrag {
  wo: string;
  titel: string;
  beschreibung: string;
  noindex: boolean;
}

/** Fertiger Titel, wie er im Kopf der Seite steht. */
const fertigerTitel = (route: string, titel: string) => (route === '' ? titel : `${titel}${VORLAGE}`);

const eintraege: Eintrag[] = [
  ...seiten.map((s) => ({
    wo: `/${s.route}`,
    titel: fertigerTitel(s.route, s.seo.title),
    beschreibung: s.seo.description,
    noindex: s.seo.noindex === true,
  })),
  ...leistungen.map((p) => ({
    wo: `/${p.area}/${p.slug}`,
    titel: fertigerTitel(p.slug, p.seo.title),
    beschreibung: p.seo.description,
    noindex: p.seo.noindex === true,
  })),
];

const zeichen = (text: string) => [...text].length;

describe('Titel und Beschreibungen in den Längen (FA-SEO-01A)', () => {
  it.each(eintraege)('$wo: Titel samt Marke höchstens 60 Zeichen, Marke genau einmal', ({ titel }) => {
    expect(zeichen(titel), titel).toBeLessThanOrEqual(TITEL_MAX);
    expect(titel.split(MARKE).length - 1, titel).toBe(1);
    expect(titel.endsWith(VORLAGE), titel).toBe(true);
    expect(titel.slice(0, -VORLAGE.length), titel).not.toContain('|');
  });

  it.each(eintraege)('$wo: Beschreibung 120 bis 160 Zeichen (noindex: nur nicht leer)', ({ beschreibung, noindex }) => {
    const n = zeichen(beschreibung.trim());
    expect(n, beschreibung).toBeLessThanOrEqual(BESCHR_MAX);
    if (noindex) expect(n, beschreibung).toBeGreaterThan(0);
    else expect(n, `${n} Zeichen: ${beschreibung}`).toBeGreaterThanOrEqual(BESCHR_MIN);
  });

  it.each(eintraege)('$wo: ohne Gedankenstrich und ohne unbelegte Zusage', ({ titel, beschreibung }) => {
    for (const text of [titel, beschreibung]) {
      expect(text).not.toMatch(/[–—]| - /);
      expect(text).not.toMatch(VERBOTEN);
    }
  });

  it('kein Titel und keine Beschreibung doppelt', () => {
    const doppelt = (werte: string[]) => werte.filter((w, i) => werte.indexOf(w) !== i);
    expect(doppelt(eintraege.map((e) => e.titel))).toEqual([]);
    expect(doppelt(eintraege.map((e) => e.beschreibung))).toEqual([]);
  });
});

describe('Rückfälle tragen dieselben Suchergebnis-Texte wie die Daten (FA-SEO-01A)', () => {
  const rueckfall = pages();

  it('jede Route des Rückfalls steht auch in content/seo.json', () => {
    for (const r of rueckfall) expect(seiten.some((s) => s.route === r.route), r.route).toBe(true);
  });

  it.each(rueckfall.map((r) => r.route))('„%s“: Titel und Beschreibung gleich', (route) => {
    const daten = seiten.find((s) => s.route === route);
    const code = rueckfall.find((r) => r.route === route);
    expect(code?.seo.title).toBe(daten?.seo.title);
    expect(code?.seo.description).toBe(daten?.seo.description);
  });

  it('Leistungsseiten: Rückfall und Daten gleich', () => {
    expect(servicePages().map((p) => [p.id, p.seo.title, p.seo.description])).toEqual(
      leistungen.map((p) => [p.id, p.seo.title, p.seo.description]),
    );
  });

  it('der Verweis auf die Autoschlüssel-Anfrage heißt überall „Termin anfragen“ (A-031)', () => {
    const links = [...seiten, ...rueckfall].flatMap((s) => s.seo.internalLinks);
    const anfrage = links.filter((l) => l.href === '/autoschluessel/anfrage');
    expect(anfrage.length).toBeGreaterThan(0);
    for (const l of anfrage) expect(l.label).toBe('Termin anfragen');
  });
});

/*
 * Rückfälle in generateMetadata der Seiten (Nachbesserung zu FA-SEO-01A).
 *
 * Seiten dürfen nur page.tsx-eigene Exporte haben, darum liest der Test die Rückfälle aus dem
 * Quelltext: Gesucht wird `page?.seo.title ?? …` und `page?.seo.description ?? …`. Rechts davon
 * stehen ein Text, verkettete Texte oder eine Konstante derselben Datei. Hat die Route einen
 * Eintrag in content/seo.json, muss der Rückfall gleich lauten; sonst gelten die Längenregeln.
 */
const SEITEN_MIT_RUECKFALL = [
  '',
  'service-und-termin',
  'partner-werden',
  'tuer-und-schliesstechnik',
  'sicherheitstechnik',
  'sicherheitstechnik/sicherheitscheck',
  'schluessel-einschicken',
  'schluessel-einschicken/anmelden',
  'schliessanlagen',
  'schliessanlagen/konfigurator',
  'schluessel-nach-vorlage',
  'schluessel-nach-vorlage/anfrage',
  'schluessel-nach-code',
  'elektronische-zutrittsloesungen',
  'elektronische-zutrittsloesungen/konfigurator',
  'gleichschliessende-zylinder',
  'gleichschliessende-zylinder/konfigurator',
];

function rueckfaelleAusQuelltext(route: string) {
  const datei = path.join(process.cwd(), 'src', 'app', '(site)', route, 'page.tsx');
  const quelle = ts.createSourceFile(datei, readFileSync(datei, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const konstanten = new Map<string, ts.Expression>();
  const funde: Record<'title' | 'description', ts.Expression[]> = { title: [], description: [] };

  const auswerten = (knoten: ts.Expression): string => {
    if (ts.isParenthesizedExpression(knoten)) return auswerten(knoten.expression);
    if (ts.isStringLiteral(knoten) || ts.isNoSubstitutionTemplateLiteral(knoten)) return knoten.text;
    if (ts.isBinaryExpression(knoten) && knoten.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      return auswerten(knoten.left) + auswerten(knoten.right);
    }
    if (ts.isIdentifier(knoten) && konstanten.has(knoten.text)) return auswerten(konstanten.get(knoten.text)!);
    throw new Error(`${route}: Rückfall nicht auswertbar: ${knoten.getText(quelle)}`);
  };

  const besuchen = (knoten: ts.Node) => {
    if (ts.isVariableDeclaration(knoten) && ts.isIdentifier(knoten.name) && knoten.initializer) {
      konstanten.set(knoten.name.text, knoten.initializer);
    }
    if (ts.isBinaryExpression(knoten) && knoten.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) {
      const links = knoten.left.getText(quelle).replace(/\s+/g, '');
      const feld = /^page\?\.seo\.(title|description)$/.exec(links)?.[1] as 'title' | 'description' | undefined;
      if (feld) funde[feld].push(knoten.right);
    }
    ts.forEachChild(knoten, besuchen);
  };
  besuchen(quelle);

  const eins = (feld: 'title' | 'description') => {
    expect(funde[feld].length, `${route}: genau ein Rückfall für seo.${feld}`).toBe(1);
    return auswerten(funde[feld][0]);
  };
  return { titel: eins('title'), beschreibung: eins('description') };
}

describe('Rückfälle in generateMetadata tragen dieselben Suchergebnis-Texte wie die Daten (FA-SEO-01A)', () => {
  it.each(SEITEN_MIT_RUECKFALL)('„/%s“: Rückfall gleich content/seo.json oder in den Längen', (route) => {
    const { titel, beschreibung } = rueckfaelleAusQuelltext(route);
    const daten = seiten.find((s) => s.route === route);
    if (daten) {
      expect(titel).toBe(daten.seo.title);
      expect(beschreibung).toBe(daten.seo.description);
      return;
    }
    const fertig = fertigerTitel(route, titel);
    expect(zeichen(fertig), fertig).toBeLessThanOrEqual(TITEL_MAX);
    expect(zeichen(beschreibung), beschreibung).toBeGreaterThanOrEqual(BESCHR_MIN);
    expect(zeichen(beschreibung), beschreibung).toBeLessThanOrEqual(BESCHR_MAX);
    for (const text of [fertig, beschreibung]) {
      expect(text).not.toMatch(/[–—]| - /);
      expect(text).not.toMatch(VERBOTEN);
    }
  });
});
