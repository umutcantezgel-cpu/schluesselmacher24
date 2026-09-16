import type { Metadata } from 'next';
import { Lock } from 'lucide-react';

import { getCollection } from '@/lib/data';
import { Alert } from '@/components/ui/alert';

import { ProduktVerwaltung } from './produkt-verwaltung';

export const metadata: Metadata = {
  title: 'Produkte pflegen — Backend',
  robots: { index: false, follow: false },
};

/**
 * Backend → Produkte.
 *
 * Zwei Bereiche: die Codelinien für „Schlüssel nach Code“ und der Katalog
 * für gleichschließende Zylinder. Preise, Höchstmengen, Prüfmuster und
 * Aufpreise stehen bewusst nirgends im Quellcode, sondern werden hier
 * gepflegt.
 */
export default async function AdminProduktePage() {
  const [codeLines, cylinderCatalog] = await Promise.all([
    getCollection('codeLines'),
    getCollection('cylinderCatalog'),
  ]);

  return (
    <div className="shell-wide py-8 md:py-10">
      <Alert tone="warning" title="Zugang noch offen" className="mb-6">
        <span className="inline-flex items-start gap-2">
          <Lock size={14} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            Dieses Backend hat noch keine Anmeldung. Vor dem Livegang muss der gesamte
            Bereich <code className="font-mono">/admin</code> durch eine Zugangsbeschränkung
            geschützt werden. Bis dahin sind alle Angaben auf dieser Seite für jede Person
            mit der Adresse erreichbar.
          </span>
        </span>
      </Alert>

      <header className="mb-8 max-w-3xl">
        <p className="eyebrow">
          <span className="h-px w-6 bg-current" aria-hidden />
          Backend
        </p>
        <h1 className="mt-3 text-[1.75rem] font-bold leading-tight md:text-4xl">Produkte</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
          Hier werden die verkauften Produkte gepflegt: die Codelinien für Schlüssel nach
          Code sowie Bauformen, Funktionen und Zusatzoptionen für gleichschließende
          Zylinder. Jede Änderung wirkt sich unmittelbar auf die Kundenseiten aus.
        </p>
      </header>

      <ProduktVerwaltung codeLines={codeLines} catalog={cylinderCatalog} />
    </div>
  );
}
