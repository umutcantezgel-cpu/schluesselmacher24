import { afterEach, describe, expect, it, vi } from 'vitest';

import { bewegungReduziert, scrollVerhalten } from './bewegung';

function fensterMit(reduziert: boolean) {
  vi.stubGlobal('window', {
    matchMedia: (anfrage: string) => ({ matches: anfrage === '(prefers-reduced-motion: reduce)' && reduziert }),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('scrollVerhalten', () => {
  it('scrollt sanft, wenn Bewegung erlaubt ist', () => {
    expect(scrollVerhalten(false)).toBe('smooth');
  });

  it('springt sofort bei „Bewegung reduzieren“', () => {
    expect(scrollVerhalten(true)).toBe('auto');
  });

  it('liest die Einstellung des Browsers, wenn nichts übergeben wird', () => {
    fensterMit(true);
    expect(bewegungReduziert()).toBe(true);
    expect(scrollVerhalten()).toBe('auto');

    fensterMit(false);
    expect(bewegungReduziert()).toBe(false);
    expect(scrollVerhalten()).toBe('smooth');
  });

  it('bewegt ohne Browser nichts', () => {
    expect(typeof window).toBe('undefined');
    expect(bewegungReduziert()).toBe(true);
    expect(scrollVerhalten()).toBe('auto');
  });
});
