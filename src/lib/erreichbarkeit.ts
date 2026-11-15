import type { Erreichbarkeit, Settings } from '@/lib/types';

/**
 * Erreichbarkeit im Wortlaut des Inhabers (Arbeitsanweisung vom 11.11.2026, Abschnitt 23). Gilt, solange
 * in den Einstellungen nichts anderes gepflegt ist. Die Aussage verspricht Erreichbarkeit und Notdienst,
 * nicht ein rund um die Uhr geöffnetes Ladenlokal: Die Werkstatt arbeitet nach Termin.
 */
export const ERREICHBARKEIT_STANDARD: Erreichbarkeit = {
  kernaussage: '24 Stunden erreichbar',
  zeilen: ['Notdienst rund um die Uhr', 'Werkstatt und persönliche Beratung nach Terminvereinbarung'],
  rundUmDieUhr: true,
};

/** Gepflegte Erreichbarkeit oder der Standard; leere Zeilen fallen weg. */
export function erreichbarkeit(settings: Pick<Settings, 'reachability'>): Erreichbarkeit {
  const gepflegt = settings.reachability;
  const kernaussage = gepflegt?.kernaussage?.trim();
  if (!gepflegt || !kernaussage) return ERREICHBARKEIT_STANDARD;
  return {
    kernaussage,
    zeilen: (gepflegt.zeilen ?? []).map((zeile) => zeile.trim()).filter(Boolean),
    rundUmDieUhr: gepflegt.rundUmDieUhr === true,
  };
}

/** Alles in einem Satz, für Fließtext und Beschreibungen: „24 Stunden erreichbar. Notdienst rund um die Uhr. …“ */
export function erreichbarkeitSatz(angabe: Erreichbarkeit): string {
  return [angabe.kernaussage, ...angabe.zeilen].map((teil) => (/[.!?]$/.test(teil) ? teil : `${teil}.`)).join(' ');
}
