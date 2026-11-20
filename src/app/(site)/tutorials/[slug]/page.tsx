import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getGuides, getTutorial, getTutorials } from '@/lib/data';
import { areaByKey } from '@/lib/navigation';
import { videosFreigegeben } from '@/lib/tutorials/freigabe';
import { tutorialIndexierbar, tutorialPfad, videoDaten } from '@/lib/tutorials/tutorials';
import { PageHeader } from '@/components/layout/page-header';
import { SeitenDaten } from '@/components/seo/seiten-daten';
import { TutorialInhalt } from '@/components/tutorial/tutorial-inhalt';

/** Nur veröffentlichte Tutorials erzeugen eine Seite (FA-INHALT-01). */
export async function generateStaticParams() {
  const tutorials = await getTutorials();
  return tutorials.map((tutorial) => ({ slug: tutorial.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const tutorial = await getTutorial(slug);
  if (!tutorial) return { title: 'Tutorial nicht gefunden' };

  return {
    title: tutorial.seo.title,
    description: tutorial.seo.description,
    alternates: { canonical: tutorialPfad(tutorial) },
    // Ohne belegten eigenen Inhalt, oder solange ein Ratgeber das Thema ohne Video schon trägt: nicht indexieren (R3).
    ...(tutorialIndexierbar(tutorial) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function TutorialPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [tutorial, guides] = await Promise.all([getTutorial(slug), getGuides()]);
  if (!tutorial) notFound();

  const area = areaByKey(tutorial.topic);
  const guide = tutorial.guideSlug ? guides.find((g) => g.slug === tutorial.guideSlug) : undefined;
  const pfad = tutorialPfad(tutorial);
  const videosFrei = videosFreigegeben();
  // VideoObject nur mit Schalter und vollständigen Angaben samt eigenem Vorschaubild (FA-INHALT-01B, R8).
  const video = videoDaten(tutorial, videosFrei);

  // Sichtbare Brotkrumen, zugleich Grundlage der Strukturdaten (FA-SEO-01C). Kein HowTo (R8).
  const crumbs = [
    { href: '/tutorials', label: 'Tutorials' },
    { href: pfad, label: tutorial.title },
  ];

  return (
    <>
      <SeitenDaten pfad={pfad} name={tutorial.title} beschreibung={tutorial.answer} crumbs={crumbs} {...(video ? { video } : {})} />
      <PageHeader eyebrow={area ? `Tutorial · ${area.label}` : 'Tutorial'} title={tutorial.title} lead={tutorial.answer} crumbs={crumbs} />
      <TutorialInhalt
        tutorial={tutorial}
        ratgeber={guide ? { href: `/ratgeber/${guide.slug}`, label: guide.title } : null}
        videosFrei={videosFrei}
      />
    </>
  );
}
