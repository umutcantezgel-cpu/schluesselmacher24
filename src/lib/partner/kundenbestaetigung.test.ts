import { describe, expect, it } from 'vitest';

import { createAccessToken, verifyAccessToken } from '../server/access-token';
import type { BusinessRecord } from '../types';

import { bestaetigungsLage, bestaetigungsPfad, kundenbestaetigungAnwenden } from './kundenbestaetigung';

/* FA-KERN-04: Einmal-Link der Kundenbestätigung. Erfundene Testdaten (G4). */

const JETZT = '2026-11-15T15:00:00.000Z';

function vorgang(hash: string | undefined, status: NonNullable<BusinessRecord['referral']>['status'] = 'erledigt'): BusinessRecord {
  return {
    id: '42',
    reference: 'SM24-T-2026-0042',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    status: 'terminiert',
    createdAt: JETZT,
    updatedAt: JETZT,
    contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', country: 'Deutschland' },
    payload: {},
    summary: [],
    uploads: [],
    internalNotes: [],
    timeline: [],
    referral: { status, confirmTokenHash: hash },
  } as unknown as BusinessRecord;
}

/** Wie die Aktion: Schlüssel gegen den gespeicherten Hash prüfen, dann anwenden. */
function klick(v: BusinessRecord, schluessel: string) {
  return kundenbestaetigungAnwenden(v, verifyAccessToken(schluessel, v.referral?.confirmTokenHash), JETZT);
}

describe('Kundenbestätigung mit Einmal-Link', () => {
  it('setzt „Kunde bestätigt“ mit Zeitstempel und löscht den Schlüssel', () => {
    const { token, hash } = createAccessToken();
    const ergebnis = klick(vorgang(hash), token);
    expect(ergebnis?.referral).toMatchObject({ status: 'kunde-bestaetigt', customerConfirmedAt: JETZT });
    expect(ergebnis?.referral?.confirmTokenHash).toBeUndefined();
    expect(ergebnis?.timeline.at(-1)).toMatchObject({ actor: 'kunde', message: 'Sie haben bestätigt, dass Ihr Auftrag ausgeführt wurde. Vielen Dank.' });
    expect(ergebnis?.internalNotes.at(-1)?.message).toMatch(/„Kunde bestätigt“/);
  });

  it('lehnt einen gefälschten Link ab', () => {
    const { hash } = createAccessToken();
    const gefaelscht = createAccessToken().token;
    expect(klick(vorgang(hash), gefaelscht)).toBeNull();
    expect(klick(vorgang(hash), '')).toBeNull();
    expect(bestaetigungsLage(vorgang(hash), false)).toBe('ungueltig');
  });

  it('lehnt einen schon benutzten Link ab', () => {
    const { token, hash } = createAccessToken();
    const erster = klick(vorgang(hash), token);
    expect(erster).not.toBeNull();
    const danach = { ...vorgang(hash), ...erster } as BusinessRecord;
    expect(klick(danach, token)).toBeNull();
    expect(bestaetigungsLage(danach, verifyAccessToken(token, danach.referral?.confirmTokenHash))).toBe('ungueltig');
  });

  it('bestätigt nur im Stand „ausgeführt“', () => {
    const { token, hash } = createAccessToken();
    expect(klick(vorgang(hash, 'auszahlung-freigegeben'), token)).toBeNull();
    expect(bestaetigungsLage(vorgang(hash, 'termin-bestaetigt'), true)).toBe('nicht-offen');
  });

  it('baut den Pfad der Bestätigungsseite', () => {
    expect(bestaetigungsPfad('42', 'a-b_c')).toBe('/auftrag-bestaetigen/42?k=a-b_c');
  });
});
