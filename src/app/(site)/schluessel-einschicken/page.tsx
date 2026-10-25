import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageContent, getSettings } from '@/lib/data';
import { firmenname, sitzZeilen, standort } from '@/lib/rechtliches/firma';
import type { CompanyProfile } from '@/lib/types';
import { Accordion } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import type { IconProps } from '@/components/visual/icons/icon-base';
import { IconPruefung } from '@/components/visual/icons/pruefung';
import { IconRueckgabe } from '@/components/visual/icons/rueckgabe';
import { IconVersandPaket } from '@/components/visual/icons/versand-paket';
import { IconWerkstatt } from '@/components/visual/icons/werkstatt';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphOrt } from '@/components/visual/glyphen/ort';

const ROUTE = 'schluessel-einschicken';

/* Inhalt aus dem Abschnitt „Einsendung“ der Vorlage-Seite und ihren Fragen — keine Preise, keine Fristen. */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel einschicken',
    description:
      page?.seo.description
      ?? 'Schlüssel einschicken nur nach Freigabe Ihrer Fotoanfrage oder auf unsere Bitte: wohin, was '
        + 'beiliegen soll und wie Sie sicher versenden.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

const CRUMBS = [
  { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Foto oder Vorlage' },
  { href: `/${ROUTE}`, label: 'Schlüssel einschicken' },
];

const ABLAUF: Array<{ icon: ComponentType<IconProps>; title: string; body: string }> = [
  {
    icon: IconPruefung,
    title: 'Erst die Fotoanfrage',
    body:
      'Sie schicken uns Fotos Ihres Schlüssels. Wir prüfen, ob eine Anfertigung möglich ist, und melden '
      + 'uns mit dem Ergebnis — als Freigabe, Rückfrage oder Absage.',
  },
  {
    icon: IconVersandPaket,
    title: 'Einschicken nur, wenn nötig',
    body:
      'Reichen die Fotos für eine sichere Bestimmung nicht aus, bitten wir Sie um das Original — mit '
      + 'Ihrer Vorgangsnummer und der Anschrift für die Sendung.',
  },
  {
    icon: IconWerkstatt,
    title: 'Anfertigung in der Werkstatt',
    body: 'Mit dem Original vor uns fertigen wir den neuen Schlüssel.',
  },
  {
    icon: IconRueckgabe,
    title: 'Rücksendung',
    body:
      'Ihr Original kommt mit dem fertigen Schlüssel zu Ihnen zurück, auf Wunsch getrennt voneinander. '
      + 'Die Versandart stimmen wir vorher mit Ihnen ab.',
  },
];

const BEILAGE = [
  'Ein Zettel mit Ihrer Vorgangsnummer, Ihrem Namen und Ihrer Telefonnummer.',
  'Die vollständige Rücksendeadresse.',
  'Nur den betreffenden Schlüssel — ohne Schlüsselring, Anhänger und weitere Schlüssel.',
  'Falls vorhanden: eine Kopie der Sicherungskarte oder des Berechtigungsnachweises.',
];

/** Grundbestand der Fragen, solange in der Datenschicht keine gepflegt sind (Antworten aus der Vorlage-Seite). */
const FRAGEN = [
  {
    question: 'Muss ich meinen Schlüssel einschicken?',
    answer:
      'Zunächst nicht. Für die Anfrage genügen Fotos. Ihr Schlüssel bleibt bei Ihnen. Nur wenn die Bilder '
      + 'für eine sichere Bestimmung nicht ausreichen, bitten wir Sie um die Einsendung des Originals — mit '
      + 'einer eigenen Anweisung dazu.',
  },
  {
    question: 'Kann ich den Schlüssel auch ohne Anfrage einschicken?',
    answer:
      'Bitte nicht. Senden Sie nichts unaufgefordert ein: Ohne Vorgangsnummer können wir eine Sendung '
      + 'keinem Auftrag zuordnen. Beginnen Sie mit der Fotoanfrage — die Versandanschrift und den genauen '
      + 'Umfang nennen wir Ihnen mit dem Ergebnis der Prüfung.',
  },
  {
    question: 'Und bei Schlüsseln mit Sicherungskarte oder geschütztem Profil?',
    answer:
      'Solche Schlüssel sind nur eingeschränkt nachzufertigen. Je nach System ist ein Nachweis der '
      + 'Berechtigung oder der Weg über den Hersteller nötig. Das prüfen wir im Einzelfall und sagen Ihnen '
      + 'das Ergebnis.',
  },
];

/** Anschrift für die Sendung: die Werkstatt, sonst der Firmensitz — nur veröffentlichte Angaben. */
function versandAnschrift(company: CompanyProfile): { titel: string; zeilen: string[] } | null {
  const werkstatt = standort(company);
  if (werkstatt) {
    return {
      titel: werkstatt.label,
      zeilen: [firmenname(company), werkstatt.street, `${werkstatt.postalCode} ${werkstatt.city}`],
    };
  }
  const sitz = sitzZeilen(company);
  return sitz.length > 0 ? { titel: 'Werkstatt', zeilen: [firmenname(company), ...sitz] } : null;
}

export default async function SchluesselEinschickenPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);
  const anschrift = versandAnschrift(settings.company);
  const faq = page?.faq?.length ? page.faq : FRAGEN;

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Schlüssel einschicken',
          description: page?.seo.description,
          crumbs: CRUMBS,
          faq,
        })}
      />

      <PageHeader
        eyebrow="Schlüssel nach Foto oder Vorlage"
        title={page?.headline ?? 'Schlüssel einschicken'}
        lead={page?.subline ?? 'Nur nach Freigabe Ihrer Fotoanfrage oder auf unsere Bitte.'}
        crumbs={CRUMBS}
        bereich="schluessel-nach-vorlage"
        actions={
          <>
            <ButtonLink href="/schluessel-nach-vorlage/anfrage" size="lg" pfeil>
              Foto prüfen lassen
            </ButtonLink>
            <ButtonLink href="/service-und-termin/terminstatus" size="lg" variant="outline">
              Stand meines Vorgangs
            </ButtonLink>
          </>
        }
      >
        {page?.intro && <p className="max-w-measure text-body text-foreground-muted">{page.intro}</p>}
      </PageHeader>

      {/* 01 Wann: erst die Fotoanfrage, dann — falls nötig — die Einsendung */}
      <Section labelledBy="wann-titel">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <SectionHeading
              id="wann-titel"
              nummer="01"
              eyebrow="Wann"
              title="Erst prüfen, dann einschicken"
              lead="Meist genügen uns Fotos. Das Original brauchen wir nur, wenn die Bilder für eine sichere Bestimmung nicht ausreichen."
            />
            <Alert tone="warning" title="Bitte nichts unaufgefordert einsenden" className="mt-7">
              Schicken Sie Ihren Schlüssel erst, wenn wir Ihre Fotoanfrage freigegeben oder Sie
              ausdrücklich um das Original gebeten haben. Eine Prüfung ist noch keine Zusage zur
              Anfertigung.
            </Alert>
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

      {/* 02 Wohin und was beiliegen soll */}
      <Section tone="muted" labelledBy="wohin-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="wohin-titel"
              nummer="02"
              eyebrow="Wohin"
              title="An unsere Werkstatt"
              lead="Maßgeblich ist die Anschrift aus unserer Rückmeldung zu Ihrer Anfrage — zusammen mit Ihrer Vorgangsnummer."
            />
            {anschrift ? (
              <address className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-surface p-5 not-italic">
                <GlyphOrt size={20} className="mt-0.5 shrink-0 text-area-strong" />
                <span className="text-small leading-relaxed text-foreground">
                  <span className="block font-semibold">{anschrift.titel}</span>
                  {anschrift.zeilen.map((zeile) => (
                    <span key={zeile} className="block">
                      {zeile}
                    </span>
                  ))}
                </span>
              </address>
            ) : (
              <p className="mt-6 max-w-measure text-small text-foreground-muted">
                Die Versandanschrift nennen wir Ihnen mit dem Ergebnis der Prüfung.
              </p>
            )}
          </div>

          <Card className="lg:col-span-7">
            <CardBody>
              <h3 className="text-title-sm font-semibold text-foreground">Was der Sendung beiliegen soll</h3>
              <ul className="mt-4 space-y-3">
                {BEILAGE.map((eintrag) => (
                  <li key={eintrag} className="flex gap-3">
                    <GlyphHakenKreis size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span className="text-small text-foreground-muted">{eintrag}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* 03 Verpackung, Versand und Rücksendung */}
      <Section labelledBy="versand-titel">
        <SectionHeading
          id="versand-titel"
          nummer="03"
          eyebrow="Versand"
          title="Sicher hin und zurück"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-gutter">
          <Alert tone="legal" title="Versand mit Sendungsverfolgung">
            Wählen Sie einen versicherten oder mindestens nachverfolgbaren Versand. Ein Schlüssel im
            unverfolgten Brief ist bei Verlust nicht auffindbar und nicht ersetzbar. Verpacken Sie
            den Schlüssel so, dass er den Umschlag nicht durchstoßen kann.
          </Alert>
          <Alert tone="info" title="Rücksendung mit dem fertigen Schlüssel">
            Nach der Anfertigung erhalten Sie Ihr Original zusammen mit dem neuen Schlüssel zurück —
            auf Wunsch getrennt voneinander. Die Versandart stimmen wir vorher mit Ihnen ab.
          </Alert>
        </div>
        <p className="mt-6 max-w-measure text-small text-foreground-muted">
          Noch keine Anfrage gestellt?{' '}
          <Link href="/schluessel-nach-vorlage" className="font-semibold text-primary hover:underline">
            So funktioniert der Schlüssel nach Foto oder Vorlage
          </Link>
          .
        </p>
      </Section>

      {/* 04 Fragen */}
      <Section tone="muted" labelledBy="fragen-titel">
        <SectionHeading id="fragen-titel" nummer="04" eyebrow="Fragen" title="Häufige Fragen zur Einsendung" />
        <Accordion items={faq} className="mt-8" />
      </Section>
    </>
  );
}
