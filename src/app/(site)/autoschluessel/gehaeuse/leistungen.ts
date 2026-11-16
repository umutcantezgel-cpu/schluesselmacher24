import { variantenAus } from '@/lib/versand/varianten';
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

/** Ablauf aller drei Leistungen, so wie der Weg heute läuft (R4: nichts zusagen, was der Weg nicht tut). */
export const GEHAEUSE_ABLAUF: readonly string[] = [
  'Gehäuse-Anfrage mit Fahrzeug, drei Fotos des Schlüssels und Fahrzeugschein.',
  'Wir prüfen, ob es bei Ihrem Schlüssel geht, und melden uns mit Preis und Ablauf.',
  'Erst dann schicken Sie den Schlüssel ein. Wie, steht in unserer Rückmeldung.',
];

/**
 * Empfohlene Versandart für einen Schlüssel mit Elektronik: die erste aktive Variante, die der Betrieb
 * für Originalschlüssel empfiehlt (Startwert DHL Paket), nie ein Sonderfall. Ohne solche Variante keine.
 */
export function versandFuerElektronik(e: EinsendeEinstellungen | undefined): EinsendeVariante | null {
  return (
    variantenAus(e).find((v) => v.aktiv && !v.nurSonderfall && v.empfohlenFuer.includes('originalschluessel')) ?? null
  );
}
