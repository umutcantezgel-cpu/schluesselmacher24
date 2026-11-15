import type { Metadata } from 'next';

import { NAV_AREAS } from '@/lib/navigation';
import {
  CODE_ANFRAGE_LAENGE,
  CODE_ANFRAGE_THEMA,
  CODE_ANFRAGE_THEMENTEXT,
  vorbelegungAusAdresse,
} from '@/lib/wege/code-anfrage';
import { PageHeader } from '@/components/layout/page-header';
import { AllgemeineAnfrage } from './anfrage-formular';

export const metadata: Metadata = {
  title: 'Anfrage zu einer Leistung',
  description:
    'Sie haben eine Frage oder ein Anliegen zu einem unserer Fachbereiche? Wählen Sie den Bereich und '
    + 'beschreiben Sie kurz, worum es geht. Wir melden uns bei Ihnen.',
  alternates: { canonical: '/service-und-termin/anfrage' },
};

export default async function AnfragePage(props: {
  searchParams: Promise<{ thema?: string; fahrzeug?: string; code?: string; schloss?: string; anliegen?: string }>;
}) {
  const { thema, fahrzeug, code, schloss, anliegen } = await props.searchParams;
  // Fahrzeug aus der Suche im Autoschlüssel-Weg (G-15): nur als kurzer Text in die Beschreibung.
  const fahrzeugText = typeof fahrzeug === 'string' ? fahrzeug.replace(/[^\p{L}\p{N} .\-/]/gu, '').trim().slice(0, 80) : '';

  // Code anfragen (FA-11-17): Code und Schloss nur als Vorbelegung, etwa von einer Produktseite.
  const codeAnfrage = thema === CODE_ANFRAGE_THEMA;
  const codeVorbelegung = codeAnfrage
    ? {
        code: vorbelegungAusAdresse(code, CODE_ANFRAGE_LAENGE.code) || undefined,
        schloss: vorbelegungAusAdresse(schloss, CODE_ANFRAGE_LAENGE.schloss) || undefined,
      }
    : undefined;

  // In der Themenwahl beschreibt „Schlüssel nach Code“ die Anfrage, nicht die Direktbestellung der Navigation.
  const themen = NAV_AREAS.map((area) => ({
    key: area.key,
    label: area.label,
    summary: area.key === CODE_ANFRAGE_THEMA ? CODE_ANFRAGE_THEMENTEXT : area.summary,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Geführte Anfrage"
        bereich="service-und-termin"
        art="arbeit"
        title={codeAnfrage ? 'Code anfragen' : 'Anfrage zu einer Leistung'}
        lead={
          codeAnfrage
            ? 'Nennen Sie Hersteller oder Schloss, den Code wie aufgedruckt und die Stückzahl. Wir prüfen den Code und melden uns mit einem Angebot oder einer Rückfrage.'
            : 'Wählen Sie den Fachbereich und beschreiben Sie kurz, worum es geht. Wir melden uns mit einer Einschätzung.'
        }
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/anfrage', label: 'Anfrage' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <AllgemeineAnfrage
          themen={themen}
          vorauswahl={thema}
          fahrzeug={fahrzeugText || undefined}
          codeVorbelegung={codeVorbelegung}
          themaFest={codeAnfrage}
          anliegenVorauswahl={anliegen === 'frage' ? 'frage' : undefined}
        />
      </div>
    </>
  );
}
