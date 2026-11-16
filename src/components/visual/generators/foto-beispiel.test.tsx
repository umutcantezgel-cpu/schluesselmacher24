import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { ausserhalb, bildschirmPx, textKaesten, ueberlappungen } from '../beschriftung-test-hilfe';
import { FOTO_BEISPIELE, FOTO_BEISPIEL_TITEL, FOTO_SCHRIFT, FotoBeispielGrafik } from './foto-beispiel';

function zeichne(params: unknown, title: unknown = ''): string {
  return renderToStaticMarkup(
    <FotoBeispielGrafik params={params as VisualProps['params']} title={title as VisualProps['title']} />,
  );
}

function pruefeVertrag(html: string) {
  expect(html).toMatch(/^<svg[^>]*\brole="img"/);
  expect(html).toMatch(/^<svg[^>]*><title>[^<]+<\/title>/);
  expect(html).toContain('viewBox="0 0 480 300"');
  expect(html).not.toMatch(/\bid=/);
  expect(html).not.toMatch(/#[0-9a-f]{3,6}/i);
  expect(html).not.toContain('rgb(');
  expect(html).not.toContain('<marker');
  expect(html).not.toContain('<image');
  expect(html).not.toMatch(/NaN|Infinity|undefined/);
}

/** Sichtbare Beschriftungen der Zeichnung (ohne Alternativtext). */
function texte(html: string): string[] {
  return [...html.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((t) => t[1]);
}

describe('FotoBeispielGrafik (FA-26-06)', () => {
  it('zeichnet jeden Steckplatz eigenständig', () => {
    const ausgaben = FOTO_BEISPIELE.map((motiv) => zeichne({ motiv }));
    for (const html of ausgaben) pruefeVertrag(html);
    expect(new Set(ausgaben).size).toBe(FOTO_BEISPIELE.length);
  });

  it.each(FOTO_BEISPIELE)('%s: der Alternativtext sagt, was auf dem Foto zu sehen sein muss', (motiv) => {
    const html = zeichne({ motiv });
    expect(html).toContain(`<title>${FOTO_BEISPIEL_TITEL[motiv]}</title>`);
    expect(html).toContain(`aria-label="${FOTO_BEISPIEL_TITEL[motiv]}"`);
    expect(FOTO_BEISPIEL_TITEL[motiv]).toMatch(/^Beispiel /);
    expect(FOTO_BEISPIEL_TITEL[motiv]).toMatch(/lesbar|erkennbar/);
  });

  it.each(FOTO_BEISPIELE)('%s: keine Ziffern, Namen oder Kennzeichen im Bild, nur Platzhalter-Striche (R12)', (motiv) => {
    const html = zeichne({ motiv });
    for (const text of texte(html)) expect(text).not.toMatch(/\d/);
    // Blätter und Schild tragen Angaben nur als Striche; die Schlüsselspitze hat keine Angaben.
    if (motiv !== 'schluesselspitze') expect(html).toContain('stroke-border-strong');
  });

  it('Fahrzeugschein: ganzes Blatt mit vier Eckwinkeln, markiert nur Halter und die Felder B und E, die die Seiten nennen', () => {
    const html = zeichne({ motiv: 'fahrzeugschein' });
    expect((html.match(/class="sm24-pop stroke-area-strong"/g) ?? []).length).toBe(4);
    expect((html.match(/stroke-dasharray="5 5"/g) ?? []).length).toBe(3);
    // Halter ohne erfundene Feldkennung, nur beschriftet (R4).
    expect(texte(html)).toEqual(['B', 'E', 'Halter', 'B', 'Erstzulassung', 'E', 'Fahrgestellnummer']);
    expect(FOTO_BEISPIEL_TITEL.fahrzeugschein).toMatch(/alle vier Ecken/);
    expect(FOTO_BEISPIEL_TITEL.fahrzeugschein).toMatch(/Halter, Feld B \(Erstzulassung\) und Feld E \(Fahrgestellnummer\) lesbar/);
  });

  it('Typenschild: Hersteller und Nummer markiert', () => {
    const html = zeichne({ motiv: 'typenschild' });
    expect(texte(html)).toEqual(['Hersteller', 'Nummer']);
    expect((html.match(/stroke-dasharray="5 5"/g) ?? []).length).toBe(2);
  });

  it('Schlüsselspitze: Seitenansicht, Blickrichtung und das Profil von vorne', () => {
    const html = zeichne({ motiv: 'schluesselspitze' });
    expect(texte(html)).toEqual(['Seitenansicht', 'Profil von vorne']);
    expect(html).toContain('fill-area-muted stroke-foreground');
  });

  it('Ersatznachweis und Gewerbeanmeldung: Dokument mit Kopfband, vier Ecken und markierten Stellen', () => {
    const nachweis = zeichne({ motiv: 'ersatznachweis' });
    expect(texte(nachweis)).toEqual(['Name', 'Fahrzeug']);
    const gewerbe = zeichne({ motiv: 'gewerbeanmeldung' });
    // Der Bestand nennt keine bestimmte Stelle, nur „vollständig und gut lesbar“; keine Beschriftung „Kopf“.
    expect(texte(gewerbe)).toEqual(['Angaben']);
    expect(FOTO_BEISPIEL_TITEL.gewerbeanmeldung).toBe(
      'Beispiel Gewerbeanmeldung oder Zertifikat: das ganze Blatt mit allen vier Ecken im Bild, alles gut lesbar',
    );
    for (const html of [nachweis, gewerbe]) {
      expect((html.match(/class="sm24-pop stroke-area-strong"/g) ?? []).length).toBeGreaterThanOrEqual(4);
      expect(html).toContain('fill-area-');
    }
  });

  it('nimmt einen gesetzten Titel und fällt bei Unsinn auf den Fahrzeugschein zurück', () => {
    expect(zeichne({ motiv: 'typenschild' }, 'Eigener Titel')).toContain('<title>Eigener Titel</title>');
    const standard = zeichne({});
    for (const params of [{ motiv: 42 }, { motiv: 'rakete' }, { motiv: ['typenschild'] }, null, undefined, 7]) {
      expect(() => zeichne(params)).not.toThrow();
      expect(zeichne(params)).toBe(standard);
    }
    expect(zeichne({ motiv: ' Typenschild ' })).toBe(zeichne({ motiv: 'typenschild' }));
  });

  it('Striche nur aus der Strichskala, runde Enden über den Rahmen', () => {
    for (const motiv of FOTO_BEISPIELE) {
      const html = zeichne({ motiv });
      expect(html).toContain('stroke-linecap="round"');
      for (const [, breite] of html.matchAll(/stroke-width="([^"]+)"/g)) {
        expect(['0.75', '1', '1.5', '2', '2.25', '3', '4']).toContain(breite);
      }
    }
  });

  it.each(FOTO_BEISPIELE)('%s: Beschriftung auf dem Telefon mindestens 14 px, in der Fläche, ohne Überlappung (FA-QA-04D)', (motiv) => {
    // Am Upload-Feld bei 360 px Fensterbreite: Formularspalte 320 px, im Kasten mit p-4 288 px.
    expect(bildschirmPx(FOTO_SCHRIFT, 288, 480)).toBeGreaterThanOrEqual(14);
    const kaesten = textKaesten(zeichne({ motiv }));
    expect(kaesten.length).toBeGreaterThan(0);
    for (const k of kaesten) expect(k.groesse).toBe(FOTO_SCHRIFT);
    expect(ausserhalb(kaesten, 480, 300)).toEqual([]);
    expect(ueberlappungen(kaesten)).toEqual([]);
    // Keine Regel aus globals.css darf die Schrift im Ausschnitt verkleinern.
    expect(zeichne({ motiv })).not.toContain('data-legende');
  });
});
