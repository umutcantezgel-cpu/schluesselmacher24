/*
 * Partnervertrag als PDF (E7-OPUS-01, G-39, E-44). Reine Daten wie vorgangsblatt.ts; gesetzt wird mit
 * erzeugePdf. Den Vertragstext liefert der Anwalt als Vorlage mit Platzhaltern ({{firma}} …); dieses
 * Modul setzt nur die Daten des Partnerbetriebs ein. Solange keine geprüfte Vorlage vorliegt, gilt die
 * eingebaute Gliederung ohne Rechtstext, und jedes Blatt trägt „Entwurf, nicht unterschreiben“ (R10).
 */

import type { Blatt, BlattAbschnitt, BlattZeile } from './blatt';

/** Platzhalter, die eine Vorlage verwenden darf, mit Bedeutung (für die Anleitung an den Anwalt). */
export const PARTNERVERTRAG_PLATZHALTER = {
  firma: 'Firma des Partnerbetriebs',
  ansprechperson: 'Ansprechperson des Partnerbetriebs',
  ort: 'Ort des Partnerbetriebs',
  email: 'E-Mail des Partnerbetriebs',
  telefon: 'Telefon des Partnerbetriebs',
  kennung: 'Kennung des Partnerbetriebs',
  einsatzgebiet: 'Postleitzahlen und Umkreis',
  auftragsarten: 'vereinbarte Auftragsarten, kommagetrennt',
  abrechnungsmodell: 'Abrechnungsmodell in Worten',
  anbieter: 'Firma von SCHLÜSSELMACHER24 laut Einstellungen',
  anbieter_anschrift: 'Anschrift von SCHLÜSSELMACHER24 laut Einstellungen',
  datum: 'Datum der Erstellung (TT.MM.JJJJ)',
} as const;

export type PartnervertragPlatzhalter = keyof typeof PARTNERVERTRAG_PLATZHALTER;

export interface PartnervertragVorlage {
  titel: string;
  /** Stand der Vorlage, wie der Anwalt ihn angibt, etwa „Fassung vom 01.12.2026“. */
  fassung: string;
  /** Erst `true`, wenn der Anwalt die Vorlage freigegeben hat; sonst ist jedes Blatt ein Entwurf. */
  geprueft: boolean;
  abschnitte: { titel: string; text: string }[];
}

/**
 * Eingebaute Gliederung ohne Rechtstext. Sie zeigt, welche Daten der Vertrag tragen wird, und ersetzt
 * keine Vorlage des Anwalts.
 */
export const PARTNERVERTRAG_VORLAGE_PLATZHALTER: PartnervertragVorlage = {
  titel: 'Partnervertrag',
  fassung: 'Gliederung ohne Rechtstext, Vorlage des Anwalts fehlt',
  geprueft: false,
  abschnitte: [
    {
      titel: 'Vertragsparteien',
      text: '{{anbieter}}, {{anbieter_anschrift}}\nund\n{{firma}}, {{ort}} (Kennung {{kennung}}), vertreten durch {{ansprechperson}}',
    },
    {
      titel: 'Gegenstand',
      text: '[Platzhalter: Text des Anwalts zum Gegenstand der Vermittlung.]',
    },
    {
      titel: 'Einsatzgebiet und Auftragsarten',
      text: 'Einsatzgebiet: {{einsatzgebiet}}\nAuftragsarten: {{auftragsarten}}\n[Platzhalter: Text des Anwalts zu Einsatzgebiet und Annahme von Aufträgen.]',
    },
    {
      titel: 'Abrechnung',
      text: 'Abrechnungsmodell: {{abrechnungsmodell}}\n[Platzhalter: Text des Anwalts zur Abrechnung. Die Provisionssätze stehen in der Anlage.]',
    },
    {
      titel: 'Pflichten, Haftung, Datenschutz',
      text: '[Platzhalter: Text des Anwalts.]',
    },
    {
      titel: 'Laufzeit und Kündigung',
      text: '[Platzhalter: Text des Anwalts.]',
    },
    {
      titel: 'Partner-AGB',
      text: 'Es gelten die Partner-AGB von {{anbieter}}. [Platzhalter: Die Partner-AGB liegen noch nicht vor; Fassung und Fundstelle ergänzt der Anwalt.]',
    },
  ],
};

export const PARTNERVERTRAG_ENTWURF_HINWEIS = 'Entwurf zur anwaltlichen Prüfung, nicht unterschreiben.';

const AUFTRAGSART_NAMEN: Record<string, string> = {
  'autoschluessel-vor-ort': 'Autoschlüssel vor Ort',
  'schluesseldienst-vor-ort': 'Schlüsseldienst vor Ort (Tür, Schloss, Zylinder)',
  'montage-zylinder': 'Montage Zylinder',
  'montage-schliessanlage': 'Montage Schließanlage',
  'beratung-vor-ort': 'Beratung vor Ort',
  'einbau-elektronik': 'Einbau elektronischer Systeme',
};

const MODELL_NAMEN: Record<string, string> = {
  A: 'A: Der Partner rechnet mit dem Kunden ab, SCHLÜSSELMACHER24 stellt die Provision in Rechnung',
  B: 'B: Der Kunde zahlt an SCHLÜSSELMACHER24, der Partner erhält den Betrag abzüglich Provision',
};

/** Die Felder des Partnerbetriebs, die der Vertrag braucht (Ausschnitt aus der Sammlung). */
export interface PartnervertragPartner {
  id: number | string;
  kennung?: string | null;
  firma: string;
  ansprechpartner?: string | null;
  ort: string;
  email?: string | null;
  telefon?: string | null;
  abrechnungsmodell?: string | null;
  einsatzgebiet?: {
    postleitzahlen?: string | null;
    radiusKm?: number | null;
  } | null;
  auftragsarten?: string[] | null;
  provisionen?: { auftragsart: string; prozent?: number | null }[] | null;
}

export interface PartnervertragAnbieter {
  legalName: string;
  street: string;
  postalCode: string;
  city: string;
}

const PLATZHALTER_MUSTER = /\{\{\s*([a-z_]+)\s*\}\}/g;
const OFFEN = '[fehlt]';

function datumText(d: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  }).format(d);
}

function einsatzgebietText(e: PartnervertragPartner['einsatzgebiet']): string {
  const teile = [
    e?.postleitzahlen?.trim() ? `Postleitzahlen ${e.postleitzahlen.trim()}` : '',
    typeof e?.radiusKm === 'number' ? `Umkreis ${e.radiusKm} km` : '',
  ].filter(Boolean);
  return teile.join(', ');
}

/** Werte je Platzhalter; leere Angaben bleiben leer und werden beim Einsetzen als fehlend gemeldet. */
export function partnervertragWerte(partner: PartnervertragPartner, anbieter: PartnervertragAnbieter, jetzt: Date): Record<PartnervertragPlatzhalter, string> {
  return {
    firma: partner.firma?.trim() ?? '',
    ansprechperson: partner.ansprechpartner?.trim() ?? '',
    ort: partner.ort?.trim() ?? '',
    email: partner.email?.trim() ?? '',
    telefon: partner.telefon?.trim() ?? '',
    kennung: partner.kennung?.trim() || String(partner.id),
    einsatzgebiet: einsatzgebietText(partner.einsatzgebiet),
    auftragsarten: (partner.auftragsarten ?? []).map((a) => AUFTRAGSART_NAMEN[a] ?? a).join(', '),
    abrechnungsmodell: MODELL_NAMEN[partner.abrechnungsmodell ?? 'A'] ?? '',
    anbieter: anbieter.legalName?.trim() ?? '',
    anbieter_anschrift: [anbieter.street, [anbieter.postalCode, anbieter.city].filter(Boolean).join(' ')].filter((t) => t?.trim()).join(', '),
    datum: datumText(jetzt),
  };
}

/**
 * Setzt Werte in einen Text ein. Unbekannte Platzhalter bleiben sichtbar stehen, leere Werte werden zu
 * „[fehlt]“; beides wird gemeldet, damit niemand einen lückenhaften Vertrag verschickt.
 */
export function platzhalterEinsetzen(text: string, werte: Partial<Record<string, string>>): { text: string; fehlend: string[]; unbekannt: string[] } {
  const fehlend = new Set<string>();
  const unbekannt = new Set<string>();
  const ergebnis = text.replace(PLATZHALTER_MUSTER, (ganz, name: string) => {
    if (!(name in PARTNERVERTRAG_PLATZHALTER)) {
      unbekannt.add(name);
      return ganz;
    }
    const wert = werte[name]?.trim();
    if (!wert) {
      fehlend.add(name);
      return OFFEN;
    }
    return wert;
  });
  return { text: ergebnis, fehlend: [...fehlend], unbekannt: [...unbekannt] };
}

export interface PartnervertragErgebnis {
  blatt: Blatt;
  entwurf: boolean;
  fehlend: string[];
  unbekannt: string[];
}

export function partnervertragDateiname(partner: Pick<PartnervertragPartner, 'id' | 'kennung'>, entwurf: boolean): string {
  const kennung = (partner.kennung?.trim() || `P-${partner.id}`).replace(/[^A-Za-z0-9-]/g, '');
  return `Partnervertrag-${kennung}${entwurf ? '-Entwurf' : ''}.pdf`;
}

/**
 * Vertrag als Blatt. Ein Entwurf ist es, wenn die Vorlage nicht geprüft ist oder Angaben fehlen; dann
 * steht der Hinweis im Kopf, in jedem Abschnitt der Gliederung und in der Fußzeile jeder Seite.
 */
export function partnervertragBlatt({
  partner,
  anbieter,
  vorlage = PARTNERVERTRAG_VORLAGE_PLATZHALTER,
  jetzt = new Date(),
}: {
  partner: PartnervertragPartner;
  anbieter: PartnervertragAnbieter;
  vorlage?: PartnervertragVorlage;
  jetzt?: Date;
}): PartnervertragErgebnis {
  const werte = partnervertragWerte(partner, anbieter, jetzt);
  const fehlend = new Set<string>();
  const unbekannt = new Set<string>();

  const abschnitte: BlattAbschnitt[] = vorlage.abschnitte.map((a) => {
    const r = platzhalterEinsetzen(a.text, werte);
    r.fehlend.forEach((f) => fehlend.add(f));
    r.unbekannt.forEach((u) => unbekannt.add(u));
    return { titel: a.titel, text: r.text };
  });

  const provisionen = (partner.provisionen ?? []).filter((p) => typeof p.prozent === 'number');
  abschnitte.push({
    titel: 'Anlage: Provision je Auftragsart',
    ...(provisionen.length
      ? {
          tabelle: {
            kopf: ['Auftragsart', 'Provision'],
            breiten: [0.7, 0.3],
            rechts: [1],
            zeilen: provisionen.map((p) => [AUFTRAGSART_NAMEN[p.auftragsart] ?? p.auftragsart, `${String(p.prozent).replace('.', ',')} %`]),
          },
        }
      : {
          text: 'Noch keine Sätze eingetragen. Der Inhaber trägt sie am Partnerbetrieb ein.',
        }),
  });
  abschnitte.push({
    titel: 'Unterschriften',
    text: `Ort, Datum, Unterschrift ${werte.anbieter || 'SCHLÜSSELMACHER24'}\n\n\n________________________________\n\nOrt, Datum, Unterschrift ${werte.firma || 'Partnerbetrieb'}\n\n\n________________________________\n\nBitte unterschreiben und an uns zurückgeben.`,
  });

  const entwurf = !vorlage.geprueft || fehlend.size > 0 || unbekannt.size > 0;
  const kopf: BlattZeile[] = [
    { name: 'Partnerbetrieb', wert: werte.firma || OFFEN, betont: true },
    { name: 'Vorlage', wert: vorlage.fassung },
    { name: 'Erstellt am', wert: werte.datum },
  ];
  if (entwurf)
    kopf.unshift({
      name: 'Stand',
      wert: PARTNERVERTRAG_ENTWURF_HINWEIS,
      betont: true,
    });
  if (fehlend.size)
    kopf.push({
      name: 'Fehlende Angaben',
      wert: [...fehlend].map((f) => PARTNERVERTRAG_PLATZHALTER[f as PartnervertragPlatzhalter]).join(', '),
    });
  if (unbekannt.size)
    kopf.push({
      name: 'Unbekannte Platzhalter',
      wert: [...unbekannt].join(', '),
      mono: true,
    });

  return {
    blatt: {
      titel: entwurf ? `${vorlage.titel} (Entwurf)` : vorlage.titel,
      nummer: werte.kennung,
      stand: jetzt,
      kopf,
      abschnitte,
      fuss: entwurf ? `${vorlage.titel} · ${PARTNERVERTRAG_ENTWURF_HINWEIS}` : `${vorlage.titel} · ${vorlage.fassung}`,
    },
    entwurf,
    fehlend: [...fehlend],
    unbekannt: [...unbekannt],
  };
}
