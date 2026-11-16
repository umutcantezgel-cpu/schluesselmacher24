import { readFileSync } from 'node:fs';
import path from 'node:path';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import codeLinesJson from '../../../content/code-lines.json';
import servicesJson from '../../../content/car-key-services.json';
import rulesJson from '../../../content/service-pricing.json';
import settingsJson from '../../../content/settings.json';
import vehiclesJson from '../../../content/vehicles.json';
import type {
  CarKeyService,
  CityPage,
  CodeLine,
  Guide,
  PageContent,
  PricingRule,
  ServicePage,
  Settings,
  VehicleMake,
} from '@/lib/types';
import { artikelKategorieBeschreibung, artikelKategorieTitel } from '@/lib/artikel';
import { codelinienFamilie, herstellerMitSeite } from '@/lib/codelinie';
import { codelinienTexte, herstellerTexte, kategorieTexte } from '@/lib/codelinie-texte';
import { ERREICHBARKEIT_STANDARD, erreichbarkeit, erreichbarkeitSatz } from '@/lib/erreichbarkeit';
import { KONTAKT_TITEL, kontaktBeschreibung } from '@/app/(site)/service-und-termin/kontakt/suchtexte';
import { leistungsPreise, markenTexte, modellTexte } from '@/lib/fahrzeug-texte';
import { GEWINNUNG_SEITEN, gewinnungRoute, gewinnungSeiteMitPflege, gewinnungSeitenFuer } from '@/lib/partner/gewinnung';
import { TITEL_MAX_PX, titelBreitePx } from '@/lib/titelbreite';
import { guides, pages } from './defaults/content';
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
  // Leistungsseite Schlüsselverlust (FA-05-07): ohne Eintrag in content/seo.json, es gelten die Längenregeln.
  'autoschluessel/schluesselverlust',
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

/* ==========================================================================
   Teil B (FA-SEO-01B): übrige Seiten

   Gleiche Regeln wie oben, dazu die Breite: Der fertige Titel samt Marke bleibt in 580 px bei
   20px Arial (`titelPasst`, obere Schranke der Messung in werkzeuge/onpage.mjs). Quellen:
   - Marken- und Modellseiten über die Generatoren in src/lib/fahrzeug-texte.ts, Daten
     content/vehicles.json, dazu erfundene lange Namen;
   - Codelinien-, Kategorie- und Herstellerseiten über src/lib/codelinie-texte.ts (Vorlagen);
   - Ratgeber aus content/guides.json, Rückfall guides() wortgleich;
   - Orte aus content/cities.json;
   - Partnerseiten aus src/lib/partner/gewinnung.ts;
   - feste `metadata` und Rückfälle in generateMetadata unter src/app/(site), gelesen aus dem
     Quelltext wie in Teil A.
   Ausnahme Kontakt: Die Beschreibung nennt die Erreichbarkeit aus den gepflegten Einstellungen im
   Wortlaut des Inhabers (FA-23, R1, R9). Nur dieser Satz ist von der Prüfung auf Zusagen
   ausgenommen; der Rest der Beschreibung wird wie überall geprüft.
   ========================================================================== */

const MARKEN = vehiclesJson as VehicleMake[];
const KONTEXT_FAHRZEUG = {
  services: servicesJson as CarKeyService[],
  rules: rulesJson as PricingRule[],
  booking: (settingsJson as unknown as Settings).booking,
};
const WERKSTATT = { street: 'Musterweg 1', postalCode: '35576', city: 'Wetzlar' };
const LINIEN = codeLinesJson as CodeLine[];
const RATGEBER_JSON = lies<Guide[]>('guides.json');
const ORTE = lies<CityPage[]>('cities.json');
const KONTEXT_CODE = {
  alle: LINIEN,
  versand: (settingsJson as unknown as Settings).shipping,
  ratgeber: RATGEBER_JSON.find((g) => g.slug === 'schluesselcode-finden') ?? null,
};

/** Titel (ohne Marke) und Beschreibung nach den Regeln aus Teil A und der Breite. */
function pruefeSuchtexte(wo: string, titel: string, beschreibung: string, optionen: { noindex?: boolean; erlaubterWortlaut?: string } = {}) {
  const fertig = `${titel}${VORLAGE}`;
  expect(zeichen(fertig), `${wo}: ${fertig}`).toBeLessThanOrEqual(TITEL_MAX);
  expect(titelBreitePx(fertig), `${wo}: ${fertig}`).toBeLessThanOrEqual(TITEL_MAX_PX);
  expect(titel, wo).not.toContain('|');
  expect(titel, wo).not.toContain(MARKE);
  const n = zeichen(beschreibung.trim());
  expect(n, `${wo}: ${beschreibung}`).toBeLessThanOrEqual(BESCHR_MAX);
  if (optionen.noindex) expect(n, wo).toBeGreaterThan(0);
  else expect(n, `${wo}: ${n} Zeichen: ${beschreibung}`).toBeGreaterThanOrEqual(BESCHR_MIN);
  for (const text of [titel, beschreibung]) {
    expect(text, wo).not.toMatch(/[–—]| - /);
    // Nur der freigegebene Wortlaut fällt heraus, alles Übrige wird auf Zusagen geprüft.
    const ohneWortlaut = optionen.erlaubterWortlaut ? text.split(optionen.erlaubterWortlaut).join(' ') : text;
    expect(ohneWortlaut, wo).not.toMatch(VERBOTEN);
  }
}

const doppelte = (werte: string[]) => werte.filter((w, i) => werte.indexOf(w) !== i);

describe('Marken- und Modellseiten über den Generator (FA-SEO-01B)', () => {
  const marken = MARKEN.map((make) => ({ wo: make.slug, ...markenTexte(make) }));
  const modelle = MARKEN.flatMap((make) =>
    make.models.map((model) => ({
      wo: `${make.slug}/${model.slug}`,
      ...modellTexte(make, model, leistungsPreise(make, model, KONTEXT_FAHRZEUG), WERKSTATT),
    })),
  );

  it.each(marken)('Marke $wo: Titel und Beschreibung in den Grenzen', ({ wo, metaTitel, metaBeschreibung }) => {
    pruefeSuchtexte(wo, metaTitel, metaBeschreibung);
  });

  it.each(modelle)('Modell $wo: Titel und Beschreibung in den Grenzen', ({ wo, metaTitel, metaBeschreibung }) => {
    pruefeSuchtexte(wo, metaTitel, metaBeschreibung);
  });

  it('kein Titel und keine Beschreibung doppelt über Marken und Modelle', () => {
    const alle = [...marken, ...modelle];
    expect(doppelte(alle.map((t) => t.metaTitel))).toEqual([]);
    expect(doppelte(alle.map((t) => t.metaBeschreibung))).toEqual([]);
  });

  it('keine Beträge und keine Fristen in den Beschreibungen (R3, R4)', () => {
    for (const t of [...marken, ...modelle]) expect(t.metaBeschreibung, t.wo).not.toMatch(/€|\d+,\d\d|Vorlauf|Tage/);
  });

  it('lange Namen: Titel und Beschreibung bleiben in den Grenzen', () => {
    const vorlage = MARKEN.find((m) => m.models.length > 0)!;
    const lang: VehicleMake = {
      ...vorlage,
      name: 'Mercedes-Benz Nutzfahrzeuge',
      slug: 'lang',
      models: vorlage.models.map((model, i) => ({ ...model, name: `Sprinter Kastenwagen Hochdach ${i + 1}` })),
    };
    pruefeSuchtexte('lange Marke', markenTexte(lang).metaTitel, markenTexte(lang).metaBeschreibung);
    const model = lang.models[0];
    const t = modellTexte(lang, model, leistungsPreise(lang, model, KONTEXT_FAHRZEUG), WERKSTATT);
    pruefeSuchtexte('langes Modell', t.metaTitel, t.metaBeschreibung);
    expect(t.metaTitel).toBe(`${model.name}`);
  });
});

describe('Codelinien-, Kategorie- und Herstellerseiten (Vorlagen, FA-SEO-01B)', () => {
  const linien = LINIEN.map((line) => ({ wo: line.id, ...codelinienTexte(line, KONTEXT_CODE) }));
  // Gruppen wie auf den Seiten: Familien aus den Musterdaten als Kategorien, Hersteller mit System aus der Stammliste.
  const familien = [...new Set(LINIEN.map(codelinienFamilie))].map((name) => ({ name, lines: LINIEN.filter((l) => codelinienFamilie(l) === name) }));
  const kategorien = familien.map((f) => ({ wo: f.name, ...kategorieTexte(f.name, f.lines, KONTEXT_CODE.ratgeber) }));
  const mitHersteller = LINIEN.map((line, i) => ({ ...line, manufacturer: ['BKS', 'ABUS', 'BURG-WÄCHTER'][i % 3], system: `System ${i % 4}` }));
  const hersteller = herstellerMitSeite(mitHersteller).map((h) => ({ wo: h.adresse, ...herstellerTexte(h.name, h.lines) }));
  // Texte nach Verfügbarkeit (FA-SHOP-01B): „auf Anfrage“ und „nicht lieferbar“ bleiben in denselben Grenzen.
  const varianten = (['auf-anfrage', 'nicht-lieferbar'] as const).flatMap((availability) =>
    LINIEN.map((line) => ({ wo: `${line.id} ${availability}`, ...codelinienTexte({ ...line, availability }, KONTEXT_CODE) })),
  );

  // Gruppen ohne lieferbare Linie: Anfrage-Fassung ohne „bestellen“, in denselben Grenzen.
  const aufAnfrage = (lines: CodeLine[]) => lines.map((line) => ({ ...line, availability: 'auf-anfrage' as const }));
  const gruppenAnfrage = [
    ...familien.map((f) => ({ wo: `${f.name} auf-anfrage`, ...kategorieTexte(f.name, aufAnfrage(f.lines), KONTEXT_CODE.ratgeber) })),
    ...herstellerMitSeite(mitHersteller).map((h) => ({ wo: `${h.adresse} auf-anfrage`, ...herstellerTexte(h.name, aufAnfrage(h.lines)) })),
  ];

  it('Gruppen ohne lieferbare Linie beschreiben keinen Direktkauf', () => {
    for (const { wo, metaTitel, metaBeschreibung, einleitung } of gruppenAnfrage) {
      expect(`${metaTitel} ${metaBeschreibung} ${einleitung}`, wo).not.toMatch(/bestellen|Bestellt wird|wir fertigen danach|Preis je Stück/);
    }
  });

  it.each([...linien, ...kategorien, ...hersteller, ...varianten, ...gruppenAnfrage])('$wo: Titel und Beschreibung in den Grenzen, ohne Beträge', ({ wo, metaTitel, metaBeschreibung }) => {
    pruefeSuchtexte(wo, metaTitel, metaBeschreibung);
  });

  it('kein Titel und keine Beschreibung doppelt', () => {
    const alle = [...linien, ...kategorien, ...hersteller];
    expect(doppelte(alle.map((t) => t.metaTitel))).toEqual([]);
    expect(doppelte(alle.map((t) => t.metaBeschreibung))).toEqual([]);
  });
});

describe('Ratgeber (FA-SEO-01B)', () => {
  it.each(RATGEBER_JSON.map((g) => [g.slug, g] as const))('%s: Suchtexte in den Grenzen, Titel ohne Gedankenstrich', (slug, g) => {
    pruefeSuchtexte(slug, g.seo.title, g.seo.description);
    expect(g.title, slug).not.toMatch(/[–—]| - /);
  });

  it('kein Titel und keine Beschreibung doppelt, auch nicht gegen Teil A', () => {
    const titel = [...RATGEBER_JSON.map((g) => `${g.seo.title}${VORLAGE}`), ...eintraege.map((e) => e.titel)];
    const beschreibungen = [...RATGEBER_JSON.map((g) => g.seo.description), ...eintraege.map((e) => e.beschreibung)];
    expect(doppelte(titel)).toEqual([]);
    expect(doppelte(beschreibungen)).toEqual([]);
  });

  it('„Autoschlüssel verloren“ nennt die Reihenfolge wie der sichtbare Text: prüfen, sichern, anfragen', () => {
    const g = RATGEBER_JSON.find((x) => x.slug === 'autoschluessel-verloren-was-tun')!;
    expect(g.excerpt).toMatch(/prüfen, dann sichern, dann anfragen/i);
    expect(g.seo.description).toMatch(/prüfen, dann sichern, dann .*anfragen/);
  });

  it('der Verweis auf Schlüssel nach Code heißt „Schlüssel nach Code“', () => {
    const verweise = RATGEBER_JSON.flatMap((g) => [g.nextStep, ...g.seo.internalLinks]);
    expect(verweise.some((v) => v.label === 'Codelinien ansehen')).toBe(false);
    for (const v of verweise.filter((x) => x.href === '/schluessel-nach-code')) expect(v.label).toBe('Schlüssel nach Code');
  });

  it('Rückfall guides() ist wortgleich mit content/guides.json', () => {
    const auswahl = (g: Guide) => ({
      slug: g.slug,
      title: g.title,
      excerpt: g.excerpt,
      topic: g.topic,
      body: g.body.map((b) => ({ heading: b.heading, text: b.text })),
      nextStep: { href: g.nextStep.href, label: g.nextStep.label },
      seo: {
        title: g.seo.title,
        description: g.seo.description,
        internalLinks: g.seo.internalLinks.map((l) => ({ href: l.href, label: l.label })),
      },
    });
    expect(guides().map(auswahl)).toEqual(RATGEBER_JSON.map(auswahl));
  });
});

describe('Orte und Partnerseiten (FA-SEO-01B)', () => {
  it.each(ORTE.map((c) => [c.slug, c] as const))('Ort %s: Suchtexte in den Grenzen', (slug, c) => {
    pruefeSuchtexte(slug, c.seo.title, c.seo.description, { noindex: c.seo.noindex === true });
  });

  it.each(GEWINNUNG_SEITEN.map((s) => [s.slug, s] as const))('Partnerseite %s: Suchtexte in den Grenzen', (slug, s) => {
    pruefeSuchtexte(slug, s.titel, s.beschreibung);
  });

  /*
   * Pflege im Admin (FA-22-36, FA-PLATTFORM-02B): Jede Partnerseite hat einen Eintrag in content/seo.json
   * und im Rückfall pages(), wortgleich mit gewinnung.ts (G6). Sonst liefen Admin, Seed und Seite auseinander.
   * Seed und Rückfall tragen bewusst den Wortlaut von Modell A, unabhängig vom Schalter PARTNERMODELL_B.
   */
  const rueckfallSeiten = pages();
  it.each(gewinnungSeitenFuer('A').map((s) => [s.slug, s] as const))(
    'Partnerseite %s: content/seo.json und pages() tragen Suchtexte, Überschrift, Kurztext und Einleitung aus gewinnung.ts (Modell A)',
    (slug, s) => {
      const route = gewinnungRoute(s);
      const erwartet = [s.titel, s.beschreibung, s.ueberschrift, s.kurztext, s.einleitung];
      for (const quelle of [seiten, rueckfallSeiten]) {
        const eintrag = quelle.find((e) => e.route === route);
        expect(eintrag, `${slug}: Eintrag ${route}`).toBeDefined();
        expect([eintrag!.seo.title, eintrag!.seo.description, eintrag!.headline, eintrag!.subline, eintrag!.intro], slug).toEqual(erwartet);
        expect(eintrag!.seo.noindex, slug).not.toBe(true);
      }
    },
  );

  it.each((['A', 'B'] as const).flatMap((modell) => gewinnungSeitenFuer(modell).map((s) => [modell, s.slug, s] as const)))(
    'Modell %s, Partnerseite %s: der Eintrag aus content/seo.json und pages() ergibt genau die Texte des aktiven Modells',
    (_modell, slug, s) => {
      const route = gewinnungRoute(s);
      const erwartet = [s.titel, s.beschreibung, s.ueberschrift, s.kurztext, s.einleitung];
      for (const quelle of [seiten, rueckfallSeiten]) {
        const eintrag = quelle.find((e) => e.route === route);
        expect(eintrag, `${slug}: Eintrag ${route}`).toBeDefined();
        const mit = gewinnungSeiteMitPflege(s, eintrag);
        expect([mit.titel, mit.beschreibung, mit.ueberschrift, mit.kurztext, mit.einleitung], slug).toEqual(erwartet);
      }
    },
  );

  it('der Verweis der Orte auf die Autoschlüssel-Anfrage heißt „Termin anfragen“ (A-031)', () => {
    const anfrage = ORTE.flatMap((c) => c.seo.internalLinks).filter((l) => l.href === '/autoschluessel/anfrage');
    for (const l of anfrage) expect(l.label).toBe('Termin anfragen');
  });
});

/** Feste Metadaten einer Seite: `export const metadata = {…}` oder das Objekt, das generateMetadata zurückgibt. */
function festeMetadaten(route: string) {
  const datei = path.join(process.cwd(), 'src', 'app', '(site)', route, 'page.tsx');
  const quelle = ts.createSourceFile(datei, readFileSync(datei, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const konstanten = new Map<string, ts.Expression>();
  const objekte: ts.ObjectLiteralExpression[] = [];
  const besuchen = (knoten: ts.Node) => {
    if (ts.isVariableDeclaration(knoten) && ts.isIdentifier(knoten.name) && knoten.initializer) {
      konstanten.set(knoten.name.text, knoten.initializer);
      if (knoten.name.text === 'metadata' && ts.isObjectLiteralExpression(knoten.initializer)) objekte.push(knoten.initializer);
    }
    if (ts.isFunctionDeclaration(knoten) && knoten.name?.text === 'generateMetadata' && knoten.body) {
      const rueckgaben = (n: ts.Node) => {
        if (ts.isReturnStatement(n) && n.expression && ts.isObjectLiteralExpression(n.expression)) objekte.push(n.expression);
        ts.forEachChild(n, rueckgaben);
      };
      rueckgaben(knoten.body);
    }
    ts.forEachChild(knoten, besuchen);
  };
  besuchen(quelle);
  const auswerten = (k: ts.Expression): string => {
    if (ts.isParenthesizedExpression(k)) return auswerten(k.expression);
    if (ts.isStringLiteral(k) || ts.isNoSubstitutionTemplateLiteral(k)) return k.text;
    if (ts.isBinaryExpression(k) && k.operatorToken.kind === ts.SyntaxKind.PlusToken) return auswerten(k.left) + auswerten(k.right);
    if (ts.isIdentifier(k) && konstanten.has(k.text)) return auswerten(konstanten.get(k.text)!);
    throw new Error(`${route}: nicht auswertbar: ${k.getText(quelle)}`);
  };
  const feld = (objekt: ts.ObjectLiteralExpression, name: string) => {
    const p = objekt.properties.find((x): x is ts.PropertyAssignment => ts.isPropertyAssignment(x) && x.name.getText(quelle) === name);
    return p ? auswerten(p.initializer) : undefined;
  };
  // Das Objekt mit Titel und Beschreibung; „nicht gefunden“-Zweige tragen nur einen Titel.
  const treffer = objekte.find((o) => feld(o, 'description') !== undefined);
  expect(treffer, `${route}: Metadaten mit Beschreibung`).toBeDefined();
  const robots = treffer!.properties.some((x) => ts.isPropertyAssignment(x) && x.name.getText(quelle) === 'robots' && /index:\s*false/.test(x.initializer.getText(quelle)));
  return { titel: feld(treffer!, 'title')!, beschreibung: feld(treffer!, 'description')!, noindex: robots };
}

const FESTE_METADATEN = [
  'service-und-termin/vor-ort',
  'service-und-termin/anfrage',
  'service-und-termin/terminstatus',
  'beratung',
  'schliessanlagen/konfigurator/schliessplan',
  'rechtliches/versand-und-zahlung',
  'standorte',
  'ratgeber',
];

/** Rückfälle in generateMetadata (`page?.seo.title ?? …`) der Ordner, die Teil A ausgenommen hat. */
const RUECKFAELLE_B = [
  'autoschluessel',
  'autoschluessel/nachmachen',
  'autoschluessel/programmieren',
  'autoschluessel/kopieren',
  'autoschluessel/funkschluessel',
  'autoschluessel/smart-key',
  'autoschluessel/schluesselbart-fraesen',
  'autoschluessel/fahrzeugoeffnung',
  'autoschluessel/marken',
  'autoschluessel/anfrage',
  'autoschluessel/gehaeuse',
  'autoschluessel/gehaeuse/anfrage',
  // Gehäuse und Ersatzteile, Customizing (FA-SHOP-02B)
  'autoschluessel/gehaeuse/teile',
  'autoschluessel/customizing',
  'motorradschluessel',
  'motorradschluessel/anfrage',
];

describe('Feste Metadaten und Rückfälle der übrigen Seiten (FA-SEO-01B)', () => {
  const feste = FESTE_METADATEN.map((route) => ({ route, ...festeMetadaten(route) }));
  const rueckfaelle = RUECKFAELLE_B.map((route) => ({ route, ...rueckfaelleAusQuelltext(route) }));

  it.each(feste)('/$route: feste Metadaten in den Grenzen', ({ route, titel, beschreibung, noindex }) => {
    pruefeSuchtexte(route, titel, beschreibung, { noindex });
  });

  it.each(rueckfaelle)('/$route: Rückfall gleich content/seo.json oder in den Grenzen', ({ route, titel, beschreibung }) => {
    const daten = seiten.find((s) => s.route === route);
    if (daten) {
      expect(titel, route).toBe(daten.seo.title);
      expect(beschreibung, route).toBe(daten.seo.description);
    }
    pruefeSuchtexte(route, titel, beschreibung);
  });

  it('kein Titel und keine Beschreibung doppelt über alle Seiten beider Teile', () => {
    const titel = [
      ...eintraege.map((e) => e.titel),
      ...feste.map((f) => `${f.titel}${VORLAGE}`),
      `${KONTAKT_TITEL}${VORLAGE}`,
      ...rueckfaelle.filter((r) => !seiten.some((s) => s.route === r.route)).map((r) => `${r.titel}${VORLAGE}`),
      ...RATGEBER_JSON.map((g) => `${g.seo.title}${VORLAGE}`),
      ...ORTE.map((c) => `${c.seo.title}${VORLAGE}`),
      // Partnerseiten mit Eintrag in content/seo.json stehen schon unter `eintraege` (FA-PLATTFORM-02B).
      ...GEWINNUNG_SEITEN.filter((s) => !seiten.some((d) => `/${d.route}` === s.pfad)).map((s) => `${s.titel}${VORLAGE}`),
    ];
    const beschreibungen = [
      ...eintraege.map((e) => e.beschreibung),
      ...feste.map((f) => f.beschreibung),
      kontaktBeschreibung(settingsJson as unknown as Settings),
      ...rueckfaelle.filter((r) => !seiten.some((s) => s.route === r.route)).map((r) => r.beschreibung),
      ...RATGEBER_JSON.map((g) => g.seo.description),
      ...ORTE.map((c) => c.seo.description),
      ...GEWINNUNG_SEITEN.filter((s) => !seiten.some((d) => `/${d.route}` === s.pfad)).map((s) => s.beschreibung),
    ];
    expect(doppelte(titel)).toEqual([]);
    expect(doppelte(beschreibungen)).toEqual([]);
  });
});

describe('Artikelliste je Kategorie /artikel/kategorie/… (FA-10-10, FA-10-11)', () => {
  // Titel ist der Name der Kategorie aus den Daten; die Beschreibung kommt ohne eigene Angabe aus artikelKategorieBeschreibung.
  const namen = ['Weitere Sicherheitstechnik', 'Schließtechnik und Zubehör', 'Beschläge', 'Türschließer und Zubehör für Haustüren'];

  it.each(namen.flatMap((name) => [true, false].map((direktkauf) => ({ name, direktkauf }))))(
    '$name (Direktkauf $direktkauf): Titel und Beschreibung in den Grenzen',
    ({ name, direktkauf }) => {
      const beschreibung = artikelKategorieBeschreibung(name, direktkauf);
      pruefeSuchtexte(`artikel/kategorie ${name}`, artikelKategorieTitel(name), beschreibung);
      if (!direktkauf) expect(beschreibung).not.toMatch(/bestellen|Staffelpreis/);
    },
  );

  it('ein sehr langer Name wird an einer Wortgrenze gekürzt, nie über 160 Zeichen', () => {
    const beschreibung = artikelKategorieBeschreibung('Sehr lange Kategorie mit vielen Wörtern für Schlösser, Beschläge und Zubehör aller Art', true);
    expect(zeichen(beschreibung)).toBeLessThanOrEqual(BESCHR_MAX);
    expect(artikelKategorieTitel('Weitere Sicherheitstechnik')).toBe('Weitere Sicherheitstechnik');
    expect(artikelKategorieTitel('Türschließer und Zubehör für Haustüren')).toBe('Türschließer und Zubehör');
  });
});

describe('Kontakt: Erreichbarkeit aus den gepflegten Einstellungen (FA-SEO-01B, FA-23)', () => {
  const gepflegt = settingsJson as unknown as Settings;

  it('die Seite bildet die Beschreibung aus denselben Einstellungen wie den sichtbaren Abschnitt', () => {
    const datei = path.join(process.cwd(), 'src', 'app', '(site)', 'service-und-termin', 'kontakt', 'page.tsx');
    const quelle = readFileSync(datei, 'utf8');
    expect(quelle).toMatch(/export async function generateMetadata/);
    expect(quelle).toContain('kontaktBeschreibung(settings)');
    expect(quelle).toContain('erreichbarkeit(settings)');
    expect(quelle).not.toMatch(/export const metadata/);
  });

  it('mit dem Stand aus content/settings.json: Wortlaut des Inhabers, in den Grenzen', () => {
    const satz = erreichbarkeitSatz(erreichbarkeit(gepflegt));
    const beschreibung = kontaktBeschreibung(gepflegt);
    expect(beschreibung).toContain(satz);
    pruefeSuchtexte('kontakt', KONTAKT_TITEL, beschreibung, { erlaubterWortlaut: satz });
  });

  it('ohne gepflegte Erreichbarkeit: der Standard im Wortlaut des Inhabers', () => {
    const satz = erreichbarkeitSatz(ERREICHBARKEIT_STANDARD);
    const beschreibung = kontaktBeschreibung({ reachability: undefined });
    expect(beschreibung).toBe(`Anschrift, Telefon und E-Mail. ${satz}`);
    pruefeSuchtexte('kontakt (Standard)', KONTAKT_TITEL, beschreibung, { erlaubterWortlaut: satz });
  });

  it('abweichende Erreichbarkeit ohne Notdienst: das Suchergebnis folgt, keine 24 Stunden mehr', () => {
    const angabe = { kernaussage: 'Telefonisch montags bis freitags erreichbar', zeilen: ['Werkstatt nach Terminvereinbarung'], rundUmDieUhr: false };
    const beschreibung = kontaktBeschreibung({ reachability: angabe });
    expect(beschreibung).toContain(erreichbarkeitSatz(angabe));
    expect(beschreibung).not.toMatch(/24 Stunden|rund um die Uhr|Notdienst/);
    pruefeSuchtexte('kontakt (abweichend)', KONTAKT_TITEL, beschreibung);
  });

  it('zu lange Erreichbarkeit: nur die Kernaussage, höchstens 160 Zeichen', () => {
    const angabe = {
      kernaussage: 'Telefonisch montags bis freitags erreichbar',
      zeilen: ['Samstags nach Vereinbarung in der Werkstatt', 'Persönliche Beratung und Abholung nur nach vorheriger Terminvereinbarung'],
      rundUmDieUhr: false,
    };
    const beschreibung = kontaktBeschreibung({ reachability: angabe });
    expect(beschreibung).toContain('Telefonisch montags bis freitags erreichbar.');
    expect(beschreibung).not.toContain('Samstags');
    pruefeSuchtexte('kontakt (lang)', KONTAKT_TITEL, beschreibung);
  });
});
