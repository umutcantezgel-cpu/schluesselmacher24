import 'server-only';

/*
 * Meldungen für Umgebungen, die nichts speichern können: Schaufenster und
 * Vorschauen auf Vercel ohne Datenbank (speichernMoeglich in
 * src/lib/umgebung.ts). Ein späterer Versuch hilft dort nicht — deshalb ein
 * anderer Weg statt „bitte erneut versuchen“.
 */

/** Antwort auf jedes abgesendete Formular (src/lib/server/create-record.ts). */
export const OHNE_SPEICHER =
  'Das Absenden ist auf dieser Website noch nicht freigeschaltet. '
  + 'Bitte rufen Sie uns an oder schreiben Sie uns eine E-Mail.';

/** Antwort auf einen Datei-Upload (src/app/(site)/api/kunden-upload/route.ts). */
export const OHNE_SPEICHER_UPLOAD =
  'Dateien lassen sich auf dieser Website noch nicht hochladen. '
  + 'Bitte rufen Sie uns an oder schreiben Sie uns eine E-Mail.';
