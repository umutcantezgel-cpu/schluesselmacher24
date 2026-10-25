import { describe, expect, it } from 'vitest';

import codeLinesJson from '../../content/code-lines.json';
import type { CodeLine } from '@/lib/types';

import {
  anwendungKurz,
  codeFamilien,
  codeHersteller,
  codelinieAufloesen,
  codelinieIndexierbar,
  codelinienFamilie,
  codelinienKennung,
  codelinienTitel,
  herstellerPfad,
  kategoriePfad,
  linienZumCode,
  siehtNachCodeAus,
} from './codelinie';

const LINIEN = codeLinesJson as CodeLine[];
const linie = (id: string) => LINIEN.find((line) => line.id === id)!;

describe('codelinienKennung und Titel', () => {
  it('liest die Serienkennung aus dem Namen', () => {
    expect(codelinienKennung(linie('ms-01'))).toBe('MS-01');
    expect(codelinienTitel(linie('ms-01'))).toBe('Büroschrank und Rollcontainer');
  });

  it('nimmt ohne Serienangabe den Slug in Großbuchstaben', () => {
    expect(codelinienKennung({ slug: 'zy-07', name: 'Profilzylinder Kellertür' })).toBe('ZY-07');
  });

  it('kennt Familie und Anwendung ohne Vorsatz', () => {
    expect(codelinienFamilie(linie('bk-02'))).toBe('Briefkasten- und Postanlagen');
    expect(anwendungKurz(linie('bk-02'))).toBe('Briefkastenanlage Mehrfamilienhaus');
  });
});

describe('Kategorien und Hersteller', () => {
  it('bildet je Anwendungsfamilie eine Kategorie mit sprechender Adresse', () => {
    const familien = codeFamilien(LINIEN);
    expect(familien).toHaveLength(10);
    expect(familien[0]).toMatchObject({ name: 'Möbel- und Büroschlösser', adresse: 'moebel-und-bueroschloesser', kuerzel: 'MS' });
    expect(familien.reduce((summe, f) => summe + f.lines.length, 0)).toBe(LINIEN.length);
    expect(kategoriePfad('Möbel- und Büroschlösser')).toBe('/schluessel-nach-code/kategorie/moebel-und-bueroschloesser');
  });

  it('zeigt keine Herstellerebene, solange nur Platzhalter gepflegt sind', () => {
    expect(LINIEN.every((line) => line.manufacturer === '[Hersteller eintragen]')).toBe(true);
    expect(codeHersteller(LINIEN)).toEqual([]);
  });

  it('zeigt einen Hersteller, sobald eine Linie ihn gepflegt hat', () => {
    const gepflegt = LINIEN.map((line) =>
      line.id === 'ms-01' || line.id === 'zy-01' ? { ...line, manufacturer: 'ABUS' } : line,
    );
    const hersteller = codeHersteller(gepflegt);
    expect(hersteller).toHaveLength(1);
    expect(hersteller[0]).toMatchObject({ name: 'ABUS', adresse: 'abus' });
    expect(hersteller[0].lines.map((line) => line.id)).toEqual(['ms-01', 'zy-01']);
    expect(herstellerPfad('ABUS')).toBe('/schluessel-nach-code/hersteller/abus');
  });

  it('nimmt Beispiele und noindex-Linien nicht als indexierbar', () => {
    expect(codelinieIndexierbar(linie('ms-01'))).toBe(true);
    expect(codelinieIndexierbar({ ...linie('ms-01'), example: true })).toBe(false);
    expect(codelinieIndexierbar({ ...linie('ms-01'), seo: { ...linie('ms-01').seo, noindex: true } })).toBe(false);
  });
});

describe('codelinieAufloesen', () => {
  it('findet die Linie über den Slug', () => {
    expect(codelinieAufloesen(LINIEN, 'ms-01')?.line?.id).toBe('ms-01');
  });

  it('leitet die frühere Adresse über die Kennung auf den neuen Slug weiter', () => {
    const umbenannt = LINIEN.map((line) => (line.id === 'ms-01' ? { ...line, slug: 'abus-ms-01' } : line));
    expect(codelinieAufloesen(umbenannt, 'ms-01')).toEqual({ weiterleitung: '/schluessel-nach-code/abus-ms-01' });
    expect(codelinieAufloesen(umbenannt, 'abus-ms-01')?.line?.id).toBe('ms-01');
  });

  it('gibt für Unbekanntes und inaktive Linien nichts zurück', () => {
    expect(codelinieAufloesen(LINIEN, 'gibt-es-nicht')).toBeNull();
    const inaktiv = LINIEN.map((line) => (line.id === 'ms-01' ? { ...line, slug: 'neu', active: false } : line));
    expect(codelinieAufloesen(inaktiv, 'ms-01')).toBeNull();
  });
});

describe('Codesuche', () => {
  it('erkennt Eingaben, die wie ein Code aussehen', () => {
    expect(siehtNachCodeAus('C214')).toBe(true);
    expect(siehtNachCodeAus(' 0812 ')).toBe(true);
    expect(siehtNachCodeAus('Briefkasten')).toBe(false);
    expect(siehtNachCodeAus('Spind 12')).toBe(false);
    expect(siehtNachCodeAus('')).toBe(false);
  });

  it('findet alle Linien, zu deren Codeformat der Code passt', () => {
    const treffer = linienZumCode(LINIEN, 'C214').map((line) => line.id);
    expect(treffer).toContain('ms-02');
    // Jeder Treffer passt wirklich, jede andere Linie nicht.
    for (const line of LINIEN) {
      expect(treffer.includes(line.id), line.id).toBe(new RegExp(line.codePattern).test('C214'));
    }
  });

  it('übernimmt Kleinbuchstaben, wenn die Großschreibung passt (wie das Bestellformular)', () => {
    expect(linienZumCode(LINIEN, 'pz104882').map((line) => line.id)).toContain('zy-02');
  });

  it('liefert für Wörter ohne Ziffer keine Codetreffer', () => {
    expect(linienZumCode(LINIEN, 'Briefkasten')).toEqual([]);
  });
});
