/* ==========================================================================
   Freigabe-Schalter der Video-Einbettung (FA-INHALT-01B, FA-21-14)

   Die Einbettung von YouTube wirkt nur, wenn auf dem Server die
   Umgebungsvariable `SM24_VIDEOS=an` gesetzt ist. Muster wie die Statistik
   (`mitStatistik` in next.config.ts, `src/lib/statistik.ts`): Erst mit dem
   Schalter öffnet die Sicherheitsrichtlinie den einen Rahmen, zeigt die
   Datenschutzerklärung den Absatz zu YouTube, nennt die Verarbeitungsübersicht
   den Dienst und tragen die Strukturdaten ein VideoObject. Ohne Schalter
   bleibt alles wie vor dem Paket: Die Tutorial-Seite zeigt nur einen Satz.

   Der Betrieb setzt den Schalter erst, wenn der Anwalt den Absatz der
   Datenschutzerklärung geprüft hat (docs/betrieb/tutorials-videos.md).
   Bewusst ohne NEXT_PUBLIC_: Der Wert wird nur auf dem Server gelesen und
   wirkt, wie die Richtlinie, ab dem nächsten Build.
   ========================================================================== */

/** Name der Umgebungsvariablen. */
export const VIDEOS_SCHALTER = 'SM24_VIDEOS';

/** Einziger Wert, der die Einbettung freischaltet. */
export const VIDEOS_AN = 'an';

/** Die Bedingung als reine Funktion (auch für next.config.ts). */
export function videosFreiBei(wert: string | undefined): boolean {
  return wert?.trim().toLowerCase() === VIDEOS_AN;
}

/** Ist die Einbettung der Videos freigeschaltet? Nur auf dem Server aussagekräftig. */
export function videosFreigegeben(): boolean {
  return videosFreiBei(process.env.SM24_VIDEOS);
}

/** Der einzige fremde Rahmen, den die Sicherheitsrichtlinie mit Schalter erlaubt. */
export const VIDEO_RAHMEN_HOST = 'https://www.youtube-nocookie.com';
