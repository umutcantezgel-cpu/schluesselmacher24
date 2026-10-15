import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  KONTUR,
  LINIE,
  LINIE_STARK,
  Raster,
  SCHRIFT,
  auswahl,
  parameter,
  type Parameter,
  r,
  titel,
  wert,
  zahl,
} from './grafik-basis';

const BREITE = 480;
const HOEHE = 300;
const RAND = 20;

const SYSTEME = ['gleichschliessung', 'zentral', 'haupt', 'generalhaupt'] as const;
type System = (typeof SYSTEME)[number];

const SCHLUESSEL_HOEHE = 26;
const TUER_BREITE = 22;
const TUER_HOEHE = 32;
/** Breite eines Zeichens der Beschriftung (Monospace, 0,6 em). */
const ZEICHEN = SCHRIFT * 0.6;
/** Verzögerung je Ebene (Sekunden). */
const TAKT = 0.32;
/** Kleinster Abstand zweier Blätter — breiter als ein ES-Knoten. */
const MIN_RASTER = 56;
const MAX_RASTER = 84;
const MAX_ZEILE = 88;

/** Waagerechter Abstand der Blätter: großzügig bei wenigen, nie enger als ein Knoten. */
function blattRaster(anzahl: number): number {
  return Math.max(MIN_RASTER, Math.min(MAX_RASTER, (BREITE - 2 * RAND) / Math.max(1, anzahl)));
}

interface Baum {
  art: 'schluessel' | 'tuer';
  /** Stabile Kennung: `wurzel`, `g1`, `g1.1`, `e3`, `t3`, `z1`. */
  kennung: string;
  /** Ebenenkürzel (GHS, HGS, GS, HS, ES) oder Z für Zentraltüren. */
  label?: string;
  /** Volles Kürzel für die Schlüsselliste, z. B. „HGS 1“ oder „GS 1.2“. */
  kuerzel?: string;
  kinder: Baum[];
}

interface Knoten {
  art: 'schluessel' | 'tuer';
  kennung: string;
  label?: string;
  kuerzel?: string;
  /** Schlüssel: Kennungen aller Türen, die er schließt (bei Zentral auch z1 und z2). */
  schliesst?: string[];
  ebene: number;
  x: number;
  y: number;
}

interface Kante {
  /** Oberer Knoten. */
  von: Knoten;
  /** Unterer Knoten. */
  nach: Knoten;
}

const tuer = (kennung: string): Baum => ({ art: 'tuer', kennung, kinder: [] });
const schluessel = (
  kennung: string,
  label: string | undefined,
  kinder: Baum[],
  kuerzel = label ?? 'Schlüssel',
): Baum => ({
  art: 'schluessel',
  kennung,
  label,
  kuerzel,
  kinder,
});

/** ES-Schlüssel mit je einer Tür, von `ersteNr` an fortlaufend nummeriert (von links). */
function einzel(anzahl: number, ersteNr: number): Baum[] {
  return Array.from({ length: anzahl }, (_, i) => {
    const nr = ersteNr + i;
    return schluessel(`e${nr}`, 'ES', [tuer(`t${nr}`)], `ES ${nr}`);
  });
}

/** Verteilt `menge` möglichst gleichmäßig auf `teile` Gruppen (vordere zuerst). */
function verteilen(menge: number, teile: number): number[] {
  const basis = Math.floor(menge / teile);
  const rest = menge % teile;
  return Array.from({ length: teile }, (_, i) => basis + (i < rest ? 1 : 0));
}

function generalhaupt(gruppen: number, tueren: number): Baum {
  const hauptgruppen = Math.min(gruppen, tueren);
  const jeHauptgruppe = tueren >= 2 * hauptgruppen ? 2 : 1;
  const tuerenJeGruppe = verteilen(tueren, hauptgruppen * jeHauptgruppe);
  let gruppe = 0;
  let ersteNr = 1;
  const hgs = Array.from({ length: hauptgruppen }, (_, h) => {
    const gs = Array.from({ length: jeHauptgruppe }, (_, j) => {
      const anzahl = tuerenJeGruppe[gruppe] ?? 0;
      gruppe += 1;
      const esse = einzel(anzahl, ersteNr);
      ersteNr += anzahl;
      return schluessel(`g${h + 1}.${j + 1}`, 'GS', esse, `GS ${h + 1}.${j + 1}`);
    }).filter((g) => g.kinder.length > 0);
    return schluessel(`g${h + 1}`, 'HGS', gs, `HGS ${h + 1}`);
  });
  return schluessel('wurzel', 'GHS', hgs);
}

/** Kennungen aller Türen unter einem Baum. */
function tuerenUnter(b: Baum): string[] {
  return b.art === 'tuer' ? [b.kennung] : b.kinder.flatMap(tuerenUnter);
}

function schluesselBreite(label?: string): number {
  return label ? 34 + label.length * ZEICHEN : 36;
}

/** Legt einen Baum aus: Blätter gleichmäßig, Eltern mittig über den Kindern. */
function auslegen(wurzel: Baum, zeilen: (ebene: number) => number) {
  const knoten: Knoten[] = [];
  const kanten: Kante[] = [];
  const blaetter: Baum[] = [];
  const sammeln = (b: Baum) => {
    if (b.kinder.length === 0) blaetter.push(b);
    b.kinder.forEach(sammeln);
  };
  sammeln(wurzel);
  const raster = blattRaster(blaetter.length);
  const blattX = new Map<Baum, number>();
  blaetter.forEach((b, i) => blattX.set(b, BREITE / 2 + (i - (blaetter.length - 1) / 2) * raster));

  const setzen = (b: Baum, ebene: number): Knoten => {
    const kinder = b.kinder.map((k) => setzen(k, ebene + 1));
    const x = kinder.length
      ? (kinder[0].x + kinder[kinder.length - 1].x) / 2
      : (blattX.get(b) ?? BREITE / 2);
    const k: Knoten = {
      art: b.art,
      kennung: b.kennung,
      label: b.label,
      kuerzel: b.kuerzel,
      schliesst: b.art === 'schluessel' ? tuerenUnter(b) : undefined,
      ebene,
      x,
      y: zeilen(ebene),
    };
    knoten.push(k);
    kinder.forEach((kind) => kanten.push({ von: k, nach: kind }));
    return k;
  };
  setzen(wurzel, 0);
  return { knoten, kanten };
}

function tiefe(b: Baum): number {
  return 1 + Math.max(0, ...b.kinder.map(tiefe));
}

/** Zeilenmitten für `anzahl` Ebenen, senkrecht zentriert. */
function zeilenLage(anzahl: number): (ebene: number) => number {
  const schritt = Math.min(MAX_ZEILE, (HOEHE - 2 * RAND - TUER_HOEHE) / Math.max(1, anzahl - 1));
  const hoehe = (anzahl - 1) * schritt;
  const start = (HOEHE - hoehe) / 2;
  return (ebene: number) => start + ebene * schritt;
}

function halbeHoehe(k: Knoten): number {
  return k.art === 'tuer' ? TUER_HOEHE / 2 : SCHLUESSEL_HOEHE / 2;
}

/** Plan der Zentralschlossanlage: Z-Türen oben, Wohnungsschlüssel, eigene Türen. */
function zentralPlan(tueren: number) {
  const zeilen = zeilenLage(3);
  const raster = blattRaster(tueren);
  const zentralTueren: Knoten[] = [-1, 1].map((seite, i) => ({
    art: 'tuer',
    kennung: `z${i + 1}`,
    label: 'Z',
    ebene: 0,
    x: BREITE / 2 + seite * 42,
    y: zeilen(0),
  }));
  const knoten: Knoten[] = [...zentralTueren];
  const kanten: Kante[] = [];
  for (let i = 0; i < tueren; i += 1) {
    const nr = i + 1;
    const x = BREITE / 2 + (i - (tueren - 1) / 2) * raster;
    const es: Knoten = {
      art: 'schluessel',
      kennung: `e${nr}`,
      label: 'ES',
      kuerzel: `ES ${nr}`,
      schliesst: [`t${nr}`, ...zentralTueren.map((z) => z.kennung)],
      ebene: 1,
      x,
      y: zeilen(1),
    };
    const eigene: Knoten = { art: 'tuer', kennung: `t${nr}`, ebene: 2, x, y: zeilen(2) };
    knoten.push(es, eigene);
    zentralTueren.forEach((z) => kanten.push({ von: z, nach: es }));
    kanten.push({ von: es, nach: eigene });
  }
  return { knoten, kanten };
}

function plan(system: System, gruppen: number, tueren: number) {
  if (system === 'zentral') return zentralPlan(tueren);
  const wurzel =
    system === 'gleichschliessung'
      ? schluessel(
          'wurzel',
          undefined,
          Array.from({ length: tueren }, (_, i) => tuer(`t${i + 1}`)),
        )
      : system === 'generalhaupt'
        ? generalhaupt(gruppen, tueren)
        : schluessel('wurzel', 'HS', einzel(tueren, 1));
  return auslegen(wurzel, zeilenLage(tiefe(wurzel)));
}

/** Liest die Parameter und legt den Plan aus — gemeinsame Grundlage von Grafik und Schlüsselliste. */
function lesePlan(p: Parameter) {
  const system = auswahl(wert(p, 'system'), SYSTEME, 'haupt');
  const gruppen = zahl(wert(p, 'gruppen'), 1, 4, 2, true);
  const tueren = zahl(wert(p, 'tueren'), 2, 8, 4, true);
  return { system, ...plan(system, gruppen, tueren) };
}

/** Zustand eines Bauteils: `normal` ohne Markierung, sonst hervorgehoben oder gedimmt. */
type Stand = 'normal' | 'hervor' | 'gedimmt';

function zustand(hervor: boolean | undefined): Stand {
  if (hervor === undefined) return 'normal';
  return hervor ? 'hervor' : 'gedimmt';
}

interface Markierung {
  knoten: Set<Knoten>;
  kanten: Set<Kante>;
  /** Beschreibt die Markierung im Titel, z. B. „ES 3“ oder „Tür 3“. */
  text: string;
}

/** Kennung aus einem Parameter: Text ohne Randleerzeichen, Kleinschreibung. */
function kennungVon(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim().toLowerCase() : undefined;
}

/** Kanten des kürzesten Weges zwischen zwei Knoten, ungerichtet (Breitensuche). */
function wegKanten(von: Knoten, nach: Knoten, kanten: Kante[]): Kante[] {
  const vorher = new Map<Knoten, { knoten: Knoten; kante: Kante }>();
  const besucht = new Set<Knoten>([von]);
  const schlange: Knoten[] = [von];
  for (const aktuell of schlange) {
    for (const kante of kanten) {
      const weiter =
        kante.von === aktuell ? kante.nach : kante.nach === aktuell ? kante.von : undefined;
      if (!weiter || besucht.has(weiter)) continue;
      besucht.add(weiter);
      vorher.set(weiter, { knoten: aktuell, kante });
      schlange.push(weiter);
    }
  }
  const weg: Kante[] = [];
  let ziel: Knoten | undefined = nach;
  while (ziel && ziel !== von) {
    const schritt = vorher.get(ziel);
    if (!schritt) break;
    weg.push(schritt.kante);
    ziel = schritt.knoten;
  }
  return weg;
}

/** Alle Kanten von oben bis zu einem Knoten (sein Schlüsselweg). */
function ahnenKanten(k: Knoten, kanten: Kante[]): Kante[] {
  return kanten
    .filter((kante) => kante.nach === k)
    .flatMap((kante) => [kante, ...ahnenKanten(kante.von, kanten)]);
}

/** Tür-Kennung als Text: `t3` → „Tür 3“, `z1` → „Zentraltür 1“. */
function tuerText(kennung: string): string {
  const nr = kennung.slice(1);
  return kennung.startsWith('z') ? `Zentraltür ${nr}` : `Tür ${nr}`;
}

/**
 * Markierung eines Schlüssels (`markiert`): dieser Schlüssel, alle Türen, die er
 * schließt, und die Kanten seines Weges. Markierung einer Tür (`tuer`): diese Tür,
 * alle Schlüssel, die sie öffnen, und die Kanten dazwischen. `markiert` hat Vorrang.
 * Unbekannte Kennungen bleiben ohne Wirkung.
 */
function markieren(
  knoten: Knoten[],
  kanten: Kante[],
  markiert: unknown,
  tuerWert: unknown,
): Markierung | undefined {
  const gewaehlt = knoten.find((k) => k.art === 'schluessel' && k.kennung === kennungVon(markiert));
  if (gewaehlt) {
    const tueren = knoten.filter(
      (k) => k.art === 'tuer' && (gewaehlt.schliesst ?? []).includes(k.kennung),
    );
    return {
      knoten: new Set<Knoten>([gewaehlt, ...tueren]),
      kanten: new Set<Kante>([
        ...ahnenKanten(gewaehlt, kanten),
        ...tueren.flatMap((t) => wegKanten(gewaehlt, t, kanten)),
      ]),
      text: gewaehlt.kuerzel ?? 'Schlüssel',
    };
  }
  const tuerKnoten = knoten.find((k) => k.art === 'tuer' && k.kennung === kennungVon(tuerWert));
  if (tuerKnoten) {
    const oeffner = knoten.filter(
      (k) => k.art === 'schluessel' && (k.schliesst ?? []).includes(tuerKnoten.kennung),
    );
    return {
      knoten: new Set<Knoten>([tuerKnoten, ...oeffner]),
      kanten: new Set<Kante>(oeffner.flatMap((o) => wegKanten(tuerKnoten, o, kanten))),
      text: tuerText(tuerKnoten.kennung),
    };
  }
  return undefined;
}

/** Klassen einer Kante; Hervorhebung über Farbe und Strichstärke. */
function kantenAttribute(stand: Stand): { className: string; strokeWidth: number } {
  if (stand === 'hervor') {
    return {
      className: 'sm24-draw stroke-area-strong transition-colors motion-reduce:transition-none',
      strokeWidth: KONTUR,
    };
  }
  if (stand === 'gedimmt') {
    return {
      className: 'sm24-draw stroke-area-muted transition-colors motion-reduce:transition-none',
      strokeWidth: LINIE,
    };
  }
  return { className: 'sm24-draw stroke-area', strokeWidth: LINIE_STARK };
}

/**
 * Klassen der äußeren Knoten-Gruppe. Gedimmt wird über Deckkraft; das `!` ist nötig,
 * weil die Einstiegsbewegung `sm24-pop` die Deckkraft mit `fill: both` festhält.
 */
function gruppenKlasse(stand: Stand): string {
  if (stand === 'hervor') return 'sm24-pop transition-opacity motion-reduce:transition-none';
  if (stand === 'gedimmt') {
    return 'sm24-pop !opacity-30 transition-opacity motion-reduce:transition-none';
  }
  return 'sm24-pop';
}

function tuerFlaeche(zentral: boolean, stand: Stand): string {
  if (stand === 'hervor') return 'fill-area-soft stroke-area-strong';
  return zentral ? 'fill-area-muted stroke-foreground' : 'fill-surface stroke-foreground';
}

const TITEL: Record<System, string> = {
  gleichschliessung: 'Schließplan Gleichschließung',
  zentral: 'Schließplan Zentralschlossanlage',
  haupt: 'Schließplan Hauptschlüsselanlage',
  generalhaupt: 'Schließplan Generalhauptschlüsselanlage',
};

function SchluesselKnoten({ k, oben, stand }: { k: Knoten; oben: boolean; stand: Stand }) {
  const breite = schluesselBreite(k.label);
  const x0 = k.x - breite / 2;
  const symbolX = k.label ? x0 + 7.5 : k.x - 8;
  const cy = k.y;
  return (
    <g className={gruppenKlasse(stand)} style={motionStyle(0.05 + k.ebene * TAKT)}>
      <rect
        className={oben ? 'fill-area-muted stroke-area-strong' : 'fill-surface stroke-area-strong'}
        strokeWidth={oben ? KONTUR : LINIE_STARK}
        x={r(x0)}
        y={r(cy - SCHLUESSEL_HOEHE / 2)}
        width={r(breite)}
        height={SCHLUESSEL_HOEHE}
        rx={8}
      />
      <g className="stroke-area-strong" strokeWidth={LINIE_STARK}>
        <circle cx={r(symbolX + 3.5)} cy={r(cy)} r={3.5} />
        <path
          d={`M${r(symbolX + 7)} ${r(cy)}H${r(symbolX + 16)}M${r(symbolX + 12.5)} ${r(cy)}v3.5M${r(symbolX + 15.5)} ${r(cy)}v3.5`}
        />
      </g>
      {k.label && (
        <text
          className="fill-foreground-muted font-mono"
          fontSize={SCHRIFT}
          fontWeight={600}
          x={r(x0 + 27)}
          y={r(cy + 4.5)}
        >
          {k.label}
        </text>
      )}
    </g>
  );
}

function TuerKnoten({ k, stand }: { k: Knoten; stand: Stand }) {
  const zentral = k.label === 'Z';
  const links = k.x - TUER_BREITE / 2;
  const oben = k.y - TUER_HOEHE / 2;
  return (
    <g className={gruppenKlasse(stand)} style={motionStyle(0.05 + k.ebene * TAKT)}>
      <rect
        className={tuerFlaeche(zentral, stand)}
        strokeWidth={LINIE_STARK}
        x={r(links)}
        y={r(oben)}
        width={TUER_BREITE}
        height={TUER_HOEHE}
        rx={2.5}
      />
      <circle className="fill-foreground-muted" cx={r(k.x + 5.5)} cy={r(k.y + 3)} r={1.8} />
      {zentral && (
        <text
          className="fill-foreground-muted font-mono"
          fontSize={SCHRIFT}
          fontWeight={600}
          textAnchor={k.x < BREITE / 2 ? 'end' : 'start'}
          x={r(k.x < BREITE / 2 ? links - 7 : links + TUER_BREITE + 7)}
          y={r(k.y + 4.5)}
        >
          Z
        </text>
      )}
    </g>
  );
}

/**
 * Hierarchie einer Schließanlage als Baum: Schlüssel-Knoten mit Kürzel
 * (GHS, HGS, GS, HS, ES), Türen als kleine Türsymbole, Zentraltüren mit „Z“.
 *
 * params:
 * - `system`: `gleichschliessung` | `zentral` | `haupt` (Standard) | `generalhaupt`
 * - `gruppen`: 1–4 Hauptgruppen (HGS) unter dem GHS, Standard 2 — nur bei `generalhaupt`
 * - `tueren`: 2–8 Türen (bei `zentral`: Wohnungstüren), Standard 4
 * - `markiert`: Kennung eines Schlüssels (`wurzel`, `g1`, `g1.1`, `e3` …). Hervorgehoben
 *   werden dieser Schlüssel, die Türen, die er schließt, und die Kanten seines Weges;
 *   alles andere wird gedimmt. Unbekannte Kennung → ohne Markierung.
 * - `tuer`: Kennung einer Tür (`t3`, `z1`). Hervorgehoben werden diese Tür, alle Schlüssel,
 *   die sie öffnen (bei `z1`/`z2` alle ES), und die Kanten dazwischen. `markiert` hat Vorrang.
 *
 * Die Kennungen sind stabil: `wurzel` (GHS, HS, unbeschrifteter Schlüssel), `g1`…`g4`
 * (HGS, von links), `g1.1` … (GS), `e1`…`e8` (ES, von links), `t1`…`t8` (Türen),
 * `z1`, `z2` (Zentraltüren).
 */
export function SchliessplanGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const { system, knoten, kanten } = lesePlan(p);
  const markierung = markieren(knoten, kanten, wert(p, 'markiert'), wert(p, 'tuer'));
  const standardTitel = markierung
    ? `${TITEL[system]} – markiert: ${markierung.text}`
    : TITEL[system];

  /* Sicherheitsnetz: alles passt in die viewBox, sonst kleiner skalieren. */
  const links = Math.min(...knoten.map((k) => k.x - (k.art === 'tuer' ? TUER_BREITE : schluesselBreite(k.label)) / 2));
  const rechts = Math.max(...knoten.map((k) => k.x + (k.art === 'tuer' ? TUER_BREITE : schluesselBreite(k.label)) / 2));
  const skala = Math.min(1, (BREITE - 2 * RAND) / Math.max(1, rechts - links));
  const transform =
    skala < 1
      ? `translate(${r(BREITE / 2 - (skala * BREITE) / 2)} ${r(HOEHE / 2 - (skala * HOEHE) / 2)}) scale(${r(skala * 1000) / 1000})`
      : undefined;

  return (
    <GrafikRahmen
      breite={BREITE}
      hoehe={HOEHE}
      title={titel(title, standardTitel)}
      className={className}
    >
      <Raster breite={BREITE} hoehe={HOEHE} />
      <g transform={transform}>
        {kanten.map((kante) => {
          const { von, nach } = kante;
          const y1 = von.y + halbeHoehe(von);
          const y2 = nach.y - halbeHoehe(nach);
          const mitte = (y1 + y2) / 2;
          const d =
            Math.abs(von.x - nach.x) < 0.5
              ? `M${r(von.x)} ${r(y1)}V${r(y2)}`
              : `M${r(von.x)} ${r(y1)}V${r(mitte)}H${r(nach.x)}V${r(y2)}`;
          const { className: kantenKlasse, strokeWidth } = kantenAttribute(
            zustand(markierung?.kanten.has(kante)),
          );
          return (
            <path
              key={d}
              className={kantenKlasse}
              pathLength={1}
              style={motionStyle(0.2 + von.ebene * TAKT, 0.7)}
              strokeWidth={strokeWidth}
              d={d}
            />
          );
        })}
        {knoten.map((k) =>
          k.art === 'tuer' ? (
            <TuerKnoten
              key={`t-${r(k.x)}-${r(k.y)}`}
              k={k}
              stand={zustand(markierung?.knoten.has(k))}
            />
          ) : (
            <SchluesselKnoten
              key={`s-${r(k.x)}-${r(k.y)}`}
              k={k}
              oben={k.ebene === 0}
              stand={zustand(markierung?.knoten.has(k))}
            />
          ),
        )}
      </g>
    </GrafikRahmen>
  );
}

/**
 * Alle Schlüssel des Plans, oben nach unten und links nach rechts, mit Kürzel und den
 * Kennungen der Türen, die sie schließen. Liest dieselben Parameter wie die Grafik.
 */
export function schliessplanSchluessel(
  params: unknown,
): { kennung: string; kuerzel: string; tueren: string[] }[] {
  const { knoten } = lesePlan(parameter(params));
  return knoten
    .filter((k) => k.art === 'schluessel')
    .sort((a, b) => a.ebene - b.ebene || a.x - b.x)
    .map((k) => ({
      kennung: k.kennung,
      kuerzel: k.kuerzel ?? 'Schlüssel',
      tueren: k.schliesst ?? [],
    }));
}
