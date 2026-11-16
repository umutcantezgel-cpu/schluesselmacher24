import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ZYLINDER_SCHRIFT } from '@/components/visual/generators/zylinder-mass';
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
    expect(a).toMatch(/<figure[^>]*class="[^"]*sm24-ruhig/);
    expect(a).not.toMatch(/<figure[^>]*class="[^"]*border/);
  });

  it('zeichnet unter 640 px die schmale Fassung, darüber die breite', () => {
    const html = renderToStaticMarkup(<ZylinderMassLive form="doppelzylinder" aussen={35} innen={40} name="Doppelzylinder" />);
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 300 220"[^>]*class="[^"]*sm:hidden/);
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 480 270"[^>]*class="[^"]*hidden sm:block/);
    expect(html.match(/<title>Maßzeichnung Doppelzylinder: Maß A 35 mm, Maß B 40 mm/g)).toHaveLength(2);
  });

  it('zeichnet mit `schmal` bei jeder Fensterbreite nur die schmale Fassung', () => {
    const html = renderToStaticMarkup(<ZylinderMassLive form="doppelzylinder" aussen={35} innen={40} name="Doppelzylinder" schmal />);
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 300 220"/);
    expect(html).not.toContain('viewBox="0 0 480 270"');
    expect(html).not.toContain('sm:hidden');
    expect(html.match(/<title>Maßzeichnung Doppelzylinder/g)).toHaveLength(1);
  });

  /* Sichtprobe der Abnahme von FA-QA-04D: In der Prüfliste „Ihre Zylinder“ stand die breite Fassung
     bei 1024 px in drei Spalten von 192 px, die Schrift war 9,2 px groß. Schmale Fassung und zwei
     Spalten bis xl halten sie über 14 px: 21 Einheiten × 237 px / 300 ≈ 16,6 px an der engsten
     Stelle (1280 px, drei Spalten; im Browser gemessen). */
  it('steht in der Prüfliste des Zylinder-Konfigurators in der schmalen Fassung, drei Spalten erst ab xl (FA-26-01)', () => {
    const quelle = readFileSync('src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx', 'utf8');
    const ab = quelle.indexOf('>Ihre Zylinder<');
    expect(ab).toBeGreaterThan(0);
    const liste = quelle.slice(ab, quelle.indexOf('</ul>', ab));
    const aufruf = liste.slice(liste.indexOf('<ZylinderMassLive'), liste.indexOf('/>', liste.indexOf('<ZylinderMassLive')));
    expect(aufruf).toMatch(/\n\s+schmal\n/);
    expect(liste).toContain('sm:grid-cols-2 xl:grid-cols-3');
    expect(liste).not.toContain('lg:grid-cols-3');
    const ENGSTE_SPALTE_PX = 237;
    expect((ZYLINDER_SCHRIFT.schmal * ENGSTE_SPALTE_PX) / 300).toBeGreaterThanOrEqual(14);
  });
});
