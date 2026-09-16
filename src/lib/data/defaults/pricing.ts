import type { CarKeyService, PricingGroup, PricingRule } from '@/lib/types';

/**
 * Fahrzeuggruppen für die Preis- und Terminsteuerung.
 * Jede Marke verweist auf genau eine Gruppe; Modelle können abweichen.
 */
export function pricingGroups(): PricingGroup[] {
  return [
    {
      id: 'gruppe-a',
      label: 'Gruppe A — einfache Systeme',
      description:
        'Fahrzeuge mit mechanischem Schlüssel oder einfacher Funkfernbedienung. Kurze Bearbeitungszeit.',
    },
    {
      id: 'gruppe-b',
      label: 'Gruppe B — Funk und Transponder',
      description:
        'Fahrzeuge mit Transponder und Funkfernbedienung. Anlernen am Fahrzeug erforderlich.',
    },
    {
      id: 'gruppe-c',
      label: 'Gruppe C — Smart Key und Keyless',
      description:
        'Fahrzeuge mit schlüssellosem Zugang und Start. Höherer Beschaffungs- und Programmieraufwand.',
    },
    {
      id: 'gruppe-d',
      label: 'Gruppe D — Sonderfälle',
      description:
        'Fahrzeuge mit geschütztem Zugang, Totalverlust oder Sonderausstattung. Immer manuelle Prüfung.',
    },
  ];
}

/** Leistungen im Autoschlüssel-Bereich. */
export function carKeyServices(): CarKeyService[] {
  return [
    {
      id: 'zweitschluessel',
      slug: 'zweitschluessel',
      label: 'Zweitschlüssel anfertigen',
      description:
        'Ein zusätzlicher Schlüssel, während mindestens ein funktionierender Schlüssel vorhanden ist.',
      requiresVehicleOnSite: true,
      keyKinds: ['mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless'],
      active: true,
    },
    {
      id: 'ersatz-bei-verlust',
      slug: 'ersatz-bei-verlust',
      label: 'Ersatzschlüssel bei Verlust',
      description:
        'Alle Schlüssel verloren oder beschädigt. Umfang und Machbarkeit werden vorab geprüft.',
      requiresVehicleOnSite: true,
      keyKinds: ['mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless'],
      active: true,
    },
    {
      id: 'programmierung',
      slug: 'programmierung',
      label: 'Schlüssel programmieren und anlernen',
      description:
        'Vorhandener oder neuer Schlüssel wird elektronisch am Fahrzeug angelernt.',
      requiresVehicleOnSite: true,
      keyKinds: ['funk', 'klappschluessel', 'smart-key', 'keyless'],
      active: true,
    },
    {
      id: 'bart-fraesen',
      slug: 'bart-fraesen',
      label: 'Schlüsselbart fräsen',
      description:
        'Mechanische Fertigung des Bartes nach Vorlage oder geeigneten Fahrzeugdaten.',
      requiresVehicleOnSite: false,
      keyKinds: ['mechanisch', 'funk', 'klappschluessel'],
      active: true,
    },
    {
      id: 'gehaeuse-reparatur',
      slug: 'gehaeuse-reparatur',
      label: 'Gehäuse, Tasten und Batterie',
      description:
        'Austausch von Gehäuse, Tasten oder Batterie. Die Elektronik bleibt erhalten.',
      requiresVehicleOnSite: false,
      keyKinds: ['funk', 'klappschluessel', 'smart-key'],
      active: true,
    },
    {
      id: 'fahrzeugoeffnung',
      slug: 'fahrzeugoeffnung',
      label: 'Fahrzeugöffnung',
      description:
        'Zerstörungsfreie Öffnung des Fahrzeugs bei ausgesperrtem Schlüssel.',
      requiresVehicleOnSite: true,
      keyKinds: ['mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless'],
      active: true,
    },
  ];
}

/**
 * Preisregeln je Fahrzeuggruppe und Leistung.
 *
 * Diese Werte sind Startwerte für den Betrieb und werden im Backend unter
 * „Preise & Termine“ gepflegt. Sie stehen nirgends fest in Seiten oder
 * Formularen.
 */
export function pricingRules(): PricingRule[] {
  const rules: PricingRule[] = [];

  const matrix: Array<{
    group: string;
    service: string;
    mode: 'fest' | 'rahmen' | 'pruefung';
    price?: number;
    from?: number;
    to?: number;
    deposit?: number;
    slot?: number;
    lead?: number;
    note?: string;
  }> = [
    // Gruppe A
    { group: 'gruppe-a', service: 'zweitschluessel', mode: 'fest', price: 14900, slot: 45 },
    { group: 'gruppe-a', service: 'ersatz-bei-verlust', mode: 'rahmen', from: 19900, to: 29900 },
    { group: 'gruppe-a', service: 'programmierung', mode: 'fest', price: 8900, slot: 30 },
    { group: 'gruppe-a', service: 'bart-fraesen', mode: 'fest', price: 4900, slot: 30 },
    { group: 'gruppe-a', service: 'gehaeuse-reparatur', mode: 'fest', price: 5900, slot: 30 },
    { group: 'gruppe-a', service: 'fahrzeugoeffnung', mode: 'rahmen', from: 9900, to: 18900, slot: 45 },
    // Gruppe B
    { group: 'gruppe-b', service: 'zweitschluessel', mode: 'fest', price: 24900, slot: 60 },
    { group: 'gruppe-b', service: 'ersatz-bei-verlust', mode: 'rahmen', from: 32900, to: 48900, slot: 90 },
    { group: 'gruppe-b', service: 'programmierung', mode: 'fest', price: 12900, slot: 45 },
    { group: 'gruppe-b', service: 'bart-fraesen', mode: 'fest', price: 6900, slot: 30 },
    { group: 'gruppe-b', service: 'gehaeuse-reparatur', mode: 'fest', price: 7900, slot: 30 },
    { group: 'gruppe-b', service: 'fahrzeugoeffnung', mode: 'rahmen', from: 12900, to: 22900, slot: 45 },
    // Gruppe C
    { group: 'gruppe-c', service: 'zweitschluessel', mode: 'rahmen', from: 39900, to: 64900, slot: 90, deposit: 7900 },
    { group: 'gruppe-c', service: 'ersatz-bei-verlust', mode: 'pruefung', slot: 120, deposit: 7900, lead: 10 },
    { group: 'gruppe-c', service: 'programmierung', mode: 'rahmen', from: 17900, to: 29900, slot: 60 },
    { group: 'gruppe-c', service: 'bart-fraesen', mode: 'fest', price: 8900, slot: 45 },
    { group: 'gruppe-c', service: 'gehaeuse-reparatur', mode: 'rahmen', from: 9900, to: 16900, slot: 45 },
    { group: 'gruppe-c', service: 'fahrzeugoeffnung', mode: 'rahmen', from: 14900, to: 26900, slot: 60 },
    // Gruppe D — grundsätzlich manuelle Prüfung
    {
      group: 'gruppe-d',
      service: 'zweitschluessel',
      mode: 'pruefung',
      slot: 120,
      deposit: 8000,
      lead: 10,
      note: 'Zugang über den Hersteller erforderlich. Wir prüfen Unterlagen und Machbarkeit vor der Terminbestätigung.',
    },
    { group: 'gruppe-d', service: 'ersatz-bei-verlust', mode: 'pruefung', slot: 150, deposit: 8000, lead: 14 },
    { group: 'gruppe-d', service: 'programmierung', mode: 'pruefung', slot: 90, deposit: 8000, lead: 10 },
    { group: 'gruppe-d', service: 'bart-fraesen', mode: 'pruefung', slot: 60 },
    { group: 'gruppe-d', service: 'gehaeuse-reparatur', mode: 'pruefung', slot: 60 },
    { group: 'gruppe-d', service: 'fahrzeugoeffnung', mode: 'pruefung', slot: 90 },
  ];

  for (const entry of matrix) {
    rules.push({
      id: `${entry.group}--${entry.service}`,
      pricingGroupId: entry.group,
      serviceId: entry.service,
      keyKind: 'alle',
      mode: entry.mode,
      priceCents: entry.price,
      priceFromCents: entry.from,
      priceToCents: entry.to,
      depositCents: entry.deposit,
      slotMinutes: entry.slot,
      leadTimeDays: entry.lead,
      note: entry.note,
    });
  }

  return rules;
}
