/* ==========================================================================
   SCHLÜSSELMACHER24 — Datenmodell
   Ein einziger Ort für alle fachlichen Typen. Preise, Anzahlungen,
   Vorlaufzeiten, Terminlängen, Sperrtage, Produkte und Codelinien sind
   bewusst Daten und stehen nirgends fest im Quellcode.
   ========================================================================== */

/* ---------- Gemeinsame Bausteine ---------------------------------------- */

/** Ein Bildplatz, der bewusst leer bleibt, bis ein echtes Motiv vorliegt. */
export interface ImageSlot {
  /** Was hier später zu sehen sein soll, z. B. "Werkstattfoto Schlüsselfräse". */
  motif: string;
  /** Seitenverhältnis der Fläche. */
  ratio: '16/9' | '4/3' | '1/1' | '3/2' | '21/9';
  /** Optionaler Hinweis für die Redaktion. */
  note?: string;
  /**
   * Aus Daten erzeugte Vektorgrafik, solange kein Foto hinterlegt ist.
   * Zulässige Generatoren: `src/components/visual/registry.tsx`.
   */
  visual?: VisualRef;
  /** Echtes Foto aus der Medienbibliothek — hat Vorrang vor `visual`. */
  bild?: MediaImage;
}

/** Eingabewerte eines Grafik-Generators — nur einfache, speicherbare Werte. */
export type VisualParamValue = string | number | boolean | string[] | number[];

/** Verweis auf eine aus Daten erzeugte Vektorgrafik. */
export interface VisualRef {
  /** Name des Generators, z. B. `schluessel`, `zylinder-mass`, `schliessplan`. */
  generator: string;
  params?: Record<string, VisualParamValue>;
}

/** Bild aus der Medienbibliothek (Payload `medien`). */
export interface MediaImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

/** Kurzerklärung hinter einem Info-Symbol. */
export interface InfoHint {
  title: string;
  body: string;
  /** Optionale erklärende Grafik — als Platzhalter angelegt. */
  figure?: ImageSlot;
}

export interface Money {
  /** Betrag in Cent, um Rundungsfehler zu vermeiden. */
  cents: number;
  currency: 'EUR';
}

export type ProcessKind =
  | 'direktkauf'
  | 'gefuehrte-anfrage'
  | 'projektkonfigurator'
  | 'termin-mit-anzahlung';

export type AreaKey =
  | 'autoschluessel'
  | 'schluessel-nach-vorlage'
  | 'schluessel-nach-code'
  | 'gleichschliessende-zylinder'
  | 'schliessanlagen'
  | 'elektronische-zutrittsloesungen'
  | 'tuer-und-schliesstechnik'
  | 'sicherheitstechnik'
  | 'service-und-termin';

/* ---------- Globale Einstellungen --------------------------------------- */

/**
 * Terminzeiten der Werkstatt: der Rahmen, in dem Zeitfenster für Termine liegen dürfen. Nur für die
 * Terminvergabe; auf der Seite erscheinen sie nicht als Öffnungszeiten (FA-23, A-043).
 */
export interface OpeningHour {
  /** 1 = Montag … 7 = Sonntag */
  day: number;
  /** Leer = kein Termin an diesem Tag. Mehrere Zeitfenster möglich. */
  spans: { from: string; to: string }[];
}

/**
 * Erreichbarkeit im Wortlaut des Inhabers (Arbeitsanweisung vom 11.11.2026, FA-23). Sie steht überall,
 * wo früher Öffnungszeiten standen: Die Werkstatt ist kein Ladenlokal mit festen Zeiten.
 */
export interface Erreichbarkeit {
  /** Kernaussage, z. B. „24 Stunden erreichbar“. */
  kernaussage: string;
  /** Weitere Zeilen unter der Kernaussage. */
  zeilen: string[];
  /** Telefonisch an allen Tagen rund um die Uhr erreichbar; steuert die Angabe in den Strukturdaten. */
  rundUmDieUhr: boolean;
}

export type LegalForm = 'einzelunternehmen' | 'eingetragener-kaufmann' | 'gmbh' | 'ug';

/** Zweiter Standort, z. B. Werkstatt und Abholung abseits des Firmensitzes. */
export interface CompanyLocation {
  label: string;
  street: string;
  postalCode: string;
  city: string;
}

export interface CompanyProfile {
  /** Platzhalter — vor Livegang durch echte Daten ersetzen. */
  legalName: string;
  brandName: string;
  legalForm: LegalForm;
  /** Inhaberin oder Inhaber (Einzelunternehmen, e. K.). */
  owner: string;
  /** Firmensitz. */
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  vatId: string;
  /** Nur mit Handelsregister (nicht beim Einzelunternehmen). */
  registerCourt: string;
  registerNumber: string;
  managingDirector: string;
  /** Berufsbezeichnung fürs Impressum. */
  profession: string;
  /** Zuständige Kammer mit Anschrift. */
  chamber: string;
  /** Inhaltlich verantwortlich nach § 18 MStV. */
  contentResponsible?: string;
  /** Steuernummer — nur intern, nie auf der Seite ausgeben. */
  taxNumber?: string;
  /** Werkstatt oder Abholung, falls nicht am Firmensitz. */
  location?: CompanyLocation;
  /** true, solange noch Platzhalter hinterlegt sind. */
  isPlaceholder: boolean;
}

/** Bundesland für die gesetzlichen Feiertage. */
export type FederalState =
  | 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH' | 'HE' | 'MV'
  | 'NI' | 'NW' | 'RP' | 'SL' | 'SN' | 'ST' | 'SH' | 'TH';

export interface BookingDefaults {
  /** Mindestvorlauf in Tagen bis zum frühesten buchbaren Termin. */
  leadTimeDays: number;
  /** Standard-Anzahlung in Cent. */
  depositCents: number;
  /** Zulässiger Rahmen für die Anzahlung in Cent. */
  depositMinCents: number;
  depositMaxCents: number;
  /** Standard-Terminlänge in Minuten. */
  slotMinutes: number;
  /** Wie weit im Voraus Termine angeboten werden. */
  bookingHorizonDays: number;
  /** Termine pro Zeitfenster. */
  slotsPerWindow: number;
  /** Tägliche Buchungsfenster, z. B. 09:00–17:00. */
  windows: { from: string; to: string }[];
  /** Bundesland für gesetzliche Feiertage; ohne Angabe Hessen. */
  federalState?: FederalState;
  /** Termin-Erinnerung: so viele Tage vor dem Termin. 0 = keine Erinnerung. */
  reminderDaysBefore: number;
  /**
   * Regionaler Eigenbereich (FA-KERN-03, A-049): Postleitzahlen-Muster wie `35*`. Fehlt der Wert in
   * älteren Ständen, gilt der Rückfall `35*` (src/lib/auftragsweg.ts).
   */
  ownArea?: OwnArea;
}

/** Regionaler Eigenbereich der Werkstatt (FA-KERN-03). */
export interface OwnArea {
  /** Bezeichnung, etwa „Wetzlar und Umgebung“. */
  label: string;
  /** Postleitzahlen oder Muster mit `*` am Ende, etwa `35*` oder `355*`. */
  postalPatterns: string[];
}

/**
 * Inhalt eines Richtext-Felds aus dem Backend (Lexical-JSON), unverändert
 * durchgereicht. Darstellung über den RichText-Baustein von Payload.
 */
export interface RichTextDocument {
  root: { type: string; children: unknown[]; [key: string]: unknown };
  [key: string]: unknown;
}

/** Eigene Fassungen der Rechtsseiten aus dem Backend — ersetzen den eingebauten Entwurf. */
export interface LegalTexts {
  terms?: RichTextDocument;
  withdrawal?: RichTextDocument;
  privacy?: RichTextDocument;
  shippingAndPayment?: RichTextDocument;
}

export interface Settings {
  company: CompanyProfile;
  /** Terminzeiten der Werkstatt, nur für die Terminvergabe (nie als Öffnungszeiten anzeigen). */
  openingHours: OpeningHour[];
  /** Erreichbarkeit für Kunden. Fehlt in älteren Ständen; dann gilt `ERREICHBARKEIT_STANDARD`. */
  reachability?: Erreichbarkeit;
  booking: BookingDefaults;
  /** Versandarten für den Shop. */
  shipping: ShippingOption[];
  /** Aufbewahrungsfristen für hochgeladene Unterlagen, in Tagen. */
  retentionDays: {
    vehicleRegistration: number;
    keyPhotos: number;
    floorPlans: number;
    projectDocuments: number;
  };
  /** Nur gesetzt, wenn im Backend mindestens ein Eigentext hinterlegt ist. */
  legalTexts?: LegalTexts;
  /** Einsenden von Schlüsseln (G-24, A-010). Fehlt in älteren Ständen; dann gelten die Standardwerte. */
  sendIn?: EinsendeEinstellungen;
  updatedAt: string;
}

/**
 * Einsenden von Schlüsseln (G-24, G-25, A-010, MA-08, MA-18). Ohne Retourenlabel bekommt der
 * Kunde einen Begleitschein und frankiert selbst; die Seite nennt dann das Porto der Post als
 * Empfehlung und verspricht nichts „kostenlos“ (R9).
 */
export interface EinsendeEinstellungen {
  /** Retourenlabel des Versanddienstleisters aktiv (erst mit Vertrag und Zugang; MA-08). */
  labelAktiv: boolean;
  /** Aufpreise, die der Kunde für die Einsendung zahlt (Cent, 0 = keiner). */
  aufpreisVersichertCents: number;
  aufpreisUnversichertCents: number;
  /** Portoempfehlung ohne Retourenlabel (Cent) mit Haftung und Stand der Preisliste. */
  portoVersichertCents: number;
  portoUnversichertCents: number;
  haftungVersichertEuro: number;
  portoStand: string;
  /**
   * Die Varianten des Inhabers (FA-13, A-050): DHL Paket, Einschreiben Einwurf, Einschreiben Wert.
   * Fehlt in älteren Ständen; dann gelten die Startwerte (STANDARD_VARIANTEN in lib/versand/varianten.ts).
   * Die Felder oben bleiben lesbar und gelten nur noch für ältere Vorgänge („versichert“, „unversichert“).
   */
  varianten?: EinsendeVariante[];
}

/** Kennungen der Einsende-Varianten; fest, damit Server und Begleitschein sie sicher erkennen. */
export type EinsendeVarianteKennung = 'dhl-paket' | 'einschreiben-einwurf' | 'einschreiben-wert';

/** Wo der Kunde die Sendung abgibt. */
export type Einlieferung = 'briefkasten' | 'filiale' | 'paketshop';

/** Für welche Schlüssel eine Variante empfohlen ist. */
export type EinsendeEmpfehlung = 'originalschluessel' | 'autoschluessel';

/** Eine Versandvariante für die Einsendung (A-050, Punkt 1). Porto und Haftung nur belegt (R4, R9). */
export interface EinsendeVariante {
  kennung: EinsendeVarianteKennung;
  bezeichnung: string;
  /** Wofür die Variante gedacht ist, in einem Satz. */
  einsatz: string;
  /** Haftung des Versanddienstes je Sendung (Euro); `null` = nicht belegt. */
  haftungEuro: number | null;
  sendungsverfolgung: boolean;
  einlieferung: Einlieferung[];
  /** Porto laut Post oder DHL (Cent); `null` = nicht belegt, dann „Porto laut Post, bitte dort prüfen“. */
  portoCents: number | null;
  /** Stand und Quelle des Portos. */
  portoStand: string;
  /** Aufpreis des Betriebs (Cent), 0 = keiner. */
  aufpreisCents: number;
  empfohlenFuer: EinsendeEmpfehlung[];
  /** Nur nach Freigabe durch das Team oder ausdrücklicher Wahl mit Bestätigung des Hinweises. */
  nurSonderfall: boolean;
  aktiv: boolean;
}

export interface ShippingOption {
  id: string;
  label: string;
  description: string;
  priceCents: number;
  tracked: boolean;
  insured: boolean;
  /** Auf welche Produktklassen die Versandart passt. */
  productClasses: ProductClass[];
  /** Lieferzeit, z. B. „2–4 Werktage nach Fertigung“. */
  deliveryTime?: string;
}

export type ProductClass = 'code-schluessel' | 'zylinder' | 'zubehoer';

/* ---------- Autoschlüssel: Fahrzeuge und Leistungen --------------------- */

export type KeyKind =
  | 'mechanisch'
  | 'funk'
  | 'klappschluessel'
  | 'smart-key'
  | 'keyless';

export interface VehicleMake {
  id: string;
  /** URL-Segment, z. B. "volkswagen". */
  slug: string;
  name: string;
  /** Gruppe für Preis-, Anzahlungs- und Terminlängenregeln. */
  pricingGroupId: string;
  models: VehicleModel[];
  /**
   * Redaktioneller Text für die Markenseite (Backend: `intro`). Eigener Text
   * des Betriebs geht vor automatisch erzeugten Texten.
   */
  intro?: string;
  image?: ImageSlot;
  /**
   * Eigene Suchmaschinen-Angaben der Markenseite (Projektleitfaden Kap. 17).
   * Nur gesetzt, wenn im Backend etwas eingetragen ist; nicht eingetragene
   * Texte sind leer — die Seite erzeugt dann ihre eigenen.
   */
  seo?: SeoFields;
  /** Letzte Änderung im Backend (für die Sitemap); fehlt bei Inhalten aus `content/`. */
  updatedAt?: string;
}

/** Eigene Suchmaschinen-Angaben einer Modellseite; leere Texte = automatisch. */
export interface VehicleModelSeo {
  title: string;
  description: string;
  noindex?: boolean;
}

export interface VehicleModel {
  id: string;
  slug: string;
  name: string;
  yearFrom: number;
  yearTo?: number;
  /** Bei diesem Modell technisch mögliche Schlüsselarten. */
  keyKinds: KeyKind[];
  /** Ist zur Programmierung Zugriff auf das Fahrzeug nötig? */
  requiresVehicleOnSite: boolean;
  /** Abweichende Preisgruppe, sonst gilt die der Marke. */
  pricingGroupId?: string;
  notes?: string;
  /** Eigene Einleitung der Modellseite (Backend: `einleitung`); geht vor erzeugtem Text. */
  intro?: string;
  /** Nur gesetzt, wenn im Backend etwas eingetragen ist. */
  seo?: VehicleModelSeo;
}

/** Leistung im Autoschlüssel-Bereich. */
export interface CarKeyService {
  id: string;
  slug: string;
  label: string;
  description: string;
  /** Braucht diese Leistung das Fahrzeug vor Ort? */
  requiresVehicleOnSite: boolean;
  /** Für welche Schlüsselarten die Leistung angeboten wird. */
  keyKinds: KeyKind[];
  active: boolean;
}

/**
 * Preis-, Anzahlungs- und Terminregel. Wird je Fahrzeuggruppe und Leistung
 * gepflegt — ohne Entwickler über das Backend änderbar.
 */
export interface PricingRule {
  id: string;
  pricingGroupId: string;
  serviceId: string;
  keyKind: KeyKind | 'alle';
  /** 'fest' = Gesamtpreis bekannt, 'rahmen' = Von-bis, 'pruefung' = manuell. */
  mode: 'fest' | 'rahmen' | 'pruefung';
  priceCents?: number;
  priceFromCents?: number;
  priceToCents?: number;
  /** Überschreibt die Standard-Anzahlung. */
  depositCents?: number;
  /** Überschreibt die Standard-Terminlänge. */
  slotMinutes?: number;
  /** Überschreibt den Standard-Vorlauf. */
  leadTimeDays?: number;
  note?: string;
}

export interface PricingGroup {
  id: string;
  label: string;
  description: string;
}

/** Ergebnis der Preisermittlung für einen konkreten Vorgang. */
export interface PriceQuote {
  mode: 'fest' | 'rahmen' | 'pruefung';
  priceCents?: number;
  priceFromCents?: number;
  priceToCents?: number;
  depositCents: number;
  /** Rest nach Anrechnung der Anzahlung, nur bei `mode === 'fest'`. */
  remainderCents?: number;
  slotMinutes: number;
  leadTimeDays: number;
  requiresVehicleOnSite: boolean;
  note?: string;
}

/* ---------- Produktsicherheit (GPSR) ------------------------------------- */

/** Angaben nach der EU-Produktsicherheitsverordnung. Nur gefüllte Felder sind gesetzt. */
export interface ProductSafetyInfo {
  manufacturerName?: string;
  manufacturerAddress?: string;
  manufacturerEmail?: string;
  manufacturerWebsite?: string;
  /** Typ-, Chargen- oder Artikelnummer. */
  productId?: string;
  safetyNotes?: string;
}

/* ---------- Shop: Verfügbarkeit, Kategorien, Hersteller (FA-SHOP-01) ----- */

/**
 * Verfügbarkeit eines Artikels (FA-22-10). Fehlt die Angabe, gilt `lieferbar`.
 * - `lieferbar`: in den Warenkorb und bestellbar.
 * - `auf-anfrage`: kein Warenkorb; der Weg führt in die Anfrage („Code anfragen“).
 * - `nicht-lieferbar`: kein Warenkorb, keine Bestellung; die Seite sagt es ruhig.
 */
export type Verfuegbarkeit = 'lieferbar' | 'auf-anfrage' | 'nicht-lieferbar';

/**
 * Wie eine Shop-Kategorie heute endet:
 * - `codeprodukte`: Liste der Schlüssel nach Code,
 * - `artikel`: Liste der Artikel (Schließtechnik und Zubehör),
 * - `konfigurator`: Zusammenstellung im Konfigurator,
 * - `anfrage`: noch keine Produkte; der Weg führt in eine Anfrage.
 */
export type KategorieArt = 'codeprodukte' | 'artikel' | 'konfigurator' | 'anfrage';

/**
 * Eine Shop-Kategorie (FA-10, FA-22-04, FA-22-05). Gepflegt im Backend
 * (Sammlung „Shop-Kategorien“); ohne Datenbank aus `content/kategorien.json`.
 */
export interface ShopKategorie {
  /** Feste Kennung; Produkte verweisen über sie auf die Kategorie. */
  id: string;
  /** Adresse (URL-Teil), eindeutig. */
  slug: string;
  name: string;
  beschreibung: string;
  /** Kennung der übergeordneten Kategorie; fehlt bei Hauptkategorien. */
  eltern?: string;
  /** Kleinere Zahl zuerst. */
  reihenfolge: number;
  art: KategorieArt;
  /** Ziel des Wegs heute, etwa „/schluessel-nach-code“. */
  ziel: string;
  /** Ehrlicher Zustand, solange es keine Produkte gibt (etwa „Direkt bestellen können Sie hier derzeit nicht. Bitte fragen Sie bei uns an.“). */
  hinweis?: string;
  /** Im Shop zeigen. */
  sichtbar: boolean;
  bild?: ImageSlot;
  /** Eigene Angaben für Suchmaschinen, nur wenn gepflegt. */
  seo?: SeoFields;
  /** Frühere Adressen; sie leiten auf die aktuelle weiter. */
  fruehereAdressen: string[];
}

/** Bereich, in dem ein Hersteller erscheint (FA-SHOP-04, vorher fest in `components/hersteller/bereiche.ts`). */
export type HerstellerBereichArt = 'sperrschliessung' | 'zutritt';

/** Ein Bereich des Herstellers mit seinem Einsatztext dort. */
export interface HerstellerBereichZuordnung {
  art: HerstellerBereichArt;
  einsatz: string;
}

/** Ein Hersteller der Stammliste (FA-11-05 bis FA-11-07). */
export interface ShopHersteller {
  id: string;
  slug: string;
  /** Name in der Schreibweise des Herstellers. */
  name: string;
  /** Kurzer Text: wofür die Systeme eingesetzt werden. */
  einsatz: string;
  /** Wir bieten Produkte dieses Herstellers an. */
  angeboten: boolean;
  reihenfolge: number;
  /**
   * Bereiche mit Einsatztext je Bereich (FA-SHOP-04), in der Reihenfolge aus dem Admin.
   * Fehlt oder leer: Der Hersteller erscheint auf keiner Bereichsseite.
   */
  bereiche?: HerstellerBereichZuordnung[];
  /** Logo nur mit vorliegender Freigabe (R12); ohne Freigabe fehlt es hier ganz. */
  logo?: ImageSlot;
}

/* ---------- Schlüssel nach Code (Shop) ---------------------------------- */

export interface CodeLine {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  /** Schlüsselprofil laut Hersteller (Erg. Leitfaden §1/§3), nur wenn gepflegt. */
  profile?: string;
  /** Codeserie bzw. Schließungsserie, nur wenn gepflegt. */
  codeSeries?: string;
  /** System laut Hersteller (FA-11-08), nur wenn gepflegt. */
  system?: string;
  /** Codebereich „von bis“ oder Muster, wie der Hersteller ihn nennt (FA-11-09), nur wenn gepflegt. */
  codeRange?: string;
  /** Lieferzeit als Text, nur wenn gepflegt. */
  deliveryTime?: string;
  /** Fehlt = lieferbar. */
  availability?: Verfuegbarkeit;
  /** Kennung der Shop-Kategorie, nur wenn zugeordnet. */
  categoryId?: string;
  /** Kennung des Herstellers aus der Stammliste, nur wenn ausgewählt. */
  manufacturerId?: string;
  /** Wofür die Codelinie eingesetzt wird, z. B. "Möbelschloss". */
  application: string;
  keyType: string;
  description: string;
  /** Wie der Code aufgebaut ist, für Kunden verständlich. */
  codeFormatLabel: string;
  /** Muster zur Plausibilitätsprüfung der Eingabe. */
  codePattern: string;
  codeExample: string;
  codeHint: string;
  /** Wo der Code typischerweise zu finden ist. */
  codeLocationImage: ImageSlot;
  productImage: ImageSlot;
  /** Weitere Fotos aus dem Backend (FA-11-11), nur wenn hinterlegt. */
  gallery?: MediaImage[];
  priceCents: number;
  /** Staffelpreis ab Stückzahl. */
  bulkPrices?: { minQty: number; priceCents: number }[];
  scope: string;
  maxQty: number;
  /** Foto-Upload: nicht nötig, freiwillig oder Pflicht. */
  photoUpload: 'nein' | 'optional' | 'pflicht';
  photoUploadHint?: string;
  shippingClass: ProductClass;
  active: boolean;
  /** Frei pflegbare Filterbegriffe. */
  tags: string[];
  seo: SeoFields;
  /** Beispielartikel: sichtbar, aber nicht bestellbar und nicht in Suchmaschinen. */
  example?: boolean;
  gpsr?: ProductSafetyInfo;
  /** Letzte Änderung im Backend (für die Sitemap); fehlt bei Inhalten aus `content/`. */
  updatedAt?: string;
}

/* ---------- Standardartikel (Shop) -------------------------------------- */

export interface StandardArticle {
  id: string;
  slug: string;
  name: string;
  description: string;
  manufacturer: string;
  /** Lieferumfang. */
  scope: string;
  properties: { name: string; value: string }[];
  deliveryTime: string;
  priceCents: number;
  bulkPrices?: { minQty: number; priceCents: number }[];
  maxQty: number;
  shippingClass: ProductClass;
  image: ImageSlot;
  gallery: MediaImage[];
  tags: string[];
  seo: SeoFields;
  /** Beispielartikel: sichtbar, aber nicht bestellbar und nicht in Suchmaschinen. */
  example: boolean;
  gpsr?: ProductSafetyInfo;
  /** Fehlt = lieferbar. */
  availability?: Verfuegbarkeit;
  /** Kennung der Shop-Kategorie, nur wenn zugeordnet. */
  categoryId?: string;
  /** Kennung des Herstellers aus der Stammliste, nur wenn ausgewählt. */
  manufacturerId?: string;
  /** Gehäuse oder Ersatzteil für Autoschlüssel mit Fahrzeugbezug (FA-SHOP-02), nur wenn gepflegt. */
  fahrzeugteil?: FahrzeugTeil;
}

/* ---------- Gehäuse, Ersatzteile und Umbau-Beispiele (FA-SHOP-02) ------- */

/** Art des Teils (Abschnitt 14 des Inhabers). */
export type Teileart =
  | 'gehaeuse'
  | 'tasten'
  | 'gummimatte'
  | 'batterie'
  | 'klappmechanismus'
  | 'schluesselbart'
  | 'weitere';

/**
 * Ob Elektronik und Transponder des vorhandenen Schlüssels übernommen werden:
 * `ja`, `nein` oder `pruefung` (nur nach Prüfung der Fotos oder des Schlüssels).
 */
export type ElektronikUebernahme = 'ja' | 'nein' | 'pruefung';

/** Merkmale eines Gehäuses oder Ersatzteils mit Fahrzeugbezug. */
export interface FahrzeugTeil {
  teileart: Teileart;
  /** Kennungen der Bauformen (pflegbare Liste „Bauformen“). Leer: nicht angegeben. */
  bauformen: string[];
  /** Marke wie im Fahrzeugkatalog geschrieben. Fehlt: markenübergreifend. */
  marke?: string;
  /** Kennungen der Reihen aus dem Fahrzeugkatalog. Leer: alle Reihen der Marke. */
  reihen: string[];
  baujahrVon?: number;
  baujahrBis?: number;
  /** Anzahl der Tasten; fehlt bei Teilen ohne Tasten. */
  tastenzahl?: number;
  /** Schlüsseltypen, zu denen das Teil passt. Leer: nicht angegeben. */
  schluesselarten: KeyKind[];
  /** Pflichttext: was übernommen wird und was nicht passt. */
  kompatibilitaet: string;
  elektronik: ElektronikUebernahme;
}

/** Eine Bauform aus der pflegbaren Liste (Klappschlüssel, Smart Key, Karte …). */
export interface GehaeuseBauform {
  id: string;
  slug: string;
  name: string;
  /** Kurze Erklärung, nur wenn gepflegt. */
  beschreibung?: string;
  reihenfolge: number;
}

/** Was bei einem Umbau vom alten Schlüssel übernommen wurde. */
export type UmbauTeil = 'elektronik' | 'transponder' | 'tasten' | 'schluesselbart' | 'weitere';

/** Wo ein Umbau-Beispiel erscheinen darf. */
export type UmbauEinsatz = 'customizing' | 'gehaeuse' | 'reparatur';

/** Ein Bild des Vorher-Nachher-Vergleichs mit Beschriftung. */
export interface VergleichsBild extends MediaImage {
  /** Sichtbare Beschriftung unter dem Bild. */
  beschriftung: string;
}

/**
 * Ein echter Umbau mit Vorher- und Nachher-Foto (FA-14-08, FA-20-05). Gepflegt im
 * Backend; öffentlich nur veröffentlicht, mit beiden Fotos und mit Freigabe.
 */
export interface UmbauBeispiel {
  id: string;
  titel: string;
  vorher: VergleichsBild;
  nachher: VergleichsBild;
  /** Fahrzeug: Marke wie im Fahrzeugkatalog, nur wenn gepflegt. */
  marke?: string;
  /** Kennung der Reihe aus dem Fahrzeugkatalog, nur wenn gepflegt. */
  reihe?: string;
  schluesselart?: KeyKind;
  uebernommen: UmbauTeil[];
  /** Hinweis, unter welchen Bedingungen sich der Umbau übertragen lässt. */
  hinweis: string;
  einsatz: UmbauEinsatz[];
  reihenfolge: number;
}

/* ---------- Gleichschließende Zylinder ---------------------------------- */

export type CylinderForm = 'doppelzylinder' | 'knaufzylinder' | 'halbzylinder';

export interface CylinderFormOption {
  id: CylinderForm;
  label: string;
  description: string;
  /** Welche Maße abgefragt werden. */
  measures: 'beide' | 'eines';
  measureLabels: { a: string; b?: string };
  info: InfoHint;
  figure: ImageSlot;
  /** Zulässige Maße in Millimetern. */
  minMm: number;
  maxMm: number;
  stepMm: number;
  basePriceCents: number;
  /** Aufpreis je angefangene 5 mm über dem Grundmaß. */
  lengthSurchargeCents: number;
  baseLengthMm: number;
  active: boolean;
  /** Haken „Preis nicht bestätigt“ (FA-SHOP-04): nicht bestellbar, nur als Angebot. */
  priceUnconfirmed?: boolean;
}

export interface CylinderFunctionOption {
  id: string;
  label: string;
  description: string;
  surchargeCents: number;
  info: InfoHint;
  /** Nur für diese Bauformen verfügbar. */
  forms: CylinderForm[];
  active: boolean;
  /** Haken „Preis nicht bestätigt“ (FA-SHOP-04). */
  priceUnconfirmed?: boolean;
}

export interface CylinderExtraOption {
  id: string;
  label: string;
  description: string;
  priceCents: number;
  /** 'einmal' = je Bestellung, 'stueck' = je Zylinder. */
  unit: 'einmal' | 'stueck';
  info: InfoHint;
  active: boolean;
  /** Haken „Preis nicht bestätigt“ (FA-SHOP-04). */
  priceUnconfirmed?: boolean;
}

/** Zusatzkomponente eines Zylinder-Herstellers, z. B. eine Sicherungskarte. */
export interface CylinderManufacturerComponent {
  name: string;
  priceCents: number;
  description: string;
}

/**
 * Hersteller bzw. System für den Zylinder-Konfigurator (Erg. Leitfaden §1:
 * ABUS, BKS). Der Konfigurator fragt den Hersteller nur ab, wenn mindestens
 * ein Eintrag aktiv ist.
 */
export interface CylinderManufacturer {
  /** Kennung, z. B. "abus". Mit Auswahl aus der Hersteller-Liste die Kennung des Stammeintrags. */
  id: string;
  /** Name; mit Auswahl aus der Hersteller-Liste der Name dort. */
  name: string;
  /** Kennung des Eintrags in der Hersteller-Liste (FA-SHOP-04); fehlt bei älteren Einträgen. */
  stammId?: string;
  active: boolean;
  description: string;
  /** Aufpreis je Zylinder in Cent (Backend: Euro, `aufpreisJeZylinder`). */
  surchargeCentsPerCylinder: number;
  /** Für diese Bauformen; leer = alle. */
  forms: CylinderForm[];
  components: CylinderManufacturerComponent[];
  /** Haken „Preis nicht bestätigt“ (FA-SHOP-04): gilt für Aufpreis und Zusatzkomponenten. */
  priceUnconfirmed?: boolean;
}

export interface CylinderCatalog {
  forms: CylinderFormOption[];
  functions: CylinderFunctionOption[];
  extras: CylinderExtraOption[];
  /** Preis je zusätzlichem gemeinsamen Schlüssel. */
  keyPriceCents: number;
  /** Haken „Preis nicht bestätigt“ für den Schlüsselpreis (FA-SHOP-04). */
  keyPriceUnconfirmed?: boolean;
  /** Im Grundpreis enthaltene Schlüssel. */
  includedKeys: number;
  maxKeys: number;
  maxCylinders: number;
  /** Erklärung zum richtigen Messen. */
  measuringInfo: InfoHint;
  measuringFigure: ImageSlot;
  /** Hersteller und Systeme; leer, solange keine gepflegt sind. */
  manufacturers: CylinderManufacturer[];
  /** Gilt für alle Zylinder des Katalogs. */
  gpsr?: ProductSafetyInfo;
}

export interface CylinderLineItem {
  uid: string;
  form: CylinderForm;
  measureAMm: number;
  measureBMm?: number;
  functionId?: string;
  qty: number;
}

/** Gewählte Zusatzkomponente des Herstellers, erkannt an ihrer Bezeichnung. */
export interface CylinderComponentChoice {
  name: string;
  qty: number;
}

export interface CylinderOrderDraft {
  items: CylinderLineItem[];
  keyCount: number;
  extraIds: string[];
  expandable: boolean;
  /** Kennung des Herstellers; nur gesetzt, wenn der Katalog Hersteller anbietet. */
  manufacturerId?: string;
  /** Zusatzkomponenten des gewählten Herstellers mit Stückzahl. */
  components?: CylinderComponentChoice[];
  /**
   * Gewählter Hersteller als Angabe ohne Preiswirkung (FA-SHOP-04B): Name eines Herstellers aus der
   * Stammliste mit dem Bereich „Sperrschließungen“, nur solange der Zylinderkatalog keinen Hersteller
   * anbietet. Die Kasse prüft den Namen gegen die Stammliste; der Preis rechnet ohne ihn.
   */
  herstellerAngabe?: string;
}

/* ---------- Warenkorb und Bestellungen ---------------------------------- */

export type CartItem =
  | {
      kind: 'code-schluessel';
      uid: string;
      codeLineId: string;
      code: string;
      qty: number;
      unitPriceCents: number;
      photoRefs: UploadRef[];
      note?: string;
    }
  | {
      kind: 'zylinder-schliessung';
      uid: string;
      draft: CylinderOrderDraft;
      unitPriceCents: number;
      qty: 1;
      note?: string;
    }
  | {
      /** Standardartikel aus dem Shop (`/artikel`). */
      kind: 'standard';
      uid: string;
      productId: string;
      /** Anzeige im Warenkorb; Preis und Name prüft der Server beim Bestellen neu. */
      label: string;
      shippingClass: ProductClass;
      qty: number;
      unitPriceCents: number;
      note?: string;
    };

export interface Cart {
  items: CartItem[];
  shippingOptionId?: string;
  /** Wird erst beim Absenden gesetzt; im Browser gibt es keinen sinnvollen Wert. */
  updatedAt?: string;
}

export interface UploadRef {
  id: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
  /** Kategorie, damit Aufbewahrungsfristen greifen. */
  /** Art der Unterlage; Sicherungskarte und Vollmacht sind Berechtigungsnachweise (R13, E3-OPUS-09). */
  category: 'schluesselfoto' | 'fahrzeugschein' | 'grundriss' | 'dokument' | 'objektfoto' | 'sicherungskarte' | 'vollmacht';
  /**
   * Kennung der gespeicherten Kundendatei. Leer, wenn die Datei nicht
   * hochgeladen werden konnte — dann ist sie nur als Absicht vermerkt.
   */
  storageKey?: string;
  /**
   * Einmal-Schlüssel aus dem Upload. Nur damit ordnet der Server die Datei
   * beim Absenden dem Vorgang zu; gespeichert wird er nie.
   */
  uploadToken?: string;
  /**
   * Steckplatz der Datei (FA-KERN-02, A-048): welche Aufnahme oder Unterlage sie ist. Fehlt bei
   * Dateien aus der Zeit davor. Der Server übernimmt ihn nur aus der gespeicherten Kundendatei.
   */
  steckplatz?: UploadSteckplatz;
  uploadedAt: string;
}

/**
 * Steckplätze der Kundendateien (FA-KERN-02, A-048): Fahrzeugschein, die drei Schlüsselfotos
 * (Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne), Ersatznachweis und Typenschild
 * bei Kleinstfahrzeugen, Sicherungskarte und Sonstiges.
 */
export type UploadSteckplatz =
  | 'fahrzeugschein'
  | 'schluessel-vorderseite'
  | 'schluessel-rueckseite'
  | 'schluessel-spitze'
  | 'ersatznachweis'
  | 'typenschild'
  | 'sicherungskarte'
  | 'sonstiges';

/* ---------- Vorgänge (zentrale Backend-Struktur) ------------------------- */

/** `partner`: Bewerbung über „Partner werden“ (Erg. Leitfaden §7). */
export type RecordKind = 'bestellung' | 'anfrage' | 'termin' | 'projekt' | 'partner';

/**
 * Foto-Freigabe (Erg. Leitfaden §2): eingegangen (`neu`) → `geprueft` →
 * `freigegeben` / Rückfrage (`wartet-auf-kunde`) / `nicht-moeglich` → Bestellung.
 */
export type RecordStatus =
  | 'neu'
  | 'in-pruefung'
  | 'geprueft'
  | 'freigegeben'
  | 'nicht-moeglich'
  | 'wartet-auf-kunde'
  | 'in-fertigung'
  | 'terminiert'
  | 'versendet'
  | 'abgeschlossen'
  | 'storniert';

export interface ContactDetails {
  salutation?: string;
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  street?: string;
  postalCode?: string;
  city?: string;
  country: string;
}

export interface AppointmentInfo {
  /** ISO-Datum, z. B. "2026-10-02". */
  date: string;
  /** Startzeit im Format "HH:MM". */
  time: string;
  durationMinutes: number;
  location: 'werkstatt' | 'vor-ort';
}

export interface PaymentInfo {
  /** Was bezahlt wurde: Anzahlung oder Gesamtbetrag. */
  scope: 'anzahlung' | 'gesamt';
  amountCents: number;
  /** `teilweise-erstattet` (FA-KERN-04): Ein Teil ist erstattet, der Rest bleibt bezahlt. */
  status: 'offen' | 'bezahlt' | 'fehlgeschlagen' | 'erstattet' | 'teilweise-erstattet';
  /** Kennung des Zahlungsdienstleisters (Stripe: PaymentIntent). */
  providerRef?: string;
  /** Stripe-Checkout-Sitzung. */
  checkoutSessionId?: string;
  /** Bereits erstatteter Betrag. */
  refundedCents?: number;
  paidAt?: string;
  /** Bis wann die Zahlung möglich ist (ISO-Zeitpunkt). */
  expiresAt?: string;
}

export type MailKind =
  | 'eingang-kunde'
  | 'eingang-team'
  | 'vertrag'
  | 'zahlung-erhalten'
  | 'zahlung-nicht-abgeschlossen'
  | 'erstattung'
  | 'status'
  | 'widerruf'
  | 'erinnerung'
  | 'freigabe'
  | 'team-hinweis'
  /** Bitte an den Kunden, die Ausführung eines vermittelten Auftrags zu bestätigen (FA-KERN-04). */
  | 'ausfuehrung'
  /** Nachricht des Teams aus dem Vorgang, mit Betreff und Text (FA-KERN-05). */
  | 'nachricht'
  | 'sonstige';

/** Eintrag im Mailprotokoll eines Vorgangs. */
export interface MailLogEntry {
  kind: MailKind;
  /** Empfängeradresse. */
  to: string;
  at: string;
  result: 'gesendet' | 'fehlgeschlagen' | 'nicht-eingerichtet';
  /** Kennung beim Mailanbieter. */
  providerId?: string;
  error?: string;
  /** Betreff, wie er hinausging (FA-KERN-05). */
  subject?: string;
  /** Vollständiger Text der Mail (Textfassung), damit der Verlauf am Vorgang lesbar bleibt (FA-KERN-05). */
  body?: string;
}

export type ShipmentCarrier = 'dhl' | 'dpd' | 'deutsche-post' | 'hermes' | 'gls' | 'ups' | 'sonstige';

export interface ShipmentInfo {
  carrier?: ShipmentCarrier;
  trackingNumber?: string;
}

/**
 * Sendung des Kunden zur Werkstatt (FA-SHOP-03B, A-050 Punkt 6), getrennt von der Rücksendung an den
 * Kunden (`shipment`). Backend: Gruppe `einsendeSendung`. Nur gefüllte Angaben sind gesetzt.
 */
export interface EinsendeSendung {
  /** Einlieferungs- oder Sendungsnummer, bereinigt (Großbuchstaben und Ziffern). */
  trackingNumber?: string;
  carrier?: ShipmentCarrier;
  /** Gewählte Variante; bei der Einsendung steht sie schon im Formular, bei der Freigabe kommt sie hierher. */
  variant?: EinsendeVarianteKennung;
  /** Zuletzt eingetragen am (ISO). */
  enteredAt?: string;
  /** Wer die Nummer eingetragen hat. */
  enteredBy?: 'kunde' | 'team';
}

/** Was der Kunde beim Absenden bestätigt hat. Nur gesetzte Angaben sind enthalten. */
export interface RecordConsents {
  terms?: boolean;
  withdrawalNotice?: boolean;
  /** Ausdrückliches Verlangen nach Beginn vor Ende der Widerrufsfrist. */
  earlyStart?: boolean;
  /** Kenntnis: Sonderanfertigung, kein Widerrufsrecht. */
  customMade?: boolean;
  deposit?: boolean;
  /** Berechtigung (z. B. Fahrzeughalter, Eigentümer). */
  authorization?: boolean;
  at?: string;
  /** Stand der Rechtstexte zum Zeitpunkt der Zustimmung. */
  version?: string;
}

/**
 * Ergebnis der Foto-Prüfung bei „Schlüssel nach Vorlage“ (Backend: Gruppe
 * `freigabe`). Nur gefüllte Angaben sind gesetzt.
 */
export interface ApprovalInfo {
  /** Preis der Anfertigung in Cent. */
  priceCents?: number;
  /** Muss der Kunde den Originalschlüssel einsenden? */
  sendInRequired?: boolean;
  /** Einsendung: Das Team gibt die Sonderfall-Variante (Einschreiben Wert) für diesen Vorgang frei (A-050). */
  sendInSpecialAllowed?: boolean;
  /** Hinweis an den Kunden. */
  note?: string;
  /** Zeitpunkt der Freigabe (ISO), setzt das System beim Status „freigegeben“. */
  approvedAt?: string;
}

/**
 * Stand einer Auftragsvermittlung an einen Partnerbetrieb (Erg. Leitfaden §7, FA-KERN-04): in der
 * Reihenfolge des Inhabers bis „ausgezahlt“. `provision-abgerechnet` bleibt für Modell A.
 */
export type ReferralStatus =
  | 'neu'
  | 'geprueft'
  | 'partner-angefragt'
  | 'angenommen'
  | 'termin-bestaetigt'
  | 'erledigt'
  | 'kunde-bestaetigt'
  | 'auszahlung-freigegeben'
  | 'ausgezahlt'
  | 'provision-abgerechnet';

/** Vermittlung an einen Partnerbetrieb (Backend: Gruppe `vermittlung`). */
export interface ReferralInfo {
  /** Leer = keine Vermittlung. */
  status?: ReferralStatus;
  /** Kennung (`BusinessRecord.id`) der Partner-Bewerbung, Art `partner`. */
  partnerId?: string;
  /** Kennung des Partnerbetriebs (Sammlung `partnerbetriebe`, FA-KERN-03); setzt das Team im Admin. */
  partnerBetriebId?: string;
  /** Vereinbarte Provision in Cent. */
  commissionCents?: number;
  /** Interne Notiz. */
  note?: string;
  /** Auftragsart der Vermittlung (Auftragsarten der Partnerbetriebe, FA-KERN-04). */
  orderType?: string;
  /** Gesamtbetrag des Auftrags in Cent (FA-KERN-04). */
  totalCents?: number;
  /** Plattformanteil (Provision bzw. Vermittlungsanteil) in Cent. */
  platformCents?: number;
  /** Partnerbetrag in Cent: Gesamtbetrag minus Plattformanteil. */
  partnerCents?: number;
  /** Hinweis, wenn der Plattformanteil nicht berechnet werden konnte (etwa ohne hinterlegte Provision). */
  platformHint?: string;
  /** Plattformanteil festgeschrieben am (ISO), mit dem Stand „ausgeführt“. */
  fixedAt?: string;
  /** Kunde hat die Ausführung bestätigt am (ISO). */
  customerConfirmedAt?: string;
  /** Bestätigung durch das Team statt durch den Kunden: Grund (Pflicht für die Freigabe ohne Kunde). */
  teamConfirmReason?: string;
  /** Mail mit dem Bestätigungslink gesendet am (ISO). */
  confirmSentAt?: string;
  /** SHA-256 des Einmal-Schlüssels für die Kundenbestätigung; der Schlüssel selbst wird nie gespeichert. */
  confirmTokenHash?: string;
}

/** Auszahlungsstand eines vermittelten Auftrags (FA-KERN-04). */
export type PayoutStatus = 'offen' | 'freigegeben' | 'ausgezahlt' | 'gesperrt';

/** Weg der Partnerauszahlung. */
export type PayoutMethod = 'ueberweisung' | 'zahlungsdienst';

/** Partnerauszahlung (Backend: Gruppe `auszahlung`). */
export interface PayoutInfo {
  status?: PayoutStatus;
  releasedAt?: string;
  releasedBy?: string;
  paidAt?: string;
  method?: PayoutMethod;
  /** Beleg der Überweisung oder Kennung beim Zahlungsdienst. */
  reference?: string;
  note?: string;
}

/** Erstattung an den Kunden, vom Team dokumentiert (Backend: Gruppe `erstattung`, FA-KERN-04). */
export interface RefundInfo {
  kind?: 'ganz' | 'teilweise';
  /** Summe aller erstatteten Beträge in Cent. */
  amountCents?: number;
  at?: string;
  reason?: string;
  /** Weg der Erstattung (FA-KERN-05): Zahlungsdienst, Überweisung, bar oder sonstiger. */
  method?: 'zahlungsdienst' | 'ueberweisung' | 'bar' | 'sonstige';
  /** Beleg oder Referenz, etwa Buchungstext, Quittungsnummer oder Kennung beim Zahlungsdienst. */
  receipt?: string;
}

export interface TimelineEntry {
  at: string;
  actor: 'kunde' | 'team' | 'system';
  message: string;
}

/**
 * Festgeschriebene Bestellposition. Name, Preis und Konfiguration werden beim
 * Bestellen kopiert — spätere Änderungen am Artikel ändern alte Bestellungen nicht.
 */
export interface OrderLine {
  kind: CartItem['kind'];
  /** Kennung des Artikels zum Zeitpunkt der Bestellung, z. B. "ms-01". */
  productId: string;
  label: string;
  /** Code, Maße, Funktionen — für Fertigung und Rechnung. */
  details: string;
  qty: number;
  unitPriceCents: number;
  totalCents: number;
  /** Umsatzsteuersatz in Prozent, z. B. 19. */
  vatPercent: number;
}

export interface OrderTotals {
  itemsCents: number;
  shippingCents: number;
  totalCents: number;
  vatCents: number;
  shippingLabel: string;
}

/** Ein Vorgang — Bestellung, Anfrage, Termin oder Projekt. */
export interface BusinessRecord {
  id: string;
  /** Kundenlesbare Nummer, z. B. "SM24-2026-0001". */
  reference: string;
  kind: RecordKind;
  area: AreaKey;
  process: ProcessKind;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  contact: ContactDetails;
  /** Strukturierte Antworten des jeweiligen Formulars oder Konfigurators. */
  payload: Record<string, unknown>;
  /** Für die Übersicht aufbereitete Zusammenfassung. */
  summary: SummarySection[];
  uploads: UploadRef[];
  quote?: PriceQuote;
  appointment?: AppointmentInfo;
  payment?: PaymentInfo;
  /** Nur intern sichtbar. */
  internalNotes: TimelineEntry[];
  timeline: TimelineEntry[];
  /**
   * SHA-256 des geheimen Link-Schlüssels für die Bestellbestätigung.
   * Der Schlüssel selbst wird nie gespeichert.
   */
  accessTokenHash?: string;
  /** Nur bei Bestellungen: festgeschriebene Positionen und Summen. */
  lines?: OrderLine[];
  totals?: OrderTotals;
  /**
   * Versendete E-Mails. Fehlt der Wert, bleibt das gespeicherte Protokoll
   * beim Zurückschreiben unverändert.
   */
  mailLog?: MailLogEntry[];
  shipment?: ShipmentInfo;
  /** Sendung des Kunden zur Werkstatt (Einsendung oder Freigabe mit Einsendung, FA-SHOP-03B). */
  einsendeSendung?: EinsendeSendung;
  consents?: RecordConsents;
  /** Nur bei Fotoanfragen (Bereich `schluessel-nach-vorlage`). */
  approval?: ApprovalInfo;
  /** Nur wenn der Vorgang an einen Partnerbetrieb vermittelt wird. */
  referral?: ReferralInfo;
  /**
   * Auftragsweg (FA-KERN-03, A-049): Hauptzentrale, regionaler Eigenbereich oder Partnernetzwerk. Vom
   * Server bei der Buchung gesetzt, im Admin mit Begründung änderbar. Fehlt bei älteren Vorgängen.
   */
  auftragsweg?: Auftragsweg;
  /** Gesamtpreis und Rest beim Termin (FA-KERN-03); fehlt, solange nichts feststeht. */
  remainder?: RemainderInfo;
  /** Partnerauszahlung (FA-KERN-04); nur bei vermittelten Aufträgen. */
  payout?: PayoutInfo;
  /** Vom Team dokumentierte Erstattung (FA-KERN-04). */
  refund?: RefundInfo;
}

/** Auftragsweg eines Autoschlüssel-Auftrags (FA-KERN-03). */
export type Auftragsweg = 'hauptzentrale' | 'eigenbereich' | 'partner';

/** Zahlart des Restbetrags beim Termin. */
export type RestZahlart = 'bar' | 'karte' | 'ueberweisung';

/** Gesamtpreis und Restbetrag eines Vorgangs (Backend: Gruppe `restzahlung`). */
export interface RemainderInfo {
  /** Gesamtpreis in Cent, sobald er feststeht. */
  totalCents?: number;
  /** Rest nach Anrechnung der Online-Zahlung, berechnet (src/lib/auftragsweg.ts, `restbetragCents`). */
  remainderCents?: number;
  /** Rest beim Termin bezahlt am (ISO). */
  paidAt?: string;
  /** Zahlart beim Termin. */
  method?: RestZahlart;
}

export interface SummarySection {
  title: string;
  rows: { label: string; value: string }[];
}

/* ---------- Termine ------------------------------------------------------ */

export interface BlockedDay {
  id: string;
  /** ISO-Datum. */
  date: string;
  reason: string;
  /** Leer = ganzer Tag gesperrt. */
  spans?: { from: string; to: string }[];
}

export interface TimeSlot {
  date: string;
  time: string;
  durationMinutes: number;
  available: boolean;
  /** Grund, wenn nicht verfügbar. */
  blockedReason?: string;
}

/* ---------- Inhalte, SEO, Ratgeber, Städte ------------------------------ */

export interface SeoFields {
  title: string;
  description: string;
  /** Interne Links zu thematisch passenden Seiten. */
  internalLinks: { href: string; label: string }[];
  /** Vorschaubild für soziale Netzwerke — als Platzhalter angelegt. */
  socialImage?: ImageSlot;
  noindex?: boolean;
}

/** Pflegbare Seitendaten je Route. */
export interface PageContent {
  /** Route ohne führenden Slash, z. B. "autoschluessel/nachmachen". */
  route: string;
  headline: string;
  subline: string;
  intro: string;
  /** Frei pflegbare Textabschnitte. */
  sections: { heading: string; body: string; image?: ImageSlot }[];
  faq: { question: string; answer: string }[];
  seo: SeoFields;
  updatedAt: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Thema zur Einordnung. */
  topic: AreaKey;
  body: { heading: string; text: string }[];
  image: ImageSlot;
  /** Was der Leser als Nächstes tun soll. */
  nextStep: { href: string; label: string };
  seo: SeoFields;
  updatedAt: string;
}

export interface CityPage {
  id: string;
  slug: string;
  city: string;
  state: string;
  /** Örtlicher Mehrwert — kein Massentext. */
  localIntro: string;
  localFacts: { label: string; value: string }[];
  servicesOffered: AreaKey[];
  onSiteRadiusKm: number;
  seo: SeoFields;
  updatedAt: string;
}

/* ---------- Leistungsseiten (Tür-/Schließtechnik, Sicherheitstechnik) --- */

export interface ServicePage {
  id: string;
  slug: string;
  area: AreaKey;
  title: string;
  summary: string;
  bullets: string[];
  image: ImageSlot;
  process: ProcessKind;
  ctaHref: string;
  ctaLabel: string;
  seo: SeoFields;
  active: boolean;
}

/* ---------- Rubriken (Intent-Hub, Navigation, Abläufe) ------------------- */

/** Wie ein Weg endet (KERN K-014): Kasse, Anfrage, Termin mit Anzahlung, Angebot mit Zahlungslink oder Beratung. */
/* ---------- Fahrzeugkatalog (G-14, G-17, G-18, A-009) ---------- */

export type Klonbarkeit = 'unbekannt' | 'bestaetigt' | 'nein';
export type GehaeuseStand = 'unbekannt' | 'verfuegbar' | 'nicht-verfuegbar';
export type FahrzeugLeistung = 'nachmachen' | 'programmieren' | 'gehaeuse-tausch' | 'transponder-kopie';
/** Fahrzeugklasse (A-047): Pkw und Krafträder, wie das KBA sie führt. Weitere Klassen sind ein Eintrag in FAHRZEUGKLASSEN. */
export type FahrzeugKlasse = 'pkw' | 'kraftrad';

/** Generation einer Reihe mit Bauzeitraum, nur mit Quelle (A-047, R4). */
export interface FahrzeugGeneration {
  /** Bezeichnung, etwa „Golf 7“ oder „W205“. */
  bezeichnung: string;
  baujahrVon?: number;
  baujahrBis?: number;
  quelle: string;
}

/** Eine Modellreihe des Katalogs (KBA FZ 12 oder Bestand), mit Quelle je Angabe. */
export interface FahrzeugReihe {
  id: string;
  /** Fahrzeugklasse; fehlt sie (ältere Daten), gilt „pkw“. */
  klasse?: FahrzeugKlasse;
  marke: string;
  reihe: string;
  /** Name in der KBA-Statistik, etwa „VW GOLF, JETTA“. */
  kbaName?: string;
  segment?: string;
  /** Fahrzeuge im Bestand laut KBA (Gewicht für die Suche, Abdeckung Z-07). */
  bestand?: number;
  rang?: number;
  /** Herkunft der Zeile, etwa „KBA FZ 12, Stand 1.1.2026“ oder „Bestand: content/vehicles.json“. */
  quelle: string;
  /** Verweis auf ein gepflegtes Modell des Bestands („volkswagen/golf“): nur dann Preise und Schlüsselarten. */
  bestandsModell?: string;
  /** Bauzeitraum nur mit Quelle; sonst wählt der Kunde das Baujahr (A-009). */
  baujahrVon?: number;
  baujahrBis?: number;
  baujahrQuelle?: string;
  transponder?: { typ: string; quelle: string };
  /** Klonbarkeit erscheint nur nach Bestätigung im Bogen KLONBAR (G-18). */
  klonbar: Klonbarkeit;
  gehaeuse: GehaeuseStand;
  leistungen: FahrzeugLeistung[];
  /** Weitere Suchbegriffe, etwa „Golf Variant“. */
  alias?: string[];
  /** Generationen mit Bauzeitraum, nur mit Quelle; ohne sie wählt der Kunde das Baujahr. */
  generationen?: FahrzeugGeneration[];
  sichtbar: boolean;
}

export type RubrikAbschluss = 'kasse' | 'anfrage' | 'termin-anzahlung' | 'angebot-zahlungslink' | 'beratung';

/** Sichtbarkeit: live im Hub und in der Navigation, später (vorbereitet, unsichtbar) oder aus. */
export type RubrikStatus = 'live' | 'spaeter' | 'aus';

/** Gruppe der Hauptnavigation nach G-08. */
export type RubrikNavigation = 'autoschluessel' | 'code' | 'sperrschliessung' | 'schliessanlagen' | 'mehr';

/** Berechtigungsnachweis eines Wegs (R13). */
export type RubrikNachweis = 'keiner' | 'fahrzeugschein' | 'sicherungskarte' | 'ersatznachweis';

/** Ein Schritt in „So läuft Ihr Auftrag ab“ (G-10). */
export interface RubrikSchritt {
  titel: string;
  text: string;
  /** Schlüssel eines Fach-Icons oder einer Glyphe (KERN K-008). */
  icon: string;
}

/**
 * Eine Rubrik: Einstieg im Hub, Eintrag in der Navigation, Ablauf und Abschluss
 * eines Wegs (G-01 bis G-03, G-10, G-11, G-38). Eine neue Rubrik entsteht als
 * Datensatz, ohne Umbau der Seite.
 */
export interface Rubrik {
  /** Kennung, zugleich Schlüssel in Navigation und Messung. */
  id: string;
  /** Fachlicher Name, etwa für Seitentitel. */
  name: string;
  /** Name auf der Kachel, höchstens zwei kurze Zeilen. */
  laienname: string;
  /** Laienerklärung, die immer mit dem Namen erscheint (G-09), etwa „ein Schlüssel für alle Türen“. */
  zusatz?: string;
  /** Ein Satz, was hier passiert (ab Tablet auf der Kachel, auf der Rubrikseite immer). */
  erklaerung: string;
  icon: string;
  /** Ziel des Tipps auf die Kachel. */
  ziel: string;
  ablauf: RubrikSchritt[];
  abschluss: RubrikAbschluss;
  /** Upload-Kategorien, die der Weg verlangt (serverseitig geprüft, E3-OPUS-09). */
  pflichtUploads: string[];
  nachweis: RubrikNachweis;
  status: RubrikStatus;
  /** Reihenfolge im Hub und in der Navigation (kleiner zuerst). */
  reihenfolge: number;
  navigation: RubrikNavigation;
  imHub: boolean;
  /** Bereich für Farbe und Vorgänge. */
  bereich: AreaKey;
}

/* ---------- Konfigurator-Definitionen ----------------------------------- */

/** Erklärung der Schließanlagen-Systeme, für Kunden ohne Vorwissen. */
export interface LockSystemExplainer {
  id: 'gleichschliessung' | 'z' | 'hs' | 'ghs' | 'erweiterbar';
  short: string;
  label: string;
  explanation: string;
  figure: ImageSlot;
  suitableFor: string;
}
