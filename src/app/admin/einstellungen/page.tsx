import type { Metadata } from 'next';

import { contentWritable, getCollection } from '@/lib/data';
import { integrationStatuses } from '@/lib/integrations';
import { Alert } from '@/components/ui/alert';
import { EinstellungenFormular } from './einstellungen-formular';

export const metadata: Metadata = {
  title: 'Einstellungen — Backend',
  robots: { index: false, follow: false },
};

/**
 * Firmendaten, Aufbewahrungsfristen, Status der externen Anbindungen und
 * Angaben zur Datenhaltung. Zugangsdaten werden hier bewusst weder
 * abgefragt noch gespeichert — sie stehen ausschließlich in
 * Umgebungsvariablen.
 */
export default async function AdminEinstellungenPage() {
  const [settings, integrations, storage] = await Promise.all([
    getCollection('settings'),
    Promise.resolve(integrationStatuses()),
    contentWritable(),
  ]);

  return (
    <div className="shell py-8 md:py-10">
      <header className="max-w-3xl">
        <p className="eyebrow">
          <span className="h-px w-6 bg-current" aria-hidden />
          Backend
        </p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Einstellungen</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
          Firmendaten, Aufbewahrungsfristen und der Stand der externen Anbindungen. Die
          Firmendaten erscheinen im Impressum, in der Datenschutzerklärung, im Fußbereich und
          in den strukturierten Daten für Suchmaschinen.
        </p>
      </header>

      <Alert tone="warning" title="Zugang noch nicht beschränkt" className="mt-6">
        Das Backend ist offen erreichbar. Vor dem Livegang muss der gesamte Bereich
        <span className="font-mono"> /admin </span>
        durch eine Zugangsbeschränkung geschützt werden. Diese Anbindung ist offen und
        bewusst noch nicht gebaut.
      </Alert>

      {!storage.writable && (
        <Alert tone="warning" title="Inhalte sind schreibgeschützt" className="mt-4">
          Auf dieser Umgebung lassen sich Inhalte nicht speichern. Für den laufenden Betrieb muss
          in <span className="font-mono">src/lib/data/index.ts</span> ein Datenbank-Adapter
          hinterlegt werden.
        </Alert>
      )}

      <EinstellungenFormular
        settings={settings}
        integrations={integrations}
        adapterName={storage.adapter}
        writable={storage.writable}
      />
    </div>
  );
}
