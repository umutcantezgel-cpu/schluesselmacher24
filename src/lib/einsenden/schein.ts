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
import type { BusinessRecord, CompanyProfile, EinsendeEinstellungen, EinsendeVarianteKennung } from '@/lib/types';
import { einsendeAngebot, erstelleVersandschein, type Anschrift, type Sendung, type VersandArt, type Versandschein } from '@/lib/versand';
import type { AngebotFall, EinsendeAngebot } from '@/lib/versand/angebot';
import { empfehlungFuer, istVariantenKennung } from '@/lib/versand/varianten';

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

/**
 * Versand eines Vorgangs: bei der Einsendung die Wahl aus dem Formular (ältere Vorgänge behalten
 * „versichert“ oder „unversichert“, G6); bei der Freigabe mit Einsendung die Wahl auf der Vorgangsseite,
 * sonst die Empfehlung DHL Paket (A-050, Punkt 4).
 */
export function versandDesVorgangs(vorgang: Vorgang, gewaehlt?: VersandArt): VersandArt {
  if (istEinsendung(vorgang)) {
    const art = (vorgang.payload as unknown as EinsendePayload).versand;
    return art === 'versichert' || art === 'unversichert' || istVariantenKennung(art) ? art : 'versichert';
  }
  return gewaehlt ?? 'dhl-paket';
}

/** Sendung aus dem Vorgang; null ohne Werkstattanschrift oder ohne Rücksendeanschrift. */
export function sendungAusVorgang(vorgang: Vorgang, company: CompanyProfile | undefined, gewaehlt?: VersandArt): Sendung | null {
  const empfaenger = werkstattAnschrift(company);
  const c = vorgang.contact;
  if (!empfaenger || !c.street?.trim() || !c.postalCode?.trim() || !c.city?.trim()) return null;
  const einsendung = istEinsendung(vorgang) ? (vorgang.payload as unknown as EinsendePayload) : null;
  return {
    vorgangsnummer: vorgang.reference,
    art: versandDesVorgangs(vorgang, gewaehlt),
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
/**
 * Variante für den Begleitschein einer Freigabe mit Einsendung: die Wahl des Kunden, wenn die Vorgangsseite
 * sie anbietet; sonst die Empfehlung des Angebots, sonst seine erste Variante. Nie eine, die der Betrieb
 * abgeschaltet hat; `undefined`, wenn er keine anbietet.
 */
export function versandWahl(angebot: Pick<EinsendeAngebot, 'optionen' | 'vorauswahl'>, versand: unknown): EinsendeVarianteKennung | undefined {
  const angeboten = (art: unknown): art is EinsendeVarianteKennung => istVariantenKennung(art) && angebot.optionen.some((o) => o.art === art);
  if (angeboten(versand)) return versand;
  return angeboten(angebot.vorauswahl) ? angebot.vorauswahl : angebot.optionen[0]?.art;
}

export async function begleitscheinZumVorgang(
  vorgang: Vorgang,
  {
    company,
    einstellungen,
    env = process.env,
    versand,
  }: { company: CompanyProfile | undefined; einstellungen: EinsendeEinstellungen; env?: Umgebung; versand?: unknown },
): Promise<Versandschein | null> {
  if (!brauchtBegleitschein(vorgang)) return null;
  // Freigabe mit Einsendung: nur eine Variante, die die Vorgangsseite anbietet (Sonderfall nur mit Freigabe).
  const angebot = einsendeAngebotFuerVorgang(vorgang, einstellungen);
  const wahl = versandWahl(angebot, versand);
  // Bietet der Betrieb bei einer Freigabe gar keine Variante an, entsteht kein Begleitschein.
  if (!istEinsendung(vorgang) && !wahl) return null;
  const sendung = sendungAusVorgang(vorgang, company, wahl);
  if (!sendung) return null;
  return erstelleVersandschein(sendung, { einstellungen, env: ohneLabel(env) });
}

/**
 * Was die Seiten zum Einschicken über Versand und Porto sagen. Solange dieser Weg kein echtes Label
 * erzeugt (A-035), gilt immer der Begleitschein: Der Kunde frankiert selbst, „kostenlos“ steht nirgends
 * (R9), auch wenn der Schalter „Retourenlabel aktiv“ schon an ist. Das Label folgt in FA-SHOP-03B.
 */
export function einsendeAngebotFuerWeg(einstellungen: EinsendeEinstellungen, fall: AngebotFall = {}): EinsendeAngebot {
  return einsendeAngebot(einstellungen, false, fall);
}

/**
 * Angebot für einen bestehenden Vorgang (Vorgangsseite, Begleitschein): Bei der Freigabe mit Einsendung
 * ist DHL Paket empfohlen, weil das Team das Original braucht; den Sonderfall gibt das Team frei.
 */
export function einsendeAngebotFuerVorgang(vorgang: Vorgang, einstellungen: EinsendeEinstellungen): EinsendeAngebot {
  const einsendung = istEinsendung(vorgang) ? (vorgang.payload as unknown as EinsendePayload) : null;
  return einsendeAngebotFuerWeg(einstellungen, {
    empfehlung: einsendung ? empfehlungFuer(einsendung) : 'originalschluessel',
    sonderfallFrei: vorgang.approval?.sendInSpecialAllowed === true,
  });
}
