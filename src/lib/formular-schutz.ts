/*
 * Bot-Schutz der öffentlichen Formulare — gemeinsame Angaben für Browser und
 * Server, ohne Server-Abhängigkeiten. Prüfung: src/lib/server/formular-schutz.ts.
 */

/** Name des versteckten Honigtopf-Felds. Menschen sehen es nicht und lassen es leer. */
export const HONIGTOPF_FELD = 'website';

/** Name des Felds mit dem signierten Startzeitpunkt (Formulare mit FormData). */
export const START_FELD = 'formularStart';

/** Was jedes geschützte Formular beim Absenden mitschickt. */
export interface FormularSchutz {
  /** Signierter Zeitpunkt, zu dem das Formular geöffnet wurde (`formularStarten`). */
  start?: string;
  /** Inhalt des Honigtopf-Felds — bei Menschen leer. */
  [HONIGTOPF_FELD]?: string;
}

/** Mindestdauer zwischen Öffnen und Absenden. */
export const MINDESTDAUER_MS = 4_000;

/** Höchstalter des Startzeitpunkts. */
export const HOECHSTALTER_MS = 24 * 60 * 60 * 1000;

/**
 * Antwort, wenn der Startzeitpunkt fehlt, ungültig, zu jung oder zu alt ist.
 * Das kann auch Menschen treffen (Netz weg, neuer Schlüssel nach einer
 * Auslieferung) — deshalb sichtbar und wiederholbar, nie still.
 */
export const SCHUTZ_ERNEUERT = 'Bitte senden Sie das Formular noch einmal ab – die Sitzung wurde erneuert.';

/** Kennung in der Antwort der Aktionen: Der Browser holt dann einen neuen Startzeitpunkt. */
export interface SchutzAntwort {
  schutzNeu?: boolean;
}
