import { enthaeltPlatzhalter, istPlatzhalter } from '../platzhalter';
import type { CompanyLocation, CompanyProfile } from '../types';

/* ==========================================================================
   Firmendaten für Rechtstexte und Pflichtangaben
   Ein Ort für die Frage, welche Angabe öffentlich erscheinen darf. Solange
   die Firmendaten als Platzhalter markiert sind, erscheint nichts davon —
   auch kein „[Platzhalter …]“. Die Steuernummer gibt es hier bewusst nicht:
   Sie ist intern und wird nie veröffentlicht.
   Nur relative Importe: Mailvorlagen und Backend-Endpunkte (Payload) laden
   diese Datei ebenfalls.
   ========================================================================== */

/** Ein gepflegter Wert — oder `undefined` für leer und Platzhalter. */
export function angabe(wert: string | null | undefined): string | undefined {
  if (istPlatzhalter(wert) || enthaeltPlatzhalter(wert)) return undefined;
  return wert!.trim();
}

/** Dürfen die Firmendaten veröffentlicht werden? */
export function firmaVeroeffentlichbar(company: CompanyProfile): boolean {
  return !company.isPlaceholder;
}

/** Bezeichnung des Unternehmens für Fließtexte („SCHLÜSSELMACHER24 – Inhaber Mina Saad“). */
export function firmenname(company: CompanyProfile): string {
  return (firmaVeroeffentlichbar(company) && angabe(company.legalName)) || company.brandName;
}

/** Inhaberin oder Inhaber bei Einzelunternehmen und e. K., sonst die Vertretung. */
export function inhaberZeile(company: CompanyProfile): string | undefined {
  if (!firmaVeroeffentlichbar(company)) return undefined;
  if (company.legalForm === 'einzelunternehmen' || company.legalForm === 'eingetragener-kaufmann') {
    const inhaber = angabe(company.owner) ?? angabe(company.managingDirector);
    return inhaber ? `Inhaber: ${inhaber}` : undefined;
  }
  const vertretung = angabe(company.managingDirector);
  return vertretung ? `Vertreten durch: ${vertretung}` : undefined;
}

/** Anschrift des Firmensitzes als Zeilen (ohne Firmenname). */
export function sitzZeilen(company: CompanyProfile): string[] {
  if (!firmaVeroeffentlichbar(company)) return [];
  const strasse = angabe(company.street);
  const ort = [angabe(company.postalCode), angabe(company.city)].filter(Boolean).join(' ');
  return [strasse, ort || undefined, angabe(company.country)].filter((z): z is string => Boolean(z));
}

/**
 * Firmenname, Inhaber und Anschrift — die Anbieterkennung in Zeilen. Die
 * Inhaberzeile entfällt, wenn der Name schon in der Firmierung steht
 * („SCHLÜSSELMACHER24 – Inhaber Mina Saad“).
 */
export function anbieterZeilen(company: CompanyProfile): string[] {
  const name = firmenname(company);
  const inhaber = inhaberZeile(company);
  const person = inhaber?.replace(/^[^:]+:\s*/, '');
  const doppelt = person ? name.includes(person) : false;
  return [name, ...(inhaber && !doppelt ? [inhaber] : []), ...sitzZeilen(company)];
}

/** Anbieter in einer Zeile, z. B. für den Widerrufsadressaten. */
export function anbieterEinzeilig(company: CompanyProfile): string {
  const sitz = sitzZeilen(company).filter((z) => z !== angabe(company.country));
  return [firmenname(company), ...sitz].join(', ');
}

export interface Kontakt {
  telefon?: string;
  email?: string;
}

/** Telefon und E-Mail, soweit veröffentlicht und gepflegt. */
export function kontakt(company: CompanyProfile): Kontakt {
  if (!firmaVeroeffentlichbar(company)) return {};
  const ergebnis: Kontakt = {};
  const telefon = angabe(company.phone);
  const email = angabe(company.email);
  if (telefon) ergebnis.telefon = telefon;
  if (email && email.includes('@')) ergebnis.email = email;
  return ergebnis;
}

/** Werkstatt bzw. Abholort, wenn gepflegt und vom Firmensitz verschieden. */
export function standort(company: CompanyProfile): CompanyLocation | undefined {
  if (!firmaVeroeffentlichbar(company) || !company.location) return undefined;
  const { label, street, postalCode, city } = company.location;
  if (!angabe(street) || !angabe(postalCode) || !angabe(city)) return undefined;
  const gleicherOrt = street.trim() === company.street.trim() && postalCode.trim() === company.postalCode.trim();
  if (gleicherOrt) return undefined;
  return { label: angabe(label) ?? 'Werkstatt und Abholung', street: street.trim(), postalCode: postalCode.trim(), city: city.trim() };
}

/** Umsatzsteuer-Identifikationsnummer, nur wenn gepflegt. */
export function ustId(company: CompanyProfile): string | undefined {
  return firmaVeroeffentlichbar(company) ? angabe(company.vatId) : undefined;
}

/** Registereintrag nur mit Registergericht und -nummer. */
export function registereintrag(company: CompanyProfile): { gericht: string; nummer: string } | undefined {
  if (!firmaVeroeffentlichbar(company)) return undefined;
  const gericht = angabe(company.registerCourt);
  const nummer = angabe(company.registerNumber);
  return gericht && nummer ? { gericht, nummer } : undefined;
}

/**
 * Verantwortlich nach § 18 Abs. 2 MStV: die gepflegte Angabe, sonst
 * Inhaber (bzw. Vertretung) mit der Anschrift des Firmensitzes.
 */
export function inhaltlichVerantwortlich(company: CompanyProfile): string[] {
  if (!firmaVeroeffentlichbar(company)) return [];
  const gepflegt = angabe(company.contentResponsible);
  if (gepflegt) return gepflegt.split(/\s*[,\n]\s*/).filter(Boolean);
  const person = angabe(company.owner) ?? angabe(company.managingDirector);
  if (!person) return [];
  const sitz = sitzZeilen(company).filter((z) => z !== angabe(company.country));
  return [person, ...sitz];
}
