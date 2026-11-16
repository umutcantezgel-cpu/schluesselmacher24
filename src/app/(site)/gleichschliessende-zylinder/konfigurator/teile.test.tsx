import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { KEINE_HERSTELLER_VORGABE, systemeFuerSperrschliessung } from '@/lib/konfigurator';

import { ALLGEMEINE_ANFRAGE } from './kern';
import { AnfrageWeg, HerstellerAngabeWahl } from './teile';

const SYSTEME = systemeFuerSperrschliessung(defaults.hersteller());
const ohne = () => undefined;

describe('Konfigurator: Herstellerwahl ohne Herstellerpreise (FA-SHOP-04B)', () => {
  it('zeigt BKS und ABUS als wählbare Systeme mit Schriftzug, ohne Logo und ohne Betrag', () => {
    const html = renderToStaticMarkup(<HerstellerAngabeWahl systeme={SYSTEME} wert="" onWahl={ohne} />);
    expect(html).toContain('BKS');
    expect(html).toContain('ABUS');
    expect(html).not.toContain('BURG-WÄCHTER');
    expect(html).toContain('Keine Vorgabe');
    expect(html).toContain('Ihre Wahl geben wir an die Werkstatt weiter.');
    expect(html).not.toContain('<img');
    expect(html).not.toMatch(/€|EUR/);
    expect(html).not.toContain('—');
    expect(html.match(/name="hersteller"/g)).toHaveLength(SYSTEME.length + 1);
  });

  it('zeigt ein Logo nur, wenn der Stamm es freigegeben herausgibt (R12)', () => {
    const mitLogo = SYSTEME.map((s, i) => (i === 0 ? { ...s, logo: { url: '/api/medien/file/logo-test.png', alt: 'Logo BKS' } } : s));
    const html = renderToStaticMarkup(<HerstellerAngabeWahl systeme={mitLogo} wert={KEINE_HERSTELLER_VORGABE} onWahl={ohne} />);
    expect(html.match(/<img/g)).toHaveLength(1);
    // Der Name steht als Titel; das Logo daneben ist Schmuck, damit ihn ein Screenreader nur einmal vorliest.
    expect(html).toContain('alt=""');
    expect(html).not.toContain('Logo BKS');
    expect(html.match(/BKS/g)).toHaveLength(1);
  });
});

describe('Konfigurator: Weg in die Anfrage bei unbestätigtem Preis (FA-SHOP-04B, Punkt 6)', () => {
  it('nennt keinen Betrag und keinen Warenkorb, sondern den Weg in die Anfrage', () => {
    const html = renderToStaticMarkup(
      <AnfrageWeg sperrText="Der Preis für „Halbzylinder“ ist noch nicht bestätigt." href="/schliessanlagen/konfigurator/schliessplan?plan=1.x" mitPlan hersteller="BKS" />,
    );
    expect(html).toContain('Zusammenstellung als Anfrage schicken');
    expect(html).toContain('href="/schliessanlagen/konfigurator/schliessplan?plan=1.x"');
    expect(html).toContain('Zylinder, Maße, Schlüssel, Optionen und Hersteller gehen mit.');
    expect(html).not.toMatch(/€|EUR|Warenkorb/);
    expect(html).not.toContain('noch einmal');
  });

  it('ohne Link nennt er, was der Kunde selbst angeben soll', () => {
    const html = renderToStaticMarkup(<AnfrageWeg sperrText={null} href={ALLGEMEINE_ANFRAGE} mitPlan={false} hersteller="ABUS" />);
    expect(html).toContain('und den Hersteller ABUS.');
    expect(html).toContain('href="/service-und-termin/anfrage?thema=gleichschliessende-zylinder"');
  });
});
