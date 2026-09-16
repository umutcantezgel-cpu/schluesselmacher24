import type { CarKeyService, ImageSlot, InfoHint, KeyKind } from '@/lib/types';

/* ==========================================================================
   Beschriftungen für den Autoschlüssel-Assistenten

   Hier stehen ausschließlich Bezeichnungen und Erklärungen zu den
   Aufzählungstypen aus src/lib/types.ts. Preise, Anzahlungen, Vorlaufzeiten
   und Fahrzeugdaten kommen aus der Datenschicht und tauchen hier nicht auf.
   ========================================================================== */

/** Reihenfolge, in der Schlüsselarten angeboten werden. */
export const KEY_KIND_ORDER: KeyKind[] = [
  'mechanisch',
  'funk',
  'klappschluessel',
  'smart-key',
  'keyless',
];

export interface KeyKindOption {
  label: string;
  description: string;
  info: InfoHint;
}

export const KEY_KIND_OPTIONS: Record<KeyKind, KeyKindOption> = {
  mechanisch: {
    label: 'Mechanischer Schlüssel',
    description: 'Schlüssel ohne Tasten und ohne Fernbedienung.',
    info: {
      title: 'Woran Sie einen mechanischen Schlüssel erkennen',
      body:
        'Der Schlüssel hat einen festen Bart und kein Tastenfeld. Er wird ins Schloss gesteckt und '
        + 'gedreht. Ob zusätzlich ein Transponder eingebaut ist, prüfen wir anhand Ihrer Fotos.',
      figure: {
        motif: 'Vergleichsfoto: mechanischer Autoschlüssel ohne Tasten, Bart sichtbar',
        ratio: '4/3',
      },
    },
  },
  funk: {
    label: 'Funkschlüssel',
    description: 'Schlüssel mit Tasten zum Ver- und Entriegeln.',
    info: {
      title: 'Woran Sie einen Funkschlüssel erkennen',
      body:
        'Auf dem Gehäuse sitzen Tasten für Auf- und Zuschließen. Der Bart ist fest mit dem Gehäuse '
        + 'verbunden und klappt nicht ein. Im Inneren sitzt zusätzlich ein Transponder für die Wegfahrsperre.',
      figure: {
        motif: 'Vergleichsfoto: Funkschlüssel mit festem Bart und Tastenfeld',
        ratio: '4/3',
      },
    },
  },
  klappschluessel: {
    label: 'Klappschlüssel',
    description: 'Der Bart klappt auf Knopfdruck aus dem Gehäuse.',
    info: {
      title: 'Woran Sie einen Klappschlüssel erkennen',
      body:
        'Ein Knopf an der Seite lässt den Bart aus dem Gehäuse springen. Zugeklappt ist vom Bart '
        + 'nichts zu sehen. Für die Fertigung brauchen wir ein Foto des ausgeklappten Bartes.',
      figure: {
        motif: 'Vergleichsfoto: Klappschlüssel einmal zugeklappt, einmal ausgeklappt',
        ratio: '4/3',
      },
    },
  },
  'smart-key': {
    label: 'Smart Key',
    description: 'Schlüssel, der in der Tasche bleiben kann; Start per Knopf.',
    info: {
      title: 'Woran Sie einen Smart Key erkennen',
      body:
        'Der Schlüssel muss nicht ins Zündschloss. Gestartet wird über einen Knopf im Fahrzeug. '
        + 'Im Gehäuse steckt meist ein kleiner Notschlüssel, der sich herausziehen lässt.',
      figure: {
        motif: 'Vergleichsfoto: Smart Key mit herausgezogenem Notschlüssel',
        ratio: '4/3',
      },
    },
  },
  keyless: {
    label: 'Keyless (schlüsselloser Zugang)',
    description: 'Fahrzeug öffnet und startet, sobald der Schlüssel in der Nähe ist.',
    info: {
      title: 'Woran Sie ein Keyless-System erkennen',
      body:
        'Das Fahrzeug entriegelt beim Anfassen des Türgriffs, ohne dass Sie eine Taste drücken. '
        + 'Diese Systeme sind aufwendiger in der Beschaffung und im Anlernen.',
      figure: {
        motif: 'Vergleichsfoto: Türgriff mit Sensorfläche für schlüssellosen Zugang',
        ratio: '4/3',
      },
    },
  },
};

/** Auswahl im Schritt „vorhandene Schlüssel“. */
export interface WorkingKeysOption {
  value: number;
  label: string;
  description: string;
}

export const WORKING_KEYS_OPTIONS: WorkingKeysOption[] = [
  {
    value: 0,
    label: 'Kein funktionierender Schlüssel',
    description: 'Alle Schlüssel sind verloren, defekt oder eingeschlossen.',
  },
  {
    value: 1,
    label: 'Ein funktionierender Schlüssel',
    description: 'Ein Schlüssel öffnet und startet das Fahrzeug noch.',
  },
  {
    value: 2,
    label: 'Zwei oder mehr funktionierende Schlüssel',
    description: 'Mehrere Schlüssel sind vorhanden und funktionieren.',
  },
];

export const WORKING_KEYS_INFO: InfoHint = {
  title: 'Warum diese Angabe wichtig ist',
  body:
    'Ist noch ein funktionierender Schlüssel vorhanden, lässt sich der Aufwand meist gut abschätzen. '
    + 'Ohne funktionierenden Schlüssel sind zusätzliche Arbeitsschritte nötig; wir nennen dann zuerst '
    + 'einen Preisrahmen und prüfen Ihren Fall.',
};

export const VIN_INFO: InfoHint = {
  title: 'Fahrgestellnummer (FIN)',
  body:
    'Die 17-stellige Fahrgestellnummer steht in der Zulassungsbescheinigung unter Feld E und oft '
    + 'sichtbar an der Windschutzscheibe. Die Angabe ist freiwillig. Sie hilft uns, den passenden '
    + 'Schlüssel eindeutig zuzuordnen, und ist nicht in jedem Fall erforderlich.',
};

/* ---------- Bildplätze für die Uploads ---------------------------------- */

export interface PhotoSlotDef {
  id: 'vorderseite' | 'rueckseite' | 'bart' | 'detail';
  label: string;
  description: string;
  example: ImageSlot;
  required: boolean;
}

export const KEY_PHOTO_SLOTS: PhotoSlotDef[] = [
  {
    id: 'vorderseite',
    label: 'Vorderseite des Schlüssels',
    description:
      'Tastenseite vollständig im Bild, von oben aufgenommen. Bitte auf einen einfarbigen '
      + 'Untergrund legen und ohne Blitz fotografieren.',
    example: {
      motif: 'Beispielfoto: Autoschlüssel von vorn, Tastenseite vollständig und scharf',
      ratio: '4/3',
      note: 'Eigene Aufnahme aus der Werkstatt, kein Herstellerbild.',
    },
    required: true,
  },
  {
    id: 'rueckseite',
    label: 'Rückseite des Schlüssels',
    description:
      'Rückseite mit allen Aufdrucken. Häufig stehen dort Hersteller- und Teilenummern, die wir '
      + 'für die Zuordnung brauchen.',
    example: {
      motif: 'Beispielfoto: Autoschlüssel von hinten mit lesbarer Kennzeichnung',
      ratio: '4/3',
      note: 'Eigene Aufnahme aus der Werkstatt, kein Herstellerbild.',
    },
    required: true,
  },
  {
    id: 'bart',
    label: 'Schlüsselbart beziehungsweise Spitze',
    description:
      'Bart von der Seite aufnehmen, sodass das Profil und die Fräsungen erkennbar sind. Bei einem '
      + 'Klappschlüssel bitte ausgeklappt fotografieren.',
    example: {
      motif: 'Beispielfoto: Schlüsselbart seitlich, Fräsprofil deutlich erkennbar',
      ratio: '4/3',
      note: 'Eigene Aufnahme aus der Werkstatt, kein Herstellerbild.',
    },
    required: true,
  },
  {
    id: 'detail',
    label: 'Nahaufnahme von Nummern oder Logos (freiwillig)',
    description:
      'Wenn auf dem Schlüssel Nummern, Buchstabenfolgen oder ein Logo stehen, hilft uns eine '
      + 'Nahaufnahme davon bei der Zuordnung.',
    example: {
      motif: 'Beispielfoto: Nahaufnahme der eingeprägten Nummern auf dem Schlüsselgehäuse',
      ratio: '4/3',
      note: 'Eigene Aufnahme aus der Werkstatt, kein Herstellerbild.',
    },
    required: false,
  },
];

export const REGISTRATION_EXAMPLE: ImageSlot = {
  motif: 'Beispielfoto: Zulassungsbescheinigung Teil I, vollständig im Bild und lesbar',
  ratio: '3/2',
  note: 'Nachgestelltes Musterdokument ohne echte Daten.',
};

/** Erklärung zu einer Leistung — aus den gepflegten Leistungsdaten gebaut. */
export function serviceInfo(service: CarKeyService): InfoHint {
  return {
    title: service.label,
    body:
      `${service.description} `
      + (service.requiresVehicleOnSite
        ? 'Für diese Leistung muss das Fahrzeug beim Termin verfügbar sein.'
        : 'Für diese Leistung ist das Fahrzeug beim Termin nicht zwingend nötig.'),
  };
}
