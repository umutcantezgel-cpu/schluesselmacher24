import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { einstellungenZuPayload } from '../../lib/data/payload-mapping';
import { echteEinstellungen } from '../../lib/rechtliches/test-hilfen';
import { hashToken } from '../../lib/server/access-token';
import type { Vorgaenge } from '../../payload-types';
import { bestaetigungSendenHandler } from './bestaetigung-senden';
import {
  MELDUNG_TERMIN_FREIGEGEBEN,
  MELDUNG_ZAHLUNG_EINGEGANGEN,
  SYSTEM_AENDERUNG,
  vorgangNachAenderung,
  vorgangVorAenderung,
} from './vorgang-benachrichtigen';

/* Hooks und Endpunkt der Sammlung Vorgänge mit nachgebildetem `req`.
 * Resend ist über fetch ersetzt. */

const TEAM = { id: 1, email: 'mina@schluesselmacher24.de', name: 'Mina Saad', rollen: ['inhaber'] };

function doc(teil: Partial<Vorgaenge> = {}): Vorgaenge {
  return {
    id: 42,
    nummer: 'SM24-B-2026-0007',
    art: 'bestellung',
    bereich: 'schluessel-nach-code',
    prozess: 'direktkauf',
    status: 'in-pruefung',
    kundeInformieren: true,
    nachrichtAnKunde: 'Ihr Schlüssel ist unterwegs.',
    kontakt: { vorname: 'Erika', nachname: 'Muster', email: 'erika@example.org', telefon: '0301234567', land: 'Deutschland' },
    zahlung: { umfang: 'gesamt', betragCent: 3070, status: 'offen' },
    versand: { dienstleister: 'dhl', sendungsnummer: '00340434161234567890' },
    notizen: [],
    verlauf: [],
    mails: [],
    updatedAt: '2026-10-24T12:00:00.000Z',
    createdAt: '2026-10-24T10:00:00.000Z',
    ...teil,
  } as Vorgaenge;
}

const update = vi.fn();
function req(user: unknown = TEAM) {
  return {
    user,
    context: {} as Record<string, unknown>,
    routeParams: {} as Record<string, unknown>,
    payload: {
      update,
      findByID: vi.fn(),
      findGlobal: vi.fn(async () => {
        throw new Error('keine Einstellungen im Test');
      }),
      logger: { warn: vi.fn(), error: vi.fn() },
    },
  };
}

const vor = (args: Record<string, unknown>) => vorgangVorAenderung(args as never) as Partial<Vorgaenge>;
const nach = (args: Record<string, unknown>) => vorgangNachAenderung(args as never) as Promise<Vorgaenge>;

const gesendet: Array<{ an: string[]; betreff: string; schluessel?: string }> = [];

beforeEach(() => {
  gesendet.length = 0;
  update.mockReset();
  update.mockImplementation(async ({ data }: { data: Partial<Vorgaenge> }) => ({ ...doc(), ...data }));
  vi.stubEnv('MAIL_PROVIDER', 'resend');
  vi.stubEnv('MAIL_API_KEY', 're_test');
  vi.stubEnv('MAIL_FROM_ADDRESS', 'info@schluesselmacher24.de');
  vi.stubEnv('VERCEL_ENV', '');
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(init.body as string);
      gesendet.push({ an: body.to, betreff: body.subject, schluessel: (init.headers as Record<string, string>)['Idempotency-Key'] });
      return new Response(JSON.stringify({ id: 're_1' }), { status: 200 });
    }),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('vorgangVorAenderung', () => {
  it('merkt einen Statuswechsel für die Mail vor, übernimmt die Nachricht und leert das Feld', () => {
    const r = req();
    const data = vor({ data: { ...doc(), status: 'versendet' }, originalDoc: doc(), operation: 'update', req: r });
    expect(data.nachrichtAnKunde).toBe('');
    expect(data.kundeInformieren).toBe(true);
    expect(r.context['sm24Vorhaben:42']).toEqual({
      statusMail: { status: 'versendet', nachricht: 'Ihr Schlüssel ist unterwegs.' },
      vertrag: true,
    });
  });

  it('schickt ohne Haken keine Mail und setzt den Haken zurück', () => {
    const r = req();
    const data = vor({ data: { ...doc(), status: 'terminiert', kundeInformieren: false }, originalDoc: doc(), operation: 'update', req: r });
    // Keine Statusmail — die Vertragsbestätigung ist Pflicht und hängt nicht am Haken.
    expect(r.context['sm24Vorhaben:42']).toEqual({ vertrag: true });
    expect(data.kundeInformieren).toBe(true);
    expect(data.nachrichtAnKunde).toBe('Ihr Schlüssel ist unterwegs.');
  });

  it('setzt bei Zahlung von Hand Datum und Notiz mit Benutzer', () => {
    const r = req();
    const data = vor({
      data: { ...doc(), zahlung: { ...doc().zahlung, status: 'bezahlt' } },
      originalDoc: doc(),
      operation: 'update',
      req: r,
    });
    expect(data.zahlung?.bezahltAm).toEqual(expect.any(String));
    expect(data.notizen?.at(-1)).toMatchObject({ von: 'team', text: expect.stringContaining('von „Offen“ auf „Bezahlt“ gesetzt (Mina Saad)') });
    expect(r.context['sm24Vorhaben:42']).toEqual({ zahlungsMail: true, vertrag: true });
  });

  it('merkt beim Stornieren die offene Checkout-Sitzung vor', () => {
    const r = req();
    const original = doc({ zahlung: { umfang: 'gesamt', betragCent: 3070, status: 'offen', checkoutSitzung: 'cs_offen' } });
    vor({ data: { ...original, status: 'storniert' }, originalDoc: original, operation: 'update', req: r });
    expect(r.context['sm24Vorhaben:42']).toMatchObject({ sitzungBeenden: 'cs_offen', statusMail: { status: 'storniert' } });
  });

  describe('veraltetes Formular', () => {
    const fehlerVon = (aufruf: () => unknown) => {
      try {
        aufruf();
      } catch (error) {
        return error as { status?: number; message: string };
      }
      return undefined;
    };

    it('dreht eine über Stripe eingegangene Zahlung nicht zurück (409)', () => {
      const gespeichert = doc({ zahlung: { umfang: 'gesamt', betragCent: 3070, status: 'bezahlt', anbieterRef: 'pi_1', bezahltAm: '2026-10-24T12:05:00.000Z' } });
      for (const status of ['offen', 'fehlgeschlagen'] as const) {
        const r = req();
        const fehler = fehlerVon(() =>
          vor({ data: { ...doc({ status: 'in-pruefung' }), zahlung: { ...doc().zahlung, status } }, originalDoc: gespeichert, operation: 'update', req: r }),
        );
        expect(fehler).toMatchObject({ status: 409, message: MELDUNG_ZAHLUNG_EINGEGANGEN });
        expect(r.context).toEqual({});
      }
      // Erstatten bleibt möglich, ebenso das Zurücksetzen einer Zahlung von Hand (ohne Stripe-Kennung).
      expect(fehlerVon(() => vor({ data: { ...gespeichert, zahlung: { ...gespeichert.zahlung, status: 'erstattet' } }, originalDoc: gespeichert, operation: 'update', req: req() }))).toBeUndefined();
      const vonHand = doc({ zahlung: { umfang: 'gesamt', betragCent: 3070, status: 'bezahlt' } });
      expect(fehlerVon(() => vor({ data: doc(), originalDoc: vonHand, operation: 'update', req: req() }))).toBeUndefined();
    });

    it('belebt einen automatisch freigegebenen Termin nicht wieder (409)', () => {
      const freigegeben = doc({ art: 'termin', status: 'storniert', zahlung: { umfang: 'anzahlung', betragCent: 6990, status: 'fehlgeschlagen' } });
      const formular = doc({ art: 'termin', status: 'neu', zahlung: { umfang: 'anzahlung', betragCent: 6990, status: 'offen' } });
      expect(fehlerVon(() => vor({ data: formular, originalDoc: freigegeben, operation: 'update', req: req() }))).toMatchObject({
        status: 409,
        message: MELDUNG_TERMIN_FREIGEGEBEN,
      });
      // Bewusst wieder aufnehmen (Zahlungsstand bleibt) geht weiter.
      const bewusst = { ...freigegeben, status: 'in-pruefung' as const };
      expect(fehlerVon(() => vor({ data: bewusst, originalDoc: freigegeben, operation: 'update', req: req() }))).toBeUndefined();
    });

    it('führt die Notizen zusammen, statt inzwischen ergänzte oder gelöschte zu verlieren', () => {
      const team = { id: 'a', am: '2026-10-24T11:00:00.000Z', von: 'team' as const, text: 'Rückruf vereinbart.' };
      const system = { id: 'b', am: '2026-10-24T12:05:00.000Z', von: 'system' as const, text: 'Streitfall eröffnet.' };
      const neu = { am: '2026-10-24T12:10:00.000Z', von: 'team' as const, text: 'Kunde informiert.' };
      const gespeichert = doc({ notizen: [team, system] });

      const data = vor({ data: { ...doc(), notizen: [team, neu] }, originalDoc: gespeichert, operation: 'update', req: req() });
      expect(data.notizen).toEqual([team, neu, { am: system.am, von: 'system', text: system.text }]);

      // Gelöschte Notizen kommen wieder; gleiche Einträge werden nicht verdoppelt.
      const geloescht = vor({ data: { ...doc(), notizen: [] }, originalDoc: gespeichert, operation: 'update', req: req() });
      expect(geloescht.notizen?.map((n) => n.text)).toEqual(['Rückruf vereinbart.', 'Streitfall eröffnet.']);
      const unveraendert = vor({ data: { ...doc(), notizen: [team, system] }, originalDoc: gespeichert, operation: 'update', req: req() });
      expect(unveraendert.notizen).toEqual([team, system]);
    });
  });

  it('greift nicht bei Änderungen ohne Benutzer oder vom Server selbst', () => {
    const ohne = req(null);
    vor({ data: { ...doc(), status: 'versendet' }, originalDoc: doc(), operation: 'update', req: ohne });
    expect(ohne.context).toEqual({});
    const system = req();
    system.context[SYSTEM_AENDERUNG] = true;
    const data = vor({ data: { ...doc(), status: 'versendet' }, originalDoc: doc(), operation: 'update', req: system });
    expect(data.nachrichtAnKunde).toBe('Ihr Schlüssel ist unterwegs.');
  });
});

describe('vorgangNachAenderung', () => {
  it('sendet die Statusmail mit Sendungsnummer und protokolliert sie als Systemänderung', async () => {
    const r = req();
    r.context['sm24Vorhaben:42'] = { statusMail: { status: 'versendet', nachricht: 'Viel Freude!' } };
    let systemBeimSpeichern: unknown;
    update.mockImplementation(async ({ data, req: innen }: { data: Partial<Vorgaenge>; req: { context: Record<string, unknown> } }) => {
      systemBeimSpeichern = innen.context[SYSTEM_AENDERUNG];
      return { ...doc({ status: 'versendet' }), ...data };
    });
    const ergebnis = await nach({ doc: doc({ status: 'versendet' }), operation: 'update', req: r });

    expect(gesendet).toHaveLength(1);
    expect(gesendet[0]).toMatchObject({ an: ['erika@example.org'], betreff: 'Ihre Sendung ist unterwegs – SM24-B-2026-0007' });
    expect(gesendet[0].schluessel).toBe('lokal-SM24-B-2026-0007-status-versendet-2026-10-24T12:00:00.000Z');
    expect(systemBeimSpeichern).toBe(true);
    expect(r.context[SYSTEM_AENDERUNG]).toBeUndefined();
    expect(ergebnis.mails?.[0]).toMatchObject({ art: 'status', an: 'erika@example.org', ergebnis: 'gesendet', anbieterId: 're_1' });
    // Nur einmal je Speichern
    await nach({ doc: doc({ status: 'versendet' }), operation: 'update', req: r });
    expect(gesendet).toHaveLength(1);
  });

  it('sendet beim Annehmen die Vertragsbestätigung genau einmal', async () => {
    const r = req();
    r.payload.findGlobal = vi.fn(async () => einstellungenZuPayload(echteEinstellungen()) as never);
    r.context['sm24Vorhaben:42'] = { vertrag: true };
    const ergebnis = await nach({ doc: doc({ status: 'geprueft' }), operation: 'update', req: r });
    expect(gesendet).toHaveLength(1);
    expect(gesendet[0]).toMatchObject({ an: ['erika@example.org'], betreff: 'Vertragsbestätigung – SM24-B-2026-0007', schluessel: 'lokal-SM24-B-2026-0007-vertrag' });
    expect(ergebnis.mails?.[0]).toMatchObject({ art: 'vertrag', ergebnis: 'gesendet' });

    // Steht sie im Protokoll, geht sie nicht noch einmal hinaus.
    r.context['sm24Vorhaben:42'] = { vertrag: true };
    await nach({ doc: doc({ status: 'versendet', mails: ergebnis.mails }), operation: 'update', req: r });
    expect(gesendet).toHaveLength(1);
  });

  it('sendet für Anfragen keine Vertragsbestätigung', async () => {
    const r = req();
    r.payload.findGlobal = vi.fn(async () => einstellungenZuPayload(echteEinstellungen()) as never);
    r.context['sm24Vorhaben:42'] = { vertrag: true };
    await nach({ doc: doc({ art: 'anfrage', status: 'geprueft' }), operation: 'update', req: r });
    expect(gesendet).toHaveLength(0);
    expect(update).not.toHaveBeenCalled();
  });

  it('sendet ohne Mail-Einrichtung nichts', async () => {
    vi.stubEnv('MAIL_API_KEY', '');
    const r = req();
    r.context['sm24Vorhaben:42'] = { statusMail: { status: 'storniert' } };
    await nach({ doc: doc(), operation: 'update', req: r });
    expect(gesendet).toHaveLength(0);
    expect(update).not.toHaveBeenCalled();
  });
});

describe('POST /api/vorgaenge/:id/bestaetigung-senden', () => {
  const aufruf = (r: ReturnType<typeof req>, id = '42') => {
    r.routeParams = { id };
    return bestaetigungSendenHandler(r as never);
  };

  it('verlangt Anmeldung und Team-Rolle', async () => {
    expect((await aufruf(req(null))).status).toBe(401);
    expect((await aufruf(req({ id: 2, email: 'x@y.de', rollen: [] }))).status).toBe(403);
  });

  it('lehnt ab, solange eine Online-Zahlung offen ist', async () => {
    const r = req();
    r.payload.findByID.mockResolvedValue(
      doc({ zahlung: { umfang: 'gesamt', betragCent: 3070, status: 'offen', checkoutSitzung: 'cs_1', ablaufAm: new Date(Date.now() + 60_000).toISOString() } }),
    );
    const response = await aufruf(r);
    expect(response.status).toBe(409);
    expect(gesendet).toHaveLength(0);
  });

  it('sendet mit neuem Link und ersetzt den Hash erst nach erfolgreichem Versand', async () => {
    const r = req();
    r.payload.findByID.mockResolvedValue(doc({ zugriffsHash: 'alt' }));
    const response = await aufruf(r);
    expect(response.status).toBe(200);
    expect(gesendet).toHaveLength(1);
    expect(gesendet[0].schluessel).toMatch(/^lokal-SM24-B-2026-0007-eingang-kunde-\d+$/);

    const daten = update.mock.calls[0][0].data as Partial<Vorgaenge>;
    expect(daten.zugriffsHash).toMatch(/^[0-9a-f]{64}$/);
    expect(daten.zugriffsHash).not.toBe('alt');
    expect(daten.mails?.[0]).toMatchObject({ art: 'eingang-kunde', ergebnis: 'gesendet' });
    expect(daten.notizen?.at(-1)?.text).toContain('erneut gesendet (Mina Saad)');
    expect(hashToken('irgendwas')).not.toBe(daten.zugriffsHash);
  });

  it('behält den alten Link, wenn die Mail scheitert', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ name: 'validation_error' }), { status: 422 })));
    const r = req();
    r.payload.findByID.mockResolvedValue(doc({ zugriffsHash: 'alt' }));
    const response = await aufruf(r);
    expect(response.status).toBe(502);
    const daten = update.mock.calls[0][0].data as Partial<Vorgaenge>;
    expect(daten.zugriffsHash).toBeUndefined();
    expect(daten.mails?.[0]).toMatchObject({ ergebnis: 'fehlgeschlagen' });
  });
});
