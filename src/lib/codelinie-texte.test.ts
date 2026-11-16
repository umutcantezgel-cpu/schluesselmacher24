import { describe, expect, it } from 'vitest';

import codeLinesJson from '../../content/code-lines.json';
import guidesJson from '../../content/guides.json';
import settingsJson from '../../content/settings.json';
import startwerteCodeLines from '../../content/startwerte/2026-10-25/code-lines.json';
import type { CodeLine, Guide, Settings } from '@/lib/types';
import { generatorTexte } from '@/lib/data/defaults/code-lines';

import {
  ANFRAGE_KASTEN,
  ANFRAGE_WEG,
  BESCHREIBUNG_MAX,
  GRUPPE_AUF_ANFRAGE,
  GRUPPE_NICHT_LIEFERBAR,
  TITEL_MAX,
  aufzaehlung,
  codelinienTexte,
  eigeneTexte,
  fundstelleAusRatgeber,
  gruppeLieferbar,
  gruppenKopfzeile,
  gruppenZustand,
  herstellerTexte,
  istGeneratorText,
  kategorieTexte,
} from './codelinie-texte';
import { codelinienFamilie } from './codelinie';

const LINIEN = codeLinesJson as CodeLine[];
const ALT = startwerteCodeLines as CodeLine[];
const RATGEBER = (guidesJson as Guide[]).find((g) => g.slug === 'schluesselcode-finden')!;
const VERSAND = (settingsJson as unknown as Settings).shipping;
const kontext = { alle: LINIEN, versand: VERSAND, ratgeber: RATGEBER };
const linie = (id: string) => LINIEN.find((line) => line.id === id)!;
const texte = (line: CodeLine) => codelinienTexte(line, kontext);

/* Wort-Trigramme und Jaccard-Ähnlichkeit — wie scripts/textgleichheit.mjs. */
function trigramme(text: string): Set<string> {
  const woerter = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const menge = new Set<string>();
  for (let i = 0; i + 2 < woerter.length; i += 1) menge.add(`${woerter[i]} ${woerter[i + 1]} ${woerter[i + 2]}`);
  return menge;
}
function jaccard(a: Set<string>, b: Set<string>): number {
  let gemeinsam = 0;
  for (const t of a) if (b.has(t)) gemeinsam += 1;
  return gemeinsam / (a.size + b.size - gemeinsam);
}
function mittlereAehnlichkeit(seiten: string[]): number {
  const mengen = seiten.map(trigramme);
  let summe = 0;
  let paare = 0;
  for (let i = 0; i < mengen.length; i += 1) {
    for (let j = i + 1; j < mengen.length; j += 1) {
      summe += jaccard(mengen[i], mengen[j]);
      paare += 1;
    }
  }
  return summe / paare;
}

describe('Erkennung des Generator-Texts', () => {
  it('erkennt den heutigen Startwert jeder Linie', () => {
    for (const line of LINIEN) {
      const vorlage = generatorTexte(line);
      expect(istGeneratorText(line.description, vorlage.description), line.id).toBe(true);
      expect(istGeneratorText(line.seo.title, vorlage.seoTitle), line.id).toBe(true);
      expect(istGeneratorText(line.seo.description, vorlage.seoDescription), line.id).toBe(true);
      expect(eigeneTexte(line), line.id).toEqual({});
    }
  });

  it('erkennt auch den früheren, kleingeschriebenen Startwert (Livegang-Stand)', () => {
    const alt = ALT.find((line) => line.id === 'ms-01')!;
    expect(alt.description).toContain('möbel- und büroschloss');
    expect(eigeneTexte(alt)).toEqual({});
  });

  it('wertet leere Texte und den Namen als Titel nicht als gepflegt', () => {
    const line = { ...linie('ms-01'), description: '', seo: { ...linie('ms-01').seo, title: linie('ms-01').name, description: '' } };
    expect(eigeneTexte(line)).toEqual({});
  });
});

describe('codelinienTexte', () => {
  it('setzt für zwei Linien unterschiedliche Texte aus deren Daten zusammen', () => {
    const a = texte(linie('ms-01'));
    const b = texte(linie('bk-02'));
    for (const feld of ['metaTitel', 'metaBeschreibung', 'einleitung', 'beschreibung'] as const) {
      expect(a[feld], feld).not.toBe(b[feld]);
    }
    expect(a.metaBeschreibung).toContain('Möbelschlüssel');
    expect(a.metaBeschreibung).toContain('3 bis 4 Ziffern');
    expect(a.metaBeschreibung).toContain('0812');
    expect(b.beschreibung).toContain('BK-02');
    expect(b.beschreibung).toContain('Briefkastenanlage Mehrfamilienhaus');
    expect(a.faq.map((f) => f.question)).not.toEqual(b.faq.map((f) => f.question));
  });

  it('nennt Preis, Staffel, Versand, Foto und verwandte Linien derselben Familie', () => {
    const t = texte(linie('ms-01'));
    expect(t.beschreibung).toContain('8,00');
    expect(t.beschreibung).toContain('ab 3 Stück 7,20');
    const preisFrage = t.faq.find((f) => f.question.startsWith('Was kostet'))!;
    expect(preisFrage.answer).toContain('Versand verfolgbar 4,95');
    expect(preisFrage.answer).toContain('Abholung im Fachbetrieb ohne Versandkosten');
    expect(t.verwandte.map((line) => line.id)).toEqual(['ms-02', 'ms-03', 'ms-04', 'ms-05', 'ms-06']);
    expect(texte(linie('zy-02')).faq.some((f) => f.answer.includes('Sicherungskarte'))).toBe(true);
  });

  it('nimmt die Fundstelle aus dem Ratgeber nur, wo er die Familie nennt', () => {
    expect(fundstelleAusRatgeber(RATGEBER, linie('sp-01'))).toMatch(/^Bei Möbel-, Spind- und Briefkastenschlössern/);
    expect(fundstelleAusRatgeber(RATGEBER, linie('zy-02'))).toContain('Sicherungskarte');
    expect(fundstelleAusRatgeber(RATGEBER, linie('ts-01'))).toBeUndefined();
    expect(fundstelleAusRatgeber(null, linie('ms-01'))).toBeUndefined();
  });

  it('zeigt Hersteller, Profil und Codeserie nur, wenn sie gepflegt sind', () => {
    const ohne = texte(linie('ms-01'));
    const text = [ohne.metaTitel, ohne.metaBeschreibung, ohne.einleitung, ohne.beschreibung, ...ohne.faq.map((f) => f.answer)].join(' ');
    expect(text).not.toContain('Hersteller');
    const mit = texte({ ...linie('ms-01'), manufacturer: 'ABUS', profile: 'Profil 20', codeSeries: 'Serie 100' });
    expect(mit.metaTitel).toContain('ABUS');
    expect(mit.beschreibung).toContain('Er gehört zu Schlössern von ABUS. Das Profil heißt Profil 20, die Codeserie Serie 100.');
  });

  it('lässt eigene Texte aus dem Backend immer gewinnen', () => {
    const eigen = {
      ...linie('ms-01'),
      description: 'Unser Möbelschlüssel für Rollcontainer, gefertigt in Wetzlar.',
      seo: { ...linie('ms-01').seo, title: 'Rollcontainer-Schlüssel nach Code', description: 'Eigene Meta-Beschreibung.' },
    };
    const t = texte(eigen);
    expect(t.beschreibung).toBe(eigen.description);
    expect(t.metaTitel).toBe('Rollcontainer-Schlüssel nach Code');
    expect(t.metaBeschreibung).toBe('Eigene Meta-Beschreibung.');
    expect(t.eigen).toEqual({ beschreibung: true, titel: true, metaBeschreibung: true });
  });

  it('hält Titel und Meta-Beschreibung jeder Linie kurz, eindeutig und richtig geschrieben', () => {
    const alle = LINIEN.map(texte);
    for (const [i, t] of alle.entries()) {
      expect(t.metaTitel.length, LINIEN[i].id).toBeLessThanOrEqual(TITEL_MAX);
      expect(t.metaBeschreibung.length, LINIEN[i].id).toBeLessThanOrEqual(BESCHREIBUNG_MAX);
      expect(t.metaBeschreibung, LINIEN[i].id).not.toMatch(/für [a-zäöü]+- und/);
    }
    expect(new Set(alle.map((t) => t.metaTitel)).size).toBe(LINIEN.length);
    expect(new Set(alle.map((t) => t.metaBeschreibung)).size).toBe(LINIEN.length);
  });

  it('senkt die Textgleichheit der Produkttexte deutlich gegenüber dem Generator', () => {
    const vorher = ALT.map((line) => [line.seo.description, line.description, line.codeHint].join(' '));
    const nachher = LINIEN.map((line) => {
      const t = texte(line);
      return [t.metaBeschreibung, t.einleitung, t.beschreibung, ...t.faq.flatMap((f) => [f.question, f.answer])].join(' ');
    });
    const alt = mittlereAehnlichkeit(vorher);
    const neu = mittlereAehnlichkeit(nachher);
    expect(alt).toBeGreaterThan(0.6);
    expect(neu).toBeLessThan(alt * 0.75);
  });
});

describe('kategorieTexte', () => {
  it('setzt Titel und Text aus den Linien der Familie zusammen', () => {
    // Familien wie in den Musterdaten (letztes Schlagwort), in der Reihenfolge der Daten.
    const familien = [...new Set(LINIEN.map(codelinienFamilie))].map((name) => ({ name, lines: LINIEN.filter((l) => codelinienFamilie(l) === name) }));
    const [moebel, spind] = familien;
    const a = kategorieTexte(moebel.name, moebel.lines, RATGEBER);
    const b = kategorieTexte(spind.name, spind.lines, RATGEBER);
    expect(a.metaTitel).not.toBe(b.metaTitel);
    expect(a.metaTitel.length).toBeLessThanOrEqual(TITEL_MAX);
    expect(a.metaBeschreibung.length).toBeLessThanOrEqual(BESCHREIBUNG_MAX);
    expect(a.einleitung).toContain('6 Produkte');
    expect(a.absaetze.join(' ')).toContain('Möbelschlüssel');
    expect(a.fundstelle).toContain('Möbel-');
  });

  it('nennt ohne lieferbares Produkt weder Preise noch Staffelpreise (R9)', () => {
    const familie = codelinienFamilie(LINIEN[0]);
    const lines = LINIEN.filter((l) => codelinienFamilie(l) === familie);
    // Gegenprobe: Lieferbar nennt die Seite Preise, und die Musterdaten haben eine Staffel.
    const lieferbar = kategorieTexte(familie, lines, RATGEBER).absaetze.join(' ');
    expect(lieferbar).toContain('Preise je Stück');
    expect(lieferbar).toContain('Staffelpreise gelten ab');
    for (const availability of ['auf-anfrage', 'nicht-lieferbar'] as const) {
      const t = kategorieTexte(familie, lines.map((l) => ({ ...l, availability })), RATGEBER);
      const text = [t.einleitung, ...t.absaetze, t.metaBeschreibung].join(' ');
      expect(text).not.toContain('Staffelpreis');
      expect(text).not.toContain('Preise je Stück');
      expect(text).not.toContain('Preis je Stück');
      expect(text).not.toMatch(/Codelinie/);
    }
  });
});

describe('codelinienTexte nach Verfügbarkeit (FA-SHOP-01B)', () => {
  const alle = (t: ReturnType<typeof texte>) => [t.metaBeschreibung, t.einleitung, t.beschreibung, ...t.faq.flatMap((f) => [f.question, f.answer])].join(' ');

  it('„auf Anfrage“ beschreibt keinen Direktkauf, keine Stückzahl und keinen Preis', () => {
    const t = texte({ ...linie('ms-01'), availability: 'auf-anfrage' });
    const text = alle(t);
    expect(t.metaBeschreibung).toContain('nach Code anfragen');
    expect(text).not.toMatch(/bestellen:|Bestellformular|je Bestellung|je Stück|€/);
    expect(t.einleitung).toContain(ANFRAGE_WEG);
    expect(t.faq.find((f) => f.question.startsWith('Was kostet'))?.answer).toContain('Angebot');
  });

  it('„nicht lieferbar“ sagt es und nennt weder Preis noch Bestellweg', () => {
    const t = texte({ ...linie('ms-01'), availability: 'nicht-lieferbar' });
    const text = alle(t);
    expect(t.metaBeschreibung).toContain('derzeit nicht lieferbar');
    expect(text).not.toMatch(/bestellen:|Bestellformular|je Bestellung|je Stück|€/);
    expect(t.faq.some((f) => f.question.startsWith('Was kostet'))).toBe(false);
  });

  it('lieferbar bleibt beim Direktkauf, ohne Gedankenstrich in der Einleitung', () => {
    const t = texte(linie('ms-01'));
    expect(t.metaBeschreibung).toContain('nach Code bestellen');
    expect(t.einleitung).not.toMatch(/[—–]/);
    // Die Antwort spricht vom Code, nicht vom Formular (FA-INHALT-03I, L-08, L-30).
    expect(t.faq.find((f) => f.question.startsWith('Wie sieht'))?.answer).toBe(
      'Der Code für MS-01 sieht so aus: 3 bis 4 Ziffern, zum Beispiel 0812. Sieht Ihr Code anders aus, fragen Sie ihn bei uns an.',
    );
  });
});

describe('Linien aus dem Import (Hersteller und System, ohne Schlagwort-Familie)', () => {
  // Erfundene Testdaten (G4): Hersteller „Testwerk“, System „TX 100“, so wie scripts/sortiment-import.mjs sie schreibt.
  const importiert: CodeLine = {
    ...linie('ms-01'),
    example: false,
    id: 'testwerk-tx-100-1-bis-500',
    slug: 'testwerk-tx-100-1-bis-500',
    name: 'Testwerk TX 100, Codebereich 1 bis 500',
    manufacturer: 'Testwerk',
    manufacturerId: 'testwerk',
    system: 'TX 100',
    codeRange: '1 bis 500',
    application: 'Testwerk TX 100',
    tags: [],
    description: '',
  };

  it('nennt die Linie „Hersteller System“ und keine Familie, die nur das System wiederholt', () => {
    const t = texte(importiert);
    expect(t.beschreibung).not.toContain('Anwendungsfamilie');
    expect(t.beschreibung).not.toContain('TESTWERK-TX-100');
    expect(t.beschreibung).not.toMatch(/Testwerk TX 100 ist für Testwerk TX 100/);
    expect(t.faq.map((f) => f.question).join(' ')).toContain('Testwerk TX 100');
  });
});

describe('Produktseite: Befunde der drei Leser (FA-INHALT-03I)', () => {
  const satzZahl = (text: string, satz: string) => text.split(satz).length - 1;
  const seite = (t: ReturnType<typeof texte>) =>
    [t.einleitung, t.beschreibung, t.fundstelle, t.codeHinweis, ...t.faq.flatMap((f) => [f.question, f.answer])].join(' ');
  const mitSchloss = { ...linie('ms-01'), manufacturer: 'Musterwerk', system: 'M 100', codeRange: '1 bis 999' };

  it('„nicht lieferbar“ beschreibt keine Fertigung und sagt das Nichtbestellen nur einmal im Text (L-01, L-19, L-35)', () => {
    const t = texte({ ...mitSchloss, availability: 'nicht-lieferbar' });
    expect(t.einleitung).toBe('Diesen Möbelschlüssel für Büroschrank und Rollcontainer können Sie zurzeit nicht bestellen.');
    expect(seite(t)).not.toMatch(/gefertigt|fertigen/);
    expect(satzZahl(seite(t), 'zurzeit nicht bestellen')).toBe(1);
    expect(t.metaBeschreibung).not.toContain('Fragen Sie gern');
    // Suchbeschreibung wie der Kasten: der Weg in die Code-Anfrage, ohne Original-Zusage.
    expect(t.metaBeschreibung).toContain('Fragen Sie Ihren Code bei uns an.');
    expect(t.metaBeschreibung).not.toContain('Originalschlüssel');
  });

  it('„auf Anfrage“ nennt den Weg in Einleitung und Kasten im selben Wortlaut, sonst nirgends (L-05)', () => {
    const t = texte({ ...mitSchloss, availability: 'auf-anfrage' });
    expect(ANFRAGE_KASTEN).toBe(
      'Diesen Schlüssel können Sie nicht in den Warenkorb legen. Über „Code anfragen“ prüfen wir Ihren Code und melden uns mit einem Angebot.',
    );
    expect(satzZahl(seite(t), ANFRAGE_WEG)).toBe(1);
    expect(seite(t)).not.toMatch(/nicht direkt|Bitte fragen Sie/);
  });

  it('nennt das Original höchstens einmal im Text, die Plakette kommt dazu (L-10)', () => {
    for (const availability of ['lieferbar', 'auf-anfrage', 'nicht-lieferbar'] as const) {
      const text = seite(texte({ ...mitSchloss, availability }));
      const zahl = (text.match(/Originalschlüssel/g) ?? []).length;
      expect(zahl, availability).toBeLessThanOrEqual(1);
    }
  });

  it('kein „Anwendungsfamilie“, kein „Codeformat“ im Text; System und Codebereich beim ersten Vorkommen erklärt (L-03, L-04, L-07, L-26)', () => {
    for (const availability of ['lieferbar', 'auf-anfrage', 'nicht-lieferbar'] as const) {
      const t = texte({ ...mitSchloss, availability });
      expect(seite(t), availability).not.toMatch(/Anwendungsfamilie|Familie|Codeformat|Prägung|Angaben zum Schloss:/);
      expect(t.beschreibung).toContain('Er gehört zu Schlössern von Musterwerk im System M 100 (so nennt der Hersteller sein Schließsystem).');
      expect(t.beschreibung).toContain('Der Codebereich ist 1 bis 999, in diesem Bereich liegt Ihr Code.');
      expect(t.beschreibung).toContain('So sieht der Code aus: 3 bis 4 Ziffern, zum Beispiel 0812.');
      expect(t.faq.find((f) => f.question.startsWith('Für welche Schlösser'))?.answer).toBe(
        'MS-01 gehört zu Schlössern von Musterwerk im System M 100. Ihr Code liegt im Codebereich 1 bis 999. '
          + 'Vergleichen Sie das mit dem, was auf Ihrem Schloss oder Schlüssel steht.',
      );
    }
  });

  it('keine Antwort nennt ein Bestellformular, „nicht lieferbar“ auch keine Anfrage (L-08, L-30)', () => {
    for (const availability of ['lieferbar', 'auf-anfrage', 'nicht-lieferbar'] as const) {
      const text = texte({ ...mitSchloss, availability }).faq.map((f) => f.answer).join(' ');
      expect(text, availability).not.toMatch(/Formular|Eingabe/);
    }
    const aus = texte({ ...mitSchloss, availability: 'nicht-lieferbar' }).faq.find((f) => f.question.startsWith('Wie sieht'))?.answer;
    expect(aus).toBe('Der Code für MS-01 sieht so aus: 3 bis 4 Ziffern, zum Beispiel 0812.');
  });

  it('„Wo steht der Code“: ein Satz statt zweier fast gleicher, ohne „Erwartetes Format“ (L-09, L-28)', () => {
    const mitRatgeber = texte(linie('ms-01'));
    const frage = mitRatgeber.faq.find((f) => f.question.startsWith('Wo steht'))!;
    expect(frage.answer).toBe(mitRatgeber.fundstelle);
    expect(mitRatgeber.codeHinweis).toBeUndefined();
    // Ohne Ratgebersatz bleibt der Startwert der Linie, ohne den Satzrest.
    const ohne = codelinienTexte(linie('ms-01'), { ...kontext, ratgeber: null });
    expect(ohne.codeHinweis).toBe('Der Code steht meist direkt auf dem Schloss oder auf dem Schlüsselkopf.');
    expect(ohne.faq.find((f) => f.question.startsWith('Wo steht'))?.answer).toBe(ohne.codeHinweis);
    // Ein im Backend gepflegter Hinweis gilt immer.
    const gepflegt = texte({ ...linie('ms-01'), codeHint: 'Der Code steht unten am Schließblech.' });
    expect(gepflegt.codeHinweis).toBe('Der Code steht unten am Schließblech.');
    expect(gepflegt.faq.find((f) => f.question.startsWith('Wo steht'))?.answer).toContain('Der Code steht unten am Schließblech.');
  });
});

describe('Gruppen mit drei Zuständen (FA-INHALT-03I, L-06, L-13, L-24)', () => {
  const familie = codelinienFamilie(LINIEN[0]);
  const moebel = LINIEN.filter((l) => codelinienFamilie(l) === familie);
  const alle = (availability: 'lieferbar' | 'auf-anfrage' | 'nicht-lieferbar') => moebel.map((l) => ({ ...l, availability }));
  const gemischt = (...staende: Array<'lieferbar' | 'auf-anfrage' | 'nicht-lieferbar'>) =>
    staende.map((availability, i) => ({ ...moebel[i], availability }));

  it('erkennt lieferbar, auf Anfrage und nicht lieferbar, auch in gemischten Gruppen', () => {
    expect(gruppenZustand(alle('lieferbar'))).toBe('lieferbar');
    expect(gruppenZustand(alle('auf-anfrage'))).toBe('auf-anfrage');
    expect(gruppenZustand(alle('nicht-lieferbar'))).toBe('nicht-lieferbar');
    expect(gruppenZustand(gemischt('nicht-lieferbar', 'auf-anfrage', 'lieferbar'))).toBe('lieferbar');
    expect(gruppenZustand(gemischt('nicht-lieferbar', 'auf-anfrage'))).toBe('auf-anfrage');
    expect(gruppenZustand(gemischt('nicht-lieferbar', 'nicht-lieferbar'))).toBe('nicht-lieferbar');
    // Ältere Daten ohne Angabe gelten als lieferbar; ohne Produkte führt die Seite in die Anfrage.
    expect(gruppenZustand([{ availability: undefined }])).toBe('lieferbar');
    expect(gruppenZustand([])).toBe('auf-anfrage');
    expect(gruppeLieferbar(gemischt('nicht-lieferbar', 'auf-anfrage'))).toBe(false);
  });

  it('Kopfzeile je Zustand', () => {
    expect(gruppenKopfzeile('Kategorie', alle('lieferbar'))).toBe('Kategorie · Direkt kaufen');
    expect(gruppenKopfzeile('Kategorie', gemischt('nicht-lieferbar', 'auf-anfrage'))).toBe('Kategorie · Auf Anfrage');
    expect(gruppenKopfzeile('Hersteller', alle('nicht-lieferbar'))).toBe('Hersteller · Derzeit nicht lieferbar');
    expect(gruppenKopfzeile('Kategorie', [])).toBe('Kategorie · Auf Anfrage');
  });

  it('Kategorieseite: Einleitung und Suchbeschreibung je Zustand, ohne Reihe aller Anwendungen (L-11, L-25)', () => {
    const lief = kategorieTexte('Möbel- und Büroschlösser', alle('lieferbar'), RATGEBER);
    expect(lief.einleitung).toBe(
      '6 Produkte für Möbel- und Büroschlösser. Bei jedem Produkt steht, wofür es gedacht ist. '
        + 'Sie geben den Code ein, wir fertigen danach. Ihr Originalschlüssel bleibt bei Ihnen.',
    );
    const anfrage = kategorieTexte('Möbel- und Büroschlösser', gemischt('nicht-lieferbar', 'auf-anfrage'), RATGEBER);
    expect(anfrage.einleitung).toContain(GRUPPE_AUF_ANFRAGE);
    expect(anfrage.metaBeschreibung).toContain('Fragen Sie uns mit Ihrem Code an.');
    const nicht = kategorieTexte('Möbel- und Büroschlösser', alle('nicht-lieferbar'), RATGEBER);
    expect(nicht.einleitung).toBe(
      `6 Produkte für Möbel- und Büroschlösser. Bei jedem Produkt steht, wofür es gedacht ist. ${GRUPPE_NICHT_LIEFERBAR}`,
    );
    for (const t of [nicht]) {
      const text = [t.einleitung, t.metaBeschreibung, ...t.absaetze].join(' ');
      expect(text).not.toMatch(/prüfen|Anfrage|anfragen|Originalschlüssel/);
      expect(t.metaBeschreibung).toContain(GRUPPE_NICHT_LIEFERBAR);
    }
    for (const t of [lief, anfrage, nicht]) {
      expect(t.einleitung).not.toContain('Büroschrank');
      expect([t.einleitung, ...t.absaetze].join(' ')).not.toMatch(/Codeformat|und [^.,]+ und [^.,]+ und/);
    }
  });

  it('Herstellerseite: dieselben Fassungen, Systeme nur in der Einleitung, Preis in der Einzahl (L-31)', () => {
    const zwei = [
      { ...moebel[0], manufacturer: 'Musterwerk', system: 'M 100' },
      { ...moebel[1], manufacturer: 'Musterwerk', system: 'M 200', priceCents: moebel[0].priceCents },
    ];
    const lief = herstellerTexte('Musterwerk', zwei);
    expect(lief.einleitung).toContain('in den Systemen M 100 und M 200.');
    expect(lief.absaetze.join(' ')).not.toContain('System');
    expect(lief.absaetze.join(' ')).toContain('Der Preis je Stück beträgt');
    expect(lief.absaetze.join(' ')).not.toContain('Preise');
    const anfrage = herstellerTexte('Musterwerk', zwei.map((l, i) => ({ ...l, availability: i ? 'auf-anfrage' as const : 'nicht-lieferbar' as const })));
    expect(anfrage.einleitung).toContain(GRUPPE_AUF_ANFRAGE);
    expect(anfrage.metaBeschreibung).toContain('Fragen Sie uns mit Ihrem Code an.');
    const nicht = herstellerTexte('Musterwerk', zwei.map((l) => ({ ...l, availability: 'nicht-lieferbar' as const })));
    expect(nicht.einleitung).toContain(GRUPPE_NICHT_LIEFERBAR);
    expect(nicht.metaBeschreibung).toContain(GRUPPE_NICHT_LIEFERBAR);
    expect([nicht.einleitung, nicht.metaBeschreibung, ...nicht.absaetze].join(' ')).not.toMatch(/prüfen|Anfrage|Preis/);
  });

  it('Aufzählung: „sowie“ vor dem letzten Wert, wenn ein Wert selbst „und“ enthält (L-23)', () => {
    expect(aufzaehlung(['A', 'B', 'C'])).toBe('A, B und C');
    expect(aufzaehlung(['Schreibtisch und Sideboard', 'Werkstattschrank und Werkbank'])).toBe(
      'Schreibtisch und Sideboard sowie Werkstattschrank und Werkbank',
    );
  });
});
