import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ANGABE_EINZEILIG_BIS, angabeEinzeilig, angabenSpalten } from './angaben';

describe('Schriftfeld der Ortsseite: Umbruch der Werte', () => {
  it('hält kurze Zahlenwerte in einer Zeile', () => {
    expect(angabeEinzeilig('35 km')).toBe(true);
    expect(angabeEinzeilig('ab 9 Uhr')).toBe(true);
    expect(angabeEinzeilig('  24 Minuten ')).toBe(true);
  });

  it('lässt eine Anschrift umbrechen', () => {
    expect(angabeEinzeilig('Musterweg 1, 01234 Musterstadt')).toBe(false);
    expect('Musterweg 1, 01234 Musterstadt'.length).toBeGreaterThan(ANGABE_EINZEILIG_BIS);
  });

  it('lässt Wortwerte ohne Ziffern wie bisher umbrechen', () => {
    expect(angabeEinzeilig('nur nach Prüfung')).toBe(false);
    expect(angabeEinzeilig('')).toBe(false);
  });

  it('gibt ab 640 px so viele Spalten wie Angaben, höchstens vier', () => {
    expect(angabenSpalten(1)).toBe('sm:grid-cols-1');
    expect(angabenSpalten(3)).toBe('sm:grid-cols-3');
    expect(angabenSpalten(4)).toBe('sm:grid-cols-4');
    expect(angabenSpalten(7)).toBe('sm:grid-cols-4');
    expect(angabenSpalten(0)).toBe('sm:grid-cols-1');
  });

  it('lässt auf der Ortsseite auch eine lange Beschriftung umbrechen statt überlaufen', () => {
    const seite = readFileSync('src/app/(site)/standorte/[city]/page.tsx', 'utf8');
    expect(seite).toContain('angabenSpalten(angaben.length)');
    expect(seite).toMatch(/<dt className="[^"]*\[overflow-wrap:anywhere\]/);
  });

  it('wird von der Ortsseite benutzt; kein Wert mit Ziffern ist dort pauschal einzeilig', () => {
    const seite = readFileSync('src/app/(site)/standorte/[city]/page.tsx', 'utf8');
    expect(seite).toContain("angabeEinzeilig(fact.value) ? 'whitespace-nowrap' : 'break-words'");
    expect(seite).not.toContain("'font-mono tabular-nums whitespace-nowrap'");
  });
});
