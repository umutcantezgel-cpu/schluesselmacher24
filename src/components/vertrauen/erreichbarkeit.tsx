import { cn } from '@/lib/cn';
import type { Erreichbarkeit as ErreichbarkeitAngabe } from '@/lib/types';

export interface ErreichbarkeitProps {
  angabe: ErreichbarkeitAngabe;
  /** `kompakt` für Fuß und Randspalten, `gross` für eigene Abschnitte. */
  groesse?: 'kompakt' | 'gross';
  className?: string;
}

/**
 * Erreichbarkeit im Wortlaut des Inhabers: Kernaussage und die Zeilen darunter. Steht überall, wo früher
 * Öffnungszeiten standen (FA-23). Ohne Browser-Logik, nutzbar in Server- und Client-Komponenten.
 */
export function Erreichbarkeit({ angabe, groesse = 'kompakt', className }: ErreichbarkeitProps) {
  const gross = groesse === 'gross';
  return (
    <div className={cn(gross ? 'text-body' : 'text-small', className)}>
      <p className={cn('font-semibold text-foreground', gross && 'text-title')}>{angabe.kernaussage}</p>
      {angabe.zeilen.length > 0 && (
        <ul className={cn('text-foreground-muted', gross ? 'mt-3 space-y-1.5' : 'mt-1 space-y-0.5')}>
          {angabe.zeilen.map((zeile) => (
            <li key={zeile}>{zeile}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
