import { getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/site-url';
import { NAV_AREAS } from '@/lib/navigation';
import { angabe, firmaVeroeffentlichbar, standort } from '@/lib/rechtliches/firma';

export const dynamic = 'force-static';

/**
 * Kurzüberblick für Sprachmodelle und KI-Suchen (llms.txt-Format).
 * Wird aus der Navigation und den Firmendaten erzeugt und bleibt so
 * automatisch aktuell. Nur belegte Aussagen — keine Versprechen zu
 * Einsatzgebieten, die nicht gepflegt sind.
 */
export async function GET() {
  const site = getSiteUrl();
  const { company } = await getSettings();
  const ort = firmaVeroeffentlichbar(company) ? angabe(company.city) : undefined;
  const werkstatt = standort(company);

  const bereiche = NAV_AREAS.map(
    (area) => `- [${area.label}](${site}${area.href}): ${area.summary}`,
  ).join('\n');

  const body = [
    '# SCHLÜSSELMACHER24',
    '',
    `> Fachbetrieb${ort ? ` in ${ort}` : ''} für Autoschlüssel (nachmachen, programmieren, reparieren),`,
    '> Schlüssel nach Code und nach Vorlage, gleichschließende Zylinder, Schließanlagen,',
    '> elektronische Zutrittslösungen, Tür- und Schließtechnik sowie Sicherheitstechnik.',
    '> Versand von Schlüsseln und Zylindern innerhalb Deutschlands, Autoschlüssel-Termine nach Buchung.',
    ...(werkstatt ? ['', `${werkstatt.label}: ${werkstatt.street}, ${werkstatt.postalCode} ${werkstatt.city}`] : []),
    '',
    '## Bereiche',
    '',
    bereiche,
    '',
    '## Hilfreiche Seiten',
    '',
    `- [Ratgeber](${site}/ratgeber): Antworten auf häufige Fragen zu Schlüsseln, Schließtechnik und Einbruchschutz`,
    `- [Kontakt](${site}/service-und-termin/kontakt): Anschrift, Erreichbarkeit und Öffnungszeiten`,
    `- [Zahlung und Versand](${site}/rechtliches/versand-und-zahlung): Versandarten, Kosten und Anzahlung`,
    `- [Partner werden](${site}/partner-werden): Bewerbung für Fachbetriebe, an die wir geprüfte Kundenanfragen vermitteln`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
