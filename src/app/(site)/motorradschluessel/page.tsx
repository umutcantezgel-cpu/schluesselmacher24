import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { RubrikPausiertHinweis, UnterlagenAusRegel, robotsNachStand } from '@/components/fahrzeug-anfrage/seiten';
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
    title: page?.seo.title ?? 'Motorradschlüssel nachmachen',
    description:
      page?.seo.description
      ?? 'Motorradschlüssel anfragen mit Fahrzeugschein, drei Fotos des Schlüssels und der Angabe zum Chip. Wir prüfen Ihre Angaben und melden uns mit Preis und Termin.',
    alternates: { canonical: `/${ROUTE}` },
    // Schalter `indexierbar` der Klasse (ANFRAGE_FORMULAR.motorrad), wie bei den anderen Klassen; Rubrik nicht live: noindex.
    ...(await robotsNachStand('motorrad')),
  };
}

/** Rubrikseite Motorradschlüssel (G-19, E6-BAUMEISTER-01): Ablauf, Chip-Frage, Weg in die Anfrage. */
export default async function MotorradschluesselPage() {
  const [rubrik, page] = await Promise.all([getRubrik('motorradschluessel'), getPageContent(ROUTE)]);
  // Rubrik nicht live (FA-KERN-05): Hinweis mit Telefon statt der Knöpfe zur Anfrage.
  const live = rubrik?.status === 'live';

  // Sichtbarer Kurztext im Seitenkopf, zugleich Beschreibung der Leistung in den Strukturdaten (FA-25-10).
  const kurztext =
    page?.subline
    ?? 'Anfrage mit Fahrzeugschein und drei Fotos Ihres Schlüssels. Wir prüfen Ihre Angaben und melden uns mit Preis und Termin.';

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Motorradschlüssel nachmachen lassen',
          service: { name: page?.headline ?? 'Motorradschlüssel nachmachen lassen', description: kurztext },
          description: page?.seo.description,
          crumbs: CRUMBS,
        })}
      />

      <PageHeader
        rubrik={rubrik}
        eyebrow="Autoschlüssel"
        title={page?.headline ?? 'Motorradschlüssel nachmachen lassen'}
        lead={kurztext}
        crumbs={CRUMBS}
        bereich="autoschluessel"
        actions={
          live ? (
            <ButtonLink href={ANFRAGE} size="lg" pfeil>
              Anfrage stellen
            </ButtonLink>
          ) : undefined
        }
      />

      {/* 01 Ablauf aus den Rubrikdaten (G-10) */}
      <RubrikAblaufAbschnitt
        rubrik={rubrik}
        nummer="01"
        titel="Vom Fahrzeugschein bis zum Preis"
        aktion={
          live ? (
            <ButtonLink href={ANFRAGE} pfeil>
              Anfrage stellen
            </ButtonLink>
          ) : undefined
        }
      />

      {/* 02 Die Pflichtfrage nach dem Chip (G-19, R9) */}
      <Section tone="muted" labelledBy="chip-titel">
        <SectionHeading id="chip-titel" nummer="02" eyebrow="Wegfahrsperre" title="Chip im Schlüssel" />
        <p className="mt-6 max-w-measure text-body leading-relaxed text-foreground-muted">
          Ein Motorrad mit Wegfahrsperre springt ohne den passenden Chip im Schlüssel nicht an. Deshalb fragen wir, ob Ihr
          Schlüssel einen Chip hat. Wenn Sie es nicht wissen, wählen Sie „Weiß ich nicht“; wir klären es anhand Ihrer Fotos.
        </p>
      </Section>

      {/* 03 Unterlagen aus der Pflichtregel, nicht von Hand abgeschrieben (FA-KERN-02B) */}
      <Section labelledBy="unterlagen-titel">
        <SectionHeading id="unterlagen-titel" nummer="03" eyebrow="Für die Anfrage" title="Das brauchen wir von Ihnen" />
        <div className="mt-6 max-w-3xl">
          <UnterlagenAusRegel klasse="motorrad" />
        </div>
        {live ? (
          <div className="mt-8">
            <ButtonLink href={ANFRAGE} pfeil>
              Anfrage stellen
            </ButtonLink>
          </div>
        ) : (
          <RubrikPausiertHinweis className="mt-8" />
        )}
      </Section>
    </>
  );
}
