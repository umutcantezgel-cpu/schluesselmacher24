import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageContent, getSettings } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Section, SectionHeading } from '@/components/layout/section';
import { PageHeader } from '@/components/layout/page-header';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { IconSicherheitscheck } from '@/components/visual/icons/sicherheitscheck';
import { Sicherheitscheck } from './sicherheitscheck';

const ROUTE = 'sicherheitstechnik/sicherheitscheck';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Sicherheitscheck — Bestandsaufnahme Ihres Objekts',
    description:
      page?.seo.description
      ?? 'Geführte Bestandsaufnahme in zehn Schritten: Objekt, Zugänge, Außenbereiche, vorhandene '
        + 'Technik, Schwerpunkte, Netz, Unterlagen, Rahmen und Kontakt.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Verwandte Bereiche am Seitenende — verlangte interne Verlinkung. */
const RELATED_LINKS = [
  { href: '/sicherheitstechnik', label: 'Alle Bereiche der Sicherheitstechnik' },
  { href: '/tuer-und-schliesstechnik', label: 'Mechanischer Grundschutz an der Tür' },
  { href: '/elektronische-zutrittsloesungen', label: 'Elektronische Zutrittslösungen' },
  { href: '/rechtliches/datenschutz', label: 'Hinweise zum Datenschutz' },
];

export default async function SicherheitscheckPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
      {/* Arbeitskopf (Muster Assistent und Kasse): Fach-Icon als Anker, Ablauf als Schriftfeld.
          PageHeader zeigt das Bereichs-Icon nur in der Erzählansicht; deshalb steht das Fach-Icon hier. */}
      <PageHeader
        art="arbeit"
        eyebrow="Sicherheitstechnik"
        title={page?.headline ?? 'Sicherheitscheck'}
        lead={
          page?.subline
          ?? 'Zehn Schritte zu Ihrem Objekt: Wir erfassen, was vorhanden ist und worauf es Ihnen '
            + 'ankommt. Am Ende steht eine Zusammenfassung, aus der wir eine Einschätzung machen.'
        }
        crumbs={[
          { href: '/sicherheitstechnik', label: 'Sicherheitstechnik' },
          { href: `/${ROUTE}`, label: 'Sicherheitscheck' },
        ]}
      >
        <div className="flex items-start gap-4 border-y border-border py-6">
          <IconSicherheitscheck size={40} className="mt-0.5 shrink-0 text-area-strong" />
          <div className="min-w-0">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
              Ablauf
            </p>
            <p className="mt-2 text-title-sm font-semibold text-foreground">{process.label}</p>
            <p className="mt-2 max-w-measure text-small leading-relaxed text-foreground-muted">
              {process.hint} Ihr Zwischenstand wird im Browser gespeichert, damit Sie den Check
              unterbrechen und später fortsetzen können.
            </p>
          </div>
        </div>
      </PageHeader>

      <div className="shell py-8 md:py-12">
        <Sicherheitscheck
          retention={{
            floorPlans: settings.retentionDays.floorPlans,
            objectPhotos: settings.retentionDays.projectDocuments,
          }}
        />
      </div>

      <Section tone="muted" tight>
        <SectionHeading nummer="01" eyebrow="Weiterlesen" title="Passende Seiten" />
        <ul className="mt-8 border-t border-border">
          {RELATED_LINKS.map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex min-h-touch items-center justify-between gap-4 py-5"
              >
                <span className="text-title-sm font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <GlyphPfeilRechts
                  size={18}
                  className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard motion-reduce:transition-none zeiger:group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
