'use client';

import { useMemo, useState, useTransition } from 'react';
import { BookOpen, Check, CircleAlert, FileText, MapPin, Plus, Trash2, X } from 'lucide-react';

import { saveContent, type SaveResult } from '@/lib/actions/admin';
import { NAV_AREAS } from '@/lib/navigation';
import type { AreaKey, CityPage, Guide, ImageSlot, PageContent } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Field } from '@/components/forms/field';
import { Select, TextArea, TextInput } from '@/components/forms/controls';

/* ==========================================================================
   Gemeinsame Hilfsmittel
   ========================================================================== */

const TITEL_EMPFEHLUNG = 60;
const BESCHREIBUNG_EMPFEHLUNG = 160;

const BEREICHE: Array<{ key: AreaKey; label: string }> = NAV_AREAS.map((area) => ({
  key: area.key,
  label: area.label,
}));

/** Adresszusatz aus einem Titel ableiten, deutsche Umlaute werden umschrieben. */
function slugAusText(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toWholeNumber(value: string, min = 0): number | null {
  const raw = value.trim();
  if (raw === '') return null;
  const parsed = Number(raw.replace(',', '.'));
  if (!Number.isInteger(parsed) || parsed < min) return null;
  return parsed;
}

function Rueckmeldung({ result }: { result: SaveResult | null }) {
  if (!result) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2 rounded-lg border p-3 text-[13px] leading-relaxed',
        result.ok
          ? 'border-success/30 bg-success-soft text-foreground'
          : 'border-danger/30 bg-danger-soft text-foreground',
      )}
    >
      {result.ok ? (
        <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden />
      ) : (
        <CircleAlert size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden />
      )}
      <span>
        <strong className="font-bold">{result.ok ? 'Gespeichert. ' : 'Nicht gespeichert. '}</strong>
        {result.message}
      </span>
    </div>
  );
}

function LaengenWarnung({ wert, empfehlung }: { wert: string; empfehlung: number }) {
  if (wert.length <= empfehlung) return null;
  return (
    <p className="text-[13px] font-semibold text-warning">
      Empfehlung um {wert.length - empfehlung} Zeichen überschritten. Suchmaschinen zeigen den
      Text dann möglicherweise nur gekürzt an.
    </p>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface px-3.5 py-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 shrink-0 accent-primary"
      />
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </label>
  );
}

/** Schaltfläche zum Löschen mit Rückfrage in zwei Schritten. */
function LoeschKnopf({ onConfirm, label }: { onConfirm: () => void; label: string }) {
  const [sicher, setSicher] = useState(false);

  if (!sicher) {
    return (
      <Button type="button" variant="outline" onClick={() => setSicher(true)}>
        <Trash2 size={16} aria-hidden />
        {label}
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] font-semibold text-foreground">Wirklich löschen?</span>
      <Button type="button" variant="danger" onClick={onConfirm}>
        Ja, löschen
      </Button>
      <Button type="button" variant="ghost" onClick={() => setSicher(false)}>
        Abbrechen
      </Button>
    </div>
  );
}

/* ==========================================================================
   Umschaltung zwischen den drei Bereichen
   ========================================================================== */

type Bereich = 'seiten' | 'ratgeber' | 'staedte';

export function InhaltsVerwaltung({
  pages,
  guides,
  cities,
}: {
  pages: PageContent[];
  guides: Guide[];
  cities: CityPage[];
}) {
  const [bereich, setBereich] = useState<Bereich>('seiten');

  const tabs: Array<{ id: Bereich; label: string; icon: typeof FileText }> = [
    { id: 'seiten', label: 'Seiten', icon: FileText },
    { id: 'ratgeber', label: 'Ratgeber', icon: BookOpen },
    { id: 'staedte', label: 'Einsatzgebiete', icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Inhaltsbereich wählen" className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const aktiv = bereich === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={aktiv}
              onClick={() => setBereich(tab.id)}
              className={cn(
                'inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-4 text-[15px] font-semibold transition-colors',
                aktiv
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-foreground-muted hover:bg-surface-muted hover:text-foreground',
              )}
            >
              <Icon size={16} aria-hidden />
              {tab.label}
            </button>
          );
        })}
      </div>

      {bereich === 'seiten' && <SeitenBereich seiten={pages} />}
      {bereich === 'ratgeber' && <RatgeberBereich beitraege={guides} />}
      {bereich === 'staedte' && <StaedteBereich orte={cities} />}
    </div>
  );
}

/* ==========================================================================
   A) Seiten
   ========================================================================== */

interface AbschnittDraft {
  heading: string;
  body: string;
  image?: ImageSlot;
}

interface SeiteDraft {
  headline: string;
  subline: string;
  intro: string;
  title: string;
  description: string;
  links: Array<{ href: string; label: string }>;
  socialMotif: string;
  sections: AbschnittDraft[];
  faq: Array<{ question: string; answer: string }>;
}

function SeitenBereich({ seiten }: { seiten: PageContent[] }) {
  const [alle, setAlle] = useState<PageContent[]>(seiten);
  const [route, setRoute] = useState<string>(seiten[0]?.route ?? '');

  const aktuelle = alle.find((seite) => seite.route === route) ?? null;

  return (
    <div className="space-y-6">
      <h2 className="sr-only">Seiten</h2>

      <Card>
        <CardBody>
          <Field
            label="Seite auswählen"
            hint={`${alle.length} pflegbare Seiten. Der Eintrag „Startseite“ ist die Adresse ohne Zusatz.`}
          >
            {({ id, describedBy }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                value={route}
                onChange={(event) => setRoute(event.target.value)}
              >
                {alle.map((seite) => (
                  <option key={seite.route} value={seite.route}>
                    {seite.route === '' ? 'Startseite (/)' : `/${seite.route}`} — {seite.headline}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </CardBody>
      </Card>

      {aktuelle ? (
        <SeitenEditor
          key={aktuelle.route}
          seite={aktuelle}
          onSaved={(aktualisiert) =>
            setAlle((vorher) =>
              vorher.map((seite) => (seite.route === aktualisiert.route ? aktualisiert : seite)),
            )
          }
          alleSeiten={alle}
        />
      ) : (
        <Alert tone="info">Es ist noch keine Seite hinterlegt.</Alert>
      )}
    </div>
  );
}

function SeitenEditor({
  seite,
  alleSeiten,
  onSaved,
}: {
  seite: PageContent;
  alleSeiten: PageContent[];
  onSaved: (seite: PageContent) => void;
}) {
  const [draft, setDraft] = useState<SeiteDraft>({
    headline: seite.headline,
    subline: seite.subline,
    intro: seite.intro,
    title: seite.seo.title,
    description: seite.seo.description,
    links: seite.seo.internalLinks.map((link) => ({ ...link })),
    socialMotif: seite.seo.socialImage?.motif ?? '',
    sections: seite.sections.map((abschnitt) => ({ ...abschnitt })),
    faq: seite.faq.map((eintrag) => ({ ...eintrag })),
  });
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, starte] = useTransition();

  function setzen<K extends keyof SeiteDraft>(key: K, value: SeiteDraft[K]) {
    setDraft((vorher) => ({ ...vorher, [key]: value }));
    setResult(null);
  }

  function speichern() {
    if (draft.headline.trim() === '') {
      setResult({ ok: false, message: 'Die Überschrift darf nicht leer sein.' });
      return;
    }

    const socialImage: ImageSlot | undefined =
      draft.socialMotif.trim() === ''
        ? undefined
        : {
            motif: draft.socialMotif.trim(),
            ratio: seite.seo.socialImage?.ratio ?? '16/9',
            note: seite.seo.socialImage?.note,
          };

    const aktualisiert: PageContent = {
      ...seite,
      headline: draft.headline.trim(),
      subline: draft.subline.trim(),
      intro: draft.intro.trim(),
      sections: draft.sections
        .filter((abschnitt) => abschnitt.heading.trim() !== '' || abschnitt.body.trim() !== '')
        .map((abschnitt) => ({
          heading: abschnitt.heading.trim(),
          body: abschnitt.body.trim(),
          ...(abschnitt.image ? { image: abschnitt.image } : {}),
        })),
      faq: draft.faq
        .filter((eintrag) => eintrag.question.trim() !== '' || eintrag.answer.trim() !== '')
        .map((eintrag) => ({ question: eintrag.question.trim(), answer: eintrag.answer.trim() })),
      seo: {
        ...seite.seo,
        title: draft.title.trim(),
        description: draft.description.trim(),
        internalLinks: draft.links
          .filter((link) => link.href.trim() !== '' || link.label.trim() !== '')
          .map((link) => ({ href: link.href.trim(), label: link.label.trim() })),
        socialImage,
      },
      updatedAt: new Date().toISOString(),
    };

    const naechste = alleSeiten.map((eintrag) =>
      eintrag.route === seite.route ? aktualisiert : eintrag,
    );

    starte(async () => {
      const antwort = await saveContent('pages', naechste);
      setResult(antwort);
      if (antwort.ok) onSaved(aktualisiert);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">
            Seitentexte:{' '}
            <span className="font-mono text-foreground-muted">
              {seite.route === '' ? '/' : `/${seite.route}`}
            </span>
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Field label="Überschrift" required hint="Die sichtbare Hauptüberschrift der Seite.">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={draft.headline}
                onChange={(event) => setzen('headline', event.target.value)}
              />
            )}
          </Field>

          <Field label="Unterzeile" hint="Ein Satz unter der Überschrift.">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={draft.subline}
                onChange={(event) => setzen('subline', event.target.value)}
              />
            )}
          </Field>

          <Field label="Einleitung" hint="Der einleitende Absatz der Seite.">
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                rows={4}
                value={draft.intro}
                onChange={(event) => setzen('intro', event.target.value)}
              />
            )}
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Angaben für Suchmaschinen</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Diese beiden Texte erscheinen in der Ergebnisliste der Suchmaschinen.
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="space-y-1.5">
            <Field
              label="Seitentitel"
              hint={`${draft.title.length} Zeichen. Empfehlung: höchstens ${TITEL_EMPFEHLUNG}.`}
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.title}
                  onChange={(event) => setzen('title', event.target.value)}
                />
              )}
            </Field>
            <LaengenWarnung wert={draft.title} empfehlung={TITEL_EMPFEHLUNG} />
          </div>

          <div className="space-y-1.5">
            <Field
              label="Meta-Beschreibung"
              hint={`${draft.description.length} Zeichen. Empfehlung: höchstens ${BESCHREIBUNG_EMPFEHLUNG}.`}
            >
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  rows={3}
                  value={draft.description}
                  onChange={(event) => setzen('description', event.target.value)}
                />
              )}
            </Field>
            <LaengenWarnung wert={draft.description} empfehlung={BESCHREIBUNG_EMPFEHLUNG} />
          </div>

          <Field
            label="Bildplatzhalter für soziale Netzwerke"
            hint="Beschreiben Sie das Motiv, das beim Teilen der Seite zu sehen sein soll. Leer lassen, wenn kein Bild vorgesehen ist."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={draft.socialMotif}
                onChange={(event) => setzen('socialMotif', event.target.value)}
              />
            )}
          </Field>

          {draft.socialMotif.trim() !== '' && (
            <div className="max-w-sm">
              <ImagePlaceholder
                slot={{
                  motif: draft.socialMotif.trim(),
                  ratio: seite.seo.socialImage?.ratio ?? '16/9',
                  note: 'Vorschau der Bildstelle. Das Bild wird nicht hier hochgeladen.',
                }}
              />
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Interne Verweise</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Verweise auf thematisch passende Seiten. Das Ziel beginnt mit einem Schrägstrich,
            zum Beispiel <span className="font-mono">/autoschluessel</span>.
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          {draft.links.length === 0 && (
            <p className="text-[15px] text-foreground-muted">Noch kein Verweis hinterlegt.</p>
          )}

          {draft.links.map((link, index) => (
            <div key={`link-${index}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <Field label={`Ziel ${index + 1}`}>
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    value={link.href}
                    onChange={(event) =>
                      setzen(
                        'links',
                        draft.links.map((eintrag, i) =>
                          i === index ? { ...eintrag, href: event.target.value } : eintrag,
                        ),
                      )
                    }
                  />
                )}
              </Field>

              <Field label={`Beschriftung ${index + 1}`}>
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    value={link.label}
                    onChange={(event) =>
                      setzen(
                        'links',
                        draft.links.map((eintrag, i) =>
                          i === index ? { ...eintrag, label: event.target.value } : eintrag,
                        ),
                      )
                    }
                  />
                )}
              </Field>

              <Button
                type="button"
                variant="outline"
                onClick={() => setzen('links', draft.links.filter((_, i) => i !== index))}
              >
                <X size={16} aria-hidden />
                Entfernen
                <span className="sr-only"> — Verweis {index + 1}</span>
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => setzen('links', [...draft.links, { href: '', label: '' }])}
          >
            <Plus size={16} aria-hidden />
            Verweis hinzufügen
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Textabschnitte</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Frei anlegbare Abschnitte mit Überschrift und Text. Leere Abschnitte werden beim
            Speichern verworfen.
          </p>
        </CardHeader>
        <CardBody className="space-y-5">
          {draft.sections.length === 0 && (
            <p className="text-[15px] text-foreground-muted">Noch kein Abschnitt angelegt.</p>
          )}

          {draft.sections.map((abschnitt, index) => (
            <fieldset key={`abschnitt-${index}`} className="rounded-lg border border-border p-4">
              <legend className="px-2 text-sm font-bold text-foreground">Abschnitt {index + 1}</legend>

              <div className="space-y-4">
                <Field label={`Überschrift des Abschnitts ${index + 1}`}>
                  {({ id, describedBy }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      value={abschnitt.heading}
                      onChange={(event) =>
                        setzen(
                          'sections',
                          draft.sections.map((eintrag, i) =>
                            i === index ? { ...eintrag, heading: event.target.value } : eintrag,
                          ),
                        )
                      }
                    />
                  )}
                </Field>

                <Field label={`Text des Abschnitts ${index + 1}`}>
                  {({ id, describedBy }) => (
                    <TextArea
                      id={id}
                      aria-describedby={describedBy}
                      rows={4}
                      value={abschnitt.body}
                      onChange={(event) =>
                        setzen(
                          'sections',
                          draft.sections.map((eintrag, i) =>
                            i === index ? { ...eintrag, body: event.target.value } : eintrag,
                          ),
                        )
                      }
                    />
                  )}
                </Field>

                {abschnitt.image && (
                  <div className="max-w-sm">
                    <ImagePlaceholder slot={abschnitt.image} />
                  </div>
                )}

                <LoeschKnopf
                  label={`Abschnitt ${index + 1} entfernen`}
                  onConfirm={() =>
                    setzen('sections', draft.sections.filter((_, i) => i !== index))
                  }
                />
              </div>
            </fieldset>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => setzen('sections', [...draft.sections, { heading: '', body: '' }])}
          >
            <Plus size={16} aria-hidden />
            Abschnitt hinzufügen
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Häufige Fragen</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Je Eintrag eine Frage und die zugehörige Antwort.
          </p>
        </CardHeader>
        <CardBody className="space-y-5">
          {draft.faq.length === 0 && (
            <p className="text-[15px] text-foreground-muted">Noch keine Frage angelegt.</p>
          )}

          {draft.faq.map((eintrag, index) => (
            <fieldset key={`faq-${index}`} className="rounded-lg border border-border p-4">
              <legend className="px-2 text-sm font-bold text-foreground">Frage {index + 1}</legend>

              <div className="space-y-4">
                <Field label={`Frage ${index + 1}`}>
                  {({ id, describedBy }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      value={eintrag.question}
                      onChange={(event) =>
                        setzen(
                          'faq',
                          draft.faq.map((frage, i) =>
                            i === index ? { ...frage, question: event.target.value } : frage,
                          ),
                        )
                      }
                    />
                  )}
                </Field>

                <Field label={`Antwort ${index + 1}`}>
                  {({ id, describedBy }) => (
                    <TextArea
                      id={id}
                      aria-describedby={describedBy}
                      rows={3}
                      value={eintrag.answer}
                      onChange={(event) =>
                        setzen(
                          'faq',
                          draft.faq.map((frage, i) =>
                            i === index ? { ...frage, answer: event.target.value } : frage,
                          ),
                        )
                      }
                    />
                  )}
                </Field>

                <LoeschKnopf
                  label={`Frage ${index + 1} entfernen`}
                  onConfirm={() => setzen('faq', draft.faq.filter((_, i) => i !== index))}
                />
              </div>
            </fieldset>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => setzen('faq', [...draft.faq, { question: '', answer: '' }])}
          >
            <Plus size={16} aria-hidden />
            Frage hinzufügen
          </Button>
        </CardBody>
      </Card>

      <Card variant="muted">
        <CardBody className="space-y-3">
          <Rueckmeldung result={result} />
          <Button type="button" onClick={speichern} loading={pending}>
            Seite speichern
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

/* ==========================================================================
   B) Ratgeber
   ========================================================================== */

interface RatgeberDraft {
  slug: string;
  title: string;
  excerpt: string;
  topic: AreaKey;
  imageMotif: string;
  body: Array<{ heading: string; text: string }>;
  nextHref: string;
  nextLabel: string;
  seoTitle: string;
  seoDescription: string;
}

function RatgeberBereich({ beitraege }: { beitraege: Guide[] }) {
  const [alle, setAlle] = useState<Guide[]>(beitraege);
  const [auswahl, setAuswahl] = useState<string>(beitraege[0]?.id ?? '');
  const [neuerTitel, setNeuerTitel] = useState('');
  const [listenErgebnis, setListenErgebnis] = useState<SaveResult | null>(null);
  const [pending, starte] = useTransition();

  const aktueller = alle.find((beitrag) => beitrag.id === auswahl) ?? null;

  function anlegen() {
    const titel = neuerTitel.trim();
    const slug = slugAusText(titel);

    if (titel === '' || slug === '') {
      setListenErgebnis({ ok: false, message: 'Bitte einen Titel mit Buchstaben oder Ziffern eingeben.' });
      return;
    }
    if (alle.some((beitrag) => beitrag.slug === slug)) {
      setListenErgebnis({ ok: false, message: `Es gibt bereits einen Beitrag mit der Adresse „${slug}“.` });
      return;
    }

    const neu: Guide = {
      id: slug,
      slug,
      title: titel,
      excerpt: '',
      topic: BEREICHE[0]?.key ?? 'autoschluessel',
      body: [],
      image: { motif: `Bildmotiv zum Ratgeber „${titel}“`, ratio: '16/9' },
      nextStep: { href: '', label: '' },
      seo: { title: titel, description: '', internalLinks: [] },
      updatedAt: new Date().toISOString(),
    };

    const naechste = [...alle, neu];
    starte(async () => {
      const antwort = await saveContent('guides', naechste);
      setListenErgebnis(antwort);
      if (antwort.ok) {
        setAlle(naechste);
        setAuswahl(neu.id);
        setNeuerTitel('');
      }
    });
  }

  function loeschen(id: string) {
    const naechste = alle.filter((beitrag) => beitrag.id !== id);
    starte(async () => {
      const antwort = await saveContent('guides', naechste);
      setListenErgebnis(antwort);
      if (antwort.ok) {
        setAlle(naechste);
        setAuswahl(naechste[0]?.id ?? '');
      }
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="sr-only">Ratgeber</h2>

      <Card>
        <CardBody className="space-y-4">
          <Field label="Beitrag auswählen" hint={`${alle.length} Beiträge vorhanden.`}>
            {({ id, describedBy }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                value={auswahl}
                onChange={(event) => setAuswahl(event.target.value)}
              >
                {alle.length === 0 && <option value="">Noch kein Beitrag vorhanden</option>}
                {alle.map((beitrag) => (
                  <option key={beitrag.id} value={beitrag.id}>
                    {beitrag.title}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <Field
              label="Neuen Beitrag anlegen"
              hint="Der Titel bestimmt zugleich die Adresse des Beitrags. Beides lässt sich danach ändern."
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={neuerTitel}
                  onChange={(event) => setNeuerTitel(event.target.value)}
                  placeholder="Titel des neuen Beitrags"
                />
              )}
            </Field>
            <Button type="button" onClick={anlegen} loading={pending}>
              <Plus size={16} aria-hidden />
              Beitrag anlegen
            </Button>
          </div>

          <Rueckmeldung result={listenErgebnis} />
        </CardBody>
      </Card>

      {aktueller ? (
        <RatgeberEditor
          key={aktueller.id}
          beitrag={aktueller}
          alleBeitraege={alle}
          onSaved={(aktualisiert) =>
            setAlle((vorher) =>
              vorher.map((beitrag) => (beitrag.id === aktualisiert.id ? aktualisiert : beitrag)),
            )
          }
          onDelete={() => loeschen(aktueller.id)}
        />
      ) : (
        <Alert tone="info">
          Es ist noch kein Ratgeberbeitrag vorhanden. Legen Sie oben einen neuen Beitrag an.
        </Alert>
      )}
    </div>
  );
}

function RatgeberEditor({
  beitrag,
  alleBeitraege,
  onSaved,
  onDelete,
}: {
  beitrag: Guide;
  alleBeitraege: Guide[];
  onSaved: (beitrag: Guide) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<RatgeberDraft>({
    slug: beitrag.slug,
    title: beitrag.title,
    excerpt: beitrag.excerpt,
    topic: beitrag.topic,
    imageMotif: beitrag.image.motif,
    body: beitrag.body.map((abschnitt) => ({ ...abschnitt })),
    nextHref: beitrag.nextStep.href,
    nextLabel: beitrag.nextStep.label,
    seoTitle: beitrag.seo.title,
    seoDescription: beitrag.seo.description,
  });
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, starte] = useTransition();

  function setzen<K extends keyof RatgeberDraft>(key: K, value: RatgeberDraft[K]) {
    setDraft((vorher) => ({ ...vorher, [key]: value }));
    setResult(null);
  }

  function speichern() {
    const slug = slugAusText(draft.slug);
    if (draft.title.trim() === '') {
      setResult({ ok: false, message: 'Der Titel darf nicht leer sein.' });
      return;
    }
    if (slug === '') {
      setResult({ ok: false, message: 'Die Adresse darf nicht leer sein.' });
      return;
    }
    if (alleBeitraege.some((eintrag) => eintrag.id !== beitrag.id && eintrag.slug === slug)) {
      setResult({ ok: false, message: `Die Adresse „${slug}“ wird bereits von einem anderen Beitrag verwendet.` });
      return;
    }

    const aktualisiert: Guide = {
      ...beitrag,
      slug,
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      topic: draft.topic,
      image: { ...beitrag.image, motif: draft.imageMotif.trim() || beitrag.image.motif },
      body: draft.body
        .filter((abschnitt) => abschnitt.heading.trim() !== '' || abschnitt.text.trim() !== '')
        .map((abschnitt) => ({ heading: abschnitt.heading.trim(), text: abschnitt.text.trim() })),
      nextStep: { href: draft.nextHref.trim(), label: draft.nextLabel.trim() },
      seo: {
        ...beitrag.seo,
        title: draft.seoTitle.trim(),
        description: draft.seoDescription.trim(),
      },
      updatedAt: new Date().toISOString(),
    };

    const naechste = alleBeitraege.map((eintrag) =>
      eintrag.id === beitrag.id ? aktualisiert : eintrag,
    );

    starte(async () => {
      const antwort = await saveContent('guides', naechste);
      setResult(antwort);
      if (antwort.ok) onSaved(aktualisiert);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Beitrag bearbeiten</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Erreichbar unter <span className="font-mono">/ratgeber/{draft.slug}</span>
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Titel" required>
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.title}
                  onChange={(event) => setzen('title', event.target.value)}
                />
              )}
            </Field>

            <Field
              label="Adresse des Beitrags"
              required
              hint="Kleinbuchstaben, Ziffern und Bindestriche. Eine Änderung ändert die Adresse der Seite."
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.slug}
                  onChange={(event) => setzen('slug', event.target.value)}
                  className="font-mono text-[14px]"
                  spellCheck={false}
                />
              )}
            </Field>
          </div>

          <Field label="Kurzfassung" hint="Ein bis zwei Sätze für Übersichten und Verweise.">
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                rows={3}
                value={draft.excerpt}
                onChange={(event) => setzen('excerpt', event.target.value)}
              />
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Thema" hint="Ordnet den Beitrag einem Leistungsbereich zu.">
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.topic}
                  onChange={(event) => setzen('topic', event.target.value as AreaKey)}
                >
                  {BEREICHE.map((bereich) => (
                    <option key={bereich.key} value={bereich.key}>
                      {bereich.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field label="Bildmotiv" hint="Beschreibt, welches Bild später an dieser Stelle steht.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.imageMotif}
                  onChange={(event) => setzen('imageMotif', event.target.value)}
                />
              )}
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Textabschnitte</h3>
        </CardHeader>
        <CardBody className="space-y-5">
          {draft.body.length === 0 && (
            <p className="text-[15px] text-foreground-muted">Noch kein Abschnitt angelegt.</p>
          )}

          {draft.body.map((abschnitt, index) => (
            <fieldset key={`ratgeber-abschnitt-${index}`} className="rounded-lg border border-border p-4">
              <legend className="px-2 text-sm font-bold text-foreground">Abschnitt {index + 1}</legend>

              <div className="space-y-4">
                <Field label={`Überschrift des Abschnitts ${index + 1}`}>
                  {({ id, describedBy }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      value={abschnitt.heading}
                      onChange={(event) =>
                        setzen(
                          'body',
                          draft.body.map((eintrag, i) =>
                            i === index ? { ...eintrag, heading: event.target.value } : eintrag,
                          ),
                        )
                      }
                    />
                  )}
                </Field>

                <Field label={`Text des Abschnitts ${index + 1}`}>
                  {({ id, describedBy }) => (
                    <TextArea
                      id={id}
                      aria-describedby={describedBy}
                      rows={4}
                      value={abschnitt.text}
                      onChange={(event) =>
                        setzen(
                          'body',
                          draft.body.map((eintrag, i) =>
                            i === index ? { ...eintrag, text: event.target.value } : eintrag,
                          ),
                        )
                      }
                    />
                  )}
                </Field>

                <LoeschKnopf
                  label={`Abschnitt ${index + 1} entfernen`}
                  onConfirm={() => setzen('body', draft.body.filter((_, i) => i !== index))}
                />
              </div>
            </fieldset>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => setzen('body', [...draft.body, { heading: '', text: '' }])}
          >
            <Plus size={16} aria-hidden />
            Abschnitt hinzufügen
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Nächster Schritt und Suchmaschinen</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Der nächste Schritt steht am Ende des Beitrags und führt weiter in den passenden Ablauf.
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ziel des nächsten Schritts" hint="Beginnt mit einem Schrägstrich.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.nextHref}
                  onChange={(event) => setzen('nextHref', event.target.value)}
                />
              )}
            </Field>

            <Field label="Beschriftung des nächsten Schritts">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.nextLabel}
                  onChange={(event) => setzen('nextLabel', event.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="space-y-1.5">
            <Field
              label="Seitentitel"
              hint={`${draft.seoTitle.length} Zeichen. Empfehlung: höchstens ${TITEL_EMPFEHLUNG}.`}
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.seoTitle}
                  onChange={(event) => setzen('seoTitle', event.target.value)}
                />
              )}
            </Field>
            <LaengenWarnung wert={draft.seoTitle} empfehlung={TITEL_EMPFEHLUNG} />
          </div>

          <div className="space-y-1.5">
            <Field
              label="Meta-Beschreibung"
              hint={`${draft.seoDescription.length} Zeichen. Empfehlung: höchstens ${BESCHREIBUNG_EMPFEHLUNG}.`}
            >
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  rows={3}
                  value={draft.seoDescription}
                  onChange={(event) => setzen('seoDescription', event.target.value)}
                />
              )}
            </Field>
            <LaengenWarnung wert={draft.seoDescription} empfehlung={BESCHREIBUNG_EMPFEHLUNG} />
          </div>
        </CardBody>
      </Card>

      <Card variant="muted">
        <CardBody className="space-y-3">
          <Rueckmeldung result={result} />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={speichern} loading={pending}>
              Beitrag speichern
            </Button>
            <LoeschKnopf label="Beitrag löschen" onConfirm={onDelete} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ==========================================================================
   C) Einsatzgebiete
   ========================================================================== */

interface OrtDraft {
  slug: string;
  city: string;
  state: string;
  localIntro: string;
  localFacts: Array<{ label: string; value: string }>;
  onSiteRadiusKm: string;
  servicesOffered: AreaKey[];
  seoTitle: string;
  seoDescription: string;
}

function hatPlatzhalter(ort: CityPage): boolean {
  return (
    ort.localIntro.includes('[') ||
    ort.localFacts.some((fakt) => fakt.value.includes('[') || fakt.label.includes('['))
  );
}

function StaedteBereich({ orte }: { orte: CityPage[] }) {
  const [alle, setAlle] = useState<CityPage[]>(orte);
  const [auswahl, setAuswahl] = useState<string>(orte[0]?.id ?? '');
  const [neuerOrt, setNeuerOrt] = useState('');
  const [listenErgebnis, setListenErgebnis] = useState<SaveResult | null>(null);
  const [pending, starte] = useTransition();

  const aktueller = alle.find((ort) => ort.id === auswahl) ?? null;
  const platzhalterAnzahl = useMemo(() => alle.filter(hatPlatzhalter).length, [alle]);

  function anlegen() {
    const name = neuerOrt.trim();
    const slug = slugAusText(name);

    if (name === '' || slug === '') {
      setListenErgebnis({ ok: false, message: 'Bitte einen Ortsnamen mit Buchstaben oder Ziffern eingeben.' });
      return;
    }
    if (alle.some((ort) => ort.slug === slug)) {
      setListenErgebnis({ ok: false, message: `Es gibt bereits ein Einsatzgebiet mit der Adresse „${slug}“.` });
      return;
    }

    const neu: CityPage = {
      id: slug,
      slug,
      city: name,
      state: '',
      localIntro: '',
      localFacts: [],
      servicesOffered: [],
      onSiteRadiusKm: 0,
      seo: { title: '', description: '', internalLinks: [] },
      updatedAt: new Date().toISOString(),
    };

    const naechste = [...alle, neu];
    starte(async () => {
      const antwort = await saveContent('cities', naechste);
      setListenErgebnis(antwort);
      if (antwort.ok) {
        setAlle(naechste);
        setAuswahl(neu.id);
        setNeuerOrt('');
      }
    });
  }

  function loeschen(id: string) {
    const naechste = alle.filter((ort) => ort.id !== id);
    starte(async () => {
      const antwort = await saveContent('cities', naechste);
      setListenErgebnis(antwort);
      if (antwort.ok) {
        setAlle(naechste);
        setAuswahl(naechste[0]?.id ?? '');
      }
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="sr-only">Einsatzgebiete</h2>

      <Alert tone="warning" title="Stadtseiten brauchen echten örtlichen Mehrwert">
        Jede Stadtseite muss beschreiben, was vor Ort tatsächlich gilt: übliche Objektarten,
        realistische Anfahrt, angebotene Leistungen. Derselbe Text mehrfach mit ausgetauschtem
        Ortsnamen ist keine eigenständige Seite und schadet der Auffindbarkeit.
        {platzhalterAnzahl > 0 && (
          <>
            {' '}
            Zurzeit enthalten {platzhalterAnzahl} von {alle.length} Einsatzgebieten noch
            unveränderten Platzhaltertext in eckigen Klammern.
          </>
        )}
      </Alert>

      <Card>
        <CardBody className="space-y-4">
          <Field label="Einsatzgebiet auswählen" hint={`${alle.length} Einsatzgebiete vorhanden.`}>
            {({ id, describedBy }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                value={auswahl}
                onChange={(event) => setAuswahl(event.target.value)}
              >
                {alle.length === 0 && <option value="">Noch kein Einsatzgebiet vorhanden</option>}
                {alle.map((ort) => (
                  <option key={ort.id} value={ort.id}>
                    {ort.city}
                    {hatPlatzhalter(ort) ? ' — Platzhaltertext' : ''}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {aktueller && hatPlatzhalter(aktueller) && (
            <p>
              <Badge tone="warning">Dieses Einsatzgebiet enthält noch Platzhaltertext</Badge>
            </p>
          )}

          <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <Field
              label="Neues Einsatzgebiet anlegen"
              hint="Der Ortsname bestimmt zugleich die Adresse der Seite."
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={neuerOrt}
                  onChange={(event) => setNeuerOrt(event.target.value)}
                  placeholder="Name des Ortes"
                />
              )}
            </Field>
            <Button type="button" onClick={anlegen} loading={pending}>
              <Plus size={16} aria-hidden />
              Einsatzgebiet anlegen
            </Button>
          </div>

          <Rueckmeldung result={listenErgebnis} />
        </CardBody>
      </Card>

      {aktueller ? (
        <OrtEditor
          key={aktueller.id}
          ort={aktueller}
          alleOrte={alle}
          onSaved={(aktualisiert) =>
            setAlle((vorher) =>
              vorher.map((eintrag) => (eintrag.id === aktualisiert.id ? aktualisiert : eintrag)),
            )
          }
          onDelete={() => loeschen(aktueller.id)}
        />
      ) : (
        <Alert tone="info">
          Es ist noch kein Einsatzgebiet vorhanden. Legen Sie oben ein neues an.
        </Alert>
      )}
    </div>
  );
}

function OrtEditor({
  ort,
  alleOrte,
  onSaved,
  onDelete,
}: {
  ort: CityPage;
  alleOrte: CityPage[];
  onSaved: (ort: CityPage) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<OrtDraft>({
    slug: ort.slug,
    city: ort.city,
    state: ort.state,
    localIntro: ort.localIntro,
    localFacts: ort.localFacts.map((fakt) => ({ ...fakt })),
    onSiteRadiusKm: String(ort.onSiteRadiusKm),
    servicesOffered: [...ort.servicesOffered],
    seoTitle: ort.seo.title,
    seoDescription: ort.seo.description,
  });
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, starte] = useTransition();

  function setzen<K extends keyof OrtDraft>(key: K, value: OrtDraft[K]) {
    setDraft((vorher) => ({ ...vorher, [key]: value }));
    setResult(null);
  }

  const radius = toWholeNumber(draft.onSiteRadiusKm, 0);
  const radiusFehler = radius === null ? 'Bitte eine ganze Zahl ab 0 eintragen.' : undefined;

  function speichern() {
    const slug = slugAusText(draft.slug);
    if (draft.city.trim() === '') {
      setResult({ ok: false, message: 'Der Ortsname darf nicht leer sein.' });
      return;
    }
    if (slug === '') {
      setResult({ ok: false, message: 'Die Adresse darf nicht leer sein.' });
      return;
    }
    if (alleOrte.some((eintrag) => eintrag.id !== ort.id && eintrag.slug === slug)) {
      setResult({ ok: false, message: `Die Adresse „${slug}“ wird bereits von einem anderen Einsatzgebiet verwendet.` });
      return;
    }
    if (radius === null) {
      setResult({ ok: false, message: 'Der Einsatzradius muss eine ganze Zahl sein.' });
      return;
    }

    const aktualisiert: CityPage = {
      ...ort,
      slug,
      city: draft.city.trim(),
      state: draft.state.trim(),
      localIntro: draft.localIntro.trim(),
      localFacts: draft.localFacts
        .filter((fakt) => fakt.label.trim() !== '' || fakt.value.trim() !== '')
        .map((fakt) => ({ label: fakt.label.trim(), value: fakt.value.trim() })),
      servicesOffered: draft.servicesOffered,
      onSiteRadiusKm: radius,
      seo: {
        ...ort.seo,
        title: draft.seoTitle.trim(),
        description: draft.seoDescription.trim(),
      },
      updatedAt: new Date().toISOString(),
    };

    const naechste = alleOrte.map((eintrag) => (eintrag.id === ort.id ? aktualisiert : eintrag));

    starte(async () => {
      const antwort = await saveContent('cities', naechste);
      setResult(antwort);
      if (antwort.ok) onSaved(aktualisiert);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Einsatzgebiet bearbeiten</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Erreichbar unter <span className="font-mono">/standorte/{draft.slug}</span>
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Ort" required>
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.city}
                  onChange={(event) => setzen('city', event.target.value)}
                />
              )}
            </Field>

            <Field label="Bundesland">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.state}
                  onChange={(event) => setzen('state', event.target.value)}
                />
              )}
            </Field>

            <Field label="Adresse der Seite" required hint="Kleinbuchstaben, Ziffern, Bindestriche.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.slug}
                  onChange={(event) => setzen('slug', event.target.value)}
                  className="font-mono text-[14px]"
                  spellCheck={false}
                />
              )}
            </Field>
          </div>

          <Field
            label="Örtlicher Text"
            hint="Was in diesem Gebiet tatsächlich gilt — Objektarten, Anfahrt, Besonderheiten. Bitte keinen allgemeinen Text mehrfach verwenden."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                rows={6}
                value={draft.localIntro}
                onChange={(event) => setzen('localIntro', event.target.value)}
              />
            )}
          </Field>

          <Field label="Einsatzradius in Kilometern" required error={radiusFehler}>
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                inputMode="numeric"
                value={draft.onSiteRadiusKm}
                onChange={(event) => setzen('onSiteRadiusKm', event.target.value)}
              />
            )}
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Örtliche Fakten</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Kurze Angaben, die auf der Stadtseite als Liste erscheinen.
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          {draft.localFacts.length === 0 && (
            <p className="text-[15px] text-foreground-muted">Noch keine Angabe hinterlegt.</p>
          )}

          {draft.localFacts.map((fakt, index) => (
            <div key={`fakt-${index}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <Field label={`Bezeichnung ${index + 1}`}>
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    value={fakt.label}
                    onChange={(event) =>
                      setzen(
                        'localFacts',
                        draft.localFacts.map((eintrag, i) =>
                          i === index ? { ...eintrag, label: event.target.value } : eintrag,
                        ),
                      )
                    }
                  />
                )}
              </Field>

              <Field label={`Wert ${index + 1}`}>
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    value={fakt.value}
                    onChange={(event) =>
                      setzen(
                        'localFacts',
                        draft.localFacts.map((eintrag, i) =>
                          i === index ? { ...eintrag, value: event.target.value } : eintrag,
                        ),
                      )
                    }
                  />
                )}
              </Field>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setzen('localFacts', draft.localFacts.filter((_, i) => i !== index))
                }
              >
                <X size={16} aria-hidden />
                Entfernen
                <span className="sr-only"> — Angabe {index + 1}</span>
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => setzen('localFacts', [...draft.localFacts, { label: '', value: '' }])}
          >
            <Plus size={16} aria-hidden />
            Angabe hinzufügen
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Angebotene Bereiche</h3>
          <p className="mt-1 text-[13px] text-foreground-muted">
            Welche Leistungsbereiche in diesem Gebiet angeboten werden.
          </p>
        </CardHeader>
        <CardBody>
          <fieldset>
            <legend className="sr-only">Angebotene Bereiche auswählen</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {BEREICHE.map((bereich) => {
                const gewaehlt = draft.servicesOffered.includes(bereich.key);
                return (
                  <CheckRow
                    key={bereich.key}
                    checked={gewaehlt}
                    label={bereich.label}
                    onChange={(wert) =>
                      setzen(
                        'servicesOffered',
                        wert
                          ? [...draft.servicesOffered, bereich.key]
                          : draft.servicesOffered.filter((eintrag) => eintrag !== bereich.key),
                      )
                    }
                  />
                );
              })}
            </div>
          </fieldset>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-bold text-foreground">Angaben für Suchmaschinen</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="space-y-1.5">
            <Field
              label="Seitentitel"
              hint={`${draft.seoTitle.length} Zeichen. Empfehlung: höchstens ${TITEL_EMPFEHLUNG}.`}
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={draft.seoTitle}
                  onChange={(event) => setzen('seoTitle', event.target.value)}
                />
              )}
            </Field>
            <LaengenWarnung wert={draft.seoTitle} empfehlung={TITEL_EMPFEHLUNG} />
          </div>

          <div className="space-y-1.5">
            <Field
              label="Meta-Beschreibung"
              hint={`${draft.seoDescription.length} Zeichen. Empfehlung: höchstens ${BESCHREIBUNG_EMPFEHLUNG}.`}
            >
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  rows={3}
                  value={draft.seoDescription}
                  onChange={(event) => setzen('seoDescription', event.target.value)}
                />
              )}
            </Field>
            <LaengenWarnung wert={draft.seoDescription} empfehlung={BESCHREIBUNG_EMPFEHLUNG} />
          </div>
        </CardBody>
      </Card>

      <Card variant="muted">
        <CardBody className="space-y-3">
          <Rueckmeldung result={result} />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={speichern} loading={pending}>
              Einsatzgebiet speichern
            </Button>
            <LoeschKnopf label="Einsatzgebiet löschen" onConfirm={onDelete} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
