import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BAUFORM_FUER_FORM, ZylinderMassLive } from './zylinder-mass-live';

describe('ZylinderMassLive', () => {
  it('ordnet jeder Bauform des Katalogs eine Zeichnung zu', () => {
    expect(BAUFORM_FUER_FORM).toEqual({
      doppelzylinder: 'profil-doppel',
      halbzylinder: 'profil-halb',
      knaufzylinder: 'knauf',
    });
  });

  it('beschriftet beide Maße beim Doppelzylinder und nur Maß A beim Halbzylinder', () => {
    const doppel = renderToStaticMarkup(<ZylinderMassLive form="doppelzylinder" aussen={30} innen={45} name="Doppelzylinder" />);
    expect(doppel).toContain('<title>Maßzeichnung Doppelzylinder: Maß A 30 mm, Maß B 45 mm');
    const halb = renderToStaticMarkup(<ZylinderMassLive form="halbzylinder" aussen={40} name="Halbzylinder" />);
    expect(halb).toContain('<title>Maßzeichnung Halbzylinder: Maß A 40 mm');
    expect(halb).not.toContain('Maß B');
  });

  it('zeichnet bei anderen Maßen eine andere Zeichnung und blendet über', () => {
    const a = renderToStaticMarkup(<ZylinderMassLive form="knaufzylinder" aussen={30} innen={30} name="Knaufzylinder" />);
    const b = renderToStaticMarkup(<ZylinderMassLive form="knaufzylinder" aussen={50} innen={30} name="Knaufzylinder" />);
    expect(a).not.toBe(b);
    expect(a).toContain('animate-schleier-ein');
    expect(a).toContain('Schematisch');
  });

  it('zeichnet unter 640 px die schmale Fassung, darüber die breite', () => {
    const html = renderToStaticMarkup(<ZylinderMassLive form="doppelzylinder" aussen={35} innen={40} name="Doppelzylinder" />);
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 300 220"[^>]*class="[^"]*sm:hidden/);
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 480 270"[^>]*class="[^"]*hidden sm:block/);
    expect(html.match(/<title>Maßzeichnung Doppelzylinder: Maß A 35 mm, Maß B 40 mm/g)).toHaveLength(2);
  });
});
