/*
 * Partner im Auftragsweg: Abbildung eines Partnerbetriebs, passende Partner und Terminstandorte
 * (FA-KERN-03, FA-PLATTFORM-01B, FA-PLATTFORM-01C, A-070). Nur für den Server und für Tests.
 *
 * Eigene Datei, getrennt von `src/lib/auftragsweg.ts`: Jene Datei laden auch Bausteine im Browser
 * (Assistent, Preisanzeige, Bestätigung) für Texte und den Zahlungsplan. Stünde die Partnerlogik dort,
 * hinge die Abdeckungsregel samt Prüfliste und Vermittlung am Skript-Bündel der Kundenseiten. Die Abnahme
 * von FA-PLATTFORM-01C hat genau das gemessen (rund 20 KB mehr im Bündel des Assistenten). `auftragsweg.ts`
 * importiert diese Datei nicht; ein Test hält das fest.
 *
 * Reine Funktionen, nur relative Importe (wird von Hooks und Sammlungen geladen).
 */

import { AUFTRAGSART_AUTOSCHLUESSEL, imEigenbereich, type StandortAngebot, type StandortErmittlung } from './auftragsweg';
import type { BewerbungStatus } from './partner/bewerbung';
import { auftragsartFuerLeistung } from './partner/leistungen';
import { plzMusterAusText } from './partner/postleitzahl-muster';
import type { PrueflistePunkt } from './partner/pruefliste';
import { abdeckungsGruende, regionGeprueftAus, type AbdeckungsAuskunft, type RegionEintrag } from './partner/region';
import type { Auftragsweg, OwnArea } from './types';

/* ---------- Partner ----------------------------------------------------- */

/** Was die Ermittlung von einem Partnerbetrieb braucht. Der Name bleibt außen vor. */
export interface PartnerFuerWeg {
  id: string;
  status: BewerbungStatus;
  /** Einsatzgebiet: Postleitzahlen oder Muster wie `355*`. */
  postleitzahlen: string[];
  auftragsarten: string[];
  /**
   * Abrechnungsmodell des Partnerbetriebs. Im Partnerweg zahlt der Kunde an Schlüsselmacher24 (A-049 Nr. 8),
   * deshalb zählen nur Betriebe mit Modell `B`; Modell `A` (Kunde zahlt an den Partner) passt nicht dazu.
   */
  abrechnungsmodell: 'A' | 'B';
  /** Postleitzahl des Betriebssitzes, Mittelpunkt des Umkreises (FA-PLATTFORM-01C). */
  plz?: string | null;
  /** Umkreis in km; zählt nur mit Auskunft aus dem Ortsstamm. */
  radiusKm?: number | null;
  /** Orte und Landkreise mit amtlichem Schlüssel; zählen nur mit Auskunft aus dem Ortsstamm. */
  regionen?: readonly RegionEintrag[] | null;
  /** Punkt „Region und Radius“ der Prüfliste erledigt; nur dann zählen Umkreis und Regionen (A-070). */
  regionGeprueft?: boolean | null;
}

/** Was aus einem gespeicherten Partnerbetrieb für Weg und Abdeckung zählt. Name und Kontakt bleiben außen vor. */
export interface PartnerbetriebFuerWeg {
  id: number | string;
  status: string;
  plz?: string | null;
  einsatzgebiet?: {
    postleitzahlen?: string | null;
    radiusKm?: number | null;
    regionen?: ReadonlyArray<{ art?: string | null; name?: string | null; schluessel?: string | null }> | null;
  } | null;
  auftragsarten?: readonly string[] | null;
  abrechnungsmodell?: string | null;
  /** Prüfliste; für die Abdeckung zählt nur der Punkt „Region und Radius“. */
  pruefliste?: { region?: PrueflistePunkt | null } | null;
}

/**
 * Gespeicherter Partnerbetrieb → `PartnerFuerWeg`. Ohne Angabe gilt Abrechnungsmodell A wie im Standard der
 * Sammlung; im Partnerweg zählt nur Modell B (A-049 Nr. 8).
 */
export function partnerFuerWegAusBetrieb(doc: PartnerbetriebFuerWeg): PartnerFuerWeg {
  return {
    id: String(doc.id),
    status: doc.status as BewerbungStatus,
    postleitzahlen: plzMusterAusText(doc.einsatzgebiet?.postleitzahlen),
    auftragsarten: [...(doc.auftragsarten ?? [])],
    abrechnungsmodell: doc.abrechnungsmodell === 'B' ? 'B' : 'A',
    plz: doc.plz ?? null,
    radiusKm: typeof doc.einsatzgebiet?.radiusKm === 'number' ? doc.einsatzgebiet.radiusKm : null,
    regionen: (doc.einsatzgebiet?.regionen ?? []).map((r) => ({ art: r.art ?? null, name: r.name ?? null, schluessel: r.schluessel ?? null })),
    regionGeprueft: regionGeprueftAus(doc.pruefliste),
  };
}

/**
 * Partner, die diesen Auftrag bekommen dürfen: Abrechnungsmodell B und Abdeckung nach der einen Definition
 * (`abdeckungsGruende`, src/lib/partner/region.ts): freigeschaltet (also nicht pausiert, gesperrt, beendet oder
 * in Prüfung), passende Auftragsart, Postleitzahl im Einsatzgebiet, mit Auskunft aus dem Ortsstamm und
 * erledigtem Punkt „Region und Radius“ auch im Umkreis oder in einer eingetragenen Region. Bei mehreren entscheidet das Team im Admin (A-049); hier gibt es
 * keine Rangfolge. Am Zahlweg ändert die Abdeckung nichts (`zahlungsPlan`).
 */
export function passendePartner(
  postleitzahl: string,
  partner: readonly PartnerFuerWeg[],
  auftragsart: string = AUFTRAGSART_AUTOSCHLUESSEL,
  auskunft?: AbdeckungsAuskunft,
): PartnerFuerWeg[] {
  return partner.filter((p) => p.abrechnungsmodell === 'B' && abdeckungsGruende(postleitzahl, auftragsart, p, auskunft).length > 0);
}

/* ---------- Terminstandorte --------------------------------------------- */

export interface StandortEingabe {
  postleitzahl: string;
  land?: string;
  /**
   * Leistung (Kennung aus `carKeyServices`). Sie bestimmt die Auftragsart (`auftragsartFuerLeistung`,
   * FA-PLATTFORM-01B): eine der neun Leistungen, wenn eindeutig, sonst der Sammelwert.
   */
  leistung?: string;
  eigenbereich?: OwnArea;
  partner: readonly PartnerFuerWeg[];
  /** Schalter `PARTNERMODELL_B` (siehe `partnerwegAktiv`). */
  partnerwegAktiv: boolean;
  /** Auskunft aus dem Ortsstamm für Umkreis und Region (nur auf dem Server); ohne sie zählen nur die Postleitzahlen. */
  abdeckung?: AbdeckungsAuskunft;
}

/**
 * Mögliche Terminstandorte und der Weg je Standort.
 * - Die Werkstatt in Wetzlar steht jedem offen (der Kunde reist an).
 * - Im Eigenbereich heißt derselbe Werkstatttermin `eigenbereich` (der Bestand kennt keinen eigenen
 *   regionalen Terminort; der Terminablauf bleibt, nur der Weg wird gespeichert).
 * - Der Partnerbetrieb erscheint nur mit Schalter und nur bei einem freigeschalteten Partner mit
 *   passender Auftragsart für diese Postleitzahl.
 */
export function terminstandorte(eingabe: StandortEingabe): StandortErmittlung {
  const deutschland = !eingabe.land || eingabe.land === 'Deutschland';
  const plz = eingabe.postleitzahl.trim();
  const eigen = imEigenbereich(plz, eingabe.land, eingabe.eigenbereich);
  const werkstattWeg: Auftragsweg = eigen ? 'eigenbereich' : 'hauptzentrale';
  const standorte: StandortAngebot[] = [{ standort: 'werkstatt', weg: werkstattWeg }];
  if (!eingabe.partnerwegAktiv || !deutschland || eigen || !/^\d{5}$/.test(plz)) {
    return { standorte, werkstattWeg, ohnePartner: false, passendePartnerIds: [] };
  }
  const passend = passendePartner(plz, eingabe.partner, auftragsartFuerLeistung(eingabe.leistung), eingabe.abdeckung);
  if (passend.length) standorte.push({ standort: 'partner', weg: 'partner' });
  return { standorte, werkstattWeg, ohnePartner: passend.length === 0, passendePartnerIds: passend.map((p) => p.id) };
}
