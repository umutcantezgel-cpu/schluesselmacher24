import type { ReactNode } from 'react';

import { AreaScope } from '@/components/visual/area-scope';

/** Akzentfarbe: Die Einsendung gehört zum Bereich „Schlüssel nach Foto oder Vorlage“. */
export default function BereichLayout({ children }: { children: ReactNode }) {
  return <AreaScope area="schluessel-nach-vorlage">{children}</AreaScope>;
}
