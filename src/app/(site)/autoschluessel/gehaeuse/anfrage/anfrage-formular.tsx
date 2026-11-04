'use client';

import { useMemo, useState } from 'react';

import { FlowShell } from '@/components/flow/flow-shell';
import { TextInput } from '@/components/forms/controls';
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
import type { ImageSlot } from '@/lib/types';
import { naechsteSchritte } from '@/lib/wege/naechste-schritte';

import {
  INITIAL,
  MAX_MARKE,
  MAX_MODELL,
  TASTEN_OPTIONEN,
  gehaeuseZusammenfassung,
  kontaktAus,
  payloadAus,
  schrittGueltig,
  type GehaeuseDaten,
  type GehaeuseSchritt,
} from './kern';

const FLOW_ID = 'autoschluessel-gehaeuse-anfrage';

const STEPS: FlowStep[] = [
  { id: 'fahrzeug', title: 'Welches Fahrzeug gehört zum Schlüssel?', hint: 'Marke und Modell tragen Sie frei ein, so wie sie im Fahrzeugschein stehen.', short: 'Fahrzeug' },
  { id: 'tasten', title: 'Wie viele Tasten hat der Schlüssel?', hint: 'Die Anzahl hilft uns bei der Prüfung. Wenn Sie es nicht wissen, wählen Sie „Weiß ich nicht“.', short: 'Tasten' },
  { id: 'unterlagen', title: 'Fotos von Schlüssel und Fahrzeugschein', hint: 'Beide Fotos brauchen wir. Den Fahrzeugschein können Sie auch als PDF hochladen.', short: 'Fotos' },
  { id: 'kontakt', title: 'Kontakt', hint: 'Hierhin schicken wir Ihre Rückmeldung.', short: 'Kontakt' },
  { id: 'absenden', title: 'Angaben prüfen und Anfrage absenden', hint: 'Nach dem Absenden erhalten Sie eine Bestätigung mit Ihrer Nummer.', short: 'Absenden' },
];

const EXAMPLE_SCHLUESSEL: ImageSlot = {
  motif: 'Beispielfoto: Autoschlüssel flach von oben, Vorder- und Rückseite im Bild',
  ratio: '4/3',
  note: 'Heller, neutraler Untergrund. Kein direkter Blitz.',
};

const EXAMPLE_SCHEIN: ImageSlot = {
  motif: 'Beispielfoto: Fahrzeugschein flach aufgelegt, alle vier Ecken im Bild',
  ratio: '3/2',
  note: 'Scharf und ohne Spiegelung. Die Angaben müssen lesbar sein.',
};

const SCHRITTE = naechsteSchritte({
  kind: 'anfrage',
  area: 'autoschluessel',
  process: 'gefuehrte-anfrage',
  payload: { quelle: 'gehaeuse' },
});

/**
 * Autoschlüssel-Gehäuse-Anfrage (G-20, E6-BAUMEISTER-02): fünf Schritte. Fahrzeugschein und Schlüsselfoto sind
 * Pflicht (R13); der Server prüft sie noch einmal. Die Zusammenfassung baut hier dieselbe Funktion wie
 * die Vorschau.
 */
export function AnfrageFormular() {
  const [fotoSchluessel, setFotoSchluessel] = useState<PickedFile[]>([]);
  const [fotoSchein, setFotoSchein] = useState<PickedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const schutz = useFormularSchutz();

  const flow = useFlow<GehaeuseDaten>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    version: 1,
    validate: (daten, stepId) => schrittGueltig(daten, stepId as GehaeuseSchritt),
  });

  const { data } = flow;

  // Fotos zählen nicht zum gespeicherten Zustand, deshalb wird die Weiter-Sperre hier ergänzt.
  const fotosFehlen =
    flow.step?.id === 'unterlagen' && (fotoSchluessel.length === 0 || fotoSchein.length === 0);
  const shellFlow = { ...flow, canContinue: flow.canContinue && !fotosFehlen };

  const summary = useMemo(() => gehaeuseZusammenfassung(data), [data]);

  async function absenden() {
    setSubmitting(true);
    setFehler(null);
    // Laufende Uploads abschließen, damit ihre Kennungen mitgehen.
    await uploadsAbwarten();

    try {
      const antwort = await submitRecord({
        schutz: await schutz.daten(),
        kind: 'anfrage',
        area: 'autoschluessel',
        process: 'gefuehrte-anfrage',
        contact: kontaktAus(data),
        payload: payloadAus(data),
        summary,
        uploads: [
          ...fotoSchluessel.map((file) => alsUpload(file, 'schluesselfoto')),
          ...fotoSchein.map((file) => alsUpload(file, 'fahrzeugschein')),
        ],
      });
      schutz.antwortBeachten(antwort);

      if (antwort.ok) {
        setResult(antwort);
        clearFlow(FLOW_ID);
      } else {
        setFehler(antwort.error ?? 'Die Anfrage konnte nicht gespeichert werden.');
      }
    } catch {
      setFehler('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es noch einmal.');
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- Erfolgsansicht -------------------------------------------- */

  if (result?.ok) {
    return (
      <WegBestaetigung
        marke="Anfrage eingegangen"
        titel="Ihre Gehäuse-Anfrage ist bei uns"
        text="Wir prüfen Fahrzeug, Schlüssel und Fahrzeugschein und melden uns mit Preis und Ablauf."
        reference={result.reference ?? ''}
        notices={result.notices}
        schritte={SCHRITTE}
        summary={summary}
        zurueck={{ href: '/autoschluessel/gehaeuse', label: 'Zurück zum Gehäuse' }}
      />
    );
  }

  /* ---------- Ablauf ----------------------------------------------------- */

  const blockedHints: Record<string, string> = {
    fahrzeug: `Bitte tragen Sie Marke (höchstens ${MAX_MARKE} Zeichen), Modell (höchstens ${MAX_MODELL} Zeichen) und ein Baujahr mit vier Ziffern ein.`,
    tasten: 'Bitte wählen Sie, wie viele Tasten der Schlüssel hat.',
    unterlagen: 'Bitte fügen Sie ein Foto Ihres Schlüssels und ein Foto oder PDF Ihres Fahrzeugscheins hinzu.',
    kontakt: 'Bitte füllen Sie Vorname, Nachname, E-Mail und Telefon aus. Die Postleitzahl hat fünf Ziffern, wenn Sie sie angeben.',
  };

  return (
    <FlowShell
      schutz={schutz}
      abschlussHinweis={<AnfrageHinweis />}
      flow={shellFlow}
      title="Autoschlüssel-Gehäuse: Anfrage"
      submitLabel="Anfrage absenden"
      onSubmit={absenden}
      submitting={submitting}
      blockedHint={blockedHints[flow.step?.id ?? '']}
    >
      {fehler && (
        <Alert tone="warning" title="Absenden nicht möglich" className="mb-6" role="alert">
          {fehler}
        </Alert>
      )}

      {flow.step?.id === 'fahrzeug' && (
        <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Marke" required hint={`Höchstens ${MAX_MARKE} Zeichen.`}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="off"
                  maxLength={MAX_MARKE}
                  value={data.marke}
                  onChange={(e) => flow.set('marke', e.target.value)}
                />
              )}
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Modell" required hint={`Höchstens ${MAX_MODELL} Zeichen.`}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="off"
                  maxLength={MAX_MODELL}
                  value={data.modell}
                  onChange={(e) => flow.set('modell', e.target.value)}
                />
              )}
            </Field>
          </div>
          <Field label="Baujahr" required hint="Vier Ziffern, zum Beispiel 2019.">
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={data.baujahr}
                onChange={(e) => flow.set('baujahr', e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {flow.step?.id === 'tasten' && (
        <fieldset className="max-w-3xl space-y-3">
          <legend className="text-body font-semibold text-foreground">Wie viele Tasten hat der Schlüssel?</legend>
          <p className="text-small leading-relaxed text-foreground-muted">
            Die Anzahl der Tasten hilft uns bei der Prüfung. Wenn Sie es nicht wissen, wählen Sie „Weiß ich nicht“; wir klären
            es anhand Ihrer Fotos.
          </p>
          {TASTEN_OPTIONEN.map((option) => (
            <OptionCard
              key={option.wert}
              name="tasten"
              value={option.wert}
              checked={data.tasten === option.wert}
              onSelect={() => flow.set('tasten', option.wert)}
              title={option.titel}
              description={option.satz}
            />
          ))}
        </fieldset>
      )}

      {flow.step?.id === 'unterlagen' && (
        <div className="max-w-3xl space-y-8">
          <PhotoUpload
            category="schluesselfoto"
            id="foto-schluessel"
            label="Foto Ihres Schlüssels"
            description="Vorder- und Rückseite, gern auch das gebrochene Teil. Scharf und gut ausgeleuchtet."
            example={EXAMPLE_SCHLUESSEL}
            files={fotoSchluessel}
            onChange={setFotoSchluessel}
            required
            multiple
            maxFiles={3}
          />
          <PhotoUpload
            category="fahrzeugschein"
            id="foto-fahrzeugschein"
            label="Fahrzeugschein (Zulassungsbescheinigung Teil I)"
            description="Als Foto oder als PDF. Bitte vollständig und lesbar, alle vier Ecken im Bild."
            example={EXAMPLE_SCHEIN}
            files={fotoSchein}
            onChange={setFotoSchein}
            required
            allowDocuments
            multiple
            maxFiles={2}
          />
          <p className="text-small leading-relaxed text-foreground-subtle">
            Fotos werden nicht im Browser zwischengespeichert. Nach einem Neuladen der Seite wählen Sie sie bitte erneut aus.
          </p>
        </div>
      )}

      {flow.step?.id === 'kontakt' && (
        <div className="max-w-3xl space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Anrede (freiwillig)">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    autoComplete="honorific-prefix"
                    value={data.anrede}
                    onChange={(e) => flow.set('anrede', e.target.value)}
                  />
                )}
              </Field>
            </div>
            <Field label="Vorname" required>
              {({ id, describedBy, invalid }) => (
                <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="given-name" value={data.vorname} onChange={(e) => flow.set('vorname', e.target.value)} />
              )}
            </Field>
            <Field label="Nachname" required>
              {({ id, describedBy, invalid }) => (
                <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="family-name" value={data.nachname} onChange={(e) => flow.set('nachname', e.target.value)} />
              )}
            </Field>
            <Field label="E-Mail" required hint="Hierhin schicken wir die Rückmeldung zu Ihrer Anfrage.">
              {({ id, describedBy, invalid }) => (
                <TextInput id={id} type="email" inputMode="email" aria-describedby={describedBy} invalid={invalid} autoComplete="email" value={data.email} onChange={(e) => flow.set('email', e.target.value)} />
              )}
            </Field>
            <Field label="Telefon" required>
              {({ id, describedBy, invalid }) => (
                <TextInput id={id} type="tel" inputMode="tel" aria-describedby={describedBy} invalid={invalid} autoComplete="tel" value={data.telefon} onChange={(e) => flow.set('telefon', e.target.value)} />
              )}
            </Field>
          </div>
          <div className="grid gap-5 border-t border-border pt-5 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <Field label="Postleitzahl (freiwillig)" hint="Fünf Ziffern.">
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} inputMode="numeric" maxLength={5} aria-describedby={describedBy} invalid={invalid} autoComplete="postal-code" value={data.plz} onChange={(e) => flow.set('plz', e.target.value)} />
                )}
              </Field>
            </div>
            <div className="sm:col-span-4">
              <Field label="Ort (freiwillig)">
                {({ id, describedBy }) => (
                  <TextInput id={id} aria-describedby={describedBy} autoComplete="address-level2" value={data.ort} onChange={(e) => flow.set('ort', e.target.value)} />
                )}
              </Field>
            </div>
          </div>
        </div>
      )}

      {flow.step?.id === 'absenden' && (
        <div className="max-w-3xl space-y-6">
          <Alert tone="legal" title="Noch kein Vertrag">
            Mit dem Absenden stellen Sie eine Anfrage. Preis und Ablauf nennen wir Ihnen nach der Prüfung.
          </Alert>
          <SummaryList sections={summary} variante="schriftfeld" />
        </div>
      )}
    </FlowShell>
  );
}
