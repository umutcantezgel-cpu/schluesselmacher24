/* ==========================================================================
   Rubrik Customizing (FA-SHOP-02B, Punkt 3; FA-14-05 bis FA-14-11): Texte
   der Seite an einer Stelle, damit Tests sie prüfen können. Keine konkreten
   Fahrzeuge oder Gehäuse ohne Beleg (R4); die Beispielidee des Inhabers
   steht als allgemeine Erklärung, bis echte Umbau-Beispiele gepflegt sind.
   ========================================================================== */

export const CUSTOMIZING_PFAD = '/autoschluessel/customizing';

/** Kurztext im Seitenkopf, zugleich Beschreibung der Leistung in den Strukturdaten. */
export const CUSTOMIZING_KURZTEXT =
  'Ihr Schlüssel in neuer Optik oder in einer neueren Gehäuseform. Ob das bei Ihrem Schlüssel geht, prüfen wir vorher anhand Ihrer Fotos.';

/** Satz gegen falsche Erwartungen im Wortlaut des Inhabers (Arbeitsanweisung, Abschnitt 14). */
export const KEINE_FALSCHEN_VERSPRECHEN =
  'Keine falschen Versprechen: Optischer Umbau nur dort anbieten, wo Elektronik, Transponder, Tasten und Bart technisch passend übernommen werden können.';

/**
 * Einleitung des Satzes für Kunden: Der Wortlaut ist eine Anweisung an den Betrieb und steht darum als
 * Grundsatz da. Ob der Satz für Kunden umformuliert wird, entscheidet der Inhaber (offene Frage).
 */
export const GRUNDSATZ_EINLEITUNG = 'Unser Grundsatz:';

/**
 * Die Gehäuse-Anfrage nimmt die Leistung noch nicht als Angabe mit (offene Frage: Adressparameter
 * `leistung`). Bis dahin nennt der Kunde sie in der Beschreibung.
 */
export const ANFRAGE_LEISTUNG_NENNEN = 'Schreiben Sie in der Anfrage, dass Sie einen Umbau wünschen.';

/** Was möglich ist; die Beispielidee des Inhabers als allgemeine Erklärung. */
export const MOEGLICH: ReadonlyArray<{ titel: string; satz: string }> = [
  {
    titel: 'Optische Erneuerung',
    satz: 'Ein abgenutztes oder beschädigtes Gehäuse wird durch ein neues ersetzt. Die Technik Ihres Schlüssels bleibt, wenn sie in das neue Gehäuse passt.',
  },
  {
    titel: 'Umbau in eine neuere Gehäuseform',
    satz: 'Ein älterer Fahrzeugschlüssel bekommt eine neuere Gehäuseform und eine modernere Optik.',
  },
];

/** Was übernommen werden muss, damit ein Umbau geht. */
export const BEDINGUNGEN: ReadonlyArray<{ titel: string; satz: string }> = [
  { titel: 'Elektronik', satz: 'Die Platine Ihres Schlüssels muss in das neue Gehäuse passen und dort sicher sitzen.' },
  { titel: 'Transponder', satz: 'Der Transponder muss mit umziehen, sonst startet das Fahrzeug nicht.' },
  { titel: 'Tasten', satz: 'Tasten im neuen Gehäuse müssen die Kontakte der Platine treffen.' },
  { titel: 'Bart', satz: 'Der Schlüsselbart muss in das neue Gehäuse passen oder neu gefräst werden können.' },
];

/* Wie die Prüfung läuft (Fotos, Fahrzeug, Schlüsseltyp, Rückmeldung), steht als Ablauf in den Rubrikdaten
   (Rubrik „customizing“, content/rubriken.json), damit der Betrieb ihn im Admin pflegen kann. */
