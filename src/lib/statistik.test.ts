import { afterEach, describe, expect, it, vi } from 'vitest';

import { AKTION_EREIGNIS, aktionMelden, gaMessId, istAktion } from './statistik';
import { einwilligungLesen } from './einwilligung';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('gaMessId', () => {
  it('ist ohne Umgebungsvariable leer — dann wird nichts geladen', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
    expect(gaMessId()).toBeUndefined();
  });

  it('nimmt nur Mess-IDs der Form G-…', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', ' g-abc123xyz ');
    expect(gaMessId()).toBe('G-ABC123XYZ');
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'UA-1234-1');
    expect(gaMessId()).toBeUndefined();
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-1"><script>');
    expect(gaMessId()).toBeUndefined();
  });
});

describe('aktionMelden', () => {
  it('löst sm24:aktion mit der Aktion aus', () => {
    const ziel = new EventTarget();
    vi.stubGlobal('window', ziel);
    const empfangen: unknown[] = [];
    ziel.addEventListener(AKTION_EREIGNIS, (event) => empfangen.push((event as CustomEvent).detail));
    aktionMelden('bestellung');
    aktionMelden('projektanfrage', 'schliessanlagen');
    expect(empfangen).toEqual([{ aktion: 'bestellung' }, { aktion: 'projektanfrage', bereich: 'schliessanlagen' }]);
  });

  it('kennt genau die fünf gemessenen Aktionen', () => {
    for (const aktion of ['bestellung', 'fotoanfrage', 'terminanfrage', 'partneranmeldung', 'projektanfrage']) {
      expect(istAktion(aktion)).toBe(true);
    }
    expect(istAktion('seitenaufruf')).toBe(false);
    expect(istAktion(undefined)).toBe(false);
  });
});

describe('einwilligungLesen', () => {
  it('liest die gespeicherte Auswahl, sonst nichts', () => {
    expect(einwilligungLesen(null)).toBeNull();
    expect(einwilligungLesen('kaputt')).toBeNull();
    expect(einwilligungLesen('{"statistik":true,"updatedAt":"2026-10-25T10:00:00.000Z"}')).toEqual({
      notwendig: true,
      statistik: true,
      komfort: false,
      updatedAt: '2026-10-25T10:00:00.000Z',
    });
    expect(einwilligungLesen('{"statistik":"ja"}')?.statistik).toBe(false);
  });
});
