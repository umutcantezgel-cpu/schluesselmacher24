import { EingangBuehne } from './eingang-buehne';
import { EingangSzene } from './eingang-szene';

/**
 * Eingangsinszenierung für die Bühne des Intent-Hubs (K-013, B-31, B-32): unter 1024 px ein Band
 * von 56 px Höhe über der Frage, ab 1024 px die große Bühne rechts neben dem Raster, als Zeichenblatt
 * über die ganze Höhe der Spalte mit dem Pause-Knopf in der Ecke (A-025). Beide Fassungen stehen im
 * Dokument; die verborgene läuft nicht (`display: none` hält Animationen an).
 */
export function Eingangsinszenierung() {
  return (
    <EingangBuehne className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden lg:rounded-lg lg:border lg:border-border lg:bg-surface">
      <div data-motion="B-31" className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <EingangSzene variante="band" className="block h-14 w-auto max-w-full lg:hidden" />
        <p className="hidden px-5 pt-5 font-mono text-caption uppercase tracking-label text-foreground-muted lg:block">
          Schlüssel · Zylinder · Schließplan
        </p>
        <EingangSzene variante="buehne" className="hidden lg:block lg:min-h-0 lg:w-full lg:flex-1" />
      </div>
    </EingangBuehne>
  );
}
