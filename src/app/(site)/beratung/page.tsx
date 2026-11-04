import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';
import { ButtonLink } from '@/components/ui/button';
import { getRubrik } from '@/lib/data';

import { BeratungFormular } from './beratung-formular';

export const metadata: Metadata = {
  title: 'Beratung mit Rückruf',
  description: 'Schildern Sie Ihr Anliegen, wir rufen Sie zurück. Beratung per Anfrage bei SCHLÜSSELMACHER24 in Wetzlar.',
  alternates: { canonical: '/beratung' },
};

/** Die Themen mit eigener Rubrikseite. Die Beratung ist der Weg für alle anderen Anliegen. */
const THEMEN_MIT_EIGENEM_WEG = [
  {
    href: '/elektronische-zutrittsloesungen',
    label: 'Elektronische Schließsysteme',
    text: 'Zutritt mit Code, Chip oder Transponder, zum Beispiel per NFC oder RFID.',
  },
  {
    href: '/tuer-und-schliesstechnik',
    label: 'Türen und Schließtechnik',
    text: 'Schlösser, Zylinder und Beschläge, die zu Ihrer Tür passen.',
  },
  {
    href: '/sicherheitstechnik',
    label: 'Sicherheitstechnik mit Einbruchschutz, Alarm, Video und Schlüsselaufbewahrung',
    text: 'Technik für Ihr Objekt, mit Beratung und einem Angebot, das alle Kosten nennt.',
  },
  {
    href: '/schliessanlagen',
    label: 'Schließanlage planen',
    text: 'Mehrere Türen, ein System: Wir planen die Schließanlage mit Ihnen.',
  },
];

/** Rubrikseite „Beratung“ (G-34): Wegweiser zu den Themen und Rückruf-Anfrage in drei Schritten. */
export default async function BeratungPage() {
  return (
    <>
      <PageHeader
        rubrik={await getRubrik('beratung')}
        bereich="service-und-termin"
        eyebrow="Beratung"
        title="Beratung mit Rückruf"
        lead="Für alle Anliegen, die nicht zu einem der anderen Wege passen. Schildern Sie Ihr Anliegen kurz, wir rufen Sie zurück."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/beratung', label: 'Beratung' },
        ]}
        actions={<ButtonLink href="#rueckruf">Rückruf anfragen</ButtonLink>}
      />

      {/* 01 Ablauf aus den Rubrikdaten (G-10) */}
      <RubrikAblaufAbschnitt
        rubrik={await getRubrik('beratung')}
        nummer="01"
        titel="Vom Anliegen bis zur Lösung"
        aktion={<ButtonLink href="#rueckruf">Rückruf anfragen</ButtonLink>}
      />

      {/* 02 Wegweiser zu den Themen mit eigenem Weg */}
      <Section tone="muted" labelledBy="themen-titel">
        <SectionHeading id="themen-titel" nummer="02" eyebrow="Wegweiser" title="Themen mit eigenem Weg" />
        <p className="mt-4 max-w-measure text-small text-foreground-muted">
          Für diese Themen gibt es eine eigene Seite mit einem passenden Weg. Dort finden Sie auch die Anfrage für Ihr Anliegen.
        </p>
        <ul className="mt-8 max-w-measure divide-y divide-border border-y border-border">
          {THEMEN_MIT_EIGENEM_WEG.map((thema) => (
            <li key={thema.href} className="py-5">
              <Link href={thema.href} className="text-body font-semibold text-foreground underline">
                {thema.label}
              </Link>
              <p className="mt-1 text-small text-foreground-muted">{thema.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 03 Rückruf-Anfrage in drei Schritten, Antwortweg Telefon */}
      <Section id="rueckruf" labelledBy="rueckruf-titel">
        <SectionHeading
          id="rueckruf-titel"
          nummer="03"
          eyebrow="Rückruf"
          title="Rückruf anfragen"
          lead="Sie nennen Ihr Anliegen und einen Zeitraum. Wir rufen Sie unter Ihrer Telefonnummer an."
        />
        <div className="mt-8 max-w-3xl">
          <BeratungFormular />
        </div>
      </Section>
    </>
  );
}
