import { describe, expect, it } from 'vitest';

import { planeBuild, pruefeUmgebung } from './build.mjs';

const PRODUKTION = {
  VERCEL: '1',
  VERCEL_ENV: 'production',
  DATABASE_URL: 'postgres://pooler:6543/postgres',
  DATABASE_URL_UNPOOLED: 'postgres://direkt:5432/postgres',
  DATABASE_CA_CERT: '-----BEGIN CERTIFICATE-----\\nMIIC…\\n-----END CERTIFICATE-----',
  PAYLOAD_SECRET: '0123456789abcdef0123456789abcdef',
  NEXT_PUBLIC_SITE_URL: 'https://schluesselmacher24.de',
  CRON_SECRET: 'x',
  STORAGE_BUCKET: 'b',
  STORAGE_ACCESS_KEY: 'k',
  STORAGE_SECRET_KEY: 's',
  MAIL_PROVIDER: 'resend',
  MAIL_API_KEY: 'k',
  MAIL_FROM_ADDRESS: 'info@schluesselmacher24.de',
  PAYMENT_PROVIDER: 'stripe',
  PAYMENT_API_KEY: 'k',
  PAYMENT_WEBHOOK_SECRET: 'w',
};

const namen = (env: Record<string, string | undefined>) =>
  planeBuild(env, { node: 'node', wurzel: '/repo' }).schritte.map((s) => s.name);

describe('pruefeUmgebung', () => {
  it('lässt eine vollständige Produktion ohne Fehler und Warnung durch', () => {
    expect(pruefeUmgebung(PRODUKTION)).toEqual({ fehler: [], warnungen: [] });
  });

  it('bricht in Produktion ohne Datenbank, Geheimnis oder Site-URL ab', () => {
    const { fehler } = pruefeUmgebung({ ...PRODUKTION, DATABASE_URL: ' ', PAYLOAD_SECRET: '', NEXT_PUBLIC_SITE_URL: undefined });
    expect(fehler).toHaveLength(3);
    expect(fehler.join(' ')).toMatch(/DATABASE_URL.*PAYLOAD_SECRET.*NEXT_PUBLIC_SITE_URL/);
    expect(pruefeUmgebung({ ...PRODUKTION, DATABASE_URL: undefined, POSTGRES_URL: 'postgres://vercel' }).fehler).toEqual([]);
    expect(pruefeUmgebung({ ...PRODUKTION, SM24_DATA: 'json' }).fehler).toHaveLength(1);
  });

  it('bricht in Produktion ab, wenn die Datenbankverbindung unverschlüsselt wäre', () => {
    const ohneCa = { ...PRODUKTION, DATABASE_CA_CERT: ' ' };
    const { fehler } = pruefeUmgebung(ohneCa);
    expect(fehler).toHaveLength(1);
    expect(fehler[0]).toMatch(/^Datenbankverbindung wäre unverschlüsselt: DATABASE_CA_CERT setzen \(Supabase → Database/);

    // Mit sslmode in beiden Adressen verschlüsselt `pg` auch ohne eigenes Zertifikat.
    const mitSsl = (url: string, modus: string) => `${url}?sslmode=${modus}`;
    for (const modus of ['require', 'verify-ca', 'verify-full']) {
      const env = { ...ohneCa, DATABASE_URL: mitSsl(PRODUKTION.DATABASE_URL, modus), DATABASE_URL_UNPOOLED: mitSsl(PRODUKTION.DATABASE_URL_UNPOOLED, modus) };
      expect(pruefeUmgebung(env).fehler).toEqual([]);
    }
    // Vercel-Integration: POSTGRES_URL / POSTGRES_URL_NON_POOLING mit sslmode=require.
    expect(
      pruefeUmgebung({
        ...ohneCa,
        DATABASE_URL: undefined,
        DATABASE_URL_UNPOOLED: undefined,
        POSTGRES_URL: 'postgres://u:p@pooler:6543/postgres?sslmode=require&supa=base-pooler.x',
        POSTGRES_URL_NON_POOLING: 'postgres://u:p@pooler:5432/postgres?sslmode=require',
      }).fehler,
    ).toEqual([]);

    // Nur eine Adresse mit sslmode, oder ein Modus ohne Pflicht: weiter Fehler.
    expect(pruefeUmgebung({ ...ohneCa, DATABASE_URL: mitSsl(PRODUKTION.DATABASE_URL, 'require') }).fehler).toHaveLength(1);
    for (const modus of ['disable', 'prefer', 'allow']) {
      const env = { ...ohneCa, DATABASE_URL: mitSsl(PRODUKTION.DATABASE_URL, modus), DATABASE_URL_UNPOOLED: mitSsl(PRODUKTION.DATABASE_URL_UNPOOLED, modus) };
      expect(pruefeUmgebung(env).fehler).toHaveLength(1);
    }
  });

  it('warnt bei fehlenden Anbindungen und kurzem Geheimnis', () => {
    const { fehler, warnungen } = pruefeUmgebung({
      ...PRODUKTION,
      CRON_SECRET: undefined,
      STORAGE_SECRET_KEY: undefined,
      MAIL_API_KEY: undefined,
      PAYMENT_PROVIDER: undefined,
      PAYLOAD_SECRET: 'kurz',
    });
    expect(fehler).toEqual([]);
    expect(warnungen).toHaveLength(5);
    expect(warnungen.join('\n')).toMatch(/CRON_SECRET/);
    expect(warnungen.join('\n')).toMatch(/STORAGE_SECRET_KEY/);
  });

  it('prüft außerhalb der Produktion nichts', () => {
    expect(pruefeUmgebung({ VERCEL: '1', VERCEL_ENV: 'preview' })).toEqual({ fehler: [], warnungen: [] });
    expect(pruefeUmgebung({})).toEqual({ fehler: [], warnungen: [] });
  });
});

describe('planeBuild', () => {
  it('Produktion: Migration über die direkte Verbindung, Seed, Pflicht-Zugang, Pflicht-Prüfung, dann next build', () => {
    const { schritte } = planeBuild(PRODUKTION, { node: 'node', wurzel: '/repo' });
    expect(schritte.map((s) => s.name)).toEqual([
      'Migrationen', 'Seed', 'Erster Backend-Zugang', 'Livegang-Prüfung', 'Next.js-Build',
    ]);
    expect(schritte[0]).toMatchObject({
      befehl: ['node', '/repo/node_modules/payload/bin.js', 'migrate'],
      env: { DATABASE_URL: 'postgres://direkt:5432/postgres' },
    });
    expect(schritte[1].env).toEqual({ DATABASE_URL: 'postgres://pooler:6543/postgres' });
    expect(schritte[2].env?.SM24_ADMIN_PFLICHT).toBe('1');
    expect(schritte[3].nurWarnung).toBe(false);
    expect(schritte[4].befehl).toEqual(['node', '/repo/node_modules/next/dist/bin/next', 'build']);
  });

  it('Vorschau mit Datenbank: nichts an der Datenbank ändern — außer mit SM24_PREVIEW_MIGRATE=1', () => {
    const vorschau = { ...PRODUKTION, VERCEL_ENV: 'preview' };
    expect(namen(vorschau)).toEqual(['Next.js-Build']);
    expect(planeBuild(vorschau).hinweise.join(' ')).toMatch(/SM24_PREVIEW_MIGRATE/);

    const mitMigration = planeBuild({ ...vorschau, SM24_PREVIEW_MIGRATE: '1' }, { node: 'node', wurzel: '/repo' }).schritte;
    expect(mitMigration.map((s) => s.name)).toContain('Migrationen');
    expect(mitMigration.find((s) => s.name === 'Erster Backend-Zugang')?.env?.SM24_ADMIN_PFLICHT).toBe('');
    expect(mitMigration.find((s) => s.name === 'Livegang-Prüfung')?.nurWarnung).toBe(true);
  });

  it('ohne Datenbank nur next build', () => {
    expect(namen({ VERCEL: '1', VERCEL_ENV: 'preview' })).toEqual(['Next.js-Build']);
    expect(namen({})).toEqual(['Next.js-Build']);
    expect(namen({ DATABASE_URL: 'postgres://x', SM24_DATA: 'json' })).toEqual(['Next.js-Build']);
  });

  it('lokal mit Datenbank: erst das lokale Postgres bereitstellen', () => {
    const lokal = planeBuild({ DATABASE_URL: 'postgres://127.0.0.1:5433/sm24' }, { node: 'node', wurzel: '/repo' }).schritte;
    expect(lokal.map((s) => s.name)).toEqual([
      'Datenbank bereitstellen', 'Migrationen', 'Seed', 'Erster Backend-Zugang', 'Livegang-Prüfung', 'Next.js-Build',
    ]);
    expect(lokal[0].befehl).toEqual(['node', '/repo/scripts/db.mjs', 'ensure']);
    expect(lokal[4].nurWarnung).toBe(true);
  });
});
