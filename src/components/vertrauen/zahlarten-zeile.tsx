import { cn } from '@/lib/cn';

export interface ZahlartenZeileProps {
  /**
   * Aus `onlineZahlarten()` — dieselbe Quelle wie der Stripe-Checkout.
   * `null`, solange keine Online-Zahlung eingerichtet ist.
   */
  zahlarten: readonly string[] | null;
  className?: string;
}

/**
 * Zeile „Online bezahlen mit: …“ in der Nähe des Bestellknopfs. Ohne
 * Online-Zahlung erscheint nichts — den Hinweis dazu trägt die Kasse schon.
 * Ohne Browser-Logik — nutzbar in Server- und Client-Komponenten.
 */
export function ZahlartenZeile({ zahlarten, className }: ZahlartenZeileProps) {
  if (!zahlarten || zahlarten.length === 0) return null;

  return (
    <p className={cn('text-small leading-relaxed text-foreground-muted', className)}>
      <span className="font-semibold text-foreground">Online bezahlen mit:</span> {zahlarten.join(' · ')}
    </p>
  );
}
