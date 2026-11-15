import { KEY_PHOTO_SLOTS } from '@/components/autoschluessel/optionen';

/* ==========================================================================
   Prüfung der Unterlagen-Schritte im Autoschlüssel-Assistenten
   Ohne Browser-Logik, damit sich die Regeln einzeln testen lassen. Der Server
   prüft dieselbe Regel noch einmal (src/lib/server/unterlagen-pflicht.ts).
   ========================================================================== */

export type UploadSlotId = 'vorderseite' | 'rueckseite' | 'bart' | 'detail' | 'fahrzeugschein';

/** Ausgewählte Dateien je Upload-Feld — gezählt wird nur die Anzahl. */
export type DateienJeFeld = Record<UploadSlotId, readonly unknown[]>;

/**
 * Die Schlüsselfotos sind nur freiwillig, wenn der Totalverlust ausdrücklich bestätigt ist (FA-KERN-02,
 * A-048): keine funktionierenden Schlüssel und „Ich habe keinen Schlüssel mehr“. Ein noch vorhandener,
 * defekter Schlüssel zählt als vorhanden und wird fotografiert.
 */
export function schluesselfotosFreiwillig(workingKeys: number | null, keinSchluesselMehr: boolean): boolean {
  return workingKeys === 0 && keinSchluesselMehr;
}

/**
 * Ob einer der beiden Unterlagen-Schritte erfüllt ist. Schlüsselfotos:
 * alle Pflichtaufnahmen aus `KEY_PHOTO_SLOTS`, außer bei bestätigtem Totalverlust.
 * Fahrzeugschein und Bestätigung der Berechtigung bleiben immer Pflicht.
 */
export function unterlagenSchrittErfuellt(
  schritt: 'schluesselfotos' | 'fahrzeugschein',
  angaben: { workingKeys: number | null; keinSchluesselMehr: boolean; entitlementConfirmed: boolean },
  dateien: DateienJeFeld,
): boolean {
  if (schritt === 'fahrzeugschein') {
    return dateien.fahrzeugschein.length > 0 && angaben.entitlementConfirmed;
  }
  if (schluesselfotosFreiwillig(angaben.workingKeys, angaben.keinSchluesselMehr)) return true;
  return KEY_PHOTO_SLOTS.filter((slot) => slot.required).every((slot) => dateien[slot.id].length > 0);
}
