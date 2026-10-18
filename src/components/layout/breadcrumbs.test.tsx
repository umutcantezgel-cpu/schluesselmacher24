import type { ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const links: { href: string; prefetch: unknown }[] = [];
const spaet: string[][] = [];

vi.mock('next/link', () => ({
  default: ({ href, prefetch, children, ...rest }: ComponentProps<'a'> & { href: string; prefetch?: boolean }) => {
    links.push({ href, prefetch });
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

vi.mock('@/lib/spaet-vorladen', () => ({
  SpaetVorladen: ({ ziele }: { ziele: string[] }) => {
    spaet.push(ziele);
    return null;
  },
}));

const { Breadcrumbs } = await import('./breadcrumbs');

describe('Breadcrumbs', () => {
  it('lädt nicht beim Erscheinen vor, sondern Start und Zwischenstufen spät (D-044)', () => {
    links.length = 0;
    spaet.length = 0;
    const html = renderToStaticMarkup(
      <Breadcrumbs
        crumbs={[
          { href: '/autoschluessel', label: 'Autoschlüssel' },
          { href: '/autoschluessel/marken', label: 'Marken' },
        ]}
      />,
    );
    expect(links.map((l) => l.href)).toEqual(['/', '/autoschluessel']);
    expect(links.every((l) => l.prefetch === false)).toBe(true);
    expect(spaet).toEqual([['/', '/autoschluessel']]);
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('>Marken</span>');
  });
});
