import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { SeitenDaten } from '@/components/seo/seiten-daten';
import { PasstDazu } from '@/components/seo/passt-dazu';
import { ButtonLink } from '@/components/ui/button';
import { getFahrzeugkatalog, getFahrzeugteile, getPageContent, getUmbauBeispiele } from '@/lib/data';
import { SCHLUESSELTYP_LABEL, filterAuswahl } from '@/lib/data/fahrzeugteile';

import { GEHAEUSE_ANFRAGE_PFAD, GEHAEUSE_PFAD, teileAdresse } from '../gehaeuse/teile/ansicht';
import { MeinFahrzeug } from '../gehaeuse/teile/mein-fahrzeug';
import { BEDINGUNGEN, CUSTOMIZING_KURZTEXT, CUSTOMIZING_PFAD, KEINE_FALSCHEN_VERSPRECHEN, MOEGLICH, PRUEFUNG } from './texte';
import { UmbauBeispiele } from './umbau-beispiele';

const ROUTE = 'autoschluessel/customizing';
const CRUMBS = [
  { href: '/autoschluessel', label: 'Autoschlüssel' },
  { href: CUSTOMIZING_PFAD, label: 'Customizing' },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Customizing für Autoschlüssel',
    description:
      page?.seo.description
      ?? 'Ältere Autoschlüssel in neuerer Gehäuseform: Wir prüfen an Fotos, Fahrzeug und Schlüsseltyp, ob Elektronik, Transponder, Tasten und Bart mit umziehen können.',
    alternates: { canonical: CUSTOMIZING_PFAD },
  };
}

/**
 * Rubrik Customizing, Modifikation und optische Erneuerung (FA-SHOP-02B, Punkt 3; FA-14-05 bis FA-14-11):
 * was möglich ist, unter welchen Bedingungen, wie die Prüfung läuft, Auswahl nach Fahrzeug oder Schlüsseltyp
 * und echte Umbau-Beispiele, sobald welche freigegeben sind.
 */
export default async function CustomizingPage() {
  const [page, teile, beispiele, katalog] = await Promise.all([
    getPageContent(ROUTE),
    getFahrzeugteile(),
    getUmbauBeispiele('customizing'),
    getFahrzeugkatalog(),
  ]);
  const titel = page?.headline ?? 'Customizing für Autoschlüssel';
  const kurztext = page?.subline ?? CUSTOMIZING_KURZTEXT;
  // Auswahl nur mit Gehäusen, die es gibt: kein Filter führt in eine leere Liste.
  const gehaeuse = teile.filter((a) => a.fahrzeugteil.teileart === 'gehaeuse');
  const auswahl = filterAuswahl(gehaeuse);
  const nummern = ['moeglich', 'bedingungen', 'pruefung', 'auswahl', ...(beispiele.length ? ['beispiele'] : [])];
  const nr = (abschnitt: string) => String(nummern.indexOf(abschnitt) + 1).padStart(2, '0');

  return (
    <>
      <SeitenDaten pfad={CUSTOMIZING_PFAD} name={titel} crumbs={CRUMBS} leistung={{ name: titel, description: kurztext }} />
      <PageHeader
        bereich="autoschluessel"
        eyebrow="Autoschlüssel"
        title={titel}
        lead={kurztext}
        crumbs={CRUMBS}
        actions={
          <ButtonLink href={GEHAEUSE_ANFRAGE_PFAD} size="lg" pfeil>
            Umbau anfragen
          </ButtonLink>
        }
      />

      <Section labelledBy="cust-moeglich">
        <SectionHeading id="cust-moeglich" nummer={nr('moeglich')} eyebrow="Möglich" title="Was wir umbauen" />
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {MOEGLICH.map((m) => (
            <li key={m.titel} className="border-t border-border pt-4">
              <h3 className="text-title-sm font-semibold text-foreground">{m.titel}</h3>
              <p className="mt-2 max-w-measure text-body leading-relaxed text-foreground-muted">{m.satz}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" labelledBy="cust-bedingungen">
        <SectionHeading
          id="cust-bedingungen"
          nummer={nr('bedingungen')}
          eyebrow="Bedingungen"
          title="Was übernommen werden muss"
          lead="Ein neues Gehäuse ist nur eine Hülle. Die Technik Ihres Schlüssels zieht mit um."
        />
        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          {BEDINGUNGEN.map((b) => (
            <div key={b.titel} className="border-t border-border pt-4">
              <dt className="text-title-sm font-semibold text-foreground">{b.titel}</dt>
              <dd className="mt-2 text-body leading-relaxed text-foreground-muted">{b.satz}</dd>
            </div>
          ))}
        </dl>
        {/* Satz gegen falsche Erwartungen im Wortlaut des Inhabers (FA-14-11). */}
        <p className="mt-8 max-w-measure border-l-4 border-primary pl-4 text-body font-semibold leading-relaxed text-foreground">
          {KEINE_FALSCHEN_VERSPRECHEN}
        </p>
      </Section>

      <Section labelledBy="cust-pruefung">
        <SectionHeading id="cust-pruefung" nummer={nr('pruefung')} eyebrow="Prüfung" title="So prüfen wir, ob es geht" />
        <ol className="mt-8 grid gap-4">
          {PRUEFUNG.map((schritt, index) => (
            <li key={schritt} className="flex gap-4 border-t border-border pt-4">
              <span className="w-8 shrink-0 font-mono text-caption tabular-nums text-foreground-muted">{String(index + 1).padStart(2, '0')}</span>
              <span className="max-w-measure text-body leading-relaxed text-foreground">{schritt}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <ButtonLink href={GEHAEUSE_ANFRAGE_PFAD} pfeil>
            Umbau anfragen
          </ButtonLink>
        </div>
      </Section>

      <Section tone="muted" labelledBy="cust-auswahl">
        <SectionHeading
          id="cust-auswahl"
          nummer={nr('auswahl')}
          eyebrow="Auswahl"
          title="Nach Fahrzeug oder Schlüsseltyp"
          lead={
            gehaeuse.length
              ? 'Wählen Sie Ihr Fahrzeug oder Ihren Schlüsseltyp. Sie sehen die Gehäuse, die wir dafür führen, mit Hinweis, was übernommen wird.'
              : 'Gehäuse zum Auswählen führen wir hier noch nicht. Nennen Sie uns Fahrzeug und Schlüsseltyp in der Anfrage, wir prüfen, welche Gehäuseform passt.'
          }
        />
        {gehaeuse.length > 0 ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {auswahl.marken.length > 0 && <MeinFahrzeug filter={{ teileart: 'gehaeuse' }} />}
            {auswahl.schluesselarten.length > 0 && (
              <div>
                <h3 className="text-small font-semibold text-foreground">Schlüsseltyp</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {auswahl.schluesselarten.map((typ) => (
                    <li key={typ}>
                      <Link
                        href={teileAdresse({ teileart: 'gehaeuse', schluesselart: typ })}
                        className="inline-flex min-h-touch items-center rounded-full border border-border px-4 text-small font-semibold hover:border-foreground-subtle"
                      >
                        {SCHLUESSELTYP_LABEL[typ]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={GEHAEUSE_ANFRAGE_PFAD} pfeil>
              Umbau anfragen
            </ButtonLink>
            <ButtonLink href={GEHAEUSE_PFAD} variant="outline">
              Gehäusetausch und Reparatur
            </ButtonLink>
          </div>
        )}
      </Section>

      {beispiele.length > 0 && (
        <Section labelledBy="cust-beispiele">
          <SectionHeading id="cust-beispiele" nummer={nr('beispiele')} eyebrow="Beispiele" title="Vorher und nachher" />
          <UmbauBeispiele beispiele={beispiele} katalog={katalog} />
        </Section>
      )}

      <PasstDazu pfad={CUSTOMIZING_PFAD} eigene={page?.seo.internalLinks} />
    </>
  );
}
