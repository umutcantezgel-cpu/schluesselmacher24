import Link from 'next/link';

import { AreaScope } from '@/components/visual/area-scope';
import { FachIcon, fachIconKomponente } from '@/components/visual/fach-icon';
import { Seitenwechsel } from '@/components/visual/motion/seitenwechsel';
import type { Rubrik } from '@/lib/types';

/**
 * Name des gemeinsamen Elements einer Rubrik (B-35): Das Kachel-Icon geht beim Seitenwechsel in
 * den Rubrikkopf über. Je Rubrik eindeutig, weil sich mehrere Rubriken einen Bereich teilen
 * (Autoschlüssel, Motorrad, Gehäuse) und ein Name je Seite nur einmal vorkommen darf.
 */
export function rubrikUebergang(rubrikId: string): string {
  return `rubrik-${rubrikId}`;
}

/**
 * Eine Kachel des Intent-Hubs (K-013): Fach-Icon in der Bereichsfarbe, Laienname, bei Bedarf
 * die Laienerklärung (`zusatz`, G-09). Die ganze Fläche ist der Link. Leuchten bei Hover und
 * Fokus (B-30), Druck beim Tippen (B-34); beides nur bei „Bewegung an“, die ruhige Fassung zeigt
 * Rahmen und Ring.
 */
export function HubKachel({ rubrik }: { rubrik: Rubrik }) {
  const mitIcon = Boolean(fachIconKomponente(rubrik.icon));
  return (
    <li className="flex">
      <AreaScope area={rubrik.bereich}>
        <Link
          href={rubrik.ziel}
          prefetch={false}
          data-rubrik={rubrik.id}
          className="group flex min-h-24 w-full flex-col items-center gap-1.5 rounded-lg border border-border bg-surface px-1.5 pb-3 pt-3.5 text-center transition duration-quick ease-standard hover:border-area-strong focus-visible:border-area-strong bewegt:hover:shadow-leuchten bewegt:focus-visible:shadow-leuchten bewegt:active:scale-kachel bewegt:active:shadow-leuchten-druck md:items-start md:gap-2 md:px-4 md:pb-4 md:pt-4 md:text-left"
        >
          {mitIcon && (
            <Seitenwechsel name={rubrikUebergang(rubrik.id)}>
              <FachIcon name={rubrik.icon} size={36} className="shrink-0 text-area-strong md:size-10" />
            </Seitenwechsel>
          )}
          <span className="trennung-kachel text-small font-semibold leading-snug text-foreground md:text-title-sm">
            {rubrik.laienname}
          </span>
          {rubrik.zusatz && (
            <span className="trennung-kachel text-caption leading-snug text-foreground-muted md:text-small">{rubrik.zusatz}</span>
          )}
        </Link>
      </AreaScope>
    </li>
  );
}
