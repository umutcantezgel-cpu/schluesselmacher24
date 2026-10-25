import type { CityPage, CodeLine, Guide, Settings } from '@/lib/types';
import { getSiteUrl } from '@/lib/site-url';
import { angabe, firmaVeroeffentlichbar, kontakt, standort, ustId } from '@/lib/rechtliches/firma';
import { telefonE164 } from '@/lib/telefon';
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
 * Der Betrieb selbst. Wird auf der Startseite eingebunden.
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

  const openingHours = settings.openingHours
    .filter((entry) => entry.spans.length > 0)
    .flatMap((entry) =>
      entry.spans.map((span) => ({
        '@type': 'OpeningHoursSpecification' as const,
        dayOfWeek: WEEKDAYS[entry.day - 1] as DayOfWeek,
        opens: span.from,
        closes: span.to,
      })),
    );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: company.brandName,
        url: siteUrl,
        ...kontaktAngaben,
        ...(sitz ? { address: sitz } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: company.brandName,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: company.brandName,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'Locksmith',
        '@id': `${siteUrl}/#localbusiness`,
        name: company.brandName,
        url: siteUrl,
        parentOrganization: { '@id': `${siteUrl}/#organization` },
        description:
          'Fachbetrieb für Autoschlüssel, Schlüssel- und Schließtechnik, elektronische '
          + 'Zutrittslösungen und Sicherheitstechnik.',
        ...kontaktAngaben,
        ...(betriebsort ? { address: betriebsort } : {}),
        ...(veroeffentlichbar && openingHours.length ? { openingHoursSpecification: openingHours } : {}),
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

/** Ein Ratgeberbeitrag. */
export function articleSchema(guide: Guide): Graph {
  const articleUrl = `${siteUrl}/ratgeber/${guide.slug}`;
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
        '@id': `${articleUrl}/#webpage`,
        url: articleUrl,
        name: guide.title,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'Article',
        '@id': `${articleUrl}/#article`,
        headline: guide.title,
        description: guide.excerpt,
        inLanguage: 'de-DE',
        dateModified: guide.updatedAt,
        mainEntityOfPage: { '@id': `${articleUrl}/#webpage` },
        publisher: { '@type': 'Organization', name: 'SCHLÜSSELMACHER24', '@id': `${siteUrl}/#organization` },
      }
    ]
  } satisfies Graph;
}

/** Häufige Fragen einer Seite. */
export function faqSchema(items: Array<{ question: string; answer: string }>, pageUrl: string = siteUrl): Graph {
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
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}/#faq`,
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    ]
  } satisfies Graph;
}

/** Ein Einsatzgebiet. */
export function serviceAreaSchema(city: CityPage): Graph {
  const pageUrl = `${siteUrl}/standorte/${city.slug}`;
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
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        name: `Schlüssel- und Schließtechnik in ${city.city}`,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
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
        provider: { '@type': 'Organization', name: 'SCHLÜSSELMACHER24', '@id': `${siteUrl}/#organization` },
      }
    ]
  } satisfies Graph;
}

/** Brotkrumenpfad — hilft bei der Einordnung tiefer Seiten. */
export function breadcrumbSchema(crumbs: Array<{ href: string; label: string }>, pageUrl: string = siteUrl): Graph {
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
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}/#breadcrumb`,
        itemListElement: [{ href: '/', label: 'Start' }, ...crumbs].map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.label,
          item: `${siteUrl}${crumb.href}`,
        })),
      }
    ]
  } satisfies Graph;
}

/**
 * Graph für eine Inhaltsseite: Webseite, optional sichtbare FAQ und
 * Brotkrumen — jeweils mit eigener `@id` je Seite, damit sich Seiten nicht
 * gegenseitig überschreiben.
 *
 * Nur Inhalte übergeben, die auf der Seite auch sichtbar sind.
 */
export function pageGraphSchema(input: {
  /** Pfad ab Wurzel, z. B. "/schliessanlagen". */
  path: string;
  name: string;
  description?: string;
  faq?: Array<{ question: string; answer: string }>;
  crumbs?: Array<{ href: string; label: string }>;
}): Graph {
  const pageUrl = `${siteUrl}${input.path}`;
  const graph: Thing[] = [
    { '@type': 'Organization', '@id': `${siteUrl}/#organization` },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: input.name,
      ...(input.description ? { description: input.description } : {}),
      inLanguage: 'de-DE',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      ...(input.crumbs?.length ? { breadcrumb: { '@id': `${pageUrl}#breadcrumb` } } : {}),
    },
  ];

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

  if (input.crumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [{ href: '/', label: 'Start' }, ...input.crumbs].map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: `${siteUrl}${crumb.href}`,
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
