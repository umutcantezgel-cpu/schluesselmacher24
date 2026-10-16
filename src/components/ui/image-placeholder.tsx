import Image from 'next/image';
import type { ComponentType, CSSProperties } from 'react';

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
import { renderVisual } from '@/components/visual/registry';
import type { ImageSlot } from '@/lib/types';
import { fachIconFuerMotiv, visualFuerMotiv, type FachIconName } from '@/lib/visual/motiv';
import { cn } from '@/lib/cn';

const ratios: Record<ImageSlot['ratio'], string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-4/3',
  '1/1': 'aspect-square',
  '3/2': 'aspect-3/2',
  '21/9': 'aspect-21/9',
};

const FACH_ICONS: Record<FachIconName, ComponentType<IconProps>> = {
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

export interface ImagePlaceholderProps {
  slot: ImageSlot;
  className?: string;
  /** Kleine Fläche (Vorschaubild, Liste): Fach-Icon statt Zeichnung. */
  compact?: boolean;
  /** Hinweis für den Browser, wie breit das Bild dargestellt wird. */
  sizes?: string;
  /** Ohne Fläche und Rahmen – die Zeichnung steht frei (etwa im Seitenkopf). */
  frei?: boolean;
  /**
   * Nur für Fachgrafiken: Unter 640 px zeigt die Fläche nur diesen Ausschnitt der
   * Zeichnung (viewBox-Einheiten), damit Beschriftungen lesbar groß bleiben.
   */
  ausschnitt?: GrafikAusschnitt;
}

export interface GrafikAusschnitt {
  x: number;
  y: number;
  breite: number;
  hoehe: number;
  /** Volle Größe der Zeichenfläche (viewBox). */
  vollBreite: number;
  vollHoehe: number;
}

type AusschnittStil = CSSProperties & Record<'--aus-x' | '--aus-y' | '--aus-w' | '--aus-h' | '--voll-w' | '--voll-h', number>;

/** CSS-Variablen für `.sm24-ausschnitt` (globals.css). */
export function ausschnittStil(a: GrafikAusschnitt): AusschnittStil {
  return {
    '--aus-x': a.x,
    '--aus-y': a.y,
    '--aus-w': a.breite,
    '--aus-h': a.hoehe,
    '--voll-w': a.vollBreite,
    '--voll-h': a.vollHoehe,
  };
}

/**
 * Bildfläche mit fester Rangfolge (KERN K-008):
 * 1. Foto aus der Medienbibliothek (`slot.bild`)
 * 2. Fachgrafik aus Daten – `slot.visual` oder passend zum Motiv (`visualFuerMotiv`)
 * 3. Fach-Icon passend zum Motiv
 *
 * Es gibt keine sichtbaren Platzhalter und keine erzeugten Fotos: Die Grafiken
 * erklären die Sache und geben sich nicht als Foto aus. Welche Fotos fehlen,
 * steht für die Redaktion in `_werkstatt/MENSCHEN.md`.
 */
export function ImagePlaceholder({
  slot,
  className,
  compact = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  frei = false,
  ausschnitt,
}: ImagePlaceholderProps) {
  if (slot.bild?.url) {
    return (
      <div className={cn('relative w-full overflow-hidden rounded-lg bg-surface-muted', ratios[slot.ratio], className)}>
        <Image src={slot.bild.url} alt={slot.bild.alt || slot.motif} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  const flaeche = frei ? '' : 'rounded-lg border border-border bg-surface';
  const ref = compact ? null : (slot.visual ?? visualFuerMotiv(slot.motif));
  /* Der Titel kommt vom Generator selbst (sachlich), nicht aus dem Fotomotiv. */
  const visual = ref ? renderVisual(ref, '', 'absolute inset-0 h-full w-full') : null;
  if (visual) {
    return (
      <div
        className={cn('relative w-full overflow-hidden', flaeche, ratios[slot.ratio], ausschnitt && 'sm24-ausschnitt', className)}
        style={ausschnitt ? ausschnittStil(ausschnitt) : undefined}
      >
        {visual}
      </div>
    );
  }

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
