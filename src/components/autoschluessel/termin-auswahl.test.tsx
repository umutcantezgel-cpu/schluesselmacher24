import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { TimeSlot } from '@/lib/types';
import { TerminAuswahl, type TerminAuswahlProps } from './termin-auswahl';

const frei = (date: string, time: string, available = true): TimeSlot => ({
  date,
  time,
  durationMinutes: 60,
  available,
});

/* Am 05.10. ist nichts frei und darf deshalb keinen Tagesknopf bekommen. */
const tage: TerminAuswahlProps['days'] = [
  { date: '2026-10-05', slots: [frei('2026-10-05', '08:00', false)] },
  {
    date: '2026-10-06',
    slots: [frei('2026-10-06', '09:00'), frei('2026-10-06', '10:00'), frei('2026-10-06', '11:00', false)],
  },
  { date: '2026-10-07', slots: [frei('2026-10-07', '13:00')] },
];

const basis: TerminAuswahlProps = {
  days: tage,
  loading: false,
  error: null,
  leadTimeDays: 7,
  slotMinutes: 60,
  requiresVehicleOnSite: false,
  selectedDate: '',
  selectedTime: '',
  onSelect: () => {},
};

function rendern(props: Partial<TerminAuswahlProps> = {}): string {
  return renderToStaticMarkup(<TerminAuswahl {...basis} {...props} />);
}

describe('TerminAuswahl als Tagesleiste', () => {
  it('zeigt nur Tage mit freien Zeiten als Tagesknöpfe mit Anzahl', () => {
    const html = rendern();
    expect(html).toContain('aria-label="Tag wählen"');
    expect(html).toContain('2 frei');
    expect(html).toContain('1 frei');
    expect(html).toContain('06. Okt.');
    expect(html).not.toContain('05. Okt.');
    expect(html).not.toContain('0 frei');
  });

  it('wählt ohne Angabe den ersten Tag mit freien Zeiten vor und zeigt nur dessen Uhrzeiten', () => {
    const html = rendern();
    const vorgewaehlt = html.indexOf('aria-pressed="true"');
    expect(vorgewaehlt).toBeGreaterThan(-1);
    expect(html.indexOf('2 frei')).toBeGreaterThan(vorgewaehlt);
    expect(html).toContain('09:00 Uhr');
    expect(html).toContain('10:00 Uhr');
    expect(html).not.toContain('13:00 Uhr');
    expect(html).not.toContain('11:00 Uhr');
  });

  it('folgt dem bereits gewählten Termin, auch an einem anderen Tag', () => {
    const html = rendern({ selectedDate: '2026-10-07', selectedTime: '13:00' });
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(2);
    expect(html).toContain('13:00 Uhr');
    expect(html).not.toContain('09:00 Uhr');
  });

  it('beschriftet jede Uhrzeit mit Zeit und Dauer', () => {
    const html = rendern();
    expect(html).toContain('aria-label="Uhrzeit wählen"');
    expect(html).toContain('Dauer');
    expect(html).toContain('1 Std.');
  });

  it('zeigt im Ladezustand keine Tagesleiste', () => {
    const html = rendern({ loading: true });
    expect(html).toContain('Freie Termine werden geladen');
    expect(html).not.toContain('aria-label="Tag wählen"');
  });

  it('zeigt bei veralteter Auswahl den Hinweis', () => {
    const html = rendern({ staleSelection: true });
    expect(html).toContain('Bitte Termin erneut wählen');
  });

  it('nennt die Werkstatt als Ort und Außeneinsätze nur nach Prüfung', () => {
    const werkstatt = { label: 'Werkstatt und Abholung', street: 'Langgasse 70', postalCode: '35576', city: 'Wetzlar' };
    const html = rendern({ werkstatt });
    expect(html).toContain('Termin in unserer Werkstatt: Langgasse 70, 35576 Wetzlar');
    expect(html).toContain('nur nach individueller Prüfung möglich');
    expect(html).not.toContain('stimmen wir');
  });

  it('bittet bei Leistungen am Fahrzeug, das Fahrzeug in die Werkstatt mitzubringen', () => {
    const werkstatt = { label: 'Werkstatt und Abholung', street: 'Langgasse 70', postalCode: '35576', city: 'Wetzlar' };
    const html = rendern({ werkstatt, requiresVehicleOnSite: true });
    expect(html).toContain('Bitte bringen Sie Ihr Fahrzeug mit');
    expect(html).toContain('in unserer Werkstatt statt, mit Fahrzeug: Werkstatt und Abholung, Langgasse 70, 35576 Wetzlar.');
    expect(html).not.toContain('Vor-Ort-Termin');
  });
});
