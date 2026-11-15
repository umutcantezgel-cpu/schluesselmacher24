import Link from 'next/link';

import type { CodeLine } from '@/lib/types';
import { codelinienPfad } from '@/lib/codelinie';
import { cn } from '@/lib/cn';

import { LINIEN_ZEILE_KLASSE, LinienZeileInhalt } from './linien-zeile';

/**
 * Codelinien als Stückliste mit Haarlinien (wie die Shop-Liste): Bild oder
 * Fach-Icon, Titel, Codeformat, Codebereich, Preis und Lieferzeit oder die
 * Verfügbarkeit; die ganze Zeile ist der Link. Serverseitig, damit jede Linie
 * als echter Link im Dokument steht (Erg. Leitfaden §3).
 */
export function LinienListe({ lines, className }: { lines: CodeLine[]; className?: string }) {
  if (lines.length === 0) return null;
  return (
    <ul className={cn('border-t border-border', className)}>
      {lines.map((line) => (
        <li key={line.id} className="border-b border-border">
          <Link href={codelinienPfad(line)} prefetch={false} className={LINIEN_ZEILE_KLASSE}>
            <LinienZeileInhalt line={line} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
