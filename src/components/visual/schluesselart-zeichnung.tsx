import type { KeyKind } from '@/lib/types';
import { cn } from '@/lib/cn';
import { SchluesselGrafik } from './generators/schluessel';

/**
 * Zeichnung je Schlüsselart für Auswahlkarten (Assistent, Schritt „Schlüsselart“):
 * dieselben Bauformen wie in der Reihe der Schlüsselarten. „Keyless“ ist eine
 * Funktion des Smart Key und zeigt dessen Zeichnung. Rein dekorativ – der Name
 * steht in der Karte –, ruhig (Arbeitsansicht, ohne Einstiegsbewegung).
 */
export const SCHLUESSELART_TYP: Record<KeyKind, 'transponder' | 'funk' | 'klapp' | 'smart-key'> = {
  mechanisch: 'transponder',
  funk: 'funk',
  klappschluessel: 'klapp',
  'smart-key': 'smart-key',
  keyless: 'smart-key',
};

export function SchluesselartZeichnung({ art, className }: { art: KeyKind; className?: string }) {
  const typ = SCHLUESSELART_TYP[art];
  if (!typ) return null;
  return (
    <span aria-hidden="true" className={cn('sm24-ruhig block', className)}>
      <SchluesselGrafik params={{ typ }} title="" className="h-auto w-full" />
    </span>
  );
}
