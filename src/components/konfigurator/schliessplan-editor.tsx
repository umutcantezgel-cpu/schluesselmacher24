'use client';

import { useId } from 'react';

import { Field } from '@/components/forms/field';
import { QuantityInput, Select, TextInput } from '@/components/forms/controls';
import { Button } from '@/components/ui/button';
import { GlyphPapierkorb } from '@/components/visual/glyphen/papierkorb';
import { GlyphPlus } from '@/components/visual/glyphen/plus';
import { measureOptions } from '@/lib/cylinder-rules';
import { cn } from '@/lib/cn';
import { formatCents } from '@/lib/format';
import {
  EBENE_TEXT,
  SCHUTZ_OPTION_ID,
  berechtigen,
  ebene,
  preisFuerPlan,
  pruefeMasse,
  pruefePlan,
  schluesselEntfernen,
  schluesselHinzufuegen,
  tuerEntfernen,
  tuerHinzufuegen,
  type PlanPreis,
  type PlanTuer,
  type Schliessplan,
} from '@/lib/konfigurator';
import type { CylinderCatalog, CylinderForm } from '@/lib/types';

/*
 * Bausteine des Schließplan-Planers (E5-OPUS-01, G-27): Türen mit Bauform, Maßen, Funktion und
 * Schutz aus dem Zylinderkatalog, Schlüssel mit Anzahl und Vormerkung, die Matrix „welcher
 * Schlüssel schließt welche Tür“ (mobil je Schlüssel als Liste, ab 768 px als Tabelle), Befunde und
 * die laufende Summe. Alle Regeln kommen aus dem Kern (src/lib/konfigurator); hier stehen nur
 * Darstellung und Bedienung. Preise nennt nur die Summe, und nur, wenn der Katalog sie rechnen
 * kann (G9, R9).
 */

export interface EditorProps {
  plan: Schliessplan;
  katalog: CylinderCatalog;
  onChange: (plan: Schliessplan) => void;
}

const nr2 = (n: number) => String(n).padStart(2, '0');

/** Erste angebotene Bauform, bevorzugt der Doppelzylinder. */
function standardForm(katalog: CylinderCatalog) {
  const aktiv = katalog.forms.filter((f) => f.active);
  return aktiv.find((f) => f.id === 'doppelzylinder') ?? aktiv[0];
}

/** Wählbares Maß nahe am Wunsch: der Wunsch selbst, sonst das kleinste wählbare Maß darüber. */
function passendesMass(erlaubt: number[], wunsch: number): number {
  if (erlaubt.includes(wunsch)) return wunsch;
  return erlaubt.find((mm) => mm >= wunsch) ?? erlaubt[erlaubt.length - 1] ?? wunsch;
}

/** Eine neue Tür mit wählbaren Standardwerten (30/30 mm, sonst die nächste Stufe). */
export function neueTuer(katalog: CylinderCatalog, bezeichnung: string): Omit<PlanTuer, 'id'> {
  const form = standardForm(katalog);
  if (!form) return { bezeichnung, form: 'doppelzylinder', a: 30, b: 30 };
  const erlaubt = measureOptions(form);
  const a = passendesMass(erlaubt, 30);
  return { bezeichnung, form: form.id, a, ...(form.measures === 'beide' ? { b: a } : {}) };
}

/** Bauform wechseln: Maße auf wählbare Werte setzen, Maß B und Funktion nur, wo es sie gibt. */
export function formWechseln(tuer: PlanTuer, formId: CylinderForm, katalog: CylinderCatalog): PlanTuer {
  const form = katalog.forms.find((f) => f.id === formId);
  if (!form) return tuer;
  const erlaubt = measureOptions(form);
  const a = passendesMass(erlaubt, tuer.a);
  const funktion = katalog.functions.find((f) => f.id === tuer.funktionId && f.active && f.forms.includes(formId));
  const { b: _b, funktionId: _f, ...rest } = tuer;
  void _b;
  void _f;
  return {
    ...rest,
    form: formId,
    a,
    ...(form.measures === 'beide' ? { b: passendesMass(erlaubt, tuer.b ?? a) } : {}),
    ...(funktion ? { funktionId: funktion.id } : {}),
  };
}

function tuerAendern(plan: Schliessplan, id: string, aenderung: (t: PlanTuer) => PlanTuer): Schliessplan {
  return { ...plan, tueren: plan.tueren.map((t) => (t.id === id ? aenderung(t) : t)), masseGeprueft: false };
}

/* ---------- Türen -------------------------------------------------------- */

/** Nach dem Entfernen bleibt der Fokus im Bereich: auf dem Knopf zum Hinzufügen (WCAG 2.4.3). */
function fokusNach(id: string) {
  requestAnimationFrame(() => document.getElementById(id)?.focus());
}

export function TuerenListe({ plan, katalog, onChange }: EditorProps) {
  const neuId = useId();
  const formen = katalog.forms.filter((f) => f.active);
  const schutz = katalog.extras.find((e) => e.id === SCHUTZ_OPTION_ID && e.active);
  const hinzufuegen = () => onChange({ ...tuerHinzufuegen(plan, neueTuer(katalog, `Tür ${plan.tueren.length + 1}`)), masseGeprueft: false });

  return (
    <div className="space-y-4">
      <ol className="space-y-4">
        {plan.tueren.map((tuer, index) => {
          const form = katalog.forms.find((f) => f.id === tuer.form);
          const masse = form ? measureOptions(form) : [];
          const funktionen = katalog.functions.filter((f) => f.active && f.forms.includes(tuer.form));
          const mitSchutz = tuer.optionen?.includes(SCHUTZ_OPTION_ID) ?? false;
          return (
            <li key={tuer.id}>
              <fieldset className="rounded-lg border border-border bg-surface p-4 sm:p-5">
                <legend className="sr-only">
                  Tür {index + 1}: {tuer.bezeichnung || 'ohne Bezeichnung'}
                </legend>
                <div className="flex items-center justify-between gap-3">
                  <p aria-hidden className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                    Tür {nr2(index + 1)}
                  </p>
                  <div className="flex flex-wrap justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange({ ...tuerHinzufuegen(plan, { ...tuer, bezeichnung: `${tuer.bezeichnung} (Kopie)`.slice(0, 60) }), masseGeprueft: false })}
                      aria-label={`Tür „${tuer.bezeichnung || index + 1}“ kopieren`}
                    >
                      Kopieren
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onChange({ ...tuerEntfernen(plan, tuer.id), masseGeprueft: false });
                        fokusNach(neuId);
                      }}
                      aria-label={`Tür „${tuer.bezeichnung || index + 1}“ entfernen`}
                    >
                      <GlyphPapierkorb size={16} />
                      Entfernen
                    </Button>
                  </div>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <Field label="Bezeichnung der Tür" required className="sm:col-span-2" hint="Zum Beispiel Haustür, Keller oder Wohnung 1.">
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        value={tuer.bezeichnung}
                        maxLength={60}
                        onChange={(e) => onChange(tuerAendern(plan, tuer.id, (t) => ({ ...t, bezeichnung: e.target.value })))}
                      />
                    )}
                  </Field>

                  <Field label="Bauform">
                    {({ id }) => (
                      <Select
                        id={id}
                        value={tuer.form}
                        onChange={(e) => onChange(tuerAendern(plan, tuer.id, (t) => formWechseln(t, e.target.value as CylinderForm, katalog)))}
                      >
                        {formen.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.label}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>

                  {funktionen.length > 1 && (
                    <Field label="Funktion">
                      {({ id }) => (
                        <Select
                          id={id}
                          value={tuer.funktionId ?? funktionen[0].id}
                          onChange={(e) =>
                            onChange(tuerAendern(plan, tuer.id, (t) => ({ ...t, funktionId: e.target.value === 'standard' ? undefined : e.target.value })))
                          }
                        >
                          {funktionen.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.label}
                            </option>
                          ))}
                        </Select>
                      )}
                    </Field>
                  )}

                  <Field label={form?.measureLabels.a ?? 'Maß A (außen)'}>
                    {({ id }) => (
                      <Select
                        id={id}
                        value={tuer.a}
                        className="font-mono tabular-nums"
                        onChange={(e) => onChange(tuerAendern(plan, tuer.id, (t) => ({ ...t, a: Number(e.target.value) })))}
                      >
                        {masse.map((mm) => (
                          <option key={mm} value={mm}>
                            {mm} mm
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>

                  {form?.measures === 'beide' && (
                    <Field label={form.measureLabels.b ?? 'Maß B (innen)'}>
                      {({ id }) => (
                        <Select
                          id={id}
                          value={tuer.b ?? masse[0]}
                          className="font-mono tabular-nums"
                          onChange={(e) => onChange(tuerAendern(plan, tuer.id, (t) => ({ ...t, b: Number(e.target.value) })))}
                        >
                          {masse.map((mm) => (
                            <option key={mm} value={mm}>
                              {mm} mm
                            </option>
                          ))}
                        </Select>
                      )}
                    </Field>
                  )}

                  {schutz && (
                    <label className="flex min-h-touch cursor-pointer items-center gap-3 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={mitSchutz}
                        onChange={(e) =>
                          onChange(
                            tuerAendern(plan, tuer.id, (t) => {
                              const ohne = (t.optionen ?? []).filter((o) => o !== SCHUTZ_OPTION_ID);
                              const optionen = e.target.checked ? [...ohne, SCHUTZ_OPTION_ID] : ohne;
                              const { optionen: _o, ...rest } = t;
                              void _o;
                              return optionen.length ? { ...rest, optionen } : rest;
                            }),
                          )
                        }
                        className="h-5 w-5 shrink-0 rounded border-border-strong"
                      />
                      <span className="text-body text-foreground">{schutz.label}</span>
                    </label>
                  )}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>
      <Button id={neuId} variant="outline" onClick={hinzufuegen}>
        <GlyphPlus size={18} />
        Tür hinzufügen
      </Button>
    </div>
  );
}

/* ---------- Schlüssel und Matrix ----------------------------------------- */

function schluesselAendern(plan: Schliessplan, id: string, patch: Partial<Schliessplan['schluessel'][number]>): Schliessplan {
  return { ...plan, schluessel: plan.schluessel.map((s) => (s.id === id ? { ...s, ...patch } : s)) };
}

/** Alle Türen für einen Schlüssel setzen oder lösen. */
export function alleTueren(plan: Schliessplan, schluesselId: string, schliesst: boolean): Schliessplan {
  return plan.tueren.reduce((p, t) => berechtigen(p, schluesselId, t.id, schliesst), plan);
}

export function SchluesselMatrix({ plan, onChange }: Omit<EditorProps, 'katalog'>) {
  const neuId = useId();
  const hinzufuegen = () => onChange(schluesselHinzufuegen(plan, { bezeichnung: `Schlüssel ${plan.schluessel.length + 1}`, anzahl: 1 }));
  const darf = (schluesselId: string, tuerId: string) => (plan.berechtigungen[schluesselId] ?? []).includes(tuerId);

  return (
    <div className="space-y-6">
      <ol className="space-y-4">
        {plan.schluessel.map((s, index) => {
          const alle = plan.tueren.length > 0 && plan.tueren.every((t) => darf(s.id, t.id));
          return (
            <li key={s.id}>
              <fieldset className="rounded-lg border border-border bg-surface p-4 sm:p-5">
                <legend className="sr-only">
                  Schlüssel {index + 1}: {s.bezeichnung || 'ohne Bezeichnung'}
                </legend>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                    <span aria-hidden>Schlüssel {nr2(index + 1)} · </span>
                    {EBENE_TEXT[ebene(plan, s.id)]}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onChange(schluesselEntfernen(plan, s.id));
                      fokusNach(neuId);
                    }}
                    aria-label={`Schlüssel „${s.bezeichnung || index + 1}“ entfernen`}
                  >
                    <GlyphPapierkorb size={16} />
                    Entfernen
                  </Button>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                  <Field label="Wer bekommt ihn?" required hint="Zum Beispiel Familie, Wohnung 1 oder Hausverwaltung.">
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        value={s.bezeichnung}
                        maxLength={60}
                        onChange={(e) => onChange(schluesselAendern(plan, s.id, { bezeichnung: e.target.value }))}
                      />
                    )}
                  </Field>
                  <Field label="Anzahl jetzt">
                    {({ id }) => (
                      <QuantityInput
                        id={id}
                        label="Anzahl jetzt"
                        value={s.anzahl}
                        min={1}
                        max={100}
                        onChange={(anzahl) => onChange(schluesselAendern(plan, s.id, { anzahl }))}
                      />
                    )}
                  </Field>
                  <Field label="Für später vormerken" info={{ title: 'Für später vormerken', body: 'Schlüssel, die Sie erst später brauchen, planen wir jetzt mit ein. So lassen sie sich nachbestellen, ohne die Anlage zu ändern.' }}>
                    {({ id }) => (
                      <QuantityInput
                        id={id}
                        label="Für später vormerken"
                        value={s.reserve ?? 0}
                        min={0}
                        max={100}
                        onChange={(reserve) => onChange(schluesselAendern(plan, s.id, { reserve: reserve || undefined }))}
                      />
                    )}
                  </Field>
                </div>

                {/* Mobil: die Türen dieses Schlüssels als Liste; ab 768 px steht die Matrix darunter */}
                <fieldset className="mt-4 md:hidden">
                  <legend className="text-small font-semibold text-foreground">Dieser Schlüssel schließt</legend>
                  <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                    <li>
                      <label className="flex min-h-touch cursor-pointer items-center gap-3 px-3">
                        <input
                          type="checkbox"
                          checked={alle}
                          onChange={(e) => onChange(alleTueren(plan, s.id, e.target.checked))}
                          className="h-5 w-5 shrink-0 rounded border-border-strong"
                        />
                        <span className="text-body font-semibold text-foreground">alle Türen</span>
                      </label>
                    </li>
                    {plan.tueren.map((t) => (
                      <li key={t.id}>
                        <label className="flex min-h-touch cursor-pointer items-center gap-3 px-3">
                          <input
                            type="checkbox"
                            checked={darf(s.id, t.id)}
                            onChange={(e) => onChange(berechtigen(plan, s.id, t.id, e.target.checked))}
                            className="h-5 w-5 shrink-0 rounded border-border-strong"
                          />
                          <span className="text-body text-foreground">{t.bezeichnung || 'Tür ohne Bezeichnung'}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <Button id={neuId} variant="outline" onClick={hinzufuegen}>
        <GlyphPlus size={18} />
        Schlüssel hinzufügen
      </Button>

      {plan.schluessel.length > 0 && plan.tueren.length > 0 && (
        <div className="hidden md:block">
          <h3 className="text-title-sm font-bold text-foreground">Schließmatrix</h3>
          <p className="mt-1 max-w-measure text-small text-foreground-muted">Ein Haken heißt: Dieser Schlüssel schließt diese Tür.</p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-small">
              <caption className="sr-only">Schließmatrix: welcher Schlüssel welche Tür schließt</caption>
              <thead>
                <tr className="bg-surface-muted">
                  <th scope="col" className="sticky left-0 bg-surface-muted px-3 py-2 text-left font-semibold text-foreground">
                    Schlüssel
                  </th>
                  {plan.tueren.map((t) => (
                    <th key={t.id} scope="col" className="min-w-24 px-2 py-2 text-center font-semibold text-foreground">
                      {t.bezeichnung || 'Tür'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plan.schluessel.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <th scope="row" className="sticky left-0 bg-surface px-3 py-1 text-left font-semibold text-foreground">
                      {s.bezeichnung || 'Schlüssel'}
                      <span className="block font-mono text-caption font-normal tabular-nums text-foreground-muted">× {s.anzahl}</span>
                    </th>
                    {plan.tueren.map((t) => (
                      <td key={t.id} className="px-2 py-1 text-center">
                        <label className="inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center">
                          <input
                            type="checkbox"
                            checked={darf(s.id, t.id)}
                            onChange={(e) => onChange(berechtigen(plan, s.id, t.id, e.target.checked))}
                            aria-label={`„${s.bezeichnung || 'Schlüssel'}“ schließt „${t.bezeichnung || 'Tür'}“`}
                            className="h-5 w-5 rounded border-border-strong"
                          />
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Befunde und Summe -------------------------------------------- */

export interface Befund {
  art: 'fehler' | 'hinweis';
  text: string;
}

/** Befunde aus Planprüfung und Maßprüfung; Rückfragen zu Maßen sind Hinweise, sie sperren nicht. */
export function planBefunde(plan: Schliessplan, katalog: CylinderCatalog): Befund[] {
  return [
    ...pruefePlan(plan),
    ...pruefeMasse(plan, katalog).befunde.map((b): Befund => ({ art: b.art === 'fehler' ? 'fehler' : 'hinweis', text: b.text })),
  ];
}

export function PlanBefunde({ plan, katalog, className }: { plan: Schliessplan; katalog: CylinderCatalog; className?: string }) {
  const befunde = planBefunde(plan, katalog);
  return (
    <div className={className} aria-live="polite">
      {befunde.length === 0 ? (
        <p className="text-small font-semibold text-success">Der Plan ist vollständig.</p>
      ) : (
        <ul className="space-y-2">
          {befunde.map((b, i) => (
            <li key={i} className={cn('flex gap-2 text-small', b.art === 'fehler' ? 'text-foreground' : 'text-foreground-muted')}>
              <span className={cn('shrink-0 font-semibold', b.art === 'fehler' ? 'text-danger' : 'text-foreground-muted')}>
                {b.art === 'fehler' ? 'Fehlt:' : 'Hinweis:'}
              </span>
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Kurzform der Summe für den Ablaufrahmen (Band und Leiste). */
export function summeKurz(preis: PlanPreis): { label: string; wert: string } {
  if (preis.art === 'preis') return { label: 'Gesamt', wert: formatCents(preis.aufstellung.totalCents) };
  return { label: 'Preis', wert: preis.art === 'angebot' ? 'mit Angebot' : 'offen' };
}

export function PlanSumme({ plan, katalog, extraIds = [] }: { plan: Schliessplan; katalog: CylinderCatalog; extraIds?: string[] }) {
  const preis = preisFuerPlan(plan, katalog, extraIds);
  const schluessel = plan.schluessel.reduce((n, s) => n + s.anzahl, 0);
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <dl className="grid grid-cols-2 gap-3">
        <div>
          <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">Türen</dt>
          <dd className="font-mono text-title-sm font-semibold tabular-nums text-foreground">{plan.tueren.length}</dd>
        </div>
        <div>
          <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">Schlüssel</dt>
          <dd className="font-mono text-title-sm font-semibold tabular-nums text-foreground">{schluessel}</dd>
        </div>
        <div className="col-span-2 border-t border-border pt-3">
          <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
            {preis.art === 'preis' ? 'Gesamtpreis' : 'Preis'}
          </dt>
          <dd className="text-title-sm font-semibold text-foreground">
            {preis.art === 'preis' ? (
              <span className="font-mono tabular-nums">{formatCents(preis.aufstellung.totalCents)}</span>
            ) : preis.art === 'angebot' ? (
              'mit dem Angebot'
            ) : (
              'sobald der Plan vollständig ist'
            )}
          </dd>
        </div>
      </dl>
      {preis.art !== 'preis' && <p className="mt-2 text-small text-foreground-muted">{preis.grund}</p>}
      {preis.art === 'preis' && (
        <p className="mt-2 text-small text-foreground-muted">
          Alle Schlüssel schließen alle Türen. Man nennt das eine Sperrschließung. Preis wie im Konfigurator für gleichschließende Zylinder, inklusive{' '}
          {katalog.includedKeys} Schlüssel.
        </p>
      )}
    </div>
  );
}
