/**
 * Formularschritte in der Browser-Historie (FA-QA-04B, FA Abschnitt 26: „Zurückfunktion ohne Datenverlust“).
 *
 * Jeder Schrittwechsel nach vorn legt einen Eintrag an; Browser- und Android-Zurück führen damit einen
 * Schritt zurück statt aus dem Formular hinaus. Die Adresse bleibt gleich (kein Suchparameter), damit
 * `canonical` und Messung unberührt bleiben. Next.js übernimmt eigene `pushState`- und
 * `replaceState`-Aufrufe ohne Adresse und kopiert seinen eigenen Zustand in den Eintrag
 * (`node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`, Abschnitt
 * `window.history.pushState`).
 *
 * Jeder Eintrag trägt unter `sm24Ablauf` die Kennung des Formulars und den Pfad: die Schritte der
 * bekannten Einträge darunter bis zu diesem. Der Pfad ist relativ; er behauptet nie mehr Einträge, als
 * dieses Formular selbst angelegt hat. So können der eigene Zurück-Knopf und die Schrittlinks dieselbe
 * Historie nutzen (`history.go(-n)` auf den nächsten Eintrag mit dem Zielschritt) und keinen doppelten
 * Eintrag anlegen.
 *
 * Gewählte Dateien liegen im Zustand der Formular-Komponente. Weil die Seite beim Zurück und Vorwärts
 * im selben Dokument bleibt, bleiben sie erhalten.
 */

import { istWache } from './verlassen-warnung';

/** Schlüssel des Schritteintrags im Zustand der Historie. */
export const ABLAUF = 'sm24Ablauf';

export interface AblaufEintrag {
  /** Kennung des Formulars (`useFlow({ id })`). */
  id: string;
  /** Schritte der bekannten Einträge, unten zuerst; der letzte ist der Schritt dieses Eintrags. */
  pfad: string[];
}

/** Was die Schritt-Historie vom Fenster braucht; im Test ein Nachbau. */
export interface HistorienFenster {
  history: {
    readonly state: unknown;
    pushState: (data: unknown, unused: string) => void;
    replaceState: (data: unknown, unused: string) => void;
    go: (delta: number) => void;
  };
  addEventListener: (typ: 'popstate', fn: (event: { state: unknown }) => void) => void;
  removeEventListener: (typ: 'popstate', fn: (event: { state: unknown }) => void) => void;
}

/** Ein laufender Sprung in der Historie gilt höchstens so lange; danach sind neue Wechsel wieder frei. */
const SPRUNG_MS = 1000;

function objekt(state: unknown): Record<string, unknown> {
  return typeof state === 'object' && state !== null ? (state as Record<string, unknown>) : {};
}

function letzter(pfad: string[]): string {
  return pfad[pfad.length - 1];
}

/** Der Schritteintrag dieses Formulars im Zustand, sonst `null`. */
export function eintragAus(state: unknown, id: string): AblaufEintrag | null {
  const e = objekt(state)[ABLAUF];
  if (typeof e !== 'object' || e === null) return null;
  const { id: kennung, pfad } = e as { id?: unknown; pfad?: unknown };
  if (kennung !== id || !Array.isArray(pfad) || pfad.length === 0) return null;
  if (!pfad.every((s) => typeof s === 'string')) return null;
  return { id, pfad: pfad as string[] };
}

/**
 * Abstand zum nächsten Eintrag darunter, der `ziel` zeigt (negativ), oder 0, wenn keiner bekannt ist.
 * Der nächste, nicht der erste: Zurück geht nie weiter als nötig.
 */
export function rueckwegDelta(pfad: string[] | null, ziel: string): number {
  if (!pfad) return 0;
  for (let j = pfad.length - 2; j >= 0; j -= 1) {
    if (pfad[j] === ziel) return j - (pfad.length - 1);
  }
  return 0;
}

/**
 * Der Schritt, den ein Eintrag meint, unter den gerade nötigen Schritten. Ist er im konkreten Fall nicht
 * nötig (`isStepRelevant`), gilt der letzte nötige davor, sonst der erste.
 */
export function aufRelevant(ziel: string, alle: string[], relevant: string[]): string | null {
  if (relevant.includes(ziel)) return ziel;
  const iz = alle.indexOf(ziel);
  if (iz < 0 || relevant.length === 0) return null;
  let treffer = relevant[0];
  for (const s of relevant) {
    if (alle.indexOf(s) <= iz) treffer = s;
  }
  return treffer;
}

export type PopstateEntscheidung =
  | { art: 'zeigen'; schritt: string }
  | { art: 'ignorieren' }
  /** Zurück zum Eintrag, von dem der Sprung kam (gesperrter Schritt) oder einen davor (zu weit). */
  | { art: 'springen'; delta: number };

/**
 * Entscheidet nach Zurück oder Vorwärts im Browser, welcher Schritt gilt.
 *
 * - Zurück (früherer Schritt): immer, ohne Prüfung.
 * - Vorwärts: nur, solange der aktuelle Schritt erfüllt ist (`weiterFrei` = `canContinue`), und nur einen
 *   Schritt weit. Ein gesperrter Schritt führt zurück auf den Eintrag, von dem der Sprung kam; ein Sprung
 *   über mehrere Einträge geht bis auf den nächsten. So wird kein Schritt übersprungen, auch keiner mit
 *   Nachweis (R13).
 *
 * `tiefe` ist der Abstand in Einträgen vom vorigen Eintrag zum erreichten (positiv: vorwärts), 0 unbekannt.
 */
export function popstateEntscheiden({
  alle,
  relevant,
  aktuell,
  ziel,
  tiefe,
  weiterFrei,
}: {
  alle: string[];
  relevant: string[];
  aktuell: string;
  ziel: string;
  tiefe: number;
  weiterFrei: boolean;
}): PopstateEntscheidung {
  const z = aufRelevant(ziel, alle, relevant);
  if (z === null) return { art: 'ignorieren' };
  const ia = Math.max(0, relevant.indexOf(aktuell));
  const iz = relevant.indexOf(z);
  if (iz <= ia) return { art: 'zeigen', schritt: z };
  if (!weiterFrei) return tiefe !== 0 ? { art: 'springen', delta: -tiefe } : { art: 'zeigen', schritt: relevant[ia] };
  if (iz === ia + 1) return { art: 'zeigen', schritt: z };
  if (tiefe > 1) return { art: 'springen', delta: -(tiefe - 1) };
  return { art: 'zeigen', schritt: relevant[ia + 1] };
}

/** Lage beim popstate, aus dem Zustand des Ablaufs. */
export interface PopstateLage {
  aktuell: string;
  alle: string[];
  relevant: string[];
  /** Ob der aktuelle Schritt erfüllt ist (`validate`); die Freigabe des Rahmens kommt dazu. */
  gueltig: boolean;
}

/**
 * Die Schritt-Historie eines Ablaufs. Ein Exemplar je `useFlow`; ohne Fenster (Vorabrendern) tut es nichts.
 */
export class SchrittHistorie {
  /** Pfad des aktuellen Eintrags, wie zuletzt gelesen oder geschrieben. */
  private pfad: string[] | null = null;
  private sprung: { delta: number; seit: number } | null = null;
  private freigabe: boolean | null = null;
  private readonly abonnenten = new Set<() => void>();

  constructor(
    readonly id: string,
    private readonly fenster: () => HistorienFenster | null,
    private readonly jetzt: () => number = Date.now,
  ) {}

  /** Für `useSyncExternalStore`: meldet, wenn sich `amAnfang` ändert. */
  abonnieren = (melden: () => void): (() => void) => {
    this.abonnenten.add(melden);
    return () => {
      this.abonnenten.delete(melden);
    };
  };

  /**
   * Unter dem aktuellen Eintrag liegt kein Schritt dieses Formulars: Zurück verlässt das Formular. Nur hier
   * braucht die Rückfrage vor dem Verlassen ihren Wacheintrag.
   */
  amAnfang = (): boolean => (this.pfad?.length ?? 1) <= 1;

  /** Ein Eintrag über dem Anfang (ein späterer Schritt dieses Formulars): kein Verlassen. */
  istFolgeEintrag = (state: unknown): boolean => {
    const e = eintragAus(state, this.id);
    return e !== null && e.pfad.length > 1;
  };

  /** Freigabe des Rahmens für „Weiter“ (`canContinue` der FlowShell, auch mit Dateien). */
  setzeFreigabe(frei: boolean | null): void {
    this.freigabe = frei;
  }

  /** Läuft gerade ein Sprung (`history.go`)? Dann kein zweiter Wechsel (kein Sprung um zwei Schritte). */
  unterwegs(): boolean {
    return this.sprung !== null && this.jetzt() - this.sprung.seit < SPRUNG_MS;
  }

  /** Bekannter Pfad des aktuellen Eintrags (für Tests und Bericht). */
  aktuellerPfad(): string[] | null {
    return this.pfad;
  }

  private setzePfad(pfad: string[] | null): void {
    const vorher = this.amAnfang();
    this.pfad = pfad;
    if (vorher !== this.amAnfang()) for (const melden of this.abonnenten) melden();
  }

  /**
   * Der aktuelle Eintrag zeigt `schritt`: nach dem Laden, Neuladen, Wiederherstellen, „Neu beginnen“ oder
   * einem Wechsel ohne Eintrag darunter. Schreibt nur, wenn etwas abweicht (`replaceState`, kein neuer
   * Eintrag). Ersetzt Next.js den Eintrag, gilt der bekannte Pfad weiter; eine fremde Wache bekommt nur
   * ihren eigenen Schritt.
   */
  abgleichen(schritt: string): void {
    const f = this.fenster();
    if (!f || !schritt) return;
    const state = f.history.state;
    const e = eintragAus(state, this.id);
    let pfad: string[];
    if (e) pfad = letzter(e.pfad) === schritt ? e.pfad : [...e.pfad.slice(0, -1), schritt];
    else if (!istWache(state) && this.pfad && letzter(this.pfad) === schritt) pfad = this.pfad;
    else pfad = [schritt];
    if (!e || pfad !== e.pfad) f.history.replaceState({ ...objekt(state), [ABLAUF]: { id: this.id, pfad } }, '');
    this.setzePfad(pfad);
  }

  /** Schritt nach vorn: ein neuer Eintrag mit derselben Adresse. */
  vor(von: string, ziel: string): void {
    const f = this.fenster();
    if (!f) return;
    this.abgleichen(von);
    const pfad = [...(this.pfad ?? [von]), ziel];
    f.history.pushState({ [ABLAUF]: { id: this.id, pfad } }, '');
    this.sprung = null;
    this.setzePfad(pfad);
  }

  /**
   * Zurück auf `ziel` über die Historie, wenn ein Eintrag darunter ihn zeigt. `true`: Der Wechsel folgt mit
   * dem popstate. `false`: Kein solcher Eintrag (etwa nach einem Neuladen mitten im Ablauf); der Ablauf
   * wechselt direkt, der Abgleich beschriftet den aktuellen Eintrag um.
   */
  zurueck(ziel: string): boolean {
    const f = this.fenster();
    if (!f) return false;
    const delta = rueckwegDelta(eintragAus(f.history.state, this.id)?.pfad ?? null, ziel);
    if (delta === 0) return false;
    this.sprung = { delta, seit: this.jetzt() };
    f.history.go(delta);
    return true;
  }

  /** Nach einem popstate: der Schritt, der jetzt gilt, oder `null` (nichts ändern). */
  beiPopstate(state: unknown, lage: PopstateLage): string | null {
    const f = this.fenster();
    const vorher = this.pfad;
    const erwartet = this.sprung?.delta ?? -1;
    this.sprung = null;
    let e = eintragAus(state, this.id);
    if (!e) {
      // Eintrag ohne Kennung (von Next.js ersetzt, Wache ohne Kennung): nur rückwärts ableitbar, aus dem
      // bekannten Pfad. Sonst ist es ein Eintrag außerhalb des Formulars (Verlassen); das regelt die Wache.
      if (!vorher || vorher.length + erwartet < 1 || erwartet >= 0) return null;
      e = { id: this.id, pfad: vorher.slice(0, vorher.length + erwartet) };
      f?.history.replaceState({ ...objekt(state), [ABLAUF]: e }, '');
    }
    const entscheidung = popstateEntscheiden({
      alle: lage.alle,
      relevant: lage.relevant,
      aktuell: lage.aktuell,
      ziel: letzter(e.pfad),
      tiefe: vorher ? e.pfad.length - vorher.length : 0,
      weiterFrei: lage.gueltig && (this.freigabe ?? true),
    });
    this.setzePfad(e.pfad);
    if (entscheidung.art === 'springen') {
      this.sprung = { delta: entscheidung.delta, seit: this.jetzt() };
      f?.history.go(entscheidung.delta);
      return null;
    }
    if (entscheidung.art === 'ignorieren') return null;
    return entscheidung.schritt;
  }
}

/** Das Fenster des Browsers, auf dem Server `null`. */
export function browserFenster(): HistorienFenster | null {
  return typeof window === 'undefined' ? null : (window as unknown as HistorienFenster);
}
