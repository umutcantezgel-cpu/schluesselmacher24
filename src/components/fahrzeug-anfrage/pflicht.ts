/*
 * Pflichtunterlagen der gemeinsamen Anfrage aus der einen Pflichtregel (FA-KERN-02B, A-048). Nur auf dem
 * Server genutzt (Seiten): Die Regel bekommt einen leeren Fall ohne Dateien und ohne Beschreibung und
 * nennt damit alles, was sie verlangt. So steht die Liste auf Einstiegsseite und im Formular nie von Hand
 * abgeschrieben, und eine Änderung der Regel erscheint überall zugleich.
 */

import { ANFRAGE_KLASSEN_DATEN, ERSATZNACHWEISE, type FormularKlasse, type RollerNachweis } from '@/lib/fahrzeuge/anfrage-klassen';
import { fehlendeFahrzeugUnterlagen, type FehlendeUnterlage } from '@/lib/server/unterlagen-pflicht';

import type { PflichtTabelle, SchluesselStand } from './kern';

/** Was die Regel im Fall verlangt, wenn noch nichts vorliegt. */
export function pflichtListe(klasse: FormularKlasse, roller: RollerNachweis | null, schluessel: SchluesselStand): FehlendeUnterlage[] {
  return fehlendeFahrzeugUnterlagen({ klasse, roller, keinSchluesselMehr: schluessel === 'keiner', beschreibung: '' }, [], false);
}

/** Tabelle für das Formular: je Nachweisweg und Schlüsselstand die Liste der Regel. */
export function pflichtTabelle(klasse: FormularKlasse): PflichtTabelle {
  const zeile = (roller: RollerNachweis) => ({
    vorhanden: pflichtListe(klasse, klasse === 'roller' ? roller : null, 'vorhanden'),
    keiner: pflichtListe(klasse, klasse === 'roller' ? roller : null, 'keiner'),
  });
  return { zulassung: zeile('zulassung'), versicherungskennzeichen: zeile('versicherungskennzeichen') };
}

/**
 * Die Liste in Sätzen für Einstiegsseiten und den Unterlagenschritt: Die drei Fotos stehen als ein Punkt,
 * die Art des Nachweises steht beim Nachweis.
 */
export function pflichtPunkte(klasse: FormularKlasse, liste: readonly FehlendeUnterlage[]): string[] {
  const punkte: string[] = [];
  const arten = ANFRAGE_KLASSEN_DATEN[klasse].ersatznachweise.map((art) => ERSATZNACHWEISE[art].titel);
  for (const eintrag of liste) {
    switch (eintrag) {
      case 'fahrzeugschein':
        punkte.push('Fahrzeugschein (Zulassungsbescheinigung Teil I)');
        break;
      case 'ersatznachweis':
        punkte.push(`Ein Nachweis statt Fahrzeugschein: ${arten.length > 1 ? `${arten.slice(0, -1).join(', ')} oder ${arten.at(-1)}` : arten[0]}`);
        break;
      case 'typenschild':
        // Die Regel nimmt auch die Bestätigung „kein Typenschild“ an (unterlagen-pflicht.ts, keinTypenschild).
        punkte.push('Ein Foto des Typenschilds oder die Fahrzeug-Identifizierungsnummer. Hat Ihr Fahrzeug keines, sagen Sie es uns in der Anfrage.');
        break;
      case 'schloss-angaben':
        punkte.push('Hersteller und Schlüsselnummer des Schlosses');
        break;
      case 'schluessel-vorderseite':
        punkte.push('Drei Fotos Ihres Schlüssels: Vorderseite, Rückseite und Spitze beziehungsweise Profil von vorne');
        break;
      case 'beschreibung':
        punkte.push('Eine kurze Beschreibung Ihres Anliegens');
        break;
      // Art des Nachweises steht beim Nachweis, Rückseite und Spitze beim ersten Foto.
      case 'ersatznachweis-art':
      case 'schluessel-rueckseite':
      case 'schluessel-spitze':
        break;
    }
  }
  return punkte;
}
