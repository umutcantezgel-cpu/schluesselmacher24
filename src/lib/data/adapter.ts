import type {
  BlockedDay,
  BusinessRecord,
  CityPage,
  CodeLine,
  CylinderCatalog,
  Guide,
  PageContent,
  PricingGroup,
  PricingRule,
  ServicePage,
  Settings,
  VehicleMake,
  CarKeyService,
} from '@/lib/types';

/**
 * Sammlungen, die im Backend gepflegt werden.
 * Wer die Datenhaltung austauschen will, implementiert nur dieses Interface.
 */
export interface Collections {
  settings: Settings;
  pricingGroups: PricingGroup[];
  pricingRules: PricingRule[];
  carKeyServices: CarKeyService[];
  vehicleMakes: VehicleMake[];
  codeLines: CodeLine[];
  cylinderCatalog: CylinderCatalog;
  servicePages: ServicePage[];
  pages: PageContent[];
  guides: Guide[];
  cities: CityPage[];
  blockedDays: BlockedDay[];
  records: BusinessRecord[];
}

export type CollectionName = keyof Collections;

/**
 * Datenschicht der Anwendung.
 *
 * Die Standardumsetzung liest und schreibt JSON-Dateien unter `content/`.
 * Für den Dauerbetrieb auf einer Plattform mit schreibgeschütztem
 * Dateisystem wird stattdessen ein Datenbank-Adapter eingesetzt — die
 * Aufrufer bleiben unverändert, weil sie nur dieses Interface kennen.
 */
export interface DataAdapter {
  read<K extends CollectionName>(name: K): Promise<Collections[K]>;
  write<K extends CollectionName>(name: K, value: Collections[K]): Promise<void>;
  /** Ob diese Umsetzung Schreibzugriffe unterstützt. */
  readonly writable: boolean;
  /** Kurzname für Diagnosezwecke im Backend. */
  readonly name: string;
}
