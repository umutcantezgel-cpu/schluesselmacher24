'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { saveBookingDefaults, saveContent, savePricingRule } from '@/lib/actions/admin';
import type { SaveResult } from '@/lib/actions/admin';
import { formatCents, formatDateTime, formatDuration } from '@/lib/format';
import type {
  CarKeyService,
  KeyKind,
  PricingGroup,
  PricingRule,
  Settings,
  ShippingOption,
} from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { Select, TextArea, TextInput } from '@/components/forms/controls';

/* ==========================================================================
   Hilfsfunktionen — Eingabe in Euro, Speicherung in Cent
   ========================================================================== */

function centsToEuro(cents: number | undefined): string {
  if (cents === undefined) return '';
  return (cents / 100).toFixed(2).replace('.', ',');
}

/** Wandelt eine Eingabe wie "1.234,50" oder "69,90" in Cent um. */
function euroToCents(value: string): number | null {
  let text = value.trim().replace(/[€\s]/g, '');
  if (text === '') return null;
  if (text.includes(',')) text = text.replace(/\./g, '').replace(',', '.');
  const parsed = Number(text);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed * 100);
}

function ganzzahl(value: string): number | null {
  const text = value.trim();
  if (!/^\d+$/.test(text)) return null;
  return Number(text);
}

const SCHLUESSELART: Record<KeyKind | 'alle', string> = {
  alle: 'Alle Schlüsselarten',
  mechanisch: 'Mechanisch',
  funk: 'Funkschlüssel',
  klappschluessel: 'Klappschlüssel',
  'smart-key': 'Smart Key',
  keyless: 'Keyless',
};

const PREISART: Record<PricingRule['mode'], string> = {
  fest: 'Fester Preis',
  rahmen: 'Preisrahmen von–bis',
  pruefung: 'Manuelle Prüfung',
};

/* ==========================================================================
   Formularzustände
   ========================================================================== */

interface GrundwerteForm {
  leadTimeDays: string;
  deposit: string;
  depositMin: string;
  depositMax: string;
  slotMinutes: string;
  bookingHorizonDays: string;
  slotsPerWindow: string;
}

interface RegelForm {
  mode: PricingRule['mode'];
  price: string;
  priceFrom: string;
  priceTo: string;
  deposit: string;
  slotMinutes: string;
  leadTimeDays: string;
  note: string;
}

interface VersandForm {
  id: string;
  label: string;
  description: string;
  price: string;
  tracked: boolean;
  insured: boolean;
}

interface Meldung {
  key: string;
  ok: boolean;
  message: string;
}

function grundwerteAus(settings: Settings): GrundwerteForm {
  const b = settings.booking;
  return {
    leadTimeDays: String(b.leadTimeDays),
    deposit: centsToEuro(b.depositCents),
    depositMin: centsToEuro(b.depositMinCents),
    depositMax: centsToEuro(b.depositMaxCents),
    slotMinutes: String(b.slotMinutes),
    bookingHorizonDays: String(b.bookingHorizonDays),
    slotsPerWindow: String(b.slotsPerWindow),
  };
}

function regelAus(rule: PricingRule): RegelForm {
  return {
    mode: rule.mode,
    price: centsToEuro(rule.priceCents),
    priceFrom: centsToEuro(rule.priceFromCents),
    priceTo: centsToEuro(rule.priceToCents),
    deposit: centsToEuro(rule.depositCents),
    slotMinutes: rule.slotMinutes === undefined ? '' : String(rule.slotMinutes),
    leadTimeDays: rule.leadTimeDays === undefined ? '' : String(rule.leadTimeDays),
    note: rule.note ?? '',
  };
}

function regelnAus(rules: PricingRule[]): Record<string, RegelForm> {
  const map: Record<string, RegelForm> = {};
  for (const rule of rules) map[rule.id] = regelAus(rule);
  return map;
}

function versandAus(shipping: ShippingOption[]): VersandForm[] {
  return shipping.map((option) => ({
    id: option.id,
    label: option.label,
    description: option.description,
    price: centsToEuro(option.priceCents),
    tracked: option.tracked,
    insured: option.insured,
  }));
}

/* ==========================================================================
   Rückmeldung nach dem Speichern
   ========================================================================== */

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

export interface PreisVerwaltungProps {
  settings: Settings;
  pricingGroups: PricingGroup[];
  services: CarKeyService[];
  rules: PricingRule[];
}

export function PreisVerwaltung({ settings, pricingGroups, services, rules }: PreisVerwaltungProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [laufend, setLaufend] = useState<string | null>(null);
  const [meldung, setMeldung] = useState<Meldung | null>(null);

  /**
   * Zuletzt bekannter Stand der Einstellungen. Er wird nach jedem
   * erfolgreichen Speichern nachgeführt, damit ein späteres Speichern eines
   * anderen Abschnitts die eben gesicherten Werte nicht wieder überschreibt.
   */
  const [basis, setBasis] = useState<Settings>(settings);

  const [grund, setGrund] = useState<GrundwerteForm>(() => grundwerteAus(settings));
  const [grundGespeichert, setGrundGespeichert] = useState<GrundwerteForm>(() =>
    grundwerteAus(settings),
  );

  const [regeln, setRegeln] = useState<Record<string, RegelForm>>(() => regelnAus(rules));
  const [regelnGespeichert, setRegelnGespeichert] = useState<Record<string, RegelForm>>(() =>
    regelnAus(rules),
  );
  const [offeneRegel, setOffeneRegel] = useState<string | null>(null);

  const [versand, setVersand] = useState<VersandForm[]>(() => versandAus(settings.shipping));
  const [versandGespeichert, setVersandGespeichert] = useState<VersandForm[]>(() =>
    versandAus(settings.shipping),
  );

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

  /* ---------- Abschnitt 1: Grundwerte ----------------------------------- */

  const grundFehler = pruefeGrundwerte(grund);
  const grundGueltig = Object.keys(grundFehler).length === 0;
  const grundGeaendert = JSON.stringify(grund) !== JSON.stringify(grundGespeichert);

  function setzeGrund(teil: Partial<GrundwerteForm>) {
    setGrund((vorher) => ({ ...vorher, ...teil }));
  }

  function speichereGrundwerte() {
    if (!grundGueltig) return;
    const werte = {
      leadTimeDays: ganzzahl(grund.leadTimeDays) ?? 0,
      depositCents: euroToCents(grund.deposit) ?? 0,
      depositMinCents: euroToCents(grund.depositMin) ?? 0,
      depositMaxCents: euroToCents(grund.depositMax) ?? 0,
      slotMinutes: ganzzahl(grund.slotMinutes) ?? 0,
      bookingHorizonDays: ganzzahl(grund.bookingHorizonDays) ?? 0,
      slotsPerWindow: ganzzahl(grund.slotsPerWindow) ?? 1,
    };

    ausfuehren('grundwerte', () => saveBookingDefaults(werte), () => {
      setGrundGespeichert(grund);
      setBasis((vorher) => ({
        ...vorher,
        booking: { ...vorher.booking, ...werte },
      }));
    });
  }

  /* ---------- Abschnitt 2: Preisregeln ---------------------------------- */

  const gruppen: PricingGroup[] = [...pricingGroups];
  for (const rule of rules) {
    if (!gruppen.some((g) => g.id === rule.pricingGroupId)) {
      gruppen.push({
        id: rule.pricingGroupId,
        label: `Ohne hinterlegte Gruppenbeschreibung (${rule.pricingGroupId})`,
        description:
          'Zu dieser Fahrzeuggruppe ist keine Beschreibung hinterlegt. Bitte fachlich prüfen.',
      });
    }
  }

  function setzeRegel(id: string, teil: Partial<RegelForm>) {
    setRegeln((vorher) => ({ ...vorher, [id]: { ...vorher[id], ...teil } }));
  }

  function speichereRegel(rule: PricingRule) {
    const form = regeln[rule.id];
    const fehler = pruefeRegel(form);
    if (fehler) {
      setMeldung({ key: `regel-${rule.id}`, ok: false, message: fehler });
      return;
    }

    ausfuehren(
      `regel-${rule.id}`,
      () =>
        savePricingRule({
          id: rule.id,
          mode: form.mode,
          priceCents: form.mode === 'fest' ? euroToCents(form.price) ?? undefined : undefined,
          priceFromCents:
            form.mode === 'rahmen' ? euroToCents(form.priceFrom) ?? undefined : undefined,
          priceToCents: form.mode === 'rahmen' ? euroToCents(form.priceTo) ?? undefined : undefined,
          depositCents: euroToCents(form.deposit) ?? undefined,
          slotMinutes: ganzzahl(form.slotMinutes) ?? undefined,
          leadTimeDays: ganzzahl(form.leadTimeDays) ?? undefined,
          note: form.note.trim() === '' ? undefined : form.note.trim(),
        }),
      () => setRegelnGespeichert((vorher) => ({ ...vorher, [rule.id]: form })),
    );
  }

  /* ---------- Abschnitt 3: Versandarten --------------------------------- */

  const versandGeaendert = JSON.stringify(versand) !== JSON.stringify(versandGespeichert);

  function setzeVersand(id: string, teil: Partial<VersandForm>) {
    setVersand((vorher) => vorher.map((v) => (v.id === id ? { ...v, ...teil } : v)));
  }

  function speichereVersand() {
    const ohneBezeichnung = versand.find((v) => v.label.trim() === '');
    if (ohneBezeichnung) {
      setMeldung({
        key: 'versand',
        ok: false,
        message: 'Jede Versandart braucht eine Bezeichnung.',
      });
      return;
    }
    const ohnePreis = versand.find((v) => euroToCents(v.price) === null);
    if (ohnePreis) {
      setMeldung({
        key: 'versand',
        ok: false,
        message: `Der Preis für „${ohnePreis.label}“ ist keine gültige Zahl. Beispiel: 4,95`,
      });
      return;
    }

    const shipping: ShippingOption[] = versand.map((v) => {
      const bisher = basis.shipping.find((s) => s.id === v.id);
      return {
        id: v.id,
        label: v.label.trim(),
        description: v.description.trim(),
        priceCents: euroToCents(v.price) ?? 0,
        tracked: v.tracked,
        insured: v.insured,
        productClasses: bisher?.productClasses ?? [],
      };
    });

    const neu: Settings = { ...basis, shipping, updatedAt: new Date().toISOString() };

    ausfuehren('versand', () => saveContent('settings', neu), () => {
      setVersandGespeichert(versand);
      setBasis(neu);
    });
  }

  /* ---------- Darstellung ------------------------------------------------ */

  return (
    <div className="mt-8 space-y-10">
      {/* ---------------- Abschnitt 1 ---------------- */}
      <section aria-labelledby="abschnitt-grundwerte">
        <Card>
          <CardHeader className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="abschnitt-grundwerte" className="text-lg font-bold text-foreground">
                1. Grundwerte für Preis und Termin
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                Diese Werte gelten überall dort, wo eine Preisregel nichts Abweichendes vorgibt.
              </p>
            </div>
            {grundGeaendert && <Badge tone="warning">Nicht gespeichert</Badge>}
          </CardHeader>

          <CardBody>
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Mindestvorlauf in Tagen"
                required
                error={grundFehler.leadTimeDays}
                hint="Wie viele Tage zwischen Anfrage und frühestem Termin liegen müssen. Der Vorlauf sichert die Zeit für Prüfung der Unterlagen und Beschaffung des Rohlings."
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    inputMode="numeric"
                    value={grund.leadTimeDays}
                    onChange={(e) => setzeGrund({ leadTimeDays: e.target.value })}
                  />
                )}
              </Field>

              <Field
                label="Standard-Terminlänge in Minuten"
                required
                error={grundFehler.slotMinutes}
                hint="Wie lange ein Zeitfenster belegt wird. Bestimmt, wie viele Termine an einem Tag angeboten werden."
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    inputMode="numeric"
                    value={grund.slotMinutes}
                    onChange={(e) => setzeGrund({ slotMinutes: e.target.value })}
                  />
                )}
              </Field>

              <Field
                label="Standard-Anzahlung in Euro"
                required
                error={grundFehler.deposit}
                hint="Wird bei der Terminbuchung fällig und vollständig auf den Gesamtpreis angerechnet. Sie deckt die Beschaffung ab und senkt das Ausfallrisiko bei nicht wahrgenommenen Terminen."
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    inputMode="decimal"
                    value={grund.deposit}
                    onChange={(e) => setzeGrund({ deposit: e.target.value })}
                  />
                )}
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Anzahlungsrahmen von (Euro)"
                  required
                  error={grundFehler.depositMin}
                  hint="Untergrenze für abweichende Anzahlungen in den Preisregeln."
                >
                  {({ id, describedBy, invalid }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      invalid={invalid}
                      inputMode="decimal"
                      value={grund.depositMin}
                      onChange={(e) => setzeGrund({ depositMin: e.target.value })}
                    />
                  )}
                </Field>

                <Field
                  label="Anzahlungsrahmen bis (Euro)"
                  required
                  error={grundFehler.depositMax}
                  hint="Obergrenze. Höhere Anzahlungen werden bei der Preisermittlung auf diesen Wert begrenzt."
                >
                  {({ id, describedBy, invalid }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      invalid={invalid}
                      inputMode="decimal"
                      value={grund.depositMax}
                      onChange={(e) => setzeGrund({ depositMax: e.target.value })}
                    />
                  )}
                </Field>
              </div>

              <Field
                label="Buchungshorizont in Tagen"
                required
                error={grundFehler.bookingHorizonDays}
                hint="Wie weit im Voraus Termine angeboten werden. Ein kurzer Horizont hält den Kalender überschaubar und schützt vor Buchungen, die noch nicht planbar sind."
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    inputMode="numeric"
                    value={grund.bookingHorizonDays}
                    onChange={(e) => setzeGrund({ bookingHorizonDays: e.target.value })}
                  />
                )}
              </Field>

              <Field
                label="Termine je Zeitfenster"
                required
                error={grundFehler.slotsPerWindow}
                hint="Wie viele Vorgänge zur selben Uhrzeit angenommen werden. Entspricht der Zahl der Arbeitsplätze, die gleichzeitig besetzt werden können."
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    inputMode="numeric"
                    value={grund.slotsPerWindow}
                    onChange={(e) => setzeGrund({ slotsPerWindow: e.target.value })}
                  />
                )}
              </Field>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-foreground-subtle">
              Die täglichen Buchungsfenster und die Öffnungszeiten werden unter „Termine“ gepflegt.
              Zuletzt geändert: {formatDateTime(basis.updatedAt)}.
            </p>
          </CardBody>

          <CardFooter className="flex flex-wrap items-center gap-4">
            <Button
              type="button"
              onClick={speichereGrundwerte}
              loading={laufend === 'grundwerte'}
              disabled={!grundGueltig}
            >
              Grundwerte speichern
            </Button>
            {!grundGueltig && (
              <p className="text-[13px] font-semibold text-danger">
                Bitte zuerst die rot gekennzeichneten Felder berichtigen.
              </p>
            )}
            <Rueckmeldung meldung={meldung} schluessel="grundwerte" />
          </CardFooter>
        </Card>
      </section>

      {/* ---------------- Abschnitt 2 ---------------- */}
      <section aria-labelledby="abschnitt-regeln">
        <div className="max-w-3xl">
          <h2 id="abschnitt-regeln" className="text-lg font-bold text-foreground">
            2. Preisregeln je Fahrzeuggruppe und Leistung
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">
            Je Kombination aus Fahrzeuggruppe und Leistung wird festgelegt, ob ein fester Preis,
            ein Preisrahmen oder eine manuelle Prüfung gilt. Bleibt ein Feld für Anzahlung,
            Terminlänge oder Vorlauf leer, greift der Grundwert aus Abschnitt 1. Jede Regel wird
            einzeln gespeichert.
          </p>
        </div>

        <div className="mt-5 space-y-6">
          {gruppen.map((gruppe) => {
            const gruppenRegeln = rules.filter((r) => r.pricingGroupId === gruppe.id);
            if (gruppenRegeln.length === 0) return null;

            return (
              <Card key={gruppe.id}>
                <CardHeader>
                  <h3 className="text-[15px] font-bold text-foreground">{gruppe.label}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                    {gruppe.description}
                  </p>
                </CardHeader>

                <CardBody className="px-0 py-0 md:px-0 md:py-0">
                  <div className="table-scroll">
                    <table className="w-full min-w-[56rem] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-border bg-surface-muted">
                          <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                            Leistung
                          </th>
                          <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                            Preisart
                          </th>
                          <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                            Preis
                          </th>
                          <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                            Anzahlung
                          </th>
                          <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                            Terminlänge
                          </th>
                          <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                            Vorlauf
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-foreground-muted">
                            Bearbeiten
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {gruppenRegeln.map((rule) => {
                          const form = regeln[rule.id];
                          const gespeichert = regelnGespeichert[rule.id];
                          const geaendert = JSON.stringify(form) !== JSON.stringify(gespeichert);
                          const offen = offeneRegel === rule.id;
                          const service = services.find((s) => s.id === rule.serviceId);

                          return (
                            <RegelZeile
                              key={rule.id}
                              rule={rule}
                              form={form}
                              geaendert={geaendert}
                              offen={offen}
                              serviceLabel={service?.label ?? rule.serviceId}
                              serviceAktiv={service?.active ?? false}
                              basis={basis}
                              laufend={laufend === `regel-${rule.id}`}
                              meldung={meldung}
                              onUmschalten={() => setOffeneRegel(offen ? null : rule.id)}
                              onAendern={(teil) => setzeRegel(rule.id, teil)}
                              onSpeichern={() => speichereRegel(rule)}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ---------------- Abschnitt 3 ---------------- */}
      <section aria-labelledby="abschnitt-versand">
        <Card>
          <CardHeader className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="abschnitt-versand" className="text-lg font-bold text-foreground">
                3. Versandarten
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                Gilt für den Versand von Schlüsseln nach Code und von Zylindern. Welche Produktarten
                zu einer Versandart passen, ist in der Datenschicht hinterlegt und bleibt beim
                Speichern unverändert.
              </p>
            </div>
            {versandGeaendert && <Badge tone="warning">Nicht gespeichert</Badge>}
          </CardHeader>

          <CardBody className="space-y-6">
            {versand.map((option) => (
              <div key={option.id} className="rounded-lg border border-border p-4 md:p-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Bezeichnung" required hint="So heißt die Versandart an der Kasse.">
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        value={option.label}
                        onChange={(e) => setzeVersand(option.id, { label: e.target.value })}
                      />
                    )}
                  </Field>

                  <Field
                    label="Preis in Euro"
                    required
                    hint="Null eintragen, wenn keine Kosten entstehen, zum Beispiel bei Abholung."
                  >
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="decimal"
                        value={option.price}
                        onChange={(e) => setzeVersand(option.id, { price: e.target.value })}
                      />
                    )}
                  </Field>

                  <Field
                    label="Beschreibung"
                    className="md:col-span-2"
                    hint="Ein bis zwei Sätze, die erklären, was die Kundschaft erwarten kann."
                  >
                    {({ id, describedBy }) => (
                      <TextArea
                        id={id}
                        aria-describedby={describedBy}
                        rows={2}
                        value={option.description}
                        onChange={(e) => setzeVersand(option.id, { description: e.target.value })}
                      />
                    )}
                  </Field>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Kontrollkaestchen
                    checked={option.tracked}
                    onChange={(wert) => setzeVersand(option.id, { tracked: wert })}
                    label="Sendungsverfolgung"
                    hint="Die Sendung kann nachverfolgt werden."
                  />
                  <Kontrollkaestchen
                    checked={option.insured}
                    onChange={(wert) => setzeVersand(option.id, { insured: wert })}
                    label="Versichert"
                    hint="Verlust oder Beschädigung sind abgedeckt."
                  />
                </div>
              </div>
            ))}
          </CardBody>

          <CardFooter className="flex flex-wrap items-center gap-4">
            <Button type="button" onClick={speichereVersand} loading={laufend === 'versand'}>
              Versandarten speichern
            </Button>
            <Rueckmeldung meldung={meldung} schluessel="versand" />
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}

/* ==========================================================================
   Eine Zeile der Preisregel-Tabelle mit aufklappbarem Bearbeiten-Bereich
   ========================================================================== */

interface RegelZeileProps {
  rule: PricingRule;
  form: RegelForm;
  geaendert: boolean;
  offen: boolean;
  serviceLabel: string;
  serviceAktiv: boolean;
  basis: Settings;
  laufend: boolean;
  meldung: Meldung | null;
  onUmschalten: () => void;
  onAendern: (teil: Partial<RegelForm>) => void;
  onSpeichern: () => void;
}

function RegelZeile({
  rule,
  form,
  geaendert,
  offen,
  serviceLabel,
  serviceAktiv,
  basis,
  laufend,
  meldung,
  onUmschalten,
  onAendern,
  onSpeichern,
}: RegelZeileProps) {
  const bereichId = `regel-${rule.id}-bereich`;

  return (
    <>
      <tr className="align-top">
        <th scope="row" className="px-4 py-3 text-left font-semibold text-foreground">
          <span className="block text-[15px]">{serviceLabel}</span>
          <span className="mt-0.5 block text-[13px] font-normal text-foreground-muted">
            {SCHLUESSELART[rule.keyKind]}
          </span>
          {!serviceAktiv && (
            <Badge tone="neutral" className="mt-2">
              Leistung nicht aktiv
            </Badge>
          )}
        </th>
        <td className="px-4 py-3 text-[14px] text-foreground-muted">{PREISART[form.mode]}</td>
        <td className="px-4 py-3 text-[14px] text-foreground">{preisText(form)}</td>
        <td className="px-4 py-3 text-[14px] text-foreground">
          {abweichungText(
            form.deposit !== '' ? formatCentsAusEingabe(form.deposit) : null,
            formatCents(basis.booking.depositCents),
          )}
        </td>
        <td className="px-4 py-3 text-[14px] text-foreground">
          {abweichungText(
            form.slotMinutes !== '' ? minutenText(form.slotMinutes) : null,
            formatDuration(basis.booking.slotMinutes),
          )}
        </td>
        <td className="px-4 py-3 text-[14px] text-foreground">
          {abweichungText(
            form.leadTimeDays !== '' ? `${form.leadTimeDays} Tage` : null,
            `${basis.booking.leadTimeDays} Tage`,
          )}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex flex-col items-end gap-2">
            {geaendert && <Badge tone="warning">Nicht gespeichert</Badge>}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onUmschalten}
              aria-expanded={offen}
              aria-controls={bereichId}
            >
              {offen ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
              {offen ? 'Schließen' : 'Bearbeiten'}
            </Button>
          </div>
        </td>
      </tr>

      {offen && (
        <tr>
          <td colSpan={7} id={bereichId} className="bg-surface-muted px-4 py-5">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Field
                label="Preisart"
                hint="Fester Preis nur dann, wenn der Aufwand sicher feststeht. Sonst Preisrahmen oder manuelle Prüfung."
              >
                {({ id, describedBy }) => (
                  <Select
                    id={id}
                    aria-describedby={describedBy}
                    value={form.mode}
                    onChange={(e) => onAendern({ mode: e.target.value as RegelForm['mode'] })}
                  >
                    <option value="fest">Fester Preis</option>
                    <option value="rahmen">Preisrahmen von–bis</option>
                    <option value="pruefung">Manuelle Prüfung, kein Preis im Voraus</option>
                  </Select>
                )}
              </Field>

              {form.mode === 'fest' && (
                <Field label="Preis in Euro" required hint="Gesamtpreis der Leistung, einschließlich Umsatzsteuer.">
                  {({ id, describedBy }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      inputMode="decimal"
                      value={form.price}
                      onChange={(e) => onAendern({ price: e.target.value })}
                    />
                  )}
                </Field>
              )}

              {form.mode === 'rahmen' && (
                <>
                  <Field label="Preis von (Euro)" required hint="Untergrenze des genannten Rahmens.">
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="decimal"
                        value={form.priceFrom}
                        onChange={(e) => onAendern({ priceFrom: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field label="Preis bis (Euro)" hint="Leer lassen, wenn nur eine Untergrenze genannt werden soll.">
                    {({ id, describedBy }) => (
                      <TextInput
                        id={id}
                        aria-describedby={describedBy}
                        inputMode="decimal"
                        value={form.priceTo}
                        onChange={(e) => onAendern({ priceTo: e.target.value })}
                      />
                    )}
                  </Field>
                </>
              )}

              {form.mode === 'pruefung' && (
                <div className="md:col-span-1 xl:col-span-2">
                  <Alert tone="info">
                    Bei manueller Prüfung wird kein Preis im Voraus genannt. Die Kundschaft sieht
                    stattdessen den Hinweistext und erhält den Preis nach der Prüfung.
                  </Alert>
                </div>
              )}

              <Field
                label="Abweichende Anzahlung in Euro"
                hint={`Leer lassen, damit der Grundwert gilt: ${formatCents(basis.booking.depositCents)}. Zulässig sind ${formatCents(basis.booking.depositMinCents)} bis ${formatCents(basis.booking.depositMaxCents)}.`}
              >
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    inputMode="decimal"
                    value={form.deposit}
                    onChange={(e) => onAendern({ deposit: e.target.value })}
                  />
                )}
              </Field>

              <Field
                label="Abweichende Terminlänge in Minuten"
                hint={`Leer lassen, damit der Grundwert gilt: ${formatDuration(basis.booking.slotMinutes)}.`}
              >
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    inputMode="numeric"
                    value={form.slotMinutes}
                    onChange={(e) => onAendern({ slotMinutes: e.target.value })}
                  />
                )}
              </Field>

              <Field
                label="Abweichender Vorlauf in Tagen"
                hint={`Leer lassen, damit der Grundwert gilt: ${basis.booking.leadTimeDays} Tage.`}
              >
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    inputMode="numeric"
                    value={form.leadTimeDays}
                    onChange={(e) => onAendern({ leadTimeDays: e.target.value })}
                  />
                )}
              </Field>

              <Field
                label="Hinweistext für die Kundschaft"
                className="md:col-span-2 xl:col-span-3"
                hint="Wird zusammen mit dem Preis angezeigt. Sachlich formulieren, keine Werbesprache."
              >
                {({ id, describedBy }) => (
                  <TextArea
                    id={id}
                    aria-describedby={describedBy}
                    rows={3}
                    value={form.note}
                    onChange={(e) => onAendern({ note: e.target.value })}
                  />
                )}
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button type="button" onClick={onSpeichern} loading={laufend}>
                Regel speichern
              </Button>
              <Rueckmeldung meldung={meldung} schluessel={`regel-${rule.id}`} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ==========================================================================
   Kleinteile und Prüfungen
   ========================================================================== */

function Kontrollkaestchen({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (wert: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface px-3.5 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
      />
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold text-foreground">{label}</span>
        {hint && <span className="mt-0.5 block text-[13px] text-foreground-muted">{hint}</span>}
      </span>
    </label>
  );
}

function formatCentsAusEingabe(wert: string): string {
  const cents = euroToCents(wert);
  return cents === null ? 'Eingabe prüfen' : formatCents(cents);
}

function minutenText(wert: string): string {
  const minuten = ganzzahl(wert);
  return minuten === null ? 'Eingabe prüfen' : formatDuration(minuten);
}

function abweichungText(eigenerWert: string | null, grundwert: string): string {
  return eigenerWert ?? `${grundwert} (aus Grundwerten)`;
}

function preisText(form: RegelForm): string {
  if (form.mode === 'pruefung') return 'Wird geprüft';
  if (form.mode === 'fest') {
    return form.price === '' ? 'Noch kein Preis hinterlegt' : formatCentsAusEingabe(form.price);
  }
  const von = form.priceFrom === '' ? null : formatCentsAusEingabe(form.priceFrom);
  const bis = form.priceTo === '' ? null : formatCentsAusEingabe(form.priceTo);
  if (von && bis) return `${von} bis ${bis}`;
  if (von) return `ab ${von}`;
  return 'Noch kein Preisrahmen hinterlegt';
}

/** Plausibilitätsprüfung der Grundwerte. Leeres Ergebnis bedeutet gültig. */
function pruefeGrundwerte(form: GrundwerteForm): Partial<Record<keyof GrundwerteForm, string>> {
  const fehler: Partial<Record<keyof GrundwerteForm, string>> = {};

  const vorlauf = ganzzahl(form.leadTimeDays);
  if (vorlauf === null) fehler.leadTimeDays = 'Bitte eine ganze Zahl ab 0 eintragen.';

  const dauer = ganzzahl(form.slotMinutes);
  if (dauer === null || dauer <= 0) fehler.slotMinutes = 'Die Terminlänge muss größer als 0 sein.';

  const horizont = ganzzahl(form.bookingHorizonDays);
  if (horizont === null || horizont <= 0) {
    fehler.bookingHorizonDays = 'Der Buchungshorizont muss mindestens 1 Tag betragen.';
  }

  const proFenster = ganzzahl(form.slotsPerWindow);
  if (proFenster === null || proFenster <= 0) {
    fehler.slotsPerWindow = 'Es muss mindestens ein Termin je Zeitfenster möglich sein.';
  }

  const anzahlung = euroToCents(form.deposit);
  const minimum = euroToCents(form.depositMin);
  const maximum = euroToCents(form.depositMax);

  if (anzahlung === null) fehler.deposit = 'Bitte einen Betrag eintragen, zum Beispiel 69,90.';
  if (minimum === null) fehler.depositMin = 'Bitte einen Betrag eintragen.';
  if (maximum === null) fehler.depositMax = 'Bitte einen Betrag eintragen.';

  if (minimum !== null && maximum !== null && minimum > maximum) {
    fehler.depositMax = 'Die Obergrenze darf nicht kleiner als die Untergrenze sein.';
  }
  if (anzahlung !== null && minimum !== null && anzahlung < minimum) {
    fehler.deposit = 'Die Anzahlung liegt unter der Untergrenze des Rahmens.';
  }
  if (anzahlung !== null && maximum !== null && anzahlung > maximum) {
    fehler.deposit = 'Die Anzahlung liegt über der Obergrenze des Rahmens.';
  }

  return fehler;
}

/** Prüft eine Preisregel. Gibt einen Hinweistext zurück, wenn etwas fehlt. */
function pruefeRegel(form: RegelForm): string | null {
  if (form.mode === 'fest' && euroToCents(form.price) === null) {
    return 'Bei einem festen Preis muss ein Betrag eingetragen sein, zum Beispiel 149,00.';
  }
  if (form.mode === 'rahmen') {
    const von = euroToCents(form.priceFrom);
    if (von === null) return 'Bei einem Preisrahmen muss mindestens der Wert „Preis von“ gesetzt sein.';
    const bis = form.priceTo.trim() === '' ? null : euroToCents(form.priceTo);
    if (form.priceTo.trim() !== '' && bis === null) {
      return 'Der Wert „Preis bis“ ist keine gültige Zahl.';
    }
    if (bis !== null && bis < von) return 'Der Wert „Preis bis“ darf nicht kleiner als „Preis von“ sein.';
  }
  if (form.deposit.trim() !== '' && euroToCents(form.deposit) === null) {
    return 'Die abweichende Anzahlung ist keine gültige Zahl.';
  }
  if (form.slotMinutes.trim() !== '') {
    const minuten = ganzzahl(form.slotMinutes);
    if (minuten === null || minuten <= 0) return 'Die abweichende Terminlänge muss größer als 0 sein.';
  }
  if (form.leadTimeDays.trim() !== '' && ganzzahl(form.leadTimeDays) === null) {
    return 'Der abweichende Vorlauf muss eine ganze Zahl ab 0 sein.';
  }
  return null;
}
