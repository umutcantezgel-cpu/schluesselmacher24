import type { CityPage, CodeLine, Guide, Settings } from '@/lib/types';
import { getSiteUrl } from '@/lib/site-url';
import { angabe, firmaVeroeffentlichbar, kontakt, standort, ustId } from '@/lib/rechtliches/firma';
import { telefonE164 } from '@/lib/telefon';
import { erreichbarkeit } from '@/lib/erreichbarkeit';
import { istPlatzhalter } from '@/lib/platzhalter';
import type { Graph, DayOfWeek, Thing } from 'schema-dts';

/**
 * Strukturierte Daten für Suchmaschinen und KI-Systeme.
 *
 * Beim Einbetten werden spitze Klammern ersetzt, damit Inhalte aus der
 * Inhaltsverwaltung nicht als Markup interpretiert werden können.
 */
export function JsonLd({ data }: { data: Graph }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

const siteUrl = getSiteUrl();

/**
 * Feste Kennungen des Betriebs (FA-25-08). Der Graph mit diesen Knoten steht einmal je Seite im
 * Root-Layout (`localBusinessSchema`); alle Seiten-Graphen verweisen nur per `@id` darauf und
 * definieren sie nicht erneut (keine doppelten Kennungen).
 */
export const KENNUNG = {
  organisation: `${siteUrl}/#organization`,
  website: `${siteUrl}/#website`,
  betrieb: `${siteUrl}/#localbusiness`,
} as const;

/** Leistungsgebiet einer Leistungsseite: bundesweit wie der Kontaktpunkt des Betriebs (areaServed DE). */
const GEBIET_DEUTSCHLAND = { '@type': 'Country' as const, name: 'Deutschland' };

const WEEKDAYS = [
  'https://schema.org/Monday',
  'https://schema.org/Tuesday',
  'https://schema.org/Wednesday',
  'https://schema.org/Thursday',
  'https://schema.org/Friday',
  'https://schema.org/Saturday',
  'https://schema.org/Sunday',
];

function postanschrift(street: string, postalCode: string, city: string) {
  return {
    '@type': 'PostalAddress' as const,
    streetAddress: street,
    postalCode,
    addressLocality: city,
    addressCountry: 'DE',
  };
}

/**
 * Der Betrieb selbst: Organisation, Website und Locksmith mit festen Kennungen. Steht einmal je Seite im
 * Root-Layout, gedeckt durch den Fuß jeder Seite (Anschrift, Telefon, Erreichbarkeit; R8). Die Webseite
 * der Startseite liefert die Startseite selbst (`pageGraphSchema({ path: '/' … })`).
 *
 * Firmendaten erscheinen nur, wenn sie nicht als Platzhalter markiert sind;
 * Telefon, E-Mail und USt-IdNr. nur, wenn sie gepflegt sind. Die Organisation
 * trägt den Firmensitz, der Betrieb (Locksmith) die Werkstatt — dort, wo
 * Kundinnen und Kunden hinkommen.
 */
export function localBusinessSchema(settings: Settings): Graph {
  const { company } = settings;
  const veroeffentlichbar = firmaVeroeffentlichbar(company);
  const { telefon, email } = kontakt(company);
  const telephone = telefonE164(telefon) ?? telefon;
  const vatID = ustId(company);
  const strasse = angabe(company.street);
  const plz = angabe(company.postalCode);
  const ort = angabe(company.city);
  const sitz = veroeffentlichbar && strasse && plz && ort ? postanschrift(strasse, plz, ort) : undefined;
  const werkstatt = standort(company);
  const betriebsort = werkstatt ? postanschrift(werkstatt.street, werkstatt.postalCode, werkstatt.city) : sitz;
  const legalName = veroeffentlichbar ? angabe(company.legalName) : undefined;

  const kontaktAngaben = {
    ...(legalName ? { legalName } : {}),
    ...(telephone ? { telephone } : {}),
    ...(email ? { email } : {}),
    ...(vatID ? { vatID } : {}),
  };

  /* Keine Öffnungszeiten (FA-23): Die Werkstatt arbeitet nach Termin und ist kein Ladenlokal mit festen
     Zeiten. Ausgezeichnet wird nur, was sichtbar auf der Seite steht: am Telefon rund um die Uhr erreichbar. */
  const erreichbar = erreichbarkeit(settings);
  const kontaktpunkt =
    veroeffentlichbar && telephone && erreichbar.rundUmDieUhr
      ? {
          '@type': 'ContactPoint' as const,
          contactType: 'customer service',
          telephone,
          areaServed: 'DE',
          availableLanguage: 'de',
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification' as const,
            dayOfWeek: [...WEEKDAYS] as DayOfWeek[],
            opens: '00:00',
            closes: '23:59',
          },
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': KENNUNG.organisation,
        name: company.brandName,
        url: siteUrl,
        ...kontaktAngaben,
        ...(sitz ? { address: sitz } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': KENNUNG.website,
        url: siteUrl,
        name: company.brandName,
        inLanguage: 'de-DE',
        publisher: { '@id': KENNUNG.organisation },
      },
      {
        '@type': 'Locksmith',
        '@id': KENNUNG.betrieb,
        name: company.brandName,
        url: siteUrl,
        parentOrganization: { '@id': KENNUNG.organisation },
        description:
          'Fachbetrieb für Autoschlüssel, Schlüssel- und Schließtechnik, elektronische '
          + 'Zutrittslösungen und Sicherheitstechnik.',
        ...kontaktAngaben,
        ...(betriebsort ? { address: betriebsort } : {}),
        ...(kontaktpunkt ? { contactPoint: kontaktpunkt } : {}),
      }
    ]
  } satisfies Graph;
}

/**
 * Eine Codelinie im Shop. `beschreibung` ist der Text, der auf der Seite
 * steht (gepflegt oder aus den Daten der Linie zusammengesetzt).
 */
export function productSchema(line: CodeLine, beschreibung: string = line.description): Graph {
  const productUrl = `${siteUrl}/schluessel-nach-code/${line.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${productUrl}/#webpage`,
        url: productUrl,
        name: line.name,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'Product',
        '@id': `${productUrl}/#product`,
        name: line.name,
        description: beschreibung,
        category: line.application,
        // Hersteller nur, wenn gepflegt — Platzhalter und leere Werte nie.
        ...(istPlatzhalter(line.manufacturer)
          ? {}
          : { brand: { '@type': 'Brand', name: line.manufacturer.trim() } }),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: (line.priceCents / 100).toFixed(2),
          availability: line.active
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: productUrl,
        },
      }
    ]
  } satisfies Graph;
}

/** Ein Ratgeberbeitrag. Organisation und Website stehen im Root-Layout; hier nur Verweise darauf. */
export function articleSchema(guide: Guide): Graph {
  const articleUrl = `${siteUrl}/ratgeber/${guide.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${articleUrl}/#webpage`,
        url: articleUrl,
        name: guide.title,
        inLanguage: 'de-DE',
        isPartOf: { '@id': KENNUNG.website },
        about: { '@id': KENNUNG.organisation },
      },
      {
        '@type': 'Article',
        '@id': `${articleUrl}/#article`,
        headline: guide.title,
        description: guide.excerpt,
        inLanguage: 'de-DE',
        dateModified: guide.updatedAt,
        mainEntityOfPage: { '@id': `${articleUrl}/#webpage` },
        publisher: { '@id': KENNUNG.organisation },
      }
    ]
  } satisfies Graph;
}

/**
 * Häufige Fragen einer Seite. Nur mit Fragen und Antworten aufrufen, die auf der Seite sichtbar
 * und vollständig stehen (R8); sonst keine FAQPage.
 */
export function faqSchema(items: Array<{ question: string; answer: string }>, pageUrl: string = siteUrl): Graph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        isPartOf: { '@id': KENNUNG.website },
        about: { '@id': KENNUNG.organisation },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}/#faq`,
        isPartOf: { '@id': `${pageUrl}/#webpage` },
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    ]
  } satisfies Graph;
}

/** Ein Einsatzgebiet: Leistung des Betriebs in einer Stadt. */
export function serviceAreaSchema(city: CityPage): Graph {
  const pageUrl = `${siteUrl}/standorte/${city.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        name: `Schlüssel- und Schließtechnik in ${city.city}`,
        inLanguage: 'de-DE',
        isPartOf: { '@id': KENNUNG.website },
        about: { '@id': KENNUNG.organisation },
        mainEntity: { '@id': `${pageUrl}/#service` },
      },
      {
        '@type': 'Service',
        '@id': `${pageUrl}/#service`,
        name: `Schlüssel- und Schließtechnik in ${city.city}`,
        serviceType: 'Schlüsseldienst und Schließtechnik',
        areaServed: {
          '@type': 'City',
          name: city.city,
          containedInPlace: { '@type': 'AdministrativeArea', name: city.state },
        },
        provider: { '@id': KENNUNG.betrieb },
      }
    ]
  } satisfies Graph;
}

/** Brotkrumenpfad — hilft bei der Einordnung tiefer Seiten. Nur zusammen mit sichtbaren Brotkrumen. */
export function breadcrumbSchema(crumbs: Array<{ href: string; label: string }>, pageUrl: string = siteUrl): Graph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        isPartOf: { '@id': KENNUNG.website },
        about: { '@id': KENNUNG.organisation },
        breadcrumb: { '@id': `${pageUrl}/#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}/#breadcrumb`,
        itemListElement: brotkrumen(crumbs),
      }
    ]
  } satisfies Graph;
}

/** Startseite vorn, dann die sichtbaren Brotkrumen; ein doppelter Startseiten-Eintrag entfällt. */
function brotkrumen(crumbs: Array<{ href: string; label: string }>) {
  return [{ href: '/', label: 'Startseite' }, ...crumbs.filter((crumb) => crumb.href !== '/')].map((crumb, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: crumb.label,
    item: crumb.href === '/' ? `${siteUrl}/` : `${siteUrl}${crumb.href}`,
  }));
}

/** Eine Leistung auf ihrer Leistungsseite (FA-25-10). Bezeichnung und Beschreibung stehen sichtbar im Kopf. */
export interface LeistungsAngabe {
  /** Bezeichnung der Leistung, wie die Überschrift sie nennt. */
  name: string;
  /** Der sichtbare Kurztext (Einleitung im Seitenkopf); ohne sichtbaren Kurztext entfällt er. */
  description?: string;
}

/**
 * Graph für eine Inhaltsseite: Webseite, optional Leistung, sichtbare FAQ und
 * Brotkrumen — jeweils mit eigener `@id` je Seite, damit sich Seiten nicht
 * gegenseitig überschreiben. Organisation, Website und Betrieb kommen aus dem
 * Root-Layout und werden hier nur per `@id` angesprochen.
 *
 * Nur Inhalte übergeben, die auf der Seite auch sichtbar sind.
 */
export function pageGraphSchema(input: {
  /** Pfad ab Wurzel, z. B. "/schliessanlagen"; "/" für die Startseite. */
  path: string;
  name: string;
  description?: string;
  faq?: Array<{ question: string; answer: string }>;
  crumbs?: Array<{ href: string; label: string }>;
  /** Leistungsseite: `Service` mit dem Betrieb als Anbieter. */
  service?: LeistungsAngabe;
}): Graph {
  const pageUrl = input.path === '/' ? `${siteUrl}/` : `${siteUrl}${input.path}`;
  const mitKrumen = Boolean(input.crumbs?.length) && input.path !== '/';
  const graph: Thing[] = [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: input.name,
      ...(input.description ? { description: input.description } : {}),
      inLanguage: 'de-DE',
      isPartOf: { '@id': KENNUNG.website },
      about: { '@id': KENNUNG.organisation },
      ...(input.service ? { mainEntity: { '@id': `${pageUrl}#service` } } : {}),
      ...(mitKrumen ? { breadcrumb: { '@id': `${pageUrl}#breadcrumb` } } : {}),
    },
  ];

  if (input.service) {
    graph.push({
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: input.service.name,
      ...(input.service.description ? { description: input.service.description } : {}),
      provider: { '@id': KENNUNG.betrieb },
      areaServed: GEBIET_DEUTSCHLAND,
      url: pageUrl,
    });
  }

  if (input.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      isPartOf: { '@id': `${pageUrl}#webpage` },
      mainEntity: input.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  if (mitKrumen) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: brotkrumen(input.crumbs!),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
