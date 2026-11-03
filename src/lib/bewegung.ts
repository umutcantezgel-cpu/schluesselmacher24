/**
 * Zentrales Bewegungsmodul (KERN K-007, A-007, E3-OPUS-03).
 *
 * Eine Quelle für „Bewegung an oder ruhig“: das Attribut `data-bewegung` auf `<html>`.
 * Ein kleines Inline-Skript (`STARTSKRIPT`, im Root-Layout vor dem ersten Rendern) setzt es aus
 * der gespeicherten Wahl im Gerät (`localStorage` `sm24-bewegung`) oder, ohne Wahl, aus der
 * Systemeinstellung „Bewegung reduzieren“. Der Schalter im Fuß (`BewegungSchalter`) ändert es.
 *
 * CSS koppelt alle Animationen an `html[data-bewegung="an"]` (globals.css, Tailwind-Varianten
 * `bewegt:` und `ruhig:`). Ohne JavaScript fehlt das Attribut: Dann bewegt sich
 * nichts, und alles ist sofort sichtbar. JavaScript-Bewegung (WAAPI, `scrollTo`) fragt
 * `bewegungReduziert()`.
 */

export type Bewegung = 'an' | 'ruhig';

/** Schlüssel der Wahl im Gerät. */
export const BEWEGUNG_SCHLUESSEL = 'sm24-bewegung';

/** Ereignis an `document`, wenn die Wahl wechselt (für Hüllen ohne React). */
export const BEWEGUNG_EREIGNIS = 'sm24-bewegung';

/** Klasse für Startzustände der Inszenierung; das Startskript nimmt sie nach höchstens 2 s weg. */
export const START_KLASSE = 'sm24-start';

/** Zeitlimit, nach dem alles sichtbar ist (Auftrag 12: „nach 2 s zeigt ein Zeitlimit alles“). */
export const START_ZEITLIMIT_MS = 2000;

const ANFRAGE_REDUZIERT = '(prefers-reduced-motion: reduce)';
const ANFRAGE_FEINER_ZEIGER = '(hover: hover) and (pointer: fine)';

/** Wahl aus gespeichertem Wert und Systemeinstellung: Eine gültige Wahl im Gerät gewinnt. */
export function bewegungAusWahl(gespeichert: string | null | undefined, systemReduziert: boolean): Bewegung {
  if (gespeichert === 'an' || gespeichert === 'ruhig') return gespeichert;
  return systemReduziert ? 'ruhig' : 'an';
}

/**
 * Inline-Skript vor dem ersten Rendern (CSP: `script-src 'unsafe-inline'` ist gesetzt). Kurz, ohne
 * Abhängigkeiten, jeder Zugriff abgesichert: Ein Fehler lässt die Seite ruhig und sichtbar.
 * Bei „an“ setzt es `sm24-start` und nimmt die Klasse nach 2 s weg; die Inszenierung nimmt sie
 * früher weg, sobald sie bereit ist.
 */
export const STARTSKRIPT = `(function(){var d=document.documentElement,w="ruhig";try{var g=localStorage.getItem("${BEWEGUNG_SCHLUESSEL}");w=g==="an"||g==="ruhig"?g:(window.matchMedia&&window.matchMedia("${ANFRAGE_REDUZIERT}").matches?"ruhig":"an")}catch(e){try{w=window.matchMedia("${ANFRAGE_REDUZIERT}").matches?"ruhig":"an"}catch(f){}}d.setAttribute("data-bewegung",w);if(w==="an"){d.classList.add("${START_KLASSE}");setTimeout(function(){d.classList.remove("${START_KLASSE}")},${START_ZEITLIMIT_MS})}})();`;

function systemReduziert(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return window.matchMedia(ANFRAGE_REDUZIERT).matches;
}

/** Aktuelle Wahl im Browser: Attribut auf `<html>`, sonst die Systemeinstellung. Ohne Browser: ruhig. */
export function aktuelleBewegung(): Bewegung {
  if (typeof document === 'undefined' || !document.documentElement) return systemReduziert() ? 'ruhig' : 'an';
  const wert = document.documentElement.getAttribute('data-bewegung');
  if (wert === 'an' || wert === 'ruhig') return wert;
  return systemReduziert() ? 'ruhig' : 'an';
}

/** Ob gerade nichts bewegt werden soll („ruhig“ oder „Bewegung reduzieren“). Ohne Browser: ja. */
export function bewegungReduziert(): boolean {
  if (typeof window === 'undefined') return true;
  return aktuelleBewegung() === 'ruhig';
}

/**
 * Scrollverhalten für `scrollTo`/`scrollIntoView`: sanft, außer bei ruhiger
 * Darstellung – dann springt die Seite sofort an die Stelle.
 */
export function scrollVerhalten(reduziert: boolean = bewegungReduziert()): ScrollBehavior {
  return reduziert ? 'auto' : 'smooth';
}

/** Ob ein feiner Zeiger da ist (Maus, Stift): nur dann Zeiger-Effekte (Auftrag 12). */
export function zeigerFein(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(ANFRAGE_FEINER_ZEIGER).matches;
}

/** Wahl setzen: Attribut, Gerät (abgesichert) und Ereignis. Die Startklasse entfällt bei „ruhig“. */
export function setzeBewegung(wahl: Bewegung): void {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.setAttribute('data-bewegung', wahl);
  if (wahl === 'ruhig') html.classList.remove(START_KLASSE);
  try {
    window.localStorage.setItem(BEWEGUNG_SCHLUESSEL, wahl);
  } catch {
    /* Privates Fenster oder gesperrter Speicher: Die Wahl gilt dann nur für diese Seite. */
  }
  document.dispatchEvent(new CustomEvent(BEWEGUNG_EREIGNIS, { detail: wahl }));
}

/** Benachrichtigt bei jeder Änderung der Wahl (Attribut oder Systemeinstellung). Gibt die Abmeldung zurück. */
export function beobachteBewegung(rueckruf: () => void): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return () => {};
  const beobachter = new MutationObserver(rueckruf);
  beobachter.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bewegung'] });
  const anfrage = typeof window.matchMedia === 'function' ? window.matchMedia(ANFRAGE_REDUZIERT) : null;
  anfrage?.addEventListener?.('change', rueckruf);
  return () => {
    beobachter.disconnect();
    anfrage?.removeEventListener?.('change', rueckruf);
  };
}
