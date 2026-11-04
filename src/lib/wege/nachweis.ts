/*
 * Berechtigungsnachweis in jedem Schlüsselweg (R13, E6-OPUS-01, E-102). Die Regeln stehen im
 * Rubriken-Modell (`nachweis`) und in unterlagen-pflicht.ts; hier steht, wann ein Weg sie verlangt:
 *
 * - Schlüssel nach Code: Ein Pflichtfoto der Codelinie ist der Nachweis der Rubrik, die
 *   Sicherungskarte eines geschützten Profils (heute ZY-02). Codelinien mit freiwilligem Foto
 *   bleiben, wie sie sind; die Kasse prüft das Pflichtfoto jetzt auch auf dem Server.
 * - Schlüssel nach Foto: Gehört der Schlüssel zu einer Anlage mit Sicherungskarte („ja“), ist ein
 *   Foto der Karte Pflicht. „Nein“ und „weiß ich nicht“ halten die Anfrage nicht auf; die Werkstatt
 *   prüft vor der Fertigung (die Antwort steht im Vorgang).
 *
 * Reine Funktionen ohne Seiteneffekte, im Browser und auf dem Server nutzbar.
 */

import type { CodeLine, UploadRef } from '@/lib/types';

/** Antwort auf die Frage nach der Sicherungskarte in der Foto-Anfrage. */
export type KartenAntwort = '' | 'ja' | 'nein' | 'unklar';

export const KARTEN_ANTWORTEN: ReadonlyArray<{ wert: Exclude<KartenAntwort, ''>; titel: string; satz: string }> = [
  { wert: 'ja', titel: 'Ja, ich habe die Karte', satz: 'Sie laden gleich ein Foto der Karte hoch.' },
  { wert: 'nein', titel: 'Nein, es gibt keine Karte', satz: 'Das ist bei den meisten Haus- und Wohnungsschlüsseln so.' },
  { wert: 'unklar', titel: 'Weiß ich nicht', satz: 'Wir prüfen das anhand Ihrer Fotos und melden uns.' },
];

export const KARTEN_LABEL: Record<Exclude<KartenAntwort, ''>, string> = {
  ja: 'vorhanden, Foto liegt bei',
  nein: 'keine',
  unklar: 'unklar, bitte prüfen',
};

/** Kategorie des Fotos einer Codelinie: Pflichtfoto ist die Sicherungskarte, sonst ein Schlüsselfoto. */
export function codeFotoKategorie(line: Pick<CodeLine, 'photoUpload'>): Extract<UploadRef['category'], 'schluesselfoto' | 'sicherungskarte'> {
  return line.photoUpload === 'pflicht' ? 'sicherungskarte' : 'schluesselfoto';
}

/** Verlangt die Codelinie die Sicherungskarte als Nachweis? */
export function codeVerlangtKarte(line: Pick<CodeLine, 'photoUpload'>): boolean {
  return codeFotoKategorie(line) === 'sicherungskarte';
}

/** Verlangt die Foto-Anfrage die Sicherungskarte? Nur bei der Antwort „ja“. */
export function fotoAnfrageVerlangtKarte(payload: Record<string, unknown>): boolean {
  return payload.sicherungskarte === 'ja';
}

/** Gültige Antwort aus dem payload, sonst leer (ältere Anfragen kennen die Frage nicht). */
export function kartenAntwort(wert: unknown): KartenAntwort {
  return wert === 'ja' || wert === 'nein' || wert === 'unklar' ? wert : '';
}

/**
 * Anfragen aus Rubrik-Wegen ohne eigene Vorgangsart (E6): Die Quelle im payload bestimmt die Rubrik,
 * deren Nachweis und Pflicht-Uploads der Server verlangt (R13). Die Regeln selbst stehen in den
 * Rubrikdaten (G-11); hier steht nur, welcher Weg zu welcher Rubrik gehört.
 */
export const QUELLE_RUBRIK: Readonly<Record<string, string>> = {
  motorrad: 'motorradschluessel',
  gehaeuse: 'autoschluessel-gehaeuse',
};
