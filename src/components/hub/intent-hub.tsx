import type { ReactNode } from 'react';

import { HubWechselMerker } from '@/components/rubrik/rubrik-ankunft';
import { GlyphTelefon } from '@/components/visual/glyphen/telefon';
import { cn } from '@/lib/cn';
import type { Rubrik } from '@/lib/types';

import { CodeMotiv } from './code-motiv';
import { HubKachel } from './hub-kachel';

/** Die Frage des Hubs (G-01), die einzige rhetorische Frage der Seite (K-010). */
export const HUB_FRAGE = 'Wobei können wir Ihnen helfen?';

/**
 * Spalten ab 768 px: vier, außer die Zahl der Kacheln teilt sich nur durch drei (etwa neun,
 * solange Motorrad, Gehäuse und Beratung noch nicht live sind). So bleibt keine Reihe mit einer
 * einzelnen Kachel stehen. Mobil sind es immer drei (K-013).
 */
export function hubSpalten(anzahl: number): 3 | 4 {
  return anzahl % 4 !== 0 && anzahl % 3 === 0 ? 3 : 4;
}

export interface IntentHubProps {
  /** Rubriken mit `imHub` und Status `live`, sortiert (getHubRubriken). */
  rubriken: Rubrik[];
  /** Ein Satz unter der Frage: wer, was, wo. */
  satz?: string | null;
  /** Telefonnummer wie gepflegt und ihr `tel:`-Link; ohne Link erscheint die Nummer als Text. */
  telefon?: { anzeige: string; href: string | null } | null;
  /** Bühne der Eingangsinszenierung (B-31): mobil ein schmales Band über der Frage, ab 1024 px rechts. */
  buehne?: ReactNode;
}

/**
 * Intent-Hub im ersten Bildschirm (G-01 bis G-05, K-013): die Frage als h1, ein Satz, die Kacheln
 * aus den Rubriken, Anrufen. Kein Wischen, kein Karussell: Bei 390 × 844 und 1440 × 900 stehen alle
 * Kacheln ohne Scrollen im Bild, bei 360 × 780 mindestens neun. Das größte Element ist die Frage.
 */
export function IntentHub({ rubriken, satz, telefon, buehne }: IntentHubProps) {
  const spalten = hubSpalten(rubriken.length);
  return (
    <section aria-labelledby="hub-frage" className="border-b border-border bg-surface">
      <HubWechselMerker />
      <div className="shell grid grid-cols-1 pb-6 pt-4 sm:pt-6 lg:grid-cols-12 lg:gap-x-gutter lg:pb-10 lg:pt-10">
        <div className="lg:col-span-7 lg:row-start-1">
          <h1 id="hub-frage" className="text-display font-bold text-foreground">
            {HUB_FRAGE}
          </h1>
          {satz && <p className="mt-2 max-w-measure text-lead text-foreground-muted lg:mt-4">{satz}</p>}
        </div>

        <ul
          aria-label="Leistungen"
          className={cn(
            'mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3 lg:col-span-7 lg:row-start-2 lg:mt-8',
            spalten === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3',
          )}
        >
          {rubriken.map((rubrik) => (
            <HubKachel key={rubrik.id} rubrik={rubrik} />
          ))}
        </ul>

        {/* Rechte Spalte ab 1024 px: oben die Bühne, unten Anrufen. Darunter löst sich die Hülle auf
            (`contents`): Die Bühne steht als Band über der Frage, Anrufen nach dem Raster. */}
        <div className="contents lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:flex lg:flex-col lg:gap-6">
          {buehne && <div className="order-first mb-2 lg:order-none lg:mb-0">{buehne}</div>}
          {telefon && (
            <p className="order-last mt-3 flex flex-wrap items-center gap-x-2 text-body text-foreground-muted lg:order-none lg:mt-auto">
              <GlyphTelefon size={20} className="shrink-0 text-primary" />
              <span>Lieber anrufen:</span>
              {telefon.href ? (
                <a
                  href={telefon.href}
                  className="inline-flex min-h-touch items-center font-mono font-semibold tabular-nums text-primary transition-colors duration-quick hover:text-primary-hover"
                >
                  {telefon.anzeige}
                </a>
              ) : (
                <span className="font-mono font-semibold tabular-nums text-foreground">{telefon.anzeige}</span>
              )}
            </p>
          )}
        </div>

        <CodeMotiv className="mt-6 hidden sm:block lg:col-span-7 lg:row-start-3" />
      </div>
    </section>
  );
}
