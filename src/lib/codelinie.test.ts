import { describe, expect, it } from 'vitest';

import codeLinesJson from '../../content/code-lines.json';
import type { CodeLine, ShopHersteller, ShopKategorie } from '@/lib/types';

import {
  anwendungKurz,
  bestellWeg,
  codeKategorieAufloesen,
  codeKategorien,
  codelinieAufloesen,
  codelinieIndexierbar,
  codelinienFamilie,
  codelinienKennung,
  codelinienTitel,
  herstellerMitSeite,
  herstellerPfad,
  kategoriePfad,
  linienZumCode,
  nachHerstellerUndSystem,
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

/* Erfundene Testdaten (G4): Hersteller „Alpha Schloss“ und „Beta“, Systeme und Kategorien nur zur Mechanik. */
const STAMM: ShopHersteller[] = [
  { id: 'beta', slug: 'beta', name: 'Beta', einsatz: '', angeboten: true, reihenfolge: 10 },
  { id: 'alpha', slug: 'alpha-schloss', name: 'Alpha Schloss', einsatz: '', angeboten: true, reihenfolge: 20 },
  { id: 'gamma', slug: 'gamma', name: 'Gamma', einsatz: '', angeboten: true, reihenfolge: 30 },
];
const mit = (id: string, felder: Partial<CodeLine>): CodeLine => ({ ...linie(id), example: false, ...felder });

describe('Liste nach Hersteller und System (FA-11-04 bis FA-11-06)', () => {
  const linien = [
    mit('ms-01', { manufacturerId: 'alpha', system: 'Z 200' }),
    mit('ms-02', { manufacturerId: 'beta', system: 'Q' }),
    mit('ms-03', { manufacturerId: 'alpha', system: 'A 100' }),
    mit('ms-04', { manufacturer: 'Alpha Schloss', system: 'Z 200' }),
    mit('ms-05', { manufacturer: 'Delta' }),
    mit('ms-06', {}),
  ];

  it('gruppiert nach Hersteller, darunter nach System', () => {
    const gruppen = nachHerstellerUndSystem(linien, STAMM);
    expect(gruppen.map((g) => g.name)).toEqual(['Beta', 'Alpha Schloss', 'Delta', undefined]);
    const alpha = gruppen[1];
    expect(alpha.adresse).toBe('alpha-schloss');
    expect(alpha.systeme.map((s) => [s.name, s.lines.map((l) => l.id)])).toEqual([
      ['A 100', ['ms-03']],
      ['Z 200', ['ms-01', 'ms-04']],
    ]);
    expect(gruppen[2]).toMatchObject({ name: 'Delta', adresse: 'delta' });
    expect(gruppen[3].systeme[0].name).toBeUndefined();
  });

  it('zeigt unter einem Hersteller nur seine wirklich angebotenen Produkte', () => {
    const beta = nachHerstellerUndSystem(linien, STAMM).find((g) => g.name === 'Beta')!;
    expect(beta.lines.map((l) => l.id)).toEqual(['ms-02']);
    // Freitext zählt nur bei genau gleichem Namen; eine andere Kennung schlägt den Freitext.
    const fremd = nachHerstellerUndSystem([mit('ms-01', { manufacturerId: 'beta', manufacturer: 'Alpha Schloss' })], STAMM);
    expect(fremd.map((g) => g.name)).toEqual(['Beta']);
  });

  it('ein Hersteller ohne Produkte hat keine Seite', () => {
    const seiten = herstellerMitSeite(linien, STAMM);
    expect(seiten.map((h) => h.adresse)).toEqual(['beta', 'alpha-schloss', 'delta']);
    expect(seiten.some((h) => h.name === 'Gamma')).toBe(false);
    // Nur Platzhalter: keine Herstellerebene.
    expect(LINIEN.every((line) => line.manufacturer === '[Hersteller eintragen]')).toBe(true);
    expect(herstellerMitSeite(LINIEN, STAMM)).toEqual([]);
    expect(herstellerPfad('alpha-schloss')).toBe('/schluessel-nach-code/hersteller/alpha-schloss');
    expect(herstellerPfad('ABUS')).toBe('/schluessel-nach-code/hersteller/abus');
  });
});

describe('Unterkategorien aus den Daten (FA-10, FA-22-04)', () => {
  const k = (felder: Partial<ShopKategorie> & Pick<ShopKategorie, 'id'>): ShopKategorie => ({
    slug: felder.id,
    name: felder.id,
    beschreibung: 'Test',
    reihenfolge: 10,
    art: 'codeprodukte',
    ziel: '/schluessel-nach-code',
    sichtbar: true,
    fruehereAdressen: [],
    ...felder,
  });
  const KATEGORIEN = [
    k({ id: 'schluessel-nach-code' }),
    k({ id: 'briefkasten', eltern: 'schluessel-nach-code', fruehereAdressen: ['post'] }),
    k({ id: 'briefkasten-gross', eltern: 'briefkasten', reihenfolge: 20 }),
    k({ id: 'verborgen', eltern: 'schluessel-nach-code', sichtbar: false }),
    k({ id: 'artikel', art: 'artikel', ziel: '/artikel' }),
    k({ id: 'zubehoer', eltern: 'artikel' }),
  ];
  const linien = [mit('ms-01', { categoryId: 'briefkasten' }), mit('ms-02', { categoryId: 'briefkasten-gross' }), mit('ms-03', { categoryId: 'verborgen' })];

  it('nimmt nur sichtbare Unterkategorien der Codeprodukte, mit den Linien tieferer Ebenen', () => {
    const liste = codeKategorien(KATEGORIEN, linien);
    expect(liste.map((e) => [e.kategorie.id, e.lines.map((l) => l.id)])).toEqual([
      ['briefkasten', ['ms-01', 'ms-02']],
      ['briefkasten-gross', ['ms-02']],
    ]);
    expect(kategoriePfad('briefkasten')).toBe('/schluessel-nach-code/kategorie/briefkasten');
  });

  it('leitet eine frühere Adresse weiter und kennt keine fremden Kategorien', () => {
    expect(codeKategorieAufloesen(KATEGORIEN, 'briefkasten')?.kategorie?.id).toBe('briefkasten');
    expect(codeKategorieAufloesen(KATEGORIEN, 'post')).toEqual({ weiterleitung: '/schluessel-nach-code/kategorie/briefkasten' });
    expect(codeKategorieAufloesen(KATEGORIEN, 'verborgen')).toBeNull();
    expect(codeKategorieAufloesen(KATEGORIEN, 'zubehoer')).toBeNull();
    expect(codeKategorieAufloesen(KATEGORIEN, 'schluessel-nach-code')).toBeNull();
  });
});

describe('Bestellweg nach Verfügbarkeit (FA-22-10)', () => {
  it('„nicht lieferbar“ hat keinen Warenkorb, „auf Anfrage“ führt in die Code-Anfrage', () => {
    expect(bestellWeg({})).toBe('warenkorb');
    expect(bestellWeg({ availability: 'lieferbar' })).toBe('warenkorb');
    expect(bestellWeg({ availability: 'auf-anfrage' })).toBe('anfrage');
    expect(bestellWeg({ availability: 'nicht-lieferbar' })).toBe('keiner');
  });
});

describe('Indexierbarkeit', () => {
  it('nimmt Beispiele und noindex-Linien nicht als indexierbar', () => {
    // Die Muster-Linien sind Beispiele (A-046); als echte Linie wäre ms-01 indexierbar.
    expect(codelinieIndexierbar(linie('ms-01'))).toBe(false);
    expect(codelinieIndexierbar({ ...linie('ms-01'), example: false })).toBe(true);
    expect(codelinieIndexierbar({ ...linie('ms-01'), example: true })).toBe(false);
    expect(codelinieIndexierbar({ ...linie('ms-01'), example: false, seo: { ...linie('ms-01').seo, noindex: true } })).toBe(false);
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
