import { describe, expect, it } from 'vitest';

import {
  abschnitteAlsText,
  agbAbschnitte,
  ausschlussSonderanfertigung,
  musterWiderrufsformular,
  widerrufsbelehrung,
  widerrufsadressat,
  type RechtsAbschnitt,
} from './texte';
import { echteEinstellungen, platzhalterEinstellungen } from './test-hilfen';

const SITE = 'https://schluesselmacher24.de';
const text = (abschnitte: RechtsAbschnitt[]) => abschnitteAlsText(abschnitte);

describe('Widerrufsbelehrung', () => {
  const firma = echteEinstellungen().company;

  it('lässt die Frist bei Waren mit dem Erhalt beginnen', () => {
    const belehrung = text(widerrufsbelehrung('waren', firma, SITE));
    expect(belehrung).toContain('ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.');
    expect(belehrung).toContain('Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.');
    expect(belehrung).not.toContain('Dienstleistungen während der Widerrufsfrist');
  });

  it('lässt die Frist bei Dienstleistungen mit dem Vertragsschluss beginnen und nennt den Wertersatz', () => {
    const belehrung = text(widerrufsbelehrung('dienstleistung', firma, SITE));
    expect(belehrung).toContain('ab dem Tag des Vertragsabschlusses');
    expect(belehrung).toContain('Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen soll');
    expect(belehrung).not.toContain('Rücksendung der Waren');
  });

  it('nennt den Widerrufsadressaten vollständig und den Online-Widerruf', () => {
    expect(widerrufsadressat(firma)).toBe(
      'SCHLÜSSELMACHER24 – Inhaber Mina Saad, Gloelstraße 11, 35576 Wetzlar, Telefon 06441 8056279, E-Mail info@schluesselmacher24.de',
    );
    expect(text(widerrufsbelehrung('waren', firma, SITE))).toContain(`${SITE}/rechtliches/widerruf/erklaeren`);
  });

  it('schließt das Widerrufsrecht für Anfertigungen nach Kundenangabe aus (§ 312g Abs. 2 Nr. 1 BGB)', () => {
    const ausschluss = text([ausschlussSonderanfertigung()]);
    expect(ausschluss).toContain('§ 312g Abs. 2 Nr. 1 BGB');
    expect(ausschluss).toContain('nach dem von Ihnen angegebenen Code');
    expect(ausschluss).toContain('gleichschließende Zylinder');
  });

  it('richtet das Muster-Widerrufsformular an den Anbieter mit E-Mail', () => {
    const formular = text([musterWiderrufsformular(firma)]);
    expect(formular).toContain('– An SCHLÜSSELMACHER24 – Inhaber Mina Saad, Gloelstraße 11, 35576 Wetzlar, E-Mail info@schluesselmacher24.de:');
    expect(formular).toContain('(*) Unzutreffendes streichen.');
  });

  it('zeigt bei Platzhalter-Firmendaten keine Platzhalter', () => {
    const platzhalter = platzhalterEinstellungen().company;
    const alles = text([
      ...widerrufsbelehrung('waren', platzhalter, SITE),
      ...widerrufsbelehrung('dienstleistung', platzhalter, SITE),
      musterWiderrufsformular(platzhalter),
    ]);
    expect(alles).not.toContain('[');
    expect(alles).toContain('SCHLÜSSELMACHER24');
  });
});

describe('AGB', () => {
  const settings = echteEinstellungen();

  it('nennt die konfigurierten Zahlarten und Stripe', () => {
    const agb = text(agbAbschnitte({ settings, zahlarten: ['PayPal', 'Klarna'], siteUrl: SITE }));
    expect(agb).toContain('Stripe Payments Europe');
    expect(agb).toContain('– PayPal');
    expect(agb).not.toContain('Überweisung nach Rechnung oder vor Ort');
  });

  it('nennt ohne Online-Zahlung Überweisung oder Zahlung vor Ort', () => {
    const agb = text(agbAbschnitte({ settings, zahlarten: null, siteUrl: SITE }));
    expect(agb).toContain('Die Zahlung erfolgt per Überweisung nach Rechnung oder vor Ort.');
    expect(agb).not.toContain('Stripe');
  });

  it('liefert nur nach Deutschland und nennt Lieferzeiten nur, wenn gepflegt', () => {
    const ohne = text(agbAbschnitte({ settings, zahlarten: null, siteUrl: SITE }));
    expect(ohne).toContain('ausschließlich an Lieferanschriften in Deutschland');
    expect(ohne).not.toContain('Es gelten folgende Lieferzeiten');

    const mit = text(
      agbAbschnitte({
        settings: {
          ...settings,
          shipping: settings.shipping.map((option, index) => (index === 0 ? { ...option, deliveryTime: '2–4 Werktage' } : option)),
        },
        zahlarten: null,
        siteUrl: SITE,
      }),
    );
    expect(mit).toContain(`– ${settings.shipping[0].label}: 2–4 Werktage`);
  });

  it('verrechnet die Anzahlung und erfindet keine Fristen für Absagen', () => {
    const agb = text(agbAbschnitte({ settings, zahlarten: null, siteUrl: SITE }));
    expect(agb).toContain('Die Anzahlung wird vollständig mit dem Endpreis verrechnet.');
    expect(agb).toContain('richtet sich nach der individuellen Vereinbarung');
    expect(agb).toContain('19 %');
    expect(agb).toContain('Langgasse 70, 35576 Wetzlar');
  });

  it('ist durchnummeriert und enthält Firmendaten nur aus den Einstellungen', () => {
    const abschnitte = agbAbschnitte({ settings, zahlarten: null, siteUrl: SITE });
    abschnitte.forEach((abschnitt, index) => expect(abschnitt.ueberschrift.startsWith(`§ ${index + 1} `)).toBe(true));
    expect(text(abschnitte)).not.toContain(settings.company.taxNumber!);

    const platzhalter = text(agbAbschnitte({ settings: platzhalterEinstellungen(), zahlarten: null, siteUrl: SITE }));
    expect(platzhalter).not.toContain('[');
  });
});

describe('abschnitteAlsText', () => {
  it('setzt Überschriften, Absätze und Aufzählungen als Text', () => {
    expect(
      abschnitteAlsText([
        { id: 'a', ueberschrift: 'Titel', ebene: 2, absaetze: ['Satz.', { liste: ['eins', 'zwei'] }] },
        { id: 'b', ueberschrift: 'Unterpunkt', ebene: 3, absaetze: ['Mehr.'] },
      ]),
    ).toBe('TITEL\n\nSatz.\n\n– eins\n– zwei\n\n\nUnterpunkt\n\nMehr.');
  });
});
