'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, CircleDashed } from 'lucide-react';

import { saveContent } from '@/lib/actions/admin';
import type { SaveResult } from '@/lib/actions/admin';
import type { IntegrationStatus } from '@/lib/integrations';
import { formatDateTime } from '@/lib/format';
import type { CompanyProfile, Settings } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { TextInput } from '@/components/forms/controls';

/* ---------- Firmendaten ------------------------------------------------- */

const FIRMENFELDER: Array<{
  key: keyof Omit<CompanyProfile, 'isPlaceholder' | 'brandName'>;
  label: string;
  hint?: string;
  span?: boolean;
}> = [
  { key: 'legalName', label: 'Vollständige Firmierung', hint: 'Wie im Handelsregister eingetragen.', span: true },
  { key: 'street', label: 'Straße und Hausnummer', span: true },
  { key: 'postalCode', label: 'Postleitzahl' },
  { key: 'city', label: 'Ort' },
  { key: 'country', label: 'Land' },
  { key: 'phone', label: 'Telefon' },
  { key: 'email', label: 'E-Mail-Adresse' },
  { key: 'managingDirector', label: 'Vertretungsberechtigte Person' },
  { key: 'registerCourt', label: 'Registergericht' },
  { key: 'registerNumber', label: 'Registernummer' },
  { key: 'vatId', label: 'Umsatzsteuer-Identifikationsnummer', span: true },
];

const FRISTEN: Array<{ key: keyof Settings['retentionDays']; label: string; hint: string }> = [
  {
    key: 'vehicleRegistration',
    label: 'Fahrzeugschein',
    hint: 'Hochgeladene Zulassungsbescheinigungen aus dem Autoschlüssel-Ablauf.',
  },
  {
    key: 'keyPhotos',
    label: 'Schlüsselfotos',
    hint: 'Fotos aus Autoschlüssel-Anfragen und Schlüssel nach Vorlage.',
  },
  {
    key: 'floorPlans',
    label: 'Grundrisse und Objektpläne',
    hint: 'Unterlagen aus Schließanlagen- und Sicherheitsprojekten.',
  },
  {
    key: 'projectDocuments',
    label: 'Projektunterlagen',
    hint: 'Türlisten, Schließpläne und sonstige Projektdokumente.',
  },
];

/** Ein Feld gilt als Platzhalter, solange es mit einer eckigen Klammer beginnt. */
function istPlatzhalter(wert: string): boolean {
  return wert.trim().startsWith('[');
}

function ganzzahl(value: string): number | null {
  const text = value.trim();
  if (!/^\d+$/.test(text)) return null;
  return Number(text);
}

export interface EinstellungenFormularProps {
  settings: Settings;
  integrations: IntegrationStatus[];
  adapterName: string;
  writable: boolean;
}

export function EinstellungenFormular({
  settings,
  integrations,
  adapterName,
  writable,
}: EinstellungenFormularProps) {
  const router = useRouter();
  const [firma, setFirma] = useState<CompanyProfile>(settings.company);
  const [fristen, setFristen] = useState<Settings['retentionDays']>(settings.retentionDays);
  const [firmenMeldung, setFirmenMeldung] = useState<SaveResult | null>(null);
  const [fristenMeldung, setFristenMeldung] = useState<SaveResult | null>(null);
  const [speichert, starteSpeichern] = useTransition();

  const offenePlatzhalter = FIRMENFELDER.filter(({ key }) => istPlatzhalter(String(firma[key])));
  const firmaGeaendert = JSON.stringify(firma) !== JSON.stringify(settings.company);
  const fristenGeaendert = JSON.stringify(fristen) !== JSON.stringify(settings.retentionDays);

  function firmaSpeichern() {
    // Sobald kein Feld mehr in eckigen Klammern steht, gelten die Daten als gepflegt.
    const nochPlatzhalter = FIRMENFELDER.some(({ key }) => istPlatzhalter(String(firma[key])));
    const naechste: Settings = {
      ...settings,
      company: { ...firma, isPlaceholder: nochPlatzhalter },
      updatedAt: new Date().toISOString(),
    };

    starteSpeichern(async () => {
      const ergebnis = await saveContent('settings', naechste);
      setFirmenMeldung(ergebnis);
      if (ergebnis.ok) router.refresh();
    });
  }

  function fristenSpeichern() {
    const naechste: Settings = {
      ...settings,
      retentionDays: fristen,
      updatedAt: new Date().toISOString(),
    };

    starteSpeichern(async () => {
      const ergebnis = await saveContent('settings', naechste);
      setFristenMeldung(ergebnis);
      if (ergebnis.ok) router.refresh();
    });
  }

  return (
    <div className="mt-8 space-y-8">
      {/* ── Firmendaten ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-bold text-foreground">Firmendaten</h2>
            <p className="mt-0.5 text-[13px] text-foreground-muted">
              Erscheinen im Impressum, in der Datenschutzerklärung und im Fußbereich.
            </p>
          </div>
          {firmaGeaendert && <Badge tone="warning">Ungespeicherte Änderungen</Badge>}
        </CardHeader>

        <CardBody>
          {offenePlatzhalter.length > 0 && (
            <Alert tone="warning" title="Noch Platzhalter hinterlegt" className="mb-5">
              {offenePlatzhalter.length} von {FIRMENFELDER.length} Feldern enthalten noch einen
              Platzhalter. Solange das so ist, weist die Website im Fußbereich darauf hin und lässt
              die Firmenangaben aus den strukturierten Daten für Suchmaschinen weg.
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {FIRMENFELDER.map((feld) => (
              <Field
                key={String(feld.key)}
                label={feld.label}
                hint={feld.hint}
                error={
                  istPlatzhalter(String(firma[feld.key])) ? 'Noch ein Platzhalter' : undefined
                }
                className={feld.span ? 'sm:col-span-2' : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    value={String(firma[feld.key])}
                    onChange={(e) => setFirma((prev) => ({ ...prev, [feld.key]: e.target.value }))}
                  />
                )}
              </Field>
            ))}
          </div>

          <p className="mt-5 text-[13px] text-foreground-subtle">
            Zuletzt gespeichert: {formatDateTime(settings.updatedAt)}
          </p>
        </CardBody>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <div aria-live="polite" className="min-w-0 flex-1">
            {firmenMeldung && (
              <p
                className={[
                  'text-[13px] font-semibold',
                  firmenMeldung.ok ? 'text-success' : 'text-danger',
                ].join(' ')}
              >
                {firmenMeldung.message}
              </p>
            )}
          </div>
          <Button onClick={firmaSpeichern} loading={speichert} disabled={!firmaGeaendert || !writable}>
            Firmendaten speichern
          </Button>
        </CardFooter>
      </Card>

      {/* ── Aufbewahrungsfristen ─────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-bold text-foreground">Aufbewahrungsfristen</h2>
            <p className="mt-0.5 text-[13px] text-foreground-muted">
              Gelten für hochgeladene Kundenunterlagen, in Tagen.
            </p>
          </div>
          {fristenGeaendert && <Badge tone="warning">Ungespeicherte Änderungen</Badge>}
        </CardHeader>

        <CardBody>
          <Alert tone="legal" className="mb-5">
            Diese Fristen erscheinen wörtlich in der Datenschutzerklärung. Gesetzliche
            Aufbewahrungspflichten für Geschäftsunterlagen und Belege bleiben davon unberührt und
            sind gesondert zu prüfen.
          </Alert>

          <div className="grid gap-4 sm:grid-cols-2">
            {FRISTEN.map((eintrag) => (
              <Field key={eintrag.key} label={eintrag.label} hint={eintrag.hint}>
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    inputMode="numeric"
                    value={String(fristen[eintrag.key])}
                    onChange={(e) => {
                      const wert = ganzzahl(e.target.value);
                      if (wert !== null) {
                        setFristen((prev) => ({ ...prev, [eintrag.key]: wert }));
                      }
                    }}
                  />
                )}
              </Field>
            ))}
          </div>
        </CardBody>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <div aria-live="polite" className="min-w-0 flex-1">
            {fristenMeldung && (
              <p
                className={[
                  'text-[13px] font-semibold',
                  fristenMeldung.ok ? 'text-success' : 'text-danger',
                ].join(' ')}
              >
                {fristenMeldung.message}
              </p>
            )}
          </div>
          <Button
            onClick={fristenSpeichern}
            loading={speichert}
            disabled={!fristenGeaendert || !writable}
          >
            Fristen speichern
          </Button>
        </CardFooter>
      </Card>

      {/* ── Anbindungen ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <h2 className="text-[15px] font-bold text-foreground">Externe Anbindungen</h2>
          <p className="mt-0.5 text-[13px] text-foreground-muted">
            Nur Anzeige. Zugangsdaten werden ausschließlich über Umgebungsvariablen gesetzt und
            hier bewusst weder abgefragt noch gespeichert.
          </p>
        </CardHeader>

        <CardBody className="space-y-4">
          {integrations.map((eintrag) => (
            <div key={eintrag.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[15px] font-semibold text-foreground">{eintrag.label}</p>
                {eintrag.configured ? (
                  <Badge tone="success">
                    <CheckCircle2 size={13} aria-hidden />
                    Eingerichtet
                  </Badge>
                ) : (
                  <Badge tone="warning">
                    <CircleDashed size={13} aria-hidden />
                    Noch nicht eingerichtet
                  </Badge>
                )}
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                {eintrag.fallback}
              </p>

              <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Benötigte Umgebungsvariablen
                  </dt>
                  <dd className="mt-1 font-mono text-[12px] text-foreground-muted">
                    {eintrag.requiredEnv.join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Davon nicht gesetzt
                  </dt>
                  <dd className="mt-1 font-mono text-[12px] text-foreground-muted">
                    {eintrag.missingEnv.length === 0 ? 'keine' : eintrag.missingEnv.join(', ')}
                  </dd>
                </div>
              </dl>
            </div>
          ))}

          <Alert tone="info">
            Die Anbindung erfolgt jeweils an einer Stelle in{' '}
            <span className="font-mono">src/lib/integrations/index.ts</span>. Der übrige Ablauf
            bleibt dabei unverändert. Eine Vorlage für die Umgebungsvariablen liegt als{' '}
            <span className="font-mono">.env.example</span> im Projekt.
          </Alert>
        </CardBody>
      </Card>

      {/* ── Datenhaltung ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <h2 className="text-[15px] font-bold text-foreground">Datenhaltung</h2>
        </CardHeader>
        <CardBody className="space-y-3 text-[14px] leading-relaxed text-foreground-muted">
          <p>
            Die Inhalte liegen als JSON-Dateien im Ordner{' '}
            <span className="font-mono">content/</span>. Aktiver Adapter:{' '}
            <span className="font-mono">{adapterName}</span> — Speichern ist derzeit{' '}
            <strong className={writable ? 'text-success' : 'text-danger'}>
              {writable ? 'möglich' : 'nicht möglich'}
            </strong>
            .
          </p>
          <p>
            Fehlt eine Datei, greift der eingebaute Standardinhalt aus{' '}
            <span className="font-mono">src/lib/data/defaults/</span>. So ist eine frisch
            aufgesetzte Umgebung sofort vollständig.
          </p>
          <p>
            Auf Plattformen mit schreibgeschütztem Dateisystem lassen sich Inhalte nicht über das
            Backend ändern. Für den laufenden Betrieb muss dort ein Datenbank-Adapter in{' '}
            <span className="font-mono">src/lib/data/index.ts</span> hinterlegt werden. Die
            Schnittstelle dafür ist <span className="font-mono">DataAdapter</span>; alle
            aufrufenden Stellen bleiben unverändert.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
