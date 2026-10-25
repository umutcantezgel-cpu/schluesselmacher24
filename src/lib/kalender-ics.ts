/* ==========================================================================
   Kalendereintrag als iCalendar-Datei (.ics, RFC 5545)
   Für den Anhang der Termin-Erinnerung. Zeiten in UTC (`…Z`) — so braucht
   die Datei keinen eigenen Zeitzonenblock und jeder Kalender zeigt die
   richtige Ortszeit. Zeilenende CRLF, Zeilen nach 75 Byte gefaltet.
   Reine Funktionen, nur relative Importe (Mailvorlagen).
   ========================================================================== */

export interface KalenderTermin {
  /** Dauerhafte Kennung: Ein erneuter Eintrag mit derselben Kennung ersetzt den alten. */
  uid: string;
  beginn: Date;
  ende: Date;
  titel: string;
  ort?: string;
  beschreibung?: string;
  url?: string;
  /** Erstellt am (DTSTAMP). */
  erstellt: Date;
}

/** „20261027T090000Z“. */
export function icsZeit(zeitpunkt: Date): string {
  return zeitpunkt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

/** Text für Eigenschaften: Backslash, Semikolon, Komma und Zeilenumbruch maskieren. */
export function icsText(wert: string): string {
  return wert
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

const UTF8 = new TextEncoder();

/** Faltet eine Zeile nach höchstens 75 Byte, ohne ein UTF-8-Zeichen zu teilen. */
export function falten(zeile: string): string {
  const teile: string[] = [];
  let aktuell = '';
  let bytes = 0;
  for (const zeichen of zeile) {
    const laenge = UTF8.encode(zeichen).length;
    // Folgezeilen beginnen mit einem Leerzeichen, das mitzählt.
    const grenze = teile.length === 0 ? 75 : 74;
    if (bytes + laenge > grenze) {
      teile.push(aktuell);
      aktuell = '';
      bytes = 0;
    }
    aktuell += zeichen;
    bytes += laenge;
  }
  teile.push(aktuell);
  return teile.join('\r\n ');
}

/** Die ganze Datei als Text (UTF-8). */
export function icsDatei(termin: KalenderTermin): string {
  const zeilen = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SCHLUESSELMACHER24//Termin-Erinnerung//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${icsText(termin.uid)}`,
    `DTSTAMP:${icsZeit(termin.erstellt)}`,
    `DTSTART:${icsZeit(termin.beginn)}`,
    `DTEND:${icsZeit(termin.ende)}`,
    `SUMMARY:${icsText(termin.titel)}`,
    ...(termin.ort ? [`LOCATION:${icsText(termin.ort)}`] : []),
    ...(termin.beschreibung ? [`DESCRIPTION:${icsText(termin.beschreibung)}`] : []),
    ...(termin.url ? [`URL:${termin.url}`] : []),
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${zeilen.map(falten).join('\r\n')}\r\n`;
}
