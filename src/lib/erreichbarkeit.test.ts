import { describe, expect, it } from 'vitest';

import { ERREICHBARKEIT_STANDARD, erreichbarkeit, erreichbarkeitSatz } from './erreichbarkeit';
import { echteEinstellungen, platzhalterEinstellungen } from './rechtliches/test-hilfen';

describe('Erreichbarkeit (FA-23)', () => {
  it('steht in den Inhalten im Wortlaut des Inhabers', () => {
    expect(erreichbarkeit(echteEinstellungen())).toEqual({
      kernaussage: '24 Stunden erreichbar',
      zeilen: ['Notdienst rund um die Uhr', 'Werkstatt und persönliche Beratung nach Terminvereinbarung'],
      rundUmDieUhr: true,
    });
  });

  it('nimmt ohne gepflegte Angabe den Standard (ältere Stände, Rückfall)', () => {
    expect(erreichbarkeit(platzhalterEinstellungen())).toEqual(ERREICHBARKEIT_STANDARD);
    expect(erreichbarkeit({ reachability: { kernaussage: '  ', zeilen: ['x'], rundUmDieUhr: false } })).toEqual(ERREICHBARKEIT_STANDARD);
  });

  it('übernimmt gepflegte Angaben und lässt leere Zeilen weg', () => {
    expect(erreichbarkeit({ reachability: { kernaussage: ' Am Telefon erreichbar ', zeilen: [' Termine nach Absprache ', ' '], rundUmDieUhr: false } })).toEqual({
      kernaussage: 'Am Telefon erreichbar',
      zeilen: ['Termine nach Absprache'],
      rundUmDieUhr: false,
    });
  });

  it('setzt alles zu einem Satz für Fließtext zusammen', () => {
    expect(erreichbarkeitSatz(ERREICHBARKEIT_STANDARD)).toBe(
      '24 Stunden erreichbar. Notdienst rund um die Uhr. Werkstatt und persönliche Beratung nach Terminvereinbarung.',
    );
  });

  it('verspricht kein rund um die Uhr geöffnetes Ladenlokal', () => {
    expect(erreichbarkeitSatz(ERREICHBARKEIT_STANDARD)).not.toMatch(/geöffnet|Ladenlokal|ohne Termin/);
    expect(ERREICHBARKEIT_STANDARD.zeilen.join(' ')).toMatch(/nach Terminvereinbarung/);
  });
});
