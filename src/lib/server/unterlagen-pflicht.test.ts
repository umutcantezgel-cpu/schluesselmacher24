import { describe, expect, it } from 'vitest';

import { FAHRZEUGSCHEIN_FEHLT, FAHRZEUGSCHEIN_NICHT_HOCHGELADEN, fahrzeugscheinPruefen } from './unterlagen-pflicht';

const foto = { category: 'schluesselfoto' as const };
const schein = { category: 'fahrzeugschein' as const };
const hochgeladen = { ...schein, storageKey: '17', uploadToken: 'a'.repeat(43) };

describe('Fahrzeugschein ist beim Autoschlüssel-Termin Pflicht', () => {
  it('lehnt ohne Fahrzeugschein ab — Schlüsselfotos ersetzen ihn nicht', () => {
    expect(fahrzeugscheinPruefen([], false)).toBe(FAHRZEUGSCHEIN_FEHLT);
    expect(fahrzeugscheinPruefen([foto, foto], true)).toBe(FAHRZEUGSCHEIN_FEHLT);
  });

  it('Totalverlust: ohne Schlüsselfotos genügt der Fahrzeugschein', () => {
    expect(fahrzeugscheinPruefen([hochgeladen], true)).toBeNull();
  });

  it('mit Dateiablage zählt nur die hochgeladene Datei', () => {
    expect(fahrzeugscheinPruefen([schein], true)).toBe(FAHRZEUGSCHEIN_NICHT_HOCHGELADEN);
    expect(fahrzeugscheinPruefen([{ ...schein, storageKey: '17' }], true)).toBe(FAHRZEUGSCHEIN_NICHT_HOCHGELADEN);
    expect(fahrzeugscheinPruefen([schein, hochgeladen], true)).toBeNull();
  });

  it('ohne Dateiablage genügt die Angabe der ausgewählten Datei', () => {
    expect(fahrzeugscheinPruefen([schein], false)).toBeNull();
  });
});
