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
  BESCHREIBUNG_HOECHSTENS,
  BESCHREIBUNG_MINDESTENS,
  INITIAL,
  THEMEN,
  ZEITFENSTER_LABEL,
  beratungZusammenfassung,
  istSchritt,
  schrittGueltig,
  type BeratungDaten,
  type Zeitfenster,
} from './kern';

const FLOW_ID = 'beratung-rueckruf';

const STEPS: FlowStep[] = [
  { id: 'anliegen', title: 'Ihr Anliegen', hint: 'Worum geht es? Ein Foto ist freiwillig.', short: 'Anliegen' },
  { id: 'kontakt', title: 'Ihr Kontakt für den Rückruf', hint: 'Wir rufen Sie unter der Telefonnummer an, die Sie angeben.', short: 'Rückruf' },
  { id: 'absenden', title: 'Angaben prüfen und absenden', hint: 'Bitte kontrollieren Sie Ihre Angaben vor dem Absenden.', short: 'Absenden' },
];

const EXAMPLE_FOTO: ImageSlot = {
  motif: 'Beispielfoto: betroffene Tür mit Schloss, gut ausgeleuchtet',
  ratio: '4/3',
};

const ZEITFENSTER_OPTIONEN: { wert: Zeitfenster; titel: string }[] = [
  { wert: 'vormittags', titel: ZEITFENSTER_LABEL.vormittags },
  { wert: 'nachmittags', titel: ZEITFENSTER_LABEL.nachmittags },
  { wert: 'egal', titel: ZEITFENSTER_LABEL.egal },
];

function kontaktAus(d: BeratungDaten): ContactDetails {
  return {
    salutation: d.anrede || undefined,
    firstName: d.vorname.trim(),
    lastName: d.nachname.trim(),
    email: d.email.trim(),
    phone: d.telefon.trim(),
    postalCode: d.postleitzahl.trim() || undefined,
    city: d.ort.trim() || undefined,
    country: 'Deutschland',
  };
}

/** Rückruf-Anfrage „Beratung“ (G-34): drei Schritte, danach die gemeinsame Bestätigung. */
export function BeratungFormular() {
  const [fotos, setFotos] = useState<PickedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const schutz = useFormularSchutz();

  const flow = useFlow<BeratungDaten>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    version: 1,
    validate: (d, stepId) => (istSchritt(stepId) ? schrittGueltig(d, stepId) : true),
  });

  const { data } = flow;
  const summary = useMemo(() => beratungZusammenfassung(data, fotos.length), [data, fotos.length]);

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
          quelle: 'beratung',
          thema: data.thema,
          beschreibung: data.beschreibung.trim(),
          zeitfenster: data.zeitfenster,
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
        titel="Ihre Rückruf-Anfrage ist bei uns"
        text="Wir rufen Sie zurück, nach Möglichkeit in dem Zeitraum, den Sie nennen."
        reference={result.reference ?? ''}
        notices={result.notices}
        schritte={SCHRITTE_NACH_ART.anfrage}
        summary={summary}
        zurueck={{ href: '/beratung', label: 'Zurück zur Beratung' }}
      />
    );
  }

  const gesperrt: Record<string, string> = {
    anliegen: `Bitte wählen Sie ein Thema und beschreiben Sie Ihr Anliegen (${BESCHREIBUNG_MINDESTENS} bis ${BESCHREIBUNG_HOECHSTENS} Zeichen).`,
    kontakt: 'Bitte füllen Sie Vor- und Nachname, E-Mail und Telefon aus und wählen Sie ein Zeitfenster für den Rückruf.',
  };

  return (
    <FlowShell
      eingebettet
      schutz={schutz}
      abschlussHinweis={<AnfrageHinweis />}
      flow={flow}
      title="Rückruf anfragen"
      submitLabel="Rückruf anfragen"
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
          <Field label="Thema" required>
            {({ id, describedBy, invalid }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                value={data.thema}
                onChange={(e) => flow.set('thema', e.target.value as BeratungDaten['thema'])}
              >
                <option value="">Bitte wählen</option>
                {THEMEN.map((thema) => (
                  <option key={thema} value={thema}>
                    {thema}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label="Ihr Anliegen"
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
            id="beratung-fotos"
            label="Fotos (freiwillig)"
            description="Bis zu drei Fotos, zum Beispiel von der Tür, vom Schlüssel oder vom Schloss."
            example={EXAMPLE_FOTO}
            files={fotos}
            onChange={setFotos}
            multiple
            maxFiles={3}
            allowDocuments
          />
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
              <Field label="Telefon" required hint="Hierhin rufen wir Sie an. Mindestens sechs Ziffern, mit Vorwahl.">
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
            <Field label="Postleitzahl (freiwillig)">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={data.postleitzahl}
                  onChange={(e) => flow.set('postleitzahl', e.target.value)}
                />
              )}
            </Field>
            <Field label="Ort (freiwillig)">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  autoComplete="address-level2"
                  value={data.ort}
                  onChange={(e) => flow.set('ort', e.target.value)}
                />
              )}
            </Field>
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-1 text-small font-semibold text-foreground">Zu welcher Tageszeit passt es Ihnen?</legend>
            <p className="text-small text-foreground-muted">
              Ein Wunsch, keine Zusage: Eine feste Uhrzeit für den Rückruf nennen wir Ihnen nicht.
            </p>
            {ZEITFENSTER_OPTIONEN.map((option) => (
              <OptionCard
                key={option.wert}
                name="zeitfenster"
                value={option.wert}
                checked={data.zeitfenster === option.wert}
                onSelect={() => flow.set('zeitfenster', option.wert)}
                title={option.titel}
              />
            ))}
          </fieldset>
        </div>
      )}

      {flow.step?.id === 'absenden' && (
        <div className="max-w-3xl space-y-6">
          <SummaryList sections={summary} />
          <Alert tone="info">
            Mit dem Absenden entsteht noch kein Vertrag. Wir rufen Sie zurück, nach Möglichkeit in dem Zeitraum, den Sie nennen.
          </Alert>
        </div>
      )}
    </FlowShell>
  );
}
