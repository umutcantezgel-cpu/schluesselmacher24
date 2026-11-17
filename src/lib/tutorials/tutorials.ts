import type { Tutorial, TutorialOrt } from '@/lib/types';

/* ==========================================================================
   Tutorials: Auswahl und Regeln (FA-INHALT-01), reine Funktionen

   - Nur veröffentlichte Tutorials erzeugen eine Seite, einen Eintrag in der
     Übersicht oder einen Hinweis an einem Ort.
   - Indexiert wird nur eine Seite mit belegtem Inhalt (R3): mindestens zwei
     Schritte mit Text, und kein Doppel zu einem Ratgeber, der das Thema schon
     vollständig erklärt. Ein Video bringt erst dann eigenen Wert, wenn es auf
     der Seite wirklich erscheint (Einbettung mit Einwilligung, Teil B); bis
     dahin zeigt die Seite nur einen Hinweissatz.
   ========================================================================== */

/**
 * Ist die Einbettung der Videos freigeschaltet? In Teil A nicht: Die Seite zeigt statt des Videos nur
 * einen Hinweissatz. Teil B (FA-INHALT-01B) legt den Schalter mit der Einbettung um.
 */
export const VIDEO_EINBETTUNG_FREI = false;

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
  return tutorialIndexierbarBei(tutorial, VIDEO_EINBETTUNG_FREI);
}

/** Die Regel mit ausdrücklichem Schalter (für Tests und Teil B); einzeln aufrufen, nicht als Filter. */
export function tutorialIndexierbarBei(tutorial: Tutorial, einbettungFrei: boolean): boolean {
  if (!tutorial.published || tutorial.seo.noindex) return false;
  if (belegteSchritte(tutorial).length < 2) return false;
  // Der Ratgeber trägt das Thema schon: ohne sichtbares Video wäre die Seite ein Doppel (R3).
  if (tutorial.guideSlug && !(einbettungFrei && tutorial.video?.youtubeId)) return false;
  return true;
}

/** Veröffentlichte Tutorials, die einem Ort zugeordnet sind (für den Hinweis aus Teil B). */
export function tutorialsFuer(alle: Tutorial[], ort: TutorialOrt): Tutorial[] {
  return veroeffentlichteTutorials(alle).filter((tutorial) => tutorial.places.includes(ort));
}
