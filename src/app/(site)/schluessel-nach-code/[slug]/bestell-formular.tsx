'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import type { CodeLine, ImageSlot, UploadRef } from '@/lib/types';
import { unitPriceForCodeLine } from '@/lib/pricing';
import { formatCents, formatNumber } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useCartStore } from '@/lib/store/cart';
import { PreisHinweis } from '@/components/recht/preis-hinweis';
import { Alert } from '@/components/ui/alert';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { QuantityInput, TextInput } from '@/components/forms/controls';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphWarenkorb } from '@/components/visual/glyphen/warenkorb';
import { LiveSchluessel } from '@/components/visual/interaktiv/live-schluessel';

export interface BestellFormularProps {
  line: CodeLine;
}

/**
 * Bestellung einer Codelinie: Code prüfen, Stückzahl wählen, Warenkorb füllen.
 *
 * Die Prüfung des Codes läuft beim Tippen mit, der Fehlertext erscheint aber
 * erst, wenn das Feld verlassen wurde — sonst wird schon während der ersten
 * Zeichen bemängelt.
 */
export function BestellFormular({ line }: BestellFormularProps) {
  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);
  const [qty, setQty] = useState(1);
  const [photos, setPhotos] = useState<PickedFile[]>([]);
  const [photoTouched, setPhotoTouched] = useState(false);
  const [added, setAdded] = useState(false);

  const addCodeKey = useCartStore((state) => state.addCodeKey);

  const pattern = useMemo(() => {
    try {
      return new RegExp(line.codePattern);
    } catch {
      // Unbrauchbares Muster in den Daten darf die Bestellung nicht blockieren.
      return null;
    }
  }, [line.codePattern]);

  const trimmed = code.trim();

  // Kleinbuchstaben werden übernommen, wenn die Großschreibung zum Muster passt.
  const normalized = useMemo(() => {
    if (!pattern || trimmed === '') return trimmed;
    if (pattern.test(trimmed)) return trimmed;
    const upper = trimmed.toUpperCase();
    return pattern.test(upper) ? upper : trimmed;
  }, [pattern, trimmed]);

  const codeValid = trimmed !== '' && (pattern === null || pattern.test(normalized));

  const codeError = !touched || codeValid
    ? undefined
    : trimmed === ''
      ? 'Bitte geben Sie den Schlüsselcode ein.'
      : `Der Code passt nicht zum erwarteten Format. Erwartet wird: ${line.codeFormatLabel}. `
        + `Beispiel: ${line.codeExample}.`;

  const showPhotoUpload = line.photoUpload !== 'nein';
  const photoRequired = line.photoUpload === 'pflicht';
  const photoMissing = photoRequired && photos.length === 0;

  const unitPriceCents = unitPriceForCodeLine(line, qty);
  const totalCents = unitPriceCents * qty;

  // Grundpreis und Staffel in einer Tabelle — so ist die Ersparnis sichtbar.
  const tiers = useMemo(
    () =>
      [{ minQty: 1, priceCents: line.priceCents }, ...(line.bulkPrices ?? [])].sort(
        (a, b) => a.minQty - b.minQty,
      ),
    [line.priceCents, line.bulkPrices],
  );
  const activeTierIndex = tiers.reduce(
    (best, tier, index) => (qty >= tier.minQty ? index : best),
    0,
  );

  const photoExample: ImageSlot = {
    motif: `Beispielfoto: ${line.keyType} flach liegend, Beschriftung und Profil lesbar`,
    ratio: '4/3',
    note: 'Aufnahme bei Tageslicht ohne Blitz, Schlüssel formatfüllend im Bild.',
  };

  const canSubmit = codeValid && !photoMissing;

  async function handleAdd() {
    setTouched(true);
    setPhotoTouched(true);
    if (!canSubmit) return;

    // Laufende Uploads abschließen, damit Kennung und Schlüssel mitgehen.
    await uploadsAbwarten();
    const photoRefs: UploadRef[] = photos.map((file) => ({
      id: file.id,
      ...alsUpload(file, 'schluesselfoto'),
      uploadedAt: new Date().toISOString(),
    }));

    addCodeKey({
      codeLineId: line.id,
      code: normalized,
      qty,
      unitPriceCents,
      photoRefs,
    });

    setCode(normalized);
    setAdded(true);
  }

  /** Jede Änderung nach dem Hinzufügen bezieht sich auf einen neuen Artikel. */
  function markDirty() {
    if (added) setAdded(false);
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-title-sm font-semibold text-foreground">Schlüssel nach Code bestellen</h2>
        <p className="mt-1 text-small leading-relaxed text-foreground-muted">
          Sie behalten Ihren Originalschlüssel. Wir fertigen allein nach dem Code, den Sie hier
          eintragen.
        </p>
      </CardHeader>

      <CardBody className="flex flex-col gap-6">
        {/* Schlüsselcode */}
        <Field
          label="Schlüsselcode"
          required
          error={codeError}
          hint={`Erwartetes Format: ${line.codeFormatLabel}. Beispiel: ${line.codeExample}.`}
          info={{
            title: 'Wo steht der Code?',
            body: line.codeHint,
            figure: line.codeLocationImage,
          }}
        >
          {({ id, describedBy, invalid }) => (
            <>
              <div className="relative">
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={code}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  placeholder={line.codeExample}
                  className={cn('font-mono tracking-wide', codeValid && 'pr-11')}
                  onChange={(event) => {
                    setCode(event.target.value);
                    markDirty();
                  }}
                  onBlur={() => {
                    setTouched(true);
                    // Schreibweise angleichen, sobald das Feld verlassen wird.
                    if (normalized !== code) setCode(normalized);
                  }}
                />
                {codeValid && (
                  <span
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-success"
                    aria-hidden
                  >
                    <GlyphHaken size={18} />
                  </span>
                )}
              </div>

              {/* Dauerhafter Bereich, damit die Rueckmeldung vorgelesen wird. */}
              <div aria-live="polite">
                {codeValid && (
                  <p className="text-small font-semibold text-success">
                    Der Code passt zum erwarteten Format.
                  </p>
                )}
              </div>
            </>
          )}
        </Field>

        {/* Live-Schlüssel: das Profil folgt dem eingegebenen Code (B-15) */}
        <LiveSchluessel code={codeValid ? normalized : ''} className="mt-4" />

        {/* Stückzahl und Staffel */}
        <div>
          <Field
            label="Stückzahl"
            hint={`Höchstens ${formatNumber(line.maxQty)} Stück je Bestellung.`}
            info={{
              title: 'Staffelpreise',
              body:
                'Ab bestimmten Stückzahlen sinkt der Preis je Schlüssel. Die Tabelle unter der '
                + 'Stückzahl zeigt, ab wann welcher Preis gilt. Der Gesamtpreis wird sofort '
                + 'neu berechnet.',
            }}
          >
            {({ id }) => (
              <div>
                <QuantityInput
                  id={id}
                  label="Stückzahl"
                  value={qty}
                  min={1}
                  max={line.maxQty}
                  onChange={(next) => {
                    setQty(next);
                    markDirty();
                  }}
                />
              </div>
            )}
          </Field>

          {tiers.length > 1 && (
            <div className="table-scroll mt-4">
              <table className="w-full border-collapse text-small">
                <caption className="sr-only">
                  Staffelpreise für {line.name}: Preis je Stück nach Stückzahl.
                </caption>
                <thead>
                  <tr className="border-b border-border text-left">
                    <th scope="col" className="py-2 pr-4 font-semibold text-foreground-muted">
                      Ab Stückzahl
                    </th>
                    <th scope="col" className="py-2 font-semibold text-foreground-muted">
                      Preis je Stück
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((tier, index) => (
                    <tr
                      key={`${index}-${tier.minQty}`}
                      className={cn(
                        'border-b border-border last:border-0',
                        index === activeTierIndex && 'bg-primary-soft',
                      )}
                    >
                      <th
                        scope="row"
                        className={cn(
                          'py-2 pr-4 text-left font-mono font-medium tabular-nums text-foreground-muted',
                          index === activeTierIndex && 'font-bold text-primary',
                        )}
                      >
                        {formatNumber(tier.minQty)} Stück
                        {index === activeTierIndex && (
                          <span className="sr-only"> — gilt für Ihre Auswahl</span>
                        )}
                      </th>
                      <td
                        className={cn(
                          'py-2 font-mono tabular-nums text-foreground',
                          index === activeTierIndex && 'font-bold text-primary',
                        )}
                      >
                        {formatCents(tier.priceCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Foto — nur wenn die Codelinie es vorsieht */}
        {showPhotoUpload && (
          <PhotoUpload
            category="schluesselfoto"
            kamera="ruhig"
            id={`foto-${line.slug}`}
            label={photoRequired ? 'Foto des Schlüssels' : 'Foto des Schlüssels (freiwillig)'}
            description={
              line.photoUploadHint
              ?? 'Ein Foto hilft uns, Profil und Beschriftung vor der Fertigung abzugleichen.'
            }
            example={photoExample}
            files={photos}
            onChange={(next) => {
              setPhotos(next);
              setPhotoTouched(true);
              markDirty();
            }}
            required={photoRequired}
            error={
              photoTouched && photoMissing
                ? 'Für diese Codelinie ist ein Foto erforderlich. Bitte fügen Sie eine Aufnahme hinzu.'
                : undefined
            }
          />
        )}

        {/* Preis */}
        <div className="rounded-lg border border-border bg-surface-muted p-4">
          <dl className="space-y-2 text-small">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-foreground-muted">Preis je Stück</dt>
              <dd className="font-mono font-semibold tabular-nums text-foreground">{formatCents(unitPriceCents)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-foreground-muted">Stückzahl</dt>
              <dd className="font-mono font-semibold tabular-nums text-foreground">{formatNumber(qty)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-border pt-2">
              <dt className="font-bold text-foreground">Zwischensumme</dt>
              <dd className="font-mono text-title-sm font-bold tabular-nums text-foreground">
                {formatCents(totalCents)}
              </dd>
            </div>
          </dl>
          <PreisHinweis className="mt-2" />
          <p className="mt-1 text-caption leading-snug text-foreground-muted">
            Die Versandart wählen Sie im Warenkorb. Sie wird dort mit den Kosten ausgewiesen.
          </p>
        </div>

        <div>
          {!canSubmit && (
            <p className="mb-3 flex items-start gap-2 text-small leading-snug text-foreground-muted">
              <GlyphInfo size={16} className="mt-0.5 shrink-0" />
              <span>
                {!codeValid
                  ? 'Bitte tragen Sie zuerst den Schlüsselcode ein.'
                  : 'Bitte fügen Sie das erforderliche Foto hinzu.'}
              </span>
            </p>
          )}

          <Button type="button" size="lg" fullWidth onClick={handleAdd} disabled={!canSubmit}>
            <GlyphWarenkorb size={18} />
            In den Warenkorb
          </Button>
        </div>

        {/* Bestätigung */}
        <div aria-live="polite">
          {added && (
            <Alert tone="success" title="Im Warenkorb">
              <p>
                {formatNumber(qty)} × {line.name} mit dem Code{' '}
                <span className="font-mono font-bold">{normalized}</span> wurde in den Warenkorb
                gelegt.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink href="/warenkorb">
                  Zum Warenkorb
                </ButtonLink>
                <ButtonLink href="/schluessel-nach-code" variant="outline">
                  Weiter stöbern
                </ButtonLink>
              </div>
            </Alert>
          )}
        </div>

        <p className="text-caption leading-relaxed text-foreground-muted">
          Die Fertigung erfolgt nach Ihrer Codeangabe. Bei kundenspezifischer Anfertigung kann das
          Widerrufsrecht eingeschränkt sein — Einzelheiten stehen unter{' '}
          <Link
            href="/rechtliches/widerruf"
            className="inline py-1 -my-1 font-semibold text-primary hover:underline"
          >
            Widerruf und Rückgabe
          </Link>
          .
        </p>
      </CardBody>
    </Card>
  );
}
