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

export interface OpeningHour {
  /** 1 = Montag … 7 = Sonntag */
  day: number;
  /** Leer = geschlossen. Mehrere Zeitfenster möglich. */
  spans: { from: string; to: string }[];
}

export interface CompanyProfile {
  /** Platzhalter — vor Livegang durch echte Daten ersetzen. */
  legalName: string;
  brandName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  vatId: string;
  registerCourt: string;
  registerNumber: string;
  managingDirector: string;
  /** true, solange noch Platzhalter hinterlegt sind. */
  isPlaceholder: boolean;
}

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
}

export interface Settings {
  company: CompanyProfile;
  openingHours: OpeningHour[];
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
  updatedAt: string;
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
  /** Redaktioneller Text für die Markenseite. */
  intro?: string;
  image?: ImageSlot;
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

/* ---------- Schlüssel nach Code (Shop) ---------------------------------- */

export interface CodeLine {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
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
}

export interface CylinderCatalog {
  forms: CylinderFormOption[];
  functions: CylinderFunctionOption[];
  extras: CylinderExtraOption[];
  /** Preis je zusätzlichem gemeinsamen Schlüssel. */
  keyPriceCents: number;
  /** Im Grundpreis enthaltene Schlüssel. */
  includedKeys: number;
  maxKeys: number;
  maxCylinders: number;
  /** Erklärung zum richtigen Messen. */
  measuringInfo: InfoHint;
  measuringFigure: ImageSlot;
}

export interface CylinderLineItem {
  uid: string;
  form: CylinderForm;
  measureAMm: number;
  measureBMm?: number;
  functionId?: string;
  qty: number;
}

export interface CylinderOrderDraft {
  items: CylinderLineItem[];
  keyCount: number;
  extraIds: string[];
  expandable: boolean;
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
  category: 'schluesselfoto' | 'fahrzeugschein' | 'grundriss' | 'dokument' | 'objektfoto';
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
  uploadedAt: string;
}

/* ---------- Vorgänge (zentrale Backend-Struktur) ------------------------- */

export type RecordKind = 'bestellung' | 'anfrage' | 'termin' | 'projekt';

export type RecordStatus =
  | 'neu'
  | 'in-pruefung'
  | 'geprueft'
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
  status: 'offen' | 'bezahlt' | 'fehlgeschlagen' | 'erstattet';
  /** Kennung des Zahlungsdienstleisters, sobald angebunden. */
  providerRef?: string;
  paidAt?: string;
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
