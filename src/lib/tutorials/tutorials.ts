import type { Tutorial, TutorialOrt } from '@/lib/types';

import { videosFreigegeben } from './freigabe';
import { dauerSekunden, istYoutubeKennung } from './youtube';

/* ==========================================================================
   Tutorials: Auswahl und Regeln (FA-INHALT-01), reine Funktionen

   - Nur veröffentlichte Tutorials erzeugen eine Seite, einen Eintrag in der
     Übersicht oder einen Hinweis an einem Ort.
   - Indexiert wird nur eine Seite mit belegtem Inhalt (R3): mindestens zwei
     Schritte mit Text, und kein Doppel zu einem Ratgeber, der das Thema schon
     vollständig erklärt. Ein Video bringt erst dann eigenen Wert, wenn es auf
     der Seite wirklich erscheint: nur mit dem Freigabe-Schalter
     `SM24_VIDEOS=an` (FA-INHALT-01B, `freigabe.ts`). Ohne Schalter zeigt die
     Seite nur einen Hinweissatz, und das Video zählt nicht.
   ========================================================================== */

/** Adresse der Übersicht. */
export const TUTORIALS_PFAD = '/tutorials';

export function tutorialPfad(tutorial: Pick<Tutorial, 'slug'>): string {
  return `${TUTORIALS_PFAD}/${tutorial.slug}`;
}

const mitText = (wert: string | undefined) => Boolean(wert && wert.trim());

/** Schritte, die wirklich etwas sagen (Überschrift und Text). */
export function belegteSchritte(tutorial: Pick<Tutorial, 'steps'>) {
  return tutorial.steps.filter((schritt) => mitText(schritt.heading) && mitText(schritt.text));
}

/** Veröffentlichte Tutorials nach Reihenfolge, dann Titel. */
export function veroeffentlichteTutorials(alle: Tutorial[]): Tutorial[] {
  return alle
    .filter((tutorial) => tutorial.published)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'de'));
}

/** Darf die Seite in Suchmaschinen und in die Sitemap? */
export function tutorialIndexierbar(tutorial: Tutorial): boolean {
  return tutorialIndexierbarBei(tutorial, videosFreigegeben());
}

/** Die Regel mit ausdrücklichem Schalter (für Tests und Teil B); einzeln aufrufen, nicht als Filter. */
export function tutorialIndexierbarBei(tutorial: Tutorial, einbettungFrei: boolean): boolean {
  if (!tutorial.published || tutorial.seo.noindex) return false;
  if (belegteSchritte(tutorial).length < 2) return false;
  // Der Ratgeber trägt das Thema schon: ohne sichtbares Video wäre die Seite ein Doppel (R3).
  if (tutorial.guideSlug && !videoSichtbar(tutorial, einbettungFrei)) return false;
  return true;
}

/** Veröffentlichte Tutorials, die einem Ort zugeordnet sind (für den Hinweis aus Teil B). */
export function tutorialsFuer(alle: Tutorial[], ort: TutorialOrt): Tutorial[] {
  return veroeffentlichteTutorials(alle).filter((tutorial) => tutorial.places.includes(ort));
}

/* ---------- Hinweis an Leistungsseiten und Formularen (FA-INHALT-01B) ------ */

/** Was der Hinweis von einem Tutorial braucht: nur Werte, keine Datenschicht. */
export interface TutorialVerweis {
  slug: string;
  href: string;
  /** Titel als Frage. */
  titel: string;
  /** Ein kurzer Satz: der erste Satz der Kurzantwort. */
  satz: string;
  /** Kennzeichen „mit Video“: nur mit hinterlegtem Video und gesetztem Schalter. */
  mitVideo: boolean;
}

/** Erster Satz eines Textes (bis zum ersten Punkt, Ausrufe- oder Fragezeichen vor einem Leerzeichen). */
export function ersterSatz(text: string): string {
  const sauber = text.trim().replace(/\s+/g, ' ');
  const treffer = /^(.+?[.!?])(?:\s|$)/.exec(sauber);
  return treffer ? treffer[1] : sauber;
}

/** Verweise für den Hinweis, ohne doppelte Einträge, in der Reihenfolge der Liste. */
export function tutorialVerweise(tutorials: Tutorial[], videosFrei: boolean): TutorialVerweis[] {
  const gesehen = new Set<string>();
  const verweise: TutorialVerweis[] = [];
  for (const tutorial of tutorials) {
    if (!tutorial.published || gesehen.has(tutorial.slug)) continue;
    gesehen.add(tutorial.slug);
    verweise.push({
      slug: tutorial.slug,
      href: tutorialPfad(tutorial),
      titel: tutorial.title,
      satz: ersterSatz(tutorial.answer),
      mitVideo: videosFrei && istYoutubeKennung(tutorial.video?.youtubeId),
    });
  }
  return verweise;
}

/* ---------- Video auf der Tutorial-Seite (FA-INHALT-01B) ------------------- */

/** Wird auf der Seite eine Einbettung gezeigt (statt des Satzes aus Teil A)? */
export function videoSichtbar(tutorial: Pick<Tutorial, 'video'>, videosFrei: boolean): boolean {
  return videosFrei && istYoutubeKennung(tutorial.video?.youtubeId);
}

/** Dauer in Sekunden als ISO 8601, etwa `PT3M5S`. */
export function isoDauer(sekunden: number): string {
  const h = Math.floor(sekunden / 3600);
  const m = Math.floor((sekunden % 3600) / 60);
  const s = sekunden % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}`;
}

/** Angaben für ein `VideoObject` (R8): nur Sichtbares, ohne Adresse von YouTube. */
export interface VideoDaten {
  name: string;
  description: string;
  uploadDate: string;
  /** Eigenes Vorschaubild, Pfad ab Wurzel (`/api/medien/file/…`). */
  thumbnailPfad: string;
  /** Dauer als ISO 8601, nur wenn gepflegt. */
  duration?: string;
}

/**
 * `VideoObject` nur mit Schalter und vollständigen Angaben: Video, Titel, Beschreibung (die sichtbare
 * Kurzantwort im Seitenkopf), Datum und ein eigenes Vorschaubild. Sonst `undefined`.
 */
export function videoDaten(tutorial: Tutorial, videosFrei: boolean): VideoDaten | undefined {
  const video = tutorial.video;
  if (!video || !videoSichtbar(tutorial, videosFrei)) return undefined;
  const name = video.title?.trim();
  const description = tutorial.answer.trim();
  const uploadDate = video.date?.trim();
  const thumbnailPfad = video.thumbnail?.url?.trim();
  if (!name || !description || !uploadDate || !/^\d{4}-\d{2}-\d{2}/.test(uploadDate)) return undefined;
  if (!thumbnailPfad || !thumbnailPfad.startsWith('/')) return undefined;
  const sekunden = dauerSekunden(video.duration);
  return {
    name,
    description,
    uploadDate: uploadDate.slice(0, 10),
    thumbnailPfad,
    ...(sekunden ? { duration: isoDauer(sekunden) } : {}),
  };
}
