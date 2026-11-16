/*
 * Abdeckung durch Partnerbetriebe (FA-PLATTFORM-01B, FA-PLATTFORM-01C; FA-07-16, FA-08-13, FA-22-40): Welche
 * freigeschalteten Partner decken eine Postleitzahl für eine Leistung ab, und warum?
 *
 * Das ist die eine Definition der Abdeckung. Ein Betrieb deckt eine Postleitzahl für eine Leistung ab, wenn er
 * freigeschaltet ist (pausiert, gesperrt, beendet und alles in Prüfung fallen heraus), die Leistung führt
 * (`decktAuftragsart`) und mindestens eines gilt:
 *   (a) Postleitzahl: ein Muster des Einsatzgebiets passt (`plzPasst`);
 *   (b) Umkreis: ein Umkreis über 0 km ist eingetragen, die Postleitzahl des Betriebs und die gesuchte stehen
 *       im Ortsstamm, und die Luftlinie zwischen ihnen ist höchstens der Umkreis;
 *   (c) Region: ein eingetragener Ort (Gemeindeschlüssel, acht Ziffern) oder Landkreis (Kreisschlüssel, fünf
 *       Ziffern) ist eine Gemeinde oder ein Kreis der gesuchten Postleitzahl. Ohne passenden Schlüssel kein
 *       Treffer; Namen werden nicht verglichen (R4).
 * Regel „Region geprüft“ (A-070): (b) und (c) zählen nur, wenn am Betrieb der Punkt „Region und Radius“ der
 * Prüfliste erledigt ist (`regionGeprueft`, Haken, Datum und Prüfer). Vorgabe des Inhabers: „Nach Prüfung und
 * Vor Ort Qualitätskontrolle kann der Partner einer Region zugeordnet werden.“ Der Umkreis ist aus der Bewerbung
 * vorbelegt (Selbstangabe) und wirkt erst mit der Bestätigung des Teams. Die Muster (a) zählen immer.
 * Umkreis und Region brauchen Daten aus dem Ortsstamm. Sie kommen als Auskunft (`AbdeckungsAuskunft`) herein,
 * auf dem Server aus `abdeckungsAuskunft` (src/lib/orte/abdeckung.ts). Ohne Auskunft zählen nur die
 * Postleitzahlen-Muster, wie vor FA-PLATTFORM-01C. Eine Postleitzahl, die der Stamm nicht kennt (Großempfänger,
 * Postfach), trifft weder Umkreis noch Region; ein Muster trifft weiter.
 *
 * Aufrufer: `deckendePartner` (Abdeckung für das Team, Ortsseiten, Postleitzahl-Abfrage; Abrechnungsmodell egal)
 * und `passendePartner` in src/lib/auftragsweg-partner.ts (Partnerweg für Kunden, zusätzlich nur Modell B). Beide
 * rechnen über `abdeckungsGruende`.
 *
 * Reine Funktionen, nur relative Importe. Die Postleitzahlen-Muster kommen aus ./postleitzahl-muster.ts; einen
 * gegenseitigen Import mit src/lib/auftragsweg.ts gibt es nicht mehr.
 */

import { plzMusterAusText, plzPasst } from './postleitzahl-muster';

import type { BewerbungStatus } from './bewerbung';
import { AUFTRAGSART_OPTIONEN, auftragsartFuerLeistung } from './leistungen';
import { punktErledigt, type PrueflistePunkt } from './pruefliste';
import { darfVermitteln } from './vermittlung';

const AUFTRAGSARTEN = new Set(AUFTRAGSART_OPTIONEN.map((o) => o.value));

/** Eingetragener Ort oder Landkreis (Gruppe Einsatzgebiet, „Orte und Landkreise“). */
export interface RegionEintrag {
  art?: string | null;
  name?: string | null;
  /** Gemeindeschlüssel (acht Ziffern) bei einem Ort, Kreisschlüssel (fünf Ziffern) bei einem Landkreis. */
  schluessel?: string | null;
}

export interface PartnerFuerRegion {
  id: string;
  status: BewerbungStatus;
  /** Einsatzgebiet als Text wie im Admin („35*, 36043“) oder schon als Muster. */
  postleitzahlen: string | readonly string[] | null | undefined;
  auftragsarten: readonly string[] | null | undefined;
  /** Postleitzahl des Betriebssitzes: Mittelpunkt des Umkreises. */
  plz?: string | null;
  /** Umkreis in km (Einsatzgebiet); 0 oder leer heißt: kein Umkreis. */
  radiusKm?: number | null;
  /** Orte und Landkreise des Einsatzgebiets. */
  regionen?: readonly RegionEintrag[] | null;
  /**
   * Punkt „Region und Radius“ der Prüfliste erledigt (Haken, Datum, Prüfer; `regionGeprueftAus`). Nur dann zählen
   * Umkreis und Orte oder Landkreise; fehlt der Wert oder ist er nicht `true`, zählen nur die Postleitzahlen.
   */
  regionGeprueft?: boolean | null;
}

/** Ist der Punkt „Region und Radius“ der Prüfliste eines gespeicherten Betriebs erledigt? */
export function regionGeprueftAus(pruefliste: { region?: PrueflistePunkt | null } | null | undefined): boolean {
  return punktErledigt(pruefliste?.region);
}

/** Gemeinden und Kreise einer Postleitzahl laut Ortsstamm. */
export interface PostleitzahlGebiet {
  gemeinden: readonly string[];
  kreise: readonly string[];
}

/**
 * Auskünfte aus dem Ortsstamm, die Umkreis und Region brauchen. Beide liefern null, wenn eine Postleitzahl im
 * Stamm fehlt; dann trifft der jeweilige Grund nicht.
 */
export interface AbdeckungsAuskunft {
  /** Luftlinie zwischen den Mittelpunkten zweier Postleitzahlen in km. */
  entfernungKm(plzA: string, plzB: string): number | null;
  /** Gemeinden und Kreise einer Postleitzahl. */
  gebiet(plz: string): PostleitzahlGebiet | null;
}

/** Warum ein Betrieb eine Postleitzahl abdeckt. */
export type AbdeckungsGrund =
  | { art: 'postleitzahl'; muster: string }
  | { art: 'umkreis'; km: number; radiusKm: number; von: string }
  | { art: 'region'; ebene: 'ort' | 'landkreis'; name: string; schluessel: string };

export interface PartnerMitGrund<T> {
  partner: T;
  gruende: AbdeckungsGrund[];
}

const km = (wert: number) => wert.toLocaleString('de-DE', { maximumFractionDigits: 1 });

/** Grund als kurzer Text für die Vorschlagsliste im Admin. */
export function abdeckungsGrundText(grund: AbdeckungsGrund): string {
  if (grund.art === 'postleitzahl') return `Postleitzahl ${grund.muster}`;
  if (grund.art === 'umkreis') return `Umkreis: ${km(grund.km)} km von ${grund.von} (bis ${km(grund.radiusKm)} km)`;
  const name = grund.name.trim() || grund.schluessel;
  return `${grund.ebene === 'ort' ? 'Ort' : 'Landkreis'} ${name} (${grund.schluessel})`;
}

function musterVon(p: Pick<PartnerFuerRegion, 'postleitzahlen'>): string[] {
  return typeof p.postleitzahlen === 'string' || !p.postleitzahlen ? plzMusterAusText(p.postleitzahlen as string | null | undefined) : [...p.postleitzahlen];
}

/**
 * Gründe, aus denen der Betrieb die Postleitzahl für die Auftragsart abdeckt; leer heißt: deckt nicht ab.
 * `auftragsart` ist schon zugeordnet (eine der neun Leistungen, der Sammelwert oder ein früherer Wert).
 */
export function abdeckungsGruende(
  postleitzahl: string,
  auftragsart: string,
  p: PartnerFuerRegion,
  auskunft?: AbdeckungsAuskunft,
): AbdeckungsGrund[] {
  if (!darfVermitteln({ status: p.status, auftragsarten: [...(p.auftragsarten ?? [])] }, auftragsart)) return [];
  const plz = postleitzahl.trim();
  if (!/^\d{5}$/.test(plz)) return [];
  const gruende: AbdeckungsGrund[] = [];

  // (a) Postleitzahlen-Muster (Bestand).
  const treffer = musterVon(p).find((m) => plzPasst(plz, [m]));
  if (treffer) gruende.push({ art: 'postleitzahl', muster: treffer });
  // Umkreis und Region erst nach Prüfung durch das Team (Regel „Region geprüft“, A-070).
  if (!auskunft || p.regionGeprueft !== true) return gruende;

  // (b) Umkreis um die Postleitzahl des Betriebs.
  const radius = typeof p.radiusKm === 'number' && Number.isFinite(p.radiusKm) ? p.radiusKm : 0;
  const sitz = (p.plz ?? '').replace(/\s+/g, '');
  if (radius > 0 && /^\d{5}$/.test(sitz)) {
    const entfernung = auskunft.entfernungKm(sitz, plz);
    if (typeof entfernung === 'number' && Number.isFinite(entfernung) && entfernung <= radius) {
      gruende.push({ art: 'umkreis', km: entfernung, radiusKm: radius, von: sitz });
    }
  }

  // (c) Eingetragener Ort oder Landkreis über den amtlichen Schlüssel.
  const regionen = (p.regionen ?? []).filter((r) => r && typeof r.schluessel === 'string' && r.schluessel.trim());
  if (regionen.length) {
    const gebiet = auskunft.gebiet(plz);
    if (gebiet) {
      for (const r of regionen) {
        const schluessel = String(r.schluessel).replace(/\s+/g, '');
        const name = typeof r.name === 'string' ? r.name : '';
        if (r.art === 'ort' && /^\d{8}$/.test(schluessel) && gebiet.gemeinden.includes(schluessel)) {
          gruende.push({ art: 'region', ebene: 'ort', name, schluessel });
        } else if (r.art === 'landkreis' && /^\d{5}$/.test(schluessel) && gebiet.kreise.includes(schluessel)) {
          gruende.push({ art: 'region', ebene: 'landkreis', name, schluessel });
        }
      }
    }
  }
  return gruende;
}

/** Leistung (auch eine des Assistenten, `serviceId`) → Auftragsart der Partnerbetriebe. */
function auftragsartZu(leistung: string): string {
  return AUFTRAGSARTEN.has(leistung) ? leistung : auftragsartFuerLeistung(leistung);
}

/**
 * Freigeschaltete Partner, die die Postleitzahl für diese Leistung abdecken, je mit ihren Gründen. `leistung` ist
 * eine der neun Leistungen des Netzes, der Sammelwert, ein früherer Wert oder eine Leistung des Assistenten
 * (`serviceId`, wird zugeordnet).
 */
export function deckendePartnerMitGrund<T extends PartnerFuerRegion>(
  postleitzahl: string,
  leistung: string,
  partner: readonly T[],
  auskunft?: AbdeckungsAuskunft,
): Array<PartnerMitGrund<T>> {
  const art = auftragsartZu(leistung);
  return partner
    .map((p) => ({ partner: p, gruende: abdeckungsGruende(postleitzahl, art, p, auskunft) }))
    .filter((eintrag) => eintrag.gruende.length > 0);
}

/** Freigeschaltete Partner, die die Postleitzahl für diese Leistung abdecken (siehe `deckendePartnerMitGrund`). */
export function deckendePartner<T extends PartnerFuerRegion>(
  postleitzahl: string,
  leistung: string,
  partner: readonly T[],
  auskunft?: AbdeckungsAuskunft,
): T[] {
  return deckendePartnerMitGrund(postleitzahl, leistung, partner, auskunft).map((eintrag) => eintrag.partner);
}

/** Braucht die Abdeckung dieser Betriebe überhaupt den Ortsstamm (geprüfter Umkreis oder geprüfte Region mit Schlüssel)? */
export function brauchtOrtsstamm(partner: readonly PartnerFuerRegion[]): boolean {
  return partner.some(
    (p) =>
      p.regionGeprueft === true && ((typeof p.radiusKm === 'number' && p.radiusKm > 0 && Boolean(p.plz))
      || (p.regionen ?? []).some((r) => typeof r?.schluessel === 'string' && r.schluessel.trim() !== '')),
  );
}
