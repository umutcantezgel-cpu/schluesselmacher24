import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageContent, getRubrik, getSettings } from '@/lib/data';
import { TutorialHinweisSeite } from '@/components/tutorial/tutorial-hinweis-seite';
import { tutorialVerweiseFuer } from '@/lib/tutorials/hinweise';
import { defaults } from '@/lib/data/defaults';
import { einsendeAngebotFuerWeg } from '@/lib/einsenden/schein';
import { firmenname, sitzZeilen, standort } from '@/lib/rechtliches/firma';
import type { CompanyProfile } from '@/lib/types';
import { Accordion } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { RubrikAblauf } from '@/components/rubrik/rubrik-ablauf';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphOrt } from '@/components/visual/glyphen/ort';
import { PasstDazu } from '@/components/seo/passt-dazu';
import { VERPACKUNG_HINWEIS } from '@/lib/versand/varianten';

import { VarianteBeschreibung, kostenAntwort } from './versand-variante';

const ROUTE = 'schluessel-einschicken';
const ANMELDEN = '/schluessel-einschicken/anmelden';

/*
 * Schlüssel einschicken (G-24 bis G-26, E6-OPUS-02, A-050): Anmeldung mit Begleitschein, Versand in den
 * Varianten des Inhabers (DHL Paket, Einschreiben Einwurf, Einschreiben Wert nur im Sonderfall) mit
 * Haftung als Zahl und Kosten, Rücksendung. Preise nur aus den Einstellungen (Porto laut Post mit Stand,
 * Aufpreise des Betriebs); „kostenlos“ steht nur mit echtem Retourenlabel (R9, A-035).
 */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel einschicken',
    description:
      page?.seo.description
      ?? 'Schicken Sie Ihren Schlüssel aus ganz Deutschland an unsere Werkstatt: Einsendung anmelden, '
        + 'Begleitschein beilegen. Original und Kopien kommen zu Ihnen zurück.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

const CRUMBS = [
  { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage' },
  { href: `/${ROUTE}`, label: 'Schlüssel einschicken' },
];

const BEILAGE = [
  'Der Begleitschein mit Ihrer Vorgangsnummer und Ihrer Rücksendeanschrift.',
  'Nur die betreffenden Schlüssel, ohne Schlüsselring und Anhänger.',
  VERPACKUNG_HINWEIS,
  'Bei Schlüsseln mit Sicherungskarte: eine Kopie der Karte, falls Sie bei der Anmeldung kein Foto hochgeladen haben. Die Karte selbst behalten Sie.',
];

/** Grundbestand der Fragen, solange in der Datenschicht keine gepflegt sind. */
function fragen(kosten: string) {
  return [
    {
      question: 'Muss ich meinen Schlüssel einschicken?',
      answer:
        'Nicht unbedingt. Sie können ihn zuerst anhand von drei Fotos prüfen lassen, dann bleibt er vorerst bei Ihnen. '
        + 'Oder Sie schicken ihn gleich ein. Dafür melden Sie die Einsendung an und bekommen einen Begleitschein. '
        + 'Ist eine sichere Fertigung nur am Original möglich, bitten wir Sie danach um die Einsendung.',
    },
    {
      question: 'Kann ich den Schlüssel ohne Anmeldung einschicken?',
      answer:
        'Bitte nicht. Ohne Begleitschein oder Vorgangsnummer können wir eine Sendung keinem Auftrag zuordnen. Die Anmeldung '
        + 'dauert wenige Minuten. Danach drucken Sie den Begleitschein aus.',
    },
    {
      question: 'Was kostet das Einschicken?',
      answer:
        `Das Porto für den Weg zu uns zahlen Sie bei der Post. ${kosten}Den Preis für die Kopien nennen wir Ihnen `
        + 'nach der Prüfung mit der Freigabe, bevor Sie etwas bezahlen. Erst mit Ihrer Zahlung erteilen Sie den Auftrag.',
    },
    {
      question: 'Und bei Schlüsseln mit Sicherungskarte oder geschütztem Profil?',
      answer:
        'Solche Schlüssel fertigen wir nur gegen die Karte. Sie zeigt, dass Sie den Schlüssel nachmachen lassen dürfen. Bei der '
        + 'Anmeldung laden Sie deshalb ein Foto der Sicherungskarte hoch. Je nach System ist zusätzlich der Weg über den '
        + 'Hersteller nötig. Das prüfen wir im Einzelfall und sagen Ihnen das Ergebnis.',
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
  const [page, settings, tutorials] = await Promise.all([
    getPageContent(ROUTE),
    getSettings(),
    tutorialVerweiseFuer('schluessel-einschicken'),
  ]);
  const anschrift = versandAnschrift(settings.company);
  const einstellungen = settings.sendIn ?? defaults.settings().sendIn!;
  // Die Seite zeigt alle Varianten; den Sonderfall nur als solchen gekennzeichnet (A-050).
  const angebot = einsendeAngebotFuerWeg(einstellungen, { empfehlung: 'originalschluessel' });
  const varianten = [...angebot.optionen, ...angebot.sonderfaelle];
  // Kostenantwort aus den Varianten der Einstellungen (A-050): Name, Porto, Aufpreis des Betriebs und Haftung
  // je wählbarer Variante, damit die Antwort nach einer Änderung im Admin stimmt. Abgeschaltete fehlen.
  const kosten = kostenAntwort(angebot.optionen);
  const faq = page?.faq?.length ? page.faq : fragen(kosten);

  // Sichtbarer Kurztext im Seitenkopf, zugleich Beschreibung der Leistung in den Strukturdaten (FA-25-10).
  const kurztext =
    page?.subline
    ?? 'Schlüsseldienst online, ohne Anfahrt. Sie melden die Einsendung an und schicken den Schlüssel mit Begleitschein. Original und Kopien kommen zu Ihnen zurück.';

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Schlüssel einschicken',
          // Bundesweit nur hier: Die Seite nennt es sichtbar („Sie schicken aus ganz Deutschland“).
          service: { name: page?.headline ?? 'Schlüssel einschicken', description: kurztext, bundesweit: true },
          description: page?.seo.description,
          crumbs: CRUMBS,
          faq,
        })}
      />

      <PageHeader
        rubrik={rubrik}
        eyebrow="Schlüssel nach Vorlage"
        title={page?.headline ?? 'Schlüssel einschicken'}
        lead={kurztext}
        crumbs={CRUMBS}
        bereich="schluessel-nach-vorlage"
        actions={
          <>
            <ButtonLink href={ANMELDEN} size="lg" pfeil>
              Einsendung anmelden
            </ButtonLink>
            <ButtonLink href="/schluessel-nach-vorlage/anfrage" size="lg" variant="outline">
              Schlüssel prüfen lassen
            </ButtonLink>
          </>
        }
      >
        {page?.intro && <p className="max-w-measure text-body text-foreground-muted">{page.intro}</p>}
      </PageHeader>

      {/* 01 Ablauf aus den Rubrikdaten (G-10, G-11); die Anfrage mit Fotos steht gleichberechtigt daneben (FA-12) */}
      <Section labelledBy="ablauf-titel">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <SectionHeading
              id="ablauf-titel"
              nummer="01"
              eyebrow="So läuft Ihr Auftrag ab"
              title="Von Ihrer Sendung zurück zu Ihnen"
              lead="Sie schicken aus ganz Deutschland und müssen nicht zu uns kommen. Die Rücksendung geht an eine Anschrift in Deutschland."
            />
            <Alert tone="info" title="Zwei Wege zum Schlüssel nach Vorlage" className="mt-7">
              Sie schicken das Original gleich ein. Oder Sie lassen den Schlüssel zuerst anhand von drei Fotos prüfen, dann bleibt
              er vorerst bei Ihnen. Die Fotos dienen nur der Identifikation und Prüfung. Ist eine sichere Fertigung nur am Original
              möglich, bitten wir Sie danach um die Einsendung.{' '}
              <Link href="/schluessel-nach-vorlage/anfrage" className="font-semibold underline">
                Schlüssel prüfen lassen
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
            {/* Tutorial-Hinweis (FA-INHALT-01B) */}
            <TutorialHinweisSeite verweise={tutorials} ort="schluessel-einschicken" className="mt-7" />
          </div>

          {rubrik && <RubrikAblauf rubrik={rubrik} variante="liste" className="lg:col-span-7" />}
        </div>
      </Section>

      {/* 02 Versand: Varianten des Inhabers mit Haftung als Zahl und Kosten (A-050, R9) */}
      <Section tone="muted" labelledBy="versand-titel">
        <SectionHeading
          id="versand-titel"
          nummer="02"
          eyebrow="Versand"
          title="So schicken Sie den Schlüssel"
          lead={angebot.satz}
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-gutter">
          {varianten.map((option) => (
            <Card key={option.art}>
              <CardBody>
                <h3 className="flex flex-wrap items-center gap-2 text-title-sm font-semibold text-foreground">
                  {option.titel}
                  {option.empfohlen && <Badge tone="success">Empfehlung für wertvolle Originale</Badge>}
                  {option.nurSonderfall && <Badge tone="outline">nur Sonderfall</Badge>}
                </h3>
                <p className="mt-2 text-small leading-relaxed text-foreground-muted">
                  <VarianteBeschreibung option={option} mitStand />
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
        <p className="mt-6 max-w-measure text-small text-foreground-subtle">{angebot.haftungHinweis}</p>
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
              <h3 className="text-title-sm font-semibold text-foreground">Was in die Sendung gehört</h3>
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
            Wählen Sie einen Versand mit Sendungsverfolgung und einer Haftung, die zum Wert Ihres Schlüssels passt. Ein Schlüssel im
            unverfolgten Brief ist bei Verlust nicht auffindbar. {VERPACKUNG_HINWEIS}
          </Alert>
          <Alert tone="info" title="Rücksendung mit den Kopien">
            Nach der Anfertigung erhalten Sie Ihr Original zusammen mit den Kopien zurück, auf Wunsch getrennt voneinander. Die
            Versandart für die Rücksendung stimmen wir vorher mit Ihnen ab. Sobald die Sendung unterwegs ist, bekommen Sie eine
            E-Mail. Hat die Sendung eine Sendungsnummer, steht sie darin.
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
      {/* Verweisliste aus den Daten: eigene Links und Gegenrichtung (FA-SEO-01C) */}
      <PasstDazu pfad={`/${ROUTE}`} eigene={page?.seo.internalLinks} />
    </>
  );
}
