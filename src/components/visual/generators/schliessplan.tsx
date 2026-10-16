import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  HILFSLINIE,
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

const SYSTEME = ['gleichschliessung', 'zentral', 'haupt', 'generalhaupt'] as const;
type System = (typeof SYSTEME)[number];

const FORMATE = ['breit', 'schmal'] as const;
type Format = (typeof FORMATE)[number];

/**
 * Maße je Format. „schmal“ ist für Telefonbreiten (unter 640 px): 360 Einheiten breit und
 * Schrift 12, bei 358 px Darstellungsbreite also rund 11,9 px. Die Höhe folgt der Tiefe der
 * Anlage (`hoeheFuer`). Der Plan wird im schmalen Format nie verkleinert.
 */
interface Flaeche {
  breite: number;
  rand: number;
  schrift: number;
  /** Breite eines Zeichens der Beschriftung (Monospace, 0,6 em). */
  zeichen: number;
  schluesselHoehe: number;
  tuerBreite: number;
  tuerHoehe: number;
  /** Kleinster und größter waagerechter Abstand zweier Blätter. */
  minRaster: number;
  maxRaster: number;
  schmal: boolean;
}

const FLAECHE: Record<Format, Flaeche> = {
  breit: {
    breite: 480,
    rand: 20,
    schrift: SCHRIFT,
    zeichen: SCHRIFT * 0.6,
    schluesselHoehe: 26,
    tuerBreite: 22,
    tuerHoehe: 32,
    minRaster: 56,
    maxRaster: 84,
    schmal: false,
  },
  schmal: {
    breite: 360,
    rand: 12,
    schrift: 12,
    zeichen: 12 * 0.6,
    schluesselHoehe: 22,
    tuerBreite: 22,
    tuerHoehe: 30,
    minRaster: 0,
    maxRaster: 60,
    schmal: true,
  },
};

/** Höhe des breiten Formats (fest). */
const BREIT_HOEHE = 300;
const MAX_ZEILE = 88;
/** Senkrechter Abstand der Ebenen im schmalen Format: Türhälfte, Ebenenabstand, Platz unter den Türen. */
const SCHMAL_EBENE = 46;
/** Gestrichelt: verdecktes oder noch nicht vorhandenes Teil (Strichmuster der Notschlüssel). */
const GESTRICHELT = '4 3';
/** Verzögerung je Ebene (Sekunden). */
const TAKT = 0.32;
/** Abstand der Z-Türen von der Mitte (breites und schmales Format). */
const Z_VERSATZ = 42;

interface Baum {
  art: 'schluessel' | 'tuer';
  /** Stabile Kennung: `wurzel`, `g1`, `g1.1`, `e3`, `t3`, `z1`, `r1`, `rt1`. */
  kennung: string;
  /** Ebenenkürzel (GHS, HGS, GS, HS, ES) oder Z für Zentraltüren. */
  label?: string;
  /** Volles Kürzel für die Schlüsselliste, z. B. „HGS 1“ oder „GS 1.2“. */
  kuerzel?: string;
  /** Reserveplatz: gestrichelt, nicht wählbar, nicht in der Schlüsselliste. */
  frei?: boolean;
  kinder: Baum[];
}

interface Knoten {
  art: 'schluessel' | 'tuer';
  kennung: string;
  label?: string;
  kuerzel?: string;
  frei?: boolean;
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

/** Reserveplätze: je ein gestrichelter Schlüssel mit gestrichelter Tür. */
function freieBaume(anzahl: number): Baum[] {
  return Array.from({ length: anzahl }, (_, i) => {
    const nr = i + 1;
    return {
      art: 'schluessel',
      kennung: `r${nr}`,
      frei: true,
      kinder: [{ art: 'tuer', kennung: `rt${nr}`, frei: true, kinder: [] }],
    };
  });
}

/** Verteilt `menge` möglichst gleichmäßig auf `teile` Gruppen (vordere zuerst). */
function verteilen(menge: number, teile: number): number[] {
  const basis = Math.floor(menge / teile);
  const rest = menge % teile;
  return Array.from({ length: teile }, (_, i) => basis + (i < rest ? 1 : 0));
}

function generalhaupt(gruppen: number, tueren: number, reserve: number): Baum {
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
  if (reserve > 0) {
    /* Reserve hängt an die letzte Gruppe. */
    const letzteHauptgruppe = hgs[hgs.length - 1];
    const letzteGruppe = letzteHauptgruppe.kinder[letzteHauptgruppe.kinder.length - 1];
    letzteGruppe.kinder.push(...freieBaume(reserve));
  }
  return schluessel('wurzel', 'GHS', hgs);
}

/** Kennungen aller Türen unter einem Baum (ohne Reservetüren). */
function tuerenUnter(b: Baum): string[] {
  if (b.art === 'tuer') return b.frei ? [] : [b.kennung];
  return b.kinder.flatMap(tuerenUnter);
}

function schluesselBreite(label: string | undefined, f: Flaeche): number {
  if (f.schmal) return label ? 8 + label.length * f.zeichen : 30;
  return label ? 34 + label.length * f.zeichen : 36;
}

/** Breite eines Knotens; ein Reserveplatz ist so breit wie ein ES-Schlüssel. */
function knotenBreite(k: Pick<Knoten, 'art' | 'label' | 'frei'>, f: Flaeche): number {
  if (k.art === 'tuer') return f.tuerBreite;
  return k.frei ? schluesselBreite('ES', f) : schluesselBreite(k.label, f);
}

/** Legt einen Baum aus: Blätter gleichmäßig, Eltern mittig über den Kindern. */
function auslegen(wurzel: Baum, zeilen: (ebene: number) => number, f: Flaeche) {
  const knoten: Knoten[] = [];
  const kanten: Kante[] = [];
  const blaetter: Baum[] = [];
  const sammeln = (b: Baum) => {
    if (b.kinder.length === 0) blaetter.push(b);
    b.kinder.forEach(sammeln);
  };
  sammeln(wurzel);
  const raster = blattRaster(blaetter.length, f);
  const blattX = new Map<Baum, number>();
  blaetter.forEach((b, i) => blattX.set(b, f.breite / 2 + (i - (blaetter.length - 1) / 2) * raster));

  const setzen = (b: Baum, ebene: number): Knoten => {
    const kinder = b.kinder.map((k) => setzen(k, ebene + 1));
    const x = kinder.length
      ? (kinder[0].x + kinder[kinder.length - 1].x) / 2
      : (blattX.get(b) ?? f.breite / 2);
    const k: Knoten = {
      art: b.art,
      kennung: b.kennung,
      label: b.label,
      kuerzel: b.kuerzel,
      frei: b.frei,
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

/** Waagerechter Abstand der Blätter: großzügig bei wenigen, nie enger als ein Knoten (breit). */
function blattRaster(anzahl: number, f: Flaeche): number {
  return Math.max(f.minRaster, Math.min(f.maxRaster, (f.breite - 2 * f.rand) / Math.max(1, anzahl)));
}

/** Zeilenmitten für `anzahl` Ebenen: breit senkrecht zentriert, schmal von oben nach unten. */
function zeilenLage(anzahl: number, f: Flaeche): (ebene: number) => number {
  if (f.schmal) {
    return (ebene: number) => f.rand + f.tuerHoehe / 2 + ebene * SCHMAL_EBENE;
  }
  const schritt = Math.min(MAX_ZEILE, (BREIT_HOEHE - 2 * f.rand - f.tuerHoehe) / Math.max(1, anzahl - 1));
  const hoehe = (anzahl - 1) * schritt;
  const start = (BREIT_HOEHE - hoehe) / 2;
  return (ebene: number) => start + ebene * schritt;
}

/** Höhe der Zeichenfläche: fest im breiten Format, sonst nach der Zahl der Ebenen. */
function hoeheFuer(anzahl: number, f: Flaeche): number {
  return f.schmal ? 2 * f.rand + SCHMAL_EBENE * anzahl : BREIT_HOEHE;
}

function halbeHoehe(k: Knoten, f: Flaeche): number {
  return k.art === 'tuer' ? f.tuerHoehe / 2 : f.schluesselHoehe / 2;
}

/** Plan der Zentralschlossanlage: Z-Türen oben, Wohnungsschlüssel, eigene Türen. */
function zentralPlan(tueren: number, f: Flaeche) {
  const zeilen = zeilenLage(3, f);
  const raster = blattRaster(tueren, f);
  const zentralTueren: Knoten[] = [-1, 1].map((seite, i) => ({
    art: 'tuer',
    kennung: `z${i + 1}`,
    label: 'Z',
    ebene: 0,
    x: f.breite / 2 + seite * Z_VERSATZ,
    y: zeilen(0),
  }));
  const knoten: Knoten[] = [...zentralTueren];
  const kanten: Kante[] = [];
  for (let i = 0; i < tueren; i += 1) {
    const nr = i + 1;
    const x = f.breite / 2 + (i - (tueren - 1) / 2) * raster;
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
  return { knoten, kanten, hoehe: hoeheFuer(3, f) };
}

function plan(system: System, gruppen: number, tueren: number, reserve: number, f: Flaeche) {
  if (system === 'zentral') return zentralPlan(tueren, f);
  const wurzel =
    system === 'gleichschliessung'
      ? schluessel(
          'wurzel',
          undefined,
          Array.from({ length: tueren }, (_, i) => tuer(`t${i + 1}`)),
        )
      : system === 'generalhaupt'
        ? generalhaupt(gruppen, tueren, reserve)
        : schluessel('wurzel', 'HS', [...einzel(tueren, 1), ...freieBaume(reserve)]);
  const ebenen = tiefe(wurzel);
  return { ...auslegen(wurzel, zeilenLage(ebenen, f), f), hoehe: hoeheFuer(ebenen, f) };
}

/** Liest die Parameter und legt den Plan aus — gemeinsame Grundlage von Grafik und Schlüsselliste. */
function lesePlan(p: Parameter) {
  const system = auswahl(wert(p, 'system'), SYSTEME, 'haupt');
  const gruppen = zahl(wert(p, 'gruppen'), 1, 4, 2, true);
  const tueren = zahl(wert(p, 'tueren'), 2, 8, 4, true);
  /* Reserveplätze gibt es nur bei Haupt- und Generalhauptschlüsselanlagen. */
  const reserve =
    system === 'haupt' || system === 'generalhaupt' ? zahl(wert(p, 'reserve'), 0, 2, 0, true) : 0;
  const f = FLAECHE[auswahl(wert(p, 'format'), FORMATE, 'breit')];
  return { system, f, ...plan(system, gruppen, tueren, reserve, f) };
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
 * Unbekannte Kennungen und Reserveplätze bleiben ohne Wirkung.
 */
function markieren(
  knoten: Knoten[],
  kanten: Kante[],
  markiert: unknown,
  tuerWert: unknown,
): Markierung | undefined {
  const gewaehlt = knoten.find(
    (k) => k.art === 'schluessel' && !k.frei && k.kennung === kennungVon(markiert),
  );
  if (gewaehlt) {
    const tueren = knoten.filter(
      (k) => k.art === 'tuer' && !k.frei && (gewaehlt.schliesst ?? []).includes(k.kennung),
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
  const tuerKnoten = knoten.find(
    (k) => k.art === 'tuer' && !k.frei && k.kennung === kennungVon(tuerWert),
  );
  if (tuerKnoten) {
    const oeffner = knoten.filter(
      (k) => k.art === 'schluessel' && !k.frei && (k.schliesst ?? []).includes(tuerKnoten.kennung),
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

interface KnotenProps {
  k: Knoten;
  stand: Stand;
  f: Flaeche;
}

function SchluesselKnoten({ k, oben, stand, f }: KnotenProps & { oben: boolean }) {
  if (k.frei) return <FreierKnoten k={k} stand={stand} f={f} />;
  if (f.schmal) return <SchluesselKnotenSchmal k={k} oben={oben} stand={stand} f={f} />;
  const breite = schluesselBreite(k.label, f);
  const x0 = k.x - breite / 2;
  const symbolX = k.label ? x0 + 7.5 : k.x - 8;
  const cy = k.y;
  return (
    <g className={gruppenKlasse(stand)} style={motionStyle(0.05 + k.ebene * TAKT)}>
      <rect
        className={oben ? 'fill-area-muted stroke-area-strong' : 'fill-surface stroke-area-strong'}
        strokeWidth={oben ? KONTUR : LINIE_STARK}
        x={r(x0)}
        y={r(cy - f.schluesselHoehe / 2)}
        width={r(breite)}
        height={f.schluesselHoehe}
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
          fontSize={f.schrift}
          fontWeight={500}
          x={r(x0 + 27)}
          y={r(cy + 4.5)}
        >
          {k.label}
        </text>
      )}
    </g>
  );
}

/** Schmales Format: Kürzel mittig im Kasten, ohne Symbol. Ohne Kürzel nur das Symbol. */
function SchluesselKnotenSchmal({ k, oben, stand, f }: KnotenProps & { oben: boolean }) {
  const breite = knotenBreite(k, f);
  const cy = k.y;
  return (
    <g className={gruppenKlasse(stand)} style={motionStyle(0.05 + k.ebene * TAKT)}>
      <rect
        className={oben ? 'fill-area-muted stroke-area-strong' : 'fill-surface stroke-area-strong'}
        strokeWidth={oben ? KONTUR : LINIE_STARK}
        x={r(k.x - breite / 2)}
        y={r(cy - f.schluesselHoehe / 2)}
        width={r(breite)}
        height={f.schluesselHoehe}
        rx={6}
      />
      {k.label ? (
        <text
          className="fill-foreground-muted font-mono"
          fontSize={f.schrift}
          fontWeight={500}
          textAnchor="middle"
          x={r(k.x)}
          y={r(cy + 4.2)}
        >
          {k.label}
        </text>
      ) : (
        <g className="stroke-area-strong" strokeWidth={LINIE_STARK}>
          <circle cx={r(k.x - 4.5)} cy={r(cy)} r={3.5} />
          <path
            d={`M${r(k.x - 1)} ${r(cy)}H${r(k.x + 8)}M${r(k.x + 4.5)} ${r(cy)}v3.5M${r(k.x + 7.5)} ${r(cy)}v3.5`}
          />
        </g>
      )}
    </g>
  );
}

/** Reserveplatz: gestrichelter Kasten ohne Füllung. Breit steht „frei“ im Kasten, schmal unter der Tür. */
function FreierKnoten({ k, stand, f }: KnotenProps) {
  const breite = knotenBreite(k, f);
  return (
    <g className={gruppenKlasse(stand)} style={motionStyle(0.05 + k.ebene * TAKT)}>
      <rect
        className="fill-surface stroke-border-strong"
        strokeWidth={LINIE_STARK}
        strokeDasharray={GESTRICHELT}
        x={r(k.x - breite / 2)}
        y={r(k.y - f.schluesselHoehe / 2)}
        width={r(breite)}
        height={f.schluesselHoehe}
        rx={f.schmal ? 6 : 8}
      />
      {!f.schmal && (
        <text
          className="fill-foreground-muted font-mono"
          fontSize={f.schrift}
          fontWeight={500}
          textAnchor="middle"
          x={r(k.x)}
          y={r(k.y + 4.5)}
        >
          frei
        </text>
      )}
    </g>
  );
}

function TuerKnoten({ k, stand, f }: KnotenProps) {
  if (k.frei) return <FreierTuer k={k} stand={stand} f={f} />;
  const zentral = k.label === 'Z';
  const links = k.x - f.tuerBreite / 2;
  const oben = k.y - f.tuerHoehe / 2;
  return (
    <g className={gruppenKlasse(stand)} style={motionStyle(0.05 + k.ebene * TAKT)}>
      <rect
        className={tuerFlaeche(zentral, stand)}
        strokeWidth={LINIE_STARK}
        x={r(links)}
        y={r(oben)}
        width={f.tuerBreite}
        height={f.tuerHoehe}
        rx={2.5}
      />
      <circle className="fill-foreground-muted" cx={r(k.x + 5.5)} cy={r(k.y + 3)} r={1.8} />
      {zentral && (
        <text
          className="fill-foreground-muted font-mono"
          fontSize={f.schrift}
          fontWeight={500}
          textAnchor={k.x < f.breite / 2 ? 'end' : 'start'}
          x={r(k.x < f.breite / 2 ? links - 7 : links + f.tuerBreite + 7)}
          y={r(k.y + 4.5)}
        >
          Z
        </text>
      )}
    </g>
  );
}

/** Reservetür: gestrichelt, ohne Füllung. Schmal steht „frei“ unter ihr. */
function FreierTuer({ k, stand, f }: KnotenProps) {
  const links = k.x - f.tuerBreite / 2;
  const oben = k.y - f.tuerHoehe / 2;
  return (
    <g className={gruppenKlasse(stand)} style={motionStyle(0.05 + k.ebene * TAKT)}>
      <rect
        className="fill-surface stroke-border-strong"
        strokeWidth={LINIE_STARK}
        strokeDasharray={GESTRICHELT}
        x={r(links)}
        y={r(oben)}
        width={f.tuerBreite}
        height={f.tuerHoehe}
        rx={2.5}
      />
      <circle className="stroke-border-strong" strokeWidth={HILFSLINIE} cx={r(k.x + 5.5)} cy={r(k.y + 3)} r={1.8} />
      {f.schmal && (
        <text
          className="fill-foreground-muted font-mono"
          fontSize={f.schrift}
          textAnchor="middle"
          x={r(k.x)}
          y={r(k.y + f.tuerHoehe / 2 + 13)}
        >
          frei
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
 * - `reserve`: 0–2 freie Plätze (ES mit Tür, gestrichelt, nicht wählbar), Standard 0 —
 *   nur bei `haupt` und `generalhaupt`; bei `generalhaupt` an der letzten Gruppe
 * - `format`: `breit` (Standard, 480 Einheiten) | `schmal` (360 Einheiten, Schrift 12 für Telefone)
 * - `markiert`: Kennung eines Schlüssels (`wurzel`, `g1`, `g1.1`, `e3` …). Hervorgehoben
 *   werden dieser Schlüssel, die Türen, die er schließt, und die Kanten seines Weges;
 *   alles andere wird gedimmt. Unbekannte Kennung → ohne Markierung.
 * - `tuer`: Kennung einer Tür (`t3`, `z1`). Hervorgehoben werden diese Tür, alle Schlüssel,
 *   die sie öffnen (bei `z1`/`z2` alle ES), und die Kanten dazwischen. `markiert` hat Vorrang.
 *
 * Die Kennungen sind stabil: `wurzel` (GHS, HS, unbeschrifteter Schlüssel), `g1`…`g4`
 * (HGS, von links), `g1.1` … (GS), `e1`…`e8` (ES, von links), `t1`…`t8` (Türen),
 * `z1`, `z2` (Zentraltüren), `r1`, `r2` und `rt1`, `rt2` (Reserve, nicht wählbar).
 */
export function SchliessplanGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const { system, f, knoten, kanten, hoehe } = lesePlan(p);
  const markierung = markieren(knoten, kanten, wert(p, 'markiert'), wert(p, 'tuer'));
  const standardTitel = markierung
    ? `${TITEL[system]} – markiert: ${markierung.text}`
    : TITEL[system];

  /* Sicherheitsnetz: alles passt in die viewBox, sonst kleiner skalieren. */
  const links = Math.min(...knoten.map((k) => k.x - knotenBreite(k, f) / 2));
  const rechts = Math.max(...knoten.map((k) => k.x + knotenBreite(k, f) / 2));
  const skala = Math.min(1, (f.breite - 2 * f.rand) / Math.max(1, rechts - links));
  const transform =
    skala < 1
      ? `translate(${r(f.breite / 2 - (skala * f.breite) / 2)} ${r(hoehe / 2 - (skala * hoehe) / 2)}) scale(${r(skala * 1000) / 1000})`
      : undefined;

  return (
    <GrafikRahmen
      breite={f.breite}
      hoehe={hoehe}
      title={titel(title, standardTitel)}
      className={className}
    >
      <Raster breite={f.breite} hoehe={hoehe} />
      <g transform={transform}>
        {kanten.map((kante) => {
          const { von, nach } = kante;
          const y1 = von.y + halbeHoehe(von, f);
          const y2 = nach.y - halbeHoehe(nach, f);
          const mitte = (y1 + y2) / 2;
          const d =
            Math.abs(von.x - nach.x) < 0.5
              ? `M${r(von.x)} ${r(y1)}V${r(y2)}`
              : `M${r(von.x)} ${r(y1)}V${r(mitte)}H${r(nach.x)}V${r(y2)}`;
          if (nach.frei) {
            /* Leitung zu einem Reserveplatz: gestrichelt, mit dem Ebenentakt, ohne eigene Bewegung. */
            return (
              <path
                key={d}
                className={markierung ? 'sm24-fade stroke-area-muted' : 'sm24-fade stroke-border-strong'}
                style={motionStyle(0.2 + von.ebene * TAKT, 0.7)}
                strokeWidth={LINIE}
                strokeDasharray={GESTRICHELT}
                d={d}
              />
            );
          }
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
              f={f}
              stand={zustand(markierung?.knoten.has(k))}
            />
          ) : (
            <SchluesselKnoten
              key={`s-${r(k.x)}-${r(k.y)}`}
              k={k}
              oben={k.ebene === 0}
              f={f}
              stand={zustand(markierung?.knoten.has(k))}
            />
          ),
        )}
      </g>
    </GrafikRahmen>
  );
}

/**
 * Inhaltsfläche des Plans in viewBox-Einheiten (Schlüssel, Türen, Z-Beschriftung, „frei“
 * unter schmalen Reservetüren) mit Rand – für einen Ausschnitt ohne leere Ränder
 * (`.sm24-ausschnitt`), damit die Kürzel auf schmalen Flächen lesbar groß bleiben. Passt
 * der Plan nicht in die viewBox (Sicherheitsnetz der Grafik), gilt die volle Fläche.
 */
export function schliessplanAusschnitt(
  params: unknown,
  rand = 12,
): { x: number; y: number; breite: number; hoehe: number; vollBreite: number; vollHoehe: number } {
  const { knoten, f, hoehe } = lesePlan(parameter(params));
  const halbeBreite = (k: Knoten) => knotenBreite(k, f) / 2;
  const zText = (k: Knoten) => (k.label === 'Z' ? 7 + f.zeichen + 2 : 0);
  const links = Math.min(
    ...knoten.map((k) => k.x - halbeBreite(k) - (k.x < f.breite / 2 ? zText(k) : 0)),
  );
  const rechts = Math.max(
    ...knoten.map((k) => k.x + halbeBreite(k) + (k.x >= f.breite / 2 ? zText(k) : 0)),
  );
  const oben = Math.min(...knoten.map((k) => k.y - halbeHoehe(k, f)));
  /* Unter einer schmalen Reservetür steht „frei“ (Grundlinie 13 unter der Türkante). */
  const unten = Math.max(
    ...knoten.map((k) => k.y + halbeHoehe(k, f) + (k.art === 'tuer' && k.frei && f.schmal ? 13 : 0)),
  );
  const voll = { x: 0, y: 0, breite: f.breite, hoehe, vollBreite: f.breite, vollHoehe: hoehe };
  if (rechts - links > f.breite - 2 * f.rand) return voll;
  const x = Math.max(0, links - rand);
  const y = Math.max(0, oben - rand);
  return {
    x: r(x),
    y: r(y),
    breite: r(Math.min(f.breite, rechts + rand) - x),
    hoehe: r(Math.min(hoehe, unten + rand) - y),
    vollBreite: f.breite,
    vollHoehe: hoehe,
  };
}

/**
 * Alle Schlüssel des Plans, oben nach unten und links nach rechts, mit Kürzel und den
 * Kennungen der Türen, die sie schließen. Reserveplätze fehlen (nicht wählbar). Liest
 * dieselben Parameter wie die Grafik.
 */
export function schliessplanSchluessel(
  params: unknown,
): { kennung: string; kuerzel: string; tueren: string[] }[] {
  const { knoten } = lesePlan(parameter(params));
  return knoten
    .filter((k) => k.art === 'schluessel' && !k.frei)
    .sort((a, b) => a.ebene - b.ebene || a.x - b.x)
    .map((k) => ({
      kennung: k.kennung,
      kuerzel: k.kuerzel ?? 'Schlüssel',
      tueren: k.schliesst ?? [],
    }));
}
