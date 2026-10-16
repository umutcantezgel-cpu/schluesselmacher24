import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Users } from 'lucide-react';

import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { InfoHint } from '@/lib/types';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { SystemErklaerung, SystemVergleich } from '@/components/schliessanlagen/system-erklaerung';
import { SchliessanlagenConfigurator } from '@/components/schliessanlagen/schliessanlagen-configurator';
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

const AUDIENCES = [
  {
    icon: Layers,
    title: 'Privat',
    body:
      'Haus oder Wohnung mit Nebentüren: Keller, Garage, Gartentor, Briefkasten. Meist genügt '
      + 'eine Gleichschließung — ein Schlüssel für alles.',
    href: '/gleichschliessende-zylinder',
    linkLabel: 'Kleine Vorhaben direkt konfigurieren',
  },
  {
    icon: Building2,
    title: 'Unternehmen',
    body:
      'Büro, Werkstatt, Lager, Serverraum: Nicht jede Person braucht jede Tür. Eine '
      + 'Hauptschlüsselanlage (HS) bildet Zuständigkeiten ab, ohne den Alltag zu erschweren.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Projekt erfassen',
  },
  {
    icon: Users,
    title: 'Hausverwaltung',
    body:
      'Mehrere Parteien, gemeinsame Türen, wechselnde Mieter. Eine Zentralschlossanlage (Z) '
      + 'trennt die Wohnungen und öffnet die gemeinsamen Zugänge für alle.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Objekt erfassen',
  },
  {
    icon: Building2,
    title: 'Öffentliche Einrichtung',
    body:
      'Schule, Verwaltung, Einrichtung mit Publikumsverkehr: viele Bereiche, klar getrennte '
      + 'Zuständigkeiten und ein nachvollziehbarer Schließplan.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Bedarf erfassen',
  },
  {
    icon: Layers,
    title: 'Mehrere Gebäude',
    body:
      'Verteilte Standorte oder eine größere Liegenschaft: Eine Generalhauptschlüsselanlage '
      + '(GHS) fasst mehrere Gebäude unter einer gemeinsamen Ebene zusammen.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Liegenschaft erfassen',
  },
];

/** Fällt nur ein, solange in der Datenschicht keine Fragen gepflegt sind. */


export default async function SchliessanlagenPage() {
  const page = await getPageContent(ROUTE);
  const faq = page?.faq?.length ? page.faq : [

            {
              question: 'Wie unterscheidet sich eine Hauptschlüsselanlage von einer Generalhauptschlüsselanlage?',
              answer: 'Eine Hauptschlüsselanlage (HS) hat genau zwei Hierarchieebenen: Ein übergeordneter Hauptschlüssel schließt alle Türen, die untergeordneten Einzelschlüssel schließen nur jeweils ihre spezifische Tür. Eine Generalhauptschlüsselanlage (GHS) verfügt über mindestens drei Ebenen. Neben dem Generalhauptschlüssel gibt es Gruppenschlüssel, die nur bestimmte Bereiche (z.B. Abteilungen oder Gebäude) schließen, und darunterliegende Einzelschlüssel. GHS-Anlagen eignen sich für komplexe Organisationsstrukturen.',
            },
            {
              question: 'Was passiert, wenn ein Schlüssel einer Schließanlage verloren geht?',
              answer: 'Der Verlust eines Schlüssels stellt ein Sicherheitsrisiko dar. Bei einem mechanischen Einzelschlüssel muss in der Regel nur der betroffene Zylinder getauscht werden. Geht jedoch ein Haupt- oder Gruppenschlüssel verloren, kann der Austausch der gesamten Anlage oder großer Teile davon notwendig sein, was mit erheblichen Kosten verbunden ist. Mechanische Anlagen bieten hier keine Möglichkeit, einzelne Schlüssel auszuprogrammieren. Deshalb empfehlen wir für Bereiche mit hohem Fluktuations- oder Verlustrisiko den Einsatz mechatronischer oder rein elektronischer Komponenten, bei denen verlorene Identmedien einfach gesperrt werden können.',
            },
            {
              question: 'Können Schließanlagen nachträglich erweitert werden?',
              answer: 'Ja, professionelle Schließanlagen sind grundsätzlich erweiterbar. Es ist jedoch essenziell, dies bereits bei der initialen Planung (Bedarfsanalyse) zu berücksichtigen. Es werden sogenannte "Reserven" in den Schließplan eingebaut, die es ermöglichen, später zusätzliche Türen oder Nutzergruppen zu integrieren, ohne die bestehende Sicherheitsstruktur zu gefährden. Ohne diese geplanten Reserven ist eine spätere Erweiterung oft nicht oder nur eingeschränkt möglich.',
            },
            {
              question: 'Was bedeutet technischer Patentschutz bei Zylindern?',
              answer: 'Ein technischer Patentschutz bedeutet, dass die Konstruktion des Zylinders und des Schlüssels (z.B. spezielle Profile, bewegliche Elemente) rechtlich geschützt ist. Dies verhindert, dass Dritthersteller kompatible Schlüsselrohlinge auf den Markt bringen. Zusammen mit der Sicherungskarte bietet dies den höchsten Schutz vor illegalen Schlüsselkopien. Nach Ablauf des Patentschutzes können jedoch prinzipiell kompatible Rohlinge hergestellt werden. Daher setzen wir auf Systeme mit langer Patentlaufzeit oder zusätzlichem Markenschutz.',
            },
            {
              question: 'Was ist eine Sicherungskarte und wofür wird sie benötigt?',
              answer: 'Die Sicherungskarte ist das zentrale Legitimationsdokument Ihrer Schließanlage. Sie funktioniert ähnlich wie der Fahrzeugbrief bei einem Auto. Nur gegen Vorlage (im Original oder als autorisierte Kopie/PIN, je nach Hersteller) dieser Karte können Nachschlüssel oder zusätzliche Zylinder beim Fachhändler oder Hersteller bestellt werden. Sie schützt Sie somit effektiv davor, dass unberechtigte Personen ohne Ihr Wissen Schlüssel nachmachen lassen.',
            }

];
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
        actions={
          <>
            <ButtonLink href="/schliessanlagen/konfigurator" size="lg">
              Projekt erfassen
              <ArrowRight size={18} aria-hidden />
            </ButtonLink>
            <ButtonLink href="#systeme" size="lg" variant="outline">
              Systeme ansehen
            </ButtonLink>
          </>
        }
      />

      {/* Einstieg und Begriffe */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-[15px] leading-relaxed text-foreground-muted md:text-base">
              {page?.intro
                ?? 'Eine Schließanlage regelt, wer welche Tür öffnen darf. Wir erklären die Systeme '
                  + 'in einfacher Sprache und planen Ihre Anlage so, dass sie später erweitert '
                  + 'werden kann.'}
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
              Der Weg dorthin ist immer derselbe: Sie erfassen Ihr Objekt, Ihre Nutzer und Ihre
              Türen. Daraus entsteht ein Schließplan, den wir gemeinsam mit Ihnen abstimmen. Erst
              danach wird gefertigt.
            </p>

            <div className="mt-6 rounded-lg border border-border bg-surface-muted px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {process.label}
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
            </div>

            <ul className="mt-6 space-y-3">
              {GLOSSARY.map((item) => (
                <li
                  key={item.term}
                  className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-foreground">{item.term}</span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-foreground-muted">
                      {item.summary}
                    </span>
                  </span>
                  <InfoTip hint={item.hint} />
                </li>
              ))}
            </ul>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Schließplan auf dem Tisch neben sortierten Profilzylindern',
              ratio: '4/3',
              note: 'Echtes Foto aus dem eigenen Betrieb. Kein Stockfoto.',
            }}
          />
        </div>
      </Section>

      {/* Interaktiver Kalkulator */}
      <Section>
        <SchliessanlagenConfigurator />
      </Section>

      {/* Die fünf Systeme */}
      <Section id="systeme" tone="muted">
        <SectionHeading
          eyebrow="Systeme"
          title="Die fünf Systeme in einfacher Sprache"
          lead="Die vollständige Bezeichnung steht immer zuerst, die übliche Abkürzung folgt in Klammern. Vorwissen brauchen Sie nicht."
        />
        <div className="mt-8">
          <SystemErklaerung />
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-foreground">Die Systeme im Vergleich</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
            Wenn Sie unsicher sind, welches System zu Ihnen passt: Die Tabelle zeigt die
            Unterschiede nebeneinander. Im Konfigurator leiten wir daraus einen Vorschlag ab.
          </p>
          <div className="mt-5">
            <SystemVergleich />
          </div>
        </div>
      </Section>


      {/* Architektonische Methodik */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Technische Konzeption von Schließanlagen"
          lead="Präzise Planung für Sicherheit, Skalierbarkeit und Langlebigkeit."
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-[18px] font-bold text-foreground">1. Bedarfsanalyse und Ist-Zustand</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Am Anfang jeder erfolgreichen Schließanlage steht eine fundierte Analyse. Wir erfassen nicht nur die
              aktuellen Türen und Nutzergruppen, sondern berücksichtigen auch zukünftige Erweiterungen.
              Die Strukturierung in unterschiedliche Sicherheitszonen und Berechtigungsebenen bildet das
              Fundament für die anschließende mathematische Schließplanberechnung. Eine präzise Bedarfsanalyse
              verhindert spätere Sicherheitslücken und teure Nachrüstungen. Die Kombination aus mechanischer
              und mechatronischer Absicherung kann dabei ebenfalls evaluiert werden.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Hierbei spielen Aspekte wie Flucht- und Rettungswege, Brandschutzanforderungen sowie
              organisatorische Abläufe innerhalb des Gebäudes eine entscheidende Rolle. Der Schließplan
              muss exakt auf die tatsächlichen Arbeitsprozesse der Organisation zugeschnitten sein,
              ohne unnötige Komplexität zu erzeugen. Die Dokumentation des Ist-Zustandes liefert die
              notwendigen Kennzahlen für eine effiziente Konzeptionierung.
            </p>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-foreground">2. Mathematische Schließplanberechnung</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Die Übersetzung der organisatorischen Anforderungen in einen technischen Schließplan erfordert
              höchste Präzision. Jede Hierarchieebene und jede Querschließung muss mathematisch abgebildet
              werden. Dabei achten wir besonders auf die Vermeidung von ungewollten Schließungen (sogenannten
              Mit- oder Fehlschließungen). Durch den Einsatz modernster Berechnungssoftware stellen wir
              sicher, dass die theoretische Permutation der Stiftzuhaltungen im Zylinder optimal
              ausgenutzt wird, ohne die Sicherheit zu kompromittieren.
            </p>
             <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Die Berechnung definiert die Einschnitte auf dem Schlüssel und die entsprechende Bestiftung
              der Zylinderkerne. Bei komplexen Generalhauptschlüsselanlagen (GHS) werden zudem Profilvariationen
              eingesetzt, um die Anzahl der möglichen Schließungen zu vervielfachen und die Anlagensicherheit
              zu maximieren. Jeder berechnete Schließplan durchläuft strenge Qualitätskontrollen, bevor
              er in die Fertigung übergeben wird.
            </p>
          </div>
           <div>
            <h3 className="text-[18px] font-bold text-foreground">3. Profilsicherheit und Patentschutz</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Ein wesentlicher Faktor für die Langzeitsicherheit einer Schließanlage ist der Schutz vor
              illegalen Schlüsselkopien. Wir setzen ausschließlich auf Zylindersysteme mit gültigem
              technischen Patentschutz und integriertem Kopierschutz. Spezielle Profilierungen,
              bewegliche Elemente im Schlüssel oder komplexe Fräsbilder machen es nahezu unmöglich,
              Nachschlüssel mit konventionellen 3D-Druckern oder Fräsmaschinen herzustellen.
            </p>
             <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Zusätzlich sorgt die obligatorische Sicherungskarte dafür, dass legitime Nachbestellungen
              nur von autorisierten Personen durchgeführt werden können. Der Patentschutz garantiert zudem,
              dass Rohlinge auf dem freien Markt nicht verfügbar sind. Diese Kombination aus technischem
              und organisatorischem Schutz gewährleistet die Integrität Ihrer Anlage über viele Jahre hinweg.
            </p>
          </div>
           <div>
            <h3 className="text-[18px] font-bold text-foreground">4. Fertigung und Montage</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Nach der Freigabe des Schließplans erfolgt die präzise Fertigung der Komponenten. Hochmoderne
              CNC-Maschinen fräsen die Schlüssel und bestiften die Zylinder mit mikrometergenauer Toleranz.
              Dies garantiert nicht nur höchste Sicherheit gegen Manipulationsversuche wie Picking oder
              Schlagschlüssel, sondern sorgt auch für einen seidenweichen Lauf und eine lange Lebensdauer
              der Mechanik.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Die anschließende Montage wird durch zertifizierte Techniker durchgeführt. Jeder Zylinder
              wird auf korrekte Funktion und Passgenauigkeit geprüft. Abschließend erhalten Sie eine
              umfassende Dokumentation inklusive des Schließplans und aller relevanten Sicherheitszertifikate.
              Diese Dokumentation bildet die Grundlage für spätere Erweiterungen und Wartungsarbeiten.
            </p>
          </div>
        </div>
      </Section>

      {/* Für wen */}
      <Section>
        <SectionHeading
          eyebrow="Für wen"
          title="Wer plant welche Anlage?"
          lead="Die Zuordnung ist ein Anhaltspunkt, keine Festlegung. Entscheidend sind Ihre Türen und Ihre Zuständigkeiten."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <Card className="flex h-full flex-col">
                  <CardBody className="flex flex-1 flex-col">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon size={19} aria-hidden />
                    </span>
                    <h3 className="mt-4 text-[15px] font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                      {item.body}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                    >
                      {item.linkLabel}
                      <ArrowRight size={15} aria-hidden />
                    </Link>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Kleine Vorhaben */}
      <Section tone="muted" tight>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
              Wenige Türen, ein Schlüssel für alles?
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
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

          <Alert tone="info" title="Woran Sie den Unterschied erkennen">
            Sobald jemand eine Tür nicht öffnen können soll — etwa ein Mieter die Wohnung nebenan
            oder eine Aushilfe das Büro der Leitung — reicht eine Gleichschließung nicht mehr aus.
            Dann planen wir eine Anlage mit Ebenen.
          </Alert>
        </div>
      </Section>

      {/* Fragen */}
      <Section>
        <SectionHeading eyebrow="Fragen" title="Häufige Fragen zu Schließanlagen" />
        <div className="mt-8">
          <Accordion items={faq} />
        </div>
      </Section>

      {/* Weiterführend */}
      <Section tone="muted" tight>
        <h2 className="text-xl font-bold text-foreground">Passend dazu</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
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
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-bold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <span className="mt-1.5 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                  {link.body}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Ansehen
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
