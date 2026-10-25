'use client';

import { useState } from 'react';
import Link from 'next/link';

import { submitRecord } from '@/lib/actions/records';
import { scrollVerhalten } from '@/lib/bewegung';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import type { SummarySection } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { FlowShell } from '@/components/flow/flow-shell';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { Field } from '@/components/forms/field';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import { Select, TextArea, TextInput } from '@/components/forms/controls';
import { SummaryList } from '@/components/layout/summary-list';
import { CheckDraw } from '@/components/visual/motion/check-draw';

/* Bewerbung über „Partner werden“ (Erg. Leitfaden §7): kurz, ohne Partnerportal.
 * Gespeichert wird ein Vorgang der Art „partner“; das Team prüft im Backend. */

const FLOW_ID = 'partner-bewerbung';

const STEPS: FlowStep[] = [
  { id: 'betrieb', short: 'Betrieb', title: 'Ihr Betrieb', hint: 'Firma und Ansprechpartner für die Zusammenarbeit.' },
  { id: 'einsatz', short: 'Einsatzgebiet', title: 'Einsatzgebiet', hint: 'Wo Sie Aufträge übernehmen können.' },
  { id: 'leistungen', short: 'Leistungen', title: 'Leistungen und Qualifikation', hint: 'Was Ihr Betrieb anbietet.' },
  { id: 'nachweise', short: 'Nachweise', title: 'Nachweise', hint: 'Freiwillig. Sie können Nachweise auch später einreichen.' },
  { id: 'pruefen', short: 'Absenden', title: 'Angaben prüfen und absenden', hint: 'Bitte kontrollieren Sie Ihre Angaben.' },
];

const LEISTUNGEN = [
  { id: 'autoschluessel', label: 'Autoschlüssel', description: 'Nachmachen, programmieren, anlernen.' },
  { id: 'schliesstechnik', label: 'Schließtechnik', description: 'Zylinder, Schlösser, Schließanlagen.' },
  { id: 'tueroeffnung', label: 'Türöffnung', description: 'Öffnung von Wohnungs-, Haus- und Fahrzeugtüren.' },
  { id: 'zutritt', label: 'Zutritt', description: 'Elektronische Zutrittslösungen.' },
  { id: 'sicherheitstechnik', label: 'Sicherheitstechnik', description: 'Einbruchschutz, Alarm- und Videotechnik.' },
] as const;

interface PartnerDaten {
  firma: string;
  anrede: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  plz: string;
  ort: string;
  radius: string;
  mobil: '' | 'ja' | 'nein';
  leistungen: string[];
  systeme: string;
  qualifikationen: string;
}

const LEER: PartnerDaten = {
  firma: '',
  anrede: '',
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  plz: '',
  ort: '',
  radius: '',
  mobil: '',
  leistungen: [],
  systeme: '',
  qualifikationen: '',
};

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_RADIUS_KM = 1000;

function radiusKm(wert: string): number | null {
  const zahl = Number(wert.trim());
  return Number.isInteger(zahl) && zahl >= 1 && zahl <= MAX_RADIUS_KM ? zahl : null;
}

export function PartnerFormular() {
  const [nachweise, setNachweise] = useState<PickedFile[]>([]);
  const [einwilligung, setEinwilligung] = useState(false);
  const [senden, setSenden] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [erfolg, setErfolg] = useState<{ reference: string; notices: string[] } | null>(null);

  const schutz = useFormularSchutz();

  const flow = useFlow<PartnerDaten>({
    id: FLOW_ID,
    steps: STEPS,
    initial: LEER,
    version: 1,
    validate: (data, stepId) => {
      switch (stepId) {
        case 'betrieb':
          return (
            data.firma.trim().length > 1
            && data.vorname.trim().length > 0
            && data.nachname.trim().length > 0
            && EMAIL_MUSTER.test(data.email.trim())
            && data.telefon.replace(/\D/g, '').length >= 6
          );
        case 'einsatz':
          return data.plz.trim().length >= 4 && data.ort.trim().length > 1 && radiusKm(data.radius) !== null && data.mobil !== '';
        case 'leistungen':
          return data.leistungen.length > 0;
        default:
          return true;
      }
    },
    onReset: () => {
      setNachweise([]);
      setEinwilligung(false);
    },
  });

  const { data } = flow;
  // Die Einwilligung gehört nicht in den gespeicherten Zwischenstand: Sie wird beim Absenden erteilt.
  const shellFlow = { ...flow, canContinue: flow.canContinue && (flow.step?.id !== 'pruefen' || einwilligung) };

  const leistungsNamen = LEISTUNGEN.filter((l) => data.leistungen.includes(l.id)).map((l) => l.label);
  const radius = radiusKm(data.radius);

  const zusammenfassung: SummarySection[] = [
    {
      title: 'Betrieb',
      rows: [
        { label: 'Firma', value: data.firma.trim() || '—' },
        { label: 'Ansprechpartner', value: [data.anrede, data.vorname.trim(), data.nachname.trim()].filter(Boolean).join(' ') || '—' },
        { label: 'E-Mail', value: data.email.trim() || '—' },
        { label: 'Telefon', value: data.telefon.trim() || '—' },
      ],
    },
    {
      title: 'Einsatzgebiet',
      rows: [
        { label: 'PLZ und Ort', value: [data.plz.trim(), data.ort.trim()].filter(Boolean).join(' ') || '—' },
        { label: 'Einsatzradius', value: radius ? `${radius} km` : '—' },
        { label: 'Mobile Einsätze', value: data.mobil === 'ja' ? 'ja' : data.mobil === 'nein' ? 'nein' : '—' },
      ],
    },
    {
      title: 'Leistungen und Qualifikation',
      rows: [
        { label: 'Leistungen', value: leistungsNamen.join(', ') || '—' },
        { label: 'Autohersteller und Systeme', value: data.systeme.trim() || 'keine Angabe' },
        { label: 'Qualifikationen', value: data.qualifikationen.trim() || 'keine Angabe' },
        { label: 'Nachweise', value: nachweise.length > 0 ? nachweise.map((f) => f.name).join(', ') : 'keine beigefügt' },
      ],
    },
  ];

  async function absenden() {
    setSenden(true);
    setFehler(null);
    // Laufende Uploads abschließen, damit ihre Kennungen mitgehen.
    await uploadsAbwarten();
    const jetzt = new Date().toISOString();

    try {
      const ergebnis = await submitRecord({
        schutz: await schutz.daten(),
        kind: 'partner',
        area: 'service-und-termin',
        process: 'gefuehrte-anfrage',
        contact: {
          salutation: data.anrede || undefined,
          firstName: data.vorname.trim(),
          lastName: data.nachname.trim(),
          company: data.firma.trim(),
          email: data.email.trim(),
          phone: data.telefon.trim(),
          postalCode: data.plz.trim(),
          city: data.ort.trim(),
          country: 'Deutschland',
        },
        payload: {
          firma: data.firma.trim(),
          plz: data.plz.trim(),
          ort: data.ort.trim(),
          einsatzradiusKm: radius,
          mobileEinsaetze: data.mobil === 'ja',
          leistungen: data.leistungen,
          systeme: data.systeme.trim() || null,
          qualifikationen: data.qualifikationen.trim() || null,
          nachweisAnzahl: nachweise.length,
          datenschutz: einwilligung,
          datenschutzAm: jetzt,
        },
        summary: [
          ...zusammenfassung,
          { title: 'Datenschutz', rows: [{ label: 'Datenschutzhinweise', value: 'zur Kenntnis genommen, Einwilligung erteilt' }] },
        ],
        uploads: nachweise.map((f) => alsUpload(f, 'dokument')),
      });
      schutz.antwortBeachten(ergebnis);

      if (!ergebnis.ok) {
        setFehler(ergebnis.error ?? 'Ihre Bewerbung konnte nicht gespeichert werden.');
        return;
      }

      clearFlow(FLOW_ID);
      setErfolg({ reference: ergebnis.reference ?? '', notices: ergebnis.notices });
      // Messung (Strang S4 hört darauf): Partneranmeldung abgesendet.
      window.dispatchEvent(new CustomEvent('sm24:aktion', { detail: { aktion: 'partneranmeldung' } }));
      window.scrollTo({ top: 0, behavior: scrollVerhalten() });
    } catch {
      setFehler('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es noch einmal.');
    } finally {
      setSenden(false);
    }
  }

  if (erfolg) {
    return (
      <div className="max-w-2xl" role="status">
        <div className="rounded-lg border border-border bg-surface p-6">
          <CheckDraw title="Bewerbung eingegangen" size={56} />
          <h2 className="mt-4 text-title font-semibold text-foreground">Ihre Bewerbung ist bei uns</h2>
          <p className="mt-2 text-body text-foreground-muted">
            Vielen Dank. Wir prüfen Ihre Angaben und melden uns bei Ihnen. Eine Zusammenarbeit
            beginnt erst nach dieser Prüfung und mit einem Partnervertrag.
          </p>
          <p className="mt-5 font-mono text-caption uppercase tracking-label text-foreground-muted">Ihre Vorgangsnummer</p>
          <p className="mt-1 break-words font-mono text-title-sm font-semibold tabular-nums text-foreground">{erfolg.reference}</p>
          <p className="mt-2 text-small text-foreground-muted">
            Bitte nennen Sie diese Nummer, wenn Sie sich bei uns melden.
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
          <ButtonLink href="/service-und-termin/kontakt" variant="outline">
            Kontakt
          </ButtonLink>
        </div>
      </div>
    );
  }

  const gesperrt: Record<string, string> = {
    betrieb: 'Bitte füllen Sie Firma, Vor- und Nachname, E-Mail und Telefon aus.',
    einsatz: 'Bitte geben Sie PLZ, Ort, Einsatzradius in Kilometern und mobile Einsätze an.',
    leistungen: 'Bitte wählen Sie mindestens eine Leistung aus.',
    pruefen: 'Bitte bestätigen Sie die Datenschutzhinweise.',
  };

  return (
    <div className="max-w-3xl">
      <FlowShell
        schutz={schutz}
        flow={shellFlow}
        title="Bewerbung als Partnerbetrieb"
        submitLabel="Bewerbung absenden"
        onSubmit={absenden}
        submitting={senden}
        blockedHint={gesperrt[flow.step?.id ?? '']}
      >
        {flow.step?.id === 'betrieb' && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Firmenname" required className="sm:col-span-2">
              {({ id, invalid }) => (
                <TextInput id={id} invalid={invalid} autoComplete="organization" value={data.firma} onChange={(e) => flow.set('firma', e.target.value)} />
              )}
            </Field>

            <Field label="Anrede">
              {({ id }) => (
                <Select id={id} value={data.anrede} onChange={(e) => flow.set('anrede', e.target.value)}>
                  <option value="">keine Angabe</option>
                  <option value="Frau">Frau</option>
                  <option value="Herr">Herr</option>
                </Select>
              )}
            </Field>
            <div aria-hidden className="hidden sm:block" />

            <Field label="Vorname (Ansprechpartner)" required>
              {({ id, invalid }) => (
                <TextInput id={id} invalid={invalid} autoComplete="given-name" value={data.vorname} onChange={(e) => flow.set('vorname', e.target.value)} />
              )}
            </Field>
            <Field label="Nachname (Ansprechpartner)" required>
              {({ id, invalid }) => (
                <TextInput id={id} invalid={invalid} autoComplete="family-name" value={data.nachname} onChange={(e) => flow.set('nachname', e.target.value)} />
              )}
            </Field>

            <Field label="E-Mail-Adresse" required hint="Hierüber erhalten Sie unsere Rückmeldung.">
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => flow.set('email', e.target.value)}
                />
              )}
            </Field>
            <Field label="Telefon" required hint="Für Rückfragen zur Bewerbung.">
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={data.telefon}
                  onChange={(e) => flow.set('telefon', e.target.value)}
                />
              )}
            </Field>
          </div>
        )}

        {flow.step?.id === 'einsatz' && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-12">
              <Field label="Postleitzahl" required className="sm:col-span-4">
                {({ id, invalid }) => (
                  <TextInput id={id} invalid={invalid} inputMode="numeric" autoComplete="postal-code" value={data.plz} onChange={(e) => flow.set('plz', e.target.value)} />
                )}
              </Field>
              <Field label="Ort" required className="sm:col-span-8">
                {({ id, invalid }) => (
                  <TextInput id={id} invalid={invalid} autoComplete="address-level2" value={data.ort} onChange={(e) => flow.set('ort', e.target.value)} />
                )}
              </Field>
              <Field
                label="Einsatzradius in Kilometern"
                required
                hint="Wie weit fahren Sie für einen Auftrag, gemessen vom Betriebssitz?"
                className="sm:col-span-6"
                error={data.radius.trim() !== '' && radiusKm(data.radius) === null ? `Bitte eine ganze Zahl zwischen 1 und ${MAX_RADIUS_KM}.` : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    inputMode="numeric"
                    value={data.radius}
                    onChange={(e) => flow.set('radius', e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                  />
                )}
              </Field>
            </div>

            <fieldset>
              <legend className="mb-3 text-small font-semibold text-foreground">Mobile Einsätze beim Kunden?</legend>
              <div className="space-y-3">
                <OptionCard
                  name="mobil"
                  value="ja"
                  checked={data.mobil === 'ja'}
                  onSelect={() => flow.set('mobil', 'ja')}
                  title="Ja"
                  description="Wir arbeiten auch vor Ort beim Kunden oder am Fahrzeug."
                />
                <OptionCard
                  name="mobil"
                  value="nein"
                  checked={data.mobil === 'nein'}
                  onSelect={() => flow.set('mobil', 'nein')}
                  title="Nein"
                  description="Aufträge nur in unserer Werkstatt oder unserem Geschäft."
                />
              </div>
            </fieldset>
          </div>
        )}

        {flow.step?.id === 'leistungen' && (
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-small font-semibold text-foreground">
                Leistungen <span className="font-normal text-foreground-muted">(Mehrfachauswahl)</span>
              </legend>
              <div className="space-y-3">
                {LEISTUNGEN.map((leistung) => (
                  <OptionCard
                    key={leistung.id}
                    name="leistungen"
                    value={leistung.id}
                    multiple
                    checked={data.leistungen.includes(leistung.id)}
                    onSelect={(wert) =>
                      flow.set(
                        'leistungen',
                        data.leistungen.includes(wert) ? data.leistungen.filter((l) => l !== wert) : [...data.leistungen, wert],
                      )
                    }
                    title={leistung.label}
                    description={leistung.description}
                  />
                ))}
              </div>
            </fieldset>

            <Field
              label="Autohersteller und Systeme"
              hint="Freiwillig. Zum Beispiel Marken, die Sie programmieren, und eingesetzte Geräte oder Schließsysteme."
            >
              {({ id, describedBy }) => (
                <TextArea id={id} aria-describedby={describedBy} rows={4} value={data.systeme} onChange={(e) => flow.set('systeme', e.target.value)} />
              )}
            </Field>

            <Field
              label="Qualifikationen"
              hint="Freiwillig. Zum Beispiel Ausbildung, Meisterbrief, Herstellerschulungen, Jahre im Betrieb."
            >
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  rows={4}
                  value={data.qualifikationen}
                  onChange={(e) => flow.set('qualifikationen', e.target.value)}
                />
              )}
            </Field>
          </div>
        )}

        {flow.step?.id === 'nachweise' && (
          <PhotoUpload
            category="dokument"
            id="partner-nachweise"
            label="Nachweise (freiwillig)"
            description="Zum Beispiel Gewerbeanmeldung, Handwerkskarte oder Zertifikate. Als Foto oder PDF, höchstens fünf Dateien."
            example={{ motif: 'Beispiel: Gewerbeanmeldung oder Zertifikat, vollständig und gut lesbar', ratio: '4/3' }}
            files={nachweise}
            onChange={setNachweise}
            multiple
            maxFiles={5}
            allowDocuments
            kamera="ruhig"
          />
        )}

        {flow.step?.id === 'pruefen' && (
          <div className="space-y-6">
            <SummaryList sections={zusammenfassung} />

            <Alert tone="info">
              Mit der Bewerbung entsteht noch keine Zusammenarbeit und keine Verpflichtung. Vor einer
              Freischaltung prüfen wir Gewerbe, fachliche Eignung und Zuverlässigkeit; Grundlage der
              Zusammenarbeit ist ein Partnervertrag.
            </Alert>

            <label className="flex min-h-touch cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4">
              <input
                type="checkbox"
                checked={einwilligung}
                onChange={(event) => setEinwilligung(event.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-primary"
              />
              <span className="text-small leading-relaxed text-foreground">
                Ich bin einverstanden, dass SCHLÜSSELMACHER24 meine Angaben und Nachweise zur Prüfung
                dieser Bewerbung und zur Anbahnung einer Zusammenarbeit verarbeitet. Die{' '}
                <Link href="/rechtliches/datenschutz" className="font-semibold text-primary hover:underline">
                  Datenschutzhinweise
                </Link>{' '}
                habe ich zur Kenntnis genommen.
              </span>
            </label>

            {fehler && (
              <Alert tone="warning" title="Das hat nicht geklappt" role="alert">
                {fehler}
              </Alert>
            )}
          </div>
        )}
      </FlowShell>
    </div>
  );
}
