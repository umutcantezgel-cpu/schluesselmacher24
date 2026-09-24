import type { ReactNode } from 'react';

import { AreaScope } from '@/components/visual/area-scope';

/** Akzentfarbe des Bereichs für alle Unterseiten. */
export default function BereichLayout({ children }: { children: ReactNode }) {
  return <AreaScope area="schluessel-nach-code">{children}</AreaScope>;
}
