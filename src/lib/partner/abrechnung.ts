/*
 * Abrechnung der Vermittlung (G-40) als reine Funktionen.
 * Modell A (aktiv, Leitfaden): Der Partner rechnet selbst mit dem Kunden ab; SCHLÜSSELMACHER24
 * stellt ihm die Provision in Rechnung.
 * Modell B (gebaut, aus): Der Kunde zahlt an SCHLÜSSELMACHER24; der Partner bekommt nach
 * Auftragsende den Betrag abzüglich Provision. Erst nach Klärung durch Anwalt und Steuerberatung
 * und dem Befehl PARTNERMODELL: B (MA-09). Provisionen pflegt nur der Inhaber; ohne Wert wird
 * nichts berechnet (G13: keine Werte im Repository).
 */

export type Abrechnungsmodell = 'A' | 'B';

export interface Provision {
  /** Prozent vom Auftragswert (brutto), etwa 10 für 10 %. */
  prozent?: number;
  /** Fester Betrag in Cent je Auftrag. */
  festCents?: number;
}

export type Abrechnung =
  | { modell: 'A'; provisionCents: number; rechnungAnPartnerCents: number }
  | { modell: 'B'; provisionCents: number; einbehaltCents: number; auszahlungAnPartnerCents: number }
  | { fehlt: string };

/** Provision in Cent, kaufmännisch gerundet; fester Betrag und Prozent addieren sich. */
export function provisionCents(auftragswertCents: number, provision: Provision): number {
  const prozent = provision.prozent && provision.prozent > 0 ? Math.round((auftragswertCents * provision.prozent) / 100) : 0;
  const fest = provision.festCents && provision.festCents > 0 ? Math.round(provision.festCents) : 0;
  return Math.min(auftragswertCents, prozent + fest);
}

export function abrechnen({
  modell,
  auftragswertCents,
  provision,
  modellBFreigegeben = false,
}: {
  modell: Abrechnungsmodell;
  auftragswertCents: number;
  provision: Provision | undefined;
  /** Schalter nach PARTNERMODELL: B; ohne ihn gibt es keine Abrechnung nach B. */
  modellBFreigegeben?: boolean;
}): Abrechnung {
  if (!Number.isInteger(auftragswertCents) || auftragswertCents < 0) return { fehlt: 'Auftragswert in Cent fehlt.' };
  if (!provision || (!(provision.prozent && provision.prozent > 0) && !(provision.festCents && provision.festCents > 0))) {
    return { fehlt: 'Für diese Auftragsart ist keine Provision hinterlegt.' };
  }
  const p = provisionCents(auftragswertCents, provision);
  if (modell === 'A') return { modell: 'A', provisionCents: p, rechnungAnPartnerCents: p };
  if (!modellBFreigegeben) return { fehlt: 'Modell B ist ausgeschaltet (PARTNERMODELL: B fehlt).' };
  return { modell: 'B', provisionCents: p, einbehaltCents: p, auszahlungAnPartnerCents: auftragswertCents - p };
}
