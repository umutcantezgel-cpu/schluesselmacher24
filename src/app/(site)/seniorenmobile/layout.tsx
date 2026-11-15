import type { ReactNode } from 'react';

import { AreaScope } from '@/components/visual/area-scope';

/** Akzentfarbe: Die Fahrzeugschlüssel-Anfrage gehört zum Bereich „Autoschlüssel“ (FA-KERN-02B). */
export default function BereichLayout({ children }: { children: ReactNode }) {
  return <AreaScope area="autoschluessel">{children}</AreaScope>;
}
