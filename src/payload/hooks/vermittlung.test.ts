import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MELDUNG } from '../../lib/partner/vermittlung';
import { AUSZAHLUNG_MELDUNG } from '../../lib/zahlung/auszahlung';
import type { Partnerbetriebe, Vorgaenge } from '../../payload-types';

import { auftragswegVorAenderung } from './auftragsweg';
import {
  ERSTATTUNG_MELDUNG,
  MELDUNG_BELEG_FEHLT,
  MELDUNG_PARTNER_FEST,
  MELDUNG_PARTNER_WECHSEL,
  vermittlungNachAenderung,
  vermittlungVorAenderung,
} from './vermittlung';
import { vorgangVorAenderung } from './vorgang-benachrichtigen';

/* FA-KERN-04: Vermittlung, Auszahlung und Erstattung am Vorgang. Nachgebildetes `req`, Stripe und Resend
 * nur als Attrappe (G3, G5). Erfundene Testdaten (G4), keine echten Provisionssätze (G13). */

const stripeGeladen = vi.fn();
vi.mock('../../lib/integrations/stripe', () => {
  stripeGeladen();
  return { stripeClient: () => ({ transfers: { create: vi.fn(async () => ({ id: 'tr_attrappe' })) } }) };
});

const TEAM = { id: 1, email: 'team@example.org', name: 'Mina Saad', rollen: ['team'] };

function partner(teil: Partial<Partnerbetriebe> = {}): Partnerbetriebe {
  return {
    id: 7,
    firma: 'Testbetrieb GmbH',
    ort: 'Frankfurt',
    status: 'freigeschaltet',
    abrechnungsmodell: 'B',
    auftragsarten: ['autoschluessel-vor-ort'],
    provisionen: [{ auftragsart: 'autoschluessel-vor-ort', prozent: 10 }],
    updatedAt: '2026-11-15T10:00:00.000Z',
    createdAt: '2026-11-15T10:00:00.000Z',
    ...teil,
  } as Partnerbetriebe;
}

function doc(teil: Partial<Vorgaenge> = {}): Vorgaenge {
  return {
    id: 42,
    nummer: 'SM24-T-2026-0042',
    art: 'termin',
    bereich: 'autoschluessel',
    prozess: 'termin-mit-anzahlung',
    status: 'terminiert',
    kundeInformieren: true,
    kontakt: { vorname: 'Erika', nachname: 'Muster', email: 'erika@example.org', telefon: '0301234567', plz: '60311', land: 'Deutschland' },
    zahlung: { umfang: 'gesamt', betragCent: 30_000, status: 'bezahlt', anbieterRef: 'pi_test' },
    auftragsweg: 'partner',
    vermittlung: { status: 'geprueft', partnerbetrieb: 7 },
    notizen: [],
    verlauf: [],
    mails: [],
    updatedAt: '2026-11-15T12:00:00.000Z',
    createdAt: '2026-11-15T10:00:00.000Z',
    ...teil,
  } as Vorgaenge;
}

let betrieb: Partnerbetriebe | null;
const update = vi.fn();
function req(user: unknown = TEAM) {
  return {
    user,
    context: {} as Record<string, unknown>,
    payload: {
      update,
      find: vi.fn(),
      findByID: vi.fn(async () => betrieb),
      findGlobal: vi.fn(async () => {
        throw new Error('keine Einstellungen im Test');
      }),
      logger: { warn: vi.fn(), error: vi.fn() },
    },
  };
}

/** Alle Hooks vor dem Speichern in der Reihenfolge der Sammlung. */
async function speichern(original: Vorgaenge, data: Partial<Vorgaenge>, r = req()) {
  const a = { operation: 'update', originalDoc: original, req: r };
  const erst = vorgangVorAenderung({ ...a, data: { ...original, ...data } } as never) as Partial<Vorgaenge>;
  const zweit = (await vermittlungVorAenderung({ ...a, data: erst } as never)) as Partial<Vorgaenge>;
  return auftragswegVorAenderung({ ...a, data: zweit } as never) as Partial<Vorgaenge>;
}

const vermittlung = (original: Vorgaenge, teil: Partial<NonNullable<Vorgaenge['vermittlung']>>) => ({ vermittlung: { ...original.vermittlung, ...teil } });
const texte = (data: Partial<Vorgaenge>) => (data.notizen ?? []).map((n) => n.text);

beforeEach(() => {
  betrieb = partner();
  update.mockReset();
  stripeGeladen.mockReset();
  vi.stubEnv('PARTNERMODELL_B', 'aktiv');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('An Partner vermitteln', () => {
  it('lehnt „an Partner vermittelt“ ohne Zahlung des Gesamtbetrags ab', async () => {
    const original = doc({ zahlung: { umfang: 'gesamt', betragCent: 30_000, status: 'offen' } });
    await expect(speichern(original, vermittlung(original, { status: 'partner-angefragt' }))).rejects.toThrow(MELDUNG.ohneZahlung);
    const anzahlung = doc({ auftragsweg: 'partner', zahlung: { umfang: 'anzahlung', betragCent: 6_990, status: 'bezahlt' } });
    await expect(speichern(anzahlung, vermittlung(anzahlung, { status: 'partner-angefragt' }))).rejects.toThrow(MELDUNG.ohneZahlung);
  });

  it('lehnt pausierte oder gesperrte Partner ab (Pausieren wirkt)', async () => {
    const original = doc();
    betrieb = partner({ status: 'pausiert' });
    await expect(speichern(original, vermittlung(original, { status: 'partner-angefragt' }))).rejects.toThrow(MELDUNG.partnerGesperrt);
    betrieb = partner({ status: 'beendet' });
    await expect(speichern(original, vermittlung(original, { status: 'partner-angefragt' }))).rejects.toThrow(MELDUNG.partnerGesperrt);
    // Gelöscht oder nicht auffindbar: kein Partner.
    betrieb = null;
    await expect(speichern(original, vermittlung(original, { status: 'partner-angefragt' }))).rejects.toThrow(MELDUNG.ohnePartner);
  });

  it('vermittelt nach Zahlung, schlägt Gesamtbetrag und Plattformanteil vor und schreibt Verlauf und Notiz', async () => {
    const original = doc();
    const data = await speichern(original, vermittlung(original, { status: 'partner-angefragt' }));
    expect(data.vermittlung).toMatchObject({ auftragsart: 'autoschluessel-vor-ort', gesamtCent: 30_000, plattformanteilCent: 3_000, partnerbetragCent: 27_000 });
    expect(data.auszahlung?.stand).toBe('offen');
    expect(texte(data)).toContain('Vermittlung von „geprüft“ auf „an Partner vermittelt“ gesetzt (Mina Saad).');
    expect(data.verlauf?.at(-1)?.text).toMatch(/an einen Partnerbetrieb in Ihrer Region weitergegeben/);
  });

  it('nennt ohne hinterlegte Provision keinen Betrag, sondern einen Hinweis', async () => {
    betrieb = partner({ provisionen: [] });
    const original = doc();
    const data = await speichern(original, vermittlung(original, { status: 'partner-angefragt' }));
    expect(data.vermittlung?.plattformanteilCent ?? null).toBeNull();
    expect(data.vermittlung?.anteilHinweis).toMatch(/keine Provision hinterlegt/);
  });
});

describe('Ausgeführt, Kundenbestätigung und Freigabe', () => {
  const laufend = (status: NonNullable<Vorgaenge['vermittlung']>['status'], teil: Partial<NonNullable<Vorgaenge['vermittlung']>> = {}) =>
    doc({
      vermittlung: { status, partnerbetrieb: 7, auftragsart: 'autoschluessel-vor-ort', gesamtCent: 30_000, plattformanteilCent: 3_000, partnerbetragCent: 27_000, ...teil },
    });

  it('schreibt den Plattformanteil mit „ausgeführt“ fest und lehnt spätere Änderungen ab', async () => {
    const original = laufend('termin-bestaetigt');
    const r = req();
    const data = await speichern(original, vermittlung(original, { status: 'erledigt' }), r);
    expect(data.vermittlung?.festgeschriebenAm).toBeTruthy();
    expect(texte(data).join('\n')).toMatch(/Beträge festgeschrieben: Gesamtbetrag 300,00\s€, Plattformanteil 30,00\s€, Partnerbetrag 270,00\s€\./);
    expect(r.context['sm24Vermittlung:42']).toEqual({ bitteUmBestaetigung: true });

    const fest = laufend('erledigt', { festgeschriebenAm: '2026-11-15T13:00:00.000Z' });
    await expect(speichern(fest, vermittlung(fest, { plattformanteilCent: 2_000 }))).rejects.toThrow(MELDUNG.festgeschrieben);
  });

  it('lehnt die Auszahlung vor der Kundenbestätigung ab und lässt das Team nur mit Grund freigeben', async () => {
    const original = laufend('erledigt', { festgeschriebenAm: '2026-11-15T13:00:00.000Z' });
    await expect(speichern(original, vermittlung(original, { status: 'ausgezahlt' }))).rejects.toThrow(/nicht direkt/);
    await expect(speichern(original, vermittlung(original, { status: 'kunde-bestaetigt' }))).rejects.toThrow(MELDUNG.nurKunde);
    await expect(speichern(original, vermittlung(original, { status: 'auszahlung-freigegeben' }))).rejects.toThrow(MELDUNG.ohneGrund);

    const data = await speichern(original, vermittlung(original, { status: 'auszahlung-freigegeben', teamBestaetigungGrund: 'Kunde am Telefon bestätigt' }));
    expect(data.auszahlung).toMatchObject({ stand: 'freigegeben', freigegebenVon: 'Mina Saad' });
    expect(texte(data)).toContain('Ausführung durch das Team bestätigt: Kunde am Telefon bestätigt (Mina Saad).');
    expect(data.vermittlung?.bestaetigungHash).toBeNull();
  });

  it('zahlt erst nach der Freigabe aus, per Überweisung nur mit Beleg, und ruft ohne Schalter keinen Zahlungsdienst', async () => {
    const original = laufend('auszahlung-freigegeben', { festgeschriebenAm: '2026-11-15T13:00:00.000Z' });
    const fetchSpion = vi.fn();
    vi.stubGlobal('fetch', fetchSpion);
    await expect(speichern(original, { ...vermittlung(original, { status: 'ausgezahlt' }), auszahlung: { weg: 'ueberweisung' } })).rejects.toThrow(MELDUNG_BELEG_FEHLT);
    await expect(speichern(original, { ...vermittlung(original, { status: 'ausgezahlt' }), auszahlung: { weg: 'zahlungsdienst' } })).rejects.toThrow(
      AUSZAHLUNG_MELDUNG.ausgeschaltet,
    );
    expect(stripeGeladen).not.toHaveBeenCalled();
    expect(fetchSpion).not.toHaveBeenCalled();

    const data = await speichern(original, { ...vermittlung(original, { status: 'ausgezahlt' }), auszahlung: { weg: 'ueberweisung', referenz: 'Sparkasse 2026-11-15' } });
    expect(data.auszahlung).toMatchObject({ stand: 'ausgezahlt', referenz: 'Sparkasse 2026-11-15' });
    expect(data.auszahlung?.ausgezahltAm).toBeTruthy();
    expect(texte(data).join('\n')).toMatch(/Partnerbetrag 270,00\s€ ausgezahlt am .* per Überweisung, Beleg „Sparkasse 2026-11-15“/);
  });

  it('steht bei jedem Wechsel und jeder Änderung der Auszahlung in den Notizen', async () => {
    let stand = doc();
    const schritte = ['partner-angefragt', 'angenommen', 'termin-bestaetigt', 'erledigt'] as const;
    for (const status of schritte) {
      const data = await speichern(stand, vermittlung(stand, { status }));
      expect(texte(data).filter((t) => t.startsWith('Vermittlung von')).at(-1)).toMatch(/gesetzt \(Mina Saad\)\.$/);
      stand = { ...stand, ...data } as Vorgaenge;
    }
    expect(stand.notizen?.filter((n) => n.text.startsWith('Vermittlung von'))).toHaveLength(4);
    const data = await speichern(stand, { auszahlung: { notiz: 'Rückfrage beim Partner' } });
    expect(texte(data).at(-1)).toBe('Auszahlung geändert: Notiz (Mina Saad).');
  });
});

describe('Wechsel des Partnerbetriebs', () => {
  const laufend = (status: NonNullable<Vorgaenge['vermittlung']>['status'], teil: Partial<NonNullable<Vorgaenge['vermittlung']>> = {}) =>
    doc({
      vermittlung: { status, partnerbetrieb: 7, auftragsart: 'autoschluessel-vor-ort', gesamtCent: 30_000, plattformanteilCent: 3_000, ...teil },
    });

  it('lehnt den Wechsel auf einen pausierten Partner bei gleichem Stand ab', async () => {
    betrieb = partner({ id: 8, firma: 'Pausiert GmbH', status: 'pausiert' });
    for (const status of ['partner-angefragt', 'angenommen', 'termin-bestaetigt'] as const) {
      const original = laufend(status);
      await expect(speichern(original, vermittlung(original, { partnerbetrieb: 8 }))).rejects.toThrow(MELDUNG_PARTNER_WECHSEL);
    }
    // Auch ein freigeschalteter Partner nur über „geprüft“.
    betrieb = partner({ id: 8, firma: 'Neu GmbH' });
    const original = laufend('angenommen');
    await expect(speichern(original, vermittlung(original, { partnerbetrieb: 8 }))).rejects.toThrow(MELDUNG_PARTNER_WECHSEL);
    await expect(speichern(original, vermittlung(original, { auftragsart: 'montage-zylinder' as never }))).rejects.toThrow(MELDUNG_PARTNER_WECHSEL);
  });

  it('lehnt jeden Wechsel seit „ausgeführt“ ab, auch nach der Freigabe', async () => {
    for (const status of ['erledigt', 'kunde-bestaetigt', 'auszahlung-freigegeben', 'ausgezahlt'] as const) {
      const original = laufend(status, { festgeschriebenAm: '2026-11-15T13:00:00.000Z' });
      await expect(speichern(original, vermittlung(original, { partnerbetrieb: 8 }))).rejects.toThrow(MELDUNG_PARTNER_FEST);
    }
  });

  it('wechselt mit dem Schritt zurück auf „geprüft“, vermerkt den Wechsel und prüft den neuen Partner beim Vermitteln', async () => {
    const original = laufend('angenommen');
    const pausiert = partner({ id: 8, firma: 'Pausiert GmbH', status: 'pausiert' });
    const nachId = () => {
      const r = req();
      r.payload.findByID = vi.fn(async ({ id }: { id: number }) => (id === 8 ? pausiert : partner())) as never;
      return r;
    };
    const data = await speichern(original, vermittlung(original, { status: 'geprueft', partnerbetrieb: 8 }), nachId());
    expect(texte(data)).toContain('Partnerbetrieb von „Testbetrieb GmbH“ auf „Pausiert GmbH“ gewechselt (Mina Saad).');
    const geprueft = { ...original, ...data } as Vorgaenge;
    await expect(speichern(geprueft, vermittlung(geprueft, { status: 'partner-angefragt' }), nachId())).rejects.toThrow(MELDUNG.partnerGesperrt);
  });
});

describe('Storno und Rückzahlung', () => {
  const bestaetigt = () =>
    doc({
      vermittlung: {
        status: 'kunde-bestaetigt',
        partnerbetrieb: 7,
        auftragsart: 'autoschluessel-vor-ort',
        gesamtCent: 30_000,
        plattformanteilCent: 3_000,
        festgeschriebenAm: '2026-11-15T13:00:00.000Z',
      },
      auszahlung: { stand: 'offen' },
    });

  it('erfasst eine Teilerstattung, setzt „teilweise erstattet“ und sperrt die Auszahlung', async () => {
    const original = bestaetigt();
    const data = await speichern(original, { erstattung: { weg: 'zahlungsdienst', art: 'teilweise', betragCent: 5_000, grund: 'Kulanz, Wartezeit' } });
    expect(data.zahlung).toMatchObject({ status: 'teilweise-erstattet', erstattetCent: 5_000 });
    expect(data.auszahlung?.stand).toBe('gesperrt');
    expect(texte(data)).toContain('Auszahlung an den Partner gesperrt (Erstattung).');
    expect(data.verlauf?.at(-1)?.text).toMatch(/Erstattung über 50,00\s€ veranlasst/);

    const gesperrt = { ...original, ...data } as Vorgaenge;
    await expect(speichern(gesperrt, vermittlung(gesperrt, { status: 'auszahlung-freigegeben' }))).rejects.toThrow(MELDUNG.gesperrt);
  });

  it('prüft Art, Betrag und Grund und erstattet nur bezahlte Vorgänge', async () => {
    const original = bestaetigt();
    await expect(speichern(original, { erstattung: { weg: 'zahlungsdienst', art: 'teilweise', betragCent: 5_000 } })).rejects.toThrow(ERSTATTUNG_MELDUNG.grund);
    await expect(speichern(original, { erstattung: { weg: 'zahlungsdienst', art: 'teilweise', betragCent: 30_000, grund: 'x' } })).rejects.toThrow(ERSTATTUNG_MELDUNG.teilweise);
    await expect(speichern(original, { erstattung: { weg: 'zahlungsdienst', art: 'ganz', betragCent: 40_000, grund: 'x' } })).rejects.toThrow(/höher als die Zahlung/);
    const ganz = await speichern(original, { erstattung: { weg: 'zahlungsdienst', art: 'ganz', grund: 'Storno durch den Kunden' } });
    expect(ganz.zahlung).toMatchObject({ status: 'erstattet', erstattetCent: 30_000 });
    expect(ganz.auszahlung?.stand).toBe('gesperrt');

    const offen = doc({ zahlung: { umfang: 'gesamt', betragCent: 30_000, status: 'offen' } });
    await expect(speichern(offen, { erstattung: { weg: 'zahlungsdienst', art: 'ganz', grund: 'x' } })).rejects.toThrow(ERSTATTUNG_MELDUNG.nichtBezahlt);
  });

  it('lässt den Zahlungsstand nach einer Erstattung nicht von Hand zurücksetzen; die Freigabe bleibt gesperrt', async () => {
    const original = bestaetigt();
    const data = await speichern(original, { erstattung: { weg: 'zahlungsdienst', art: 'teilweise', betragCent: 5_000, grund: 'Kulanz' } });
    const erstattet = { ...original, ...data } as Vorgaenge;
    await expect(speichern(erstattet, { zahlung: { ...erstattet.zahlung, status: 'bezahlt' } })).rejects.toThrow(ERSTATTUNG_MELDUNG.zurueck);
    // Ohne Zahlungsreferenz greift dieselbe Sperre auch für „offen“ und „fehlgeschlagen“.
    const ohneRef = { ...erstattet, zahlung: { ...erstattet.zahlung, anbieterRef: null } } as Vorgaenge;
    for (const status of ['offen', 'fehlgeschlagen'] as const) {
      await expect(speichern(ohneRef, { zahlung: { ...ohneRef.zahlung, status } })).rejects.toThrow(ERSTATTUNG_MELDUNG.zurueck);
    }
    await expect(
      speichern(erstattet, { zahlung: { ...erstattet.zahlung, status: 'bezahlt' }, ...vermittlung(erstattet, { status: 'auszahlung-freigegeben' }) }),
    ).rejects.toThrow(ERSTATTUNG_MELDUNG.zurueck);
    // Selbst wenn der Zahlungsstand doch „bezahlt“ wäre: der erstattete Betrag sperrt.
    const zurueckgesetzt = { ...erstattet, zahlung: { ...erstattet.zahlung, status: 'bezahlt' } } as Vorgaenge;
    await expect(speichern(zurueckgesetzt, vermittlung(zurueckgesetzt, { status: 'auszahlung-freigegeben' }))).rejects.toThrow(MELDUNG.gesperrt);
  });

  it('setzt „erstattet“ und „teilweise erstattet“ nur über die Gruppe Erstattung', async () => {
    const original = bestaetigt();
    for (const status of ['erstattet', 'teilweise-erstattet'] as const) {
      await expect(speichern(original, { zahlung: { ...original.zahlung, status } })).rejects.toThrow(ERSTATTUNG_MELDUNG.nurGruppe);
    }
  });

  it('vermerkt die Sperre nur, wo es eine Partnerauszahlung gibt', async () => {
    const geprueft = doc();
    const data = await speichern(geprueft, { erstattung: { weg: 'zahlungsdienst', art: 'ganz', grund: 'Storno vor der Vermittlung' } });
    expect(texte(data)).not.toContain('Auszahlung an den Partner gesperrt (Erstattung).');
    expect(data.auszahlung?.stand ?? null).toBeNull();
  });

  it('überschreibt einen vom Team gesendeten Auszahlungsstand', async () => {
    const original = bestaetigt();
    const data = await speichern(original, { auszahlung: { stand: 'ausgezahlt' } });
    expect(data.auszahlung?.stand).toBe('offen');
  });

  it('sperrt die Auszahlung auch bei einer Erstattung über den Zahlungsdienst (Änderung des Servers)', async () => {
    const original = bestaetigt();
    const r = req(null);
    const data = (await vermittlungVorAenderung({
      operation: 'update',
      originalDoc: original,
      req: r,
      data: { zahlung: { ...original.zahlung, status: 'teilweise-erstattet', erstattetCent: 2_000 } },
    } as never)) as Partial<Vorgaenge>;
    expect(data.auszahlung?.stand).toBe('gesperrt');
  });
});

describe('Bitte um Bestätigung an den Kunden', () => {
  it('schickt mit „ausgeführt“ den persönlichen Einmal-Link (Mail nur an die Attrappe) und speichert nur den Hash', async () => {
    vi.stubEnv('MAIL_PROVIDER', 'resend');
    vi.stubEnv('MAIL_API_KEY', 're_test');
    vi.stubEnv('MAIL_FROM_ADDRESS', 'info@schluesselmacher24.de');
    vi.stubEnv('VERCEL_ENV', '');
    const mails: Array<{ betreff: string; text: string }> = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: RequestInit) => {
        const body = JSON.parse(init.body as string);
        mails.push({ betreff: body.subject, text: body.text });
        return new Response(JSON.stringify({ id: 're_9' }), { status: 200 });
      }),
    );
    update.mockImplementation(async ({ data }: { data: Partial<Vorgaenge> }) => ({ ...doc(), ...data }));
    const r = req();
    r.context['sm24Vermittlung:42'] = { bitteUmBestaetigung: true };
    const gespeichert = doc({ vermittlung: { status: 'erledigt', partnerbetrieb: 7 } });
    await vermittlungNachAenderung({ doc: gespeichert, operation: 'update', req: r } as never);
    expect(mails).toHaveLength(1);
    expect(mails[0].betreff).toBe('Auftrag wurde ausgeführt: bitte bestätigen (SM24-T-2026-0042)');
    const link = mails[0].text.match(/\/auftrag-bestaetigen\/42\?k=([\w-]+)/);
    expect(link).not.toBeNull();
    const geschrieben = update.mock.calls[0][0].data as Partial<Vorgaenge>;
    expect(geschrieben.vermittlung?.bestaetigungHash).toMatch(/^[0-9a-f]{64}$/);
    expect(geschrieben.vermittlung?.bestaetigungHash).not.toContain(link![1]);
    expect(geschrieben.mails?.at(-1)).toMatchObject({ art: 'ausfuehrung', ergebnis: 'gesendet' });
    // Erst nach dem Versand steht der Satz zur Mail im Verlauf des Kunden.
    expect(geschrieben.verlauf?.at(-1)?.text).toBe('Wir haben Sie per E-Mail gebeten, das kurz zu bestätigen.');
  });

  it('schreibt ohne Mailanbindung keinen Satz zur Mail in den Verlauf', async () => {
    vi.stubEnv('MAIL_PROVIDER', '');
    vi.stubEnv('MAIL_API_KEY', '');
    const original = doc({
      vermittlung: { status: 'termin-bestaetigt', partnerbetrieb: 7, auftragsart: 'autoschluessel-vor-ort', gesamtCent: 30_000, plattformanteilCent: 3_000 },
    });
    const r = req();
    const data = await speichern(original, vermittlung(original, { status: 'erledigt' }), r);
    const verlauf = (data.verlauf ?? []).map((e) => e.text);
    expect(verlauf.at(-1)).toBe('Ihr Auftrag wurde ausgeführt.');
    expect(verlauf.join('\n')).not.toMatch(/per E-Mail gebeten/);
    await vermittlungNachAenderung({ doc: { ...original, ...data } as Vorgaenge, operation: 'update', req: r } as never);
    expect(update).not.toHaveBeenCalled();
  });
});
