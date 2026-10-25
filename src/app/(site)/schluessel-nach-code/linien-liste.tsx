import Link from 'next/link';

import type { CodeLine } from '@/lib/types';
import { codelinienKennung, codelinienPfad, codelinienTitel } from '@/lib/codelinie';
import { formatCents } from '@/lib/format';
import { cn } from '@/lib/cn';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

/**
 * Codelinien als Stückliste mit Haarlinien (wie die Shop-Liste): Kennung,
 * Titel, Codeformat und Preis; die ganze Zeile ist der Link. Serverseitig,
 * damit jede Linie als echter Link im Dokument steht (Erg. Leitfaden §3).
 */
export function LinienListe({ lines, className }: { lines: CodeLine[]; className?: string }) {
  if (lines.length === 0) return null;
  return (
    <ul className={cn('border-t border-border', className)}>
      {lines.map((line) => (
        <li key={line.id} className="border-b border-border">
          <Link
            href={codelinienPfad(line)}
            prefetch={false}
            className="group grid min-h-touch-lg grid-cols-12 items-center gap-x-3 gap-y-1 py-4 transition-colors duration-quick ease-standard md:gap-x-6"
          >
            <span className="col-span-2 whitespace-nowrap font-mono text-small font-semibold tabular-nums text-foreground lg:col-span-1">
              {codelinienKennung(line)}
            </span>
            <span className="col-span-9 text-balance text-body font-semibold leading-snug text-foreground transition-colors duration-quick ease-standard group-hover:text-primary md:col-span-4">
              {codelinienTitel(line)}
            </span>
            <GlyphPfeilRechts
              size={16}
              className="col-span-1 row-span-2 justify-self-end text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary md:order-last md:row-span-1"
            />
            <span className="col-span-9 col-start-3 font-mono text-small text-foreground-muted md:col-span-3 md:col-start-auto lg:col-span-4">
              {line.codeFormatLabel}
            </span>
            <span className="col-span-9 col-start-3 whitespace-nowrap font-mono text-body font-semibold tabular-nums text-foreground md:col-span-2 md:col-start-auto md:text-right">
              {formatCents(line.priceCents)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
