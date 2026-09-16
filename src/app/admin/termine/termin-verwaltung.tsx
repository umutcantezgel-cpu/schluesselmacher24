'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

import { addBlockedDay, removeBlockedDay, saveContent } from '@/lib/actions/admin';
import type { SaveResult } from '@/lib/actions/admin';
import { formatDate, formatDateShort, formatDuration, formatWeekday } from '@/lib/format';
import type { BlockedDay, OpeningHour, RecordStatus, Settings } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { TextInput } from '@/components/forms/controls';

/* ==========================================================================
   Daten, die der Server bereits berechnet hat
   ========================================================================== */

export interface TagesAuslastung {
  date: string;
  /** 1 = Montag … 7 = Sonntag */
  weekday: number;
  geoeffnet: boolean;
  gesperrt: boolean;
  teilweiseGesperrt: boolean;
  sperrgrund?: string;
  /** Tag liegt noch innerhalb der Vorlaufzeit und ist deshalb nicht buchbar. */
  imVorlauf: boolean;
  freieFenster: number;
  belegteFenster: number;
  gesperrteFenster: number;
  termine: number;
}

export interface AnstehenderTermin {
  id: string;
  reference: string;
  date: string;
  time: string;
  durationMinutes: number;
  location: 'werkstatt' | 'vor-ort';
  status: RecordStatus;
  kunde: string;
}

const STATUS_TEXT: Record<RecordStatus, string> = {
  neu: 'Eingegangen',
  'in-pruefung': 'In Prüfung',
  geprueft: 'Geprüft',
  'wartet-auf-kunde': 'Wartet auf Kundschaft',
  'in-fertigung': 'In Fertigung',
  terminiert: 'Termin steht',
  versendet: 'Versendet',
  abgeschlossen: 'Abgeschlossen',
  storniert: 'Storniert',
};

interface Meldung {
  key: string;
  ok: boolean;
  message: string;
}

interface Zeitspanne {
  from: string;
  to: string;
}

const ZEIT_MUSTER = /^([01]\d|2[0-3]):[0-5]\d$/;

function zeitGueltig(wert: string): boolean {
  return ZEIT_MUSTER.test(wert.trim());
}

function inMinuten(wert: string): number {
  const [stunde, minute] = wert.split(':').map(Number);
  return stunde * 60 + minute;
}

function oeffnungszeitenAus(settings: Settings): OpeningHour[] {
  return [1, 2, 3, 4, 5, 6, 7].map((tag) => {
    const vorhanden = settings.openingHours.find((eintrag) => eintrag.day === tag);
    return { day: tag, spans: vorhanden ? vorhanden.spans.map((s) => ({ ...s })) : [] };
  });
}

function Rueckmeldung({ meldung, schluessel }: { meldung: Meldung | null; schluessel: string }) {
  return (
    <div aria-live="polite" className="w-full">
      {meldung && meldung.key === schluessel && (
        <Alert
          tone={meldung.ok ? 'success' : 'warning'}
          title={meldung.ok ? 'Gespeichert' : 'Nicht gespeichert'}
        >
          {meldung.message}
        </Alert>
      )}
    </div>
  );
}

/* ==========================================================================
   Hauptkomponente
   ========================================================================== */

export interface TerminVerwaltungProps {
  settings: Settings;
  blockedDays: BlockedDay[];
  auslastung: TagesAuslastung[];
  anstehend: AnstehenderTermin[];
  heute: string;
  fruehestensBuchbar: string;
  naechsterFreierTag: string | null;
}

export function TerminVerwaltung({
  settings,
  blockedDays,
  auslastung,
  anstehend,
  heute,
  fruehestensBuchbar,
  naechsterFreierTag,
}: TerminVerwaltungProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [laufend, setLaufend] = useState<string | null>(null);
  const [meldung, setMeldung] = useState<Meldung | null>(null);

  /** Zuletzt gesicherter Stand — verhindert, dass ein Abschnitt den anderen überschreibt. */
  const [basis, setBasis] = useState<Settings>(settings);

  const [fenster, setFenster] = useState<Zeitspanne[]>(() =>
    settings.booking.windows.map((w) => ({ ...w })),
  );
  const [fensterGespeichert, setFensterGespeichert] = useState<Zeitspanne[]>(() =>
    settings.booking.windows.map((w) => ({ ...w })),
  );

  const [zeiten, setZeiten] = useState<OpeningHour[]>(() => oeffnungszeitenAus(settings));
  const [zeitenGespeichert, setZeitenGespeichert] = useState<OpeningHour[]>(() =>
    oeffnungszeitenAus(settings),
  );

  const [sperreDatum, setSperreDatum] = useState('');
  const [sperreGrund, setSperreGrund] = useState('');
  const [sperreGanztags, setSperreGanztags] = useState(true);
  const [sperreSpannen, setSperreSpannen] = useState<Zeitspanne[]>([{ from: '09:00', to: '12:00' }]);

  function ausfuehren(schluessel: string, aktion: () => Promise<SaveResult>, danach?: () => void) {
    setLaufend(schluessel);
    setMeldung(null);
    startTransition(async () => {
      const ergebnis = await aktion();
      setLaufend(null);
      setMeldung({ key: schluessel, ok: ergebnis.ok, message: ergebnis.message });
      if (ergebnis.ok) {
        danach?.();
        router.refresh();
      }
    });
  }

  /* ---------- Buchungsfenster ------------------------------------------- */

  const fensterGeaendert = JSON.stringify(fenster) !== JSON.stringify(fensterGespeichert);

  function setzeFenster(index: number, teil: Partial<Zeitspanne>) {
    setFenster((vorher) => vorher.map((f, i) => (i === index ? { ...f, ...teil } : f)));
  }

  function speichereFenster() {
    const fehler = pruefeSpannen(fenster);
    if (fehler) {
      setMeldung({ key: 'fenster', ok: false, message: fehler });
      return;
    }
    const sortiert = [...fenster].sort((a, b) => inMinuten(a.from) - inMinuten(b.from));
    const neu: Settings = {
      ...basis,
      booking: { ...basis.booking, windows: sortiert },
      updatedAt: new Date().toISOString(),
    };
    ausfuehren('fenster', () => saveContent('settings', neu), () => {
      setFenster(sortiert);
      setFensterGespeichert(sortiert);
      setBasis(neu);
    });
  }

  /* ---------- Öffnungszeiten -------------------------------------------- */

  const zeitenGeaendert = JSON.stringify(zeiten) !== JSON.stringify(zeitenGespeichert);

  function setzeSpanne(tag: number, index: number, teil: Partial<Zeitspanne>) {
    setZeiten((vorher) =>
      vorher.map((eintrag) =>
        eintrag.day === tag
          ? {
              ...eintrag,
              spans: eintrag.spans.map((s, i) => (i === index ? { ...s, ...teil } : s)),
            }
          : eintrag,
      ),
    );
  }

  function spanneHinzufuegen(tag: number) {
    setZeiten((vorher) =>
      vorher.map((eintrag) =>
        eintrag.day === tag
          ? { ...eintrag, spans: [...eintrag.spans, { from: '09:00', to: '17:00' }] }
          : eintrag,
      ),
    );
  }

  function spanneEntfernen(tag: number, index: number) {
    setZeiten((vorher) =>
      vorher.map((eintrag) =>
        eintrag.day === tag
          ? { ...eintrag, spans: eintrag.spans.filter((_, i) => i !== index) }
          : eintrag,
      ),
    );
  }

  function tagSchliessen(tag: number) {
    setZeiten((vorher) =>
      vorher.map((eintrag) => (eintrag.day === tag ? { ...eintrag, spans: [] } : eintrag)),
    );
  }

  function speichereZeiten() {
    for (const eintrag of zeiten) {
      const fehler = pruefeSpannen(eintrag.spans);
      if (fehler) {
        setMeldung({
          key: 'zeiten',
          ok: false,
          message: `${formatWeekday(eintrag.day)}: ${fehler}`,
        });
        return;
      }
    }
    const neu: Settings = {
      ...basis,
      openingHours: zeiten,
      updatedAt: new Date().toISOString(),
    };
    ausfuehren('zeiten', () => saveContent('settings', neu), () => {
      setZeitenGespeichert(zeiten);
      setBasis(neu);
    });
  }

  /* ---------- Sperrtage -------------------------------------------------- */

  function speichereSperrtag() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sperreDatum)) {
      setMeldung({ key: 'sperre', ok: false, message: 'Bitte ein Datum auswählen.' });
      return;
    }
    if (sperreGrund.trim() === '') {
      setMeldung({
        key: 'sperre',
        ok: false,
        message: 'Bitte einen Grund angeben, damit im Team nachvollziehbar bleibt, warum der Tag gesperrt ist.',
      });
      return;
    }
    if (!sperreGanztags) {
      const fehler = pruefeSpannen(sperreSpannen);
      if (fehler) {
        setMeldung({ key: 'sperre', ok: false, message: fehler });
        return;
      }
      if (sperreSpannen.length === 0) {
        setMeldung({
          key: 'sperre',
          ok: false,
          message: 'Bitte mindestens eine Zeitspanne angeben oder den ganzen Tag sperren.',
        });
        return;
      }
    }

    const eintrag = sperreGanztags
      ? { date: sperreDatum, reason: sperreGrund.trim() }
      : { date: sperreDatum, reason: sperreGrund.trim(), spans: sperreSpannen };

    ausfuehren('sperre', () => addBlockedDay(eintrag), () => {
      setSperreDatum('');
      setSperreGrund('');
      setSperreGanztags(true);
      setSperreSpannen([{ from: '09:00', to: '12:00' }]);
    });
  }

  const sortierteSperrtage = [...blockedDays].sort((a, b) => a.date.localeCompare(b.date));

  /* ---------- Darstellung ------------------------------------------------ */

  return (
    <div className="mt-8 space-y-10">
      {/* ---------------- Buchungsfenster ---------------- */}
      <section aria-labelledby="abschnitt-fenster">
        <Card>
          <CardHeader className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="abschnitt-fenster" className="text-lg font-bold text-foreground">
                1. Buchungsfenster je Tag
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                Zu diesen Uhrzeiten beginnen Termine. Ein Fenster wird nur angeboten, wenn der
                Termin vollständig in eine Öffnungszeit passt. Die Endzeit dient der Übersicht —
                wie lange ein Termin tatsächlich dauert, ergibt sich aus der Terminlänge der
                Leistung.
              </p>
            </div>
            {fensterGeaendert && <Badge tone="warning">Nicht gespeichert</Badge>}
          </CardHeader>

          <CardBody>
            {fenster.length === 0 && (
              <Alert tone="warning" className="mb-5">
                Ohne Buchungsfenster können keine Termine gebucht werden.
              </Alert>
            )}

            <ul className="space-y-3">
              {fenster.map((eintrag, index) => (
                <li
                  key={`fenster-${index}`}
                  className="flex flex-wrap items-end gap-3 rounded-lg border border-border p-3"
                >
                  <Field label="Beginn" className="w-32">
                    {({ id }) => (
                      <TextInput
                        id={id}
                        type="time"
                        value={eintrag.from}
                        onChange={(e) => setzeFenster(index, { from: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field label="Ende" className="w-32">
                    {({ id }) => (
                      <TextInput
                        id={id}
                        type="time"
                        value={eintrag.to}
                        onChange={(e) => setzeFenster(index, { to: e.target.value })}
                      />
                    )}
                  </Field>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFenster((vorher) => vorher.filter((_, i) => i !== index))}
                  >
                    <Trash2 size={16} aria-hidden />
                    Entfernen
                    <span className="sr-only">
                      {`: Fenster ${eintrag.from} bis ${eintrag.to}`}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              onClick={() => setFenster((vorher) => [...vorher, { from: '09:00', to: '10:00' }])}
            >
              <Plus size={16} aria-hidden />
              Zeitfenster hinzufügen
            </Button>
          </CardBody>

          <CardFooter className="flex flex-wrap items-center gap-4">
            <Button type="button" onClick={speichereFenster} loading={laufend === 'fenster'}>
              Buchungsfenster speichern
            </Button>
            <Rueckmeldung meldung={meldung} schluessel="fenster" />
          </CardFooter>
        </Card>
      </section>

      {/* ---------------- Öffnungszeiten ---------------- */}
      <section aria-labelledby="abschnitt-zeiten">
        <Card>
          <CardHeader className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="abschnitt-zeiten" className="text-lg font-bold text-foreground">
                2. Öffnungszeiten je Wochentag
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                Mehrere Zeitspannen je Tag sind möglich, zum Beispiel vormittags und nachmittags.
                Ein Tag ohne Zeitspanne gilt als geschlossen.
              </p>
            </div>
            {zeitenGeaendert && <Badge tone="warning">Nicht gespeichert</Badge>}
          </CardHeader>

          <CardBody className="space-y-4">
            {zeiten.map((eintrag) => (
              <div key={eintrag.day} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[15px] font-bold text-foreground">
                    {formatWeekday(eintrag.day)}
                  </h3>
                  {eintrag.spans.length === 0 ? (
                    <Badge tone="neutral">Geschlossen</Badge>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => tagSchliessen(eintrag.day)}
                    >
                      Tag schließen
                      <span className="sr-only">{`: ${formatWeekday(eintrag.day)}`}</span>
                    </Button>
                  )}
                </div>

                {eintrag.spans.length > 0 && (
                  <ul className="mt-3 space-y-3">
                    {eintrag.spans.map((spanne, index) => (
                      <li key={`${eintrag.day}-${index}`} className="flex flex-wrap items-end gap-3">
                        <Field label={`Beginn ${index + 1}`} className="w-32">
                          {({ id }) => (
                            <TextInput
                              id={id}
                              type="time"
                              value={spanne.from}
                              onChange={(e) =>
                                setzeSpanne(eintrag.day, index, { from: e.target.value })
                              }
                            />
                          )}
                        </Field>
                        <Field label={`Ende ${index + 1}`} className="w-32">
                          {({ id }) => (
                            <TextInput
                              id={id}
                              type="time"
                              value={spanne.to}
                              onChange={(e) =>
                                setzeSpanne(eintrag.day, index, { to: e.target.value })
                              }
                            />
                          )}
                        </Field>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => spanneEntfernen(eintrag.day, index)}
                        >
                          <Trash2 size={16} aria-hidden />
                          Entfernen
                          <span className="sr-only">
                            {`: ${formatWeekday(eintrag.day)}, Zeitspanne ${index + 1}`}
                          </span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => spanneHinzufuegen(eintrag.day)}
                >
                  <Plus size={16} aria-hidden />
                  Zeitspanne hinzufügen
                  <span className="sr-only">{`: ${formatWeekday(eintrag.day)}`}</span>
                </Button>
              </div>
            ))}
          </CardBody>

          <CardFooter className="flex flex-wrap items-center gap-4">
            <Button type="button" onClick={speichereZeiten} loading={laufend === 'zeiten'}>
              Öffnungszeiten speichern
            </Button>
            <Rueckmeldung meldung={meldung} schluessel="zeiten" />
          </CardFooter>
        </Card>
      </section>

      {/* ---------------- Sperrtage ---------------- */}
      <section aria-labelledby="abschnitt-sperrtage">
        <Card>
          <CardHeader>
            <h2 id="abschnitt-sperrtage" className="text-lg font-bold text-foreground">
              3. Sperrtage
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
              Feiertage, Urlaub und interne Sperrzeiten. Ein gesperrter Tag wird nicht mehr zur
              Buchung angeboten; bereits bestätigte Termine bleiben davon unberührt.
            </p>
          </CardHeader>

          <CardBody>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Datum" required hint="Der Tag, an dem keine Termine angeboten werden sollen.">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    type="date"
                    min={heute}
                    value={sperreDatum}
                    onChange={(e) => setSperreDatum(e.target.value)}
                  />
                )}
              </Field>

              <Field label="Grund" required hint="Nur intern sichtbar, zum Beispiel „Betriebsurlaub“.">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    value={sperreGrund}
                    onChange={(e) => setSperreGrund(e.target.value)}
                  />
                )}
              </Field>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-foreground">Umfang der Sperre</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface px-3.5 py-3">
                  <input
                    type="radio"
                    name="sperre-umfang"
                    checked={sperreGanztags}
                    onChange={() => setSperreGanztags(true)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
                  />
                  <span className="text-[15px] font-semibold text-foreground">Ganzer Tag</span>
                </label>
                <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface px-3.5 py-3">
                  <input
                    type="radio"
                    name="sperre-umfang"
                    checked={!sperreGanztags}
                    onChange={() => setSperreGanztags(false)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
                  />
                  <span className="text-[15px] font-semibold text-foreground">
                    Nur bestimmte Zeitspannen
                  </span>
                </label>
              </div>
            </fieldset>

            {!sperreGanztags && (
              <div className="mt-4 rounded-lg border border-border p-4">
                <ul className="space-y-3">
                  {sperreSpannen.map((spanne, index) => (
                    <li key={`sperre-${index}`} className="flex flex-wrap items-end gap-3">
                      <Field label={`Beginn ${index + 1}`} className="w-32">
                        {({ id }) => (
                          <TextInput
                            id={id}
                            type="time"
                            value={spanne.from}
                            onChange={(e) =>
                              setSperreSpannen((vorher) =>
                                vorher.map((s, i) => (i === index ? { ...s, from: e.target.value } : s)),
                              )
                            }
                          />
                        )}
                      </Field>
                      <Field label={`Ende ${index + 1}`} className="w-32">
                        {({ id }) => (
                          <TextInput
                            id={id}
                            type="time"
                            value={spanne.to}
                            onChange={(e) =>
                              setSperreSpannen((vorher) =>
                                vorher.map((s, i) => (i === index ? { ...s, to: e.target.value } : s)),
                              )
                            }
                          />
                        )}
                      </Field>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setSperreSpannen((vorher) => vorher.filter((_, i) => i !== index))
                        }
                      >
                        <Trash2 size={16} aria-hidden />
                        Entfernen
                        <span className="sr-only">{`: Zeitspanne ${index + 1}`}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    setSperreSpannen((vorher) => [...vorher, { from: '14:00', to: '17:00' }])
                  }
                >
                  <Plus size={16} aria-hidden />
                  Zeitspanne hinzufügen
                </Button>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button type="button" onClick={speichereSperrtag} loading={laufend === 'sperre'}>
                Sperrtag eintragen
              </Button>
              <Rueckmeldung meldung={meldung} schluessel="sperre" />
            </div>

            <h3 className="mt-8 text-[15px] font-bold text-foreground">Eingetragene Sperrtage</h3>
            {sortierteSperrtage.length === 0 ? (
              <p className="mt-2 text-[15px] text-foreground-muted">
                Es ist noch kein Sperrtag eingetragen.
              </p>
            ) : (
              <div className="table-scroll mt-3">
                <table className="w-full min-w-[40rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-muted">
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                        Datum
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                        Umfang
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                        Grund
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-foreground-muted">
                        Aktion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortierteSperrtage.map((tag) => (
                      <tr key={tag.id}>
                        <th scope="row" className="px-4 py-3 text-left text-[15px] font-semibold text-foreground">
                          {formatDate(tag.date)}
                        </th>
                        <td className="px-4 py-3 text-[14px] text-foreground-muted">
                          {tag.spans && tag.spans.length > 0
                            ? tag.spans.map((s) => `${s.from} bis ${s.to} Uhr`).join(', ')
                            : 'Ganzer Tag'}
                        </td>
                        <td className="px-4 py-3 text-[14px] text-foreground-muted">{tag.reason}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            loading={laufend === `entfernen-${tag.id}`}
                            onClick={() =>
                              ausfuehren(`entfernen-${tag.id}`, () => removeBlockedDay(tag.id))
                            }
                          >
                            <Trash2 size={16} aria-hidden />
                            Entfernen
                            <span className="sr-only">{`: Sperre am ${formatDateShort(tag.date)}`}</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {meldung && meldung.key.startsWith('entfernen-') && (
              <div className="mt-4">
                <Rueckmeldung meldung={meldung} schluessel={meldung.key} />
              </div>
            )}
          </CardBody>
        </Card>
      </section>

      {/* ---------------- Auslastung ---------------- */}
      <section aria-labelledby="abschnitt-auslastung">
        <Card>
          <CardHeader>
            <h2 id="abschnitt-auslastung" className="text-lg font-bold text-foreground">
              4. Auslastung der nächsten {auslastung.length} Tage
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
              Berechnet aus Öffnungszeiten, Buchungsfenstern, Sperrtagen und bereits vergebenen
              Terminen. Frühester buchbarer Tag nach Vorlauf: {formatDate(fruehestensBuchbar)}.{' '}
              {naechsterFreierTag
                ? `Nächster Tag mit freiem Fenster: ${formatDate(naechsterFreierTag)}.`
                : 'In diesem Zeitraum ist kein Fenster mehr frei.'}
            </p>
          </CardHeader>

          <CardBody className="px-0 py-0 md:px-0 md:py-0">
            <div className="table-scroll">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-muted">
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Datum
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Freie Fenster
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Belegte Fenster
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Termine
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Gesperrt
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                      Hinweis
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auslastung.map((tag) => (
                    <tr key={tag.date}>
                      <th scope="row" className="px-4 py-3 text-left text-[14px] font-semibold text-foreground">
                        {formatWeekday(tag.weekday)}, {formatDateShort(tag.date)}
                      </th>
                      <td className="px-4 py-3 text-[14px] text-foreground">{tag.freieFenster}</td>
                      <td className="px-4 py-3 text-[14px] text-foreground">
                        {tag.belegteFenster + tag.gesperrteFenster}
                      </td>
                      <td className="px-4 py-3 text-[14px] text-foreground">{tag.termine}</td>
                      <td className="px-4 py-3 text-[14px]">
                        {tag.gesperrt ? (
                          <Badge tone="danger">Ja</Badge>
                        ) : tag.teilweiseGesperrt ? (
                          <Badge tone="warning">Teilweise</Badge>
                        ) : (
                          <span className="text-foreground-muted">Nein</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-foreground-muted">
                        {!tag.geoeffnet
                          ? 'Geschlossen'
                          : tag.gesperrt
                            ? (tag.sperrgrund ?? 'Gesperrt')
                            : tag.imVorlauf
                              ? 'Liegt noch im Vorlauf'
                              : tag.freieFenster === 0
                                ? 'Ausgebucht'
                                : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* ---------------- Anstehende Termine ---------------- */}
      <section aria-labelledby="abschnitt-termine">
        <Card>
          <CardHeader>
            <h2 id="abschnitt-termine" className="text-lg font-bold text-foreground">
              5. Anstehende Termine
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
              Alle Vorgänge mit Termin ab heute. Die Einzelansicht zeigt Unterlagen, Preis und
              Zahlungsstand.
            </p>
          </CardHeader>

          <CardBody className={anstehend.length === 0 ? undefined : 'px-0 py-0 md:px-0 md:py-0'}>
            {anstehend.length === 0 ? (
              <p className="text-[15px] text-foreground-muted">
                Es ist derzeit kein Termin eingeplant.
              </p>
            ) : (
              <div className="table-scroll">
                <table className="w-full min-w-[46rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-muted">
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                        Termin
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                        Vorgang
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                        Kundschaft
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                        Ort
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {anstehend.map((termin) => (
                      <tr key={termin.id}>
                        <th scope="row" className="px-4 py-3 text-left text-[14px] font-semibold text-foreground">
                          {formatDateShort(termin.date)}, {termin.time} Uhr
                          <span className="mt-0.5 block text-[13px] font-normal text-foreground-muted">
                            {formatDuration(termin.durationMinutes)}
                          </span>
                        </th>
                        <td className="px-4 py-3 text-[14px]">
                          <Link
                            href={`/admin/vorgaenge/${termin.id}`}
                            className="font-mono font-semibold text-primary underline"
                          >
                            {termin.reference}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[14px] text-foreground-muted">{termin.kunde}</td>
                        <td className="px-4 py-3 text-[14px] text-foreground-muted">
                          {termin.location === 'werkstatt' ? 'Im Fachbetrieb' : 'Vor Ort'}
                        </td>
                        <td className="px-4 py-3 text-[14px]">
                          <Badge tone="neutral">{STATUS_TEXT[termin.status]}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

/* ==========================================================================
   Prüfung von Zeitspannen
   ========================================================================== */

function pruefeSpannen(spannen: Zeitspanne[]): string | null {
  for (const spanne of spannen) {
    if (!zeitGueltig(spanne.from) || !zeitGueltig(spanne.to)) {
      return 'Bitte alle Uhrzeiten im Format 09:00 eintragen.';
    }
    if (inMinuten(spanne.from) >= inMinuten(spanne.to)) {
      return `Die Zeitspanne ${spanne.from} bis ${spanne.to} ist nicht gültig: Das Ende muss nach dem Beginn liegen.`;
    }
  }
  return null;
}
