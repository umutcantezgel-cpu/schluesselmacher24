import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { getVisual, schmaleFassung } from '@/components/visual/registry';
import type { ImageSlot, UploadSteckplatz, VisualRef } from '@/lib/types';
import { visualFuerMotiv, visualFuerSteckplatz } from '@/lib/visual/motiv';

import { KEY_PHOTO_SLOTS, REGISTRATION_EXAMPLE } from '@/components/autoschluessel/optionen';
import { BEISPIEL_ERSATZNACHWEIS, BEISPIEL_FAHRZEUGSCHEIN, BEISPIEL_TYPENSCHILD } from '@/components/fahrzeug-anfrage/kern';

import { PhotoUpload, beispielFuerFeld } from './photo-upload';
import { PhotoUploadAlleZeichnungen } from './photo-upload-voll';
import { UPLOAD_ZEICHNUNGEN, UploadBeispiel } from './upload-beispiel';

/* FA-SEO-03D: Das Upload-Feld zeichnet sein Beispiel ohne das Register aller Generatoren. Die Tests halten
   fest, dass (1) jedes Beispiel an einem Upload-Feld nur Generatoren aus UPLOAD_ZEICHNUNGEN braucht,
   (2) die Fläche dasselbe Markup ergibt wie ImagePlaceholder und (3) der Baustein das Register nicht
   wieder hereinzieht. */

const lies = (pfad: string) => readFileSync(pfad, 'utf8');
/** Ziele der Importe, die zur Laufzeit geladen werden (ohne `import type`). */
const ziele = (quelle: string) =>
  [...quelle.matchAll(/^import\s+(?!type\s)[^;]*?from\s*'([^']+)'|import\(\s*'([^']+)'/gm)].map((m) => m[1] ?? m[2]);

const STECKPLAETZE: UploadSteckplatz[] = [
  'fahrzeugschein',
  'schluessel-vorderseite',
  'schluessel-rueckseite',
  'schluessel-spitze',
  'ersatznachweis',
  'typenschild',
  'sicherungskarte',
  'sonstiges',
];

const UPLOAD_FELD = resolve('src/components/forms/photo-upload');
/** Die Fassung mit allen Zeichnungen: Ihre Beispiele zeichnet `ImagePlaceholder`, sie braucht keine Prüfung. */
const VOLLE_FASSUNG = 'src/components/forms/photo-upload-voll.tsx';

/** Ob `ziel`, aus `datei` importiert, das Upload-Feld ist (Alias oder relativer Pfad). */
function istUploadFeld(datei: string, ziel: string): boolean {
  if (ziel === '@/components/forms/photo-upload') return true;
  return ziel.startsWith('.') && resolve(dirname(datei), ziel) === UPLOAD_FELD;
}

/** Dateien, die `PhotoUpload` aus dem Upload-Feld importieren, über den Alias oder relativ (ohne Tests und ohne die Fassung mit allen Zeichnungen). */
function aufrufer(): string[] {
  return execSync("grep -rl \"photo-upload'\" src --include=*.tsx --include=*.ts", { encoding: 'utf8' })
    .split('\n')
    .filter((d) => d && !/\.test\.tsx?$/.test(d) && d !== VOLLE_FASSUNG)
    .filter((d) =>
      [...lies(d).matchAll(/import\s*\{([^}]*)\}\s*from\s*'([^']+)'/g)].some(
        (m) => /\bPhotoUpload\b/.test(m[1]) && istUploadFeld(d, m[2]),
      ),
    );
}

/**
 * Dateien, die `example={example}` weiterreichen dürfen, mit der Hülle, die es tut. Die Hülle ist nicht
 * exportiert und wird nur in derselben Datei aufgerufen, jeder Aufruf mit eigenem `example=`; so prüft
 * `beispieleVon` die Werte dort. Jede andere Weitergabe scheitert: Ein Beispiel, das von außen kommt,
 * gehört zu `photo-upload-voll` oder in diese Liste samt Prüfung seiner Aufrufer.
 */
const WEITERGABE: Record<string, string> = {
  'src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx': 'FotoSchritt',
};

/** Hält fest, dass die Hülle in `datei` nur dort und nur mit eigenem `example=` aufgerufen wird. */
function pruefeWeitergabe(datei: string, text: string): void {
  const huelle = WEITERGABE[datei];
  if (!huelle) {
    throw new Error(`${datei}: example={example} reicht ein Beispiel von außen weiter – photo-upload-voll nutzen oder die Hülle in WEITERGABE samt Aufrufern prüfen`);
  }
  const definition = new RegExp(`^(export\\s+(?:default\\s+)?)?function ${huelle}\\(\\{[^]*?\\bexample: ImageSlot;`, 'm').exec(text);
  if (!definition) throw new Error(`${datei}: Hülle ${huelle} mit example: ImageSlot nicht gefunden`);
  if (definition[1]) throw new Error(`${datei}: Hülle ${huelle} ist exportiert; ihre Aufrufer lägen außerhalb der Prüfung`);
  const aufrufe = [...text.matchAll(new RegExp(`<${huelle}\\b`, 'g'))];
  if (aufrufe.length === 0) throw new Error(`${datei}: Hülle ${huelle} ohne Aufruf`);
  for (const a of aufrufe) {
    const element = text.slice(a.index!, text.indexOf('/>', a.index!));
    if (!/\bexample=\{/.test(element)) throw new Error(`${datei}: Aufruf von ${huelle} ohne eigenes example=`);
    if (/\bexample=\{example\}/.test(element) || /\{\.\.\./.test(element)) {
      throw new Error(`${datei}: Aufruf von ${huelle} reicht sein Beispiel weiter`);
    }
  }
  const fremd = execSync(`grep -rlw "${huelle}" src --include=*.tsx --include=*.ts`, { encoding: 'utf8' })
    .split('\n')
    .filter((d) => d && d !== datei && !/\.test\.tsx?$/.test(d));
  if (fremd.length > 0) throw new Error(`${datei}: Hülle ${huelle} wird auch in ${fremd.join(', ')} genannt`);
}

/** Beispiele, die andere Dateien als Konstanten liefern (zur Laufzeit gelesen). */
const GELIEFERT: Record<string, ImageSlot[]> = {
  BEISPIEL_FAHRZEUGSCHEIN: [BEISPIEL_FAHRZEUGSCHEIN],
  BEISPIEL_ERSATZNACHWEIS: [BEISPIEL_ERSATZNACHWEIS],
  BEISPIEL_TYPENSCHILD: [BEISPIEL_TYPENSCHILD],
  REGISTRATION_EXAMPLE: [REGISTRATION_EXAMPLE],
  'slot.example': KEY_PHOTO_SLOTS.map((s) => s.example),
};

/** Eine Bildstelle als Objektliteral im Quelltext: Motiv und ausdrückliche Zeichnung. */
function slotAusLiteral(literal: string, wo: string): ImageSlot {
  const motif = /motif:\s*'((?:[^'\\]|\\.)*)'/.exec(literal);
  if (!motif) throw new Error(`${wo}: Beispiel ohne festes Motiv (Vorlage oder Variable) – solche Formulare nutzen photo-upload-voll`);
  const generator = /generator:\s*'([^']+)'/.exec(literal);
  return {
    motif: motif[1],
    ratio: '4/3',
    ...(generator ? { visual: { generator: generator[1], params: {} } } : {}),
  };
}

/** Das Objektliteral ab der geschweiften Klammer an `start` (bis zur passenden schließenden). */
function literalAb(text: string, start: number): string {
  let tiefe = 0;
  for (let i = start; i < text.length; i += 1) {
    if (text[i] === '{') tiefe += 1;
    if (text[i] === '}') {
      tiefe -= 1;
      if (tiefe === 0) return text.slice(start, i + 1);
    }
  }
  throw new Error('Objekt ohne Ende');
}

/** Alle Beispiele, die ein Aufrufer an `example=` übergibt. */
function beispieleVon(datei: string): ImageSlot[] {
  const text = lies(datei);
  const slots: ImageSlot[] = [];
  for (const m of text.matchAll(/example=\{/g)) {
    const nach = m.index! + m[0].length;
    if (text[nach] === '{') {
      slots.push(slotAusLiteral(literalAb(text, nach), datei));
      continue;
    }
    const name = /^([\w.]+)\}/.exec(text.slice(nach))?.[1];
    if (!name) throw new Error(`${datei}: unbekannte Form von example=`);
    if (name in GELIEFERT) {
      slots.push(...GELIEFERT[name]);
      continue;
    }
    if (name === 'example') {
      // Weitergabe durch eine Hülle; nur erlaubt, wo deren Aufrufe in derselben Datei stehen (dort mitgeprüft).
      pruefeWeitergabe(datei, text);
      continue;
    }
    const konstante = new RegExp(`const ${name}(?::\\s*ImageSlot)?\\s*=\\s*\\{`).exec(text);
    if (!konstante) throw new Error(`${datei}: Beispiel ${name} nicht gefunden`);
    slots.push(slotAusLiteral(literalAb(text, konstante.index + konstante[0].length - 1), `${datei} ${name}`));
  }
  return slots;
}

describe('Beispiel am Upload-Feld ohne Register (FA-SEO-03D)', () => {
  it('findet die Formulare mit Upload-Feld', () => {
    const liste = aufrufer();
    expect(liste.length).toBeGreaterThanOrEqual(14);
    expect(liste).toContain('src/app/(site)/service-und-termin/kontakt/kontakt-formular.tsx');
    expect(liste).toContain('src/app/(site)/autoschluessel/anfrage/assistent.tsx');
    // Die Codelinie setzt ihr Motiv aus gepflegten Inhalten zusammen und nutzt deshalb die Fassung mit allen Zeichnungen.
    expect(liste).not.toContain('src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx');
  });

  it('zählt relative Importe des Upload-Felds mit und lässt Weitergaben nur in WEITERGABE zu', () => {
    expect(istUploadFeld('src/components/forms/x.tsx', './photo-upload')).toBe(true);
    expect(istUploadFeld('src/components/autoschluessel/x.tsx', '../forms/photo-upload')).toBe(true);
    expect(istUploadFeld('src/app/x.tsx', './photo-upload')).toBe(false);
    expect(istUploadFeld('src/components/forms/x.tsx', './photo-upload-voll')).toBe(false);
    // Eine Hülle in einer anderen Datei scheitert, statt still übersprungen zu werden.
    const huelle = 'export function Feld({ example }: { example: ImageSlot; }) { return <PhotoUpload example={example} />; }';
    expect(() => pruefeWeitergabe('src/components/neu/feld.tsx', huelle)).toThrow(/photo-upload-voll/);
    // In der erlaubten Datei darf die Hülle weder exportiert noch ohne eigenes Beispiel aufgerufen werden.
    const datei = Object.keys(WEITERGABE)[0];
    expect(() => pruefeWeitergabe(datei, 'export function FotoSchritt({\n}: {\n  example: ImageSlot;\n}) {}')).toThrow(/exportiert/);
    expect(() => pruefeWeitergabe(datei, 'function FotoSchritt({\n}: {\n  example: ImageSlot;\n}) {}\n<FotoSchritt id="a" />')).toThrow(
      /ohne eigenes example=/,
    );
  });

  it('jedes Beispiel und jeder Steckplatz braucht nur Generatoren aus UPLOAD_ZEICHNUNGEN', () => {
    const erlaubt = new Set(Object.keys(UPLOAD_ZEICHNUNGEN));
    let zahl = 0;
    for (const datei of aufrufer()) {
      for (const slot of beispieleVon(datei)) {
        const ref = slot.visual ?? visualFuerMotiv(slot.motif);
        if (ref) expect(erlaubt.has(ref.generator), `${datei}: ${slot.motif} → ${ref.generator}`).toBe(true);
        zahl += 1;
      }
    }
    expect(zahl).toBeGreaterThanOrEqual(25);
    for (const steckplatz of STECKPLAETZE) {
      const ref = visualFuerSteckplatz(steckplatz);
      if (ref) expect(erlaubt.has(ref.generator), steckplatz).toBe(true);
    }
  });

  it('nutzt dieselben Generatoren wie das Register, keiner davon mit schmaler Fassung', () => {
    for (const [name, komponente] of Object.entries(UPLOAD_ZEICHNUNGEN)) {
      expect(komponente, name).toBe(getVisual(name));
      expect(schmaleFassung({ generator: name, params: {} }), name).toBeNull();
    }
  });

  it('zeichnet jedes Beispiel mit demselben Markup wie ImagePlaceholder', () => {
    const slots: ImageSlot[] = [];
    for (const datei of aufrufer()) {
      for (const slot of beispieleVon(datei)) {
        for (const ratio of ['4/3', '3/2', '1/1', '16/9'] as const) slots.push({ ...slot, ratio });
      }
    }
    for (const liste of Object.values(GELIEFERT)) slots.push(...liste);
    const ausdruecklich: VisualRef[] = [
      { generator: 'schluessel', params: { typ: 'zylinder' } },
      { generator: 'schluessel', params: { typ: 'zylinder', code: 'rueckseite' } },
      { generator: 'schluessel', params: { typ: 'funk', ansicht: 'vorn' } },
      { generator: 'schluessel', params: { typ: 'funk', ansicht: 'hinten' } },
      { generator: 'schluessel', params: { typ: 'funk', ansicht: 'detail' } },
      { generator: 'profilschnitt', params: { beschriftung: false } },
    ];
    for (const visual of ausdruecklich) slots.push({ motif: 'Beispielfoto: Schlüssel', ratio: '4/3', visual });
    // Ohne passende Zeichnung: Fach-Icon; mit Foto: das Foto.
    slots.push({ motif: 'Beispielfoto', ratio: '4/3' });
    slots.push({ motif: 'Beispielfoto: Schlüssel', ratio: '4/3', bild: { url: '/medien/beispiel.jpg', alt: 'Beispiel' } });

    let verglichen = 0;
    for (const slot of slots) {
      for (const steckplatz of [undefined, ...STECKPLAETZE]) {
        const feld = beispielFuerFeld(slot, steckplatz);
        expect(renderToStaticMarkup(<UploadBeispiel slot={feld} />), `${slot.motif} / ${steckplatz}`).toBe(
          renderToStaticMarkup(<ImagePlaceholder slot={feld} />),
        );
        verglichen += 1;
      }
    }
    expect(verglichen).toBeGreaterThan(500);
  });

  it('Generator außerhalb der Auswahl: Fach-Icon (Abweichung von ImagePlaceholder, nur über photo-upload-voll zulässig)', () => {
    const slot: ImageSlot = { motif: 'Beispielfoto: Zylinder messen', ratio: '4/3' };
    expect(visualFuerMotiv(slot.motif)?.generator).toBe('zylinder-mass');
    const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const html = renderToStaticMarkup(<UploadBeispiel slot={slot} />);
      expect(html).toContain('aria-hidden');
      expect(html).not.toContain('<svg role="img"');
      // Außerhalb der Produktion meldet das Feld die Abweichung.
      expect(warnung).toHaveBeenCalledTimes(1);
      expect(String(warnung.mock.calls[0][0])).toContain('zylinder-mass');
      // Ohne passende Zeichnung (kein Generator) bleibt es still.
      warnung.mockClear();
      renderToStaticMarkup(<UploadBeispiel slot={{ motif: 'Beispielfoto', ratio: '4/3' }} />);
      expect(warnung).not.toHaveBeenCalled();
    } finally {
      warnung.mockRestore();
    }
  });

  it('PhotoUploadAlleZeichnungen ergibt mit ImagePlaceholder dasselbe Feld wie PhotoUpload', () => {
    const props = {
      id: 'foto-test',
      label: 'Foto des Schlüssels',
      description: 'Ein Foto hilft uns beim Abgleich.',
      files: [],
      onChange: () => {},
    };
    for (const example of [
      { motif: 'Beispielfoto: Möbelschlüssel flach liegend, Beschriftung und Profil lesbar', ratio: '4/3' as const },
      { motif: 'Beispielfoto: Vorhängeschlossschlüssel flach liegend, Beschriftung und Profil lesbar', ratio: '4/3' as const },
    ]) {
      expect(renderToStaticMarkup(<PhotoUploadAlleZeichnungen {...props} example={example} />)).toBe(
        renderToStaticMarkup(<PhotoUpload {...props} example={example} />),
      );
    }
    // Mit einer Zeichnung außerhalb der Auswahl zeichnet nur die volle Fassung sie.
    const zylinder = { motif: 'Beispielfoto: Zylinderschlüssel flach liegend, Beschriftung und Profil lesbar', ratio: '4/3' as const };
    expect(visualFuerMotiv(zylinder.motif)?.generator).toBe('zylinder-mass');
    expect(renderToStaticMarkup(<PhotoUploadAlleZeichnungen {...props} example={zylinder} />)).toContain(
      renderToStaticMarkup(<ImagePlaceholder slot={zylinder} />),
    );
  });

  it('das Upload-Feld zieht das Register nicht wieder herein', () => {
    for (const datei of ['src/components/forms/photo-upload.tsx', 'src/components/forms/upload-beispiel.tsx']) {
      const importe = ziele(lies(datei));
      expect(importe, datei).not.toContain('@/components/ui/image-placeholder');
      expect(importe, datei).not.toContain('@/components/visual/registry');
      expect(importe.some((z) => /visual\/registry$/.test(z)), datei).toBe(false);
    }
    // Vom Register nur der Typ.
    expect(lies('src/components/forms/upload-beispiel.tsx')).toMatch(/import type \{ VisualComponent \} from '@\/components\/visual\/registry'/);
  });
});
