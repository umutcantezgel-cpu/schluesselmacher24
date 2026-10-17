import { cn } from '@/lib/cn';

import {
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  MITTELLINIE,
  Raster,
  SCHRIFT,
  kurztext,
  pfeilspitze,
  r,
} from './generators/grafik-basis';
import { DRAW_DASHARRAY, motionStyle } from './motion/motion-style';

/**
 * Einsatzradius im Standortkopf (KERN K-008, Register B-26): eine bemaßte Zeichnung
 * ohne Kartenrahmen. Kreis um den Ort, Mittelpunktmarke und Maßlinie mit „r … km“.
 * Keine Karte und keine Adresse, nur die Angaben aus den Standortdaten.
 *
 * Eigenständige Zeichnung, kein Generator und nicht in der Registry. Ohne Bewegungsvariante
 * ohne Client-JavaScript: Die Klassen wirken nur unter „Bewegung erlaubt“, sonst steht
 * alles sofort vollständig da. Dekorativ über den Titel, `role="img"` mit `<title>`.
 */
export interface EinsatzradiusZeichnungProps {
  /** Ortsname, etwa „Berlin“. Wird auf 20 Zeichen gekürzt. */
  ort: string;
  /** Einsatzradius in Kilometern. Ohne gültigen Wert keine Maßlinie und kein „r … km“. */
  radiusKm: number;
  className?: string;
}

/* Bewegung (B-26): Kreis, Maßlinie, Pfeilspitze und Beschriftung nach dem Register;
   die Dauern entsprechen `--dauer-enter` und `--dauer-base` in globals.css. */
const KREIS_DAUER = 0.6; // --dauer-enter
const MASS_DAUER = 0.28; // --dauer-base

/* Geometrie in viewBox-Einheiten (360 × 270): Mittelpunkt, Radius und Winkel der Maßlinie. */
const MITTE = { x: 180, y: 135 };
const RADIUS = 105;
const WINKEL = 40;

export function EinsatzradiusZeichnung({ ort, radiusKm, className }: EinsatzradiusZeichnungProps) {
  const ortName = kurztext(ort, 20);
  const mitRadius = Number.isFinite(radiusKm) && radiusKm > 0;
  const km = String(radiusKm).replace('.', ',');

  const titel = mitRadius
    ? `Einsatzradius von etwa ${km}\u00a0km${ortName ? ` um ${ortName}` : ''}`
    : `Einsatzgebiet${ortName ? ` ${ortName}` : ''}`;

  const rad = (Math.PI * WINKEL) / 180;
  const spitzeX = r(MITTE.x + RADIUS * Math.cos(rad));
  const spitzeY = r(MITTE.y - RADIUS * Math.sin(rad));

  return (
    <GrafikRahmen breite={360} hoehe={270} title={titel} className={cn('w-full max-w-lg lg:max-w-none', className)}>
      <Raster breite={360} hoehe={270} />
      <path d="M60 135H300" className="stroke-border-strong" strokeWidth={HILFSLINIE} strokeDasharray={MITTELLINIE} />
      <path
        d="M75 135A105 105 0 1 1 285 135A105 105 0 1 1 75 135"
        className="sm24-draw stroke-area"
        pathLength={1}
        strokeWidth={KONTUR}
        style={motionStyle(0.1, KREIS_DAUER, { strokeDasharray: DRAW_DASHARRAY })}
      />

      {mitRadius && (
        <>
          <path
            d={`M${MITTE.x} ${MITTE.y}L${spitzeX} ${spitzeY}`}
            className="sm24-draw stroke-area-strong"
            pathLength={1}
            strokeWidth={LINIE}
            style={motionStyle(0.7, MASS_DAUER, { strokeDasharray: DRAW_DASHARRAY })}
          />
          <path d={pfeilspitze(spitzeX, spitzeY, -WINKEL)} className="sm24-pop fill-area-strong" style={motionStyle(0.95)} />
        </>
      )}

      <circle cx={MITTE.x} cy={MITTE.y} r={4} className="sm24-pop fill-area-strong" style={motionStyle(0)} />

      {ortName && (
        <text
          x={180}
          y={160}
          textAnchor="middle"
          className="sm24-fade fill-foreground-muted font-mono"
          fontSize={SCHRIFT}
          style={motionStyle(0.2)}
        >
          {ortName}
        </text>
      )}

      {mitRadius && (
        <text
          x={268}
          y={60}
          textAnchor="start"
          className="sm24-pop fill-foreground-muted font-mono"
          fontSize={SCHRIFT}
          fontWeight={600}
          style={motionStyle(0.95)}
        >
          {`r ${km}\u00a0km`}
        </text>
      )}
    </GrafikRahmen>
  );
}
