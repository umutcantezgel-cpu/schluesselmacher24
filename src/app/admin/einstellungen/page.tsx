import type { Metadata } from 'next';

import { contentWritable, getCollection } from '@/lib/data';
import { integrationStatuses } from '@/lib/integrations';
import { Alert } from '@/components/ui/alert';
import { EinstellungenFormular } from './einstellungen-formular';
import { AdminAnalyticsDashboard } from '@/components/dashboard/admin-analytics-dashboard';

export const metadata: Metadata = {
  title: 'Einstellungen — Backend',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Firmendaten, Aufbewahrungsfristen, Status der externen Anbindungen und
 * Angaben zur Datenhaltung. Zugangsdaten werden hier bewusst weder
 * abgefragt noch gespeichert — sie stehen ausschließlich in
 * Umgebungsvariablen.
 */
export default async function AdminEinstellungenPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const [settings, integrations, storage] = await Promise.all([
    getCollection('settings'),
    Promise.resolve(integrationStatuses()),
    contentWritable(),
  ]);

  return (
    <div className="shell py-16 md:py-24 lg:py-32" data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <header className="max-w-3xl mb-12">
        <p className="eyebrow mb-4 flex items-center text-[oklch(0.52_0.015_260)] font-semibold uppercase tracking-wider text-sm">
          <span className="h-px w-6 bg-current mr-3" aria-hidden />
          Systemadministration
        </p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
          Verwaltung der Systemeinstellungen
        </h1>
        <div className="mt-6 text-[oklch(0.32_0.02_260)] leading-relaxed space-y-4">
          <p>
            Willkommen im administrativen Kontrollzentrum. Diese Seite bietet einen detaillierten Überblick über alle essenziellen Firmendaten, die Konfiguration der Aufbewahrungsfristen und den Status der externen Systemanbindungen. Die hier hinterlegten Firmendaten bilden das rechtliche und kommunikative Fundament der Plattform und werden dynamisch in das Impressum, die Datenschutzerklärung, den globalen Fußbereich sowie in die strukturierten Daten (Schema.org) für Suchmaschinen integriert.
          </p>
          <p>
            Die Verwaltung dieser Systemeinstellungen erfordert höchste Präzision, da jede Änderung direkte Auswirkungen auf die Außendarstellung und die rechtliche Konformität der Website hat. Unser System ist darauf ausgelegt, Änderungen sofort und konsistent über alle angeschlossenen Module hinweg zu propagieren.
          </p>
        </div>
      </header>

      <section className="mb-16">
        <AdminAnalyticsDashboard />
      </section>

      <div className="grid gap-8 lg:grid-cols-3 mb-16">
        <div className="lg:col-span-2 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
          <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">Sicherheits-Audit und Zugriffskontrolle</h2>
          <p>
            Die Sicherheit der administrativen Bereiche hat oberste Priorität. Aktuell ist das Backend noch ohne spezifische Authentifizierungsbarrieren erreichbar, was für den Entwicklungs- und Staging-Betrieb vorgesehen ist. Vor dem produktiven Livegang muss der gesamte Pfad <code className="font-mono text-sm bg-[oklch(0.968_0.004_260)] px-1 rounded border border-[oklch(0.89_0.008_260)]">/admin</code> durch eine robuste Zugangsbeschränkung, wie beispielsweise OAuth2 oder eine strikte Session-basierte Authentifizierung, geschützt werden.
          </p>
          <p>
            Die Zugangsdaten für externe Services und Datenbanken werden aus Sicherheitsgründen niemals im Klartext in der Benutzeroberfläche angezeigt oder über dieses Formular verarbeitet. Stattdessen nutzt die Architektur ausschließlich Umgebungsvariablen (Environment Variables), die auf Serverebene injiziert werden. Dies verhindert versehentliche Leaks und entspricht den Best Practices für die sichere Konfiguration von Cloud-Anwendungen.
          </p>

          <h3 className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-8">Übersicht der Administrativen Aufgaben</h3>
          <p>
            Als Administrator sind Sie verantwortlich für die Pflege der Stammdaten. Dazu gehört die regelmäßige Überprüfung der Kontaktinformationen, um sicherzustellen, dass Kundenanfragen korrekt weitergeleitet werden. Ein weiterer kritischer Aspekt ist die Definition der Aufbewahrungsfristen für hochgeladene Kundenunterlagen. Diese Fristen müssen in Einklang mit den geltenden Datenschutzrichtlinien (DSGVO) und den gesetzlichen Aufbewahrungspflichten für Geschäftsunterlagen stehen.
          </p>
          <p>
            Das System bietet zudem eine transparente Übersicht über alle externen Anbindungen. Sie können jederzeit überprüfen, welche Schnittstellen aktiv sind, welche Umgebungsvariablen für den Betrieb erforderlich sind und ob eventuell Konfigurationsparameter fehlen. Fehlt eine Datei im Content-Verzeichnis, greift das System automatisch auf den eingebauten Standardinhalt zurück, sodass eine frisch aufgesetzte Umgebung sofort und ohne manuelle Eingriffe vollständig funktionsfähig ist.
          </p>
        </div>

        <div className="space-y-6">
          <Alert tone="warning" title="Zugang noch nicht beschränkt" className="shadow-sm">
            Das Backend ist offen erreichbar. Vor dem Livegang muss der gesamte Bereich
            <span className="font-mono mx-1 font-semibold">/admin</span>
            durch eine Zugangsbeschränkung geschützt werden. Diese Anbindung ist offen und bewusst noch nicht gebaut.
          </Alert>

          {!storage.writable && (
            <Alert tone="warning" title="Inhalte sind schreibgeschützt" className="shadow-sm">
              Auf dieser Umgebung lassen sich Inhalte nicht speichern. Für den laufenden Betrieb muss in <span className="font-mono mx-1 font-semibold">src/lib/data/index.ts</span> ein Datenbank-Adapter hinterlegt werden.
            </Alert>
          )}
        </div>
      </div>

      <section className="mb-16">
        <EinstellungenFormular
          settings={settings}
          integrations={integrations}
          adapterName={storage.adapter}
          writable={storage.writable}
        />
      </section>

      <section className="mt-24 pt-16 border-t border-[oklch(0.89_0.008_260/0.55)]">
        <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mb-8">Häufig gestellte Fragen (FAQ)</h2>
        <div className="grid gap-6">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 transition-all hover:border-[oklch(0.89_0.008_260)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Warum sehe ich keine Passwörter oder API-Keys in den Einstellungen?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Aus Sicherheitsgründen speichert dieses Backend-Modul keine sensitiven Zugangsdaten. Alle Keys und Passwörter werden strikt über Server-Umgebungsvariablen (.env) verwaltet, um das Risiko von Datenlecks zu minimieren.</p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 transition-all hover:border-[oklch(0.89_0.008_260)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Was passiert, wenn eine Content-Datei fehlt?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Das System ist resilient aufgebaut. Fehlt eine spezifische JSON-Datei im Content-Ordner, wird automatisch auf die Standardinhalte im Verzeichnis <code className="font-mono text-sm">src/lib/data/defaults/</code> zurückgegriffen. So bleibt die Anwendung immer lauffähig.</p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 transition-all hover:border-[oklch(0.89_0.008_260)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie werden die Aufbewahrungsfristen angewendet?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Die hier definierten Fristen (in Tagen) gelten für hochgeladene Kundenunterlagen. Sie werden zudem automatisch in die Datenschutzerklärung übernommen. Bitte beachten Sie, dass gesetzliche Aufbewahrungspflichten für Belege davon unberührt bleiben.</p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 transition-all hover:border-[oklch(0.89_0.008_260)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Warum ist das Formular schreibgeschützt?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Wenn die Plattform auf einem System mit schreibgeschütztem Dateisystem (wie Vercel) läuft, können lokale JSON-Dateien nicht verändert werden. Für schreibenden Zugriff muss ein Datenbank-Adapter in <code className="font-mono text-sm">src/lib/data/index.ts</code> konfiguriert werden.</p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 transition-all hover:border-[oklch(0.89_0.008_260)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie schütze ich den Admin-Bereich vor dem Livegang?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Der <code className="font-mono text-sm">/admin</code>-Pfad muss durch eine Middleware oder eine Layout-basierte Authentifizierung abgesichert werden. Wir empfehlen die Implementierung einer robusten Session-Kontrolle, bevor echte Nutzer auf die Plattform zugreifen.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
