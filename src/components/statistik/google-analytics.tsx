'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

import { einwilligungLesen, useEinwilligungRoh } from '@/lib/einwilligung';
import { AKTION_EREIGNIS, istAktion, type AktionDetail } from '@/lib/statistik';

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** gtag wie von Google vorgegeben: Befehle landen in `dataLayer`, bis das Skript sie abarbeitet. */
function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = function gtagBefehl() {
      // gtag.js erwartet das arguments-Objekt, kein Array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  window.gtag(...args);
}

/** Entfernt die Analytics-Cookies (_ga, _ga_…) für diese Domain und ihre übergeordneten Domains. */
function gaCookiesLoeschen() {
  const namen = document.cookie
    .split(';')
    .map((eintrag) => eintrag.split('=')[0]?.trim() ?? '')
    .filter((name) => name === '_ga' || name.startsWith('_ga_') || name === '_gid');
  const teile = window.location.hostname.split('.');
  const domains = ['', ...teile.map((_, index) => `.${teile.slice(index).join('.')}`).slice(0, -1)];
  for (const name of namen) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

/**
 * Google Analytics 4 mit Consent Mode v2: Standard „verweigert“; gtag.js wird erst nach der
 * Einwilligung in „Statistik“ geladen. Ein Widerruf setzt die Einwilligung zurück, stoppt die
 * Messung und löscht die Cookies. Gemeldete Aktionen (`sm24:aktion`) gehen als Ereignisse an GA4.
 * IP-Adressen kürzt GA4 von sich aus.
 */
export function GoogleAnalytics({ messId }: { messId: string }) {
  const erlaubt = einwilligungLesen(useEinwilligungRoh())?.statistik === true;
  const konfiguriert = useRef(false);

  // Einmal je Seitenaufruf: alles verweigert, bevor irgendein Befehl Daten senden könnte.
  useEffect(() => {
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  }, []);

  useEffect(() => {
    const abschalten = `ga-disable-${messId}`;
    if (erlaubt) {
      (window as unknown as Record<string, unknown>)[abschalten] = false;
      gtag('consent', 'update', { analytics_storage: 'granted' });
      if (!konfiguriert.current) {
        gtag('js', new Date());
        gtag('config', messId);
        konfiguriert.current = true;
      }
      return;
    }
    // Widerruf (oder nie erteilt): Messung aus, Cookies weg.
    (window as unknown as Record<string, unknown>)[abschalten] = true;
    if (konfiguriert.current) gtag('consent', 'update', { analytics_storage: 'denied' });
    gaCookiesLoeschen();
  }, [erlaubt, messId]);

  useEffect(() => {
    if (!erlaubt) return;
    function beiAktion(event: Event) {
      const detail = (event as CustomEvent<Partial<AktionDetail>>).detail;
      if (!istAktion(detail?.aktion)) return;
      gtag('event', detail.aktion, detail.bereich ? { bereich: detail.bereich } : {});
    }
    window.addEventListener(AKTION_EREIGNIS, beiAktion);
    return () => window.removeEventListener(AKTION_EREIGNIS, beiAktion);
  }, [erlaubt]);

  if (!erlaubt) return null;
  return (
    <Script
      id="ga4"
      src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(messId)}`}
      strategy="afterInteractive"
    />
  );
}
