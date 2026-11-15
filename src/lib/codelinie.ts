import type { CodeLine, ShopHersteller, ShopKategorie, Verfuegbarkeit } from '@/lib/types';
import { codePasst } from '@/lib/code-pattern';
import { herstellerSortiert, kategorieAufloesen, kategorieKette, sichtbareKategorien, verfuegbarkeitVon } from '@/lib/data/shop';
import { istPlatzhalter } from '@/lib/platzhalter';
import { slugify } from '@/lib/slug';

/* ==========================================================================
   Codelinien — Einordnung, Adressen und Codesuche. Reine Funktionen ohne
   Server-Abhängigkeiten: Sie laufen auf den Seiten wie in der Shop-Liste im
   Browser.
   ========================================================================== */

export const SHOP_PFAD = '/schluessel-nach-code';
export const KATEGORIE_PFAD = `${SHOP_PFAD}/kategorie`;
export const HERSTELLER_PFAD = `${SHOP_PFAD}/hersteller`;

/** Kennung einer Codelinie aus dem Namen („… — Serie MS-01“ → „MS-01“), sonst aus dem Slug. Nur Anzeige. */
export function codelinienKennung(line: Pick<CodeLine, 'name' | 'slug'>): string {
  const treffer = /Serie\s+([A-Za-z0-9-]+)\s*$/.exec(line.name);
  return (treffer ? treffer[1] : line.slug).toUpperCase();
}

/** Titel ohne die angehängte Serienkennung („— Serie MS-01“). Nur Anzeige. */
export function codelinienTitel(line: Pick<CodeLine, 'name'>): string {
  return line.name.replace(/\s*[—–-]\s*Serie\s+[A-Za-z0-9-]+\s*$/, '');
}

/**
 * Anwendungsfamilie. Konvention der Datenschicht: Sie steht als letzter
 * Eintrag in `tags`. Fehlt sie, wird auf die Anwendung zurückgefallen.
 */
export function codelinienFamilie(line: Pick<CodeLine, 'tags' | 'application'>): string {
  const letzte = line.tags[line.tags.length - 1]?.trim();
  return letzte || line.application;
}

/** Anwendung ohne Vorsatz: „Möbel- und Büroschloss: Büroschrank“ → „Büroschrank“. */
export function anwendungKurz(line: Pick<CodeLine, 'application'>): string {
  const teile = line.application.split(':');
  return (teile.length > 1 ? teile.slice(1).join(':') : teile[0]).trim();
}

/** Vorsatz der Anwendung: „Möbel- und Büroschloss: Büroschrank“ → „Möbel- und Büroschloss“. */
export function anwendungBasis(line: Pick<CodeLine, 'application'>): string {
  return line.application.split(':')[0].trim();
}

/** Ein gepflegter Wert — Platzhalter wie „[Hersteller eintragen]“ und Leeres zählen nicht. */
export function gepflegt(wert: string | null | undefined): string | undefined {
  return istPlatzhalter(wert) ? undefined : wert!.trim();
}

export function codelinienPfad(line: Pick<CodeLine, 'slug'>): string {
  return `${SHOP_PFAD}/${line.slug}`;
}

/** Seite einer Unterkategorie der Codeprodukte; nimmt die Adresse der Kategorie (ein Name wird zur Adresse). */
export function kategoriePfad(adresse: string): string {
  return `${KATEGORIE_PFAD}/${slugify(adresse)}`;
}

/** Herstellerseite; nimmt die Adresse aus der Stammliste oder den Namen (er wird zur Adresse). */
export function herstellerPfad(adresse: string): string {
  return `${HERSTELLER_PFAD}/${slugify(adresse)}`;
}

/** Darf die Produktseite in Suchmaschinen und in die Sitemap? */
export function codelinieIndexierbar(line: Pick<CodeLine, 'example' | 'seo'>): boolean {
  return !line.example && !line.seo.noindex;
}

/* ---------- Verfügbarkeit (FA-22-10) ------------------------------------- */

// Gemeinsame Regel für Seite, Kasse und Backend; ohne Abhängigkeiten in src/lib/data/shop.ts.
export { VERFUEGBARKEITEN, VERFUEGBARKEIT_LABEL, istBestellbar, verfuegbarkeitVon } from '@/lib/data/shop';

/* ---------- Nach Hersteller und System (FA-11-04 bis FA-11-09) ----------- */

export interface SystemGruppe {
  /** System laut Hersteller; fehlt, wenn die Linien keins tragen. */
  name?: string;
  lines: CodeLine[];
}

export interface HerstellerGruppe {
  /** Name in der Schreibweise des Herstellers; fehlt bei Linien ohne gepflegten Hersteller. */
  name?: string;
  /** Adressteil der Herstellerseite; fehlt ohne Hersteller. */
  adresse?: string;
  /** Eintrag der Stammliste, wenn die Linien ihm zugeordnet sind. */
  stamm?: ShopHersteller;
  systeme: SystemGruppe[];
  lines: CodeLine[];
}

/**
 * Hersteller einer Linie: der zugeordnete Eintrag der Stammliste, sonst ein
 * gepflegter Freitext (Platzhalter zählen nicht). Freitext gehört nur dann
 * zum Stammeintrag, wenn er dessen Namen genau gleicht (wie `produkteDesHerstellers`).
 */
export function herstellerDerLinie(
  line: Pick<CodeLine, 'manufacturer' | 'manufacturerId'>,
  stamm: ShopHersteller[] = [],
): { name?: string; stamm?: ShopHersteller } {
  const zugeordnet = line.manufacturerId ? stamm.find((h) => h.id === line.manufacturerId) : undefined;
  if (zugeordnet) return { name: zugeordnet.name, stamm: zugeordnet };
  const text = gepflegt(line.manufacturer);
  if (!text) return {};
  const gleich = stamm.find((h) => h.name.trim() === text);
  return gleich ? { name: gleich.name, stamm: gleich } : { name: text };
}

const nachName = (a: string, b: string) => a.localeCompare(b, 'de', { numeric: true });

/**
 * Linien gruppiert nach Hersteller, darunter nach System (FA-11-04). Unter
 * einem Hersteller stehen nur die Linien, die ihm wirklich zugeordnet sind
 * (FA-11-06). Reihenfolge: Hersteller der Stammliste nach ihrer Reihenfolge,
 * dann weitere Hersteller nach Namen, zuletzt Linien ohne Hersteller. Systeme
 * nach Namen, Linien ohne System zuletzt; Linien in der Reihenfolge der Daten.
 * Hersteller ohne Linien erscheinen nicht.
 */
export function nachHerstellerUndSystem(lines: CodeLine[], stamm: ShopHersteller[] = []): HerstellerGruppe[] {
  const gruppen = new Map<string, HerstellerGruppe>();
  for (const line of lines) {
    const { name, stamm: eintrag } = herstellerDerLinie(line, stamm);
    const adresse = eintrag?.slug || (name ? slugify(name) : '');
    const gruppe = gruppen.get(adresse) ?? {
      ...(name ? { name } : {}),
      ...(adresse ? { adresse } : {}),
      ...(eintrag ? { stamm: eintrag } : {}),
      systeme: [],
      lines: [],
    };
    gruppe.lines.push(line);
    const system = gepflegt(line.system);
    const systemGruppe = gruppe.systeme.find((s) => s.name === system);
    if (systemGruppe) systemGruppe.lines.push(line);
    else gruppe.systeme.push({ ...(system ? { name: system } : {}), lines: [line] });
    gruppen.set(adresse, gruppe);
  }
  const rang = new Map(herstellerSortiert(stamm).map((h, index) => [h.id, index]));
  const sortiert = [...gruppen.values()].sort((a, b) => {
    if (!a.name || !b.name) return a.name ? -1 : b.name ? 1 : 0;
    const ra = a.stamm ? rang.get(a.stamm.id) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    const rb = b.stamm ? rang.get(b.stamm.id) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    return ra - rb || nachName(a.name, b.name);
  });
  for (const gruppe of sortiert) {
    gruppe.systeme.sort((a, b) => (!a.name || !b.name ? (a.name ? -1 : b.name ? 1 : 0) : nachName(a.name, b.name)));
  }
  return sortiert;
}

/** Hersteller mit eigener Seite: nur mit Namen und mindestens einer Linie (keine leeren Herstellerseiten). */
export function herstellerMitSeite(lines: CodeLine[], stamm: ShopHersteller[] = []): Array<HerstellerGruppe & { name: string; adresse: string }> {
  return nachHerstellerUndSystem(lines, stamm).filter(
    (gruppe): gruppe is HerstellerGruppe & { name: string; adresse: string } => Boolean(gruppe.name && gruppe.adresse),
  );
}

/* ---------- Kategorien aus den Daten (FA-10, FA-22-04) -------------------- */

export interface CodeKategorie {
  kategorie: ShopKategorie;
  /** Linien dieser Kategorie und ihrer Unterkategorien. */
  lines: CodeLine[];
}

/** Liegt die Kategorie unter einer Hauptkategorie mit Codeprodukten (Unterkategorie von „Schlüssel nach Code“)? */
function istCodeUnterkategorie(kategorien: ShopKategorie[], kategorie: ShopKategorie): boolean {
  const kette = kategorieKette(kategorien, kategorie.id);
  return kette.length > 1 && !kette[0].eltern && kette[0].art === 'codeprodukte';
}

/**
 * Sichtbare Unterkategorien der Codeprodukte mit ihren Linien (auch aus
 * tieferen Ebenen), in der Reihenfolge der Daten. Ihre Seiten liegen unter
 * `/schluessel-nach-code/kategorie/…`.
 */
export function codeKategorien(kategorien: ShopKategorie[], lines: CodeLine[]): CodeKategorie[] {
  return sichtbareKategorien(kategorien)
    .filter((kategorie) => istCodeUnterkategorie(kategorien, kategorie))
    .map((kategorie) => {
      const ids = new Set(
        kategorien.filter((k) => kategorieKette(kategorien, k.id).some((glied) => glied.id === kategorie.id)).map((k) => k.id),
      );
      return { kategorie, lines: lines.filter((line) => line.categoryId !== undefined && ids.has(line.categoryId)) };
    });
}

/** Unterkategorie der Codeprodukte zu einer Adresse; eine frühere Adresse kommt als Weiterleitung zurück. */
export function codeKategorieAufloesen(
  kategorien: ShopKategorie[],
  slug: string,
): { kategorie: ShopKategorie; weiterleitung?: undefined } | { kategorie?: undefined; weiterleitung: string } | null {
  const treffer = kategorieAufloesen(kategorien, slug);
  const kategorie = treffer?.kategorie ?? treffer?.weiterleitung;
  if (!kategorie || !istCodeUnterkategorie(kategorien, kategorie)) return null;
  return treffer?.weiterleitung ? { weiterleitung: kategoriePfad(kategorie.slug) } : { kategorie };
}

/* ---------- Bestellweg nach Verfügbarkeit (FA-22-10) ---------------------- */

/**
 * Was Liste und Seite einer Linie anbieten: `warenkorb` nur bei lieferbaren
 * Linien, `anfrage` („Code anfragen“) bei „auf Anfrage“, sonst `keiner`
 * (nicht lieferbar: kein Warenkorb, keine Bestellung).
 */
export function bestellWeg(line: { availability?: Verfuegbarkeit | null }): 'warenkorb' | 'anfrage' | 'keiner' {
  const verfuegbarkeit = verfuegbarkeitVon(line);
  return verfuegbarkeit === 'lieferbar' ? 'warenkorb' : verfuegbarkeit === 'auf-anfrage' ? 'anfrage' : 'keiner';
}

/* ---------- Adresse auflösen --------------------------------------------- */

export type CodelinienTreffer =
  | { line: CodeLine; weiterleitung?: undefined }
  | { line?: undefined; weiterleitung: string };

/**
 * Codelinie zu einem Adressteil. Passt kein Slug, aber die feste Kennung
 * einer Linie (etwa „ms-01“, nachdem der Slug in „abus-ms-01“ geändert
 * wurde), kommt die neue Adresse zurück — die Seite leitet dauerhaft weiter.
 */
export function codelinieAufloesen(lines: CodeLine[], slug: string): CodelinienTreffer | null {
  const aktiv = lines.filter((line) => line.active);
  const line = aktiv.find((l) => l.slug === slug);
  if (line) return { line };
  const umgezogen = aktiv.find((l) => l.id === slug && l.slug !== slug);
  return umgezogen ? { weiterleitung: codelinienPfad(umgezogen) } : null;
}

/* ---------- Codesuche ---------------------------------------------------- */

/**
 * Passt eine Eingabe zum Codeformat der Linie? Wie im Bestellformular wird
 * die Eingabe ohne Leerraum am Rand geprüft und Kleinbuchstaben gelten, wenn
 * die Großschreibung passt.
 */
export function codePasstZuLinie(line: Pick<CodeLine, 'codePattern'>, eingabe: string): boolean {
  const code = eingabe.trim();
  if (!code) return false;
  return codePasst(line.codePattern, code) || codePasst(line.codePattern, code.toUpperCase());
}

/**
 * Sieht die Sucheingabe wie ein Schlüsselcode aus? Ein Wort mit mindestens
 * einer Ziffer, höchstens 20 Zeichen — „Briefkasten“ ist keiner, „C214“ schon.
 */
export function siehtNachCodeAus(eingabe: string): boolean {
  const code = eingabe.trim();
  return code.length > 0 && code.length <= 20 && !/\s/.test(code) && /\d/.test(code);
}

/** Linien, zu deren Codeformat die Eingabe passt (leer, wenn sie nicht wie ein Code aussieht). */
export function linienZumCode<T extends Pick<CodeLine, 'codePattern'>>(lines: T[], eingabe: string): T[] {
  if (!siehtNachCodeAus(eingabe)) return [];
  return lines.filter((line) => codePasstZuLinie(line, eingabe));
}
