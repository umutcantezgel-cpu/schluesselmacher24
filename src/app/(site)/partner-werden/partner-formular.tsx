'use client';

import { useState } from 'react';
import Link from 'next/link';

import { submitRecord } from '@/lib/actions/records';
import {
  GERAETE_ARTEN,
  MAX_ERFAHRUNG_JAHRE,
  MAX_GERAETE,
  MAX_RADIUS_KM,
  emailGueltig,
  geraetText,
  jahreAusEingabe,
  plzGueltig,
  plzListeGueltig,
  radiusAusEingabe,
  telefonGueltig,
  type GeraeteArt,
} from '@/lib/partner/bewerbungsformular';
import { NUR_FAHRZEUGSCHLUESSEL } from '@/lib/partner/gewinnung';
import { PARTNER_LEISTUNGEN_LISTE } from '@/lib/partner/leistungen';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import type { SummarySection } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FlowShell } from '@/components/flow/flow-shell';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { Field } from '@/components/forms/field';
import { AbsendeFehler, HilfeBlock } from '@/components/forms/hilfe';
import type { HilfeKontakt } from '@/components/forms/hilfe-daten';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import { Select, TextArea, TextInput } from '@/components/forms/controls';
import { SummaryList } from '@/components/layout/summary-list';
import { WegBestaetigung } from '@/components/weg/bestaetigung';
import { SCHRITTE_NACH_ART } from '@/lib/wege/naechste-schritte-listen';

/* Bewerbung über „Partner werden“ (Erg. Leitfaden §7, FA-PLATTFORM-01): ohne Partnerportal.
 * Gespeichert wird ein Vorgang der Art „partner“; das Team prüft im Backend. Das Netz betrifft nur
 * Autoschlüssel und Fahrzeugschlüssel; die neun Leistungen kommen aus lib/partner/leistungen. Der
 * Server prüft jedes Pflichtfeld noch einmal (bewerbungPruefen). */

const FLOW_ID = 'partner-bewerbung';

const STEPS: FlowStep[] = [
  { id: 'betrieb', short: 'Betrieb', title: 'Ihr Betrieb', hint: 'Firma und Ansprechpartner für die Zusammenarbeit.' },
  { id: 'einsatz', short: 'Region', title: 'Region und Einsatzgebiet', hint: 'Wo Ihr Betrieb sitzt und wo Sie Aufträge übernehmen.' },
  { id: 'leistungen', short: 'Leistungen', title: 'Leistungen', hint: 'Was Ihr Betrieb rund um Autoschlüssel anbietet.' },
  { id: 'ausstattung', short: 'Ausstattung', title: 'Werkstatt und Geräte', hint: 'Womit und wo Sie arbeiten.' },
  { id: 'erfahrung', short: 'Erfahrung', title: 'Erfahrung', hint: 'Wie lange Sie Autoschlüssel machen und welche Fahrzeuge Sie abdecken.' },
  { id: 'nachweise', short: 'Nachweise', title: 'Nachweise', hint: 'Freiwillig. Sie können Nachweise auch später einreichen.' },
  { id: 'pruefen', short: 'Absenden', title: 'Angaben prüfen und absenden', hint: 'Bitte kontrollieren Sie Ihre Angaben.' },
];

interface GeraetEingabe {
  art: '' | GeraeteArt;
  hersteller: string;
  typ: string;
}

interface PartnerDaten {
  firma: string;
  anrede: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  plz: string;
  ort: string;
  einsatzPlz: string;
  radius: string;
  mobil: '' | 'ja' | 'nein';
  werkstatt: '' | 'ja' | 'nein';
  werkstattAnschrift: string;
  leistungen: string[];
  geraete: GeraetEingabe[];
  jahre: string;
  schwerpunkte: string;
  fahrzeugabdeckung: string;
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
  einsatzPlz: '',
  radius: '',
  mobil: '',
  werkstatt: '',
  werkstattAnschrift: '',
  leistungen: [],
  geraete: [],
  jahre: '',
  schwerpunkte: '',
  fahrzeugabdeckung: '',
  qualifikationen: '',
};

/** Was im Schritt noch fehlt; leer heißt: weiter. Dieselben Regeln prüft der Server (bewerbungPruefen). */
function schrittFehler(data: PartnerDaten, stepId: string | undefined): string | null {
  switch (stepId) {
    case 'betrieb':
      return data.firma.trim().length > 1
        && data.vorname.trim().length > 0
        && data.nachname.trim().length > 0
        && emailGueltig(data.email)
        && telefonGueltig(data.telefon)
        ? null
        : 'Bitte füllen Sie Firma, Vor- und Nachname, E-Mail und Telefon aus.';
    case 'einsatz': {
      if (!plzGueltig(data.plz) || data.ort.trim().length < 2) return 'Bitte geben Sie Postleitzahl (fünf Ziffern) und Ort des Betriebs an.';
      if (data.mobil === '') return 'Bitte geben Sie an, ob Sie mobil beim Kunden arbeiten.';
      if (data.einsatzPlz.trim() && !plzListeGueltig(data.einsatzPlz)) return 'Bitte Postleitzahlen mit fünf Ziffern oder Muster wie 355* eintragen.';
      if (data.radius.trim() && radiusAusEingabe(data.radius) === null) return `Bitte einen Radius von 1 bis ${MAX_RADIUS_KM} Kilometern eintragen.`;
      if (data.mobil === 'ja' && radiusAusEingabe(data.radius) === null) return 'Bitte geben Sie den mobilen Radius in Kilometern an.';
      if (radiusAusEingabe(data.radius) === null && !data.einsatzPlz.trim()) return 'Bitte nennen Sie einen Umkreis in Kilometern oder Postleitzahlen.';
      return null;
    }
    case 'leistungen':
      return data.leistungen.length > 0 ? null : 'Bitte wählen Sie mindestens eine Leistung aus.';
    case 'ausstattung':
      if (data.werkstatt === '') return 'Bitte geben Sie an, ob Sie eine feste Werkstatt haben.';
      if (data.werkstatt === 'ja' && data.werkstattAnschrift.trim().length < 5) return 'Bitte geben Sie die Anschrift der Werkstatt an.';
      if (data.werkstatt === 'nein' && data.mobil === 'nein') return 'Ohne feste Werkstatt braucht es mobile Einsätze. Bitte prüfen Sie Ihre Angabe unter Region.';
      if (data.geraete.some((g) => g.art === '')) return 'Bitte wählen Sie bei jedem Gerät die Art oder entfernen Sie die Zeile.';
      return null;
    case 'erfahrung':
      return jahreAusEingabe(data.jahre) === null ? `Bitte nennen Sie die Jahre als ganze Zahl von 0 bis ${MAX_ERFAHRUNG_JAHRE}.` : null;
    default:
      return null;
  }
}

export function PartnerFormular({ hilfe }: { hilfe?: HilfeKontakt }) {
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
    // Version 2 (FA-PLATTFORM-01): neue Felder; ein alter Zwischenstand mit früheren Leistungen gilt nicht mehr.
    version: 2,
    validate: (data, stepId) => schrittFehler(data, stepId) === null,
    onReset: () => {
      setNachweise([]);
      setEinwilligung(false);
    },
  });

  const { data } = flow;
  // Die Einwilligung gehört nicht in den gespeicherten Zwischenstand: Sie wird beim Absenden erteilt.
  const shellFlow = { ...flow, canContinue: flow.canContinue && (flow.step?.id !== 'pruefen' || einwilligung) };

  const leistungsNamen = PARTNER_LEISTUNGEN_LISTE.filter((l) => data.leistungen.includes(l.value)).map((l) => l.label);
  const radius = radiusAusEingabe(data.radius);
  const geraete = data.geraete.filter((g): g is GeraetEingabe & { art: GeraeteArt } => g.art !== '');

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
      title: 'Region und Einsatz',
      rows: [
        { label: 'PLZ und Ort', value: [data.plz.trim(), data.ort.trim()].filter(Boolean).join(' ') || '—' },
        { label: 'Einsatzgebiet (Postleitzahlen)', value: data.einsatzPlz.trim() || 'keine Angabe' },
        { label: 'Einsatzradius', value: radius ? `${radius} km` : 'keine Angabe' },
        { label: 'Mobile Einsätze', value: data.mobil === 'ja' ? 'ja' : data.mobil === 'nein' ? 'nein' : '—' },
        {
          label: 'Feste Werkstatt',
          value: data.werkstatt === 'ja' ? `ja, ${data.werkstattAnschrift.trim()}` : data.werkstatt === 'nein' ? 'nein' : '—',
        },
      ],
    },
    {
      title: 'Leistungen und Ausstattung',
      rows: [
        { label: 'Leistungen', value: leistungsNamen.join(', ') || '—' },
        { label: 'Geräte', value: geraete.length ? geraete.map((g) => geraetText({ art: g.art, hersteller: g.hersteller.trim(), typ: g.typ.trim() })).join('; ') : 'keine Angabe' },
      ],
    },
    {
      title: 'Erfahrung',
      rows: [
        { label: 'Jahre mit Autoschlüsseln', value: data.jahre.trim() || '—' },
        { label: 'Schwerpunkte', value: data.schwerpunkte.trim() || 'keine Angabe' },
        { label: 'Fahrzeugabdeckung', value: data.fahrzeugabdeckung.trim() || 'keine Angabe' },
        { label: 'Qualifikationen', value: data.qualifikationen.trim() || 'keine Angabe' },
        { label: 'Nachweise', value: nachweise.length > 0 ? nachweise.map((f) => f.name).join(', ') : 'keine beigefügt' },
      ],
    },
  ];

  function geraetSetzen(index: number, teil: Partial<GeraetEingabe>) {
    flow.set('geraete', data.geraete.map((g, i) => (i === index ? { ...g, ...teil } : g)));
  }

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
          einsatzPostleitzahlen: data.einsatzPlz.trim() || null,
          einsatzradiusKm: radius,
          mobileEinsaetze: data.mobil === 'ja',
          werkstatt: { vorhanden: data.werkstatt === 'ja', anschrift: data.werkstatt === 'ja' ? data.werkstattAnschrift.trim() : null },
          leistungen: data.leistungen,
          geraete: geraete.map((g) => ({ art: g.art, hersteller: g.hersteller.trim() || null, typ: g.typ.trim() || null })),
          erfahrung: {
            jahre: jahreAusEingabe(data.jahre),
            schwerpunkte: data.schwerpunkte.trim() || null,
            fahrzeugabdeckung: data.fahrzeugabdeckung.trim() || null,
          },
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
    } catch {
      setFehler('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es noch einmal.');
    } finally {
      setSenden(false);
    }
  }

  if (erfolg) {
    return (
      <WegBestaetigung
        marke="Bewerbung eingegangen"
        titel="Ihre Bewerbung ist bei uns"
        text="Vielen Dank. Wir prüfen Ihre Angaben und melden uns bei Ihnen."
        reference={erfolg.reference}
        notices={erfolg.notices}
        schritte={SCHRITTE_NACH_ART.partner}
        summary={zusammenfassung}
        zurueck={{ href: '/', label: 'Zur Startseite' }}
      />
    );
  }

  const gesperrt: Record<string, string> = { pruefen: 'Bitte bestätigen Sie die Datenschutzhinweise.' };
  const hinweis = schrittFehler(data, flow.step?.id) ?? gesperrt[flow.step?.id ?? ''];

  return (
    <div className="max-w-3xl">
      <FlowShell
        schutz={schutz}
        flow={shellFlow}
        title="Bewerbung als Partnerbetrieb"
        submitLabel="Bewerbung absenden"
        onSubmit={absenden}
        submitting={senden}
        blockedHint={hinweis}
        ungesichert={nachweise.length > 0}
        mitDateien
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
              <Field
                label="Postleitzahl des Betriebs"
                required
                className="sm:col-span-4"
                error={data.plz.trim().length >= 5 && !plzGueltig(data.plz) ? 'Bitte fünf Ziffern.' : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={data.plz}
                    onChange={(e) => flow.set('plz', e.target.value.replace(/[^\d]/g, '').slice(0, 5))}
                  />
                )}
              </Field>
              <Field label="Ort des Betriebs" required className="sm:col-span-8">
                {({ id, invalid }) => (
                  <TextInput id={id} invalid={invalid} autoComplete="address-level2" value={data.ort} onChange={(e) => flow.set('ort', e.target.value)} />
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

            <div className="grid gap-5 sm:grid-cols-12">
              <Field
                label="Einsatzradius in Kilometern"
                required={data.mobil === 'ja'}
                hint={
                  data.mobil === 'ja'
                    ? 'Wie weit fahren Sie für einen Auftrag, gemessen vom Betriebssitz?'
                    : 'Aus welchem Umkreis nehmen Sie Aufträge an? Oder nennen Sie unten Postleitzahlen.'
                }
                className="sm:col-span-6"
                error={data.radius.trim() !== '' && radius === null ? `Bitte eine ganze Zahl zwischen 1 und ${MAX_RADIUS_KM}.` : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    inputMode="numeric"
                    value={data.radius}
                    onChange={(e) => flow.set('radius', e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
                  />
                )}
              </Field>
              <Field
                label="Einsatzgebiet als Postleitzahlen"
                hint="Freiwillig, wenn Sie einen Umkreis nennen. Kommagetrennt, auch Bereiche wie 355*."
                className="sm:col-span-12"
                error={data.einsatzPlz.trim() && !plzListeGueltig(data.einsatzPlz) ? 'Bitte fünf Ziffern oder Muster wie 355*.' : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} value={data.einsatzPlz} onChange={(e) => flow.set('einsatzPlz', e.target.value)} />
                )}
              </Field>
            </div>
          </div>
        )}

        {flow.step?.id === 'leistungen' && (
          <div className="space-y-6">
            <Alert tone="info" title={NUR_FAHRZEUGSCHLUESSEL.titel}>
              {NUR_FAHRZEUGSCHLUESSEL.text}
            </Alert>

            <fieldset>
              <legend className="mb-3 text-small font-semibold text-foreground">
                Leistungen <span className="font-normal text-foreground-muted">(Mehrfachauswahl)</span>
              </legend>
              <div className="space-y-3">
                {PARTNER_LEISTUNGEN_LISTE.map((leistung) => (
                  <OptionCard
                    key={leistung.value}
                    name="leistungen"
                    value={leistung.value}
                    multiple
                    checked={data.leistungen.includes(leistung.value)}
                    onSelect={(wert) =>
                      flow.set(
                        'leistungen',
                        data.leistungen.includes(wert) ? data.leistungen.filter((l) => l !== wert) : [...data.leistungen, wert],
                      )
                    }
                    title={leistung.label}
                    description={leistung.beschreibung}
                  />
                ))}
              </div>
            </fieldset>

            {/* Keine Sackgasse, wenn die eigene Leistung fehlt (FA-QA-02). */}
            <HilfeBlock
              hilfe={hilfe}
              stelle="leistungen"
              titel="Ihre Leistung ist nicht dabei?"
              satz="Das Netz betrifft nur Autoschlüssel und Fahrzeugschlüssel. Fehlt eine Leistung rund um Fahrzeugschlüssel, beschreiben Sie sie unter „Erfahrung“ oder rufen Sie uns an."
            />
          </div>
        )}

        {flow.step?.id === 'ausstattung' && (
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-small font-semibold text-foreground">Haben Sie eine feste Werkstatt?</legend>
              <div className="space-y-3">
                <OptionCard
                  name="werkstatt"
                  value="ja"
                  checked={data.werkstatt === 'ja'}
                  onSelect={() => flow.set('werkstatt', 'ja')}
                  title="Ja"
                  description="Kunden können zu uns kommen."
                />
                <OptionCard
                  name="werkstatt"
                  value="nein"
                  checked={data.werkstatt === 'nein'}
                  onSelect={() => flow.set('werkstatt', 'nein')}
                  title="Nein"
                  description="Wir arbeiten nur mobil beim Kunden."
                />
              </div>
            </fieldset>

            {data.werkstatt === 'ja' && (
              <Field label="Anschrift der Werkstatt" required hint="Straße und Hausnummer, bei Abweichung vom Betriebssitz auch Postleitzahl und Ort.">
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    autoComplete="street-address"
                    value={data.werkstattAnschrift}
                    onChange={(e) => flow.set('werkstattAnschrift', e.target.value)}
                  />
                )}
              </Field>
            )}

            <fieldset className="space-y-4">
              <legend className="mb-1 text-small font-semibold text-foreground">
                Geräte <span className="font-normal text-foreground-muted">(freiwillig, hilft bei der Prüfung)</span>
              </legend>
              <p className="text-small leading-snug text-foreground-subtle">
                Schlüsselfräsmaschinen, Programmiergeräte und Diagnosegeräte, je mit Hersteller und Typ.
              </p>
              {data.geraete.map((geraet, index) => (
                <div key={index} className="grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-12">
                  <Field label={`Gerät ${index + 1}: Art`} required className="sm:col-span-4">
                    {({ id, invalid }) => (
                      <Select id={id} invalid={invalid} value={geraet.art} onChange={(e) => geraetSetzen(index, { art: e.target.value as GeraeteArt | '' })}>
                        <option value="">bitte wählen</option>
                        {GERAETE_ARTEN.map((a) => (
                          <option key={a.value} value={a.value}>
                            {a.label}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <Field label={`Gerät ${index + 1}: Hersteller`} className="sm:col-span-4">
                    {({ id }) => <TextInput id={id} value={geraet.hersteller} onChange={(e) => geraetSetzen(index, { hersteller: e.target.value })} />}
                  </Field>
                  <Field label={`Gerät ${index + 1}: Typ`} className="sm:col-span-4">
                    {({ id }) => <TextInput id={id} value={geraet.typ} onChange={(e) => geraetSetzen(index, { typ: e.target.value })} />}
                  </Field>
                  <div className="sm:col-span-12">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => flow.set('geraete', data.geraete.filter((_, i) => i !== index))}
                    >
                      Gerät {index + 1} entfernen
                    </Button>
                  </div>
                </div>
              ))}
              {data.geraete.length < MAX_GERAETE && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => flow.set('geraete', [...data.geraete, { art: '', hersteller: '', typ: '' }])}
                >
                  Gerät hinzufügen
                </Button>
              )}
            </fieldset>
          </div>
        )}

        {flow.step?.id === 'erfahrung' && (
          <div className="space-y-6">
            <Field
              label="Jahre Erfahrung mit Autoschlüsseln"
              required
              className="max-w-xs"
              error={data.jahre.trim() !== '' && jahreAusEingabe(data.jahre) === null ? `Bitte eine ganze Zahl von 0 bis ${MAX_ERFAHRUNG_JAHRE}.` : undefined}
            >
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  inputMode="numeric"
                  value={data.jahre}
                  onChange={(e) => flow.set('jahre', e.target.value.replace(/[^\d]/g, '').slice(0, 2))}
                />
              )}
            </Field>

            <Field label="Schwerpunkte" hint="Freiwillig. Zum Beispiel Zweitschlüssel, Verlust, Keyless, Reparaturen.">
              {({ id, describedBy }) => (
                <TextArea id={id} aria-describedby={describedBy} rows={3} value={data.schwerpunkte} onChange={(e) => flow.set('schwerpunkte', e.target.value)} />
              )}
            </Field>

            <Field label="Fahrzeugabdeckung" hint="Freiwillig. Marken und Baujahre, die Sie abdecken, auch Motorräder oder Nutzfahrzeuge.">
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  rows={3}
                  value={data.fahrzeugabdeckung}
                  onChange={(e) => flow.set('fahrzeugabdeckung', e.target.value)}
                />
              )}
            </Field>

            <Field label="Qualifikationen" hint="Freiwillig. Zum Beispiel Ausbildung, Meisterbrief, Herstellerschulungen.">
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  rows={3}
                  value={data.qualifikationen}
                  onChange={(e) => flow.set('qualifikationen', e.target.value)}
                />
              )}
            </Field>
          </div>
        )}

        {flow.step?.id === 'nachweise' && (
          <div className="space-y-8">
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
            <HilfeBlock hilfe={hilfe} stelle="nachweise" titel="Unsicher, welche Nachweise passen?" spaeter mitDateien />
          </div>
        )}

        {flow.step?.id === 'pruefen' && (
          <div className="space-y-6">
            <SummaryList sections={zusammenfassung} />

            <Alert tone="info">
              Mit der Bewerbung entsteht noch keine Zusammenarbeit und keine Verpflichtung. Vor einer
              Freischaltung prüfen wir Gewerbe, fachliche Eignung und Zuverlässigkeit; Grundlage der
              Zusammenarbeit ist ein Partnervertrag. Den Vertrag und die Partner-AGB erhalten Sie vor
              Vertragsschluss zur Prüfung.
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

            {fehler && <AbsendeFehler fehler={fehler} hilfe={hilfe} titel="Das hat nicht geklappt" className="" />}
          </div>
        )}
      </FlowShell>
    </div>
  );
}
