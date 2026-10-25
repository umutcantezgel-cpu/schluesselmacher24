'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

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
 * Seiten, deren Adresse einen persönlichen Link-Schlüssel (`?t=…`) oder eine Vorgangsnummer
 * trägt: Dort misst GA4 gar nicht, damit nichts davon bei Google landet. Die Kasse bleibt
 * messbar (ihre Adresse ist neutral), dort entsteht das Ereignis „bestellung“.
 */
const PRIVATE_PFADE = ['/bestellung', '/rechtliches/widerruf/erklaeren'];

export function istPrivaterPfad(pfad: string): boolean {
  return PRIVATE_PFADE.some((privat) => pfad === privat || pfad.startsWith(`${privat}/`));
}

/** Adresse ohne Query und Anker — Link-Schlüssel und Nummern gehen nie an Google. */
function ohneQuery(adresse: string): string {
  return adresse.split(/[?#]/)[0] ?? '';
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
  const pfad = usePathname() ?? '/';
  const privat = istPrivaterPfad(pfad);

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
      // Auf privaten Seiten bleibt die Messung aus, die Einwilligung bleibt bestehen.
      (window as unknown as Record<string, unknown>)[abschalten] = privat;
      gtag('consent', 'update', { analytics_storage: 'granted' });
      if (!konfiguriert.current) {
        gtag('js', new Date());
        konfiguriert.current = true;
      }
      if (privat) return;
      // Seitenaufruf selbst melden, immer ohne Query: kein `send_page_view`, damit gtag nicht
      // die volle Adresse (mit Link-Schlüssel oder Nummer) überträgt.
      const seite = `${window.location.origin}${pfad}`;
      gtag('config', messId, {
        send_page_view: false,
        page_location: seite,
        page_referrer: ohneQuery(document.referrer),
      });
      gtag('event', 'page_view', { page_location: seite, page_path: pfad, page_title: document.title });
      return;
    }
    // Widerruf (oder nie erteilt): Messung aus, Cookies weg.
    (window as unknown as Record<string, unknown>)[abschalten] = true;
    if (konfiguriert.current) gtag('consent', 'update', { analytics_storage: 'denied' });
    gaCookiesLoeschen();
  }, [erlaubt, messId, pfad, privat]);

  useEffect(() => {
    if (!erlaubt) return;
    function beiAktion(event: Event) {
      if (istPrivaterPfad(window.location.pathname)) return;
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
