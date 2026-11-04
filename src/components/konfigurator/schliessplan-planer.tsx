'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FlowShell } from '@/components/flow/flow-shell';
import { Field } from '@/components/forms/field';
import { TextArea, TextInput } from '@/components/forms/controls';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { OptionCard } from '@/components/forms/option-card';
import { AnfrageHinweis } from '@/components/recht/anfrage-hinweis';
import { Alert } from '@/components/ui/alert';
import { Button, ButtonLink } from '@/components/ui/button';
import { ZylinderMassGrafik } from '@/components/visual/generators/zylinder-mass';
import { WegBestaetigung } from '@/components/weg/bestaetigung';
import { submitRecord } from '@/lib/actions/records';
import { ERWEITERBAR_OPTION_ID } from '@/lib/cylinder-rules';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { formatCents } from '@/lib/format';
import {
  SCHUTZ_OPTION_ID,
  VORLAGEN,
  dekodiere,
  kodiere,
  leererPlan,
  passtInLink,
  preisFuerPlan,
  pruefeMasse,
  pruefePlan,
  schluesselHinzufuegen,
  tuerHinzufuegen,
  type Schliessplan,
  type Vorlage,
} from '@/lib/konfigurator';
import { SCHLIESSPLAN_DATEINAME } from '@/lib/pdf/schliessplan';
import { SCHRITTE_PLANER } from '@/lib/wege/naechste-schritte';
import { aktionMelden } from '@/lib/statistik';
import { useCartStore } from '@/lib/store/cart';
import type { ContactDetails, CylinderCatalog } from '@/lib/types';

import { neueTuer, PlanBefunde, PlanSumme, SchluesselMatrix, summeKurz, TuerenListe } from './schliessplan-editor';

/*
 * Schließplan-Planer (E5-OPUS-01, G-27, KA3, KE5): Türen und Schlüssel anlegen, ankreuzen, wer
 * welche Tür schließt, prüfen, dann bestellen oder anfragen. Eine Sperrschließung (jeder Schlüssel
 * schließt jede Tür) geht mit dem Preis des Bestands in den Warenkorb, die Kasse prüft und rechnet
 * neu (G9). Eine Schließanlage mit Ebenen wird eine Anfrage mit vollständiger Matrix, der Preis
 * folgt mit dem Angebot (R9). Zwischenstand im Browser (useFlow) und als Link (KE5); „Maße geprüft“
 * gibt nur, wer den Plan vor sich hat (G-29).
 */

const FLOW_ID = 'schliessplan-planer';
/** Plan-Optionen der Bestellung, nicht je Tür; Schutz und Vormerkung folgen dem Plan selbst. */
const PLAN_EXTRAS_AUSGENOMMEN = new Set([SCHUTZ_OPTION_ID, ERWEITERBAR_OPTION_ID]);

const STEPS: FlowStep[] = [
  {
    id: 'start',
    short: 'Start',
    title: 'Womit möchten Sie anfangen?',
    hint: 'Eine Vorlage spart Tipparbeit. Danach ändern Sie jede Tür und jeden Schlüssel.',
  },
  {
    id: 'tueren',
    short: 'Türen',
    title: 'Welche Türen gehören dazu?',
    hint: 'Je Tür ein Zylinder. Gemessen wird ab der Mitte der Stulpschraube, der langen Schraube in der Türkante. Maß A reicht nach außen, Maß B nach innen.',
  },
  {
    id: 'schluessel',
    short: 'Schlüssel',
    title: 'Wer bekommt welchen Schlüssel?',
    hint: 'Legen Sie die Schlüssel an und kreuzen Sie an, welche Türen jeder schließt.',
  },
  {
    id: 'pruefen',
    short: 'Prüfen',
    title: 'Plan und Maße prüfen',
    hint: 'Sehen Sie jede Tür noch einmal an. Erst mit Ihrer Bestätigung geht der Plan in die Fertigung; die Werkstatt prüft ihn zusätzlich.',
  },
  {
    id: 'abschluss',
    short: 'Abschluss',
    title: 'Bestellen oder Angebot anfragen',
    hint: 'Eine Sperrschließung bestellen Sie direkt. Für eine Schließanlage mit Ebenen, also mit Schlüsseln, die nicht alle Türen öffnen, schicken wir Ihnen ein Angebot.',
  },
];

type Start = '' | Vorlage['id'] | 'leer' | 'link';

interface PlanerDaten {
  start: Start;
  plan: Schliessplan;
  extraIds: string[];
  contact: ContactDetails;
  notiz: string;
  consent: boolean;
}

const INITIAL: PlanerDaten = {
  start: '',
  plan: leererPlan(),
  extraIds: [],
  contact: { salutation: '', firstName: '', lastName: '', company: '', email: '', phone: '', street: '', postalCode: '', city: '', country: 'Deutschland' },
  notiz: '',
  consent: false,
};

/* Adresse als äußerer Zustand: Auf dem Server und beim Hydrieren leer, danach die echte Suche.
   Nach dem Bereinigen meldet ein eigenes Ereignis die neue Adresse (replaceState löst keins aus). */
const ADRESSE_EREIGNIS = 'sm24-adresse';
function abonniereAdresse(melden: () => void) {
  window.addEventListener('popstate', melden);
  window.addEventListener(ADRESSE_EREIGNIS, melden);
  return () => {
    window.removeEventListener('popstate', melden);
    window.removeEventListener(ADRESSE_EREIGNIS, melden);
  };
}
function adresseBereinigen() {
  window.history.replaceState(null, '', window.location.pathname);
  window.dispatchEvent(new Event(ADRESSE_EREIGNIS));
}

/** Ein leerer Plan mit einer Tür und einem Schlüssel für alle Türen. */
function leererStart(katalog: CylinderCatalog): Schliessplan {
  const mitTuer = tuerHinzufuegen(leererPlan(), neueTuer(katalog, 'Haustür'));
  return schluesselHinzufuegen(mitTuer, { bezeichnung: 'Familie', anzahl: 3 }, true);
}

export function SchliessplanPlaner({ katalog }: { katalog: CylinderCatalog }) {
  const router = useRouter();
  const addCylinderOrder = useCartStore((state) => state.addCylinderOrder);
  const schutz = useFormularSchutz();
  const [submitting, setSubmitting] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [ergebnis, setErgebnis] = useState<{ reference: string; notices: string[] } | null>(null);
  const [linkStatus, setLinkStatus] = useState<{ url: string; kopiert: boolean } | { zuGross: true } | null>(null);
  /** Vorlage, die einen vorhandenen Plan ersetzen würde, bis zur Bestätigung. */
  const [ersetzenDurch, setErsetzenDurch] = useState<string | null>(null);

  const flow = useFlow<PlanerDaten>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    version: 1,
    validate: (d, stepId) => {
      switch (stepId) {
        case 'start':
          return d.start !== '' && d.plan.tueren.length > 0;
        case 'tueren':
          return d.plan.tueren.length > 0 && d.plan.tueren.every((t) => t.bezeichnung.trim()) && !pruefeMasse(d.plan, katalog).befunde.some((b) => b.art === 'fehler');
        case 'schluessel':
          return !pruefePlan(d.plan).some((b) => b.art === 'fehler');
        case 'pruefen': {
          const preis = preisFuerPlan(d.plan, katalog, d.extraIds);
          return preis.art !== 'offen' && (preis.art !== 'preis' || d.plan.masseGeprueft === true);
        }
        case 'abschluss': {
          const preis = preisFuerPlan(d.plan, katalog, d.extraIds);
          if (preis.art === 'preis') return pruefeMasse(d.plan, katalog).bestellbar;
          const c = d.contact;
          return Boolean(c.firstName.trim() && c.lastName.trim() && c.email.includes('@') && c.phone.trim() && d.consent);
        }
        default:
          return true;
      }
    },
  });
  const d = flow.data;

  // Plan aus einem Link (?plan=…), ohne „Maße geprüft“. Ein leerer Plan wird sofort ersetzt, ein
  // vorhandener erst nach Rückfrage; danach wird die Adresse bereinigt.
  const adresse = useSyncExternalStore(abonniereAdresse, () => window.location.search, () => '');
  const linkRoh = useMemo(() => new URLSearchParams(adresse).get('plan'), [adresse]);
  const linkPlan = useMemo(() => (linkRoh ? dekodiere(linkRoh) : null), [linkRoh]);
  const linkFehler = Boolean(linkRoh) && !linkPlan;
  useEffect(() => {
    if (linkPlan && flow.data.plan.tueren.length === 0) {
      flow.updateAndGoTo({ start: 'link', plan: linkPlan }, 'tueren');
      adresseBereinigen();
    }
  }, [linkPlan, flow]);

  const preis = useMemo(() => preisFuerPlan(d.plan, katalog, d.extraIds), [d.plan, katalog, d.extraIds]);
  const setPlan = (plan: Schliessplan) => flow.update({ plan });
  const planExtras = katalog.extras.filter((e) => e.active && !PLAN_EXTRAS_AUSGENOMMEN.has(e.id));

  function startSetzen(wert: string) {
    setErsetzenDurch(null);
    if (wert === 'leer') flow.update({ start: 'leer', plan: leererStart(katalog) });
    else {
      const vorlage = VORLAGEN.find((v) => v.id === wert);
      if (vorlage) flow.update({ start: vorlage.id, plan: vorlage.erzeuge() });
    }
  }

  /** Eine andere Vorlage ersetzt einen vorhandenen Plan erst nach Bestätigung. */
  function startWaehlen(wert: string) {
    if (wert === d.start) return;
    if (d.plan.tueren.length > 0 && d.start !== '') setErsetzenDurch(wert);
    else startSetzen(wert);
  }

  async function linkKopieren() {
    if (!passtInLink(d.plan)) {
      setLinkStatus({ zuGross: true });
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}?plan=${kodiere(d.plan)}`;
    let kopiert = false;
    try {
      await navigator.clipboard.writeText(url);
      kopiert = true;
    } catch {
      kopiert = false;
    }
    setLinkStatus({ url, kopiert });
  }

  async function handleSubmit() {
    if (!flow.canContinue || submitting) return;
    setSubmitting(true);
    setFehler(null);
    if (preis.art === 'preis') {
      addCylinderOrder(preis.entwurf, preis.aufstellung.totalCents, `Schließplan: ${d.plan.tueren.map((t) => t.bezeichnung).join(', ')}`.slice(0, 200));
      clearFlow(FLOW_ID);
      router.push('/warenkorb');
      return;
    }
    try {
      const response = await submitRecord({
        schutz: await schutz.daten(),
        kind: 'projekt',
        area: 'schliessanlagen',
        process: 'projektkonfigurator',
        contact: d.contact,
        payload: { quelle: 'schliessplan-planer', schliessplan: d.plan, extraIds: d.extraIds, notiz: d.notiz, consent: d.consent },
        // Zusammenfassung und Schnappschuss bildet der Server aus dem Plan (E5-OPUS-03).
        summary: [],
        uploads: [],
      });
      schutz.antwortBeachten(response);
      if (response.ok && response.reference) {
        aktionMelden('projektanfrage', 'schliessanlagen');
        clearFlow(FLOW_ID);
        setErgebnis({ reference: response.reference, notices: response.notices });
      } else {
        setFehler(response.error ?? 'Der Vorgang konnte nicht gespeichert werden.');
      }
    } catch {
      setFehler('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es noch einmal.');
    } finally {
      setSubmitting(false);
    }
  }

  if (ergebnis) {
    return (
      <div className="mx-auto max-w-3xl py-6">
        <WegBestaetigung
          marke="Schließplan eingegangen"
          titel="Ihr Schließplan ist angekommen"
          text="Danke. Ihr Schließplan ist bei uns angekommen, mit allen Türen, Schlüsseln und der Matrix. Wir prüfen ihn und schicken Ihnen ein Angebot."
          reference={ergebnis.reference}
          nummerHinweis="Bewahren Sie die Vorgangsnummer auf: Unter ihr ist Ihr Schließplan mit allen Türen und Schlüsseln gespeichert, auch für spätere Nachbestellungen. Mit ihr und Ihrer E-Mail-Adresse rufen Sie den Stand Ihres Vorgangs ab."
          notices={ergebnis.notices}
          schritte={SCHRITTE_PLANER}
          zurueck={{ href: '/schliessanlagen', label: 'Zurück zu den Schließanlagen' }}
        >
          <p className="mt-5 text-small leading-relaxed text-foreground-muted">
            <Link href="/schliessanlagen#nachbestellen" className="font-semibold text-primary underline-offset-2 hover:underline">
              So bestellen Sie später nach
            </Link>
          </p>
        </WegBestaetigung>
      </div>
    );
  }

  const blockedHint: Record<string, string> = {
    start: 'Bitte wählen Sie eine Vorlage oder einen leeren Plan.',
    tueren: 'Bitte geben Sie jeder Tür eine Bezeichnung und wählbare Maße.',
    schluessel: pruefePlan(d.plan).find((b) => b.art === 'fehler')?.text ?? 'Bitte ordnen Sie jeder Tür einen Schlüssel zu.',
    pruefen: preis.art === 'offen' ? preis.grund : 'Bitte bestätigen Sie, dass Sie die Maße geprüft haben.',
    abschluss: preis.art === 'preis' ? 'Bitte bestätigen Sie die Maße.' : 'Bitte füllen Sie die Pflichtangaben aus und stimmen Sie der Verarbeitung zu.',
  };
  const setContact = (key: keyof ContactDetails, value: string) => flow.update({ contact: { ...d.contact, [key]: value } });
  /* Schließplan als PDF über denselben Link wie „Plan als Link speichern“; große Pläne gehen mit der Anfrage. */
  const pdfHref =
    d.plan.tueren.length > 0 && passtInLink(d.plan)
      ? `/schliessanlagen/konfigurator/schliessplan/pdf?plan=${kodiere(d.plan)}${d.extraIds.length ? `&wuensche=${encodeURIComponent(d.extraIds.join(','))}` : ''}`
      : null;

  return (
    <FlowShell
      flow={flow}
      title="Schließplan"
      submitLabel={preis.art === 'preis' ? 'In den Warenkorb' : 'Angebot anfragen'}
      onSubmit={handleSubmit}
      submitting={submitting}
      blockedHint={blockedHint[flow.step.id]}
      raster="seite"
      summe={d.plan.tueren.length ? summeKurz(preis) : undefined}
      schutz={schutz}
      abschlussHinweis={preis.art === 'preis' ? undefined : <AnfrageHinweis />}
      seite={
        d.plan.tueren.length > 0 && (
          <div className="space-y-3">
            <PlanSumme plan={d.plan} katalog={katalog} extraIds={d.extraIds} />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={linkKopieren}>
                Plan als Link speichern
              </Button>
              {pdfHref && (
                <ButtonLink href={pdfHref} download={SCHLIESSPLAN_DATEINAME} prefetch={false} variant="outline" size="sm">
                  Schließplan als PDF
                </ButtonLink>
              )}
            </div>
            <div role="status" className="text-small text-foreground-muted">
              {linkStatus && 'zuGross' in linkStatus && (
                <p>Der Plan ist zu groß für einen Link. Er bleibt in diesem Browser gespeichert; zur Weitergabe senden Sie uns die Anfrage.</p>
              )}
              {linkStatus && 'url' in linkStatus && (
                <>
                  <p>{linkStatus.kopiert ? 'Link kopiert.' : 'Kopieren Sie diesen Link.'} Er enthält Türen, Schlüssel und Bezeichnungen, keine Kontaktdaten.</p>
                  {!linkStatus.kopiert && (
                    <input
                      readOnly
                      value={linkStatus.url}
                      aria-label="Link zum Plan"
                      onFocus={(e) => e.currentTarget.select()}
                      className="mt-2 w-full rounded-lg border border-input bg-surface px-3 py-2 font-mono text-caption text-foreground"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )
      }
    >
      {fehler && (
        <Alert tone="warning" title="Absenden nicht möglich" className="mb-5" role="alert">
          {fehler}
        </Alert>
      )}

      {linkFehler && (
        <Alert tone="warning" title="Link nicht lesbar" className="mb-5" role="alert">
          <p>Dieser Link ließ sich nicht öffnen. Bitte lassen Sie ihn sich noch einmal schicken oder legen Sie den Plan neu an.</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={adresseBereinigen}>
            Hinweis schließen
          </Button>
        </Alert>
      )}

      {linkPlan && d.plan.tueren.length > 0 && (
        <Alert tone="info" title="Plan aus dem Link öffnen?" className="mb-5" role="status">
          <p>In diesem Browser liegt schon ein Plan. Der Plan aus dem Link würde ihn ersetzen.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                flow.updateAndGoTo({ start: 'link', plan: linkPlan }, 'tueren');
                adresseBereinigen();
              }}
            >
              Plan aus dem Link öffnen
            </Button>
            <Button size="sm" variant="outline" onClick={adresseBereinigen}>
              Meinen Plan behalten
            </Button>
          </div>
        </Alert>
      )}

      {flow.step.id === 'start' && (
        <div className="space-y-4">
          {d.start === 'link' && (
            <Alert tone="info" title="Plan aus dem Link geladen">
              Bitte prüfen Sie die Maße vor dem Bestellen noch einmal selbst.
            </Alert>
          )}
          {ersetzenDurch && (
            <Alert tone="warning" title="Vorhandenen Plan ersetzen?" role="alert">
              <p>Ihr Plan mit {d.plan.tueren.length} Türen geht dabei verloren.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => startSetzen(ersetzenDurch)}>
                  Plan ersetzen
                </Button>
                <Button size="sm" variant="outline" onClick={() => setErsetzenDurch(null)}>
                  Meinen Plan behalten
                </Button>
              </div>
            </Alert>
          )}
          {/* Privat oder Unternehmen (G-30): Empfehlung vor der Wahl, mit Beratung als Ausweg */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-small font-semibold text-foreground">Haus, kleines Team oder Firma?</p>
            <p className="mt-1 text-small leading-relaxed text-foreground-muted">
              Für ein Haus oder ein kleines Team genügt meist eine Sperrschließung: ein Schlüssel für alle Türen. Für
              Firmen mit mehreren Bereichen empfehlen wir eine Schließanlage, in der jeder nur seine Türen öffnet.
            </p>
            <Link href="/service-und-termin/kontakt" className="mt-2 inline-flex min-h-touch items-center text-small font-semibold text-primary hover:underline">
              Unsicher? Wir beraten Sie
            </Link>
          </div>
          <fieldset>
            <legend className="sr-only">Womit möchten Sie anfangen?</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {VORLAGEN.map((v) => (
                <OptionCard key={v.id} name="start" value={v.id} checked={d.start === v.id} onSelect={startWaehlen} title={v.titel} description={v.satz} />
              ))}
              <OptionCard
                name="start"
                value="leer"
                checked={d.start === 'leer'}
                onSelect={startWaehlen}
                title="Leerer Plan"
                description="Eine Tür und ein Schlüssel zum Anfangen."
              />
            </div>
          </fieldset>
          <p className="text-small text-foreground-muted">
            Lieber beschreiben statt planen?{' '}
            <Link href="/schliessanlagen/konfigurator" className="font-semibold text-primary hover:underline">
              Projekt beschreiben, wir planen die Anlage
            </Link>
          </p>
        </div>
      )}

      {flow.step.id === 'tueren' && <TuerenListe plan={d.plan} katalog={katalog} onChange={setPlan} />}

      {flow.step.id === 'schluessel' && (
        <div className="space-y-6">
          <SchluesselMatrix plan={d.plan} onChange={setPlan} />
          <PlanBefunde plan={d.plan} katalog={katalog} />
        </div>
      )}

      {flow.step.id === 'pruefen' && (
        <div className="space-y-6">
          <PlanBefunde plan={d.plan} katalog={katalog} />
          <figure className="m-0 rounded-lg border border-border bg-surface p-3 sm:p-4">
            <ZylinderMassGrafik params={{ beschlag: 'an' }} title="So messen Sie Maß A und Maß B: ab der Mitte der Stulpschraube bis zum Zylinderende" />
            <figcaption className="mt-2 text-small text-foreground-muted">
              Gemessen wird ab der Mitte der Stulpschraube bis zum Zylinderende. Maß A misst man nach außen, Maß B nach innen. Ein Schutzbeschlag zählt mit.
            </figcaption>
          </figure>
          {planExtras.length > 0 && (
            <fieldset>
              <legend className="text-title-sm font-bold text-foreground">{preis.art === 'preis' ? 'Zur Bestellung dazu' : 'Wünsche für das Angebot'}</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {planExtras.map((e) => (
                  <OptionCard
                    key={e.id}
                    name="plan-extras"
                    value={e.id}
                    multiple
                    checked={d.extraIds.includes(e.id)}
                    onSelect={(id) => flow.update({ extraIds: d.extraIds.includes(id) ? d.extraIds.filter((x) => x !== id) : [...d.extraIds, id] })}
                    title={e.label}
                    description={e.description}
                    meta={
                      preis.art === 'preis' ? (
                        <span className="font-mono tabular-nums">
                          {formatCents(e.priceCents)} {e.unit === 'stueck' ? 'je Zylinder' : 'einmalig'}
                        </span>
                      ) : undefined
                    }
                  />
                ))}
              </div>
            </fieldset>
          )}
          <label className="flex min-h-touch cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4">
            <input
              type="checkbox"
              checked={d.plan.masseGeprueft === true}
              onChange={(e) => setPlan({ ...d.plan, masseGeprueft: e.target.checked })}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-border-strong"
            />
            <span className="text-small leading-relaxed text-foreground">
              Maße geprüft: Ich habe Maß A und Maß B an jeder Tür selbst gemessen.
              {preis.art === 'preis' && (
                <>
                  <span className="ml-1 text-danger" aria-hidden>
                    *
                  </span>
                  <span className="sr-only"> (Pflichtangabe)</span>
                </>
              )}
            </span>
          </label>
        </div>
      )}

      {flow.step.id === 'abschluss' && (
        <div className="space-y-6">
          <PlanSumme plan={d.plan} katalog={katalog} extraIds={d.extraIds} />
          {preis.art === 'preis' ? (
            <p className="max-w-measure text-small text-foreground-muted">
              Im Warenkorb sehen Sie alle Positionen. In der Kasse prüfen und rechnen wir die Zusammenstellung noch einmal; die Werkstatt prüft die Maße vor der Fertigung.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Vorname" required>
                  {({ id }) => <TextInput id={id} autoComplete="given-name" value={d.contact.firstName} onChange={(e) => setContact('firstName', e.target.value)} />}
                </Field>
                <Field label="Nachname" required>
                  {({ id }) => <TextInput id={id} autoComplete="family-name" value={d.contact.lastName} onChange={(e) => setContact('lastName', e.target.value)} />}
                </Field>
                <Field label="Firma oder Hausverwaltung" className="sm:col-span-2">
                  {({ id }) => <TextInput id={id} autoComplete="organization" value={d.contact.company ?? ''} onChange={(e) => setContact('company', e.target.value)} />}
                </Field>
                <Field label="E-Mail-Adresse" required hint="Hierüber erhalten Sie unser Angebot.">
                  {({ id, describedBy }) => (
                    <TextInput id={id} type="email" autoComplete="email" aria-describedby={describedBy} value={d.contact.email} onChange={(e) => setContact('email', e.target.value)} />
                  )}
                </Field>
                <Field label="Telefon" required hint="Für kurze Rückfragen.">
                  {({ id, describedBy }) => (
                    <TextInput id={id} type="tel" inputMode="tel" autoComplete="tel" aria-describedby={describedBy} value={d.contact.phone} onChange={(e) => setContact('phone', e.target.value)} />
                  )}
                </Field>
                <Field label="Hinweise zum Objekt" className="sm:col-span-2" hint="Freiwillig. Zum Beispiel Gebäudeart, vorhandene Anlage oder Wunschtermin.">
                  {({ id, describedBy }) => (
                    <TextArea id={id} rows={3} aria-describedby={describedBy} value={d.notiz} maxLength={2000} onChange={(e) => flow.update({ notiz: e.target.value })} />
                  )}
                </Field>
              </div>
              <label className="flex min-h-touch cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4">
                <input
                  type="checkbox"
                  checked={d.consent}
                  onChange={(e) => flow.set('consent', e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-border-strong"
                />
                <span className="text-small leading-relaxed text-foreground-muted">
                  Ich habe die{' '}
                  <Link href="/rechtliches/datenschutz" className="font-semibold text-primary hover:underline">
                    Datenschutzerklärung
                  </Link>{' '}
                  gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung dieses Projekts verarbeitet werden.
                  <span className="ml-1 text-danger" aria-hidden>
                    *
                  </span>
                  <span className="sr-only"> (Pflichtangabe)</span>
                </span>
              </label>
            </div>
          )}
        </div>
      )}
    </FlowShell>
  );
}
