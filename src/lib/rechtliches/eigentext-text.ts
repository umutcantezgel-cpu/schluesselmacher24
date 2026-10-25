import type { RichTextDocument } from '@/lib/types';

/* ==========================================================================
   Eigentext als schlichter Text
   Ist im Backend eine eigene Fassung einer Rechtsseite hinterlegt (Lexical-
   JSON), braucht die Vertragsbestätigung denselben Wortlaut als Text — die
   Mail soll nie etwas anderes sagen als die Seite. Absätze und Überschriften
   werden durch Leerzeilen getrennt, Listenpunkte mit „–“ eingeleitet, Links
   mit ihrer Adresse in Klammern.
   ========================================================================== */

interface Knoten {
  type?: string;
  text?: string;
  tag?: string;
  listType?: string;
  url?: string;
  fields?: { url?: string };
  children?: Knoten[];
}

const BLOECKE = new Set(['paragraph', 'heading', 'quote', 'listitem']);

function inline(knoten: Knoten): string {
  if (knoten.type === 'linebreak') return '\n';
  if (knoten.type === 'tab') return '\t';
  if (typeof knoten.text === 'string') return knoten.text;
  const inhalt = (knoten.children ?? []).map(inline).join('');
  if (knoten.type === 'link' || knoten.type === 'autolink') {
    const url = knoten.fields?.url ?? knoten.url;
    return url && /^https?:\/\//.test(url) && !inhalt.includes(url) ? `${inhalt} (${url})` : inhalt;
  }
  return inhalt;
}

function bloecke(knoten: Knoten, ebene = 0): string[] {
  if (knoten.type === 'list') {
    return (knoten.children ?? []).flatMap((punkt, index) => {
      const verschachtelt = (punkt.children ?? []).filter((kind) => kind.type === 'list');
      const text = (punkt.children ?? []).filter((kind) => kind.type !== 'list').map(inline).join('').trim();
      const zeichen = knoten.listType === 'number' ? `${index + 1}.` : '–';
      const zeile = text ? [`${'  '.repeat(ebene)}${zeichen} ${text}`] : [];
      return [...zeile, ...verschachtelt.flatMap((liste) => bloecke(liste, ebene + 1))];
    });
  }
  if (knoten.type && BLOECKE.has(knoten.type)) {
    const text = inline(knoten).trim();
    if (!text) return [];
    return [knoten.type === 'heading' ? text.toUpperCase() : text];
  }
  return (knoten.children ?? []).flatMap((kind) => bloecke(kind, ebene));
}

/** Lexical-Dokument als Text: Blöcke durch Leerzeilen getrennt, Listen zusammenhängend. */
export function eigentextAlsText(dokument: RichTextDocument): string {
  const ergebnis: string[] = [];
  for (const kind of (dokument.root.children ?? []) as Knoten[]) {
    const teile = bloecke(kind);
    if (teile.length === 0) continue;
    ergebnis.push(kind.type === 'list' ? teile.join('\n') : teile.join('\n\n'));
  }
  return ergebnis.join('\n\n');
}
