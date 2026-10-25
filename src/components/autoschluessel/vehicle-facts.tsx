import type { VehicleModel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { InfoTip } from '@/components/ui/info-tip';
import { ON_SITE_HINT } from './key-kinds';

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

/** Kennzeichnung, ob das Fahrzeug zum Anlernen mitkommen muss; die Erklärung sitzt im Chip. */
export function OnSiteBadge({ required }: { required: boolean }) {
  return required ? (
    <Badge tone="primary">
      Fahrzeug zum Anlernen nötig
      <InfoTip hint={ON_SITE_HINT} className="-my-1 -mr-1" />
    </Badge>
  ) : (
    <Badge tone="neutral">Ohne Fahrzeug möglich</Badge>
  );
}

/** Baujahre als Mono-Feld in der Chipzeile des Kopfes. */
export function BaujahrFeld({ years }: { years: string }) {
  return (
    <span className="font-mono text-caption uppercase tracking-label text-foreground-muted">
      Baujahre · <span className="normal-case tabular-nums text-foreground">{years}</span>
    </span>
  );
}

/** Kurzform für Tabellenzellen. */
export function onSiteLabel(required: boolean): string {
  return required ? 'Ja' : 'Nein';
}
