import type { KeyKind } from '@/lib/types';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { motionStyle } from '@/components/visual/motion/motion-style';
import { cn } from '@/lib/cn';
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
 * Großer Moment der Autoschlüssel-Seite (Register B-21): ein Zeichnungsblatt
 * mit vier Ansichten. Die Ansichten treten gestaffelt auf (≤ 4 × 120 ms), die
 * Profile zeichnen sich im Generator selbst. Ohne Bewegung steht alles sofort.
 * Nur Server-Markup; die Bewegung startet über das `InView` des Abschnitts.
 */
export function SchluesselartenReihe({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
        {SCHLUESSELARTEN_REIHE.map(({ art, typ }, index) => (
          <li key={art} className="flex flex-col bg-surface p-4 sm:p-5">
            <div className="sm24-reveal" style={motionStyle(index * 0.12)}>
              <p className="font-mono text-caption uppercase tracking-label text-foreground-subtle">
                <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden> · </span>
                Ansicht
              </p>
              <SchluesselGrafik params={{ typ, code: art }} title={`Zeichnung: ${keyKindLabel(art)}`} className="mt-2 w-full" />
            </div>
            <h3 className="mt-3 text-title-sm font-semibold text-foreground">{keyKindLabel(art)}</h3>
            <p className="mt-1 text-small text-foreground-muted">{keyKindDescription(art)}</p>
            {art === 'smart-key' && (
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
