import type { ReactNode } from 'react';

import { Alert } from '@/components/ui/alert';
import { istProduktion } from '@/lib/umgebung';

/**
 * Hinweis für Inhaber und Redaktion — erscheint nur außerhalb der Produktion
 * (lokal und in Vercel-Vorschauen), nie für Besucher der Live-Seite.
 */
export function RedaktionsHinweis({
  title,
  children,
  className = 'mb-8',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  if (istProduktion()) return null;
  return (
    <Alert tone="warning" title={title} className={className}>
      {children}
    </Alert>
  );
}
