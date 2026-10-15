import { describe, expect, it } from 'vitest';

import { cn } from './cn';

/** Klassen als Menge, damit die Reihenfolge keine Rolle spielt. */
const klassen = (wert: string) => new Set(wert.split(/\s+/).filter(Boolean));

describe('cn – eigene Skalen des Designsystems', () => {
  it('behält Schriftgröße und Textfarbe nebeneinander', () => {
    for (const groesse of ['caption', 'small', 'body', 'input', 'lead', 'title-sm', 'title', 'headline', 'display']) {
      const ergebnis = klassen(cn(`text-${groesse}`, 'text-foreground-muted'));
      expect(ergebnis, groesse).toEqual(new Set([`text-${groesse}`, 'text-foreground-muted']));
    }
  });

  it('löst Konflikte zwischen Schriftgrößen zugunsten der letzten Klasse', () => {
    expect(cn('text-small', 'text-title')).toBe('text-title');
    expect(cn('text-sm', 'text-body')).toBe('text-body');
    expect(cn('text-display', 'md:text-headline')).toBe('text-display md:text-headline');
  });

  it('löst Konflikte bei Schatten, Ebenen, Dauern, Kurven und Mindesthöhen', () => {
    expect(cn('shadow-md', 'shadow-raised')).toBe('shadow-raised');
    expect(cn('z-header', 'z-overlay')).toBe('z-overlay');
    expect(cn('duration-150', 'duration-quick')).toBe('duration-quick');
    expect(cn('ease-out', 'ease-enter')).toBe('ease-enter');
    expect(cn('min-h-touch', 'min-h-touch-lg')).toBe('min-h-touch-lg');
    expect(cn('min-w-0', 'min-w-touch')).toBe('min-w-touch');
  });

  it('kennt Abstände, Breiten und Sperrung des Systems', () => {
    expect(cn('py-14', 'py-section')).toBe('py-section');
    expect(cn('gap-4', 'gap-gutter')).toBe('gap-gutter');
    expect(cn('max-w-2xl', 'max-w-measure')).toBe('max-w-measure');
    expect(cn('tracking-wider', 'tracking-label')).toBe('tracking-label');
    expect(cn('border-2', 'border-strich')).toBe('border-strich');
    expect(klassen(cn('border-strich', 'border-border'))).toEqual(new Set(['border-strich', 'border-border']));
  });

  it('lässt Farbe und Schatten, Größe und Gewicht unabhängig', () => {
    expect(klassen(cn('shadow-raised', 'text-primary', 'font-semibold', 'text-small'))).toEqual(
      new Set(['shadow-raised', 'text-primary', 'font-semibold', 'text-small']),
    );
  });

  it('verhält sich für bekannte Tailwind-Klassen wie bisher', () => {
    expect(cn('px-2 py-1', 'p-3')).toBe('p-3');
    expect(cn('bg-primary', false, undefined, 'hover:bg-primary-hover')).toBe('bg-primary hover:bg-primary-hover');
  });
});
