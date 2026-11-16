/*
 * Auskunft aus dem Ortsstamm für die Abdeckung der Partner (FA-PLATTFORM-01C): Entfernung zwischen zwei
 * Postleitzahlen (Umkreis) und Gemeinden und Kreise einer Postleitzahl (Orte und Landkreise). Die Definition der
 * Abdeckung steht in src/lib/partner/region.ts; hier stehen nur die Daten dazu.
 *
 * Reine Funktion über einem geladenen Index, nur relative Importe. Auf dem Server liefert stamm.ts den Index
 * (`ortsstamm()`), in den Hooks `ortsstammIndexLesen()` aus dateien.ts.
 */

import type { AbdeckungsAuskunft, PostleitzahlGebiet } from '../partner/region';

import { entfernungZwischenPostleitzahlen } from './entfernung';
import type { OrtsstammIndex } from './index-stamm';

/**
 * Auskunft für `deckendePartner` und `passendePartner`. Eine Postleitzahl, die der Stamm nicht kennt
 * (Großempfänger, Postfach), hat weder Entfernung noch Gebiet: Umkreis und Region treffen dann nicht.
 * Zu den Kreisen einer Postleitzahl zählen die Kreise aus postleitzahlen.json und die Kreise ihrer Gemeinden.
 */
export function abdeckungsAuskunft(stamm: Pick<OrtsstammIndex, 'postleitzahl' | 'gemeinde'>): AbdeckungsAuskunft {
  return {
    entfernungKm: (plzA, plzB) => entfernungZwischenPostleitzahlen(plzA, plzB, stamm),
    gebiet: (plz): PostleitzahlGebiet | null => {
      const eintrag = stamm.postleitzahl(plz);
      if (!eintrag) return null;
      const kreise = new Set(eintrag.kreise);
      for (const schluessel of eintrag.gemeinden) {
        const gemeinde = stamm.gemeinde(schluessel);
        if (gemeinde) kreise.add(gemeinde.kreis);
      }
      return { gemeinden: [...eintrag.gemeinden], kreise: [...kreise] };
    },
  };
}
