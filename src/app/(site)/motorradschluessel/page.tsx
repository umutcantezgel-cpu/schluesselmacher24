import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';
import { ButtonLink } from '@/components/ui/button';
import { getPageContent, getRubrik } from '@/lib/data';

const ROUTE = 'motorradschluessel';
const ANFRAGE = '/motorradschluessel/anfrage';
const CRUMBS = [
  { href: '/autoschluessel', label: 'Autoschlüssel' },
  { href: `/${ROUTE}`, label: 'Motorradschlüssel' },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Motorradschlüssel nachmachen lassen: Anfrage mit Fotos',
    description:
      page?.seo.description
      ?? 'Motorradschlüssel anfragen: Typ, Baujahr, Angabe zum Chip, Fotos von Schlüssel und Fahrzeugschein. Wir melden uns mit Preis und Termin.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Rubrikseite Motorradschlüssel (G-19, E6-BAUMEISTER-01): Ablauf, Chip-Frage, Weg in die Anfrage. */
export default async function MotorradschluesselPage() {
  const [rubrik, page] = await Promise.all([getRubrik('motorradschluessel'), getPageContent(ROUTE)]);

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Motorradschlüssel nachmachen lassen',
          description: page?.seo.description,
          crumbs: CRUMBS,
        })}
      />

      <PageHeader
        rubrik={rubrik}
        eyebrow="Autoschlüssel"
        title={page?.headline ?? 'Motorradschlüssel nachmachen lassen'}
        lead={
          page?.subline
          ?? 'Anfrage mit Fahrzeugschein und Foto Ihres Schlüssels. Wir prüfen Ihre Angaben und melden uns mit Preis und Termin.'
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
        titel="Vom Fahrzeugschein bis zum Preis"
        aktion={
          <ButtonLink href={ANFRAGE} pfeil>
            Anfrage stellen
          </ButtonLink>
        }
      />

      {/* 02 Die Pflichtfrage nach dem Chip (G-19, R9) */}
      <Section tone="muted" labelledBy="chip-titel">
        <SectionHeading id="chip-titel" nummer="02" eyebrow="Wegfahrsperre" title="Chip im Schlüssel" />
        <p className="mt-6 max-w-measure text-body leading-relaxed text-foreground-muted">
          Ein Motorrad mit Wegfahrsperre springt ohne den passenden Chip im Schlüssel nicht an. Deshalb fragen wir, ob Ihr
          Schlüssel einen Chip hat. Wenn Sie es nicht wissen, wählen Sie „weiß nicht“; wir klären es anhand Ihrer Fotos.
        </p>
      </Section>
    </>
  );
}
