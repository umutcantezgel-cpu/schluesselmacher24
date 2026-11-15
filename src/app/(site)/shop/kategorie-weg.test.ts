import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { HINWEIS_PRODUKTE_FOLGEN } from '@/lib/data/defaults/kategorien';
import { sichtbareKategorien } from '@/lib/data/shop';
import { titelPasst } from '@/lib/titelbreite';
import { BESCHREIBUNG_MAX, BESCHREIBUNG_MIN } from '@/lib/codelinie-texte';
import { vorbelegungAusAdresse } from '@/lib/wege/code-anfrage';

import { AUTOSCHLUESSEL_FRAGE_PFAD, SHOP_SEO, kategorieWeg } from './kategorie-weg';

/* Shop-Einstieg nach Kategorien (FA-SHOP-01B, Punkt 1 und 4), mit dem Startbestand der Kategorien. */

const KATEGORIEN = defaults.kategorien();
const kategorie = (id: string) => KATEGORIEN.find((k) => k.id === id)!;

describe('Weg einer Shop-Kategorie', () => {
  it('zeigt die Hauptkategorien des Inhabers in seiner Reihenfolge, verborgene nicht', () => {
    const namen = sichtbareKategorien(KATEGORIEN).filter((k) => !k.eltern).map((k) => k.name);
    expect(namen).toEqual([
      'Schlüssel nach Code',
      'Schlüssel nach Vorlage',
      'Autoschlüssel als Produkte',
      'Autoschlüsselgehäuse',
      'Gehäuseumbau und Reparaturservice',
      'Customizing und Modifikation',
      'Gleichschließende Zylinder und Sperrschließungen',
      'Schließtechnik und Zubehör',
    ]);
  });

  it('ohne Produkte: ehrlicher Hinweis und die passende Anfrage', () => {
    expect(kategorieWeg(kategorie('schluessel-nach-code'), 0)).toEqual({
      href: '/service-und-termin/anfrage?thema=schluessel-nach-code',
      label: 'Code anfragen',
      hinweis: HINWEIS_PRODUKTE_FOLGEN,
    });
    expect(kategorieWeg(kategorie('schliesstechnik-und-zubehoer'), 0)).toMatchObject({
      href: '/service-und-termin/anfrage?artikel=Schlie%C3%9Ftechnik%20und%20Zubeh%C3%B6r',
      label: 'Artikel anfragen',
    });
  });

  it('mit Produkten: die Produktliste, ohne Hinweis', () => {
    expect(kategorieWeg(kategorie('schluessel-nach-code'), 3)).toEqual({ href: '/schluessel-nach-code', label: 'Zu den Codeprodukten' });
    expect(kategorieWeg(kategorie('schliesstechnik-und-zubehoer'), 2)).toEqual({ href: '/artikel', label: 'Zu den Artikeln' });
    expect(kategorieWeg(kategorie('gleichschliessende-zylinder'), 0)).toEqual({
      href: '/gleichschliessende-zylinder/konfigurator',
      label: 'Zum Konfigurator',
    });
  });

  it('Autoschlüssel als Produkte, Gehäuseumbau und Customizing führen in einen Weg, der zum Anliegen passt', () => {
    const auto = kategorieWeg(kategorie('autoschluessel-produkte'), 0);
    expect(auto.href).toBe(`${AUTOSCHLUESSEL_FRAGE_PFAD}&artikel=Autoschl%C3%BCssel%20als%20Produkte`);
    expect(auto.hinweis).toBe(HINWEIS_PRODUKTE_FOLGEN);
    expect(kategorieWeg(kategorie('customizing-und-modifikation'), 0).href).toBe(
      `${AUTOSCHLUESSEL_FRAGE_PFAD}&artikel=Customizing%20und%20Modifikation`,
    );
    expect(kategorieWeg(kategorie('gehaeuseumbau-und-reparaturservice'), 0)).toMatchObject({
      href: '/autoschluessel/gehaeuse/anfrage',
      label: 'Anfragen',
    });
    // Die Anfrage übernimmt den Namen bereinigt, so wie er in der Adresse steht.
    const name = new URL(auto.href, 'https://x.test').searchParams.get('artikel');
    expect(vorbelegungAusAdresse(name, 80)).toBe('Autoschlüssel als Produkte');
  });

  it('Titel und Beschreibung der Übersicht in den Längen', () => {
    expect(titelPasst(SHOP_SEO.title)).toBe(true);
    expect(SHOP_SEO.description.length).toBeGreaterThanOrEqual(BESCHREIBUNG_MIN);
    expect(SHOP_SEO.description.length).toBeLessThanOrEqual(BESCHREIBUNG_MAX);
    expect(SHOP_SEO.description).not.toMatch(/[—–]/);
  });
});
