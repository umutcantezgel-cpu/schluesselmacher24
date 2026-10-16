import type { InfoHint, LockSystemExplainer } from '@/lib/types';
import type { SchliessDetail, SchliessSystem } from '@/components/visual/interaktiv/schliessplan-interaktiv';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { Reveal } from '@/components/visual/motion/reveal';

/**
 * Ein Schließsystem in Kundensprache.
 *
 * Erweitert den Typ aus der Datenschicht um die Spalten der
 * Vergleichstabelle. Sobald es eine Sammlung für Schließsysteme gibt,
 * kommen diese Angaben aus der Datenschicht statt aus dieser Datei.
 */
export interface LockSystemEntry extends LockSystemExplainer {
  /** Wer welche Tür öffnet — Spalte der Vergleichstabelle. */
  opensWhat: string;
  /** Typische Einsatzfälle — Spalte der Vergleichstabelle. */
  typicalFor: string;
  /** Erweiterbarkeit — Spalte der Vergleichstabelle. */
  expandable: string;
  /** Erklärung hinter dem Info-Symbol. */
  info: InfoHint;
  /** Kurze Merkpunkte unter der Erklärung. */
  bullets: string[];
}

/**
 * Die fünf Systeme aus dem Leitfaden. Die Langform steht immer zuerst,
 * die Abkürzung folgt in Klammern — Vorwissen wird nicht vorausgesetzt.
 */
export const LOCK_SYSTEMS: LockSystemEntry[] = [
  {
    id: 'gleichschliessung',
    label: 'Gleichschließung',
    short: '',
    explanation:
      'Alle Zylinder der Anlage haben dieselbe Schließung. Ein einziger Schlüssel sperrt jede '
      + 'Tür, die dazugehört. Es gibt keine Rangfolge und keine Unterscheidung zwischen '
      + 'Personen: Wer den Schlüssel hat, kommt überall hinein.',
    suitableFor:
      'Einfamilienhaus, Wohnung mit Keller und Garage, kleine Einheiten mit wenigen Türen und '
      + 'nur einer Nutzergruppe.',
    opensWhat: 'Jeder Schlüssel öffnet jede Tür der Anlage.',
    typicalFor: 'Haus, Wohnung, Garage, Gartenhaus',
    expandable: 'Begrenzt — weitere Zylinder in derselben Schließung sind möglich.',
    info: {
      title: 'Gleichschließung',
      body:
        'Gleichschließend heißt: gleiche Schließung in allen Zylindern. Das ist die einfachste '
        + 'Form und noch kein Schließplan mit Ebenen. Wenn später einzelne Personen nur einzelne '
        + 'Türen öffnen sollen, reicht eine Gleichschließung nicht mehr aus.',
      figure: {
        motif: 'Schemazeichnung Gleichschließung: ein Schlüssel, Linien zu allen Türen',
        ratio: '4/3',
      },
    },
    bullets: [
      'Ein Schlüsselprofil für alle Türen',
      'Keine Berechtigungsstufen',
      'Schnell geplant, wenige Angaben nötig',
    ],
    figure: {
      motif: 'Schemazeichnung Gleichschließung: ein Schlüsselsymbol, Pfeile zu vier gleichen Türen',
      ratio: '4/3',
      visual: { generator: 'schliessplan', params: { system: 'gleichschliessung', tueren: 3 } },
      note: 'Einfache technische Zeichnung, beschriftet, ohne Fotomaterial.',
    },
  },
  {
    id: 'z',
    label: 'Zentralschlossanlage',
    short: 'Z',
    explanation:
      'Jede Partei erhält einen eigenen Schlüssel, der nur die eigene Tür öffnet. Zusätzlich '
      + 'öffnen alle diese Schlüssel die gemeinsam genutzten Türen — zum Beispiel Hauseingang, '
      + 'Keller, Müllraum oder Fahrradraum. Einen Schlüssel, der alle Wohnungen öffnet, gibt es '
      + 'in diesem System nicht.',
    suitableFor:
      'Mehrfamilienhaus und Wohnanlage: mehrere Parteien, eigene Türen, gemeinsame Zugänge.',
    opensWhat:
      'Eigener Schlüssel: eigene Tür plus alle gemeinsamen Türen. Kein übergeordneter Schlüssel.',
    typicalFor: 'Mehrfamilienhaus, Wohnanlage, Bürogemeinschaft',
    expandable: 'Ja, wenn der Schließplan Reserven für weitere Parteien vorsieht.',
    info: {
      title: 'Zentralschlossanlage (Z)',
      body:
        'Das „Z“ steht für Zentralschloss: Die gemeinsamen Türen sind die Zentralschlösser, die '
        + 'jeder Schlüssel der Anlage öffnet. Die Wohnungstüren bleiben voneinander getrennt. '
        + 'Damit behält jede Partei ihren eigenen Bereich für sich.',
      figure: {
        motif: 'Schemazeichnung Zentralschlossanlage: drei Wohnungsschlüssel, alle öffnen die Haustür',
        ratio: '4/3',
      },
    },
    bullets: [
      'Eigene Tür bleibt privat',
      'Gemeinsame Türen für alle geöffnet',
      'Kein Schlüssel über alle Wohnungen',
    ],
    figure: {
      motif: 'Schemazeichnung Zentralschlossanlage: Wohnungstüren getrennt, Haustür und Keller gemeinsam',
      ratio: '4/3',
      visual: { generator: 'schliessplan', params: { system: 'zentral', tueren: 4 } },
      note: 'Einfache technische Zeichnung, beschriftet, ohne Fotomaterial.',
    },
  },
  {
    id: 'hs',
    label: 'Hauptschlüsselanlage',
    short: 'HS',
    explanation:
      'Jede Person öffnet mit ihrem Schlüssel genau die Türen, für die sie zuständig ist. '
      + 'Zusätzlich gibt es einen Hauptschlüssel, der alle Türen der Anlage öffnet. Wer welchen '
      + 'Schlüssel bekommt, wird vorher in einem Schließplan festgelegt.',
    suitableFor:
      'Betrieb, Praxis, Kanzlei, Schule oder Verwaltungsgebäude mit mehreren Abteilungen und '
      + 'unterschiedlichen Zuständigkeiten.',
    opensWhat:
      'Nutzerschlüssel: nur die zugewiesenen Türen. Hauptschlüssel: alle Türen der Anlage.',
    typicalFor: 'Betrieb, Praxis, Schule, Verwaltung',
    expandable: 'Ja, wenn im Schließplan Reserven für weitere Türen und Nutzer eingeplant sind.',
    info: {
      title: 'Hauptschlüsselanlage (HS)',
      body:
        '„HS“ ist die übliche Abkürzung für Hauptschlüssel. Der Hauptschlüssel liegt meist bei '
        + 'der Leitung oder der Haustechnik. Für den Alltag erhält jede Person nur die Türen, '
        + 'die sie wirklich braucht — das begrenzt den Aufwand, wenn ein Schlüssel abhandenkommt.',
      figure: {
        motif: 'Schemazeichnung Hauptschlüsselanlage: Hauptschlüssel über drei Abteilungsschlüsseln',
        ratio: '4/3',
      },
    },
    bullets: [
      'Ein Hauptschlüssel für alle Türen',
      'Nutzerschlüssel nur für den eigenen Bereich',
      'Schließplan legt die Rechte fest',
    ],
    figure: {
      motif: 'Schemazeichnung Hauptschlüsselanlage: zwei Ebenen, Hauptschlüssel oben, Nutzerschlüssel unten',
      ratio: '4/3',
      visual: { generator: 'schliessplan', params: { system: 'haupt', tueren: 4 } },
      note: 'Einfache technische Zeichnung, beschriftet, ohne Fotomaterial.',
    },
  },
  {
    id: 'ghs',
    label: 'Generalhauptschlüsselanlage',
    short: 'GHS',
    explanation:
      'Mehrere Hauptschlüsselanlagen werden unter einem übergeordneten Schlüssel zusammengefasst. '
      + 'So entstehen mehrere Ebenen: Nutzer, Abteilung oder Gebäude, und darüber der '
      + 'Generalhauptschlüssel, der alles öffnet. Jede Ebene lässt sich getrennt planen.',
    suitableFor:
      'Mehrere Gebäude, größere Liegenschaften, Hausverwaltungen mit vielen Objekten und '
      + 'öffentliche Einrichtungen mit mehreren Bereichen.',
    opensWhat:
      'Mehrere Stufen: Nutzer, Abteilung oder Gebäude, darüber der Generalhauptschlüssel für alles.',
    typicalFor: 'Mehrere Gebäude, Hausverwaltung, öffentliche Einrichtung',
    expandable: 'Ja — dieses System ist auf Wachstum ausgelegt, sofern die Ebenen sauber geplant sind.',
    info: {
      title: 'Generalhauptschlüsselanlage (GHS)',
      body:
        '„GHS“ steht für Generalhauptschlüssel. Der Unterschied zur Hauptschlüsselanlage ist die '
        + 'zusätzliche Ebene: Jedes Gebäude oder jede Abteilung hat einen eigenen Hauptschlüssel, '
        + 'und darüber steht ein Schlüssel für die gesamte Liegenschaft. Je mehr Ebenen, desto '
        + 'wichtiger ist eine saubere Planung von Anfang an.',
      figure: {
        motif: 'Schemazeichnung Generalhauptschlüsselanlage: drei Ebenen als Baumstruktur',
        ratio: '4/3',
      },
    },
    bullets: [
      'Mehrere Ebenen über mehrere Gebäude',
      'Je Gebäude ein eigener Hauptschlüssel',
      'Ein Generalhauptschlüssel über allem',
    ],
    figure: {
      motif: 'Schemazeichnung Generalhauptschlüsselanlage: Baumstruktur über zwei Gebäude',
      ratio: '4/3',
      visual: { generator: 'schliessplan', params: { system: 'generalhaupt', gruppen: 2, tueren: 4 } },
      note: 'Einfache technische Zeichnung, beschriftet, ohne Fotomaterial.',
    },
  },
  {
    id: 'erweiterbar',
    label: 'Erweiterbare Anlage',
    short: '',
    explanation:
      'Kein eigenes Schließsystem, sondern eine Entscheidung bei der Planung: Im Schließplan '
      + 'bleiben Plätze für Türen und Nutzer frei, die es heute noch nicht gibt. Jedes der vier '
      + 'Systeme lässt sich so anlegen. Ohne diese Reserve muss eine Anlage später unter '
      + 'Umständen neu aufgebaut werden.',
    suitableFor:
      'Alle, die mit Umbau, Anbau, weiteren Mietparteien oder zusätzlichen Immobilien rechnen.',
    opensWhat: 'Wie im gewählten System — zusätzlich sind Reserven für später vorgesehen.',
    typicalFor: 'Wachsende Betriebe, Bauvorhaben in Abschnitten, Verwaltungen mit Zukäufen',
    expandable: 'Ja — das ist der Zweck dieser Planung.',
    info: {
      title: 'Erweiterbare Anlage',
      body:
        'Beim Anlegen des Schließplans wird festgelegt, wie viele zusätzliche Türen und '
        + 'Schließungen später noch möglich sein sollen. Sagen Sie uns dafür, was Sie in den '
        + 'nächsten Jahren vorhaben — auch wenn es noch nicht entschieden ist.',
      figure: {
        motif: 'Schemazeichnung erweiterbare Anlage: belegte und freie Plätze im Schließplan',
        ratio: '4/3',
      },
    },
    bullets: [
      'Freie Plätze im Schließplan',
      'Spätere Türen ohne Neuaufbau',
      'Muss zu Beginn festgelegt werden',
    ],
    figure: {
      motif: 'Schemazeichnung erweiterbare Anlage: Schließplan-Raster mit belegten und freien Feldern',
      ratio: '4/3',
      visual: { generator: 'schliessplan', params: { system: 'generalhaupt', gruppen: 2, tueren: 6, reserve: 2 } },
      note: 'Einfache technische Zeichnung, beschriftet, ohne Fotomaterial.',
    },
  },
];

/** Vollständiger Name eines Systems, Abkürzung immer in Klammern dahinter. */
export function systemName(entry: LockSystemEntry): string {
  return entry.short ? `${entry.label} (${entry.short})` : entry.label;
}

/**
 * Die vier Schließsysteme als Reiter des interaktiven Plans (B-14): Beschreibung, Merkpunkte,
 * Eignung und Info-Symbol kommen aus den Systemeinträgen. Die Erweiterbare Anlage hat keinen
 * Reiter, sie ist eine Planungsentscheidung (siehe `ErweiterbareAnlage`).
 */
const REITER: [SchliessSystem, string][] = [
  ['gleichschliessung', 'gleichschliessung'],
  ['zentral', 'z'],
  ['haupt', 'hs'],
  ['generalhaupt', 'ghs'],
];

export function systemReiter(): Partial<Record<SchliessSystem, SchliessDetail>> {
  const reiter: Partial<Record<SchliessSystem, SchliessDetail>> = {};
  for (const [system, id] of REITER) {
    const entry = LOCK_SYSTEMS.find((e) => e.id === id);
    if (!entry) continue;
    reiter[system] = {
      name: systemName(entry),
      beschreibung: entry.explanation,
      haken: entry.bullets,
      geeignetFuer: entry.suitableFor,
      infoTip: <InfoTip hint={entry.info} />,
    };
  }
  return reiter;
}

/** Die erweiterbare Anlage: keine Schließart, sondern eine Entscheidung bei der Planung – ein Blatt mit Reserve. */
export function ErweiterbareAnlage() {
  const entry = LOCK_SYSTEMS.find((e) => e.id === 'erweiterbar');
  if (!entry) return null;
  return (
    <Reveal>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-gutter">
        <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 lg:col-span-5">
          <ImagePlaceholder slot={entry.figure} frei />
        </div>

        <div className="lg:col-span-7">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-title-sm font-bold text-foreground">{systemName(entry)}</h3>
            <InfoTip hint={entry.info} />
          </div>

          <p className="mt-3 max-w-measure text-body leading-relaxed text-foreground-muted">{entry.explanation}</p>

          <ul className="mt-5 grid max-w-measure gap-2.5">
            {entry.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5 text-small leading-relaxed text-foreground-muted">
                <GlyphHaken size={16} className="mt-0.5 shrink-0 text-area-strong" />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="mt-6 max-w-measure border-t border-border pt-4">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Geeignet für</p>
            <p className="mt-1.5 text-small leading-relaxed text-foreground">{entry.suitableFor}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Vergleich der fünf Systeme: ab lg als Tabelle, darunter als gestapelte Angaben je System. */
export function SystemVergleich() {
  return (
    <div>
      <div className="border-b border-border lg:hidden">
        {LOCK_SYSTEMS.map((entry) => (
          <div key={entry.id} className="border-t border-border py-5">
            <p className="text-title-sm font-semibold text-foreground">{systemName(entry)}</p>
            <dl className="mt-3 divide-y divide-border">
              <div className="py-3 first:pt-0">
                <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Wer öffnet was
                </dt>
                <dd className="mt-1 text-small leading-relaxed text-foreground-muted">{entry.opensWhat}</dd>
              </div>
              <div className="py-3">
                <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Typisch für
                </dt>
                <dd className="mt-1 text-small leading-relaxed text-foreground-muted">{entry.typicalFor}</dd>
              </div>
              <div className="py-3 last:pb-0">
                <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Erweiterbar
                </dt>
                <dd className="mt-1 text-small leading-relaxed text-foreground-muted">{entry.expandable}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <table className="hidden w-full border-collapse text-left lg:table">
        <caption className="sr-only">
          Die fünf Schließsysteme im Vergleich: wer welche Tür öffnet, typische Einsatzfälle und
          Erweiterbarkeit.
        </caption>
        <thead>
          <tr className="border-b border-border-strong">
            <th scope="col" className="px-4 py-3 text-small font-bold text-foreground">
              System
            </th>
            <th scope="col" className="px-4 py-3 text-small font-bold text-foreground">
              Wer öffnet was
            </th>
            <th scope="col" className="px-4 py-3 text-small font-bold text-foreground">
              Typisch für
            </th>
            <th scope="col" className="px-4 py-3 text-small font-bold text-foreground">
              Erweiterbar
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {LOCK_SYSTEMS.map((entry) => (
            <tr key={entry.id} className="align-top">
              <th scope="row" className="px-4 py-3 text-small font-bold text-foreground">
                {systemName(entry)}
              </th>
              <td className="px-4 py-3 text-small leading-relaxed text-foreground-muted">
                {entry.opensWhat}
              </td>
              <td className="px-4 py-3 text-small leading-relaxed text-foreground-muted">
                {entry.typicalFor}
              </td>
              <td className="px-4 py-3 text-small leading-relaxed text-foreground-muted">
                {entry.expandable}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
