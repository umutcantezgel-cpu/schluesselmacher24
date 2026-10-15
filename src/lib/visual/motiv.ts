import type { VisualRef } from '@/lib/types';

/**
 * Ordnet einer Bildstelle ohne Foto eine passende Fachgrafik zu (KERN K-008):
 * Aus dem Motivtext („Werkstattfoto: Schlüsselfräse …“, „Schemazeichnung
 * Zentralschlossanlage“) wird ein Generator mit sachlichen Parametern. Die
 * Grafik erklärt die Sache, sie gibt sich nie als Foto aus. Liefert `null`,
 * wenn kein Generator passt – dann zeigt die Fläche ein Fach-Icon.
 */
export function visualFuerMotiv(motif: string | undefined | null): VisualRef | null {
  const t = normalisieren(motif);
  if (!t) return null;

  if (hat(t, 'fraes', 'werkstatt', 'bearbeitung')) {
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
  if (hat(t, 'zylinderstirn', 'schluesselnummer', 'schluesselcode', 'code am')) {
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
  if (hat(t, 'tuer', 'beschlag', 'schloss', 'riegel', 'band')) {
    return { generator: 'tuer-schutz', params: { nummern: false } };
  }
  if (hat(t, 'smart key', 'smart-key', 'keyless')) return { generator: 'schluessel', params: { typ: 'smart-key' } };
  if (hat(t, 'funk', 'fernbedienung')) return { generator: 'schluessel', params: { typ: 'funk' } };
  if (hat(t, 'klappschluessel')) return { generator: 'schluessel', params: { typ: 'klapp' } };
  if (hat(t, 'transponder')) return { generator: 'schluessel', params: { typ: 'transponder' } };
  if (hat(t, 'autoschluessel', 'fahrzeugschluessel')) return { generator: 'schluessel', params: { typ: 'funk' } };
  if (hat(t, 'schluessel', 'kopie', 'vorlage', 'rohling')) {
    return { generator: 'schluessel', params: { typ: 'zylinder', anzahl: hat(t, 'kopie', 'vorlage', 'zweit') ? 2 : 1 } };
  }
  return null;
}

/** Name eines passenden Fach-Icons (Datei in `visual/icons/`) für kleine Flächen oder als Ersatz. */
export function fachIconFuerMotiv(motif: string | undefined | null): FachIconName {
  const t = normalisieren(motif);
  if (hat(t, 'video', 'kamera')) return 'videoueberwachung';
  if (hat(t, 'alarm', 'melder')) return 'alarmtechnik';
  if (hat(t, 'fahrzeugschein')) return 'foto-hochladen';
  if (hat(t, 'zylinder')) return 'profilzylinder';
  if (hat(t, 'tuer', 'beschlag', 'schloss')) return 'tuer-und-schliesstechnik';
  if (hat(t, 'paket', 'versand', 'artikel', 'produkt')) return 'versand-paket';
  if (hat(t, 'auto', 'fahrzeug', 'funk')) return 'autoschluessel';
  if (hat(t, 'schluessel', 'code')) return 'schluessel-kopieren';
  if (hat(t, 'foto', 'aufnahme')) return 'foto-hochladen';
  return 'werkstatt';
}

export type FachIconName =
  | 'videoueberwachung'
  | 'alarmtechnik'
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

function hat(text: string, ...woerter: string[]): boolean {
  return woerter.some((w) => text.includes(w));
}
