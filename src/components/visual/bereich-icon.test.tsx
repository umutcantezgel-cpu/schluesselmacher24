import type { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AREA_KEYS } from '@/lib/server/record-schema';
import type { AreaKey } from '@/lib/types';

import { BEREICH_ICONS, BereichIcon } from './bereich-icon';
import type { IconProps } from './icons/icon-base';

describe('BereichIcon', () => {
  it('hat für jeden der neun Bereiche ein Icon', () => {
    expect(AREA_KEYS).toHaveLength(9);
    expect(Object.keys(BEREICH_ICONS).sort()).toEqual([...AREA_KEYS].sort());
    for (const area of AREA_KEYS) {
      expect(typeof BEREICH_ICONS[area], area).toBe('function');
    }
  });

  it.each(AREA_KEYS)('%s: nutzt das gleichnamige Fach-Icon', async (area) => {
    const modul = (await import(`./icons/${area}.tsx`)) as Record<string, ComponentType<IconProps>>;
    const Icon = Object.values(modul)[0];
    expect(BEREICH_ICONS[area]).toBe(Icon);
    expect(renderToStaticMarkup(<BereichIcon area={area} />)).toBe(renderToStaticMarkup(<Icon />));
  });

  it('ist ohne Titel dekorativ und mit Titel ein Bild', () => {
    const still = renderToStaticMarkup(<BereichIcon area="schliessanlagen" />);
    expect(still).toContain('aria-hidden="true"');
    expect(still).not.toContain('<title>');

    const bild = renderToStaticMarkup(<BereichIcon area="schliessanlagen" title="Schließanlagen" />);
    expect(bild).toContain('role="img"');
    expect(bild).toContain('<title>Schließanlagen</title>');
  });

  it('übernimmt Größe und Klassen', () => {
    const html = renderToStaticMarkup(
      <BereichIcon area="autoschluessel" size={24} className="text-area-strong" />,
    );
    expect(html).toContain('width="24"');
    expect(html).toContain('height="24"');
    expect(html).toContain('class="shrink-0 text-area-strong"');
  });

  it('liefert für unbekannte Bereiche nichts', () => {
    for (const area of ['unbekannt', 'constructor', '__proto__', '']) {
      expect(renderToStaticMarkup(<BereichIcon area={area as AreaKey} />)).toBe('');
    }
  });
});
