import type { TutorialOrt } from '@/lib/types';

/* ==========================================================================
   Wo ein Tutorial erscheinen kann (FA-INHALT-01)
   Mehrfachauswahl „erscheint auf“ im Admin. Den Baustein auf den Seiten und in
   den Anfragewegen bindet Teil B ein (TutorialHinweis); er fragt mit diesen
   Schlüsseln nach den zugeordneten, veröffentlichten Tutorials.
   ========================================================================== */

export const TUTORIAL_ORTE: ReadonlyArray<{ value: TutorialOrt; label: string; pfad: string }> = [
  { value: 'schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage: Seite', pfad: '/schluessel-nach-vorlage' },
  { value: 'schluessel-nach-vorlage-fotos', label: 'Schlüssel nach Vorlage: Anfrage, Schritt Fotos', pfad: '/schluessel-nach-vorlage/anfrage' },
  { value: 'autoschluessel-fotos', label: 'Autoschlüssel-Anfrage: Schritt Schlüsselfotos', pfad: '/autoschluessel/anfrage' },
  { value: 'autoschluessel-fahrzeugschein', label: 'Autoschlüssel-Anfrage: Schritt Fahrzeugschein', pfad: '/autoschluessel/anfrage' },
  { value: 'schluessel-nach-code', label: 'Schlüssel nach Code', pfad: '/schluessel-nach-code' },
  { value: 'schluessel-einschicken', label: 'Schlüssel einschicken', pfad: '/schluessel-einschicken' },
  { value: 'gleichschliessende-zylinder', label: 'Gleichschließende Zylinder: Seite', pfad: '/gleichschliessende-zylinder' },
  { value: 'gleichschliessende-zylinder-messen', label: 'Gleichschließende Zylinder: Maße', pfad: '/gleichschliessende-zylinder/konfigurator' },
  {
    value: 'gleichschliessende-zylinder-funktion',
    label: 'Gleichschließende Zylinder: Funktion (Not- und Gefahrenfunktion)',
    pfad: '/gleichschliessende-zylinder/konfigurator',
  },
  { value: 'schliessanlagen', label: 'Schließanlagen', pfad: '/schliessanlagen' },
  { value: 'autoschluessel-gehaeuse', label: 'Autoschlüssel-Gehäuse', pfad: '/autoschluessel/gehaeuse' },
];

export const TUTORIAL_ORT_WERTE: readonly TutorialOrt[] = TUTORIAL_ORTE.map((ort) => ort.value);

export function istTutorialOrt(wert: unknown): wert is TutorialOrt {
  return typeof wert === 'string' && (TUTORIAL_ORT_WERTE as readonly string[]).includes(wert);
}
