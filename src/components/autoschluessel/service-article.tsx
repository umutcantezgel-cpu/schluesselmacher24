import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Minus } from 'lucide-react';

import type { ImageSlot, InfoHint, PageContent } from '@/lib/types';
import type { Crumb } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion, type AccordionItem } from '@/components/ui/accordion';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';

/* ==========================================================================
   Gemeinsamer Aufbau aller Autoschlüssel-Leistungsseiten.
   Jede Seite liefert ihre Texte selbst, die Reihenfolge der Abschnitte ist
   bewusst überall gleich: Was ist das — wann brauchen Sie das — was wir von
   Ihnen brauchen — Abgrenzung — Fragen — nächster Schritt.
   ========================================================================== */

/** Weiterführender interner Link. */
export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}

export interface ArticlePoint {
  title: string;
  body: string;
  hint?: InfoHint;
}

export interface ServiceArticleProps {
  /** Redaktionell gepflegter Inhalt aus der Datenschicht. */
  content: PageContent | null;
  /** Greift, solange für die Route noch kein Inhalt gepflegt ist. */
  fallback: { headline: string; subline: string; intro: string };
  eyebrow: string;
  crumbs: Crumb[];
  image: ImageSlot;
  what: { title: string; paragraphs: string[] };
  when: { title: string; lead?: string; items: ArticlePoint[] };
  need: { title: string; lead?: string; items: ArticlePoint[]; note?: string };
  boundary: { title: string; lead?: string; items: ArticlePoint[] };
  faq: AccordionItem[];
  next: {
    title: string;
    lead: string;
    primary: { href: string; label: string };
    secondary?: { href: string; label: string };
  };
  /** Weiterführende Seiten, ergänzend zu den internen Links aus der Datenschicht. */
  related?: RelatedLink[];
  /** Zusätzlicher Abschnitt, wird vor den Fragen eingefügt. */
  children?: ReactNode;
}

export function ServiceArticle({
  content,
  fallback,
  eyebrow,
  crumbs,
  image,
  what,
  when,
  need,
  boundary,
  faq,
  next,
  related = [],
  children,
}: ServiceArticleProps) {
  const headline = content?.headline ?? fallback.headline;
  const subline = content?.subline ?? fallback.subline;
  const intro = content?.intro ?? fallback.intro;

  // Gepflegte Textabschnitte gehen den fest hinterlegten Absätzen voraus.
  const editorialSections = content?.sections ?? [];
  const editorialFaq = content?.faq ?? [];
  const faqItems = editorialFaq.length > 0 ? editorialFaq : faq;

  const links = dedupeLinks([...(content?.seo.internalLinks ?? []), ...related]);

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={headline}
        lead={subline}
        crumbs={crumbs}
        actions={
          <ButtonLink href={next.primary.href}>
            {next.primary.label}
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Was ist das */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading title={what.title} />
            <div className="prose-sm24 mt-5">
              <p>{intro}</p>
              {what.paragraphs.map((text) => (
                <p key={text.slice(0, 40)}>{text}</p>
              ))}
              {editorialSections.map((section) => (
                <p key={section.heading}>
                  <strong className="text-foreground">{section.heading}: </strong>
                  {section.body}
                </p>
              ))}
            </div>
          </div>

          <ImagePlaceholder slot={image} />
        </div>
      </Section>

      {/* Wann brauchen Sie das */}
      <Section tone="muted">
        <SectionHeading title={when.title} lead={when.lead} />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {when.items.map((item) => (
            <li key={item.title}>
              <Card className="h-full">
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-bold text-foreground">{item.title}</h3>
                    {item.hint && <InfoTip hint={item.hint} className="shrink-0" />}
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                    {item.body}
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Was wir von Ihnen brauchen */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
          <SectionHeading title={need.title} lead={need.lead} />

          <div>
            <ul className="space-y-4">
              {need.items.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
                  >
                    <Check size={14} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <h3 className="text-[15px] font-bold text-foreground">{item.title}</h3>
                      {item.hint && <InfoTip hint={item.hint} className="shrink-0" />}
                    </div>
                    <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {need.note && (
              <Alert tone="info" title="Hinweis zu Ihren Unterlagen" className="mt-6">
                {need.note}
              </Alert>
            )}
          </div>
        </div>
      </Section>

      {/* Abgrenzung */}
      <Section tone="muted">
        <SectionHeading title={boundary.title} lead={boundary.lead} />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {boundary.items.map((item) => (
            <li key={item.title}>
              <Card className="h-full" variant="outline">
                <CardBody>
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-strong text-foreground-subtle"
                    >
                      <Minus size={14} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {children}

      {/* Fragen */}
      {faqItems.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Was Kundinnen und Kunden uns dazu fragen"
            className="max-w-2xl"
          />
          <Accordion items={faqItems} className="mt-8" />
        </Section>
      )}

      {/* Nächster Schritt und interne Links */}
      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading title={next.title} lead={next.lead} />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={next.primary.href} size="lg">
                {next.primary.label}
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              {next.secondary && (
                <ButtonLink href={next.secondary.href} size="lg" variant="outline">
                  {next.secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>

          {links.length > 0 && (
            <nav aria-label="Weiterführende Seiten">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                Passend dazu
              </h2>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex min-h-[44px] items-center justify-between gap-4 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-foreground group-hover:text-primary">
                          {link.label}
                        </span>
                        {link.description && (
                          <span className="mt-0.5 block text-[13px] text-foreground-muted">
                            {link.description}
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        size={16}
                        aria-hidden
                        className="shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </Section>
    </>
  );
}

function dedupeLinks(links: RelatedLink[]): RelatedLink[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}
