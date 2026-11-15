import { getCodeLines, getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/site-url';
import { NAV_AREAS } from '@/lib/navigation';
import { GEWINNUNG_SEITEN } from '@/lib/partner/gewinnung';
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
  const [{ company }, codeLines] = await Promise.all([getSettings(), getCodeLines()]);
  const ort = firmaVeroeffentlichbar(company) ? angabe(company.city) : undefined;
  const werkstatt = standort(company);

  // Ohne echte Codeprodukte (Beispiele zählen nie, A-046) kein Versprechen einer Direktbestellung.
  const bereiche = NAV_AREAS.map((area) => {
    const summary = area.key === 'schluessel-nach-code' && codeLines.length === 0
      ? 'Code nennen, wir prüfen ihn auf Anfrage. Ohne Einsendung des Originals.'
      : area.summary;
    return `- [${area.label}](${site}${area.href}): ${summary}`;
  }).join('\n');

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
    `- [Kontakt](${site}/service-und-termin/kontakt): Anschrift und Erreichbarkeit`,
    `- [Zahlung und Versand](${site}/rechtliches/versand-und-zahlung): Versandarten, Kosten und Anzahlung`,
    `- [Partner werden](${site}/partner-werden): Bewerbung für Fachbetriebe für Autoschlüssel und Fahrzeugschlüssel`,
    ...GEWINNUNG_SEITEN.map((seite) => `  - [${seite.kurzname}](${site}${seite.pfad}): ${seite.kurztext}`),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
