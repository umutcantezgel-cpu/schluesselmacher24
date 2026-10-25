import { describe, expect, it } from 'vitest';

import codeLinesJson from '../../content/code-lines.json';
import guidesJson from '../../content/guides.json';
import settingsJson from '../../content/settings.json';
import startwerteCodeLines from '../../content/startwerte/2026-10-25/code-lines.json';
import type { CodeLine, Guide, Settings } from '@/lib/types';
import { generatorTexte } from '@/lib/data/defaults/code-lines';

import {
  BESCHREIBUNG_MAX,
  TITEL_MAX,
  codelinienTexte,
  eigeneTexte,
  fundstelleAusRatgeber,
  istGeneratorText,
  kategorieTexte,
} from './codelinie-texte';
import { codeFamilien } from './codelinie';

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
    expect(mit.beschreibung).toContain('Hersteller ABUS, Profil Profil 20, Codeserie Serie 100');
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
    const [moebel, spind] = codeFamilien(LINIEN);
    const a = kategorieTexte(moebel.name, moebel.lines, RATGEBER);
    const b = kategorieTexte(spind.name, spind.lines, RATGEBER);
    expect(a.metaTitel).not.toBe(b.metaTitel);
    expect(a.metaTitel.length).toBeLessThanOrEqual(TITEL_MAX);
    expect(a.metaBeschreibung.length).toBeLessThanOrEqual(BESCHREIBUNG_MAX);
    expect(a.einleitung).toContain('6 Codelinien');
    expect(a.absaetze.join(' ')).toContain('Möbelschlüssel');
    expect(a.fundstelle).toContain('Möbel-');
  });
});
