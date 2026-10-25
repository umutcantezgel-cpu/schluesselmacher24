import { describe, expect, it } from 'vitest';

import { falten, icsDatei, icsText, icsZeit } from './kalender-ics';

const UTF8 = new TextEncoder();

describe('Kalendereintrag (.ics)', () => {
  const datei = icsDatei({
    uid: 'sm24-t-2026-0001@schluesselmacher24.de',
    beginn: new Date('2026-10-27T09:00:00.000Z'),
    ende: new Date('2026-10-27T10:30:00.000Z'),
    titel: 'Termin bei SCHLÜSSELMACHER24 (SM24-T-2026-0001)',
    ort: 'SCHLÜSSELMACHER24, Langgasse 70, 35576 Wetzlar',
    beschreibung: 'Vorgangsnummer: SM24-T-2026-0001\nBitte mitbringen:\n- Alle vorhandenen Schlüssel; auch defekte',
    url: 'https://schluesselmacher24.de/service-und-termin/terminstatus',
    erstellt: new Date('2026-10-26T02:17:05.123Z'),
  });

  it('hat Rahmen, Zeiten in UTC und CRLF', () => {
    expect(datei.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(datei.endsWith('END:VEVENT\r\nEND:VCALENDAR\r\n')).toBe(true);
    expect(datei).toContain('METHOD:PUBLISH\r\n');
    expect(datei).toContain('DTSTART:20261027T090000Z\r\n');
    expect(datei).toContain('DTEND:20261027T103000Z\r\n');
    expect(datei).toContain('DTSTAMP:20261026T021705Z\r\n');
    expect(datei).toContain('UID:sm24-t-2026-0001@schluesselmacher24.de\r\n');
    expect(datei.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('maskiert Kommas, Semikolons und Zeilenumbrüche', () => {
    const entfaltet = datei.replace(/\r\n /g, '');
    expect(entfaltet).toContain('LOCATION:SCHLÜSSELMACHER24\\, Langgasse 70\\, 35576 Wetzlar');
    expect(entfaltet).toContain('Bitte mitbringen:\\n- Alle vorhandenen Schlüssel\\; auch defekte');
    expect(icsText('a\\b')).toBe('a\\\\b');
  });

  it('faltet lange Zeilen nach 75 Byte, ohne Umlaute zu teilen', () => {
    for (const zeile of datei.split('\r\n')) {
      expect(UTF8.encode(zeile).length).toBeLessThanOrEqual(75);
    }
    const lang = `DESCRIPTION:${'ü'.repeat(60)}`;
    const gefaltet = falten(lang);
    expect(gefaltet.split('\r\n ').join('')).toBe(lang);
    expect(gefaltet).not.toContain('�');
  });

  it('schreibt Zeitpunkte ohne Millisekunden', () => {
    expect(icsZeit(new Date('2027-01-01T00:00:00.999Z'))).toBe('20270101T000000Z');
  });
});
