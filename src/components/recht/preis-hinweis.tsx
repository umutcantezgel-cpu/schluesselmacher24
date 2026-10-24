import Link from 'next/link';

import { cn } from '@/lib/cn';

export const VERSAND_UND_ZAHLUNG_HREF = '/rechtliches/versand-und-zahlung';

const linkKlasse = 'underline decoration-border-strong underline-offset-2 hover:text-primary';

interface PreisHinweisProps {
  /**
   * `zzgl-versand` (Standard) an Produktpreisen, `mit-versand` dort, wo die
   * Versandkosten schon in der Summe stehen (Warenkorb).
   */
  variante?: 'zzgl-versand' | 'mit-versand';
  /** Für Listen: „Alle Preise inkl. …“ statt nur „inkl. …“. */
  alle?: boolean;
  className?: string;
}

/**
 * Pflichtangabe nach der Preisangabenverordnung an jedem Preis: Endpreis
 * inklusive Umsatzsteuer, Versandkosten mit Link auf „Zahlung und Versand“.
 * Ohne Browser-Logik — nutzbar in Server- und Client-Komponenten.
 */
export function PreisHinweis({ variante = 'zzgl-versand', alle = false, className }: PreisHinweisProps) {
  return (
    <p className={cn('text-caption leading-snug text-foreground-muted', className)}>
      {variante === 'mit-versand' ? (
        <>
          Alle Preise inkl. 19 % USt. Versandarten und Lieferzeiten:{' '}
          <Link href={VERSAND_UND_ZAHLUNG_HREF} className={linkKlasse}>
            Zahlung und Versand
          </Link>
          .
        </>
      ) : (
        <>
          {alle ? 'Alle Preise inkl.' : 'inkl.'} 19 % USt., zzgl.{' '}
          <Link href={VERSAND_UND_ZAHLUNG_HREF} className={linkKlasse}>
            Versandkosten
          </Link>
        </>
      )}
    </p>
  );
}
