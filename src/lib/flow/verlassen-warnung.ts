'use client';

import { useEffect, useRef } from 'react';

/** Frage vor dem Verlassen, wenn gewählte Dateien verloren gingen (FA Abschnitt 26, FA-QA-02). */
export const VERLASSEN_FRAGE =
  'Wenn Sie die Seite jetzt verlassen, gehen Ihre ausgewählten Dateien verloren. Ihre übrigen Angaben bleiben auf diesem Gerät gespeichert. Seite trotzdem verlassen?';

/** Frage, wenn sich der Zwischenstand nicht speichern ließ (privates Fenster, volle Ablage). */
export const VERLASSEN_FRAGE_UNGESPEICHERT =
  'Ihre Angaben konnten auf diesem Gerät nicht gespeichert werden. Wenn Sie die Seite jetzt verlassen, gehen sie verloren. Seite trotzdem verlassen?';

/** Warum gewarnt wird: gewählte Dateien und/oder ein Zwischenstand, der sich nicht speichern ließ. */
export interface VerlassenGrund {
  dateien: boolean;
  ungespeichert: boolean;
}

/** Die passende Frage zum Grund, oder `null`, wenn nichts verloren ginge. */
export function verlassenFrage({ dateien, ungespeichert }: VerlassenGrund): string | null {
  // Ließ sich nichts speichern, gehen alle Angaben verloren, mit oder ohne Dateien.
  if (ungespeichert) return VERLASSEN_FRAGE_UNGESPEICHERT;
  if (dateien) return VERLASSEN_FRAGE;
  return null;
}

/** Kennung des Wacheintrags in der Browser-Historie. */
const WACHE = 'sm24Wache';

export function istWache(state: unknown): boolean {
  return typeof state === 'object' && state !== null && (state as Record<string, unknown>)[WACHE] === true;
}

/** Was die Wache vom Fenster braucht; im Test ein Nachbau. */
export interface WachFenster {
  history: { state: unknown; pushState: (data: unknown, unused: string, url?: string) => void; back: () => void };
  location: { href: string };
  addEventListener: (typ: 'beforeunload' | 'popstate', fn: (event: never) => void) => void;
  removeEventListener: (typ: 'beforeunload' | 'popstate', fn: (event: never) => void) => void;
  confirm: (frage: string) => boolean;
}

/** Wie die Warnung mit den Schritten in der Historie zusammenarbeitet (FA-QA-04B). */
export interface WachOptionen {
  /**
   * Wacheintrag gegen Browser- und Android-Zurück anlegen (Standard `true`). Mit Schritten in der Historie
   * nur am Anfang des Ablaufs: Weiter oben führt Zurück auf den vorigen Schritt, nicht hinaus. Die Rückfrage
   * beim Neuladen und Schließen gilt immer.
   */
  wache?: boolean;
  /** Ein Eintrag mit einem späteren Schritt des Ablaufs (etwa nach Vorwärts): kein Verlassen, keine Frage. */
  imAblauf?: (state: unknown) => boolean;
}

/**
 * Laufende Rücknahmen einer Wache je Fenster: `history.back()` wirkt erst mit dem nächsten
 * `popstate`. Richtet sich die Warnung vorher neu ein (etwa beim zweiten Durchlauf eines Effekts),
 * darf dieses `popstate` nicht als Verlassen gelten.
 */
const ruecknahmen = new WeakMap<WachFenster, { offen: number; hoerer: ((event: never) => void) | null }>();

function ruecknahmeVon(fenster: WachFenster) {
  let r = ruecknahmen.get(fenster);
  if (!r) {
    r = { offen: 0, hoerer: null };
    ruecknahmen.set(fenster, r);
  }
  return r;
}

/**
 * Richtet die Warnung ein und gibt das Aufräumen zurück:
 *
 * - Neuladen, Schließen, Adresse eingeben und Verweise, die die Seite neu laden (`<a>`): die
 *   Rückfrage des Browsers (`beforeunload`). Ein Wechsel innerhalb der App über `next/link` löst sie
 *   nicht aus; deshalb führen die Verweise in den Hilfeblöcken der Formulare als `<a>` hinaus.
 * - Browser- oder Android-Zurück: Ein Wacheintrag mit derselben Adresse liegt oben in der Historie.
 *   Zurück nimmt ihn weg; die Seite bleibt, und das Formular fragt. Wer verlassen will, geht weiter
 *   zurück, sonst kommt die Wache wieder. Next.js übernimmt eigene `pushState`-Aufrufe (Dokumentation
 *   „Linking and Navigating“, `window.history.pushState`).
 * - Endet die Warnung ohne Verlassen (Dateien entfernt, Absenden, Bestätigung), nimmt das Aufräumen
 *   die Wache wieder aus der Historie, damit das nächste Zurück sichtbar zurückführt.
 *
 * `frage` wird bei jedem Zurück neu gelesen, damit ein Wechsel des Grundes keine neue Wache braucht.
 * Mit `optionen.wache = false` gilt nur die Rückfrage beim Neuladen und Schließen (FA-QA-04B).
 */
export function wacheEinrichten(
  fenster: WachFenster,
  frage: () => string = () => VERLASSEN_FRAGE,
  optionen: WachOptionen = {},
): () => void {
  const mitWache = optionen.wache ?? true;
  const r = ruecknahmeVon(fenster);
  let verlassen = false;

  const vorUnload = (event: { preventDefault: () => void; returnValue: unknown }) => {
    event.preventDefault();
    // Ältere Browser zeigen die Rückfrage nur mit gesetztem Rückgabewert.
    event.returnValue = '';
  };
  const zurueck = (event: { state: unknown }) => {
    if (r.offen > 0) {
      // Das Zurück einer früheren Rücknahme: kein Verlassen. Die Warnung gilt weiter, also Wache neu.
      r.offen -= 1;
      if (!istWache(event.state)) fenster.history.pushState({ [WACHE]: true }, '', fenster.location.href);
      return;
    }
    if (istWache(event.state)) return;
    // Vorwärts auf einen späteren Schritt des Ablaufs: kein Verlassen (FA-QA-04B).
    if (optionen.imAblauf?.(event.state)) return;
    if (fenster.confirm(frage())) {
      verlassen = true;
      entfernen();
      fenster.history.back();
    } else {
      fenster.history.pushState({ [WACHE]: true }, '', fenster.location.href);
    }
  };
  function entfernen() {
    fenster.removeEventListener('beforeunload', vorUnload as (event: never) => void);
    if (mitWache) fenster.removeEventListener('popstate', zurueck as (event: never) => void);
  }

  fenster.addEventListener('beforeunload', vorUnload as (event: never) => void);
  if (mitWache) {
    // Eine noch laufende Rücknahme übernimmt ab jetzt `zurueck`.
    if (r.hoerer) {
      fenster.removeEventListener('popstate', r.hoerer);
      r.hoerer = null;
    }
    if (!istWache(fenster.history.state)) {
      fenster.history.pushState({ [WACHE]: true }, '', fenster.location.href);
    }
    fenster.addEventListener('popstate', zurueck as (event: never) => void);
  }

  return () => {
    entfernen();
    if (!mitWache || verlassen || !istWache(fenster.history.state)) return;
    // Wache wegnehmen; das folgende popstate fängt ein kurzer Hörer ab (oder `zurueck` einer neuen Wache).
    r.offen += 1;
    const einmal = () => {
      r.offen = Math.max(0, r.offen - 1);
      fenster.removeEventListener('popstate', einmal as (event: never) => void);
      if (r.hoerer === (einmal as (event: never) => void)) r.hoerer = null;
    };
    if (r.hoerer) fenster.removeEventListener('popstate', r.hoerer);
    r.hoerer = einmal as (event: never) => void;
    fenster.addEventListener('popstate', r.hoerer);
    fenster.history.back();
  };
}

/**
 * Warnt, bevor ein Ablauf verlassen wird, solange dabei etwas verloren ginge: ausgewählte Dateien, die
 * nie im Browser gespeichert werden, oder ein Zwischenstand, der sich nicht speichern ließ. Die Frage
 * nennt den Grund. Ohne Grund zur Warnung legt der Hook keine Wache an; endet die Warnung, nimmt er
 * die Wache wieder weg.
 */
export function useVerlassenWarnung(grund: VerlassenGrund, optionen: WachOptionen = {}): void {
  const frage = verlassenFrage(grund);
  const frageRef = useRef(frage);
  useEffect(() => {
    frageRef.current = frage;
  }, [frage]);
  const { imAblauf } = optionen;
  const imAblaufRef = useRef(imAblauf);
  useEffect(() => {
    imAblaufRef.current = imAblauf;
  }, [imAblauf]);
  const warnen = frage !== null;
  const mitWache = optionen.wache ?? true;
  useEffect(() => {
    if (!warnen || typeof window === 'undefined') return;
    return wacheEinrichten(window as unknown as WachFenster, () => frageRef.current ?? VERLASSEN_FRAGE, {
      wache: mitWache,
      imAblauf: (state) => imAblaufRef.current?.(state) ?? false,
    });
  }, [warnen, mitWache]);
}
