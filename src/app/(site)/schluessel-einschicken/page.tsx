import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageContent, getRubrik, getSettings } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { einsendeAngebotFuerWeg } from '@/lib/einsenden/schein';
import { formatCents } from '@/lib/format';
import { firmenname, sitzZeilen, standort } from '@/lib/rechtliches/firma';
import type { CompanyProfile } from '@/lib/types';
import { Accordion } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { RubrikAblauf } from '@/components/rubrik/rubrik-ablauf';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphOrt } from '@/components/visual/glyphen/ort';

const ROUTE = 'schluessel-einschicken';
const ANMELDEN = '/schluessel-einschicken/anmelden';

/*
 * Schlüssel einschicken (G-24 bis G-26, E6-OPUS-02): Anmeldung mit Begleitschein, Versand versichert oder
 * unversichert, Rücksendung. Preise nur aus den Einstellungen (Porto der Post als Empfehlung, Aufpreise
 * des Betriebs); „kostenlos“ steht nur mit echtem Retourenlabel (R9, A-035).
 */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel einschicken: Begleitschein und Rückversand',
    description:
      page?.seo.description
      ?? 'Schlüssel aus ganz Deutschland einschicken: Einsendung anmelden, Begleitschein ausdrucken, versichert oder '
        + 'unversichert versenden. Original und Kopien kommen zurück.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

const CRUMBS = [
  { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Foto oder Vorlage' },
  { href: `/${ROUTE}`, label: 'Schlüssel einschicken' },
];

const BEILAGE = [
  'Der Begleitschein mit Ihrer Vorgangsnummer und Ihrer Rücksendeanschrift.',
  'Nur die betreffenden Schlüssel, ohne Schlüsselring und Anhänger.',
  'Ein gepolsterter Umschlag, damit der Schlüssel ihn nicht durchstößt.',
  'Bei Schlüsseln mit Sicherungskarte: eine Kopie der Karte, falls Sie bei der Anmeldung kein Foto hochgeladen haben. Die Karte selbst behalten Sie.',
];

/** Grundbestand der Fragen, solange in der Datenschicht keine gepflegt sind. */
function fragen(porto: { versichert: string; haftung: number }) {
  return [
    {
      question: 'Muss ich meinen Schlüssel einschicken?',
      answer:
        'Nein. Oft genügen Fotos: Mit der Fotoanfrage bleibt Ihr Schlüssel bei Ihnen, und wir bitten nur um das Original, '
        + 'wenn die Bilder für eine sichere Bestimmung nicht ausreichen. Wer den Schlüssel lieber gleich einschickt, meldet '
        + 'die Einsendung an und bekommt einen Begleitschein.',
    },
    {
      question: 'Kann ich den Schlüssel ohne Anmeldung einschicken?',
      answer:
        'Bitte nicht. Ohne Begleitschein oder Vorgangsnummer können wir eine Sendung keinem Auftrag zuordnen. Die Anmeldung '
        + 'dauert wenige Minuten; danach drucken Sie den Begleitschein aus.',
    },
    {
      question: 'Was kostet das Einschicken?',
      answer:
        `Das Porto für den Weg zu uns zahlen Sie bei der Post; empfohlen ist ein Einschreiben (${porto.versichert}, Haftung bis `
        + `${porto.haftung} €). Den Preis für die Kopien nennen wir Ihnen nach der Prüfung mit der Freigabe, bevor Sie etwas `
        + 'bezahlen. Erst mit Ihrer Zahlung erteilen Sie den Auftrag.',
    },
    {
      question: 'Und bei Schlüsseln mit Sicherungskarte oder geschütztem Profil?',
      answer:
        'Solche Schlüssel fertigen wir nur gegen die Karte: Bei der Anmeldung laden Sie ein Foto der Sicherungskarte hoch. Je '
        + 'nach System ist zusätzlich der Weg über den Hersteller nötig. Das prüfen wir im Einzelfall und sagen Ihnen das Ergebnis.',
    },
  ];
}

/** Anschrift für die Sendung: die Werkstatt, sonst der Firmensitz; nur veröffentlichte Angaben. */
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
  // Rubrik dieser Seite: Ziel des Übergangs aus der Hub-Kachel (B-35)
  const rubrik = await getRubrik('schluessel-einschicken');
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);
  const anschrift = versandAnschrift(settings.company);
  const einstellungen = settings.sendIn ?? defaults.settings().sendIn!;
  const angebot = einsendeAngebotFuerWeg(einstellungen);
  const faq = page?.faq?.length
    ? page.faq
    : fragen({ versichert: formatCents(einstellungen.portoVersichertCents), haftung: einstellungen.haftungVersichertEuro });

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
        rubrik={rubrik}
        eyebrow="Schlüssel nach Foto oder Vorlage"
        title={page?.headline ?? 'Schlüssel einschicken'}
        lead={
          page?.subline
          ?? 'Schlüsseldienst online, ohne Anfahrt: Einsendung anmelden, Begleitschein ausdrucken, Schlüssel einschicken. Original und Kopien kommen zu Ihnen zurück.'
        }
        crumbs={CRUMBS}
        bereich="schluessel-nach-vorlage"
        actions={
          <>
            <ButtonLink href={ANMELDEN} size="lg" pfeil>
              Einsendung anmelden
            </ButtonLink>
            <ButtonLink href="/schluessel-nach-vorlage/anfrage" size="lg" variant="outline">
              Erst Foto prüfen lassen
            </ButtonLink>
          </>
        }
      >
        {page?.intro && <p className="max-w-measure text-body text-foreground-muted">{page.intro}</p>}
      </PageHeader>

      {/* 01 Ablauf aus den Rubrikdaten (G-10, G-11); Fotos zuerst bleibt als Weg ohne Versand */}
      <Section labelledBy="ablauf-titel">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <SectionHeading
              id="ablauf-titel"
              nummer="01"
              eyebrow="So läuft Ihr Auftrag ab"
              title="Vom Umschlag zurück zu Ihnen"
              lead="Ohne Anfahrt, aus ganz Deutschland. Die Rücksendung geht an eine Anschrift in Deutschland."
            />
            <Alert tone="info" title="Oft genügen Fotos" className="mt-7">
              Lassen Sie Ihren Schlüssel zuerst nach Fotos prüfen, dann bleibt er bei Ihnen. Reichen die Bilder nicht, bitten wir
              Sie um das Original.{' '}
              <Link href="/schluessel-nach-vorlage/anfrage" className="font-semibold underline">
                Foto prüfen lassen
              </Link>
            </Alert>
            <Alert tone="warning" title="Bitte nur mit Begleitschein einschicken" className="mt-4">
              Ohne Begleitschein können wir eine Sendung keinem Auftrag zuordnen. Eine Prüfung ist noch keine Zusage zur Anfertigung.
            </Alert>
            <div className="mt-7">
              <ButtonLink href={ANMELDEN} pfeil>
                Einsendung anmelden
              </ButtonLink>
            </div>
          </div>

          {rubrik && <RubrikAblauf rubrik={rubrik} variante="liste" className="lg:col-span-7" />}
        </div>
      </Section>

      {/* 02 Versand: versichert empfohlen, Porto der Post und Aufpreise aus den Einstellungen (G-24, R9) */}
      <Section tone="muted" labelledBy="versand-titel">
        <SectionHeading
          id="versand-titel"
          nummer="02"
          eyebrow="Versand"
          title="Versichert oder unversichert"
          lead={angebot.satz}
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-gutter">
          {angebot.optionen.map((option) => (
            <Card key={option.art}>
              <CardBody>
                <h3 className="text-title-sm font-semibold text-foreground">
                  {option.titel}
                  {option.empfohlen && <span className="ml-2 font-mono text-caption uppercase tracking-label text-success">empfohlen</span>}
                </h3>
                <p className="mt-2 text-small leading-relaxed text-foreground-muted">{option.hinweis}</p>
                {option.aufpreisCents > 0 && (
                  <p className="mt-2 text-small font-semibold text-foreground">Aufpreis {formatCents(option.aufpreisCents)}</p>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
        {angebot.stand && <p className="mt-6 max-w-measure text-small text-foreground-subtle">Portopreise: {angebot.stand}</p>}
      </Section>

      {/* 03 Wohin und was beiliegen soll */}
      <Section labelledBy="wohin-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="wohin-titel"
              nummer="03"
              eyebrow="Wohin"
              title="An unsere Werkstatt"
              lead="Die Anschrift steht auch auf Ihrem Begleitschein, zusammen mit Ihrer Vorgangsnummer."
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
                Die Versandanschrift steht auf Ihrem Begleitschein.
              </p>
            )}
          </div>

          <Card className="lg:col-span-7">
            <CardBody>
              <h3 className="text-title-sm font-semibold text-foreground">Was in den Umschlag gehört</h3>
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

      {/* 04 Verpackung, Versand und Rücksendung */}
      <Section tone="muted" labelledBy="zurueck-titel">
        <SectionHeading id="zurueck-titel" nummer="04" eyebrow="Rücksendung" title="Sicher hin und zurück" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-gutter">
          <Alert tone="legal" title="Versand mit Sendungsverfolgung">
            Wählen Sie einen versicherten oder mindestens nachverfolgbaren Versand. Ein Schlüssel im unverfolgten Brief ist bei
            Verlust nicht auffindbar und nicht ersetzbar. Verpacken Sie den Schlüssel so, dass er den Umschlag nicht durchstoßen kann.
          </Alert>
          <Alert tone="info" title="Rücksendung mit den Kopien">
            Nach der Anfertigung erhalten Sie Ihr Original zusammen mit den Kopien zurück, auf Wunsch getrennt voneinander. Die
            Versandart für die Rücksendung stimmen wir vorher mit Ihnen ab. Sobald die Sendung unterwegs ist, bekommen Sie eine
            E-Mail, mit Sendungsnummer, wenn die Sendung eine hat.
          </Alert>
        </div>
        <p className="mt-6 max-w-measure text-small text-foreground-muted">
          Den Stand Ihrer Einsendung sehen Sie jederzeit unter{' '}
          <Link href="/service-und-termin/terminstatus" className="font-semibold text-primary hover:underline">
            Stand des Vorgangs
          </Link>
          .
        </p>
      </Section>

      {/* 05 Fragen */}
      <Section labelledBy="fragen-titel">
        <SectionHeading id="fragen-titel" nummer="05" eyebrow="Fragen" title="Häufige Fragen zur Einsendung" />
        <Accordion items={faq} className="mt-8" />
      </Section>
    </>
  );
}
