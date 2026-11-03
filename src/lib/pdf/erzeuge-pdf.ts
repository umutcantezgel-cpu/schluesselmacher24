import PDFDocument from 'pdfkit';

import type { Blatt, BlattAbschnitt, BlattBild, BlattTabelle, BlattZeile } from './blatt';
import { SCHRIFTEN, laeufe, schriftDaten, type Schnitt } from './schriften';

/*
 * Renderer für Blätter als PDF (A-004): die einzige Stelle, die pdfkit kennt. Ein Wechsel der
 * Bibliothek betrifft nur diese Datei. A4 hoch, IBM Plex Sans, Farben aus den Tokens
 * (`PDF_FARBEN`, geprüft gegen globals.css), Fußzeile mit Seitenzahl auf jeder Seite.
 */

/** Hex-Werte der Tokens --foreground, --foreground-muted, --border, --primary, --surface-muted. */
export const PDF_FARBEN = {
  text: '#192133',
  leise: '#4f5a6d',
  linie: '#dae2ec',
  primaer: '#145bb8',
  flaeche: '#f2f6fb',
} as const;

const SEITE = { breite: 595.28, hoehe: 841.89, rand: 48, oben: 54, unten: 62 };
const INHALT = SEITE.breite - 2 * SEITE.rand;
const ZEILENABSTAND = 1.6;

type Dokument = InstanceType<typeof PDFDocument>;
interface Fontkit {
  hasGlyphForCodePoint(cp: number): boolean;
  glyphForCodePoint(cp: number): { advanceWidth: number; bbox: unknown };
}

/**
 * fontkit kann in den Teilschriften manche leeren Glyphen nicht lesen (etwa das Leerzeichen in
 * Plex Mono und latin-ext: „Offset is outside the bounds“). Solche Zeichen gelten als nicht
 * vorhanden und laufen in der nächsten Schrift der Liste.
 */
function lesbar(font: Fontkit, cp: number): boolean {
  try {
    const glyphe = font.glyphForCodePoint(cp);
    return Number.isFinite(glyphe.advanceWidth) && glyphe.bbox !== undefined;
  } catch {
    return false;
  }
}

export interface PdfOptionen {
  /** Ströme komprimieren (Standard ja; Tests lesen den Text unkomprimiert). */
  komprimieren?: boolean;
}

export async function erzeugePdf(blatt: Blatt, { komprimieren = true }: PdfOptionen = {}): Promise<Buffer> {
  const doc: Dokument = new PDFDocument({
    size: 'A4',
    margins: { top: SEITE.oben, bottom: SEITE.unten, left: SEITE.rand, right: SEITE.rand },
    bufferPages: true,
    compress: komprimieren,
    lang: 'de-DE',
    displayTitle: true,
    info: {
      Title: blatt.titel,
      Author: 'SCHLÜSSELMACHER24',
      Subject: 'Vorgangsblatt',
      Creator: 'SCHLÜSSELMACHER24',
      Producer: 'SCHLÜSSELMACHER24',
      CreationDate: blatt.stand,
      ModDate: blatt.stand,
    },
  });
  const teile: Buffer[] = [];
  const fertig = new Promise<Buffer>((ok, fehler) => {
    doc.on('data', (stueck: Buffer) => teile.push(stueck));
    doc.on('end', () => ok(Buffer.concat(teile)));
    doc.on('error', fehler);
  });

  const abdeckung = new Map<string, Fontkit>();
  for (const datei of Object.values(SCHRIFTEN).flat()) {
    if (abdeckung.has(datei.name)) continue;
    doc.registerFont(datei.name, await schriftDaten(datei.datei));
    doc.font(datei.name);
    abdeckung.set(datei.name, (doc as unknown as { _font: { font: Fontkit } })._font.font);
  }
  const merk = new Map<string, boolean>();
  const hat = (schrift: string, cp: number) => {
    const schluessel = `${schrift}:${cp}`;
    let ja = merk.get(schluessel);
    if (ja === undefined) {
      const font = abdeckung.get(schrift);
      ja = font ? font.hasGlyphForCodePoint(cp) && lesbar(font, cp) : false;
      merk.set(schluessel, ja);
    }
    return ja;
  };

  const r = new Zeichner(doc, hat);
  r.kopf(blatt);
  r.zeilen(blatt.kopf);
  for (const abschnitt of blatt.abschnitte) r.abschnitt(abschnitt);
  r.fuss(blatt.fuss);
  doc.end();
  return fertig;
}

interface Stil {
  schnitt?: Schnitt;
  groesse?: number;
  farbe?: string;
  breite?: number;
  ausrichtung?: 'left' | 'right';
}

class Zeichner {
  constructor(
    private readonly doc: Dokument,
    private readonly hat: (schrift: string, cp: number) => boolean,
  ) {}

  private unten(): number {
    return SEITE.hoehe - SEITE.unten;
  }

  /** Neue Seite, wenn `hoehe` nicht mehr passt. */
  private platz(hoehe: number): void {
    if (this.doc.y + hoehe > this.unten()) {
      this.doc.addPage();
      this.doc.y = SEITE.oben;
    }
  }

  private teile(schnitt: Schnitt): string[] {
    return SCHRIFTEN[schnitt].map((s) => s.name);
  }

  hoehe(text: string, { schnitt = 'normal', groesse = 10, breite = INHALT }: Stil = {}): number {
    // Gemessen wird mit der ersten Schrift; Zeichen aus anderen Teilen zählen als „n“ (ähnliche Breite),
    // denn die erste Schrift kann sie nicht lesen (etwa das geschützte Leerzeichen in Plex Mono).
    const erste = this.teile(schnitt)[0];
    const ersatz = laeufe(text, this.teile(schnitt), this.hat)
      .map((l) => (l.schrift === erste ? l.text : l.text.replace(/[^\n]/g, 'n')))
      .join('');
    this.doc.font(erste).fontSize(groesse);
    return this.doc.heightOfString(ersatz || ' ', { width: breite, lineGap: ZEILENABSTAND });
  }

  schreibe(text: string, x: number, y: number, { schnitt = 'normal', groesse = 10, farbe = PDF_FARBEN.text, breite = INHALT, ausrichtung = 'left' }: Stil = {}): void {
    const liste = laeufe(text || ' ', this.teile(schnitt), this.hat);
    this.doc.fontSize(groesse).fillColor(farbe);
    liste.forEach((lauf, i) => {
      this.doc.font(lauf.schrift);
      const optionen = { width: breite, align: ausrichtung, lineGap: ZEILENABSTAND, continued: i < liste.length - 1 };
      if (i === 0) this.doc.text(lauf.text, x, y, optionen);
      else this.doc.text(lauf.text, optionen);
    });
  }

  private linie(y: number, farbe: string = PDF_FARBEN.linie, staerke = 0.75): void {
    this.doc.moveTo(SEITE.rand, y).lineTo(SEITE.rand + INHALT, y).lineWidth(staerke).strokeColor(farbe).stroke();
  }

  kopf(blatt: Blatt): void {
    const y = SEITE.oben;
    this.doc.font(this.teile('fett')[0]).fontSize(12).fillColor(PDF_FARBEN.text);
    this.doc.text('SCHLÜSSELMACHER', SEITE.rand, y, { continued: true, lineBreak: false });
    this.doc.fillColor(PDF_FARBEN.primaer).text('24', { continued: false, lineBreak: false });
    const stand = `Stand ${blatt.stand.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'medium', timeStyle: 'short' })} Uhr`;
    this.schreibe(stand, SEITE.rand, y + 2, { groesse: 8.5, farbe: PDF_FARBEN.leise, ausrichtung: 'right' });
    this.linie(y + 22, PDF_FARBEN.primaer, 1.5);
    this.schreibe(blatt.titel.replace(blatt.nummer, '').trim() || 'Vorgangsblatt', SEITE.rand, y + 34, { schnitt: 'fett', groesse: 9, farbe: PDF_FARBEN.leise });
    this.schreibe(blatt.nummer, SEITE.rand, y + 47, { schnitt: 'mono', groesse: 17 });
    this.doc.y = y + 78;
  }

  zeilen(zeilen: BlattZeile[], { breiteName = 0.32 }: { breiteName?: number } = {}): void {
    const nameBreite = INHALT * breiteName;
    const wertBreite = INHALT - nameBreite - 8;
    for (const zeile of zeilen.filter((z) => z.wert !== '')) {
      const schnitt: Schnitt = zeile.mono ? 'mono' : zeile.betont ? 'fett' : 'normal';
      const h = Math.max(this.hoehe(zeile.name, { groesse: 8.5, breite: nameBreite }), this.hoehe(zeile.wert, { schnitt, breite: wertBreite }));
      this.platz(h + 6);
      const y = this.doc.y;
      this.schreibe(zeile.name, SEITE.rand, y + 1, { groesse: 8.5, farbe: PDF_FARBEN.leise, breite: nameBreite });
      this.schreibe(zeile.wert, SEITE.rand + nameBreite + 8, y, { schnitt, breite: wertBreite });
      this.doc.y = y + h + 3;
      this.linie(this.doc.y);
      this.doc.y += 3;
    }
  }

  /** Höhe des ersten Inhalts eines Abschnitts, damit die Überschrift nie allein am Seitenende steht. */
  private ersteHoehe(abschnitt: BlattAbschnitt): number {
    if (abschnitt.tabelle) {
      const t = abschnitt.tabelle;
      const erste = t.zeilen[0] ?? [];
      return 18 + Math.max(16, ...erste.map((text, i) => this.hoehe(text, { breite: t.breiten[i] * INHALT - 6 }))) + 6;
    }
    const zeile = abschnitt.zeilen?.find((z) => z.wert !== '');
    if (zeile) return this.hoehe(zeile.wert, { breite: INHALT * 0.68 - 8 }) + 6;
    if (abschnitt.text) return this.hoehe(abschnitt.text) + 4;
    if (abschnitt.adressfeld) return 24 + abschnitt.adressfeld.length * 19 + 14;
    return INHALT * 0.25 + 28;
  }

  private titel(titel: string, folgt = 0): void {
    this.platz(30 + folgt);
    this.doc.y += 10;
    this.schreibe(titel, SEITE.rand, this.doc.y, { schnitt: 'fett', groesse: 11.5 });
    this.doc.y += 4;
    this.linie(this.doc.y, PDF_FARBEN.text, 0.75);
    this.doc.y += 6;
  }

  abschnitt(abschnitt: BlattAbschnitt): void {
    this.titel(abschnitt.titel, this.ersteHoehe(abschnitt));
    if (abschnitt.zeilen?.length) this.zeilen(abschnitt.zeilen);
    if (abschnitt.tabelle) this.tabelle(abschnitt.tabelle);
    if (abschnitt.text) {
      const h = this.hoehe(abschnitt.text);
      this.platz(h + 4);
      this.schreibe(abschnitt.text, SEITE.rand, this.doc.y, { farbe: PDF_FARBEN.leise });
      this.doc.y += h + 4;
    }
    if (abschnitt.bilder?.length) this.bilder(abschnitt.bilder);
    if (abschnitt.adressfeld?.length) this.adressfeld(abschnitt.adressfeld);
  }

  private adressfeld(zeilen: string[]): void {
    const breite = 260;
    const hoehe = 24 + zeilen.length * 19;
    this.platz(hoehe + 10);
    const y = this.doc.y + 4;
    this.doc.save();
    this.doc.rect(SEITE.rand, y, breite, hoehe).dash(4, { space: 3 }).lineWidth(1).strokeColor(PDF_FARBEN.leise).stroke();
    this.doc.restore();
    zeilen.forEach((zeile, i) => {
      this.schreibe(zeile, SEITE.rand + 14, y + 12 + i * 19, { schnitt: i === 0 ? 'fett' : 'normal', groesse: 13, breite: breite - 28 });
    });
    this.doc.y = y + hoehe + 8;
  }

  private tabelle(t: BlattTabelle): void {
    const breiten = t.breiten.map((anteil) => anteil * INHALT);
    const xs = breiten.map((_, i) => SEITE.rand + breiten.slice(0, i).reduce((a, b) => a + b, 0));
    const zelle = (text: string, i: number, y: number, stil: Stil) =>
      this.schreibe(text, xs[i], y, { ...stil, breite: breiten[i] - 6, ausrichtung: t.rechts?.includes(i) ? 'right' : 'left' });
    const ersteZeile = Math.max(16, ...(t.zeilen[0] ?? []).map((text, i) => this.hoehe(text, { breite: breiten[i] - 6 })));
    const kopf = () => {
      this.platz(18 + ersteZeile + 6);
      const y = this.doc.y;
      t.kopf.forEach((text, i) => zelle(text, i, y, { schnitt: 'fett', groesse: 8.5, farbe: PDF_FARBEN.leise }));
      this.doc.y = y + 14;
      this.linie(this.doc.y);
      this.doc.y += 3;
    };
    kopf();
    for (const zeile of t.zeilen) {
      const h = Math.max(...zeile.map((text, i) => this.hoehe(text, { breite: breiten[i] - 6 })));
      if (this.doc.y + h + 6 > this.unten()) {
        this.doc.addPage();
        this.doc.y = SEITE.oben;
        kopf();
      }
      const y = this.doc.y;
      zeile.forEach((text, i) => zelle(text, i, y, {}));
      this.doc.y = y + h + 3;
      this.linie(this.doc.y);
      this.doc.y += 3;
    }
    if (t.summen?.length) {
      for (const summe of t.summen) {
        this.platz(18);
        const y = this.doc.y;
        this.schreibe(summe.name, SEITE.rand, y, { schnitt: summe.betont ? 'fett' : 'normal', breite: INHALT - 110 });
        this.schreibe(summe.wert, SEITE.rand + INHALT - 110, y, { schnitt: summe.betont ? 'fett' : 'normal', breite: 110 - 6, ausrichtung: 'right' });
        this.doc.y = y + 16;
      }
    }
  }

  private bilder(bilder: BlattBild[]): void {
    const spalten = 3;
    const abstand = 12;
    const w = (INHALT - abstand * (spalten - 1)) / spalten;
    const h = w * 0.75;
    for (let i = 0; i < bilder.length; i += spalten) {
      this.platz(h + 28);
      const y = this.doc.y + 4;
      bilder.slice(i, i + spalten).forEach((bild, j) => {
        const x = SEITE.rand + j * (w + abstand);
        this.doc.rect(x, y, w, h).fillColor(PDF_FARBEN.flaeche).fill();
        try {
          this.doc.image(Buffer.from(bild.daten), x, y, { fit: [w, h], align: 'center', valign: 'center' });
        } catch {
          this.schreibe('Vorschau nicht lesbar', x + 8, y + h / 2 - 6, { groesse: 8.5, farbe: PDF_FARBEN.leise, breite: w - 16 });
        }
        this.schreibe(bild.name, x, y + h + 4, { groesse: 8, farbe: PDF_FARBEN.leise, breite: w });
      });
      this.doc.y = y + h + 22;
    }
  }

  /** Fußzeile mit Seitenzahl auf jeder Seite (nach dem Inhalt, über die gepufferten Seiten). */
  fuss(text: string): void {
    const bereich = this.doc.bufferedPageRange();
    for (let i = bereich.start; i < bereich.start + bereich.count; i += 1) {
      this.doc.switchToPage(i);
      const rand = this.doc.page.margins.bottom;
      this.doc.page.margins.bottom = 0;
      const y = SEITE.hoehe - SEITE.unten + 22;
      this.linie(y - 6);
      this.schreibe(text, SEITE.rand, y, { groesse: 7.5, farbe: PDF_FARBEN.leise, breite: INHALT - 80 });
      this.schreibe(`Seite ${i + 1} von ${bereich.count}`, SEITE.rand + INHALT - 80, y, { groesse: 7.5, farbe: PDF_FARBEN.leise, breite: 80, ausrichtung: 'right' });
      this.doc.page.margins.bottom = rand;
    }
  }
}
