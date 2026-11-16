/**
 * Hilfen für die Tests der Grafik-Generatoren (FA-QA-04D): liest die Beschriftungen aus dem
 * statischen Markup und schätzt ihren Platz in viewBox-Einheiten. Kein Generator, nur für Tests.
 *
 * Schätzung wie in den Generatoren: Monoschrift mit 0,6 em je Zeichen, Oberlänge 0,75 em über
 * und Unterlänge 0,25 em unter der Grundlinie.
 */

export interface TextKasten {
  inhalt: string;
  x: number;
  y: number;
  groesse: number;
  links: number;
  rechts: number;
  oben: number;
  unten: number;
}

function attribut(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
}

/** Alle `<text>` mit Zahlenwerten für x, y und font-size. Text in Gruppen mit `transform` liest der Aufrufer selbst. */
export function textKaesten(html: string): TextKasten[] {
  return [...html.matchAll(/<text([^>]*)>([^<]*)<\/text>/g)].map(([, tag, roh]) => {
    const inhalt = roh.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const x = Number(attribut(tag, 'x') ?? 0);
    const y = Number(attribut(tag, 'y') ?? 0);
    const groesse = Number(attribut(tag, 'font-size'));
    const anker = attribut(tag, 'text-anchor') ?? 'start';
    const abstand = Number(attribut(tag, 'letter-spacing') ?? 0);
    const zeichen = [...inhalt].length;
    const breite = zeichen * groesse * 0.6 + Math.max(0, zeichen - 1) * abstand;
    const links = anker === 'middle' ? x - breite / 2 : anker === 'end' ? x - breite : x;
    return { inhalt, x, y, groesse, links, rechts: links + breite, oben: y - groesse * 0.75, unten: y + groesse * 0.25 };
  });
}

/** Kästen, die über die Fläche `0 … breite × 0 … hoehe` hinausragen. */
export function ausserhalb(kaesten: TextKasten[], breite: number, hoehe: number): string[] {
  return kaesten
    .filter((k) => k.links < 0 || k.oben < 0 || k.rechts > breite || k.unten > hoehe)
    .map((k) => `${k.inhalt} (${k.links.toFixed(1)}…${k.rechts.toFixed(1)}, ${k.oben.toFixed(1)}…${k.unten.toFixed(1)})`);
}

/** Paare von Beschriftungen, deren Kästen sich überlagern (Berühren ist erlaubt). */
export function ueberlappungen(kaesten: TextKasten[]): string[] {
  const funde: string[] = [];
  for (let i = 0; i < kaesten.length; i += 1) {
    for (let j = i + 1; j < kaesten.length; j += 1) {
      const a = kaesten[i];
      const b = kaesten[j];
      const getrennt = a.rechts <= b.links || b.rechts <= a.links || a.unten <= b.oben || b.unten <= a.oben;
      if (!getrennt) funde.push(`${a.inhalt} ↔ ${b.inhalt}`);
    }
  }
  return funde;
}

/** Schriftgröße auf dem Bildschirm in px: Einheiten × Darstellungsbreite / viewBox-Breite. */
export function bildschirmPx(einheiten: number, darstellungPx: number, viewBoxBreite: number): number {
  return (einheiten * darstellungPx) / viewBoxBreite;
}
