import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { getPageContent, getSettings, getVehicleMakes } from '@/lib/data';
import type { InfoHint, KeyKind } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { PROCESS_LABELS } from '@/lib/navigation';
import { cn } from '@/lib/cn';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { InfoTip } from '@/components/ui/info-tip';
import { KEY_KIND_HINT, ON_SITE_HINT, keyKindDescription, keyKindLabel } from '@/components/autoschluessel/key-kinds';
import { SCHLUESSELARTEN_REIHE, SchluesselartenReihe } from '@/components/autoschluessel/schluesselarten-reihe';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import type { IconProps } from '@/components/visual/icons/icon-base';
import { IconReparaturAustausch } from '@/components/visual/icons/reparatur-austausch';
import { IconSchluesselKopieren } from '@/components/visual/icons/schluessel-kopieren';
import { IconSchluesselProgrammieren } from '@/components/visual/icons/schluessel-programmieren';
import { SchluesselartZeichnung } from '@/components/visual/schluesselart-zeichnung';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

const ROUTE = 'autoschluessel';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel — Leistungen im Überblick',
    description:
      page?.seo.description
      ?? 'Autoschlüssel nachmachen, kopieren, programmieren und reparieren. Alle Leistungen, '
        + 'der Ablauf und die passenden Fahrzeugmarken im Überblick.',
    alternates: { canonical: '/autoschluessel' },
  };
}

const TRANSPONDER_HINT: InfoHint = {
  title: 'Transponder und Wegfahrsperre',
  body:
    'Im Schlüssel sitzt ein kleiner Chip, der Transponder. Beim Starten fragt das Fahrzeug diesen '
    + 'Chip ab. Passt die Antwort nicht, bleibt die Wegfahrsperre aktiv und der Motor springt nicht '
    + 'an — auch dann, wenn der mechanische Bart passt und die Tür aufgeht.',
  figure: {
    motif: 'Makroaufnahme: geöffnetes Schlüsselgehäuse mit sichtbarem Transponder',
    ratio: '3/2',
    note: 'Eigene Werkstattaufnahme, Chip deutlich erkennbar.',
  },
};

const BART_HINT: InfoHint = {
  title: 'Was ist der Schlüsselbart?',
  body:
    'Der Bart ist der metallene Teil des Schlüssels, der in das Schloss passt. Er wird nach einer '
    + 'Vorlage oder nach geeigneten Fahrzeugdaten gefräst. Mit der Elektronik im Schlüssel hat er '
    + 'nichts zu tun.',
  figure: {
    motif: 'Messzeichnung: Schlüsselbart mit Einschnitten und Bezeichnung der Positionen',
    ratio: '3/2',
  },
};

const SMART_KEY_HINT: InfoHint = {
  title: 'Smart Key und Keyless',
  body:
    'Bei diesen Systemen erkennt das Fahrzeug den Schlüssel, sobald er sich in der Nähe befindet. '
    + 'Sie öffnen und starten, ohne den Schlüssel in die Hand zu nehmen. Beschaffung und Anlernen '
    + 'sind aufwendiger als bei einem einfachen Funkschlüssel.',
};

interface Topic {
  term: string;
  href: string;
  body: string;
  hint?: InfoHint;
}

interface TopicGroup {
  title: string;
  lead: string;
  /** Fach-Icon des Leistungsfelds (Zweiton, ab 24 px). */
  icon: (props: IconProps) => ReactElement;
  topics: Topic[];
}

const TOPIC_GROUPS: TopicGroup[] = [
  {
    title: 'Schlüssel anfertigen',
    lead: 'Alles, was einen zusätzlichen oder neuen Schlüssel für Ihr Fahrzeug betrifft.',
    icon: IconSchluesselKopieren,
    topics: [
      {
        term: 'Autoschlüssel nachmachen',
        href: '/autoschluessel/nachmachen',
        body: 'Ein vollständiger weiterer Schlüssel — mechanisch gefertigt und elektronisch angelernt.',
      },
      {
        term: 'Zweitschlüssel',
        href: '/autoschluessel/nachmachen',
        body: 'Ein zusätzlicher Schlüssel, solange mindestens ein funktionierender vorhanden ist.',
      },
      {
        term: 'Ersatzschlüssel nach Verlust',
        href: '/autoschluessel/nachmachen',
        body: 'Kein Schlüssel mehr vorhanden. Umfang und Machbarkeit prüfen wir im Einzelfall.',
      },
      {
        term: 'Autoschlüssel kopieren',
        href: '/autoschluessel/kopieren',
        body: 'Mechanische Kopie nach Vorlage. Ohne Elektronik startet sie das Fahrzeug nicht.',
      },
      {
        term: 'Schlüsselbart fräsen',
        href: '/autoschluessel/schluesselbart-fraesen',
        body: 'Der metallene Teil des Schlüssels — nach Vorlage oder geeigneten Fahrzeugdaten.',
        hint: BART_HINT,
      },
    ],
  },
  {
    title: 'Elektronik und Programmierung',
    lead: 'Damit das Fahrzeug den Schlüssel erkennt und annimmt.',
    icon: IconSchluesselProgrammieren,
    topics: [
      {
        term: 'Programmieren und anlernen',
        href: '/autoschluessel/programmieren',
        body: 'Der Schlüssel wird dem Fahrzeug bekannt gemacht. Dafür ist Zugriff auf das Fahrzeug nötig.',
        hint: ON_SITE_HINT,
      },
      {
        term: 'Transponder und Wegfahrsperre',
        href: '/autoschluessel/programmieren',
        body: 'Der Chip im Schlüssel entscheidet darüber, ob der Motor startet.',
        hint: TRANSPONDER_HINT,
      },
      {
        term: 'Funkschlüssel',
        href: '/autoschluessel/funkschluessel',
        body: 'Fernbedienung zum Ver- und Entriegeln. Funk und Wegfahrsperre sind getrennte Funktionen.',
      },
      {
        term: 'Smart Key und Keyless',
        href: '/autoschluessel/smart-key',
        body: 'Schlüsselloser Zugang und Start. Mehr Vorlauf und mehr Zeit am Fahrzeug einplanen.',
        hint: SMART_KEY_HINT,
      },
    ],
  },
  {
    title: 'Reparatur und Sonderfälle',
    lead: 'Wenn der vorhandene Schlüssel nicht mehr richtig arbeitet oder gar nicht greifbar ist.',
    icon: IconReparaturAustausch,
    topics: [
      {
        term: 'Gehäuse, Tasten und Batterie',
        href: '/autoschluessel/funkschluessel',
        body: 'Gebrochenes Gehäuse, klemmende Tasten oder schwache Batterie — die Elektronik bleibt erhalten.',
      },
      {
        term: 'Schlüsselverlust',
        href: '/autoschluessel/nachmachen',
        body: 'Die richtige Reihenfolge spart Zeit: erst prüfen, was noch vorhanden ist, dann beauftragen.',
      },
      {
        term: 'Fahrzeugöffnung',
        href: '/autoschluessel/fahrzeugoeffnung',
        body: 'Zerstörungsfreies Öffnen als eigene Leistung. Sie ersetzt keinen Ersatzschlüssel.',
      },
    ],
  },
];

const FAQ = [
  {
    question: 'Muss mein Fahrzeug für einen neuen Autoschlüssel vor Ort sein?',
    answer:
      'Für rein mechanische Arbeiten am Bart in vielen Fällen nicht. Sobald der Schlüssel elektronisch '
      + 'angelernt werden muss, ist Zugriff auf das Fahrzeug erforderlich. Ob das bei Ihrem Fahrzeug '
      + 'der Fall ist, sehen Sie auf der jeweiligen Modellseite und im geführten Ablauf.',
  },
  {
    question: 'Was kostet ein neuer Autoschlüssel?',
    answer:
      'Das hängt vom Fahrzeug und von der Schlüsselart ab. Im geführten Ablauf erhalten Sie nach der '
      + 'Auswahl Ihres Fahrzeugs entweder einen festen Preis, einen Preisrahmen oder den Hinweis, dass '
      + 'wir Ihren Fall zuerst manuell prüfen. Erst danach buchen Sie einen Termin.',
  },
  {
    question: 'Warum brauchen Sie Fotos von meinem Schlüssel?',
    answer:
      'Die Bauform sagt uns, welches Gehäuse, welcher Rohling und welche Elektronik verbaut sind. '
      + 'Drei Aufnahmen aus unterschiedlichen Richtungen reichen in aller Regel aus. Das erspart '
      + 'Rückfragen und verhindert, dass beim Termin etwas fehlt.',
  },
  {
    question: 'Kann ich meinen Schlüssel einschicken?',
    answer:
      'Für mechanische Arbeiten ist ein Versand in vielen Fällen möglich. Muss der Schlüssel am '
      + 'Fahrzeug angelernt werden, hilft ein Versand nicht weiter — dann ist ein Termin mit Fahrzeug '
      + 'der richtige Weg.',
  },
  {
    question: 'Wofür ist die Anzahlung?',
    answer:
      'Die Anzahlung sichert Ihren Termin und die Beschaffung des passenden Schlüssels. Sie wird '
      + 'vollständig auf den Gesamtpreis angerechnet.',
  },
  {
    question: 'Ich habe meinen Schlüssel im Fahrzeug eingeschlossen. Was jetzt?',
    answer:
      'Dafür gibt es die Fahrzeugöffnung als eigene Leistung. Bitte halten Sie einen Nachweis bereit, '
      + 'dass Sie über das Fahrzeug verfügen dürfen.',
  },
];

/** Begriffe der Schlüsselarten-Liste: die vier Bauformen, danach Keyless als Zusatz des Smart Key. */
const SCHLUESSELARTEN_BEGRIFFE: KeyKind[] = [...SCHLUESSELARTEN_REIHE.map(({ art }) => art), 'keyless'];

/**
 * Zeilenpfeil: gedämpft in Ruhe, bei Hover und Fokus der Zeile in Primärblau; bei feinem
 * Zeiger rückt er nach rechts (B-06).
 */
function Weiter({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <GlyphPfeilRechts
      size={size}
      className={cn(
        'shrink-0 text-foreground-muted transition duration-quick ease-standard group-hover:text-primary group-focus-within:text-primary zeiger:group-hover:translate-x-1',
        className,
      )}
    />
  );
}

export default async function AutoschluesselHubPage() {
  const [page, settings, makes] = await Promise.all([
    getPageContent(ROUTE),
    getSettings(),
    getVehicleMakes(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;
  const modelCount = makes.reduce((sum, make) => sum + make.models.length, 0);

  // Der Ablauf ist überall derselbe; Beträge und Vorlauf kommen aus den Einstellungen.
  const steps = [
    {
      title: 'Fahrzeug wählen',
      body: 'Marke, Modell, Baujahr und Schlüsselart. Wir fragen nur ab, was für Ihr Fahrzeug zählt.',
    },
    {
      title: 'Fotos hochladen',
      body: 'Ihren Schlüssel aus drei Richtungen und den Fahrzeugschein.',
    },
    {
      title: 'Preis oder Prüfung',
      body: 'Sie erhalten einen festen Preis, einen Preisrahmen oder den Hinweis auf eine manuelle Prüfung.',
    },
    {
      title: 'Anzahlung',
      body: `Standard ${deposit}. Der Betrag wird vollständig auf den Gesamtpreis angerechnet.`,
    },
    {
      title: 'Termin buchen',
      body: `Der früheste Termin liegt etwa ${leadDays}\u00a0Tage in der Zukunft, weil wir Ihren Schlüssel vorher beschaffen.`,
    },
  ];

  // Anzahlung und Vorlauf: ein Text, der zweimal ausgegeben wird (Desktop unter den Knöpfen, mobil nach Schritt 5)
  const anzahlungHinweis = (
    <>
      <GlyphInfo size={18} className="mt-0.5 shrink-0 text-foreground-muted" />
      <div className="min-w-0 max-w-measure text-small leading-relaxed">
        <p className="mb-1 font-semibold text-foreground">Anzahlung und Vorlauf</p>
        <p className="text-foreground-muted">
          Die Anzahlung beträgt standardmäßig{' '}
          <span className="font-mono tabular-nums text-foreground">{deposit}</span> und wird
          vollständig auf den Gesamtpreis angerechnet. Der Vorlauf von etwa{' '}
          <span className="font-mono tabular-nums text-foreground">{leadDays}</span>
          {'\u00a0'}Tagen entsteht durch die Beschaffung des passenden Schlüssels. Für einzelne Fahrzeuge und Leistungen
          können abweichende Werte gelten — diese sehen Sie im Ablauf, bevor Sie etwas verbindlich buchen.
        </p>
      </div>
    </>
  );

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/autoschluessel',
          name: page?.headline ?? 'Autoschlüssel',
          description: page?.seo.description,
          crumbs: [{ href: '/autoschluessel', label: 'Autoschlüssel' }],
          faq: page?.faq?.length ? page.faq : FAQ,
        })}
      />

      {/* Kopf mit Blickfang (7/5): die vier Schlüsselarten als Zeichnungen, Schriftfeld mit den Eckdaten */}
      <PageHeader
        bereich="autoschluessel"
        eyebrow="Themenwelt Autoschlüssel"
        title={page?.headline ?? 'Autoschlüssel'}
        lead={page?.subline ?? 'Nachmachen, programmieren, reparieren — mit klarem Ablauf und festem Termin.'}
        crumbs={[{ href: '/autoschluessel', label: 'Autoschlüssel' }]}
        visual={<SchluesselartenReihe variante="kopf" />}
        actions={
          <ButtonLink href="/autoschluessel/anfrage" pfeil prefetch={false} className="whitespace-nowrap">
            {/* Telefon: Kurzlaut, damit der Knopf einzeilig bleibt */}
            <span className="sm:hidden">Termin anfragen</span>
            <span className="hidden sm:inline">Fahrzeug auswählen und Termin anfragen</span>
          </ButtonLink>
        }
      >
        <dl className="grid grid-cols-2 border-y border-border sm:grid-cols-4">
          {[
            { label: 'Ablauf', wert: PROCESS_LABELS['termin-mit-anzahlung'].label, wort: true },
            { label: 'Anzahlung', wert: deposit },
            { label: 'Vorlauf', wert: `ca. ${leadDays}\u00a0Tage` },
            { label: 'Erfasste Modelle', wert: String(modelCount) },
          ].map((feld, index) => (
            <div
              key={feld.label}
              className={cn(
                'flex flex-col py-4 pr-3 sm:pr-4',
                index % 2 === 1 && 'border-l border-border pl-3',
                index > 0 && 'sm:border-l sm:pl-4',
              )}
            >
              <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted max-sm:tracking-label-eng xl:whitespace-nowrap">
                {feld.label}
              </dt>
              {/* Werte stehen unten auf einer Grundlinie; Zahlen in Mono, Wortwerte in Inter */}
              <dd
                className={cn(
                  'mt-auto pt-1 text-title-sm font-semibold text-foreground',
                  !feld.wort && 'font-mono tabular-nums',
                )}
              >
                {feld.wert}
              </dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* Abschnitt 01: Einleitung, danach die Begriffsliste mit ruhiger Zeichnung je Bauform */}
      <Section id="schluesselarten" labelledBy="schluesselarten-titel">
        <SectionHeading
          id="schluesselarten-titel"
          nummer="01"
          eyebrow="Schlüsselarten"
          title="Worum es in diesem Bereich geht"
        />
        <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-gutter">
          <div className="prose-sm24 max-w-measure lg:col-span-7">
            <p>
              {page?.intro
                ?? 'Wir klären zuerst, was Ihr Fahrzeug braucht, und nennen Ihnen danach Preis oder '
                  + 'Preisrahmen. Erst dann buchen Sie einen Termin.'}
            </p>
            <p>
              Ein Autoschlüssel besteht aus zwei Teilen, die getrennt betrachtet werden: dem
              mechanischen Bart und der Elektronik. Für Ihren Auftrag ist entscheidend, welcher der
              beiden Teile bearbeitet werden muss — davon hängen Aufwand, Termin und Preis ab.
            </p>
            <p>
              Die folgenden Begriffe führen Sie zu der Seite, die Ihren Fall beschreibt. Wenn Sie
              unsicher sind, beginnen Sie mit dem geführten Ablauf: Dort fragen wir Schritt für
              Schritt genau die Angaben ab, die für Ihr Fahrzeug nötig sind.
            </p>
          </div>

          {/* Randnotiz rechts neben der Einleitung, unten bündig: führt in die Begriffsliste darunter */}
          <div className="mt-10 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:self-end lg:border-t lg:border-border lg:pt-5">
            <h3 className="text-title-sm font-semibold text-foreground">{KEY_KIND_HINT.title}</h3>
            <p className="mt-2 max-w-measure text-body text-foreground-muted">{KEY_KIND_HINT.body}</p>
          </div>
        </div>

        <div className="mt-8">
          <dl className="border-t border-border">
            {SCHLUESSELARTEN_BEGRIFFE.map((art) => (
              <div
                key={art}
                className="grid gap-x-6 gap-y-2 border-b border-border py-5 lg:grid-cols-12 lg:items-start"
              >
                <dt className="flex items-start gap-4 lg:col-span-5 lg:gap-6">
                  {art === 'keyless' ? (
                    // Keyless ist keine Bauform: gleich breiter Platz, damit der Name in der Spalte bleibt
                    <span aria-hidden className="w-28 shrink-0 sm:w-40" />
                  ) : (
                    <SchluesselartZeichnung art={art} className="w-28 shrink-0 sm:w-40" />
                  )}
                  <span className="text-title-sm font-semibold text-foreground">{keyKindLabel(art)}</span>
                </dt>
                <dd className="max-w-measure text-small text-foreground-muted sm:pl-44 lg:col-span-7 lg:pl-0">
                  {keyKindDescription(art)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Leistungsbegriffe als Begriffsliste mit Haarlinien; die ganze Zeile ist der Link */}
      <Section tone="muted" id="leistungen">
        <SectionHeading
          nummer="02"
          eyebrow="Leistungen"
          title="Alle Begriffe, sauber getrennt"
          lead="Die Begriffe werden im Alltag oft vermischt. Hier steht, was jeweils gemeint ist und wohin er führt."
        />

        <div className="mt-10 space-y-12">
          {TOPIC_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title} className="lg:grid lg:grid-cols-12 lg:gap-gutter">
                <div className="flex items-start gap-4 lg:sticky lg:top-28 lg:col-span-4 lg:flex-col lg:self-start">
                  <Icon size={40} className="shrink-0 text-area-strong" />
                  <div>
                    <h3 className="text-title font-semibold text-foreground">{group.title}</h3>
                    <p className="mt-1 text-small text-foreground-muted">{group.lead}</p>
                  </div>
                </div>

                <ul className="mt-5 border-t border-border lg:col-span-8 lg:mt-0">
                  {group.topics.map((topic) => (
                    <li
                      key={topic.term}
                      className="group relative border-b border-border transition-colors duration-quick hover:border-primary"
                    >
                      {/* Telefon: Pfeil rechts neben Begriff und Erklärung; ab md drei Spalten */}
                      <div className="grid grid-cols-12 gap-x-3 gap-y-2 py-4 md:items-start md:gap-4 md:py-5">
                        <div className="col-span-10 col-start-1 row-start-1 flex items-center md:col-span-4 lg:col-span-5">
                          <h4 className="text-body font-semibold text-foreground">{topic.term}</h4>
                          {topic.hint && <InfoTip hint={topic.hint} className="relative z-raised ml-1.5" />}
                        </div>
                        <p className="col-span-10 col-start-1 row-start-2 text-small text-foreground-muted md:col-span-6 md:col-start-5 md:row-start-1 lg:col-span-6 lg:col-start-6">
                          {topic.body}
                        </p>
                        <Weiter
                          size={18}
                          className="col-span-2 col-start-11 row-span-2 row-start-1 self-center justify-self-end md:col-span-1 md:col-start-12 md:row-span-1 md:row-start-1 md:self-start md:pt-1"
                        />
                      </div>
                      {/* Die ganze Zeile ist der Link; der Begriff trägt die Bedeutung. */}
                      <Link href={topic.href} className="absolute inset-0">
                        <span className="sr-only">{topic.term}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Ablauf in fünf Schritten: Fortschritt läuft mit dem Scrollen (B-03) */}
      <Section tone="sunken" id="ablauf">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-start">
            <SectionHeading
              nummer="03"
              eyebrow="Ablauf"
              title="In fünf Schritten zum Termin"
              lead="Mobil bedienbar. Ihre Eingaben bleiben erhalten, wenn Sie zwischendurch abbrechen."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/autoschluessel/anfrage" size="lg" pfeil>
                Ablauf starten
              </ButtonLink>
              <ButtonLink href="/autoschluessel/marken" size="lg" variant="outline">
                Erst Fahrzeug nachschlagen
              </ButtonLink>
            </div>
            <div className="mt-8 hidden gap-3 border-t border-border pt-5 lg:flex">
              {anzahlungHinweis}
            </div>
          </div>

          <ol className="relative lg:col-span-7 lg:col-start-6 lg:row-start-1">
            {/* Schiene und Fortschritt: der Strich füllt sich, während die Schritte vorbeiziehen */}
            <span aria-hidden className="absolute bottom-6 left-5 top-6 w-px bg-border-strong" />
            <span aria-hidden className="sm24-scrub-y absolute bottom-6 left-5 top-6 w-px bg-area" />
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex gap-6 pb-10 last:pb-0">
                <span
                  aria-hidden
                  className="sm24-scrub-marke relative z-raised flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-area bg-surface font-mono text-small font-semibold tabular-nums text-area-strong"
                >
                  {index + 1}
                </span>
                <div className="pt-1.5">
                  <p className="text-title-sm font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1.5 max-w-measure text-body text-foreground-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Anzahlung und Vorlauf als Zeile mit Glyphe: Desktop unter den Knöpfen, mobil nach Schritt 5 */}
          <div className="flex gap-3 border-t border-border pt-5 lg:hidden">
            {anzahlungHinweis}
          </div>
        </div>
      </Section>

      {/* Fahrzeuge: Raster 7/5, Markenliste mit Haarlinien-Ruhe */}
      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading
              nummer="04"
              eyebrow="Fahrzeuge"
              title="Was für Ihre Marke und Ihr Modell gilt"
              lead={`Zu ${makes.length} Marken und ${modelCount} Modellen haben wir hinterlegt, welche Schlüsselarten vorkommen und ob das Fahrzeug zum Anlernen vor Ort sein muss.`}
            />
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="/autoschluessel/marken" pfeil>
                Alle Marken
              </ButtonLink>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-5">
            {makes.slice(0, 9).map((make) => (
              <li key={make.id}>
                <Link
                  href={`/autoschluessel/marken/${make.slug}`}
                  className="group flex min-h-touch items-center justify-between gap-2 whitespace-nowrap rounded-lg border border-border bg-surface px-3.5 py-2.5 text-small font-semibold text-foreground transition-colors duration-quick hover:border-primary hover:text-primary"
                >
                  {make.name}
                  <Weiter size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Fragen */}
      <Section>
        <SectionHeading
          nummer="05"
          eyebrow="Häufige Fragen"
          title="Was vor dem Auftrag meist offen ist"
          className="max-w-2xl"
        />
        <Accordion items={page?.faq?.length ? page.faq : FAQ} className="mt-8 max-w-2xl" />
      </Section>

      {/* Weiterführend als Stückliste mit Haarlinien; die ganze Zeile ist der Link */}
      <Section tone="muted" tight>
        <SectionHeading
          nummer="06"
          eyebrow="Weiterlesen"
          title="Weiterführende Seiten"
          lead="Passend zum Thema Autoschlüssel."
        />
        <ul className="mt-6 grid border-t border-border md:grid-cols-2 md:gap-x-gutter">
          {[
            { href: '/autoschluessel/anfrage', label: 'Geführter Ablauf', description: 'Fahrzeug wählen, Preis erhalten, Termin buchen' },
            { href: '/autoschluessel/marken', label: 'Marken und Modelle', description: 'Schlüsselarten je Fahrzeug nachschlagen' },
            { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Schlüssel verloren — was tun?', description: 'Die richtige Reihenfolge' },
            { href: '/ratgeber/unterschied-kopie-und-programmierung', label: 'Kopie oder Programmierung?', description: 'Der Unterschied kurz erklärt' },
            { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage', description: 'Für Schlüssel ohne Fahrzeugbezug' },
            { href: '/service-und-termin/terminstatus', label: 'Terminstatus', description: 'Stand Ihres Vorgangs abrufen' },
          ].map((link) => (
            <li
              key={link.href}
              className="group relative flex items-center justify-between gap-4 border-b border-border py-5 transition-colors duration-quick hover:border-primary"
            >
              <div className="min-w-0">
                <h3 className="text-body font-semibold text-foreground">{link.label}</h3>
                <p className="mt-1 text-small text-foreground-muted">{link.description}</p>
              </div>
              <Weiter size={18} />
              <Link href={link.href} className="absolute inset-0">
                <span className="sr-only">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
