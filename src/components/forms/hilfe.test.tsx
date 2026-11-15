import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { Settings } from '@/lib/types';

import { AbsendeFehler, HILFE_BLOCK, HilfeBlock, OffenerSchritt, TelefonHilfe } from './hilfe';
import { hilfeAus, type HilfeKontakt } from './hilfe-daten';

const HILFE: HilfeKontakt = {
  telefon: '0641 000000',
  erreichbarkeit: { kernaussage: 'Erreichbar nach Absprache', zeilen: ['Zeile des Inhabers'], rundUmDieUhr: false },
};

describe('Hilfeblock in den Formularen (FA-QA-02)', () => {
  it('zeigt Telefon als Verweis, die Erreichbarkeit im Wortlaut der Einstellungen und den Rückruf', () => {
    const html = renderToStaticMarkup(<HilfeBlock hilfe={HILFE} stelle="masse" />);
    expect(html).toContain(`data-block="${HILFE_BLOCK}"`);
    expect(html).toContain('data-stelle="masse"');
    expect(html).toContain('Unsicher bei einer Angabe?');
    expect(html).toMatch(/<a href="tel:\+49641000000"[^>]*>0641 000000<\/a>/);
    expect(html).toContain('Erreichbar nach Absprache');
    expect(html).toContain('Zeile des Inhabers');
    expect(html).toContain('href="/beratung#rueckruf"');
    expect(html).not.toContain('Später weitermachen');
  });

  it('nennt „Später weitermachen“ und dass Dateien neu zu wählen sind, wo das Formular Dateien hat', () => {
    const html = renderToStaticMarkup(<HilfeBlock hilfe={HILFE} spaeter mitDateien />);
    expect(html).toContain('Später weitermachen: Ihre Angaben bleiben auf diesem Gerät gespeichert.');
    expect(html).toContain('Die Dateien wählen Sie dann bitte erneut aus.');
  });

  it('lässt ohne veröffentlichte Nummer die Telefonzeile weg, behält aber den Rückruf', () => {
    const html = renderToStaticMarkup(<HilfeBlock />);
    expect(html).not.toContain('tel:');
    expect(html).toContain('Rückruf erbitten');
    expect(renderToStaticMarkup(<TelefonHilfe />)).toBe('');
  });

  it('im Rückrufformular selbst ohne Rückruf-Verweis', () => {
    expect(renderToStaticMarkup(<HilfeBlock hilfe={HILFE} rueckruf={false} />)).not.toContain('Rückruf erbitten');
  });

  it('Verweise sind mindestens 44 px hoch, Texte nicht kleiner als 15 px', () => {
    const html = renderToStaticMarkup(<HilfeBlock hilfe={HILFE} spaeter />);
    expect(html.match(/<a [^>]*class="[^"]*min-h-touch/g)).toHaveLength(2);
    expect(html).not.toContain('text-caption');
  });

  it('kein eigener Satz zu Zeiten und keine Gedankenstriche', () => {
    const html = renderToStaticMarkup(<HilfeBlock hilfe={{ telefon: HILFE.telefon }} spaeter mitDateien />);
    expect(html).not.toMatch(/Uhr|rund um die Uhr|24 Stunden|Öffnungszeit/);
    expect(html).not.toMatch(/[–—]/);
  });
});

describe('Fehler beim Absenden (FA-QA-02)', () => {
  it('wird sofort angesagt, sagt, dass die Angaben bleiben, und bietet Anrufen an', () => {
    const html = renderToStaticMarkup(<AbsendeFehler fehler="Die Verbindung wurde unterbrochen." hilfe={HILFE} />);
    expect(html).toContain('role="alert"');
    expect(html).toContain('Die Verbindung wurde unterbrochen.');
    expect(html).toContain('Ihre Angaben bleiben erhalten. Versuchen Sie es noch einmal');
    expect(html).toContain('oder rufen Sie uns an:');
    expect(html).toContain('href="tel:+49641000000"');
  });

  it('ohne Nummer führt sie zum Rückruf', () => {
    const html = renderToStaticMarkup(<AbsendeFehler fehler="Fehler." />);
    expect(html).toContain('erbitten Sie einen Rückruf');
    expect(html).toContain('href="/beratung#rueckruf"');
  });
});

describe('Weg zum unvollständigen Schritt (FA-QA-02)', () => {
  it('sagt, was fehlt, und hat einen Knopf zum Schritt', () => {
    const html = renderToStaticMarkup(<OffenerSchritt text="Es fehlen Fotos." schritt="Fotos" onGehe={() => {}} />);
    expect(html).toContain('Es fehlen Fotos.');
    expect(html).toMatch(/<button[^>]*>Zum Schritt „Fotos“<\/button>/);
  });
});

describe('Telefon und Erreichbarkeit aus den Einstellungen', () => {
  it('nimmt nur veröffentlichte Angaben und die gepflegte Erreichbarkeit', async () => {
    const { defaults } = await import('@/lib/data/defaults');
    const settings = defaults.settings() as Settings;
    const hilfe = hilfeAus(settings);
    expect(hilfe.erreichbarkeit?.kernaussage).toBeTruthy();
    const ohneFirma = hilfeAus({ ...settings, company: { ...settings.company, phone: '' } });
    expect(ohneFirma.telefon).toBeUndefined();
  });
});
