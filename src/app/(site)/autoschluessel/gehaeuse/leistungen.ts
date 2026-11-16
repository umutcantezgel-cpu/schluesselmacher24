import { empfehlungFuer, variantenAus } from '@/lib/versand/varianten';
import type { EinsendeEinstellungen, EinsendeVariante } from '@/lib/types';

/* ==========================================================================
   Dienstleistungen mit Einsendung (FA-SHOP-02B, Punkt 2; FA-14-04): Gehäusetausch,
   Reparatur und Umbau. Es gibt keinen Preis des Inhabers für diese Leistungen
   (G9), und die Freigabe mit Zahlungslink gilt für Gehäuse noch nicht (A-036,
   MA-27). Darum läuft jede Leistung als Gehäuse-Anfrage: Fahrzeug, drei Fotos
   und Fahrzeugschein (R13), dann Rückmeldung mit Preis und Ablauf. Erst danach
   schickt der Kunde den Schlüssel ein. Kein zweiter Einsendeweg.
   ========================================================================== */

export type GehaeuseLeistungKennung = 'gehaeusetausch' | 'reparatur' | 'umbau';

export interface GehaeuseLeistung {
  kennung: GehaeuseLeistungKennung;
  titel: string;
  /** Was wir tun, in einem Satz. */
  satz: string;
  /** Bedingung, ohne die es nicht geht (keine falschen Versprechen). */
  bedingung: string;
}

/** Die drei Leistungen in der Benennung der Paketvorgabe. */
export const GEHAEUSE_LEISTUNGEN: readonly GehaeuseLeistung[] = [
  {
    kennung: 'gehaeusetausch',
    titel: 'Gehäusetausch im Einsendeservice',
    satz: 'Sie schicken uns Ihren Schlüssel, wir setzen Elektronik und Transponder in ein neues Gehäuse.',
    bedingung: 'Das geht nur, wenn Elektronik, Transponder, Tasten und Bart in das neue Gehäuse passen.',
  },
  {
    kennung: 'reparatur',
    titel: 'Reparatur (Tasten, Mechanik)',
    satz: 'Wir tauschen klemmende Tasten, Gummimatte oder einen ausgeschlagenen Klappmechanismus.',
    bedingung: 'Ob sich ein Teil tauschen lässt, sehen wir an Ihren Fotos und am Schlüssel.',
  },
  {
    kennung: 'umbau',
    titel: 'Umbau auf anderes Gehäuse (Customizing)',
    satz: 'Ihr Schlüssel bekommt eine andere, etwa neuere Gehäuseform.',
    bedingung: 'Nur, wenn die Technik Ihres Schlüssels passend übernommen werden kann.',
  },
];

/**
 * Der Ablauf steht einmal auf der Seite, in Abschnitt 01 aus den Rubrikdaten. Die Leistungen verweisen
 * darauf und sagen, was der Kunde in der Anfrage nennt (die Anfrage nimmt die Leistung noch nicht als
 * Angabe mit, offene Frage).
 */
export const LEISTUNGEN_ABLAUF_VERWEIS =
  'Wie es abläuft, steht oben unter 01. Schreiben Sie in der Anfrage, welche der drei Leistungen Sie wünschen. Ihren Schlüssel schicken Sie erst nach unserer Rückmeldung.';

/**
 * Empfohlene Versandart für einen Schlüssel mit Elektronik: die erste aktive Variante, die der Betrieb für
 * den Fall empfiehlt, den die Regel `empfehlungFuer` nennt (Startwert DHL Paket), nie ein Sonderfall.
 * Ohne solche Variante keine.
 */
export function versandFuerElektronik(e: EinsendeEinstellungen | undefined): EinsendeVariante | null {
  const fall = empfehlungFuer({ schluesselart: 'elektronik' });
  return fall ? variantenAus(e).find((v) => v.aktiv && !v.nurSonderfall && v.empfohlenFuer.includes(fall)) ?? null : null;
}
