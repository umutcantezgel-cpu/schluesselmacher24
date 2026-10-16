import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { InfoHint } from '@/lib/types';
import { ButtonLink } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ErweiterbareAnlage, SystemVergleich, systemReiter } from '@/components/schliessanlagen/system-erklaerung';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { IconEinsteckschloss } from '@/components/visual/icons/einsteckschloss';
import type { IconProps } from '@/components/visual/icons/icon-base';
import { IconPruefung } from '@/components/visual/icons/pruefung';
import { GlyphGebaeude } from '@/components/visual/glyphen/gebaeude';
import { GlyphPersonen } from '@/components/visual/glyphen/personen';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { SchliessplanInteraktiv } from '@/components/visual/interaktiv/schliessplan-interaktiv';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

const ROUTE = 'schliessanlagen';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Mechanische Schließanlagen planen',
    description:
      page?.seo.description
      ?? 'Gleichschließung, Zentralschlossanlage, Hauptschlüsselanlage und '
        + 'Generalhauptschlüsselanlage — in einfacher Sprache erklärt und im Konfigurator erfassbar.',
    alternates: { canonical: '/schliessanlagen' },
  };
}

/** Begriffe, die auf dieser Seite immer wieder vorkommen. */
const GLOSSARY: { term: string; summary: string; hint: InfoHint }[] = [
  {
    term: 'Schließstelle',
    summary: 'Jede Stelle, an der geschlossen wird — meist ein Zylinder in einer Tür.',
    hint: {
      title: 'Schließstelle',
      body:
        'Eine Schließstelle ist ein Punkt, an dem ein Zylinder oder ein Schloss sitzt. Eine Tür '
        + 'mit einem Zylinder ist eine Schließstelle. Eine doppelflügelige Tür mit zwei Zylindern '
        + 'sind zwei. Auch Briefkästen, Schränke, Schranken oder Vorhangschlösser zählen mit, '
        + 'wenn sie in die Anlage aufgenommen werden sollen.',
      figure: {
        motif: 'Schemazeichnung Grundriss mit markierten Schließstellen an Türen und Nebenstellen',
        ratio: '4/3',
      },
    },
  },
  {
    term: 'Schließplan',
    summary: 'Die Tabelle, in der steht, welcher Schlüssel welche Tür öffnet.',
    hint: {
      title: 'Schließplan',
      body:
        'Der Schließplan ist eine Tabelle: In den Zeilen stehen die Türen, in den Spalten die '
        + 'Schlüssel. Ein Kreuz bedeutet, dass dieser Schlüssel diese Tür öffnet. Der Plan wird '
        + 'vor der Fertigung gemeinsam abgestimmt und danach zur Grundlage der Anlage.',
      figure: {
        motif: 'Schemazeichnung Schließplan: Raster aus Türen, Schlüsseln und Kreuzen',
        ratio: '16/9',
      },
    },
  },
  {
    term: 'Sicherungskarte',
    summary: 'Der Nachweis, mit dem Schlüssel zu einer bestehenden Anlage nachbestellt werden.',
    hint: {
      title: 'Sicherungskarte',
      body:
        'Bei vielen Anlagen gehört eine Karte oder ein Nachweisdokument dazu. Nur wer diesen '
        + 'Nachweis vorlegt, kann weitere Schlüssel für die Anlage bestellen. Wenn Sie die Karte '
        + 'nicht finden, sagen Sie uns das im Konfigurator — wir prüfen dann, welche Wege es gibt.',
      figure: {
        motif: 'Schemazeichnung Sicherungskarte mit Anlagennummer, neutral ohne Herstellerbezug',
        ratio: '3/2',
      },
    },
  },
];

/** Zeichen des Bereichs Schließanlagen für die Zeile „Mehrere Gebäude“. */
function BereichsZeichen(props: IconProps) {
  return <BereichIcon area="schliessanlagen" {...props} />;
}

const AUDIENCES: { icon: ComponentType<IconProps>; title: string; body: string; href: string; linkLabel: string }[] = [
  {
    icon: IconEinsteckschloss,
    title: 'Privat',
    body:
      'Haus oder Wohnung mit Nebentüren: Keller, Garage, Gartentor, Briefkasten. Meist genügt '
      + 'eine Gleichschließung — ein Schlüssel für alles.',
    href: '/gleichschliessende-zylinder',
    linkLabel: 'Kleine Vorhaben direkt konfigurieren',
  },
  {
    icon: GlyphGebaeude,
    title: 'Unternehmen',
    body:
      'Büro, Werkstatt, Lager, Serverraum: Nicht jede Person braucht jede Tür. Eine '
      + 'Hauptschlüsselanlage (HS) bildet Zuständigkeiten ab, ohne den Alltag zu erschweren.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Projekt erfassen',
  },
  {
    icon: GlyphPersonen,
    title: 'Hausverwaltung',
    body:
      'Mehrere Parteien, gemeinsame Türen, wechselnde Mieter. Eine Zentralschlossanlage (Z) '
      + 'trennt die Wohnungen und öffnet die gemeinsamen Zugänge für alle.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Objekt erfassen',
  },
  {
    icon: IconPruefung,
    title: 'Öffentliche Einrichtung',
    body:
      'Schule, Verwaltung, Einrichtung mit Publikumsverkehr: viele Bereiche, klar getrennte '
      + 'Zuständigkeiten und ein nachvollziehbarer Schließplan.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Bedarf erfassen',
  },
  {
    icon: BereichsZeichen,
    title: 'Mehrere Gebäude',
    body:
      'Verteilte Standorte oder eine größere Liegenschaft: Eine Generalhauptschlüsselanlage '
      + '(GHS) fasst mehrere Gebäude unter einer gemeinsamen Ebene zusammen.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Liegenschaft erfassen',
  },
];

/** Weiterführende Seiten: Stückliste mit Haarlinien, die ganze Zeile ist der Link. */
const WEITERFUEHREND = [
  {
    href: '/schliessanlagen/konfigurator',
    label: 'Projektkonfigurator',
    body: 'Zehn Frageblöcke zu Objekt, Nutzern, Türen und Berechtigungen.',
  },
  {
    href: '/gleichschliessende-zylinder',
    label: 'Gleichschließende Zylinder',
    body: 'Für kleine Vorhaben ohne Berechtigungsstufen.',
  },
  {
    href: '/elektronische-zutrittsloesungen',
    label: 'Elektronische Zutrittslösungen',
    body: 'Wenn Rechte änderbar sein sollen, ohne Zylinder zu tauschen.',
  },
  {
    href: '/tuer-und-schliesstechnik',
    label: 'Tür- und Schließtechnik',
    body: 'Zylinder, Schlösser und Beschläge rund um die Tür.',
  },
  {
    href: '/ratgeber/welche-schliessanlage-passt',
    label: 'Welche Anlage passt?',
    body: 'Entscheidungshilfe im Ratgeber.',
  },
  {
    href: '/service-und-termin/kontakt',
    label: 'Kontakt',
    body: 'Wenn Sie vor der Erfassung eine Frage klären möchten.',
  },
];

/** Fällt nur ein, solange in der Datenschicht keine Fragen gepflegt sind. */
const FALLBACK_FAQ = [
  {
    question: 'Muss ich die Abkürzungen Z, HS und GHS kennen, bevor ich anfrage?',
    answer:
      'Nein. Im Konfigurator beschreiben Sie Ihr Objekt und wer welche Tür öffnen soll. Daraus '
      + 'leiten wir einen Vorschlag für das passende System ab und besprechen ihn mit Ihnen.',
  },
  {
    question: 'Was ist der Unterschied zwischen einer Gleichschließung und einer Schließanlage?',
    answer:
      'Bei einer Gleichschließung öffnet jeder Schlüssel jede Tür. Eine Schließanlage unterscheidet '
      + 'dagegen, wer welche Tür öffnen darf, und bildet dafür Ebenen ab — vom Nutzerschlüssel bis '
      + 'zum Hauptschlüssel.',
  },
  {
    question: 'Kann ich eine Anlage später erweitern?',
    answer:
      'Das entscheidet sich bei der Planung. Wenn im Schließplan Reserven für weitere Türen und '
      + 'Nutzer vorgesehen sind, lassen sich später Schließstellen ergänzen. Sagen Sie uns deshalb '
      + 'im Konfigurator, was Sie in den nächsten Jahren vorhaben.',
  },
  {
    question: 'Ich habe schon eine Anlage. Können Sie sie ergänzen?',
    answer:
      'Das hängt vom vorhandenen System und vom Nachweis ab. Geben Sie im Konfigurator Hersteller, '
      + 'System und die Sicherungskarte an, soweit Ihnen das bekannt ist, und laden Sie vorhandene '
      + 'Pläne oder Fotos hoch. Wir prüfen danach, was möglich ist.',
  },
  {
    question: 'Wie kommt der Preis zustande?',
    answer:
      'Eine Schließanlage wird nach Ihrem Schließplan gefertigt. Preis und Aufwand hängen von der '
      + 'Anzahl der Schließstellen, der Schlüssel und der Ebenen ab. Deshalb nennen wir erst nach '
      + 'der Erfassung einen Betrag — und nicht vorab auf der Seite.',
  },
  {
    question: 'Brauchen alle Türen denselben Zylinder?',
    answer:
      'Nein. Innerhalb einer Anlage können Zylinder unterschiedlich ausgestattet sein — etwa '
      + 'Außentüren mit höherem Schutz gegen Aufbohren und Ziehen, Innentüren in einfacherer '
      + 'Ausführung. Welche Tür welche Ausstattung braucht, halten wir im Schließplan fest.',
  },
  {
    question: 'Was passiert, wenn ein Hauptschlüssel verloren geht?',
    answer:
      'Ein übergeordneter Schlüssel öffnet viele Türen. Bei einer rein mechanischen Anlage müssen '
      + 'deshalb meist die betroffenen Zylinder getauscht oder umgestellt werden. Für Türen mit '
      + 'hohem Verlustrisiko kann eine elektronische Lösung sinnvoll sein, weil sich ein verlorenes '
      + 'Medium dort sperren lässt.',
  },
  {
    question: 'Wer darf Nachschlüssel bestellen?',
    answer:
      'Bei Anlagen mit Sicherungskarte nur, wer die Karte vorlegt. Ob ein Profil zusätzlich '
      + 'geschützt ist und wie lange, hängt vom Hersteller und vom System ab. Bewahren Sie die '
      + 'Karte getrennt von den Schlüsseln auf.',
  },
  {
    question: 'Was gilt an Flucht- und Rettungswegen?',
    answer:
      'Türen in Flucht- und Rettungswegen müssen sich in Fluchtrichtung jederzeit ohne Schlüssel '
      + 'öffnen lassen. Dafür gibt es Notausgangs- und Paniktürverschlüsse nach DIN EN 179 und '
      + 'DIN EN 1125 sowie passende Zylinder. Kennzeichnen Sie solche Türen im Konfigurator, damit '
      + 'wir sie im Schließplan berücksichtigen.',
  },
  {
    question: 'Wie pflege ich die Zylinder?',
    answer:
      'Verwenden Sie kein Öl und kein Kriechöl — beides verharzt und zieht Schmutz an. Geeignet ist '
      + 'ein Pflegespray für Schließzylinder nach Angabe des Herstellers.',
  },
];

export default async function SchliessanlagenPage() {
  const page = await getPageContent(ROUTE);
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/schliessanlagen',
          name: page?.headline ?? 'Schließanlagen',
          description: page?.seo.description,
          crumbs: [{ href: '/schliessanlagen', label: 'Schließanlagen' }],
          faq: faq,
        })}
      />

      <PageHeader
        eyebrow="Mechanische Schließanlagen"
        title={page?.headline ?? 'Mechanische Schließanlagen'}
        lead={page?.subline ?? 'Von der Gleichschließung bis zur Generalhauptschlüsselanlage.'}
        crumbs={[{ href: '/schliessanlagen', label: 'Schließanlagen' }]}
        /* Blickfang im Kopf (E4-L-23): der Schlüsselstapel, auf Papier ohne Rahmen. */
        visual={
          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Schließplan auf dem Tisch neben sortierten Profilzylindern',
              ratio: '4/3',
              note: 'Echtes Foto aus dem eigenen Betrieb. Kein Stockfoto.',
              visual: { generator: 'schluessel', params: { typ: 'zylinder', anzahl: 3 } },
            }}
            frei
          />
        }
        actions={
          <>
            <ButtonLink href="/schliessanlagen/konfigurator" size="lg" pfeil>
              Projekt erfassen
            </ButtonLink>
            <ButtonLink href="#systeme" size="lg" variant="outline">
              Zu den Systemen
            </ButtonLink>
          </>
        }
      />

      {/* Einstieg: Text und Ablauf links, Begriffe als Haarlinienliste rechts */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-7">
            <p className="text-body leading-relaxed text-foreground-muted">
              {page?.intro
                ?? 'Eine Schließanlage regelt, wer welche Tür öffnen darf. Wir erklären die Systeme '
                  + 'in einfacher Sprache und planen Ihre Anlage so, dass sie später erweitert '
                  + 'werden kann.'}
            </p>

            <p className="mt-4 text-body leading-relaxed text-foreground-muted">
              Der Weg dorthin ist immer derselbe: Sie erfassen Ihr Objekt, Ihre Nutzer und Ihre
              Türen. Daraus entsteht ein Schließplan, den wir gemeinsam mit Ihnen abstimmen. Erst
              danach wird gefertigt.
            </p>

            <dl className="mt-6 border-y border-border py-4">
              <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                {process.label}
              </dt>
              <dd className="mt-1.5 max-w-measure text-small leading-relaxed text-foreground-muted">
                {process.hint}
              </dd>
            </dl>
          </div>

          <dl className="border-t border-border lg:col-span-5">
            {GLOSSARY.map((item) => (
              <div key={item.term} className="border-b border-border py-5">
                <dt className="flex items-start justify-between gap-3">
                  <span className="text-title-sm font-semibold text-foreground">{item.term}</span>
                  <InfoTip hint={item.hint} />
                </dt>
                <dd className="mt-1.5 max-w-measure text-small leading-relaxed text-foreground-muted">
                  {item.summary}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Die fünf Systeme einmal erzählt: der interaktive Plan mit den Texten als Reiterinhalt */}
      <Section id="systeme" labelledBy="systeme-titel" tone="sunken">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <SectionHeading
            id="systeme-titel"
            className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start"
            nummer="01"
            eyebrow="Systeme"
            title="Die fünf Systeme in einfacher Sprache"
            lead="Die vollständige Bezeichnung steht immer zuerst, die übliche Abkürzung folgt in Klammern. Vorwissen brauchen Sie nicht."
          />
          <div className="lg:col-span-7">
            <SchliessplanInteraktiv anfang="haupt" tueren={4} gruppen={2} details={systemReiter()} />
          </div>
        </div>

        <div className="mt-16">
          <ErweiterbareAnlage />
        </div>

        <div className="mt-16">
          <h3 className="text-title font-bold text-foreground">Die Systeme im Vergleich</h3>
          <p className="mt-2 max-w-2xl text-body leading-relaxed text-foreground-muted">
            Wenn Sie unsicher sind, welches System zu Ihnen passt: Die Tabelle zeigt die
            Unterschiede nebeneinander. Im Konfigurator leiten wir daraus einen Vorschlag ab.
          </p>
          <div className="mt-6">
            <SystemVergleich />
          </div>
        </div>
      </Section>

      {/* Für wen: Stückliste, ganze Zeile ist der Link */}
      <Section labelledBy="fuer-wen-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            id="fuer-wen-titel"
            className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
            nummer="02"
            eyebrow="Für wen"
            title="Wer plant welche Anlage?"
            lead="Die Zuordnung ist ein Anhaltspunkt, keine Festlegung. Entscheidend sind Ihre Türen und Ihre Zuständigkeiten."
          />

          <ol className="border-t border-border lg:col-span-8">
            {AUDIENCES.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="border-b border-border">
                  <Link href={item.href} className="group flex min-h-touch gap-4 py-6 sm:gap-6">
                    <span className="w-6 shrink-0 pt-1 font-mono text-caption tabular-nums text-foreground-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon size={24} className="mt-0.5 shrink-0 text-area-strong" />
                    <span className="min-w-0 flex-1">
                      <h3 className="block text-title-sm font-semibold text-foreground group-hover:text-primary">
                        {item.title}
                      </h3>
                      <span className="mt-1.5 block max-w-measure text-small leading-relaxed text-foreground-muted">
                        {item.body}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-primary">
                        {item.linkLabel}
                        <GlyphPfeilRechts
                          size={16}
                          className="transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* Kleine Vorhaben */}
      <Section tone="muted" tight>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading nummer="04" eyebrow="Gleichschließung" title="Wenige Türen, ein Schlüssel für alles?" />
            <p className="mt-3 text-body leading-relaxed text-foreground-muted">
              Dann brauchen Sie keinen Schließplan. Gleichschließende Zylinder stellen Sie selbst
              zusammen — Bauform, Maße und Anzahl der gemeinsamen Schlüssel — und bestellen direkt.
              Der Projektkonfigurator lohnt sich erst, wenn unterschiedliche Personen
              unterschiedliche Türen öffnen sollen.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/gleichschliessende-zylinder">
                Zu den gleichschließenden Zylindern
              </ButtonLink>
              <ButtonLink href="/schliessanlagen/konfigurator" variant="outline">
                Trotzdem Projekt erfassen
              </ButtonLink>
            </div>
          </div>

          <Alert tone="info" title="Woran Sie den Unterschied erkennen" className="lg:col-span-5">
            Sobald jemand eine Tür nicht öffnen können soll — etwa ein Mieter die Wohnung nebenan
            oder eine Aushilfe das Büro der Leitung — reicht eine Gleichschließung nicht mehr aus.
            Dann planen wir eine Anlage mit Ebenen.
          </Alert>
        </div>
      </Section>

      {/* Fragen */}
      <Section>
        <SectionHeading nummer="03" eyebrow="Fragen" title="Häufige Fragen zu Schließanlagen" />
        <div className="mt-8">
          <Accordion items={faq} />
        </div>
      </Section>

      {/* Weiterführend: nummerierte Stückliste mit Haarlinien */}
      <Section tone="muted" tight>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading nummer="05" eyebrow="Passend dazu" title="Passend dazu" className="lg:col-span-4" />

          <ol className="border-t border-border lg:col-span-8">
            {WEITERFUEHREND.map((link, index) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  className="group flex min-h-touch items-center gap-4 py-5 transition-colors duration-quick ease-standard sm:gap-6"
                >
                  <span className="w-6 shrink-0 self-start pt-1 font-mono text-caption tabular-nums text-foreground-muted sm:w-8">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-title-sm font-semibold text-foreground group-hover:text-primary">
                      {link.label}
                    </span>
                    <span className="mt-1 block max-w-measure text-small leading-relaxed text-foreground-muted">
                      {link.body}
                    </span>
                  </span>
                  <GlyphPfeilRechts
                    size={18}
                    className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-hover:translate-x-1 group-hover:text-primary"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
