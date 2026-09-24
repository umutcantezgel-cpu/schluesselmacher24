import { describe, expect, it } from 'vitest';

import {
  MAX_BILD_BYTES,
  MAX_PDF_BYTES,
  erkenneDateityp,
  pruefeDatei,
  saeubereDateiname,
} from './datei-pruefung';

function bytes(...teile: Array<number[] | string>): Uint8Array {
  const liste: number[] = [];
  for (const teil of teile) {
    if (typeof teil === 'string') liste.push(...Array.from(teil, (z) => z.charCodeAt(0)));
    else liste.push(...teil);
  }
  return Uint8Array.from(liste);
}

function mitLaenge(kopf: Uint8Array, laenge: number): Uint8Array {
  const ergebnis = new Uint8Array(laenge);
  ergebnis.set(kopf);
  return ergebnis;
}

const JPEG = bytes([0xff, 0xd8, 0xff, 0xe0, 0, 0x10], 'JFIF');
const PNG = bytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13], 'IHDR');
const WEBP = bytes('RIFF', [0x24, 0, 0, 0], 'WEBPVP8 ');
const heif = (marke: string) => bytes([0, 0, 0, 0x18], 'ftyp', marke, [0, 0, 0, 0], 'mif1');
const PDF = bytes('%PDF-1.7\n%âãÏÓ\n');

describe('erkenneDateityp', () => {
  it('erkennt die erlaubten Formate an den ersten Bytes', () => {
    expect(erkenneDateityp(JPEG)?.mimeType).toBe('image/jpeg');
    expect(erkenneDateityp(PNG)?.mimeType).toBe('image/png');
    expect(erkenneDateityp(WEBP)?.mimeType).toBe('image/webp');
    expect(erkenneDateityp(PDF)?.mimeType).toBe('application/pdf');
    for (const marke of ['heic', 'heix', 'hevc']) {
      expect(erkenneDateityp(heif(marke))).toMatchObject({ mimeType: 'image/heic', endung: 'heic' });
    }
    expect(erkenneDateityp(heif('mif1'))).toMatchObject({ mimeType: 'image/heif', endung: 'heif' });
  });

  it('lehnt alles andere ab — auch ähnlich aussehende Container', () => {
    expect(erkenneDateityp(bytes('<html><script>'))).toBeNull();
    expect(erkenneDateityp(bytes('GIF89a'))).toBeNull();
    expect(erkenneDateityp(bytes('RIFF', [0, 0, 0, 0], 'WAVEfmt '))).toBeNull();
    // MP4-Video im selben Containerformat wie HEIC
    expect(erkenneDateityp(heif('isom'))).toBeNull();
    expect(erkenneDateityp(bytes('PK', [3, 4]))).toBeNull();
    expect(erkenneDateityp(bytes([0xff, 0xd8]))).toBeNull();
    expect(erkenneDateityp(new Uint8Array())).toBeNull();
    // PDF-Kennung nicht am Anfang
    expect(erkenneDateityp(bytes(' %PDF-1.4'))).toBeNull();
  });
});

describe('pruefeDatei', () => {
  it('akzeptiert Fotos in jeder Kategorie und PDF nur bei Unterlagen', () => {
    expect(pruefeDatei(JPEG, 'schluesselfoto').ok).toBe(true);
    expect(pruefeDatei(heif('heic'), 'objektfoto').ok).toBe(true);
    expect(pruefeDatei(PDF, 'fahrzeugschein').ok).toBe(true);
    expect(pruefeDatei(PDF, 'grundriss').ok).toBe(true);
    expect(pruefeDatei(PDF, 'dokument').ok).toBe(true);
    expect(pruefeDatei(PDF, 'schluesselfoto')).toMatchObject({ ok: false, status: 415 });
    expect(pruefeDatei(PDF, 'objektfoto')).toMatchObject({ ok: false, status: 415 });
  });

  it('lehnt leere und unbekannte Dateien ab', () => {
    expect(pruefeDatei(new Uint8Array(), 'dokument')).toMatchObject({ ok: false, status: 400 });
    expect(pruefeDatei(bytes('MZ'), 'dokument')).toMatchObject({ ok: false, status: 415 });
  });

  it('begrenzt Bilder auf 12 MB und PDF auf 15 MB', () => {
    expect(pruefeDatei(mitLaenge(JPEG, MAX_BILD_BYTES), 'schluesselfoto').ok).toBe(true);
    expect(pruefeDatei(mitLaenge(JPEG, MAX_BILD_BYTES + 1), 'schluesselfoto')).toMatchObject({
      ok: false,
      status: 413,
    });
    expect(pruefeDatei(mitLaenge(PDF, MAX_BILD_BYTES + 1), 'dokument').ok).toBe(true);
    expect(pruefeDatei(mitLaenge(PDF, MAX_PDF_BYTES + 1), 'dokument')).toMatchObject({
      ok: false,
      status: 413,
    });
  });
});

describe('saeubereDateiname', () => {
  it('setzt immer die Endung des erkannten Typs', () => {
    expect(saeubereDateiname('IMG_1234.HEIC', 'jpg')).toBe('img_1234.jpg');
    expect(saeubereDateiname('rechnung.pdf.exe', 'pdf')).toBe('rechnung-pdf.pdf');
    expect(saeubereDateiname('foto', 'png')).toBe('foto.png');
  });

  it('entfernt Pfade, Steuer- und Sonderzeichen', () => {
    expect(saeubereDateiname('C:\\Users\\max\\Fahrzeugschein Müller.pdf', 'pdf')).toBe(
      'fahrzeugschein-mueller.pdf',
    );
    expect(saeubereDateiname('../../etc/passwd', 'jpg')).toBe('passwd.jpg');
    expect(saeubereDateiname('..\u0000<script>.jpg', 'jpg')).toBe('script.jpg');
    expect(saeubereDateiname('.htaccess', 'png')).toBe('datei.png');
    expect(saeubereDateiname('Straße & Garage (2).jpeg', 'jpg')).toBe('strasse-garage-2.jpg');
    expect(saeubereDateiname('', 'webp')).toBe('datei.webp');
  });

  it('kürzt lange Namen', () => {
    const name = saeubereDateiname(`${'a'.repeat(300)}.jpg`, 'jpg');
    expect(name).toBe(`${'a'.repeat(80)}.jpg`);
  });
});
