import Image from 'next/image';

import type { ImageSlot } from '@/lib/types';
import { cn } from '@/lib/cn';

/**
 * Hersteller als Logo oder als Text (R12). Ein Logo steht nur dort, wo die
 * Datenschicht es liefert, und sie liefert es nur, wenn am Hersteller
 * „Freigabe liegt vor“ gesetzt ist (`herstellerZuSeite`). Ohne Logo steht der
 * Name sachlich als Text.
 */
export function HerstellerMarke({ name, logo, className }: { name: string; logo?: ImageSlot; className?: string }) {
  const bild = logo?.bild;
  if (bild?.url) {
    return (
      <p className={cn('flex items-center gap-3', className)}>
        <span className="relative block h-12 w-24 shrink-0">
          <Image src={bild.url} alt={`Logo ${name}`} fill sizes="96px" className="object-contain object-left" />
        </span>
        <span className="sr-only">{name}</span>
      </p>
    );
  }
  return (
    <p className={cn('font-mono text-caption uppercase tracking-label text-foreground-muted', className)}>
      Hersteller: <span className="font-semibold text-foreground">{name}</span>
    </p>
  );
}
