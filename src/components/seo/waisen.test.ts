import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

/* ==========================================================================
   Waisen-Melder (FA-25-16 bis FA-25-18, FA-SEO-01C)
   Jede indexierbare Seite (= jede Adresse der Sitemap) braucht mindestens einen
   eingehenden internen Verweis von einer anderen Seite. Gezählt werden:
   - Pfade als Zeichenkette im Quelltext der öffentlichen Seite (Seiten,
     Komponenten, Navigation) — nur aus einer anderen Datei als der Seite selbst,
     sonst zählten Brotkrume und canonical der eigenen Seite;
   - jedes `href` in content/*.json (interne Links, Rubriken, Navigation);
   - die Verweisliste „Passt dazu“ (Gegenrichtung, ./verweise.ts);
   - für Detailseiten aus Daten (Marke, Modell, Ratgeber …) die Listenvorlage, die
     `/<präfix>/${…}` verlinkt, aus einer anderen Datei als der Detailseite.
   Läuft gegen die Inhalte aus content/*.json (Notbetrieb), ohne Datenbank.
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

/** Wie die Seite verlinkt ist: Quelltext-Fundorte, Vorlagen und Inhalte. */
async function verweisLage() {
  const { zielPfad } = await import('./verweise');

  /* Quelltext: Pfad → Dateien, in denen er als Zeichenkette steht. */
  const fundorte = new Map<string, Set<string>>();
  const vorlagen: Array<{ muster: RegExp; datei: string }> = [];
  for (const datei of QUELL_ORDNER.flatMap(dateien)) {
    const text = readFileSync(datei, 'utf8');
    for (const treffer of text.matchAll(/['"`](\/[a-z0-9][a-z0-9\-/]*)(?=[?#'"`])/g)) {
      const pfad = zielPfad(treffer[1]);
      if (!fundorte.has(pfad)) fundorte.set(pfad, new Set());
      fundorte.get(pfad)!.add(datei);
    }
    for (const treffer of text.matchAll(/`(\/[a-z0-9][a-z0-9\-/]*\/\$\{[^`]*)`/g)) {
      vorlagen.push({ muster: vorlagenMuster(treffer[1].split(/[?#]/, 1)[0]), datei });
    }
  }

  /* Inhalte: jedes href in content/*.json. */
  const ausInhalten = new Set<string>();
  for (const name of readdirSync(path.join(WURZEL, 'content')).filter((n) => n.endsWith('.json'))) {
    for (const href of hrefsIn(JSON.parse(readFileSync(path.join(WURZEL, 'content', name), 'utf8')))) ausInhalten.add(zielPfad(href));
  }

  /** Hat `pfad` einen eingehenden Verweis von einer anderen Seite? */
  return function istVerlinkt(pfad: string): boolean {
    if (pfad === '/' || ausInhalten.has(pfad)) return true;
    const eigen = eigeneDatei(pfad);
    if ([...(fundorte.get(pfad) ?? [])].some((datei) => datei !== eigen)) return true;
    // Detailseite aus Daten: eine Vorlage `/…/${…}`, die genau diese Adresse bildet, in einer anderen Datei.
    return vorlagen.some(({ muster, datei }) => muster.test(pfad) && datei !== eigen);
  };
}

describe('Interne Verweise', () => {
  it('jede indexierbare Seite hat mindestens einen eingehenden Verweis (keine Waisen)', async () => {
    vi.stubEnv('SM24_DATA', 'json');
    vi.resetModules();
    const { default: sitemap } = await import('@/app/sitemap');
    const { zielPfad } = await import('./verweise');

    const adressen = (await sitemap()).map((eintrag) => zielPfad(new URL(eintrag.url).pathname));
    expect(adressen.length).toBeGreaterThan(20);
    const istVerlinkt = await verweisLage();

    expect(adressen.filter((pfad) => !istVerlinkt(pfad))).toEqual([]);
    vi.unstubAllEnvs();
  });

  it('meldet eine Seite, auf die nur sie selbst verweist', async () => {
    const istVerlinkt = await verweisLage();
    expect(istVerlinkt('/nirgends-verlinkt')).toBe(false);
    // /beratung nennt sich selbst in Brotkrume und canonical; gezählt wird nur der Verweis von anderen Seiten.
    expect(istVerlinkt('/beratung')).toBe(true);
    expect(istVerlinkt('/autoschluessel/marken/volkswagen/golf')).toBe(true);
  });
});
