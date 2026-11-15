import Image from 'next/image';
import Link from 'next/link';

import type { ShopHersteller } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import { BEREICHE, herstellerFuerAnzeige, type HerstellerBereichArt, type HerstellerEintrag } from './bereiche';

/*
 * Systeme, mit denen wir arbeiten (FA-INHALT-02; Arbeitsanweisung Abschnitte 15, 17, 19).
 * Ruhige Karten je Hersteller: Name als Schriftzug in der Seitenschrift, kein nachgebautes
 * Logo, keine Herstellerfarben. Ein Logo ersetzt den Schriftzug nur, wenn die Datenschicht
 * es herausgibt (Haken „Freigabe liegt vor“ und Datei, R12), dann in Originalfarben mit
 * Schutzraum. Keine Strukturdaten für Hersteller (R8, R12).
 */

export interface HerstellerBereichProps {
  /** Stammliste aus `getHersteller()`; es erscheinen nur angebotene Hersteller. */
  hersteller: ShopHersteller[];
  /** Nur die Hersteller dieses Bereichs. Ohne Angabe (Startseite): alle mit allen Bereichen. */
  bereich?: HerstellerBereichArt;
  nummer?: string;
  tone?: 'default' | 'muted' | 'sunken';
  id?: string;
  className?: string;
}

const TITEL = 'Systeme, mit denen wir arbeiten';

/** „A“, „A und B“, „A, B und C“. */
export function namensliste(namen: string[]): string {
  if (namen.length <= 1) return namen.join('');
  return `${namen.slice(0, -1).join(', ')} und ${namen[namen.length - 1]}`;
}

function einleitung(eintraege: HerstellerEintrag[], bereich?: HerstellerBereichArt): string {
  const namen = namensliste(eintraege.map((e) => e.name));
  if (bereich === 'sperrschliessung') return `Für Sperrschließungen arbeiten wir mit Systemen von ${namen}.`;
  if (bereich === 'zutritt') return `Für elektronischen Zutritt arbeiten wir mit Systemen von ${namen}.`;
  return `Wir arbeiten mit Systemen von ${namen}. Auf den Karten steht, wofür ihre Systeme eingesetzt werden.`;
}

function Schriftzug({ eintrag }: { eintrag: HerstellerEintrag }) {
  if (eintrag.logo) {
    const svg = /\.svg(\?|$)/i.test(eintrag.logo.url);
    return (
      <>
        <h3 className="sr-only">{eintrag.name}</h3>
        {/* Schutzraum: freie Fläche um das Logo, keine Umfärbung, kein Zuschnitt */}
        <div className="p-2">
          <div className="relative h-12 w-44">
            <Image
              src={eintrag.logo.url}
              alt={eintrag.logo.alt || eintrag.name}
              fill
              sizes="176px"
              className="object-contain object-left"
              unoptimized={svg}
            />
          </div>
        </div>
      </>
    );
  }
  return <h3 className="text-title font-bold tracking-tight text-foreground">{eintrag.name}</h3>;
}

export function HerstellerBereich({ hersteller, bereich, nummer, tone = 'default', id = 'hersteller', className }: HerstellerBereichProps) {
  const eintraege = herstellerFuerAnzeige(hersteller, bereich);
  if (eintraege.length === 0) return null;
  const titelId = `${id}-titel`;

  return (
    <Section tone={tone} tight id={id} labelledBy={titelId} className={className}>
      <SectionHeading nummer={nummer} eyebrow="Hersteller" title={TITEL} lead={einleitung(eintraege, bereich)} id={titelId} />

      <ul className={cn('mt-8 grid gap-4 sm:grid-cols-2', eintraege.length >= 3 && 'lg:grid-cols-3')}>
        {eintraege.map((eintrag) => (
          <li key={eintrag.id} data-hersteller={eintrag.id} className="flex flex-col rounded-lg border border-border bg-surface p-6">
            <Schriftzug eintrag={eintrag} />

            {eintrag.bereiche.length === 0 ? (
              eintrag.einsatz && <p className="mt-3 text-small text-foreground-muted">{eintrag.einsatz}</p>
            ) : bereich ? (
              <p className="mt-3 text-small text-foreground-muted">{eintrag.bereiche[0].einsatz}</p>
            ) : (
              <ul className="mt-4 flex flex-1 flex-col border-t border-border">
                {eintrag.bereiche.map(({ art, einsatz }) => (
                  <li key={art} className="flex flex-1 flex-col border-b border-border py-4 last:border-b-0 last:pb-0">
                    <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">{BEREICHE[art].titel}</p>
                    <p className="mt-1.5 flex-1 text-small text-foreground-muted">{einsatz}</p>
                    <Link
                      href={BEREICHE[art].href}
                      className="group mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"
                    >
                      {BEREICHE[art].verweis}
                      <GlyphPfeilRechts size={16} className="transition-transform duration-quick group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-measure text-caption text-foreground-muted">
        Die Namen sind Marken der jeweiligen Hersteller. Wir nennen sie, weil wir mit ihren Systemen arbeiten.
      </p>
    </Section>
  );
}
