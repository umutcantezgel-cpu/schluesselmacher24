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
});
