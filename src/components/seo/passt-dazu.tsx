import Link from 'next/link';

import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import { passtDazu, verweisQuellen, type Verweis } from './verweise';

/**
 * Verweisliste „Passt dazu“ (FA-SEO-01C): eigene gepflegte Links der Seite und die Gegenrichtung aus
 * denselben Daten (siehe ./verweise.ts). Für Seiten, die noch keinen Linkblock haben. Ohne Einträge
 * erscheint nichts. Überschrift h2, damit keine Ebene übersprungen wird.
 */
export async function PasstDazu({
  pfad,
  eigene = [],
  ausser = [],
  tone,
}: {
  /** Pfad der Seite, etwa "/autoschluessel". */
  pfad: string;
  /** Die gepflegten Links der Seite (`seo.internalLinks`). */
  eigene?: Verweis[];
  /** Ziele, die die Seite an anderer Stelle schon zeigt. */
  ausser?: string[];
  tone?: 'muted';
}) {
  const links = passtDazu(pfad, eigene, await verweisQuellen(), { ausser });
  if (links.length === 0) return null;
  return (
    <Section tight tone={tone}>
      <nav aria-labelledby="passt-dazu-titel">
        <SectionHeading id="passt-dazu-titel" eyebrow="Weiterlesen" title="Passt dazu" />
        <ul className="mt-6 flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-touch items-center gap-2 rounded-lg border border-border bg-surface px-4 text-small font-semibold text-foreground transition-colors duration-quick ease-standard hover:border-primary hover:text-primary"
              >
                {link.label}
                <GlyphPfeilRechts size={16} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}
