import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { stadtIndexierbar } from '@/lib/rechtliches/indexierung';
import type { CityPage } from '@/lib/types';

import { zielPfad } from './verweise';

/* ==========================================================================
   Waisen-Melder (FA-25-16 bis FA-25-18, FA-SEO-01C)
   Jede indexierbare Seite (= jede Adresse der Sitemap) braucht mindestens einen
   eingehenden internen Verweis von einer anderen Seite. Gezählt werden:
   - Pfade im Quelltext der öffentlichen Seite (Seiten, Komponenten, Navigation),
     aber nur in einem Link-Zusammenhang (`href=…`, `href: …`, eine Konstante
     `const X = '/…'`, die dieselbe Datei als `href` nutzt, und die Datenfelder, die
     als Link gerendert werden: Ziele der Fahrzeugklassen, Pfade der Partnerseiten)
     und nur aus einer anderen Datei als der Seite selbst, sonst zählten Brotkrume
     und canonical der eigenen Seite. Listen wie `AUF_DER_SEITE` (Ausschlüsse) sind
     keine Links und zählen nicht;
   - `href` in content/*.json, aber nur aus Einträgen, die selbst eine indexierbare
     Seite sind (nicht `active: false`, nicht `seo.noindex`, Ortsseiten nur
     veröffentlicht) und nicht auf sich selbst;
   - für Detailseiten aus Daten (Marke, Modell, Ratgeber …) eine Vorlage
     `/<präfix>/${…}` im Link-Zusammenhang, aus einer anderen Datei als der Detailseite.
   Die Gegenrichtung aus „Passt dazu“ (./verweise.ts) zählt hier nicht eigens; sie
   prüft verweise.test.ts. Läuft gegen content/*.json (Notbetrieb), ohne Datenbank.
   ========================================================================== */

const WURZEL = path.resolve(__dirname, '../../..');
const SEITEN = path.join(WURZEL, 'src/app/(site)');

/** Dateien, deren Pfade Verweise auf der Seite sind. sitemap.ts, robots.ts und Tests zählen nicht. */
const QUELL_ORDNER = ['src/app/(site)', 'src/components', 'src/lib/navigation.ts', 'src/lib/fahrzeuge/anfrage-klassen.ts', 'src/lib/partner', 'src/lib/wege'];

function dateien(eintrag: string): string[] {
  const voll = path.join(WURZEL, eintrag);
  if (statSync(voll).isFile()) return [voll];
  return readdirSync(voll, { recursive: true, encoding: 'utf8' })
    .map((name) => path.join(voll, name))
    .filter((datei) => /\.(ts|tsx)$/.test(datei) && !/\.test\.tsx?$/.test(datei) && statSync(datei).isFile());
}

/** Alle Seitenvorlagen mit ihrem Adressmuster; feste Routen vor dynamischen. */
const ROUTEN = dateien('src/app/(site)')
  .filter((datei) => datei.endsWith(`${path.sep}page.tsx`))
  .map((datei) => {
    const route = path.relative(SEITEN, path.dirname(datei)).split(path.sep).filter(Boolean);
    const muster = route.map((teil) => (teil.startsWith('[...') ? '.+' : teil.startsWith('[') ? '[^/]+' : teil.replace(/[-]/g, '\\-'))).join('/');
    return { datei, muster: new RegExp(`^/${muster}$`), dynamisch: route.filter((teil) => teil.startsWith('[')).length };
  })
  .sort((a, b) => a.dynamisch - b.dynamisch);

/** Datei, die eine Adresse ausliefert (Verweise aus ihr auf sich selbst zählen nicht). */
function eigeneDatei(pfad: string): string | undefined {
  if (pfad === '/') return path.join(SEITEN, 'page.tsx');
  return ROUTEN.find((route) => route.muster.test(pfad))?.datei;
}

/** Vorlagen-Zeichenkette `/a/${x}/b/${y}` als Muster für ganze Adressen. */
function vorlagenMuster(vorlage: string): RegExp {
  const teile = vorlage.split(/\$\{[^}]*\}/);
  return new RegExp(`^${teile.map((teil) => teil.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')).join('[^/?#]+')}$`);
}

/**
 * Datenfelder, die die Seite als Link rendert: die Ziele der Fahrzeugklassen (`href={formular.anfrage}`)
 * und die Pfade der Partnerseiten (`href={seite.pfad}`). Nur in diesen Dateien.
 */
const LINK_FELDER: Record<string, string[]> = {
  'src/lib/fahrzeuge/anfrage-klassen.ts': ['einstieg', 'anfrage'],
  'src/lib/partner/gewinnung.ts': ['pfad'],
};

/** Link-Zusammenhang vor einer Pfad-Zeichenkette: `href="…"`, `href={'…'}`, `href: '…'`, `ctaHref: …` und die Felder oben. */
function muster(datei: string) {
  const felder = LINK_FELDER[path.relative(WURZEL, datei).split(path.sep).join('/')] ?? [];
  const kontext = `(?:[hH]ref\\s*[:=]\\s*\\{?\\s*${felder.length ? `|\\b(?:${felder.join('|')})\\s*:\\s*` : ''})`;
  return {
    pfad: new RegExp(`${kontext}['"\`](\\/[a-z0-9][a-z0-9\\-/]*)(?=[?#'"\`])`, 'g'),
    vorlage: new RegExp(`${kontext}\`(\\/[a-z0-9][a-z0-9\\-/]*\\/\\$\\{[^\`]*)\``, 'g'),
  };
}

/** `const ANMELDEN = '/…'`, wenn dieselbe Datei die Konstante als `href` nutzt (`href={ANMELDEN}`). */
function konstantenAlsLink(text: string): string[] {
  return [...text.matchAll(/\bconst\s+([A-Za-z_]\w*)\s*=\s*['"`](\/[a-z0-9][a-z0-9\-/]*)(?=[?#'"`])/g)]
    .filter(([, name]) => new RegExp(`[hH]ref\\s*[:=]\\s*\\{?\\s*${name}\\b`).test(text))
    .map(([, , pfad]) => pfad);
}

/** Eine Quelldatei als Text (im Selbsttest auch erfunden). */
interface Quelltext {
  datei: string;
  text: string;
}

/** Eintrag aus content/*.json, der eine eigene Seite ist: sein Pfad (für den Ausschluss eigener Links). */
const EIGENER_PFAD: Record<string, (eintrag: Record<string, unknown>) => string> = {
  'seo.json': (e) => (e.route ? `/${String(e.route)}` : '/'),
  'service-pages.json': (e) => `/${String(e.area)}/${String(e.slug)}`,
  'guides.json': (e) => `/ratgeber/${String(e.slug)}`,
  'cities.json': (e) => `/standorte/${String(e.slug)}`,
  'code-lines.json': (e) => `/schluessel-nach-code/${String(e.slug)}`,
};

function hrefsIn(wert: unknown, ziel: string[] = []): string[] {
  if (Array.isArray(wert)) wert.forEach((eintrag) => hrefsIn(eintrag, ziel));
  else if (wert && typeof wert === 'object') {
    for (const [schluessel, inhalt] of Object.entries(wert)) {
      if (schluessel === 'href' && typeof inhalt === 'string') ziel.push(inhalt);
      else hrefsIn(inhalt, ziel);
    }
  }
  return ziel;
}

/** Ist der Eintrag eine Seite, die angezeigt und indexiert wird? Abgeschaltete und noindex-Einträge verlinken nichts. */
function eintragZaehlt(name: string, eintrag: Record<string, unknown>): boolean {
  if (eintrag.active === false) return false;
  if ((eintrag.seo as { noindex?: boolean } | undefined)?.noindex) return false;
  if (name === 'cities.json') return stadtIndexierbar(eintrag as unknown as CityPage);
  return true;
}

/** Verweise aus Inhalten: Ziel → Pfade der Einträge, die darauf verweisen ('?' = keine eigene Seite). */
function inhaltsVerweise(inhalte: Array<{ name: string; daten: unknown }>): Map<string, Set<string>> {
  const ergebnis = new Map<string, Set<string>>();
  for (const { name, daten } of inhalte) {
    const eintraege = Array.isArray(daten) ? daten : [daten];
    for (const eintrag of eintraege) {
      if (!eintrag || typeof eintrag !== 'object') continue;
      const datensatz = eintrag as Record<string, unknown>;
      if (!eintragZaehlt(name, datensatz)) continue;
      const quelle = EIGENER_PFAD[name]?.(datensatz) ?? '?';
      for (const href of hrefsIn(datensatz)) {
        const ziel = zielPfad(href);
        if (!ziel.startsWith('/') || ziel === quelle) continue;
        if (!ergebnis.has(ziel)) ergebnis.set(ziel, new Set());
        ergebnis.get(ziel)!.add(quelle);
      }
    }
  }
  return ergebnis;
}

/** Wie die Seite verlinkt ist: Quelltext-Fundorte, Vorlagen und Inhalte. */
function verweisLage(quelltexte: Quelltext[], inhalte: Array<{ name: string; daten: unknown }>) {
  /* Quelltext: Pfad → Dateien, in denen er im Link-Zusammenhang steht. */
  const fundorte = new Map<string, Set<string>>();
  const vorlagen: Array<{ muster: RegExp; datei: string }> = [];
  for (const { datei, text } of quelltexte) {
    const { pfad: pfadMuster, vorlage } = muster(datei);
    for (const roh of [...[...text.matchAll(pfadMuster)].map((treffer) => treffer[1]), ...konstantenAlsLink(text)]) {
      const pfad = zielPfad(roh);
      if (!fundorte.has(pfad)) fundorte.set(pfad, new Set());
      fundorte.get(pfad)!.add(datei);
    }
    for (const treffer of text.matchAll(vorlage)) {
      vorlagen.push({ muster: vorlagenMuster(treffer[1].split(/[?#]/, 1)[0]), datei });
    }
  }
  const ausInhalten = inhaltsVerweise(inhalte);

  /** Hat `pfad` einen eingehenden Verweis von einer anderen Seite? */
  return function istVerlinkt(pfad: string): boolean {
    if (pfad === '/' || ausInhalten.has(pfad)) return true;
    const eigen = eigeneDatei(pfad);
    if ([...(fundorte.get(pfad) ?? [])].some((datei) => datei !== eigen)) return true;
    // Detailseite aus Daten: eine Vorlage `/…/${…}`, die genau diese Adresse bildet, in einer anderen Datei.
    return vorlagen.some(({ muster, datei }) => muster.test(pfad) && datei !== eigen);
  };
}

function echteLage() {
  const quelltexte = QUELL_ORDNER.flatMap(dateien).map((datei) => ({ datei, text: readFileSync(datei, 'utf8') }));
  const inhalte = readdirSync(path.join(WURZEL, 'content'))
    .filter((name) => name.endsWith('.json'))
    .map((name) => ({ name, daten: JSON.parse(readFileSync(path.join(WURZEL, 'content', name), 'utf8')) as unknown }));
  return verweisLage(quelltexte, inhalte);
}

describe('Interne Verweise', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('jede indexierbare Seite hat mindestens einen eingehenden Verweis (keine Waisen)', async () => {
    vi.stubEnv('SM24_DATA', 'json');
    vi.resetModules();
    const { default: sitemap } = await import('@/app/sitemap');

    const adressen = (await sitemap()).map((eintrag) => zielPfad(new URL(eintrag.url).pathname));
    expect(adressen.length).toBeGreaterThan(20);
    const istVerlinkt = echteLage();

    expect(adressen.filter((pfad) => !istVerlinkt(pfad))).toEqual([]);
  });

  it('meldet eine Seite, auf die nur sie selbst verweist', () => {
    const istVerlinkt = echteLage();
    expect(istVerlinkt('/nirgends-verlinkt')).toBe(false);
    // /beratung nennt sich selbst in Brotkrume und canonical; gezählt wird nur der Verweis von anderen Seiten.
    expect(istVerlinkt('/beratung')).toBe(true);
    expect(istVerlinkt('/autoschluessel/marken/volkswagen/golf')).toBe(true);
  });

  it('zählt keine Pfade außerhalb eines Links und keine Links aus abgeschalteten, noindex- oder eigenen Einträgen', () => {
    const fremd = path.join(SEITEN, 'autoschluessel/page.tsx');
    const istVerlinkt = verweisLage(
      [
        { datei: fremd, text: "const AUF_DER_SEITE = ['/nur-ausgeschlossen'];\nconst x = { pfad: '/nur-erwaehnt' };" },
        { datei: fremd, text: "<Link href=\"/echt-verlinkt\">x</Link>\nconst krume = { href: '/als-krume', label: 'K' };" },
        { datei: fremd, text: "const ZIEL = '/als-konstante';\nconst NUR_GENANNT = '/nur-konstante';\n<ButtonLink href={ZIEL}>x</ButtonLink>" },
      ],
      [
        { name: 'service-pages.json', daten: [{ area: 'a', slug: 'aus', active: false, seo: { internalLinks: [{ href: '/von-abgeschaltet' }] } }] },
        { name: 'guides.json', daten: [{ slug: 'g', seo: { noindex: true, internalLinks: [{ href: '/von-noindex' }] } }] },
        { name: 'guides.json', daten: [{ slug: 'selbst', seo: { internalLinks: [{ href: '/ratgeber/selbst' }, { href: '/von-ratgeber' }] } }] },
      ],
    );
    expect(istVerlinkt('/nur-ausgeschlossen')).toBe(false);
    expect(istVerlinkt('/nur-erwaehnt')).toBe(false);
    expect(istVerlinkt('/von-abgeschaltet')).toBe(false);
    expect(istVerlinkt('/von-noindex')).toBe(false);
    expect(istVerlinkt('/ratgeber/selbst')).toBe(false);
    expect(istVerlinkt('/echt-verlinkt')).toBe(true);
    expect(istVerlinkt('/als-krume')).toBe(true);
    expect(istVerlinkt('/von-ratgeber')).toBe(true);
    expect(istVerlinkt('/als-konstante')).toBe(true);
    expect(istVerlinkt('/nur-konstante')).toBe(false);
  });
});
