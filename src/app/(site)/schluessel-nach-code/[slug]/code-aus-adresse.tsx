'use client';

import { useSearchParams } from 'next/navigation';

import { BestellFormular, type BestellFormularProps } from './bestell-formular';
import { codeAusAdresse } from './code-uebernahme';

/**
 * Liest den Parameter `code` der Adresse und gibt ihn als Vorbelegung ans
 * Bestellformular. Passt er nicht zum Format der Linie, bleibt das Feld leer.
 * Steht in `page.tsx` in einer Suspense-Grenze, damit die Seite statisch bleibt.
 */
export function CodeAusAdresse(props: BestellFormularProps) {
  const params = useSearchParams();
  const anfangsCode = codeAusAdresse(params?.get('code'), props.line.codePattern);
  return <BestellFormular {...props} anfangsCode={anfangsCode} />;
}
