import 'server-only';

import { getSettings } from '@/lib/data';
import { payloadInstanz } from '@/lib/data/payload-adapter';
import { partnerFuerWegAusBetrieb } from '@/lib/auftragsweg';
import type { PartnerFuerRegion } from '@/lib/partner/region';
import type { CityPage } from '@/lib/types';
import { mitDatenbank } from '@/lib/umgebung';

import { abdeckungsAuskunft } from './abdeckung';
import { postleitzahlAuskunft, type PostleitzahlAuskunft } from './abfrage';
import { ortsstammIndexLesen } from './dateien';
import { entfernungZwischenPostleitzahlen } from './entfernung';
import type { OrtsstammIndex } from './index-stamm';
import { gemeindenMitPartner, ortsseitenMitLage, ortsseitenOhneStamm } from './ortsseiten';

/*
 * Ortsstamm auf dem Server (FA-PLATTFORM-03, A-051 Nr. 7). Liest content/orte/ einmal je Prozess und hält den
 * Index im Speicher. Der Stamm wird nie als Ganzes an den Browser geliefert: Dieses Modul ist server-only, und
 * src/lib/orte/grenze.test.ts prüft, dass keine Client-Datei es oder die Dateien importiert.
 */

/**
 * Index über Gemeinden, Kreise, Postleitzahlen und Prioritätsliste. Ein Zwischenspeicher je Prozess, geteilt mit
 * den Hooks der Sammlungen (`ortsstammIndexLesen` in dateien.ts, FA-PLATTFORM-01C).
 */
export function ortsstamm(): Promise<OrtsstammIndex> {
  return ortsstammIndexLesen();
}

/**
 * Freigeschaltete Partnerbetriebe nur mit Stand, Einsatzgebiet (Postleitzahlen-Muster, Umkreis, Orte und
 * Landkreise), Postleitzahl des Betriebs und Auftragsarten, nie Name oder Kontakt. Ohne Datenbank (JSON-Modus)
 * gibt es keine Partner.
 */
async function partnerFuerAbdeckung(): Promise<PartnerFuerRegion[]> {
  if (!mitDatenbank()) return [];
  try {
    const payload = await payloadInstanz();
    const gefunden = await payload.find({
      collection: 'partnerbetriebe',
      where: { status: { equals: 'freigeschaltet' } },
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: true,
      select: { status: true, plz: true, einsatzgebiet: true, auftragsarten: true },
    });
    // Dieselbe Abbildung wie im Partnerweg; das Abrechnungsmodell zählt für die Abdeckung nicht.
    return gefunden.docs.map((doc) => {
      const { id, status, postleitzahlen, auftragsarten, plz, radiusKm, regionen } = partnerFuerWegAusBetrieb(doc);
      return { id, status, postleitzahlen, auftragsarten, plz, radiusKm, regionen };
    });
  } catch (fehler) {
    console.error('[orte] Partnerbetriebe nicht lesbar', fehler);
    return [];
  }
}

/**
 * Postleitzahl-Abfrage für Assistent und Partnerzuordnung: Ort, Kreis, Land, Eigenbereich, Partner vorhanden.
 * Null, wenn die Eingabe keine fünfstellige Postleitzahl ist.
 */
export async function postleitzahlAbfragen(plz: string, leistung?: string): Promise<PostleitzahlAuskunft | null> {
  const [stamm, settings, partner] = await Promise.all([ortsstamm(), getSettings(), partnerFuerAbdeckung()]);
  // Umkreis und Region rechnen mit dem Stamm (postleitzahlAuskunft baut die Auskunft daraus).
  return postleitzahlAuskunft(plz, stamm, { eigenbereich: settings.booking.ownArea, partner, leistung });
}

/** Luftlinie zwischen den Mittelpunkten zweier Postleitzahlen in km (0,1 km genau), null wenn eine fehlt. */
export async function entfernungKm(plzA: string, plzB: string): Promise<number | null> {
  return entfernungZwischenPostleitzahlen(plzA, plzB, await ortsstamm());
}

/**
 * Veröffentlichte Ortsseiten mit Lage am Stamm (FA-PLATTFORM-03B): Gemeinde, Kreis, Postleitzahlen, Werkstatt im Ort
 * oder Kreis, Partner deckt ab, Gründe gegen die Indexierung; geordnet nach Priorität. Ist der Stamm nicht lesbar,
 * bleiben die Seiten erreichbar, aber noindex (Grund steht in der Lage).
 */
export async function ortsseitenAnreichern(cities: readonly CityPage[]): Promise<CityPage[]> {
  if (cities.length === 0) return [];
  try {
    const [stamm, settings, partner] = await Promise.all([ortsstamm(), getSettings(), partnerFuerAbdeckung()]);
    const werkstattPlz = settings.company.location?.postalCode || settings.company.postalCode;
    return ortsseitenMitLage(cities, { stamm, werkstattPlz, partner });
  } catch (fehler) {
    console.error('[orte] Ortsstamm für die Ortsseiten nicht lesbar', fehler);
    return ortsseitenOhneStamm(cities);
  }
}

/** Gemeinden (aus der Liste), die ein freigeschalteter Partner für Autoschlüssel abdeckt. Für die Ansicht „Prioritätsorte“. */
export async function gemeindenMitPartnerAbfragen(schluessel: readonly string[]): Promise<Set<string>> {
  const [stamm, partner] = await Promise.all([ortsstamm(), partnerFuerAbdeckung()]);
  return gemeindenMitPartner(stamm, schluessel, partner, abdeckungsAuskunft(stamm));
}
