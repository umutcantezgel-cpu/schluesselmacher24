/* ==========================================================================
   Ersatz für `VideoRahmen` ohne Freigabe-Schalter (FA-INHALT-01B, FA-INHALT-01C, A-076)

   Ohne `SM24_VIDEOS=an` löst der Alias in next.config.ts (`videoRahmenAlias` in
   src/lib/tutorials/freigabe.ts) den Import `@/components/tutorial/video-rahmen`
   auf diese Datei auf. Sie ist kein Client-Baustein und bringt kein Skript mit,
   so lädt ohne Schalter keine Seite Skript der Einbettung. Gerendert wird
   `VideoRahmen` ohne Schalter ohnehin nie; der Ersatz zeigt nichts. Der Alias
   gilt nur im Build und in `next dev`, nicht in vitest: Tests treffen den echten
   Baustein.
   ========================================================================== */

/** Nimmt dieselben Eigenschaften wie `VideoRahmen` entgegen (kennung, titel, children) und zeigt nichts. */
export function VideoRahmen(): null {
  return null;
}
