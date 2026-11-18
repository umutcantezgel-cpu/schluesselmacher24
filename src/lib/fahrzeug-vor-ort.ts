import type { CarKeyService, VehicleModel } from '@/lib/types';

/* ==========================================================================
   Muss das Fahrzeug zum Termin? (aus src/lib/pricing.ts verschoben, FA-SEO-03D)
   Der Autoschlüssel-Assistent braucht im Browser nur diese Regel. Liegt sie hier,
   lädt er die Zylinder- und Konfiguratorregeln aus pricing.ts nicht mit (Regel A-071).
   pricing.ts gibt beide Namen unverändert weiter; Preise und Ergebnisse sind gleich.
   ========================================================================== */

/**
 * Leistungen, bei denen am Fahrzeug angelernt wird (Transponder, Funk, Wegfahrsperre). Nur für sie
 * gilt der Schalter am Modell „Programmierung nur am Fahrzeug“ (`requiresVehicleOnSite`).
 */
export const LEISTUNGEN_MIT_ANLERNEN: ReadonlySet<string> = new Set([
  'zweitschluessel',
  'ersatz-bei-verlust',
  'programmierung',
]);

/**
 * Muss das Fahrzeug zum Termin? Maßgeblich ist die Leistung („Fahrzeug muss vor Ort sein“):
 * Ohne diesen Haken nie — etwa beim Bart fräsen oder bei Gehäuse und Batterie. Mit Haken ja;
 * bei Leistungen mit Anlernen entscheidet zusätzlich das Modell, ob dort ohne Fahrzeug angelernt
 * werden kann. Für die Fahrzeugöffnung und andere Leistungen spielt der Modell-Schalter keine Rolle.
 */
export function fahrzeugVorOrtNoetig(
  service: Pick<CarKeyService, 'id' | 'requiresVehicleOnSite'>,
  model?: Pick<VehicleModel, 'requiresVehicleOnSite'> | null,
): boolean {
  if (!service.requiresVehicleOnSite) return false;
  if (!model || !LEISTUNGEN_MIT_ANLERNEN.has(service.id)) return true;
  return model.requiresVehicleOnSite;
}
