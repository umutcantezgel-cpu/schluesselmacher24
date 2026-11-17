import type { Field } from 'payload';
import { describe, expect, it } from 'vitest';

import { TUTORIAL_ORT_WERTE } from '../../lib/tutorials/orte';
import { YOUTUBE_MELDUNG } from '../../lib/tutorials/youtube';
import { nachAenderung, nachLoeschen } from '../hooks/revalidate';
import { Tutorials, dauerFeldPruefen, youtubeEingabeNormalisieren, youtubeFeldPruefen } from './Tutorials';

/* Sammlung Tutorials (FA-INHALT-01): YouTube-Link wird zur Kennung, fremde Adressen werden abgelehnt,
 * Seiten werden nach jeder Änderung erneuert (statische Seiten /tutorials und /tutorials/…). */

const ID = 'aB3_dE-5gH7';

function feld(name: string, felder: Field[] = Tutorials.fields): Field | undefined {
  for (const f of felder) {
    if ('name' in f && f.name === name) return f;
    if ('fields' in f && Array.isArray(f.fields)) {
      const treffer = feld(name, f.fields as Field[]);
      if (treffer) return treffer;
    }
  }
  return undefined;
}

const normalisieren = (value: unknown) => (youtubeEingabeNormalisieren as (args: { value: unknown }) => unknown)({ value });

describe('Tutorials im Admin', () => {
  it('erneuert die Seiten nach jeder Änderung und nach dem Löschen', () => {
    expect(Tutorials.hooks?.afterChange).toContain(nachAenderung);
    expect(Tutorials.hooks?.afterDelete).toContain(nachLoeschen);
  });

  it('hat Entwürfe (veröffentlicht oder nicht), Papierkorb und feste Kennung', () => {
    expect(Tutorials.versions).toMatchObject({ drafts: true });
    expect(Tutorials.trash).toBe(true);
    expect(feld('kennung')).toBeDefined();
    expect(feld('slug')).toBeDefined();
  });

  it('speichert aus einem eingefügten Link nur die Kennung', () => {
    expect(normalisieren(`https://www.youtube.com/watch?v=${ID}&t=30s`)).toBe(ID);
    expect(normalisieren(`https://youtu.be/${ID}?si=xyz`)).toBe(ID);
    expect(normalisieren(`  ${ID}  `)).toBe(ID);
    expect(normalisieren('   ')).toBeNull();
    expect(normalisieren(undefined)).toBeUndefined();
    // Unlesbares bleibt stehen und fällt in der Prüfung auf.
    expect(normalisieren(`https://example.org/watch?v=${ID}`)).toBe(`https://example.org/watch?v=${ID}`);
  });

  it('lehnt fremde Adressen mit einer Meldung in Alltagssprache ab', () => {
    expect(youtubeFeldPruefen(ID)).toBe(true);
    expect(youtubeFeldPruefen(`https://www.youtube-nocookie.com/embed/${ID}`)).toBe(true);
    expect(youtubeFeldPruefen('')).toBe(true);
    expect(youtubeFeldPruefen(null)).toBe(true);
    expect(youtubeFeldPruefen(`https://vimeo.com/${ID}`)).toBe(YOUTUBE_MELDUNG);
    expect(youtubeFeldPruefen('irgendwas')).toBe(YOUTUBE_MELDUNG);
    const youtube = feld('youtube') as { validate?: unknown; hooks?: { beforeValidate?: unknown[]; beforeChange?: unknown[] } };
    expect(youtube.validate).toBe(youtubeFeldPruefen);
    expect(youtube.hooks?.beforeValidate).toContain(youtubeEingabeNormalisieren);
    expect(youtube.hooks?.beforeChange).toContain(youtubeEingabeNormalisieren);
  });

  it('prüft die Dauer', () => {
    expect(dauerFeldPruefen('4:32')).toBe(true);
    expect(dauerFeldPruefen('')).toBe(true);
    expect(dauerFeldPruefen('vier Minuten')).not.toBe(true);
  });

  it('bietet alle Orte zur Auswahl an', () => {
    const orte = feld('erscheintAuf') as { options: Array<{ value: string }>; hasMany?: boolean };
    expect(orte.hasMany).toBe(true);
    expect(orte.options.map((o) => o.value)).toEqual([...TUTORIAL_ORT_WERTE]);
  });

  it('nimmt keine Videodateien in die Medienablage: das Video ist nur ein Textfeld für die Kennung', () => {
    expect((feld('youtube') as { type: string }).type).toBe('text');
    expect(JSON.stringify(Tutorials.fields)).not.toMatch(/"mimeTypes"|video\/mp4/);
  });

  it('Hilfetexte ohne Entwurfsreste', () => {
    expect(JSON.stringify(Tutorials)).not.toMatch(/Platzhalter|Demo|Muster|TODO|lorem/i);
  });
});
