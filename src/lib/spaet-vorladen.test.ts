import { describe, expect, it } from 'vitest';

import { VORLADEN_NACH_MS, zuVorladen } from './spaet-vorladen';

describe('zuVorladen', () => {
  it('lässt die aktuelle Seite und Dubletten weg', () => {
    expect(zuVorladen(['/', '/warenkorb', '/autoschluessel/anfrage', '/warenkorb'], '/')).toEqual([
      '/warenkorb',
      '/autoschluessel/anfrage',
    ]);
  });

  it('behält die Reihenfolge der Navigation', () => {
    expect(zuVorladen(['/autoschluessel', '/schluessel-nach-code', '/service-und-termin'], '/kontakt')).toEqual([
      '/autoschluessel',
      '/schluessel-nach-code',
      '/service-und-termin',
    ]);
  });

  it('wartet länger als der größte Auftritt (B-01, höchstens 1,6 s)', () => {
    expect(VORLADEN_NACH_MS).toBeGreaterThan(1600);
  });
});
