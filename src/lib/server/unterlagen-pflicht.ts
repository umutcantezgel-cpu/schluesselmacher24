import type { UploadRef } from '@/lib/types';

/* ==========================================================================
   Pflichtunterlagen beim Autoschlüssel-Termin (Leitfaden Kap. 05, Schritt 9)
   Der Assistent prüft im Browser (unterlagen-pruefung.ts); der Server prüft
   hier noch einmal, damit kein Termin ohne Fahrzeugschein entsteht.
   - Zulassungsbescheinigung Teil I: immer Pflicht, auch bei Totalverlust.
   - Schlüsselfotos: hier nicht geprüft — bei Totalverlust gibt es nichts zu
     fotografieren, sie bleiben dann freiwillig.
   Mit eingerichteter Dateiablage zählt nur eine hochgeladene Datei (Kennung
   und Einmal-Schlüssel); ohne Ablage (Entwicklung, Notbetrieb) genügt die
   Angabe, welche Datei der Kunde ausgewählt hat.
   ========================================================================== */

export const FAHRZEUGSCHEIN_FEHLT =
  'Bitte laden Sie im Schritt „Zulassungsbescheinigung Teil I“ ein Foto oder eine Datei Ihres Fahrzeugscheins hoch.';

export const FAHRZEUGSCHEIN_NICHT_HOCHGELADEN =
  'Ihr Fahrzeugschein ist noch nicht vollständig hochgeladen. Bitte laden Sie die Datei im Schritt '
  + '„Zulassungsbescheinigung Teil I“ erneut hoch.';

type UploadAngabe = Pick<UploadRef, 'category' | 'storageKey' | 'uploadToken'>;

/** Fehlermeldung, wenn der Fahrzeugschein fehlt — sonst `null`. */
export function fahrzeugscheinPruefen(uploads: readonly UploadAngabe[], ablageEingerichtet: boolean): string | null {
  const scheine = uploads.filter((upload) => upload.category === 'fahrzeugschein');
  if (scheine.length === 0) return FAHRZEUGSCHEIN_FEHLT;
  if (!ablageEingerichtet) return null;
  return scheine.some((upload) => upload.storageKey && upload.uploadToken) ? null : FAHRZEUGSCHEIN_NICHT_HOCHGELADEN;
}
