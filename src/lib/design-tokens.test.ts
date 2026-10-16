import { describe, expect, it } from 'vitest';
import config from '../../tailwind.config';

/**
 * Tailwind erzeugt für `text-<name>` sowohl Schriftgröße als auch Farbe, wenn
 * beide Skalen denselben Namen tragen. So bekam `text-input` (16 px) zusätzlich
 * die Rahmenfarbe `input` als Schriftfarbe. Größen- und Farbnamen bleiben daher
 * getrennt.
 */
describe('Design-Tokens', () => {
  const erweiterung = config.theme?.extend ?? {};
  const groessen = Object.keys((erweiterung.fontSize ?? {}) as Record<string, unknown>);
  const farben = Object.keys((erweiterung.colors ?? {}) as Record<string, unknown>);

  it('hat Schriftgrößen und Farben', () => {
    expect(groessen.length).toBeGreaterThan(5);
    expect(farben.length).toBeGreaterThan(5);
  });

  it('vergibt keinen Namen zugleich als Schriftgröße und als Farbe', () => {
    expect(groessen.filter((name) => farben.includes(name))).toEqual([]);
  });
});
