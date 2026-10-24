/**
 * Alle Mailvorlagen. Jede Vorlage ist eine reine Funktion → `{ betreff, html, text }`
 * und baut auf `baueMail` (../html.ts) auf. Eine neue Vorlage — etwa die
 * Vertragsbestätigung mit AGB und Widerrufsbelehrung — kommt als eigene Datei
 * hinzu und wird hier exportiert.
 */
export { betriebNeuerVorgang } from './betrieb-neuer-vorgang';
export { kundeEingang } from './kunde-eingang';
export { istStatusMitMail, statusMail, STATUS_MIT_MAIL, type StatusMitMail } from './status';
export { testmail } from './testmail';
export { widerrufEingang } from './widerruf-eingang';
export { betriebBezahlt, kundeBezahlt, kundeErstattet, kundeNichtAbgeschlossen } from './zahlung';
export type { VorlagenKontext } from './gemeinsam';
