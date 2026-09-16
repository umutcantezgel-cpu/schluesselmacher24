import { ImageOff } from 'lucide-react';
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
}

/**
 * Neutrale, beschriftete Platzhalterfläche.
 *
 * Es werden bewusst keine Stockfotos und keine erzeugten Bilder eingesetzt.
 * Der Text beschreibt, welches Motiv hier später stehen soll.
 */
export function ImagePlaceholder({ slot, className, compact = false }: ImagePlaceholderProps) {
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
