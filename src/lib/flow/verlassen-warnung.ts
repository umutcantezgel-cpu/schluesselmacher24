'use client';

import { useEffect } from 'react';

/** Frage vor dem Verlassen, wenn sonst Angaben verloren gingen (FA Abschnitt 26, FA-QA-02). */
export const VERLASSEN_FRAGE =
  'Wenn Sie die Seite jetzt verlassen, gehen Ihre ausgewählten Dateien verloren. Ihre übrigen Angaben bleiben auf diesem Gerät gespeichert. Seite trotzdem verlassen?';

/** Kennung des Wacheintrags in der Browser-Historie. */
const WACHE = 'sm24Wache';

function istWache(state: unknown): boolean {
  return typeof state === 'object' && state !== null && (state as Record<string, unknown>)[WACHE] === true;
}

/**
 * Warnt, bevor ein Ablauf verlassen wird, solange dabei etwas verloren ginge (ausgewählte Dateien, die
 * nie im Browser gespeichert werden, oder ein Zwischenstand, der sich nicht speichern ließ):
 *
 * - Neuladen, Schließen, fremde Seite: die Rückfrage des Browsers (`beforeunload`).
 * - Browser- oder Android-Zurück: Ein Wacheintrag mit derselben Adresse liegt oben in der Historie.
 *   Zurück nimmt ihn weg; die Seite bleibt, und das Formular fragt. Wer verlassen will, geht weiter
 *   zurück, sonst kommt die Wache wieder. Next.js übernimmt eigene `pushState`-Aufrufe (Dokumentation
 *   „Linking and Navigating“, `window.history.pushState`).
 *
 * Ohne Grund zur Warnung tut der Hook nichts, und die Historie bleibt unberührt.
 */
export function useVerlassenWarnung(warnen: boolean): void {
  useEffect(() => {
    if (!warnen || typeof window === 'undefined') return;

    const vorUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Ältere Browser zeigen die Rückfrage nur mit gesetztem Rückgabewert.
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', vorUnload);

    if (!istWache(window.history.state)) {
      window.history.pushState({ [WACHE]: true }, '', window.location.href);
    }
    const zurueck = (event: PopStateEvent) => {
      if (istWache(event.state)) return;
      if (window.confirm(VERLASSEN_FRAGE)) {
        window.removeEventListener('beforeunload', vorUnload);
        window.removeEventListener('popstate', zurueck);
        window.history.back();
      } else {
        window.history.pushState({ [WACHE]: true }, '', window.location.href);
      }
    };
    window.addEventListener('popstate', zurueck);

    return () => {
      window.removeEventListener('beforeunload', vorUnload);
      window.removeEventListener('popstate', zurueck);
    };
  }, [warnen]);
}
