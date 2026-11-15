import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { GEWINNUNG_SEITEN, NUR_FAHRZEUGSCHLUESSEL, PARTNER_LEISTUNGEN, PARTNER_SEKTION } from '@/lib/partner/gewinnung';

// Spätes Vorladen der Brotkrumen braucht den App-Router; im Test genügt das Markup.
vi.mock('@/lib/spaet-vorladen', () => ({ SpaetVorladen: () => null }));

const { GewinnungSeite } = await import('./gewinnung-seite');
const { PartnerSektion } = await import('./partner-sektion');

/** Text ohne Tags, Entitäten wie im Browser aufgelöst (für Vergleiche mit den Daten). */
function klartext(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ');
}

describe('Partnerseiten: Vorlage', () => {
  for (const seite of GEWINNUNG_SEITEN) {
    it(`zeigt ${seite.pfad} vollständig, mit Klarstellung, Verweisen und nächstem Schritt`, () => {
      const html = renderToStaticMarkup(<GewinnungSeite seite={seite} telefon="06441 8056279" />);
      const text = klartext(html);

      expect(html.match(/<h1\b/g)).toHaveLength(1);
      expect(text).toContain(seite.ueberschrift);
      expect(text).toContain(NUR_FAHRZEUGSCHLUESSEL.text);
      for (const abschnitt of seite.abschnitte) expect(text).toContain(abschnitt.ueberschrift);

      // Brotkrumen und Strukturdaten
      expect(html).toContain('aria-label="Brotkrumennavigation"');
      expect(html).toContain('application/ld+json');
      expect(html).toContain(`${seite.pfad}#webpage`);
      expect(html).toContain('BreadcrumbList');

      // Verweise auf alle anderen Partnerseiten und zur Bewerbung
      for (const andere of GEWINNUNG_SEITEN.filter((s) => s !== seite)) expect(html).toContain(`href="${andere.pfad}"`);
      expect(html).toContain('href="/partner-werden"');
      // Im HTML steht „&“ in Adressen als „&amp;“.
      expect(html).toContain(`href="${seite.naechsterSchritt.primaer.href.replace(/&/g, '&amp;')}"`);

      // Telefon aus den Einstellungen
      expect(html).toContain('href="tel:+4964418056279"');
    });
  }

  it('zeigt die Leistungsliste in voller Länge nur, wo ein Abschnitt sie verlangt', () => {
    for (const seite of GEWINNUNG_SEITEN) {
      const text = klartext(renderToStaticMarkup(<GewinnungSeite seite={seite} />));
      const voll = PARTNER_LEISTUNGEN.every((l) => text.includes(l.text));
      expect(voll, seite.slug).toBe(seite.abschnitte.some((a) => a.baustein === 'leistungen'));
    }
  });

  it('zeichnet den Ablauf auf „Aufträge erhalten“ als Liste und Grafik', () => {
    const seite = GEWINNUNG_SEITEN.find((s) => s.slug === 'auftraege-erhalten')!;
    const html = renderToStaticMarkup(<GewinnungSeite seite={seite} />);
    expect(html).toContain('data-ablauf="partner-auftraege-erhalten"');
    for (const station of seite.ablauf!.stationen) expect(html).toContain(station);
    for (const schritt of seite.ablauf!.schritte) expect(klartext(html)).toContain(schritt.titel);
  });

  it('zeigt eine Platzhalter-Telefonnummer ohne Link und lässt ohne Nummer die Zeile weg', () => {
    const seite = GEWINNUNG_SEITEN[0];
    const platzhalter = renderToStaticMarkup(<GewinnungSeite seite={seite} telefon="[Platzhalter: Telefon]" />);
    expect(platzhalter).not.toContain('href="tel:');
    expect(renderToStaticMarkup(<GewinnungSeite seite={seite} />)).not.toContain('Lieber telefonisch');
  });
});

describe('Startseiten-Sektion „Autoschlüssel-Profi? Partner werden“', () => {
  it('zeigt Überschrift, Sätze, drei Kurzpunkte, Knopf und Textverweis', () => {
    const html = renderToStaticMarkup(<PartnerSektion />);
    const text = klartext(html);
    expect(html).toContain('aria-labelledby="partner-sektion-titel"');
    expect(html).toMatch(/<h2[^>]*id="partner-sektion-titel"[^>]*>Autoschlüssel-Profi\? Partner werden<\/h2>/);
    for (const satz of PARTNER_SEKTION.saetze) expect(text).toContain(satz);
    for (const punkt of PARTNER_SEKTION.punkte) expect(text).toContain(punkt);
    expect(html).toContain('href="/partner-werden"');
    expect(html).toContain('href="/partner-werden/auftraege-erhalten"');
    expect(text).toContain('So erhalten Sie Aufträge');
  });
});
