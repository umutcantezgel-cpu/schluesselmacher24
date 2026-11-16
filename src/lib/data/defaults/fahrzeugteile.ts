import type { GehaeuseBauform, UmbauBeispiel } from '@/lib/types';

/**
 * Startbestand der Bauformen (FA-SHOP-02): die Bauformen, die der Inhaber in
 * seiner Arbeitsanweisung vom 11.11.2026 (Abschnitt 14) nennt („Klappschlüssel-
 * gehäuse, Smart Key Gehäuse, Karten Gehäuse und weitere Bauformen“), dazu
 * Fernbedienung und Schlüsselkopf aus dem Paketauftrag. Ohne Erklärungstexte,
 * damit nichts behauptet wird, was nicht belegt ist (R4). Weitere Bauformen
 * legt der Betrieb im Backend an (Shop › Bauformen).
 *
 * Ohne Datenbank gilt dieser Bestand; eine Datei unter `content/` gibt es nicht.
 */
export function bauformen(): GehaeuseBauform[] {
  return [
    { id: 'klappschluessel', slug: 'klappschluessel', name: 'Klappschlüssel', reihenfolge: 10 },
    { id: 'smart-key', slug: 'smart-key', name: 'Smart Key', reihenfolge: 20 },
    { id: 'karte', slug: 'karte', name: 'Karte', reihenfolge: 30 },
    { id: 'fernbedienung', slug: 'fernbedienung', name: 'Fernbedienung', reihenfolge: 40 },
    { id: 'schluesselkopf', slug: 'schluesselkopf', name: 'Schlüsselkopf', reihenfolge: 50 },
  ];
}

/**
 * Umbau-Beispiele: Startbestand leer. Es gibt keine echten Vorher-Nachher-Fotos;
 * erfundene oder erzeugte Bilder sind ausgeschlossen (R4). Ohne Beispiele
 * erscheint der Baustein `VorherNachher` nicht.
 */
export function umbauBeispiele(): UmbauBeispiel[] {
  return [];
}
