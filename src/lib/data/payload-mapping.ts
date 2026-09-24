/**
 * Übersetzung zwischen den Payload-Dokumenten (deutsche Feldnamen, Beträge in
 * Euro) und den Typen der Seite (`src/lib/types.ts`, Beträge in Cent).
 *
 * `…ZuSeite` liest Dokumente für die Seite, `…ZuPayload` erzeugt Daten für den
 * Seed. Beide Richtungen zusammen sind verlustfrei — das prüft
 * `payload-mapping.test.ts` mit allen bisherigen Inhalten.
 */
import type { RequiredDataFromCollectionSlug } from 'payload';

import type {
  AutoschluesselLeistungen,
  Einsatzgebiete,
  Einstellungen,
  Fahrzeugmarken,
  Leistungsseiten,
  Medien,
  Preisgruppen,
  Preisregeln,
  Produkte,
  Ratgeber,
  Seiten,
  Sperrtage,
  Vorgaenge,
  Zylinderkatalog,
} from '@/payload-types';
import { rabattAusPreis, staffelPreis } from '../staffel';
import type {
  AreaKey,
  BlockedDay,
  BusinessRecord,
  CarKeyService,
  CityPage,
  CodeLine,
  CylinderCatalog,
  Guide,
  ImageSlot,
  InfoHint,
  KeyKind,
  MediaImage,
  PageContent,
  PricingGroup,
  PricingRule,
  SeoFields,
  ServicePage,
  Settings,
  VehicleMake,
} from '@/lib/types';

/* ---------- Grundbausteine ----------------------------------------------- */

export const zuCent = (euro: number | null | undefined): number => Math.round(Number(euro ?? 0) * 100);
export const zuEuro = (cent: number | null | undefined): number => Math.round(Number(cent ?? 0)) / 100;
const optCent = (euro: number | null | undefined) =>
  euro === null || euro === undefined ? undefined : zuCent(euro);
const optEuro = (cent: number | null | undefined) =>
  cent === null || cent === undefined ? undefined : zuEuro(cent);
const opt = <T>(value: T | null | undefined): T | undefined => (value === null ? undefined : value);
const optText = (value: string | null | undefined): string | undefined => (value ? value : undefined);

type BildGruppe = {
  motiv?: string | null;
  format?: ImageSlot['ratio'] | null;
  bild?: number | Medien | null;
  hinweis?: string | null;
} | null | undefined;

/** Payload liefert Bildverweise je nach Tiefe als Zahl oder als Dokument. */
function medienBild(bild: number | Medien | null | undefined, motiv: string): MediaImage | undefined {
  if (!bild || typeof bild === 'number') return undefined;
  const url = bild.sizes?.mittel?.url ?? bild.url;
  if (!url) return undefined;
  return {
    // Payload hängt teils einen Zeitstempel an — Next.js lehnt Suchparameter
    // bei lokalen Bildern ohne Freigabe ab.
    url: url.split('?')[0],
    alt: bild.alt || motiv,
    width: bild.sizes?.mittel?.width ?? bild.width ?? undefined,
    height: bild.sizes?.mittel?.height ?? bild.height ?? undefined,
  };
}

export function bildZuSeite(gruppe: BildGruppe, fallbackMotiv: string, fallbackFormat: ImageSlot['ratio'] = '16/9'): ImageSlot {
  const motif = gruppe?.motiv || fallbackMotiv;
  const slot: ImageSlot = { motif, ratio: gruppe?.format || fallbackFormat };
  if (gruppe?.hinweis) slot.note = gruppe.hinweis;
  const bild = medienBild(gruppe?.bild, motif);
  if (bild) slot.bild = bild;
  return slot;
}

export function bildZuPayload(slot: ImageSlot | undefined) {
  if (!slot) return undefined;
  return { motiv: slot.motif, format: slot.ratio, hinweis: slot.note ?? null };
}

type SeoGruppe = {
  titel?: string | null;
  beschreibung?: string | null;
  interneLinks?: { href: string; label: string }[] | null;
  noindex?: boolean | null;
  socialBild?: BildGruppe;
} | null | undefined;

export function seoZuSeite(seo: SeoGruppe, fallbackTitel: string): SeoFields {
  const result: SeoFields = {
    title: seo?.titel || fallbackTitel,
    description: seo?.beschreibung ?? '',
    internalLinks: (seo?.interneLinks ?? []).map(({ href, label }) => ({ href, label })),
  };
  if (seo?.socialBild?.motiv || (seo?.socialBild?.bild && typeof seo.socialBild.bild !== 'number')) {
    result.socialImage = bildZuSeite(seo.socialBild, fallbackTitel);
  }
  if (seo?.noindex) result.noindex = true;
  return result;
}

export function seoZuPayload(seo: SeoFields) {
  return {
    titel: seo.title,
    beschreibung: seo.description,
    interneLinks: seo.internalLinks.map(({ href, label }) => ({ href, label })),
    noindex: seo.noindex ?? false,
    socialBild: bildZuPayload(seo.socialImage),
  };
}

type InfoGruppe = { titel: string; text: string; grafik?: BildGruppe } | null | undefined;

function infoZuSeite(info: InfoGruppe): InfoHint {
  const hint: InfoHint = { title: info?.titel ?? '', body: info?.text ?? '' };
  if (info?.grafik?.motiv || (info?.grafik?.bild && typeof info.grafik.bild !== 'number')) {
    hint.figure = bildZuSeite(info.grafik, info.titel, '4/3');
  }
  return hint;
}

function infoZuPayload(info: InfoHint) {
  return { titel: info.title, text: info.body, grafik: bildZuPayload(info.figure) };
}

const kennung = (doc: { kennung?: string | null; slug?: string | null; id: number | string }) =>
  doc.kennung || doc.slug || String(doc.id);

/** Kennung eines Verweises, egal ob als Zahl oder als Dokument geliefert. */
function verweisKennung(
  wert: number | { kennung?: string | null; slug?: string | null; id: number } | null | undefined,
  kennungen?: Map<number, string>,
): string {
  if (!wert) return '';
  if (typeof wert === 'number') return kennungen?.get(wert) ?? String(wert);
  return kennung(wert);
}

/* ---------- Artikel (Schlüssel nach Code) -------------------------------- */

export function codeLineZuSeite(doc: Produkte): CodeLine {
  const priceCents = zuCent(doc.preis);
  const bulkPrices = [...(doc.staffeln ?? [])]
    .sort((a, b) => a.abMenge - b.abMenge)
    .map((s) => ({ minQty: s.abMenge, priceCents: staffelPreis(priceCents, s.rabattProzent) }));
  const line: CodeLine = {
    id: kennung(doc),
    slug: doc.slug,
    name: doc.name,
    manufacturer: doc.hersteller ?? '',
    application: doc.einsatz ?? '',
    keyType: doc.schluesseltyp ?? '',
    description: doc.beschreibung,
    codeFormatLabel: doc.codeFormat ?? '',
    codePattern: doc.codeMuster ?? '^$',
    codeExample: doc.codeBeispiel ?? '',
    codeHint: doc.codeHinweis ?? '',
    codeLocationImage: bildZuSeite(doc.codeFundstelle, `Fundstelle des Codes: ${doc.name}`, '4/3'),
    productImage: bildZuSeite(doc.produktbild, doc.name, '1/1'),
    priceCents,
    scope: doc.umfang ?? '',
    maxQty: doc.maxMenge,
    photoUpload: doc.fotoUpload ?? 'optional',
    shippingClass: doc.versandklasse,
    active: doc._status === 'published' && !doc.deletedAt,
    tags: doc.schlagworte ?? [],
    seo: seoZuSeite(doc.seo, doc.name),
  };
  if (bulkPrices.length) line.bulkPrices = bulkPrices;
  if (doc.fotoHinweis) line.photoUploadHint = doc.fotoHinweis;
  if (doc.beispiel) line.example = true;
  return line;
}

export function codeLineZuPayload(line: CodeLine): RequiredDataFromCollectionSlug<'produkte'> {
  return {
    typ: 'code_key',
    kennung: line.id,
    slug: line.slug,
    beispiel: line.example ?? false,
    name: line.name,
    beschreibung: line.description,
    hersteller: line.manufacturer,
    einsatz: line.application,
    schluesseltyp: line.keyType,
    umfang: line.scope,
    schlagworte: line.tags,
    preis: zuEuro(line.priceCents),
    staffeln: (line.bulkPrices ?? []).map((tier) => ({
      abMenge: tier.minQty,
      rabattProzent: rabattAusPreis(line.priceCents, tier.priceCents),
    })),
    maxMenge: line.maxQty,
    versandklasse: line.shippingClass,
    codeFormat: line.codeFormatLabel,
    codeMuster: line.codePattern,
    codeBeispiel: line.codeExample,
    codeHinweis: line.codeHint,
    codeFundstelle: bildZuPayload(line.codeLocationImage),
    fotoUpload: line.photoUpload,
    fotoHinweis: line.photoUploadHint ?? null,
    produktbild: bildZuPayload(line.productImage),
    seo: seoZuPayload(line.seo),
    _status: line.active ? 'published' : 'draft',
  };
}

/* ---------- Autoschlüssel ------------------------------------------------ */

export function preisgruppeZuSeite(doc: Preisgruppen): PricingGroup {
  return { id: kennung(doc), label: doc.label, description: doc.beschreibung ?? '' };
}

export function preisgruppeZuPayload(group: PricingGroup): RequiredDataFromCollectionSlug<'preisgruppen'> {
  return { kennung: group.id, slug: group.id, label: group.label, beschreibung: group.description };
}

export function leistungZuSeite(doc: AutoschluesselLeistungen): CarKeyService {
  return {
    id: kennung(doc),
    slug: doc.slug,
    label: doc.label,
    description: doc.beschreibung,
    requiresVehicleOnSite: Boolean(doc.fahrzeugVorOrt),
    keyKinds: (doc.schluesselarten ?? []) as KeyKind[],
    active: doc.aktiv !== false && !doc.deletedAt,
  };
}

export function leistungZuPayload(service: CarKeyService): RequiredDataFromCollectionSlug<'autoschluessel-leistungen'> {
  return {
    kennung: service.id,
    slug: service.slug,
    label: service.label,
    beschreibung: service.description,
    fahrzeugVorOrt: service.requiresVehicleOnSite,
    schluesselarten: service.keyKinds,
    aktiv: service.active,
  };
}

export function preisregelZuSeite(
  doc: Preisregeln,
  gruppen?: Map<number, string>,
  leistungen?: Map<number, string>,
): PricingRule {
  const rule: PricingRule = {
    id: doc.kennung ?? String(doc.id),
    pricingGroupId: verweisKennung(doc.preisgruppe, gruppen),
    serviceId: verweisKennung(doc.leistung, leistungen),
    keyKind: doc.schluesselart,
    mode: doc.modus,
  };
  const felder: Partial<PricingRule> = {
    priceCents: optCent(doc.preis),
    priceFromCents: optCent(doc.preisVon),
    priceToCents: optCent(doc.preisBis),
    depositCents: optCent(doc.anzahlung),
    slotMinutes: opt(doc.terminMinuten),
    leadTimeDays: opt(doc.vorlaufTage),
    note: optText(doc.hinweis),
  };
  for (const [key, value] of Object.entries(felder)) {
    if (value !== undefined) (rule as unknown as Record<string, unknown>)[key] = value;
  }
  return rule;
}

export function preisregelZuPayload(
  rule: PricingRule,
  gruppenIds: Map<string, number>,
  leistungIds: Map<string, number>,
): RequiredDataFromCollectionSlug<'preisregeln'> {
  const preisgruppe = gruppenIds.get(rule.pricingGroupId);
  const leistung = leistungIds.get(rule.serviceId);
  if (!preisgruppe || !leistung) {
    throw new Error(`Preisregel ${rule.id}: Preisgruppe oder Leistung fehlt.`);
  }
  return {
    kennung: rule.id,
    preisgruppe,
    leistung,
    schluesselart: rule.keyKind,
    modus: rule.mode,
    preis: optEuro(rule.priceCents),
    preisVon: optEuro(rule.priceFromCents),
    preisBis: optEuro(rule.priceToCents),
    anzahlung: optEuro(rule.depositCents),
    terminMinuten: rule.slotMinutes,
    vorlaufTage: rule.leadTimeDays,
    hinweis: rule.note,
  };
}

export function fahrzeugmarkeZuSeite(doc: Fahrzeugmarken, gruppen?: Map<number, string>): VehicleMake {
  const make: VehicleMake = {
    id: kennung(doc),
    slug: doc.slug,
    name: doc.name,
    pricingGroupId: verweisKennung(doc.preisgruppe, gruppen),
    models: (doc.modelle ?? []).map((m) => {
      const model: VehicleMake['models'][number] = {
        id: m.kennung || m.slug,
        slug: m.slug,
        name: m.name,
        yearFrom: m.baujahrVon,
        keyKinds: (m.schluesselarten ?? []) as KeyKind[],
        requiresVehicleOnSite: Boolean(m.fahrzeugVorOrt),
      };
      if (m.baujahrBis) model.yearTo = m.baujahrBis;
      const gruppe = verweisKennung(m.preisgruppe, gruppen);
      if (gruppe) model.pricingGroupId = gruppe;
      if (m.hinweise) model.notes = m.hinweise;
      return model;
    }),
  };
  if (doc.intro) make.intro = doc.intro;
  if (doc.bild?.motiv || (doc.bild?.bild && typeof doc.bild.bild !== 'number')) {
    make.image = bildZuSeite(doc.bild, doc.name);
  }
  return make;
}

export function fahrzeugmarkeZuPayload(
  make: VehicleMake,
  gruppenIds: Map<string, number>,
): RequiredDataFromCollectionSlug<'fahrzeugmarken'> {
  const preisgruppe = gruppenIds.get(make.pricingGroupId);
  if (!preisgruppe) throw new Error(`Marke ${make.id}: Preisgruppe ${make.pricingGroupId} fehlt.`);
  return {
    kennung: make.id,
    slug: make.slug,
    name: make.name,
    preisgruppe,
    intro: make.intro,
    bild: bildZuPayload(make.image),
    modelle: make.models.map((m) => ({
      kennung: m.id === m.slug ? null : m.id,
      slug: m.slug,
      name: m.name,
      baujahrVon: m.yearFrom,
      baujahrBis: m.yearTo ?? null,
      schluesselarten: m.keyKinds,
      fahrzeugVorOrt: m.requiresVehicleOnSite,
      preisgruppe: m.pricingGroupId ? (gruppenIds.get(m.pricingGroupId) ?? null) : null,
      hinweise: m.notes ?? null,
    })),
    _status: 'published',
  };
}

/* ---------- Inhalte ------------------------------------------------------ */

export function leistungsseiteZuSeite(doc: Leistungsseiten): ServicePage {
  return {
    id: kennung(doc),
    slug: doc.slug,
    area: doc.bereich as AreaKey,
    title: doc.titel,
    summary: doc.zusammenfassung,
    bullets: (doc.stichpunkte ?? []).map((s) => s.text),
    image: bildZuSeite(doc.bild, doc.titel),
    process: doc.prozess,
    ctaHref: doc.ctaHref,
    ctaLabel: doc.ctaLabel,
    seo: seoZuSeite(doc.seo, doc.titel),
    active: doc._status === 'published' && !doc.deletedAt,
  };
}

export function leistungsseiteZuPayload(page: ServicePage): RequiredDataFromCollectionSlug<'leistungsseiten'> {
  return {
    kennung: page.id,
    slug: page.slug,
    bereich: page.area,
    titel: page.title,
    zusammenfassung: page.summary,
    stichpunkte: page.bullets.map((text) => ({ text })),
    bild: bildZuPayload(page.image),
    prozess: page.process,
    ctaHref: page.ctaHref,
    ctaLabel: page.ctaLabel,
    seo: seoZuPayload(page.seo),
    _status: page.active ? 'published' : 'draft',
  };
}

export function seiteZuSeite(doc: Seiten): PageContent {
  return {
    route: doc.route ?? '',
    headline: doc.headline,
    subline: doc.subline ?? '',
    intro: doc.intro ?? '',
    sections: (doc.abschnitte ?? []).map((a) => {
      const section: PageContent['sections'][number] = { heading: a.ueberschrift, body: a.text };
      if (a.bild?.motiv || (a.bild?.bild && typeof a.bild.bild !== 'number')) {
        section.image = bildZuSeite(a.bild, a.ueberschrift);
      }
      return section;
    }),
    faq: (doc.faq ?? []).map((f) => ({ question: f.frage, answer: f.antwort })),
    seo: seoZuSeite(doc.seo, doc.headline),
    updatedAt: doc.updatedAt,
  };
}

export function seiteZuPayload(page: PageContent): RequiredDataFromCollectionSlug<'seiten'> {
  return {
    route: page.route,
    headline: page.headline,
    subline: page.subline,
    intro: page.intro,
    abschnitte: page.sections.map((s) => ({ ueberschrift: s.heading, text: s.body, bild: bildZuPayload(s.image) })),
    faq: page.faq.map((f) => ({ frage: f.question, antwort: f.answer })),
    seo: seoZuPayload(page.seo),
    _status: 'published',
  };
}

export function ratgeberZuSeite(doc: Ratgeber): Guide {
  return {
    id: kennung(doc),
    slug: doc.slug,
    title: doc.titel,
    excerpt: doc.auszug,
    topic: doc.thema as AreaKey,
    body: (doc.abschnitte ?? []).map((a) => ({ heading: a.ueberschrift, text: a.text })),
    image: bildZuSeite(doc.bild, doc.titel),
    nextStep: { href: doc.naechsterSchritt?.href ?? '/', label: doc.naechsterSchritt?.label ?? 'Zur Startseite' },
    seo: seoZuSeite(doc.seo, doc.titel),
    updatedAt: doc.updatedAt,
  };
}

export function ratgeberZuPayload(guide: Guide): RequiredDataFromCollectionSlug<'ratgeber'> {
  return {
    kennung: guide.id,
    slug: guide.slug,
    titel: guide.title,
    auszug: guide.excerpt,
    thema: guide.topic,
    abschnitte: guide.body.map((b) => ({ ueberschrift: b.heading, text: b.text })),
    bild: bildZuPayload(guide.image),
    naechsterSchritt: { href: guide.nextStep.href, label: guide.nextStep.label },
    seo: seoZuPayload(guide.seo),
    _status: 'published',
  };
}

export function einsatzgebietZuSeite(doc: Einsatzgebiete): CityPage {
  return {
    id: kennung(doc),
    slug: doc.slug,
    city: doc.stadt,
    state: doc.bundesland,
    localIntro: doc.lokalIntro,
    localFacts: (doc.lokaleFakten ?? []).map((f) => ({ label: f.label, value: f.wert })),
    servicesOffered: (doc.leistungen ?? []) as AreaKey[],
    onSiteRadiusKm: doc.radiusKm ?? 0,
    seo: seoZuSeite(doc.seo, doc.stadt),
    updatedAt: doc.updatedAt,
  };
}

export function einsatzgebietZuPayload(city: CityPage): RequiredDataFromCollectionSlug<'einsatzgebiete'> {
  return {
    kennung: city.id,
    slug: city.slug,
    stadt: city.city,
    bundesland: city.state,
    lokalIntro: city.localIntro,
    lokaleFakten: city.localFacts.map((f) => ({ label: f.label, wert: f.value })),
    leistungen: city.servicesOffered,
    radiusKm: city.onSiteRadiusKm,
    seo: seoZuPayload(city.seo),
    _status: 'published',
  };
}

/* ---------- Termine ------------------------------------------------------ */

/** Tage werden mittags UTC gespeichert, damit keine Zeitzone das Datum verschiebt. */
export const tagZuZeitpunkt = (date: string) => `${date}T12:00:00.000Z`;
export const zeitpunktZuTag = (value: string) => value.slice(0, 10);

export function sperrtagZuSeite(doc: Sperrtage): BlockedDay {
  const day: BlockedDay = { id: String(doc.id), date: zeitpunktZuTag(doc.datum), reason: doc.grund };
  if (doc.zeitfenster?.length) day.spans = doc.zeitfenster.map((z) => ({ from: z.von, to: z.bis }));
  return day;
}

export function sperrtagZuPayload(day: BlockedDay): RequiredDataFromCollectionSlug<'sperrtage'> {
  return {
    datum: tagZuZeitpunkt(day.date),
    grund: day.reason,
    zeitfenster: (day.spans ?? []).map((s) => ({ von: s.from, bis: s.to })),
  };
}

/* ---------- Globale Einstellungen ---------------------------------------- */

type EinstellungenDaten = Omit<Einstellungen, 'id' | 'updatedAt' | 'createdAt'>;

export function einstellungenZuSeite(doc: Einstellungen): Settings {
  const f = doc.firma;
  return {
    company: {
      legalName: f.rechtlicherName,
      brandName: f.marke,
      street: f.strasse,
      postalCode: f.plz,
      city: f.ort,
      country: f.land,
      phone: f.telefon,
      email: f.email,
      vatId: f.ustId ?? '',
      registerCourt: f.registergericht ?? '',
      registerNumber: f.registernummer ?? '',
      managingDirector: f.geschaeftsfuehrung ?? '',
      isPlaceholder: Boolean(f.platzhalter),
    },
    openingHours: (doc.oeffnungszeiten ?? []).map((o) => ({
      day: Number(o.tag),
      spans: (o.zeiten ?? []).map((z) => ({ from: z.von, to: z.bis })),
    })),
    booking: {
      leadTimeDays: doc.buchung.vorlaufTage,
      depositCents: zuCent(doc.buchung.anzahlung),
      depositMinCents: zuCent(doc.buchung.anzahlungMin),
      depositMaxCents: zuCent(doc.buchung.anzahlungMax),
      slotMinutes: doc.buchung.terminMinuten,
      bookingHorizonDays: doc.buchung.horizontTage,
      slotsPerWindow: doc.buchung.termineJeFenster,
      windows: (doc.buchung.fenster ?? []).map((z) => ({ from: z.von, to: z.bis })),
    },
    shipping: (doc.versand ?? []).map((v) => ({
      id: v.kennung,
      label: v.label,
      description: v.beschreibung,
      priceCents: zuCent(v.preis),
      tracked: Boolean(v.verfolgt),
      insured: Boolean(v.versichert),
      productClasses: v.produktklassen,
    })),
    retentionDays: {
      vehicleRegistration: doc.aufbewahrung.fahrzeugschein,
      keyPhotos: doc.aufbewahrung.schluesselfotos,
      floorPlans: doc.aufbewahrung.grundrisse,
      projectDocuments: doc.aufbewahrung.projektunterlagen,
    },
    updatedAt: doc.updatedAt ?? new Date(0).toISOString(),
  };
}

export function einstellungenZuPayload(s: Settings): EinstellungenDaten {
  const c = s.company;
  return {
    firma: {
      platzhalter: c.isPlaceholder,
      rechtlicherName: c.legalName,
      marke: c.brandName,
      strasse: c.street,
      plz: c.postalCode,
      ort: c.city,
      land: c.country,
      telefon: c.phone,
      email: c.email,
      ustId: c.vatId,
      registergericht: c.registerCourt,
      registernummer: c.registerNumber,
      geschaeftsfuehrung: c.managingDirector,
    },
    oeffnungszeiten: s.openingHours.map((o) => ({
      tag: String(o.day) as '1',
      zeiten: o.spans.map((z) => ({ von: z.from, bis: z.to })),
    })),
    buchung: {
      vorlaufTage: s.booking.leadTimeDays,
      horizontTage: s.booking.bookingHorizonDays,
      terminMinuten: s.booking.slotMinutes,
      anzahlung: zuEuro(s.booking.depositCents),
      anzahlungMin: zuEuro(s.booking.depositMinCents),
      anzahlungMax: zuEuro(s.booking.depositMaxCents),
      termineJeFenster: s.booking.slotsPerWindow,
      fenster: s.booking.windows.map((z) => ({ von: z.from, bis: z.to })),
    },
    versand: s.shipping.map((v) => ({
      kennung: v.id,
      label: v.label,
      beschreibung: v.description,
      preis: zuEuro(v.priceCents),
      verfolgt: v.tracked,
      versichert: v.insured,
      produktklassen: v.productClasses,
    })),
    aufbewahrung: {
      fahrzeugschein: s.retentionDays.vehicleRegistration,
      schluesselfotos: s.retentionDays.keyPhotos,
      grundrisse: s.retentionDays.floorPlans,
      projektunterlagen: s.retentionDays.projectDocuments,
    },
  };
}

type ZylinderDaten = Omit<Zylinderkatalog, 'id' | 'updatedAt' | 'createdAt'>;

export function zylinderkatalogZuSeite(doc: Zylinderkatalog): CylinderCatalog {
  return {
    keyPriceCents: zuCent(doc.schluesselPreis),
    includedKeys: doc.inklusiveSchluessel,
    maxKeys: doc.maxSchluessel,
    maxCylinders: doc.maxZylinder,
    measuringInfo: infoZuSeite(doc.messInfo),
    measuringFigure: bildZuSeite(doc.messGrafik, 'So wird ein Zylinder gemessen'),
    forms: (doc.bauformen ?? []).map((b) => {
      const measureLabels: CylinderCatalog['forms'][number]['measureLabels'] = { a: b.massLabelA };
      if (b.massLabelB) measureLabels.b = b.massLabelB;
      return {
        id: b.kennung,
        label: b.label,
        description: b.beschreibung,
        measures: b.masse,
        measureLabels,
        info: infoZuSeite(b.info),
        figure: bildZuSeite(b.grafik, b.label, '4/3'),
        minMm: b.minMm,
        maxMm: b.maxMm,
        stepMm: b.schrittMm,
        basePriceCents: zuCent(b.grundpreis),
        lengthSurchargeCents: zuCent(b.laengenAufpreis),
        baseLengthMm: b.grundlaengeMm,
        active: b.aktiv !== false,
      };
    }),
    functions: (doc.funktionen ?? []).map((f) => ({
      id: f.kennung,
      label: f.label,
      description: f.beschreibung,
      surchargeCents: zuCent(f.aufpreis),
      info: infoZuSeite(f.info),
      forms: f.bauformen,
      active: f.aktiv !== false,
    })),
    extras: (doc.extras ?? []).map((e) => ({
      id: e.kennung,
      label: e.label,
      description: e.beschreibung,
      priceCents: zuCent(e.preis),
      unit: e.einheit,
      info: infoZuSeite(e.info),
      active: e.aktiv !== false,
    })),
  };
}

export function zylinderkatalogZuPayload(c: CylinderCatalog): ZylinderDaten {
  return {
    schluesselPreis: zuEuro(c.keyPriceCents),
    inklusiveSchluessel: c.includedKeys,
    maxSchluessel: c.maxKeys,
    maxZylinder: c.maxCylinders,
    messInfo: infoZuPayload(c.measuringInfo),
    messGrafik: bildZuPayload(c.measuringFigure),
    bauformen: c.forms.map((f) => ({
      kennung: f.id,
      label: f.label,
      aktiv: f.active,
      beschreibung: f.description,
      masse: f.measures,
      massLabelA: f.measureLabels.a,
      massLabelB: f.measureLabels.b ?? null,
      minMm: f.minMm,
      maxMm: f.maxMm,
      schrittMm: f.stepMm,
      grundlaengeMm: f.baseLengthMm,
      grundpreis: zuEuro(f.basePriceCents),
      laengenAufpreis: zuEuro(f.lengthSurchargeCents),
      info: infoZuPayload(f.info),
      grafik: bildZuPayload(f.figure),
    })),
    funktionen: c.functions.map((f) => ({
      kennung: f.id,
      label: f.label,
      aktiv: f.active,
      beschreibung: f.description,
      aufpreis: zuEuro(f.surchargeCents),
      bauformen: f.forms,
      info: infoZuPayload(f.info),
    })),
    extras: c.extras.map((e) => ({
      kennung: e.id,
      label: e.label,
      aktiv: e.active,
      beschreibung: e.description,
      preis: zuEuro(e.priceCents),
      einheit: e.unit,
      info: infoZuPayload(e.info),
    })),
  };
}

/* ---------- Vorgänge ----------------------------------------------------- */

export function vorgangZuSeite(doc: Vorgaenge): BusinessRecord {
  const k = doc.kontakt;
  const record: BusinessRecord = {
    id: String(doc.id),
    reference: doc.nummer,
    kind: doc.art,
    area: doc.bereich as AreaKey,
    process: doc.prozess,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    contact: {
      firstName: k.vorname,
      lastName: k.nachname,
      email: k.email,
      phone: k.telefon,
      country: k.land,
    },
    payload: (doc.daten as Record<string, unknown> | null) ?? {},
    summary: (doc.zusammenfassung ?? []).map((s) => ({
      title: s.titel ?? '',
      rows: (s.zeilen ?? []).map((z) => ({ label: z.label ?? '', value: z.wert ?? '' })),
    })),
    uploads: (doc.uploads as unknown as BusinessRecord['uploads'] | null) ?? [],
    internalNotes: (doc.notizen ?? []).map((n) => ({ at: n.am, actor: n.von, message: n.text })),
    timeline: (doc.verlauf ?? []).map((n) => ({ at: n.am, actor: n.von, message: n.text })),
  };
  const kontaktOptional = {
    salutation: optText(k.anrede),
    company: optText(k.firma),
    street: optText(k.strasse),
    postalCode: optText(k.plz),
    city: optText(k.ort),
  };
  for (const [key, value] of Object.entries(kontaktOptional)) {
    if (value !== undefined) (record.contact as unknown as Record<string, unknown>)[key] = value;
  }
  if (doc.angebot) record.quote = doc.angebot as unknown as BusinessRecord['quote'];
  if (doc.termin?.datum && doc.termin.uhrzeit) {
    record.appointment = {
      date: doc.termin.datum,
      time: doc.termin.uhrzeit,
      durationMinutes: doc.termin.dauerMinuten ?? 60,
      location: doc.termin.ort ?? 'werkstatt',
    };
  }
  if (doc.zahlung?.umfang) {
    record.payment = {
      scope: doc.zahlung.umfang,
      amountCents: doc.zahlung.betragCent ?? 0,
      status: doc.zahlung.status ?? 'offen',
    };
    if (doc.zahlung.anbieterRef) record.payment.providerRef = doc.zahlung.anbieterRef;
    if (doc.zahlung.bezahltAm) record.payment.paidAt = doc.zahlung.bezahltAm;
  }
  if (doc.zugriffsHash) record.accessTokenHash = doc.zugriffsHash;
  return record;
}

export function vorgangZuPayload(record: BusinessRecord): RequiredDataFromCollectionSlug<'vorgaenge'> {
  const c = record.contact;
  return {
    nummer: record.reference,
    art: record.kind,
    bereich: record.area,
    prozess: record.process,
    status: record.status,
    kontakt: {
      anrede: c.salutation,
      vorname: c.firstName,
      nachname: c.lastName,
      firma: c.company,
      email: c.email,
      telefon: c.phone,
      strasse: c.street,
      plz: c.postalCode,
      ort: c.city,
      land: c.country,
    },
    zusammenfassung: record.summary.map((s) => ({
      titel: s.title,
      zeilen: s.rows.map((r) => ({ label: r.label, wert: r.value })),
    })),
    termin: record.appointment
      ? {
          datum: record.appointment.date,
          uhrzeit: record.appointment.time,
          dauerMinuten: record.appointment.durationMinutes,
          ort: record.appointment.location,
        }
      : undefined,
    zahlung: record.payment
      ? {
          umfang: record.payment.scope,
          betragCent: record.payment.amountCents,
          status: record.payment.status,
          anbieterRef: record.payment.providerRef,
          bezahltAm: record.payment.paidAt,
        }
      : undefined,
    notizen: record.internalNotes.map((n) => ({ am: n.at, von: n.actor, text: n.message })),
    verlauf: record.timeline.map((n) => ({ am: n.at, von: n.actor, text: n.message })),
    daten: record.payload,
    angebot: (record.quote ?? null) as unknown as Record<string, unknown> | null,
    uploads: record.uploads as unknown as Record<string, unknown>[],
    zugriffsHash: record.accessTokenHash,
  };
}
