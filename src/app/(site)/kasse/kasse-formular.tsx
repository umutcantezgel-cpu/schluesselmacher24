'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useHydrated } from '@/lib/client-state';
import { useCartStore } from '@/lib/store/cart';
import { submitOrder } from '@/lib/actions/orders';
import { cartTotals, priceCylinderOrder, unitPriceForCodeLine } from '@/lib/pricing';
import { formatCents, formatMillimeter } from '@/lib/format';
import type {
  Cart,
  CartItem,
  CodeLine,
  ContactDetails,
  CylinderCatalog,
  CylinderOrderDraft,
  ShippingOption,
  SummarySection,
} from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { InfoTip } from '@/components/ui/info-tip';
import { Field } from '@/components/forms/field';
import { Select, TextArea, TextInput } from '@/components/forms/controls';
import { SummaryList } from '@/components/layout/summary-list';

export interface KasseFormularProps {
  shipping: ShippingOption[];
  codeLines: CodeLine[];
  catalog: CylinderCatalog;
  /** Vorbelegung des Lieferlands aus den Firmendaten. */
  defaultCountry: string;
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

/** Zusammenstellung einer Zylinder-Position in lesbaren Zeilen. */
function zylinderZeilen(
  draft: CylinderOrderDraft,
  catalog: CylinderCatalog,
): Array<{ label: string; value: string }> {
  const zeilen: Array<{ label: string; value: string }> = [];

  const formsMap = new Map(catalog.forms.map(f => [f.id, f]));
  const functionsMap = new Map(catalog.functions.map(f => [f.id, f]));
  const extrasMap = new Map(catalog.extras.map(e => [e.id, e]));

  for (const eintrag of draft.items) {
    const form = formsMap.get(eintrag.form);
    const funktion = functionsMap.get(eintrag.functionId ?? '');
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
    .map((id) => extrasMap.get(id)?.label)
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
  if (!werte.country.trim()) fehler.country = 'Bitte geben Sie das Lieferland an.';

  const plz = werte.postalCode.trim();
  const istDeutschland = werte.country.trim().toLowerCase() === 'deutschland';
  if (!plz) fehler.postalCode = 'Bitte geben Sie die Postleitzahl an.';
  else if (istDeutschland && !/^\d{5}$/.test(plz))
    fehler.postalCode = 'Eine deutsche Postleitzahl besteht aus fünf Ziffern.';
  else if (!istDeutschland && !/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(plz))
    fehler.postalCode = 'Bitte prüfen Sie die Postleitzahl.';

  return fehler;
}

export function KasseFormular({
  shipping,
  codeLines,
  catalog,
  defaultCountry,
  paymentConfigured,
}: KasseFormularProps) {
  const router = useRouter();

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
    country: defaultCountry,
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
        return { ...item, unitPriceCents: priceCylinderOrder(item.draft, catalog).totalCents };
      }),
    [items, codeLines, catalog],
  );

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
  }, [positionen, codeLines, catalog, summen, versandart, werte]);

  async function absenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormularFehler(null);
    setHinweise([]);

    const gefunden = pruefen(werte);
    setFehler(gefunden);

    const bestaetigungenFehlen = !agbBestaetigt || !anfertigungBestaetigt;
    setBestaetigungsFehler(
      bestaetigungenFehlen ? 'Bitte bestätigen Sie beide Hinweise, um fortzufahren.' : null,
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
      country: werte.country.trim(),
    };

    setSendet(true);
    const ergebnis = await submitOrder({
      items: positionen,
      shippingOptionId,
      contact: kontakt,
      deliveryNote: werte.deliveryNote.trim() || undefined,
      acceptedTerms: agbBestaetigt,
      acceptedCustomMade: anfertigungBestaetigt,
    });

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
      window.location.assign(ergebnis.redirectUrl);
      return;
    }
    router.push(`/bestellung/${ergebnis.recordId}`);
  }

  if (abgeschlossen) {
    return (
      <Card>
        <CardBody>
          <p className="text-[15px] text-foreground-muted" role="status">
            Ihre Bestellung wurde aufgenommen. Sie werden zur Bestätigung weitergeleitet.
          </p>
        </CardBody>
      </Card>
    );
  }

  if (!geladen) {
    return (
      <Card>
        <CardBody>
          <p className="text-[15px] text-foreground-muted" role="status">
            Bestelldaten werden geladen.
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
            Ohne Positionen lässt sich keine Bestellung abschließen.
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
    <form onSubmit={absenden} noValidate className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-8">
      <div className="space-y-6">
        {!paymentConfigured && (
          <Alert tone="warning" title="Zahlung derzeit nicht online möglich">
            Es ist noch kein Zahlungsdienstleister angebunden. Ihre Bestellung wird mit dem
            Zahlungsstatus „offen“ gespeichert; wir melden uns mit den Zahlungsinformationen.
          </Alert>
        )}

        <Card>
          <CardHeader>
            <h2 className="text-[15px] font-bold text-foreground">Kontaktdaten</h2>
          </CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-2">
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
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-[15px] font-bold text-foreground">Lieferanschrift</h2>
          </CardHeader>
          <CardBody className="grid gap-4 sm:grid-cols-2">
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

            <Field label="Land" required error={fehler.country}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={werte.country}
                  onChange={(event) => setzen('country', event.target.value)}
                  autoComplete="country-name"
                />
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
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-[15px] font-bold text-foreground">Erforderliche Bestätigungen</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4">
              <input
                type="checkbox"
                checked={agbBestaetigt}
                onChange={(event) => {
                  setAgbBestaetigt(event.target.checked);
                  setBestaetigungsFehler(null);
                }}
                aria-describedby="bestaetigung-fehler"
                className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
              />
              <span className="text-[14px] leading-relaxed text-foreground">
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

            <div className="flex items-start gap-2">
              <label className="flex min-h-[44px] flex-1 cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4">
                <input
                  type="checkbox"
                  checked={anfertigungBestaetigt}
                  onChange={(event) => {
                    setAnfertigungBestaetigt(event.target.checked);
                    setBestaetigungsFehler(null);
                  }}
                  aria-describedby="bestaetigung-fehler"
                  className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
                />
                <span className="text-[14px] leading-relaxed text-foreground">
                  Mir ist bekannt, dass Schlüssel und Zylinder nach meinen Angaben angefertigt
                  werden. Einzelheiten dazu, was das für den Widerruf bedeutet, stehen in der{' '}
                  <Link href="/rechtliches/widerruf" className="font-semibold text-primary hover:underline">
                    Widerrufsbelehrung
                  </Link>
                  .
                </span>
              </label>
              <span className="pt-4">
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

            <p id="bestaetigung-fehler" className="text-[13px] font-semibold text-danger" role="alert">
              {bestaetigungsFehler}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Bestellübersicht und Absenden */}
      <div className="space-y-4 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-foreground">Bestellübersicht</h2>

        <SummaryList sections={uebersicht} />

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
          <Alert tone="warning" title="Bestellung noch nicht abgeschickt">
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

        <Button type="submit" size="lg" fullWidth loading={sendet} disabled={!versandart}>
          Zahlungspflichtig bestellen
        </Button>

        <p className="text-[13px] leading-relaxed text-foreground-muted">
          Beim Absenden wird der Preis auf unserem Server noch einmal berechnet. Maßgeblich sind
          die dort hinterlegten Preise. Anschließend erhalten Sie eine Vorgangsnummer.
        </p>

        <p className="text-[13px] leading-relaxed text-foreground-muted">
          Etwas ändern?{' '}
          <Link href="/warenkorb" className="font-semibold text-primary hover:underline">
            Zurück zum Warenkorb
          </Link>
        </p>
      </div>
    </form>
  );
}
