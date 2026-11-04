'use client';

import { useMemo, useState } from 'react';

import { FlowShell } from '@/components/flow/flow-shell';
import { Select, TextArea, TextInput } from '@/components/forms/controls';
import { Field } from '@/components/forms/field';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import { SummaryList } from '@/components/layout/summary-list';
import { AnfrageHinweis } from '@/components/recht/anfrage-hinweis';
import { Alert } from '@/components/ui/alert';
import { WegBestaetigung } from '@/components/weg/bestaetigung';
import { submitRecord, type SubmitResult } from '@/lib/actions/records';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import type { ContactDetails, ImageSlot } from '@/lib/types';
import { SCHRITTE_NACH_ART } from '@/lib/wege/naechste-schritte';

import {
  ANLIEGEN,
  BESCHREIBUNG_HOECHSTENS,
  BESCHREIBUNG_MINDESTENS,
  INITIAL,
  ZEITRAUM_LABEL,
  einsatzZusammenfassung,
  istSchritt,
  schrittGueltig,
  type EinsatzDaten,
  type Zeitraum,
} from './kern';

const FLOW_ID = 'vor-ort-einsatz';

const STEPS: FlowStep[] = [
  { id: 'anliegen', title: 'Ihr Anliegen und der Ort', hint: 'Was ist zu tun, und wo? Ein Foto ist freiwillig.', short: 'Anliegen' },
  { id: 'kontakt', title: 'Ihr Kontakt und Ihre Berechtigung', hint: 'Wir melden uns unter der Telefonnummer, die Sie angeben.', short: 'Kontakt' },
  { id: 'absenden', title: 'Angaben prüfen und absenden', hint: 'Bitte kontrollieren Sie Ihre Angaben vor dem Absenden.', short: 'Absenden' },
];

const EXAMPLE_FOTO: ImageSlot = {
  motif: 'Beispielfoto: Tür mit Schloss am Einsatzort, gut ausgeleuchtet',
  ratio: '4/3',
};

const ZEITRAUM_OPTIONEN: { wert: Zeitraum; titel: string }[] = [
  { wert: 'bald', titel: ZEITRAUM_LABEL.bald },
  { wert: 'spaeter', titel: ZEITRAUM_LABEL.spaeter },
  { wert: 'flexibel', titel: ZEITRAUM_LABEL.flexibel },
];

function kontaktAus(d: EinsatzDaten): ContactDetails {
  return {
    salutation: d.anrede || undefined,
    firstName: d.vorname.trim(),
    lastName: d.nachname.trim(),
    email: d.email.trim(),
    phone: d.telefon.trim(),
    street: d.strasse.trim() || undefined,
    postalCode: d.postleitzahl.trim(),
    city: d.ort.trim(),
    country: 'Deutschland',
  };
}

/** Anfrage „Einsatz vor Ort“ (G-40): drei Schritte, danach die gemeinsame Bestätigung. */
export function EinsatzFormular() {
  const [fotos, setFotos] = useState<PickedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const schutz = useFormularSchutz();

  const flow = useFlow<EinsatzDaten>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    version: 1,
    validate: (d, stepId) => (istSchritt(stepId) ? schrittGueltig(d, stepId) : true),
  });

  const { data } = flow;
  const summary = useMemo(() => einsatzZusammenfassung(data, fotos.length), [data, fotos.length]);

  async function absenden() {
    setSubmitting(true);
    setFehler(null);
    // Laufende Uploads abschließen, damit ihre Kennungen mitgehen.
    await uploadsAbwarten();
    try {
      const antwort = await submitRecord({
        schutz: await schutz.daten(),
        kind: 'anfrage',
        area: 'service-und-termin',
        process: 'gefuehrte-anfrage',
        contact: kontaktAus(data),
        payload: {
          quelle: 'vor-ort',
          anliegen: data.anliegen,
          beschreibung: data.beschreibung.trim(),
          zeitraum: data.zeitraum,
          berechtigt: true,
        },
        // Die Zusammenfassung ist dieselbe Funktion wie in der Vorschau.
        summary,
        uploads: fotos.map((foto) => alsUpload(foto, 'dokument')),
      });
      schutz.antwortBeachten(antwort);
      if (antwort.ok) {
        setResult(antwort);
        clearFlow(FLOW_ID);
      } else {
        setFehler(antwort.error ?? 'Ihre Anfrage konnte nicht gespeichert werden.');
      }
    } catch {
      setFehler('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es noch einmal.');
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok) {
    return (
      <WegBestaetigung
        marke="Anfrage eingegangen"
        titel="Ihre Einsatz-Anfrage ist bei uns"
        text="Wir klären, ob die Werkstatt oder ein Partner zu Ihnen kommen kann. Vor der Terminbestätigung erfahren Sie, was der Einsatz kostet."
        reference={result.reference ?? ''}
        notices={result.notices}
        schritte={SCHRITTE_NACH_ART.anfrage}
        summary={summary}
        zurueck={{ href: '/service-und-termin/vor-ort', label: 'Zurück zu Vor Ort' }}
      />
    );
  }

  const gesperrt: Record<string, string> = {
    anliegen: `Bitte wählen Sie ein Anliegen, beschreiben Sie es (${BESCHREIBUNG_MINDESTENS} bis ${BESCHREIBUNG_HOECHSTENS} Zeichen) und geben Sie Postleitzahl und Ort an.`,
    kontakt: 'Bitte füllen Sie Vor- und Nachname, E-Mail und Telefon aus, wählen Sie einen Wunschzeitraum und bestätigen Sie Ihre Berechtigung.',
  };

  return (
    <FlowShell
      eingebettet
      schutz={schutz}
      abschlussHinweis={<AnfrageHinweis />}
      flow={flow}
      title="Einsatz anfragen"
      submitLabel="Einsatz anfragen"
      onSubmit={absenden}
      submitting={submitting}
      blockedHint={gesperrt[flow.step?.id ?? ''] ?? 'Bitte füllen Sie die Pflichtangaben dieses Schrittes aus.'}
    >
      {fehler && (
        <Alert tone="warning" title="Das hat nicht geklappt" className="mb-6" role="alert">
          {fehler}
        </Alert>
      )}

      {flow.step?.id === 'anliegen' && (
        <div className="max-w-3xl space-y-6">
          <Field label="Anliegen" required>
            {({ id, describedBy, invalid }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                value={data.anliegen}
                onChange={(e) => flow.set('anliegen', e.target.value as EinsatzDaten['anliegen'])}
              >
                <option value="">Bitte wählen</option>
                {ANLIEGEN.map((anliegen) => (
                  <option key={anliegen} value={anliegen}>
                    {anliegen}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label="Was ist zu tun?"
            required
            hint={`Mindestens ${BESCHREIBUNG_MINDESTENS} Zeichen, höchstens ${BESCHREIBUNG_HOECHSTENS}.`}
          >
            {({ id, describedBy, invalid }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                rows={6}
                maxLength={BESCHREIBUNG_HOECHSTENS}
                value={data.beschreibung}
                onChange={(e) => flow.set('beschreibung', e.target.value)}
              />
            )}
          </Field>

          <PhotoUpload
            category="dokument"
            id="vor-ort-fotos"
            label="Fotos (freiwillig)"
            description="Bis zu drei Fotos, zum Beispiel von der Tür, vom Schlüssel oder vom Schloss."
            example={EXAMPLE_FOTO}
            files={fotos}
            onChange={setFotos}
            multiple
            maxFiles={3}
            allowDocuments
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Postleitzahl" required hint="Genau fünf Ziffern.">
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={data.postleitzahl}
                  onChange={(e) => flow.set('postleitzahl', e.target.value)}
                />
              )}
            </Field>
            <Field label="Ort" required>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="address-level2"
                  value={data.ort}
                  onChange={(e) => flow.set('ort', e.target.value)}
                />
              )}
            </Field>
            <div className="sm:col-span-2">
              <Field label="Straße und Hausnummer (freiwillig)">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    autoComplete="street-address"
                    value={data.strasse}
                    onChange={(e) => flow.set('strasse', e.target.value)}
                  />
                )}
              </Field>
            </div>
          </div>
        </div>
      )}

      {flow.step?.id === 'kontakt' && (
        <div className="max-w-3xl space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Anrede (freiwillig)">
              {({ id }) => (
                <Select id={id} value={data.anrede} onChange={(e) => flow.set('anrede', e.target.value)}>
                  <option value="">Keine Angabe</option>
                  <option value="Frau">Frau</option>
                  <option value="Herr">Herr</option>
                </Select>
              )}
            </Field>
            <Field label="Vorname" required>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="given-name"
                  value={data.vorname}
                  onChange={(e) => flow.set('vorname', e.target.value)}
                />
              )}
            </Field>
            <Field label="Nachname" required>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="family-name"
                  value={data.nachname}
                  onChange={(e) => flow.set('nachname', e.target.value)}
                />
              )}
            </Field>
            <div className="sm:col-span-2">
              <Field label="Telefon" required hint="Hierhin melden wir uns. Mindestens sechs Ziffern, mit Vorwahl.">
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    type="tel"
                    inputMode="tel"
                    aria-describedby={describedBy}
                    invalid={invalid}
                    autoComplete="tel"
                    value={data.telefon}
                    onChange={(e) => flow.set('telefon', e.target.value)}
                  />
                )}
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="E-Mail" required hint="Für die Bestätigung und den Vorgang.">
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    type="email"
                    inputMode="email"
                    aria-describedby={describedBy}
                    invalid={invalid}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => flow.set('email', e.target.value)}
                  />
                )}
              </Field>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-1 text-small font-semibold text-foreground">Wann passt es Ihnen?</legend>
            <p className="text-small text-foreground-muted">
              Ein Wunsch, keine Zusage: Einen festen Termin nennen wir Ihnen erst bei der Terminbestätigung.
            </p>
            {ZEITRAUM_OPTIONEN.map((option) => (
              <OptionCard
                key={option.wert}
                name="zeitraum"
                value={option.wert}
                checked={data.zeitraum === option.wert}
                onSelect={() => flow.set('zeitraum', option.wert)}
                title={option.titel}
              />
            ))}
          </fieldset>

          <label className="flex min-h-touch cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4">
            <input
              type="checkbox"
              checked={data.berechtigt}
              onChange={(e) => flow.set('berechtigt', e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-border-strong"
            />
            <span className="text-small leading-relaxed text-foreground">
              Ich bin berechtigt, die Arbeiten zu beauftragen (etwa als Eigentümer, Mieter mit Erlaubnis oder im Auftrag), und weise das vor Ort nach.
            </span>
          </label>
        </div>
      )}

      {flow.step?.id === 'absenden' && (
        <div className="max-w-3xl space-y-6">
          <SummaryList sections={summary} />
          <Alert tone="info">
            Mit dem Absenden entsteht noch kein Vertrag. Wir klären, ob die Werkstatt oder ein Partner zu Ihnen kommen kann. Vor der Terminbestätigung erfahren Sie, was der Einsatz kostet.
          </Alert>
        </div>
      )}
    </FlowShell>
  );
}
