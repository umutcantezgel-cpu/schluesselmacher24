import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  KONTUR,
  LINIE,
  Raster,
  SCHRIFT,
  auswahl,
  parameter,
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
  /** Ebenenkürzel (GHS, HGS, GS, HS, ES) oder Z für Zentraltüren. */
  label?: string;
  kinder: Baum[];
}

interface Knoten {
  art: 'schluessel' | 'tuer';
  label?: string;
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

const tuer = (label?: string): Baum => ({ art: 'tuer', label, kinder: [] });
const schluessel = (label: string | undefined, kinder: Baum[]): Baum => ({
  art: 'schluessel',
  label,
  kinder,
});

function einzel(anzahl: number): Baum[] {
  return Array.from({ length: anzahl }, () => schluessel('ES', [tuer()]));
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
  const hgs = Array.from({ length: hauptgruppen }, () => {
    const gs = Array.from({ length: jeHauptgruppe }, () => {
      const anzahl = tuerenJeGruppe[gruppe] ?? 0;
      gruppe += 1;
      return schluessel('GS', einzel(anzahl));
    }).filter((g) => g.kinder.length > 0);
    return schluessel('HGS', gs);
  });
  return schluessel('GHS', hgs);
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
    const k: Knoten = { art: b.art, label: b.label, ebene, x, y: zeilen(ebene) };
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
  const zentralTueren: Knoten[] = [-1, 1].map((seite) => ({
    art: 'tuer',
    label: 'Z',
    ebene: 0,
    x: BREITE / 2 + seite * 42,
    y: zeilen(0),
  }));
  const knoten: Knoten[] = [...zentralTueren];
  const kanten: Kante[] = [];
  for (let i = 0; i < tueren; i += 1) {
    const x = BREITE / 2 + (i - (tueren - 1) / 2) * raster;
    const es: Knoten = { art: 'schluessel', label: 'ES', ebene: 1, x, y: zeilen(1) };
    const eigene: Knoten = { art: 'tuer', ebene: 2, x, y: zeilen(2) };
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
      ? schluessel(undefined, Array.from({ length: tueren }, () => tuer()))
      : system === 'generalhaupt'
        ? generalhaupt(gruppen, tueren)
        : schluessel('HS', einzel(tueren));
  return auslegen(wurzel, zeilenLage(tiefe(wurzel)));
}

function SchluesselKnoten({ k, oben }: { k: Knoten; oben: boolean }) {
  const breite = schluesselBreite(k.label);
  const x0 = k.x - breite / 2;
  const symbolX = k.label ? x0 + 7.5 : k.x - 8;
  const cy = k.y;
  return (
    <g className="sm24-pop" style={motionStyle(0.05 + k.ebene * TAKT)}>
      <rect
        className={oben ? 'fill-area-muted stroke-area-strong' : 'fill-surface stroke-area-strong'}
        strokeWidth={oben ? KONTUR : LINIE + 0.25}
        x={r(x0)}
        y={r(cy - SCHLUESSEL_HOEHE / 2)}
        width={r(breite)}
        height={SCHLUESSEL_HOEHE}
        rx={8}
      />
      <g className="stroke-area-strong" strokeWidth={LINIE + 0.25}>
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

function TuerKnoten({ k }: { k: Knoten }) {
  const zentral = k.label === 'Z';
  const links = k.x - TUER_BREITE / 2;
  const oben = k.y - TUER_HOEHE / 2;
  return (
    <g className="sm24-pop" style={motionStyle(0.05 + k.ebene * TAKT)}>
      <rect
        className={zentral ? 'fill-area-muted stroke-foreground' : 'fill-surface stroke-foreground'}
        strokeWidth={LINIE + 0.5}
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

const TITEL: Record<System, string> = {
  gleichschliessung: 'Schließplan Gleichschließung',
  zentral: 'Schließplan Zentralschlossanlage',
  haupt: 'Schließplan Hauptschlüsselanlage',
  generalhaupt: 'Schließplan Generalhauptschlüsselanlage',
};

/**
 * Hierarchie einer Schließanlage als Baum: Schlüssel-Knoten mit Kürzel
 * (GHS, HGS, GS, HS, ES), Türen als kleine Türsymbole, Zentraltüren mit „Z“.
 *
 * params:
 * - `system`: `gleichschliessung` | `zentral` | `haupt` (Standard) | `generalhaupt`
 * - `gruppen`: 1–4 Hauptgruppen (HGS) unter dem GHS, Standard 2 — nur bei `generalhaupt`
 * - `tueren`: 2–8 Türen (bei `zentral`: Wohnungstüren), Standard 4
 */
export function SchliessplanGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const system = auswahl(wert(p, 'system'), SYSTEME, 'haupt');
  const gruppen = zahl(wert(p, 'gruppen'), 1, 4, 2, true);
  const tueren = zahl(wert(p, 'tueren'), 2, 8, 4, true);
  const { knoten, kanten } = plan(system, gruppen, tueren);

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
      title={titel(title, TITEL[system])}
      className={className}
    >
      <Raster breite={BREITE} hoehe={HOEHE} />
      <g transform={transform}>
        {kanten.map(({ von, nach }) => {
          const y1 = von.y + halbeHoehe(von);
          const y2 = nach.y - halbeHoehe(nach);
          const mitte = (y1 + y2) / 2;
          const d =
            Math.abs(von.x - nach.x) < 0.5
              ? `M${r(von.x)} ${r(y1)}V${r(y2)}`
              : `M${r(von.x)} ${r(y1)}V${r(mitte)}H${r(nach.x)}V${r(y2)}`;
          return (
            <path
              key={d}
              className="sm24-draw stroke-area"
              pathLength={1}
              style={motionStyle(0.2 + von.ebene * TAKT, 0.7)}
              strokeWidth={2}
              d={d}
            />
          );
        })}
        {knoten.map((k) =>
          k.art === 'tuer' ? (
            <TuerKnoten key={`t-${r(k.x)}-${r(k.y)}`} k={k} />
          ) : (
            <SchluesselKnoten key={`s-${r(k.x)}-${r(k.y)}`} k={k} oben={k.ebene === 0} />
          ),
        )}
      </g>
    </GrafikRahmen>
  );
}
