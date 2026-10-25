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

export default async function PartnerWerdenPage() {
  const page = await getPageContent(ROUTE);
  const links = page?.seo.internalLinks ?? [];

  return (
    <>
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

      <Section labelledBy="ablauf-titel">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="ablauf-titel"
              nummer="01"
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
              nummer="02"
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
    </>
  );
}
