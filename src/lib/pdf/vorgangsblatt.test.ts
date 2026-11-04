import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { vorgangsblattHtml } from '../druckansichten';
import { formatCents, formatDateTime } from '../format';
import { echteEinstellungen } from '../rechtliches/test-hilfen';
import type { BusinessRecord } from '../types';
import { STATUS_REIHENFOLGE } from '../vorgang-status';
import { oklchZuHex } from '../visual/area-theme';

import type { BlattAbschnitt, BlattBild } from './blatt';
import { PDF_FARBEN, erzeugePdf } from './erzeuge-pdf';
import { SCHRIFT_DATEIEN, laeufe } from './schriften';
import { NAECHSTER_SCHRITT, VORSCHAU_ARTEN, vorgangsblattDateiname, vorgangsblattInhalt } from './vorgangsblatt';

const JETZT = new Date('2026-11-03T09:00:00.000Z');

/* Erfundene Testdaten (G4). */
function vorgang(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return {
    id: '7',
    reference: 'SM24-T-2026-0007',
    kind: 'termin',
    area: 'autoschluessel',
    process: 'termin-mit-anzahlung',
    status: 'neu',
    createdAt: '2026-11-02T08:15:00.000Z',
    updatedAt: '2026-11-02T08:15:00.000Z',
    contact: {
      firstName: 'Erika',
      lastName: 'Łódź-Škoda',
      email: 'erika@example.org',
      phone: '0301234567',
      street: 'Musterweg 1',
      postalCode: '35576',
      city: 'Wetzlar',
      country: 'Deutschland',
    },
    payload: {},
    summary: [{ title: 'Fahrzeug', rows: [{ label: 'Modell', value: 'Testwagen 2019' }, { label: 'Hinweis', value: 'Zweitschlüssel fehlt 日' }] }],
    uploads: [
      { id: 'u1', fileName: 'schluessel.jpg', sizeBytes: 1, mimeType: 'image/jpeg', category: 'schluesselfoto', storageKey: '9', uploadedAt: '2026-11-02T08:15:00.000Z' },
      { id: 'u2', fileName: 'fahrzeugschein.jpg', sizeBytes: 1, mimeType: 'image/jpeg', category: 'fahrzeugschein', storageKey: '10', uploadedAt: '2026-11-02T08:15:00.000Z' },
    ],
    internalNotes: [],
    timeline: [{ at: '2026-11-02T08:15:00.000Z', actor: 'system', message: 'Anfrage eingegangen.' }],
    payment: { scope: 'anzahlung', amountCents: 4900, status: 'bezahlt', providerRef: 'pi_TEST123', paidAt: '2026-11-02T08:20:00.000Z' },
    ...teil,
  };
}

/** Rohtext des unkomprimierten PDFs (Tests erzeugen ohne Kompression). */
function pdfText(pdf: Buffer): string {
  return pdf.toString('latin1');
}

/** Wert eines Eintrags im Info-Verzeichnis (Literal oder UTF-16BE-Hex, auch über Verweis). */
function infoWert(pdf: Buffer, schluessel: string): string | null {
  const text = pdfText(pdf);
  const direkt = new RegExp(`/${schluessel} (\\(|<|(\\d+) 0 R)`).exec(text);
  if (!direkt) return null;
  let rest = text.slice(direkt.index + schluessel.length + 2);
  if (direkt[2]) {
    const start = text.indexOf(`\n${direkt[2]} 0 obj\n`);
    rest = text.slice(text.indexOf('\n', start + 1) + 1);
  }
  rest = rest.trimStart();
  if (rest.startsWith('(')) {
    const literal = rest.slice(1, rest.indexOf(')'));
    return literal.startsWith('\u00fe\u00ff') ? Buffer.from(literal.slice(2), 'latin1').swap16().toString('utf16le') : literal;
  }
  const hex = rest.slice(1, rest.indexOf('>')).replace(/^FEFF/i, '');
  return Buffer.from(hex, 'hex').swap16().toString('utf16le');
}

describe('vorgangsblattInhalt', () => {
  const blatt = vorgangsblattInhalt({ vorgang: vorgang(), firma: echteEinstellungen().company, jetzt: JETZT });

  it('nennt Nummer, Status mit nächstem Schritt, Kunde, Zahlung mit Beleg und Verlauf', () => {
    expect(blatt.nummer).toBe('SM24-T-2026-0007');
    expect(blatt.kopf.map((z) => z.name)).toEqual(['Status', 'Nächster Schritt', 'Art', 'Bereich', 'Eingegangen']);
    expect(blatt.kopf[1].wert).toBe(NAECHSTER_SCHRITT.neu);
    const titel = blatt.abschnitte.map((a) => a.titel);
    expect(titel).toEqual(['Kunde', 'Angaben des Kunden: Fahrzeug', 'Zahlung', 'Unterlagen', 'Verlauf', 'Interne Notizen']);
    const zahlung = blatt.abschnitte.find((a) => a.titel === 'Zahlung');
    expect(zahlung?.zeilen?.find((z) => z.name === 'Zahlungsbeleg')?.wert).toBe('Stripe pi_TEST123');
  });

  it('hat für jeden Status einen nächsten Schritt', () => {
    for (const status of STATUS_REIHENFOLGE) expect(NAECHSTER_SCHRITT[status].length, status).toBeGreaterThan(5);
  });

  it('zeigt Fahrzeugscheine und Dokumente nie als Bild (Datenminimierung, A-015)', () => {
    expect(VORSCHAU_ARTEN).not.toContain('fahrzeugschein');
    expect(VORSCHAU_ARTEN).not.toContain('dokument');
    const mitBild = vorgangsblattInhalt({ vorgang: vorgang(), jetzt: JETZT, bilder: [{ name: 'schluessel.jpg', daten: new Uint8Array([1]) }] });
    const unterlagen = mitBild.abschnitte.find((a) => a.titel === 'Unterlagen');
    expect(unterlagen?.tabelle?.zeilen).toEqual([
      ['Schlüsselfoto', 'schluessel.jpg', 'im Backend, Vorschau unten'],
      ['Fahrzeugschein', 'fahrzeugschein.jpg', 'im Backend'],
    ]);
    expect(unterlagen?.bilder?.map((b) => b.name)).toEqual(['schluessel.jpg']);
  });

  it('enthält jede Angabe des Druckblatts', () => {
    const html = vorgangsblattHtml({ vorgang: vorgang(), firma: echteEinstellungen().company, nonce: 'n', jetzt: JETZT });
    const werte = blatt.abschnitte.flatMap((a) => [...(a.zeilen ?? []).map((z) => z.wert), ...(a.tabelle?.zeilen.flat() ?? [])]);
    for (const wert of ['erika@example.org', '0301234567', 'Testwagen 2019', 'schluessel.jpg', formatCents(4900)]) {
      expect(html).toContain(wert);
      expect(werte.some((w) => w.includes(wert)), wert).toBe(true);
    }
  });

  it('baut einen sicheren Dateinamen', () => {
    expect(vorgangsblattDateiname('SM24-T-2026-0007')).toBe('Vorgangsblatt-SM24-T-2026-0007.pdf');
    expect(vorgangsblattDateiname('../x y')).toBe('Vorgangsblatt-xy.pdf');
  });
});

describe('vorgangsblattInhalt: Preis, Bestätigungen, Lieferung und ehrliche Vorschau', () => {
  const wert = (abschnitt: BlattAbschnitt | undefined, name: string) => abschnitt?.zeilen?.find((z) => z.name === name)?.wert;
  const titelListe = (abschnitte: BlattAbschnitt[]) => abschnitte.map((a) => a.titel);

  it('zeigt den Festpreis vom Server direkt vor der Zahlung', () => {
    const blatt = vorgangsblattInhalt({
      vorgang: vorgang({
        quote: { mode: 'fest', priceCents: 12900, depositCents: 4900, remainderCents: 8000, slotMinutes: 90, leadTimeDays: 1, requiresVehicleOnSite: true, note: 'Fahrzeug bitte sauber' },
      }),
      jetzt: JETZT,
    });
    const titel = titelListe(blatt.abschnitte);
    expect(titel.indexOf('Preis (vom Server ermittelt)')).toBe(titel.indexOf('Zahlung') - 1);
    const preis = blatt.abschnitte.find((a) => a.titel === 'Preis (vom Server ermittelt)');
    expect(wert(preis, 'Preisart')).toBe('Festpreis');
    expect(wert(preis, 'Preis')).toBe(formatCents(12900));
    expect(wert(preis, 'Anzahlung')).toBe(formatCents(4900));
    expect(wert(preis, 'Rest nach Anzahlung')).toBe(formatCents(8000));
    expect(wert(preis, 'Dauer')).toBe('1 Std. 30 Min.');
    expect(wert(preis, 'Vorlauf')).toBe('1 Tag');
    expect(wert(preis, 'Fahrzeug vor Ort nötig')).toBe('ja');
    expect(wert(preis, 'Hinweis')).toBe('Fahrzeug bitte sauber');
  });

  it('zeigt den Preisrahmen mit Spanne und ohne Festpreis-Zeilen', () => {
    const blatt = vorgangsblattInhalt({
      vorgang: vorgang({
        quote: { mode: 'rahmen', priceFromCents: 8900, priceToCents: 14900, depositCents: 0, slotMinutes: 60, leadTimeDays: 3, requiresVehicleOnSite: false },
      }),
      jetzt: JETZT,
    });
    const preis = blatt.abschnitte.find((a) => a.titel === 'Preis (vom Server ermittelt)');
    expect(wert(preis, 'Preisart')).toBe('Preisrahmen');
    expect(wert(preis, 'Preis')).toBe(`${formatCents(8900)} bis ${formatCents(14900)}`);
    expect(wert(preis, 'Rest nach Anzahlung')).toBe('');
    expect(wert(preis, 'Vorlauf')).toBe('3 Tage');
    expect(wert(preis, 'Fahrzeug vor Ort nötig')).toBe('nein');
  });

  it('zeigt bei einer Prüfung ohne Betrag keinen Preis', () => {
    const blatt = vorgangsblattInhalt({
      vorgang: vorgang({ quote: { mode: 'pruefung', depositCents: 0, slotMinutes: 30, leadTimeDays: 0, requiresVehicleOnSite: false } }),
      jetzt: JETZT,
    });
    const preis = blatt.abschnitte.find((a) => a.titel === 'Preis (vom Server ermittelt)');
    expect(wert(preis, 'Preisart')).toBe('Preis nach Prüfung');
    expect(wert(preis, 'Preis')).toBe('');
    expect(wert(preis, 'Vorlauf')).toBe('0 Tage');
  });

  it('zeigt Bestätigungen, Zeitpunkt, Fassung, Lieferhinweis und Sendung in der Reihenfolge des Blatts', () => {
    const blatt = vorgangsblattInhalt({
      vorgang: vorgang({
        kind: 'bestellung',
        consents: { terms: true, withdrawalNotice: true, customMade: true, at: '2026-11-02T08:14:00.000Z', version: '2026-10-01' },
        payload: { deliveryNote: 'Bitte an der Nebentür klingeln', berechtigt: true, datenschutz: false },
        shipment: { carrier: 'dhl', trackingNumber: 'TEST0000001' },
      }),
      jetzt: JETZT,
    });
    const bestaetigungen = blatt.abschnitte.find((a) => a.titel === 'Bestätigungen des Kunden');
    expect(bestaetigungen?.zeilen?.map((z) => [z.name, z.wert])).toEqual([
      ['AGB', 'ja'],
      ['Widerrufsbelehrung', 'ja'],
      ['Sonderanfertigung (kein Widerruf)', 'ja'],
      ['Zeitpunkt', `${formatDateTime('2026-11-02T08:14:00.000Z')} Uhr`],
      ['Fassung der Rechtstexte', '2026-10-01'],
      ['Berechtigung (vor Ort nachzuweisen)', 'ja'],
    ]);
    const lieferung = blatt.abschnitte.find((a) => a.titel === 'Lieferung und Versand');
    expect(lieferung?.zeilen).toEqual([
      { name: 'Lieferhinweis', wert: 'Bitte an der Nebentür klingeln' },
      { name: 'Versanddienst', wert: 'DHL' },
      { name: 'Sendungsnummer', wert: 'TEST0000001', mono: true },
    ]);
    const titel = titelListe(blatt.abschnitte);
    expect(titel.indexOf('Bestätigungen des Kunden')).toBeLessThan(titel.indexOf('Lieferung und Versand'));
    expect(titel.indexOf('Lieferung und Versand')).toBeLessThan(titel.indexOf('Unterlagen'));
  });

  it('zeigt die Datenschutz-Bestätigung der Partner-Bewerbung und lässt leere Lieferhinweise weg', () => {
    const blatt = vorgangsblattInhalt({ vorgang: vorgang({ kind: 'partner', payload: { datenschutz: true, deliveryNote: '' } }), jetzt: JETZT });
    const bestaetigungen = blatt.abschnitte.find((a) => a.titel === 'Bestätigungen des Kunden');
    expect(bestaetigungen?.zeilen).toEqual([{ name: 'Datenschutzhinweis bestätigt', wert: 'ja' }]);
    expect(titelListe(blatt.abschnitte)).not.toContain('Lieferung und Versand');
  });

  it('nennt bei mehr Fotos als Bilder die Zahl und markiert nur wirklich gezeichnete Bilder', () => {
    const fotos = Array.from({ length: 8 }, (_, i) => ({
      id: `f${i + 1}`,
      fileName: `foto-${i + 1}.jpg`,
      sizeBytes: 1,
      mimeType: 'image/jpeg',
      category: 'schluesselfoto' as const,
      storageKey: String(20 + i),
      uploadedAt: '2026-11-02T08:15:00.000Z',
    }));
    const bilder: BlattBild[] = fotos.slice(0, 6).map((f) => ({ name: f.fileName, daten: new Uint8Array([1]) }));
    const blatt = vorgangsblattInhalt({ vorgang: vorgang({ kind: 'anfrage', area: 'schluessel-nach-vorlage', uploads: fotos }), bilder, jetzt: JETZT });
    const unterlagen = blatt.abschnitte.find((a) => a.titel === 'Unterlagen');
    expect(unterlagen?.text).toBe('Vorschau der ersten 6 von 8 Fotos. Alle Fotos stehen im Backend.');
    const zeilen = unterlagen?.tabelle?.zeilen ?? [];
    expect(zeilen).toHaveLength(8);
    expect(zeilen.slice(0, 6).every((z) => z[2] === 'im Backend, Vorschau unten')).toBe(true);
    expect(zeilen.slice(6).every((z) => z[2] === 'im Backend')).toBe(true);
    expect(unterlagen?.bilder?.map((b) => b.name)).toEqual(fotos.slice(0, 6).map((f) => f.fileName));
  });

  it('verspricht ohne gezeichnetes Bild keine Vorschau unten', () => {
    const blatt = vorgangsblattInhalt({ vorgang: vorgang(), jetzt: JETZT });
    const unterlagen = blatt.abschnitte.find((a) => a.titel === 'Unterlagen');
    const zeilen = unterlagen?.tabelle?.zeilen ?? [];
    expect(zeilen.flat()).not.toContain('im Backend, Vorschau unten');
    expect(zeilen[0][2]).toBe('im Backend');
    expect(unterlagen?.text).toBe('Keine Vorschau im Blatt. Alle Fotos stehen im Backend.');
    expect(unterlagen?.bilder).toBeUndefined();
  });

  it('markiert bei gleichen Dateinamen keine Datei mit „Vorschau unten“', () => {
    const fotos = Array.from({ length: 7 }, (_, i) => ({
      id: `g${i + 1}`,
      fileName: 'IMG_0001.jpg',
      sizeBytes: 1,
      mimeType: 'image/jpeg',
      category: 'schluesselfoto' as const,
      storageKey: String(40 + i),
      uploadedAt: '2026-11-02T08:15:00.000Z',
    }));
    const bilder: BlattBild[] = fotos.slice(0, 6).map((f) => ({ name: f.fileName, daten: new Uint8Array([1]) }));
    const blatt = vorgangsblattInhalt({ vorgang: vorgang({ kind: 'anfrage', area: 'schluessel-nach-vorlage', uploads: fotos }), bilder, jetzt: JETZT });
    const unterlagen = blatt.abschnitte.find((a) => a.titel === 'Unterlagen');
    const zeilen = unterlagen?.tabelle?.zeilen ?? [];
    expect(zeilen.flat()).not.toContain('im Backend, Vorschau unten');
    expect(zeilen.every((z) => z[2] === 'im Backend')).toBe(true);
    expect(unterlagen?.text).toBe('Vorschau der ersten 6 von 7 Fotos. Alle Fotos stehen im Backend.');
  });

  it('zählt nur Bilder als vorschaufähig, also keinen Grundriss als PDF', () => {
    const uploads = [
      { id: 'h1', fileName: 'schluesselfoto.jpg', sizeBytes: 1, mimeType: 'image/jpeg', category: 'schluesselfoto' as const, storageKey: '50', uploadedAt: '2026-11-02T08:15:00.000Z' },
      { id: 'h2', fileName: 'grundriss.pdf', sizeBytes: 1, mimeType: 'application/pdf', category: 'grundriss' as const, storageKey: '51', uploadedAt: '2026-11-02T08:15:00.000Z' },
    ];
    const bilder: BlattBild[] = [{ name: 'schluesselfoto.jpg', daten: new Uint8Array([1]) }];
    const blatt = vorgangsblattInhalt({ vorgang: vorgang({ kind: 'anfrage', area: 'schluessel-nach-vorlage', uploads }), bilder, jetzt: JETZT });
    const unterlagen = blatt.abschnitte.find((a) => a.titel === 'Unterlagen');
    expect(unterlagen?.text).toBeUndefined();
    expect(unterlagen?.tabelle?.zeilen.map((z) => z[2])).toEqual(['im Backend, Vorschau unten', 'im Backend']);
  });

  it('lässt die neuen Abschnitte weg, wenn es nichts zu zeigen gibt', () => {
    const blatt = vorgangsblattInhalt({ vorgang: vorgang({ uploads: [] }), jetzt: JETZT });
    expect(titelListe(blatt.abschnitte)).toEqual(['Kunde', 'Angaben des Kunden: Fahrzeug', 'Zahlung', 'Verlauf', 'Interne Notizen']);
  });
});

describe('laeufe', () => {
  const hat = (schrift: string, cp: number) => (schrift === 'a' ? cp < 0x100 : cp >= 0x100 && cp < 0x250);

  it('wechselt die Schriftdatei je Zeichen und ersetzt Unbekanntes durch ?', () => {
    expect(laeufe('Łódź 日', ['a', 'b'], hat)).toEqual([
      { schrift: 'b', text: 'Ł' },
      { schrift: 'a', text: 'ód' },
      { schrift: 'b', text: 'ź' },
      { schrift: 'a', text: ' ?' },
    ]);
  });

  it('lässt Zeilenumbrüche im laufenden Teil', () => {
    expect(laeufe('Ł\nŁ', ['a', 'b'], hat)).toEqual([{ schrift: 'b', text: 'Ł\nŁ' }]);
  });

  it('setzt zerlegte Zeichen vorher zusammen (NFC)', () => {
    expect(laeufe('S\u030Ckoda', ['a', 'b'], hat).map((l) => l.text).join('')).toBe('Škoda');
  });
});

describe('erzeugePdf', () => {
  it('erzeugt ein gültiges PDF mit Titel, Nummer, Namen mit latin-ext und Fußzeile', async () => {
    const blatt = vorgangsblattInhalt({ vorgang: vorgang(), firma: echteEinstellungen().company, jetzt: JETZT });
    const pdf = await erzeugePdf(blatt, { komprimieren: false });
    const text = pdfText(pdf);
    expect(text.startsWith('%PDF-1.')).toBe(true);
    expect(text.trimEnd().endsWith('%%EOF')).toBe(true);
    expect(infoWert(pdf, 'Title')).toBe('Vorgangsblatt SM24-T-2026-0007');
    expect(infoWert(pdf, 'Author')).toBe('SCHLÜSSELMACHER24');
    expect(text).toMatch(/\/Type \/Page\b/);
    /* Eingebettete Schriften: Plex Sans (normal, fett, latin-ext) und Plex Mono */
    expect((text.match(/\/FontFile2/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });

  it('bricht lange Inhalte auf mehrere Seiten um', async () => {
    const viele = vorgang({ timeline: Array.from({ length: 80 }, (_, i) => ({ at: '2026-11-02T08:15:00.000Z', actor: 'team' as const, message: `Eintrag ${i + 1}` })) });
    const pdf = await erzeugePdf(vorgangsblattInhalt({ vorgang: viele, jetzt: JETZT }), { komprimieren: false });
    const seiten = (pdfText(pdf).match(/\/Type \/Page\b/g) ?? []).length;
    expect(seiten).toBeGreaterThan(1);
  });

  it('komprimiert im Betrieb', async () => {
    const pdf = await erzeugePdf(vorgangsblattInhalt({ vorgang: vorgang(), jetzt: JETZT }));
    expect(pdf.toString('latin1')).toContain('/FlateDecode');
  });

  it('nimmt die Farben aus den Tokens', () => {
    expect(PDF_FARBEN.text).toBe(oklchZuHex('0.2497 0.0366 266'));
    expect(PDF_FARBEN.leise).toBe(oklchZuHex('0.4654 0.0347 262.8'));
    expect(PDF_FARBEN.linie).toBe(oklchZuHex('0.9091 0.0162 255'));
    expect(PDF_FARBEN.primaer).toBe(oklchZuHex('0.4852 0.1611 257.63'));
    expect(PDF_FARBEN.flaeche).toBe(oklchZuHex('0.971 0.0077 255'));
  });

  it('nennt alle Schriftdateien für die Ablage im Build, und next.config.ts nimmt sie mit', () => {
    expect(SCHRIFT_DATEIEN.length).toBe(5);
    const konfig = readFileSync(path.join(process.cwd(), 'next.config.ts'), 'utf8');
    for (const datei of SCHRIFT_DATEIEN) {
      const eintrag = datei.startsWith('src/fonts/pdf/') ? './src/fonts/pdf/*.woff' : `./${datei}`;
      expect(konfig, datei).toContain(eintrag);
    }
    expect(konfig).toContain("serverExternalPackages: ['pdfkit']");
    expect(SCHRIFT_DATEIEN.every((datei) => !datei.endsWith('.woff2'))).toBe(true);
  });
});
