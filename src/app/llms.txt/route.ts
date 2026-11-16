import { getCodeLines, getSettings } from '@/lib/data';
import { ANFRAGE_FORMULAR, KLASSEN_SEITEN } from '@/lib/fahrzeuge/anfrage-klassen';
import { getSiteUrl } from '@/lib/site-url';
import { NAV_AREAS } from '@/lib/navigation';
import { gepflegteGewinnungSeiten } from '@/components/partner/gewinnung-daten';
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
  const [{ company }, codeLines, partnerSeiten] = await Promise.all([getSettings(), getCodeLines(), gepflegteGewinnungSeiten()]);
  const ort = firmaVeroeffentlichbar(company) ? angabe(company.city) : undefined;
  const werkstatt = standort(company);

  // Ohne echte Codeprodukte (Beispiele zählen nie, A-046) kein Versprechen einer Direktbestellung.
  const bereiche = NAV_AREAS.map((area) => {
    const summary = area.key === 'schluessel-nach-code' && codeLines.length === 0
      ? 'Code nennen, wir prüfen ihn auf Anfrage. Ohne Einsendung des Originals.'
      : area.summary;
    return `- [${area.label}](${site}${area.href}): ${summary}`;
  }).join('\n');

  // Weitere Fahrzeuge (FA-SOFORT-05): nur Einstiegsseiten, die freigegeben sind (Schalter `indexierbar`).
  const fahrzeuge = (Object.keys(KLASSEN_SEITEN) as Array<keyof typeof KLASSEN_SEITEN>)
    .filter((klasse) => ANFRAGE_FORMULAR[klasse].indexierbar && KLASSEN_SEITEN[klasse].einstieg)
    .map((klasse) => {
      const seite = KLASSEN_SEITEN[klasse].einstieg!;
      return `- [${seite.headline}](${site}/${seite.route}): ${seite.subline}`;
    });

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
    ...(fahrzeuge.length ? ['', '## Weitere Fahrzeuge', '', ...fahrzeuge] : []),
    '',
    '## Hilfreiche Seiten',
    '',
    `- [Ratgeber](${site}/ratgeber): Antworten auf häufige Fragen zu Schlüsseln, Schließtechnik und Einbruchschutz`,
    `- [Kontakt](${site}/service-und-termin/kontakt): Anschrift und Erreichbarkeit`,
    `- [Zahlung und Versand](${site}/rechtliches/versand-und-zahlung): Versandarten, Kosten und Anzahlung`,
    `- [Partner werden](${site}/partner-werden): Bewerbung für Fachbetriebe für Autoschlüssel und Fahrzeugschlüssel`,
    ...partnerSeiten.map((seite) => `  - [${seite.kurzname}](${site}${seite.pfad}): ${seite.kurztext}`),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
