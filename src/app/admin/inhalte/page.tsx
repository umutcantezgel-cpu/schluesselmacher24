import type { Metadata } from 'next';
import { Lock } from 'lucide-react';

import { getCollection } from '@/lib/data';
import { Alert } from '@/components/ui/alert';

import { InhaltsVerwaltung } from './inhalts-verwaltung';

export const metadata: Metadata = {
  title: 'Inhalte und Suchmaschinen — Backend',
  robots: { index: false, follow: false },
};

/**
 * Backend → Inhalte und Suchmaschinen.
 *
 * Seitentexte, Ratgeberbeiträge und Einsatzgebiete werden hier gepflegt.
 * Überschriften, Seitentitel und Beschreibungen stehen deshalb nirgends
 * fest im Quellcode.
 */
export default async function AdminInhaltePage() {
  const [pages, guides, cities] = await Promise.all([
    getCollection('pages'),
    getCollection('guides'),
    getCollection('cities'),
  ]);

  return (
    <div className="shell-wide py-8 md:py-10">
      <Alert tone="warning" title="Zugang noch offen" className="mb-6">
        <span className="inline-flex items-start gap-2">
          <Lock size={14} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            Dieses Backend hat noch keine Anmeldung. Vor dem Livegang muss der gesamte
            Bereich <code className="font-mono">/admin</code> durch eine Zugangsbeschränkung
            geschützt werden.
          </span>
        </span>
      </Alert>

      <header className="mb-8 max-w-3xl">
        <p className="eyebrow">
          <span className="h-px w-6 bg-current" aria-hidden />
          Backend
        </p>
        <h1 className="mt-3 text-[1.75rem] font-bold leading-tight md:text-4xl">
          Inhalte und Suchmaschinen
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
          Texte, Seitentitel, Beschreibungen und interne Verweise für alle öffentlichen
          Seiten. Die Angaben zu Titel und Beschreibung erscheinen in den Ergebnislisten
          der Suchmaschinen — deshalb gibt es zu jedem Feld einen Zeichenzähler.
        </p>
      </header>

      <InhaltsVerwaltung pages={pages} guides={guides} cities={cities} />
    </div>
  );
}
