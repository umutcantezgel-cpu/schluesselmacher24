import type { ReactNode } from 'react';
import Link from 'next/link';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { StiftzuhaltungGrafik } from '@/components/visual/generators/stiftzuhaltung';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { Profillinie } from '@/components/visual/profillinie';
import { NAV_AREAS } from '@/lib/navigation';

export interface FehlerAnsichtProps {
  /** Augenbraue, z. B. „Fehler 404“. */
  eyebrow: string;
  title: string;
  lead: string;
  /** Zustand des Zylinderschnitts: falscher Schlüssel (404) oder abgebrochener Schlüssel (Fehler). */
  zustand: 'passt-nicht' | 'abgebrochen';
  /** Bis zu 4 Ziffern auf der Schlüsselreide. */
  code: string;
  /** Bildunterschrift im Stil einer Zeichnung, z. B. „Schnitt A–A · Schlüssel passt nicht“. */
  bildunterschrift: string;
  aktionen: ReactNode;
  /** Zusatz unter dem Text, z. B. eine Fehlerkennung. */
  children?: ReactNode;
}

/**
 * Gemeinsame Ansicht für „Seite nicht gefunden“ und technische Fehler:
 * links Text und Auswege, rechts der Zylinderschnitt, darunter alle Bereiche.
 * Ohne Hooks, daher auch in der Client-Fehlergrenze nutzbar.
 */
export function FehlerAnsicht({
  eyebrow,
  title,
  lead,
  zustand,
  code,
  bildunterschrift,
  aktionen,
  children,
}: FehlerAnsichtProps) {
  return (
    <div className="shell py-section-tight">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-gutter">
        <div className="lg:col-span-6">
          <p className="eyebrow">{eyebrow}</p>
          <Profillinie text={title} className="mt-3 text-primary" />
          <h1 className="mt-4 text-display font-bold text-foreground">{title}</h1>
          <p className="mt-4 max-w-measure text-lead text-foreground-muted">{lead}</p>
          {children}
          <div className="mt-7 flex flex-wrap items-center gap-3">{aktionen}</div>
        </div>

        <figure className="lg:col-span-6">
          <StiftzuhaltungGrafik
            params={{ zustand, code }}
            title={bildunterschrift}
            className="w-full rounded-lg border border-border bg-surface"
          />
          <figcaption className="mt-3 font-mono text-caption uppercase tracking-label text-foreground-subtle">
            {bildunterschrift}
          </figcaption>
        </figure>
      </div>

      <section aria-labelledby="fehler-bereiche" className="mt-16">
        <h2 id="fehler-bereiche" className="eyebrow">
          Alle Bereiche
        </h2>
        <ul className="mt-4 grid border-t border-border sm:grid-cols-2 sm:gap-x-gutter lg:grid-cols-3">
          {NAV_AREAS.map((area) => (
            <li key={area.key} className="border-b border-border">
              <AreaScope area={area.key}>
                <Link
                  href={area.href}
                  className="group flex min-h-touch items-start gap-3 py-4 transition-colors duration-quick"
                >
                  <BereichIcon area={area.key} size={32} className="shrink-0 text-area-strong" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-semibold text-foreground zeiger:group-hover:text-area-strong">
                      {area.label}
                    </span>
                    <span className="mt-1 block text-small text-foreground-muted">{area.summary}</span>
                  </span>
                  <GlyphPfeilRechts
                    size={18}
                    className="mt-1 shrink-0 text-foreground-subtle transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 zeiger:group-hover:text-area-strong"
                  />
                </Link>
              </AreaScope>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
