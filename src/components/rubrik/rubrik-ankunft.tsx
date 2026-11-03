'use client';

import { useEffect } from 'react';

/** Merkzettel für den Wechsel aus dem Hub: welche Rubrik zuletzt per Kachel geöffnet wurde. */
export const HUB_WECHSEL_SCHLUESSEL = 'sm24-hub-wechsel';
/** Klasse der kurzen Überblendung, wenn der Browser keine View Transitions kennt (B-35, Rückfall). */
export const UEBERBLENDUNG_KLASSE = 'sm24-ueberblendung';

type MitAktivemWechsel = Document & { activeViewTransition?: { skipTransition?: () => void } | null };

/**
 * Ankunft in einer Rubrik nach einem Tipp auf ihre Hub-Kachel (B-35): Der Fokus liegt danach auf
 * der h1 (Tastatur und Vorleser landen beim neuen Inhalt), ohne View-Transition-Unterstützung blendet
 * der Kopf kurz über, und ein Tippen während eines laufenden Übergangs beendet ihn sofort. Ohne
 * Wechsel aus dem Hub (Direktaufruf, Zurück) geschieht nichts.
 */
export function RubrikAnkunft({ rubrikId, titelId }: { rubrikId: string; titelId: string }) {
  useEffect(() => {
    let gemerkt: string | null = null;
    try {
      gemerkt = window.sessionStorage.getItem(HUB_WECHSEL_SCHLUESSEL);
      if (gemerkt) window.sessionStorage.removeItem(HUB_WECHSEL_SCHLUESSEL);
    } catch {
      /* Gesperrter Speicher: dann ohne Fokuswechsel, die Seite bleibt bedienbar. */
    }
    if (gemerkt !== rubrikId) return;

    const titel = document.getElementById(titelId);
    titel?.focus({ preventScroll: true });

    if (typeof document.startViewTransition !== 'function') {
      titel?.closest('header, section')?.classList.add(UEBERBLENDUNG_KLASSE);
    }

    const beenden = () => (document as MitAktivemWechsel).activeViewTransition?.skipTransition?.();
    window.addEventListener('pointerdown', beenden, { capture: true, once: true });
    const ende = window.setTimeout(() => window.removeEventListener('pointerdown', beenden, { capture: true }), 1000);
    return () => {
      window.clearTimeout(ende);
      window.removeEventListener('pointerdown', beenden, { capture: true });
    };
  }, [rubrikId, titelId]);
  return null;
}

/** Merkt sich beim Tipp auf eine Hub-Kachel die Rubrik (für Fokus und Rückfall in der Rubrik). */
export function HubWechselMerker() {
  useEffect(() => {
    const merken = (event: MouseEvent) => {
      const kachel = (event.target as Element | null)?.closest?.('[data-rubrik]');
      const id = kachel?.getAttribute('data-rubrik');
      if (!id) return;
      try {
        window.sessionStorage.setItem(HUB_WECHSEL_SCHLUESSEL, id);
      } catch {
        /* ohne Speicher kein Fokuswechsel */
      }
    };
    document.addEventListener('click', merken, { capture: true });
    return () => document.removeEventListener('click', merken, { capture: true });
  }, []);
  return null;
}
