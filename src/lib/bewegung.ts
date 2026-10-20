/**
 * Bewegung im Browser, die nicht über CSS läuft (KERN K-007).
 *
 * Die globale Regel „Bewegung reduzieren“ in `globals.css` erfasst nur
 * CSS-Animationen. JavaScript-Scrollen (`scrollTo`, `scrollIntoView`) muss die
 * Einstellung selbst beachten – sonst gleitet die Seite trotzdem.
 */

const ANFRAGE = '(prefers-reduced-motion: reduce)';

/** Ob „Bewegung reduzieren“ eingestellt ist. Ohne Browser: ja (nichts bewegen). */
export function bewegungReduziert(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return window.matchMedia(ANFRAGE).matches;
}

/**
 * Scrollverhalten für `scrollTo`/`scrollIntoView`: sanft, außer bei
 * „Bewegung reduzieren“ – dann springt die Seite sofort an die Stelle.
 */
export function scrollVerhalten(reduziert: boolean = bewegungReduziert()): ScrollBehavior {
  return reduziert ? 'auto' : 'smooth';
}
