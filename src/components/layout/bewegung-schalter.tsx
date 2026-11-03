'use client';

import { GlyphBewegung } from '@/components/visual/glyphen/bewegung';
import { useBewegung } from '@/components/visual/motion/use-bewegung';
import { setzeBewegung } from '@/lib/bewegung';
import { cn } from '@/lib/cn';

/**
 * Bewegungsschalter im Fuß jeder Seite (A-007, KERN K-007, B-36): „Bewegung: an“ oder
 * „Bewegung: ruhig“. Startet nach der Systemeinstellung, merkt sich die Wahl im Gerät.
 * Die sichtbare Angabe kommt aus CSS (`html[data-bewegung]`), damit sie vom ersten Bild an
 * stimmt; ohne JavaScript ist der Schalter ausgeblendet (`.sm24-bewegung-schalter`).
 */
export function BewegungSchalter({ className }: { className?: string }) {
  const bewegung = useBewegung();
  const an = bewegung === 'an';
  return (
    <button
      type="button"
      aria-pressed={an}
      onClick={() => setzeBewegung(an ? 'ruhig' : 'an')}
      className={cn(
        'sm24-bewegung-schalter inline-flex min-h-touch items-center gap-2 rounded-md px-2 text-foreground-muted transition-colors duration-quick hover:text-foreground',
        className,
      )}
    >
      <GlyphBewegung size={18} aria-hidden />
      <span>
        Bewegung: <span className="sm24-wenn-an">an</span>
        <span className="sm24-wenn-ruhig">ruhig</span>
      </span>
    </button>
  );
}
