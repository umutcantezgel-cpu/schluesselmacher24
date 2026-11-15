import { erreichbarkeit } from '@/lib/erreichbarkeit';
import { kontakt } from '@/lib/rechtliches/firma';
import type { Erreichbarkeit, Settings } from '@/lib/types';

/**
 * Telefon und Erreichbarkeit für die Hilfe in den Formularen (FA Abschnitt 26: Telefon und Hilfe an
 * kritischen Stellen). Die Seite holt beides auf dem Server aus den Einstellungen und gibt es dem
 * Formular mit; ohne veröffentlichte Nummer entfällt die Telefonzeile.
 */
export interface HilfeKontakt {
  telefon?: string;
  erreichbarkeit?: Erreichbarkeit;
}

/** Nur veröffentlichte, gepflegte Angaben; die Erreichbarkeit im Wortlaut des Inhabers (FA-23). */
export function hilfeAus(settings: Pick<Settings, 'company' | 'reachability'>): HilfeKontakt {
  return { telefon: kontakt(settings.company).telefon, erreichbarkeit: erreichbarkeit(settings) };
}
