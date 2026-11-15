import { describe, expect, it } from 'vitest';

import {
  MELDUNG,
  auszahlungsStand,
  partnerbetragCents,
  plattformanteilVorschlag,
  vermittlungZeilen,
  vermittlungsWechselPruefen,
  vermittlungWechselErlaubt,
  type VermittlungsWechsel,
} from './vermittlung';

/* FA-KERN-04: Stände bis „ausgezahlt“, Prüfung jedes Wechsels, Auszahlungsstand und Beträge. Erfundene Werte (G4, G13). */

const FREI = { status: 'freigeschaltet' as const, auftragsarten: ['autoschluessel-vor-ort'] };

function wechsel(teil: Partial<VermittlungsWechsel>): VermittlungsWechsel {
  return {
    von: 'geprueft',
    nach: 'partner-angefragt',
    zentraleZahlung: true,
    zahlung: { status: 'bezahlt', scope: 'gesamt' },
    partner: FREI,
    auftragsart: 'autoschluessel-vor-ort',
    gesamtCents: 30_000,
    plattformanteilCents: 3_000,
    ...teil,
  };
}

describe('Stände der Vermittlung in der Reihenfolge des Inhabers', () => {
  it('führt von „an Partner vermittelt“ bis „ausgezahlt“ und lässt keinen Schritt aus', () => {
    const weg = ['geprueft', 'partner-angefragt', 'angenommen', 'termin-bestaetigt', 'erledigt', 'kunde-bestaetigt', 'auszahlung-freigegeben', 'ausgezahlt'] as const;
    for (let i = 1; i < weg.length; i++) expect(vermittlungWechselErlaubt(weg[i - 1], weg[i])).toBe(true);
    expect(vermittlungWechselErlaubt('erledigt', 'ausgezahlt')).toBe(false);
    expect(vermittlungWechselErlaubt('kunde-bestaetigt', 'ausgezahlt')).toBe(false);
    expect(vermittlungWechselErlaubt('ausgezahlt', 'erledigt')).toBe(false);
    // Modell A bleibt gültig.
    expect(vermittlungWechselErlaubt('erledigt', 'provision-abgerechnet')).toBe(true);
  });
});

describe('Prüfung der Wechsel', () => {
  it('lehnt „an Partner vermittelt“ ohne Zahlung des Gesamtbetrags ab', () => {
    expect(vermittlungsWechselPruefen(wechsel({ zahlung: { status: 'offen', scope: 'gesamt' } }))).toBe(MELDUNG.ohneZahlung);
    expect(vermittlungsWechselPruefen(wechsel({ zahlung: { status: 'bezahlt', scope: 'anzahlung' } }))).toBe(MELDUNG.ohneZahlung);
    expect(vermittlungsWechselPruefen(wechsel({ zahlung: null }))).toBe(MELDUNG.ohneZahlung);
    expect(vermittlungsWechselPruefen(wechsel({}))).toBeNull();
  });

  it('lehnt pausierte, gesperrte und unpassende Partner ab', () => {
    expect(vermittlungsWechselPruefen(wechsel({ partner: { ...FREI, status: 'pausiert' } }))).toBe(MELDUNG.partnerGesperrt);
    expect(vermittlungsWechselPruefen(wechsel({ partner: { ...FREI, status: 'beendet' } }))).toBe(MELDUNG.partnerGesperrt);
    expect(vermittlungsWechselPruefen(wechsel({ partner: { ...FREI, auftragsarten: ['montage-zylinder'] } }))).toBe(MELDUNG.partnerGesperrt);
    expect(vermittlungsWechselPruefen(wechsel({ partner: null }))).toBe(MELDUNG.ohnePartner);
    // Pausiert, während der Auftrag läuft: nicht weiterführen.
    expect(vermittlungsWechselPruefen(wechsel({ von: 'partner-angefragt', nach: 'angenommen', partner: { ...FREI, status: 'pausiert' } }))).toBe(
      MELDUNG.partnerGesperrt,
    );
  });

  it('lehnt die Auszahlung vor der Kundenbestätigung ab und gibt ohne Kunde nur mit Grund frei', () => {
    expect(vermittlungsWechselPruefen(wechsel({ von: 'erledigt', nach: 'ausgezahlt' }))).toMatch(/nicht direkt/);
    expect(vermittlungsWechselPruefen(wechsel({ von: 'erledigt', nach: 'auszahlung-freigegeben' }))).toBe(MELDUNG.ohneGrund);
    expect(vermittlungsWechselPruefen(wechsel({ von: 'erledigt', nach: 'auszahlung-freigegeben', teamGrund: '   ' }))).toBe(MELDUNG.ohneGrund);
    expect(vermittlungsWechselPruefen(wechsel({ von: 'erledigt', nach: 'auszahlung-freigegeben', teamGrund: 'Kunde am Telefon bestätigt' }))).toBeNull();
    expect(vermittlungsWechselPruefen(wechsel({ von: 'kunde-bestaetigt', nach: 'auszahlung-freigegeben' }))).toBeNull();
    expect(vermittlungsWechselPruefen(wechsel({ von: 'auszahlung-freigegeben', nach: 'ausgezahlt' }))).toBeNull();
  });

  it('lässt „Kunde bestätigt“ nur den Kunden setzen', () => {
    expect(vermittlungsWechselPruefen(wechsel({ von: 'erledigt', nach: 'kunde-bestaetigt' }))).toBe(MELDUNG.nurKunde);
    expect(vermittlungsWechselPruefen(wechsel({ von: 'erledigt', nach: 'kunde-bestaetigt', durchKunde: true }))).toBeNull();
  });

  it('verlangt Beträge für „ausgeführt“ und sperrt die Auszahlung nach einer Erstattung', () => {
    expect(vermittlungsWechselPruefen(wechsel({ von: 'termin-bestaetigt', nach: 'erledigt', plattformanteilCents: null }))).toBe(MELDUNG.ohneBetraege);
    // Reihenfolge des Inhabers: bei zentraler Zahlung erst „Termin bestätigt“; ohne zentrale Zahlung (Modell A) direkt.
    expect(vermittlungsWechselPruefen(wechsel({ von: 'angenommen', nach: 'erledigt' }))).toBe(MELDUNG.ohneTermin);
    expect(vermittlungsWechselPruefen(wechsel({ von: 'angenommen', nach: 'erledigt', zentraleZahlung: false }))).toBeNull();
    // Ein erfasster Erstattungsbetrag sperrt auch bei Zahlungsstand „bezahlt“.
    expect(vermittlungsWechselPruefen(wechsel({ von: 'kunde-bestaetigt', nach: 'auszahlung-freigegeben', erstattetCents: 500 }))).toBe(MELDUNG.gesperrt);
    const erstattet = { status: 'teilweise-erstattet' as const, scope: 'gesamt' as const };
    expect(vermittlungsWechselPruefen(wechsel({ von: 'kunde-bestaetigt', nach: 'auszahlung-freigegeben', zahlung: erstattet }))).toBe(MELDUNG.gesperrt);
    expect(vermittlungsWechselPruefen(wechsel({ von: 'auszahlung-freigegeben', nach: 'ausgezahlt', zahlung: { status: 'erstattet', scope: 'gesamt' } }))).toBe(
      MELDUNG.gesperrt,
    );
  });
});

describe('Auszahlungsstand und Beträge', () => {
  it('leitet den Auszahlungsstand ab; eine Erstattung sperrt', () => {
    expect(auszahlungsStand('partner-angefragt', 'bezahlt', true)).toBe('offen');
    expect(auszahlungsStand('auszahlung-freigegeben', 'bezahlt', true)).toBe('freigegeben');
    expect(auszahlungsStand('ausgezahlt', 'bezahlt', true)).toBe('ausgezahlt');
    expect(auszahlungsStand('kunde-bestaetigt', 'teilweise-erstattet', true)).toBe('gesperrt');
    expect(auszahlungsStand('kunde-bestaetigt', 'bezahlt', true, 500)).toBe('gesperrt');
    expect(auszahlungsStand('ausgezahlt', 'erstattet', true)).toBe('ausgezahlt');
    expect(auszahlungsStand('erledigt', 'bezahlt', false)).toBeUndefined();
    expect(auszahlungsStand(undefined, 'bezahlt', true)).toBeUndefined();
  });

  it('rechnet den Partnerbetrag und schlägt den Plattformanteil nur mit hinterlegter Provision vor', () => {
    expect(partnerbetragCents(30_000, 4_500)).toBe(25_500);
    expect(partnerbetragCents(30_000, undefined)).toBeUndefined();
    expect(plattformanteilVorschlag({ modell: 'B', gesamtCents: 20_000, provision: { prozent: 10 }, modellBFreigegeben: true })).toEqual({ cents: 2_000 });
    expect(plattformanteilVorschlag({ modell: 'B', gesamtCents: 20_000, provision: undefined, modellBFreigegeben: true })).toEqual({
      hinweis: 'Für diese Auftragsart ist keine Provision hinterlegt.',
    });
  });

  it('zeigt Vermittlung, Auszahlung und Erstattung auf Vorgangsblatt und Druckansicht', () => {
    const zeilen = vermittlungZeilen({
      referral: { status: 'ausgezahlt', totalCents: 30_000, platformCents: 3_000, partnerCents: 27_000 },
      payout: { status: 'ausgezahlt', method: 'ueberweisung', reference: 'Beleg 7' },
    });
    expect(zeilen.map(([name]) => name)).toEqual([
      'Stand der Vermittlung',
      'Gesamtbetrag',
      'Plattformanteil',
      'Partnerbetrag',
      'Auszahlungsstand',
      'Weg der Auszahlung',
      'Beleg der Auszahlung',
    ]);
    expect(vermittlungZeilen({})).toEqual([]);
  });
});
