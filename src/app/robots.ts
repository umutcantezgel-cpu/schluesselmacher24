import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import { indexierungErlaubt } from '@/lib/umgebung';

const siteUrl = getSiteUrl();

/** Vorgangsdaten, Warenkorb, Backend und Schnittstellen gehören in keiner Umgebung in den Index. */
const NIE_CRAWLEN = ['/admin', '/api/', '/kasse', '/warenkorb', '/bestellung'];

export default function robots(): MetadataRoute.Robots {
  // Vorschau, Schaufenster und lokale Umgebungen sperren hier bewusst nicht alles: Eine Suchmaschine
  // muss die Seiten abrufen dürfen, um ihr noindex (Meta-Angabe im Root-Layout, X-Robots-Tag aus
  // suchmaschinenKopfzeilen) zu sehen; eine Sperre in robots.txt ließe die Adressen sonst ohne Inhalt
  // im Index stehen (Google, block-indexing; FA-RECHERCHE-05 Abschnitt 4). Ob indexiert werden darf,
  // entscheidet allein indexierungErlaubt(); hier hängt davon nur der Sitemap-Hinweis ab.
  // Ohne dynamische Schnittstelle erzeugt Next.js die Datei beim Build: SM24_INDEXIERUNG wirkt nur, wenn es
  // beim Build gesetzt ist; eine Änderung braucht einen neuen Build bzw. ein neues Deployment.
  const regeln: MetadataRoute.Robots = { rules: [{ userAgent: '*', allow: '/', disallow: NIE_CRAWLEN }] };
  return indexierungErlaubt() ? { ...regeln, sitemap: `${siteUrl}/sitemap.xml` } : regeln;
}
