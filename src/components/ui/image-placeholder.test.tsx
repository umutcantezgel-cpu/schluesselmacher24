import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { ImageSlot } from '@/lib/types';

import { ImagePlaceholder } from './image-placeholder';

const zeichne = (slot: ImageSlot, compact = false) => renderToStaticMarkup(<ImagePlaceholder slot={slot} compact={compact} />);

describe('ImagePlaceholder – Rangfolge ohne Foto', () => {
  it('zeigt einen ausdrücklich gesetzten Generator', () => {
    const html = zeichne({ motif: 'Beliebig', ratio: '4/3', visual: { generator: 'zylinder-mass', params: { bauform: 'knauf' } } });
    expect(html).toContain('viewBox="0 0 480 270"');
    expect(html).toContain('role="img"');
    expect(html).toContain('aspect-4/3');
  });

  it('wählt ohne Generator eine Fachgrafik nach dem Motiv', () => {
    const html = zeichne({ motif: 'Schemazeichnung Zentralschlossanlage', ratio: '16/9' });
    expect(html).toContain('<title>Schließplan Zentralschlossanlage</title>');
    expect(html).toContain('aspect-video');
  });

  it('nutzt den sachlichen Titel des Generators, nie das Fotomotiv', () => {
    const html = zeichne({ motif: 'Werkstattfoto: Schlüsselfräse', ratio: '4/3' });
    expect(html).not.toContain('Werkstattfoto');
    expect(html).toContain('<title>Schlüsselprofil mit 6 Einschnitten wird gefräst</title>');
  });

  it('zeigt ohne passende Grafik ein dekoratives Fach-Icon', () => {
    const html = zeichne({ motif: 'Teamfoto am Empfang', ratio: '1/1' });
    expect(html).toMatch(/^<div aria-hidden="true"/);
    expect(html).toContain('data-sm24-icon=""');
  });

  it('zeigt in kleinen Flächen immer ein Fach-Icon', () => {
    const html = zeichne({ motif: 'Schemazeichnung Zentralschlossanlage', ratio: '1/1' }, true);
    expect(html).not.toContain('role="img"');
    expect(html).toContain('width="32"');
  });

  it('enthält keine sichtbaren Platzhaltertexte', () => {
    for (const motif of ['Werkstattfoto', 'Teamfoto', 'Produktfoto Zylinder', '']) {
      const html = zeichne({ motif, ratio: '4/3', note: 'Hinweis für die Redaktion' });
      expect(html).not.toMatch(/Bild folgt|Bildplatzhalter|Hinweis für die Redaktion/);
    }
  });
});

describe('ImagePlaceholder – Ausschnitt für kleine Breiten', () => {
  const ausschnitt = { x: 140, y: 98, breite: 320, hoehe: 140, vollBreite: 480, vollHoehe: 360 };
  const grafik: ImageSlot = { motif: 'Beliebig', ratio: '4/3', visual: { generator: 'profilschnitt', params: {} } };

  it('setzt Klasse und Variablen und behält das Seitenverhältnis für breite Flächen', () => {
    const html = renderToStaticMarkup(<ImagePlaceholder slot={grafik} ausschnitt={ausschnitt} />);
    expect(html).toContain('sm24-ausschnitt');
    expect(html).toContain('aspect-4/3');
    expect(html).toContain('--aus-x:140;--aus-y:98;--aus-w:320;--aus-h:140;--voll-w:480;--voll-h:360');
  });

  it('wirkt nur auf Fachgrafiken, nicht auf Fach-Icons', () => {
    const icon = renderToStaticMarkup(
      <ImagePlaceholder slot={{ motif: 'Teamfoto', ratio: '4/3' }} compact ausschnitt={ausschnitt} />,
    );
    expect(icon).not.toContain('sm24-ausschnitt');
    expect(icon).not.toContain('--aus-x');
  });

  it('ändert ohne Ausschnitt nichts am Markup', () => {
    const html = renderToStaticMarkup(<ImagePlaceholder slot={grafik} />);
    expect(html).not.toContain('sm24-ausschnitt');
    expect(html).not.toContain('--aus-x');
    expect(html).toMatch(/^<div class="[^"]*"><svg/);
  });
});
