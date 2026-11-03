import { describe, expect, it } from 'vitest';

import { FAHRZEUGSCHEIN_FEHLT, FAHRZEUGSCHEIN_NICHT_HOCHGELADEN, fahrzeugscheinPruefen, SICHERUNGSKARTE_FEHLT, nachweisPruefen, pflichtUploadsPruefen, rubrikUnterlagenPruefen } from './unterlagen-pflicht';

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

describe('Nachweise und Pflichtunterlagen je Rubrik (R13, E3-OPUS-09)', () => {
  const karte = { category: 'sicherungskarte' as const, storageKey: '12', uploadToken: 'x'.repeat(43) };
  const schein = { category: 'fahrzeugschein' as const, storageKey: '13', uploadToken: 'y'.repeat(43) };
  const foto = { category: 'schluesselfoto' as const, storageKey: '14', uploadToken: 'z'.repeat(43) };

  it('verlangt beim Nachweis Fahrzeugschein dasselbe wie der Autoschlüssel-Weg', () => {
    expect(nachweisPruefen('fahrzeugschein', [], true)).toBe(fahrzeugscheinPruefen([], true));
    expect(nachweisPruefen('fahrzeugschein', [schein], true)).toBeNull();
  });

  it('verlangt die Sicherungskarte als hochgeladene Datei, ohne Ablage genügt die Angabe', () => {
    expect(nachweisPruefen('sicherungskarte', [], true)).toBe(SICHERUNGSKARTE_FEHLT);
    expect(nachweisPruefen('sicherungskarte', [{ category: 'sicherungskarte' }], true)).toBe(SICHERUNGSKARTE_FEHLT);
    expect(nachweisPruefen('sicherungskarte', [{ category: 'sicherungskarte' }], false)).toBeNull();
    expect(nachweisPruefen('sicherungskarte', [karte], true)).toBeNull();
    expect(nachweisPruefen('keiner', [], true)).toBeNull();
  });

  it('meldet die erste fehlende Pflichtunterlage in Kundensprache', () => {
    expect(pflichtUploadsPruefen(['schluesselfoto'], [], true)).toBe('Bitte laden Sie ein Foto Ihres Schlüssels hoch.');
    expect(pflichtUploadsPruefen(['schluesselfoto'], [foto], true)).toBeNull();
  });

  it('prüft erst den Nachweis, dann die Pflicht-Uploads; kein Weg ohne Nachweis', () => {
    const motorrad = { nachweis: 'fahrzeugschein' as const, pflichtUploads: ['schluesselfoto'] };
    expect(rubrikUnterlagenPruefen(motorrad, [foto], true)).toBe(fahrzeugscheinPruefen([], true));
    expect(rubrikUnterlagenPruefen(motorrad, [schein], true)).toBe('Bitte laden Sie ein Foto Ihres Schlüssels hoch.');
    expect(rubrikUnterlagenPruefen(motorrad, [schein, foto], true)).toBeNull();
  });
});
