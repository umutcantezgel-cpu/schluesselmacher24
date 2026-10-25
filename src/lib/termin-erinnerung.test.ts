import { describe, expect, it } from 'vitest';

import { heuteInBerlin } from './berliner-zeit';
import { bereitsErinnert, erinnerungAuswahl, erinnerungMoeglich, erinnerungsZieltag, tagPlus } from './termin-erinnerung';
import type { BusinessRecord, MailLogEntry } from './types';

function termin(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return {
    id: '1',
    reference: 'SM24-T-2026-0001',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    status: 'neu',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '1', country: 'Deutschland' },
    payload: {},
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    appointment: { date: '2026-10-27', time: '10:00', durationMinutes: 60, location: 'werkstatt' },
    payment: { scope: 'anzahlung', amountCents: 6990, status: 'bezahlt' },
    ...teil,
  };
}

function erinnerung(at: string, result: MailLogEntry['result'] = 'gesendet'): MailLogEntry {
  return { kind: 'erinnerung', to: 'erika@example.org', at, result };
}

describe('Zieltag der Erinnerung', () => {
  it('rechnet in Kalendertagen und ist bei 0 aus', () => {
    expect(erinnerungsZieltag('2026-10-26', 1)).toBe('2026-10-27');
    expect(erinnerungsZieltag('2026-12-31', 2)).toBe('2027-01-02');
    expect(erinnerungsZieltag('2026-10-26', 0)).toBeNull();
    expect(tagPlus('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('nimmt „heute“ in deutscher Zeit: der Lauf um 23:30 UTC gehört schon zum nächsten Tag', () => {
    const heute = heuteInBerlin(new Date('2026-10-26T23:30:00Z'));
    expect(heute).toBe('2026-10-27');
    const auswahl = erinnerungAuswahl(
      [termin(), termin({ id: '2', appointment: { date: '2026-10-28', time: '09:00', durationMinutes: 60, location: 'werkstatt' } })],
      { heute, tageVorher: 1 },
    );
    expect(auswahl.faellig.map((v) => v.id)).toEqual(['2']);
  });
});

describe('Auswahl der Termine', () => {
  const heute = '2026-10-26';

  it('nur Termine mit bezahlter Anzahlung oder Status „terminiert“, nicht storniert oder abgeschlossen', () => {
    expect(erinnerungMoeglich(termin())).toBe(true);
    expect(erinnerungMoeglich(termin({ status: 'terminiert', payment: undefined }))).toBe(true);
    expect(erinnerungMoeglich(termin({ payment: { scope: 'anzahlung', amountCents: 6990, status: 'offen' } }))).toBe(false);
    expect(erinnerungMoeglich(termin({ status: 'storniert' }))).toBe(false);
    expect(erinnerungMoeglich(termin({ status: 'abgeschlossen' }))).toBe(false);
    expect(erinnerungMoeglich(termin({ kind: 'anfrage' }))).toBe(false);
    expect(erinnerungMoeglich(termin({ appointment: undefined }))).toBe(false);
  });

  it('nimmt nur den Zieltag', () => {
    const auswahl = erinnerungAuswahl(
      [
        termin({ id: 'morgen' }),
        termin({ id: 'uebermorgen', appointment: { date: '2026-10-28', time: '10:00', durationMinutes: 60, location: 'werkstatt' } }),
        termin({ id: 'heute', appointment: { date: '2026-10-26', time: '10:00', durationMinutes: 60, location: 'werkstatt' } }),
      ],
      { heute, tageVorher: 1 },
    );
    expect(auswahl.faellig.map((v) => v.id)).toEqual(['morgen']);
    expect(erinnerungAuswahl([termin()], { heute, tageVorher: 0 })).toEqual({ faellig: [], bereitsErinnert: [] });
  });

  it('erinnert nicht doppelt: eine heute gesendete Erinnerung zählt', () => {
    const erinnert = termin({ mailLog: [erinnerung('2026-10-26T02:17:30.000Z')] });
    expect(bereitsErinnert(erinnert, 1)).toBe(true);
    const auswahl = erinnerungAuswahl([erinnert], { heute, tageVorher: 1 });
    expect(auswahl.faellig).toHaveLength(0);
    expect(auswahl.bereitsErinnert).toHaveLength(1);
  });

  it('zählt nur gesendete Erinnerungen — eine gescheiterte wird wiederholt', () => {
    const gescheitert = termin({ mailLog: [erinnerung('2026-10-26T02:17:30.000Z', 'fehlgeschlagen')] });
    expect(bereitsErinnert(gescheitert, 1)).toBe(false);
    const andereArt = termin({ mailLog: [{ ...erinnerung('2026-10-26T02:17:30.000Z'), kind: 'status' }] });
    expect(bereitsErinnert(andereArt, 1)).toBe(false);
  });

  it('erinnert nach einer Verschiebung erneut', () => {
    // Erinnerung für den 22.10. am 21.10. verschickt, dann auf den 27.10. verschoben.
    const verschoben = termin({ mailLog: [erinnerung('2026-10-21T02:17:00.000Z')] });
    expect(bereitsErinnert(verschoben, 1)).toBe(false);
    expect(erinnerungAuswahl([verschoben], { heute, tageVorher: 1 }).faellig).toHaveLength(1);
  });

  it('ordnet die Erinnerung nach deutschem Kalendertag zu', () => {
    // 25.10. 23:30 UTC ist in Berlin schon der 26.10. — Erinnerungstag für den 27.10.
    expect(bereitsErinnert(termin({ mailLog: [erinnerung('2026-10-25T23:30:00.000Z')] }), 1)).toBe(true);
    // 25.10. 22:30 UTC ist in Berlin noch der 25.10. — davor.
    expect(bereitsErinnert(termin({ mailLog: [erinnerung('2026-10-25T22:30:00.000Z')] }), 1)).toBe(false);
  });
});
