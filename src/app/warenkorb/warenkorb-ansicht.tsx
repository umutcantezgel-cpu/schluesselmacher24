'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Trash2 } from 'lucide-react';

import { useHydrated } from '@/lib/client-state';
import { useCartStore } from '@/lib/store/cart';
import { availableShipping, cartTotals, priceCylinderOrder, type CylinderPriceBreakdown, unitPriceForCodeLine } from '@/lib/pricing';
import { formatCents, formatMillimeter } from '@/lib/format';
import type {
  Cart,
  CartItem,
  CodeLine,
  CylinderCatalog,
  CylinderOrderDraft,
  ShippingOption,
} from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { OptionCard } from '@/components/forms/option-card';
import { QuantityInput } from '@/components/forms/controls';

export interface WarenkorbAnsichtProps {
  shipping: ShippingOption[];
  codeLines: CodeLine[];
  catalog: CylinderCatalog;
}

type CodePosition = Extract<CartItem, { kind: 'code-schluessel' }>;
type ZylinderPosition = Extract<CartItem, { kind: 'zylinder-schliessung' }>;

type Position =
  | { art: 'code'; item: CodePosition; line: CodeLine | null }
  | { art: 'zylinder'; item: ZylinderPosition; breakdown: CylinderPriceBreakdown };

/** Versandarten, die zu allen Produktklassen im Warenkorb passen. */
function passendeVersandarten(items: CartItem[], shipping: ShippingOption[]): ShippingOption[] {
  if (items.length === 0) return shipping;
  return availableShipping(items, shipping);
}

/** Zusammenstellung einer Zylinder-Position in lesbaren Zeilen. */
function zylinderZeilen(
  draft: CylinderOrderDraft,
  catalog: CylinderCatalog,
): Array<{ label: string; value: string }> {
  const zeilen: Array<{ label: string; value: string }> = [];

  for (const eintrag of draft.items) {
    const form = catalog.forms.find((f) => f.id === eintrag.form);
    const funktion = catalog.functions.find((f) => f.id === eintrag.functionId);
    const masse =
      eintrag.measureBMm === undefined
        ? formatMillimeter(eintrag.measureAMm)
        : `${formatMillimeter(eintrag.measureAMm)} / ${formatMillimeter(eintrag.measureBMm)}`;

    const teile = [masse];
    if (funktion) teile.push(funktion.label);
    teile.push(`${eintrag.qty} Stück`);

    zeilen.push({ label: form?.label ?? eintrag.form, value: teile.join(' · ') });
  }

  zeilen.push({ label: 'Gemeinsame Schlüssel', value: `${draft.keyCount} Stück` });

  const zusatz = draft.extraIds
    .map((id) => catalog.extras.find((extra) => extra.id === id)?.label)
    .filter((label): label is string => Boolean(label));
  if (zusatz.length > 0) {
    zeilen.push({ label: 'Zusatzoptionen', value: zusatz.join(', ') });
  }

  zeilen.push({
    label: 'Spätere Erweiterung',
    value: draft.expandable ? 'Vorgesehen' : 'Nicht vorgesehen',
  });

  return zeilen;
}

/** Erklärung der Staffelpreise einer Codelinie — nur aus den Stammdaten. */
function staffelHinweis(line: CodeLine): string | null {
  if (!line.bulkPrices || line.bulkPrices.length === 0) return null;
  const stufen = [...line.bulkPrices]
    .sort((a, b) => a.minQty - b.minQty)
    .map((stufe) => `ab ${stufe.minQty} Stück ${formatCents(stufe.priceCents)} je Stück`);
  return `Einzelpreis ${formatCents(line.priceCents)} je Stück, ${stufen.join(', ')}.`;
}

export function WarenkorbAnsicht({ shipping, codeLines, catalog }: WarenkorbAnsichtProps) {
  const items = useCartStore((state) => state.items);
  const shippingOptionId = useCartStore((state) => state.shippingOptionId);
  const updateQty = useCartStore((state) => state.updateQty);
  const entfernen = useCartStore((state) => state.remove);
  const setShipping = useCartStore((state) => state.setShipping);

  // Der Warenkorb liegt im Browser. Vor dem Hydrieren wird bewusst nichts
  // angezeigt, damit Server- und Browserausgabe übereinstimmen.
  const geladen = useHydrated();

  const positionen = useMemo<Position[]>(
    () =>
      items.map((item) => {
        if (item.kind === 'code-schluessel') {
          const line = codeLines.find((eintrag) => eintrag.id === item.codeLineId) ?? null;
          const maxQty = line?.maxQty ?? item.qty;
          const qty = Math.min(Math.max(1, item.qty), Math.max(1, maxQty));
          // Preis wie beim Absenden ermitteln, damit die Summe stimmt.
          const unitPriceCents = line ? unitPriceForCodeLine(line, qty) : item.unitPriceCents;
          return { art: 'code', item: { ...item, qty, unitPriceCents }, line };
        }
        const breakdown = priceCylinderOrder(item.draft, catalog);
        return {
          art: 'zylinder',
          item: { ...item, unitPriceCents: breakdown.totalCents },
          breakdown,
        };
      }),
    [items, codeLines, catalog],
  );

  const versandarten = useMemo(() => passendeVersandarten(items, shipping), [items, shipping]);

  // Ohne gewählte Versandart lässt sich keine Gesamtsumme nennen.
  useEffect(() => {
    if (!geladen || items.length === 0) return;
    const gewaehlt = versandarten.some((option) => option.id === shippingOptionId);
    if (!gewaehlt && versandarten[0]) setShipping(versandarten[0].id);
  }, [geladen, items.length, versandarten, shippingOptionId, setShipping]);

  const cart: Cart = useMemo(
    // Der Zeitstempel wird erst beim Absenden auf dem Server gesetzt.
    () => ({ items: positionen.map((position) => position.item), shippingOptionId, updatedAt: '' }),
    [positionen, shippingOptionId],
  );

  const summen = cartTotals(cart, shipping);
  const gewaehlteVersandart = shipping.find((option) => option.id === shippingOptionId) ?? null;
  const nichtVerfuegbar = positionen.some(
    (position) => position.art === 'code' && (!position.line || !position.line.active),
  );

  if (!geladen) {
    return (
      <Card>
        <CardBody>
          <p className="text-[15px] text-foreground-muted" role="status">
            Warenkorb wird geladen.
          </p>
        </CardBody>
      </Card>
    );
  }

  if (positionen.length === 0) {
    return (
      <Card>
        <CardBody className="max-w-xl">
          <h2 className="text-lg font-bold text-foreground">Ihr Warenkorb ist leer</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">
            Sie können Schlüssel über den Schlüsselcode bestellen oder eine Gleichschließung
            selbst zusammenstellen.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/schluessel-nach-code">Schlüssel nach Code</ButtonLink>
            <ButtonLink href="/gleichschliessende-zylinder" variant="outline">
              Gleichschließende Zylinder
            </ButtonLink>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-8">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Positionen <span className="font-normal text-foreground-muted">({positionen.length})</span>
        </h2>

        {nichtVerfuegbar && (
          <Alert tone="warning" title="Eine Position ist derzeit nicht bestellbar">
            Bitte entfernen Sie die betroffene Position. Wenn Sie den Artikel trotzdem benötigen,
            schreiben Sie uns über das Kontaktformular.
          </Alert>
        )}

        <ul className="space-y-4">
          {positionen.map((position) =>
            position.art === 'code' ? (
              <li key={position.item.uid}>
                <Card>
                  <CardBody>
                    <div className="flex gap-4">
                      {position.line && (
                        <div className="hidden w-24 shrink-0 sm:block">
                          <ImagePlaceholder slot={position.line.productImage} compact />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                          <div className="min-w-0">
                            <h3 className="text-[15px] font-bold text-foreground">
                              {position.line ? (
                                <Link
                                  href={`/schluessel-nach-code/${position.line.slug}`}
                                  className="hover:text-primary hover:underline"
                                >
                                  {position.line.name}
                                </Link>
                              ) : (
                                'Schlüssel nach Code'
                              )}
                            </h3>
                            {position.line && (
                              <p className="mt-1 text-[13px] text-foreground-muted">
                                {position.line.manufacturer} · {position.line.application} ·{' '}
                                {position.line.keyType}
                              </p>
                            )}
                          </div>
                          <Badge tone="outline">Schlüssel nach Code</Badge>
                        </div>

                        <dl className="mt-3 space-y-1 text-[13px]">
                          <div className="flex flex-wrap gap-x-2">
                            <dt className="font-semibold text-foreground-muted">Code:</dt>
                            <dd className="font-mono font-semibold text-foreground">
                              {position.item.code}
                            </dd>
                          </div>
                          {position.item.photoRefs.length > 0 && (
                            <div className="flex flex-wrap gap-x-2">
                              <dt className="font-semibold text-foreground-muted">Fotos:</dt>
                              <dd className="text-foreground">
                                {position.item.photoRefs.length} Datei
                                {position.item.photoRefs.length === 1 ? '' : 'en'} vermerkt
                              </dd>
                            </div>
                          )}
                          {position.item.note && (
                            <div className="flex flex-wrap gap-x-2">
                              <dt className="font-semibold text-foreground-muted">Anmerkung:</dt>
                              <dd className="text-foreground">{position.item.note}</dd>
                            </div>
                          )}
                        </dl>

                        {position.line && !position.line.active && (
                          <p className="mt-3 text-[13px] font-semibold text-danger">
                            Diese Codelinie ist derzeit nicht bestellbar.
                          </p>
                        )}
                        {!position.line && (
                          <p className="mt-3 text-[13px] font-semibold text-danger">
                            Diese Codelinie gibt es nicht mehr. Bitte entfernen Sie die Position.
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-semibold text-foreground-muted">
                                Stückzahl
                              </span>
                              {position.line && staffelHinweis(position.line) && (
                                <InfoTip
                                  hint={{
                                    title: 'Preis nach Stückzahl',
                                    body: staffelHinweis(position.line) ?? '',
                                  }}
                                />
                              )}
                            </div>
                            <div className="mt-1.5">
                              <QuantityInput
                                value={position.item.qty}
                                onChange={(wert) =>
                                  updateQty(
                                    position.item.uid,
                                    wert,
                                    position.line
                                      ? unitPriceForCodeLine(position.line, wert)
                                      : undefined,
                                  )
                                }
                                min={1}
                                max={position.line?.maxQty ?? position.item.qty}
                                label={`Stückzahl ${position.line?.name ?? 'Schlüssel nach Code'}`}
                              />
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[13px] text-foreground-muted">
                              {formatCents(position.item.unitPriceCents)} je Stück
                            </p>
                            <p className="font-display text-lg font-bold text-foreground">
                              {formatCents(position.item.unitPriceCents * position.item.qty)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Button
                            variant="ghost"
                            onClick={() => entfernen(position.item.uid)}
                            className="px-0"
                          >
                            <Trash2 size={16} aria-hidden />
                            Position entfernen
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ) : (
              <li key={position.item.uid}>
                <Card>
                  <CardBody>
                    <div className="flex gap-4">
                      <div className="hidden w-24 shrink-0 sm:block">
                        <ImagePlaceholder
                          slot={{
                            motif: 'Produktfoto: Satz gleichschließender Zylinder mit gemeinsamen Schlüsseln',
                            ratio: '1/1',
                          }}
                          compact
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                          <h3 className="text-[15px] font-bold text-foreground">
                            Gleichschließende Zylinder
                          </h3>
                          <Badge tone="outline">Zusammenstellung</Badge>
                        </div>

                        <p className="mt-1 text-[13px] text-foreground-muted">
                          {position.breakdown.cylinderCount} Zylinder · eine gemeinsame Schließung
                        </p>

                        <dl className="mt-3 divide-y divide-border border-y border-border">
                          {zylinderZeilen(position.item.draft, catalog).map((zeile, index) => (
                            <div
                              key={`${zeile.label}-${index}`}
                              className="grid gap-0.5 py-2 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-4"
                            >
                              <dt className="text-[13px] font-semibold text-foreground-muted">
                                {zeile.label}
                              </dt>
                              <dd className="text-[14px] text-foreground">{zeile.value}</dd>
                            </div>
                          ))}
                        </dl>

                        {position.item.note && (
                          <p className="mt-3 text-[13px] text-foreground-muted">
                            <span className="font-semibold">Anmerkung:</span> {position.item.note}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                          <p className="text-[13px] text-foreground-muted">
                            Stückzahl 1 — eine Zusammenstellung. Weitere Zylinder ändern Sie im
                            Konfigurator.
                          </p>
                          <p className="font-display text-lg font-bold text-foreground">
                            {formatCents(position.item.unitPriceCents)}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => entfernen(position.item.uid)}
                            className="px-0"
                          >
                            <Trash2 size={16} aria-hidden />
                            Position entfernen
                          </Button>
                          <Link
                            href="/gleichschliessende-zylinder/konfigurator"
                            className="inline-flex min-h-[44px] items-center text-[14px] font-semibold text-primary hover:underline"
                          >
                            Zusammenstellung ändern
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ),
          )}
        </ul>
      </div>

      {/* Versand und Summe */}
      <div className="space-y-4 lg:sticky lg:top-24">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-foreground">Versandart</h2>
              <InfoTip
                hint={{
                  title: 'Versandarten',
                  body:
                    'Verfolgbar bedeutet, dass Sie den Weg der Sendung online nachvollziehen '
                    + 'können. Versichert bedeutet, dass der Wert der Sendung auf dem Transportweg '
                    + 'abgesichert ist. Welche Arten angeboten werden, hängt davon ab, was in '
                    + 'Ihrem Warenkorb liegt.',
                }}
              />
            </div>
          </CardHeader>
          <CardBody>
            {versandarten.length === 0 ? (
              <Alert tone="warning" title="Keine passende Versandart">
                Für diese Kombination aus Artikeln ist keine gemeinsame Versandart hinterlegt.
                Bitte bestellen Sie die Positionen getrennt oder sprechen Sie uns an.
              </Alert>
            ) : (
              <div className="space-y-2">
                {versandarten.map((option) => (
                  <OptionCard
                    key={option.id}
                    name="versandart"
                    value={option.id}
                    checked={shippingOptionId === option.id}
                    onSelect={() => setShipping(option.id)}
                    title={option.label}
                    description={option.description}
                    meta={formatCents(option.priceCents)}
                    info={{
                      title: option.label,
                      body: [
                        option.description,
                        option.tracked ? 'Mit Sendungsverfolgung.' : 'Ohne Sendungsverfolgung.',
                        option.insured ? 'Versichert.' : 'Ohne zusätzliche Versicherung.',
                      ].join(' '),
                    }}
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-[15px] font-bold text-foreground">Summe</h2>
          </CardHeader>
          <CardBody>
            <dl className="space-y-2 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-foreground-muted">Zwischensumme</dt>
                <dd className="font-semibold text-foreground">{formatCents(summen.itemsCents)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-foreground-muted">
                  Versand{gewaehlteVersandart ? ` (${gewaehlteVersandart.label})` : ''}
                </dt>
                <dd className="font-semibold text-foreground">
                  {formatCents(summen.shippingCents)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="font-bold text-foreground">Gesamtsumme</dt>
                <dd className="font-display text-xl font-bold text-foreground">
                  {formatCents(summen.totalCents)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-foreground-subtle">
                  darin enthaltene Umsatzsteuer ({Math.round(summen.vatRate * 100)} %)
                </dt>
                <dd className="text-foreground-subtle">{formatCents(summen.vatCents)}</dd>
              </div>
            </dl>

            <div className="mt-5">
              {gewaehlteVersandart && !nichtVerfuegbar ? (
                <ButtonLink href="/kasse" size="lg" fullWidth>
                  Zur Kasse
                  <ArrowRight size={17} aria-hidden />
                </ButtonLink>
              ) : (
                <Button size="lg" fullWidth disabled>
                  Zur Kasse
                </Button>
              )}
              {!gewaehlteVersandart && versandarten.length > 0 && (
                <p className="mt-2 text-[13px] text-foreground-subtle">
                  Bitte wählen Sie zuerst eine Versandart.
                </p>
              )}
            </div>

            <div className="mt-5">
              <Alert tone="info" title="Hinweis zur Preisberechnung">
                Der endgültige Preis wird beim Absenden der Bestellung noch einmal auf unserem
                Server berechnet. Maßgeblich sind die dort hinterlegten Preise.
              </Alert>
            </div>
          </CardBody>
        </Card>

        <p className="text-[13px] leading-relaxed text-foreground-muted">
          Weiter einkaufen:{' '}
          <Link href="/schluessel-nach-code" className="font-semibold text-primary hover:underline">
            Schlüssel nach Code
          </Link>{' '}
          oder{' '}
          <Link
            href="/gleichschliessende-zylinder/konfigurator"
            className="font-semibold text-primary hover:underline"
          >
            Zylinder-Konfigurator
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
