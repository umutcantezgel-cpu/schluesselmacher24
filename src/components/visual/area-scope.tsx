import type { ReactNode } from 'react';

import type { AreaKey } from '@/lib/types';

/**
 * Setzt die Akzentfarbe eines Leistungsbereichs für alles darunter
 * (`text-area-strong`, `bg-area-soft`, `fill-area` …). `display: contents`
 * verändert das Layout nicht.
 */
export function AreaScope({ area, children }: { area: AreaKey; children: ReactNode }) {
  return (
    <div data-area={area} className="contents">
      {children}
    </div>
  );
}
