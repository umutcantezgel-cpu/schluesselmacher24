import type { CarKeyService, KeyKind } from '@/lib/types';

/* ==========================================================================
   Vorgewählte Leistung im Autoschlüssel-Assistenten (FA-05-07, FA-05-09)
   Leistungsseiten führen mit `?leistung=<Kennung>` in den Assistenten, etwa
   „Fahrzeugöffnung“ oder „Ersatzschlüssel bei Verlust“. Ohne Browser-Logik,
   damit sich die Regeln einzeln testen lassen. Die Vorwahl ist nur ein Wunsch:
   Der Kunde sieht sie im Schritt „Leistung“ markiert und kann sie ändern. Preis,
   Ort und Pflichtunterlagen prüft der Server wie bei jeder anderen Leistung.
   ========================================================================== */

/** Kennung der Leistung aus der Adresse, nur wenn sie eine aktive gepflegte Leistung ist; sonst leer. */
export function leistungAusAdresse(wert: string, services: readonly CarKeyService[]): string {
  const kennung = wert.trim();
  if (!kennung) return '';
  return services.some((s) => s.active && s.id === kennung) ? kennung : '';
}

/**
 * Passt die Leistung zu Schlüsselart und Zahl der funktionierenden Schlüssel? Dieselbe Regel, nach der der
 * Schritt „Leistung“ seine Auswahl zeigt.
 */
export function leistungPasst(service: CarKeyService, keyKind: KeyKind | '', workingKeys: number | null): boolean {
  if (!keyKind || !service.active || !service.keyKinds.includes(keyKind)) return false;
  // Ein Zweitschlüssel braucht einen funktionierenden Schlüssel als Vorlage (E4-PROBENUTZER-01).
  return !(service.id === 'zweitschluessel' && workingKeys === 0);
}

/**
 * Leistung nach der Wahl der Schlüsselart: die gewünschte aus der Adresse, wenn sie zur Art passt; sonst
 * keine (der Kunde wählt im Schritt „Leistung“ selbst). „Ersatzschlüssel bei Verlust“ gilt laut Daten, wenn
 * alle Schlüssel verloren oder beschädigt sind. Funktioniert noch einer, wählen wir sie nicht vor; der Kunde
 * kann sie im Schritt „Leistung“ weiter selbst wählen.
 */
export function vorgewaehlteLeistung(
  wunsch: string,
  services: readonly CarKeyService[],
  keyKind: KeyKind | '',
  workingKeys: number | null,
): string {
  if (!wunsch) return '';
  const service = services.find((s) => s.id === wunsch);
  if (!service || !leistungPasst(service, keyKind, workingKeys)) return '';
  if (service.id === 'ersatz-bei-verlust' && workingKeys !== null && workingKeys > 0) return '';
  return wunsch;
}
