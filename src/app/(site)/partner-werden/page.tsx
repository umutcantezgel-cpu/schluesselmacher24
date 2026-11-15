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
import { GewinnungLink, PunktListe } from '@/components/partner/gewinnung-seite';
import {
  GEWINNUNG_SEITEN,
  HAUPTSEITE_ZAHLWEG,
  NUR_FAHRZEUGSCHLUESSEL,
  PARTNER_LEISTUNGEN,
} from '@/lib/partner/gewinnung';

import { PartnerFormular } from './partner-formular';

const ROUTE = 'partner-werden';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel-Partner werden',
    description:
      page?.seo.description
      ?? 'Wir geben geprüfte Anfragen zu Autoschlüsseln und Fahrzeugschlüsseln an Fachbetriebe vor Ort '
        + 'weiter. Bewerben Sie sich mit wenigen Angaben als Partner.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/*
 * Ablauf einer Vermittlung (Erg. Leitfaden §6). Die Höhe der Provision steht im Partnervertrag, nicht hier.
 * Schritte 03 und 04 hängen vom Zahlweg ab und kommen aus `gewinnung.ts`, damit Hauptseite und
 * Partnerseiten denselben Zahlweg nennen (G9).
 */
const ABLAUF: Array<{ icon: ComponentType<IconProps>; title: string; body: string }> = [
  {
    icon: IconPruefung,
    title: 'Wir prüfen die Anfrage',
    body:
      'Kundinnen und Kunden stellen ihre Anfrage bei uns. Wir prüfen sie fachlich und klären, was gebraucht '
      + 'wird, zum Beispiel Fahrzeug, Schlüsselart und Berechtigung.',
  },
  {
    icon: IconWerkstatt,
    title: 'Ihr Betrieb übernimmt nach Abstimmung',
    body:
      'Passt die Anfrage zu Ihrem Einsatzgebiet und Ihren Leistungen, fragen wir Sie an. Sie übernehmen den '
      + 'Auftrag erst nach Abstimmung mit uns.',
  },
  { icon: IconZahlung, title: HAUPTSEITE_ZAHLWEG[0].titel, body: HAUPTSEITE_ZAHLWEG[0].text },
  { icon: IconNachweis, title: HAUPTSEITE_ZAHLWEG[1].titel, body: HAUPTSEITE_ZAHLWEG[1].text },
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
          ?? 'Wir geben geprüfte Anfragen zu Autoschlüsseln und Fahrzeugschlüsseln an Fachbetriebe vor Ort weiter.'
        }
        crumbs={[{ href: `/${ROUTE}`, label: 'Partner werden' }]}
        actions={
          <ButtonLink href="#bewerbung" size="lg" pfeil>
            Jetzt bewerben
          </ButtonLink>
        }
      >
        {page?.intro && <p className="max-w-measure text-body text-foreground-muted">{page.intro}</p>}
        <Alert tone="info" title={NUR_FAHRZEUGSCHLUESSEL.titel} className={page?.intro ? 'mt-6 max-w-3xl' : 'max-w-3xl'}>
          {NUR_FAHRZEUGSCHLUESSEL.text}
        </Alert>
      </PageHeader>

      {/* Leistungsliste des Inhabers (Abschnitt 07, FA-07-02 bis FA-07-12) */}
      <Section labelledBy="leistungen-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="leistungen-titel"
              nummer="01"
              eyebrow="Leistungen"
              title="Leistungen im Partnernetz"
              lead="Niemand muss alle anbieten. Nennen Sie in der Bewerbung Ihre Leistungen und Geräte."
            />
          </div>
          <div className="lg:col-span-7">
            <PunktListe punkte={PARTNER_LEISTUNGEN} />
          </div>
        </div>
      </Section>

      <Section tone="muted" labelledBy="ablauf-titel">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="ablauf-titel"
              nummer="02"
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

      <Section labelledBy="pruefung-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="pruefung-titel"
              nummer="03"
              eyebrow="Vor der Freischaltung"
              title="Wir prüfen jeden Partnerbetrieb"
              lead="Kundinnen und Kunden sollen sich auf jeden vermittelten Betrieb verlassen können."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="space-y-3">
              {PRUEFUNG.map((punkt) => (
                <li key={punkt} className="flex gap-3">
                  <GlyphHakenKreis size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-small text-foreground-muted">{punkt}</span>
                </li>
              ))}
            </ul>
            {/* Besuch vor Ort, Ausstattung, Region und Radius, Pausieren und Sperren stehen im Qualitätsstandard. */}
            <Link
              href="/partner-werden/netzwerk-deutschland#netzwerk-qualitaet"
              className="group mt-6 inline-flex min-h-touch items-center gap-1.5 text-body font-semibold text-primary"
            >
              Der ganze Qualitätsstandard
              <GlyphPfeilRechts
                size={16}
                aria-hidden
                className="shrink-0 transition-transform duration-quick ease-standard group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </Section>

      {/* Stückliste der Partnerseiten (FA-08-03 bis FA-08-08) */}
      <Section tone="muted" labelledBy="mehr-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id="mehr-titel"
              nummer="04"
              eyebrow="Mehr für Partner"
              title="Alles zum Partnernetz"
              lead="Jede Seite beantwortet eine eigene Frage, bevor Sie sich bewerben."
            />
          </div>
          <ul className="border-t border-border lg:col-span-7">
            {GEWINNUNG_SEITEN.map((seite) => (
              <li key={seite.slug} className="border-b border-border">
                <GewinnungLink href={seite.pfad} label={seite.kurzname} text={seite.kurztext} />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="bewerbung" labelledBy="bewerbung-titel">
        <SectionHeading
          id="bewerbung-titel"
          nummer="05"
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
