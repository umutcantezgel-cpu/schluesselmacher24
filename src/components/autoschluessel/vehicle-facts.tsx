import type { VehicleModel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

/* ==========================================================================
   Darstellung der Fahrzeugangaben aus dem Datensatz.
   Hier wird nichts ergänzt, was nicht in den Daten steht — fehlende Angaben
   werden ausdrücklich als offen gekennzeichnet.
   ========================================================================== */

/** Sind Baujahre erfasst? Fehlt `yearFrom`, gilt die Angabe als offen. */
export function hatBaujahre(model: Pick<VehicleModel, 'yearFrom' | 'yearTo'>): boolean {
  return Boolean(model.yearFrom);
}

/** Baujahresangabe aus `yearFrom` und `yearTo`; ohne Angabe steht „nicht erfasst“. */
export function formatModelYears(model: Pick<VehicleModel, 'yearFrom' | 'yearTo'>): string {
  if (!hatBaujahre(model)) return 'nicht erfasst';
  return model.yearTo ? `${model.yearFrom}–${model.yearTo}` : `ab ${model.yearFrom}`;
}

/** Kennzeichnung, ob das Fahrzeug zum Anlernen vor Ort sein muss. */
export function OnSiteBadge({ required }: { required: boolean }) {
  return required ? (
    <Badge tone="primary">Fahrzeug vor Ort nötig</Badge>
  ) : (
    <Badge tone="neutral">Ohne Fahrzeug möglich</Badge>
  );
}

/** Kurzform für Tabellenzellen. */
export function onSiteLabel(required: boolean): string {
  return required ? 'Ja' : 'Nein';
}
