import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { ImageSlot } from '@/lib/types';

import { PhotoUpload } from './photo-upload';

const BETONT =
  'inline-flex min-h-touch items-center justify-center gap-2 rounded-lg bg-primary px-4 text-body font-semibold text-primary-foreground hover:bg-primary-hover';
const RUHIG =
  'inline-flex min-h-touch items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface px-4 text-body font-semibold text-foreground hover:bg-surface-muted';

const beispiel: ImageSlot = { motif: 'Beispielfoto', ratio: '4/3' };

function vorlage(kamera?: 'betont' | 'ruhig') {
  return renderToStaticMarkup(
    <PhotoUpload
      id="foto-test"
      label="Foto des Schlüssels"
      description="Ein Foto hilft uns beim Abgleich."
      example={beispiel}
      files={[]}
      onChange={() => {}}
      {...(kamera ? { kamera } : {})}
    />,
  );
}

/** Klasse des Knopfs, dessen sichtbarer Text `beschriftung` ist. */
function klasseVon(html: string, beschriftung: string): string | undefined {
  const treffer = new RegExp(
    `<button[^>]*class="([^"]*)"[^>]*>(?:(?!</button>)[\\s\\S])*?${beschriftung}</button>`,
  ).exec(html);
  return treffer?.[1];
}

describe('PhotoUpload · Knopf „Foto aufnehmen“', () => {
  it('bleibt ohne Angabe der gefüllte Hauptknopf wie bisher', () => {
    const html = vorlage();
    expect(klasseVon(html, 'Foto aufnehmen')).toBe(BETONT);
  });

  it('wird mit kamera="ruhig" zum Rahmenknopf wie „Aus Galerie wählen“', () => {
    const html = vorlage('ruhig');
    const kamera = klasseVon(html, 'Foto aufnehmen');
    expect(kamera).toBe(RUHIG);
    expect(kamera).toBe(klasseVon(html, 'Aus Galerie wählen'));
    expect(kamera).not.toContain('bg-primary');
  });
});
