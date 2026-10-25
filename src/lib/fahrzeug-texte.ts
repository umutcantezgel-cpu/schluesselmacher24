import type {
  BookingDefaults,
  CarKeyService,
  CompanyLocation,
  KeyKind,
  PriceQuote,
  PricingRule,
  VehicleMake,
  VehicleModel,
} from '@/lib/types';
import { quoteCarKeyService } from '@/lib/pricing';
import { formatCents, formatNumber } from '@/lib/format';
import { istPlatzhalter } from '@/lib/platzhalter';
import { keyKindLabel } from '@/components/autoschluessel/key-kinds';
import { formatModelYears, hatBaujahre } from '@/components/autoschluessel/vehicle-facts';

/* ==========================================================================
   Texte der Marken- und Modellseiten (Autoschlüssel)

   Alles stammt aus den Fahrzeugdaten und den Preisregeln: Baujahre,
   Schlüsselarten, angebotene Leistungen und deren Preis bzw. Preisrahmen —
   berechnet mit `quoteCarKeyService`, derselben Funktion, die der
   Termin-Assistent für dieses Modell aufruft. Hier steht keine eigene
   Preisformel. Eigene Texte aus dem Backend (Einleitung, Titel,
   Beschreibung) gehen immer vor.
   ========================================================================== */

export const TITEL_MAX = 60;
export const BESCHREIBUNG_MAX = 160;

/** Ein Preis, wie ihn der Assistent für diese Eingaben nennt. */
export interface PreisZeile {
  /** Schlüsselarten des Modells, für die dieses Ergebnis gilt. */
  arten: KeyKind[];
  quote: PriceQuote;
}

export interface LeistungsPreis {
  service: CarKeyService;
  /** Mit mindestens einem funktionierenden Schlüssel (Auswahl „Ein funktionierender Schlüssel“). */
  mitSchluessel: PreisZeile[];
  /** Ohne funktionierenden Schlüssel — nur, wenn der Assistent dann etwas anderes nennt. */
  ohneSchluessel: PreisZeile[];
}

export interface PreisKontext {
  services: CarKeyService[];
  rules: PricingRule[];
  booking: BookingDefaults;
}

function signatur(quote: PriceQuote): string {
  const { mode, priceCents, priceFromCents, priceToCents, depositCents, slotMinutes, leadTimeDays, requiresVehicleOnSite, note } = quote;
  return JSON.stringify([mode, priceCents, priceFromCents, priceToCents, depositCents, slotMinutes, leadTimeDays, requiresVehicleOnSite, note]);
}

/** Fasst Schlüsselarten mit gleichem Ergebnis zu einer Zeile zusammen. */
function zeilen(make: VehicleMake, model: VehicleModel, service: CarKeyService, arten: KeyKind[], workingKeys: number, kontext: PreisKontext): PreisZeile[] {
  const gruppen = new Map<string, PreisZeile>();
  for (const art of arten) {
    const quote = quoteCarKeyService({ make, model, service, keyKind: art, workingKeys }, kontext.rules, kontext.booking);
    const schluessel = signatur(quote);
    const zeile = gruppen.get(schluessel);
    if (zeile) zeile.arten.push(art);
    else gruppen.set(schluessel, { arten: [art], quote });
  }
  return [...gruppen.values()];
}

/**
 * Leistungen für dieses Modell mit Preis — genau die Leistungen, die der
 * Assistent zu den Schlüsselarten des Modells anbietet (aktiv, Art passt).
 */
export function leistungsPreise(make: VehicleMake, model: VehicleModel, kontext: PreisKontext): LeistungsPreis[] {
  const ergebnis: LeistungsPreis[] = [];
  for (const service of kontext.services) {
    if (!service.active) continue;
    const arten = model.keyKinds.filter((art) => service.keyKinds.includes(art));
    if (!arten.length) continue;
    const mitSchluessel = zeilen(make, model, service, arten, 1, kontext);
    const ohne = zeilen(make, model, service, arten, 0, kontext);
    const gleich =
      ohne.length === mitSchluessel.length
      && ohne.every((zeile, i) => signatur(zeile.quote) === signatur(mitSchluessel[i].quote));
    ergebnis.push({ service, mitSchluessel, ohneSchluessel: gleich ? [] : ohne });
  }
  return ergebnis;
}

/** Preisangabe wie im Assistenten (fester Preis, Rahmen oder Prüfung). */
export function preisAngabe(quote: PriceQuote): string {
  if (quote.mode === 'fest' && quote.priceCents !== undefined) return formatCents(quote.priceCents);
  if (quote.mode === 'rahmen') {
    if (quote.priceFromCents !== undefined && quote.priceToCents !== undefined) {
      return `${formatCents(quote.priceFromCents)} bis ${formatCents(quote.priceToCents)}`;
    }
    if (quote.priceFromCents !== undefined) return `ab ${formatCents(quote.priceFromCents)}`;
    return 'Preisrahmen nach Prüfung';
  }
  return 'nach Prüfung';
}

/** Wird der Preis erst nach Prüfung der Unterlagen verbindlich? */
export function erstNachPruefung(quote: PriceQuote): boolean {
  return quote.mode !== 'fest' || quote.priceCents === undefined;
}

/** Niedrigster genannter Preis über alle Leistungen (fest oder Untergrenze eines Rahmens). */
export function preisAb(preise: LeistungsPreis[]): number | undefined {
  const werte = preise
    .flatMap((p) => p.mitSchluessel)
    .map(({ quote }) => (quote.mode === 'fest' ? quote.priceCents : quote.mode === 'rahmen' ? quote.priceFromCents : undefined))
    .filter((wert): wert is number => typeof wert === 'number');
  return werte.length ? Math.min(...werte) : undefined;
}

/** „7 Tage“ oder „7 bis 14 Tage“ — Vorlauf über alle Leistungen. */
export function spanne(werte: number[], einheit: (n: number) => string): string | undefined {
  if (!werte.length) return undefined;
  const von = Math.min(...werte);
  const bis = Math.max(...werte);
  return von === bis ? einheit(von) : `${einheit(von).replace(/\s.*$/, '')} bis ${einheit(bis)}`;
}

/** „a“, „a und b“, „a, b und c“. */
export function aufzaehlung(werte: string[]): string {
  if (werte.length <= 1) return werte[0] ?? '';
  return `${werte.slice(0, -1).join(', ')} und ${werte[werte.length - 1]}`;
}

function bisLaenge(pflicht: string, optional: Array<string | undefined>, max: number): string {
  let text = pflicht;
  for (const teil of optional) {
    if (teil && `${text} ${teil}`.length <= max) text = `${text} ${teil}`;
  }
  return text;
}

const tage = (n: number) => `${formatNumber(n)} ${n === 1 ? 'Tag' : 'Tage'}`;

/** Leistungsnamen in Anführungszeichen — sie enthalten selbst Kommas („Gehäuse, Tasten und Batterie“). */
function leistungen(namen: string[]): string {
  return aufzaehlung(namen.map((name) => `„${name}“`));
}

/** Eckdaten aus den Preisen: Anzahlung, Vorlauf, Fahrzeugbedarf je Leistung. */
export function eckdaten(preise: LeistungsPreis[]) {
  const quotes = preise.flatMap((p) => p.mitSchluessel.map((z) => z.quote));
  const anzahlung = spanne(quotes.map((q) => q.depositCents), formatCents);
  const vorlauf = spanne(quotes.map((q) => q.leadTimeDays), tage);
  const mitFahrzeug = preise.filter((p) => p.mitSchluessel.some((z) => z.quote.requiresVehicleOnSite)).map((p) => p.service.label);
  const ohneFahrzeug = preise.filter((p) => p.mitSchluessel.every((z) => !z.quote.requiresVehicleOnSite)).map((p) => p.service.label);
  const pruefung = preise.filter((p) => p.mitSchluessel.some((z) => erstNachPruefung(z.quote))).map((p) => p.service.label);
  return { anzahlung, vorlauf, mitFahrzeug, ohneFahrzeug, pruefung };
}

/** Werkstatt, falls in den Einstellungen gepflegt (`standort`). */
export type Werkstatt = Pick<CompanyLocation, 'street' | 'postalCode' | 'city'>;

export interface ModellTexte {
  metaTitel: string;
  metaBeschreibung: string;
  /** Unterzeile im Kopf: eigene Einleitung aus dem Backend oder aus den Daten. */
  einleitung: string;
  eigeneEinleitung: boolean;
  faq: { question: string; answer: string }[];
  mitbringen: { titel: string; text: string }[];
  noindex: boolean;
}

export function modellTexte(
  make: VehicleMake,
  model: VehicleModel,
  preise: LeistungsPreis[],
  werkstatt?: Werkstatt,
): ModellTexte {
  const name = `${make.name} ${model.name}`;
  const jahre = formatModelYears(model);
  const erfasst = hatBaujahre(model);
  const arten = model.keyKinds.map((art) => keyKindLabel(art));
  const daten = eckdaten(preise);
  const ab = preisAb(preise);
  const ort = werkstatt ? `in der Werkstatt in ${werkstatt.city}` : 'bei uns';

  const titelVorschlaege = [
    ...(erfasst ? [`${name} Autoschlüssel (${jahre}): Preise und Termin`, `${name} Autoschlüssel (${jahre})`] : []),
    `${name} Autoschlüssel: Preise und Termin`,
    `${name} Autoschlüssel`,
  ];
  const eigenerTitel = model.seo?.title?.trim();
  const metaTitel = eigenerTitel || (titelVorschlaege.find((t) => t.length <= TITEL_MAX) ?? `${name} Autoschlüssel`);

  const erstePreise = preise
    .filter((p) => p.mitSchluessel.length === 1 && !erstNachPruefung(p.mitSchluessel[0].quote))
    .slice(0, 2)
    .map((p) => `${p.service.label}: ${preisAngabe(p.mitSchluessel[0].quote)}.`);
  const eigeneBeschreibung = model.seo?.description?.trim();
  const metaBeschreibung =
    eigeneBeschreibung
    || bisLaenge(
      `Autoschlüssel für ${name}${erfasst ? ` (${jahre})` : ''}${arten.length ? `: ${aufzaehlung(arten)}` : ''}.`,
      [...erstePreise, werkstatt ? `Termin ${ort}.` : undefined, daten.vorlauf ? `Vorlauf ${daten.vorlauf}.` : undefined],
      BESCHREIBUNG_MAX,
    );

  const eigeneEinleitung = !istPlatzhalter(model.intro) ? model.intro!.trim() : undefined;
  const einleitung =
    eigeneEinleitung
    ?? [
      `Für ${name}${erfasst ? ` (Baujahre ${jahre})` : ''} sind ${arten.length ? `${formatNumber(arten.length)} Schlüsselarten erfasst: ${aufzaehlung(arten)}` : 'noch keine Schlüsselarten erfasst'}.`,
      preise.length
        ? `${formatNumber(preise.length)} ${preise.length === 1 ? 'Leistung ist' : 'Leistungen sind'} möglich${ab !== undefined ? `, Preise ab ${formatCents(ab)}` : ''} — berechnet wie im Termin-Assistenten.`
        : undefined,
    ]
      .filter(Boolean)
      .join(' ');

  const faq: ModellTexte['faq'] = [
    {
      question: `Welche Schlüsselarten gibt es für ${name}?`,
      answer: arten.length
        ? `Für ${name}${erfasst ? ` (${jahre})` : ''} sind erfasst: ${aufzaehlung(arten)}. Welche Ihr Fahrzeug hat, erkennen wir an Ihren Schlüsselfotos und den Fahrzeugdaten.`
        : 'Für dieses Modell sind noch keine Schlüsselarten erfasst. Wir klären das anhand Ihrer Schlüsselfotos und der Fahrzeugdaten.',
    },
  ];
  if (daten.mitFahrzeug.length || daten.ohneFahrzeug.length) {
    faq.push({
      question: `Muss mein ${name} zum Termin da sein?`,
      answer: !daten.ohneFahrzeug.length
        ? `Ja, für alle ${formatNumber(preise.length)} angebotenen Leistungen muss das Fahrzeug zum Termin ${ort} stehen.`
        : [
            daten.mitFahrzeug.length
              ? `Für ${leistungen(daten.mitFahrzeug)} ja — das Fahrzeug muss zum Termin ${ort} stehen.`
              : undefined,
            `Für ${leistungen(daten.ohneFahrzeug)} ist das Fahrzeug nicht nötig.`,
          ]
            .filter(Boolean)
            .join(' '),
    });
  }
  if (daten.vorlauf || daten.anzahlung) {
    faq.push({
      question: `Wie schnell bekomme ich einen Termin für ${name}?`,
      answer: [
        daten.vorlauf ? `Der früheste Termin liegt je nach Leistung ${daten.vorlauf} in der Zukunft, weil wir den passenden Schlüssel vorher beschaffen.` : undefined,
        daten.anzahlung ? `Die Anzahlung beträgt ${daten.anzahlung} und wird vollständig auf den Preis angerechnet.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    });
  }
  if (daten.pruefung.length) {
    const alle = daten.pruefung.length === preise.length;
    faq.push({
      question: alle
        ? `Warum gibt es für ${name} keinen festen Preis?`
        : `Warum steht bei manchen Leistungen für ${name} kein fester Preis?`,
      answer: `${alle ? `Bei ${name}` : `Bei ${leistungen(daten.pruefung)}`} hängt der Aufwand vom einzelnen Fahrzeug ab. Der Preis wird verbindlich nach Prüfung der Unterlagen; wir nennen ihn vor der Terminbestätigung.`,
    });
  }

  const mitbringen = [
    ...(daten.mitFahrzeug.length
      ? [
          {
            titel: `Ihr Fahrzeug (${name})`,
            text: daten.ohneFahrzeug.length
              ? `Nötig für ${leistungen(daten.mitFahrzeug)}.`
              : 'Nötig für alle hier angebotenen Leistungen.',
          },
        ]
      : []),
    {
      titel: 'Alle vorhandenen Schlüssel',
      text: 'Bei manchen Fahrzeugen werden beim Anlernen sämtliche Schlüssel neu erfasst.',
    },
    {
      titel: 'Fahrzeugschein und Ausweisdokument',
      text: 'Zulassungsbescheinigung Teil I — wir arbeiten nur an Fahrzeugen, über die Sie verfügen dürfen.',
    },
  ];

  return {
    metaTitel,
    metaBeschreibung,
    einleitung,
    eigeneEinleitung: Boolean(eigeneEinleitung),
    faq,
    mitbringen,
    noindex: Boolean(model.seo?.noindex),
  };
}

export interface MarkenTexte {
  metaTitel: string;
  metaBeschreibung: string;
  noindex: boolean;
}

export function markenTexte(make: VehicleMake): MarkenTexte {
  const zahl = make.models.length;
  const modelle = [...make.models].sort((a, b) => a.name.localeCompare(b.name, 'de')).map((m) => m.name);
  const titelVorschlaege = [
    `${make.name} Autoschlüssel: ${formatNumber(zahl)} ${zahl === 1 ? 'Modell' : 'Modelle'}, Preise und Termin`,
    `${make.name} Autoschlüssel: Modelle und Preise`,
    `${make.name} Autoschlüssel`,
  ];
  const metaTitel = make.seo?.title?.trim() || (titelVorschlaege.find((t) => t.length <= TITEL_MAX) ?? `${make.name} Autoschlüssel`);
  const metaBeschreibung =
    make.seo?.description?.trim()
    || bisLaenge(
      `Autoschlüssel für ${make.name}: ${aufzaehlung(modelle)}.`,
      ['Baujahre, Schlüsselarten und Preise wie im Termin-Assistenten.', 'Termin in der Werkstatt.'],
      BESCHREIBUNG_MAX,
    );
  return { metaTitel, metaBeschreibung, noindex: Boolean(make.seo?.noindex) };
}

/** Darf die Modellseite in Suchmaschinen und in die Sitemap? (`noindex` je Modell im Backend) */
export function modellIndexierbar(model: VehicleModel): boolean {
  return !model.seo?.noindex;
}

/** Darf die Markenseite in Suchmaschinen und in die Sitemap? (`noindex` der Marke im Backend) */
export function markeIndexierbar(make: VehicleMake): boolean {
  return !make.seo?.noindex;
}
