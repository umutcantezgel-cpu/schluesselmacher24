import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BellRing,
  Camera,
  Layers,
  Lock,
  ShieldCheck,
  Siren,
  Smartphone,
} from 'lucide-react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { InteractiveSecurityMatrix } from '@/components/sicherheitstechnik/interactive-security-matrix';

const ROUTE = 'sicherheitstechnik';

interface Props {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  await searchParams;
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Sicherheitstechnik',
    description:
      page?.seo.description
      ?? 'Videoüberwachung, Alarmtechnik, Sicherung der Außenhaut, mechanischer Schutz und kombinierte Konzepte.',
    alternates: { canonical: `/${ROUTE}` },
  };
}



const SERVICE_ICONS: Record<string, React.ElementType> = {
  videoueberwachung: Camera,
  alarmanlagen: Siren,
  zutrittskontrolle: Smartphone,
  gebaeudehuelle: Layers,
  gelaendeabsicherung: Lock,
  'smarte-gebaeude': BellRing,
};

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  void (await params);
  void (await searchParams);

  const page = await getPageContent(ROUTE);
  const services = await getServicePages(ROUTE);

  const process = {
    label: (PROCESS_LABELS as unknown as Record<string, { label: string }>)["sicherheitscheck"]?.label || "Bestandsaufnahme & Umsetzung",
    hint: 'Ablauf: Bestandsaufnahme → Konzept → Installation → Übergabe',
  };

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.seo.title ?? 'Sicherheitstechnik',
          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }],
        })}
      />

      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.seo.title ?? 'Umfassende Sicherheitstechnik'}
        lead={page?.seo.description ?? 'Ganzheitliche Absicherung für private und gewerbliche Objekte.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }]}
        actions={
          <ButtonLink href={`/${ROUTE}/sicherheitscheck`} size="lg">
            Sicherheitscheck starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Fundierte Fachkompetenz und Einordnung */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Architektur der Sicherheit"
              title="Ein ganzheitliches Sicherheitskonzept folgt klaren Prinzipien"
              lead="Sicherheit ist kein Zustand, der durch den Kauf einzelner Komponenten erreicht wird. Es ist ein prozessuales Zusammenspiel aus physischer Barriere, intelligenter Meldetechnik und organisatorischen Abläufen."
            />

            <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              <p>
                Der Grundpfeiler jedes soliden Sicherheitskonzepts ist die mechanische Absicherung. Eine Einbruchmeldeanlage (Alarmanlage) verhindert keinen Einbruch – sie meldet ihn lediglich. Ohne einen massiven physischen Widerstand, der den Täter aufhält (Türen, Fenster, Beschläge, Schließzylinder), verpufft der Effekt elektronischer Systeme. Erst wenn die Mechanik den Eindringling signifikant verzögert, kann die Meldetechnik ihren Zweck erfüllen: Die Zeitspanne bis zum Eintreffen von Interventionskräften (z. B. Polizei oder Wachschutz) effektiv zu überbrücken.
              </p>
              <p>
                Darauf aufbauend integrieren wir elektronische Zutrittslösungen und Videoüberwachung. Moderne Zutrittskontrollen lösen das klassische Schlüsselmanagement ab, indem sie temporäre Berechtigungen, Protokollierungen und den sofortigen Entzug von Zugangsrechten bei Schlüsselverlust ermöglichen. Videoüberwachung dient als forensisches Mittel zur Täteridentifikation und als starkes psychologisches Präventionsinstrument.
              </p>
              <p>
                Unsere Methodik basiert auf einer rigorosen Risiko- und Schwachstellenanalyse vor Ort. Wir betrachten Ihr Objekt nicht isoliert, sondern bewerten Umgebungsfaktoren, Täterprofile und bauliche Gegebenheiten. Das Ergebnis ist eine maßgeschneiderte Sicherheitsarchitektur, die den strengen Richtlinien des VdS und den DIN-Normen (insbesondere DIN EN 1627 für Einbruchhemmung) entspricht.
              </p>
            </div>

            <dl className="mt-8 space-y-4">
              <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-5">
                <dt className="flex items-center gap-2 text-[15px] font-bold text-[oklch(0.16_0.02_260)]">
                  <Lock size={18} className="text-[oklch(0.52_0.24_260)]" aria-hidden />
                  Mechanischer Widerstand
                </dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                  Verstärkung der Gebäudehülle durch zertifizierte Schließzylinder, Schutzbeschläge und Mehrfachverriegelungen. Ziel ist die maximale Verzögerung des Eindringens.
                </dd>
              </div>
              <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-5">
                <dt className="flex items-center gap-2 text-[15px] font-bold text-[oklch(0.16_0.02_260)]">
                  <BellRing size={18} className="text-[oklch(0.52_0.24_260)]" aria-hidden />
                  Elektronische Detektion
                </dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                  Frühzeitige Erkennung von Manipulationsversuchen durch Außenhautüberwachung (Magnetkontakte) und Raumüberwachung (Bewegungsmelder), gekoppelt an Alarmierungsketten.
                </dd>
              </div>
            </dl>
          </div>

          <div className="space-y-6 lg:sticky lg:top-8">
            <ImagePlaceholder
              slot={{
                motif: 'Objektfoto: Hauseingang mit IP-Außenkamera, verdecktem Türkontakt und VdS-zertifiziertem Sicherheitsbeschlag',
                ratio: '4/3',
                note: 'Reales Projektbeispiel zur Illustration integrierter Sicherheit.',
              }}
            />

            <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 shadow-[0_4px_12px_-4px_oklch(0.16_0.02_260/0.04)]">
              <p className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
                Ablauf in diesem Bereich
              </p>
              <p className="mt-2 text-[15px] font-bold text-[oklch(0.16_0.02_260)]">
                {process.label}
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {process.hint}
              </p>
              <div className="mt-5">
                <ButtonLink href={`/${ROUTE}/sicherheitscheck`} variant="outline" className="w-full justify-center">
                  Sicherheitscheck starten
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Interactive Matrix Section */}
      <Section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Evaluation"
            title="Ermitteln Sie Ihren Schutzbedarf"
            lead="Nutzen Sie unsere interaktive Matrix, um eine erste Einschätzung Ihres aktuellen Sicherheitsniveaus zu erhalten. Das Tool simuliert potenzielle Schwachstellen und generiert erste Empfehlungen."
            align="center"
          />
          <div className="mt-12">
            <InteractiveSecurityMatrix />
          </div>
        </div>
      </Section>

      {/* Leistungsmatrix / Vergleich */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Klassifizierung"
          title="Schutzklassen und Ausstattungsstufen im Vergleich"
          lead="Unsere Konzepte orientieren sich an den etablierten DIN-Normen und VdS-Klassen. Die folgende Matrix veranschaulicht die Skalierung der Sicherheitsmaßnahmen vom Basisschutz bis zur Hochsicherheit."
        />

        <div className="mt-8 overflow-x-auto rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white shadow-sm">
          <table className="w-full text-left text-[14px] text-[oklch(0.32_0.02_260)]">
            <thead className="bg-[oklch(0.968_0.004_260)] text-[13px] font-bold uppercase tracking-wider text-[oklch(0.16_0.02_260)]">
              <tr>
                <th className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Schutzstufe</th>
                <th className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Mechanik (Türen/Fenster)</th>
                <th className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Elektronik & Detektion</th>
                <th className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Zutrittsverwaltung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
              <tr>
                <td className="p-4 font-semibold text-[oklch(0.16_0.02_260)]">Basis (RC2 Äquivalent)</td>
                <td className="p-4">Pilzkopfverriegelungen, Profilzylinder mit Bohr- und Ziehschutz</td>
                <td className="p-4">Lokale Rauchmelder, Basis-Alarmsystem (optisch/akustisch)</td>
                <td className="p-4">Mechanische Einzelschließung mit Sicherungskarte</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[oklch(0.16_0.02_260)]">Erweitert (RC3 Äquivalent)</td>
                <td className="p-4">Mehrfachverriegelungen, einbruchhemmende Verglasung, Querriegel</td>
                <td className="p-4">Aufgeschaltete EMA (Einbruchmeldeanlage), Außenhautüberwachung</td>
                <td className="p-4">Elektronische Schließzylinder (Standalone), Transponder</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[oklch(0.16_0.02_260)]">Hochsicherheit (RC4+)</td>
                <td className="p-4">Massive Stahltüren, durchwurfhemmende Verglasung (P6B)</td>
                <td className="p-4">Video-Verifikation (IP), VdS-zertifizierte EMA, Sabotageschutz</td>
                <td className="p-4">Vernetzte Zutrittskontrolle, biometrische Erfassung, Protokollierung</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Fachspezifischer FAQ */}
      <Section>
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Technische & Organisatorische Expertise"
          lead="Wir beantworten die wichtigsten Fragen zur architektonischen Planung von Sicherheitssystemen."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">Ersetzt eine Kamera die Alarmanlage?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Nein. Eine Kamera dient primär der Verifikation und der nachträglichen Aufklärung. Sie meldet im Regelfall nicht aktiv einen Einbruch an eine Notruf- und Serviceleitstelle (NSL). Die Alarmanlage (EMA) ist für die verlässliche Detektion und Alarmierung zuständig, die Videotechnik liefert das visuelle Beweismaterial.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">Was bedeutet Außenhautüberwachung?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Bei der Außenhautüberwachung werden alle Fenster und Türen der Gebäudehülle mit Magnetkontakten oder Glasbruchmeldern ausgestattet. Der große Vorteil: Die Alarmanlage kann scharfgeschaltet werden, während sich Personen im Gebäude aufhalten (sog. Internschärfung).
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">Wie sicher sind smarte (elektronische) Türschlösser?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Professionelle Systeme nutzen AES-128 oder AES-256 Verschlüsselung für die Funkübertragung. Entscheidend ist jedoch, dass die mechanische Basis – der Profilzylinder, in dem der elektronische Knauf sitzt – über einen zertifizierten Bohr- und Ziehschutz verfügt.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
            <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">Wann ist eine Aufschaltung auf einen Wachdienst sinnvoll?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Besonders bei gewerblichen Objekten oder abgelegenen Privatgebäuden. Eine reine lokale Alarmierung (Sirene) wird heute oft ignoriert. Eine Aufschaltung stellt sicher, dass bei einem Alarm (oder auch bei technischen Störungen wie Sabotage oder Stromausfall) sofort ein definierter Interventionsplan abläuft.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 md:col-span-2">
            <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">Was muss ich rechtlich bei der Videoüberwachung beachten?</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Der Betrieb von Kameras unterliegt strengen Datenschutzvorgaben (DSGVO). Es dürfen grundsätzlich nur das eigene Grundstück erfasst werden – öffentliche Bereiche (Gehwege) oder Nachbargrundstücke sind tabu. Zudem besteht eine Hinweispflicht (Beschilderung) und es müssen Löschfristen für die Aufzeichnungen definiert und eingehalten werden. Bei gewerblicher Nutzung ist zudem die Mitbestimmung des Betriebsrats zu beachten.
            </p>
          </div>
        </div>
      </Section>

      {/* Bereiche und Module */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Bereiche"
          title="Modulare Systeme, die nahtlos ineinandergreifen"
          lead="Einzeln betrachtet bleibt jeder Bereich Stückwerk. Welche Kombination zu Ihrem Objekt passt, klären wir in der Bestandsaufnahme."
        />

        {services.length > 0 && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = SERVICE_ICONS[service.slug] ?? ShieldCheck;
              return (
                <li key={service.id}>
                  <Link
                    href={`/${ROUTE}/${service.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-5 transition-colors hover:border-[oklch(0.52_0.24_260)] shadow-[0_2px_8px_0_oklch(0.16_0.02_260/0.02)] hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.06)]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.968_0.004_260)] text-[oklch(0.52_0.24_260)]">
                      <Icon size={19} aria-hidden />
                    </span>
                    <span className="mt-4 block text-[15px] font-bold text-[oklch(0.16_0.02_260)] group-hover:text-[oklch(0.52_0.24_260)] transition-colors">
                      {service.title}
                    </span>
                    <span className="mt-1.5 block flex-1 text-[13px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                      {service.summary}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[oklch(0.52_0.015_260)]">
                      Details ansehen
                      <ArrowRight
                        size={13}
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* Recht und Verantwortung Alert */}
      <Section id="recht-und-verantwortung" tight>
        <Alert
          tone="legal"
          title="Verantwortlich für die Nutzung ist die Betreiberin oder der Betreiber der Anlage"
          className="mt-4 border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] text-[oklch(0.16_0.02_260)]"
        >
          <ul className="space-y-2 text-[14px] leading-relaxed">
            <li>
              Wer eine Anlage mit Video-, Audio- oder Protokollfunktion betreibt, verantwortet deren rechtmäßige Nutzung — also Zweck, Umfang, Speicherdauer, Zugriff und Kennzeichnung. Wir liefern und montieren die Technik und beraten technisch; eine Rechtsberatung ist das ausdrücklich nicht.
            </li>
            <li>
              Kameras dürfen öffentliche Flächen wie Gehwege und Straßen sowie Nachbargrundstücke nicht erfassen. Wir planen Aufstellort, Blickfeld und Begrenzung des Bildausschnitts entsprechend.
            </li>
          </ul>

          <p className="mt-3">
            <Link
              href="/rechtliches/datenschutz"
              className="text-[14px] font-semibold text-[oklch(0.52_0.24_260)] hover:underline"
            >
              Hinweise zum Datenschutz
            </Link>
          </p>
        </Alert>
      </Section>

      {/* Weiterführende Seiten */}
      {page && page.seo.internalLinks.length > 0 && (
        <Section tight>
          <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {page.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 text-[14px] font-semibold text-[oklch(0.16_0.02_260)] transition-colors hover:border-[oklch(0.52_0.24_260)] hover:text-[oklch(0.52_0.24_260)]"
                >
                  {link.label}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
