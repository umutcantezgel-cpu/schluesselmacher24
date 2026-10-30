import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { DatenschutzInhalt } from '@/app/(site)/rechtliches/datenschutz/datenschutz-inhalt';

import { echteEinstellungen, platzhalterEinstellungen } from './test-hilfen';
import { DIENSTLEISTER, VERARBEITUNGEN_FASSUNG, dienstleister, verarbeitungen } from './verarbeitungen';

/** HTML-Entitäten zurückwandeln, damit Texte mit Anführungszeichen vergleichbar sind. */
function klartext(html: string): string {
  return html.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
}

describe('Verarbeitungsverzeichnis', () => {
  const settings = echteEinstellungen();
  const liste = verarbeitungen(settings);

  it('beschreibt jede Verarbeitung vollständig', () => {
    expect(liste.length).toBeGreaterThanOrEqual(10);
    for (const eintrag of liste) {
      expect(eintrag.titel, eintrag.id).not.toBe('');
      expect(eintrag.zweck, eintrag.id).not.toBe('');
      expect(eintrag.daten.length, eintrag.id).toBeGreaterThan(0);
      expect(eintrag.rechtsgrundlage, eintrag.id).toMatch(/Art\. 6|§ 25/);
      expect(eintrag.empfaenger, eintrag.id).not.toBe('');
      expect(eintrag.speicherdauer, eintrag.id).not.toBe('');
    }
    expect(new Set(liste.map((e) => e.id)).size).toBe(liste.length);
  });

  it('deckt den eingesetzten Stack und die Pflichtthemen ab', () => {
    const ids = liste.map((e) => e.id);
    for (const id of ['hosting', 'datenbank', 'sicherung', 'vorgaenge', 'dateien', 'zahlung', 'email', 'kontakt', 'browser', 'ratenbegrenzung', 'widerruf']) {
      expect(ids).toContain(id);
    }
    expect(DIENSTLEISTER.map((d) => d.id)).toEqual(['vercel', 'supabase', 'github', 'cloudflare', 'stripe', 'resend']);
  });

  it('nennt den Upload beim Auswählen, die 24-Stunden-Löschung und die Fristen aus den Einstellungen', () => {
    const dateien = liste.find((e) => e.id === 'dateien')!;
    expect(dateien.speicherdauer).toContain('schon beim Auswählen');
    expect(dateien.speicherdauer).toContain('nach 24 Stunden');
    expect(dateien.speicherdauer).toContain(`Fahrzeugschein ${settings.retentionDays.vehicleRegistration} Tage`);
    expect(verarbeitungen({ retentionDays: { ...settings.retentionDays, keyPhotos: 30 } }).find((e) => e.id === 'dateien')!.speicherdauer)
      .toContain('Schlüsselfotos 30 Tage');
  });
});

describe('Datenschutzerklärung', () => {
  const settings = echteEinstellungen();

  it('gibt jede Verarbeitung der Liste mit allen Angaben aus', () => {
    const html = klartext(renderToStaticMarkup(<DatenschutzInhalt settings={settings} />));
    for (const eintrag of verarbeitungen(settings)) {
      expect(html, eintrag.id).toContain(eintrag.titel);
      expect(html, eintrag.id).toContain(eintrag.zweck);
      expect(html, eintrag.id).toContain(eintrag.rechtsgrundlage);
      expect(html, eintrag.id).toContain(eintrag.empfaenger);
      expect(html, eintrag.id).toContain(eintrag.speicherdauer);
      if (eintrag.drittland) expect(html, eintrag.id).toContain(eintrag.drittland);
    }
    for (const dienstleister of DIENSTLEISTER) expect(html).toContain(dienstleister.name);
    expect(html).toContain(`Fassung ${VERARBEITUNGEN_FASSUNG.nummer}`);
  });

  it('nennt Verantwortlichen, Aufsicht und keine Analysedienste', () => {
    const html = klartext(renderToStaticMarkup(<DatenschutzInhalt settings={settings} />));
    expect(html).toContain('SCHLÜSSELMACHER24 – Inhaber Mina Saad');
    expect(html).toContain('href="tel:+4964418056279"');
    expect(html).toContain('Der Hessische Beauftragte für Datenschutz und Informationsfreiheit');
    expect(html).toContain('Gustav-Stresemann-Ring 1');
    expect(html).toContain('65189 Wiesbaden');
    expect(html).toContain('keine Cookies oder Techniken zur Analyse');
    expect(html).not.toContain(settings.company.taxNumber!);
    expect(html).not.toContain('Vor der Freigabe prüfen');
  });

  it('zeigt Prüfhinweise nur auf Wunsch und nie Platzhalter', () => {
    expect(renderToStaticMarkup(<DatenschutzInhalt settings={settings} pruefhinweise />)).toContain('Vor der Freigabe prüfen');
    const html = renderToStaticMarkup(<DatenschutzInhalt settings={platzhalterEinstellungen()} />);
    expect(html).not.toContain('[Platzhalter');
    expect(html).not.toContain('[PLZ]');
  });
});

describe('Google Analytics in der Datenschutzerklärung', () => {
  const settings = echteEinstellungen();

  it('erscheint nur, wenn eine Mess-ID gesetzt ist', () => {
    expect(verarbeitungen(settings).some((e) => e.id === 'statistik')).toBe(false);
    expect(dienstleister().map((d) => d.id)).toEqual(['vercel', 'supabase', 'github', 'cloudflare', 'stripe', 'resend']);
    expect(verarbeitungen(settings, { statistik: true }).some((e) => e.id === 'statistik')).toBe(true);
    expect(dienstleister({ statistik: true }).map((d) => d.id)).toContain('google');
  });

  it('nennt Anbieter, Zweck, Einwilligung als Grundlage, Drittland und Widerruf', () => {
    const eintrag = verarbeitungen(settings, { statistik: true }).find((e) => e.id === 'statistik')!;
    expect(eintrag.empfaenger).toContain('Google Ireland Limited');
    expect(eintrag.zweck).toContain('Website genutzt wird');
    expect(eintrag.rechtsgrundlage).toContain('Art. 6 Abs. 1 lit. a DSGVO');
    expect(eintrag.rechtsgrundlage).toContain('§ 25 Abs. 1 TDDDG');
    expect(eintrag.rechtsgrundlage).toContain('Cookie-Einstellungen widerrufen');
    expect(eintrag.drittland).toContain('Data Privacy Framework');
  });

  it('ändert die Erklärung ohne Mess-ID nicht und nennt Google mit Mess-ID', () => {
    const ohne = klartext(renderToStaticMarkup(<DatenschutzInhalt settings={settings} />));
    expect(ohne).not.toContain('Google Analytics');
    expect(ohne).toContain('Analyse- oder Werbedienste setzen wir nicht ein.');

    const mit = klartext(renderToStaticMarkup(<DatenschutzInhalt settings={settings} statistik />));
    expect(mit).toContain('Reichweitenmessung mit Google Analytics (nur mit Einwilligung)');
    expect(mit).toContain('Google Ireland Limited');
    expect(mit).not.toContain('keine Cookies oder Techniken zur Analyse');
  });
});
