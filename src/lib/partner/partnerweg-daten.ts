import 'server-only';

import { partnerFuerWegAusBetrieb, partnerwegAktiv, terminstandorte, type PartnerFuerWeg, type StandortErmittlung } from '@/lib/auftragsweg';
import { getSettings } from '@/lib/data';
import { payloadInstanz } from '@/lib/data/payload-adapter';
import { abdeckungsAuskunft } from '@/lib/orte/abdeckung';
import { ortsstamm } from '@/lib/orte/stamm';
import { mitDatenbank } from '@/lib/umgebung';

import { brauchtOrtsstamm, type AbdeckungsAuskunft } from './region';

/*
 * Partnerbetriebe für die Ermittlung des Auftragswegs (FA-KERN-03). Nur Stand, Einsatzgebiet (Postleitzahlen,
 * Umkreis, Orte und Landkreise), Postleitzahl des Betriebs, Punkt „Region und Radius“ der Prüfliste, Auftragsarten
 * und Abrechnungsmodell, nie Name oder Kontakt: Vor der Buchung erfährt der Kunde keinen Partnernamen.
 * Ohne Schalter `PARTNERMODELL_B=aktiv` und ohne Datenbank (JSON-Modus) gibt es keine Partner; dann
 * bleibt es beim Werkstatttermin wie bisher.
 *
 * Abdeckung (FA-PLATTFORM-01C, A-070): dieselbe Definition und dieselbe Abbildung (`partnerFuerWegAusBetrieb`) wie
 * die Vorschlagsliste am Vorgang; der Ortsstamm liefert die Auskunft für Umkreis und Region. Am Zahlweg ändert
 * das nichts (`zahlungsPlan`).
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
      select: { status: true, plz: true, einsatzgebiet: true, auftragsarten: true, abrechnungsmodell: true, pruefliste: { region: true } },
    });
    return gefunden.docs.map(partnerFuerWegAusBetrieb);
  } catch (fehler) {
    // Ohne Partnerliste bleibt der Werkstatttermin; der Kunde wird nie in einen Weg ohne Partner geschickt.
    console.error('[auftragsweg] Partnerbetriebe nicht lesbar', fehler);
    return [];
  }
}

/**
 * Auskunft aus dem Ortsstamm, nur wenn ein Betrieb einen geprüften Umkreis oder eine geprüfte Region hat. Ist der
 * Stamm nicht lesbar, zählen nur die Postleitzahlen (wie vor FA-PLATTFORM-01C).
 */
async function auskunftFuer(partner: readonly PartnerFuerWeg[]): Promise<AbdeckungsAuskunft | undefined> {
  if (!brauchtOrtsstamm(partner)) return undefined;
  try {
    return abdeckungsAuskunft(await ortsstamm());
  } catch (fehler) {
    console.error('[auftragsweg] Ortsstamm für den Partnerweg nicht lesbar', fehler);
    return undefined;
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
    abdeckung: await auskunftFuer(partner),
  });
}
