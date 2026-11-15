'use client';

import { useEffect } from 'react';

/** Frage vor dem Verlassen, wenn sonst Angaben verloren gingen (FA Abschnitt 26, FA-QA-02). */
export const VERLASSEN_FRAGE =
  'Wenn Sie die Seite jetzt verlassen, gehen Ihre ausgewählten Dateien verloren. Ihre übrigen Angaben bleiben auf diesem Gerät gespeichert. Seite trotzdem verlassen?';

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

/**
 * Richtet die Warnung ein und gibt das Aufräumen zurück:
 *
 * - Neuladen, Schließen, fremde Seite: die Rückfrage des Browsers (`beforeunload`).
 * - Browser- oder Android-Zurück: Ein Wacheintrag mit derselben Adresse liegt oben in der Historie.
 *   Zurück nimmt ihn weg; die Seite bleibt, und das Formular fragt. Wer verlassen will, geht weiter
 *   zurück, sonst kommt die Wache wieder. Next.js übernimmt eigene `pushState`-Aufrufe (Dokumentation
 *   „Linking and Navigating“, `window.history.pushState`).
 */
export function wacheEinrichten(fenster: WachFenster): () => void {
  const vorUnload = (event: { preventDefault: () => void; returnValue: unknown }) => {
    event.preventDefault();
    // Ältere Browser zeigen die Rückfrage nur mit gesetztem Rückgabewert.
    event.returnValue = '';
  };
  const zurueck = (event: { state: unknown }) => {
    if (istWache(event.state)) return;
    if (fenster.confirm(VERLASSEN_FRAGE)) {
      aufraeumen();
      fenster.history.back();
    } else {
      fenster.history.pushState({ [WACHE]: true }, '', fenster.location.href);
    }
  };
  function aufraeumen() {
    fenster.removeEventListener('beforeunload', vorUnload as (event: never) => void);
    fenster.removeEventListener('popstate', zurueck as (event: never) => void);
  }

  fenster.addEventListener('beforeunload', vorUnload as (event: never) => void);
  if (!istWache(fenster.history.state)) {
    fenster.history.pushState({ [WACHE]: true }, '', fenster.location.href);
  }
  fenster.addEventListener('popstate', zurueck as (event: never) => void);
  return aufraeumen;
}

/**
 * Warnt, bevor ein Ablauf verlassen wird, solange dabei etwas verloren ginge: ausgewählte Dateien, die
 * nie im Browser gespeichert werden, oder ein Zwischenstand, der sich nicht speichern ließ. Ohne Grund
 * zur Warnung tut der Hook nichts, und die Historie bleibt unberührt.
 */
export function useVerlassenWarnung(warnen: boolean): void {
  useEffect(() => {
    if (!warnen || typeof window === 'undefined') return;
    return wacheEinrichten(window as unknown as WachFenster);
  }, [warnen]);
}
