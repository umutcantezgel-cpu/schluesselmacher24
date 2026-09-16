import type { Metadata } from 'next';

import { getCollection } from '@/lib/data';
import { Alert } from '@/components/ui/alert';
import { PreisVerwaltung } from './preis-verwaltung';

export const metadata: Metadata = {
  title: 'Preise und Grundwerte — Backend',
  robots: { index: false, follow: false },
};

/**
 * Pflege aller Werte, die Preis, Anzahlung, Vorlauf und Terminlänge
 * bestimmen. Es steht bewusst kein Betrag und keine Frist im Quellcode —
 * alles kommt aus der Datenschicht und wird hier ohne Entwickler geändert.
 */
export default async function AdminPreisePage() {
  const [settings, pricingGroups, services, rules] = await Promise.all([
    getCollection('settings'),
    getCollection('pricingGroups'),
    getCollection('carKeyServices'),
    getCollection('pricingRules'),
  ]);

  return (
    <div className="shell py-8 md:py-10">
      <header className="max-w-3xl">
        <p className="eyebrow">
          <span className="h-px w-6 bg-current" aria-hidden />
          Backend
        </p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">
          Preise, Anzahlung und Terminwerte
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
          Hier werden die Werte gepflegt, mit denen die Kundenseite rechnet: Grundwerte für
          Vorlauf, Anzahlung und Terminlänge, die Preisregeln je Fahrzeuggruppe und Leistung
          sowie die Versandarten des Shops. Jeder Abschnitt wird einzeln gespeichert.
        </p>
      </header>

      <Alert tone="warning" title="Zugang noch nicht beschränkt" className="mt-6">
        Das Backend ist offen erreichbar. Vor dem Livegang muss der gesamte Bereich
        <span className="font-mono"> /admin </span>
        durch eine Zugangsbeschränkung geschützt werden. Diese Anbindung ist offen und
        bewusst noch nicht gebaut.
      </Alert>

      <PreisVerwaltung
        settings={settings}
        pricingGroups={pricingGroups}
        services={services}
        rules={rules}
      />
    </div>
  );
}
