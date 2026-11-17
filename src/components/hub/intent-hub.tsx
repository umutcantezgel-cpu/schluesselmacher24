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
 * Raster des Hubs (G-02, FA-03, A-052): Der Inhaber hat 14 Hauptzugänge festgelegt. Telefon: drei
 * Spalten (bei 14 Kacheln 3, 3, 3, 3, 2). Ab 768 px vier Spalten ohne Leitkachel (4, 4, 4, 2); die
 * letzte Reihe steht linksbündig. Bis drei Kacheln bleiben es auch ab 768 px drei Spalten.
 *
 * Bewusst hingenommen: Schaltet der Betrieb eine Hub-Rubrik ab (13 Kacheln), steht in der letzten
 * Reihe eine einzelne Kachel (Telefon 3, 3, 3, 3, 1; ab 768 px 4, 4, 4, 1). Ohne Leitkachel und ohne
 * Spannen lässt sich das nicht vermeiden; die Kachel bleibt links in der Reihe, die Reihenfolge bleibt.
 */
export function hubRaster(anzahl: number): { spalten: 3 | 4 } {
  return { spalten: anzahl <= 3 ? 3 : 4 };
}

export interface IntentHubProps {
  /** Rubriken mit `imHub` und Status `live`, sortiert (getHubRubriken). */
  rubriken: Rubrik[];
  /** Ein Satz unter der Frage: wer, was, wo. */
  satz?: string | null;
  /** Telefonnummer wie gepflegt und ihr `tel:`-Link; ohne Link erscheint die Nummer als Text. */
  telefon?: { anzeige: string; href: string | null } | null;
  /** Kernaussage der Erreichbarkeit neben der Nummer, etwa „24 Stunden erreichbar“ (FA-23). */
  erreichbar?: string | null;
  /** Bühne der Eingangsinszenierung (B-31): bis 1279 px ein schmales Band über der Frage, ab 1280 px rechts. */
  buehne?: ReactNode;
}

/**
 * Intent-Hub im ersten Bildschirm (G-01 bis G-05, K-013, FA-03): die Frage als h1, ein Satz, die
 * Kacheln aus den Rubriken, Anrufen. Kein Wischen, kein Karussell, kein Einklappen: Bei 390 × 844
 * stehen Frage, Satz, alle 14 Kacheln und die Zeile Anrufen über der unteren Leiste, bei 360 × 780
 * mindestens zwölf Kacheln; bei 1440 × 900 stehen alle vier Reihen im Bild. Dafür auf dem Telefon flache
 * Kacheln, knappe Abstände und der Satz in 15 px, ab 1280 px knappere Abstände und kompakte Kacheln
 * (Höhenrechnungen im Bericht FA-SOFORT-05). Das größte Element ist die Frage.
 */
export function IntentHub({ rubriken, satz, telefon, erreichbar, buehne }: IntentHubProps) {
  const { spalten } = hubRaster(rubriken.length);
  return (
    /* Erster Bildschirm auf der Bühne mit Licht (A-074): Aufbau und Bewegung bleiben, nur die Farbe wechselt. */
    <section aria-labelledby="hub-frage" className="buehne buehne-licht border-b border-border">
      <HubWechselMerker />
      <div className="shell grid grid-cols-1 pb-6 pt-3 sm:pt-6 lg:pb-10 lg:pt-10 xl:grid-cols-12 xl:pt-6 xl:gap-x-gutter">
        <div className="xl:col-span-12 xl:row-start-1">
          <h1 id="hub-frage" className="text-display font-bold text-foreground">
            {HUB_FRAGE}
          </h1>
          {satz && <p className="mt-1 max-w-measure text-small text-foreground-muted sm:mt-2 sm:text-lead lg:mt-4 xl:mt-2">{satz}</p>}
        </div>

        <ul
          aria-label="Leistungen"
          className={cn(
            'mt-2 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3 lg:mt-6 xl:col-span-8 xl:row-start-2 xl:mt-6',
            spalten === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3',
          )}
        >
          {rubriken.map((rubrik) => (
            <HubKachel key={rubrik.id} rubrik={rubrik} />
          ))}
        </ul>

        {/* Rechte Spalte ab 1280 px neben dem Raster, die Frage steht darüber über die ganze Breite
            (E5-OPUS-05: breitere Kacheln ohne Trennung): die Bühne füllt die Spalte bis zur Zeile Anrufen (A-025).
            `h-0 min-h-full`: Die Spalte nimmt die Höhe des Rasters an und bestimmt sie nicht mit.
            Darunter löst sich die Hülle auf (`contents`): Die Bühne steht als Band über der Frage,
            Anrufen nach dem Raster. */}
        <div className="contents xl:col-span-4 xl:col-start-9 xl:row-start-2 xl:mt-6 xl:flex xl:h-0 xl:min-h-full xl:flex-col xl:gap-6">
          {buehne && <div className="order-first mb-2 xl:order-none xl:mb-0 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">{buehne}</div>}
          {/* Code-Motiv (B-33): bis 1280 px unter dem Raster, ab 1280 px unter der Bühne, damit die
              linke Spalte kürzer bleibt und Anrufen im ersten Bildschirm steht */}
          <CodeMotiv className="order-last mt-6 hidden sm:block xl:order-none xl:mt-0" />
          {telefon && (
            <p className="order-last mt-2 flex flex-wrap items-center gap-x-2 text-body text-foreground-muted xl:order-none xl:mt-auto">
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
              {erreichbar && <span className="basis-full text-small font-semibold text-foreground">{erreichbar}</span>}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}
