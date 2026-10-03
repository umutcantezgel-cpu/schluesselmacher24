import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { getSettings, getVehicleMakes, getVehicleModel } from '@/lib/data';
import type { SummarySection } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { SummaryList } from '@/components/layout/summary-list';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import {
  KeyKindBadges,
  KEY_KIND_HINT,
  ON_SITE_HINT,
  keyKindDescription,
  keyKindLabel,
} from '@/components/autoschluessel/key-kinds';
import { OnSiteBadge, formatModelYears } from '@/components/autoschluessel/vehicle-facts';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';

interface PageProps {
  params: Promise<{ make: string; model: string }>;
}

export async function generateStaticParams() {
  const makes = await getVehicleMakes();
  return makes.flatMap((make) =>
    make.models.map((model) => ({ make: make.slug, model: model.slug })),
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const { make: makeSlug, model: modelSlug } = resolvedParams;
  const found = await getVehicleModel(makeSlug, modelSlug);

  if (!found) {
    return { title: 'Modell nicht gefunden' };
  }

  const { make, model } = found;
  const years = formatModelYears(model);
  const kinds = model.keyKinds.map((kind) => keyKindLabel(kind)).join(', ');

  return {
    title: `${make.name} ${model.name} Autoschlüssel (${years})`,
    description:
      kinds.length > 0
        ? `Autoschlüssel für ${make.name} ${model.name}, Baujahre ${years}. Erfasste Schlüsselarten: `
          + `${kinds}. Anfrage mit Schlüsselfotos, Preisangabe und fester Terminbuchung.`
        : `Autoschlüssel für ${make.name} ${model.name}, Baujahre ${years}. Anfrage mit `
          + 'Schlüsselfotos, Preisangabe und fester Terminbuchung.',
    alternates: { canonical: `/autoschluessel/marken/${make.slug}/${model.slug}` },
  };
}


export default async function ModelPage(props: PageProps) {
  const { make: makeSlug, model: modelSlug } = await props.params;
  const [found, settings] = await Promise.all([
    getVehicleModel(makeSlug, modelSlug),
    getSettings(),
  ]);

  if (!found) notFound();

  const { make, model } = found;
  const years = formatModelYears(model);
  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;

  // Vorbelegung des Assistenten über Suchparameter.
  const assistantHref = `/autoschluessel/anfrage?marke=${make.slug}&modell=${model.slug}`;

  // Nur Angaben, die tatsächlich im Datensatz stehen.
  const facts: SummarySection[] = [
    {
      title: 'Hinterlegte Fahrzeugangaben',
      rows: [
        { label: 'Marke', value: make.name },
        { label: 'Modell', value: model.name },
        { label: 'Baujahre', value: years },
        {
          label: 'Erfasste Schlüsselarten',
          value:
            model.keyKinds.length > 0
              ? model.keyKinds.map((kind) => keyKindLabel(kind)).join(', ')
              : '[Platzhalter: noch nicht erfasst — wir klären das anhand Ihrer Schlüsselfotos]',
        },
        {
          label: 'Fahrzeug zum Anlernen vor Ort',
          value: model.requiresVehicleOnSite ? 'Ja' : 'Nein',
        },
        ...(model.notes ? [{ label: 'Hinweis', value: model.notes }] : []),
      ],
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`${make.name} · Modell`}
        title={`Autoschlüssel für ${make.name} ${model.name}`}
        lead={`Was für dieses Modell hinterlegt ist und was das für Ihren Auftrag bedeutet. Baujahre: ${years}.`}
        crumbs={[
          { href: '/autoschluessel', label: 'Autoschlüssel' },
          { href: '/autoschluessel/marken', label: 'Marken' },
          { href: `/autoschluessel/marken/${make.slug}`, label: make.name },
          { href: `/autoschluessel/marken/${make.slug}/${model.slug}`, label: model.name },
        ]}
        actions={
          <ButtonLink href={assistantHref}>
            Mit diesem Fahrzeug starten
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
        }
      >
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <KeyKindBadges kinds={model.keyKinds} />
          <OnSiteBadge required={model.requiresVehicleOnSite} />
          <InfoTip hint={KEY_KIND_HINT} />
        </div>
      </PageHeader>

      {/* Hinterlegte Angaben */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14" style={{ viewTransitionName: `model-${make.slug}-${model.slug}` }}>
          <div>
            <SectionHeading
              title="Das ist zu diesem Modell hinterlegt"
              lead="Diese Angaben stammen aus unserem Fahrzeugdatensatz. Was darin nicht steht, erfinden wir nicht — das klären wir anhand Ihrer Schlüsselfotos."
            />
            <SummaryList sections={facts} className="mt-8" />
          </div>

          <ImagePlaceholder
            slot={{
              motif: `Produktfoto: typische Schlüsselbauformen für ${make.name} ${model.name} nebeneinander`,
              ratio: '4/3',
              note: 'Eigene Aufnahme. Kein Herstellerlogo im Bild.',
            }}
          />
        </div>
      </Section>

      {/* Bedeutung für den Kunden */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Einordnung"
          title="Was das für Ihren Auftrag bedeutet"
          lead="Die technischen Angaben allein helfen wenig. Hier steht, was daraus für Ablauf, Termin und Aufwand folgt."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 grid-rows-[subgrid] row-span-2">
          <li>
            <Card className="h-full">
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[15px] font-bold text-foreground">
                    {model.requiresVehicleOnSite
                      ? 'Ihr Fahrzeug muss zum Termin da sein'
                      : 'Ohne Fahrzeug möglich'}
                  </h3>
                  <InfoTip hint={ON_SITE_HINT} className="shrink-0" />
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  {model.requiresVehicleOnSite
                    ? 'Für dieses Modell ist zum elektronischen Anlernen Zugriff auf das Fahrzeug '
                      + 'hinterlegt. Ein Versand des Schlüssels löst die Aufgabe daher nicht. '
                      + 'Planen Sie einen Termin ein, bei dem das Fahrzeug bei uns steht.'
                    : 'Für dieses Modell ist im Datensatz kein Zugriff auf das Fahrzeug vermerkt. '
                      + 'Ob das für Ihren konkreten Auftrag gilt, hängt von der Leistung ab — rein '
                      + 'mechanische Arbeiten sind ohnehin ohne Fahrzeug möglich.'}
                </p>
              </CardBody>
            </Card>
          </li>

          <li>
            <Card className="h-full">
              <CardBody>
                <h3 className="text-[15px] font-bold text-foreground">Baujahr entscheidet mit</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  Für dieses Modell sind die Baujahre {years} erfasst. Innerhalb einer Baureihe
                  ändern sich Schlüsselsysteme im Laufe der Zeit. Geben Sie im Ablauf daher bitte
                  das Baujahr Ihres Fahrzeugs an — es beeinflusst Beschaffung und Aufwand.
                </p>
              </CardBody>
            </Card>
          </li>

          <li>
            <Card className="h-full">
              <CardBody>
                <h3 className="text-[15px] font-bold text-foreground">Anzahlung und Vorlauf</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  Die Anzahlung beträgt standardmäßig {deposit} und wird vollständig auf den
                  Gesamtpreis angerechnet. Der früheste Termin liegt etwa {leadDays} Tage in der
                  Zukunft, weil wir den passenden Schlüssel vorher beschaffen. Für einzelne
                  Leistungen können abweichende Werte gelten — diese sehen Sie im Ablauf.
                </p>
              </CardBody>
            </Card>
          </li>

          <li>
            <Card className="h-full">
              <CardBody>
                <h3 className="text-[15px] font-bold text-foreground">
                  Ein vorhandener Schlüssel hilft
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  Solange mindestens ein funktionierender Schlüssel da ist, ist der Ablauf deutlich
                  planbarer. Ist kein Schlüssel mehr vorhanden, prüfen wir Unterlagen und
                  Machbarkeit gesondert, bevor ein Termin bestätigt wird.
                </p>
              </CardBody>
            </Card>
          </li>
        </ul>
      </Section>


      {/* Architektonische Methodik & Technische Prozesse */}
      <Section>
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Technische Präzision bei der Schlüsselprogrammierung"
          lead="Erfahren Sie mehr über unsere fundierte Herangehensweise und die technischen Prozesse, die hinter der Programmierung und Fertigung Ihres neuen Autoschlüssels stehen."
        />
        <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
          <p>
            Die moderne Fahrzeugelektronik erfordert ein Höchstmaß an Präzision und tiefgreifendes technisches Verständnis. Bei der Programmierung von Autoschlüsseln für aktuelle Fahrzeugmodelle greifen wir auf fortschrittliche Diagnosesysteme und spezialisierte Softwarelösungen zurück, die eine nahtlose Integration des neuen Schlüssels in die bestehende Wegfahrsperren-Architektur (Immobilizer) gewährleisten. Dieser Prozess ist weit mehr als nur ein einfaches &quot;Kopieren&quot; von Daten.
          </p>
          <p>
            Jeder Fahrzeughersteller, und oft sogar spezifische Modellreihen, verwendet proprietäre Verschlüsselungsalgorithmen und Kommunikationsprotokolle. Unsere technische Methodik basiert auf einer detaillierten Analyse dieser Systeme. Zunächst erfolgt eine umfassende Diagnose des Body Control Modules (BCM) oder der Engine Control Unit (ECU), um den aktuellen Status der registrierten Schlüssel zu evaluieren und eventuell verlorene Schlüssel aus Sicherheitsgründen aus dem System zu de-registrieren.
          </p>
          <p>
            Anschließend bereiten wir den Transponderchip des neuen Schlüssels vor. Dieser Chip, oft ein hochsicherer Krypto-Transponder (z.B. NXP Hitag, Texas Instruments Crypto), muss mit den spezifischen Sicherheitsdaten des Fahrzeugs beschrieben werden. Hierbei wenden wir kryptografische Verfahren an, die den Herstellervorgaben entsprechen, um sicherzustellen, dass das Fahrzeug den neuen Schlüssel eindeutig und sicher authentifizieren kann.
          </p>
          <p>
            Ein kritischer Aspekt unserer Methodik ist die Wahrung der Datenintegrität. Alle Programmiervorgänge werden streng überwacht, und es wird sichergestellt, dass keine korrupten Daten in die Steuergeräte des Fahrzeugs geschrieben werden. Dies erfordert nicht nur hochwertige Hardware-Interfaces, sondern auch kontinuierlich aktualisierte Datenbanken und Software-Tools, um mit den neuesten Firmware-Updates der Fahrzeughersteller Schritt zu halten.
          </p>
          <p>
            Darüber hinaus legen wir großen Wert auf die mechanische Präzision beim Fräsen des Schlüsselbarts. Mittels CNC-gesteuerter Hochpräzisionsfräsmaschinen fertigen wir den Schlüsselbart exakt nach den werkseitigen Schließungscodes an. Dies garantiert nicht nur eine perfekte Funktion in den mechanischen Tür- und Zündschlössern, sondern minimiert auch den Verschleiß der Schließzylinder. Unsere Kombination aus elektronischer Expertise und mechanischer Präzision stellt sicher, dass der von uns gefertigte Schlüssel dem Original in nichts nachsteht – weder in der Funktion noch in der Langlebigkeit.
          </p>
        </div>
      </Section>

      {/* Leistungsstufen / Vergleichsmatrix */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Leistungsstufen"
          title="Transparente Optionen für Ihre Anforderungen"
          lead="Wir bieten verschiedene Leistungsstufen an, um den spezifischen Bedürfnissen und dem Budget unserer Kunden gerecht zu werden. Vergleichen Sie die Optionen, um die für Sie passende Lösung zu finden."
        />
        <div className="mt-8 overflow-x-auto rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
          <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)]">
            <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
              <tr>
                <th className="border-b border-[oklch(0.89_0.008_260/0.55)] p-4 font-semibold">Leistung / Feature</th>
                <th className="border-b border-[oklch(0.89_0.008_260/0.55)] p-4 font-semibold">Standard (Kopie)</th>
                <th className="border-b border-[oklch(0.89_0.008_260/0.55)] p-4 font-semibold">Premium (OEM-Qualität)</th>
                <th className="border-b border-[oklch(0.89_0.008_260/0.55)] p-4 font-semibold">All-Inclusive (Vor Ort)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
              <tr>
                <td className="p-4 font-medium">Materialqualität</td>
                <td className="p-4">Hochwertiger Aftermarket</td>
                <td className="p-4">Originalteil (OEM) oder vergleichbar</td>
                <td className="p-4">Originalteil (OEM)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Programmierung Wegfahrsperre</td>
                <td className="p-4">Inklusive</td>
                <td className="p-4">Inklusive</td>
                <td className="p-4">Inklusive</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Programmierung Funkfernbedienung</td>
                <td className="p-4">Modellabhängig</td>
                <td className="p-4">Inklusive</td>
                <td className="p-4">Inklusive</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">De-Registrierung verlorener Schlüssel</td>
                <td className="p-4">Optional (+ Aufpreis)</td>
                <td className="p-4">Inklusive</td>
                <td className="p-4">Inklusive</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Mechanisches Fräsen (CNC)</td>
                <td className="p-4">Inklusive</td>
                <td className="p-4">Inklusive</td>
                <td className="p-4">Inklusive</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Vor-Ort-Service am Fahrzeug</td>
                <td className="p-4">Nicht verfügbar</td>
                <td className="p-4">Nicht verfügbar</td>
                <td className="p-4">Inklusive (bis 50km)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Garantie auf Funktion</td>
                <td className="p-4">12 Monate</td>
                <td className="p-4">24 Monate</td>
                <td className="p-4">24 Monate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Interaktives Modul */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
          <div>
            <SectionHeading
              title="Kalkulieren Sie Ihr Projektbudget"
              lead="Nutzen Sie unseren interaktiven Kalkulator, um eine erste Einschätzung für den Umfang und die Kosten Ihres Auftrags zu erhalten."
            />
            <p className="mt-4 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Bitte beachten Sie, dass es sich hierbei um einen Richtwert handelt. Der finale Preis hängt von den spezifischen Anforderungen Ihres Fahrzeugs, dem genauen Baujahr und der gewählten Leistungsstufe ab. Für ein verbindliches Angebot reichen Sie bitte eine Anfrage mit Ihren Fahrzeugdaten ein.
            </p>
          </div>
          <ServiceBudgetCalculator />
        </div>
      </Section>

      {/* FAQ Abschnitt */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Fachwissen zur Schlüsselprogrammierung"
          lead="Wir beantworten die wichtigsten technischen und prozessualen Fragen rund um das Thema Autoschlüssel."
        />
        <div className="mt-8 space-y-6">
          <Card className="bg-[oklch(0.988_0.002_260)]">
            <CardBody>
              <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">1. Warum ist die Programmierung der Wegfahrsperre so komplex?</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Die Wegfahrsperre (Immobilizer) ist ein zentrales Sicherheitsmerkmal moderner Fahrzeuge, das Fahrzeugdiebstahl verhindern soll. Sie besteht aus einem komplexen Zusammenspiel zwischen dem Transponderchip im Schlüssel, der Lesespule am Zündschloss und verschiedenen Steuergeräten (wie ECU und BCM). Die Kommunikation zwischen diesen Komponenten ist stark verschlüsselt und ändert sich oft dynamisch (Rolling Code). Um einen neuen Schlüssel anzulernen, müssen wir mit spezieller Diagnosetechnik autorisierten Zugriff auf diese Systeme erhalten und die spezifischen kryptografischen Schlüsselpaare sicher übertragen.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-[oklch(0.988_0.002_260)]">
            <CardBody>
              <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">2. Kann ein Schlüssel ohne das Originalfahrzeug nachgemacht werden?</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Die Machbarkeit hängt stark von der Generation der Wegfahrsperre ab. Bei älteren Systemen mit Festcode-Transpondern oder frühen Krypto-Systemen ist es oft möglich, den Chip des funktionierenden Originalschlüssels zu &quot;klonen&quot;, ohne dass das Fahrzeug vor Ort sein muss. Bei den meisten modernen Fahrzeugen (ab ca. Baujahr 2010) wird der Schlüssel jedoch direkt im Steuergerät des Fahrzeugs registriert (angelernt). Für diesen OBD-Programmiervorgang ist zwingend der physische Zugriff auf das Fahrzeug und dessen Diagnoseschnittstelle erforderlich.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-[oklch(0.988_0.002_260)]">
            <CardBody>
              <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">3. Was passiert, wenn alle Autoschlüssel verloren wurden (All Keys Lost)?</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Ein &quot;All Keys Lost&quot; (AKL) Szenario ist technisch wesentlich anspruchsvoller. Da kein funktionierender Schlüssel zur Vor-Authentifizierung vorliegt, müssen wir erweiterte Diagnoseverfahren anwenden, um den Programmiermodus der Steuergeräte zu aktivieren. In einigen Fällen erfordert dies sogar den Ausbau spezifischer Module (wie das Kombiinstrument oder das BCM), um die Sicherheitsdaten direkt aus den EEPROM-Speicherbausteinen auszulesen. Zudem müssen die mechanischen Schließungscodes über die Fahrgestellnummer (VIN) beim Hersteller abgefragt oder durch Dekodierung eines Türschlosses ermittelt werden.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-[oklch(0.988_0.002_260)]">
            <CardBody>
              <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">4. Welche Daten benötigen Sie zur Prüfung der Machbarkeit?</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Um eine präzise technische Einschätzung abgeben zu können, benötigen wir neben der genauen Modellbezeichnung und dem Baujahr zwingend ein Foto des Zulassungsbescheinigung Teil 1 (Fahrzeugschein), um die exakte Variante über die Fahrgestellnummer (VIN) und Typschlüsselnummern (HSN/TSN) zu identifizieren. Ebenso wichtig sind detaillierte Fotos eines noch vorhandenen Originalschlüssels, da das äußere Design oft Rückschlüsse auf die verwendete Transponder- und Elektronikgeneration zulässt.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-[oklch(0.988_0.002_260)]">
            <CardBody>
              <h4 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">5. Werden verlorene Schlüssel aus dem System gelöscht?</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Ja, aus Sicherheitsgründen empfehlen wir dringend, alle nicht mehr in Ihrem Besitz befindlichen Schlüssel aus den Steuergeräten des Fahrzeugs zu de-registrieren. Bei der Neuanlernung von Schlüsseln können wir den Speicher der Wegfahrsperre so konfigurieren, dass ausschließlich die aktuell vorliegenden Schlüssel autorisiert sind. Dies verhindert effektiv, dass das Fahrzeug mit einem gestohlenen oder verlorenen Schlüssel gestartet werden kann.
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>


      {/* Schlüsselarten im Detail */}
      {model.keyKinds.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Schlüsselarten"
            title={`Diese Bauformen kommen beim ${make.name} ${model.name} vor`}
            lead="Welche davon Ihr Fahrzeug hat, erkennen wir an Ihren Schlüsselfotos."
          />

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {model.keyKinds.map((kind) => {
              const description = keyKindDescription(kind);
              return (
                <li key={kind}>
                  <Card className="h-full" variant="outline">
                    <CardBody>
                      <h3 className="text-[15px] font-bold text-foreground">
                        {keyKindLabel(kind)}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                        {description
                          ?? '[Platzhalter: Beschreibung dieser Schlüsselart ergänzen]'}
                      </p>
                    </CardBody>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* Was wir nicht wissen */}
      <Section tone="muted" tight>
        <SectionHeading
          title="Was wir ohne Ihre Unterlagen nicht sagen können"
          className="max-w-2xl"
        />
        <Alert tone="warning" title="Angaben ohne Gewähr für Ihr konkretes Fahrzeug" className="mt-6">
          Der Datensatz beschreibt die Baureihe, nicht Ihr einzelnes Fahrzeug. Ausstattung,
          Sonderausstattung, Umbauten und das genaue Baujahr können abweichen. Wir legen uns erst
          fest, wenn uns Ihre Schlüsselfotos und der Fahrzeugschein vorliegen. Angaben, die hier
          nicht stehen — etwa Rohlingstyp oder Elektronikvariante —, klären wir in der Prüfung und
          nennen sie Ihnen vor der Terminbestätigung.
        </Alert>
      </Section>

      {/* Nächster Schritt */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading
              title="Der nächste Schritt"
              lead="Marke und Modell sind im Ablauf schon vorbelegt. Sie ergänzen Baujahr, Schlüsselart und Ihre Fotos."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={assistantHref} size="lg">
                {make.name} {model.name} auswählen
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <ButtonLink
                href={`/autoschluessel/marken/${make.slug}`}
                size="lg"
                variant="outline"
              >
                Andere {make.name}-Modelle
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="Weiterführende Seiten">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Passend dazu
            </h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {[
                { href: '/autoschluessel/nachmachen', label: 'Autoschlüssel nachmachen' },
                { href: '/autoschluessel/programmieren', label: 'Programmieren und anlernen' },
                ...(model.keyKinds.includes('smart-key') || model.keyKinds.includes('keyless')
                  ? [{ href: '/autoschluessel/smart-key', label: 'Smart Key und Keyless' }]
                  : []),
                ...(model.keyKinds.includes('funk') || model.keyKinds.includes('klappschluessel')
                  ? [{ href: '/autoschluessel/funkschluessel', label: 'Funkschlüssel' }]
                  : []),
                ...(model.keyKinds.includes('mechanisch')
                  ? [{ href: '/autoschluessel/schluesselbart-fraesen', label: 'Schlüsselbart fräsen' }]
                  : []),
                { href: `/autoschluessel/marken/${make.slug}`, label: `Alle ${make.name}-Modelle` },
                { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex min-h-[44px] items-center justify-between gap-4 py-3 text-[15px] font-semibold text-foreground hover:text-primary"
                  >
                    {link.label}
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Section>
    </>
  );
}
