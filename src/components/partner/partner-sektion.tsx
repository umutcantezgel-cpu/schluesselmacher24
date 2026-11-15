import Link from 'next/link';

import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { IconAutoschluessel } from '@/components/visual/icons/autoschluessel';
import { PARTNER_SEKTION } from '@/lib/partner/gewinnung';

/**
 * Startseiten-Sektion „Autoschlüssel-Profi? Partner werden“ (FA-08-02). Server-Komponente ohne
 * Daten-Abruf; Texte aus `src/lib/partner/gewinnung.ts`. Die Einbindung in die Startseite
 * übernimmt der Orchestrator.
 */
export function PartnerSektion({ tone = 'default' }: { tone?: 'default' | 'muted' | 'sunken' }) {
  const s = PARTNER_SEKTION;
  return (
    <Section tone={tone} labelledBy="partner-sektion-titel">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-gutter">
        <div className="lg:col-span-7">
          <SectionHeading id="partner-sektion-titel" eyebrow={s.augenbraue} title={s.ueberschrift} />
          <div className="mt-4 space-y-3">
            {s.saetze.map((satz) => (
              <p key={satz} className="max-w-measure text-lead text-foreground-muted">
                {satz}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <ButtonLink href={s.knopf.href} size="lg" pfeil className="w-full sm:w-auto">
              {s.knopf.label}
            </ButtonLink>
            <Link
              href={s.verweis.href}
              className="group inline-flex min-h-touch items-center gap-1.5 text-body font-semibold text-primary"
            >
              {s.verweis.label}
              <GlyphPfeilRechts
                size={16}
                aria-hidden
                className="shrink-0 transition-transform duration-quick ease-standard group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5">
          <IconAutoschluessel size={56} aria-hidden className="hidden text-primary lg:block" />
          <ul className="mt-0 border-t border-border lg:mt-6">
            {s.punkte.map((punkt) => (
              <li key={punkt} className="flex items-center gap-3 border-b border-border py-4">
                <GlyphHakenKreis size={18} aria-hidden className="shrink-0 text-primary" />
                <span className="text-body font-semibold text-foreground">{punkt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
