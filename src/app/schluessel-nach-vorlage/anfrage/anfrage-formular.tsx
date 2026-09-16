'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { submitRecord, type SubmitResult } from '@/lib/actions/records';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import type { ImageSlot, InfoHint, SummarySection } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { InfoTip } from '@/components/ui/info-tip';
import { Field } from '@/components/forms/field';
import { QuantityInput, Select, TextArea, TextInput } from '@/components/forms/controls';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, type PickedFile } from '@/components/forms/photo-upload';
import { FlowShell } from '@/components/flow/flow-shell';
import { SummaryList } from '@/components/layout/summary-list';

const FLOW_ID = 'schluessel-nach-vorlage-anfrage';
const MAX_STUECK = 20;

/* Genau acht Schritte — Reihenfolge und Zuschnitt aus dem Leitfaden. */
const STEPS: FlowStep[] = [
  {
    id: 'foto-vorderseite',
    title: 'Foto der Vorderseite',
    hint: 'Der Schlüssel flach von oben. Kopf und Bart müssen zusammen im Bild sein.',
    short: 'Vorderseite',
  },
  {
    id: 'foto-rueckseite',
    title: 'Foto der Rückseite',
    hint: 'Derselbe Schlüssel gewendet. Viele Schlüssel sind nur auf einer Seite beschriftet.',
    short: 'Rückseite',
  },
  {
    id: 'foto-spitze',
    title: 'Foto von vorne auf Spitze und Profil',
    hint: 'Aus dieser Ansicht bestimmen wir den Profilquerschnitt und damit den passenden Rohling.',
    short: 'Spitze',
  },
  {
    id: 'hersteller',
    title: 'Hersteller oder Marke',
    hint: 'Falls bekannt. Ist nichts lesbar, wählen Sie einfach „nicht bekannt“.',
    short: 'Hersteller',
  },
  {
    id: 'nummern',
    title: 'Nummern und Beschriftungen',
    hint: 'Alles, was auf dem Schlüssel steht — Zahlen, Buchstaben, Punkte, Striche.',
    short: 'Nummern',
  },
  {
    id: 'stueckzahl',
    title: 'Gewünschte Stückzahl',
    hint: 'Wie viele Schlüssel sollen wir anfertigen, wenn die Prüfung erfolgreich ist?',
    short: 'Stückzahl',
  },
  {
    id: 'kontakt',
    title: 'Kontaktdaten und Versandland',
    hint: 'Damit wir Ihnen das Ergebnis der Prüfung zusenden können.',
    short: 'Kontakt',
  },
  {
    id: 'absenden',
    title: 'Anfrage prüfen und absenden',
    hint: 'Bitte kontrollieren Sie Ihre Angaben. Mit dem Absenden entsteht noch kein Vertrag.',
    short: 'Absenden',
  },
];

interface AnfrageData {
  hersteller: string;
  herstellerUnbekannt: boolean;
  nummern: string;
  keineBeschriftung: boolean;
  stueckzahl: number;
  anmerkung: string;
  anrede: string;
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  telefon: string;
  strasse: string;
  plz: string;
  ort: string;
  land: string;
  landFrei: string;
}

const INITIAL: AnfrageData = {
  hersteller: '',
  herstellerUnbekannt: false,
  nummern: '',
  keineBeschriftung: false,
  stueckzahl: 1,
  anmerkung: '',
  anrede: '',
  vorname: '',
  nachname: '',
  firma: '',
  email: '',
  telefon: '',
  strasse: '',
  plz: '',
  ort: '',
  land: 'DE',
  landFrei: '',
};

const LAENDER: Array<{ value: string; label: string }> = [
  { value: 'DE', label: 'Deutschland' },
  { value: 'AT', label: 'Österreich' },
  { value: 'CH', label: 'Schweiz' },
  { value: 'andere', label: 'Anderes Land' },
];

/* ---------- Erklärungen hinter dem Info-Symbol -------------------------- */

const HINT_FOTO: InfoHint = {
  title: 'Warum drei Aufnahmen?',
  body:
    'Vorderseite und Rückseite zeigen die Form des Barts und die Beschriftung. Die Aufnahme '
    + 'von vorne zeigt den Profilquerschnitt. Erst alle drei zusammen ergeben eine sichere '
    + 'Bestimmung des Rohlings.',
};

const HINT_HERSTELLER: InfoHint = {
  title: 'Wo steht der Hersteller?',
  body:
    'Meist auf dem Schlüsselkopf, seltener auf dem Bart oder auf dem Schloss selbst. Häufig '
    + 'ist es ein kurzer Schriftzug oder ein Symbol. Wenn Sie nichts finden, ist das kein '
    + 'Hindernis — wir bestimmen den Schlüssel dann über Profil und Form.',
};

const HINT_NUMMERN: InfoHint = {
  title: 'Welche Zeichen sind gemeint?',
  body:
    'Alles, was eingeprägt oder aufgedruckt ist: Zahlenfolgen, Buchstabenkürzel, Punkte oder '
    + 'Striche. Übertragen Sie die Zeichen genau so, wie Sie sie lesen. Sind Sie unsicher, '
    + 'notieren Sie beide möglichen Lesarten und fotografieren Sie die Stelle zusätzlich.',
};

const HINT_STUECKZAHL: InfoHint = {
  title: 'Warum fragen wir die Stückzahl?',
  body:
    'Die Stückzahl beeinflusst den Aufwand und damit den Preis. Sie ist unverbindlich und '
    + 'lässt sich nach unserer Rückmeldung noch ändern.',
};

const HINT_LAND: InfoHint = {
  title: 'Wozu das Versandland?',
  body:
    'Das Land bestimmt, welche Versandwege infrage kommen und was beim Versand zu beachten '
    + 'ist. Ob und wie wir in Ihr Land versenden können, klären wir mit der Prüfung Ihrer '
    + 'Anfrage.',
};

const HINT_ANSCHRIFT: InfoHint = {
  title: 'Anschrift jetzt oder später?',
  body:
    'Für die Anfrage genügt das Land. Die vollständige Anschrift brauchen wir erst, wenn Sie '
    + 'uns nach unserer Rückmeldung den Auftrag erteilen.',
};

/* ---------- Beispielbilder je Fotoschritt ------------------------------- */

const EXAMPLE_FRONT: ImageSlot = {
  motif: 'Beispielfoto: Schlüssel flach von oben, Kopf und Bart vollständig im Bild',
  ratio: '4/3',
  note: 'Heller, neutraler Untergrund. Kein direkter Blitz.',
};

const EXAMPLE_BACK: ImageSlot = {
  motif: 'Beispielfoto: gewendeter Schlüssel, Prägung auf der Rückseite lesbar',
  ratio: '4/3',
  note: 'Gleicher Abstand und Untergrund wie bei der Vorderseite.',
};

const EXAMPLE_TIP: ImageSlot = {
  motif: 'Beispielfoto: Blick von vorne auf die Schlüsselspitze, Profilquerschnitt erkennbar',
  ratio: '1/1',
  note: 'Schlüssel aufstellen oder anlehnen, damit die Spitze zur Kamera zeigt.',
};

const EXAMPLE_MARKS: ImageSlot = {
  motif: 'Beispielfoto: Nahaufnahme der Prägung auf dem Schlüsselkopf',
  ratio: '1/1',
  note: 'Nah genug, dass jede Ziffer einzeln lesbar ist.',
};

const AUFNAHME_HINWEISE = [
  'Scharf stellen und erst danach auslösen.',
  'Helles, gleichmäßiges Licht — kein direkter Blitz, keine Spiegelungen.',
  'Prägungen und Beschriftungen müssen lesbar sein.',
  'Schlüssel formatfüllend aufnehmen, Rand nur knapp mitnehmen.',
];

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface AnfrageFormularProps {
  /** Aufbewahrungsfrist für Schlüsselfotos in Tagen — aus den Einstellungen. */
  photoRetentionDays: number;
}

export function AnfrageFormular({ photoRetentionDays }: AnfrageFormularProps) {
  // Dateien bewusst außerhalb des Ablaufzustands: der Zwischenstand wird im
  // Browser gespeichert, Fotos werden dort nicht abgelegt.
  const [fotoVorderseite, setFotoVorderseite] = useState<PickedFile[]>([]);
  const [fotoRueckseite, setFotoRueckseite] = useState<PickedFile[]>([]);
  const [fotoSpitze, setFotoSpitze] = useState<PickedFile[]>([]);
  const [fotoBeschriftung, setFotoBeschriftung] = useState<PickedFile[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  const flow = useFlow<AnfrageData>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    version: 1,
    validate: (data, stepId) => {
      switch (stepId) {
        case 'hersteller':
          return data.herstellerUnbekannt || data.hersteller.trim().length > 0;
        case 'nummern':
          return data.keineBeschriftung || data.nummern.trim().length > 0;
        case 'stueckzahl':
          return data.stueckzahl >= 1 && data.stueckzahl <= MAX_STUECK;
        case 'kontakt':
          return (
            data.vorname.trim().length > 1
            && data.nachname.trim().length > 1
            && EMAIL_MUSTER.test(data.email.trim())
            && data.telefon.replace(/\D/g, '').length >= 6
            && (data.land !== 'andere' || data.landFrei.trim().length > 1)
          );
        default:
          return true;
      }
    },
  });

  const { data } = flow;

  const fotoStatus: Record<string, PickedFile[]> = {
    'foto-vorderseite': fotoVorderseite,
    'foto-rueckseite': fotoRueckseite,
    'foto-spitze': fotoSpitze,
  };

  const aktuelleFotosOk = (fotoStatus[flow.step?.id ?? '']?.length ?? 1) > 0;

  // Fotos zählen nicht zum gespeicherten Zustand, deshalb wird die
  // Weiter-Sperre hier ergänzt.
  const shellFlow = { ...flow, canContinue: flow.canContinue && aktuelleFotosOk };

  const landLabel =
    data.land === 'andere'
      ? data.landFrei.trim()
      : (LAENDER.find((l) => l.value === data.land)?.label ?? '');

  const summary: SummarySection[] = useMemo(() => {
    const dateiAngabe = (files: PickedFile[], pflicht: boolean) => {
      if (files.length === 0) return pflicht ? 'fehlt noch' : 'nicht beigefügt';
      return files.map((f) => f.name).join(', ');
    };

    return [
      {
        title: 'Fotos',
        rows: [
          { label: 'Vorderseite', value: dateiAngabe(fotoVorderseite, true) },
          { label: 'Rückseite', value: dateiAngabe(fotoRueckseite, true) },
          { label: 'Spitze und Profil', value: dateiAngabe(fotoSpitze, true) },
          { label: 'Nahaufnahmen der Beschriftung', value: dateiAngabe(fotoBeschriftung, false) },
        ],
      },
      {
        title: 'Angaben zum Schlüssel',
        rows: [
          {
            label: 'Hersteller oder Marke',
            value: data.herstellerUnbekannt ? 'nicht bekannt' : data.hersteller.trim(),
          },
          {
            label: 'Nummern und Beschriftungen',
            value: data.keineBeschriftung ? 'keine erkennbar' : data.nummern.trim(),
          },
          { label: 'Gewünschte Stückzahl', value: `${data.stueckzahl}` },
          { label: 'Anmerkung', value: data.anmerkung.trim() || 'keine' },
        ],
      },
      {
        title: 'Kontakt',
        rows: [
          {
            label: 'Name',
            value: [data.anrede, data.vorname.trim(), data.nachname.trim()]
              .filter(Boolean)
              .join(' '),
          },
          { label: 'Firma', value: data.firma.trim() || 'keine Angabe' },
          { label: 'E-Mail', value: data.email.trim() },
          { label: 'Telefon', value: data.telefon.trim() },
          {
            label: 'Anschrift',
            value:
              [data.strasse.trim(), [data.plz.trim(), data.ort.trim()].filter(Boolean).join(' ')]
                .filter(Boolean)
                .join(', ') || 'folgt bei Auftragserteilung',
          },
          { label: 'Versandland', value: landLabel || 'keine Angabe' },
        ],
      },
    ];
  }, [data, fotoVorderseite, fotoRueckseite, fotoSpitze, fotoBeschriftung, landLabel]);

  async function handleSubmit() {
    setSubmitting(true);
    setFehler(null);

    const alleFotos = [
      ...fotoVorderseite,
      ...fotoRueckseite,
      ...fotoSpitze,
      ...fotoBeschriftung,
    ];

    try {
      const antwort = await submitRecord({
        kind: 'anfrage',
        area: 'schluessel-nach-vorlage',
        process: 'gefuehrte-anfrage',
        contact: {
          salutation: data.anrede || undefined,
          firstName: data.vorname.trim(),
          lastName: data.nachname.trim(),
          company: data.firma.trim() || undefined,
          email: data.email.trim(),
          phone: data.telefon.trim(),
          street: data.strasse.trim() || undefined,
          postalCode: data.plz.trim() || undefined,
          city: data.ort.trim() || undefined,
          country: landLabel,
        },
        payload: {
          hersteller: data.herstellerUnbekannt ? null : data.hersteller.trim(),
          herstellerUnbekannt: data.herstellerUnbekannt,
          beschriftungen: data.keineBeschriftung ? null : data.nummern.trim(),
          keineBeschriftung: data.keineBeschriftung,
          stueckzahl: data.stueckzahl,
          anmerkung: data.anmerkung.trim() || null,
          fotoAnzahl: alleFotos.length,
          originalEingesendet: false,
        },
        summary,
        uploads: alleFotos.map((file) => ({
          fileName: file.name,
          sizeBytes: file.sizeBytes,
          mimeType: file.mimeType,
          category: 'schluesselfoto' as const,
        })),
      });

      if (antwort.ok) {
        setResult(antwort);
        clearFlow(FLOW_ID);
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="max-w-3xl">
        <Badge tone="success" className="mb-4">
          <CheckCircle2 size={14} aria-hidden />
          Anfrage eingegangen
        </Badge>

        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Ihre Anfrage liegt uns vor
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
          Wir prüfen Ihre Fotos und melden uns mit dem Ergebnis: ob eine Anfertigung möglich ist
          und was sie kostet. Ein Vertrag ist damit noch nicht geschlossen.
        </p>

        <Card className="mt-6">
          <CardBody>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-foreground-subtle">
              Ihre Vorgangsnummer
            </p>
            <p className="mt-1.5 font-mono text-xl font-bold text-foreground md:text-2xl">
              {result.reference}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground-muted">
              Bitte notieren Sie diese Nummer. Sie brauchen sie für jede Rückfrage und für den
              Abruf des Bearbeitungsstands.
            </p>
          </CardBody>
        </Card>

        {result.notices.length > 0 && (
          <div className="mt-5 space-y-3">
            {result.notices.map((notice) => (
              <Alert key={notice} tone="warning" title="Hinweis">
                {notice}
              </Alert>
            ))}
          </div>
        )}

        <h3 className="mt-8 text-[17px] font-bold text-foreground">Wie es weitergeht</h3>
        <ol className="mt-4 space-y-4 border-l border-border pl-6">
          {[
            {
              title: 'Wir prüfen Ihre Fotos',
              body: 'Profil, Rohling und Beschriftung werden bestimmt.',
            },
            {
              title: 'Sie erhalten Machbarkeit und Preis',
              body: 'Die Rückmeldung geht an die angegebene E-Mail-Adresse.',
            },
            {
              title: 'Sie entscheiden',
              body:
                'Erst mit Ihrer ausdrücklichen Zusage beauftragen Sie die Anfertigung. Bis dahin '
                + 'entstehen Ihnen keine Verpflichtungen.',
            },
            {
              title: 'Nur falls nötig: Einsendung',
              body:
                'Reichen die Fotos nicht aus, senden wir Ihnen eine Einsendeanweisung mit '
                + 'Adresse und Vorgangsnummer. Senden Sie bitte nichts unaufgefordert ein.',
            },
          ].map((step, index) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden
                className="absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface font-display text-[11px] font-bold text-primary"
              >
                {index + 1}
              </span>
              <p className="text-[15px] font-bold text-foreground">{step.title}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <h3 className="mt-8 text-[17px] font-bold text-foreground">Ihre Angaben</h3>
        <SummaryList sections={summary} className="mt-4" />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/service-und-termin/terminstatus">
            Bearbeitungsstand abrufen
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
          <ButtonLink href="/schluessel-nach-vorlage" variant="outline">
            Zurück zur Übersicht
          </ButtonLink>
        </div>

        <p className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-6 text-[14px]">
          <span className="font-semibold text-foreground-muted">Ebenfalls passend:</span>
          <Link href="/schluessel-nach-code" className="font-semibold text-primary hover:underline">
            Schlüssel nach Code
          </Link>
          <Link href="/autoschluessel/kopieren" className="font-semibold text-primary hover:underline">
            Autoschlüssel kopieren
          </Link>
          <Link href="/autoschluessel/programmieren" className="font-semibold text-primary hover:underline">
            Programmieren und anlernen
          </Link>
        </p>
      </div>
    );
  }

  /* ---------- Ablauf ----------------------------------------------------- */

  const blockedHints: Record<string, string> = {
    'foto-vorderseite': 'Bitte fügen Sie ein Foto der Vorderseite hinzu.',
    'foto-rueckseite': 'Bitte fügen Sie ein Foto der Rückseite hinzu.',
    'foto-spitze': 'Bitte fügen Sie ein Foto von vorne auf die Spitze hinzu.',
    hersteller: 'Bitte tragen Sie den Hersteller ein oder wählen Sie „nicht bekannt“.',
    nummern: 'Bitte übertragen Sie die Beschriftung oder wählen Sie „keine erkennbar“.',
    kontakt: 'Bitte füllen Sie Vorname, Nachname, E-Mail, Telefon und Versandland aus.',
  };

  return (
    <FlowShell
      flow={shellFlow}
      title="Schlüssel nach Vorlage — Anfrage"
      submitLabel="Anfrage absenden"
      onSubmit={handleSubmit}
      submitting={submitting}
      blockedHint={blockedHints[flow.step?.id ?? '']}
    >
      {fehler && (
        <Alert tone="warning" title="Absenden nicht möglich" className="mb-6">
          {fehler}
        </Alert>
      )}

      {flow.step?.id === 'foto-vorderseite' && (
        <FotoSchritt
          id="foto-vorderseite"
          label="Vorderseite des Schlüssels"
          description="Legen Sie den Schlüssel flach auf einen hellen, einfarbigen Untergrund und fotografieren Sie von oben."
          example={EXAMPLE_FRONT}
          files={fotoVorderseite}
          onChange={setFotoVorderseite}
          hint={HINT_FOTO}
          retentionDays={photoRetentionDays}
        />
      )}

      {flow.step?.id === 'foto-rueckseite' && (
        <FotoSchritt
          id="foto-rueckseite"
          label="Rückseite des Schlüssels"
          description="Wenden Sie den Schlüssel und fotografieren Sie erneut von oben — gleicher Abstand, gleicher Untergrund."
          example={EXAMPLE_BACK}
          files={fotoRueckseite}
          onChange={setFotoRueckseite}
          hint={HINT_FOTO}
          retentionDays={photoRetentionDays}
        />
      )}

      {flow.step?.id === 'foto-spitze' && (
        <FotoSchritt
          id="foto-spitze"
          label="Blick von vorne auf Spitze und Profil"
          description="Stellen Sie den Schlüssel auf oder lehnen Sie ihn an, sodass die Spitze zur Kamera zeigt. Der Querschnitt muss erkennbar sein."
          example={EXAMPLE_TIP}
          files={fotoSpitze}
          onChange={setFotoSpitze}
          hint={HINT_FOTO}
          retentionDays={photoRetentionDays}
        />
      )}

      {flow.step?.id === 'hersteller' && (
        <div className="max-w-2xl space-y-5">
          <Field
            label="Hersteller oder Marke"
            hint="Zum Beispiel der Schriftzug auf dem Schlüsselkopf. Groß- und Kleinschreibung spielt keine Rolle."
            info={HINT_HERSTELLER}
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={flow.data.hersteller}
                disabled={flow.data.herstellerUnbekannt}
                autoComplete="off"
                onChange={(e) => flow.set('hersteller', e.target.value)}
              />
            )}
          </Field>

          <OptionCard
            name="hersteller-unbekannt"
            value="unbekannt"
            multiple
            checked={flow.data.herstellerUnbekannt}
            onSelect={() =>
              flow.update({
                herstellerUnbekannt: !flow.data.herstellerUnbekannt,
                hersteller: '',
              })
            }
            title="Hersteller ist nicht bekannt oder nicht lesbar"
            description="Kein Hindernis. Wir bestimmen den Schlüssel dann über Profil, Form und Beschriftung."
          />
        </div>
      )}

      {flow.step?.id === 'nummern' && (
        <div className="max-w-2xl space-y-5">
          <Alert tone="info" title="Bitte zusätzlich fotografieren">
            Übertragen Sie die Zeichen hier als Text <strong>und</strong> fotografieren Sie sie
            deutlich. Bei kleinen Prägungen hilft eine Nahaufnahme, auf der jede Ziffer einzeln
            lesbar ist — so lassen sich Verwechslungen wie 0 und O oder 1 und 7 ausschließen.
          </Alert>

          <Field
            label="Nummern und Beschriftungen"
            hint="Jede Zeile eine Fundstelle, zum Beispiel: Kopf: AB 1234 — Bart: 7."
            info={HINT_NUMMERN}
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                rows={5}
                value={flow.data.nummern}
                disabled={flow.data.keineBeschriftung}
                placeholder="Kopf: ..."
                onChange={(e) => flow.set('nummern', e.target.value)}
              />
            )}
          </Field>

          <OptionCard
            name="keine-beschriftung"
            value="keine"
            multiple
            checked={flow.data.keineBeschriftung}
            onSelect={() =>
              flow.update({
                keineBeschriftung: !flow.data.keineBeschriftung,
                nummern: '',
              })
            }
            title="Auf dem Schlüssel ist nichts erkennbar"
            description="Auch dann ist eine Bestimmung häufig möglich — sie dauert nur etwas länger."
          />

          <div className="border-t border-border pt-5">
            <PhotoUpload
              id="foto-beschriftung"
              label="Nahaufnahmen der Beschriftung (freiwillig)"
              description="Bis zu drei Nahaufnahmen der Stellen mit Zahlen oder Buchstaben. Scharf, gut ausgeleuchtet, formatfüllend."
              example={EXAMPLE_MARKS}
              files={fotoBeschriftung}
              onChange={setFotoBeschriftung}
              multiple
              maxFiles={3}
            />
          </div>
        </div>
      )}

      {flow.step?.id === 'stueckzahl' && (
        <div className="max-w-2xl space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Gewünschte Stückzahl</p>
              <InfoTip hint={HINT_STUECKZAHL} />
            </div>
            <div className="mt-2">
              <QuantityInput
                label="Gewünschte Stückzahl"
                value={flow.data.stueckzahl}
                min={1}
                max={MAX_STUECK}
                onChange={(value) => flow.set('stueckzahl', value)}
              />
            </div>
            <p className="mt-2 text-[13px] leading-snug text-foreground-subtle">
              Größere Stückzahlen tragen Sie bitte unten als Anmerkung ein. Die Angabe ist
              unverbindlich und lässt sich nach unserer Rückmeldung noch ändern.
            </p>
          </div>

          <Field
            label="Anmerkung (freiwillig)"
            hint="Zum Beispiel, wofür der Schlüssel gebraucht wird oder ob das Schloss schwergängig ist."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                rows={4}
                value={flow.data.anmerkung}
                onChange={(e) => flow.set('anmerkung', e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {flow.step?.id === 'kontakt' && (
        <div className="max-w-2xl space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Anrede (freiwillig)">
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  value={flow.data.anrede}
                  onChange={(e) => flow.set('anrede', e.target.value)}
                >
                  <option value="">Keine Angabe</option>
                  <option value="Frau">Frau</option>
                  <option value="Herr">Herr</option>
                </Select>
              )}
            </Field>

            <Field label="Firma (freiwillig)">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  autoComplete="organization"
                  value={flow.data.firma}
                  onChange={(e) => flow.set('firma', e.target.value)}
                />
              )}
            </Field>

            <Field label="Vorname" required>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="given-name"
                  value={flow.data.vorname}
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
                  value={flow.data.nachname}
                  onChange={(e) => flow.set('nachname', e.target.value)}
                />
              )}
            </Field>

            <Field
              label="E-Mail"
              required
              hint="An diese Adresse senden wir Machbarkeit und Preis."
              error={
                flow.data.email.length > 0 && !EMAIL_MUSTER.test(flow.data.email.trim())
                  ? 'Bitte prüfen Sie die Schreibweise der E-Mail-Adresse.'
                  : undefined
              }
            >
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  type="email"
                  inputMode="email"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="email"
                  value={flow.data.email}
                  onChange={(e) => flow.set('email', e.target.value)}
                />
              )}
            </Field>

            <Field label="Telefon" required hint="Für Rückfragen zum Schlüssel.">
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  type="tel"
                  inputMode="tel"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="tel"
                  value={flow.data.telefon}
                  onChange={(e) => flow.set('telefon', e.target.value)}
                />
              )}
            </Field>
          </div>

          <Field label="Versandland" required info={HINT_LAND}>
            {({ id, describedBy, invalid }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                value={flow.data.land}
                onChange={(e) => flow.set('land', e.target.value)}
              >
                {LAENDER.map((land) => (
                  <option key={land.value} value={land.value}>
                    {land.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {flow.data.land === 'andere' && (
            <Field label="Land" required hint="Bitte den Ländernamen ausschreiben.">
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="country-name"
                  value={flow.data.landFrei}
                  onChange={(e) => flow.set('landFrei', e.target.value)}
                />
              )}
            </Field>
          )}

          <div className="border-t border-border pt-5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Anschrift (freiwillig)</p>
              <InfoTip hint={HINT_ANSCHRIFT} />
            </div>

            <div className="mt-3 grid gap-5 sm:grid-cols-[2fr_1fr]">
              <Field label="Straße und Hausnummer">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    autoComplete="street-address"
                    value={flow.data.strasse}
                    onChange={(e) => flow.set('strasse', e.target.value)}
                  />
                )}
              </Field>

              <Field label="Postleitzahl">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    inputMode="numeric"
                    aria-describedby={describedBy}
                    autoComplete="postal-code"
                    value={flow.data.plz}
                    onChange={(e) => flow.set('plz', e.target.value)}
                  />
                )}
              </Field>

              <Field label="Ort" className="sm:col-span-2">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    autoComplete="address-level2"
                    value={flow.data.ort}
                    onChange={(e) => flow.set('ort', e.target.value)}
                  />
                )}
              </Field>
            </div>
          </div>

          <p className="text-[13px] leading-relaxed text-foreground-subtle">
            Wir verwenden Ihre Angaben ausschließlich zur Bearbeitung dieser Anfrage. Die Fotos
            werden nach {photoRetentionDays} Tagen gelöscht. Einzelheiten stehen in der{' '}
            <Link href="/rechtliches/datenschutz" className="font-semibold text-primary hover:underline">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
      )}

      {flow.step?.id === 'absenden' && (
        <div className="max-w-3xl space-y-6">
          <Alert tone="legal" title="Noch kein Vertrag">
            Mit dem Absenden stellen Sie eine Anfrage. Preis und Machbarkeit nennen wir Ihnen
            nach der Prüfung. Ein Auftrag kommt erst zustande, wenn Sie ihn danach ausdrücklich
            erteilen. Ihren Originalschlüssel senden Sie zunächst nicht ein.
          </Alert>

          <SummaryList sections={summary} />

          {(fotoVorderseite.length === 0
            || fotoRueckseite.length === 0
            || fotoSpitze.length === 0) && (
            <Alert tone="warning" title="Fotos fehlen">
              Mindestens eine der drei Pflichtaufnahmen fehlt — das passiert zum Beispiel, wenn
              die Seite zwischendurch neu geladen wurde. Fotos werden aus Datenschutzgründen
              nicht zwischengespeichert.
              <span className="mt-3 block">
                <Button variant="outline" size="sm" onClick={() => flow.goTo('foto-vorderseite')}>
                  Zu den Fotoschritten
                </Button>
              </span>
            </Alert>
          )}

          <p className="text-[13px] leading-relaxed text-foreground-subtle">
            Sie können jeden Schritt über die Fortschrittsanzeige erneut aufrufen und Angaben
            ändern, solange Sie nicht abgesendet haben.
          </p>
        </div>
      )}
    </FlowShell>
  );
}

/* ---------- Ein Fotoschritt --------------------------------------------- */

function FotoSchritt({
  id,
  label,
  description,
  example,
  files,
  onChange,
  hint,
  retentionDays,
}: {
  id: string;
  label: string;
  description: string;
  example: ImageSlot;
  files: PickedFile[];
  onChange: (files: PickedFile[]) => void;
  hint: InfoHint;
  retentionDays: number;
}) {
  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-foreground">Worauf es bei der Aufnahme ankommt</p>
        <InfoTip hint={hint} />
      </div>

      <ul className="space-y-2">
        {AUFNAHME_HINWEISE.map((tipp) => (
          <li key={tipp} className="flex gap-2.5">
            <CheckCircle2 size={15} aria-hidden className="mt-0.5 shrink-0 text-primary" />
            <span className="text-[14px] leading-relaxed text-foreground-muted">{tipp}</span>
          </li>
        ))}
      </ul>

      <PhotoUpload
        id={id}
        label={label}
        description={description}
        example={example}
        files={files}
        onChange={onChange}
        required
      />

      <p className="text-[13px] leading-relaxed text-foreground-subtle">
        Fotos werden nicht im Browser zwischengespeichert. Nach einem Neuladen der Seite wählen
        Sie sie bitte erneut aus. Nach dem Absenden werden sie nach {retentionDays} Tagen
        gelöscht.
      </p>
    </div>
  );
}
