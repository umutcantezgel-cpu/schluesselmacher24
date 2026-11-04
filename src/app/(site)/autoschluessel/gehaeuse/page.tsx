import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';
import { ButtonLink } from '@/components/ui/button';
import { getPageContent, getRubrik } from '@/lib/data';

const ROUTE = 'autoschluessel/gehaeuse';
const ANFRAGE = '/autoschluessel/gehaeuse/anfrage';
const CRUMBS = [
  { href: '/autoschluessel', label: 'Autoschlüssel' },
  { href: `/${ROUTE}`, label: 'Gehäuse' },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel-Gehäuse erneuern: Anfrage mit Fotos',
    description:
      page?.seo.description
      ?? 'Gehäuse für Ihren Autoschlüssel anfragen: Fahrzeug, Foto Ihres Schlüssels und Fahrzeugschein. Wir melden uns mit Preis und Ablauf.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Rubrikseite Autoschlüssel-Gehäuse (G-20, E6-BAUMEISTER-02): Ablauf, Gehäuse-Frage, Weg in die Anfrage. */
export default async function AutoschluesselGehaeusePage() {
  const [rubrik, page] = await Promise.all([getRubrik('autoschluessel-gehaeuse'), getPageContent(ROUTE)]);

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Autoschlüssel-Gehäuse erneuern',
          description: page?.seo.description,
          crumbs: CRUMBS,
        })}
      />

      <PageHeader
        rubrik={rubrik}
        eyebrow="Autoschlüssel"
        title={page?.headline ?? 'Autoschlüssel-Gehäuse erneuern'}
        lead={
          page?.subline
          ?? 'Anfrage mit Fahrzeug, Foto Ihres Schlüssels und Fahrzeugschein. Wir prüfen Ihre Angaben und melden uns mit Preis und Ablauf.'
        }
        crumbs={CRUMBS}
        bereich="autoschluessel"
        actions={
          <ButtonLink href={ANFRAGE} size="lg" pfeil>
            Anfrage stellen
          </ButtonLink>
        }
      />

      {/* 01 Ablauf aus den Rubrikdaten (G-10) */}
      <RubrikAblaufAbschnitt
        rubrik={rubrik}
        nummer="01"
        titel="Vom Fahrzeug bis zum Preis"
        aktion={
          <ButtonLink href={ANFRAGE} pfeil>
            Anfrage stellen
          </ButtonLink>
        }
      />

      {/* 02 Wann ein neues Gehäuse hilft (G-20, R9) */}
      <Section tone="muted" labelledBy="gehaeuse-titel">
        <SectionHeading id="gehaeuse-titel" nummer="02" eyebrow="Gehäuse" title="Wann ein neues Gehäuse hilft" />
        <p className="mt-6 max-w-measure text-body leading-relaxed text-foreground-muted">
          Ist das Gehäuse gebrochen oder klemmen die Tasten, tauschen wir die Hülle; die vorhandene Elektronik bleibt
          erhalten. Ob das bei Ihrem Schlüssel geht, sehen wir an Ihren Fotos.
        </p>
        <p className="mt-6">
          <Link href="/autoschluessel/funkschluessel" className="font-semibold text-primary underline-offset-2 hover:underline">
            Funkschlüssel und Gehäuse im Überblick
          </Link>
        </p>
      </Section>
    </>
  );
}
