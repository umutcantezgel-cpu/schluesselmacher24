import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getPageContent, getSettings } from '@/lib/data';
import { getRichtwerte } from '@/lib/data/richtwerte';
import { NAV_AREAS, PROCESS_LABELS } from '@/lib/navigation';
import { enthaeltPlatzhalter, istPlatzhalter } from '@/lib/platzhalter';
import { cn } from '@/lib/cn';
import { Erreichbarkeit } from '@/components/vertrauen/erreichbarkeit';
import { erreichbarkeit } from '@/lib/erreichbarkeit';
import { Accordion } from '@/components/ui/accordion';
import { PageHeader } from '@/components/layout/page-header';
import { ServiceEinsatzRechner } from '@/components/calculator/service-einsatz-rechner';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { AblaufGrafik } from '@/components/visual/generators/ablauf';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphWinkelUnten } from '@/components/visual/glyphen/winkel-unten';
import { IconBeratungTelefon } from '@/components/visual/icons/beratung-telefon';
import type { IconProps } from '@/components/visual/icons/icon-base';
import { IconServiceUndTermin } from '@/components/visual/icons/service-und-termin';
import { IconStandort } from '@/components/visual/icons/standort';
import { IconTermin } from '@/components/visual/icons/termin';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('service-und-termin');
  return {
    title: page?.seo.title ?? 'Service und Termin',
    description: page?.seo.description,
    alternates: { canonical: '/service-und-termin' },
  };
}

/** Fach-Icon je Weg (ab 24 px, ohne farbigen Kasten, KERN K-008a). */
const ENTRIES: Array<{ href: string; label: string; description: string; icon: ComponentType<IconProps> }> = [
  {
    href: '/service-und-termin/anfrage',
    label: 'Allgemeine Anfrage',
    description: 'Wenn Ihr Anliegen in keinen der Fachbereiche passt.',
    icon: IconServiceUndTermin,
  },
  {
    href: '/service-und-termin/terminstatus',
    label: 'Terminstatus',
    description: 'Stand Ihres Vorgangs mit Vorgangsnummer und E-Mail-Adresse abrufen.',
    icon: IconTermin,
  },
  {
    href: '/service-und-termin/vor-ort',
    label: 'Vor-Ort-Leistungen',
    description: 'Was wir direkt bei Ihnen im Objekt erledigen.',
    icon: IconStandort,
  },
  {
    href: '/service-und-termin/kontakt',
    label: 'Kontakt',
    description: 'Anschrift, Telefon, E-Mail und Erreichbarkeit.',
    icon: IconBeratungTelefon,
  },
];

/** Die fünf Phasen eines Auftrags: Kopfzeichnung (Abschnitt 03) und Definitionsliste (03.1). */
const PHASEN: Array<{ kurz: string; name: string; text: string }> = [
  {
    kurz: 'Bedarfsanalyse',
    name: 'Bedarf klären',
    text: 'Zuerst klären wir, was Sie brauchen. Wir sehen uns Türen, Zylindermaße, vorhandene Technik und das Gebäude an. Dabei suchen wir auch Schwachstellen, die nicht sofort auffallen.',
  },
  {
    kurz: 'Projektierung',
    name: 'Planen',
    text: 'Danach planen wir die Lösung. Bei Schließanlagen ist das ein Schließplan, der festlegt, wer welche Tür öffnet. Bei elektronischen Systemen planen wir auch Netz, Stromversorgung und die Anbindung an Ihre vorhandene IT oder Ihr Smart Home.',
  },
  {
    kurz: 'Fertigung',
    name: 'Fertigen und vorbereiten',
    text: 'Vor dem Termin bereiten wir alles in unserer Werkstatt vor. Wir fertigen Zylinder nach Maß, richten Transponder ein und testen elektronische Teile vorab. So dauert die Arbeit vor Ort möglichst kurz.',
  },
  {
    kurz: 'Montage',
    name: 'Montieren',
    text: 'Wir bauen mechanische Sicherungen ein. Elektronische Anlagen verkabeln wir und nehmen sie in Betrieb. Dabei halten wir die geltenden Normen und Sicherheitsregeln ein, bei Profilzylindern zum Beispiel DIN 18252 und DIN EN 1303.',
  },
  {
    kurz: 'Dokumentation',
    name: 'Unterlagen übergeben',
    text: 'Zum Schluss bekommen Sie alle Unterlagen. Dazu gehören Sicherungskarten, Schließpläne, Bedienungsanleitungen und Protokolle. So bleibt die Anlage nachvollziehbar und lässt sich später erweitern.',
  },
];
const PHASEN_SCHRITTE = PHASEN.map((p) => p.kurz).join('|');
const PHASEN_TITEL = `Phasen eines Auftrags: ${PHASEN.map((p) => p.kurz).join(', ')}`;

/** Sichtbare FAQ der Seite — auch Grundlage der strukturierten Daten. */
const SERVICE_FAQ = [
  {
    question: 'Wie lange dauert es, bis eine große Schließanlage fertig ist?',
    answer: 'Das hängt stark vom Umfang ab. Zuerst kommen die Bestandsaufnahme und Ihre Freigabe des Schließplans. Wie lange Fertigung und Lieferung danach dauern, hängt vom Hersteller und vom Umfang ab. Den verbindlichen Zeitplan nennen wir mit dem Angebot. Die Montage stimmen wir so ab, dass Ihr Betrieb möglichst wenig gestört wird. Elektronische Systeme brauchen oft zusätzliche Vorbereitung an Netz und IT.'
  },
  {
    question: 'Sind elektronische Zutrittssysteme sicher vor Hackern?',
    answer: 'Völlige Sicherheit gibt es in der IT nicht. Deshalb empfehlen wir Systeme mit aktueller Verschlüsselung. Transponder, Leser und Steuergerät tauschen ihre Daten meist verschlüsselt aus. Wir achten auf ein sicher aufgebautes Netz. Außerdem empfehlen wir, die Software der Geräte regelmäßig zu aktualisieren.'
  },
  {
    question: 'Was passiert bei einem Stromausfall mit elektronischen Schlössern?',
    answer: 'Viele elektronische Teile an der Tür laufen mit Batterie oder haben einen Notstrom-Akku. Bei Zylindern mit Batterie werden Sie rechtzeitig gewarnt, wenn die Batterie schwach wird. Verkabelte Systeme lassen sich mit einer unterbrechungsfreien Stromversorgung absichern. Fluchtwege sind mechanisch so gebaut, dass man sie von innen jederzeit öffnen kann.'
  },
  {
    question: 'Kann man eine vorhandene mechanische Schließanlage elektronisch erweitern?',
    answer: 'Ja, oft geht das schrittweise, und es lohnt sich auch. Viel genutzte Außentüren bekommen zum Beispiel elektronische Zylinder oder einen Leser an der Wand. Innentüren bleiben mechanisch. Vorher prüfen wir die vorhandenen Türen und Einsteckschlösser genau. Alles muss zusammenpassen, und Zulassungen, etwa für den Brandschutz, dürfen nicht verloren gehen.'
  },
  {
    question: 'Was brauchen Sie für einen genauen Kostenvoranschlag?',
    answer: 'Wir brauchen möglichst genaue Angaben zum Objekt. Dazu gehören Zahl und Art der Türen, etwa Holz, Metall, Glas oder Brandschutztür. Wichtig sind auch die gewünschte Sicherheitsstufe, wer wohin darf und, wenn vorhanden, Grundrisse. Je mehr wir vorher wissen, desto genauer können wir planen und rechnen. Der Orientierungsrechner auf dieser Seite nennt für einzelne Serviceleistungen höchstens eine unverbindliche Spanne und ersetzt kein Angebot.'
  }
];

/** Platzhalter aus Inhalten erscheinen nie als Fakt (MENSCHEN M-03). */
function ohnePlatzhalter(text: string | undefined): string | undefined {
  return istPlatzhalter(text) || enthaeltPlatzhalter(text) ? undefined : text;
}

export default async function ServiceUndTerminPage() {
  const [page, settings, richtwerte] = await Promise.all([
    getPageContent('service-und-termin'),
    getSettings(),
    getRichtwerte(),
  ]);

  const ablauf = PROCESS_LABELS['gefuehrte-anfrage'];
  const prozesse = Object.keys(PROCESS_LABELS) as Array<keyof typeof PROCESS_LABELS>;
  const weitereLinks = (page?.seo.internalLinks ?? []).filter((link) => !enthaeltPlatzhalter(link.label));

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/service-und-termin',
          name: page?.headline ?? 'Service und Termin',
          description: page?.seo.description,
          crumbs: [{ href: '/service-und-termin', label: 'Service und Termin' }],
          faq: SERVICE_FAQ,
        })}
      />

      {/* Kopf: Phasenzeichnung als Blickfang, Fach-Icon klein neben der Augenbraue (B-13) */}
      <PageHeader
        bereich="service-und-termin"
        eyebrow="Service und Termin"
        title={page?.headline ?? 'Service und Termin'}
        lead={ohnePlatzhalter(page?.subline)}
        crumbs={[{ href: '/service-und-termin', label: 'Service und Termin' }]}
        visual={
          <div className="rounded-lg bg-area-soft/40 p-4 sm:p-6">
            <AblaufGrafik params={{ schritte: PHASEN_SCHRITTE, format: 'schmal' }} title={PHASEN_TITEL} className="sm:hidden" />
            <AblaufGrafik params={{ schritte: PHASEN_SCHRITTE }} title={PHASEN_TITEL} className="hidden sm:block" />
          </div>
        }
      >
        <dl className="grid grid-cols-2 border-y border-border">
          <div className="py-4">
            <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">Wege</dt>
            <dd className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">
              {ENTRIES.length}
            </dd>
          </div>
          <div className="border-l border-border py-4 pl-3 sm:pl-4">
            <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">Ablauf</dt>
            <dd className="mt-1 text-title-sm font-semibold text-foreground">{ablauf.label}</dd>
          </div>
        </dl>
      </PageHeader>

      {/* 01 Wege: Stückliste mit Fach-Icons, die ganze Zeile ist der Link */}
      <Section>
        <SectionHeading
          nummer="01"
          eyebrow="Anliegen"
          title="Wählen Sie Ihr Anliegen"
          lead={ohnePlatzhalter(page?.intro)}
        />

        <ul className="mt-12 border-t border-border">
          {ENTRIES.map((entry) => {
            const Icon = entry.icon;
            return (
              <li key={entry.href} className="group relative border-b border-border">
                {/* Ein Link deckt die Zeile ab; sein Name ist das Linkziel. */}
                <Link href={entry.href} className="absolute inset-0 rounded-lg">
                  <span className="sr-only">{entry.label}</span>
                </Link>
                <div className="pointer-events-none flex items-center gap-5 py-6 sm:gap-8">
                  <Icon size={40} className="shrink-0 text-area-strong" />
                  <div className="min-w-0 flex-1">
                    <p className="text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-area-strong">
                      {entry.label}
                    </p>
                    <p className="mt-2 max-w-measure text-small text-foreground-muted">{entry.description}</p>
                  </div>
                  <GlyphPfeilRechts
                    size={18}
                    className="shrink-0 text-foreground-muted transition-transform duration-quick zeiger:group-hover:translate-x-1"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 02 Bereiche: Haarlinienraster, keine Karten */}
      <Section tone="muted">
        <SectionHeading
          nummer="02"
          eyebrow="Wege zu uns"
          title="Vier Abläufe"
          lead="Je nach Anliegen ist ein anderer Weg der schnellste. Die Bedienung ist überall gleich."
        />

        <ul className="mt-12 -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-0 md:overflow-visible md:scroll-px-0 md:border-t md:border-border md:px-0 md:pb-0 lg:grid-cols-4">
          {prozesse.map((key, index) => {
            const areas = NAV_AREAS.filter((a) => a.process === key);
            return (
              <li
                key={key}
                className={cn(
                  'shrink-0 basis-3/4 snap-start rounded-lg border border-border bg-surface p-5 md:basis-auto md:rounded-none md:border-0 md:border-b md:bg-transparent md:p-8',
                  index % 2 === 1 && 'md:border-l',
                  index % 4 === 0 ? 'lg:border-l-0' : 'lg:border-l',
                )}
              >
                <p className="text-title-sm font-semibold text-foreground">{PROCESS_LABELS[key].label}</p>
                <p className="mt-2 max-w-measure text-small text-foreground-muted">{PROCESS_LABELS[key].hint}</p>
                {areas.length > 0 && (
                  <ul className="mt-6 border-t border-border">
                    {areas.map((area) => (
                      <li key={area.key} className="border-b border-border">
                        {area.key === 'service-und-termin' ? (
                          <span aria-current="page" className="flex min-h-touch items-center text-small text-foreground-muted">
                            {area.label}
                          </span>
                        ) : (
                          <Link
                            href={area.href}
                            className="group flex min-h-touch items-center justify-between gap-3 text-small text-foreground transition-colors duration-quick hover:text-primary"
                          >
                            <span>{area.label}</span>
                            <GlyphPfeilRechts
                              size={16}
                              className="shrink-0 text-foreground-muted transition duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
                            />
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 03 Vorgehen: Kopf läuft mit (5/7), Teile 03.1–03.4 einklappbar (B-09), Phasen als Definitionsliste */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              nummer="03"
              eyebrow="Vorgehen"
              title="So arbeiten wir"
              lead="Wir planen Schließ- und Sicherheitstechnik als Ganzes, nicht als einzelne Produkte."
            />
          </div>

          <div className="lg:col-span-7">
            <div className="prose-sm24">
              <p>
                Jeder Auftrag beginnt mit einem genauen Blick auf das, was schon da ist. Wir suchen
                Schwachstellen und klären mit Ihnen, wovor Sie sich schützen wollen. Danach planen
                wir eine Lösung, die zu Ihrem Objekt passt. Eine Lösung von der Stange setzen wir
                nicht ein, wenn Ihr Objekt etwas anderes braucht.
              </p>
            </div>

            <div className="mt-10 border-t border-border">
              <details className="group border-b border-border" open>
                <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-5 text-foreground transition-colors duration-quick hover:text-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="min-w-0 text-title-sm font-semibold">
                    <span className="block font-mono text-caption font-normal tabular-nums text-foreground-muted">03.1</span>
                    Ein Auftrag in fünf Schritten
                  </h3>
                  <GlyphWinkelUnten size={18} className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-open:rotate-180" />
                </summary>
                <div className="sm24-fade pb-8 [--sm24-duration:var(--dauer-quick)]">
                  <div className="prose-sm24">
                    <p>
                      Jeder Auftrag läuft in festen Schritten ab, von der Bestandsaufnahme bis zur Abnahme und Übergabe der Unterlagen.
                    </p>
                  </div>
                  <dl className="mt-6 max-w-measure border-t border-border">
                    {PHASEN.map((phase, i) => (
                      <div key={phase.kurz} className="border-b border-border py-5 last:border-b-0">
                        <dt className="flex items-baseline gap-3 text-title-sm font-semibold text-foreground">
                          <span className="font-mono text-caption font-normal tabular-nums text-foreground-muted">{String(i + 1).padStart(2, '0')}</span>
                          <span>{phase.name}</span>
                        </dt>
                        <dd className="mt-2 hyphens-auto text-body text-foreground-muted">{phase.text}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </details>
              <details className="group border-b border-border">
                <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-5 text-foreground transition-colors duration-quick hover:text-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="min-w-0 text-title-sm font-semibold">
                    <span className="block font-mono text-caption font-normal tabular-nums text-foreground-muted">03.2</span>
                    Produkte und Technik
                  </h3>
                  <GlyphWinkelUnten size={18} className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-open:rotate-180" />
                </summary>
                <div className="sm24-fade pb-8 [--sm24-duration:var(--dauer-quick)]">
                  <div className="prose-sm24">
                    <p>
                      Welche Produkte wir einsetzen, richtet sich nach Tür, Schutzziel und Budget. Wichtig sind Stabilität, Schutz gegen Manipulation und eine lange Lebensdauer. Die genaue Auswahl stimmen wir im Angebot mit Ihnen ab.
                    </p>
                    <p>
                      Bei mechanischen Zylindern achten wir auf Schutz gegen Aufbohren und Ziehen. Patentierte Schlüsselprofile sollen verhindern, dass jemand ohne Berechtigung Kopien anfertigt. Manche Zylinder lassen sich später in der Länge anpassen. Bei Elektronik empfehlen wir Systeme, die ihre Daten verschlüsselt übertragen und auch bei Stromausfall sicher bleiben. Oft verbinden wir Mechanik und Elektronik in einer Lösung.
                    </p>
                  </div>
                </div>
              </details>
              <details className="group border-b border-border">
                <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-5 text-foreground transition-colors duration-quick hover:text-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="min-w-0 text-title-sm font-semibold">
                    <span className="block font-mono text-caption font-normal tabular-nums text-foreground-muted">03.3</span>
                    Erweitern und warten
                  </h3>
                  <GlyphWinkelUnten size={18} className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-open:rotate-180" />
                </summary>
                <div className="sm24-fade pb-8 [--sm24-duration:var(--dauer-quick)]">
                  <div className="prose-sm24">
                    <p>
                      Eine Sicherheitslösung soll viele Jahre halten. Deshalb planen wir sie von Anfang an so, dass sie mitwachsen kann. Ändert sich etwas, etwa durch einen Anbau, eine neue Abteilung oder eine neue Gefahrenlage, lässt sich die Anlage anpassen.
                    </p>
                    <p>
                      Wir bieten auch regelmäßige Wartung an. Dazu gehören Inspektionen, Updates für elektronische Teile und die Pflege stark beanspruchter Mechanik. So bleibt die Sicherheit über Jahre erhalten, und teure Ausfälle lassen sich vermeiden.
                    </p>
                  </div>
                </div>
              </details>
              <details className="group border-b border-border">
                <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-5 text-foreground transition-colors duration-quick hover:text-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="min-w-0 text-title-sm font-semibold">
                    <span className="block font-mono text-caption font-normal tabular-nums text-foreground-muted">03.4</span>
                    Gewerbeobjekte und öffentliche Einrichtungen
                  </h3>
                  <GlyphWinkelUnten size={18} className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-open:rotate-180" />
                </summary>
                <div className="sm24-fade pb-8 [--sm24-duration:var(--dauer-quick)]">
                  <div className="prose-sm24">
                    <p>
                      Neben Privatkunden betreuen wir Gewerbe, Hausverwaltungen und öffentliche Einrichtungen. Dort gelten oft zusätzliche Vorgaben und feste Abläufe. Diese klären wir vor der Planung mit Ihnen.
                    </p>
                    <p>
                      Häufig geht es auch um Fluchtwege nach DIN EN 179 und DIN EN 1125, um Brandschutz und um die Anbindung der Zutrittskontrolle an die Gebäudetechnik. Für Betriebe planen wir so, dass weitere Türen, Nutzer und Standorte dazukommen können.
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </Section>

      {/* 04 Rechenhilfe */}
      <Section tone="sunken" id="orientierung">
        <SectionHeading
          nummer="04"
          eyebrow="Orientierung"
          title="Womit Sie bei einem Serviceeinsatz rechnen können"
          lead="Für häufige Leistungen vor Ort erhalten Sie hier eine erste Orientierung. Den verbindlichen Preis nennen wir nach der Prüfung Ihrer Anfrage."
        />
        <div className="mt-12 max-w-3xl">
          <ServiceEinsatzRechner
            werte={richtwerte.serviceEinsatz}
            anfrageHref="/service-und-termin/anfrage?thema=service-und-termin"
          />
        </div>
      </Section>

      {/* 05 Fragen */}
      <Section>
        <SectionHeading
          nummer="05"
          eyebrow="Fachwissen"
          title="Häufige Fragen"
          lead="Antworten zu Ablauf, Technik und Kosten."
        />
        <Accordion items={SERVICE_FAQ} className="mt-12 max-w-4xl" />
      </Section>

      {/* 06 Erreichbarkeit, darunter die Verweise als Stückliste */}
      <Section tight tone="muted">
        <SectionHeading nummer="06" eyebrow="Erreichbarkeit" title="So erreichen Sie uns" />

        <Erreichbarkeit angabe={erreichbarkeit(settings)} groesse="gross" className="mt-12 max-w-xl border-t border-border pt-6" />

        {weitereLinks.length > 0 && (
          <ul className="mt-12 border-t border-border">
            {weitereLinks.map((link) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  className="group flex min-h-touch items-center justify-between gap-4 py-4 text-body font-semibold text-primary"
                >
                  <span>{link.label}</span>
                  <GlyphPfeilRechts
                    size={18}
                    className="shrink-0 transition-transform duration-quick zeiger:group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
