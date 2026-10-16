import { describe, expect, it } from 'vitest';

import { beschreibungFuerAnzeige, codelinienKennung } from './codelinie';

const MS01 = {
  slug: 'ms-01',
  name: 'Büroschrank und Rollcontainer — Serie MS-01',
  application: 'Möbel- und Büroschloss: Büroschrank und Rollcontainer',
  description:
    'Nachschlüssel für möbel- und büroschloss: büroschrank und rollcontainer. Die Fertigung erfolgt '
    + 'anhand des aufgedruckten Codes. Bitte prüfen Sie den Code.',
};

describe('codelinienKennung', () => {
  it('liest die Serienkennung aus dem Namen', () => {
    expect(codelinienKennung(MS01)).toBe('MS-01');
  });

  it('nimmt ohne Serienangabe den Slug in Großbuchstaben', () => {
    expect(codelinienKennung({ slug: 'zy-07', name: 'Profilzylinder Kellertür' })).toBe('ZY-07');
  });
});

describe('beschreibungFuerAnzeige', () => {
  it('nennt im ersten Satz die Codelinie statt der kleingeschriebenen Anwendung', () => {
    expect(beschreibungFuerAnzeige(MS01)).toBe(
      'Nachschlüssel für die Codelinie MS-01. Die Fertigung erfolgt anhand des aufgedruckten Codes. '
        + 'Bitte prüfen Sie den Code.',
    );
  });

  it('lässt alle weiteren Sätze wörtlich stehen', () => {
    const rest = MS01.description.slice(MS01.description.indexOf('. ') + 1);
    expect(beschreibungFuerAnzeige(MS01).endsWith(rest)).toBe(true);
  });

  it('lässt eine abweichend gepflegte Beschreibung unverändert', () => {
    const eigen = { ...MS01, description: 'Passend für alle Schränke der Serie. Lieferung mit Anhänger.' };
    expect(beschreibungFuerAnzeige(eigen)).toBe(eigen.description);
  });

  it('lässt eine Beschreibung aus einem Satz unverändert', () => {
    const kurz = { ...MS01, description: 'Nachschlüssel für möbel- und büroschloss: büroschrank und rollcontainer.' };
    expect(beschreibungFuerAnzeige(kurz)).toBe(kurz.description);
  });
});
