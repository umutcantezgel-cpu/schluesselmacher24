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
  /** Nur gesetzt, wenn im Backend mindestens ein Eigentext hinterlegt ist. */
  legalTexts?: LegalTexts;
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
  gpsr?: ProductSafetyInfo;
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
  /** Kennung, z. B. "abus". */
  id: string;
  name: string;
  active: boolean;
  description: string;
  /** Aufpreis je Zylinder in Cent (Backend: Euro, `aufpreisJeZylinder`). */
  surchargeCentsPerCylinder: number;
  /** Für diese Bauformen; leer = alle. */
  forms: CylinderForm[];
  components: CylinderManufacturerComponent[];
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
  status: 'offen' | 'bezahlt' | 'fehlgeschlagen' | 'erstattet';
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
}

export type ShipmentCarrier = 'dhl' | 'dpd' | 'deutsche-post' | 'hermes' | 'gls' | 'ups' | 'sonstige';

export interface ShipmentInfo {
  carrier?: ShipmentCarrier;
  trackingNumber?: string;
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
  /** Hinweis an den Kunden. */
  note?: string;
  /** Zeitpunkt der Freigabe (ISO), setzt das System beim Status „freigegeben“. */
  approvedAt?: string;
}

/** Stand einer Auftragsvermittlung an einen Partnerbetrieb (Erg. Leitfaden §7). */
export type ReferralStatus =
  | 'neu'
  | 'geprueft'
  | 'partner-angefragt'
  | 'angenommen'
  | 'erledigt'
  | 'provision-abgerechnet';

/** Vermittlung an einen Partnerbetrieb (Backend: Gruppe `vermittlung`). */
export interface ReferralInfo {
  /** Leer = keine Vermittlung. */
  status?: ReferralStatus;
  /** Kennung (`BusinessRecord.id`) der Partner-Bewerbung, Art `partner`. */
  partnerId?: string;
  /** Vereinbarte Provision in Cent. */
  commissionCents?: number;
  /** Interne Notiz. */
  note?: string;
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
  consents?: RecordConsents;
  /** Nur bei Fotoanfragen (Bereich `schluessel-nach-vorlage`). */
  approval?: ApprovalInfo;
  /** Nur wenn der Vorgang an einen Partnerbetrieb vermittelt wird. */
  referral?: ReferralInfo;
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
