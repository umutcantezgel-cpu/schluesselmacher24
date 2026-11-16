/*
 * DHL Paket für Geschäftskunden (FA-SHOP-03B, A-050 Punkt 7, MA-08): Versandlabel über die Versenden-API
 * (Parcel DE Shipping, Version 2), damit der Kunde für die Einsendung ein Paket-Label von uns bekommt.
 * Nur Aufbau: vorbereitet und abgeschaltet. Es gibt keinen Anbieter ohne Schalter „Label aktiv“,
 * VERSAND_PROVIDER=dhl-paket und vollständigen Zugang; in Tests läuft nur eine Attrappe (G3, G5).
 *
 * Voraussetzungen laut Recherche (erhebung/E1-versand.md Abschnitt 5, FA-RECHERCHE-03 Abschnitt 3):
 * Geschäftskundenvertrag, EKP und 14-stellige Abrechnungsnummer; Sandbox ohne Zusatzfreigabe unter
 * https://api-sandbox.dhl.com/parcel/de/shipping/v2/. Anmeldung mit Basic Auth und Header dhl-api-key
 * (nur Suchtreffer, Stufe C). Aufbau des Auftrags nach der öffentlichen Beschreibung; vor dem Livegang
 * einmal in der Sandbox prüfen (Produktcode, Gewicht, Felder der Antwort).
 *
 * Kosten: Das Label bezahlt der Betrieb bei DHL, der Kunde trägt die Versandkosten über den Auftrag
 * (FA Anhang B). Darum ist das Label nie „kostenlos“ (R9).
 */

import { strasseUndNummer } from './dhl-retoure';
import type { Anschrift, Sendung, VersandAnbieter } from './typen';

export const DHL_PAKET_SANDBOX = 'https://api-sandbox.dhl.com/parcel/de/shipping/v2/';

/** Produktcode für DHL Paket national nach der öffentlichen Beschreibung; vor dem Livegang in der Sandbox prüfen. */
export const DHL_PAKET_PRODUKT_VORGABE = 'V01PAK';

/** Gewicht für die Anmeldung: ein Schlüssel mit Polsterung bleibt darunter (Paket bis 5 kg). */
export const DHL_PAKET_GEWICHT_G = 500;

export interface DhlPaketZugang {
  basis: string;
  apiKey: string;
  benutzer: string;
  passwort: string;
  /** 14-stellige Abrechnungsnummer aus dem Geschäftskundenvertrag. */
  abrechnungsnummer: string;
  produkt: string;
}

type Umgebung = Record<string, string | undefined>;

/** Variablen, die der Anschluss braucht, mit Erklärung für den Admin. */
export const DHL_PAKET_VARIABLEN: ReadonlyArray<{ name: string; was: string; pruefe?: (wert: string) => boolean }> = [
  { name: 'DHL_API_KEY', was: 'API-Schlüssel aus dem DHL-Entwicklerportal' },
  { name: 'DHL_USER', was: 'Benutzer des Geschäftskundenportals' },
  { name: 'DHL_PASSWORD', was: 'Passwort dieses Benutzers' },
  { name: 'DHL_PAKET_ABRECHNUNGSNUMMER', was: '14-stellige Abrechnungsnummer aus dem Vertrag', pruefe: (wert) => /^\d{14}$/.test(wert) },
];

/** Welche Variablen fehlen oder ungültig sind (Namen, keine Werte). */
export function dhlPaketFehlt(env: Umgebung): string[] {
  return DHL_PAKET_VARIABLEN.filter(({ name, pruefe }) => {
    const wert = env[name]?.trim();
    return !wert || (pruefe ? !pruefe(wert) : false);
  }).map(({ name, was }) => `${name} (${was})`);
}

export function dhlPaketZugang(env: Umgebung): DhlPaketZugang | null {
  if (dhlPaketFehlt(env).length) return null;
  const basis = (env.DHL_PAKET_API_BASIS?.trim() || DHL_PAKET_SANDBOX).replace(/\/?$/, '/');
  return {
    basis,
    apiKey: env.DHL_API_KEY!.trim(),
    benutzer: env.DHL_USER!.trim(),
    passwort: env.DHL_PASSWORD!.trim(),
    abrechnungsnummer: env.DHL_PAKET_ABRECHNUNGSNUMMER!.trim(),
    produkt: env.DHL_PAKET_PRODUKT?.trim() || DHL_PAKET_PRODUKT_VORGABE,
  };
}

/** Nur Sendungen innerhalb Deutschlands (Haftung und Preise der Varianten gelten national). */
function inDeutschland(a: Anschrift): boolean {
  const land = a.land?.trim().toLowerCase();
  return !land || land === 'deutschland' || land === 'de' || land === 'deu' || land === 'germany';
}

function adresse(a: Anschrift) {
  const { strasse, nummer } = strasseUndNummer(a.strasse);
  return {
    name1: a.name.slice(0, 50),
    ...(a.zusatz ? { name2: a.zusatz.slice(0, 50) } : {}),
    addressStreet: strasse.slice(0, 50),
    addressHouse: nummer.slice(0, 10),
    postalCode: a.plz,
    city: a.ort.slice(0, 40),
    country: 'DEU',
  };
}

/** Auftrag für die Versenden-API: Absender ist der Kunde, Empfänger die Werkstatt. */
export function dhlPaketAuftrag(sendung: Sendung, zugang: Pick<DhlPaketZugang, 'abrechnungsnummer' | 'produkt'>) {
  return {
    profile: 'STANDARD_GRUPPENPROFIL',
    shipments: [
      {
        product: zugang.produkt,
        billingNumber: zugang.abrechnungsnummer,
        refNo: sendung.vorgangsnummer.slice(0, 35),
        shipper: adresse(sendung.absender),
        consignee: adresse(sendung.empfaenger),
        details: { weight: { uom: 'g', value: DHL_PAKET_GEWICHT_G } },
      },
    ],
  };
}

export function dhlPaket(zugang: DhlPaketZugang, fetchImpl: typeof fetch = fetch): VersandAnbieter {
  return {
    name: 'dhl-paket',
    async erstelle(sendung) {
      // Das Paket-Label gilt nur für die Variante DHL Paket; Briefe frankiert der Kunde selbst.
      if (sendung.art !== 'dhl-paket') throw new Error('DHL Paket: nur für die Variante DHL Paket');
      if (!inDeutschland(sendung.absender) || !inDeutschland(sendung.empfaenger)) throw new Error('DHL Paket: nur innerhalb Deutschlands');
      const antwort = await fetchImpl(`${zugang.basis}orders?docFormat=PDF&includeDocs=include`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'dhl-api-key': zugang.apiKey,
          Authorization: `Basic ${Buffer.from(`${zugang.benutzer}:${zugang.passwort}`).toString('base64')}`,
        },
        body: JSON.stringify(dhlPaketAuftrag(sendung, zugang)),
      });
      if (!antwort.ok) throw new Error(`DHL Paket: HTTP ${antwort.status}`);
      const daten = (await antwort.json()) as { items?: Array<{ shipmentNo?: string; label?: { b64?: string } }> };
      const eintrag = daten.items?.[0];
      if (!eintrag?.label?.b64) throw new Error('DHL Paket: kein Label in der Antwort');
      return {
        anbieter: 'dhl-paket',
        dateiname: `Paketlabel-${sendung.vorgangsnummer.replace(/[^A-Za-z0-9-]/g, '')}.pdf`,
        pdf: Buffer.from(eintrag.label.b64, 'base64'),
        sendungsnummer: eintrag.shipmentNo,
        // Die Versandkosten werden mit dem Auftrag berechnet; eine Übernahme hat der Inhaber nicht freigegeben.
        kostenlos: false,
      };
    },
  };
}
