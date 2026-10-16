import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { KeyKind } from '@/lib/types';

import { SCHLUESSELART_TYP, SchluesselartZeichnung } from './schluesselart-zeichnung';

describe('SchluesselartZeichnung', () => {
  it('ordnet jeder Schlüsselart eine Bauform des Generators zu', () => {
    const arten: KeyKind[] = ['mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless'];
    for (const art of arten) expect(SCHLUESSELART_TYP[art]).toBeTruthy();
    expect(SCHLUESSELART_TYP.keyless).toBe(SCHLUESSELART_TYP['smart-key']);
  });

  it('ist dekorativ und ruhig', () => {
    const html = renderToStaticMarkup(<SchluesselartZeichnung art="funk" />);
    expect(html).toMatch(/^<span aria-hidden="true" class="sm24-ruhig block">/);
    expect(html).toContain('<svg');
  });

  it('zeichnet verschiedene Bauformen verschieden', () => {
    const funk = renderToStaticMarkup(<SchluesselartZeichnung art="funk" />);
    const klapp = renderToStaticMarkup(<SchluesselartZeichnung art="klappschluessel" />);
    expect(funk).not.toBe(klapp);
  });
});
