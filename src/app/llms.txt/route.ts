import { getSiteUrl } from '@/lib/site-url';
import { NAV_AREAS } from '@/lib/navigation';

export const dynamic = 'force-static';

/**
 * Kurzüberblick für Sprachmodelle und KI-Suchen (llms.txt-Format).
 * Wird aus der Navigation erzeugt und bleibt so automatisch aktuell.
 */
export function GET() {
  const site = getSiteUrl();

  const bereiche = NAV_AREAS.map(
    (area) => `- [${area.label}](${site}${area.href}): ${area.summary}`,
  ).join('\n');

  const body = [
    '# SCHLÜSSELMACHER24',
    '',
    '> Fachbetrieb für Autoschlüssel (nachmachen, programmieren, reparieren), Schlüssel nach',
    '> Code und nach Vorlage, gleichschließende Zylinder, Schließanlagen, elektronische',
    '> Zutrittslösungen, Tür- und Schließtechnik sowie Sicherheitstechnik. Bestellungen und',
    '> Anfragen deutschlandweit, Termine mit Fahrzeug vor Ort.',
    '',
    '## Bereiche',
    '',
    bereiche,
    '',
    '## Hilfreiche Seiten',
    '',
    `- [Ratgeber](${site}/ratgeber): Antworten auf häufige Fragen zu Schlüsseln, Schließtechnik und Einbruchschutz`,
    `- [Einsatzgebiete](${site}/standorte): Regionen mit Vor-Ort-Leistungen`,
    `- [Zahlung und Versand](${site}/rechtliches/versand-und-zahlung): Versandarten, Kosten und Anzahlung`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
