import type { ReactNode } from 'react';

import { AreaScope } from '@/components/visual/area-scope';

/** Akzentfarbe: Der Motorradschlüssel gehört zum Bereich „Autoschlüssel“. */
export default function BereichLayout({ children }: { children: ReactNode }) {
  return <AreaScope area="autoschluessel">{children}</AreaScope>;
}
