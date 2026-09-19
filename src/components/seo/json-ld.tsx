import type { CityPage, CodeLine, Guide, Settings } from '@/lib/types';
import type { Graph, Thing, Locksmith, OpeningHoursSpecification } from 'schema-dts';
import { getSiteUrl } from '@/lib/site-url';

/**
 * Strukturierte Daten für Suchmaschinen und KI-Systeme.
 *
 * Beim Einbetten werden spitze Klammern ersetzt, damit Inhalte aus der
 * Inhaltsverwaltung nicht als Markup interpretiert werden können.
 */
export function JsonLd({ data }: { data: Graph | Record<string, unknown> }) {
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

export function baseGraphSchema(
  pageUrl: string,
  pageTitle: string,
  settings: Settings,
  additionalNodes: Thing[] = []
): Graph {
  const { company } = settings;

  const orgId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${pageUrl}/#webpage`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: company.brandName,
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteUrl,
        name: company.brandName,
        publisher: { '@id': orgId },
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: pageUrl,
        name: pageTitle,
        isPartOf: { '@id': websiteId },
        about: { '@id': orgId },
      },
      ...additionalNodes,
    ],
  } satisfies Graph;
}

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/** Der Betrieb selbst. Wird auf der Startseite eingebunden. */
export function localBusinessSchema(settings: Settings): Thing {
  const { company } = settings;

  const openingHours = settings.openingHours
    .filter((entry) => entry.spans.length > 0)
    .flatMap((entry) =>
      entry.spans.map((span) => ({
        '@type': 'OpeningHoursSpecification' as const,
        dayOfWeek: WEEKDAYS[entry.day - 1],
        opens: span.from,
        closes: span.to,
      })),
    );

  return {
    '@type': 'Locksmith',
    '@id': `${siteUrl}/#localbusiness`,
    name: company.brandName,
    url: siteUrl,
    areaServed: { '@type': 'Country', name: 'Deutschland' },
    description:
      'Fachbetrieb für Autoschlüssel, Schlüssel- und Schließtechnik, elektronische '
      + 'Zutrittslösungen und Sicherheitstechnik.',
    // Solange die Firmendaten Platzhalter sind, bleiben sie bewusst weg,
    // damit keine erfundenen Angaben in die strukturierten Daten geraten.
    ...(company.isPlaceholder
      ? {}
      : {
          legalName: company.legalName,
          telephone: company.phone,
          email: company.email,
          vatID: company.vatId,
          address: {
            '@type': 'PostalAddress',
            streetAddress: company.street,
            postalCode: company.postalCode,
            addressLocality: company.city,
            addressCountry: 'DE',
          },
          openingHoursSpecification: openingHours,
        }),
  };
}

/** Eine Codelinie im Shop. */
export function productSchema(line: CodeLine): Thing {
  return {
    '@type': 'Product',
    '@id': `${siteUrl}/schluessel-nach-code/${line.slug}/#product`,
    name: line.name,
    description: line.description,
    category: line.application,
    ...(line.manufacturer.startsWith('[')
      ? {}
      : { brand: { '@type': 'Brand', name: line.manufacturer } }),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: (line.priceCents / 100).toFixed(2),
      availability: line.active
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/schluessel-nach-code/${line.slug}`,
    },
  };
}

/** Ein Ratgeberbeitrag. */
export function articleSchema(guide: Guide): Thing {
  return {
    '@type': 'Article',
    '@id': `${siteUrl}/ratgeber/${guide.slug}/#article`,
    headline: guide.title,
    description: guide.excerpt,
    inLanguage: 'de-DE',
    dateModified: guide.updatedAt,
    mainEntityOfPage: { '@id': `${siteUrl}/ratgeber/${guide.slug}/#webpage` },
    publisher: { '@id': `${siteUrl}/#organization` },
  };
}

/** Häufige Fragen einer Seite. */
export function faqSchema(items: Array<{ question: string; answer: string }>, pageUrl: string): Thing {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}/#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Ein Einsatzgebiet. */
export function serviceAreaSchema(city: CityPage): Thing {
  return {
    '@type': 'Service',
    '@id': `${siteUrl}/standorte/${city.slug}/#service`,
    name: `Schlüssel- und Schließtechnik in ${city.city}`,
    serviceType: 'Schlüsseldienst und Schließtechnik',
    areaServed: {
      '@type': 'City',
      name: city.city,
      containedInPlace: { '@type': 'AdministrativeArea', name: city.state },
    },
    provider: { '@id': `${siteUrl}/#organization` },
  };
}

/** Brotkrumenpfad — hilft bei der Einordnung tiefer Seiten. */
export function breadcrumbSchema(crumbs: Array<{ href: string; label: string }>, pageUrl: string): Thing {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}/#breadcrumb`,
    itemListElement: [{ href: '/', label: 'Start' }, ...crumbs].map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${siteUrl}${crumb.href}`,
    })),
  };
}
