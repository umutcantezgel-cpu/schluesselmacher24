'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { submitRecord } from '@/lib/actions/records';
import type { AreaKey, SummarySection } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { FlowShell } from '@/components/flow/flow-shell';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { AnfrageHinweis } from '@/components/recht/anfrage-hinweis';
import { Field } from '@/components/forms/field';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import { QuantityInput, Select, TextArea, TextInput } from '@/components/forms/controls';
import { SummaryList } from '@/components/layout/summary-list';
import { WegBestaetigung } from '@/components/weg/bestaetigung';
import { naechsteSchritte, type NaechsterSchritt } from '@/lib/wege/naechste-schritte';
import {
  CODE_ANFRAGE_HOECHSTENS,
  CODE_ANFRAGE_LAENGE,
  CODE_ANFRAGE_QUELLE,
  CODE_ANFRAGE_THEMA,
  codeAnfrageAbschnitt,
  codeAnfragePruefen,
  codeAnfrageUploadKategorie,
  ohneCodeFelder,
} from '@/lib/wege/code-anfrage';

const STEPS: FlowStep[] = [
  { id: 'thema', short: 'Thema', title: 'Worum geht es?', hint: 'So landet Ihre Anfrage gleich bei der richtigen Person.' },
  { id: 'anliegen', short: 'Anliegen', title: 'Beschreiben Sie Ihr Anliegen', hint: 'Je konkreter Ihre Angaben, desto genauer unsere Einschätzung.' },
  { id: 'unterlagen', short: 'Unterlagen', title: 'Fotos oder Unterlagen', hint: 'Freiwillig. Ein Foto sagt oft mehr als eine Beschreibung.' },
  { id: 'kontakt', short: 'Kontakt', title: 'Ihre Kontaktdaten', hint: 'Wir melden uns per E-Mail oder telefonisch.' },
  { id: 'pruefen', short: 'Prüfen', title: 'Angaben prüfen und absenden', hint: 'Bitte kontrollieren Sie Ihre Angaben vor dem Absenden.' },
];

/**
 * Themen, bei denen ein Schlüssel nur über einen geführten Weg mit Unterlagen entsteht (FA-KERN-02B): Hier
 * bleibt nur die reine Frage; wer einen Schlüssel möchte, kommt in den passenden Weg.
 */
const SCHLUESSEL_THEMEN = new Set(['autoschluessel', 'schluessel-nach-vorlage']);

/** Geführte Wege mit Unterlagen je Thema, statt einer Schlüsselanfrage ohne Unterlagen. */
const GEFUEHRTE_WEGE: Record<string, Array<{ href: string; titel: string; satz: string }>> = {
  autoschluessel: [
    { href: '/autoschluessel/anfrage', titel: 'Autoschlüssel', satz: 'Fahrzeug wählen, Termin anfragen. Für viele Modelle sehen Sie den Preis sofort.' },
    { href: '/autoschluessel/fahrzeug-nicht-gefunden', titel: 'Auto nicht in der Liste', satz: 'Anfrage mit Fahrzeugschein und drei Fotos des Schlüssels.' },
    { href: '/motorradschluessel/anfrage', titel: 'Motorrad', satz: 'Anfrage mit Fahrzeugschein und drei Fotos des Schlüssels.' },
    { href: '/roller-und-kleinstfahrzeuge/anfrage', titel: 'Roller, Mofa oder Moped', satz: 'Mit Fahrzeugschein oder Versicherungskennzeichen.' },
    { href: '/e-scooter/anfrage', titel: 'E-Scooter', satz: 'Anfrage mit Nachweis und drei Fotos des Schlüssels.' },
    { href: '/seniorenmobile/anfrage', titel: 'Seniorenmobil', satz: 'Anfrage mit Nachweis und drei Fotos des Schlüssels.' },
    { href: '/fahrradschluessel/anfrage', titel: 'Fahrradschloss', satz: 'Mit Hersteller und Schlüsselnummer des Schlosses.' },
  ],
  'schluessel-nach-vorlage': [
    { href: '/schluessel-nach-vorlage/anfrage', titel: 'Schlüssel nach Vorlage', satz: 'Anfrage mit drei Fotos Ihres Schlüssels.' },
    { href: '/schluessel-einschicken', titel: 'Schlüssel einschicken', satz: 'Sie schicken uns den Schlüssel, wir fertigen die Kopie.' },
  ],
};

interface FormData {
  thema: string;
  /** Bei Autoschlüssel und Schlüssel nach Vorlage: reine Frage oder Wunsch nach einem Schlüssel. */
  anliegenArt: '' | 'frage' | 'schluessel';
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
  /** Code anfragen (Thema „schluessel-nach-code“): Hersteller oder Schloss, Code, Stückzahl, Berechtigung. */
  schloss: string;
  code: string;
  stueckzahl: number;
  berechtigt: boolean;
}

const LEER: FormData = {
  thema: '',
  anliegenArt: '',
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
  schloss: '',
  code: '',
  stueckzahl: 1,
  berechtigt: false,
};

const DRINGLICHKEIT = [
  { id: 'normal', label: 'Keine Eile', description: 'Wir melden uns im üblichen Rahmen.' },
  { id: 'zeitnah', label: 'Zeitnah', description: 'Es sollte in den nächsten Tagen vorangehen.' },
  { id: 'terminbindung', label: 'An einen Termin gebunden', description: 'Es gibt ein festes Datum, das eingehalten werden muss.' },
];

export function AllgemeineAnfrage({
  themen,
  vorauswahl,
  fahrzeug,
  codeVorbelegung,
  themaFest = false,
}: {
  themen: Array<{ key: AreaKey; label: string; summary: string }>;
  vorauswahl?: string;
  /** Fahrzeug aus der Suche im Autoschlüssel-Weg, das dort nicht gepflegt ist (G-15). */
  fahrzeug?: string;
  /** Code und Schloss aus der Adresse, etwa von einer Produktseite (nur Vorbelegung). */
  codeVorbelegung?: { code?: string; schloss?: string };
  /**
   * Die Seite wurde für die Code-Anfrage aufgerufen (`?thema=schluessel-nach-code`): Das Thema steht
   * fest, damit Seitenkopf und Formular dasselbe sagen. Wer etwas anderes möchte, wechselt zur
   * allgemeinen Anfrage.
   */
  themaFest?: boolean;
}) {
  const [dateien, setDateien] = useState<PickedFile[]>([]);
  // Code-Anfrage: freiwillig ein Foto der Sicherungskarte, als Nachweis bei geschützten Profilen (R13).
  const [karte, setKarte] = useState<PickedFile[]>([]);
  const [senden, setSenden] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [erfolg, setErfolg] = useState<{ reference: string; notices: string[]; summary: SummarySection[]; schritte: NaechsterSchritt[] } | null>(null);

  const schutz = useFormularSchutz();


  const flow = useFlow<FormData>({
    id: 'allgemeine-anfrage',
    steps: STEPS,
    initial: {
      ...LEER,
      thema: vorauswahl && themen.some((t) => t.key === vorauswahl) ? vorauswahl : '',
      objekt: fahrzeug ?? '',
      code: codeVorbelegung?.code ?? '',
      schloss: codeVorbelegung?.schloss ?? '',
    },
    validate: (data, stepId) => {
      // Autoschlüssel und Vorlage: Hier geht es nur mit einer Frage weiter; Schlüssel über den geführten Weg.
      if (stepId === 'thema') return data.thema !== '' && (!SCHLUESSEL_THEMEN.has(data.thema) || data.anliegenArt === 'frage');
      // Code anfragen: dieselbe Prüfung wie auf dem Server; die Beschreibung ist hier freiwillig.
      if (stepId === 'anliegen' && data.thema === CODE_ANFRAGE_THEMA) return codeAnfragePruefen({ ...data }) !== null;
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

  // Ein gespeicherter Stand aus der allgemeinen Anfrage darf das feste Thema nicht überschreiben.
  useEffect(() => {
    if (themaFest && data.thema !== CODE_ANFRAGE_THEMA) flow.set('thema', CODE_ANFRAGE_THEMA);
  }, [themaFest, data.thema, flow]);
  const thema = themen.find((t) => t.key === data.thema);
  const schluesselThema = SCHLUESSEL_THEMEN.has(data.thema);
  const codeAnfrage = data.thema === CODE_ANFRAGE_THEMA;
  // Dieselbe Kategorie am Upload-Feld und im Vorgang (Frist der gespeicherten Datei).
  const uploadKategorie = codeAnfrageUploadKategorie(data.thema);
  const karteMit = codeAnfrage ? karte : [];
  const anzahlUnterlagen = dateien.length + karteMit.length;

  const zusammenfassung: SummarySection[] = [
    // Der Server baut diesen Abschnitt nach seiner Prüfung neu (records.ts).
    ...(codeAnfrage ? [codeAnfrageAbschnitt(data)] : []),
    {
      title: 'Anliegen',
      rows: [
        { label: 'Bereich', value: thema?.label ?? '—' },
        {
          label: 'Zeitlicher Rahmen',
          value: DRINGLICHKEIT.find((d) => d.id === data.dringlichkeit)?.label ?? '—',
        },
        { label: 'Beschreibung', value: data.beschreibung || (codeAnfrage ? 'keine Angabe' : '—') },
        ...(schluesselThema ? [{ label: 'Art des Anliegens', value: 'Frage' }] : []),
        ...(codeAnfrage ? [] : [{ label: 'Objekt oder Fahrzeug', value: data.objekt || 'keine Angabe' }]),
        { label: 'Unterlagen', value: anzahlUnterlagen > 0 ? `${anzahlUnterlagen} Datei(en)` : 'keine' },
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

    const area = (data.thema || 'service-und-termin') as AreaKey;
    const ergebnis = await submitRecord({
      schutz: await schutz.daten(),
      kind: 'anfrage',
      area,
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
      // Andere Themen senden die Felder der Code-Anfrage nicht mit; danach wurde nicht gefragt.
      payload: codeAnfrage
        ? { ...data, quelle: CODE_ANFRAGE_QUELLE, dateien: [...dateien, ...karteMit].map((f) => f.name) }
        : { ...ohneCodeFelder({ ...data }), anliegenArt: schluesselThema ? 'frage' : undefined, dateien: dateien.map((f) => f.name) },
      summary: zusammenfassung,
      uploads: [
        ...dateien.map((f) => alsUpload(f, uploadKategorie)),
        ...karteMit.map((f) => alsUpload(f, 'sicherungskarte')),
      ],
    });
    schutz.antwortBeachten(ergebnis);

    setSenden(false);

    if (!ergebnis.ok) {
      setFehler(ergebnis.error ?? 'Ihre Anfrage konnte nicht gespeichert werden.');
      return;
    }

    clearFlow('allgemeine-anfrage');
    // Dieselben Schritte, die die Statusseite für diesen Vorgang zeigt (Thema gleich Bereich). Eine allgemeine
    // Anfrage zum Thema „Schlüssel nach Vorlage“ legt der Server unter „Service und Termin“ ab (FA-KERN-02):
    // Sie ist keine Foto-Anfrage, darum gelten die Schritte einer allgemeinen Anfrage.
    const ablage = area === 'schluessel-nach-vorlage' ? 'service-und-termin' : area;
    const schritte = naechsteSchritte({ kind: 'anfrage', area: ablage, process: 'gefuehrte-anfrage', payload: { thema: data.thema } });
    setErfolg({ reference: ergebnis.reference ?? '', notices: ergebnis.notices, summary: zusammenfassung, schritte });
  }

  if (erfolg) {
    return (
      <WegBestaetigung
        marke="Anfrage eingegangen"
        titel="Ihre Anfrage ist bei uns"
        text="Wir sehen uns Ihre Angaben an und melden uns mit einer Einschätzung."
        reference={erfolg.reference}
        notices={erfolg.notices}
        schritte={erfolg.schritte}
        summary={erfolg.summary}
        zurueck={{ href: '/', label: 'Zur Startseite' }}
        weitere={[{ href: '/ratgeber', label: 'Ratgeber lesen' }]}
      />
    );
  }

  return (
    <div className="max-w-3xl">
      <FlowShell
        schutz={schutz}
        abschlussHinweis={<AnfrageHinweis />}
        flow={flow}
        title={themaFest ? 'Code anfragen' : 'Allgemeine Anfrage'}
        submitLabel="Anfrage absenden"
        onSubmit={absenden}
        submitting={senden}
        blockedHint={
          flow.step?.id === 'thema' && schluesselThema && data.anliegenArt !== 'frage'
            ? 'Für einen Schlüssel nutzen Sie bitte einen der geführten Wege oben. Hier geht es mit einer Frage weiter.'
            : 'Bitte füllen Sie die Pflichtangaben dieses Schrittes aus.'
        }
      >
        {flow.step?.id === 'thema' && (
          <div className="space-y-3">
            {themen.filter((t) => !themaFest || t.key === CODE_ANFRAGE_THEMA).map((t) => (
              <OptionCard
                key={t.key}
                name="thema"
                value={t.key}
                checked={data.thema === t.key}
                onSelect={(value) => flow.update({ thema: value, anliegenArt: '' })}
                title={t.label}
                description={t.summary}
              />
            ))}

            {/* Schlüssel nur über einen geführten Weg mit Unterlagen (FA-KERN-02B, R13); eine Frage bleibt möglich. */}
            {schluesselThema && !themaFest && (
              <fieldset className="mt-6 space-y-3">
                <legend className="mb-1 text-body font-semibold text-foreground">Was möchten Sie?</legend>
                <OptionCard
                  name="anliegen-art"
                  value="schluessel"
                  checked={data.anliegenArt === 'schluessel'}
                  onSelect={() => flow.set('anliegenArt', 'schluessel')}
                  title="Ich möchte einen Schlüssel anfertigen lassen"
                  description="Dafür gibt es einen geführten Weg mit den nötigen Unterlagen."
                />
                <OptionCard
                  name="anliegen-art"
                  value="frage"
                  checked={data.anliegenArt === 'frage'}
                  onSelect={() => flow.set('anliegenArt', 'frage')}
                  title="Ich habe eine Frage oder ein anderes Anliegen"
                  description="Zum Beispiel eine Frage zu Ihrem Schlüssel oder eine Zusammenarbeit als Betrieb. Sie beschreiben es, wir melden uns."
                />
                {data.anliegenArt === 'schluessel' && (
                  <div className="rounded-lg border border-border bg-surface p-4" role="status">
                    <p className="text-body font-semibold text-foreground">Bitte wählen Sie den passenden Weg</p>
                    <p className="mt-1 text-small text-foreground-muted">
                      Einen Schlüssel fertigen wir nur mit Unterlagen. Die geführten Wege sagen Ihnen genau, was wir brauchen.
                    </p>
                    <ul className="mt-3 divide-y divide-border border-y border-border">
                      {(GEFUEHRTE_WEGE[data.thema] ?? []).map((weg) => (
                        <li key={weg.href}>
                          <Link href={weg.href} className="flex min-h-touch flex-col justify-center py-2 hover:text-primary">
                            <span className="text-body font-semibold text-primary">{weg.titel}</span>
                            <span className="text-small text-foreground-muted">{weg.satz}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </fieldset>
            )}

            {themaFest ? (
              <p className="mt-6 text-small text-foreground-muted">
                Geht es um etwas anderes?{' '}
                <Link href="/service-und-termin/anfrage" className="font-semibold text-primary hover:underline">
                  Zur allgemeinen Anfrage
                </Link>
              </p>
            ) : (
              <Alert tone="info" className="mt-6">
                Für Autoschlüssel und Schließanlagen gibt es eigene, deutlich schnellere Abläufe.
                Diese Anfrage ist für alles gedacht, was dort nicht hineinpasst. Einen Schlüsselcode
                fragen Sie hier unter „Schlüssel nach Code“ an.
              </Alert>
            )}
          </div>
        )}

        {flow.step?.id === 'anliegen' && codeAnfrage && (
          <div className="space-y-6">
            <Field
              label="Hersteller oder Schloss"
              required
              hint="Was auf dem Schloss oder Schlüssel steht, etwa Hersteller, Schlossart oder Möbelstück."
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  maxLength={CODE_ANFRAGE_LAENGE.schloss}
                  value={data.schloss}
                  onChange={(e) => flow.set('schloss', e.target.value)}
                />
              )}
            </Field>

            <Field
              label="Code wie aufgedruckt"
              required
              hint="Genau so, wie er auf Schloss, Schlüssel oder Karte steht, mit Buchstaben, Ziffern und Zeichen."
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  maxLength={CODE_ANFRAGE_LAENGE.code}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="font-mono tracking-wide"
                  value={data.code}
                  onChange={(e) => flow.set('code', e.target.value)}
                />
              )}
            </Field>

            <Field label="Stückzahl" required hint="Wie viele Schlüssel Sie brauchen.">
              {({ id }) => (
                <QuantityInput
                  id={id}
                  label="Stückzahl"
                  min={1}
                  max={CODE_ANFRAGE_HOECHSTENS}
                  value={data.stueckzahl}
                  onChange={(wert) => flow.set('stueckzahl', wert)}
                />
              )}
            </Field>

            <Field label="Was sollten wir noch wissen?" hint="Freiwillig. Zum Beispiel, wo der Code steht.">
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  rows={4}
                  value={data.beschreibung}
                  onChange={(e) => flow.set('beschreibung', e.target.value)}
                />
              )}
            </Field>

            {/* Berechtigung in jedem Schlüsselweg (R13); ohne Haken nimmt der Server die Anfrage nicht an. */}
            <OptionCard
              name="berechtigung"
              value="bestaetigt"
              multiple
              checked={data.berechtigt}
              onSelect={() => flow.set('berechtigt', !data.berechtigt)}
              title="Ich bin berechtigt, für dieses Schloss Schlüssel anfertigen zu lassen."
              description="Etwa als Eigentümer, als Mieter mit Erlaubnis oder im Auftrag. Bei geschützten Profilen fragen wir nach einem Nachweis, etwa der Sicherungskarte."
            />
          </div>
        )}

        {flow.step?.id === 'anliegen' && !codeAnfrage && (
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
              <legend className="mb-3 text-small font-semibold text-foreground">
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
          <div className="space-y-8">
            <PhotoUpload
              category={uploadKategorie}
              id="anfrage-dateien"
              label="Fotos oder Unterlagen"
              description={
                codeAnfrage
                  ? 'Freiwillig. Ein Foto von Schlüssel oder Schloss, auf dem der Code lesbar ist, hilft uns beim Abgleich.'
                  : schluesselThema
                  ? 'Freiwillig. Für eine Frage brauchen wir keine Unterlagen. Hilft ein Foto, Ihre Frage zu verstehen, legen Sie es gern bei.'
                  : 'Freiwillig. Fotos der betroffenen Tür, des Schlüssels oder vorhandene Unterlagen helfen uns sehr.'
              }
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
            {codeAnfrage && (
              <PhotoUpload
                category="sicherungskarte"
                id="anfrage-sicherungskarte"
                label="Foto Ihrer Sicherungskarte"
                description="Freiwillig. Gehört zu Ihrem Schloss eine Sicherungskarte, etwa bei einer Schließanlage, legen Sie hier ein Foto der ganzen Karte bei. Schlüssel mit geschütztem Profil fertigen wir nur gegen die Karte."
                example={{ motif: 'Beispielfoto: Sicherungskarte, ganz im Bild und gut lesbar', ratio: '3/2' }}
                files={karte}
                onChange={setKarte}
                multiple
                maxFiles={2}
              />
            )}
          </div>
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
              <Alert tone="warning" title="Das hat nicht geklappt" className="mt-4" role="alert">
                {fehler}
              </Alert>
            )}
          </div>
        )}
      </FlowShell>
    </div>
  );
}
