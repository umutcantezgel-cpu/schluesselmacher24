/**
 * Alle Mailvorlagen. Jede Vorlage ist eine reine Funktion → `{ betreff, html, text }`
 * und baut auf `baueMail` (../html.ts) auf. Eine neue Vorlage kommt als eigene
 * Datei hinzu und wird hier exportiert. Backend-Hooks importieren die Dateien
 * einzeln; die Vertragsbestätigung (mit den Rechtstexten) nur bei Bedarf.
 */
export { betriebNeuerVorgang } from './betrieb-neuer-vorgang';
export { betriebWarnung } from './betrieb-warnung';
export { kundeEingang } from './kunde-eingang';
export { istStatusMitMail, statusMail, STATUS_MIT_MAIL, type StatusMitMail } from './status';
export { testmail } from './testmail';
export { rechtsBausteine, vertragsbestaetigung } from './vertragsbestaetigung';
export { betriebWiderrufEingang, widerrufEingang } from './widerruf-eingang';
export { betriebBezahlt, kundeBezahlt, kundeErstattet, kundeNichtAbgeschlossen } from './zahlung';
export type { VorlagenKontext } from './gemeinsam';
