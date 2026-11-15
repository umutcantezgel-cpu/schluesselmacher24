import { readdirSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { Seiten } from '../collections/Seiten';
import { ADRESSE_MELDUNG, RESERVIERTE_NAMEN, VORHANDENE_ROUTEN, adressePruefen, eigeneSeiteAdresse, neueSeiteVorAenderung } from './seiten-adresse';

/* FA-KERN-05: Neue Inhaltsseiten mit eigener Adresse. Nur freie, ungefährliche Adressen, zunächst noindex. */

const TEAM = { id: 1, email: 'inhaber@example.org', rollen: ['inhaber'] };
const anlegen = (data: Record<string, unknown>, user: unknown = TEAM) =>
  neueSeiteVorAenderung({ data, operation: 'create', req: { user } } as never) as Record<string, unknown>;

describe('Adresse einer neuen Seite', () => {
  it('lehnt reservierte Adressen ab', () => {
    for (const name of ['impressum', 'datenschutz', 'agb', 'widerruf', 'sitemap', 'robots', 'wp-admin', 'login']) {
      expect(adressePruefen(name), name).toBe(ADRESSE_MELDUNG.reserviert);
      expect(() => anlegen({ route: name, headline: 'x' }), name).toThrow(ADRESSE_MELDUNG.reserviert);
    }
  });

  it('lehnt vorhandene Routen der Website ab', () => {
    for (const name of ['admin', 'api', 'kasse', 'ratgeber', 'autoschluessel', 'rechtliches', 'warenkorb']) {
      expect(adressePruefen(name), name).toBe(ADRESSE_MELDUNG.vergeben);
    }
  });

  it('lehnt unsaubere Formen ab: Schrägstrich, Großbuchstaben, Punkte, Leerzeichen, zu kurz oder lang', () => {
    for (const wert of ['', 'ab', 'a/b', '/neu', 'Neue-Seite', 'neu.html', 'neu seite', '-neu', 'neu-', 'neu--seite', '../admin', 'ä-seite', 'x'.repeat(61), null, 7]) {
      expect(adressePruefen(wert), String(wert)).toBe(ADRESSE_MELDUNG.form);
    }
    expect(adressePruefen('schluessel-fuer-vereine')).toBeNull();
    expect(adressePruefen('tag-der-offenen-tuer-2027')).toBeNull();
  });

  it('kennt jede Route der Website (Liste gleich den Ordnern)', () => {
    const app = path.join(process.cwd(), 'src', 'app');
    const ordner = (wurzel: string) =>
      readdirSync(wurzel, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !e.name.startsWith('(') && !e.name.startsWith('[') && !e.name.startsWith('_'))
        .map((e) => e.name);
    const routen = new Set([...ordner(path.join(app, '(site)')), ...ordner(path.join(app, '(payload)'))]);
    for (const route of routen) expect(VORHANDENE_ROUTEN, route).toContain(route);
    // Keine Überschneidung der Listen, alle Einträge in der zulässigen Form.
    for (const name of [...VORHANDENE_ROUTEN, ...RESERVIERTE_NAMEN]) expect(name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(VORHANDENE_ROUTEN.filter((r) => RESERVIERTE_NAMEN.includes(r))).toEqual([]);
  });

  it('setzt eine neue Seite zunächst auf noindex', () => {
    expect(anlegen({ route: ' schluessel-fuer-vereine ', headline: 'Vereine' })).toMatchObject({
      route: 'schluessel-fuer-vereine',
      seo: { noindex: true },
    });
    expect(anlegen({ route: 'vereine', headline: 'x', seo: { title: 'T', noindex: false } }).seo).toEqual({ title: 'T', noindex: true });
  });

  it('lässt Seed und Server ohne Benutzer wie bisher anlegen (feste Seiten)', () => {
    expect(anlegen({ route: 'autoschluessel', headline: 'x' }, null)).toMatchObject({ route: 'autoschluessel' });
    expect(neueSeiteVorAenderung({ data: { route: 'agb' }, operation: 'update', req: { user: TEAM } } as never)).toEqual({ route: 'agb' });
  });

  it('hält die Adresse nach dem Anlegen fest', () => {
    const route = Seiten.fields.find((f) => 'name' in f && f.name === 'route') as { access?: { update?: () => boolean } };
    expect(route.access?.update?.()).toBe(false);
  });
});

describe('Auffangroute', () => {
  it('zeigt nur einteilige, freie Adressen als eigene Seite', () => {
    expect(eigeneSeiteAdresse(['schluessel-fuer-vereine'])).toBe('schluessel-fuer-vereine');
    expect(eigeneSeiteAdresse(['impressum'])).toBeNull();
    expect(eigeneSeiteAdresse(['kasse'])).toBeNull();
    expect(eigeneSeiteAdresse(['vereine', 'unterseite'])).toBeNull();
    expect(eigeneSeiteAdresse([])).toBeNull();
    expect(eigeneSeiteAdresse(undefined)).toBeNull();
  });
});
