import { APIError, type CollectionBeforeDeleteHook } from 'payload';

export const LOESCHSPERRE_MELDUNG =
  'Dieser Artikel steht in Bestellungen und kann nicht endgültig gelöscht werden. '
  + 'Legen Sie ihn stattdessen in den Papierkorb.';

/**
 * Verhindert das endgültige Löschen eines Artikels, der in Bestellungen
 * vorkommt. Bestellungen verweisen über die Kennung auf den Artikel — ohne
 * ihn ließen sich Nachkauf, Reklamation und Auswertung nicht mehr zuordnen.
 *
 * Der Papierkorb bleibt möglich: „In den Papierkorb“ setzt nur `deletedAt`
 * (ein Update) und löst diesen Hook nicht aus.
 */
export const loeschsperre: CollectionBeforeDeleteHook = async ({ id, req }) => {
  // `req` weiterreichen: Abfragen laufen in der Transaktion des Löschvorgangs.
  const artikel = await req.payload.findByID({
    collection: 'produkte',
    id,
    depth: 0,
    trash: true,
    overrideAccess: true,
    disableErrors: true,
    req,
  });
  if (!artikel) return;

  // Dieselbe Kennung, die der Shop in Warenkorb und Bestellung schreibt.
  const kennung = artikel.kennung || artikel.slug || String(artikel.id);

  const { totalDocs } = await req.payload.count({
    collection: 'vorgaenge',
    where: { 'positionen.kennung': { equals: kennung } },
    overrideAccess: true,
    req,
  });
  if (totalDocs > 0) {
    throw new APIError(LOESCHSPERRE_MELDUNG, 409);
  }
};
