import { readFileSync } from 'node:fs';
import path from 'node:path';

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { pages } from '@/lib/data/defaults/content';
import { ANFRAGE_FORMULAR, KLASSEN_SEITEN } from '@/lib/fahrzeuge/anfrage-klassen';
import type { PageContent } from '@/lib/types';

/* Einstiegsseiten und Anfragen der neuen Klassen (FA-KERN-02B): noindex, solange der Schalter aus ist,
 * Kopftexte gleichlautend in content/seo.json und im Rückfall, Unterlagen aus der Pflichtregel. */

// Seitenkopf mit Vorladen der Verweise: außerhalb des App-Routers ohne Wirkung.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: () => {}, push: () => {}, replace: () => {} }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Rubriken der Klassen (FA-KERN-05): live, außer ein Test schaltet eine ab.
const nichtLive = new Set<string>();
vi.mock('@/lib/data', () => ({
  getPageContent: async () => null,
  getSettings: async () => defaults.settings(),
  getRubrik: async (id: string) => {
    const rubrik = defaults.rubriken().find((r) => r.id === id);
    return rubrik && !nichtLive.has(id) ? { ...rubrik, status: 'live' } : null;
  },
}));

const { EinstiegSeite, FahrzeugAnfrageInhalt, seitenMetadata } = await import('./seiten');

const seo = JSON.parse(readFileSync(path.join(process.cwd(), 'content', 'seo.json'), 'utf8')) as PageContent[];

const NEU = ['roller', 'e-scooter', 'seniorenmobil', 'fahrrad', 'nicht-gefunden'] as const;

describe('Formular je Klasse', () => {
  it.each(['motorrad', ...NEU] as const)('%s: erster Schritt mit Frage, Fortschritt und Feldern der Klasse', async (klasse) => {
    const html = renderToStaticMarkup(await FahrzeugAnfrageInhalt({ klasse, suchparameter: { marke: 'Testmarke', modell: 'Testmodell' } }));
    expect(html).toContain(ANFRAGE_FORMULAR[klasse].fahrzeugFrage.replace('?', ''));
    expect(html).toContain('Unterlagen');
    if (klasse === 'fahrrad') expect(html).toContain('Schlüsselnummer');
    if (klasse === 'roller') expect(html).toContain('Mit Versicherungskennzeichen');
    if (klasse === 'motorrad' || klasse === 'roller') expect(html).toContain('data-block="fahrzeug-nicht-gefunden"');
    // Nur „nicht gefunden“ übernimmt die Vorbelegung aus der Adresse.
    expect(html.includes('value="Testmarke"'), klasse).toBe(klasse === 'nicht-gefunden');
    // Keine Sackgasse im ersten Schritt (FA Abschnitt 26): ohne Katalogsuche eine Hilfe mit Telefon und Erreichbarkeit.
    const ohneSuche = !ANFRAGE_FORMULAR[klasse].katalog;
    expect(html.includes('data-block="hilfe-fahrzeug"'), klasse).toBe(ohneSuche);
    // Telefon nur, wenn gepflegt (Rückfalldaten ohne Nummer); der Rückruf steht immer da.
    if (ohneSuche) expect(html).toContain('Rückruf erbitten');
    if (klasse === 'fahrrad') expect(html).toContain('Sie finden die Nummer nicht? Rufen Sie uns an, wir helfen beim Suchen.');
    // Roller: Die Anfrage „nicht gefunden“ verlangt immer einen Fahrzeugschein, darum dort kein Verweis.
    expect(html.includes('href="/autoschluessel/fahrzeug-nicht-gefunden"'), klasse).toBe(klasse === 'motorrad');
  });
});

describe('Hilfe im Fahrzeugschritt', () => {
  it('nennt ohne Katalogsuche Telefon und Erreichbarkeit (FA Abschnitt 26)', async () => {
    const { FahrzeugAnfrageFormular } = await import('./formular');
    const { pflichtTabelle } = await import('./pflicht');
    const { ERREICHBARKEIT_STANDARD } = await import('@/lib/erreichbarkeit');
    const html = renderToStaticMarkup(
      <FahrzeugAnfrageFormular klasse="fahrrad" pflichtTabelle={pflichtTabelle('fahrrad')} telefon="06441 123456" erreichbarkeit={ERREICHBARKEIT_STANDARD} jahr={2026} />,
    );
    expect(html).toContain('data-block="hilfe-fahrzeug"');
    expect(html).toContain('Unsicher bei einer Angabe?');
    expect(html).toContain('href="tel:+496441123456"');
    expect(html).toContain(ERREICHBARKEIT_STANDARD.kernaussage);
  });
});

describe('Motorradseiten', () => {
  it('lesen den Schalter indexierbar der Klasse und nennen im Rückfall drei Fotos', async () => {
    const einstieg = await import('@/app/(site)/motorradschluessel/page');
    const anfrage = await import('@/app/(site)/motorradschluessel/anfrage/page');
    for (const seite of [einstieg, anfrage]) {
      const offen = await seite.generateMetadata();
      expect(offen.robots).toBeUndefined();
      expect(String(offen.title)).not.toMatch(/[–—]/);
      expect(String(offen.description)).toContain('drei Fotos');
      expect(String(offen.description).length).toBeGreaterThanOrEqual(120);
      expect(String(offen.description).length).toBeLessThanOrEqual(160);
    }
    // Suchtitel samt Marke in 580 px (FA-SEO-01B); die Unterlagen nennt die Beschreibung.
    expect(String((await anfrage.generateMetadata()).title)).toBe('Motorradschlüssel anfragen');
    const motorrad = ANFRAGE_FORMULAR.motorrad as { indexierbar: boolean };
    motorrad.indexierbar = false;
    try {
      for (const seite of [einstieg, anfrage]) expect((await seite.generateMetadata()).robots).toEqual({ index: false, follow: true });
    } finally {
      motorrad.indexierbar = true;
    }
  });
});

describe('Seiten der neuen Klassen', () => {
  it('gibt Roller und Fahrrad frei, E-Scooter, Seniorenmobil und „nicht gefunden“ noch nicht (FA-SOFORT-05)', () => {
    expect(NEU.filter((klasse) => ANFRAGE_FORMULAR[klasse].indexierbar)).toEqual(['roller', 'fahrrad']);
  });

  it.each(NEU)('%s: Einstiegsseite und Anfrage auf noindex, solange der Schalter aus ist, sonst ohne', async (klasse) => {
    const schalter = ANFRAGE_FORMULAR[klasse] as { indexierbar: boolean };
    const vorher = schalter.indexierbar;
    try {
      for (const an of [false, true]) {
        schalter.indexierbar = an;
        const anfrage = await seitenMetadata(klasse, 'anfrage');
        expect(anfrage.robots).toEqual(an ? undefined : { index: false, follow: true });
        expect(anfrage.alternates?.canonical).toBe(ANFRAGE_FORMULAR[klasse].anfrage);
        if (ANFRAGE_FORMULAR[klasse].einstieg) {
          const einstieg = await seitenMetadata(klasse, 'einstieg');
          expect(einstieg.robots).toEqual(an ? undefined : { index: false, follow: true });
          expect(einstieg.alternates?.canonical).toBe(ANFRAGE_FORMULAR[klasse].einstieg);
        }
      }
    } finally {
      schalter.indexierbar = vorher;
    }
  });

  it('jede Seite hat eine page.tsx unter ihrer Adresse und liest die Metadaten über seitenMetadata', () => {
    for (const klasse of NEU) {
      for (const adresse of [ANFRAGE_FORMULAR[klasse].einstieg, ANFRAGE_FORMULAR[klasse].anfrage].filter(Boolean) as string[]) {
        const datei = readFileSync(path.join(process.cwd(), 'src', 'app', '(site)', adresse, 'page.tsx'), 'utf8');
        expect(datei, adresse).toContain(`seitenMetadata('${klasse}'`);
      }
    }
  });

  it('Kopftexte stehen gleichlautend in content/seo.json und im Rückfall', () => {
    const rueckfall = pages();
    for (const { einstieg, anfrage } of Object.values(KLASSEN_SEITEN)) {
      for (const kopf of [einstieg, anfrage]) {
        if (!kopf) continue;
        const daten = seo.find((s) => s.route === kopf.route);
        const code = rueckfall.find((s) => s.route === kopf.route);
        expect(daten?.seo.title, kopf.route).toBe(kopf.title);
        expect(daten?.seo.description, kopf.route).toBe(kopf.description);
        expect(daten?.headline, kopf.route).toBe(kopf.headline);
        expect(code?.seo.title, kopf.route).toBe(kopf.title);
        expect(code?.seo.description, kopf.route).toBe(kopf.description);
      }
    }
  });

  it.each(['roller', 'e-scooter', 'seniorenmobil', 'fahrrad'] as const)('%s: Einstiegsseite nennt die Unterlagen der Regel, Knopf und Telefon, keine Preise', async (klasse) => {
    const html = renderToStaticMarkup(await EinstiegSeite({ klasse, abschnitte: [{ titel: 'Testabschnitt', absaetze: ['Testabsatz.'] }] }));
    expect(html).toContain(`href="${ANFRAGE_FORMULAR[klasse].anfrage}"`);
    expect(html).toContain('Das brauchen wir von Ihnen');
    expect(html).toContain('Drei Fotos Ihres Schlüssels: Vorderseite, Rückseite und Spitze beziehungsweise Profil von vorne');
    expect(html).toContain('Ein Nachweis statt Fahrzeugschein');
    if (klasse === 'roller') expect(html).toContain('Fahrzeugschein (Zulassungsbescheinigung Teil I)');
    if (klasse === 'fahrrad') expect(html).toContain('Hersteller und Schlüsselnummer des Schlosses');
    else expect(html).toContain('Typenschilds');
    expect(html).not.toMatch(/€|\beuro\b/i);
    // Erste Brotkrume: Krafträder unter „Autoschlüssel“, die anderen direkt unter der Startseite.
    expect(html.includes('href="/autoschluessel"'), klasse).toBe(klasse === 'roller');
  });

  it('Einstiegsseiten haben je eigenen Inhalt (R3)', () => {
    const texte = ['roller-und-kleinstfahrzeuge', 'e-scooter', 'seniorenmobile', 'fahrradschluessel'].map((ordner) =>
      readFileSync(path.join(process.cwd(), 'src', 'app', '(site)', ordner, 'page.tsx'), 'utf8').match(/const ABSCHNITTE[\s\S]*?\n\];/)?.[0] ?? '',
    );
    for (const text of texte) expect(text.length).toBeGreaterThan(600);
    expect(new Set(texte).size).toBe(texte.length);
    // Kein Gedankenstrich in den Seitentexten.
    for (const text of texte) expect(text).not.toMatch(/[–—]| - /);
  });
});

describe('Rubrik nicht live (FA-KERN-05)', () => {
  it.each(['motorrad', ...NEU] as const)('%s: Hinweis mit Telefon statt Formular, Seiten auf noindex', async (klasse) => {
    const { KLASSE_RUBRIK } = await import('./seiten');
    nichtLive.add(KLASSE_RUBRIK[klasse]);
    try {
      const html = renderToStaticMarkup(await FahrzeugAnfrageInhalt({ klasse }));
      expect(html).toContain('data-block="rubrik-pausiert"');
      expect(html).toContain('Diese Anfrage ist gerade nicht online möglich');
      expect(html).not.toContain('<form');
      expect(html).not.toContain(ANFRAGE_FORMULAR[klasse].fahrzeugFrage.replace('?', ''));
      if (klasse !== 'motorrad') {
        expect((await seitenMetadata(klasse, 'anfrage')).robots).toEqual({ index: false, follow: true });
        if (ANFRAGE_FORMULAR[klasse].einstieg) {
          expect((await seitenMetadata(klasse, 'einstieg')).robots).toEqual({ index: false, follow: true });
        }
      }
    } finally {
      nichtLive.clear();
    }
  });

  it('Einstiegsseite zeigt den Hinweis statt des Knopfs zur Anfrage', async () => {
    nichtLive.add('fahrradschluessel');
    try {
      const html = renderToStaticMarkup(await EinstiegSeite({ klasse: 'fahrrad', abschnitte: [{ titel: 'Testabschnitt', absaetze: ['Testabsatz.'] }] }));
      expect(html).toContain('data-block="rubrik-pausiert"');
      expect(html).not.toContain(`href="${ANFRAGE_FORMULAR.fahrrad.anfrage}"`);
    } finally {
      nichtLive.clear();
    }
  });

  it('Anfrageseite verspricht im Kopf keine Schritte, solange die Rubrik nicht live ist', async () => {
    const { FahrzeugAnfrageSeite, RUBRIK_PAUSIERT_LEAD } = await import('./seiten');
    const motorrad = await import('@/app/(site)/motorradschluessel/anfrage/page');
    // Der Seitenkopf ist das Kind mit der Unterzeile `lead` (davor kann die Seitenauszeichnung stehen); das
    // Formular darunter lädt asynchron und wird hier nicht gerendert.
    const lead = (seite: unknown) => {
      const kinder = [(seite as { props: { children: unknown } }).props.children].flat() as Array<{ props?: { lead?: string } } | null>;
      return kinder.find((kind) => kind?.props && 'lead' in kind.props)?.props?.lead ?? '';
    };
    expect(lead(await FahrzeugAnfrageSeite({ klasse: 'fahrrad' }))).not.toBe(RUBRIK_PAUSIERT_LEAD);
    expect(lead(await motorrad.default())).toContain('Sechs Schritte');
    nichtLive.add('fahrradschluessel');
    nichtLive.add('motorradschluessel');
    try {
      expect(lead(await FahrzeugAnfrageSeite({ klasse: 'fahrrad' }))).toBe(RUBRIK_PAUSIERT_LEAD);
      expect(lead(await motorrad.default())).toBe(RUBRIK_PAUSIERT_LEAD);
      expect(RUBRIK_PAUSIERT_LEAD).not.toMatch(/Schritte|Vertrag/);
    } finally {
      nichtLive.clear();
    }
  });

  it('Motorradseiten: Rubrik nicht live heißt noindex und kein Knopf zur Anfrage', async () => {
    const einstieg = await import('@/app/(site)/motorradschluessel/page');
    const anfrage = await import('@/app/(site)/motorradschluessel/anfrage/page');
    nichtLive.add('motorradschluessel');
    try {
      for (const seite of [einstieg, anfrage]) expect((await seite.generateMetadata()).robots).toEqual({ index: false, follow: true });
    } finally {
      nichtLive.clear();
    }
  });
});
