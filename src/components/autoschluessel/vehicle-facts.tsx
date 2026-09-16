import type { VehicleModel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

/* ==========================================================================
   Darstellung der Fahrzeugangaben aus dem Datensatz.
   Hier wird nichts ergänzt, was nicht in den Daten steht — fehlende Angaben
   werden ausdrücklich als offen gekennzeichnet.
   ========================================================================== */

/** Baujahresangabe aus `yearFrom` und `yearTo`. */
export function formatModelYears(model: Pick<VehicleModel, 'yearFrom' | 'yearTo'>): string {
  if (!model.yearFrom) return '[Platzhalter: Baujahre noch nicht erfasst]';
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
