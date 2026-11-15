import Link from 'next/link';

import { AreaScope } from '@/components/visual/area-scope';
import { FachIcon, fachIconKomponente } from '@/components/visual/fach-icon';
import { rubrikUebergang, Seitenwechsel } from '@/components/visual/motion/seitenwechsel';
import { cn } from '@/lib/cn';
import type { Rubrik } from '@/lib/types';

export { rubrikUebergang };

/**
 * Rubriken, deren Laienerklärung auch auf dem Telefon sichtbar auf der Kachel steht: Die
 * Sperrschließung trägt sie überall (G-09). Die übrigen Erklärungen erscheinen ab 768 px, damit die
 * Kacheln auf dem Telefon flach bleiben.
 */
export const ZUSATZ_AUF_DEM_TELEFON: ReadonlySet<string> = new Set(['sperrschliessung']);

/**
 * Steht der kurze Kachelname als ganzes Wort (oder ganze Wortfolge) im vollen Namen? Nur dann genügt
 * der volle Name als zugänglicher Name: Sprachsteuerung arbeitet mit ganzen Wörtern, „Klick Auto“
 * trifft „Autoschlüssel“ nicht sicher (WCAG 2.5.3, Name im Namen). Wortgrenzen auch für Umlaute.
 */
export function kurzImNamen(kurz: string, name: string): boolean {
  const muster = kurz.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!muster) return true;
  return new RegExp(`(?<![\\p{L}\\p{N}])${muster}(?![\\p{L}\\p{N}])`, 'iu').test(name);
}

/**
 * Eine Kachel des Intent-Hubs (K-013): Fach-Icon und Name. Die ganze Fläche ist der Link. Leuchten
 * bei Hover und Fokus (B-30), Druck beim Tippen (B-34); beides nur bei „Bewegung an“, die ruhige
 * Fassung zeigt Rahmen und Ring (Fokusrahmen aus globals.css).
 *
 * Zeichensprache (A-025): Das Icon steht in der Tinte der Seite (`data-area="allgemein"`), erst
 * Hover und Fokus holen die Bereichsfarbe der Rubrik hinein (`.hub-tinte` in globals.css).
 *
 * Zwei Namen (FA-03, A-052): Auf dem Telefon steht der kurze Kachelname (`laienname`, ein bis zwei
 * Zeilen in 15 px), damit 14 Kacheln und Anrufen in den ersten Bildschirm passen. Den vollen Namen
 * des Inhabers (`name`) und die Laienerklärung (`zusatz`, G-09) hören Screenreader immer; sichtbar
 * sind beide ab 768 px, die Erklärung der Sperrschließung schon auf dem Telefon
 * (`ZUSATZ_AUF_DEM_TELEFON`). Name im Namen (WCAG 2.5.3): Steht der kurze Name als ganzes Wort im
 * vollen, bleibt er für Screenreader verborgen; sonst („Auto“ zu „Autoschlüssel“) beginnt der
 * zugängliche Name auf dem Telefon mit ihm („Auto, Autoschlüssel“). Ab 768 px ist der kurze Name
 * ausgeblendet, sichtbarer und zugänglicher Name sind dann der volle Name.
 *
 * Trennung (E5-OPUS-05 nach E4-JURY-02): Auf dem Telefon trennt der Browser an der Wortfuge
 * („Sicherheits-technik“). Ab 768 px wird nicht getrennt: Titel bis 1023 px in 15 px, darüber
 * größer; ab 1280 px stehen vier Kacheln neben der Bühne, dort wieder 15 px mit kleinerem Symbol
 * (32 px) und knapperem Innenabstand, damit lange Wörter wie „Sperrschließungen“ in die Kachel passen
 * und bei 1440 × 900 alle vier Reihen im ersten Bildschirm stehen (Rechnung im Bericht FA-SOFORT-05).
 */
export function HubKachel({ rubrik }: { rubrik: Rubrik }) {
  const mitIcon = Boolean(fachIconKomponente(rubrik.icon));
  const kurzVerborgen = kurzImNamen(rubrik.laienname, rubrik.name);
  return (
    <li className="flex">
      <AreaScope area={rubrik.bereich}>
        <Link
          href={rubrik.ziel}
          prefetch={false}
          data-rubrik={rubrik.id}
          className="group flex min-h-touch w-full flex-col items-center justify-center gap-1 rounded-lg border border-border bg-surface px-1.5 py-1.5 text-center transition duration-quick ease-standard hover:border-area-strong focus-visible:border-area-strong bewegt:hover:shadow-leuchten bewegt:focus-visible:shadow-leuchten bewegt:active:scale-kachel bewegt:active:shadow-leuchten-druck md:min-h-24 md:items-start md:justify-start md:gap-2 md:p-4 md:text-left xl:min-h-20 xl:gap-1.5 xl:p-3"
        >
          {mitIcon && (
            <span data-area="allgemein" className="hub-tinte contents">
              <Seitenwechsel name={rubrikUebergang(rubrik.id)}>
                <FachIcon name={rubrik.icon} size={20} className="shrink-0 text-area-strong transition-colors duration-quick md:size-10 xl:size-8" />
              </Seitenwechsel>
            </span>
          )}
          {/* Telefon: kurzer Name. Steckt er als ganzes Wort im vollen Namen, nur zum Sehen; sonst
              beginnt der zugängliche Name mit ihm, durch Komma vom vollen Namen getrennt. */}
          <span
            aria-hidden={kurzVerborgen ? 'true' : undefined}
            data-kachelname="kurz"
            className="trennung-kachel text-small font-semibold leading-tight text-foreground md:hidden"
          >
            {rubrik.laienname}
          </span>
          {!kurzVerborgen && <span className="sr-only md:hidden">, </span>}
          <span
            data-kachelname="voll"
            className="sr-only text-foreground md:not-sr-only md:text-small md:font-semibold md:leading-snug lg:text-title-sm lg:tracking-tight xl:text-small xl:tracking-normal"
          >
            {rubrik.name}
          </span>
          {rubrik.zusatz && (
            <span
              data-kachelname="zusatz"
              className={cn(
                'text-foreground-muted md:text-balance md:text-small md:leading-snug',
                ZUSATZ_AUF_DEM_TELEFON.has(rubrik.id) ? 'trennung-kachel text-small leading-tight md:hyphens-manual' : 'sr-only md:not-sr-only',
              )}
            >
              {/* Für Screenreader mit Komma abgesetzt; sichtbar steht die Erklärung in eigener Zeile. */}
              <span className="sr-only">, </span>
              {rubrik.zusatz}
            </span>
          )}
        </Link>
      </AreaScope>
    </li>
  );
}
