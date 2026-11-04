import { EingangBuehne } from './eingang-buehne';
import { EingangSzene } from './eingang-szene';

/**
 * Eingangsinszenierung für die Bühne des Intent-Hubs (K-013, B-31, B-32): unter 1280 px ein Band
 * von 56 px Höhe über der Frage, ab 1280 px die große Bühne rechts neben dem Raster, als Zeichenblatt
 * über die ganze Höhe der Spalte mit dem Pause-Knopf in der Ecke (A-025). Beide Fassungen stehen im
 * Dokument; die verborgene läuft nicht (`display: none` hält Animationen an).
 */
export function Eingangsinszenierung() {
  return (
    <EingangBuehne className="xl:flex xl:min-h-0 xl:flex-1 xl:flex-col xl:overflow-hidden xl:rounded-lg xl:border xl:border-border xl:bg-surface">
      <div data-motion="B-31" className="xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
        <EingangSzene variante="band" className="block h-14 w-auto max-w-full xl:hidden" />
        <p className="hidden pl-5 pr-16 pt-5 font-mono text-caption uppercase tracking-label text-foreground-muted xl:block">
          Schlüssel · Zylinder · Schließplan
        </p>
        <EingangSzene variante="buehne" className="hidden xl:block xl:min-h-0 xl:w-full xl:flex-1" />
      </div>
    </EingangBuehne>
  );
}
