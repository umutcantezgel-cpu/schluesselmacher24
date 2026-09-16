import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Alert } from '@/components/ui/alert';
import { AdminKopfzeile, AdminNav } from './admin-nav';

/* ==========================================================================
   Rahmen des Backends
   Seitenleiste ab der großen Ansicht, am Smartphone eine einklappbare
   Navigation. Beim Drucken werden Navigation und Hinweise ausgeblendet,
   damit nur der fachliche Inhalt auf dem Papier landet.
   ========================================================================== */

export const metadata: Metadata = {
  title: 'Backend',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface-muted py-6 md:py-8 print:bg-surface print:py-0">
      <div className="shell-wide">
        <div className="print:hidden">
          <AdminKopfzeile />

          <Alert
            tone="warning"
            title="Dieses Backend ist noch nicht durch eine Anmeldung geschützt"
            className="mt-4"
          >
            Jede Person, die die Adresse kennt, kann diese Seiten öffnen und Daten ändern.
            Vor dem Livegang ist eine Zugangsbeschränkung einzurichten — zum Beispiel eine
            Anmeldung mit Benutzerkonto oder ein Schutz auf Ebene des Servers. Diese Anbindung
            ist bewusst offen gelassen und noch zu erledigen.
          </Alert>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-7 print:mt-0 print:block">
          <div className="print:hidden">
            <AdminNav />
          </div>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
