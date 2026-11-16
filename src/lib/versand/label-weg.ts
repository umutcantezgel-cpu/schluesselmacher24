/*
 * Anzeige im Admin (FA-SHOP-03B): welcher Versandweg für die Einsendung aktiv ist und was für das
 * DHL-Paket-Label fehlt. Reine Funktion, nur relative Importe (Backend-Hook der Einstellungen).
 */

import type { EinsendeEinstellungen } from '../types';

import { dhlPaketFehlt } from './dhl-paket';

type Umgebung = Record<string, string | undefined>;

export interface LabelWegStand {
  /** Weg, den die Seiten zum Einschicken heute nutzen. */
  aktiv: 'begleitschein' | 'attrappe';
  /** Was für das DHL-Paket-Label noch fehlt; leer, wenn Vertrag, Zugang und Schalter vollständig sind. */
  fehltPaket: string[];
  /** Zeilen für die Anzeige im Admin. */
  zeilen: string[];
}

/**
 * Welcher Weg aktiv ist und was für das Label fehlt (FA-SHOP-03B, Anzeige in den Einstellungen).
 * Die Seiten zum Einschicken erzeugen bis zur Ablage des Labels am Vorgang nur den Begleitschein
 * (A-035, `src/lib/einsenden/schein.ts`); das steht hier ausdrücklich, auch wenn alles andere da ist.
 * Nennt nur Namen von Variablen, nie deren Werte.
 */
export function labelWegStand({ einstellungen, env = process.env }: { einstellungen: Pick<EinsendeEinstellungen, 'labelAktiv'>; env?: Umgebung }): LabelWegStand {
  const wahl = env.VERSAND_PROVIDER?.trim();
  const aktiv = wahl === 'attrappe' ? 'attrappe' : 'begleitschein';
  const technisch = [
    ...(wahl === 'dhl-paket' ? [] : ['Variable VERSAND_PROVIDER=dhl-paket']),
    ...dhlPaketFehlt(env).map((v) => `Variable ${v}`),
    ...(einstellungen.labelAktiv ? [] : ['Schalter „Versandlabel aktiv“ in diesen Einstellungen']),
  ];
  // Den Vertrag kann die Seite nicht prüfen; erst Zugang und Schalter zeigen, dass er da ist.
  const fehltPaket = technisch.length ? ['Geschäftskundenvertrag mit DHL (EKP und Abrechnungsnummer für DHL Paket)', ...technisch] : [];
  const zeilen = [
    aktiv === 'attrappe'
      ? 'Aktiver Weg: Attrappe für Tests und Probeläufe (VERSAND_PROVIDER=attrappe). Es entsteht kein echtes Label.'
      : 'Aktiver Weg: Begleitschein. Der Kunde druckt ihn aus und frankiert selbst.',
    fehltPaket.length
      ? `DHL Paket mit Label von uns: abgeschaltet. Es fehlt: ${fehltPaket.join('; ')}.`
      : 'DHL Paket mit Label von uns: Vertrag, Zugang und Schalter sind eingetragen.',
    'Auch danach bekommen Kunden den Begleitschein, bis das Label einmal erzeugt und am Vorgang gespeichert wird (Ausbau nach dem Vertrag, in der Sandbox zu prüfen).',
    'Die Kosten für das Label werden mit dem Auftrag berechnet. Eine Übernahme des Portos durch den Betrieb gibt es nur mit Freigabe des Inhabers.',
  ];
  return { aktiv, fehltPaket, zeilen };
}
