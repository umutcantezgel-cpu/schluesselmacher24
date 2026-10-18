import type { KeyKind } from '@/lib/types';
import { cn } from '@/lib/cn';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { motionStyle } from '@/components/visual/motion/motion-style';
import { InView } from '@/components/visual/motion/in-view';
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
 * `kopf`: für den Seitenkopf. Mobil eine Leiste mit Anschnitt (der Kopfknopf bleibt im ersten
 * Bildschirm), ab `md` ein 2×2-Raster mit Haarlinien auf Papier; je Zelle Kennung, Zeichnung und
 * Name. Der Name ist ein Absatz, keine Überschrift, damit die Gliederung der Seite bei h1 und h2 bleibt.
 */
export type SchluesselartenVariante = 'blatt' | 'kopf';

/**
 * Großer Moment der Autoschlüssel-Seite (Register B-21): vier Ansichten. Nur die
 * Zeichnungen treten gestaffelt auf (≤ 4 × 120 ms); Kennung und Name stehen sofort.
 * Die Profile zeichnen sich im Generator selbst. Ohne Bewegung steht alles sofort.
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
        // Mobil scrollt die Leiste seitlich: dann per Tastatur erreichbar und benannt (WCAG 2.1.1)
        tabIndex={kopf ? 0 : undefined}
        aria-label={kopf ? 'Schlüsselarten' : undefined}
        className={cn(
          kopf
            ? '-mx-5 flex snap-x snap-mandatory overflow-x-auto border-y border-border px-5 scroll-px-5 contain-inline-size sm:-mx-6 sm:px-6 sm:scroll-px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:border-b-0 md:px-0 md:scroll-px-0'
            : 'grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4',
        )}
      >
        {SCHLUESSELARTEN_REIHE.map(({ art, typ }, index) => {
          const klasse = cn(
            'flex flex-col',
            kopf
              ? `shrink-0 basis-3/4 snap-start border-r border-border p-4 first:pl-0 md:basis-auto md:border-b md:py-5 ${index % 2 === 0 ? 'md:pl-0 md:pr-5' : 'md:border-r-0 md:pl-5 md:pr-0'}`
              : 'bg-surface p-4 sm:p-5',
          );
          const inhalt = (
            <>
              <p className="font-mono text-caption tabular-nums text-foreground-subtle">
                {String(index + 1).padStart(2, '0')}
              </p>
              <div className="sm24-reveal" style={motionStyle(index * 0.12)}>
                <SchluesselGrafik params={{ typ, code: art }} title={`Zeichnung: ${keyKindLabel(art)}`} className="mt-2 w-full" />
              </div>
              {kopf ? (
                <p className="mt-3 text-body font-semibold text-foreground">{keyKindLabel(art)}</p>
              ) : (
                <h3 className="mt-3 text-title-sm font-semibold text-foreground">{keyKindLabel(art)}</h3>
              )}
              {!kopf && <p className="mt-1 text-small text-foreground-muted">{keyKindDescription(art)}</p>}
              {!kopf && art === 'smart-key' && (
                <p className="mt-2 text-small text-foreground-muted">
                  <span className="font-semibold text-foreground">{keyKindLabel('keyless')}:</span>{' '}
                  {keyKindDescription('keyless')}
                </p>
              )}
            </>
          );
          // Kopf: jede Karte wartet auf ihr Sichtbarwerden (mobil rechts außerhalb der Leiste, E7 Bildrate).
          return kopf ? (
            <InView key={art} as="li" threshold={0.25} className={klasse}>
              {inhalt}
            </InView>
          ) : (
            <li key={art} className={klasse}>
              {inhalt}
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-3 font-mono text-caption text-foreground-subtle">
        Schematische Darstellung, nicht maßstäblich.
      </figcaption>
    </figure>
  );
}
