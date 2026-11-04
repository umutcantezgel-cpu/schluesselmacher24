/*
 * Begleitschein zu einem Vorgang (G-24, E6-OPUS-02): für Einsendungen und für Foto-Anfragen, deren
 * Freigabe das Original verlangt. Empfänger ist die Werkstatt aus den Firmendaten (nie Platzhalter),
 * Absender die Anschrift aus dem Vorgang. Nur auf dem Server (PDF).
 *
 * Anbieter: Begleitschein, in Tests und Probeläufen die Attrappe (VERSAND_PROVIDER=attrappe, G5).
 * Ein echtes Retourenlabel (dhl-retoure) erzeugt dieser Weg nicht: Jeder Abruf schüfe ein neues Label,
 * und gespeichert wird es noch nicht. Das Label folgt mit dem Versandvertrag (MA-08, A-035); bis dahin
 * bekommt der Kunde den Begleitschein und frankiert selbst, „kostenlos“ steht nirgends (R9).
 */

import { angabe, firmaVeroeffentlichbar, firmenname, standort } from '@/lib/rechtliches/firma';
import type { BusinessRecord, CompanyProfile, EinsendeEinstellungen } from '@/lib/types';
import { einsendeAngebot, erstelleVersandschein, type Anschrift, type Sendung, type Versandschein } from '@/lib/versand';

import { inhaltText, istEinsendung, type EinsendePayload } from './vorgang';

type Umgebung = Record<string, string | undefined>;

/** Anschrift der Werkstatt (Standort, sonst Sitz); ohne veröffentlichbare Firmendaten keine. */
export function werkstattAnschrift(company: CompanyProfile | undefined): Anschrift | null {
  if (!company || !firmaVeroeffentlichbar(company)) return null;
  const ort = standort(company);
  const strasse = ort?.street ?? angabe(company.street);
  const plz = ort?.postalCode ?? angabe(company.postalCode);
  const stadt = ort?.city ?? angabe(company.city);
  if (!strasse || !plz || !stadt) return null;
  return { name: firmenname(company), strasse, plz, ort: stadt, land: angabe(company.country) };
}

type Vorgang = Pick<BusinessRecord, 'reference' | 'kind' | 'area' | 'contact' | 'approval'> & { payload?: Record<string, unknown> };

/** Braucht der Vorgang einen Begleitschein? Einsendung oder Freigabe mit Einsendung des Originals. */
export function brauchtBegleitschein(vorgang: Vorgang): boolean {
  return istEinsendung(vorgang) || vorgang.approval?.sendInRequired === true;
}

/**
 * Zeigt die Vorgangsseite den Begleitschein? Bei einer Einsendung bis zum Eingang des Schlüssels
 * (Status „neu“), bei einer Foto-Anfrage, wenn die Freigabe das Original verlangt.
 */
export function begleitscheinAnzeigen(vorgang: Vorgang & Pick<BusinessRecord, 'status'>): boolean {
  if (istEinsendung(vorgang)) return vorgang.status === 'neu';
  return vorgang.approval?.sendInRequired === true && (vorgang.status === 'freigegeben' || vorgang.status === 'in-fertigung');
}

/** Sendung aus dem Vorgang; null ohne Werkstattanschrift oder ohne Rücksendeanschrift. */
export function sendungAusVorgang(vorgang: Vorgang, company: CompanyProfile | undefined): Sendung | null {
  const empfaenger = werkstattAnschrift(company);
  const c = vorgang.contact;
  if (!empfaenger || !c.street?.trim() || !c.postalCode?.trim() || !c.city?.trim()) return null;
  const einsendung = istEinsendung(vorgang) ? (vorgang.payload as unknown as EinsendePayload) : null;
  return {
    vorgangsnummer: vorgang.reference,
    art: einsendung?.versand === 'unversichert' ? 'unversichert' : 'versichert',
    absender: {
      name: [c.firstName, c.lastName].filter(Boolean).join(' '),
      ...(c.company ? { zusatz: c.company } : {}),
      strasse: c.street.trim(),
      plz: c.postalCode.trim(),
      ort: c.city.trim(),
      land: c.country,
    },
    empfaenger,
    inhalt: einsendung ? inhaltText(einsendung) : 'Originalschlüssel zur Anfertigung',
  };
}

/** Ohne Label-Anbieter: Attrappe bleibt Attrappe, alles andere wird Begleitschein. */
function ohneLabel(env: Umgebung): Umgebung {
  return env.VERSAND_PROVIDER?.trim() === 'attrappe' ? env : { ...env, VERSAND_PROVIDER: 'begleitschein' };
}

/** Begleitschein als PDF; null, wenn der Vorgang keinen braucht oder Anschriften fehlen. */
export async function begleitscheinZumVorgang(
  vorgang: Vorgang,
  { company, einstellungen, env = process.env }: { company: CompanyProfile | undefined; einstellungen: EinsendeEinstellungen; env?: Umgebung },
): Promise<Versandschein | null> {
  if (!brauchtBegleitschein(vorgang)) return null;
  const sendung = sendungAusVorgang(vorgang, company);
  if (!sendung) return null;
  return erstelleVersandschein(sendung, { einstellungen, env: ohneLabel(env) });
}

/**
 * Was die Seiten zum Einschicken über Versand und Porto sagen. Solange dieser Weg kein echtes Label
 * erzeugt (A-035), gilt immer der Begleitschein: Der Kunde frankiert selbst, „kostenlos“ steht nirgends
 * (R9), auch wenn der Schalter „Retourenlabel aktiv“ schon an ist.
 */
export function einsendeAngebotFuerWeg(einstellungen: EinsendeEinstellungen) {
  return einsendeAngebot(einstellungen, false);
}
