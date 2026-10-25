import { KEY_PHOTO_SLOTS } from '@/components/autoschluessel/optionen';

/* ==========================================================================
   Prüfung der Unterlagen-Schritte im Autoschlüssel-Assistenten
   Ohne Browser-Logik, damit sich die Regeln einzeln testen lassen.
   ========================================================================== */

export type UploadSlotId = 'vorderseite' | 'rueckseite' | 'bart' | 'detail' | 'fahrzeugschein';

/** Ausgewählte Dateien je Upload-Feld — gezählt wird nur die Anzahl. */
export type DateienJeFeld = Record<UploadSlotId, readonly unknown[]>;

/**
 * Ohne funktionierenden Schlüssel (Totalverlust) gibt es oft nichts mehr zu
 * fotografieren. Die Schlüsselfotos sind dann freiwillig; ein noch
 * vorhandener, defekter Schlüssel darf trotzdem fotografiert werden.
 */
export function schluesselfotosFreiwillig(workingKeys: number | null): boolean {
  return workingKeys === 0;
}

/**
 * Ob einer der beiden Unterlagen-Schritte erfüllt ist. Schlüsselfotos:
 * alle Pflichtaufnahmen aus `KEY_PHOTO_SLOTS`, außer bei Totalverlust.
 * Fahrzeugschein und Bestätigung der Berechtigung bleiben immer Pflicht.
 */
export function unterlagenSchrittErfuellt(
  schritt: 'schluesselfotos' | 'fahrzeugschein',
  angaben: { workingKeys: number | null; entitlementConfirmed: boolean },
  dateien: DateienJeFeld,
): boolean {
  if (schritt === 'fahrzeugschein') {
    return dateien.fahrzeugschein.length > 0 && angaben.entitlementConfirmed;
  }
  if (schluesselfotosFreiwillig(angaben.workingKeys)) return true;
  return KEY_PHOTO_SLOTS.filter((slot) => slot.required).every((slot) => dateien[slot.id].length > 0);
}
