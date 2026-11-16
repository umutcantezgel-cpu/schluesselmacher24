import type { ShopHersteller, ShopKategorie, Verfuegbarkeit } from '@/lib/types';

/* ==========================================================================
   Shop-Kategorien und Hersteller (FA-SHOP-01): reine Funktionen ohne
   Server-Abhängigkeiten. Seiten, Navigation und Import (FA-SHOP-01B) lesen
   die Daten über `getKategorien()` und `getHersteller()` aus `@/lib/data`
   und ordnen sie hiermit.
   ========================================================================== */

/* ---------- Verfügbarkeit (FA-22-10) ------------------------------------- */

export const VERFUEGBARKEITEN: readonly Verfuegbarkeit[] = ['lieferbar', 'auf-anfrage', 'nicht-lieferbar'];

/** Kurzer Text für Seite und Backend. */
export const VERFUEGBARKEIT_LABEL: Record<Verfuegbarkeit, string> = {
  lieferbar: 'Lieferbar',
  'auf-anfrage': 'Auf Anfrage',
  'nicht-lieferbar': 'Derzeit nicht lieferbar',
};

/** Verfügbarkeit eines Artikels; ohne Angabe (ältere Daten) lieferbar. */
export function verfuegbarkeitVon(artikel: { availability?: Verfuegbarkeit | null }): Verfuegbarkeit {
  const wert = artikel.availability;
  return wert && VERFUEGBARKEITEN.includes(wert) ? wert : 'lieferbar';
}

/** Darf in den Warenkorb und bestellt werden: kein Beispiel und lieferbar. Gilt im Browser wie auf dem Server. */
export function istBestellbar(artikel: { availability?: Verfuegbarkeit | null; example?: boolean }): boolean {
  return !artikel.example && verfuegbarkeitVon(artikel) === 'lieferbar';
}

/* ---------- Kategorien ---------------------------------------------------- */

const nachReihenfolge = <T extends { reihenfolge: number; name: string }>(a: T, b: T) =>
  a.reihenfolge - b.reihenfolge || a.name.localeCompare(b.name, 'de');

/** Alle Kategorien nach Reihenfolge, bei gleicher Zahl nach Name. */
export function kategorienSortiert(kategorien: ShopKategorie[]): ShopKategorie[] {
  return [...kategorien].sort(nachReihenfolge);
}

/**
 * Kette von der Hauptkategorie bis zu dieser (einschließlich). Bricht bei einem
 * Kreis oder einer fehlenden übergeordneten Kategorie ab, statt zu hängen.
 */
export function kategorieKette(kategorien: ShopKategorie[], id: string): ShopKategorie[] {
  const nachId = new Map(kategorien.map((k) => [k.id, k]));
  const kette: ShopKategorie[] = [];
  const gesehen = new Set<string>();
  let aktuell = nachId.get(id);
  while (aktuell && !gesehen.has(aktuell.id)) {
    gesehen.add(aktuell.id);
    kette.unshift(aktuell);
    aktuell = aktuell.eltern ? nachId.get(aktuell.eltern) : undefined;
  }
  return kette;
}

/**
 * Im Shop sichtbar: der Haken „im Shop zeigen“ ist gesetzt, und zwar auch bei
 * allen übergeordneten Kategorien. Eine Unterkategorie unter einer verborgenen
 * Kategorie bleibt verborgen.
 */
export function kategorieSichtbar(kategorien: ShopKategorie[], kategorie: ShopKategorie): boolean {
  const kette = kategorieKette(kategorien, kategorie.id);
  // Fehlt ein Glied (Elternkategorie gelöscht oder Kreis), gilt die Kette als unvollständig.
  const vollstaendig = !kette[0]?.eltern;
  return vollstaendig && kette.every((k) => k.sichtbar);
}

/** Sichtbare Kategorien nach Reihenfolge. */
export function sichtbareKategorien(kategorien: ShopKategorie[]): ShopKategorie[] {
  return kategorienSortiert(kategorien).filter((k) => kategorieSichtbar(kategorien, k));
}

/** Hauptkategorien (ohne übergeordnete), nach Reihenfolge. */
export function hauptkategorien(kategorien: ShopKategorie[]): ShopKategorie[] {
  return kategorienSortiert(kategorien).filter((k) => !k.eltern);
}

/** Direkte Unterkategorien einer Kategorie, nach Reihenfolge. */
export function unterkategorien(kategorien: ShopKategorie[], elternId: string): ShopKategorie[] {
  return kategorienSortiert(kategorien).filter((k) => k.eltern === elternId);
}

export type KategorieTreffer =
  | { kategorie: ShopKategorie; weiterleitung?: undefined }
  | { kategorie?: undefined; weiterleitung: ShopKategorie };

/**
 * Kategorie zu einer Adresse. Passt keine aktuelle Adresse, aber eine frühere
 * (der Betreiber hat die Adresse umbenannt), kommt die Kategorie als
 * Weiterleitung zurück: Die Seite leitet dauerhaft auf ihre neue Adresse um.
 * Nur sichtbare Kategorien.
 */
export function kategorieAufloesen(kategorien: ShopKategorie[], slug: string): KategorieTreffer | null {
  const sichtbar = sichtbareKategorien(kategorien);
  const kategorie = sichtbar.find((k) => k.slug === slug);
  if (kategorie) return { kategorie };
  const umgezogen = sichtbar.find((k) => k.slug !== slug && k.fruehereAdressen.includes(slug));
  return umgezogen ? { weiterleitung: umgezogen } : null;
}

/**
 * Liste der früheren Adressen nach einer Änderung der Adresse: die alte kommt
 * dazu, die neue fällt heraus (wer zu einer früheren Adresse zurückkehrt,
 * braucht dafür keine Weiterleitung), Doppelte entfallen.
 */
export function fruehereAdressenNachAenderung(alt: string | null | undefined, neu: string | null | undefined, liste: string[]): string[] {
  const ergebnis = liste.filter((adresse) => adresse && adresse !== neu);
  if (alt && neu && alt !== neu && !ergebnis.includes(alt)) ergebnis.push(alt);
  return [...new Set(ergebnis)];
}

/** Hersteller der Stammliste nach Reihenfolge, bei gleicher Zahl nach Name. */
export function herstellerSortiert(hersteller: ShopHersteller[]): ShopHersteller[] {
  return [...hersteller].sort(nachReihenfolge);
}

/** Hersteller, die wir anbieten (Haken „angeboten“), nach Reihenfolge. */
export function angeboteneHersteller(hersteller: ShopHersteller[]): ShopHersteller[] {
  return herstellerSortiert(hersteller).filter((h) => h.angeboten);
}

/**
 * Nur Produkte, die genau diesem Hersteller zugeordnet sind (FA-11-06: unter
 * BKS nur BKS-Produkte). Zuordnung über die Kennung aus der Stammliste;
 * Produkte mit altem Freitext zählen nur, wenn der Text dem Namen genau gleicht.
 */
export function produkteDesHerstellers<T extends { manufacturerId?: string; manufacturer: string }>(
  produkte: T[],
  hersteller: Pick<ShopHersteller, 'id' | 'name'>,
): T[] {
  return produkte.filter((p) =>
    p.manufacturerId ? p.manufacturerId === hersteller.id : p.manufacturer.trim() === hersteller.name.trim(),
  );
}

/* ---------- Artikel je Kategorie (FA-10-10, FA-10-11) --------------------- */

/** Adresse der Liste der ersten Artikel-Kategorie („Schließtechnik und Zubehör“). */
export const ARTIKEL_PFAD = '/artikel';
/** Adressen der Listen aller weiteren Artikel-Kategorien und der Unterkategorien. */
export const ARTIKEL_KATEGORIE_PFAD = '/artikel/kategorie';

/** Erste sichtbare Hauptkategorie mit der Art „artikel“; ihre Liste ist `/artikel`. */
export function ersteArtikelKategorie(kategorien: ShopKategorie[]): ShopKategorie | undefined {
  return sichtbareKategorien(kategorien).find((k) => !k.eltern && k.art === 'artikel');
}

/**
 * Artikel einer Kategorie: ihre eigenen und die ihrer Unterkategorien (über alle Ebenen). Artikel ohne
 * Kategorie gehören nur zur ersten Artikel-Kategorie (`ohneKategorie`). Fahrzeugteile stehen nie hier;
 * sie haben ihre eigene Liste der Gehäuse und Ersatzteile. Dieselbe Regel zählt im Shop und zeigt die Liste.
 */
export function artikelDerKategorie<T extends { categoryId?: string; fahrzeugteil?: unknown }>(
  kategorien: ShopKategorie[],
  artikel: T[],
  kategorieId: string,
  ohneKategorie: boolean,
): T[] {
  return artikel.filter((a) => {
    if (a.fahrzeugteil) return false;
    if (!a.categoryId) return ohneKategorie;
    // Verweis auf eine gelöschte Kategorie (im JSON-Fallback bleibt er stehen): wie ohne Kategorie.
    const kette = kategorieKette(kategorien, a.categoryId);
    if (kette.length === 0) return ohneKategorie;
    return kette.some((glied) => glied.id === kategorieId);
  });
}

/**
 * Übersicht für die Seite eines Artikels: die Liste, in der er steht. Fahrzeugteile führen in ihre eigene
 * Liste (`teilePfad`), Artikel einer Artikel-Kategorie in die Liste dieser Kategorie, Artikel ohne Kategorie
 * auf `/artikel`. Steht der Artikel in keiner Artikelliste, führt der Weg in den Shop.
 */
export function artikelUebersicht(
  kategorien: ShopKategorie[],
  artikel: { categoryId?: string; fahrzeugteil?: unknown },
  teilePfad: string,
): { href: string; label: string } {
  if (artikel.fahrzeugteil) return { href: teilePfad, label: 'Alle Gehäuse und Ersatzteile' };
  const ersteId = ersteArtikelKategorie(kategorien)?.id;
  const kette = artikelKategorieKette(kategorien, artikel.categoryId);
  const letzte = kette[kette.length - 1];
  if (letzte) return { href: artikelListePfad(letzte, ersteId), label: `Mehr aus ${letzte.name}` };
  if (artikelDerKategorie(kategorien, [artikel], ersteId ?? '', true).length > 0) {
    return { href: ARTIKEL_PFAD, label: 'Zur Artikelliste' };
  }
  return { href: '/shop', label: 'Alle Shop-Kategorien' };
}

/**
 * Sichtbare Kategorien mit eigener Artikelliste unter `/artikel/kategorie/…`: jede weitere Hauptkategorie
 * mit der Art „artikel“ und jede Unterkategorie einer Artikel-Hauptkategorie. Die erste Artikel-Kategorie
 * hat ihre Liste unter `/artikel` und gehört nicht dazu.
 */
export function artikelListenKategorien(kategorien: ShopKategorie[]): ShopKategorie[] {
  const erste = ersteArtikelKategorie(kategorien);
  return sichtbareKategorien(kategorien).filter((k) => {
    if (k.id === erste?.id) return false;
    return kategorieKette(kategorien, k.id)[0]?.art === 'artikel';
  });
}

/** Adresse der Artikelliste einer Kategorie: `/artikel` für die erste Artikel-Kategorie, sonst ihre eigene. */
export function artikelListePfad(kategorie: Pick<ShopKategorie, 'id' | 'slug'>, ersteId: string | undefined): string {
  return kategorie.id === ersteId ? ARTIKEL_PFAD : `${ARTIKEL_KATEGORIE_PFAD}/${kategorie.slug}`;
}

/** Sichtbare direkte Unterkategorien mit mindestens einem Artikel, mit Adresse ihrer Liste und Zahl der Artikel. */
export function artikelUnterkategorien<T extends { categoryId?: string; fahrzeugteil?: unknown }>(
  kategorien: ShopKategorie[],
  elternId: string,
  artikel: T[],
): Array<{ kategorie: ShopKategorie; href: string; anzahl: number }> {
  return unterkategorien(kategorien, elternId)
    .filter((k) => kategorieSichtbar(kategorien, k))
    .map((kategorie) => ({
      kategorie,
      href: artikelListePfad(kategorie, undefined),
      anzahl: artikelDerKategorie(kategorien, artikel, kategorie.id, false).length,
    }))
    .filter((eintrag) => eintrag.anzahl > 0);
}

/**
 * Kette der sichtbaren Artikel-Kategorien eines Artikels für die Brotkrumen, von der Hauptkategorie bis zur
 * Kategorie des Artikels. Leer, wenn der Artikel keine Kategorie hat oder sie verborgen ist oder nicht zu
 * einer Artikel-Hauptkategorie gehört.
 */
export function artikelKategorieKette(kategorien: ShopKategorie[], categoryId: string | undefined): ShopKategorie[] {
  if (!categoryId) return [];
  const kette = kategorieKette(kategorien, categoryId);
  const ziel = kette[kette.length - 1];
  if (!ziel || kette[0]?.eltern || kette[0]?.art !== 'artikel' || !kategorieSichtbar(kategorien, ziel)) return [];
  return kette;
}

/** Nur Produkte dieser Kategorie (ohne Unterkategorien). */
export function produkteDerKategorie<T extends { categoryId?: string }>(produkte: T[], kategorieId: string): T[] {
  return produkte.filter((p) => p.categoryId === kategorieId);
}
