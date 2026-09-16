'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { Printer } from 'lucide-react';

import {
  addInternalNote,
  setPaymentPaid,
  setRecordStatus,
  type SaveResult,
} from '@/lib/actions/admin';
import type { RecordStatus } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { Select, TextArea } from '@/components/forms/controls';

/* ==========================================================================
   Bearbeitungsschritte am Vorgang
   Jede Aktion läuft über eine vorhandene Server Action und zeigt danach
   sichtbar, ob gespeichert wurde. Ist die Umgebung schreibgeschützt,
   erscheint der Hinweis der Server Action unverändert.
   ========================================================================== */

const STATUS_REIHENFOLGE: RecordStatus[] = [
  'neu',
  'in-pruefung',
  'geprueft',
  'wartet-auf-kunde',
  'in-fertigung',
  'terminiert',
  'versendet',
  'abgeschlossen',
  'storniert',
];

const STATUS_LABELS: Record<RecordStatus, string> = {
  neu: 'Eingegangen',
  'in-pruefung': 'In Prüfung',
  geprueft: 'Geprüft',
  'wartet-auf-kunde': 'Wartet auf Kundin oder Kunde',
  'in-fertigung': 'In Fertigung',
  terminiert: 'Termin vereinbart',
  versendet: 'Versendet',
  abgeschlossen: 'Abgeschlossen',
  storniert: 'Storniert',
};

function fehlerText(fehler: unknown): string {
  return fehler instanceof Error
    ? fehler.message
    : 'Die Änderung konnte nicht gespeichert werden. Bitte später erneut versuchen.';
}

/** Rückmeldung zu einer Aktion — immer sichtbar, auch für Bildschirmleser. */
function Rueckmeldung({ ergebnis }: { ergebnis: SaveResult | null }) {
  return (
    <div aria-live="polite" className={ergebnis ? 'mt-4' : undefined}>
      {ergebnis && (
        <Alert
          tone={ergebnis.ok ? 'success' : 'warning'}
          title={ergebnis.ok ? 'Gespeichert' : 'Nicht gespeichert'}
        >
          {ergebnis.message}
        </Alert>
      )}
    </div>
  );
}

export interface VorgangsAktionenProps {
  id: string;
  aktuellerStatus: RecordStatus;
  /** Ob am Vorgang überhaupt eine Zahlung hinterlegt ist. */
  zahlungVorhanden: boolean;
  /** Ob die Zahlung bereits als eingegangen vermerkt ist. */
  zahlungBezahlt: boolean;
}

export function VorgangsAktionen({
  id,
  aktuellerStatus,
  zahlungVorhanden,
  zahlungBezahlt,
}: VorgangsAktionenProps) {
  const [status, setStatus] = useState<RecordStatus>(aktuellerStatus);
  const [begruendung, setBegruendung] = useState('');
  const [statusMeldung, setStatusMeldung] = useState<SaveResult | null>(null);
  const [statusLaeuft, startStatus] = useTransition();

  const [notiz, setNotiz] = useState('');
  const [notizMeldung, setNotizMeldung] = useState<SaveResult | null>(null);
  const [notizLaeuft, startNotiz] = useTransition();

  const [zahlungMeldung, setZahlungMeldung] = useState<SaveResult | null>(null);
  const [zahlungLaeuft, startZahlung] = useTransition();

  function statusSpeichern(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMeldung(null);

    startStatus(async () => {
      try {
        const ergebnis = await setRecordStatus(id, status, begruendung.trim() || undefined);
        setStatusMeldung(ergebnis);
        if (ergebnis.ok) setBegruendung('');
      } catch (fehler) {
        setStatusMeldung({ ok: false, message: fehlerText(fehler) });
      }
    });
  }

  function notizSpeichern(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = notiz.trim();

    if (text.length === 0) {
      setNotizMeldung({ ok: false, message: 'Bitte zuerst einen Text für die Notiz eingeben.' });
      return;
    }

    setNotizMeldung(null);
    startNotiz(async () => {
      try {
        const ergebnis = await addInternalNote(id, text);
        setNotizMeldung(ergebnis);
        if (ergebnis.ok) setNotiz('');
      } catch (fehler) {
        setNotizMeldung({ ok: false, message: fehlerText(fehler) });
      }
    });
  }

  function zahlungBestaetigen() {
    setZahlungMeldung(null);
    startZahlung(async () => {
      try {
        setZahlungMeldung(await setPaymentPaid(id));
      } catch (fehler) {
        setZahlungMeldung({ ok: false, message: fehlerText(fehler) });
      }
    });
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <h2 className="font-display text-base font-bold text-foreground">Status ändern</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
            Der neue Status wird zusammen mit der Begründung in der Zeitleiste festgehalten.
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={statusSpeichern} className="space-y-4">
            <Field label="Neuer Status">
              {({ id: feldId }) => (
                <Select
                  id={feldId}
                  value={status}
                  onChange={(event) => setStatus(event.target.value as RecordStatus)}
                >
                  {STATUS_REIHENFOLGE.map((wert) => (
                    <option key={wert} value={wert}>
                      {STATUS_LABELS[wert]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field
              label="Begründung"
              hint="Freiwillig. Wird in der Zeitleiste des Vorgangs mitgeschrieben."
            >
              {({ id: feldId, describedBy }) => (
                <TextArea
                  id={feldId}
                  rows={3}
                  value={begruendung}
                  aria-describedby={describedBy}
                  onChange={(event) => setBegruendung(event.target.value)}
                  placeholder="Zum Beispiel: Rückfrage zum Fahrzeugschein gestellt."
                />
              )}
            </Field>

            <Button type="submit" loading={statusLaeuft}>
              Status speichern
            </Button>
          </form>

          <Rueckmeldung ergebnis={statusMeldung} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display text-base font-bold text-foreground">Interne Notiz hinzufügen</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
            Interne Notizen sind nur intern sichtbar und erscheinen nicht in der Kundenansicht.
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={notizSpeichern} className="space-y-4">
            <Field label="Notiz" hint="Kurz und sachlich, damit alle im Betrieb den Stand nachvollziehen können.">
              {({ id: feldId, describedBy }) => (
                <TextArea
                  id={feldId}
                  rows={4}
                  value={notiz}
                  aria-describedby={describedBy}
                  onChange={(event) => setNotiz(event.target.value)}
                  placeholder="Zum Beispiel: Rohling bestellt, Lieferung angekündigt."
                />
              )}
            </Field>

            <Button type="submit" variant="secondary" loading={notizLaeuft}>
              Notiz speichern
            </Button>
          </form>

          <Rueckmeldung ergebnis={notizMeldung} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display text-base font-bold text-foreground">Zahlungseingang bestätigen</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
            Solange kein Zahlungsdienstleister angebunden ist, wird der Eingang hier von Hand
            vermerkt.
          </p>
        </CardHeader>
        <CardBody>
          {!zahlungVorhanden ? (
            <p className="text-[15px] text-foreground-muted">
              Für diesen Vorgang ist keine Zahlung hinterlegt. Es gibt daher nichts zu bestätigen.
            </p>
          ) : zahlungBezahlt ? (
            <p className="text-[15px] text-foreground-muted">
              Der Zahlungseingang ist bereits vermerkt.
            </p>
          ) : (
            <Button type="button" onClick={zahlungBestaetigen} loading={zahlungLaeuft}>
              Zahlung als eingegangen vermerken
            </Button>
          )}

          <Rueckmeldung ergebnis={zahlungMeldung} />
        </CardBody>
      </Card>
    </div>
  );
}

/** Löst den Ausdruck des Projektberichts aus. */
export function DruckKnopf() {
  return (
    <Button type="button" variant="outline" onClick={() => window.print()}>
      <Printer size={16} aria-hidden />
      Projektbericht drucken
    </Button>
  );
}
