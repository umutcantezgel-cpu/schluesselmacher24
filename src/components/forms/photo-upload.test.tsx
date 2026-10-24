import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { ImageSlot } from '@/lib/types';

import {
  MAX_AUSWAHL_FOTO_BYTES,
  MAX_UPLOAD_BYTES,
  MELDUNG_UPLOAD_ZU_GROSS,
  PhotoUpload,
  auswahlGrenze,
  dateityp,
  kodiereUnterGrenze,
  uploadFehler,
} from './photo-upload';
import { MAX_BILD_BYTES, MAX_PDF_BYTES } from '@/lib/server/datei-pruefung';

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

describe('PhotoUpload · Größengrenzen (Vercel: 4,5 MB je Anfrage)', () => {
  it('nutzt dieselbe Grenze wie der Server', () => {
    expect(MAX_UPLOAD_BYTES).toBe(MAX_BILD_BYTES);
    expect(MAX_UPLOAD_BYTES).toBe(MAX_PDF_BYTES);
  });

  it('lässt Fotos bis 12 MB auswählen (sie werden verkleinert), PDF nur bis 4 MB', () => {
    expect(auswahlGrenze({ type: 'image/jpeg', name: 'a.jpg' })).toBe(MAX_AUSWAHL_FOTO_BYTES);
    expect(auswahlGrenze({ type: 'image/png', name: 'a.png' })).toBe(MAX_AUSWAHL_FOTO_BYTES);
    expect(auswahlGrenze({ type: 'image/heic', name: 'a.heic' })).toBe(MAX_AUSWAHL_FOTO_BYTES);
    expect(auswahlGrenze({ type: 'application/pdf', name: 'schein.pdf' })).toBe(MAX_UPLOAD_BYTES);
    expect(auswahlGrenze({ type: '', name: 'unbekannt.bin' })).toBe(MAX_UPLOAD_BYTES);
  });

  it('erkennt HEIC ohne Typangabe an der Endung', () => {
    expect(dateityp({ type: '', name: 'IMG_0001.HEIC' })).toBe('image/heic');
    expect(dateityp({ type: '', name: 'foto.heif' })).toBe('image/heic');
    expect(dateityp({ type: 'image/jpeg', name: 'x.heic' })).toBe('image/jpeg');
  });

  it('senkt die Qualität stufenweise, bis das Foto passt', async () => {
    const versuche: number[] = [];
    const groesse: Record<number, number> = { 0.85: 6_000_000, 0.7: 4_500_000, 0.6: 3_000_000 };
    const blob = await kodiereUnterGrenze(async (q) => {
      versuche.push(q);
      return new Blob([new Uint8Array(groesse[q])]);
    }, MAX_UPLOAD_BYTES);
    expect(versuche).toEqual([0.85, 0.7, 0.6]);
    expect(blob?.size).toBe(3_000_000);
  });

  it('hört auf, sobald eine Stufe passt, und liefert sonst das kleinste Ergebnis', async () => {
    const versuche: number[] = [];
    const passt = await kodiereUnterGrenze(async (q) => {
      versuche.push(q);
      return new Blob([new Uint8Array(1000)]);
    }, MAX_UPLOAD_BYTES);
    expect(versuche).toEqual([0.85]);
    expect(passt?.size).toBe(1000);

    const zuGross = await kodiereUnterGrenze(async (q) => new Blob([new Uint8Array(q === 0.7 ? 5000 : 6000)]), 100);
    expect(zuGross?.size).toBe(5000);
    expect(await kodiereUnterGrenze(async () => null, 100)).toBeNull();
  });

  it('übersetzt eine 413 ohne JSON (Plattformgrenze) in eine verständliche Meldung', () => {
    expect(uploadFehler(413, {})).toBe(MELDUNG_UPLOAD_ZU_GROSS);
    expect(MELDUNG_UPLOAD_ZU_GROSS).toMatch(/4 MB.*E-Mail/);
    expect(uploadFehler(413, { error: 'Das PDF ist größer als 4 MB.' })).toBe('Das PDF ist größer als 4 MB.');
    expect(uploadFehler(502, {})).toBe('Die Datei konnte nicht hochgeladen werden.');
  });

  it('nennt die Grenzen am Feld', () => {
    const html = renderToStaticMarkup(
      <PhotoUpload id="schein" label="Fahrzeugschein" description="" example={beispiel} files={[]} onChange={() => {}} allowDocuments />,
    );
    expect(html).toContain('Fotos bis 12 MB');
    expect(html).toContain('PDF bis 4 MB');
  });
});
