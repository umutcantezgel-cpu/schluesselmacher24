import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mailVerlaufText, MAILTEXT_HOECHSTENS, sendeVorlage } from '../../lib/mail/versand';
import { NACHRICHT_MELDUNG, NACHRICHT_VORLAGEN, nachrichtPruefen, vorlageFuer } from '../../lib/mail/nachricht-vorlagen';
import { kundenNachricht } from '../../lib/mail/vorlagen/nachricht';
import { vorgangZuSeite } from '../../lib/data/payload-mapping';
import type { Vorgaenge } from '../../payload-types';

import { MELDUNG_OHNE_BETRIEB, kundenNachrichtHandler } from './kunden-nachricht';

/* FA-KERN-05: Nachricht an den Kunden aus dem Vorgang mit Mailverlauf. Resend nur als Attrappe über einen
 * nachgebildeten `fetch` (G5), erfundene Testdaten (G4). */

const MITARBEITER = { id: 3, email: 'team@example.org', name: 'Mina Saad', rollen: ['mitarbeiter'] };

function vorgang(teil: Partial<Vorgaenge> = {}): Vorgaenge {
  return {
    id: 61,
    nummer: 'SM24-B-2026-0061',
    art: 'bestellung',
    bereich: 'schluessel-nach-code',
    prozess: 'shop-kauf',
    status: 'in-bearbeitung',
    kundeInformieren: true,
    kontakt: { vorname: 'Erika', nachname: 'Muster', email: 'erika@example.org', telefon: '0301234567', plz: '60311', land: 'Deutschland' },
    notizen: [],
    verlauf: [],
    mails: [],
    updatedAt: '2026-11-15T12:00:00.000Z',
    createdAt: '2026-11-15T10:00:00.000Z',
    ...teil,
  } as Vorgaenge;
}

const update = vi.fn();
function req(body: unknown, user: unknown = MITARBEITER, doc: Vorgaenge | null = vorgang()) {
  return {
    user,
    routeParams: { id: '61' },
    context: {},
    json: async () => body,
    payload: {
      update,
      findByID: vi.fn(async () => doc),
      findGlobal: vi.fn(async () => {
        throw new Error('keine Einstellungen im Test');
      }),
      logger: { warn: vi.fn(), error: vi.fn() },
    },
  } as never;
}

const gesendet: Array<{ to: string[]; subject: string; text: string }> = [];

beforeEach(() => {
  gesendet.length = 0;
  update.mockReset();
  update.mockImplementation(async ({ data }: { data: Partial<Vorgaenge> }) => ({ ...vorgang(), ...data }));
  vi.stubEnv('MAIL_PROVIDER', 'resend');
  vi.stubEnv('MAIL_API_KEY', 're_test');
  vi.stubEnv('MAIL_FROM_ADDRESS', 'info@schluesselmacher24.de');
  vi.stubEnv('VERCEL_ENV', '');
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit) => {
      gesendet.push(JSON.parse(init.body as string));
      return new Response(JSON.stringify({ id: 're_attrappe' }), { status: 200 });
    }),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Nachricht an den Kunden', () => {
  it('sendet über den Mailweg und hält Betreff und vollständigen Text im Verlauf lesbar', async () => {
    const text = 'zu Ihrem Auftrag haben wir eine kurze Frage:\n\nWelche Farbe soll der Anhänger haben?';
    const antwort = await kundenNachrichtHandler(req({ betreff: 'Rückfrage zu Ihrem Auftrag', text }));
    expect(antwort.status).toBe(200);
    expect(gesendet).toHaveLength(1);
    expect(gesendet[0].to).toEqual(['erika@example.org']);
    expect(gesendet[0].subject).toBe('Rückfrage zu Ihrem Auftrag');
    expect(gesendet[0].text).toContain('Welche Farbe soll der Anhänger haben?');

    const geschrieben = update.mock.calls[0][0].data as Partial<Vorgaenge>;
    const mail = geschrieben.mails?.at(-1);
    expect(mail).toMatchObject({ art: 'nachricht', an: 'erika@example.org', ergebnis: 'gesendet', betreff: 'Rückfrage zu Ihrem Auftrag' });
    expect(mail?.am).toBeTruthy();
    // Der gespeicherte Text ist genau der Text, der hinausging.
    expect(mail?.text).toBe(gesendet[0].text);
    expect(geschrieben.notizen?.at(-1)?.text).toContain('Nachricht „Rückfrage zu Ihrem Auftrag“ an den Kunden gesendet (Mina Saad)');

    // Beim Lesen und erneuten Schreiben des Protokolls bleibt der Text erhalten.
    const wieder = vorgangZuSeite({ ...vorgang(), mails: geschrieben.mails } as Vorgaenge);
    expect(wieder.mailLog?.at(-1)).toMatchObject({ kind: 'nachricht', subject: 'Rückfrage zu Ihrem Auftrag', body: gesendet[0].text });
  });

  it('hält auch eine gescheiterte Nachricht mit Text im Verlauf fest', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ message: 'kaputt' }), { status: 500 })));
    const antwort = await kundenNachrichtHandler(req({ betreff: 'Termin', text: 'leider müssen wir verschieben.' }));
    expect(antwort.status).toBe(502);
    const mail = (update.mock.calls[0][0].data as Partial<Vorgaenge>).mails?.at(-1);
    expect(mail).toMatchObject({ art: 'nachricht', ergebnis: 'fehlgeschlagen', betreff: 'Termin' });
    expect(mail?.text).toContain('leider müssen wir verschieben.');
  });

  it('setzt bei der Vorlage „Ihr ausführender Betrieb“ Firma und Ort des Partnerbetriebs ein (FA-07-03)', async () => {
    const vorlage = vorlageFuer('ausfuehrender-betrieb', 'SM24-B-2026-0061')!;
    const mitBetrieb = vorgang({ vermittlung: { status: 'angenommen', partnerbetrieb: 7 } });
    const r = req(vorlage, MITARBEITER, mitBetrieb) as unknown as { payload: { findByID: ReturnType<typeof vi.fn> } };
    r.payload.findByID = vi.fn(async ({ collection }: { collection: string }) =>
      collection === 'partnerbetriebe' ? { id: 7, firma: 'Testbetrieb Mitte GmbH', ort: 'Gießen' } : mitBetrieb,
    );
    const antwort = await kundenNachrichtHandler(r as never);
    expect(antwort.status).toBe(200);
    expect(gesendet[0].subject).toBe('Ihr ausführender Betrieb (SM24-B-2026-0061)');
    expect(gesendet[0].text).toContain('Testbetrieb Mitte GmbH, Gießen');
    expect(gesendet[0].text).not.toContain('{firma}');
    const mail = (update.mock.calls[0][0].data as Partial<Vorgaenge>).mails?.at(-1);
    expect(mail?.text).toContain('Testbetrieb Mitte GmbH, Gießen');

    // Ohne Partnerbetrieb am Vorgang geht die Vorlage nicht hinaus.
    gesendet.length = 0;
    const ohne = await kundenNachrichtHandler(req(vorlage));
    expect(ohne.status).toBe(400);
    expect(((await ohne.json()) as { error: string }).error).toBe(MELDUNG_OHNE_BETRIEB);
    expect(gesendet).toHaveLength(0);
  });

  it('prüft Anmeldung, Rolle, Eingabe und Mailanbindung, bevor etwas hinausgeht', async () => {
    expect((await kundenNachrichtHandler(req({ betreff: 'a', text: 'b' }, null))).status).toBe(401);
    expect((await kundenNachrichtHandler(req({ betreff: 'a', text: 'b' }, { id: 9, rollen: ['partner'] }))).status).toBe(403);
    expect((await kundenNachrichtHandler(req({ betreff: '', text: 'b' }))).status).toBe(400);
    expect((await kundenNachrichtHandler(req({ betreff: 'a\nBcc: x@example.org', text: 'b' }))).status).toBe(400);
    expect((await kundenNachrichtHandler(req({ betreff: 'a', text: 'b' }, MITARBEITER, null))).status).toBe(404);
    vi.stubEnv('MAIL_PROVIDER', '');
    vi.stubEnv('MAIL_API_KEY', '');
    expect((await kundenNachrichtHandler(req({ betreff: 'a', text: 'b' }))).status).toBe(409);
    expect(gesendet).toHaveLength(0);
    expect(update).not.toHaveBeenCalled();
  });
});

describe('Vorlagen und Prüfung', () => {
  it('hat die fünf Vorlagen, kurz und ohne Gedankenstriche, mit Vorgangsnummer', () => {
    expect(NACHRICHT_VORLAGEN.map((v) => v.id)).toEqual(['rueckfrage', 'unterlagen-fehlen', 'termin-verschieben', 'abholung-bereit', 'ausfuehrender-betrieb']);
    for (const v of NACHRICHT_VORLAGEN) {
      expect(`${v.betreff} ${v.text}`, v.id).not.toMatch(/[–—]| - /);
      expect(nachrichtPruefen(v.betreff, v.text), v.id).toBeNull();
      expect(v.text.length).toBeLessThan(400);
    }
    expect(vorlageFuer('rueckfrage', 'SM24-B-2026-0061')?.betreff).toBe('Rückfrage zu Ihrem Auftrag SM24-B-2026-0061');
    expect(vorlageFuer('gibt-es-nicht', 'x')).toBeUndefined();
  });

  it('lehnt leere, zu lange oder mehrzeilige Betreffs ab', () => {
    expect(nachrichtPruefen('', 'Text')).toBe(NACHRICHT_MELDUNG.betreff);
    expect(nachrichtPruefen('Betreff', '  ')).toBe(NACHRICHT_MELDUNG.text);
    expect(nachrichtPruefen('a\r\nb', 'Text')).toBe(NACHRICHT_MELDUNG.zeilenumbruch);
    expect(nachrichtPruefen('x'.repeat(151), 'Text')).toBe(NACHRICHT_MELDUNG.betreffLang);
    expect(nachrichtPruefen('Betreff', 'x'.repeat(5001))).toBe(NACHRICHT_MELDUNG.textLang);
  });

  it('baut die Mail mit Anrede, Absätzen und Vorgangsnummer', () => {
    const inhalt = kundenNachricht({
      vorgang: vorgangZuSeite(vorgang()),
      kontext: { site: 'https://www.schluesselmacher24.de' } as never,
      betreff: ' Abholung ',
      text: 'Ihr Auftrag ist fertig.\n\nBitte Ausweis mitbringen.',
    });
    expect(inhalt.betreff).toBe('Abholung');
    expect(inhalt.text).toContain('Ihr Auftrag ist fertig.');
    expect(inhalt.text).toContain('Bitte Ausweis mitbringen.');
    expect(inhalt.text).toContain('SM24-B-2026-0061');
    expect(inhalt.html).toContain('Bitte Ausweis mitbringen.');
  });
});

describe('Mailverlauf jeder Mail', () => {
  it('speichert bei jeder Vorlage Betreff und Text, auch ohne Mailanbindung', async () => {
    vi.stubEnv('MAIL_PROVIDER', '');
    vi.stubEnv('MAIL_API_KEY', '');
    const eintrag = await sendeVorlage({ art: 'status', an: 'erika@example.org', inhalt: { betreff: 'Status', text: 'Ihr Auftrag ist unterwegs.', html: '<p>x</p>' } as never });
    expect(eintrag).toMatchObject({ kind: 'status', subject: 'Status', body: 'Ihr Auftrag ist unterwegs.' });
  });

  it('kürzt sehr lange Texte sichtbar', () => {
    const lang = mailVerlaufText({ betreff: 'Vertrag', text: 'x'.repeat(MAILTEXT_HOECHSTENS + 10) });
    expect(lang.body?.length).toBeLessThan(MAILTEXT_HOECHSTENS + 30);
    expect(lang.body).toMatch(/\[Text gekürzt\]$/);
    expect(mailVerlaufText(undefined)).toEqual({});
  });
});
