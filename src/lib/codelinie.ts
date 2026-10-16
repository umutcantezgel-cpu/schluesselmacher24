import type { CodeLine } from '@/lib/types';

/** Kennung einer Codelinie aus dem Namen („… — Serie MS-01“ → „MS-01“), sonst aus dem Slug. Nur Anzeige. */
export function codelinienKennung(line: Pick<CodeLine, 'name' | 'slug'>): string {
  const treffer = /Serie\s+([A-Za-z0-9-]+)\s*$/.exec(line.name);
  return (treffer ? treffer[1] : line.slug).toUpperCase();
}

/**
 * Beschreibung für die Produktseite (Befund H06): Der erste Satz der gepflegten Beschreibung
 * wiederholt die Anwendung kleingeschrieben („Nachschlüssel für möbel- und büroschloss: …“).
 * Auf der Seite nennt er stattdessen die Codelinie; alle weiteren Sätze bleiben wörtlich.
 * Weicht der erste Satz von diesem Muster ab, bleibt die Beschreibung unverändert.
 * Die Daten selbst ändern sich nicht (Vorschlag in `_werkstatt/TEXTVORSCHLAEGE.md`).
 */
export function beschreibungFuerAnzeige(
  line: Pick<CodeLine, 'name' | 'slug' | 'description' | 'application'>,
): string {
  const ende = line.description.indexOf('. ');
  if (ende < 0) return line.description;
  const ersterSatz = line.description.slice(0, ende).trim().toLowerCase();
  if (ersterSatz !== `nachschlüssel für ${line.application.trim().toLowerCase()}`) return line.description;
  return `Nachschlüssel für die Codelinie ${codelinienKennung(line)}.${line.description.slice(ende + 1)}`;
}
