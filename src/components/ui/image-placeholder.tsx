import type { CSSProperties } from 'react';

import { FachIconFlaeche, FotoFlaeche, ratios } from './bild-flaeche';
import { renderVisual, schmaleFassung } from '@/components/visual/registry';
import type { ImageSlot } from '@/lib/types';
import { visualFuerMotiv } from '@/lib/visual/motiv';
import { cn } from '@/lib/cn';

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
 * steht für die Redaktion in `docs/gestaltung/MENSCHEN.md`.
 */
export function ImagePlaceholder({
  slot,
  className,
  compact = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  frei = false,
  ausschnitt,
}: ImagePlaceholderProps) {
  if (slot.bild?.url) return <FotoFlaeche slot={slot} className={className} sizes={sizes} />;

  const flaeche = frei ? '' : 'rounded-lg border border-border bg-surface';
  const ref = compact ? null : (slot.visual ?? visualFuerMotiv(slot.motif));
  /* Unter 640 px die schmale Fassung mit größerer Schrift, wo der Generator eine hat. Sie hat
     Vorrang vor einem Ausschnitt: Ein Ausschnitt hilft breiten Bäumen nicht, die schmale
     Fassung setzt die Schrift sicher lesbar. Der Ausschnitt gilt dann nicht. */
  const schmal = ref ? schmaleFassung(ref) : null;
  const zuschnitt = schmal ? undefined : ausschnitt;
  /* Der Titel kommt vom Generator selbst (sachlich), nicht aus dem Fotomotiv. */
  const visual = ref ? renderVisual(ref, '', cn('absolute inset-0 h-full w-full', schmal && 'hidden sm:block')) : null;
  if (visual) {
    return (
      <div
        className={cn('relative w-full overflow-hidden', flaeche, ratios[slot.ratio], zuschnitt && 'sm24-ausschnitt', className)}
        style={zuschnitt ? ausschnittStil(zuschnitt) : undefined}
      >
        {schmal && renderVisual(schmal, '', 'absolute inset-0 h-full w-full sm:hidden')}
        {visual}
      </div>
    );
  }

  return <FachIconFlaeche slot={slot} className={className} compact={compact} frei={frei} />;
}
