/* ==========================================================================
   Anschrift für die Einsendung des Originalschlüssels (Foto-Freigabe)
   Die Werkstatt (`standort`), sonst der Firmensitz — nur mit echten
   Firmendaten, nie mit Platzhaltern. Die Firmendaten importieren mit
   `@/`-Pfaden: Backend-Hooks laden dieses Modul deshalb erst bei Bedarf.
   ========================================================================== */

import { angabe, firmaVeroeffentlichbar, firmenname, sitzZeilen, standort } from '../rechtliches/firma';
import type { CompanyProfile } from '../types';

/** Zeilen der Anschrift, Firmenname zuerst; leer ohne veröffentlichbare Firmendaten. */
export function einsendeAnschrift(company: CompanyProfile | undefined): string[] {
  if (!company || !firmaVeroeffentlichbar(company)) return [];
  const land = angabe(company.country);
  const werkstatt = standort(company);
  if (werkstatt) {
    return [firmenname(company), werkstatt.street, `${werkstatt.postalCode} ${werkstatt.city}`, ...(land ? [land] : [])];
  }
  const sitz = sitzZeilen(company);
  // Ohne Straße und Ort taugt die Angabe nicht als Versandanschrift.
  return sitz.filter((zeile) => zeile !== land).length >= 2 ? [firmenname(company), ...sitz] : [];
}
