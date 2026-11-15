import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatCents } from '../../lib/format';
import type { Vorgaenge } from '../../payload-types';
import { BEGRUENDUNG_FEHLT, auftragswegVorAenderung, partnerVorschlaege } from './auftragsweg';
import { vorgangNachAenderung, vorgangVorAenderung } from './vorgang-benachrichtigen';

/* FA-KERN-03: Auftragsweg mit Begründung, Restbetrag, Freigabe der Partner-Anfrage mit Zahlungslink
 * über den Gesamtbetrag. Nachgebildetes `req`, Resend über fetch ersetzt. */

const TEAM = { id: 1, email: 'team@example.org', name: 'Mina Saad', rollen: ['team'] };

function doc(teil: Partial<Vorgaenge> = {}): Vorgaenge {
  return {
    id: 42,
    nummer: 'SM24-T-2026-0042',
    art: 'termin',
    bereich: 'autoschluessel',
    prozess: 'termin-mit-anzahlung',
    status: 'neu',
    kundeInformieren: true,
    kontakt: { vorname: 'Erika', nachname: 'Muster', email: 'erika@example.org', telefon: '0301234567', plz: '60311', land: 'Deutschland' },
    zahlung: { umfang: 'anzahlung', betragCent: 6990, status: 'bezahlt' },
    auftragsweg: 'hauptzentrale',
    notizen: [],
    verlauf: [],
    mails: [],
    updatedAt: '2026-11-15T12:00:00.000Z',
    createdAt: '2026-11-15T10:00:00.000Z',
    ...teil,
  } as Vorgaenge;
}

const update = vi.fn();
function req(user: unknown = TEAM) {
  return {
    user,
    context: {} as Record<string, unknown>,
    payload: {
      update,
      find: vi.fn(),
      findGlobal: vi.fn(async () => {
        throw new Error('keine Einstellungen im Test');
      }),
      logger: { warn: vi.fn(), error: vi.fn() },
    },
  };
}

/** Beide Hooks in der Reihenfolge der Sammlung. */
function speichern(args: { data: Partial<Vorgaenge>; originalDoc?: Vorgaenge; operation?: string; req: ReturnType<typeof req> }) {
  const a = { operation: 'update', ...args };
  const erst = vorgangVorAenderung(a as never) as Partial<Vorgaenge>;
  return auftragswegVorAenderung({ ...a, data: erst } as never) as Partial<Vorgaenge>;
}

beforeEach(() => {
  update.mockReset();
  update.mockImplementation(async ({ data }: { data: Partial<Vorgaenge> }) => ({ ...doc(), ...data }));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Auftragsweg im Admin', () => {
  it('ändert den Weg nur mit Begründung und vermerkt alten und neuen Weg in den Notizen', () => {
    const original = doc();
    expect(() => speichern({ data: { ...original, auftragsweg: 'eigenbereich' }, originalDoc: original, req: req() })).toThrow(BEGRUENDUNG_FEHLT);
    const data = speichern({
      data: { ...original, auftragsweg: 'eigenbereich', auftragswegGrund: '  Kunde wohnt in Gießen, PLZ falsch eingegeben  ' },
      originalDoc: original,
      req: req(),
    });
    expect(data.notizen?.at(-1)?.text).toBe(
      'Auftragsweg von „Hauptzentrale (Werkstatt)“ auf „Regionaler Eigenbereich“ geändert: Kunde wohnt in Gießen, PLZ falsch eingegeben (Mina Saad).',
    );
    expect(data.auftragswegGrund).toBe('');
  });

  it('verlangt ohne Wechsel keine Begründung; Änderungen des Servers laufen ohne Prüfung', () => {
    const original = doc();
    expect(speichern({ data: { ...original, status: 'terminiert' }, originalDoc: original, req: req() }).auftragsweg).toBe('hauptzentrale');
    const system = auftragswegVorAenderung({ data: { auftragsweg: 'partner' }, originalDoc: original, operation: 'update', req: req(null) } as never);
    expect(system).toMatchObject({ auftragsweg: 'partner' });
  });
});

describe('Restbetrag', () => {
  it('berechnet den Rest aus Gesamtpreis und Zahlung bei jedem Speichern', () => {
    const original = doc();
    const data = speichern({ data: { ...original, restzahlung: { gesamtpreisCent: 24_900 } }, originalDoc: original, req: req() });
    expect(data.restzahlung?.restCent).toBe(17_910);
    // Auch ohne Benutzer (Zahlungseingang, Erstattung): Die Zahlung zählt nicht mehr, der Rest steigt.
    const erstattet = auftragswegVorAenderung({
      data: { zahlung: { umfang: 'anzahlung', betragCent: 6990, status: 'erstattet' } },
      originalDoc: doc({ restzahlung: { gesamtpreisCent: 24_900, restCent: 17_910 } }),
      operation: 'update',
      req: req(null),
    } as never) as Partial<Vorgaenge>;
    expect(erstattet.restzahlung?.restCent).toBe(24_900);
    // Offen oder fehlgeschlagen zählt nicht (Direktweg und Partnerweg).
    for (const status of ['offen', 'fehlgeschlagen'] as const) {
      const ohne = auftragswegVorAenderung({
        data: { zahlung: { umfang: 'anzahlung', betragCent: 6990, status } },
        originalDoc: doc({ restzahlung: { gesamtpreisCent: 24_900, restCent: 17_910 } }),
        operation: 'update',
        req: req(null),
      } as never) as Partial<Vorgaenge>;
      expect(ohne.restzahlung?.restCent).toBe(24_900);
    }
  });

  it('vermerkt „Rest bezahlt am“ mit Betrag und Zahlart', () => {
    const original = doc({ restzahlung: { gesamtpreisCent: 24_900, restCent: 17_910 } });
    const data = speichern({
      data: { ...original, restzahlung: { gesamtpreisCent: 24_900, restBezahltAm: '2026-11-22T10:00:00.000Z', restZahlart: 'karte' } },
      originalDoc: original,
      req: req(),
    });
    expect(data.notizen?.at(-1)?.text).toBe(`Rest über ${formatCents(17_910).replace(/ /g, ' ')} beim Termin mit Karte bezahlt vermerkt (Mina Saad).`);
  });
});

describe('Partner-Anfrage ohne Festpreis: Freigabe mit Zahlungslink über den Gesamtbetrag', () => {
  const anfrage = (teil: Partial<Vorgaenge> = {}) =>
    doc({
      art: 'anfrage',
      prozess: 'gefuehrte-anfrage',
      status: 'geprueft',
      auftragsweg: 'partner',
      daten: { auftragsweg: 'partner' },
      zahlung: undefined,
      ...teil,
    });

  it('legt mit Gesamtpreis und „Freigegeben“ die Zahlung über den Gesamtbetrag an und merkt die Mail vor', () => {
    const r = req();
    const original = anfrage();
    const data = speichern({ data: { ...original, status: 'freigegeben', restzahlung: { gesamtpreisCent: 31_900 } }, originalDoc: original, req: r });
    expect(data.zahlung).toMatchObject({ umfang: 'gesamt', betragCent: 31_900, status: 'offen' });
    // Noch nicht bezahlt: nichts angerechnet, Rest offen bis zum Zahlungseingang.
    expect(data.restzahlung?.restCent).toBe(31_900);
    expect(r.context['sm24Vorhaben:42']).toMatchObject({ statusMail: { status: 'freigegeben' } });
    expect(data.notizen?.map((n) => n.text)).toContain(`Zahlung über ${formatCents(31_900)} zur Freigabe angelegt (Mina Saad).`);
  });

  it('ohne Gesamtpreis keine Zahlung', () => {
    const original = anfrage();
    const data = speichern({ data: { ...original, status: 'freigegeben' }, originalDoc: original, req: req() });
    expect(data.zahlung).toBeUndefined();
  });

  it('eine gewöhnliche Autoschlüssel-Anfrage bekommt keine Zahlung', () => {
    const original = anfrage({ auftragsweg: null, daten: {} });
    const data = speichern({ data: { ...original, status: 'freigegeben', restzahlung: { gesamtpreisCent: 31_900 } }, originalDoc: original, req: req() });
    expect(data.zahlung).toBeUndefined();
  });

  it('schickt den persönlichen Zahlungslink über den Gesamtbetrag', async () => {
    vi.stubEnv('MAIL_PROVIDER', 'resend');
    vi.stubEnv('MAIL_API_KEY', 're_test');
    vi.stubEnv('MAIL_FROM_ADDRESS', 'info@schluesselmacher24.de');
    vi.stubEnv('VERCEL_ENV', '');
    vi.stubEnv('PAYMENT_PROVIDER', 'stripe');
    vi.stubEnv('PAYMENT_API_KEY', 'sk_test_x');
    vi.stubEnv('PAYMENT_WEBHOOK_SECRET', 'whsec_x');
    const mails: Array<{ betreff: string; text: string }> = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: RequestInit) => {
        const body = JSON.parse(init.body as string);
        mails.push({ betreff: body.subject, text: body.text });
        return new Response(JSON.stringify({ id: 're_9' }), { status: 200 });
      }),
    );
    const r = req();
    r.context['sm24Vorhaben:42'] = { statusMail: { status: 'freigegeben' } };
    const gespeichert = anfrage({ status: 'freigegeben', zahlung: { umfang: 'gesamt', betragCent: 31_900, status: 'offen' }, restzahlung: { gesamtpreisCent: 31_900, restCent: 0 } });
    await vorgangNachAenderung({ doc: gespeichert, operation: 'update', req: r } as never);
    expect(mails).toHaveLength(1);
    expect(mails[0].betreff).toBe('Ihr Auftrag SM24-T-2026-0042 ist freigegeben');
    expect(mails[0].text).toMatch(/\/bestellung\/42\?t=[\w-]+/);
    expect(mails[0].text).toContain('Partnerbetrieb in Ihrer Region');
    expect(mails[0].text.replace(/ /g, ' ')).toContain(formatCents(31_900).replace(/ /g, ' '));
  });
});

describe('Vorschlagsliste der passenden Partner', () => {
  it('nennt nur freigeschaltete Partner mit Modell B, passender Auftragsart und Postleitzahl, nur im Partnerweg', async () => {
    const r = req();
    r.payload.find = vi.fn(async () => ({
      docs: [
        { id: 1, firma: 'Schlüssel Main GmbH', ort: 'Frankfurt', status: 'freigeschaltet', abrechnungsmodell: 'B', einsatzgebiet: { postleitzahlen: '603*, 604*' }, auftragsarten: ['autoschluessel-vor-ort'] },
        { id: 2, firma: 'Zylinder Nord', ort: 'Kassel', status: 'freigeschaltet', abrechnungsmodell: 'B', einsatzgebiet: { postleitzahlen: '60*' }, auftragsarten: ['montage-zylinder'] },
        { id: 3, firma: 'Auto Süd', ort: 'Darmstadt', status: 'freigeschaltet', abrechnungsmodell: 'B', einsatzgebiet: { postleitzahlen: '64*' }, auftragsarten: ['autoschluessel-vor-ort'] },
        // Modell A: Der Kunde zahlt an den Partner; passt nicht zum Partnerweg (A-049 Nr. 8).
        { id: 4, firma: 'Main Schlüssel A', ort: 'Offenbach', status: 'freigeschaltet', abrechnungsmodell: 'A', einsatzgebiet: { postleitzahlen: '60*' }, auftragsarten: ['autoschluessel-vor-ort'] },
      ],
    }));
    const vorschlag = await partnerVorschlaege({ data: doc({ auftragsweg: 'partner' }), req: r } as never);
    expect(vorschlag).toBe('Schlüssel Main GmbH (Frankfurt)');
    expect(await partnerVorschlaege({ data: doc(), req: r } as never)).toBeNull();
  });
});
