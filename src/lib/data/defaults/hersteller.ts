import type { ShopHersteller } from '@/lib/types';

/**
 * Startbestand der Hersteller-Stammliste (FA-INHALT-02): BKS, ABUS und
 * BURG-WÄCHTER, die der Inhaber in seiner Arbeitsanweisung vom 11.11.2026
 * (Abschnitte 15, 17, 19) selbst als angebotene Hersteller nennt. Schreibweise
 * und Einsatzzweck nur aus Herstellerquellen (Recherche FA-RECHERCHE-06, R4).
 *
 * Ohne Logo: Logos kommen nie aus dem Inhalt, sondern nur aus dem Backend mit
 * Datei und Haken „Freigabe liegt vor“ (R12). Welche Bereiche ein Hersteller
 * abdeckt, steht in `src/components/hersteller/bereiche.ts`, weil die Sammlung
 * dafür noch kein Feld hat.
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
    },
    {
      id: 'abus',
      slug: 'abus',
      name: 'ABUS',
      einsatz: 'Schließzylinder für Gleichschließungen und Schließanlagen sowie Zutrittssysteme mit Wandlesern.',
      angeboten: true,
      reihenfolge: 20,
    },
    {
      id: 'burg-waechter',
      slug: 'burg-waechter',
      name: 'BURG-WÄCHTER',
      einsatz: 'Elektronische Zylinder für Unternehmen, Behörden und Privatnutzer.',
      angeboten: true,
      reihenfolge: 30,
    },
  ];
}
