import Image from 'next/image';
import { ImageOff } from 'lucide-react';

import { renderVisual } from '@/components/visual/registry';
import type { ImageSlot } from '@/lib/types';
import { cn } from '@/lib/cn';

const ratios: Record<ImageSlot['ratio'], string> = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/2': 'aspect-[3/2]',
  '21/9': 'aspect-[21/9]',
};

export interface ImagePlaceholderProps {
  slot: ImageSlot;
  className?: string;
  /** Kompakte Darstellung ohne Hinweistext. */
  compact?: boolean;
  /** Hinweis für den Browser, wie breit das Bild dargestellt wird. */
  sizes?: string;
}

/**
 * Bildfläche mit fester Rangfolge:
 * 1. Foto aus der Medienbibliothek (`slot.bild`)
 * 2. aus Daten erzeugte Vektorgrafik (`slot.visual`)
 * 3. neutrale, beschriftete Platzhalterfläche
 *
 * Es werden bewusst keine Stockfotos und keine erzeugten Fotos eingesetzt,
 * die eine echte Werkstatt vortäuschen.
 */
export function ImagePlaceholder({
  slot,
  className,
  compact = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: ImagePlaceholderProps) {
  if (slot.bild?.url) {
    return (
      <div
        className={cn('relative w-full overflow-hidden rounded-lg bg-surface-muted', ratios[slot.ratio], className)}
      >
        <Image
          src={slot.bild.url}
          alt={slot.bild.alt || slot.motif}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  const visual = slot.visual
    ? renderVisual(slot.visual, slot.motif, 'absolute inset-0 h-full w-full')
    : null;
  if (visual) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-lg bg-area-soft',
          ratios[slot.ratio],
          className,
        )}
      >
        {visual}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-2 rounded-lg',
        'border border-dashed border-border-strong bg-surface-muted p-4 text-center',
        ratios[slot.ratio],
        className,
      )}
      role="img"
      aria-label={`Bildplatzhalter: ${slot.motif}`}
    >
      <ImageOff className="text-foreground-subtle" size={compact ? 16 : 20} aria-hidden />
      <span className="max-w-[28ch] text-xs font-semibold leading-snug text-foreground-muted">
        {slot.motif}
      </span>
      {!compact && slot.note && (
        <span className="max-w-[34ch] text-[11px] leading-snug text-foreground-subtle">
          {slot.note}
        </span>
      )}
      {!compact && (
        <span className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
          Bild folgt
        </span>
      )}
    </div>
  );
}
