import 'server-only';

import { partnerwegAktiv, plzMusterAusText, terminstandorte, type PartnerFuerWeg, type StandortErmittlung } from '@/lib/auftragsweg';
import { getSettings } from '@/lib/data';
import { payloadInstanz } from '@/lib/data/payload-adapter';
import { mitDatenbank } from '@/lib/umgebung';

import type { BewerbungStatus } from './bewerbung';

/*
 * Partnerbetriebe für die Ermittlung des Auftragswegs (FA-KERN-03). Nur Stand, Einsatzgebiet und
 * Auftragsarten, nie Name oder Kontakt: Vor der Buchung erfährt der Kunde keinen Partnernamen.
 * Ohne Schalter `PARTNERMODELL_B=aktiv` und ohne Datenbank (JSON-Modus) gibt es keine Partner; dann
 * bleibt es beim Werkstatttermin wie bisher.
 */
export async function partnerFuerAuftragsweg(): Promise<PartnerFuerWeg[]> {
  if (!partnerwegAktiv() || !mitDatenbank()) return [];
  try {
    const payload = await payloadInstanz();
    const gefunden = await payload.find({
      collection: 'partnerbetriebe',
      where: { status: { equals: 'freigeschaltet' } },
      depth: 0,
      limit: 500,
      overrideAccess: true,
      select: { status: true, einsatzgebiet: true, auftragsarten: true, abrechnungsmodell: true },
    });
    return gefunden.docs.map((doc) => ({
      id: String(doc.id),
      status: doc.status as BewerbungStatus,
      postleitzahlen: plzMusterAusText(doc.einsatzgebiet?.postleitzahlen),
      auftragsarten: [...(doc.auftragsarten ?? [])],
      abrechnungsmodell: doc.abrechnungsmodell === 'B' ? 'B' : 'A',
    }));
  } catch (fehler) {
    // Ohne Partnerliste bleibt der Werkstatttermin; der Kunde wird nie in einen Weg ohne Partner geschickt.
    console.error('[auftragsweg] Partnerbetriebe nicht lesbar', fehler);
    return [];
  }
}

/** Terminstandorte für eine Postleitzahl, mit Eigenbereich aus den Einstellungen und Partnern aus der Datenbank. */
export async function standorteErmitteln(eingabe: { postleitzahl: string; land?: string; leistung?: string }): Promise<StandortErmittlung> {
  const [settings, partner] = await Promise.all([getSettings(), partnerFuerAuftragsweg()]);
  return terminstandorte({
    ...eingabe,
    eigenbereich: settings.booking.ownArea,
    partner,
    partnerwegAktiv: partnerwegAktiv(),
  });
}
