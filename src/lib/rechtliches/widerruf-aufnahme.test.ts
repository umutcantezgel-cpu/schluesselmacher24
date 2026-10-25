import { describe, expect, it, vi } from 'vitest';

import { echteEinstellungen } from './test-hilfen';
import {
  WIDERRUF_ERKLAERUNG,
  gleicheEmail,
  widerrufAufnehmen,
  type WiderrufBestaetigung,
  type WiderrufDatensatz,
  type WiderrufUmgebung,
} from './widerruf-aufnahme';

const JETZT = new Date('2026-10-24T12:30:05.000Z');
const VORGANG = { id: '42', reference: 'SM24-B-2026-0042', contact: { email: 'Erika@Example.org' } };

function umgebung(anpassen: Partial<WiderrufUmgebung> = {}) {
  const gespeichert: WiderrufDatensatz[] = [];
  const bestaetigungen: Array<{ id: number | string; bestaetigung: WiderrufBestaetigung }> = [];
  const notizen: Array<{ vorgangId: string; notiz: string }> = [];
  const mails: WiderrufDatensatz[] = [];
  const betrieb: Array<{ datensatz: WiderrufDatensatz; id: number | string }> = [];
  const u: WiderrufUmgebung = {
    mitDatenbank: true,
    firma: echteEinstellungen().company,
    jetzt: () => JETZT,
    vorgangFinden: async (nummer) => (nummer === VORGANG.reference ? VORGANG : null),
    speichern: async (datensatz) => {
      gespeichert.push(datensatz);
      return { id: gespeichert.length };
    },
    bestaetigungVermerken: async (id, bestaetigung) => {
      bestaetigungen.push({ id, bestaetigung });
    },
    bestaetigungSenden: async (datensatz) => {
      mails.push(datensatz);
      return { ergebnis: 'gesendet', anbieterId: 're_123' };
    },
    betriebInformieren: async (datensatz, id) => {
      betrieb.push({ datensatz, id });
    },
    vorgangVermerken: async (vorgangId, notiz) => {
      notizen.push({ vorgangId, notiz });
    },
    ...anpassen,
  };
  return { u, gespeichert, bestaetigungen, notizen, mails, betrieb };
}

const eingabe = {
  name: 'Erika Muster',
  email: 'erika@example.org',
  vorgangsnummer: 'sm24-b-2026-0042',
  erklaerung: 'Bestellung vom 20.10.',
};

describe('widerrufAufnehmen', () => {
  it('speichert die Erklärung mit Eingangszeit und ordnet sie bei passender Nummer und E-Mail zu', async () => {
    const { u, gespeichert, bestaetigungen, notizen, mails, betrieb } = umgebung();
    const ergebnis = await widerrufAufnehmen(eingabe, u);

    expect(ergebnis).toEqual({
      status: 'eingegangen',
      eingangAm: JETZT.toISOString(),
      name: 'Erika Muster',
      email: 'erika@example.org',
      vorgangsnummer: 'SM24-B-2026-0042',
      mailGesendet: true,
    });
    expect(gespeichert).toEqual([
      {
        name: 'Erika Muster',
        email: 'erika@example.org',
        vorgangsnummer: 'SM24-B-2026-0042',
        eingegangenAm: JETZT.toISOString(),
        erklaerung: `${WIDERRUF_ERKLAERUNG}\n\nBestellung vom 20.10.`,
        vorgang: 42,
        zuordnung: 'zugeordnet',
        bearbeitet: false,
      },
    ]);
    expect(notizen).toHaveLength(1);
    expect(notizen[0].vorgangId).toBe('42');
    expect(mails[0]).toMatchObject({ email: 'erika@example.org', eingegangenAm: JETZT.toISOString() });
    expect(bestaetigungen).toEqual([{ id: 1, bestaetigung: { ergebnis: 'gesendet', am: JETZT.toISOString(), anbieterId: 're_123' } }]);
    // Meldung an den Betrieb mit der gespeicherten Erklärung.
    expect(betrieb).toEqual([{ datensatz: gespeichert[0], id: 1 }]);
  });

  it('ordnet bei fremder E-Mail nicht zu, speichert aber und antwortet gleich', async () => {
    const { u, gespeichert, notizen } = umgebung();
    const ergebnis = await widerrufAufnehmen({ ...eingabe, email: 'fremd@example.org' }, u);
    expect(ergebnis.status).toBe('eingegangen');
    expect(gespeichert[0].zuordnung).toBe('zu-pruefen');
    expect(gespeichert[0].vorgang).toBeUndefined();
    expect(notizen).toHaveLength(0);
  });

  it('verrät nicht, ob es eine Vorgangsnummer gibt', async () => {
    const vorhanden = await widerrufAufnehmen({ ...eingabe, email: 'fremd@example.org' }, umgebung().u);
    const unbekannt = await widerrufAufnehmen({ ...eingabe, email: 'fremd@example.org', vorgangsnummer: 'SM24-B-2026-9999' }, umgebung().u);
    // Bis auf die (eingegebene) Nummer selbst sind beide Antworten gleich.
    expect({ ...vorhanden, vorgangsnummer: undefined }).toEqual({ ...unbekannt, vorgangsnummer: undefined });
  });

  it('nimmt Erklärungen ohne Vorgangsnummer zur Prüfung an', async () => {
    const { u, gespeichert } = umgebung();
    const vorgangFinden = vi.spyOn(u, 'vorgangFinden');
    const ergebnis = await widerrufAufnehmen({ name: 'Erika Muster', email: 'erika@example.org', vorgangsnummer: '', erklaerung: '' }, u);
    expect(ergebnis.status).toBe('eingegangen');
    expect(vorgangFinden).not.toHaveBeenCalled();
    expect(gespeichert[0]).toMatchObject({ zuordnung: 'zu-pruefen', erklaerung: WIDERRUF_ERKLAERUNG });
    expect(gespeichert[0].vorgangsnummer).toBeUndefined();
  });

  it('meldet ungültige Eingaben je Feld und speichert nichts', async () => {
    const { u, gespeichert } = umgebung();
    const ergebnis = await widerrufAufnehmen({ name: '', email: 'keine-adresse', erklaerung: 'x'.repeat(2001) }, u);
    expect(ergebnis).toEqual({
      status: 'ungueltig',
      fehler: {
        name: 'Bitte geben Sie Ihren Namen an.',
        email: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
        erklaerung: 'Der Text ist zu lang (höchstens 2000 Zeichen).',
      },
    });
    expect(gespeichert).toHaveLength(0);
  });

  it('nennt ohne Datenbank die E-Mail-Adresse statt zu speichern', async () => {
    const { u, gespeichert, mails } = umgebung({ mitDatenbank: false });
    expect(await widerrufAufnehmen(eingabe, u)).toEqual({ status: 'ohne-speicher', email: 'info@schluesselmacher24.de' });
    expect(gespeichert).toHaveLength(0);
    expect(mails).toHaveLength(0);
  });

  it('bleibt bei einem Mailfehler beim Ergebnis „eingegangen“ und vermerkt den Fehler', async () => {
    const { u, bestaetigungen } = umgebung({
      bestaetigungSenden: async () => {
        throw new Error('Resend nicht erreichbar');
      },
    });
    const ergebnis = await widerrufAufnehmen(eingabe, u);
    expect(ergebnis).toMatchObject({ status: 'eingegangen', mailGesendet: false });
    expect(bestaetigungen[0].bestaetigung).toEqual({ ergebnis: 'fehlgeschlagen', am: JETZT.toISOString(), fehler: 'Resend nicht erreichbar' });
  });

  it('vermerkt „nicht eingerichtet“, wenn kein Mailversand angebunden ist', async () => {
    const { u, bestaetigungen } = umgebung({
      bestaetigungSenden: async () => ({ ergebnis: 'nicht-eingerichtet' }),
    });
    expect(await widerrufAufnehmen(eingabe, u)).toMatchObject({ status: 'eingegangen', mailGesendet: false });
    expect(bestaetigungen[0].bestaetigung).toEqual({ ergebnis: 'nicht-eingerichtet', am: JETZT.toISOString() });
  });

  it('speichert auch, wenn die Vorgangssuche scheitert, und meldet Speicherfehler mit Ausweichweg', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const suche = umgebung({
      vorgangFinden: async () => {
        throw new Error('DB weg');
      },
    });
    expect((await widerrufAufnehmen(eingabe, suche.u)).status).toBe('eingegangen');
    expect(suche.gespeichert[0].zuordnung).toBe('zu-pruefen');

    const speicher = umgebung({
      speichern: async () => {
        throw new Error('DB weg');
      },
    });
    const ergebnis = await widerrufAufnehmen(eingabe, speicher.u);
    expect(ergebnis.status).toBe('fehler');
    expect(ergebnis.status === 'fehler' && ergebnis.meldung).toContain('info@schluesselmacher24.de');
    expect(speicher.mails).toHaveLength(0);
    expect(speicher.betrieb).toHaveLength(0);
    vi.restoreAllMocks();
  });

  it('bleibt „eingegangen“, wenn die Meldung an den Betrieb scheitert', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { u } = umgebung({
      betriebInformieren: async () => {
        throw new Error('Resend nicht erreichbar');
      },
    });
    expect(await widerrufAufnehmen(eingabe, u)).toMatchObject({ status: 'eingegangen', mailGesendet: true });
    vi.restoreAllMocks();
  });
});

describe('Hilfen', () => {
  it('vergleicht E-Mail-Adressen ohne Groß- und Kleinschreibung', () => {
    expect(gleicheEmail(' Erika@Example.org', 'erika@example.org')).toBe(true);
    expect(gleicheEmail('erika@example.org', 'erik@example.org')).toBe(false);
  });
});
