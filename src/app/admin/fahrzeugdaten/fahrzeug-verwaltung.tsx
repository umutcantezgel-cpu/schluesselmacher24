'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

import { saveContent } from '@/lib/actions/admin';
import type { SaveResult } from '@/lib/actions/admin';
import type { CarKeyService, KeyKind, PricingGroup, VehicleMake, VehicleModel } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { Select, TextArea, TextInput } from '@/components/forms/controls';

const SCHLUESSELARTEN: Array<{ id: KeyKind; label: string }> = [
  { id: 'mechanisch', label: 'Mechanisch' },
  { id: 'funk', label: 'Funkschlüssel' },
  { id: 'klappschluessel', label: 'Klappschlüssel' },
  { id: 'smart-key', label: 'Smart Key' },
  { id: 'keyless', label: 'Keyless' },
];

/** Erzeugt eine URL-taugliche Kennung aus einem Namen. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function jahr(value: string): number | null {
  const text = value.trim();
  if (!/^\d{4}$/.test(text)) return null;
  return Number(text);
}

export interface FahrzeugVerwaltungProps {
  makes: VehicleMake[];
  pricingGroups: PricingGroup[];
  services: CarKeyService[];
}

export function FahrzeugVerwaltung({ makes, pricingGroups, services }: FahrzeugVerwaltungProps) {
  const router = useRouter();
  const [entwurf, setEntwurf] = useState<VehicleMake[]>(makes);
  const [leistungen, setLeistungen] = useState<CarKeyService[]>(services);
  const [offen, setOffen] = useState<string | null>(entwurf[0]?.id ?? null);
  const [meldung, setMeldung] = useState<SaveResult | null>(null);
  const [leistungsMeldung, setLeistungsMeldung] = useState<SaveResult | null>(null);
  const [neueMarke, setNeueMarke] = useState('');
  const [speichert, starteSpeichern] = useTransition();

  const geaendert = JSON.stringify(entwurf) !== JSON.stringify(makes);
  const leistungenGeaendert = JSON.stringify(leistungen) !== JSON.stringify(services);

  function aendereMarke(id: string, patch: Partial<VehicleMake>) {
    setEntwurf((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function aendereModell(makeId: string, modelId: string, patch: Partial<VehicleModel>) {
    setEntwurf((prev) =>
      prev.map((m) =>
        m.id === makeId
          ? { ...m, models: m.models.map((mo) => (mo.id === modelId ? { ...mo, ...patch } : mo)) }
          : m,
      ),
    );
  }

  function markeHinzufuegen() {
    const name = neueMarke.trim();
    if (name === '') return;
    const slug = slugify(name);
    if (entwurf.some((m) => m.slug === slug)) {
      setMeldung({ ok: false, message: `„${name}“ ist bereits angelegt.` });
      return;
    }
    const neu: VehicleMake = {
      id: slug,
      slug,
      name,
      pricingGroupId: pricingGroups[0]?.id ?? '',
      intro: '',
      image: { motif: `Werkstattfoto: Schlüsselbearbeitung ${name}`, ratio: '16/9' },
      models: [],
    };
    setEntwurf((prev) => [...prev, neu]);
    setNeueMarke('');
    setOffen(slug);
    setMeldung(null);
  }

  function markeEntfernen(id: string) {
    setEntwurf((prev) => prev.filter((m) => m.id !== id));
    if (offen === id) setOffen(null);
  }

  function modellHinzufuegen(makeId: string) {
    setEntwurf((prev) =>
      prev.map((m) => {
        if (m.id !== makeId) return m;
        const nummer = m.models.length + 1;
        const id = `neues-modell-${nummer}`;
        return {
          ...m,
          models: [
            ...m.models,
            {
              id,
              slug: id,
              name: '',
              yearFrom: new Date().getFullYear(),
              keyKinds: ['funk'],
              requiresVehicleOnSite: true,
            },
          ],
        };
      }),
    );
  }

  function modellEntfernen(makeId: string, modelId: string) {
    setEntwurf((prev) =>
      prev.map((m) =>
        m.id === makeId ? { ...m, models: m.models.filter((mo) => mo.id !== modelId) } : m,
      ),
    );
  }

  function speichern() {
    // Namen und Kennungen vor dem Speichern in Einklang bringen.
    const bereinigt: VehicleMake[] = entwurf.map((make) => ({
      ...make,
      models: make.models
        .filter((model) => model.name.trim() !== '')
        .map((model) => ({
          ...model,
          name: model.name.trim(),
          id: model.slug && model.slug !== '' ? model.slug : slugify(model.name),
          slug: model.slug && !model.slug.startsWith('neues-modell') ? model.slug : slugify(model.name),
        })),
    }));

    starteSpeichern(async () => {
      const ergebnis = await saveContent('vehicleMakes', bereinigt);
      setMeldung(ergebnis);
      if (ergebnis.ok) {
        setEntwurf(bereinigt);
        router.refresh();
      }
    });
  }

  function leistungenSpeichern() {
    starteSpeichern(async () => {
      const ergebnis = await saveContent('carKeyServices', leistungen);
      setLeistungsMeldung(ergebnis);
      if (ergebnis.ok) router.refresh();
    });
  }

  const modelleGesamt = entwurf.reduce((summe, m) => summe + m.models.length, 0);

  return (
    <div className="mt-8 space-y-8">
      {/* ── Marken und Modelle ───────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-bold text-foreground">Marken und Modelle</h2>
            <p className="mt-0.5 text-[13px] text-foreground-muted">
              {entwurf.length} Marken mit insgesamt {modelleGesamt} Modellen
            </p>
          </div>
          {geaendert && <Badge tone="warning">Ungespeicherte Änderungen</Badge>}
        </CardHeader>

        <CardBody className="space-y-3">
          {entwurf.map((make) => {
            const istOffen = offen === make.id;
            return (
              <div key={make.id} className="rounded-lg border border-border">
                <div className="flex items-stretch">
                  <button
                    type="button"
                    onClick={() => setOffen(istOffen ? null : make.id)}
                    aria-expanded={istOffen}
                    className="flex min-h-[52px] flex-1 items-center justify-between gap-3 px-4 text-left"
                  >
                    <span>
                      <span className="block text-[15px] font-semibold text-foreground">
                        {make.name}
                      </span>
                      <span className="block text-[13px] text-foreground-muted">
                        {make.models.length} Modelle ·{' '}
                        {pricingGroups.find((g) => g.id === make.pricingGroupId)?.label ??
                          'ohne Preisgruppe'}
                      </span>
                    </span>
                    {istOffen ? (
                      <ChevronUp size={18} aria-hidden className="text-foreground-subtle" />
                    ) : (
                      <ChevronDown size={18} aria-hidden className="text-foreground-subtle" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => markeEntfernen(make.id)}
                    className="w-14 shrink-0 border-l border-border text-foreground-subtle hover:text-danger"
                  >
                    <Trash2 size={16} aria-hidden className="mx-auto" />
                    <span className="sr-only">Marke {make.name} entfernen</span>
                  </button>
                </div>

                {istOffen && (
                  <div className="space-y-6 border-t border-border bg-surface-muted p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Name der Marke">
                        {({ id }) => (
                          <TextInput
                            id={id}
                            value={make.name}
                            onChange={(e) => aendereMarke(make.id, { name: e.target.value })}
                          />
                        )}
                      </Field>

                      <Field
                        label="Preisgruppe"
                        info={{
                          title: 'Preisgruppe',
                          body:
                            'Bestimmt, welche Preisregel für diese Marke gilt. Einzelne Modelle '
                            + 'können davon abweichen.',
                        }}
                      >
                        {({ id }) => (
                          <Select
                            id={id}
                            value={make.pricingGroupId}
                            onChange={(e) =>
                              aendereMarke(make.id, { pricingGroupId: e.target.value })
                            }
                          >
                            {pricingGroups.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.label}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Field>

                      <Field
                        label="Einleitungstext der Markenseite"
                        hint="Erscheint auf /autoschluessel/marken/… über der Modelltabelle."
                        className="sm:col-span-2"
                      >
                        {({ id, describedBy }) => (
                          <TextArea
                            id={id}
                            aria-describedby={describedBy}
                            rows={3}
                            value={make.intro ?? ''}
                            onChange={(e) => aendereMarke(make.id, { intro: e.target.value })}
                          />
                        )}
                      </Field>
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                        Modelle
                      </p>

                      <div className="space-y-3">
                        {make.models.map((model) => (
                          <div
                            key={model.id}
                            className="rounded-lg border border-border bg-surface p-4"
                          >
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                              <Field label="Modell" className="lg:col-span-2">
                                {({ id }) => (
                                  <TextInput
                                    id={id}
                                    value={model.name}
                                    onChange={(e) =>
                                      aendereModell(make.id, model.id, { name: e.target.value })
                                    }
                                  />
                                )}
                              </Field>

                              <Field label="Baujahr von">
                                {({ id }) => (
                                  <TextInput
                                    id={id}
                                    inputMode="numeric"
                                    value={String(model.yearFrom)}
                                    onChange={(e) => {
                                      const wert = jahr(e.target.value);
                                      if (wert !== null) {
                                        aendereModell(make.id, model.id, { yearFrom: wert });
                                      }
                                    }}
                                  />
                                )}
                              </Field>

                              <Field label="Baujahr bis" hint="Leer = weiterhin aktuell">
                                {({ id, describedBy }) => (
                                  <TextInput
                                    id={id}
                                    aria-describedby={describedBy}
                                    inputMode="numeric"
                                    value={model.yearTo ? String(model.yearTo) : ''}
                                    onChange={(e) =>
                                      aendereModell(make.id, model.id, {
                                        yearTo: jahr(e.target.value) ?? undefined,
                                      })
                                    }
                                  />
                                )}
                              </Field>

                              <Field
                                label="Abweichende Preisgruppe"
                                hint="Leer = Preisgruppe der Marke"
                                className="lg:col-span-2"
                              >
                                {({ id, describedBy }) => (
                                  <Select
                                    id={id}
                                    aria-describedby={describedBy}
                                    value={model.pricingGroupId ?? ''}
                                    onChange={(e) =>
                                      aendereModell(make.id, model.id, {
                                        pricingGroupId: e.target.value || undefined,
                                      })
                                    }
                                  >
                                    <option value="">Preisgruppe der Marke</option>
                                    {pricingGroups.map((g) => (
                                      <option key={g.id} value={g.id}>
                                        {g.label}
                                      </option>
                                    ))}
                                  </Select>
                                )}
                              </Field>

                              <Field label="Bemerkung" className="lg:col-span-2">
                                {({ id }) => (
                                  <TextInput
                                    id={id}
                                    value={model.notes ?? ''}
                                    placeholder="z. B. ab Modelljahr 2019 nur mit Herstellerzugang"
                                    onChange={(e) =>
                                      aendereModell(make.id, model.id, {
                                        notes: e.target.value || undefined,
                                      })
                                    }
                                  />
                                )}
                              </Field>
                            </div>

                            <fieldset className="mt-4">
                              <legend className="text-sm font-semibold text-foreground">
                                Mögliche Schlüsselarten
                              </legend>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {SCHLUESSELARTEN.map((art) => {
                                  const aktiv = model.keyKinds.includes(art.id);
                                  return (
                                    <label
                                      key={art.id}
                                      className={[
                                        'inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-lg border px-3 text-[13px] font-semibold',
                                        aktiv
                                          ? 'border-primary bg-primary-soft text-primary'
                                          : 'border-border bg-surface text-foreground-muted',
                                      ].join(' ')}
                                    >
                                      <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={aktiv}
                                        onChange={() =>
                                          aendereModell(make.id, model.id, {
                                            keyKinds: aktiv
                                              ? model.keyKinds.filter((k) => k !== art.id)
                                              : [...model.keyKinds, art.id],
                                          })
                                        }
                                      />
                                      {art.label}
                                    </label>
                                  );
                                })}
                              </div>
                            </fieldset>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                              <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-foreground">
                                <input
                                  type="checkbox"
                                  checked={model.requiresVehicleOnSite}
                                  onChange={(e) =>
                                    aendereModell(make.id, model.id, {
                                      requiresVehicleOnSite: e.target.checked,
                                    })
                                  }
                                  className="h-5 w-5 accent-[hsl(var(--primary))]"
                                />
                                Fahrzeug muss beim Termin vor Ort sein
                              </label>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => modellEntfernen(make.id, model.id)}
                              >
                                <Trash2 size={15} aria-hidden />
                                Modell entfernen
                              </Button>
                            </div>
                          </div>
                        ))}

                        {make.models.length === 0 && (
                          <p className="text-[13px] text-foreground-subtle">
                            Für diese Marke ist noch kein Modell hinterlegt.
                          </p>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => modellHinzufuegen(make.id)}
                      >
                        <Plus size={15} aria-hidden />
                        Modell hinzufügen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border-strong p-4 sm:flex-row sm:items-end">
            <Field label="Neue Marke" className="flex-1">
              {({ id }) => (
                <TextInput
                  id={id}
                  value={neueMarke}
                  placeholder="z. B. Peugeot"
                  onChange={(e) => setNeueMarke(e.target.value)}
                />
              )}
            </Field>
            <Button variant="outline" onClick={markeHinzufuegen} disabled={neueMarke.trim() === ''}>
              <Plus size={16} aria-hidden />
              Marke anlegen
            </Button>
          </div>
        </CardBody>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <div aria-live="polite" className="min-w-0 flex-1">
            {meldung && (
              <p
                className={[
                  'text-[13px] font-semibold',
                  meldung.ok ? 'text-success' : 'text-danger',
                ].join(' ')}
              >
                {meldung.message}
              </p>
            )}
          </div>
          <Button onClick={speichern} loading={speichert} disabled={!geaendert}>
            Marken und Modelle speichern
          </Button>
        </CardFooter>
      </Card>

      {/* ── Leistungen ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-bold text-foreground">Leistungen im Autoschlüssel-Bereich</h2>
            <p className="mt-0.5 text-[13px] text-foreground-muted">
              Bestimmt, was im Assistenten zur Auswahl steht.
            </p>
          </div>
          {leistungenGeaendert && <Badge tone="warning">Ungespeicherte Änderungen</Badge>}
        </CardHeader>

        <CardBody className="space-y-4">
          {leistungen.map((leistung, index) => (
            <div key={leistung.id} className="rounded-lg border border-border p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Bezeichnung">
                  {({ id }) => (
                    <TextInput
                      id={id}
                      value={leistung.label}
                      onChange={(e) =>
                        setLeistungen((prev) =>
                          prev.map((l, i) => (i === index ? { ...l, label: e.target.value } : l)),
                        )
                      }
                    />
                  )}
                </Field>

                <Field label="Beschreibung">
                  {({ id }) => (
                    <TextInput
                      id={id}
                      value={leistung.description}
                      onChange={(e) =>
                        setLeistungen((prev) =>
                          prev.map((l, i) =>
                            i === index ? { ...l, description: e.target.value } : l,
                          ),
                        )
                      }
                    />
                  )}
                </Field>
              </div>

              <fieldset className="mt-4">
                <legend className="text-sm font-semibold text-foreground">
                  Angeboten für diese Schlüsselarten
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SCHLUESSELARTEN.map((art) => {
                    const aktiv = leistung.keyKinds.includes(art.id);
                    return (
                      <label
                        key={art.id}
                        className={[
                          'inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-lg border px-3 text-[13px] font-semibold',
                          aktiv
                            ? 'border-primary bg-primary-soft text-primary'
                            : 'border-border bg-surface text-foreground-muted',
                        ].join(' ')}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={aktiv}
                          onChange={() =>
                            setLeistungen((prev) =>
                              prev.map((l, i) =>
                                i === index
                                  ? {
                                      ...l,
                                      keyKinds: aktiv
                                        ? l.keyKinds.filter((k) => k !== art.id)
                                        : [...l.keyKinds, art.id],
                                    }
                                  : l,
                              ),
                            )
                          }
                        />
                        {art.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-4 flex flex-wrap gap-6">
                <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={leistung.requiresVehicleOnSite}
                    onChange={(e) =>
                      setLeistungen((prev) =>
                        prev.map((l, i) =>
                          i === index ? { ...l, requiresVehicleOnSite: e.target.checked } : l,
                        ),
                      )
                    }
                    className="h-5 w-5 accent-[hsl(var(--primary))]"
                  />
                  Fahrzeug vor Ort nötig
                </label>

                <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={leistung.active}
                    onChange={(e) =>
                      setLeistungen((prev) =>
                        prev.map((l, i) => (i === index ? { ...l, active: e.target.checked } : l)),
                      )
                    }
                    className="h-5 w-5 accent-[hsl(var(--primary))]"
                  />
                  Aktiv (im Assistenten sichtbar)
                </label>
              </div>
            </div>
          ))}
        </CardBody>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <div aria-live="polite" className="min-w-0 flex-1">
            {leistungsMeldung && (
              <p
                className={[
                  'text-[13px] font-semibold',
                  leistungsMeldung.ok ? 'text-success' : 'text-danger',
                ].join(' ')}
              >
                {leistungsMeldung.message}
              </p>
            )}
          </div>
          <Button onClick={leistungenSpeichern} loading={speichert} disabled={!leistungenGeaendert}>
            Leistungen speichern
          </Button>
        </CardFooter>
      </Card>

      <Alert tone="info" title="Wirkung dieser Angaben">
        Marke und Modell bestimmen über die Preisgruppe, welcher Preis, welche Anzahlung und
        welche Terminlänge gelten. Die Kombination „Fahrzeug vor Ort nötig“ aus Modell und
        Leistung entscheidet darüber, ob der Autoschlüssel-Ablauf zwingend in eine
        Vor-Ort-Terminbuchung mündet.
      </Alert>
    </div>
  );
}
