import 'server-only';

import { cache } from 'react';

import type { Nachweise } from '@/payload-types';
import { payloadInstanz } from './payload-adapter';

/**
 * Nachweise (Zertifikate, Fachkunde, Versicherungen, Mitgliedschaften) für
 * die öffentliche Seite.
 *
 * Öffentlich ist nur, was im Backend den Status „Liegt vor“ UND den Haken
 * „Auf der Seite zeigen“ hat und nicht im Papierkorb liegt. Ein Nachweis,
 * dessen Gültigkeit abgelaufen ist, erscheint ebenfalls nicht — auch wenn
 * der Status noch nicht umgestellt wurde. Aussagen auf der Seite brauchen
 * einen gültigen Nachweis.
 */

export type NachweisArt = Nachweise['art'];

export interface Nachweis {
  id: string;
  titel: string;
  art: NachweisArt;
  /** Bezeichnung der Art für Kunden, z. B. „Zertifikat“. */
  artLabel: string;
  aussteller?: string;
  /** Letzter gültiger Tag als ISO-Datum (JJJJ-MM-TT, deutsche Zeit). */
  gueltigBis?: string;
}

/** Wie im Backend beschriftet. `Record` sorgt dafür, dass keine Art fehlt. */
const ART_LABEL: Record<NachweisArt, string> = {
  zertifikat: 'Zertifikat',
  norm: 'Fachkunde nach Norm',
  schulung: 'Schulung',
  versicherung: 'Versicherung',
  mitgliedschaft: 'Mitgliedschaft',
};

const BERLIN = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Kalendertag in deutscher Zeit. Datumsfelder speichert Payload als
 * Zeitstempel; ohne Umrechnung könnte ein Nachweis einen Tag zu früh oder
 * zu spät auslaufen.
 */
function kalendertag(datum: Date): string {
  const teile = Object.fromEntries(BERLIN.formatToParts(datum).map((t) => [t.type, t.value]));
  return `${teile.year}-${teile.month}-${teile.day}`;
}

function zuNachweis(doc: Pick<Nachweise, 'id' | 'titel' | 'art' | 'aussteller' | 'gueltigBis'>): Nachweis {
  const nachweis: Nachweis = {
    id: String(doc.id),
    titel: doc.titel,
    art: doc.art,
    artLabel: ART_LABEL[doc.art] ?? doc.art,
  };
  const aussteller = doc.aussteller?.trim();
  if (aussteller) nachweis.aussteller = aussteller;
  if (doc.gueltigBis) {
    const datum = new Date(doc.gueltigBis);
    if (!Number.isNaN(datum.getTime())) nachweis.gueltigBis = kalendertag(datum);
  }
  return nachweis;
}

/** Öffentliche, gültige Nachweise — je Anfrage höchstens einmal gelesen. */
export const getNachweise = cache(async (): Promise<Nachweis[]> => {
  // Ohne Datenbank (Notbetrieb mit JSON-Dateien) gibt es keine Nachweise.
  if (process.env.SM24_DATA === 'json') return [];

  const payload = await payloadInstanz();
  const result = await payload.find({
    collection: 'nachweise',
    where: {
      and: [{ status: { equals: 'liegt-vor' } }, { oeffentlich: { equals: true } }],
    },
    // Nur Felder, die öffentlich gezeigt werden — Beschreibung und Fotos
    // sind interne Unterlagen.
    select: { titel: true, art: true, aussteller: true, gueltigBis: true },
    sort: 'titel',
    depth: 0,
    pagination: false,
    limit: 0,
    trash: false,
    overrideAccess: true,
  });

  const heute = kalendertag(new Date());
  return result.docs
    .map((doc) => zuNachweis(doc as Pick<Nachweise, 'id' | 'titel' | 'art' | 'aussteller' | 'gueltigBis'>))
    .filter((n) => !n.gueltigBis || n.gueltigBis >= heute);
});
