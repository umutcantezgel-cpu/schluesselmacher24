import { APIError, type CollectionBeforeChangeHook } from 'payload';

import { adressePruefen } from './seiten-adresse-pruefung';

export { ADRESSE_MELDUNG, RESERVIERTE_NAMEN, VORHANDENE_ROUTEN, adressePruefen, eigeneSeiteAdresse } from './seiten-adresse-pruefung';

/* ==========================================================================
   Neue Inhaltsseiten mit eigener Adresse (FA-KERN-05, FA-22-33).

   Der Betreiber legt in „Seitentexte“ eine neue Seite an. Sie erscheint über
   die Auffangroute `src/app/(site)/[...unbekannt]` unter `/<adresse>`.
   - Adresse: genau ein Abschnitt aus Kleinbuchstaben, Ziffern und einzelnen
     Bindestrichen, 3 bis 60 Zeichen. Keine vorhandene Route der Website,
     kein reservierter Name. Feste Seiten liegen unter ihren eigenen Routen;
     ihre Texte bleiben dort.
   - Nach dem Anlegen bleibt die Adresse fest (wie bisher schreibgeschützt).
   - Standardmäßig `noindex`, bis der Betreiber es im Bereich Suchmaschinen
     ändert.
   Bewusst ohne Importe aus `@/`: Die Sammlung lädt diese Datei auch in
   `payload migrate`. Die Prüfung selbst steht in `seiten-adresse-pruefung.ts`.
   ========================================================================== */

/**
 * Beim Anlegen durch das Backend: Adresse prüfen und `noindex` setzen, bis der Betreiber es ändert. Ohne
 * Benutzer (Seed, Übernahmen) bleibt alles wie bisher; die festen Seiten legt der Seed an.
 */
export const neueSeiteVorAenderung: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation !== 'create' || !req.user) return data;
  const fehler = adressePruefen(data.route);
  if (fehler) throw new APIError(fehler, 400);
  data.route = String(data.route).trim();
  const seo = (data.seo ?? {}) as Record<string, unknown>;
  if (typeof seo.noindex !== 'boolean' || seo.noindex === false) {
    // Ein frisch angelegtes Formular schickt `false` als Standardwert mit; neu heißt zunächst immer noindex.
    data.seo = { ...seo, noindex: true };
  }
  return data;
};
