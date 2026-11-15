'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { SchluesselFotoFelder } from '@/components/autoschluessel/schluessel-fotos';
import { KRAFTRAD_QUELLE } from '@/components/autoschluessel/fahrzeug-ziel';
import { FlowShell } from '@/components/flow/flow-shell';
import { TextArea, TextInput } from '@/components/forms/controls';
import { Field } from '@/components/forms/field';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { AbsendeFehler } from '@/components/forms/hilfe';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten } from '@/components/forms/photo-upload';
import { SummaryList } from '@/components/layout/summary-list';
import { AnfrageHinweis } from '@/components/recht/anfrage-hinweis';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Erreichbarkeit as ErreichbarkeitAnzeige } from '@/components/vertrauen/erreichbarkeit';
import { WegBestaetigung } from '@/components/weg/bestaetigung';
import { submitRecord, type SubmitResult } from '@/lib/actions/records';
import { ANFRAGE_FORMULAR, ANFRAGE_KLASSEN_DATEN, ERSATZNACHWEISE, FAHRZEUG_ANFRAGE_QUELLE, type FormularKlasse } from '@/lib/fahrzeuge/anfrage-klassen';
import { clearFlow } from '@/lib/flow/use-flow';
import { telefonLink } from '@/lib/telefon';
import type { Erreichbarkeit } from '@/lib/types';
import { naechsteSchritte } from '@/lib/wege/naechste-schritte';

import {
  BEISPIEL_ERSATZNACHWEIS,
  BEISPIEL_FAHRZEUGSCHEIN,
  BEISPIEL_TYPENSCHILD,
  BESCHREIBUNG_MIN,
  MAX_SCHLOSS_HERSTELLER,
  MAX_SCHLUESSELNUMMER,
  ROLLER_OPTIONEN,
  SCHLUESSEL_OPTIONEN,
  TRANSPONDER_OPTIONEN,
  fehltSatz,
  finGueltig,
  flowKennung,
  kontaktAus,
  payloadAus,
  uploadsAus,
  zusammenfassung,
  type AnfrageSchritt,
  type PflichtTabelle,
} from './kern';
import { KraftradSuche } from './kraftrad-suche';
import { schritteFuer, useFahrzeugAnfrage } from './zustand';

export interface FahrzeugAnfrageFormularProps {
  klasse: FormularKlasse;
  /** Pflichtliste der Regel je Fall, auf dem Server berechnet (pflicht.ts). */
  pflichtTabelle: PflichtTabelle;
  /** Telefonnummer aus den Einstellungen; ohne Nummer entfällt die Zeile. */
  telefon?: string;
  erreichbarkeit?: Erreichbarkeit;
  /** Vorbelegung aus „Fahrzeug nicht gefunden?“. */
  vorbelegung?: { hersteller?: string; modell?: string };
  /** Aktuelles Jahr, auf dem Server ermittelt, damit Server und Browser übereinstimmen. */
  jahr: number;
}

/** Kennung der Hilfe im Fahrzeugschritt, für Tests und die Sichtprobe. */
const HILFE_FAHRZEUG_KENNUNG = 'hilfe-fahrzeug';

/** Telefonnummer als Verweis, mit Erreichbarkeit aus den Einstellungen; ohne Nummer nichts. */
function TelefonMitErreichbarkeit({ telefon, erreichbarkeit }: { telefon?: string; erreichbarkeit?: Erreichbarkeit }) {
  const telefonHref = telefonLink(telefon);
  if (!telefon) return null;
  return (
    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-8">
      <p className="text-small text-foreground-muted">
        Rufen Sie uns an:{' '}
        {telefonHref ? (
          <a href={telefonHref} className="whitespace-nowrap font-mono font-semibold tabular-nums text-primary">
            {telefon}
          </a>
        ) : (
          <span className="whitespace-nowrap font-mono tabular-nums">{telefon}</span>
        )}
      </p>
      {erreichbarkeit && <ErreichbarkeitAnzeige angabe={erreichbarkeit} />}
    </div>
  );
}

/** Rückruf als zweiter Weg, wenn Anrufen gerade nicht passt. */
function RueckrufZeile() {
  return (
    <>
      <Link href="/beratung#rueckruf" className="font-semibold text-primary underline">
        Rückruf erbitten
      </Link>
      : Wir rufen Sie an und klären Ihre Fragen.
    </>
  );
}

/**
 * Hilfe im Fahrzeugschritt der Klassen ohne Katalogsuche (FA Abschnitt 26: Telefon und Hilfe an kritischen
 * Stellen, keine Sackgassen). Wer eine Pflichtangabe nicht kennt, etwa die Schlüsselnummer des Schlosses,
 * findet hier Telefon, Erreichbarkeit und Rückruf. Die Pflichtregel bleibt unverändert.
 */
function HilfeAmFahrzeug({ telefon, erreichbarkeit }: { telefon?: string; erreichbarkeit?: Erreichbarkeit }) {
  return (
    <div data-block={HILFE_FAHRZEUG_KENNUNG} className="rounded-lg border border-border bg-surface-muted p-4">
      <p className="text-body font-semibold text-foreground">Unsicher bei einer Angabe?</p>
      <p className="mt-1 max-w-measure text-small text-foreground-muted">Wir helfen Ihnen beim Suchen und Ausfüllen.</p>
      <TelefonMitErreichbarkeit telefon={telefon} erreichbarkeit={erreichbarkeit} />
      <p className="mt-3 max-w-measure text-small text-foreground-muted">
        <RueckrufZeile />
      </p>
    </div>
  );
}

/** Hilfe im Unterlagenschritt: Telefon und Erreichbarkeit, später weitermachen, Rückruf. */
function HilfeBeiUnterlagen({ telefon, erreichbarkeit }: { telefon?: string; erreichbarkeit?: Erreichbarkeit }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted p-4">
      <p className="text-body font-semibold text-foreground">Unsicher, was Sie hochladen sollen?</p>
      <TelefonMitErreichbarkeit telefon={telefon} erreichbarkeit={erreichbarkeit} />
      <ul className="mt-3 max-w-measure space-y-2 text-small text-foreground-muted">
        <li>Später weitermachen: Ihre Angaben bleiben auf diesem Gerät gespeichert. Die Dateien wählen Sie dann bitte erneut aus.</li>
        <li>
          <RueckrufZeile />
        </li>
      </ul>
      <p className="mt-3 max-w-measure text-small text-foreground-muted">
        Die Unterlagen schützen Sie vor Missbrauch: Wir fertigen Schlüssel nur für Berechtigte.
      </p>
    </div>
  );
}

/**
 * Gemeinsame Fahrzeugschlüssel-Anfrage (FA-KERN-02B, A-048): ein Formular für Motorrad, Roller, E-Scooter,
 * Seniorenmobil, Fahrrad und „Fahrzeug nicht gefunden“. Sechs Schritte mit Fortschrittsanzeige: Fahrzeug,
 * Schlüssel, Unterlagen, Beschreibung, Kontakt, Prüfen und Absenden. Was Pflicht ist, kommt aus der
 * Pflichtregel; der Server prüft beim Absenden noch einmal (R13). Zurück verliert nichts: Angaben und
 * ausgewählte Dateien bleiben stehen.
 */
export function FahrzeugAnfrageFormular({ klasse, pflichtTabelle, telefon, erreichbarkeit, vorbelegung, jahr }: FahrzeugAnfrageFormularProps) {
  const formular = ANFRAGE_FORMULAR[klasse];
  const klassenDaten = ANFRAGE_KLASSEN_DATEN[klasse];
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const schutz = useFormularSchutz();

  const { flow, shellFlow, dateien, setDateien, setFoto, pflicht, fehlt, offen, vorbelegungAnbieten, vorbelegungEntscheiden } = useFahrzeugAnfrage({
    klasse,
    pflichtTabelle,
    vorbelegung,
    jahr,
  });
  const { data } = flow;
  // Ist irgendeine Datei gewählt? Dann fragt der Browser vor dem Verlassen nach (FA-QA-02).
  const dateienGewaehlt =
    dateien.fahrzeugschein.length > 0
    || dateien.ersatznachweis.length > 0
    || dateien.typenschild.length > 0
    || Object.values(dateien.fotos).some((liste) => liste.length > 0);
  const summary = useMemo(() => zusammenfassung(klasse, data), [klasse, data]);
  const schrittName = (id: AnfrageSchritt) => schritteFuer(klasse).find((s) => s.id === id)?.short ?? id;

  async function absenden() {
    setSubmitting(true);
    setFehler(null);
    // Laufende Uploads abschließen, damit ihre Kennungen mitgehen.
    await uploadsAbwarten();
    try {
      const antwort = await submitRecord({
        schutz: await schutz.daten(),
        kind: 'anfrage',
        // Eine Bereichskennung je Klasse gibt es nicht; die Klasse steht als Feld im Vorgang (FA-KERN-02).
        area: 'autoschluessel',
        process: 'gefuehrte-anfrage',
        contact: kontaktAus(data),
        payload: payloadAus(klasse, data),
        summary,
        uploads: uploadsAus(pflicht, dateien, alsUpload),
      });
      schutz.antwortBeachten(antwort);
      if (antwort.ok) {
        setResult(antwort);
        clearFlow(flowKennung(klasse));
      } else {
        setFehler(antwort.error ?? 'Die Anfrage konnte nicht gespeichert werden.');
      }
    } catch {
      setFehler('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es noch einmal.');
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- Bestätigung ------------------------------------------------- */

  if (result?.ok) {
    return (
      <WegBestaetigung
        marke="Anfrage eingegangen"
        titel={formular.bestaetigung}
        text="Wir prüfen Fahrzeug, Schlüssel und Unterlagen und melden uns mit Preis und Termin oder einer Rückfrage."
        reference={result.reference ?? ''}
        notices={result.notices}
        schritte={naechsteSchritte({ kind: 'anfrage', area: 'autoschluessel', process: 'gefuehrte-anfrage', payload: { quelle: FAHRZEUG_ANFRAGE_QUELLE, klasse } })}
        summary={summary}
        zurueck={formular.zurueck}
      />
    );
  }

  /* ---------- Ablauf ------------------------------------------------------ */

  const fahrzeugHinweis = [
    formular.hersteller?.pflicht && `${formular.hersteller.label} (höchstens ${formular.hersteller.max} Zeichen)`,
    formular.modell?.pflicht && `${formular.modell.label} (höchstens ${formular.modell.max} Zeichen)`,
    formular.baujahr === 'pflicht' && 'ein Baujahr mit vier Ziffern',
    klasse === 'roller' && 'ob Ihr Fahrzeug einen Fahrzeugschein hat',
    klassenDaten.schloss && 'Hersteller und Schlüsselnummer des Schlosses',
  ].filter(Boolean) as string[];

  const blockedHints: Record<AnfrageSchritt, string> = {
    fahrzeug:
      (fahrzeugHinweis.length ? `Bitte tragen Sie ${fahrzeugHinweis.join(', ')} ein.` : '')
      + (formular.baujahr === 'freiwillig' ? ' Ein Baujahr hat vier Ziffern, wenn Sie es angeben.' : ''),
    schluessel: formular.chip ? 'Bitte sagen Sie uns, ob noch ein Schlüssel da ist und ob er einen Chip hat.' : 'Bitte sagen Sie uns, ob noch ein Schlüssel da ist.',
    unterlagen: fehltSatz(fehlt),
    beschreibung: `Bitte beschreiben Sie Ihr Anliegen kurz, mit mindestens ${BESCHREIBUNG_MIN} Zeichen.`,
    kontakt: 'Bitte füllen Sie Vorname, Nachname, E-Mail und Telefon aus. Die Postleitzahl hat fünf Ziffern, wenn Sie sie angeben.',
    absenden: offen
      ? `Im Schritt „${schrittName(offen)}“ fehlt noch etwas. Nach einem Neuladen der Seite wählen Sie die Dateien bitte erneut aus.`
      : '',
  };

  const typenschildErsetzt = finGueltig(data.fin) || data.keinTypenschild;

  return (
    <FlowShell
      schutz={schutz}
      abschlussHinweis={<AnfrageHinweis />}
      flow={shellFlow}
      title={formular.titel}
      submitLabel="Anfrage absenden"
      onSubmit={absenden}
      submitting={submitting}
      blockedHint={blockedHints[(flow.step?.id ?? 'fahrzeug') as AnfrageSchritt]}
      // Wie in den übrigen Formularen (FA-QA-02): Sind Dateien gewählt, fragt der Browser vor dem Verlassen nach.
      ungesichert={dateienGewaehlt}
      mitDateien
    >
      {fehler && <AbsendeFehler fehler={fehler} hilfe={{ telefon, erreichbarkeit }} />}

      {/* Gespeicherter Zwischenstand mit anderem Fahrzeug als in der Suche: fragen, nicht still verwerfen. */}
      {vorbelegungAnbieten && (
        <Alert tone="info" title="Anderes Fahrzeug aus der Suche" className="mb-6" role="status">
          <p>
            Aus der Suche: {[vorbelegungAnbieten.hersteller, vorbelegungAnbieten.modell].filter(Boolean).join(' ')}. Bisher eingetragen:{' '}
            {[data.hersteller, data.modell].filter((w) => w.trim()).join(' ') || 'noch nichts'}.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={() => vorbelegungEntscheiden(true)}>
              Fahrzeug aus der Suche übernehmen
            </Button>
            <Button type="button" variant="outline" onClick={() => vorbelegungEntscheiden(false)}>
              Bisherige Angaben behalten
            </Button>
          </div>
        </Alert>
      )}

      {/* 1 Fahrzeug */}
      {flow.step?.id === 'fahrzeug' && (
        <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
          {formular.katalog === 'kraftrad' && (
            <div className="sm:col-span-2">
              <KraftradSuche
                telefon={telefon}
                erreichbarkeit={erreichbarkeit}
                // Die Anfrage „nicht gefunden“ verlangt immer einen Fahrzeugschein; ein Roller mit
                // Versicherungskennzeichen bleibt darum in diesem Formular (freie Eingabe, Telefon).
                nichtGefundenHref={klasse === 'roller' ? null : undefined}
                label={klasse === 'motorrad' ? 'Motorrad suchen (freiwillig)' : 'Fahrzeug suchen (freiwillig)'}
                onWahl={(eintrag) =>
                  flow.update({
                    hersteller: eintrag.marke.slice(0, formular.hersteller?.max ?? 60),
                    modell: eintrag.reihe.slice(0, formular.modell?.max ?? 80),
                  })
                }
              />
            </div>
          )}
          {klassenDaten.schloss && (
            <>
              <div className="sm:col-span-2">
                <Field label="Hersteller des Schlosses" required hint={`Steht meist auf Schloss oder Schlüssel. Höchstens ${MAX_SCHLOSS_HERSTELLER} Zeichen.`}>
                  {({ id, describedBy, invalid }) => (
                    <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" maxLength={MAX_SCHLOSS_HERSTELLER} value={data.schlossHersteller} onChange={(e) => flow.set('schlossHersteller', e.target.value)} />
                  )}
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Schlüsselnummer" required hint={`Die Nummer auf dem Schlüssel oder auf der Codekarte. Sie finden die Nummer nicht? Rufen Sie uns an, wir helfen beim Suchen. Höchstens ${MAX_SCHLUESSELNUMMER} Zeichen.`}>
                  {({ id, describedBy, invalid }) => (
                    <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" spellCheck={false} className="font-mono" maxLength={MAX_SCHLUESSELNUMMER} value={data.schluesselnummer} onChange={(e) => flow.set('schluesselnummer', e.target.value)} />
                  )}
                </Field>
              </div>
            </>
          )}
          {formular.hersteller && (
            <div className="sm:col-span-2">
              <Field label={formular.hersteller.label} required={formular.hersteller.pflicht} hint={`${formular.hersteller.hinweis} Höchstens ${formular.hersteller.max} Zeichen.`}>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" maxLength={formular.hersteller!.max} value={data.hersteller} onChange={(e) => flow.set('hersteller', e.target.value)} />
                )}
              </Field>
            </div>
          )}
          {formular.modell && (
            <div className="sm:col-span-2">
              <Field label={formular.modell.label} required={formular.modell.pflicht} hint={`${formular.modell.hinweis} Höchstens ${formular.modell.max} Zeichen.`}>
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" maxLength={formular.modell!.max} value={data.modell} onChange={(e) => flow.set('modell', e.target.value)} />
                )}
              </Field>
            </div>
          )}
          {formular.baujahr && (
            <Field
              label={formular.baujahr === 'pflicht' ? 'Baujahr' : 'Baujahr (freiwillig)'}
              required={formular.baujahr === 'pflicht'}
              hint="Vier Ziffern, zum Beispiel 2019."
            >
              {({ id, describedBy, invalid }) => (
                <TextInput id={id} aria-describedby={describedBy} invalid={invalid} inputMode="numeric" autoComplete="off" maxLength={4} value={data.baujahr} onChange={(e) => flow.set('baujahr', e.target.value)} />
              )}
            </Field>
          )}
          {klasse === 'roller' && (
            <fieldset className="space-y-3 sm:col-span-2">
              <legend className="mb-1 text-body font-semibold text-foreground">Hat Ihr Fahrzeug einen Fahrzeugschein?</legend>
              <p className="text-small leading-relaxed text-foreground-muted">
                Danach richtet sich, welchen Nachweis wir brauchen. Wenn Sie unsicher sind: Ein Versicherungskennzeichen ist das
                kleine Schild der Versicherung, ein amtliches Kennzeichen kommt von der Zulassungsstelle.
              </p>
              {ROLLER_OPTIONEN.map((option) => (
                <OptionCard
                  key={option.wert}
                  name="roller"
                  value={option.wert}
                  checked={data.roller === option.wert}
                  onSelect={() => flow.set('roller', option.wert)}
                  title={option.titel}
                  description={option.satz}
                />
              ))}
            </fieldset>
          )}
          {formular.katalog === 'kraftrad' && <p className="text-caption text-foreground-muted sm:col-span-2">{KRAFTRAD_QUELLE}</p>}
          {/* Mit Katalogsuche steht die Hilfe im Block „Fahrzeug nicht gefunden?“ der Suche. */}
          {!formular.katalog && (
            <div className="sm:col-span-2">
              <HilfeAmFahrzeug telefon={telefon} erreichbarkeit={erreichbarkeit} />
            </div>
          )}
        </div>
      )}

      {/* 2 Schlüssel */}
      {flow.step?.id === 'schluessel' && (
        <div className="max-w-3xl space-y-8">
          <fieldset className="space-y-3">
            <legend className="mb-1 text-body font-semibold text-foreground">Ist noch ein Schlüssel da?</legend>
            {SCHLUESSEL_OPTIONEN.map((option) => (
              <OptionCard
                key={option.wert}
                name="schluessel"
                value={option.wert}
                checked={data.schluessel === option.wert}
                onSelect={() => flow.set('schluessel', option.wert)}
                title={option.titel}
                description={option.satz}
              />
            ))}
          </fieldset>
          {formular.chip && (
            <fieldset className="space-y-3">
              <legend className="mb-1 text-body font-semibold text-foreground">Hat Ihr Schlüssel einen Chip?</legend>
              <p className="text-small leading-relaxed text-foreground-muted">
                Ein Fahrzeug mit Wegfahrsperre springt ohne den passenden Chip im Schlüssel nicht an. Wenn Sie es nicht wissen, wählen
                Sie „Weiß ich nicht“.
              </p>
              {TRANSPONDER_OPTIONEN.map((option) => (
                <OptionCard
                  key={option.wert}
                  name="transponder"
                  value={option.wert}
                  checked={data.transponder === option.wert}
                  onSelect={() => flow.set('transponder', option.wert)}
                  title={option.titel}
                  description={option.satz}
                />
              ))}
            </fieldset>
          )}
        </div>
      )}

      {/* 3 Unterlagen: je Steckplatz ein Beispielbild und ein Satz, was zu sehen sein muss */}
      {flow.step?.id === 'unterlagen' && (
        <div className="max-w-3xl space-y-8">
          {pflicht.includes('fahrzeugschein') && (
            <PhotoUpload
              category="fahrzeugschein"
              steckplatz="fahrzeugschein"
              id="anfrage-fahrzeugschein"
              label="Fahrzeugschein (Zulassungsbescheinigung Teil I)"
              description="Als Foto oder als PDF. Vollständig und lesbar, alle vier Ecken im Bild."
              example={BEISPIEL_FAHRZEUGSCHEIN}
              files={dateien.fahrzeugschein}
              onChange={(liste) => setDateien('fahrzeugschein', liste)}
              required
              allowDocuments
              multiple
              maxFiles={2}
            />
          )}

          {pflicht.includes('ersatznachweis') && (
            <div className="space-y-5">
              <fieldset className="space-y-3">
                <legend className="mb-1 text-body font-semibold text-foreground">Welchen Nachweis haben Sie?</legend>
                <p className="text-small leading-relaxed text-foreground-muted">
                  {klassenDaten.schloss
                    ? 'Für ein Schloss gibt es keinen Fahrzeugschein. Einer dieser Nachweise genügt.'
                    : 'Ohne Fahrzeugschein genügt einer dieser Nachweise.'}
                </p>
                {klassenDaten.ersatznachweise.map((art) => (
                  <OptionCard
                    key={art}
                    name="ersatznachweis"
                    value={art}
                    checked={data.ersatznachweis === art}
                    onSelect={() => flow.set('ersatznachweis', art)}
                    title={ERSATZNACHWEISE[art].titel}
                    description={ERSATZNACHWEISE[art].satz}
                  />
                ))}
              </fieldset>
              <PhotoUpload
                category="dokument"
                steckplatz="ersatznachweis"
                id="anfrage-ersatznachweis"
                label={data.ersatznachweis ? ERSATZNACHWEISE[data.ersatznachweis].titel : 'Ihr Nachweis'}
                description="Als Foto oder als PDF. Ihr Name und die Angaben zum Fahrzeug oder Schloss müssen lesbar sein."
                example={BEISPIEL_ERSATZNACHWEIS}
                files={dateien.ersatznachweis}
                onChange={(liste) => setDateien('ersatznachweis', liste)}
                required
                allowDocuments
                multiple
                maxFiles={2}
              />
            </div>
          )}

          {pflicht.includes('typenschild') && (
            <div className="space-y-5">
              <PhotoUpload
                category="dokument"
                steckplatz="typenschild"
                id="anfrage-typenschild"
                label={typenschildErsetzt ? 'Typenschild (freiwillig)' : 'Typenschild'}
                description="Das Schild am Fahrzeug mit Hersteller und Nummer. Jede Zeile muss lesbar sein. Statt des Fotos genügt die Nummer darunter."
                example={BEISPIEL_TYPENSCHILD}
                files={dateien.typenschild}
                onChange={(liste) => setDateien('typenschild', liste)}
                required={!typenschildErsetzt}
                multiple
                maxFiles={2}
              />
              <Field
                label="Fahrzeug-Identifizierungsnummer (freiwillig)"
                hint="17 Zeichen, so wie auf dem Typenschild oder im Nachweis. Statt des Fotos."
                error={data.fin.trim() && !finGueltig(data.fin) ? 'Die Nummer hat 17 Zeichen aus Buchstaben und Ziffern, ohne I, O und Q.' : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" autoCapitalize="characters" spellCheck={false} className="font-mono" maxLength={17} value={data.fin} onChange={(e) => flow.set('fin', e.target.value)} />
                )}
              </Field>
              <OptionCard
                name="kein-typenschild"
                value="kein-typenschild"
                multiple
                checked={data.keinTypenschild}
                onSelect={() => flow.set('keinTypenschild', !data.keinTypenschild)}
                title="Mein Fahrzeug hat kein Typenschild"
                description="Dann prüfen wir Ihr Fahrzeug anhand des Nachweises und der Fotos."
              />
            </div>
          )}

          {pflicht.includes('schluessel-vorderseite') ? (
            <SchluesselFotoFelder fotos={dateien.fotos} onChange={setFoto} idVorsilbe={`anfrage-${klasse}`} />
          ) : (
            <p className="text-small leading-relaxed text-foreground-muted">
              Sie haben angegeben, dass kein Schlüssel mehr da ist. Darum fragen wir hier nicht nach Fotos des Schlüssels.
            </p>
          )}

          {fehlt.length > 0 && (
            <p role="status" className="text-small font-semibold text-foreground">
              {fehltSatz(fehlt)}
            </p>
          )}
          <p className="text-small leading-relaxed text-foreground-subtle">
            Dateien werden nicht im Browser zwischengespeichert. Nach einem Neuladen der Seite wählen Sie sie bitte erneut aus.
          </p>
          <HilfeBeiUnterlagen telefon={telefon} erreichbarkeit={erreichbarkeit} />
        </div>
      )}

      {/* 4 Beschreibung */}
      {flow.step?.id === 'beschreibung' && (
        <div className="max-w-3xl space-y-5">
          <Field
            label="Kurze Beschreibung Ihres Anliegens"
            required
            hint={`Ein Satz genügt, zum Beispiel: ${formular.beschreibungBeispiel} Mindestens ${BESCHREIBUNG_MIN} Zeichen.`}
          >
            {({ id, describedBy, invalid }) => (
              <TextArea id={id} aria-describedby={describedBy} invalid={invalid} rows={4} value={data.beschreibung} onChange={(e) => flow.set('beschreibung', e.target.value)} />
            )}
          </Field>
        </div>
      )}

      {/* 5 Kontakt */}
      {flow.step?.id === 'kontakt' && (
        <div className="max-w-3xl space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Anrede (freiwillig)">
                {({ id, describedBy }) => (
                  <TextInput id={id} aria-describedby={describedBy} autoComplete="honorific-prefix" value={data.anrede} onChange={(e) => flow.set('anrede', e.target.value)} />
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

      {/* 6 Prüfen und absenden */}
      {flow.step?.id === 'absenden' && (
        <div className="max-w-3xl space-y-6">
          {offen && (
            <Alert tone="warning" title="Es fehlt noch etwas" role="status">
              <p>{blockedHints.absenden}</p>
              <Button type="button" variant="outline" className="mt-3" onClick={() => flow.goTo(offen)}>
                Zum Schritt „{schrittName(offen)}“
              </Button>
            </Alert>
          )}
          <Alert tone="legal" title="Noch kein Vertrag">
            Mit dem Absenden stellen Sie eine Anfrage. Preis und Termin nennen wir Ihnen nach der Prüfung.
          </Alert>
          <SummaryList sections={summary} variante="schriftfeld" />
        </div>
      )}
    </FlowShell>
  );
}
