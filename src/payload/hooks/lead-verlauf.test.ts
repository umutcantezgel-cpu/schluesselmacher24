import { describe, expect, it, vi } from 'vitest';

import type { Vorgaenge } from '../../payload-types';

import { leadVerlaufVorAenderung, partnerbetriebAuswahl } from './lead-verlauf';
import { SYSTEM_AENDERUNG } from './vorgang-benachrichtigen';

/* FA-PLATTFORM-01B: Hook des Lead-Verlaufs und Auswahl des Partnerbetriebs am Vorgang. Nachgebildetes `req`,
 * erfundene Daten (G4). */

const TEAM = { id: 1, email: 'team@example.org', name: 'Mina Saad', rollen: ['mitarbeiter'] };

function doc(teil: Partial<Vorgaenge> = {}): Vorgaenge {
  return {
    id: 42,
    nummer: 'SM24-T-2026-0042',
    art: 'termin',
    bereich: 'autoschluessel',
    status: 'terminiert',
    vermittlung: { status: 'geprueft', partnerbetrieb: 7 },
    leadVerlauf: [{ partnerbetrieb: 7, am: '2026-11-15T10:00:00.000Z', von: 'Mina Saad', ergebnis: 'zugeteilt', id: 'a' }],
    ...teil,
  } as Vorgaenge;
}

const lauf = (data: Partial<Vorgaenge>, original: Vorgaenge, context: Record<string, unknown> = {}) =>
  leadVerlaufVorAenderung({ data, originalDoc: original, operation: 'update', req: { user: TEAM, context } } as never) as Partial<Vorgaenge>;

describe('Hook Lead-Verlauf', () => {
  it('hängt beim Anbieten einen Eintrag an und leert die Angaben des Teams', () => {
    const data = lauf({ vermittlung: { status: 'partner-angefragt', partnerbetrieb: 7 }, zuordnung: { notiz: 'telefonisch' } }, doc());
    expect(data.leadVerlauf).toHaveLength(2);
    expect(data.leadVerlauf?.[1]).toMatchObject({ partnerbetrieb: 7, ergebnis: 'angeboten', von: 'Mina Saad', notiz: 'telefonisch' });
    expect(data.zuordnung).toEqual({ rueckgabe: null, notiz: null });
  });

  it('schreibt nichts ohne Wechsel und übergeht Änderungen des Servers', () => {
    expect(lauf({ vermittlung: { status: 'geprueft', partnerbetrieb: 7, notiz: 'x' } }, doc()).leadVerlauf).toBeUndefined();
    const vomServer = { leadVerlauf: [] };
    expect(lauf(vomServer, doc(), { [SYSTEM_AENDERUNG]: true })).toBe(vomServer);
  });

  it('nimmt einen von Hand gesendeten Verlauf nicht als Grundlage', () => {
    const data = lauf({ vermittlung: { status: 'partner-angefragt', partnerbetrieb: 7 }, leadVerlauf: [] }, doc());
    expect(data.leadVerlauf?.map((e) => e.ergebnis)).toEqual(['zugeteilt', 'angeboten']);
  });
});

describe('Auswahl des Partnerbetriebs', () => {
  it('bietet nur freigeschaltete an, dazu den schon gespeicherten', async () => {
    const findByID = vi.fn(async () => ({ vermittlung: { partnerbetrieb: 9 } }));
    const req = { payload: { findByID } } as never;
    expect(await (partnerbetriebAuswahl as (a: unknown) => unknown)({ id: undefined, req })).toEqual({ status: { equals: 'freigeschaltet' } });
    expect(await (partnerbetriebAuswahl as (a: unknown) => unknown)({ id: 42, req })).toEqual({
      or: [{ status: { equals: 'freigeschaltet' } }, { id: { equals: 9 } }],
    });
  });
});
