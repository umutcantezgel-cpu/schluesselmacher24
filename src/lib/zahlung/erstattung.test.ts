import { describe, expect, it, vi } from 'vitest';

import {
  ERSTATTUNG_AUSLOESEN_AUS,
  STORNO_MELDUNG,
  belegPflicht,
  erstattungAusloesenAktiv,
  erstattungBeimZahlungsdienst,
  stornoPruefen,
  stripeZahlungsLink,
  zahlungsstandText,
} from './erstattung';

/* FA-KERN-05: Zahlungsstand in einem Satz, Storno-Entscheidung und der vorbereitete, abgeschaltete Knopf
 * „Erstattung beim Zahlungsdienst auslösen“. Der Zahlungsdienst ist nur eine Attrappe (G5). */

describe('Zahlungsstand', () => {
  it('nennt bezahlt, teilweise erstattet mit Betrag und erstattet eindeutig', () => {
    expect(zahlungsstandText({ status: 'bezahlt', betragCent: 4_000 })).toMatch(/^Bezahlt: 40,00\s€\.$/);
    expect(zahlungsstandText({ status: 'teilweise-erstattet', betragCent: 4_000, erstattetCent: 1_500 })).toMatch(
      /^Teilweise erstattet: 15,00\s€ von 40,00\s€\. Es bleiben 25,00\s€\.$/,
    );
    expect(zahlungsstandText({ status: 'erstattet', betragCent: 4_000, erstattetCent: 4_000 })).toMatch(/^Erstattet: 40,00\s€\.$/);
    expect(zahlungsstandText({ status: 'offen', betragCent: 990 })).toMatch(/^Offen: 9,90\s€ noch nicht bezahlt\.$/);
    expect(zahlungsstandText({ status: null })).toBeNull();
  });

  it('kommt ohne Gedankenstriche aus', () => {
    for (const status of ['offen', 'bezahlt', 'fehlgeschlagen', 'teilweise-erstattet', 'erstattet'] as const) {
      expect(zahlungsstandText({ status, betragCent: 1_000, erstattetCent: 200 })).not.toMatch(/[–—]/);
    }
  });
});

describe('Storno einer eingegangenen Zahlung', () => {
  const pruefen = (k: Partial<Parameters<typeof stornoPruefen>[0]>) =>
    stornoPruefen({ zahlungVorher: 'bezahlt', zahlungNachher: 'bezahlt', entscheidung: null, grund: null, ...k });

  it('verlangt eine Entscheidung', () => {
    expect(pruefen({})).toBe(STORNO_MELDUNG.entscheidung);
    expect(pruefen({ zahlungVorher: 'teilweise-erstattet', zahlungNachher: 'teilweise-erstattet' })).toBe(STORNO_MELDUNG.entscheidung);
  });

  it('prüft jede Entscheidung gegen den Stand nach dem Speichern', () => {
    expect(pruefen({ entscheidung: 'keine' })).toBe(STORNO_MELDUNG.grund);
    expect(pruefen({ entscheidung: 'keine', grund: 'Ware gefertigt' })).toBeNull();
    expect(pruefen({ entscheidung: 'ganz' })).toBe(STORNO_MELDUNG.ganz);
    expect(pruefen({ entscheidung: 'ganz', zahlungNachher: 'erstattet' })).toBeNull();
    expect(pruefen({ entscheidung: 'teilweise' })).toBe(STORNO_MELDUNG.teilweise);
    expect(pruefen({ entscheidung: 'teilweise', zahlungNachher: 'teilweise-erstattet' })).toBeNull();
  });

  it('braucht keine Entscheidung ohne eingegangenes Geld oder wenn schon alles erstattet ist', () => {
    expect(pruefen({ zahlungVorher: 'offen', zahlungNachher: 'offen' })).toBeNull();
    expect(pruefen({ zahlungVorher: null, zahlungNachher: null })).toBeNull();
    expect(pruefen({ zahlungVorher: 'erstattet', zahlungNachher: 'erstattet' })).toBeNull();
  });
});

describe('Erstattung beim Zahlungsdienst (vorbereitet, abgeschaltet)', () => {
  const auftrag = { nummer: 'SM24-B-2026-0051', zahlungsKennung: 'pi_test123', betragCents: 1_500, gezahltCents: 4_000 };

  it('ist ohne Schalter aus und ruft den Zahlungsdienst nie auf', async () => {
    const erstatten = vi.fn(async () => ({ id: 're_attrappe' }));
    expect(erstattungAusloesenAktiv(undefined)).toBe(false);
    expect(erstattungAusloesenAktiv('ja')).toBe(false);
    expect(await erstattungBeimZahlungsdienst(auftrag, { schalter: '', erstatten })).toEqual({ ok: false, meldung: ERSTATTUNG_AUSLOESEN_AUS });
    expect(erstatten).not.toHaveBeenCalled();
    expect(ERSTATTUNG_AUSLOESEN_AUS).toContain('Stripe-Dashboard');
  });

  it('mit Schalter: nur gültige Kennung und Betrag bis zur Zahlung, mit Idempotenz-Schlüssel (Attrappe)', async () => {
    const erstatten = vi.fn(async () => ({ id: 're_attrappe' }));
    const an = { schalter: 'stripe', erstatten };
    expect((await erstattungBeimZahlungsdienst({ ...auftrag, zahlungsKennung: null }, an)).ok).toBe(false);
    expect((await erstattungBeimZahlungsdienst({ ...auftrag, betragCents: 5_000 }, an)).ok).toBe(false);
    expect((await erstattungBeimZahlungsdienst({ ...auftrag, betragCents: 0 }, an)).ok).toBe(false);
    expect(erstatten).not.toHaveBeenCalled();
    expect(await erstattungBeimZahlungsdienst(auftrag, an)).toEqual({ ok: true, referenz: 're_attrappe' });
    expect(erstatten).toHaveBeenCalledWith({ zahlungsKennung: 'pi_test123', betragCents: 1_500, idempotenz: 'erstattung-SM24-B-2026-0051-1500' });
    const abgelehnt = await erstattungBeimZahlungsdienst(auftrag, { schalter: 'stripe', erstatten: vi.fn(async () => Promise.reject(new Error('nein'))) });
    expect(abgelehnt.ok).toBe(false);
  });

  it('verweist nur für eine gültige Zahlungskennung ins Dashboard', () => {
    expect(stripeZahlungsLink('pi_test123')).toBe('https://dashboard.stripe.com/payments/pi_test123');
    expect(stripeZahlungsLink('pi_test123', true)).toBe('https://dashboard.stripe.com/test/payments/pi_test123');
    expect(stripeZahlungsLink('javascript:alert(1)')).toBeNull();
    expect(stripeZahlungsLink(null)).toBeNull();
  });

  it('verlangt einen Beleg nur außerhalb des Zahlungsdienstes', () => {
    expect(belegPflicht('zahlungsdienst')).toBe(false);
    expect(belegPflicht('ueberweisung')).toBe(true);
    expect(belegPflicht('bar')).toBe(true);
    expect(belegPflicht('sonstige')).toBe(true);
  });
});
