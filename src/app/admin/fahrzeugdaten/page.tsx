import type { Metadata } from 'next';

import { getCollection } from '@/lib/data';
import { Alert } from '@/components/ui/alert';
import { FahrzeugVerwaltung } from './fahrzeug-verwaltung';

export const metadata: Metadata = {
  title: 'Fahrzeugdaten und Leistungen — Backend',
  robots: { index: false, follow: false },
};

/**
 * Pflege der Fahrzeugdaten: Marken, Modelle, Schlüsselarten und die
 * Zuordnung zur Preisgruppe. Zusammen mit den Preisregeln bestimmt diese
 * Zuordnung, welcher Preis und welche Terminlänge für einen Fall gelten.
 */
export default async function AdminFahrzeugdatenPage() {
  const [makes, pricingGroups, services] = await Promise.all([
    getCollection('vehicleMakes'),
    getCollection('pricingGroups'),
    getCollection('carKeyServices'),
  ]);

  return (
    <div className="shell py-8 md:py-10">
      <header className="max-w-3xl">
        <p className="eyebrow">
          <span className="h-px w-6 bg-current" aria-hidden />
          Backend
        </p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Fahrzeugdaten und Leistungen</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
          Marken, Modelle und Leistungen bestimmen, was im Autoschlüssel-Assistenten zur Auswahl
          steht. Über die Preisgruppe je Marke oder Modell greift anschließend die passende
          Preisregel aus dem Bereich „Preise“.
        </p>
      </header>

      <Alert tone="warning" title="Zugang noch nicht beschränkt" className="mt-6">
        Das Backend ist offen erreichbar. Vor dem Livegang muss der gesamte Bereich
        <span className="font-mono"> /admin </span>
        durch eine Zugangsbeschränkung geschützt werden. Diese Anbindung ist offen und
        bewusst noch nicht gebaut.
      </Alert>

      <Alert tone="legal" title="Fachliche Prüfung steht aus" className="mt-4">
        Die hinterlegten Fahrzeugdaten sind ein pflegbares Gerüst und keine geprüfte
        Herstellerliste. Welche Schlüsselart ein Modell tatsächlich hat, ab welchem Baujahr das
        gilt und ob das Fahrzeug zum Anlernen vor Ort sein muss, gehört vor dem Livegang fachlich
        geprüft und hier nachgezogen.
      </Alert>

      <FahrzeugVerwaltung makes={makes} pricingGroups={pricingGroups} services={services} />
    </div>
  );
}
