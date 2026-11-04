/*
 * „Termin neu buchen“ nach einer nicht eingegangenen Anzahlung (E6-OPUS-04, E-120): Der Assistent startet
 * mit dem Fahrzeug des alten Termins (nur Werte, die er selbst gegen die Fahrzeugdaten prüft: ?marke=,
 * ?modell=, ?vorhanden=), und der neue Vorgang verweist auf den alten (?vorher=). Den Verweis übernimmt der
 * Server nur, wenn der alte Termin storniert ist und zur selben E-Mail-Adresse gehört.
 *
 * Reine Funktionen, nur relative Importe: Die Mailvorlagen nutzen sie auch.
 */

import type { BusinessRecord } from '../types';

export const NEU_BUCHEN_PFAD = '/autoschluessel/anfrage';

/** Form einer Vorgangsnummer, etwa „SM24-T-2026-0042“. */
export const VORGANGSNUMMER_MUSTER = /^SM24-[A-Z]-\d{4}-\d{4,6}$/;

const SLUG = /^[a-z0-9-]{1,80}$/;

type AlterTermin = Pick<BusinessRecord, 'kind' | 'reference'> & { payload?: Record<string, unknown> };

/** Pfad zum Assistenten, vorbelegt mit dem Fahrzeug des alten Termins und dessen Nummer. */
export function neuBuchenHref(vorgang: AlterTermin): string {
  if (vorgang.kind !== 'termin') return NEU_BUCHEN_PFAD;
  const angaben = vorgang.payload ?? {};
  const parameter = new URLSearchParams();
  if (typeof angaben.makeSlug === 'string' && SLUG.test(angaben.makeSlug)) {
    parameter.set('marke', angaben.makeSlug);
    if (typeof angaben.modelSlug === 'string' && SLUG.test(angaben.modelSlug)) parameter.set('modell', angaben.modelSlug);
  }
  const vorhanden = angaben.workingKeys;
  if (typeof vorhanden === 'number' && Number.isSafeInteger(vorhanden) && vorhanden >= 0 && vorhanden <= 9) {
    parameter.set('vorhanden', String(vorhanden));
  }
  if (VORGANGSNUMMER_MUSTER.test(vorgang.reference)) parameter.set('vorher', vorgang.reference);
  const suche = parameter.toString();
  return suche ? `${NEU_BUCHEN_PFAD}?${suche}` : NEU_BUCHEN_PFAD;
}

/** Vorgangsnummer aus der Adresse, nur in der erwarteten Form. */
export function vorherAusAdresse(wert: string | undefined): string | undefined {
  const nummer = wert?.trim().toUpperCase();
  return nummer && VORGANGSNUMMER_MUSTER.test(nummer) ? nummer : undefined;
}

/** Darf der neue Termin auf den alten verweisen? Nur ein stornierter Termin derselben E-Mail-Adresse. */
export function folgeterminErlaubt(alt: Pick<BusinessRecord, 'kind' | 'status' | 'contact'> | null, email: string): boolean {
  return Boolean(alt && alt.kind === 'termin' && alt.status === 'storniert' && alt.contact.email.trim().toLowerCase() === email.trim().toLowerCase());
}
