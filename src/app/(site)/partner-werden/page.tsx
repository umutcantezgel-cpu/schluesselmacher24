import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageContent } from '@/lib/data';
import type { IconProps } from '@/components/visual/icons/icon-base';
import { IconNachweis } from '@/components/visual/icons/nachweis';
import { IconPruefung } from '@/components/visual/icons/pruefung';
import { IconWerkstatt } from '@/components/visual/icons/werkstatt';
import { IconZahlung } from '@/components/visual/icons/zahlung';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

import { PartnerFormular } from './partner-formular';
import { PartnerProvisionsRechner } from '@/components/partner/partner-provisions-rechner';


const ROUTE = 'partner-werden';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Partner werden – Auftragsvermittlung für Fachbetriebe',
    description:
      page?.seo.description
      ?? 'Für Schlüsseldienste und Fachbetriebe: Bewerben Sie sich als Partner von SCHLÜSSELMACHER24. '
        + 'Wir prüfen Anfragen und vermitteln sie an geprüfte Betriebe vor Ort.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/* Ablauf einer Vermittlung (Erg. Leitfaden §6). Die Höhe der Provision steht im Partnervertrag, nicht hier. */
const ABLAUF: Array<{ icon: ComponentType<IconProps>; title: string; body: string }> = [
  {
    icon: IconPruefung,
    title: 'Wir prüfen die Anfrage',
    body:
      'Kundinnen und Kunden stellen ihre Anfrage bei uns. Wir prüfen sie fachlich und klären, was gebraucht '
      + 'wird — zum Beispiel Fahrzeug, Schlüsselart und Berechtigung.',
  },
  {
    icon: IconWerkstatt,
    title: 'Ihr Betrieb übernimmt nach Abstimmung',
    body:
      'Passt die Anfrage zu Ihrem Einsatzgebiet und Ihren Leistungen, fragen wir Sie an. Sie übernehmen den '
      + 'Auftrag erst nach Abstimmung mit uns.',
  },
  {
    icon: IconZahlung,
    title: 'Sie führen aus und rechnen ab',
    body:
      'Ihr Betrieb führt die Leistung aus und rechnet direkt mit dem Kunden ab. Der Kunde erfährt vorher, '
      + 'welcher Betrieb ausführt und sein Vertragspartner ist.',
  },
  {
    icon: IconNachweis,
    title: 'Vermittlungsprovision',
    body:
      'Für vermittelte Aufträge stellen wir Ihrem Betrieb eine Vermittlungsprovision in Rechnung. Höhe, '
      + 'Abrechnung und Reklamationen regelt der Partnervertrag.',
  },
];

/* Was vor einer Freischaltung geprüft und vereinbart wird (Erg. Leitfaden §7). */
const PRUEFUNG = [
  'Gewerbeanmeldung bzw. Eintragung Ihres Betriebs',
  'Fachliche Eignung für die angebotenen Leistungen',
  'Zuverlässigkeit und klare Preisregeln gegenüber Kunden',
  'Bei Autoschlüsseln: wie Identität und Berechtigung der Kunden geprüft werden',
  'Ein schriftlicher Partnervertrag zu Provision, Abrechnung, Reklamation und Verantwortung',
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PartnerWerdenPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const page = await getPageContent(ROUTE);
  const links = page?.seo.internalLinks ?? [];

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Partner werden',
          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Partner werden' }],
        })}
      />

      <PageHeader
        eyebrow="Für Fachbetriebe"
        title={page?.headline ?? 'Partner werden'}
        lead={
          page?.subline
          ?? 'Wir vermitteln Kundenanfragen aus ganz Deutschland an geprüfte, unabhängige Fachbetriebe vor Ort.'
        }
        crumbs={[{ href: `/${ROUTE}`, label: 'Partner werden' }]}
        actions={
          <ButtonLink href="#bewerbung" size="lg" pfeil>
            Jetzt bewerben
          </ButtonLink>
        }
      >
        {page?.intro && <p className="max-w-measure text-body text-foreground-muted">{page.intro}</p>}
      </PageHeader>


      <Section tone="muted" labelledBy="architektur-titel">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="architektur-titel"
              nummer="01"
              eyebrow="Systemarchitektur & Methodik"
              title="Die technologische Grundlage der Auftragsvermittlung"
              lead="SCHLÜSSELMACHER24 operiert als hochspezialisierte digitale Plattform, die komplexe Kundenanfragen in strukturierte, auswertbare Datensätze transformiert."
            />
          </div>
          <div className="space-y-6 lg:col-span-7 text-[oklch(0.32_0.02_260)] leading-relaxed">
            <p>
              Unsere Vermittlungsarchitektur basiert auf einem präzisen, mehrstufigen Filterungsprozess. Wenn eine Anfrage unser System erreicht – sei es für einen komplexen Autoschlüssel mit Transponderprogrammierung oder eine umfassende Schließanlage – durchläuft sie zunächst eine automatisierte Vorprüfung. Hierbei werden unvollständige oder unrealistische Anfragen sofort aussortiert. Nur Datensätze mit vollständiger Spezifikation (Fahrzeugidentifikationsnummer, Schlüsseltyp, Zylindermaß) gelangen in die manuelle Disposition.
            </p>
            <p>
              Die algorithmische Zuweisung berücksichtigt nicht nur die rein geographische Distanz zwischen Kunde und Partnerbetrieb, sondern auch die spezifischen Qualifikationsmatrix des Betriebs. Das bedeutet: Ein Spezialist für VAG-Fahrzeugschlüssel erhält primär Anfragen für Volkswagen, Audi und Skoda, während ein Experte für mechatronische Schließsysteme entsprechende Projektanfragen erhält. Diese asymmetrische Zuweisungslogik garantiert eine minimale Stornoquote und maximale Conversion-Rates vor Ort.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
               <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
                 <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-3">Datenanreicherung</h4>
                 <p className="text-sm">Jede Anfrage wird mit Meta-Daten angereichert. Sie erhalten nicht nur eine Telefonnummer, sondern ein präzises Profil des benötigten Bauteils inkl. geschätztem Arbeitsaufwand.</p>
               </div>
               <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
                 <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-3">API-Integration</h4>
                 <p className="text-sm">Für größere Fachbetriebe bieten wir eine REST-API-Schnittstelle zur direkten Integration der Auftragsdaten in Ihr bestehendes ERP- oder Dispositionssystem an.</p>
               </div>
            </div>
            <p className="mt-6">
              Darüber hinaus legen wir größten Wert auf die rechtliche Absicherung. Bei fahrzeugbezogenen Anfragen integrieren wir standardisierte Prüfprotokolle für Eigentums- und Berechtigungsnachweise. Dies schützt Sie als ausführenden Betrieb vor rechtlichen Komplikationen und stellt sicher, dass alle regulatorischen Anforderungen erfüllt werden. Der gesamte Datenaustausch erfolgt Ende-zu-Ende verschlüsselt und DSGVO-konform über zertifizierte Server-Infrastrukturen.
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="ablauf-titel">

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="ablauf-titel"
              nummer="02"
              eyebrow="Ablauf"
              title="So funktioniert die Vermittlung"
              lead="Wir prüfen jede Anfrage, bevor sie an einen Partnerbetrieb geht. Ihr Betrieb bleibt eigenständig."
            />
          </div>
          <ol className="border-t border-border lg:col-span-7">
            {ABLAUF.map((schritt, index) => {
              const Icon = schritt.icon;
              return (
                <li key={schritt.title} className="flex gap-5 border-b border-border py-6">
                  <span className="w-6 shrink-0 pt-1 font-mono text-caption tabular-nums text-foreground-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Icon size={40} className="shrink-0 text-area-strong" />
                  <div className="min-w-0">
                    <h3 className="text-title-sm font-semibold text-foreground">{schritt.title}</h3>
                    <p className="mt-1 max-w-measure text-small text-foreground-muted">{schritt.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      <Section tone="muted" labelledBy="pruefung-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="pruefung-titel"
              nummer="04"
              eyebrow="Vor der Freischaltung"
              title="Wir prüfen jeden Partnerbetrieb"
              lead="Kundinnen und Kunden sollen sich auf jeden vermittelten Betrieb verlassen können."
            />
          </div>
          <ul className="space-y-3 lg:col-span-7">
            {PRUEFUNG.map((punkt) => (
              <li key={punkt} className="flex gap-3">
                <GlyphHakenKreis size={16} className="mt-0.5 shrink-0 text-primary" />
                <span className="text-small text-foreground-muted">{punkt}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>


      <Section tone="muted" labelledBy="faq-titel">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="faq-titel"
              nummer="03"
              eyebrow="Häufige Fragen"
              title="FAQ für zukünftige Partnerbetriebe"
              lead="Transparente Antworten auf die wichtigsten Fragen zur Zusammenarbeit, Abrechnung und technischen Integration."
            />
          </div>
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-title-sm font-semibold text-[oklch(0.16_0.02_260)]">Wie wird die Vermittlungsprovision abgerechnet?</h3>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Die Abrechnung erfolgt transparent und vollautomatisiert am Ende eines jeden Kalendermonats. Sie erhalten eine detaillierte Aufstellung aller vermittelten und erfolgreich abgeschlossenen Aufträge. Die Provision wird nur für tatsächlich generierten Umsatz fällig – Aufträge, die aus kundenseitigen Gründen (z.B. fehlende Berechtigungsnachweise vor Ort) nicht durchgeführt werden können, sind provisionsfrei.
              </p>
            </div>
            <div>
              <h3 className="text-title-sm font-semibold text-[oklch(0.16_0.02_260)]">Welche technischen Voraussetzungen muss mein Betrieb erfüllen?</h3>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Um Aufträge effizient empfangen und bearbeiten zu können, benötigen Sie lediglich ein internetfähiges Smartphone oder Tablet. Unsere Web-Applikation ist responsiv und erfordert keine native App-Installation. Für eine optimale Auftragsabwicklung bei KFZ-Schlüsseln setzen wir den Besitz gängiger Programmierhardware (z.B. Xhorse, Autel, Silca) voraus.
              </p>
            </div>
            <div>
              <h3 className="text-title-sm font-semibold text-[oklch(0.16_0.02_260)]">Gibt es eine Mindestvertragslaufzeit oder Fixkosten?</h3>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Nein. Wir glauben an ein rein erfolgsbasiertes Modell. Es gibt weder monatliche Grundgebühren noch Einrichtungsgebühren. Die Partnerschaft kann mit einer Frist von 14 Tagen zum Monatsende gekündigt werden. Sie zahlen ausschließlich für den messbaren Mehrwert in Form von vermittelten, zahlenden Kunden.
              </p>
            </div>
            <div>
              <h3 className="text-title-sm font-semibold text-[oklch(0.16_0.02_260)]">Wie funktioniert der regionale Gebietsschutz?</h3>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Wir arbeiten mit einem dynamischen Radius-System. Bei der Registrierung definieren Sie Ihr primäres Einsatzgebiet. Innerhalb dieses Radius (üblicherweise 15-50km) begrenzen wir die Anzahl der aktiven Partnerbetriebe basierend auf dem regionalen Suchvolumen. Dies stellt sicher, dass jeder Partnerbetrieb eine signifikante Anzahl an qualifizierten Anfragen erhält und keine interne Kannibalisierung stattfindet.
              </p>
            </div>
            <div>
              <h3 className="text-title-sm font-semibold text-[oklch(0.16_0.02_260)]">Wer übernimmt die Haftung bei Reklamationen?</h3>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                SCHLÜSSELMACHER24 tritt ausschließlich als technischer Vermittler auf. Der eigentliche Werkvertrag kommt stets direkt zwischen Ihrem Fachbetrieb und dem Endkunden zustande. Demnach liegt die Gewährleistungspflicht und Haftung für die handwerkliche Ausführung bei Ihnen. Wir unterstützen jedoch bei der Schlichtung eventueller Unstimmigkeiten durch unseren neutralen Kundenservice.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="bewerbung" labelledBy="bewerbung-titel">
        <SectionHeading
          id="bewerbung-titel"
          nummer="03"
          eyebrow="Bewerbung"
          title="Als Partnerbetrieb bewerben"
          lead="Wenige Angaben genügen. Wir melden uns nach der Prüfung per E-Mail oder Telefon."
        />
        <Alert tone="legal" className="mt-6 max-w-3xl">
          Mit der Bewerbung entsteht keine Verpflichtung. Ob und ab wann wir Aufträge vermitteln, hängt von der Prüfung
          und den Anfragen in Ihrer Region ab.
        </Alert>

        <div className="mt-12 mb-16 max-w-3xl">
          <PartnerProvisionsRechner />
        </div>
        <div className="mt-8">
          <PartnerFormular />

        </div>

        {links.length > 0 && (
          <div className="mt-12 max-w-3xl">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Ebenfalls passend</p>
            <ul className="mt-3 border-t border-border">
              {links.map((link) => (
                <li key={link.href} className="border-b border-border">
                  <Link
                    href={link.href}
                    className="group flex min-h-touch items-center justify-between gap-3 py-3 text-small font-semibold text-primary"
                  >
                    {link.label}
                    <GlyphPfeilRechts
                      size={16}
                      className="shrink-0 transition-transform duration-quick ease-standard group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>
    </main>
  );
}
