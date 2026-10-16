import type { KeyKind } from '@/lib/types';
import { cn } from '@/lib/cn';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { motionStyle } from '@/components/visual/motion/motion-style';
import { keyKindDescription, keyKindLabel } from './key-kinds';

/**
 * Bauformen mit eigener Zeichnung, in der Reihenfolge vom einfachen zum
 * elektronischen Schlüssel. „Keyless“ ist keine eigene Bauform, sondern eine
 * Funktion des Smart Key; es steht deshalb als Zusatz beim Smart Key.
 */
export const SCHLUESSELARTEN_REIHE: ReadonlyArray<{
  art: Exclude<KeyKind, 'keyless'>;
  typ: 'transponder' | 'funk' | 'klapp' | 'smart-key';
}> = [
  { art: 'mechanisch', typ: 'transponder' },
  { art: 'funk', typ: 'funk' },
  { art: 'klappschluessel', typ: 'klapp' },
  { art: 'smart-key', typ: 'smart-key' },
];

/**
 * `blatt` (Standard): Zeichnungsblatt mit Kartenrahmen, je Ansicht Name und Erklärung.
 * `kopf`: 2×2-Raster ohne Rahmen für den Seitenkopf; je Zeichnung nur Kennung und Name.
 */
export type SchluesselartenVariante = 'blatt' | 'kopf';

/**
 * Großer Moment der Autoschlüssel-Seite (Register B-21): vier Ansichten. Die
 * Ansichten treten gestaffelt auf (≤ 4 × 120 ms), die Profile zeichnen sich im
 * Generator selbst. Ohne Bewegung steht alles sofort.
 * Nur Server-Markup; die Bewegung startet über das `InView` des Abschnitts.
 */
export function SchluesselartenReihe({
  className,
  variante = 'blatt',
}: {
  className?: string;
  variante?: SchluesselartenVariante;
}) {
  const kopf = variante === 'kopf';

  return (
    <figure className={className}>
      <ol
        className={cn(
          kopf
            ? 'grid grid-cols-2 gap-x-4 gap-y-6 rounded-lg bg-area-soft/40 p-4 sm:gap-x-6 sm:p-6'
            : 'grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4',
        )}
      >
        {SCHLUESSELARTEN_REIHE.map(({ art, typ }, index) => (
          <li key={art} className={cn('flex flex-col', !kopf && 'bg-surface p-4 sm:p-5')}>
            <div className="sm24-reveal" style={motionStyle(index * 0.12)}>
              <p className="font-mono text-caption uppercase tracking-label text-foreground-subtle">
                <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden> · </span>
                Ansicht
              </p>
              <SchluesselGrafik params={{ typ, code: art }} title={`Zeichnung: ${keyKindLabel(art)}`} className="mt-2 w-full" />
            </div>
            <h3 className={cn('mt-3 font-semibold text-foreground', kopf ? 'text-body' : 'text-title-sm')}>
              {keyKindLabel(art)}
            </h3>
            {!kopf && <p className="mt-1 text-small text-foreground-muted">{keyKindDescription(art)}</p>}
            {!kopf && art === 'smart-key' && (
              <p className="mt-2 text-small text-foreground-muted">
                <span className="font-semibold text-foreground">{keyKindLabel('keyless')}:</span>{' '}
                {keyKindDescription('keyless')}
              </p>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 font-mono text-caption text-foreground-subtle">
        Schematische Darstellung, nicht maßstäblich.
      </figcaption>
    </figure>
  );
}
