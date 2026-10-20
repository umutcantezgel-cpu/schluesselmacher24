import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
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

  it('nutzt die Rahmenfarbe nie als Schriftfarbe (text-input)', () => {
    const funde: string[] = [];
    const durchsuchen = (ordner: string) => {
      for (const name of readdirSync(ordner)) {
        const pfad = path.join(ordner, name);
        if (statSync(pfad).isDirectory()) durchsuchen(pfad);
        else if (/\.(tsx?|css)$/.test(name) && !name.includes('.test.')) {
          if (/\btext-input\b/.test(readFileSync(pfad, 'utf8'))) funde.push(pfad);
        }
      }
    };
    durchsuchen(path.resolve(__dirname, '..'));
    expect(funde).toEqual([]);
  });
});
