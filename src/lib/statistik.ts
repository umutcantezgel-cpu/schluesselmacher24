/* ==========================================================================
   Statistik: Google Analytics 4 nur nach Einwilligung
   Ohne Mess-ID (NEXT_PUBLIC_GA_MEASUREMENT_ID) lädt die Seite nichts davon,
   zeigt keine Einwilligungsfrage und nennt den Dienst nicht in der
   Datenschutzerklärung.
   ========================================================================== */

/** Mess-ID von Google Analytics 4, nur in der Form „G-…“. Sonst `undefined` — dann bleibt alles aus. */
export function gaMessId(): string | undefined {
  // Wörtlicher Zugriff: Next setzt NEXT_PUBLIC_-Werte beim Bauen auch im Browser ein.
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim().toUpperCase();
  return id && /^G-[A-Z0-9]{4,20}$/.test(id) ? id : undefined;
}

/** Ereignis im Browser, mit dem Abläufe eine erfolgreiche Aktion melden (`detail: { aktion }`). */
export const AKTION_EREIGNIS = 'sm24:aktion';

/** Gemessene Aktionen (Erg. Leitfaden §4) — zugleich die Ereignisnamen in GA4. */
export const AKTIONEN = ['bestellung', 'fotoanfrage', 'terminanfrage', 'partneranmeldung', 'projektanfrage'] as const;
export type Sm24Aktion = (typeof AKTIONEN)[number];

export interface AktionDetail {
  aktion: Sm24Aktion;
  /** Optional: Bereich der Aktion, z. B. „schliessanlagen“. */
  bereich?: string;
}

export function istAktion(wert: unknown): wert is Sm24Aktion {
  return typeof wert === 'string' && (AKTIONEN as readonly string[]).includes(wert);
}

/**
 * Meldet eine erfolgreiche Aktion. Gemessen wird sie nur, wenn GA4 eingebunden ist und die
 * Einwilligung vorliegt — sonst geschieht nichts.
 */
export function aktionMelden(aktion: Sm24Aktion, bereich?: string): void {
  if (typeof window === 'undefined') return;
  const detail: AktionDetail = bereich ? { aktion, bereich } : { aktion };
  window.dispatchEvent(new CustomEvent<AktionDetail>(AKTION_EREIGNIS, { detail }));
}
