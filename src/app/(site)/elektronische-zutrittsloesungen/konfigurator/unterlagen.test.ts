import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import type { PickedFile } from '@/components/forms/photo-upload';

import { INITIAL, buildAnswerSummary, validate, zutrittUploads, type ZutrittData } from './zutritt-konfigurator';

const QUELLE = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'zutritt-konfigurator.tsx'), 'utf8');

function datei(id: string, name: string, mimeType: string, extra: Partial<PickedFile> = {}): PickedFile {
  return { id, name, sizeBytes: 1000, mimeType, previewUrl: `blob:${id}`, ...extra };
}

/** FA-27-10: freiwilliger Schritt „Unterlagen“ im Zutrittskonfigurator. */
describe('Unterlagen im Zutrittskonfigurator', () => {
  const daten: ZutrittData = { ...INITIAL, objekt: 'buero' };

  it('führt den Schritt vor der Zusammenfassung; „Weiter“ geht auch ohne Datei', () => {
    expect(validate(daten, 'unterlagen')).toBe(true);
    expect(validate(INITIAL, 'unterlagen')).toBe(true);
    const unterlagen = QUELLE.indexOf("id: 'unterlagen'");
    const zusammenfassung = QUELLE.indexOf("id: 'zusammenfassung'");
    expect(unterlagen).toBeGreaterThan(QUELLE.indexOf("id: 'service'"));
    expect(unterlagen).toBeLessThan(zusammenfassung);
  });

  it('zeigt Grundriss und Fotos in der Zusammenfassung, auch ohne Dateien', () => {
    const ohne = buildAnswerSummary(daten).find((s) => s.title === '9. Unterlagen')?.rows ?? [];
    expect(ohne).toEqual([
      { label: 'Grundriss', value: 'Nicht hochgeladen' },
      { label: 'Fotos von Türen und Bestand', value: 'Nicht hochgeladen' },
    ]);
    const mit = buildAnswerSummary(daten, { grundriss: 1, fotos: 3 }).find((s) => s.title === '9. Unterlagen')?.rows ?? [];
    expect(mit).toEqual([
      { label: 'Grundriss', value: '1 Datei' },
      { label: 'Fotos von Türen und Bestand', value: '3 Dateien' },
    ]);
    // Die acht Abfragen bleiben vollständig und in ihrer Reihenfolge davor.
    expect(buildAnswerSummary(daten).map((s) => s.title)).toEqual([
      '1. Objekt',
      '2. Umfang',
      '3. Identmedium',
      '4. Verwaltung',
      '5. Berechtigungen',
      '6. Standorte',
      '7. Integration',
      '8. Service',
      '9. Unterlagen',
    ]);
  });

  it('sendet Grundriss und Fotos mit ihrer Kategorie, ohne selbst einen Steckplatz zu setzen', () => {
    const uploads = zutrittUploads(
      [datei('g1', 'grundriss.pdf', 'application/pdf')],
      [datei('f1', 'tuer.jpg', 'image/jpeg', { storageKey: '12', uploadToken: 'x'.repeat(43) })],
    );
    expect(uploads).toEqual([
      { fileName: 'grundriss.pdf', sizeBytes: 1000, mimeType: 'application/pdf', category: 'grundriss' },
      { fileName: 'tuer.jpg', sizeBytes: 1000, mimeType: 'image/jpeg', category: 'objektfoto', storageKey: '12', uploadToken: 'x'.repeat(43) },
    ]);
    expect(zutrittUploads([], [])).toEqual([]);
  });

  it('sendet die Dateien statt einer leeren Liste und wartet auf laufende Uploads', () => {
    expect(QUELLE).not.toMatch(/uploads: \[\]/);
    expect(QUELLE).toMatch(/uploads: zutrittUploads\(grundrisse, fotos\)/);
    expect(QUELLE.indexOf('await uploadsAbwarten()')).toBeGreaterThan(-1);
    expect(QUELLE.indexOf('await uploadsAbwarten()')).toBeLessThan(QUELLE.indexOf('response = await submitRecord('));
  });

  it('fragt vor dem Verlassen nach, solange Dateien gewählt sind', () => {
    expect(QUELLE).toMatch(/ungesichert=\{grundrisse\.length > 0 \|\| fotos\.length > 0\}/);
    expect(QUELLE).toMatch(/\bmitDateien\b/);
    expect(QUELLE).toMatch(/<PhotoUpload\s+category="grundriss"[\s\S]{0,900}allowDocuments/);
    expect(QUELLE).toMatch(/<PhotoUpload\s+category="objektfoto"/);
  });
});
