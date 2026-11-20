/* ==========================================================================
   Ersatz für `VideoRahmen` ohne Freigabe-Schalter (FA-INHALT-01B, A-076)

   Vorbereitet für einen Alias in next.config.ts (Entscheidung des Orchestrators,
   Bericht FA-INHALT-01B, Nachbesserung zu den Befunden 3 und 9): Ohne
   `SM24_VIDEOS=an` löst `@/components/tutorial/video-rahmen` auf diese Datei auf.
   Sie ist kein Client-Baustein und bringt kein Skript mit, so laden Seiten ohne
   Video kein Byte mehr. Ohne Schalter wird `VideoRahmen` ohnehin nie gerendert
   (`VideoHinweis` zeigt dann den Satz aus Teil A); der Ersatz zeigt nichts.
   ========================================================================== */

/** Nimmt dieselben Eigenschaften wie `VideoRahmen` entgegen (kennung, titel, children) und zeigt nichts. */
export function VideoRahmen(): null {
  return null;
}
