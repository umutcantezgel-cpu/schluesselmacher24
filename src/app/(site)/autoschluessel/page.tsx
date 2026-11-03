import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { getPageContent, getRubrik, getSettings, getVehicleMakes } from '@/lib/data';
import type { InfoHint, KeyKind } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { PROCESS_LABELS } from '@/lib/navigation';
import { cn } from '@/lib/cn';
import { PageHeader } from '@/components/layout/page-header';
import { RubrikAblauf } from '@/components/rubrik/rubrik-ablauf';
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
import { AUFBAU_TEILE, AutoschluesselAufbau } from '@/components/visual/generators/autoschluessel-aufbau';
import { standort } from '@/lib/rechtliches/firma';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

const ROUTE = 'autoschluessel';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel – Leistungen im Überblick',
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
    + 'an – auch dann, wenn der mechanische Bart passt und die Tür aufgeht.',
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
        body: 'Ein vollständiger weiterer Schlüssel – mechanisch gefertigt und elektronisch angelernt.',
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
        body: 'Der metallene Teil des Schlüssels – nach Vorlage oder geeigneten Fahrzeugdaten.',
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
        body: 'Gebrochenes Gehäuse, klemmende Tasten oder schwache Batterie – die Elektronik bleibt erhalten.',
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
      + 'Fahrzeug angelernt werden, hilft ein Versand nicht weiter – dann ist ein Termin mit Fahrzeug '
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

/** Positionen der Aufbauzeichnung mit den Leistungen dazu; Aussagen aus dem Bestand (A-025, R4). */
const AUFBAU_TEXTE: Record<number, { text: string; links: { href: string; label: string }[] }> = {
  1: {
    text: 'Der gefräste Bart öffnet die Tür. Für den Motorstart braucht es meist mehr.',
    links: [
      { href: '/autoschluessel/schluesselbart-fraesen', label: 'Schlüsselbart fräsen' },
      { href: '/autoschluessel/kopieren', label: 'Autoschlüssel kopieren' },
    ],
  },
  2: {
    text: 'Er meldet den Schlüssel bei der Wegfahrsperre an. Ohne angelernten Transponder startet das Fahrzeug nicht; zum Anlernen muss das Fahrzeug vor Ort sein.',
    links: [{ href: '/autoschluessel/programmieren', label: 'Programmieren und anlernen' }],
  },
  3: {
    text: 'Der Sender öffnet und schließt das Fahrzeug per Taste.',
    links: [{ href: '/autoschluessel/funkschluessel', label: 'Funkschlüssel' }],
  },
  4: {
    text: 'Bei den meisten Fahrzeugen bleibt die Programmierung beim Batteriewechsel erhalten.',
    links: [{ href: '/autoschluessel/funkschluessel', label: 'Batteriewechsel' }],
  },
  5: {
    text: 'Bei gebrochenem Gehäuse oder klemmenden Tasten bleibt die vorhandene Elektronik erhalten.',
    links: [{ href: '/autoschluessel/funkschluessel', label: 'Gehäuse tauschen' }],
  },
};

const AUFBAU_LEISTUNGEN = AUFBAU_TEILE.map((teil) => ({ ...teil, ...AUFBAU_TEXTE[teil.nr] }));

export default async function AutoschluesselHubPage() {
  // Rubrik dieser Seite: Ziel des Übergangs aus der Hub-Kachel (B-35)
  const rubrik = await getRubrik('autoschluessel');
  const [page, settings, makes] = await Promise.all([
    getPageContent(ROUTE),
    getSettings(),
    getVehicleMakes(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;
  const modelCount = makes.reduce((sum, make) => sum + make.models.length, 0);

  // Der Ablauf kommt aus der Rubrik (G-10, G-11); Anzahlung und Vorlauf setzt er aus den Einstellungen ein.
  const ablaufWerte = { anzahlung: deposit, vorlauf: `${leadDays}\u00a0Tage` };

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
          können abweichende Werte gelten. Diese sehen Sie im Ablauf, bevor Sie etwas verbindlich buchen.
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
        rubrik={rubrik}
        bereich="autoschluessel"
        eyebrow="Themenwelt Autoschlüssel"
        title={page?.headline ?? 'Autoschlüssel'}
        lead={page?.subline ?? 'Nachmachen, programmieren, reparieren, mit klarem Ablauf und festem Termin.'}
        crumbs={[{ href: '/autoschluessel', label: 'Autoschlüssel' }]}
        visual={<SchluesselartenReihe variante="kopf" />}
        handlungZuerst
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
            { label: 'Werkstatt', wert: standort(settings.company)?.city ?? settings.company.city, wort: true },
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
              {/* Werte stehen unten auf einer Grundlinie; Zahlen in Mono, Wortwerte in Plex Sans */}
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

      {/* Abschnitt 01: Ablauf direkt unter dem Kopf (A-025); Fortschritt läuft mit dem Scrollen (B-03) */}
      <Section tone="sunken" id="ablauf">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-start">
            <SectionHeading
              eyebrow="Ablauf"
              title={`So läuft Ihr Auftrag ab: ${rubrik?.ablauf.length ?? 5} Schritte zum Termin`}
              lead={`${page?.intro ?? 'Wir klären zuerst, was Ihr Fahrzeug braucht, und nennen Ihnen danach Preis oder Preisrahmen. Erst dann buchen Sie einen Termin.'} Ihre Eingaben bleiben erhalten, wenn Sie zwischendurch abbrechen.`}
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

          {rubrik && (
            <RubrikAblauf rubrik={rubrik} werte={ablaufWerte} className="lg:col-span-7 lg:col-start-6 lg:row-start-1" />
          )}

          {/* Anzahlung und Vorlauf als Zeile mit Glyphe: Desktop unter den Knöpfen, mobil nach Schritt 5 */}
          <div className="flex gap-3 border-t border-border pt-5 lg:hidden">
            {anzahlungHinweis}
          </div>
        </div>
      </Section>

      {/* Abschnitt 02: Aufbauzeichnung (A-025); die Positionsnummern führen zu den Leistungen */}
      <Section id="aufbau" labelledBy="aufbau-titel">
        <SectionHeading
          id="aufbau-titel"
          eyebrow="Aufbau"
          title="Was in Ihrem Autoschlüssel steckt"
          lead="Ein Autoschlüssel besteht aus zwei Teilen, die getrennt betrachtet werden: dem mechanischen Bart und der Elektronik. Davon hängen Aufwand, Termin und Preis ab."
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <figure className="m-0 lg:col-span-7">
            <div className="rounded-lg border border-border bg-surface p-3 sm:p-4">
              <AutoschluesselAufbau />
            </div>
            <figcaption className="mt-3 font-mono text-caption text-foreground-muted">
              Schematische Darstellung, nicht maßstäblich.
            </figcaption>
          </figure>
          <ol className="border-t border-border lg:col-span-5">
            {AUFBAU_LEISTUNGEN.map((teil) => (
              <li key={teil.nr} className="flex gap-4 border-b border-border py-5">
                <span
                  aria-hidden
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-area font-mono text-small font-semibold text-area-foreground"
                >
                  {teil.nr}
                </span>
                <div className="min-w-0">
                  <h3 className="text-title-sm font-semibold text-foreground">{teil.name}</h3>
                  <p className="mt-1 max-w-measure text-small text-foreground-muted">{teil.text}</p>
                  <p className="mt-1 flex flex-wrap gap-x-5">
                    {teil.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="group inline-flex min-h-touch items-center gap-1.5 text-small font-semibold text-primary transition-colors duration-quick hover:text-primary-hover"
                      >
                        {link.label}
                        <Weiter size={16} />
                      </Link>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-6 max-w-measure text-small text-foreground-muted">
          Jedes Teil kann einzeln ausfallen. Deshalb grenzen wir die Ursache ein, bevor wir etwas tauschen.
        </p>
      </Section>

      {/* Leistungsbegriffe als Begriffsliste mit Haarlinien; die ganze Zeile ist der Link */}
      <Section tone="muted" id="leistungen">
        <SectionHeading
          eyebrow="Leistungen"
          title="Von Anlernen bis Zweitschlüssel"
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

      {/* Abschnitt 04: Schlüsselarten als Erklärung; die Zeichnungen stehen schon im Kopf (A-025) */}
      <Section id="schluesselarten" labelledBy="schluesselarten-titel" tight>
        <SectionHeading id="schluesselarten-titel" eyebrow="Schlüsselarten" title="Welche Schlüsselart Sie haben" />
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-gutter">
          <dl className="grid border-t border-border sm:grid-cols-2 sm:gap-x-gutter lg:col-span-8">
            {SCHLUESSELARTEN_BEGRIFFE.map((art) => (
              <div key={art} className="border-b border-border py-5">
                <dt className="text-title-sm font-semibold text-foreground">{keyKindLabel(art)}</dt>
                <dd className="mt-1 max-w-measure text-small text-foreground-muted">{keyKindDescription(art)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 lg:col-span-4 lg:mt-0 lg:border-t lg:border-border lg:pt-5">
            <h3 className="text-title-sm font-semibold text-foreground">{KEY_KIND_HINT.title}</h3>
            <p className="mt-2 max-w-measure text-body text-foreground-muted">{KEY_KIND_HINT.body}</p>
          </div>
        </div>
      </Section>

      {/* Fahrzeuge: Raster 7/5, Markenliste mit Haarlinien-Ruhe */}
      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Fahrzeuge"
              title="Was für Ihre Marke und Ihr Modell gilt"
              lead={`Zu ${makes.length} Marken und ${modelCount} Modellen haben wir hinterlegt, welche Schlüsselarten vorkommen und ob das Fahrzeug zum Anlernen in die Werkstatt mitkommen muss.`}
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
          eyebrow="Häufige Fragen"
          title="Was vor dem Auftrag meist offen ist"
          className="max-w-2xl"
        />
        <Accordion items={page?.faq?.length ? page.faq : FAQ} className="mt-8 max-w-2xl" />
      </Section>

      {/* Weiterführend als Stückliste mit Haarlinien; die ganze Zeile ist der Link */}
      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Weiterlesen"
          title="Zum Nachlesen"
          lead="Passend zum Thema Autoschlüssel."
        />
        <ul className="mt-6 grid border-t border-border md:grid-cols-2 md:gap-x-gutter">
          {[
            { href: '/autoschluessel/anfrage', label: 'Geführter Ablauf', description: 'Fahrzeug wählen, Preis erhalten, Termin buchen' },
            { href: '/autoschluessel/marken', label: 'Marken und Modelle', description: 'Schlüsselarten je Fahrzeug nachschlagen' },
            { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Schlüssel verloren: was tun?', description: 'Die richtige Reihenfolge' },
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
