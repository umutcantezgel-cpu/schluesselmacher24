'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  Check,
  CircleAlert,
  Layers,
  Package,
  Ruler,
  Search,
  X,
} from 'lucide-react';

import { saveCodeLine, saveContent, type SaveResult } from '@/lib/actions/admin';
import type { CodeLine, CylinderCatalog, CylinderForm } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Field } from '@/components/forms/field';
import { Select, TextArea, TextInput } from '@/components/forms/controls';

/* ==========================================================================
   Hilfsmittel — Zahlen, Beträge, Platzhalter
   ========================================================================== */

/** Betrag in Cent als Eingabewert in Euro, z. B. 1490 → "14,50". */
function centsToEuro(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',');
}

/** Eingabe in Euro als Cent. Gibt null zurück, wenn die Eingabe unbrauchbar ist. */
function euroToCents(value: string): number | null {
  const raw = value.trim();
  if (raw === '') return null;
  const normalised = raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw;
  const parsed = Number(normalised);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed * 100);
}

/** Ganze Zahl aus einer Eingabe. Gibt null zurück, wenn die Eingabe unbrauchbar ist. */
function toWholeNumber(value: string, min = 0): number | null {
  const raw = value.trim();
  if (raw === '') return null;
  const parsed = Number(raw.replace(',', '.'));
  if (!Number.isInteger(parsed) || parsed < min) return null;
  return parsed;
}

/** Felder, die als Platzhalter erkannt werden, wenn sie eine eckige Klammer enthalten. */
const PLACEHOLDER_KEYS = [
  'name',
  'manufacturer',
  'application',
  'keyType',
  'description',
  'codeFormatLabel',
  'codeExample',
  'codeHint',
  'scope',
] as const;

function hasPlaceholder(line: CodeLine): boolean {
  return PLACEHOLDER_KEYS.some((key) => line[key].includes('['));
}

/* ==========================================================================
   Rückmeldung nach dem Speichern
   ========================================================================== */

function Rueckmeldung({ result }: { result: SaveResult | null }) {
  if (!result) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2 rounded-lg border p-3 text-[13px] leading-relaxed',
        result.ok
          ? 'border-success/30 bg-success-soft text-foreground'
          : 'border-danger/30 bg-danger-soft text-foreground',
      )}
    >
      {result.ok ? (
        <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden />
      ) : (
        <CircleAlert size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden />
      )}
      <span>
        <strong className="font-bold">{result.ok ? 'Gespeichert. ' : 'Nicht gespeichert. '}</strong>
        {result.message}
      </span>
    </div>
  );
}

/** Kontrollkästchen mit sichtbarer Beschriftung. */
function CheckRow({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface px-3.5 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-[13px] leading-snug text-foreground-subtle">{hint}</span>
        )}
      </span>
    </label>
  );
}

/* ==========================================================================
   Umschaltung zwischen den beiden Bereichen
   ========================================================================== */

type Bereich = 'codelinien' | 'zylinder';

export function ProduktVerwaltung({
  codeLines,
  catalog,
}: {
  codeLines: CodeLine[];
  catalog: CylinderCatalog;
}) {
  const [bereich, setBereich] = useState<Bereich>('codelinien');

  const tabs: Array<{ id: Bereich; label: string; icon: typeof Package }> = [
    { id: 'codelinien', label: 'Codelinien', icon: Package },
    { id: 'zylinder', label: 'Zylinderkatalog', icon: Layers },
  ];

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Produktbereich wählen" className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const aktiv = bereich === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={aktiv}
              onClick={() => setBereich(tab.id)}
              className={cn(
                'inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-4 text-[15px] font-semibold transition-colors',
                aktiv
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-foreground-muted hover:bg-surface-muted hover:text-foreground',
              )}
            >
              <Icon size={16} aria-hidden />
              {tab.label}
            </button>
          );
        })}
      </div>

      {bereich === 'codelinien' ? (
        <CodelinienBereich lines={codeLines} />
      ) : (
        <ZylinderBereich catalog={catalog} />
      )}
    </div>
  );
}

/* ==========================================================================
   A) Codelinien
   ========================================================================== */

function CodelinienBereich({ lines }: { lines: CodeLine[] }) {
  const [alle, setAlle] = useState<CodeLine[]>(lines);
  const [suche, setSuche] = useState('');
  const [hersteller, setHersteller] = useState('alle');
  const [schluesseltyp, setSchluesseltyp] = useState('alle');
  const [zustand, setZustand] = useState<'alle' | 'aktiv' | 'inaktiv'>('alle');
  const [nurPlatzhalter, setNurPlatzhalter] = useState(false);
  const [ausgewaehlt, setAusgewaehlt] = useState<string | null>(null);

  const herstellerListe = useMemo(
    () => Array.from(new Set(alle.map((l) => l.manufacturer))).sort((a, b) => a.localeCompare(b, 'de')),
    [alle],
  );
  const typListe = useMemo(
    () => Array.from(new Set(alle.map((l) => l.keyType))).sort((a, b) => a.localeCompare(b, 'de')),
    [alle],
  );

  const platzhalterAnzahl = useMemo(() => alle.filter(hasPlaceholder).length, [alle]);

  const gefiltert = useMemo(() => {
    const begriff = suche.trim().toLowerCase();
    return alle.filter((line) => {
      if (hersteller !== 'alle' && line.manufacturer !== hersteller) return false;
      if (schluesseltyp !== 'alle' && line.keyType !== schluesseltyp) return false;
      if (zustand === 'aktiv' && !line.active) return false;
      if (zustand === 'inaktiv' && line.active) return false;
      if (nurPlatzhalter && !hasPlaceholder(line)) return false;
      if (!begriff) return true;
      return [line.name, line.slug, line.manufacturer, line.application, line.keyType, line.codeExample]
        .join(' ')
        .toLowerCase()
        .includes(begriff);
    });
  }, [alle, suche, hersteller, schluesseltyp, zustand, nurPlatzhalter]);

  const aktiveLinie = ausgewaehlt ? alle.find((l) => l.id === ausgewaehlt) ?? null : null;

  function uebernehmen(id: string, patch: Partial<CodeLine>) {
    setAlle((vorher) => vorher.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  return (
    <div className="space-y-6">
      <h2 className="sr-only">Codelinien</h2>

      {platzhalterAnzahl > 0 && (
        <Alert tone="warning" title="Platzhalter vor Livegang befüllen">
          {platzhalterAnzahl} von {alle.length} Codelinien enthalten noch Felder in eckigen
          Klammern, zum Beispiel „[Hersteller eintragen]“. Diese Angaben erscheinen so auf der
          Kundenseite und müssen vorher fachlich befüllt werden. Mit dem Filter „Nur Linien mit
          Platzhalter“ sehen Sie genau diese Linien.
        </Alert>
      )}

      {/* Suche und Filter */}
      <Card>
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Suche" hint="Name, Kennung, Anwendung oder Beispielcode">
              {({ id, describedBy }) => (
                <div className="relative">
                  <Search
                    size={16}
                    aria-hidden
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle"
                  />
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    type="search"
                    value={suche}
                    onChange={(event) => setSuche(event.target.value)}
                    placeholder="Suchbegriff eingeben"
                    className="pl-10"
                  />
                </div>
              )}
            </Field>

            <Field label="Hersteller">
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  value={hersteller}
                  onChange={(event) => setHersteller(event.target.value)}
                >
                  <option value="alle">Alle Hersteller</option>
                  {herstellerListe.map((wert) => (
                    <option key={wert} value={wert}>
                      {wert}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field label="Schlüsseltyp">
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  value={schluesseltyp}
                  onChange={(event) => setSchluesseltyp(event.target.value)}
                >
                  <option value="alle">Alle Schlüsseltypen</option>
                  {typListe.map((wert) => (
                    <option key={wert} value={wert}>
                      {wert}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field label="Sichtbarkeit">
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  value={zustand}
                  onChange={(event) => setZustand(event.target.value as 'alle' | 'aktiv' | 'inaktiv')}
                >
                  <option value="alle">Aktive und inaktive</option>
                  <option value="aktiv">Nur aktive</option>
                  <option value="inaktiv">Nur inaktive</option>
                </Select>
              )}
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={nurPlatzhalter}
                onChange={(event) => setNurPlatzhalter(event.target.checked)}
                className="h-5 w-5 accent-primary"
              />
              <span className="text-sm font-semibold text-foreground">Nur Linien mit Platzhalter</span>
            </label>
            <p className="text-[13px] text-foreground-muted">
              {gefiltert.length} von {alle.length} Codelinien werden angezeigt.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Tabelle */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Übersicht der Codelinien</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Eine Zeile auswählen, um alle Angaben dieser Linie zu bearbeiten.
          </p>
        </CardHeader>
        <CardBody>
          {gefiltert.length === 0 ? (
            <p className="text-[15px] text-foreground-muted">
              Zu dieser Auswahl gibt es keine Codelinie. Bitte Suche oder Filter ändern.
            </p>
          ) : (
            <div className="table-scroll">
              <table className="w-full min-w-[46rem] border-collapse text-left text-[14px]">
                <caption className="sr-only">
                  Codelinien mit Kennung, Name, Hersteller, Schlüsseltyp, Preis und Zustand
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Kennung
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Hersteller
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Schlüsseltyp
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Preis
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Zustand
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Bearbeiten
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {gefiltert.map((line) => (
                    <tr
                      key={line.id}
                      className={cn(
                        'align-top',
                        ausgewaehlt === line.id ? 'bg-primary-soft' : 'hover:bg-surface-muted',
                      )}
                    >
                      <td className="px-3 py-3 font-mono text-[13px] uppercase text-foreground-muted">
                        {line.slug}
                      </td>
                      <td className="px-3 py-3">
                        <span className="block font-semibold text-foreground">{line.name}</span>
                        <span className="mt-0.5 block text-[13px] text-foreground-subtle">
                          {line.application}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {line.manufacturer.includes('[') ? (
                          <Badge tone="warning">{line.manufacturer}</Badge>
                        ) : (
                          <span className="text-foreground">{line.manufacturer}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-foreground-muted">{line.keyType}</td>
                      <td className="px-3 py-3 text-right font-semibold text-foreground">
                        {formatCents(line.priceCents)}
                      </td>
                      <td className="px-3 py-3">
                        {line.active ? (
                          <Badge tone="success">Aktiv</Badge>
                        ) : (
                          <Badge tone="neutral">Inaktiv</Badge>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Button
                          type="button"
                          variant={ausgewaehlt === line.id ? 'primary' : 'outline'}
                          onClick={() => setAusgewaehlt(ausgewaehlt === line.id ? null : line.id)}
                        >
                          {ausgewaehlt === line.id ? 'Schließen' : 'Bearbeiten'}
                          <span className="sr-only"> — {line.name}</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {aktiveLinie && (
        <CodelinienEditor
          key={aktiveLinie.id}
          line={aktiveLinie}
          onSaved={(patch) => uebernehmen(aktiveLinie.id, patch)}
          onClose={() => setAusgewaehlt(null)}
        />
      )}
    </div>
  );
}

/* ---------- Bearbeitungsmaske einer Codelinie --------------------------- */

interface LineDraft {
  name: string;
  manufacturer: string;
  application: string;
  keyType: string;
  description: string;
  codeFormatLabel: string;
  codePattern: string;
  codeExample: string;
  codeHint: string;
  priceEuro: string;
  scope: string;
  maxQty: string;
  photoUpload: 'nein' | 'optional' | 'pflicht';
  active: boolean;
}

function CodelinienEditor({
  line,
  onSaved,
  onClose,
}: {
  line: CodeLine;
  onSaved: (patch: Partial<CodeLine>) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<LineDraft>({
    name: line.name,
    manufacturer: line.manufacturer,
    application: line.application,
    keyType: line.keyType,
    description: line.description,
    codeFormatLabel: line.codeFormatLabel,
    codePattern: line.codePattern,
    codeExample: line.codeExample,
    codeHint: line.codeHint,
    priceEuro: centsToEuro(line.priceCents),
    scope: line.scope,
    maxQty: String(line.maxQty),
    photoUpload: line.photoUpload,
    active: line.active,
  });
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, starte] = useTransition();

  function setzen<K extends keyof LineDraft>(key: K, value: LineDraft[K]) {
    setDraft((vorher) => ({ ...vorher, [key]: value }));
    setResult(null);
  }

  const preisCents = euroToCents(draft.priceEuro);
  const maxQty = toWholeNumber(draft.maxQty, 1);
  const preisFehler = preisCents === null ? 'Bitte einen Betrag in Euro eintragen, zum Beispiel 12,50.' : undefined;
  const mengeFehler = maxQty === null ? 'Bitte eine ganze Zahl ab 1 eintragen.' : undefined;
  const nameFehler = draft.name.trim() === '' ? 'Der Name darf nicht leer sein.' : undefined;

  function speichern() {
    if (preisCents === null || maxQty === null || nameFehler) {
      setResult({ ok: false, message: 'Bitte zuerst die rot markierten Felder berichtigen.' });
      return;
    }

    const patch = {
      name: draft.name.trim(),
      manufacturer: draft.manufacturer.trim(),
      application: draft.application.trim(),
      keyType: draft.keyType.trim(),
      description: draft.description.trim(),
      codeFormatLabel: draft.codeFormatLabel.trim(),
      codePattern: draft.codePattern.trim(),
      codeExample: draft.codeExample.trim(),
      codeHint: draft.codeHint.trim(),
      priceCents: preisCents,
      scope: draft.scope.trim(),
      maxQty,
      photoUpload: draft.photoUpload,
      active: draft.active,
    };

    starte(async () => {
      const antwort = await saveCodeLine({ id: line.id, ...patch });
      setResult(antwort);
      if (antwort.ok) onSaved(patch);
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-foreground">
            Codelinie bearbeiten:{' '}
            <span className="font-mono uppercase text-foreground-muted">{line.slug}</span>
          </h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Die Änderungen gelten sofort für die Produktseite und den Warenkorb.
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={onClose}>
          <X size={16} aria-hidden />
          Schließen
        </Button>
      </CardHeader>

      <CardBody className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required error={nameFehler}>
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                value={draft.name}
                onChange={(event) => setzen('name', event.target.value)}
              />
            )}
          </Field>

          <Field
            label="Hersteller"
            hint="Eckige Klammern bedeuten: noch nicht befüllt."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={draft.manufacturer}
                onChange={(event) => setzen('manufacturer', event.target.value)}
              />
            )}
          </Field>

          <Field label="Anwendung" hint="Wofür diese Linie eingesetzt wird.">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={draft.application}
                onChange={(event) => setzen('application', event.target.value)}
              />
            )}
          </Field>

          <Field label="Schlüsseltyp">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={draft.keyType}
                onChange={(event) => setzen('keyType', event.target.value)}
              />
            )}
          </Field>
        </div>

        <Field label="Beschreibung" hint="Erscheint auf der Produktseite über dem Bestellfeld.">
          {({ id, describedBy }) => (
            <TextArea
              id={id}
              aria-describedby={describedBy}
              rows={4}
              value={draft.description}
              onChange={(event) => setzen('description', event.target.value)}
            />
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Codeformat-Bezeichnung" hint="In Worten, zum Beispiel „4 Ziffern“.">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={draft.codeFormatLabel}
                onChange={(event) => setzen('codeFormatLabel', event.target.value)}
              />
            )}
          </Field>

          <Field label="Beispielcode" hint="Wird Kundinnen und Kunden als Muster angezeigt.">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={draft.codeExample}
                onChange={(event) => setzen('codeExample', event.target.value)}
              />
            )}
          </Field>
        </div>

        <Field label="Codehinweis" hint="Wo der Code zu finden ist und worauf zu achten ist.">
          {({ id, describedBy }) => (
            <TextArea
              id={id}
              aria-describedby={describedBy}
              rows={3}
              value={draft.codeHint}
              onChange={(event) => setzen('codeHint', event.target.value)}
            />
          )}
        </Field>

        <MusterPruefung
          pattern={draft.codePattern}
          beispiel={draft.codeExample}
          onPatternChange={(wert) => setzen('codePattern', wert)}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Preis in Euro" required error={preisFehler} hint="Bruttopreis je Stück.">
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                inputMode="decimal"
                value={draft.priceEuro}
                onChange={(event) => setzen('priceEuro', event.target.value)}
              />
            )}
          </Field>

          <Field label="Höchstmenge" required error={mengeFehler} hint="Maximale Stückzahl je Bestellung.">
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                inputMode="numeric"
                value={draft.maxQty}
                onChange={(event) => setzen('maxQty', event.target.value)}
              />
            )}
          </Field>

          <Field label="Foto-Upload" hint="Ob ein Foto des Schlosses verlangt wird.">
            {({ id, describedBy }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                value={draft.photoUpload}
                onChange={(event) =>
                  setzen('photoUpload', event.target.value as LineDraft['photoUpload'])
                }
              >
                <option value="nein">Nicht nötig</option>
                <option value="optional">Freiwillig</option>
                <option value="pflicht">Pflicht</option>
              </Select>
            )}
          </Field>

          <div className="flex items-end">
            <CheckRow
              checked={draft.active}
              onChange={(wert) => setzen('active', wert)}
              label="Aktiv"
              hint="Nur aktive Linien sind im Shop sichtbar."
            />
          </div>
        </div>

        <Field label="Lieferumfang" hint="Was genau geliefert wird.">
          {({ id, describedBy }) => (
            <TextArea
              id={id}
              aria-describedby={describedBy}
              rows={2}
              value={draft.scope}
              onChange={(event) => setzen('scope', event.target.value)}
            />
          )}
        </Field>

        {/* Bildstellen — nur zur Information, Bilder werden nicht hier gepflegt. */}
        <div>
          <h4 className="mb-2 text-sm font-bold text-foreground">Vorgesehene Bildstellen</h4>
          <p className="mb-3 text-[13px] text-foreground-muted">
            Für diese Linie sind zwei Bilder vorgesehen. Solange kein echtes Bildmaterial
            vorliegt, bleibt die Fläche beschriftet leer.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ImagePlaceholder slot={line.codeLocationImage} />
            <ImagePlaceholder slot={line.productImage} />
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-5">
          <Rueckmeldung result={result} />
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={speichern} loading={pending}>
              Codelinie speichern
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/* ---------- Prüfmuster mit Eingabehilfe --------------------------------- */

function MusterPruefung({
  pattern,
  beispiel,
  onPatternChange,
}: {
  pattern: string;
  beispiel: string;
  onPatternChange: (wert: string) => void;
}) {
  const [testwert, setTestwert] = useState(beispiel);

  const musterFehler = useMemo(() => {
    if (pattern.trim() === '') return 'Kein Prüfmuster hinterlegt — es wird dann nichts geprüft.';
    try {
      new RegExp(pattern);
      return null;
    } catch (error) {
      return error instanceof Error
        ? `Das Muster ist kein gültiger regulärer Ausdruck: ${error.message}`
        : 'Das Muster ist kein gültiger regulärer Ausdruck.';
    }
  }, [pattern]);

  const trifftZu = useMemo(() => {
    if (musterFehler) return null;
    try {
      return new RegExp(pattern).test(testwert);
    } catch {
      return null;
    }
  }, [musterFehler, pattern, testwert]);

  return (
    <div className="rounded-lg border border-border bg-surface-muted p-4">
      <h4 className="text-sm font-bold text-foreground">Prüfmuster und Eingabehilfe</h4>
      <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
        Das Prüfmuster ist ein regulärer Ausdruck. Es entscheidet, welche Codeeingabe im Shop
        angenommen wird. Tragen Sie unten einen Beispielcode ein, um das Muster sofort zu prüfen.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field
          label="Prüfmuster (regulärer Ausdruck)"
          error={musterFehler && pattern.trim() !== '' ? musterFehler : undefined}
          hint={pattern.trim() === '' ? 'Ohne Muster wird jede Eingabe angenommen.' : undefined}
        >
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              invalid={invalid}
              value={pattern}
              onChange={(event) => onPatternChange(event.target.value)}
              className="font-mono text-[14px]"
              spellCheck={false}
            />
          )}
        </Field>

        <Field label="Testeingabe" hint="Nur zum Ausprobieren. Wird nicht gespeichert.">
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              value={testwert}
              onChange={(event) => setTestwert(event.target.value)}
              className="font-mono text-[14px]"
              spellCheck={false}
            />
          )}
        </Field>
      </div>

      <p role="status" aria-live="polite" className="mt-3 text-[13px] font-semibold">
        {musterFehler ? (
          <span className="text-warning">Prüfung nicht möglich: {musterFehler}</span>
        ) : testwert.trim() === '' ? (
          <span className="text-foreground-muted">Bitte eine Testeingabe eintragen.</span>
        ) : trifftZu ? (
          <span className="text-success">
            Die Eingabe „{testwert}“ passt zum Muster und würde angenommen.
          </span>
        ) : (
          <span className="text-danger">
            Die Eingabe „{testwert}“ passt nicht zum Muster und würde abgelehnt.
          </span>
        )}
      </p>
    </div>
  );
}

/* ==========================================================================
   B) Zylinderkatalog
   ========================================================================== */

interface BauformDraft {
  label: string;
  description: string;
  minMm: string;
  maxMm: string;
  stepMm: string;
  basePriceEuro: string;
  lengthSurchargeEuro: string;
  baseLengthMm: string;
  active: boolean;
}

interface FunktionDraft {
  label: string;
  description: string;
  surchargeEuro: string;
  forms: CylinderForm[];
  active: boolean;
}

interface ZusatzDraft {
  label: string;
  description: string;
  priceEuro: string;
  unit: 'einmal' | 'stueck';
  active: boolean;
}

interface GrundwerteDraft {
  includedKeys: string;
  keyPriceEuro: string;
  maxKeys: string;
  maxCylinders: string;
}

function ZylinderBereich({ catalog }: { catalog: CylinderCatalog }) {
  const [bauformen, setBauformen] = useState<BauformDraft[]>(() =>
    catalog.forms.map((form) => ({
      label: form.label,
      description: form.description,
      minMm: String(form.minMm),
      maxMm: String(form.maxMm),
      stepMm: String(form.stepMm),
      basePriceEuro: centsToEuro(form.basePriceCents),
      lengthSurchargeEuro: centsToEuro(form.lengthSurchargeCents),
      baseLengthMm: String(form.baseLengthMm),
      active: form.active,
    })),
  );
  const [funktionen, setFunktionen] = useState<FunktionDraft[]>(() =>
    catalog.functions.map((fn) => ({
      label: fn.label,
      description: fn.description,
      surchargeEuro: centsToEuro(fn.surchargeCents),
      forms: [...fn.forms],
      active: fn.active,
    })),
  );
  const [zusatz, setZusatz] = useState<ZusatzDraft[]>(() =>
    catalog.extras.map((extra) => ({
      label: extra.label,
      description: extra.description,
      priceEuro: centsToEuro(extra.priceCents),
      unit: extra.unit,
      active: extra.active,
    })),
  );
  const [grundwerte, setGrundwerte] = useState<GrundwerteDraft>(() => ({
    includedKeys: String(catalog.includedKeys),
    keyPriceEuro: centsToEuro(catalog.keyPriceCents),
    maxKeys: String(catalog.maxKeys),
    maxCylinders: String(catalog.maxCylinders),
  }));

  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, starte] = useTransition();

  function aendereBauform<K extends keyof BauformDraft>(index: number, key: K, wert: BauformDraft[K]) {
    setBauformen((vorher) => vorher.map((eintrag, i) => (i === index ? { ...eintrag, [key]: wert } : eintrag)));
    setResult(null);
  }

  function aendereFunktion<K extends keyof FunktionDraft>(index: number, key: K, wert: FunktionDraft[K]) {
    setFunktionen((vorher) => vorher.map((eintrag, i) => (i === index ? { ...eintrag, [key]: wert } : eintrag)));
    setResult(null);
  }

  function aendereZusatz<K extends keyof ZusatzDraft>(index: number, key: K, wert: ZusatzDraft[K]) {
    setZusatz((vorher) => vorher.map((eintrag, i) => (i === index ? { ...eintrag, [key]: wert } : eintrag)));
    setResult(null);
  }

  function aendereGrundwert<K extends keyof GrundwerteDraft>(key: K, wert: GrundwerteDraft[K]) {
    setGrundwerte((vorher) => ({ ...vorher, [key]: wert }));
    setResult(null);
  }

  /** Setzt den vollständigen Katalog zusammen oder meldet, welche Angabe fehlt. */
  function zusammensetzen(): { katalog: CylinderCatalog } | { fehler: string[] } {
    const fehler: string[] = [];

    const forms = catalog.forms.map((form, index) => {
      const entwurf = bauformen[index];
      const minMm = toWholeNumber(entwurf.minMm, 1);
      const maxMm = toWholeNumber(entwurf.maxMm, 1);
      const stepMm = toWholeNumber(entwurf.stepMm, 1);
      const baseLengthMm = toWholeNumber(entwurf.baseLengthMm, 1);
      const basePriceCents = euroToCents(entwurf.basePriceEuro);
      const lengthSurchargeCents = euroToCents(entwurf.lengthSurchargeEuro);

      if (entwurf.label.trim() === '') fehler.push(`Bauform ${index + 1}: Bezeichnung fehlt.`);
      if (minMm === null || maxMm === null) fehler.push(`${entwurf.label || `Bauform ${index + 1}`}: Maßbereich ist keine ganze Zahl.`);
      if (minMm !== null && maxMm !== null && minMm >= maxMm) {
        fehler.push(`${entwurf.label || `Bauform ${index + 1}`}: Das Maß „von“ muss kleiner sein als „bis“.`);
      }
      if (stepMm === null) fehler.push(`${entwurf.label || `Bauform ${index + 1}`}: Schrittweite ist keine ganze Zahl.`);
      if (baseLengthMm === null) fehler.push(`${entwurf.label || `Bauform ${index + 1}`}: Grundlänge ist keine ganze Zahl.`);
      if (basePriceCents === null) fehler.push(`${entwurf.label || `Bauform ${index + 1}`}: Grundpreis ist kein gültiger Betrag.`);
      if (lengthSurchargeCents === null) fehler.push(`${entwurf.label || `Bauform ${index + 1}`}: Längenaufschlag ist kein gültiger Betrag.`);

      return {
        ...form,
        label: entwurf.label.trim(),
        description: entwurf.description.trim(),
        minMm: minMm ?? form.minMm,
        maxMm: maxMm ?? form.maxMm,
        stepMm: stepMm ?? form.stepMm,
        baseLengthMm: baseLengthMm ?? form.baseLengthMm,
        basePriceCents: basePriceCents ?? form.basePriceCents,
        lengthSurchargeCents: lengthSurchargeCents ?? form.lengthSurchargeCents,
        active: entwurf.active,
      };
    });

    const functions = catalog.functions.map((fn, index) => {
      const entwurf = funktionen[index];
      const surchargeCents = euroToCents(entwurf.surchargeEuro);
      if (entwurf.label.trim() === '') fehler.push(`Funktion ${index + 1}: Bezeichnung fehlt.`);
      if (surchargeCents === null) fehler.push(`${entwurf.label || `Funktion ${index + 1}`}: Aufpreis ist kein gültiger Betrag.`);
      if (entwurf.forms.length === 0) fehler.push(`${entwurf.label || `Funktion ${index + 1}`}: Mindestens eine zulässige Bauform wählen.`);

      return {
        ...fn,
        label: entwurf.label.trim(),
        description: entwurf.description.trim(),
        surchargeCents: surchargeCents ?? fn.surchargeCents,
        forms: entwurf.forms,
        active: entwurf.active,
      };
    });

    const extras = catalog.extras.map((extra, index) => {
      const entwurf = zusatz[index];
      const priceCents = euroToCents(entwurf.priceEuro);
      if (entwurf.label.trim() === '') fehler.push(`Zusatzoption ${index + 1}: Bezeichnung fehlt.`);
      if (priceCents === null) fehler.push(`${entwurf.label || `Zusatzoption ${index + 1}`}: Preis ist kein gültiger Betrag.`);

      return {
        ...extra,
        label: entwurf.label.trim(),
        description: entwurf.description.trim(),
        priceCents: priceCents ?? extra.priceCents,
        unit: entwurf.unit,
        active: entwurf.active,
      };
    });

    const includedKeys = toWholeNumber(grundwerte.includedKeys, 0);
    const keyPriceCents = euroToCents(grundwerte.keyPriceEuro);
    const maxKeys = toWholeNumber(grundwerte.maxKeys, 1);
    const maxCylinders = toWholeNumber(grundwerte.maxCylinders, 1);

    if (includedKeys === null) fehler.push('Grundwerte: Enthaltene Schlüssel ist keine ganze Zahl.');
    if (keyPriceCents === null) fehler.push('Grundwerte: Preis je zusätzlichem Schlüssel ist kein gültiger Betrag.');
    if (maxKeys === null) fehler.push('Grundwerte: Höchstzahl Schlüssel ist keine ganze Zahl ab 1.');
    if (maxCylinders === null) fehler.push('Grundwerte: Höchstzahl Zylinder ist keine ganze Zahl ab 1.');
    if (includedKeys !== null && maxKeys !== null && includedKeys > maxKeys) {
      fehler.push('Grundwerte: Es können nicht mehr Schlüssel enthalten sein als insgesamt zulässig.');
    }

    if (fehler.length > 0) return { fehler };

    return {
      katalog: {
        ...catalog,
        forms,
        functions,
        extras,
        includedKeys: includedKeys ?? catalog.includedKeys,
        keyPriceCents: keyPriceCents ?? catalog.keyPriceCents,
        maxKeys: maxKeys ?? catalog.maxKeys,
        maxCylinders: maxCylinders ?? catalog.maxCylinders,
      },
    };
  }

  function speichern() {
    const ergebnis = zusammensetzen();
    if ('fehler' in ergebnis) {
      setResult({ ok: false, message: ergebnis.fehler.join(' ') });
      return;
    }

    starte(async () => {
      const antwort = await saveContent('cylinderCatalog', ergebnis.katalog);
      setResult(antwort);
    });
  }

  const speicherleiste = (
    <div className="space-y-3">
      <Rueckmeldung result={result} />
      <Button type="button" onClick={speichern} loading={pending}>
        Zylinderkatalog speichern
      </Button>
      <p className="text-[13px] text-foreground-muted">
        Der Katalog wird immer vollständig gespeichert — alle Änderungen aus den vier
        Abschnitten dieser Seite werden gemeinsam übernommen.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="sr-only">Zylinderkatalog</h2>

      <Card variant="muted">
        <CardBody>{speicherleiste}</CardBody>
      </Card>

      {/* Bauformen */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
            <Ruler size={16} aria-hidden className="text-foreground-muted" />
            Bauformen
          </h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Maßbereich, Schrittweite und Preisbildung je Bauform. Der Längenaufschlag wird je
            angefangene 5 Millimeter über der Grundlänge berechnet.
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          {catalog.forms.map((form, index) => {
            const entwurf = bauformen[index];
            return (
              <fieldset key={form.id} className="rounded-lg border border-border p-4">
                <legend className="px-2 text-sm font-bold text-foreground">
                  {entwurf.label || form.id}
                </legend>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Bezeichnung" required>
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        value={entwurf.label}
                        onChange={(event) => aendereBauform(index, 'label', event.target.value)}
                      />
                    )}
                  </Field>

                  <div className="flex items-end">
                    <CheckRow
                      checked={entwurf.active}
                      onChange={(wert) => aendereBauform(index, 'active', wert)}
                      label="Aktiv"
                      hint="Nur aktive Bauformen stehen im Konfigurator zur Wahl."
                    />
                  </div>
                </div>

                <Field label="Beschreibung" className="mt-4">
                  {({ id, describedBy }) => (
                    <TextArea
                      id={id}
                      aria-describedby={describedBy}
                      rows={2}
                      value={entwurf.description}
                      onChange={(event) => aendereBauform(index, 'description', event.target.value)}
                    />
                  )}
                </Field>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Maß von (Millimeter)" required>
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="numeric"
                        value={entwurf.minMm}
                        onChange={(event) => aendereBauform(index, 'minMm', event.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Maß bis (Millimeter)" required>
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="numeric"
                        value={entwurf.maxMm}
                        onChange={(event) => aendereBauform(index, 'maxMm', event.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Schrittweite (Millimeter)" required hint="Abstand zwischen zwei wählbaren Maßen.">
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="numeric"
                        value={entwurf.stepMm}
                        onChange={(event) => aendereBauform(index, 'stepMm', event.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Grundpreis in Euro" required>
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="decimal"
                        value={entwurf.basePriceEuro}
                        onChange={(event) => aendereBauform(index, 'basePriceEuro', event.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Längenaufschlag je 5 mm in Euro" required>
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="decimal"
                        value={entwurf.lengthSurchargeEuro}
                        onChange={(event) =>
                          aendereBauform(index, 'lengthSurchargeEuro', event.target.value)
                        }
                      />
                    )}
                  </Field>

                  <Field
                    label="Grundlänge (Millimeter)"
                    required
                    hint="Bis zu diesem Maß gilt der Grundpreis ohne Aufschlag."
                  >
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="numeric"
                        value={entwurf.baseLengthMm}
                        onChange={(event) => aendereBauform(index, 'baseLengthMm', event.target.value)}
                      />
                    )}
                  </Field>
                </div>
              </fieldset>
            );
          })}
        </CardBody>
      </Card>

      {/* Funktionen */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Funktionen</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Zusätzliche Schließfunktionen mit Aufpreis. Jede Funktion gilt nur für die hier
            ausgewählten Bauformen.
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          {catalog.functions.map((fn, index) => {
            const entwurf = funktionen[index];
            return (
              <fieldset key={fn.id} className="rounded-lg border border-border p-4">
                <legend className="px-2 text-sm font-bold text-foreground">
                  {entwurf.label || fn.id}
                </legend>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Bezeichnung" required>
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        value={entwurf.label}
                        onChange={(event) => aendereFunktion(index, 'label', event.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Aufpreis in Euro" required>
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="decimal"
                        value={entwurf.surchargeEuro}
                        onChange={(event) => aendereFunktion(index, 'surchargeEuro', event.target.value)}
                      />
                    )}
                  </Field>
                </div>

                <Field label="Beschreibung" className="mt-4">
                  {({ id, describedBy }) => (
                    <TextArea
                      id={id}
                      aria-describedby={describedBy}
                      rows={2}
                      value={entwurf.description}
                      onChange={(event) => aendereFunktion(index, 'description', event.target.value)}
                    />
                  )}
                </Field>

                <fieldset className="mt-4">
                  <legend className="mb-2 text-sm font-semibold text-foreground">
                    Zulässige Bauformen
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {catalog.forms.map((form, formIndex) => {
                      const gewaehlt = entwurf.forms.includes(form.id);
                      return (
                        <CheckRow
                          key={form.id}
                          checked={gewaehlt}
                          onChange={(wert) =>
                            aendereFunktion(
                              index,
                              'forms',
                              wert
                                ? [...entwurf.forms, form.id]
                                : entwurf.forms.filter((eintrag) => eintrag !== form.id),
                            )
                          }
                          label={bauformen[formIndex]?.label || form.label}
                        />
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-4">
                  <CheckRow
                    checked={entwurf.active}
                    onChange={(wert) => aendereFunktion(index, 'active', wert)}
                    label="Aktiv"
                    hint="Nur aktive Funktionen stehen im Konfigurator zur Wahl."
                  />
                </div>
              </fieldset>
            );
          })}
        </CardBody>
      </Card>

      {/* Zusatzoptionen */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Zusatzoptionen</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Zubehör und Leistungen, die zur Schließung dazugebucht werden können.
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          {catalog.extras.map((extra, index) => {
            const entwurf = zusatz[index];
            return (
              <fieldset key={extra.id} className="rounded-lg border border-border p-4">
                <legend className="px-2 text-sm font-bold text-foreground">
                  {entwurf.label || extra.id}
                </legend>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Bezeichnung" required>
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        value={entwurf.label}
                        onChange={(event) => aendereZusatz(index, 'label', event.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Preis in Euro" required>
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="decimal"
                        value={entwurf.priceEuro}
                        onChange={(event) => aendereZusatz(index, 'priceEuro', event.target.value)}
                      />
                    )}
                  </Field>

                  <Field label="Abrechnung">
                    {({ id, describedBy }) => (
                      <Select
                        id={id}
                        aria-describedby={describedBy}
                        value={entwurf.unit}
                        onChange={(event) =>
                          aendereZusatz(index, 'unit', event.target.value as ZusatzDraft['unit'])
                        }
                      >
                        <option value="einmal">Je Bestellung</option>
                        <option value="stueck">Je Zylinder</option>
                      </Select>
                    )}
                  </Field>
                </div>

                <Field label="Beschreibung" className="mt-4">
                  {({ id, describedBy }) => (
                    <TextArea
                      id={id}
                      aria-describedby={describedBy}
                      rows={2}
                      value={entwurf.description}
                      onChange={(event) => aendereZusatz(index, 'description', event.target.value)}
                    />
                  )}
                </Field>

                <div className="mt-4">
                  <CheckRow
                    checked={entwurf.active}
                    onChange={(wert) => aendereZusatz(index, 'active', wert)}
                    label="Aktiv"
                  />
                </div>
              </fieldset>
            );
          })}
        </CardBody>
      </Card>

      {/* Grundwerte */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Grundwerte</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Gelten für jede gleichschließende Bestellung, unabhängig von der Bauform.
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Enthaltene Schlüssel" required hint="Im Grundpreis bereits enthalten.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  inputMode="numeric"
                  value={grundwerte.includedKeys}
                  onChange={(event) => aendereGrundwert('includedKeys', event.target.value)}
                />
              )}
            </Field>

            <Field label="Preis je zusätzlichem Schlüssel in Euro" required>
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  inputMode="decimal"
                  value={grundwerte.keyPriceEuro}
                  onChange={(event) => aendereGrundwert('keyPriceEuro', event.target.value)}
                />
              )}
            </Field>

            <Field label="Höchstzahl Schlüssel" required>
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  inputMode="numeric"
                  value={grundwerte.maxKeys}
                  onChange={(event) => aendereGrundwert('maxKeys', event.target.value)}
                />
              )}
            </Field>

            <Field label="Höchstzahl Zylinder" required>
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  inputMode="numeric"
                  value={grundwerte.maxCylinders}
                  onChange={(event) => aendereGrundwert('maxCylinders', event.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="mt-6 border-t border-border pt-5">{speicherleiste}</div>
        </CardBody>
      </Card>
    </div>
  );
}
