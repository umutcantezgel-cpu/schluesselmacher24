import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { ImageSlot, UploadSteckplatz } from '@/lib/types';
import { FOTO_BEISPIEL_TITEL } from '@/components/visual/generators/foto-beispiel';

import {
  MAX_AUSWAHL_FOTO_BYTES,
  MAX_UPLOAD_BYTES,
  MELDUNG_UPLOAD_ZU_GROSS,
  PhotoUpload,
  auswahlGrenze,
  beispielFuerFeld,
  beispielSatz,
  beispielSatzSichtbar,
  beispielZeigtBild,
  dateityp,
  kodiereUnterGrenze,
  uploadFehler,
} from './photo-upload';
import { MAX_BILD_BYTES, MAX_PDF_BYTES } from '@/lib/server/datei-pruefung';

const BETONT =
  'inline-flex min-h-touch items-center justify-center gap-2 rounded-lg bg-primary px-4 text-body font-semibold text-primary-foreground hover:bg-primary-hover';
const RUHIG =
  'inline-flex min-h-touch items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface px-4 text-body font-semibold text-foreground hover:bg-surface-muted';

const beispiel: ImageSlot = { motif: 'Beispielfoto', ratio: '4/3' };

function vorlage(kamera?: 'betont' | 'ruhig') {
  return renderToStaticMarkup(
    <PhotoUpload
      id="foto-test"
      label="Foto des Schlüssels"
      description="Ein Foto hilft uns beim Abgleich."
      example={beispiel}
      files={[]}
      onChange={() => {}}
      {...(kamera ? { kamera } : {})}
    />,
  );
}

/** Klasse des Knopfs, dessen sichtbarer Text `beschriftung` ist. */
function klasseVon(html: string, beschriftung: string): string | undefined {
  const treffer = new RegExp(
    `<button[^>]*class="([^"]*)"[^>]*>(?:(?!</button>)[\\s\\S])*?${beschriftung}</button>`,
  ).exec(html);
  return treffer?.[1];
}

describe('PhotoUpload · Knopf „Foto aufnehmen“', () => {
  it('bleibt ohne Angabe der gefüllte Hauptknopf wie bisher', () => {
    const html = vorlage();
    expect(klasseVon(html, 'Foto aufnehmen')).toBe(BETONT);
  });

  it('wird mit kamera="ruhig" zum Rahmenknopf wie „Aus Galerie wählen“', () => {
    const html = vorlage('ruhig');
    const kamera = klasseVon(html, 'Foto aufnehmen');
    expect(kamera).toBe(RUHIG);
    expect(kamera).toBe(klasseVon(html, 'Aus Galerie wählen'));
    expect(kamera).not.toContain('bg-primary');
  });
});

describe('PhotoUpload · Größengrenzen (Vercel: 4,5 MB je Anfrage)', () => {
  it('nutzt dieselbe Grenze wie der Server', () => {
    expect(MAX_UPLOAD_BYTES).toBe(MAX_BILD_BYTES);
    expect(MAX_UPLOAD_BYTES).toBe(MAX_PDF_BYTES);
  });

  it('lässt Fotos bis 12 MB auswählen (sie werden verkleinert), PDF nur bis 4 MB', () => {
    expect(auswahlGrenze({ type: 'image/jpeg', name: 'a.jpg' })).toBe(MAX_AUSWAHL_FOTO_BYTES);
    expect(auswahlGrenze({ type: 'image/png', name: 'a.png' })).toBe(MAX_AUSWAHL_FOTO_BYTES);
    expect(auswahlGrenze({ type: 'image/heic', name: 'a.heic' })).toBe(MAX_AUSWAHL_FOTO_BYTES);
    expect(auswahlGrenze({ type: 'application/pdf', name: 'schein.pdf' })).toBe(MAX_UPLOAD_BYTES);
    expect(auswahlGrenze({ type: '', name: 'unbekannt.bin' })).toBe(MAX_UPLOAD_BYTES);
  });

  it('erkennt HEIC ohne Typangabe an der Endung', () => {
    expect(dateityp({ type: '', name: 'IMG_0001.HEIC' })).toBe('image/heic');
    expect(dateityp({ type: '', name: 'foto.heif' })).toBe('image/heic');
    expect(dateityp({ type: 'image/jpeg', name: 'x.heic' })).toBe('image/jpeg');
  });

  it('senkt die Qualität stufenweise, bis das Foto passt', async () => {
    const versuche: number[] = [];
    const groesse: Record<number, number> = { 0.85: 6_000_000, 0.7: 4_500_000, 0.6: 3_000_000 };
    const blob = await kodiereUnterGrenze(async (q) => {
      versuche.push(q);
      return new Blob([new Uint8Array(groesse[q])]);
    }, MAX_UPLOAD_BYTES);
    expect(versuche).toEqual([0.85, 0.7, 0.6]);
    expect(blob?.size).toBe(3_000_000);
  });

  it('hört auf, sobald eine Stufe passt, und liefert sonst das kleinste Ergebnis', async () => {
    const versuche: number[] = [];
    const passt = await kodiereUnterGrenze(async (q) => {
      versuche.push(q);
      return new Blob([new Uint8Array(1000)]);
    }, MAX_UPLOAD_BYTES);
    expect(versuche).toEqual([0.85]);
    expect(passt?.size).toBe(1000);

    const zuGross = await kodiereUnterGrenze(async (q) => new Blob([new Uint8Array(q === 0.7 ? 5000 : 6000)]), 100);
    expect(zuGross?.size).toBe(5000);
    expect(await kodiereUnterGrenze(async () => null, 100)).toBeNull();
  });

  it('übersetzt eine 413 ohne JSON (Plattformgrenze) in eine verständliche Meldung', () => {
    expect(uploadFehler(413, {})).toBe(MELDUNG_UPLOAD_ZU_GROSS);
    expect(MELDUNG_UPLOAD_ZU_GROSS).toMatch(/4 MB.*E-Mail/);
    expect(uploadFehler(413, { error: 'Das PDF ist größer als 4 MB.' })).toBe('Das PDF ist größer als 4 MB.');
    expect(uploadFehler(502, {})).toBe('Die Datei konnte nicht hochgeladen werden.');
  });

  it('nennt die Grenzen am Feld', () => {
    const html = renderToStaticMarkup(
      <PhotoUpload id="schein" label="Fahrzeugschein" description="" example={beispiel} files={[]} onChange={() => {}} allowDocuments />,
    );
    expect(html).toContain('Fotos bis 12 MB');
    expect(html).toContain('PDF bis 4 MB');
  });

  /* FA-QA-02: Foto-Upload mit konkreten Beispielen */

  it('zeigt das Beispiel ein Bild oder eine Zeichnung, heißt die Zeile „So sollte das Foto aussehen“', () => {
    const mitZeichnung: ImageSlot = { motif: 'Beispielfoto: Sicherungskarte, ganz im Bild', ratio: '3/2' };
    expect(beispielZeigtBild(mitZeichnung)).toBe(true);
    const html = renderToStaticMarkup(
      <PhotoUpload id="karte" label="Karte" description="" example={mitZeichnung} files={[]} onChange={() => {}} />,
    );
    expect(html).toContain('So sollte das Foto aussehen');
    expect(html).not.toContain('data-beispiel-satz');
  });

  it('steht dort nur ein Symbol, sagt die Zeile, was zu sehen sein muss, mit einem Satz darunter', () => {
    const nurSymbol: ImageSlot = { motif: 'Beispielfoto: Lackschaden am Gehäuse, gut ausgeleuchtet', ratio: '3/2' };
    expect(beispielZeigtBild(nurSymbol)).toBe(false);
    expect(beispielSatz(nurSymbol)).toBe('Lackschaden am Gehäuse, gut ausgeleuchtet.');
    const html = renderToStaticMarkup(
      <PhotoUpload id="gehaeuse" label="Gehäuse" description="" example={nurSymbol} files={[]} onChange={() => {}} />,
    );
    expect(html).not.toContain('So sollte das Foto aussehen');
    expect(html).toContain('Darauf muss zu sehen sein');
    expect(html).toContain('Lackschaden am Gehäuse, gut ausgeleuchtet.');
  });

  /* FA-26-06: Beispielzeichnung je Steckplatz, Wortlaut der Beispiele aus dem Bestand. */
  const STECKPLAETZE: Array<[UploadSteckplatz | undefined, ImageSlot, string]> = [
    ['fahrzeugschein', { motif: 'Beispielfoto: Fahrzeugschein flach aufgelegt, alle vier Ecken im Bild', ratio: '3/2' }, FOTO_BEISPIEL_TITEL.fahrzeugschein],
    ['typenschild', { motif: 'Beispielfoto: Typenschild am Fahrzeug, Hersteller und Nummer lesbar', ratio: '4/3' }, FOTO_BEISPIEL_TITEL.typenschild],
    [
      'ersatznachweis',
      { motif: 'Beispielfoto: Nachweis flach aufgelegt, ganzes Blatt im Bild, Name und Fahrzeug lesbar', ratio: '3/2' },
      FOTO_BEISPIEL_TITEL.ersatznachweis,
    ],
    [
      'schluessel-spitze',
      // Wie im Bestand mit dem Profilschnitt (Seitenansicht) als Zeichnung am Beispiel.
      { motif: 'Beispielfoto: Blick von vorne auf die Spitze, Profil deutlich erkennbar', ratio: '4/3', visual: { generator: 'profilschnitt', params: { beschriftung: false } } },
      FOTO_BEISPIEL_TITEL.schluesselspitze,
    ],
    [undefined, { motif: 'Beispiel: Gewerbeanmeldung oder Zertifikat, vollständig und gut lesbar', ratio: '4/3' }, FOTO_BEISPIEL_TITEL.gewerbeanmeldung],
  ];

  it.each(STECKPLAETZE)('Steckplatz %s: das Feld zeigt die Beispielzeichnung mit Alternativtext und dem Satz der Seite', (steckplatz, example, titel) => {
    const html = renderToStaticMarkup(
      <PhotoUpload id="feld" label="Unterlage" description="" example={example} steckplatz={steckplatz} files={[]} onChange={() => {}} allowDocuments />,
    );
    expect(html).toContain('So sollte das Foto aussehen');
    expect(html).toContain('data-beispiel-satz');
    expect(html).toContain(beispielSatz(example));
    expect(html).toContain(`<title>${titel}</title>`);
    expect(beispielZeigtBild(beispielFuerFeld(example, steckplatz))).toBe(true);
  });

  it('Einsendeweg (R13): am Fahrzeugschein bleibt „Halter und Fahrzeugdaten lesbar“ sichtbar, die Zeichnung markiert den Halter', () => {
    // Wortlaut aus schluessel-einschicken/anmelden/einsende-formular.tsx (EXAMPLE_FAHRZEUGSCHEIN).
    const example: ImageSlot = {
      motif: 'Beispielfoto: Zulassungsbescheinigung Teil I, ganze Seite im Bild, Halter und Fahrzeugdaten lesbar',
      ratio: '4/3',
      note: 'Die ganze Seite, scharf und ohne Spiegelung.',
    };
    const html = renderToStaticMarkup(
      <PhotoUpload id="schein" label="Fahrzeugschein" description="" example={example} steckplatz="fahrzeugschein" files={[]} onChange={() => {}} allowDocuments />,
    );
    expect(html).toContain('So sollte das Foto aussehen');
    expect(html).toContain('Halter und Fahrzeugdaten lesbar.');
    expect(html).toContain('>Halter</text>');
    expect(html).toContain(`<title>${FOTO_BEISPIEL_TITEL.fahrzeugschein}</title>`);
    expect(FOTO_BEISPIEL_TITEL.fahrzeugschein).toContain('Halter');
  });

  it('ohne Motivtext steht unter der Zeichnung der Hinweis der Seite', () => {
    const html = renderToStaticMarkup(
      <PhotoUpload id="gewerbe" label="Nachweis" description="" example={{ motif: 'Beispiel:', ratio: '4/3', note: 'Scharf, ohne Spiegelung.' }} steckplatz="ersatznachweis" files={[]} onChange={() => {}} />,
    );
    expect(html).toContain('Scharf, ohne Spiegelung.');
  });

  it('andere Zeichnungen und echte Fotos bleiben ohne Satz darunter', () => {
    expect(beispielSatzSichtbar({ motif: 'Beispielfoto: Sicherungskarte, ganz im Bild', ratio: '3/2' })).toBe(false);
    expect(beispielSatzSichtbar({ motif: 'Beispielfoto: Fahrzeugschein', ratio: '3/2', bild: { url: '/medien/schein.jpg', alt: 'Fahrzeugschein' } })).toBe(false);
    expect(beispielSatzSichtbar({ motif: 'Beispielfoto: Lackschaden am Gehäuse', ratio: '3/2' })).toBe(true);
  });

  it('ein echtes Foto am Beispiel bleibt vor der Zeichnung (MA-05)', () => {
    const mitFoto: ImageSlot = { motif: 'Beispielfoto: Fahrzeugschein', ratio: '3/2', bild: { url: '/medien/schein.jpg', alt: 'Fahrzeugschein' } };
    expect(beispielFuerFeld(mitFoto, 'fahrzeugschein')).toBe(mitFoto);
    expect(beispielFuerFeld(beispiel, 'sonstiges')).toBe(beispiel);
    expect(beispielFuerFeld(beispiel, 'schluessel-spitze').visual).toEqual({ generator: 'foto-beispiel', params: { motiv: 'schluesselspitze' } });
  });

  it('nimmt ohne Motivtext den Hinweis und hängt keinen doppelten Punkt an', () => {
    expect(beispielSatz({ motif: 'Beispiel:', ratio: '4/3', note: 'Alle Ecken im Bild.' })).toBe('Alle Ecken im Bild.');
    expect(beispielSatz({ motif: '', ratio: '4/3' })).toBe('');
  });

  it('Hilfetexte am Feld sind nicht kleiner als 15 px', () => {
    expect(vorlage()).not.toContain('text-caption');
  });
});
