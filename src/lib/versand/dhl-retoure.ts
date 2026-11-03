/*
 * DHL Retoure (A-010, MA-08): nur mit Geschäftskundenvertrag, Freigabe „Retoure“ und Zugangsdaten
 * als Variablen. Nach der öffentlichen Beschreibung der Retouren-API v1 (developer.dhl.com,
 * erhebung/E1-versand.md Abschnitt 5); vor dem Livegang einmal in der Sandbox prüfen. Ohne
 * vollständigen Zugang gibt es keinen Anbieter; dann gilt der Begleitschein.
 */

import type { Sendung, VersandAnbieter } from './typen';

export const DHL_SANDBOX = 'https://api-sandbox.dhl.com/parcel/de/shipping/returns/v1/';

export interface DhlZugang {
  basis: string;
  apiKey: string;
  benutzer: string;
  passwort: string;
  /** Empfänger-Kennung aus dem Geschäftskundenportal. */
  empfaengerId: string;
}

type Umgebung = Record<string, string | undefined>;

export function dhlZugang(env: Umgebung): DhlZugang | null {
  const apiKey = env.DHL_API_KEY?.trim();
  const benutzer = env.DHL_USER?.trim();
  const passwort = env.DHL_PASSWORD?.trim();
  const empfaengerId = env.DHL_RETOURE_EMPFAENGER?.trim();
  if (!apiKey || !benutzer || !passwort || !empfaengerId) return null;
  const basis = (env.DHL_API_BASIS?.trim() || DHL_SANDBOX).replace(/\/?$/, '/');
  return { basis, apiKey, benutzer, passwort, empfaengerId };
}

/** Straße und Hausnummer getrennt, wie die Schnittstelle sie erwartet. */
export function strasseUndNummer(zeile: string): { strasse: string; nummer: string } {
  const treffer = /^(.*?)[\s,]+(\d+\s*[A-Za-z]?(?:\s*[-/]\s*\d+\s*[A-Za-z]?)?)$/.exec(zeile.trim());
  return treffer ? { strasse: treffer[1].trim(), nummer: treffer[2].replace(/\s+/g, '') } : { strasse: zeile.trim(), nummer: '' };
}

export function dhlAuftrag(sendung: Sendung, zugang: Pick<DhlZugang, 'empfaengerId'>) {
  const { strasse, nummer } = strasseUndNummer(sendung.absender.strasse);
  return {
    receiverId: zugang.empfaengerId,
    customerReference: sendung.vorgangsnummer,
    shipmentReference: sendung.vorgangsnummer,
    shipper: {
      name1: sendung.absender.name.slice(0, 50),
      ...(sendung.absender.zusatz ? { name2: sendung.absender.zusatz.slice(0, 50) } : {}),
      addressStreet: strasse.slice(0, 50),
      addressHouse: nummer.slice(0, 10),
      postalCode: sendung.absender.plz,
      city: sendung.absender.ort.slice(0, 40),
    },
  };
}

export function dhlRetoure(zugang: DhlZugang, fetchImpl: typeof fetch = fetch): VersandAnbieter {
  return {
    name: 'dhl-retoure',
    async erstelle(sendung) {
      const antwort = await fetchImpl(`${zugang.basis}orders?labelType=SHIPMENT_LABEL`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'dhl-api-key': zugang.apiKey,
          Authorization: `Basic ${Buffer.from(`${zugang.benutzer}:${zugang.passwort}`).toString('base64')}`,
        },
        body: JSON.stringify(dhlAuftrag(sendung, zugang)),
      });
      if (!antwort.ok) throw new Error(`DHL Retoure: HTTP ${antwort.status}`);
      const daten = (await antwort.json()) as { shipmentNo?: string; label?: { b64?: string } };
      if (!daten.label?.b64) throw new Error('DHL Retoure: kein Label in der Antwort');
      return {
        anbieter: 'dhl-retoure',
        dateiname: `Versandlabel-${sendung.vorgangsnummer.replace(/[^A-Za-z0-9-]/g, '')}.pdf`,
        pdf: Buffer.from(daten.label.b64, 'base64'),
        sendungsnummer: daten.shipmentNo,
        kostenlos: true,
      };
    },
  };
}
