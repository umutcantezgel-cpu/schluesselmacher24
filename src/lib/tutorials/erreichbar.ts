import { FOOTER_CONTENT, MEHR_LINKS, type NavLink } from '@/lib/navigation';

import { TUTORIALS_PFAD } from './tutorials';

/* ==========================================================================
   Ist die Rubrik „Tutorials“ für Besucher erreichbar? (FA-INHALT-01)
   Die Rubrik ist erst dann ein Weg, wenn Menü „Mehr“ oder der Fuß unter
   „Service“ auf /tutorials verweist. Den Eintrag setzt der Orchestrator in
   src/lib/navigation.ts. Bis dahin meldet die Sitemap weder die Übersicht
   noch die Einzelseiten an Suchmaschinen: eine Insel, die nur von sich selbst
   verlinkt wird, gehört nicht in die Sitemap.
   ========================================================================== */

export function tutorialsVerlinkt(links: readonly NavLink[] = [...MEHR_LINKS, ...FOOTER_CONTENT]): boolean {
  return links.some((link) => link.href === TUTORIALS_PFAD);
}
