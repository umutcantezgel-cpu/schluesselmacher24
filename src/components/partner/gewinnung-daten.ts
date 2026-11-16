import { getPageContent } from '@/lib/data';
import { GEWINNUNG_SEITEN, gewinnungRoute, gewinnungSeiteMitPflege, type GewinnungSeite, type GewinnungSlug } from '@/lib/partner/gewinnung';

/**
 * Die vier Partnerseiten mit den im Admin gepflegten Texten (FA-22-36, FA-PLATTFORM-02B): für die Verweislisten
 * auf /partner-werden und den Partnerseiten und für /llms.txt, damit ein gepflegter Kurztext überall ankommt.
 * Lässt sich eine Seite nicht lesen, gilt ihr Text aus dem Code.
 */
export async function gepflegteGewinnungSeiten(ohne?: GewinnungSlug): Promise<GewinnungSeite[]> {
  const seiten = await Promise.all(
    GEWINNUNG_SEITEN.map(async (seite) => gewinnungSeiteMitPflege(seite, await getPageContent(gewinnungRoute(seite)).catch(() => null))),
  );
  return seiten.filter((seite) => seite.slug !== ohne);
}
