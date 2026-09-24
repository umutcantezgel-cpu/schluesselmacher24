'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { submitRecord } from '@/lib/actions/records';
import type { AreaKey, SummarySection } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { FlowShell } from '@/components/flow/flow-shell';
import { Field } from '@/components/forms/field';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import { Select, TextArea, TextInput } from '@/components/forms/controls';
import { SummaryList } from '@/components/layout/summary-list';

const STEPS: FlowStep[] = [
  { id: 'thema', short: 'Thema', title: 'Worum geht es?', hint: 'So landet Ihre Anfrage gleich bei der richtigen Person.' },
  { id: 'anliegen', short: 'Anliegen', title: 'Beschreiben Sie Ihr Anliegen', hint: 'Je konkreter Ihre Angaben, desto genauer unsere Einschätzung.' },
  { id: 'unterlagen', short: 'Unterlagen', title: 'Fotos oder Unterlagen', hint: 'Freiwillig. Ein Foto sagt oft mehr als eine Beschreibung.' },
  { id: 'kontakt', short: 'Kontakt', title: 'Ihre Kontaktdaten', hint: 'Wir melden uns per E-Mail oder telefonisch.' },
  { id: 'pruefen', short: 'Prüfen', title: 'Angaben prüfen und absenden', hint: 'Bitte kontrollieren Sie Ihre Angaben vor dem Absenden.' },
];

interface FormData {
  thema: string;
  dringlichkeit: string;
  beschreibung: string;
  objekt: string;
  anrede: string;
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  telefon: string;
  plz: string;
  ort: string;
}

const LEER: FormData = {
  thema: '',
  dringlichkeit: 'normal',
  beschreibung: '',
  objekt: '',
  anrede: '',
  vorname: '',
  nachname: '',
  firma: '',
  email: '',
  telefon: '',
  plz: '',
  ort: '',
};

const DRINGLICHKEIT = [
  { id: 'normal', label: 'Keine Eile', description: 'Wir melden uns im üblichen Rahmen.' },
  { id: 'zeitnah', label: 'Zeitnah', description: 'Es sollte in den nächsten Tagen vorangehen.' },
  { id: 'terminbindung', label: 'An einen Termin gebunden', description: 'Es gibt ein festes Datum, das eingehalten werden muss.' },
];

export function AllgemeineAnfrage({
  themen,
  vorauswahl,
}: {
  themen: Array<{ key: AreaKey; label: string; summary: string }>;
  vorauswahl?: string;
}) {
  const [dateien, setDateien] = useState<PickedFile[]>([]);
  const [senden, setSenden] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [erfolg, setErfolg] = useState<{ reference: string; notices: string[] } | null>(null);

  const flow = useFlow<FormData>({
    id: 'allgemeine-anfrage',
    steps: STEPS,
    initial: { ...LEER, thema: vorauswahl && themen.some((t) => t.key === vorauswahl) ? vorauswahl : '' },
    validate: (data, stepId) => {
      if (stepId === 'thema') return data.thema !== '';
      if (stepId === 'anliegen') return data.beschreibung.trim().length >= 20;
      if (stepId === 'kontakt') {
        return (
          data.vorname.trim() !== '' &&
          data.nachname.trim() !== '' &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
          data.telefon.trim() !== ''
        );
      }
      return true;
    },
  });

  const { data } = flow;
  const thema = themen.find((t) => t.key === data.thema);

  const zusammenfassung: SummarySection[] = [
    {
      title: 'Anliegen',
      rows: [
        { label: 'Bereich', value: thema?.label ?? '—' },
        {
          label: 'Zeitlicher Rahmen',
          value: DRINGLICHKEIT.find((d) => d.id === data.dringlichkeit)?.label ?? '—',
        },
        { label: 'Beschreibung', value: data.beschreibung || '—' },
        { label: 'Objekt oder Fahrzeug', value: data.objekt || 'keine Angabe' },
        { label: 'Unterlagen', value: dateien.length > 0 ? `${dateien.length} Datei(en)` : 'keine' },
      ],
    },
    {
      title: 'Kontakt',
      rows: [
        {
          label: 'Name',
          value: [data.anrede, data.vorname, data.nachname].filter(Boolean).join(' ') || '—',
        },
        { label: 'Firma', value: data.firma || 'keine Angabe' },
        { label: 'E-Mail', value: data.email || '—' },
        { label: 'Telefon', value: data.telefon || '—' },
        { label: 'Ort', value: [data.plz, data.ort].filter(Boolean).join(' ') || 'keine Angabe' },
      ],
    },
  ];

  async function absenden() {
    setSenden(true);
    setFehler(null);
    // Laufende Uploads abschließen, damit ihre Kennungen mitgehen.
    await uploadsAbwarten();

    const ergebnis = await submitRecord({
      kind: 'anfrage',
      area: (data.thema || 'service-und-termin') as AreaKey,
      process: 'gefuehrte-anfrage',
      contact: {
        salutation: data.anrede || undefined,
        firstName: data.vorname,
        lastName: data.nachname,
        company: data.firma || undefined,
        email: data.email,
        phone: data.telefon,
        postalCode: data.plz || undefined,
        city: data.ort || undefined,
        country: 'Deutschland',
      },
      payload: { ...data, dateien: dateien.map((f) => f.name) },
      summary: zusammenfassung,
      uploads: dateien.map((f) => alsUpload(f, 'dokument')),
    });

    setSenden(false);

    if (!ergebnis.ok) {
      setFehler(ergebnis.error ?? 'Ihre Anfrage konnte nicht gespeichert werden.');
      return;
    }

    clearFlow('allgemeine-anfrage');
    setErfolg({ reference: ergebnis.reference ?? '', notices: ergebnis.notices });
  }

  if (erfolg) {
    return (
      <div className="max-w-2xl">
        <div className="rounded-lg border border-success/30 bg-success-soft p-6">
          <CheckCircle2 size={26} className="text-success" aria-hidden />
          <h2 className="mt-3 text-xl font-bold text-foreground">Ihre Anfrage ist bei uns</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">
            Wir sehen uns Ihre Angaben an und melden uns mit einer Einschätzung.
          </p>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
            Ihre Vorgangsnummer
          </p>
          <p className="mt-1 font-mono text-xl font-bold text-foreground">{erfolg.reference}</p>
          <p className="mt-2 text-[13px] text-foreground-muted">
            Bitte bewahren Sie diese Nummer auf. Mit ihr und Ihrer E-Mail-Adresse rufen Sie den{' '}
            <Link href="/service-und-termin/terminstatus" className="font-semibold underline">
              Stand Ihres Vorgangs
            </Link>{' '}
            ab.
          </p>
        </div>

        {erfolg.notices.length > 0 && (
          <Alert tone="info" title="Hinweise" className="mt-4">
            <ul className="space-y-1">
              {erfolg.notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
          </Alert>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/">Zur Startseite</ButtonLink>
          <ButtonLink href="/ratgeber" variant="outline">
            Ratgeber lesen
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <FlowShell
        flow={flow}
        title="Allgemeine Anfrage"
        submitLabel="Anfrage absenden"
        onSubmit={absenden}
        submitting={senden}
        blockedHint="Bitte füllen Sie die Pflichtangaben dieses Schrittes aus."
      >
        {flow.step?.id === 'thema' && (
          <div className="space-y-3">
            {themen.map((t) => (
              <OptionCard
                key={t.key}
                name="thema"
                value={t.key}
                checked={data.thema === t.key}
                onSelect={(value) => flow.set('thema', value)}
                title={t.label}
                description={t.summary}
              />
            ))}

            <Alert tone="info" className="mt-6">
              Für Autoschlüssel, Schlüssel nach Code und Schließanlagen gibt es eigene, deutlich
              schnellere Abläufe. Diese Anfrage ist für alles gedacht, was dort nicht hineinpasst.
            </Alert>
          </div>
        )}

        {flow.step?.id === 'anliegen' && (
          <div className="space-y-6">
            <Field
              label="Was sollen wir für Sie tun?"
              required
              hint="Mindestens 20 Zeichen. Beschreiben Sie Ausgangslage, Ziel und was bisher passiert ist."
            >
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  rows={7}
                  value={data.beschreibung}
                  onChange={(e) => flow.set('beschreibung', e.target.value)}
                  placeholder="Zum Beispiel: An unserer Hauseingangstür klemmt seit einigen Wochen der Riegel. Die Tür lässt sich nur mit Kraft schließen."
                />
              )}
            </Field>

            <Field
              label="Um welches Objekt oder Fahrzeug geht es?"
              hint="Freiwillig. Zum Beispiel Mehrfamilienhaus mit 8 Parteien oder Transporter, Baujahr 2019."
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={data.objekt}
                  onChange={(e) => flow.set('objekt', e.target.value)}
                />
              )}
            </Field>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-foreground">
                Wie dringend ist es?
              </legend>
              <div className="space-y-3">
                {DRINGLICHKEIT.map((option) => (
                  <OptionCard
                    key={option.id}
                    name="dringlichkeit"
                    value={option.id}
                    checked={data.dringlichkeit === option.id}
                    onSelect={(value) => flow.set('dringlichkeit', value)}
                    title={option.label}
                    description={option.description}
                  />
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {flow.step?.id === 'unterlagen' && (
          <PhotoUpload
            category="dokument"
            id="anfrage-dateien"
            label="Fotos oder Unterlagen"
            description="Freiwillig. Fotos der betroffenen Tür, des Schlüssels oder vorhandene Unterlagen helfen uns sehr."
            example={{
              motif: 'Beispielfoto: betroffene Tür mit Schloss, gut ausgeleuchtet',
              ratio: '4/3',
            }}
            files={dateien}
            onChange={setDateien}
            multiple
            maxFiles={5}
            allowDocuments
          />
        )}

        {flow.step?.id === 'kontakt' && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Anrede">
              {({ id }) => (
                <Select id={id} value={data.anrede} onChange={(e) => flow.set('anrede', e.target.value)}>
                  <option value="">keine Angabe</option>
                  <option value="Frau">Frau</option>
                  <option value="Herr">Herr</option>
                </Select>
              )}
            </Field>

            <Field label="Firma" hint="Nur bei gewerblichen Anfragen.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={data.firma}
                  onChange={(e) => flow.set('firma', e.target.value)}
                />
              )}
            </Field>

            <Field label="Vorname" required>
              {({ id, invalid }) => (
                <TextInput
                  id={id}
                  invalid={invalid}
                  autoComplete="given-name"
                  value={data.vorname}
                  onChange={(e) => flow.set('vorname', e.target.value)}
                />
              )}
            </Field>

            <Field label="Nachname" required>
              {({ id, invalid }) => (
                <TextInput
                  id={id}
                  invalid={invalid}
                  autoComplete="family-name"
                  value={data.nachname}
                  onChange={(e) => flow.set('nachname', e.target.value)}
                />
              )}
            </Field>

            <Field label="E-Mail-Adresse" required hint="Hierüber erhalten Sie unsere Rückmeldung.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => flow.set('email', e.target.value)}
                />
              )}
            </Field>

            <Field label="Telefon" required hint="Für kurze Rückfragen.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={data.telefon}
                  onChange={(e) => flow.set('telefon', e.target.value)}
                />
              )}
            </Field>

            <Field label="Postleitzahl">
              {({ id }) => (
                <TextInput
                  id={id}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={data.plz}
                  onChange={(e) => flow.set('plz', e.target.value)}
                />
              )}
            </Field>

            <Field label="Ort">
              {({ id }) => (
                <TextInput
                  id={id}
                  autoComplete="address-level2"
                  value={data.ort}
                  onChange={(e) => flow.set('ort', e.target.value)}
                />
              )}
            </Field>

            <div className="sm:col-span-2">
              <Alert tone="legal">
                Ihre Angaben verwenden wir ausschließlich zur Bearbeitung dieser Anfrage. Weitere
                Informationen finden Sie in der{' '}
                <Link href="/rechtliches/datenschutz" className="font-semibold underline">
                  Datenschutzerklärung
                </Link>
                .
              </Alert>
            </div>
          </div>
        )}

        {flow.step?.id === 'pruefen' && (
          <div>
            <SummaryList sections={zusammenfassung} />

            <Alert tone="info" className="mt-6">
              Mit dem Absenden entsteht noch kein Vertrag. Wir prüfen Ihre Angaben und melden uns
              mit einer Einschätzung und gegebenenfalls einem Preis.
            </Alert>

            {fehler && (
              <Alert tone="warning" title="Das hat nicht geklappt" className="mt-4">
                {fehler}
              </Alert>
            )}
          </div>
        )}
      </FlowShell>
    </div>
  );
}
