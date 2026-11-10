import type { ReactNode } from 'react';

import { Alert } from '@/components/ui/alert';
import { pruefhinweiseZeigen } from '@/lib/umgebung';

/**
 * Hinweis für Inhaber und Redaktion — erscheint nur außerhalb der Produktion
 * (lokal, in Vercel-Vorschauen und im Schaufenster), nie für Besucher der Live-Seite.
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
  if (!pruefhinweiseZeigen()) return null;
  return (
    <Alert tone="warning" title={title} className={className}>
      {children}
    </Alert>
  );
}
