import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VergleichsBild } from '@/lib/types';

import { START_ANTEIL, VorherNachher, reglerText } from './vorher-nachher';

const vorher: VergleichsBild = { url: '/api/medien/file/vorher.jpg', alt: 'Alter Schlüssel', beschriftung: 'Altes Gehäuse, Tasten abgenutzt' };
const nachher: VergleichsBild = { url: '/api/medien/file/nachher.jpg', alt: 'Neues Gehäuse', beschriftung: 'Neues Gehäuse mit übernommener Elektronik' };

describe('VorherNachher', () => {
  it('erscheint ohne zwei echte Bilder mit Beschriftung nicht (R4)', () => {
    expect(renderToStaticMarkup(<VorherNachher vorher={{ ...vorher, url: '' }} nachher={nachher} />)).toBe('');
    expect(renderToStaticMarkup(<VorherNachher vorher={vorher} nachher={{ ...nachher, beschriftung: ' ' }} />)).toBe('');
  });

  it('zeigt die ruhige Fassung nebeneinander und den Regler nur bei Bewegung', () => {
    const html = renderToStaticMarkup(<VorherNachher vorher={vorher} nachher={nachher} titel="Umbau" />);
    expect(html).toContain('<figcaption');
    expect(html).toContain('Umbau');
    // Ruhig: sichtbar, bei Bewegung ausgeblendet.
    expect(html).toMatch(/class="[^"]*bewegt:hidden[^"]*" data-ansicht="nebeneinander"/);
    // Regler: nur bei Bewegung sichtbar.
    expect(html).toMatch(/class="hidden [^"]*bewegt:flex[^"]*" data-ansicht="regler"/);
    expect(html).toContain('Altes Gehäuse, Tasten abgenutzt');
    expect(html).toContain('Neues Gehäuse mit übernommener Elektronik');
  });

  it('bedient sich über ein beschriftetes natives Eingabefeld (Tastatur)', () => {
    const html = renderToStaticMarkup(<VorherNachher vorher={vorher} nachher={nachher} />);
    const regler = html.match(/<input[^>]*type="range"[^>]*>/)?.[0] ?? '';
    expect(regler).toContain(`value="${START_ANTEIL}"`);
    expect(regler).toContain('min="0"');
    expect(regler).toContain('max="100"');
    expect(regler).toContain(`aria-valuetext="${reglerText(START_ANTEIL)}"`);
    const id = regler.match(/id="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`for="${id}"`);
    // Beide Bilder mit Alternativtext.
    expect(html).toContain('alt="Alter Schlüssel"');
    expect(html).toContain('alt="Neues Gehäuse"');
  });

  it('sagt die Lage der Trennlinie an', () => {
    expect(reglerText(30)).toBe('Links 30 Prozent vorher, rechts 70 Prozent nachher');
  });
});
