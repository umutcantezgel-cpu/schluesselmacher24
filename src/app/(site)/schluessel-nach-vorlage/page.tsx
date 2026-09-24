import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Package,
  Ruler,
  Search,
} from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { ImageSlot } from '@/lib/types';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

const ROUTE = 'schluessel-nach-vorlage';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel nach Vorlage nachmachen lassen',
    description:
      page?.seo.description
      ?? 'Schlüssel nach Vorlage: Fotos hochladen, Machbarkeit und Preis erhalten. '
        + 'Das Original muss zunächst nicht eingesendet werden.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/* Die drei Aufnahmen, die wir für die Prüfung brauchen. */
const PHOTOS: Array<{ title: string; body: string; slot: ImageSlot }> = [
  {
    title: 'Vorderseite',
    body:
      'Der Schlüssel flach von oben, vollständig im Bild. Kopf und Bart müssen zusammen '
      + 'zu sehen sein.',
    slot: {
      motif: 'Beispielfoto: Schlüssel flach von oben, Kopf und Bart vollständig im Bild',
      ratio: '4/3',
      note: 'Neutraler, heller Untergrund. Aufnahme ohne Blitzreflexe.',
    },
  },
  {
    title: 'Rückseite',
    body:
      'Derselbe Schlüssel gewendet. Viele Schlüssel tragen nur auf einer Seite eine '
      + 'Beschriftung.',
    slot: {
      motif: 'Beispielfoto: Schlüssel gewendet, Prägung auf der Rückseite lesbar',
      ratio: '4/3',
      note: 'Gleicher Abstand und gleicher Untergrund wie bei der Vorderseite.',
    },
  },
  {
    title: 'Spitze und Profil',
    body:
      'Von vorne auf die Spitze fotografiert. Aus dieser Ansicht erkennen wir den '
      + 'Profilquerschnitt und damit den passenden Rohling.',
    slot: {
      motif: 'Beispielfoto: Blick von vorne auf die Schlüsselspitze, Profilquerschnitt erkennbar',
      ratio: '1/1',
      note: 'Schlüssel aufstellen oder anlehnen, damit die Spitze zur Kamera zeigt.',
    },
  },
];

const STEPS = [
  {
    icon: Camera,
    title: 'Fotos hochladen',
    body:
      'Sie fotografieren den Schlüssel aus drei Richtungen und tragen ein, was auf ihm '
      + 'steht. Der Ablauf hat acht Schritte und lässt sich am Smartphone bedienen.',
  },
  {
    icon: Search,
    title: 'Wir prüfen',
    body:
      'Wir bestimmen Profil und Rohling, lesen Beschriftungen aus und klären, ob eine '
      + 'Nachfertigung nach Ihren Bildern möglich ist.',
  },
  {
    icon: CheckCircle2,
    title: 'Machbarkeit und Preis',
    body:
      'Sie erhalten eine Rückmeldung mit dem Ergebnis der Prüfung und dem Preis. Erst '
      + 'danach entscheiden Sie, ob wir anfertigen sollen.',
  },
  {
    icon: Package,
    title: 'Nur falls nötig: Einsendung',
    body:
      'Reichen die Fotos nicht aus, erhalten Sie von uns eine Einsendeanweisung mit '
      + 'Adresse und Vorgangsnummer.',
  },
];

export default async function SchluesselNachVorlagePage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  // FAQ bevorzugt aus der Datenschicht; solange dort nichts gepflegt ist,
  // greift dieser fachlich geprüfte Grundbestand.
  const faq =
    page?.faq && page.faq.length > 0
      ? page.faq
      : [
          {
            question: 'Muss ich meinen Schlüssel einschicken?',
            answer:
              'Zunächst nicht. Für die Anfrage genügen Fotos. Ihr Schlüssel bleibt bei Ihnen. '
              + 'Nur wenn die Bilder für eine sichere Bestimmung nicht ausreichen, bitten wir Sie '
              + 'um die Einsendung des Originals — mit einer eigenen Anweisung dazu.',
          },
          {
            question: 'Woran erkennen Sie, ob eine Nachfertigung möglich ist?',
            answer:
              'Entscheidend sind der Profilquerschnitt, die Form des Rohlings und die '
              + 'Beschriftung auf Kopf oder Bart. Sind diese drei Angaben eindeutig, lässt sich '
              + 'meist bereits nach den Fotos bestimmen, welcher Rohling passt.',
          },
          {
            question: 'Was kostet die Anfrage?',
            answer:
              'Preis und Machbarkeit nennen wir nach der Prüfung Ihrer Fotos. Mit dem Absenden '
              + 'der Anfrage entsteht noch kein Auftrag und kein Vertrag. Sie entscheiden erst, '
              + 'wenn Ihnen unsere Rückmeldung vorliegt.',
          },
          {
            question: 'Wie lange dauert die Prüfung?',
            answer:
              'Die Dauer hängt vom Schlüsseltyp und von der Qualität der Fotos ab. Wir melden '
              + 'uns, sobald die Prüfung abgeschlossen ist. '
              + '[Platzhalter: übliche Bearbeitungsdauer ergänzen]',
          },
          {
            question: 'Gilt das auch für Autoschlüssel?',
            answer:
              'Für den mechanischen Teil ja. Der Bart lässt sich nach Vorlage anfertigen. '
              + 'Transponder, Funk und Wegfahrsperre sind davon getrennt zu betrachten und in '
              + 'aller Regel nur am Fahrzeug anzulernen.',
          },
          {
            question: 'Und bei Schlüsseln mit Sicherungskarte oder geschütztem Profil?',
            answer:
              'Solche Schlüssel sind nur eingeschränkt nachzufertigen. Je nach System ist ein '
              + 'Nachweis der Berechtigung oder der Weg über den Hersteller nötig. Das prüfen wir '
              + 'im Einzelfall und sagen Ihnen das Ergebnis.',
          },
          {
            question: 'Was passiert mit meinen Fotos?',
            answer:
              `Die Fotos werden ausschließlich für Ihren Vorgang verwendet und nach `
              + `${settings.retentionDays.keyPhotos} Tagen gelöscht. Einzelheiten stehen in der `
              + 'Datenschutzerklärung.',
          },
        ];

  const links = page?.seo.internalLinks ?? [];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/schluessel-nach-vorlage',
          name: page?.headline ?? 'Schlüssel nach Vorlage',
          description: page?.seo.description,
          crumbs: [{ href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage' }],
          faq: faq,
        })}
      />

      <PageHeader
        eyebrow={process.label}
        title={page?.headline ?? 'Schlüssel nach Vorlage'}
        lead={page?.subline ?? 'Sie haben den Schlüssel — wir prüfen, ob wir ihn nachfertigen können.'}
        crumbs={[{ href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage' }]}
        actions={
          <ButtonLink href="/schluessel-nach-vorlage/anfrage" size="lg">
            Anfrage mit Fotos starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      >
        <p className="max-w-3xl text-[15px] leading-relaxed text-foreground-muted">
          {page?.intro}
        </p>
      </PageHeader>

      {/* Ablauf */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Ablauf"
              title="Vier Abschnitte von der Anfrage bis zum Schlüssel"
              lead={process.hint}
            />

            <Alert tone="info" title="Ihr Original bleibt bei Ihnen" className="mt-7">
              Für die Anfrage müssen Sie den Originalschlüssel <strong>nicht</strong> einsenden.
              Wir arbeiten zuerst mit Ihren Fotos. Eine Einsendung kommt nur infrage, wenn die
              Bilder für eine sichere Bestimmung nicht ausreichen — und erst, nachdem wir Sie
              darum gebeten haben.
            </Alert>

            <div className="mt-7">
              <ButtonLink href="/schluessel-nach-vorlage/anfrage">
                Ablauf starten
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
            </div>
          </div>

          <ol className="relative space-y-5 border-l border-border pl-7">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[38px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface font-display text-xs font-bold text-primary"
                  >
                    {index + 1}
                  </span>
                  <p className="flex items-center gap-2 text-[15px] font-bold text-foreground">
                    <Icon size={16} aria-hidden className="text-primary" />
                    {step.title}
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* Die drei Fotos */}
      <Section tone="muted" id="fotos">
        <SectionHeading
          eyebrow="Vorbereitung"
          title="Diese drei Aufnahmen brauchen wir"
          lead="Scharf, gut ausgeleuchtet, formatfüllend und ohne Blitzreflexe. Prägungen müssen lesbar sein."
        />

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {PHOTOS.map((photo, index) => (
            <li key={photo.title}>
              <Card className="flex h-full flex-col">
                <CardBody className="flex flex-1 flex-col">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Foto {index + 1}
                  </p>
                  <p className="mt-1.5 text-[15px] font-bold text-foreground">{photo.title}</p>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                    {photo.body}
                  </p>
                  <ImagePlaceholder slot={photo.slot} className="mt-4" />
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>

        <Card className="mt-6">
          <CardBody>
            <p className="flex items-center gap-2 text-[15px] font-bold text-foreground">
              <Ruler size={16} aria-hidden className="text-primary" />
              Beschriftungen mitfotografieren
            </p>
            <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-foreground-muted">
              Zahlen und Buchstaben auf Kopf, Bart oder Schaft sind für die Bestimmung besonders
              wertvoll. Tragen Sie sie im Formular als Text ein und fotografieren Sie sie
              zusätzlich deutlich — bei kleinen Prägungen als Nahaufnahme.
            </p>
          </CardBody>
        </Card>
      </Section>

      {/* Autoschlüssel */}
      <Section id="autoschluessel">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Sonderfall Fahrzeuge"
              title="Auch für mechanische Autoschlüssel"
              lead="Der Bart lässt sich nach Vorlage anfertigen. Die Elektronik ist ein eigener Schritt."
            />

            <div className="prose-sm24 mt-6 max-w-none">
              <p>
                Viele Fahrzeugschlüssel bestehen aus zwei Teilen: dem mechanischen Bart, der das
                Türschloss bewegt, und der Elektronik im Schlüsselkopf. Nach Vorlage fertigen wir
                den mechanischen Teil.
              </p>
              <p>
                Ein nach Foto gefräster Bart öffnet bei vielen Fahrzeugen die Tür, startet den
                Motor aber nicht. Denn Transponder, Funkfernbedienung und Wegfahrsperre müssen
                dem Fahrzeug erst bekannt gemacht werden — dafür ist in aller Regel Zugriff auf
                das Fahrzeug nötig.
              </p>
            </div>

            <Alert tone="warning" title="Wichtig für Fahrzeugschlüssel" className="mt-6">
              Ein kopierter Bart ersetzt bei vielen Fahrzeugen <strong>nicht</strong> automatisch
              Transponder, Funk oder Wegfahrsperre. Ob Ihr Fahrzeug einen rein mechanischen
              Schlüssel nutzt, klären wir mit Ihrer Anfrage.
            </Alert>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/autoschluessel/kopieren" variant="outline">
                Autoschlüssel kopieren
              </ButtonLink>
              <ButtonLink href="/autoschluessel/programmieren" variant="outline">
                Programmieren und anlernen
              </ButtonLink>
            </div>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: mechanischer Fahrzeugschlüssel neben aufgeklapptem Schlüsselkopf mit Transponder',
              ratio: '4/3',
              note: 'Zeigt den Unterschied zwischen mechanischem Bart und Elektronik.',
            }}
          />
        </div>
      </Section>

      {/* Einsendung */}
      <Section tone="muted" id="einsendung">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Nur auf Aufforderung"
              title="Wenn wir das Original doch brauchen"
              lead="Bei ungewöhnlichen Profilen oder unleserlichen Prägungen bitten wir Sie um die Einsendung. Vorher nicht."
            />

            <div className="prose-sm24 mt-6 max-w-none">
              <p>
                Senden Sie bitte nichts unaufgefordert ein. Die Versandadresse und den genauen
                Umfang nennen wir Ihnen mit dem Ergebnis der Prüfung — zusammen mit Ihrer
                Vorgangsnummer.
              </p>
            </div>

            <Alert tone="legal" title="Versandweg" className="mt-6">
              Wählen Sie einen versicherten oder mindestens nachverfolgbaren Versand. Ein
              Schlüssel im unverfolgten Brief ist bei Verlust nicht auffindbar und nicht
              ersetzbar.
            </Alert>
          </div>

          <Card>
            <CardBody>
              <h3 className="text-[15px] font-bold text-foreground">Was der Sendung beiliegen soll</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Ein Zettel mit Ihrer Vorgangsnummer, Ihrem Namen und Ihrer Telefonnummer.',
                  'Die vollständige Rücksendeadresse.',
                  'Nur den betreffenden Schlüssel — ohne Schlüsselring, Anhänger und weitere Schlüssel.',
                  'Falls vorhanden: eine Kopie der Sicherungskarte oder des Berechtigungsnachweises.',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <CheckCircle2
                      size={16}
                      aria-hidden
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span className="text-[14px] leading-relaxed text-foreground-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed text-foreground-subtle">
                Nach der Anfertigung erhalten Sie Original und neuen Schlüssel getrennt
                voneinander zurück, sofern Sie das wünschen. Die Versandart stimmen wir vorher
                mit Ihnen ab.
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* Fragen */}
      <Section id="fragen">
        <SectionHeading eyebrow="Fragen" title="Häufige Fragen zur Anfrage nach Vorlage" />
        <Accordion items={faq} className="mt-8" />
      </Section>

      {/* Weiterführend */}
      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Weiter im Thema"
          title="Passende Bereiche"
          lead="Manchmal führt ein anderer Weg schneller zum Ziel."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/schluessel-nach-code',
              label: 'Schlüssel nach Code',
              body: 'Trägt Ihr Schloss einen Code, geht die Bestellung direkt — ohne Prüfung der Fotos.',
            },
            {
              href: '/autoschluessel/kopieren',
              label: 'Autoschlüssel kopieren',
              body: 'Mechanische Kopie für Fahrzeugschlüssel, mit allem, was dabei zu beachten ist.',
            },
            {
              href: '/autoschluessel/programmieren',
              label: 'Programmieren und anlernen',
              body: 'Transponder, Funk und Wegfahrsperre am Fahrzeug anlernen lassen.',
            },
            {
              href: '/ratgeber/schluesselcode-finden',
              label: 'Wo steht der Schlüsselcode?',
              body: 'Typische Fundstellen an Schloss, Schlüssel und Unterlagen.',
            },
            {
              href: '/gleichschliessende-zylinder',
              label: 'Gleichschließende Zylinder',
              body: 'Mehrere Türen mit einem Schlüssel — direkt zusammenstellbar.',
            },
            {
              href: '/service-und-termin/kontakt',
              label: 'Kontakt',
              body: 'Wenn Ihr Fall in keinen der Abläufe passt.',
            },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-bold text-foreground group-hover:text-primary">
                  {item.label}
                </span>
                <span className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                  {item.body}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Ansehen
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {links.length > 0 && (
          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6 text-[14px]">
            <span className="font-semibold text-foreground-muted">Ebenfalls passend:</span>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="font-semibold text-primary hover:underline">
                {link.label}
              </Link>
            ))}
          </p>
        )}
      </Section>
    </>
  );
}
