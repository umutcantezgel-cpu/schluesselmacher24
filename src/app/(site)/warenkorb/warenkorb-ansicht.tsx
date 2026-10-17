'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';

import { useHydrated } from '@/lib/client-state';
import { useCartStore } from '@/lib/store/cart';
import { availableShipping, cartTotals, priceCylinderOrder, type CylinderPriceBreakdown, unitPriceForCodeLine } from '@/lib/pricing';
import { formatCents } from '@/lib/format';
import { zylinderZeilen } from '@/lib/cylinder-summary';
import { istPlatzhalter } from '@/lib/platzhalter';
import type {
  Cart,
  CartItem,
  CodeLine,
  CylinderCatalog,
  ShippingOption,
  StandardArticle,
} from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { OptionCard } from '@/components/forms/option-card';
import { QuantityInput } from '@/components/forms/controls';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphLaden } from '@/components/visual/glyphen/laden';
import { GlyphPapierkorb } from '@/components/visual/glyphen/papierkorb';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';

export interface WarenkorbAnsichtProps {
  shipping: ShippingOption[];
  codeLines: CodeLine[];
  standardArticles: StandardArticle[];
  catalog: CylinderCatalog;
}

type CodePosition = Extract<CartItem, { kind: 'code-schluessel' }>;
type ZylinderPosition = Extract<CartItem, { kind: 'zylinder-schliessung' }>;
type StandardPosition = Extract<CartItem, { kind: 'standard' }>;

type Position =
  | { art: 'code'; item: CodePosition; line: CodeLine | null }
  | { art: 'zylinder'; item: ZylinderPosition; breakdown: CylinderPriceBreakdown }
  | { art: 'standard'; item: StandardPosition; article: StandardArticle | null };

/** Versandarten, die zu allen Produktklassen im Warenkorb passen. */
function passendeVersandarten(items: CartItem[], shipping: ShippingOption[]): ShippingOption[] {
  if (items.length === 0) return shipping;
  return availableShipping(items, shipping);
}

/** Erklärung der Staffelpreise einer Codelinie — nur aus den Stammdaten. */
function staffelHinweis(line: CodeLine): string | null {
  if (!line.bulkPrices || line.bulkPrices.length === 0) return null;
  const stufen = [...line.bulkPrices]
    .sort((a, b) => a.minQty - b.minQty)
    .map((stufe) => `ab ${stufe.minQty} Stück ${formatCents(stufe.priceCents)} je Stück`);
  return `Einzelpreis ${formatCents(line.priceCents)} je Stück, ${stufen.join(', ')}.`;
}

export function WarenkorbAnsicht({ shipping, codeLines, standardArticles, catalog }: WarenkorbAnsichtProps) {
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
        if (item.kind === 'standard') {
          const article = standardArticles.find((eintrag) => eintrag.id === item.productId) ?? null;
          const qty = Math.min(Math.max(1, item.qty), Math.max(1, article?.maxQty ?? item.qty));
          const unitPriceCents = article ? unitPriceForCodeLine(article, qty) : item.unitPriceCents;
          return {
            art: 'standard',
            item: { ...item, qty, unitPriceCents, shippingClass: article?.shippingClass ?? item.shippingClass },
            article,
          };
        }
        const breakdown = priceCylinderOrder(item.draft, catalog);
        return {
          art: 'zylinder',
          item: { ...item, unitPriceCents: breakdown.totalCents },
          breakdown,
        };
      }),
    [items, codeLines, standardArticles, catalog],
  );

  const versandarten = useMemo(() => passendeVersandarten(items, shipping), [items, shipping]);

  // Ohne gewählte Versandart lässt sich kein Gesamtbetrag nennen.
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
    (position) =>
      (position.art === 'code' && (!position.line || !position.line.active))
      || (position.art === 'standard' && (!position.article || position.article.example)),
  );

  if (!geladen) {
    return (
      /* Gleiche Mindesthöhe wie der Leerzustand: Nach dem Laden springt nichts (CLS). */
      <Card className="min-h-96 sm:min-h-64 lg:col-span-8" data-leerzustand>
        <CardBody>
          <p className="flex items-center gap-3 text-body text-foreground-muted" role="status">
            <GlyphLaden size={18} className="animate-spin motion-reduce:animate-none" />
            Warenkorb wird geladen.
          </p>
        </CardBody>
      </Card>
    );
  }

  if (positionen.length === 0) {
    return (
      <Card className="flex min-h-96 flex-col justify-center sm:min-h-64 lg:col-span-8" data-leerzustand>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-gutter">
          <div aria-hidden="true" className="sm24-ruhig w-40 shrink-0">
            <SchluesselGrafik params={{ typ: 'zylinder', rohling: true }} title="" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-title-sm font-semibold text-foreground">Ihr Warenkorb ist leer</h2>
            <p className="mt-2 text-small text-foreground-muted">
              Sie können Schlüssel über den Schlüsselcode bestellen oder eine Gleichschließung
              selbst zusammenstellen.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/schluessel-nach-code">Schlüssel nach Code</ButtonLink>
              <ButtonLink href="/gleichschliessende-zylinder" variant="outline">
                Gleichschließende Zylinder
              </ButtonLink>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid gap-10 lg:col-span-12 lg:grid-cols-12 lg:items-start lg:gap-gutter">
      <div className="space-y-6 lg:col-span-8">
        <h2 className="text-title-sm font-semibold text-foreground">
          Positionen <span className="font-mono text-small font-normal tabular-nums text-foreground-muted">({positionen.length})</span>
        </h2>

        {nichtVerfuegbar && (
          <Alert tone="warning" title="Eine Position ist derzeit nicht bestellbar">
            Bitte entfernen Sie die betroffene Position. Wenn Sie den Artikel trotzdem benötigen,
            schreiben Sie uns über das Kontaktformular.
          </Alert>
        )}

        {/* Positionen als Stückliste: Haarlinien statt Kartenstapel. Ab sm im Zwölfer-Raster; mobil Bild links, dann Menge und Betrag nebeneinander. */}
        <ul className="border-t border-border">
          {positionen.map((position) =>
            position.art === 'code' ? (
              <li key={position.item.uid} className="border-b border-border py-6">
                <div className="flex flex-col gap-4 sm:grid sm:grid-cols-12 sm:gap-x-4">
                  <div className="flex gap-4 sm:contents">
                    {/* Schlüsselprofil des Codes auf Sunken-Fläche; mobil 64 px breit links vom Titel. */}
                    {position.line && (
                      <div className="sm24-ruhig w-16 shrink-0 self-start overflow-hidden rounded-lg bg-surface-sunken sm:col-span-2 sm:w-auto">
                        <ImagePlaceholder
                          slot={{
                            motif: 'Schlüsselprofil zum Code',
                            ratio: '1/1',
                            visual: { generator: 'schluessel', params: { typ: 'zylinder', code: position.item.code } },
                          }}
                          frei
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 sm:col-span-4 sm:col-start-3">
                      <h3 className="text-title-sm font-semibold text-foreground">
                        {position.line ? (
                          <Link
                            href={`/schluessel-nach-code/${position.line.slug}`}
                            className="inline-flex min-h-touch items-center hover:text-primary hover:underline"
                          >
                            {position.line.name}
                          </Link>
                        ) : (
                          'Schlüssel nach Code'
                        )}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {position.line && (
                          <p className="text-small text-foreground-muted">
                            {istPlatzhalter(position.line.manufacturer) ? null : `${position.line.manufacturer} · `}
                            {position.line.keyType}
                          </p>
                        )}
                        <Badge tone="outline">Schlüssel nach Code</Badge>
                      </div>

                      <dl className="mt-3 space-y-1 text-small">
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="font-semibold text-foreground-muted">Code:</dt>
                          <dd className="font-mono font-semibold tabular-nums text-foreground">
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
                        <p className="mt-3 text-small font-semibold text-danger">
                          Diese Codelinie ist derzeit nicht bestellbar.
                        </p>
                      )}
                      {!position.line && (
                        <p className="mt-3 text-small font-semibold text-danger">
                          Diese Codelinie gibt es nicht mehr. Bitte entfernen Sie die Position.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 sm:contents">
                    <div className="sm:col-span-3 sm:col-start-7">
                      <div className="flex items-center gap-2">
                        <span className="text-small font-semibold text-foreground-muted">Stückzahl</span>
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

                    <div className="text-right font-mono text-small tabular-nums sm:col-span-3 sm:col-start-10">
                      <p key={position.item.unitPriceCents * position.item.qty} className="text-title-sm font-semibold text-foreground animate-schleier-ein">
                        {formatCents(position.item.unitPriceCents * position.item.qty)}
                      </p>
                      <p className="text-caption text-foreground-muted">
                        {formatCents(position.item.unitPriceCents)} je Stück
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-4 sm:col-start-3">
                    <Button
                      variant="ghost"
                      onClick={() => entfernen(position.item.uid)}
                      className="px-0 text-small"
                    >
                      <GlyphPapierkorb size={16} />
                      Position entfernen
                      <span className="sr-only">: {position.line?.name ?? 'Schlüssel nach Code'}</span>
                    </Button>
                  </div>
                </div>
              </li>
            ) : position.art === 'standard' ? (
              <li key={position.item.uid} className="border-b border-border py-6">
                <StandardPositionKarte
                  position={position}
                  onQty={(wert) =>
                    updateQty(
                      position.item.uid,
                      wert,
                      position.article ? unitPriceForCodeLine(position.article, wert) : undefined,
                    )
                  }
                  onRemove={() => entfernen(position.item.uid)}
                />
              </li>
            ) : (
              <li key={position.item.uid} className="border-b border-border py-6">
                <div className="grid gap-4 sm:grid-cols-12 sm:gap-x-4">
                  <div className="hidden sm:col-span-2 sm:block">
                    <ImagePlaceholder
                      slot={{
                        motif: 'Produktfoto: Satz gleichschließender Zylinder mit gemeinsamen Schlüsseln',
                        ratio: '1/1',
                      }}
                      compact
                    />
                  </div>

                  <div className="min-w-0 sm:col-span-7 sm:col-start-3">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <h3 className="text-title-sm font-semibold text-foreground">
                        Gleichschließende Zylinder
                      </h3>
                      <Badge tone="outline">Zusammenstellung</Badge>
                    </div>

                    <p className="mt-1 text-small text-foreground-muted">
                      {position.breakdown.cylinderCount} Zylinder · eine gemeinsame Schließung
                    </p>

                    <dl className="mt-3 divide-y divide-border border-y border-border">
                      {zylinderZeilen(position.item.draft, catalog).map((zeile, index) => (
                        <div
                          key={`${zeile.label}-${index}`}
                          className="grid gap-0.5 py-2 sm:grid-cols-12 sm:gap-x-gutter"
                        >
                          <dt className="text-small font-semibold text-foreground-muted sm:col-span-4">
                            {zeile.label}
                          </dt>
                          <dd className="text-small text-foreground sm:col-span-8">{zeile.value}</dd>
                        </div>
                      ))}
                    </dl>

                    {position.item.note && (
                      <p className="mt-3 text-small text-foreground-muted">
                        <span className="font-semibold">Anmerkung:</span> {position.item.note}
                      </p>
                    )}

                    <p className="mt-3 text-small text-foreground-muted">
                      Stückzahl 1 — eine Zusammenstellung. Weitere Zylinder ändern Sie im
                      Konfigurator.
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => entfernen(position.item.uid)}
                        className="px-0"
                      >
                        <GlyphPapierkorb size={16} />
                        Position entfernen
                        <span className="sr-only">: Gleichschließende Zylinder</span>
                      </Button>
                      <Link
                        href="/gleichschliessende-zylinder/konfigurator"
                        className="inline-flex min-h-touch items-center text-small font-semibold text-primary hover:underline"
                      >
                        Zusammenstellung ändern
                      </Link>
                    </div>
                  </div>

                  <div className="font-mono text-title-sm font-semibold tabular-nums text-foreground sm:col-span-3 sm:col-start-10 sm:text-right">
                    {formatCents(position.item.unitPriceCents)}
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>

        {/* Versandart unter den Positionen: links ab lg, mobil nach der Stückliste */}
        <div>
          <div className="flex items-center gap-2 pt-4">
            <h2 className="text-title-sm font-semibold text-foreground">Versandart</h2>
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
          <div className="mt-6 border-t border-border pt-6">
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
                    metaSpalte
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
          </div>
        </div>

        <p className="text-small leading-relaxed text-foreground-muted">
          Weiter einkaufen:{' '}
          <Link
            href="/schluessel-nach-code"
            className="font-semibold text-primary hover:underline"
          >
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

      {/* Rechts ab lg nur Summe und Kasse */}
      <div className="space-y-4 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
        <Card>
          <CardHeader>
            <h2 className="text-title-sm font-semibold text-foreground">Summe</h2>
          </CardHeader>
          <CardBody>
            {/* Schriftfeld: Beträge in Mono, Haarlinien zwischen den Zeilen. Wechselt der Wert, blendet er ein (B-20). */}
            <dl className="border-y border-border">
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-small text-foreground-muted">Zwischensumme</dt>
                <dd className="font-mono text-small font-semibold tabular-nums text-foreground">
                  {formatCents(summen.itemsCents)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-border py-3">
                <dt className="text-small text-foreground-muted">Versand</dt>
                <dd
                  key={summen.shippingCents}
                  className="animate-schleier-ein text-right text-small"
                >
                  {gewaehlteVersandart && (
                    <span className="block text-foreground-muted">{gewaehlteVersandart.label}</span>
                  )}
                  <span className="block whitespace-nowrap font-mono font-semibold tabular-nums text-foreground">
                    {formatCents(summen.shippingCents)}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-border py-4">
                <dt className="font-semibold text-foreground">Gesamtbetrag</dt>
                <dd
                  key={summen.totalCents}
                  className="animate-schleier-ein font-mono text-title font-semibold tabular-nums text-foreground"
                >
                  {formatCents(summen.totalCents)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-border py-3">
                <dt className="text-caption text-foreground-muted">
                  darin enthaltene Umsatzsteuer ({Math.round(summen.vatRate * 100)} %)
                </dt>
                <dd className="font-mono text-caption tabular-nums text-foreground-muted">
                  {formatCents(summen.vatCents)}
                </dd>
              </div>
            </dl>

            <div className="mt-5">
              {gewaehlteVersandart && !nichtVerfuegbar ? (
                <ButtonLink href="/kasse" size="lg" fullWidth pfeil>
                  Zur Kasse
                </ButtonLink>
              ) : (
                <Button size="lg" fullWidth disabled pfeil>
                  Zur Kasse
                </Button>
              )}
              {!gewaehlteVersandart && versandarten.length > 0 && (
                <p className="mt-2 text-small text-foreground-muted">
                  Bitte wählen Sie zuerst eine Versandart.
                </p>
              )}
            </div>

            {/* Hinweis als Zeile mit Glyphe, ohne Fläche */}
            <p className="mt-4 flex items-start gap-2 text-small text-foreground-muted">
              <GlyphInfo size={16} className="mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold text-foreground">Hinweis zur Preisberechnung:</span> Der endgültige Preis wird beim Absenden der Bestellung noch einmal auf unserem
                Server berechnet. Maßgeblich sind die dort hinterlegten Preise.
              </span>
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Mobil eigene Leiste unten: Gesamtbetrag und Kasse. Die globale Aktionsleiste blendet sich dann aus (globals.css). */}
      <div
        data-eigene-leiste
        className="pb-safe-area fixed inset-x-0 bottom-0 z-sticky border-t border-border bg-surface md:hidden"
      >
        <div className="shell flex min-h-touch-lg items-center justify-between gap-4 py-2">
          <p className="text-small text-foreground-muted">
            Gesamtbetrag <span
              key={summen.totalCents}
              className="animate-schleier-ein font-mono text-body font-semibold tabular-nums text-foreground"
            >
              {formatCents(summen.totalCents)}
            </span>
          </p>
          {gewaehlteVersandart && !nichtVerfuegbar ? (
            <ButtonLink href="/kasse" size="lg" pfeil>
              Zur Kasse
            </ButtonLink>
          ) : (
            <Button size="lg" disabled pfeil>
              Zur Kasse
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Position eines Standardartikels aus dem Shop. */
function StandardPositionKarte({
  position,
  onQty,
  onRemove,
}: {
  position: Extract<Position, { art: 'standard' }>;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const { item, article } = position;
  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-12 sm:gap-x-4">
      <div className="flex gap-4 sm:contents">
        {article && (
          <div className="hidden sm:col-span-2 sm:block">
            <ImagePlaceholder slot={article.image} compact />
          </div>
        )}

        <div className="min-w-0 flex-1 sm:col-span-4 sm:col-start-3">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <h3 className="text-title-sm font-semibold text-foreground">
              {article ? (
                <Link
                  href={`/artikel/${article.slug}`}
                  className="inline-flex min-h-touch items-center hover:text-primary hover:underline"
                >
                  {article.name}
                </Link>
              ) : (
                item.label
              )}
            </h3>
            <Badge tone="outline">Artikel</Badge>
          </div>

          {!article && (
            <p className="mt-3 text-small font-semibold text-danger">
              Diesen Artikel gibt es nicht mehr. Bitte entfernen Sie die Position.
            </p>
          )}
          {article?.example && (
            <p className="mt-3 text-small font-semibold text-danger">
              Beispielartikel können nicht bestellt werden. Bitte entfernen Sie die Position.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 sm:contents">
        <div className="sm:col-span-3 sm:col-start-7">
          <span className="text-small font-semibold text-foreground-muted">Stückzahl</span>
          <div className="mt-1.5">
            <QuantityInput
              value={item.qty}
              onChange={onQty}
              min={1}
              max={article?.maxQty ?? item.qty}
              label={`Stückzahl ${article?.name ?? item.label}`}
            />
          </div>
        </div>

        <div className="text-right font-mono text-small tabular-nums sm:col-span-3 sm:col-start-10">
          <p key={item.unitPriceCents * item.qty} className="animate-schleier-ein text-title-sm font-semibold text-foreground">
            {formatCents(item.unitPriceCents * item.qty)}
          </p>
          <p className="text-caption text-foreground-muted">{formatCents(item.unitPriceCents)} je Stück</p>
        </div>
      </div>

      <div className="sm:col-span-4 sm:col-start-3">
        <Button variant="ghost" onClick={onRemove} className="px-0 text-small">
          <GlyphPapierkorb size={16} />
          Position entfernen
          <span className="sr-only">: {article?.name ?? item.label}</span>
        </Button>
      </div>
    </div>
  );
}
