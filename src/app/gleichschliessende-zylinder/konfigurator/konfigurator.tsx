'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

import type {
  CylinderCatalog,
  CylinderFormOption,
  CylinderLineItem,
  CylinderOrderDraft,
  InfoHint,
  SummarySection,
} from '@/lib/types';
import { priceCylinderOrder } from '@/lib/pricing';
import { formatCents, formatMillimeter } from '@/lib/format';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { useCartStore } from '@/lib/store/cart';
import { FlowShell } from '@/components/flow/flow-shell';
import { Field } from '@/components/forms/field';
import { QuantityInput, Select } from '@/components/forms/controls';
import { OptionCard } from '@/components/forms/option-card';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { SummaryList } from '@/components/layout/summary-list';

const FLOW_ID = 'zylinder-konfigurator';

const STEPS: FlowStep[] = [
  {
    id: 'zylinder',
    short: 'Zylinder',
    title: 'Zylinder zusammenstellen',
    hint: 'Legen Sie für jede Tür eine Position an. Bauform, Maße und Stückzahl bestimmen Sie je Position getrennt.',
  },
  {
    id: 'schluessel',
    short: 'Schlüssel',
    title: 'Gemeinsame Schlüssel',
    hint: 'Jeder dieser Schlüssel sperrt alle Zylinder dieser Bestellung.',
  },
  {
    id: 'optionen',
    short: 'Optionen',
    title: 'Schutz und Optionen',
    hint: 'Alles hier ist freiwillig. Sie können auch ohne Zusatzoption bestellen.',
  },
  {
    id: 'erweiterung',
    short: 'Erweiterung',
    title: 'Spätere Erweiterung',
    hint: 'Soll Ihre Schließung so hinterlegt werden, dass später weitere Zylinder dazu passen?',
  },
  {
    id: 'zusammenfassung',
    short: 'Zusammenfassung',
    title: 'Prüfen und in den Warenkorb legen',
    hint: 'Bitte prüfen Sie vor allem die Maße. Die Zylinder werden nach Ihren Angaben gefertigt.',
  },
];

/** Zwischenstand im Browser. `expandable` bleibt offen, bis gewählt wurde. */
interface ConfigState {
  items: CylinderLineItem[];
  keyCount: number;
  extraIds: string[];
  expandable: boolean | null;
}

const EXPANDABLE_HINTS: Record<'ja' | 'nein', InfoHint> = {
  ja: {
    title: 'Erweiterbar hinterlegen',
    body:
      'Wir vermerken Ihre Schließung, damit später weitere Zylinder mit derselben Schließung '
      + 'gefertigt werden können — etwa für eine zusätzliche Tür oder einen Anbau. Die '
      + 'Nachbestellung ist dann eine Ergänzung und kein neuer Satz.',
  },
  nein: {
    title: 'Ohne Hinterlegung bestellen',
    body:
      'Ihre Bestellung wird als abgeschlossener Satz gefertigt. Eine passgenaue Erweiterung ist '
      + 'später nicht in jedem Fall möglich. Wer dann eine weitere Tür einbinden möchte, braucht '
      + 'unter Umständen einen neuen Satz Zylinder mit neuen Schlüsseln.',
  },
};

const KEY_HINT: InfoHint = {
  title: 'Gemeinsame Schlüssel',
  body:
    'Gemeint ist die Gesamtzahl der Schlüssel, die Sie erhalten. Jeder davon sperrt alle Zylinder '
    + 'dieser Bestellung. Planen Sie einen Schlüssel je Person und zusätzlich einen Reserveschlüssel '
    + 'ein, den Sie getrennt aufbewahren.',
};

/* ---------- Hilfsfunktionen ---------------------------------------------- */

/** Zulässige Maße: Mindestmaß, danach die Schritte aus dem Katalog. */
function measureOptions(form: CylinderFormOption): number[] {
  const step = Math.max(1, form.stepMm);
  const values: number[] = [];
  if (form.minMm % step !== 0) values.push(form.minMm);
  for (let mm = Math.ceil(form.minMm / step) * step; mm <= form.maxMm; mm += step) {
    values.push(mm);
  }
  return values;
}

function nearestOption(values: number[], target: number): number {
  return values.reduce(
    (best, value) => (Math.abs(value - target) < Math.abs(best - target) ? value : best),
    values[0] ?? target,
  );
}

/** Vorbelegung so nah wie möglich am Grundmaß der Bauform. */
function defaultMeasures(form: CylinderFormOption): Pick<CylinderLineItem, 'measureAMm' | 'measureBMm'> {
  const values = measureOptions(form);
  if (form.measures === 'beide') {
    const a = nearestOption(values, form.baseLengthMm / 2);
    return { measureAMm: a, measureBMm: nearestOption(values, form.baseLengthMm - a) };
  }
  return { measureAMm: nearestOption(values, form.baseLengthMm) };
}

function availableFunctions(catalog: CylinderCatalog, formId: CylinderFormOption['id']) {
  return catalog.functions.filter((fn) => fn.active && fn.forms.includes(formId));
}

/** Fortlaufende, vorhersagbare Kennung — gleich auf Server und im Browser. */
function nextUid(items: CylinderLineItem[]): string {
  let index = 1;
  while (items.some((item) => item.uid === `position-${index}`)) index += 1;
  return `position-${index}`;
}

function createItem(catalog: CylinderCatalog, items: CylinderLineItem[]): CylinderLineItem | null {
  const form = catalog.forms.find((f) => f.active);
  if (!form) return null;
  return {
    uid: nextUid(items),
    form: form.id,
    ...defaultMeasures(form),
    functionId: availableFunctions(catalog, form.id)[0]?.id,
    qty: 1,
  };
}

function isItemValid(catalog: CylinderCatalog, item: CylinderLineItem): boolean {
  const form = catalog.forms.find((f) => f.id === item.form && f.active);
  if (!form) return false;

  const values = measureOptions(form);
  if (!values.includes(item.measureAMm)) return false;

  if (form.measures === 'beide') {
    if (item.measureBMm === undefined || !values.includes(item.measureBMm)) return false;
  } else if (item.measureBMm !== undefined) {
    return false;
  }

  const options = availableFunctions(catalog, form.id);
  if (options.length > 0 && !options.some((fn) => fn.id === item.functionId)) return false;

  return item.qty >= 1;
}

function cylinderCount(items: CylinderLineItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

function toDraft(state: ConfigState): CylinderOrderDraft {
  return {
    items: state.items,
    keyCount: state.keyCount,
    extraIds: state.extraIds,
    expandable: state.expandable === true,
  };
}

/** Preis einer einzelnen Position — dieselbe Rechnung wie für die Bestellung. */
function positionTotalCents(catalog: CylinderCatalog, item: CylinderLineItem): number {
  return priceCylinderOrder(
    { items: [item], keyCount: catalog.includedKeys, extraIds: [], expandable: false },
    catalog,
  ).cylindersCents;
}

/* ---------- Konfigurator -------------------------------------------------- */

export function Konfigurator({ catalog }: { catalog: CylinderCatalog }) {
  const router = useRouter();
  const addCylinderOrder = useCartStore((state) => state.addCylinderOrder);
  const [submitting, setSubmitting] = useState(false);

  const extras = useMemo(() => catalog.extras.filter((extra) => extra.active), [catalog]);

  const initial = useMemo<ConfigState>(() => {
    const first = createItem(catalog, []);
    return {
      items: first ? [first] : [],
      keyCount: Math.max(1, catalog.includedKeys),
      extraIds: [],
      expandable: null,
    };
  }, [catalog]);

  const flow = useFlow<ConfigState>({
    id: FLOW_ID,
    steps: STEPS,
    initial,
    version: 1,
    validate: (data, stepId) => {
      const count = cylinderCount(data.items);
      const cylindersOk =
        data.items.length > 0
        && count >= 1
        && count <= catalog.maxCylinders
        && data.items.every((item) => isItemValid(catalog, item));
      const keysOk = data.keyCount >= 1 && data.keyCount <= catalog.maxKeys;

      if (stepId === 'zylinder') return cylindersOk;
      if (stepId === 'schluessel') return keysOk;
      if (stepId === 'erweiterung') return data.expandable !== null;
      if (stepId === 'zusammenfassung') {
        return cylindersOk && keysOk && data.expandable !== null;
      }
      return true;
    },
  });

  const { data } = flow;
  const breakdown = useMemo(() => priceCylinderOrder(toDraft(data), catalog), [data, catalog]);
  const count = cylinderCount(data.items);
  const canAddPosition = count < catalog.maxCylinders && data.items.length < catalog.maxCylinders;
  const extraKeys = Math.max(0, data.keyCount - catalog.includedKeys);

  const blockedHints: Record<string, string> = {
    zylinder:
      data.items.length === 0
        ? 'Bitte legen Sie mindestens eine Position an.'
        : count > catalog.maxCylinders
          ? `Über diesen Weg sind bis zu ${catalog.maxCylinders} Zylinder bestellbar. Bitte verringern Sie die Stückzahl.`
          : 'Bitte prüfen Sie bei jeder Position Bauform, Maße, Funktion und Stückzahl.',
    schluessel: `Bitte wählen Sie zwischen 1 und ${catalog.maxKeys} gemeinsamen Schlüsseln.`,
    erweiterung: 'Bitte wählen Sie aus, ob Ihre Schließung später erweiterbar sein soll.',
    zusammenfassung: 'Bitte vervollständigen Sie die vorherigen Schritte.',
  };

  function updateItem(uid: string, patch: Partial<CylinderLineItem>) {
    flow.set(
      'items',
      data.items.map((item) => (item.uid === uid ? { ...item, ...patch } : item)),
    );
  }

  /** Bauformwechsel: Maße und Funktion auf die neue Bauform anpassen. */
  function changeForm(uid: string, formId: string) {
    const form = catalog.forms.find((f) => f.id === formId && f.active);
    if (!form) return;
    const measures = defaultMeasures(form);
    updateItem(uid, {
      form: form.id,
      measureAMm: measures.measureAMm,
      measureBMm: form.measures === 'beide' ? measures.measureBMm : undefined,
      functionId: availableFunctions(catalog, form.id)[0]?.id,
    });
  }

  function addPosition() {
    const item = createItem(catalog, data.items);
    if (item) flow.set('items', [...data.items, item]);
  }

  function removePosition(uid: string) {
    flow.set('items', data.items.filter((item) => item.uid !== uid));
  }

  function toggleExtra(id: string) {
    flow.set(
      'extraIds',
      data.extraIds.includes(id)
        ? data.extraIds.filter((value) => value !== id)
        : [...data.extraIds, id],
    );
  }

  function handleSubmit() {
    if (!flow.canContinue || submitting) return;
    setSubmitting(true);
    addCylinderOrder(toDraft(data), breakdown.totalCents);
    clearFlow(FLOW_ID);
    router.push('/warenkorb');
  }

  const summary = useMemo<SummarySection[]>(() => {
    const selectedExtras = extras.filter((extra) => data.extraIds.includes(extra.id));

    return [
      {
        title: 'Zylinder',
        rows: breakdown.lines.map((line) => ({
          label: line.label,
          value: `${line.qty} × ${formatCents(line.unitCents)} = ${formatCents(line.totalCents)}`,
        })),
      },
      {
        title: 'Gemeinsame Schlüssel',
        rows: [
          { label: 'Gesamtanzahl', value: `${data.keyCount} Stück` },
          { label: 'Im Grundpreis enthalten', value: `${catalog.includedKeys} Stück` },
          {
            label: 'Zusätzlich berechnet',
            value:
              extraKeys > 0
                ? `${extraKeys} × ${formatCents(catalog.keyPriceCents)} = ${formatCents(breakdown.keysCents)}`
                : 'keine',
          },
        ],
      },
      {
        title: 'Schutz und Optionen',
        rows:
          selectedExtras.length > 0
            ? selectedExtras.map((extra) => ({
                label: extra.label,
                value: `${formatCents(extra.priceCents)} ${
                  extra.unit === 'stueck' ? `je Zylinder · ${breakdown.cylinderCount} Zylinder` : 'einmalig'
                }`,
              }))
            : [{ label: 'Gewählte Optionen', value: 'keine' }],
      },
      {
        title: 'Spätere Erweiterung',
        rows: [
          {
            label: 'Schließung erweiterbar hinterlegen',
            value: data.expandable ? 'ja' : 'nein',
          },
        ],
      },
      {
        title: 'Preis',
        rows: [
          { label: 'Zylinder', value: formatCents(breakdown.cylindersCents) },
          { label: 'Zusätzliche Schlüssel', value: formatCents(breakdown.keysCents) },
          { label: 'Optionen', value: formatCents(breakdown.extrasCents) },
          { label: 'Gesamt', value: formatCents(breakdown.totalCents) },
        ],
      },
    ];
  }, [breakdown, catalog, data.expandable, data.extraIds, data.keyCount, extraKeys, extras]);

  // Ohne gepflegte Bauformen ist keine Zusammenstellung möglich.
  if (catalog.forms.filter((form) => form.active).length === 0) {
    return (
      <Alert tone="warning" title="Zusammenstellung derzeit nicht möglich">
        [Platzhalter: Im Katalog ist zurzeit keine Bauform freigeschaltet.] Bitte nutzen Sie
        vorübergehend die allgemeine Anfrage, damit wir Ihre Zylinder von Hand erfassen können.
      </Alert>
    );
  }

  return (
    <FlowShell
      flow={flow}
      title="Gleichschließende Zylinder"
      submitLabel="In den Warenkorb"
      onSubmit={handleSubmit}
      submitting={submitting}
      blockedHint={blockedHints[flow.step?.id ?? '']}
    >
      <div className="space-y-6">
        {/* Laufende Summe — in jedem Schritt sichtbar */}
        <div
          className="rounded-lg border border-border bg-surface px-4 py-3"
          aria-live="polite"
        >
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                Zylinder
              </dt>
              <dd className="mt-0.5 font-display text-[15px] font-bold text-foreground">
                {breakdown.cylinderCount}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                Schlüssel
              </dt>
              <dd className="mt-0.5 font-display text-[15px] font-bold text-foreground">
                {data.keyCount}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                Optionen
              </dt>
              <dd className="mt-0.5 font-display text-[15px] font-bold text-foreground">
                {data.extraIds.length}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                Laufende Summe
              </dt>
              <dd className="mt-0.5 font-display text-[15px] font-bold text-primary">
                {formatCents(breakdown.totalCents)}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-[12px] leading-snug text-foreground-subtle">
            Die Versandart wählen Sie im Warenkorb. Bis dahin ändert sich die Summe mit jeder
            Anpassung.
          </p>
        </div>

        {/* Schritt 1 — Zylinder */}
        {flow.step?.id === 'zylinder' && (
          <div className="space-y-4">
            <Card variant="muted">
              <CardBody>
                <div className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:items-start">
                  <div>
                    <h3 className="text-[16px] font-bold text-foreground">
                      {catalog.measuringInfo.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                      {catalog.measuringInfo.body}
                    </p>
                  </div>
                  <ImagePlaceholder slot={catalog.measuringFigure} />
                </div>
              </CardBody>
            </Card>

            {data.items.length === 0 && (
              <Alert tone="info" title="Noch keine Position angelegt">
                Legen Sie für jede Tür eine eigene Position an. Bauform und Maße können sich von
                Tür zu Tür unterscheiden.
              </Alert>
            )}

            {data.items.map((item, index) => (
              <PositionCard
                key={item.uid}
                catalog={catalog}
                item={item}
                index={index}
                maxQty={Math.max(1, catalog.maxCylinders - (count - item.qty))}
                canRemove={data.items.length > 1}
                onChangeForm={(formId) => changeForm(item.uid, formId)}
                onUpdate={(patch) => updateItem(item.uid, patch)}
                onRemove={() => removePosition(item.uid)}
              />
            ))}

            <Button variant="outline" size="lg" fullWidth onClick={addPosition} disabled={!canAddPosition}>
              <Plus size={18} aria-hidden />
              Weitere Tür hinzufügen
            </Button>

            <p className="text-[13px] leading-relaxed text-foreground-subtle">
              {canAddPosition
                ? `Bisher ${count} von ${catalog.maxCylinders} möglichen Zylindern.`
                : `Die Höchstzahl von ${catalog.maxCylinders} Zylindern je Bestellung ist erreicht. Für größere Vorhaben planen wir eine Schließanlage.`}
            </p>
          </div>
        )}

        {/* Schritt 2 — Schlüssel */}
        {flow.step?.id === 'schluessel' && (
          <div className="space-y-4">
            <Card>
              <CardBody className="space-y-5">
                <Field
                  label="Anzahl gemeinsamer Schlüssel"
                  info={KEY_HINT}
                  hint={`Möglich sind 1 bis ${catalog.maxKeys} Schlüssel.`}
                  required
                >
                  {({ id, describedBy }) => (
                    <div aria-describedby={describedBy}>
                      <QuantityInput
                        id={id}
                        label="Anzahl gemeinsamer Schlüssel"
                        value={data.keyCount}
                        min={1}
                        max={catalog.maxKeys}
                        onChange={(value) => flow.set('keyCount', value)}
                      />
                    </div>
                  )}
                </Field>

                <dl className="divide-y divide-border rounded-lg border border-border">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
                    <dt className="text-[14px] text-foreground-muted">Im Grundpreis enthalten</dt>
                    <dd className="text-[15px] font-semibold text-foreground">
                      {catalog.includedKeys} Stück
                    </dd>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
                    <dt className="text-[14px] text-foreground-muted">
                      Zusätzliche Schlüssel je {formatCents(catalog.keyPriceCents)}
                    </dt>
                    <dd className="text-[15px] font-semibold text-foreground">
                      {extraKeys} Stück
                    </dd>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 bg-surface-muted px-4 py-3">
                    <dt className="text-[14px] font-semibold text-foreground">Summe Schlüssel</dt>
                    <dd className="text-[15px] font-bold text-foreground">
                      {formatCents(breakdown.keysCents)}
                    </dd>
                  </div>
                </dl>
              </CardBody>
            </Card>

            <Alert tone="info" title="Alle Schlüssel sind gleichwertig">
              Jeder dieser Schlüssel sperrt jeden Zylinder dieser Bestellung. Eine Unterscheidung
              nach Personen oder Türen ist damit nicht möglich — dafür planen wir eine Schließanlage.
            </Alert>
          </div>
        )}

        {/* Schritt 3 — Schutz und Optionen */}
        {flow.step?.id === 'optionen' && (
          <div className="space-y-4">
            <fieldset>
              <legend className="sr-only">Schutz und Optionen auswählen</legend>
              <div className="space-y-3">
                {extras.map((extra) => (
                  <OptionCard
                    key={extra.id}
                    multiple
                    name="zylinder-optionen"
                    value={extra.id}
                    checked={data.extraIds.includes(extra.id)}
                    onSelect={toggleExtra}
                    title={extra.label}
                    description={extra.description}
                    info={extra.info}
                    meta={`${formatCents(extra.priceCents)} ${
                      extra.unit === 'stueck' ? 'je Zylinder' : 'einmalig'
                    }`}
                  />
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
              <p className="text-[14px] font-semibold text-foreground">Summe Optionen</p>
              <p className="text-[15px] font-bold text-foreground">
                {formatCents(breakdown.extrasCents)}
              </p>
            </div>

            <p className="text-[13px] leading-relaxed text-foreground-subtle">
              Optionen mit Preis je Zylinder werden auf alle {breakdown.cylinderCount} Zylinder
              dieser Bestellung gerechnet. Sie können jede Option wieder abwählen.
            </p>
          </div>
        )}

        {/* Schritt 4 — Erweiterung */}
        {flow.step?.id === 'erweiterung' && (
          <div className="space-y-4">
            <fieldset>
              <legend className="mb-3 text-[15px] font-semibold text-foreground">
                Soll Ihre Schließung später erweiterbar sein?
              </legend>
              <div className="space-y-3">
                <OptionCard
                  name="erweiterbar"
                  value="ja"
                  checked={data.expandable === true}
                  onSelect={() => flow.set('expandable', true)}
                  title="Ja, Schließung hinterlegen"
                  description="Später lassen sich weitere Zylinder mit derselben Schließung ergänzen."
                  info={EXPANDABLE_HINTS.ja}
                />
                <OptionCard
                  name="erweiterbar"
                  value="nein"
                  checked={data.expandable === false}
                  onSelect={() => flow.set('expandable', false)}
                  title="Nein, abgeschlossener Satz"
                  description="Die Bestellung bleibt so, wie sie ist. Eine spätere Ergänzung ist nicht zugesagt."
                  info={EXPANDABLE_HINTS.nein}
                />
              </div>
            </fieldset>

            <Alert tone="info" title="Was die Hinterlegung voraussetzt">
              Damit wir Ihre Schließung hinterlegen können, muss die passende Option im Schritt
              „Schutz und Optionen“ ausgewählt sein. Zurzeit haben Sie dort{' '}
              {data.extraIds.length === 0
                ? 'keine Option ausgewählt'
                : `${data.extraIds.length} Option(en) ausgewählt`}
              .
              <span className="mt-3 block">
                <Button variant="outline" size="md" onClick={() => flow.goTo('optionen')}>
                  Optionen noch einmal ansehen
                </Button>
              </span>
            </Alert>
          </div>
        )}

        {/* Schritt 5 — Zusammenfassung */}
        {flow.step?.id === 'zusammenfassung' && (
          <div className="space-y-5">
            <SummaryList sections={summary} />

            <Alert tone="warning" title="Anfertigung nach Ihren Maßen">
              Die Zylinder werden nach den hier angegebenen Maßen gefertigt. Bitte prüfen Sie Maß A
              und Maß B jeder Position, bevor Sie fortfahren. Änderungen sind über die
              Schrittleiste jederzeit möglich.
            </Alert>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="md" onClick={() => flow.goTo('zylinder')}>
                Maße noch einmal prüfen
              </Button>
              <Button variant="ghost" size="md" onClick={flow.reset}>
                Zusammenstellung verwerfen
              </Button>
            </div>
          </div>
        )}
      </div>
    </FlowShell>
  );
}

/* ---------- Eine Position ------------------------------------------------- */

interface PositionCardProps {
  catalog: CylinderCatalog;
  item: CylinderLineItem;
  index: number;
  maxQty: number;
  canRemove: boolean;
  onChangeForm: (formId: string) => void;
  onUpdate: (patch: Partial<CylinderLineItem>) => void;
  onRemove: () => void;
}

function PositionCard({
  catalog,
  item,
  index,
  maxQty,
  canRemove,
  onChangeForm,
  onUpdate,
  onRemove,
}: PositionCardProps) {
  const form = catalog.forms.find((f) => f.id === item.form && f.active);
  const forms = catalog.forms.filter((f) => f.active);
  const functions = catalog.functions.filter((fn) => fn.active);

  if (!form) return null;

  const values = measureOptions(form);
  const measureFigure = catalog.measuringInfo.figure ?? catalog.measuringFigure;
  const positionTotal = positionTotalCents(catalog, item);
  // Nach einem Bauformwechsel oder aus einem alten Zwischenstand kann ein Maß
  // außerhalb des erlaubten Bereichs liegen — dann bleibt die Auswahl leer.
  const hasA = values.includes(item.measureAMm);
  const hasB = item.measureBMm !== undefined && values.includes(item.measureBMm);

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-bold text-foreground">Position {index + 1}</h3>
          <Badge tone="primary">{form.label}</Badge>
        </div>
        {canRemove && (
          <Button variant="ghost" size="md" onClick={onRemove}>
            <Trash2 size={16} aria-hidden />
            Entfernen
            <span className="sr-only"> — Position {index + 1}</span>
          </Button>
        )}
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Bauform */}
        <fieldset>
          <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            Bauform
            <InfoTip
              hint={{
                title: 'Bauform wählen',
                body:
                  'Die Bauform bestimmt, wie der Zylinder bedient wird: beidseitig mit Schlüssel, '
                  + 'innen mit Knauf oder nur von einer Seite. Sie können in einer Bestellung '
                  + 'verschiedene Bauformen mischen — die Schließung bleibt dieselbe.',
              }}
            />
          </legend>
          <div className="grid gap-3 md:grid-cols-3">
            {forms.map((option) => (
              <OptionCard
                key={option.id}
                name={`bauform-${item.uid}`}
                value={option.id}
                checked={option.id === item.form}
                onSelect={onChangeForm}
                title={option.label}
                description={option.description}
                info={option.info}
                meta={`ab ${formatCents(option.basePriceCents)}`}
              />
            ))}
          </div>
        </fieldset>

        {/* Maße */}
        <div className="rounded-lg border border-border bg-surface-muted p-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Maße dieser Tür</h4>
            <InfoTip hint={catalog.measuringInfo} />
          </div>

          <div className="mt-3 grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={form.measureLabels.a}
                hint={`${formatMillimeter(form.minMm)} bis ${formatMillimeter(form.maxMm)}`}
                required
              >
                {({ id, describedBy }) => (
                  <Select
                    id={id}
                    aria-describedby={describedBy}
                    invalid={!hasA}
                    value={hasA ? item.measureAMm : ''}
                    onChange={(event) => onUpdate({ measureAMm: Number(event.target.value) })}
                  >
                    {!hasA && <option value="">Bitte wählen</option>}
                    {values.map((mm) => (
                      <option key={mm} value={mm}>
                        {formatMillimeter(mm)}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>

              {form.measures === 'beide' && (
                <Field
                  label={form.measureLabels.b ?? 'Maß B (innen)'}
                  hint={`${formatMillimeter(form.minMm)} bis ${formatMillimeter(form.maxMm)}`}
                  required
                >
                  {({ id, describedBy }) => (
                    <Select
                      id={id}
                      aria-describedby={describedBy}
                      invalid={!hasB}
                      value={hasB ? item.measureBMm : ''}
                      onChange={(event) => onUpdate({ measureBMm: Number(event.target.value) })}
                    >
                      {!hasB && <option value="">Bitte wählen</option>}
                      {values.map((mm) => (
                        <option key={mm} value={mm}>
                          {formatMillimeter(mm)}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
              )}
            </div>

            <div className="w-full md:w-52">
              <ImagePlaceholder slot={measureFigure} compact />
            </div>
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-foreground-muted">
            Gemessen wird ab Mitte der Stulpschraube — Maß A nach außen
            {form.measures === 'beide' ? ', Maß B nach innen' : ''}. Gesamtlänge dieser Position:{' '}
            {formatMillimeter(item.measureAMm + (item.measureBMm ?? 0))}. Bis{' '}
            {formatMillimeter(form.baseLengthMm)} gilt der Grundpreis, darüber kommen{' '}
            {formatCents(form.lengthSurchargeCents)} je angefangene 5 mm hinzu.
          </p>
        </div>

        {/* Funktion */}
        {functions.length > 0 && (
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-foreground">Funktion</legend>
            <div className="space-y-3">
              {functions.map((fn) => {
                const allowed = fn.forms.includes(form.id);
                return (
                  <OptionCard
                    key={fn.id}
                    name={`funktion-${item.uid}`}
                    value={fn.id}
                    checked={fn.id === item.functionId}
                    disabled={!allowed}
                    onSelect={(value) => {
                      if (allowed) onUpdate({ functionId: value });
                    }}
                    title={fn.label}
                    description={fn.description}
                    info={fn.info}
                    meta={
                      allowed
                        ? fn.surchargeCents > 0
                          ? `+ ${formatCents(fn.surchargeCents)} je Zylinder`
                          : 'ohne Aufpreis'
                        : `nicht für ${form.label}`
                    }
                  />
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Stückzahl und Zwischensumme */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
          <Field
            label="Stückzahl dieser Position"
            hint={`Höchstens ${maxQty} Stück möglich.`}
            className="min-w-0"
          >
            {({ id, describedBy }) => (
              <div aria-describedby={describedBy}>
                <QuantityInput
                  id={id}
                  label={`Stückzahl Position ${index + 1}`}
                  value={item.qty}
                  min={1}
                  max={maxQty}
                  onChange={(value) => onUpdate({ qty: value })}
                />
              </div>
            )}
          </Field>

          <p className="text-right">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Zwischensumme
            </span>
            <span className="mt-0.5 block font-display text-[17px] font-bold text-foreground">
              {formatCents(positionTotal)}
            </span>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
