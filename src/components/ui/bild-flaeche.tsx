import Image from 'next/image';
import type { ComponentType } from 'react';

import type { IconProps } from '@/components/visual/icons/icon-base';
import { IconAlarmtechnik } from '@/components/visual/icons/alarmtechnik';
import { IconAussenhautsicherung } from '@/components/visual/icons/aussenhautsicherung';
import { IconKombinierteKonzepte } from '@/components/visual/icons/kombinierte-konzepte';
import { IconMechanischerSchutz } from '@/components/visual/icons/mechanischer-schutz';
import { IconPanikAlarmtaster } from '@/components/visual/icons/panik-alarmtaster';
import { IconSmarteFunktionen } from '@/components/visual/icons/smarte-funktionen';
import { IconAutoschluessel } from '@/components/visual/icons/autoschluessel';
import { IconFotoHochladen } from '@/components/visual/icons/foto-hochladen';
import { IconProfilzylinder } from '@/components/visual/icons/profilzylinder';
import { IconSchluesselKopieren } from '@/components/visual/icons/schluessel-kopieren';
import { IconTuerUndSchliesstechnik } from '@/components/visual/icons/tuer-und-schliesstechnik';
import { IconVersandPaket } from '@/components/visual/icons/versand-paket';
import { IconVideoueberwachung } from '@/components/visual/icons/videoueberwachung';
import { IconWerkstatt } from '@/components/visual/icons/werkstatt';
import type { ImageSlot } from '@/lib/types';
import { fachIconFuerMotiv, type FachIconName } from '@/lib/visual/motiv';
import { cn } from '@/lib/cn';

/*
 * Foto und Fach-Icon einer Bildstelle, ohne die Grafik-Registry: Client-Komponenten, die nur
 * die kompakte Fassung zeigen (InfoTip), laden so nicht alle Generatoren mit (E7-L-42).
 * `ImagePlaceholder` setzt darauf auf.
 */

export const ratios: Record<ImageSlot['ratio'], string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-4/3',
  '1/1': 'aspect-square',
  '3/2': 'aspect-3/2',
  '21/9': 'aspect-21/9',
};

export const FACH_ICONS: Record<FachIconName, ComponentType<IconProps>> = {
  videoueberwachung: IconVideoueberwachung,
  alarmtechnik: IconAlarmtechnik,
  'panik-alarmtaster': IconPanikAlarmtaster,
  aussenhautsicherung: IconAussenhautsicherung,
  'mechanischer-schutz': IconMechanischerSchutz,
  'kombinierte-konzepte': IconKombinierteKonzepte,
  'smarte-funktionen': IconSmarteFunktionen,
  'foto-hochladen': IconFotoHochladen,
  profilzylinder: IconProfilzylinder,
  'tuer-und-schliesstechnik': IconTuerUndSchliesstechnik,
  'versand-paket': IconVersandPaket,
  autoschluessel: IconAutoschluessel,
  'schluessel-kopieren': IconSchluesselKopieren,
  werkstatt: IconWerkstatt,
};

/** Foto der Bildstelle (hat immer Vorrang). */
export function FotoFlaeche({ slot, className, sizes }: { slot: ImageSlot; className?: string; sizes: string }) {
  return (
    <div className={cn('relative w-full overflow-hidden rounded-lg bg-surface-muted', ratios[slot.ratio], className)}>
      <Image src={slot.bild!.url} alt={slot.bild!.alt || slot.motif} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/** Fach-Icon zum Motiv auf ruhiger Fläche – Ersatz, wenn weder Foto noch Fachgrafik da sind. */
export function FachIconFlaeche({
  slot,
  className,
  compact = false,
  frei = false,
}: {
  slot: ImageSlot;
  className?: string;
  compact?: boolean;
  frei?: boolean;
}) {
  const Icon = FACH_ICONS[fachIconFuerMotiv(slot.motif)];
  return (
    <div
      aria-hidden
      className={cn(
        'flex w-full items-center justify-center overflow-hidden text-area-strong',
        frei ? '' : 'rounded-lg border border-border bg-surface-muted',
        ratios[slot.ratio],
        className,
      )}
    >
      {/* Mit der Fläche wachsend (¼ der Breite, 64–160 px), damit breite Flächen nicht leer wirken */}
      {compact ? <Icon size={32} /> : <Icon size={72} className="h-auto w-1/4 min-w-16 max-w-40" />}
    </div>
  );
}

/** Kompakte Bildstelle: Foto oder Fach-Icon, nie eine Fachgrafik (wie `ImagePlaceholder compact`). */
export function KompaktBild({
  slot,
  className,
  frei = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: {
  slot: ImageSlot;
  className?: string;
  frei?: boolean;
  sizes?: string;
}) {
  if (slot.bild?.url) return <FotoFlaeche slot={slot} className={className} sizes={sizes} />;
  return <FachIconFlaeche slot={slot} className={className} compact frei={frei} />;
}
