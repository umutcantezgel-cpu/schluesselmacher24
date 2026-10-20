import type { ReactNode } from 'react';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { Seitenwechsel, bereichsName } from '@/components/visual/motion/seitenwechsel';
import { Profillinie } from '@/components/visual/profillinie';
import { InView } from '@/components/visual/motion/in-view';
import type { AreaKey } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Breadcrumbs, type Crumb } from './breadcrumbs';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Zusatzklassen der Einleitung, etwa `korb-leer:hidden` im Leerzustand von Warenkorb und Kasse. */
  leadClassName?: string;
  crumbs?: Crumb[];
  /** Aktionen, z. B. Schaltflächen. */
  actions?: ReactNode;
  /** Zusatzinhalt unter dem Text, z. B. Kennzahlen. */
  children?: ReactNode;
  /** Leistungsbereich: zeigt sein Fach-Icon groß als Anker des Kopfes (Bereichsfarbe aus `data-area`). */
  bereich?: AreaKey;
  /**
   * Ansichtsart (KERN K-009): `erzaehl` (Standard) mit großer Überschrift und
   * sich zeichnender Profillinie; `arbeit` ruhig und kompakt für Abläufe,
   * Warenkorb, Kasse und Rechtstexte.
   */
  art?: 'erzaehl' | 'arbeit';
  /**
   * Fachgrafik des Kopfes: 7/5 neben dem Text, über Text und Aktionen. Das Fach-Icon des
   * Bereichs steht dann klein neben der Augenbraue (bleibt Ziel des Seitenwechsels B-13).
   */
  visual?: ReactNode;
}

/** Einheitlicher Seitenkopf für alle Bereiche – als Kopf einer Werkstattzeichnung. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  leadClassName,
  crumbs,
  actions,
  children,
  bereich,
  art = 'erzaehl',
  visual,
}: PageHeaderProps) {
  const erzaehl = art === 'erzaehl';
  const mitGrafik = Boolean(visual);
  // Das Fach-Icon ist Ziel des Seitenwechsels aus dem Schnelleinstieg der Startseite (B-13):
  // groß rechts, oder – wenn der Kopf eine Fachgrafik trägt – klein neben der Augenbraue.
  const icon =
    bereich && erzaehl ? (
      <Seitenwechsel name={bereichsName(bereich)}>
        <BereichIcon area={bereich} size={mitGrafik ? 40 : 112} className="text-area-strong" />
      </Seitenwechsel>
    ) : null;
  const anker = mitGrafik ? null : icon;

  const kopf = (
    <>
      {mitGrafik && icon ? (
        <div className="flex items-center gap-3">
          {icon}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        </div>
      ) : (
        eyebrow && <p className="eyebrow">{eyebrow}</p>
      )}
      {erzaehl && <Profillinie text={title} className="mt-3 text-area" />}

      <h1
        className={cn(
          'text-balance font-bold text-foreground',
          erzaehl ? 'mt-4 text-display' : 'mt-3 text-headline',
          !eyebrow && !icon && 'mt-0',
        )}
      >
        {title}
      </h1>
      {lead && (
        <p className={cn('mt-4 max-w-measure text-foreground-muted', erzaehl ? 'text-lead' : 'text-body', leadClassName)}>
          {lead}
        </p>
      )}
    </>
  );

  return (
    <header className="border-b border-border bg-surface">
      <div className={cn('shell', erzaehl ? 'py-section-tight' : 'py-8 md:py-10')}>
        {crumbs && crumbs.length > 0 && <Breadcrumbs crumbs={crumbs} className="mb-6" />}

        {mitGrafik ? (
          /* Kopf mit Fachgrafik (Muster Startseite): 7/5, die Grafik rechts über beide Zeilen.
             Mobil: Kopf → Grafik → Aktionen und Schriftfeld (Bild vor Handlung, Handlung vor Erklärung). */
          <div className="grid gap-8 lg:grid-cols-12 lg:grid-rows-kopf lg:gap-x-gutter lg:gap-y-0">
            <div className="lg:col-span-7 lg:self-end">{kopf}</div>
            {/* Die Zeichnung startet nach dem Hydrieren, sobald sie im Bild ist – wie der Hero der
                Startseite (B-27); vorher läuft im Ladefenster keine Malarbeit (E7-L-38). */}
            <InView className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center">{visual}</InView>
            {(actions || children) && (
              <div className="lg:col-span-7 lg:self-start lg:pt-7">
                {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
                {children && <div className={cn(actions && 'mt-8')}>{children}</div>}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className={cn('grid gap-8', anker && 'lg:grid-cols-12 lg:items-center lg:gap-gutter')}>
              <div className={cn(anker && 'lg:col-span-8')}>
                {kopf}
                {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
              </div>

              {anker && <div className="hidden justify-self-end lg:col-span-4 lg:block">{anker}</div>}
            </div>

            {children && <div className="mt-8">{children}</div>}
          </>
        )}
      </div>
    </header>
  );
}
