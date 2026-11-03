import { EingangBuehne } from './eingang-buehne';
import { EingangSzene } from './eingang-szene';

/**
 * Eingangsinszenierung für die Bühne des Intent-Hubs (K-013, B-31, B-32): unter 1024 px ein Band
 * von 56 px Höhe über der Frage, ab 1024 px die große Bühne rechts neben dem Raster. Beide Fassungen
 * stehen im Dokument; die verborgene läuft nicht (`display: none` hält Animationen an).
 */
export function Eingangsinszenierung() {
  return (
    <EingangBuehne>
      <div data-motion="B-31">
        <EingangSzene variante="band" className="block h-14 w-auto max-w-full lg:hidden" />
        <EingangSzene variante="buehne" className="hidden h-auto w-full lg:block" />
      </div>
    </EingangBuehne>
  );
}
