import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { getPageContent } from '@/lib/data';
import type { PageContent } from '@/lib/types';
import { eigeneSeiteAdresse } from '@/payload/hooks/seiten-adresse-pruefung';

/**
 * Unbekannte Adressen auf oberster Ebene: Die Website hat eigene Root-Layouts je
 * Gruppe, deshalb greift `not-found.tsx` nur innerhalb der Gruppe. Diese Route fängt
 * alles ab, was keine andere Route trifft, und zeigt die eigene 404-Seite mit Kopf
 * und Fuß statt der Standardseite (D-019). Bestimmte Routen, `/admin`, `/api` und
 * Dateien aus `public/` haben Vorrang.
 *
 * Eigene Inhaltsseiten (FA-KERN-05): Hat der Betreiber unter „Seitentexte“ eine
 * veröffentlichte Seite mit freier Adresse angelegt (ein Abschnitt, keine vorhandene
 * Route, kein reservierter Name, geprüft in `seiten-adresse.ts`), zeigt diese Route
 * sie mit Überschrift, Einleitung, Abschnitten und Fragen. Alles andere bleibt 404.
 */

type Parameter = { params: Promise<{ unbekannt?: string[] }> };

async function eigeneSeite(params: Parameter['params']): Promise<PageContent | null> {
  const { unbekannt } = await params;
  const adresse = eigeneSeiteAdresse(unbekannt);
  if (!adresse) return null;
  return getPageContent(adresse);
}

export async function generateMetadata({ params }: Parameter): Promise<Metadata> {
  const seite = await eigeneSeite(params);
  if (!seite) return {};
  return {
    title: seite.seo.title || seite.headline,
    ...(seite.seo.description ? { description: seite.seo.description } : {}),
    alternates: { canonical: `/${seite.route}` },
    ...(seite.seo.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function UnbekannteSeite({ params }: Parameter) {
  const seite = await eigeneSeite(params);
  if (!seite) notFound();
  const pfad = `/${seite.route}`;
  const crumbs = [{ href: pfad, label: seite.headline }];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: pfad,
          name: seite.headline,
          description: seite.seo.description || undefined,
          faq: seite.faq.length ? seite.faq : undefined,
          crumbs,
        })}
      />
      <PageHeader title={seite.headline} lead={seite.subline || undefined} crumbs={crumbs} />
      <Section>
        <div className="max-w-measure space-y-10" data-block="eigene-seite">
          {seite.intro && <p className="text-body leading-relaxed text-foreground">{seite.intro}</p>}
          {seite.sections.map((abschnitt) => (
            <div key={abschnitt.heading}>
              <h2 className="text-h3 font-semibold text-foreground">{abschnitt.heading}</h2>
              <div className="mt-4 space-y-3 text-body leading-relaxed text-foreground-muted">
                {abschnitt.body
                  .split(/\n{2,}/)
                  .map((absatz) => absatz.trim())
                  .filter(Boolean)
                  .map((absatz) => (
                    <p key={absatz}>{absatz}</p>
                  ))}
              </div>
            </div>
          ))}
          {seite.faq.length > 0 && (
            <div>
              <h2 className="text-h3 font-semibold text-foreground">Häufige Fragen</h2>
              <dl className="mt-4 space-y-6">
                {seite.faq.map((eintrag) => (
                  <div key={eintrag.question}>
                    <dt className="text-body font-semibold text-foreground">{eintrag.question}</dt>
                    <dd className="mt-2 text-body leading-relaxed text-foreground-muted">{eintrag.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
