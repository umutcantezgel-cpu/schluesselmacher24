'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useHydrated } from '@/lib/client-state';
import { useCartStore } from '@/lib/store/cart';
import { submitOrder } from '@/lib/actions/orders';
import { cartTotals, priceCylinderOrder, unitPriceForCodeLine } from '@/lib/pricing';
import { formatCents } from '@/lib/format';
import { zylinderZeilen } from '@/lib/cylinder-summary';
import { LIEFERLAND, istSonderanfertigung } from '@/lib/kasse';
import type {
  Cart,
  CartItem,
  CodeLine,
  ContactDetails,
  CylinderCatalog,
  ShippingOption,
  StandardArticle,
  SummarySection,
} from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { InfoTip } from '@/components/ui/info-tip';
import { Field } from '@/components/forms/field';
import { Select, TextArea, TextInput } from '@/components/forms/controls';
import { SchutzFelder, useFormularSchutz } from '@/components/forms/formular-schutz';
import { SummaryList } from '@/components/layout/summary-list';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { GlyphWinkelUnten } from '@/components/visual/glyphen/winkel-unten';

export interface KasseFormularProps {
  shipping: ShippingOption[];
  codeLines: CodeLine[];
  standardArticles: StandardArticle[];
  catalog: CylinderCatalog;
  /** Ist ein Zahlungsdienstleister angebunden? */
  paymentConfigured: boolean;
}

interface Eingaben {
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  deliveryNote: string;
}

type Fehler = Partial<Record<keyof Eingaben, string>>;

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFON_MUSTER = /^[0-9+\s()/.-]{6,}$/;

function pruefen(werte: Eingaben): Fehler {
  const fehler: Fehler = {};

  if (!werte.firstName.trim()) fehler.firstName = 'Bitte geben Sie Ihren Vornamen an.';
  if (!werte.lastName.trim()) fehler.lastName = 'Bitte geben Sie Ihren Nachnamen an.';

  if (!werte.email.trim()) fehler.email = 'Bitte geben Sie Ihre E-Mail-Adresse an.';
  else if (!EMAIL_MUSTER.test(werte.email.trim()))
    fehler.email = 'Diese E-Mail-Adresse hat kein gültiges Format.';

  if (!werte.phone.trim()) fehler.phone = 'Bitte geben Sie eine Telefonnummer für Rückfragen an.';
  else if (!TELEFON_MUSTER.test(werte.phone.trim()))
    fehler.phone = 'Bitte geben Sie die Telefonnummer nur mit Ziffern und Trennzeichen an.';

  if (!werte.street.trim()) fehler.street = 'Bitte geben Sie Straße und Hausnummer an.';
  if (!werte.city.trim()) fehler.city = 'Bitte geben Sie den Ort an.';
  if (werte.country !== LIEFERLAND) fehler.country = 'Wir liefern derzeit nur nach Deutschland.';

  // Lieferung nur nach Deutschland: fünfstellige Postleitzahl.
  const plz = werte.postalCode.trim();
  if (!plz) fehler.postalCode = 'Bitte geben Sie die Postleitzahl an.';
  else if (!/^\d{5}$/.test(plz))
    fehler.postalCode = 'Eine deutsche Postleitzahl besteht aus fünf Ziffern.';

  return fehler;
}

export function KasseFormular({
  shipping,
  codeLines,
  standardArticles,
  catalog,
  paymentConfigured,
}: KasseFormularProps) {
  const router = useRouter();
  const schutz = useFormularSchutz();

  const items = useCartStore((state) => state.items);
  const shippingOptionId = useCartStore((state) => state.shippingOptionId);
  const leeren = useCartStore((state) => state.clear);

  // Der Warenkorb liegt im Browser und steht erst nach dem Hydrieren bereit.
  const geladen = useHydrated();

  const [werte, setWerte] = useState<Eingaben>({
    salutation: '',
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    country: LIEFERLAND,
    deliveryNote: '',
  });
  const [fehler, setFehler] = useState<Fehler>({});
  const [agbBestaetigt, setAgbBestaetigt] = useState(false);
  const [anfertigungBestaetigt, setAnfertigungBestaetigt] = useState(false);
  const [bestaetigungsFehler, setBestaetigungsFehler] = useState<string | null>(null);
  const [formularFehler, setFormularFehler] = useState<string | null>(null);
  const [hinweise, setHinweise] = useState<string[]>([]);
  const [sendet, setSendet] = useState(false);
  const [abgeschlossen, setAbgeschlossen] = useState(false);
  /** Weiterleitung zur Zahlungsseite statt zur Bestätigung. */
  const [zurZahlung, setZurZahlung] = useState(false);

  function setzen<K extends keyof Eingaben>(feld: K, wert: Eingaben[K]) {
    setWerte((vorher) => ({ ...vorher, [feld]: wert }));
    // Eine bereits gemeldete Fehlermeldung verschwindet beim Korrigieren.
    setFehler((vorher) => (vorher[feld] ? { ...vorher, [feld]: undefined } : vorher));
  }

  // Preise wie auf dem Server ermitteln, damit die Übersicht stimmt.
  const positionen = useMemo<CartItem[]>(
    () =>
      items.map((item) => {
        if (item.kind === 'code-schluessel') {
          const line = codeLines.find((eintrag) => eintrag.id === item.codeLineId) ?? null;
          const maxQty = line?.maxQty ?? item.qty;
          const qty = Math.min(Math.max(1, item.qty), Math.max(1, maxQty));
          return {
            ...item,
            qty,
            unitPriceCents: line ? unitPriceForCodeLine(line, qty) : item.unitPriceCents,
          };
        }
        if (item.kind === 'standard') {
          const article = standardArticles.find((eintrag) => eintrag.id === item.productId) ?? null;
          const qty = Math.min(Math.max(1, item.qty), Math.max(1, article?.maxQty ?? item.qty));
          return {
            ...item,
            qty,
            shippingClass: article?.shippingClass ?? item.shippingClass,
            unitPriceCents: article ? unitPriceForCodeLine(article, qty) : item.unitPriceCents,
          };
        }
        return { ...item, unitPriceCents: priceCylinderOrder(item.draft, catalog).totalCents };
      }),
    [items, codeLines, standardArticles, catalog],
  );

  // Schlüssel nach Code und Zylinder werden nach Kundenangaben gefertigt — nur dann ist der Hinweis nötig.
  const mitAnfertigung = positionen.some(istSonderanfertigung);

  const cart: Cart = useMemo(
    // Der Zeitstempel wird erst beim Absenden auf dem Server gesetzt.
    () => ({ items: positionen, shippingOptionId, updatedAt: '' }),
    [positionen, shippingOptionId],
  );
  const summen = cartTotals(cart, shipping);
  const versandart = shipping.find((option) => option.id === shippingOptionId) ?? null;

  const uebersicht = useMemo<SummarySection[]>(() => {
    const artikel: SummarySection['rows'] = [];

    for (const item of positionen) {
      if (item.kind === 'code-schluessel') {
        const line = codeLines.find((eintrag) => eintrag.id === item.codeLineId);
        artikel.push({
          label: line?.name ?? 'Schlüssel nach Code',
          value: `Code ${item.code} · ${item.qty} Stück · ${formatCents(item.unitPriceCents * item.qty)}`,
        });
      } else if (item.kind === 'standard') {
        const article = standardArticles.find((eintrag) => eintrag.id === item.productId);
        artikel.push({
          label: article?.name ?? item.label,
          value: `${item.qty} Stück · ${formatCents(item.unitPriceCents * item.qty)}`,
        });
      } else {
        const breakdown = priceCylinderOrder(item.draft, catalog);
        artikel.push({
          label: 'Gleichschließende Zylinder',
          value: `${breakdown.cylinderCount} Zylinder · ${formatCents(breakdown.totalCents)}`,
        });
        for (const zeile of zylinderZeilen(item.draft, catalog)) {
          artikel.push({ label: `— ${zeile.label}`, value: zeile.value });
        }
      }
    }

    const summenZeilen: SummarySection['rows'] = [
      { label: 'Zwischensumme', value: formatCents(summen.itemsCents) },
      {
        label: 'Versand',
        value: `${versandart?.label ?? 'Noch nicht gewählt'} · ${formatCents(summen.shippingCents)}`,
      },
      { label: 'Gesamtbetrag', value: formatCents(summen.totalCents) },
      {
        label: 'darin enthaltene Umsatzsteuer',
        value: `${formatCents(summen.vatCents)} (${Math.round(summen.vatRate * 100)} %)`,
      },
    ];

    const anschrift: SummarySection['rows'] = [
      {
        label: 'Name',
        value:
          [werte.salutation, werte.firstName.trim(), werte.lastName.trim()]
            .filter(Boolean)
            .join(' ') || 'Noch nicht ausgefüllt',
      },
    ];
    if (werte.company.trim()) anschrift.push({ label: 'Firma', value: werte.company.trim() });
    anschrift.push(
      { label: 'E-Mail', value: werte.email.trim() || 'Noch nicht ausgefüllt' },
      { label: 'Telefon', value: werte.phone.trim() || 'Noch nicht ausgefüllt' },
      { label: 'Straße', value: werte.street.trim() || 'Noch nicht ausgefüllt' },
      {
        label: 'PLZ und Ort',
        value:
          [werte.postalCode.trim(), werte.city.trim()].filter(Boolean).join(' ')
          || 'Noch nicht ausgefüllt',
      },
      { label: 'Land', value: werte.country.trim() || 'Noch nicht ausgefüllt' },
    );
    if (werte.deliveryNote.trim()) {
      anschrift.push({ label: 'Hinweis zur Lieferung', value: werte.deliveryNote.trim() });
    }

    return [
      { title: 'Artikel', rows: artikel },
      { title: 'Summe', rows: summenZeilen },
      { title: 'Kontakt und Lieferanschrift', rows: anschrift },
    ];
  }, [positionen, codeLines, standardArticles, catalog, summen, versandart, werte]);

  async function absenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormularFehler(null);
    setHinweise([]);

    const gefunden = pruefen(werte);
    setFehler(gefunden);

    const bestaetigungenFehlen = !agbBestaetigt || (mitAnfertigung && !anfertigungBestaetigt);
    setBestaetigungsFehler(
      bestaetigungenFehlen
        ? mitAnfertigung
          ? 'Bitte bestätigen Sie beide Hinweise, um fortzufahren.'
          : 'Bitte bestätigen Sie den Hinweis, um fortzufahren.'
        : null,
    );

    if (Object.keys(gefunden).length > 0 || bestaetigungenFehlen) {
      setFormularFehler('Bitte prüfen Sie die markierten Angaben.');
      return;
    }

    if (!shippingOptionId) {
      setFormularFehler('Bitte wählen Sie zuerst im Warenkorb eine Versandart.');
      return;
    }

    const kontakt: ContactDetails = {
      salutation: werte.salutation.trim() || undefined,
      firstName: werte.firstName.trim(),
      lastName: werte.lastName.trim(),
      company: werte.company.trim() || undefined,
      email: werte.email.trim(),
      phone: werte.phone.trim(),
      street: werte.street.trim(),
      postalCode: werte.postalCode.trim(),
      city: werte.city.trim(),
      country: LIEFERLAND,
    };

    setSendet(true);
    const ergebnis = await submitOrder({
      items: positionen,
      shippingOptionId,
      contact: kontakt,
      deliveryNote: werte.deliveryNote.trim() || undefined,
      acceptedTerms: agbBestaetigt,
      acceptedCustomMade: mitAnfertigung && anfertigungBestaetigt,
      // Der Server bestellt nur, wenn sein Betrag mit dem angezeigten übereinstimmt.
      expectedTotalCents: summen.totalCents,
      schutz: await schutz.daten(),
    });
    schutz.antwortBeachten(ergebnis);

    if (!ergebnis.ok) {
      setSendet(false);
      setHinweise(ergebnis.notices);
      setFormularFehler(ergebnis.error ?? 'Die Bestellung konnte nicht abgeschlossen werden.');
      return;
    }

    // Erst umschalten, dann leeren — sonst blitzt der leere Warenkorb auf.
    setAbgeschlossen(true);
    leeren();

    if (ergebnis.redirectUrl) {
      // Zahlungsseite von Stripe. Bei Abbruch führt Stripe auf die Bestellseite zurück.
      setZurZahlung(true);
      window.location.assign(ergebnis.redirectUrl);
      return;
    }
    // Die Bestätigung ist nur mit dem geheimen Link-Schlüssel abrufbar.
    router.push(
      `/bestellung/${ergebnis.recordId}?t=${encodeURIComponent(ergebnis.accessToken ?? '')}`,
    );
  }

  if (abgeschlossen) {
    return (
      <Card className="sm24-leerzustand lg:col-span-8" data-leerzustand>
        <CardBody>
          <p className="text-body text-foreground-muted" role="status">
            {zurZahlung
              ? 'Ihre Bestellung wurde aufgenommen. Sie werden zur sicheren Zahlungsseite weitergeleitet.'
              : 'Ihre Bestellung wurde aufgenommen. Sie werden zur Bestätigung weitergeleitet.'}
          </p>
        </CardBody>
      </Card>
    );
  }

  if (!geladen) {
    return (
      /* Gleiche Mindesthöhe wie der Leerzustand: Nach dem Laden springt nichts (CLS). */
      <Card className="sm24-leerzustand min-h-96 sm:min-h-64 lg:col-span-8" data-leerzustand>
        <CardBody>
          <p className="text-body text-foreground-muted" role="status">
            Bestelldaten werden geladen.
          </p>
        </CardBody>
      </Card>
    );
  }

  if (positionen.length === 0) {
    return (
      <Card className="sm24-leerzustand flex min-h-96 flex-col justify-center sm:min-h-64 lg:col-span-8" data-leerzustand>
        <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div aria-hidden="true" className="sm24-ruhig w-40 shrink-0">
            <SchluesselGrafik params={{ typ: 'zylinder', rohling: true }} title="" />
          </div>
          <div className="min-w-0 max-w-xl">
            <h2 className="text-title-sm font-semibold text-foreground">Ihr Warenkorb ist leer</h2>
            <p className="mt-2 text-small text-foreground-muted">
              Ohne Positionen lässt sich keine Bestellung abschließen.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
    <form onSubmit={absenden} noValidate className="relative grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-gutter lg:col-span-12">
      <SchutzFelder schutz={schutz} />
      <div className="space-y-10 lg:col-span-7">
        {!paymentConfigured && (
          <Alert tone="warning" title="Zahlung derzeit nicht online möglich">
            Es ist noch kein Zahlungsdienstleister angebunden. Ihre Bestellung wird mit dem
            Zahlungsstatus „offen“ gespeichert; wir melden uns mit den Zahlungsinformationen.
          </Alert>
        )}

        {/* Mobil oben: Gesamtbetrag einklappbar (B-09). Die volle Übersicht steht vor dem Knopf. */}
        <details className="group overflow-hidden rounded-lg border border-border bg-surface lg:hidden">
          <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 transition-colors duration-quick hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
            <span className="text-small font-semibold text-foreground">
              Bestellübersicht · <span className="font-mono tabular-nums">{formatCents(summen.totalCents)}</span>
            </span>
            <GlyphWinkelUnten
              size={18}
              className="shrink-0 text-foreground-subtle transition-transform duration-base ease-standard group-open:rotate-180"
            />
          </summary>
          <div className="sm24-fade border-t border-border px-4 py-4 [--sm24-duration:var(--dauer-quick)]">
            <SummaryList dicht sections={uebersicht} variante="schriftfeld" hervorheben="Gesamtbetrag" leer="Noch nicht ausgefüllt" />
          </div>
        </details>

        <p className="text-small text-foreground-muted">Mit * gekennzeichnete Felder sind Pflichtangaben.</p>

        <section className="border-t border-border pt-8">
          <header>
            <p className="eyebrow"><span className="sm24-nummer tabular-nums text-foreground-muted" /></p>
            <h2 className="mt-1 text-title font-semibold text-foreground">Kontaktdaten</h2>
          </header>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Anrede" hint="Freiwillige Angabe." className="sm:col-span-2 sm:max-w-xs">
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  value={werte.salutation}
                  onChange={(event) => setzen('salutation', event.target.value)}
                  autoComplete="honorific-prefix"
                >
                  <option value="">Keine Angabe</option>
                  <option value="Frau">Frau</option>
                  <option value="Herr">Herr</option>
                </Select>
              )}
            </Field>

            <Field label="Vorname" required error={fehler.firstName}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={werte.firstName}
                  onChange={(event) => setzen('firstName', event.target.value)}
                  autoComplete="given-name"
                />
              )}
            </Field>

            <Field label="Nachname" required error={fehler.lastName}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={werte.lastName}
                  onChange={(event) => setzen('lastName', event.target.value)}
                  autoComplete="family-name"
                />
              )}
            </Field>

            <Field label="Firma" hint="Nur ausfüllen, wenn die Lieferung an eine Firma geht." className="sm:col-span-2">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={werte.company}
                  onChange={(event) => setzen('company', event.target.value)}
                  autoComplete="organization"
                />
              )}
            </Field>

            <Field
              label="E-Mail"
              required
              error={fehler.email}
              hint="An diese Adresse geht die Bestätigung mit Ihrer Vorgangsnummer."
            >
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  type="email"
                  inputMode="email"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={werte.email}
                  onChange={(event) => setzen('email', event.target.value)}
                  autoComplete="email"
                />
              )}
            </Field>

            <Field
              label="Telefon"
              required
              error={fehler.phone}
              hint="Nur für Rückfragen zu Ihrer Bestellung."
              info={{
                title: 'Warum eine Telefonnummer?',
                body:
                  'Bei Schlüsseln nach Code und bei Zylindern kommt es auf Code und Maße an. '
                  + 'Wenn eine Angabe unklar ist, klären wir das vor der Fertigung lieber kurz '
                  + 'telefonisch, statt eine falsche Anfertigung zu liefern.',
              }}
            >
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  type="tel"
                  inputMode="tel"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={werte.phone}
                  onChange={(event) => setzen('phone', event.target.value)}
                  autoComplete="tel"
                />
              )}
            </Field>
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <header>
            <p className="eyebrow"><span className="sm24-nummer tabular-nums text-foreground-muted" /></p>
            <h2 className="mt-1 text-title font-semibold text-foreground">Lieferanschrift</h2>
          </header>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Straße und Hausnummer" required error={fehler.street} className="sm:col-span-2">
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={werte.street}
                  onChange={(event) => setzen('street', event.target.value)}
                  autoComplete="street-address"
                />
              )}
            </Field>

            <Field label="Postleitzahl" required error={fehler.postalCode}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  inputMode="numeric"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={werte.postalCode}
                  onChange={(event) => setzen('postalCode', event.target.value)}
                  autoComplete="postal-code"
                />
              )}
            </Field>

            <Field label="Ort" required error={fehler.city}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={werte.city}
                  onChange={(event) => setzen('city', event.target.value)}
                  autoComplete="address-level2"
                />
              )}
            </Field>

            <Field label="Land" required error={fehler.country} hint="Wir liefern derzeit nur innerhalb Deutschlands.">
              {({ id, describedBy, invalid }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={werte.country}
                  onChange={(event) => setzen('country', event.target.value)}
                  autoComplete="country-name"
                >
                  <option value={LIEFERLAND}>{LIEFERLAND}</option>
                </Select>
              )}
            </Field>

            <Field
              label="Hinweis zur Lieferung"
              hint="Freiwillig, zum Beispiel abweichender Empfänger oder Hinweise zur Zustellung."
              className="sm:col-span-2"
            >
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  rows={3}
                  aria-describedby={describedBy}
                  value={werte.deliveryNote}
                  onChange={(event) => setzen('deliveryNote', event.target.value)}
                />
              )}
            </Field>
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <header>
            <p className="eyebrow"><span className="sm24-nummer tabular-nums text-foreground-muted" /></p>
            <h2 className="mt-1 text-title font-semibold text-foreground">Erforderliche Bestätigungen</h2>
          </header>
          <div className="mt-6 space-y-3">
            <label className="flex min-h-touch cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4">
              <input
                type="checkbox"
                checked={agbBestaetigt}
                onChange={(event) => {
                  setAgbBestaetigt(event.target.checked);
                  setBestaetigungsFehler(null);
                }}
                aria-describedby="bestaetigung-fehler"
                className="mt-0.5 size-5 shrink-0 accent-primary"
              />
              <span className="text-small leading-relaxed text-foreground">
                Ich habe die{' '}
                <Link href="/rechtliches/agb" className="font-semibold text-primary hover:underline">
                  AGB
                </Link>{' '}
                und die{' '}
                <Link href="/rechtliches/widerruf" className="font-semibold text-primary hover:underline">
                  Widerrufsbelehrung
                </Link>{' '}
                zur Kenntnis genommen.
              </span>
            </label>

            {/* Gleiche Breite wie die Karte darüber: das Info-Symbol sitzt rechts oben in der Karte. */}
            {mitAnfertigung && (
              <div className="flex min-h-touch items-start rounded-lg border border-border bg-surface">
                <label className="flex flex-1 cursor-pointer items-start gap-3 p-4">
                  <input
                    type="checkbox"
                    checked={anfertigungBestaetigt}
                    onChange={(event) => {
                      setAnfertigungBestaetigt(event.target.checked);
                      setBestaetigungsFehler(null);
                    }}
                    aria-describedby="bestaetigung-fehler"
                    className="mt-0.5 size-5 shrink-0 accent-primary"
                  />
                  <span className="text-small leading-relaxed text-foreground">
                    Mir ist bekannt, dass Schlüssel und Zylinder nach meinen Angaben angefertigt
                    werden. Einzelheiten dazu, was das für den Widerruf bedeutet, stehen in der{' '}
                    <Link href="/rechtliches/widerruf" className="font-semibold text-primary hover:underline">
                      Widerrufsbelehrung
                    </Link>
                    .
                  </span>
                </label>
                <span className="shrink-0 pr-4 pt-4">
                  <InfoTip
                    hint={{
                      title: 'Anfertigung nach Ihren Angaben',
                      body:
                        'Schlüssel nach Code und gleichschließende Zylinder werden eigens für Sie '
                        + 'gefertigt — nach dem Code beziehungsweise nach den Maßen, die Sie '
                        + 'angegeben haben. Solche Anfertigungen lassen sich nicht weiterverkaufen. '
                        + 'Was daraus für Ihr Widerrufsrecht folgt, steht in der Widerrufsbelehrung.',
                    }}
                  />
                </span>
              </div>
            )}

            <p id="bestaetigung-fehler" className="text-small font-semibold text-danger" role="alert">
              {bestaetigungsFehler}
            </p>
          </div>
        </section>
      </div>

      {/* Bestellübersicht und Absenden */}
      <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-title-sm font-semibold text-foreground">Bestellübersicht</h2>

        {/* Schriftfeld mit Haarlinien: Zahlen in Mono, Gesamtsumme groß */}
        <SummaryList dicht sections={uebersicht} variante="schriftfeld" hervorheben="Gesamtbetrag" leer="Noch nicht ausgefüllt" />

        {!versandart && (
          <Alert tone="warning" title="Versandart fehlt">
            Bitte wählen Sie im{' '}
            <Link href="/warenkorb" className="font-semibold text-primary hover:underline">
              Warenkorb
            </Link>{' '}
            eine Versandart.
          </Alert>
        )}

        {formularFehler && (
          <Alert tone="warning" title="Bestellung noch nicht abgeschickt" role="alert">
            {formularFehler}
          </Alert>
        )}

        {hinweise.length > 0 && (
          <Alert tone="info" title="Hinweise">
            <ul className="list-disc space-y-1 pl-4">
              {hinweise.map((hinweis) => (
                <li key={hinweis}>{hinweis}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Mobil steht der Betrag direkt über dem Knopf, damit er beim Absenden im Blick bleibt. */}
        <div className="flex items-baseline justify-between gap-4 lg:hidden">
          <span className="text-small font-semibold text-foreground-muted">Gesamtbetrag</span>
          <span className="font-mono text-title-sm font-semibold tabular-nums text-foreground">
            {formatCents(summen.totalCents)}
          </span>
        </div>

        <Button type="submit" size="lg" fullWidth loading={sendet} disabled={!versandart}>
          Zahlungspflichtig bestellen
        </Button>

        <p className="text-small leading-relaxed text-foreground-muted">
          Beim Absenden wird der Preis auf unserem Server noch einmal berechnet. Maßgeblich sind
          die dort hinterlegten Preise. Anschließend erhalten Sie eine Vorgangsnummer.
        </p>

        <p className="text-small leading-relaxed text-foreground-muted">
          Etwas ändern?{' '}
          <Link href="/warenkorb" className="font-semibold text-primary hover:underline">
            Zurück zum Warenkorb
          </Link>
        </p>
      </div>
    </form>
  );
}
