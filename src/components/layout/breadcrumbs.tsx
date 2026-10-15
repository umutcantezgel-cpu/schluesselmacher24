import Link from 'next/link';
import { GlyphWinkelRechts } from '@/components/visual/glyphen/winkel-rechts';
import { cn } from '@/lib/cn';

export interface Crumb {
  href: string;
  label: string;
}

const linkKlasse = 'inline-flex min-h-6 items-center transition-colors duration-quick hover:text-primary hover:underline';

export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Brotkrumennavigation" className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-small text-foreground-subtle">
        <li>
          <Link href="/" className={linkKlasse}>
            Start
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <GlyphWinkelRechts size={14} className="shrink-0" />
              {isLast ? (
                <span className="font-semibold text-foreground-muted" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className={linkKlasse}>
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
