import type { Rubrik, RubrikNachweis, UploadRef } from '@/lib/types';

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

/* ==========================================================================
   Nachweise und Pflichtunterlagen je Rubrik (R13, E3-OPUS-09)
   Jede Rubrik nennt im Rubriken-Modell ihren Berechtigungsnachweis und ihre
   Pflicht-Uploads. Neue Wege (Motorrad, Gehäuse, Transponder-Kopie) prüfen
   hier serverseitig; der Autoschlüssel-Weg nutzt weiter fahrzeugscheinPruefen
   mit unverändertem Verhalten. Kein Weg schwächt einen Nachweis.
   ========================================================================== */

export const SICHERUNGSKARTE_FEHLT =
  'Bitte laden Sie ein Foto Ihrer Sicherungskarte hoch. Ohne Karte fertigen wir Schlüssel mit geschütztem Profil nicht an.';

const NAME: Record<UploadRef['category'], string> = {
  schluesselfoto: 'ein Foto Ihres Schlüssels',
  fahrzeugschein: 'Ihren Fahrzeugschein',
  grundriss: 'einen Grundriss',
  dokument: 'das Dokument',
  objektfoto: 'ein Foto des Objekts',
  sicherungskarte: 'ein Foto Ihrer Sicherungskarte',
  vollmacht: 'die Vollmacht',
};

function hochgeladen(uploads: readonly UploadAngabe[], kategorie: UploadRef['category'], ablageEingerichtet: boolean): boolean {
  const passend = uploads.filter((upload) => upload.category === kategorie);
  if (!passend.length) return false;
  return !ablageEingerichtet || passend.some((upload) => upload.storageKey && upload.uploadToken);
}

/**
 * Berechtigungsnachweis nach R13 — Fehlermeldung oder `null`. Bei Schlüsseln nach Code gilt die
 * Sicherungskarte nur für geschützte Profile: Der Weg ruft die Prüfung je Codelinie mit
 * Kennzeichen „geschützt“ auf (E6), nie für alle Codes, damit der Bestand gleich bleibt.
 */
export function nachweisPruefen(nachweis: RubrikNachweis, uploads: readonly UploadAngabe[], ablageEingerichtet: boolean): string | null {
  if (nachweis === 'fahrzeugschein') return fahrzeugscheinPruefen(uploads, ablageEingerichtet);
  if (nachweis === 'sicherungskarte') return hochgeladen(uploads, 'sicherungskarte', ablageEingerichtet) ? null : SICHERUNGSKARTE_FEHLT;
  return null;
}

/** Pflicht-Uploads einer Rubrik — erste fehlende Unterlage als Meldung, sonst `null`. */
export function pflichtUploadsPruefen(pflicht: readonly UploadRef['category'][], uploads: readonly UploadAngabe[], ablageEingerichtet: boolean): string | null {
  const fehlt = pflicht.find((kategorie) => !hochgeladen(uploads, kategorie, ablageEingerichtet));
  return fehlt ? `Bitte laden Sie ${NAME[fehlt]} hoch.` : null;
}

/** Alles, was eine Rubrik verlangt: erst der Nachweis, dann die Pflicht-Uploads. */
export function rubrikUnterlagenPruefen(
  rubrik: Pick<Rubrik, 'nachweis' | 'pflichtUploads'>,
  uploads: readonly UploadAngabe[],
  ablageEingerichtet: boolean,
): string | null {
  return (
    nachweisPruefen(rubrik.nachweis, uploads, ablageEingerichtet)
    ?? pflichtUploadsPruefen(rubrik.pflichtUploads as UploadRef['category'][], uploads, ablageEingerichtet)
  );
}
