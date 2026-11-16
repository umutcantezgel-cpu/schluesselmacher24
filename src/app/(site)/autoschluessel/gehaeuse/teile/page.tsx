import type { Metadata } from 'next';
import Link from 'next/link';

import { artikelPfad, istIndexierbar } from '@/lib/artikel';
import { getBauformen, getFahrzeugkatalog, getFahrzeugteile, getPageContent } from '@/lib/data';
import {
  SCHLUESSELTYP_LABEL,
  TEILEART_LABEL,
  bauformNamen,
  filterAuswahl,
  filterGesetzt,
  type FahrzeugteilFilter,
} from '@/lib/data/fahrzeugteile';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { SeitenDaten } from '@/components/seo/seiten-daten';
import { Select, TextInput } from '@/components/forms/controls';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import {
  GEHAEUSE_ANFRAGE_PFAD,
  GEHAEUSE_PFAD,
  LISTE_ANKER,
  TEILE_PFAD,
  filterZeilen,
  reiheName,
  teileFilter,
  teileGruppieren,
  teilKarte,
  type TeilKarte,
} from './ansicht';
import { MeinFahrzeug } from './mein-fahrzeug';

const ROUTE = 'autoschluessel/gehaeuse/teile';
const TITEL = 'Autoschlüssel-Gehäuse und Teile';
const BESCHREIBUNG =
  'Gehäuse, Tasten und weitere Ersatzteile für Ihren Autoschlüssel nach Marke, Modell, Bauform und Tastenzahl. Mit Hinweis, was vom alten Schlüssel bleibt.';
/** Ohne Teile: kein Versprechen einer Auswahl (R4). Die Seite steht dann auf noindex. */
const BESCHREIBUNG_LEER = 'Gehäuse und Ersatzteile für Autoschlüssel fragen Sie zurzeit bei uns an: mit Fahrzeug, drei Fotos des Schlüssels und Fahrzeugschein.';
const CRUMBS = [
  { href: '/autoschluessel', label: 'Autoschlüssel' },
  { href: GEHAEUSE_PFAD, label: 'Gehäuse' },
  { href: TEILE_PFAD, label: 'Gehäuse und Ersatzteile' },
];

interface SeiteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function laden(props: SeiteProps) {
  const [suche, teile, bauformen, katalog, page] = await Promise.all([
    props.searchParams,
    getFahrzeugteile(),
    getBauformen(),
    getFahrzeugkatalog(),
    getPageContent(ROUTE),
  ]);
  return { filter: teileFilter(suche, katalog), teile, bauformen, katalog, page };
}

export async function generateMetadata(props: SeiteProps): Promise<Metadata> {
  const { filter, teile, page } = await laden(props);
  // Eine gefilterte Ansicht ist keine eigene Seite (R2, R3); ohne echte Teile keine Seite für Suchmaschinen.
  const indexierbar = !page?.seo.noindex && !filterGesetzt(filter) && teile.some(istIndexierbar);
  return {
    title: page?.seo.title ?? TITEL,
    description: teile.length ? page?.seo.description ?? BESCHREIBUNG : BESCHREIBUNG_LEER,
    alternates: { canonical: TEILE_PFAD },
    ...(indexierbar ? {} : { robots: { index: false, follow: true } }),
  };
}

/** Liste der Gehäuse und Ersatzteile mit Filter nach Fahrzeug (FA-SHOP-02B, FA-14-01 bis FA-14-03, FA-14-10). */
export default async function GehaeuseTeilePage(props: SeiteProps) {
  const { filter, teile, bauformen, katalog, page } = await laden(props);
  const titel = page?.headline ?? 'Gehäuse und Ersatzteile';
  const quellen = { bauformen, katalog };

  return (
    <>
      <SeitenDaten pfad={TEILE_PFAD} name={titel} crumbs={CRUMBS} />
      <PageHeader
        bereich="autoschluessel"
        eyebrow="Autoschlüssel"
        title={titel}
        lead={
          page?.subline
          ?? (teile.length
            ? 'Wählen Sie Ihr Fahrzeug. Jedes Teil sagt, wozu es passt und was von Ihrem alten Schlüssel bleibt.'
            : 'Gehäuse und Ersatzteile fragen Sie zurzeit bei uns an. Wir prüfen, was zu Ihrem Schlüssel passt.')
        }
        crumbs={CRUMBS}
      />
      {teile.length === 0 ? <OhneTeile /> : <MitTeilen filter={filter} teile={teile} quellen={quellen} />}

      <Section tone="muted" tight labelledBy="teile-weiter">
        <SectionHeading
          id="teile-weiter"
          nummer={teile.length ? '03' : '02'}
          eyebrow="Weiter"
          title="Lieber tauschen lassen?"
          lead="Wir setzen die Technik Ihres Schlüssels in ein neues Gehäuse oder reparieren Tasten und Mechanik, wenn das bei Ihrem Schlüssel geht."
        />
        <ul className="mt-8 border-t border-border">
          {[
            { href: GEHAEUSE_PFAD, label: 'Gehäusetausch und Reparatur' },
            { href: '/autoschluessel/customizing', label: 'Customizing: neue Optik für Ihren Schlüssel' },
            { href: GEHAEUSE_ANFRAGE_PFAD, label: 'Gehäuse-Anfrage' },
          ].map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link href={link.href} className="group flex min-h-touch items-center gap-4 py-5">
                <span className="min-w-0 flex-1 text-title-sm font-semibold text-foreground group-hover:text-primary">{link.label}</span>
                <GlyphPfeilRechts size={18} className="shrink-0 text-foreground-muted group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

/** Ehrlicher Zustand ohne Teile und der Weg in die Gehäuse-Anfrage (Muster `/shop`). */
function OhneTeile() {
  return (
    <Section tight labelledBy="teile-leer">
      <Card variant="muted">
        <CardBody className="flex flex-col items-start gap-4 py-8">
          <div>
            <h2 id="teile-leer" className="text-body font-bold text-foreground">
              Hier gibt es gerade keine Gehäuse und Ersatzteile zum Bestellen.
            </h2>
            <p className="mt-2 max-w-measure text-small leading-relaxed text-foreground-muted">
              Nennen Sie uns in der Gehäuse-Anfrage Ihr Fahrzeug und schicken Sie drei Fotos des Schlüssels und den
              Fahrzeugschein. Wir prüfen, was passt, und melden uns mit Preis und Ablauf.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={GEHAEUSE_ANFRAGE_PFAD} pfeil>
              Gehäuse anfragen
            </ButtonLink>
            <ButtonLink href={GEHAEUSE_PFAD} variant="outline">
              Gehäusetausch und Reparatur
            </ButtonLink>
          </div>
        </CardBody>
      </Card>
    </Section>
  );
}

type Quellen = Parameters<typeof teilKarte>[2];

function MitTeilen({ filter, teile, quellen }: { filter: FahrzeugteilFilter; teile: Parameters<typeof teileGruppieren>[0]; quellen: Quellen }) {
  const auswahl = filterAuswahl(teile);
  const gruppen = teileGruppieren(teile, filter);
  const karten = (liste: typeof gruppen.passend) => liste.map((a) => teilKarte(a, filter, quellen));
  const zeilen = filterZeilen(filter, quellen);
  const mitFahrzeug = Boolean(filter.marke);
  const treffer = gruppen.passend.length + gruppen.allgemein.length;
  const reihenOptionen = auswahl.marken.flatMap((marke) =>
    (auswahl.reihen[marke] ?? [])
      .map((id) => ({ id, marke, name: reiheName(id, quellen.katalog) }))
      .filter((r): r is { id: string; marke: string; name: string } => Boolean(r.name)),
  );
  const feld = 'flex flex-col gap-1.5';
  const beschriftung = 'text-small font-semibold text-foreground';

  return (
    <>
      <Section tight labelledBy="teile-auswahl">
        <div className="border-t border-border pt-8">
          <SectionHeading
            id="teile-auswahl"
            nummer="01"
            eyebrow="Auswahl"
            title="Ihr Fahrzeug und Ihr Schlüssel"
            lead="Die Auswahl zeigt nur Merkmale, die es bei unseren Teilen gibt."
          />
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {auswahl.marken.length > 0 && <MeinFahrzeug filter={filter} />}
          {/* Ohne JavaScript: Formular mit Adresse (GET); die gefilterte Ansicht steht auf noindex. */}
          <form method="get" action={`${TEILE_PFAD}#${LISTE_ANKER}`} className="grid gap-4 sm:grid-cols-2" aria-label="Teile filtern">
            {auswahl.marken.length > 0 && (
              <div className={feld}>
                <label htmlFor="filter-marke" className={beschriftung}>Marke</label>
                <Select id="filter-marke" name="marke" defaultValue={filter.marke ?? ''}>
                  <option value="">Alle Marken</option>
                  {auswahl.marken.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </Select>
              </div>
            )}
            {reihenOptionen.length > 0 && (
              <div className={feld}>
                <label htmlFor="filter-reihe" className={beschriftung}>Modell</label>
                <Select id="filter-reihe" name="reihe" defaultValue={filter.reihe ?? ''}>
                  <option value="">Alle Modelle</option>
                  {reihenOptionen.map((r) => (
                    <option key={r.id} value={r.id}>{`${r.marke} ${r.name}`}</option>
                  ))}
                </Select>
              </div>
            )}
            {auswahl.marken.length > 0 && (
              <div className={feld}>
                <label htmlFor="filter-baujahr" className={beschriftung}>Baujahr</label>
                <TextInput id="filter-baujahr" name="baujahr" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} defaultValue={filter.baujahr ?? ''} />
              </div>
            )}
            {auswahl.bauformen.length > 0 && (
              <div className={feld}>
                <label htmlFor="filter-bauform" className={beschriftung}>Bauform</label>
                <Select id="filter-bauform" name="bauform" defaultValue={filter.bauform ?? ''}>
                  <option value="">Alle Bauformen</option>
                  {auswahl.bauformen.map((b) => (
                    <option key={b} value={b}>{bauformNamen([b], quellen.bauformen)[0] ?? b}</option>
                  ))}
                </Select>
              </div>
            )}
            {auswahl.tastenzahlen.length > 0 && (
              <div className={feld}>
                <label htmlFor="filter-tasten" className={beschriftung}>Tasten</label>
                <Select id="filter-tasten" name="tasten" defaultValue={filter.tastenzahl ?? ''}>
                  <option value="">Jede Tastenzahl</option>
                  {auswahl.tastenzahlen.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
            )}
            {auswahl.teilearten.length > 1 && (
              <div className={feld}>
                <label htmlFor="filter-teil" className={beschriftung}>Teil</label>
                <Select id="filter-teil" name="teil" defaultValue={filter.teileart ?? ''}>
                  <option value="">Alle Teile</option>
                  {auswahl.teilearten.map((t) => (
                    <option key={t} value={t}>{TEILEART_LABEL[t]}</option>
                  ))}
                </Select>
              </div>
            )}
            {auswahl.schluesselarten.length > 0 && (
              <div className={feld}>
                <label htmlFor="filter-typ" className={beschriftung}>Schlüsseltyp</label>
                <Select id="filter-typ" name="typ" defaultValue={filter.schluesselart ?? ''}>
                  <option value="">Alle Schlüsseltypen</option>
                  {auswahl.schluesselarten.map((s) => (
                    <option key={s} value={s}>{SCHLUESSELTYP_LABEL[s]}</option>
                  ))}
                </Select>
              </div>
            )}
            <div className="flex flex-wrap items-end gap-3 sm:col-span-2">
              <Button type="submit">Filter anwenden</Button>
              {zeilen.length > 0 && (
                <ButtonLink href={TEILE_PFAD} variant="ghost">
                  Alle Filter entfernen
                </ButtonLink>
              )}
            </div>
          </form>
        </div>
        {zeilen.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Gewählte Merkmale">
            {zeilen.map((z) => (
              <li key={z.text}>
                <Link href={z.ohne} className="inline-flex min-h-touch items-center gap-2 rounded-full border border-border px-3 text-small hover:border-foreground-subtle">
                  {z.text}
                  <span className="text-foreground-muted">entfernen</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section tight id={LISTE_ANKER} labelledBy="teile-titel">
        <div className="border-t border-border pt-8">
          <SectionHeading
            id="teile-titel"
            nummer="02"
            eyebrow={`${treffer} ${treffer === 1 ? 'Teil' : 'Teile'}`}
            title={mitFahrzeug ? 'Für Ihr Fahrzeug' : 'Gehäuse und Ersatzteile'}
          />
        </div>
        {treffer === 0 ? (
          <div className="mt-6 max-w-measure space-y-4 text-body text-foreground-muted">
            <p>Zu dieser Auswahl haben wir kein Teil. Fragen Sie uns: Wir prüfen anhand Ihrer Fotos, was zu Ihrem Schlüssel passt.</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={GEHAEUSE_ANFRAGE_PFAD} pfeil>
                Gehäuse anfragen
              </ButtonLink>
              <ButtonLink href={TEILE_PFAD} variant="outline">
                Alle Teile zeigen
              </ButtonLink>
            </div>
          </div>
        ) : (
          <>
            {gruppen.passend.length > 0 ? (
              <TeileListe karten={karten(gruppen.passend)} />
            ) : (
              <p className="mt-6 max-w-measure text-body text-foreground-muted">
                Für Ihr Fahrzeug haben wir kein eigenes Teil. Fragen Sie uns gern über die{' '}
                <Link href={GEHAEUSE_ANFRAGE_PFAD} className="font-semibold text-primary hover:underline">Gehäuse-Anfrage</Link>.
              </p>
            )}
            {gruppen.allgemein.length > 0 && (
              <div className="mt-10">
                <h3 className="text-title-sm font-semibold text-foreground">Passt zu jedem Fahrzeug</h3>
                <p className="mt-1 max-w-measure text-small text-foreground-muted">Diese Teile sind nicht an eine Marke gebunden, etwa Batterien.</p>
                <TeileListe karten={karten(gruppen.allgemein)} />
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}

function TeileListe({ karten }: { karten: TeilKarte[] }) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {karten.map((k) => (
        <li key={k.id}>
          <Card interaktiv className="h-full">
            <CardBody className="flex h-full flex-col gap-3">
              <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">{k.teileart}</p>
              <h3 className="text-title-sm font-semibold text-foreground">
                <Link href={artikelPfad(k.slug)} className="after:absolute after:inset-0 hover:text-primary">
                  {k.name}
                </Link>
              </h3>
              {k.etikett && (
                <p>
                  <Badge tone="outline">{k.etikett}</Badge>
                </p>
              )}
              <dl className="grid gap-1 text-small text-foreground-muted">
                <div>
                  <dt className="sr-only">Fahrzeug</dt>
                  <dd>{k.fahrzeug}</dd>
                </div>
                {(k.bauformen.length > 0 || k.tasten) && (
                  <div>
                    <dt className="sr-only">Bauform und Tasten</dt>
                    <dd>{[...k.bauformen, ...(k.tasten ? [k.tasten] : [])].join(', ')}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-auto font-mono text-body tabular-nums text-foreground">{k.preis}</p>
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  );
}
