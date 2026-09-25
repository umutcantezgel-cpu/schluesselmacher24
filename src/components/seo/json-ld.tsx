import type { CityPage, CodeLine, Guide, Settings } from '@/lib/types';
import { getSiteUrl } from '@/lib/site-url';
import type { Graph, DayOfWeek } from 'schema-dts';

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

/** Der Betrieb selbst. Wird auf der Startseite eingebunden. */
export function localBusinessSchema(settings: Settings): Graph {
  const { company } = settings;

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
            }),
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
        areaServed: { '@type': 'Country', name: 'Deutschland' },
        description:
          'Fachbetrieb für Autoschlüssel, Schlüssel- und Schließtechnik, elektronische '
          + 'Zutrittslösungen und Sicherheitstechnik.',
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
      }
    ]
  } satisfies Graph;
}

/** Eine Codelinie im Shop. */
export function productSchema(line: CodeLine): Graph {
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
        url: siteUrl,
        name: 'Coday Web',
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
        url: siteUrl,
        name: 'Coday Web',
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
        url: siteUrl,
        name: 'Coday Web',
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
        url: siteUrl,
        name: 'Coday Web',
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
        url: siteUrl,
        name: 'Coday Web',
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
