import type { VisualRef } from '@/lib/types';

/**
 * Ordnet einer Bildstelle ohne Foto eine passende Fachgrafik zu (KERN K-008):
 * Aus dem Motivtext („Werkstattfoto: Schlüsselfräse …“, „Schemazeichnung
 * Zentralschlossanlage“) wird ein Generator mit sachlichen Parametern. Die
 * Grafik erklärt die Sache, sie gibt sich nie als Foto aus. Liefert `null`,
 * wenn kein Generator passt – dann zeigt die Fläche ein Fach-Icon.
 */
export function visualFuerMotiv(motif: string | undefined | null): VisualRef | null {
  const voll = normalisieren(motif);
  if (!voll) return null;
  const t = ohneArt(voll);

  if (hat(t, 'fraes', 'bearbeitung')) {
    return { generator: 'profilschnitt', params: { beschriftung: false } };
  }
  if (hat(t, 'schliessanlage', 'schliessplan', 'hauptschluessel', 'zentralschloss', 'gruppenschluessel')) {
    const system = hat(t, 'zentral')
      ? 'zentral'
      : hat(t, 'general')
        ? 'generalhaupt'
        : hat(t, 'gleichschliess')
          ? 'gleichschliessung'
          : 'haupt';
    return { generator: 'schliessplan', params: { system } };
  }
  if (hat(t, 'sicherungskarte')) return { generator: 'code-fundstelle', params: { ort: 'sicherungskarte' } };
  /* Prägung = Nummer oder Code auf Kopf oder Zylinder (Beispielbilder an Upload-Feldern, E4-L-27). */
  if (hat(t, 'zylinderstirn', 'schluesselnummer', 'schluesselcode', 'code am', 'praegung')) {
    return { generator: 'code-fundstelle', params: { ort: hat(t, 'zylinder') ? 'zylinderstirn' : 'schluesselkopf' } };
  }
  if (hat(t, 'zutritt', 'transponderleser', 'leser', 'zugangskarte', 'chipkarte')) {
    const medium = hat(t, 'smartphone', 'handy') ? 'smartphone' : hat(t, 'karte') ? 'karte' : 'transponder';
    return { generator: 'zutritt-signal', params: { medium } };
  }
  if (hat(t, 'zylinder', 'messen', 'mass ', 'masse')) {
    const bauform = hat(t, 'knauf') ? 'knauf' : hat(t, 'halb') ? 'profil-halb' : 'profil-doppel';
    return { generator: 'zylinder-mass', params: { bauform } };
  }
  if (hat(t, 'tuer', 'beschlag', 'schloss', 'riegel', 'band') && !hat(t, 'fahrertuer', 'autotuer')) {
    return { generator: 'tuer-schutz', params: { nummern: false } };
  }
  if (hat(t, 'smart key', 'smart-key', 'keyless')) return { generator: 'schluessel', params: { typ: 'smart-key' } };
  if (hatFunk(t) || hat(t, 'fernbedienung')) return { generator: 'schluessel', params: { typ: 'funk' } };
  if (hat(t, 'klappschluessel')) return { generator: 'schluessel', params: { typ: 'klapp' } };
  if (hat(t, 'transponder')) return { generator: 'schluessel', params: { typ: 'transponder' } };
  if (hat(t, 'autoschluessel', 'fahrzeugschluessel')) return { generator: 'schluessel', params: { typ: 'funk' } };
  if (hat(t, 'schluessel', 'kopie', 'vorlage', 'rohling')) {
    return { generator: 'schluessel', params: { typ: 'zylinder', anzahl: hat(t, 'kopie', 'vorlage', 'zweit') ? 2 : 1 } };
  }
  /* Werkstatt ohne erkennbares Werkstück: der Profilschnitt als Zeichen der Werkstatt. */
  if (hat(voll, 'werkstatt')) return { generator: 'profilschnitt', params: { beschriftung: false } };
  return null;
}

/**
 * Liest eine Reihenfolge aus vorhandenem Text („erst sichern, dann prüfen, dann
 * bestellen“) und macht daraus die Ablaufzeichnung. Nur einzelne Wörter zählen,
 * zwei bis vier Schritte, sonst `null` – die Zeichnung zeigt nie mehr, als der Text sagt.
 */
export function ablaufAusText(text: string | undefined | null): VisualRef | null {
  if (typeof text !== 'string') return null;
  const treffer = /\berst (\p{L}+)((?:,? (?:und )?dann \p{L}+){1,3})(?=[\s.,;:!?]|$)/iu.exec(text);
  if (!treffer) return null;
  const weitere = [...treffer[2].matchAll(/dann (\p{L}+)/gu)].map((t) => t[1]);
  const schritte = [treffer[1], ...weitere].map((w) => w.toLowerCase());
  if (schritte.some((w) => w.length > 14)) return null;
  return { generator: 'ablauf', params: { schritte: schritte.join('|') } };
}

/** Name eines passenden Fach-Icons (Datei in `visual/icons/`) für kleine Flächen oder als Ersatz. */
export function fachIconFuerMotiv(motif: string | undefined | null): FachIconName {
  const voll = normalisieren(motif);
  const t = ohneArt(voll);
  if (hat(t, 'video', 'kamera')) return 'videoueberwachung';
  if (hat(t, 'panik')) return 'panik-alarmtaster';
  if (hat(t, 'alarm', 'melder')) return 'alarmtechnik';
  if (hat(t, 'aussenhaut')) return 'aussenhautsicherung';
  if (hat(t, 'mechanischer schutz', 'mechanische sicherung')) return 'mechanischer-schutz';
  if (hat(t, 'kombin')) return 'kombinierte-konzepte';
  if (hat(t, 'smart', 'funktionen')) return 'smarte-funktionen';
  if (hat(t, 'fahrzeugschein')) return 'foto-hochladen';
  if (hat(t, 'zylinder')) return 'profilzylinder';
  if (hat(t, 'tuer', 'beschlag', 'schloss')) return 'tuer-und-schliesstechnik';
  if (hat(t, 'paket', 'versand', 'artikel', 'produkt')) return 'versand-paket';
  if (hat(t, 'auto', 'fahrzeug') || hatFunk(t)) return 'autoschluessel';
  if (hat(t, 'schluessel', 'code')) return 'schluessel-kopieren';
  /* Ohne erkennbare Sache: Beispiel- und Anwendungsfotos zeigen das Foto-Symbol. */
  if (hat(voll, 'foto', 'aufnahme')) return 'foto-hochladen';
  return 'werkstatt';
}

export type FachIconName =
  | 'videoueberwachung'
  | 'alarmtechnik'
  | 'panik-alarmtaster'
  | 'aussenhautsicherung'
  | 'mechanischer-schutz'
  | 'kombinierte-konzepte'
  | 'smarte-funktionen'
  | 'foto-hochladen'
  | 'profilzylinder'
  | 'tuer-und-schliesstechnik'
  | 'versand-paket'
  | 'autoschluessel'
  | 'schluessel-kopieren'
  | 'werkstatt';

function normalisieren(text: string | undefined | null): string {
  if (typeof text !== 'string') return '';
  return ` ${text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

/**
 * Entfernt die vorangestellte Art der Bildstelle („Werkstattfoto:“, „Anwendungsfoto:“ …).
 * Sie beschreibt das spätere Foto, nicht die Sache; sonst entschiede „Werkstatt“ oder
 * „Foto“ über die Zeichnung statt des Motivs (Befund Kundschaft Welle E).
 */
function ohneArt(text: string): string {
  return text.replace(/^ [a-z]*(?:foto|bild|zeichnung|aufnahme) ?: ?/, ' ');
}

/** „Funk“ als Wort oder Wortanfang („Funkschlüssel“), aber nicht „Funktion“. */
function hatFunk(text: string): boolean {
  return /funk(?!tion)/.test(text);
}

function hat(text: string, ...woerter: string[]): boolean {
  return woerter.some((w) => text.includes(w));
}
