'use client';

import { useMemo, useState } from 'react';

import { FlowShell } from '@/components/flow/flow-shell';
import { QuantityInput, Select, TextArea, TextInput } from '@/components/forms/controls';
import { Field } from '@/components/forms/field';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import { SummaryList } from '@/components/layout/summary-list';
import { AnfrageHinweis } from '@/components/recht/anfrage-hinweis';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WegBestaetigung } from '@/components/weg/bestaetigung';
import { submitRecord, type SubmitResult } from '@/lib/actions/records';
import {
  BESCHRIFTUNG_HOECHSTENS,
  EINSENDE_QUELLE,
  HINWEIS_HOECHSTENS,
  MAX_KOPIEN,
  MAX_ORIGINALE,
  einsendeZusammenfassung,
  type EinsendePayload,
} from '@/lib/einsenden/vorgang';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { formatCents } from '@/lib/format';
import { LIEFERLAND } from '@/lib/kasse';
import type { ContactDetails, ImageSlot } from '@/lib/types';
import type { EinsendeAngebot } from '@/lib/versand/angebot';
import type { VersandArt } from '@/lib/versand/typen';
import { SCHRITTE_EINSENDUNG } from '@/lib/wege/naechste-schritte';
import { KARTEN_ANTWORTEN, kartenAntwort, type KartenAntwort } from '@/lib/wege/nachweis';

const FLOW_ID = 'schluessel-einschicken';
const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const STEPS: FlowStep[] = [
  { id: 'schluessel', title: 'Was schicken Sie ein?', hint: 'Wie viele Schlüssel im Umschlag liegen und wie viele Kopien Sie brauchen.', short: 'Schlüssel' },
  { id: 'nachweis', title: 'Gibt es eine Sicherungskarte?', hint: 'Schlüssel mit geschütztem Profil fertigen wir nur gegen die Karte.', short: 'Nachweis' },
  { id: 'versand', title: 'Wie schicken Sie den Schlüssel?', hint: 'Ihre Wahl steht auf dem Begleitschein.', short: 'Versand' },
  { id: 'kontakt', title: 'Kontakt und Rücksendeanschrift', hint: 'An diese Anschrift schicken wir Original und Kopien zurück.', short: 'Kontakt' },
  { id: 'absenden', title: 'Angaben prüfen und Begleitschein erstellen', hint: 'Nach dem Absenden laden Sie den Begleitschein als PDF herunter.', short: 'Absenden' },
];

interface EinsendeDaten {
  originale: number;
  stueckzahl: number;
  beschriftung: string;
  hinweis: string;
  /** Berechtigungsnachweis (R13): Gibt es eine Sicherungskarte? */
  sicherungskarte: KartenAntwort;
  /** Keine Vorauswahl: Versichert ist empfohlen, gewählt wird bewusst. */
  versand: VersandArt | '';
  anrede: string;
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  telefon: string;
  strasse: string;
  plz: string;
  ort: string;
}

const INITIAL: EinsendeDaten = {
  originale: 1,
  stueckzahl: 1,
  beschriftung: '',
  hinweis: '',
  sicherungskarte: '',
  versand: '',
  anrede: '',
  vorname: '',
  nachname: '',
  firma: '',
  email: '',
  telefon: '',
  strasse: '',
  plz: '',
  ort: '',
};

const EXAMPLE_KARTE: ImageSlot = {
  motif: 'Beispielfoto: Sicherungskarte von vorn, ganze Karte im Bild, Kartennummer lesbar',
  ratio: '3/2',
  note: 'Die ganze Karte, scharf und ohne Spiegelung.',
};

function kontaktAus(d: EinsendeDaten): ContactDetails {
  return {
    salutation: d.anrede || undefined,
    firstName: d.vorname.trim(),
    lastName: d.nachname.trim(),
    company: d.firma.trim() || undefined,
    email: d.email.trim(),
    phone: d.telefon.trim(),
    street: d.strasse.trim(),
    postalCode: d.plz.trim(),
    city: d.ort.trim(),
    country: LIEFERLAND,
  };
}

function payloadAus(d: EinsendeDaten): EinsendePayload {
  return {
    quelle: EINSENDE_QUELLE,
    originale: d.originale,
    stueckzahl: d.stueckzahl,
    beschriftung: d.beschriftung.trim() || null,
    hinweis: d.hinweis.trim() || null,
    sicherungskarte: kartenAntwort(d.sicherungskarte) || 'unklar',
    versand: d.versand || 'versichert',
    originalEingesendet: true,
  };
}

/** PDF aus der Antwort des Servers speichern (kein Link, kein Zwischenspeicher). */
function speichern(schein: { dateiname: string; pdfBase64: string }) {
  const bytes = Uint8Array.from(atob(schein.pdfBase64), (zeichen) => zeichen.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = schein.dateiname;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * Schlüssel einschicken (G-24, G-25, E6-OPUS-02): Anmeldung in fünf Schritten, danach der Begleitschein
 * als PDF. Der Server prüft alle Angaben und baut die Zusammenfassung selbst; die Vorschau hier nutzt
 * dieselbe Funktion.
 */
export function EinsendeFormular({ angebot }: { angebot: EinsendeAngebot }) {
  const [fotoKarte, setFotoKarte] = useState<PickedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const schutz = useFormularSchutz();

  const flow = useFlow<EinsendeDaten>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    version: 1,
    validate: (d, stepId) => {
      switch (stepId) {
        case 'schluessel':
          return (
            d.originale >= 1 && d.originale <= MAX_ORIGINALE
            && d.stueckzahl >= 1 && d.stueckzahl <= MAX_KOPIEN
            && d.beschriftung.trim().length <= BESCHRIFTUNG_HOECHSTENS
            && d.hinweis.trim().length <= HINWEIS_HOECHSTENS
          );
        case 'nachweis':
          return kartenAntwort(d.sicherungskarte) !== '';
        case 'versand':
          return d.versand !== '';
        case 'kontakt':
          return (
            d.vorname.trim().length > 1
            && d.nachname.trim().length > 1
            && EMAIL_MUSTER.test(d.email.trim())
            && d.telefon.replace(/\D/g, '').length >= 6
            && d.strasse.trim().length > 2
            && /^\d{5}$/.test(d.plz.trim())
            && d.ort.trim().length > 1
          );
        default:
          return true;
      }
    },
  });

  const { data } = flow;
  // Bei „Sicherungskarte ja“ gehört ein Foto der Karte dazu (R13); der Server prüft es noch einmal.
  const karteFehlt = data.sicherungskarte === 'ja' && fotoKarte.length === 0;
  const shellFlow = { ...flow, canContinue: flow.canContinue && !(flow.step?.id === 'nachweis' && karteFehlt) };
  const summary = useMemo(() => einsendeZusammenfassung(payloadAus(data), kontaktAus(data)), [data]);

  async function absenden() {
    setSubmitting(true);
    setFehler(null);
    await uploadsAbwarten();
    try {
      const antwort = await submitRecord({
        schutz: await schutz.daten(),
        kind: 'anfrage',
        area: 'schluessel-nach-vorlage',
        process: 'gefuehrte-anfrage',
        contact: kontaktAus(data),
        payload: { ...payloadAus(data) },
        // Die Zusammenfassung baut der Server aus den geprüften Angaben.
        summary: [],
        uploads: data.sicherungskarte === 'ja' ? fotoKarte.map((file) => alsUpload(file, 'sicherungskarte')) : [],
      });
      schutz.antwortBeachten(antwort);
      if (antwort.ok) {
        setResult(antwort);
        clearFlow(FLOW_ID);
      } else {
        setFehler(antwort.error ?? 'Die Anmeldung konnte nicht gespeichert werden.');
      }
    } catch {
      setFehler('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es noch einmal.');
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok) {
    const schein = result.begleitschein;
    return (
      <WegBestaetigung
        marke="Einsendung angemeldet"
        titel={schein ? 'Ihr Begleitschein ist bereit' : 'Ihre Einsendung ist angemeldet'}
        text="Legen Sie den Begleitschein mit dem Schlüssel in einen gepolsterten Umschlag. Die Anschrift für den Umschlag steht auf dem Begleitschein."
        reference={result.reference ?? ''}
        notices={result.notices}
        schritte={SCHRITTE_EINSENDUNG}
        summary={summary}
        zurueck={{ href: '/schluessel-einschicken', label: 'Zurück zum Einschicken' }}
      >
        {schein && (
          <div className="mt-6 rounded-lg border border-border bg-surface p-5">
            <p className="text-body font-semibold text-foreground">Begleitschein</p>
            <p className="mt-1 text-small leading-relaxed text-foreground-muted">
              Ausdrucken oder die Anschrift abschreiben. Den Begleitschein finden Sie auch auf Ihrer Vorgangsseite; den Link
              dorthin schicken wir Ihnen per E-Mail.
            </p>
            <Button className="mt-4" onClick={() => speichern(schein)}>
              Begleitschein herunterladen (PDF)
            </Button>
          </div>
        )}
      </WegBestaetigung>
    );
  }

  const gesperrt: Record<string, string> = {
    schluessel: `Bitte geben Sie an, wie viele Schlüssel (1 bis ${MAX_ORIGINALE}) und wie viele Kopien (1 bis ${MAX_KOPIEN}) es sind.`,
    nachweis: karteFehlt ? 'Bitte fügen Sie ein Foto Ihrer Sicherungskarte hinzu.' : 'Bitte beantworten Sie die Frage nach der Sicherungskarte.',
    versand: 'Bitte wählen Sie, wie Sie den Schlüssel schicken.',
    kontakt: 'Bitte füllen Sie Name, E-Mail, Telefon und die vollständige Rücksendeanschrift aus.',
  };

  return (
    <FlowShell
      schutz={schutz}
      abschlussHinweis={<AnfrageHinweis />}
      flow={shellFlow}
      title="Schlüssel einschicken"
      submitLabel="Begleitschein erstellen"
      onSubmit={absenden}
      submitting={submitting}
      blockedHint={gesperrt[flow.step?.id ?? '']}
    >
      {fehler && (
        <Alert tone="warning" title="Das hat nicht geklappt" className="mb-6" role="alert">
          {fehler}
        </Alert>
      )}

      {flow.step?.id === 'schluessel' && (
        <div className="max-w-3xl space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Schlüssel im Umschlag</p>
              <div className="mt-2">
                <QuantityInput
                  label="Schlüssel im Umschlag"
                  value={data.originale}
                  min={1}
                  max={MAX_ORIGINALE}
                  onChange={(wert) => flow.set('originale', wert)}
                />
              </div>
            </div>
            <div>
              <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Gewünschte Kopien</p>
              <div className="mt-2">
                <QuantityInput
                  label="Gewünschte Kopien"
                  value={data.stueckzahl}
                  min={1}
                  max={MAX_KOPIEN}
                  onChange={(wert) => flow.set('stueckzahl', wert)}
                />
              </div>
            </div>
          </div>
          <p className="text-small text-foreground-muted">
            Autoschlüssel und Transponder schicken Sie bitte nicht hier ein; dafür gibt es den Bereich Autoschlüssel.
          </p>
          <Field label="Beschriftung auf dem Schlüssel (freiwillig)" hint="Nummer oder Hersteller, falls etwas eingeprägt ist.">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                autoComplete="off"
                maxLength={BESCHRIFTUNG_HOECHSTENS}
                value={data.beschriftung}
                onChange={(e) => flow.set('beschriftung', e.target.value)}
              />
            )}
          </Field>
          <Field label="Hinweis (freiwillig)" hint="Zum Beispiel, ob das Schloss schwergängig ist oder was zusammengehört.">
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                rows={3}
                maxLength={HINWEIS_HOECHSTENS}
                value={data.hinweis}
                onChange={(e) => flow.set('hinweis', e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {flow.step?.id === 'nachweis' && (
        <fieldset className="max-w-3xl space-y-3">
          <legend className="text-body font-semibold text-foreground">Gibt es zu Ihrem Schlüssel eine Sicherungskarte?</legend>
          <p className="text-small text-foreground-muted">
            Die Sicherungskarte gehört zu Schlüsseln mit geschütztem Profil, etwa in Schließanlagen. Solche Schlüssel fertigen wir
            nur gegen die Karte.
          </p>
          {KARTEN_ANTWORTEN.map((antwort) => (
            <OptionCard
              key={antwort.wert}
              name="sicherungskarte"
              value={antwort.wert}
              checked={data.sicherungskarte === antwort.wert}
              onSelect={() => flow.set('sicherungskarte', antwort.wert)}
              title={antwort.titel}
              description={antwort.satz}
            />
          ))}
          {data.sicherungskarte === 'ja' && (
            <PhotoUpload
              category="sicherungskarte"
              id="foto-sicherungskarte"
              label="Foto Ihrer Sicherungskarte"
              description="Die ganze Karte, scharf und gut lesbar. Die Karte selbst schicken Sie bitte nicht mit."
              example={EXAMPLE_KARTE}
              files={fotoKarte}
              onChange={setFotoKarte}
              maxFiles={2}
              multiple
            />
          )}
        </fieldset>
      )}

      {flow.step?.id === 'versand' && (
        <fieldset className="max-w-3xl space-y-3">
          <legend className="text-body font-semibold text-foreground">Versand</legend>
          <p className="text-small text-foreground-muted">{angebot.satz}</p>
          {angebot.optionen.map((option) => (
            <OptionCard
              key={option.art}
              name="versand"
              value={option.art}
              checked={data.versand === option.art}
              onSelect={() => flow.set('versand', option.art)}
              title={option.empfohlen ? `${option.titel} (empfohlen)` : option.titel}
              description={`${option.hinweis}${option.aufpreisCents > 0 ? ` Aufpreis ${formatCents(option.aufpreisCents)}.` : ''}`}
            />
          ))}
          {angebot.stand && <p className="text-small text-foreground-subtle">Portopreise: {angebot.stand}</p>}
        </fieldset>
      )}

      {flow.step?.id === 'kontakt' && (
        <div className="max-w-3xl space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Anrede (freiwillig)">
              {({ id, describedBy }) => (
                <Select id={id} aria-describedby={describedBy} value={data.anrede} onChange={(e) => flow.set('anrede', e.target.value)}>
                  <option value="">Keine Angabe</option>
                  <option value="Frau">Frau</option>
                  <option value="Herr">Herr</option>
                </Select>
              )}
            </Field>
            <Field label="Firma (freiwillig)">
              {({ id, describedBy }) => (
                <TextInput id={id} aria-describedby={describedBy} autoComplete="organization" value={data.firma} onChange={(e) => flow.set('firma', e.target.value)} />
              )}
            </Field>
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
            <Field label="E-Mail" required hint="Hierhin schicken wir den Link zu Ihrem Vorgang.">
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
            <div className="sm:col-span-6">
              <Field label="Straße und Hausnummer" required>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="street-address" value={data.strasse} onChange={(e) => flow.set('strasse', e.target.value)} />
                )}
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Postleitzahl" required>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} inputMode="numeric" maxLength={5} aria-describedby={describedBy} invalid={invalid} autoComplete="postal-code" value={data.plz} onChange={(e) => flow.set('plz', e.target.value)} />
                )}
              </Field>
            </div>
            <div className="sm:col-span-4">
              <Field label="Ort" required>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="address-level2" value={data.ort} onChange={(e) => flow.set('ort', e.target.value)} />
                )}
              </Field>
            </div>
          </div>
          <p className="text-small text-foreground-muted">Rücksendung innerhalb von {LIEFERLAND}.</p>
        </div>
      )}

      {flow.step?.id === 'absenden' && (
        <div className="max-w-3xl space-y-6">
          <Alert tone="legal" title="Noch kein Vertrag">
            Mit dem Absenden melden Sie Ihre Einsendung an und erhalten den Begleitschein. Preis und Machbarkeit nennen wir Ihnen nach
            der Prüfung Ihres Schlüssels. Ein Auftrag kommt erst zustande, wenn Sie nach unserer Freigabe den genannten Preis bezahlen.
          </Alert>
          <SummaryList sections={summary} variante="schriftfeld" />
          {karteFehlt && (
            <Alert tone="warning" title="Foto der Sicherungskarte fehlt">
              Fotos werden aus Datenschutzgründen nicht zwischengespeichert. Bitte fügen Sie das Foto noch einmal hinzu.
              <span className="mt-3 block">
                <Button variant="outline" size="sm" onClick={() => flow.goTo('nachweis')}>
                  Zum Nachweis
                </Button>
              </span>
            </Alert>
          )}
        </div>
      )}
    </FlowShell>
  );
}
