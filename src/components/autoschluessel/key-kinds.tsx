import type { InfoHint, KeyKind } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

/* ==========================================================================
   Beschriftungen für die Schlüsselarten aus dem Datenmodell.
   Hier stehen nur Anzeigetexte zu den Werten des Typs `KeyKind` —
   keine Preise, keine Fahrzeugdaten.
   ========================================================================== */

const LABELS: Record<KeyKind, string> = {
  mechanisch: 'Mechanischer Schlüssel',
  funk: 'Funkschlüssel',
  klappschluessel: 'Klappschlüssel',
  'smart-key': 'Smart Key',
  keyless: 'Keyless',
};

const SHORT_LABELS: Record<KeyKind, string> = {
  mechanisch: 'Mechanisch',
  funk: 'Funk',
  klappschluessel: 'Klappschlüssel',
  'smart-key': 'Smart Key',
  keyless: 'Keyless',
};

const DESCRIPTIONS: Record<KeyKind, string> = {
  mechanisch:
    'Schlüssel mit Bart und ohne Tasten am Griff. Türen und Zündschloss werden mechanisch bedient.',
  funk:
    'Schlüssel mit Tasten zum Ver- und Entriegeln. Der Bart kann fest am Gehäuse sitzen.',
  klappschluessel:
    'Der Bart klappt auf Knopfdruck aus dem Gehäuse. Funkteil und Bart sitzen in einem Gehäuse.',
  'smart-key':
    'Schlüssel ohne herausstehenden Bart, der vom Fahrzeug in der Nähe erkannt wird. Häufig mit einem kleinen Notschlüssel im Gehäuse.',
  keyless:
    'Öffnen und Starten, ohne den Schlüssel in die Hand zu nehmen, solange er sich am Fahrzeug befindet.',
};

/** Anzeigename einer Schlüsselart. Unbekannte Werte werden unverändert gezeigt. */
export function keyKindLabel(kind: KeyKind | string): string {
  return LABELS[kind as KeyKind] ?? kind;
}

/** Kurzform für Tabellen und Auflistungen. */
export function keyKindShortLabel(kind: KeyKind | string): string {
  return SHORT_LABELS[kind as KeyKind] ?? kind;
}

/** Erklärung einer Schlüsselart in einem Satz. */
export function keyKindDescription(kind: KeyKind | string): string | undefined {
  return DESCRIPTIONS[kind as KeyKind];
}

/** Erklärung hinter dem Info-Symbol, überall gleich formuliert. */
export const KEY_KIND_HINT: InfoHint = {
  title: 'Was bedeuten die Schlüsselarten?',
  body:
    'Autoschlüssel unterscheiden sich in zwei Punkten: im mechanischen Bart und in der Elektronik. '
    + 'Mechanisch, Funk und Klappschlüssel haben einen sichtbaren Bart. Smart Key und Keyless werden '
    + 'vom Fahrzeug auf kurze Entfernung erkannt. Welche Art Ihr Fahrzeug tatsächlich hat, sehen wir '
    + 'auf Ihren Schlüsselfotos.',
  figure: {
    motif: 'Vergleichsfoto: mechanischer Schlüssel, Klappschlüssel und Smart Key nebeneinander',
    ratio: '3/2',
    note: 'Eigene Aufnahme aus der Werkstatt, alle drei Bauformen im gleichen Maßstab.',
  },
};

/** Erklärung zur Angabe „Fahrzeug vor Ort“. */
export const ON_SITE_HINT: InfoHint = {
  title: 'Warum das Fahrzeug vor Ort sein muss',
  body:
    'Ein Schlüssel muss dem Fahrzeug elektronisch bekannt gemacht werden. Dieser Schritt läuft über '
    + 'die Diagnoseschnittstelle und setzt voraus, dass das Fahrzeug bei uns steht. Rein mechanische '
    + 'Arbeiten am Bart sind davon nicht betroffen.',
};

/** Schlüsselarten als Kennzeichnungen. */
export function KeyKindBadges({
  kinds,
  className,
}: {
  kinds: KeyKind[];
  className?: string;
}) {
  if (kinds.length === 0) {
    return (
      <span className="text-[13px] text-foreground-muted">
        [Platzhalter: Schlüsselarten noch nicht erfasst]
      </span>
    );
  }

  return (
    <ul className={className ? `flex flex-wrap gap-1.5 ${className}` : 'flex flex-wrap gap-1.5'}>
      {kinds.map((kind) => (
        <li key={kind}>
          <Badge tone="outline">{keyKindShortLabel(kind)}</Badge>
        </li>
      ))}
    </ul>
  );
}
