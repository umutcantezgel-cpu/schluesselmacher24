import type { Metadata } from 'next';

import { getPageContent, getSettings } from '@/lib/data';
import { gewinnungRoute, gewinnungSeite, gewinnungSeiteMitPflege } from '@/lib/partner/gewinnung';
import { gepflegteGewinnungSeiten } from '@/components/partner/gewinnung-daten';
import { GewinnungSeite } from '@/components/partner/gewinnung-seite';

/* Rückfall aus gewinnung.ts; Suchtexte, Überschrift, Kurztext und Einleitung im Admin pflegbar (FA-22-36). */
const SEITE = gewinnungSeite('auftraege-erhalten');
const ROUTE = gewinnungRoute(SEITE);

async function seiteMitPflege() {
  return gewinnungSeiteMitPflege(SEITE, await getPageContent(ROUTE));
}

export async function generateMetadata(): Promise<Metadata> {
  const seite = await seiteMitPflege();
  return {
    title: seite.titel,
    description: seite.beschreibung,
    alternates: { canonical: SEITE.pfad },
  };
}

export default async function PartnerAuftraegeErhaltenPage() {
  const [seite, settings, weitere] = await Promise.all([seiteMitPflege(), getSettings(), gepflegteGewinnungSeiten(SEITE.slug)]);
  return <GewinnungSeite seite={seite} telefon={settings.company.phone} weitere={weitere} />;
}
