'use client';

import { useEffect, useMemo, useState } from 'react';

import { FlowShell } from '@/components/flow/flow-shell';
import { QuantityInput, Select, TextArea, TextInput } from '@/components/forms/controls';
import { Field } from '@/components/forms/field';
import { AbsendeFehler, HilfeBlock } from '@/components/forms/hilfe';
import type { HilfeKontakt } from '@/components/forms/hilfe-daten';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import { SummaryList } from '@/components/layout/summary-list';
import { AnfrageHinweis } from '@/components/recht/anfrage-hinweis';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { LIEFERLAND } from '@/lib/kasse';
import type { ContactDetails, EinsendeEinstellungen, EinsendeVarianteKennung, ImageSlot } from '@/lib/types';
import { einsendeAngebot, varianteWaehlbar } from '@/lib/versand/angebot';
import {
  SCHLUESSELARTEN,
  SONDERFALL_HINWEIS,
  brauchtFahrzeugschein,
  empfehlungFuer,
  type Schluesselart,
} from '@/lib/versand/varianten';
import { SCHRITTE_EINSENDUNG } from '@/lib/wege/naechste-schritte';
import { KARTEN_ANTWORTEN, kartenAntwort, type KartenAntwort } from '@/lib/wege/nachweis';

import { VarianteBeschreibung, kostenSatz } from '../versand-variante';

const FLOW_ID = 'schluessel-einschicken';
const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const STEPS: FlowStep[] = [
  { id: 'schluessel', title: 'Was schicken Sie ein?', hint: 'Wie viele Schlüssel im Umschlag liegen und wie viele Kopien Sie brauchen.', short: 'Schlüssel' },
  { id: 'nachweis', title: 'Ihr Nachweis', hint: 'Schlüssel mit geschütztem Profil fertigen wir nur gegen die Karte, Autoschlüssel nur gegen den Fahrzeugschein.', short: 'Nachweis' },
  { id: 'versand', title: 'Wie schicken Sie den Schlüssel?', hint: 'Sie sehen die Kosten vorher. Ihre Wahl steht auf dem Begleitschein.', short: 'Versand' },
  { id: 'kontakt', title: 'Kontakt und Rücksendeanschrift', hint: 'An diese Anschrift schicken wir Original und Kopien zurück.', short: 'Kontakt' },
  { id: 'absenden', title: 'Angaben prüfen und Begleitschein erstellen', hint: 'Nach dem Absenden laden Sie den Begleitschein als PDF herunter.', short: 'Absenden' },
];

interface EinsendeDaten {
  originale: number;
  stueckzahl: number;
  beschriftung: string;
  hinweis: string;
  /** Was eingeschickt wird (A-050); Autoschlüssel brauchen den Fahrzeugschein (R13). */
  schluesselart: Schluesselart | '';
  /** Als wertvoll angegeben: DHL Paket ist dann empfohlen und vorausgewählt. */
  wertvoll: boolean;
  /** Berechtigungsnachweis (R13): Gibt es eine Sicherungskarte? */
  sicherungskarte: KartenAntwort;
  /** Variante des Inhabers; vorausgewählt nur bei einer Empfehlung (A-050, Punkt 3). */
  versand: EinsendeVarianteKennung | '';
  /** Sonderfall gewählt und Hinweis bestätigt. */
  sonderfallBestaetigt: boolean;
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
  schluesselart: '',
  wertvoll: false,
  sicherungskarte: '',
  versand: '',
  sonderfallBestaetigt: false,
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

const EXAMPLE_FAHRZEUGSCHEIN: ImageSlot = {
  motif: 'Beispielfoto: Zulassungsbescheinigung Teil I, ganze Seite im Bild, Halter und Fahrzeugdaten lesbar',
  ratio: '3/2',
  note: 'Die ganze Seite, scharf und ohne Spiegelung.',
};

function payloadAus(d: EinsendeDaten & { versand: EinsendeVarianteKennung; schluesselart: Schluesselart }, sonderfall: boolean): EinsendePayload {
  return {
    quelle: EINSENDE_QUELLE,
    originale: d.originale,
    stueckzahl: d.stueckzahl,
    beschriftung: d.beschriftung.trim() || null,
    hinweis: d.hinweis.trim() || null,
    sicherungskarte: kartenAntwort(d.sicherungskarte) || 'unklar',
    schluesselart: d.schluesselart,
    wertvoll: d.wertvoll,
    versand: d.versand,
    ...(sonderfall ? { sonderfallBestaetigt: true } : {}),
    originalEingesendet: true,
  };
}

/** Angebot für die Angaben des Kunden: Empfehlung aus Schlüsselart und „wertvoll“ (A-050). */
function angebotZu(einstellungen: EinsendeEinstellungen, d: Pick<EinsendeDaten, 'schluesselart' | 'wertvoll'>) {
  return einsendeAngebot(einstellungen, false, { empfehlung: empfehlungFuer(d) });
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
export function EinsendeFormular({ einstellungen, hilfe }: { einstellungen: EinsendeEinstellungen; hilfe?: HilfeKontakt }) {
  const [fotoKarte, setFotoKarte] = useState<PickedFile[]>([]);
  const [fotoSchein, setFotoSchein] = useState<PickedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const schutz = useFormularSchutz();

  const flow = useFlow<EinsendeDaten>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    // Version 2: Schlüsselart und Varianten des Inhabers (A-050); ältere Zwischenstände gelten nicht mehr.
    version: 2,
    validate: (d, stepId) => {
      switch (stepId) {
        case 'schluessel':
          return (
            d.schluesselart !== ''
            && d.originale >= 1 && d.originale <= MAX_ORIGINALE
            && d.stueckzahl >= 1 && d.stueckzahl <= MAX_KOPIEN
            && d.beschriftung.trim().length <= BESCHRIFTUNG_HOECHSTENS
            && d.hinweis.trim().length <= HINWEIS_HOECHSTENS
          );
        case 'nachweis':
          return kartenAntwort(d.sicherungskarte) !== '';
        case 'versand':
          return varianteWaehlbar(angebotZu(einstellungen, d), d.versand, d.sonderfallBestaetigt);
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
  const fahrzeug = brauchtFahrzeugschein(data.schluesselart);
  // Bei „Sicherungskarte ja“ gehört ein Foto der Karte dazu (R13); der Server prüft es noch einmal.
  const karteFehlt = !fahrzeug && data.sicherungskarte === 'ja' && fotoKarte.length === 0;
  // Autoschlüssel nur gegen den Fahrzeugschein (R13).
  const scheinFehlt = fahrzeug && fotoSchein.length === 0;
  const nachweisFehlt = karteFehlt || scheinFehlt;
  // Auch beim Absenden: Nach einem Neuladen fehlt das Foto (FA-QA-02).
  const shellFlow = {
    ...flow,
    canContinue:
      flow.canContinue
      && !((flow.step?.id === 'nachweis' || flow.step?.id === 'absenden') && karteFehlt)
      && !((flow.step?.id === 'nachweis' || flow.step?.id === 'absenden') && scheinFehlt),
  };
  const angebot = useMemo(() => angebotZu(einstellungen, data), [einstellungen, data]);
  const gewaehlt = [...angebot.optionen, ...angebot.sonderfaelle].find((o) => o.art === data.versand);
  const sonderfall = gewaehlt?.nurSonderfall === true && angebot.sonderfaelle.some((o) => o.art === gewaehlt.art);

  // Empfehlung (A-050, Punkt 3): Bei Autoschlüsseln, Elektronik und wertvollen Schlüsseln ist DHL Paket
  // vorausgewählt, solange der Kunde noch nichts gewählt hat. Wählen kann er weiter frei.
  const schrittId = flow.step?.id;
  const { set } = flow;
  useEffect(() => {
    if (schrittId === 'versand' && data.versand === '' && angebot.vorauswahl) set('versand', angebot.vorauswahl);
  }, [schrittId, data.versand, angebot.vorauswahl, set]);

  // Vorschau erst mit gewählter Versandart.
  const summary = useMemo(() => {
    const { versand, schluesselart } = data;
    return versand && schluesselart ? einsendeZusammenfassung(payloadAus({ ...data, versand, schluesselart }, sonderfall), kontaktAus(data)) : [];
  }, [data, sonderfall]);

  async function absenden() {
    const { versand, schluesselart } = data;
    if (!schluesselart) {
      flow.goTo('schluessel');
      return;
    }
    if (!versand) {
      flow.goTo('versand');
      return;
    }
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
        payload: { ...payloadAus({ ...data, versand, schluesselart }, sonderfall) },
        // Die Zusammenfassung baut der Server aus den geprüften Angaben.
        summary: [],
        uploads: fahrzeug
          ? fotoSchein.map((file) => alsUpload(file, 'fahrzeugschein', 'fahrzeugschein'))
          : data.sicherungskarte === 'ja'
            ? fotoKarte.map((file) => alsUpload(file, 'sicherungskarte'))
            : [],
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
        text={`${angebot.verpackung} Legen Sie den Begleitschein bei. Die Anschrift steht auf dem Begleitschein.`}
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
              Drucken Sie ihn aus oder schreiben Sie die Anschrift ab. Den Begleitschein finden Sie auch auf Ihrer Vorgangsseite.
              Den Link dorthin schicken wir Ihnen per E-Mail.
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
    schluessel: data.schluesselart
      ? `Bitte geben Sie an, wie viele Schlüssel (1 bis ${MAX_ORIGINALE}) und wie viele Kopien (1 bis ${MAX_KOPIEN}) es sind.`
      : 'Bitte wählen Sie, was Sie einschicken.',
    nachweis: scheinFehlt
      ? 'Bitte fügen Sie ein Foto Ihres Fahrzeugscheins hinzu.'
      : karteFehlt
        ? 'Bitte fügen Sie ein Foto Ihrer Sicherungskarte hinzu.'
        : 'Bitte beantworten Sie die Frage nach der Sicherungskarte.',
    versand: gewaehlt?.nurSonderfall && !data.sonderfallBestaetigt
      ? 'Bitte bestätigen Sie den Hinweis zum Sonderfall oder wählen Sie eine andere Versandart.'
      : 'Bitte wählen Sie, wie Sie den Schlüssel schicken.',
    kontakt: 'Bitte füllen Sie Name, E-Mail, Telefon und die vollständige Rücksendeanschrift aus.',
    absenden: `Es fehlt das Foto ${scheinFehlt ? 'Ihres Fahrzeugscheins' : 'Ihrer Sicherungskarte'}. Das passiert, wenn die Seite neu geladen wurde. Bitte gehen Sie zum Schritt Nachweis zurück.`,
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
      ungesichert={fotoKarte.length > 0 || fotoSchein.length > 0}
      mitDateien
    >
      {fehler && <AbsendeFehler fehler={fehler} hilfe={hilfe} titel="Das hat nicht geklappt" />}

      {flow.step?.id === 'schluessel' && (
        <div className="max-w-3xl space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-body font-semibold text-foreground">Was schicken Sie ein?</legend>
            {SCHLUESSELARTEN.map((art) => (
              <OptionCard
                key={art.wert}
                name="schluesselart"
                value={art.wert}
                checked={data.schluesselart === art.wert}
                // Beim Autoschlüssel ist der Fahrzeugschein der Nachweis, nicht die Sicherungskarte.
                onSelect={() =>
                  flow.update({
                    schluesselart: art.wert,
                    ...(brauchtFahrzeugschein(art.wert)
                      ? { sicherungskarte: 'nein' as const }
                      : brauchtFahrzeugschein(data.schluesselart)
                        ? { sicherungskarte: '' as const }
                        : {}),
                  })
                }
                title={art.titel}
                description={art.satz}
              />
            ))}
            <p className="text-small text-foreground-muted">
              Autoschlüssel mit Transponder oder Funk schicken Sie bitte nicht hier ein. Dafür gibt es den Bereich Autoschlüssel.
            </p>
            <OptionCard
              name="wertvoll"
              value="ja"
              multiple
              checked={data.wertvoll}
              onSelect={() => set('wertvoll', !data.wertvoll)}
              title="Der Schlüssel ist wertvoll oder schwer zu ersetzen"
              description="Dann empfehlen wir DHL Paket mit Haftung bis 500 €."
            />
          </fieldset>
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

      {flow.step?.id === 'nachweis' && fahrzeug && (
        <div className="max-w-3xl space-y-3">
          <p className="text-body font-semibold text-foreground">Fahrzeugschein</p>
          <p className="text-small text-foreground-muted">
            Einen Autoschlüssel fertigen wir nur gegen den Fahrzeugschein (Zulassungsbescheinigung Teil I). Er zeigt, dass Sie den
            Schlüssel nachmachen lassen dürfen.
          </p>
          <PhotoUpload
            category="fahrzeugschein"
            id="foto-fahrzeugschein"
            label="Foto Ihres Fahrzeugscheins"
            description="Die ganze Seite, scharf und gut lesbar. Den Fahrzeugschein selbst schicken Sie bitte nicht mit."
            example={EXAMPLE_FAHRZEUGSCHEIN}
            files={fotoSchein}
            onChange={setFotoSchein}
            maxFiles={2}
            multiple
          />
          <div className="pt-5">
            <HilfeBlock hilfe={hilfe} stelle="nachweis" satz="Fragen zum Nachweis? Rufen Sie uns an." spaeter mitDateien />
          </div>
        </div>
      )}

      {flow.step?.id === 'nachweis' && !fahrzeug && (
        <fieldset className="max-w-3xl space-y-3">
          <legend className="text-body font-semibold text-foreground">Gibt es zu Ihrem Schlüssel eine Sicherungskarte?</legend>
          <p className="text-small text-foreground-muted">
            Die Sicherungskarte gehört zu Schlüsseln mit geschütztem Profil, etwa in Schließanlagen. Solche Schlüssel fertigen wir
            nur gegen die Karte. Sie zeigt, dass Sie den Schlüssel nachmachen lassen dürfen.
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
          <div className="pt-5">
            <HilfeBlock hilfe={hilfe} stelle="nachweis" satz="Sie wissen nicht, ob es eine Sicherungskarte gibt? Wählen Sie „Weiß ich nicht“ oder rufen Sie uns an." spaeter mitDateien />
          </div>
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
              onSelect={() => flow.update({ versand: option.art, sonderfallBestaetigt: false })}
              title={option.titel}
              meta={option.empfohlen ? <Badge tone="success">Empfehlung</Badge> : undefined}
              description={<VarianteBeschreibung option={option} />}
            />
          ))}
          {angebot.sonderfaelle.length > 0 && (
            <details className="rounded-lg border border-border p-4" open={gewaehlt?.nurSonderfall === true}>
              <summary className="min-h-touch cursor-pointer text-small font-semibold text-foreground">Sonderfall: höhere Absicherung</summary>
              <div className="mt-3 space-y-3">
                {angebot.sonderfaelle.map((option) => (
                  <OptionCard
                    key={option.art}
                    name="versand"
                    value={option.art}
                    checked={data.versand === option.art}
                    onSelect={() => set('versand', option.art)}
                    title={`${option.titel} (nur Sonderfall)`}
                    description={<VarianteBeschreibung option={option} />}
                  />
                ))}
                {gewaehlt?.nurSonderfall && (
                  <OptionCard
                    name="sonderfallBestaetigt"
                    value="ja"
                    multiple
                    checked={data.sonderfallBestaetigt}
                    onSelect={() => set('sonderfallBestaetigt', !data.sonderfallBestaetigt)}
                    title="Ich habe den Hinweis gelesen"
                    description={SONDERFALL_HINWEIS}
                  />
                )}
              </div>
            </details>
          )}
          {gewaehlt && (
            <p className="rounded-lg border border-border bg-surface p-4 text-small text-foreground">
              <span className="font-semibold">Ihre Kosten für den Versand ({gewaehlt.titel}):</span> {kostenSatz(gewaehlt)}.
              {gewaehlt.stand && <span className="mt-1 block text-caption text-foreground-subtle">Stand: {gewaehlt.stand}</span>}
            </p>
          )}
          <Alert tone="warning" title="So verpacken Sie den Schlüssel">
            {angebot.verpackung}
          </Alert>
          <p className="text-small text-foreground-subtle">{angebot.haftungHinweis}</p>
          <div className="pt-5">
            <HilfeBlock hilfe={hilfe} stelle="versand" titel="Fragen zum Versand?" satz="Wir sagen Ihnen gern, welcher Versand für Ihren Schlüssel passt." />
          </div>
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
          {nachweisFehlt && (
            <Alert tone="warning" title={scheinFehlt ? 'Foto des Fahrzeugscheins fehlt' : 'Foto der Sicherungskarte fehlt'}>
              Fotos werden aus Datenschutzgründen nicht zwischengespeichert. Bitte fügen Sie das Foto noch einmal hinzu.
              <span className="mt-3 block">
                <Button variant="outline" size="md" onClick={() => flow.goTo('nachweis')}>
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
