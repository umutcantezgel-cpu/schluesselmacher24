import type { ShopHersteller } from '@/lib/types';

/**
 * Startbestand der Hersteller-Stammliste (FA-INHALT-02): BKS, ABUS und
 * BURG-WÄCHTER, die der Inhaber in seiner Arbeitsanweisung vom 11.11.2026
 * (Abschnitte 15, 17, 19) selbst als angebotene Hersteller nennt. Schreibweise
 * und Einsatzzweck nur aus Herstellerquellen (Recherche FA-RECHERCHE-06, R4).
 *
 * Ohne Logo: Logos kommen nie aus dem Inhalt, sondern nur aus dem Backend mit
 * Datei und Haken „Freigabe liegt vor“ (R12). Bereiche mit Einsatztext je
 * Bereich (FA-SHOP-04) sind Startwerte; danach pflegt der Betrieb sie im Admin
 * (Shop › Hersteller › Bereiche).
 *
 * Ohne Datenbank gilt `content/hersteller.json` (muss hiermit übereinstimmen).
 */
export function hersteller(): ShopHersteller[] {
  return [
    {
      id: 'bks',
      slug: 'bks',
      name: 'BKS',
      einsatz: 'Schließzylinder für Gleichschließungen und Schließanlagen sowie elektronische Schließsysteme.',
      angeboten: true,
      reihenfolge: 10,
      bereiche: [
        { art: 'sperrschliessung', einsatz: 'BKS stellt Schließzylinder für Gleichschließungen und Schließanlagen her.' },
        { art: 'zutritt', einsatz: 'BKS stellt elektronische Schließsysteme mit Zylindern, Beschlägen, Wandlesern und Transpondern her.' },
      ],
    },
    {
      id: 'abus',
      slug: 'abus',
      name: 'ABUS',
      einsatz: 'Schließzylinder für Gleichschließungen und Schließanlagen sowie Zutrittssysteme mit Wandlesern.',
      angeboten: true,
      reihenfolge: 20,
      bereiche: [
        { art: 'sperrschliessung', einsatz: 'ABUS bietet Schließzylinder als Gleichschließung und als Schließanlage mit Schließplan an.' },
        {
          art: 'zutritt',
          einsatz:
            'ABUS stellt Zutrittssysteme mit Wandlesern und batteriebetriebenen Zylindern her, '
            + 'gedacht für kleine bis mittlere Objekte und Einfamilienhäuser.',
        },
      ],
    },
    {
      id: 'burg-waechter',
      slug: 'burg-waechter',
      name: 'BURG-WÄCHTER',
      einsatz: 'Elektronische Zylinder für Unternehmen, Behörden und Privatnutzer.',
      angeboten: true,
      reihenfolge: 30,
      bereiche: [
        { art: 'zutritt', einsatz: 'BURG-WÄCHTER stellt elektronische Zylinder für Unternehmen, Behörden und Privatnutzer her.' },
      ],
    },
  ];
}
