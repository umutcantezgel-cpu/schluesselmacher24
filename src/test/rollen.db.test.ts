import { Client, type DatabaseError } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { pruefen } from '../../scripts/supabase-rechte.mjs';

/*
 * Rollentrennung und Rechte wie bei Supabase (supabase/sql/, docs/SUPABASE.md).
 * Die Testdatenbank ist so aufgesetzt wie Projekt A (src/test/db-global-setup.ts):
 * Migrationen als sm24_migration, Laufzeit als sm24_app, Sicherung als
 * sm24_sicherung, dazu die nachgebildeten API-Rollen von Supabase.
 */

const LEER = {};

function adresse(name: 'DATABASE_URL' | 'SM24_TEST_DATABASE_URL_SUPERUSER' | 'SM24_TEST_DATABASE_URL_SICHERUNG') {
  const wert = process.env[name];
  if (!wert) throw new Error(`${name} fehlt — läuft der Test über vitest.db.config.ts?`);
  return wert;
}

async function verbinden(url: string) {
  const client = new Client({ connectionString: url });
  await client.connect();
  return client;
}

/** SQLSTATE des Fehlers, den die Anweisung auslöst (oder null). */
async function fehlercode(client: Client, anweisung: string): Promise<string | null> {
  try {
    await client.query(anweisung);
    return null;
  } catch (error) {
    return (error as DatabaseError).code ?? 'unbekannt';
  }
}

let app: Client;
let sicherung: Client;
let superuser: Client;

beforeAll(async () => {
  app = await verbinden(adresse('DATABASE_URL'));
  sicherung = await verbinden(adresse('SM24_TEST_DATABASE_URL_SICHERUNG'));
  superuser = await verbinden(adresse('SM24_TEST_DATABASE_URL_SUPERUSER'));
});

afterAll(async () => {
  await Promise.all([app?.end(), sicherung?.end(), superuser?.end()]);
});

describe('Laufzeitrolle sm24_app', () => {
  it('läuft als sm24_app', async () => {
    const { rows } = await app.query('select current_user as rolle');
    expect(rows[0].rolle).toBe('sm24_app');
  });

  it('darf kein DDL, kein TRUNCATE und keine fremden Rollen', async () => {
    expect(await fehlercode(app, 'create table public.versuch (id int)')).toBe('42501');
    expect(await fehlercode(app, 'alter table public.vorgaenge add column versuch int')).toBe('42501');
    expect(await fehlercode(app, 'drop table public.vorgaenge')).toBe('42501');
    expect(await fehlercode(app, 'truncate public.sm24_ratenbegrenzung')).toBe('42501');
    expect(await fehlercode(app, 'select rolpassword from pg_authid')).toBe('42501');
    expect(await fehlercode(app, 'set role sm24_migration')).toBe('42501');
  });

  it('liest und schreibt trotz RLS (BYPASSRLS)', async () => {
    const { rows } = await app.query('select count(*)::int as anzahl from public.einsatzgebiete');
    expect(rows[0].anzahl).toBeGreaterThan(0);
    await app.query('begin');
    await app.query(`insert into public.sm24_zaehler (schluessel, wert) values ('rollentest', 1)`);
    await app.query('rollback');
  });

  it('setzt und liest Lebenszeichen nur für bekannte Quellen', async () => {
    await app.query(`select intern.lebenszeichen_setzen('cron-taeglich', '{"status":"ok"}'::jsonb)`);
    const { rows } = await app.query(`select anzahl, details from intern.lebenszeichen where quelle = 'cron-taeglich'`);
    expect(rows[0].details).toEqual({ status: 'ok' });
    expect(await fehlercode(app, `select intern.lebenszeichen_setzen('unbekannt', '{}'::jsonb)`)).toBe('23514');
    expect(await fehlercode(app, `insert into intern.lebenszeichen (quelle) values ('wache')`)).toBe('42501');
  });
});

describe('Sicherungsrolle sm24_sicherung', () => {
  it('liest mit row_security=off wie pg_dump', async () => {
    await sicherung.query('set row_security = off');
    const { rows } = await sicherung.query('select count(*)::int as anzahl from public.einsatzgebiete');
    expect(rows[0].anzahl).toBeGreaterThan(0);
  });

  it('schreibt keine Daten, setzt aber ihr Lebenszeichen', async () => {
    expect(await fehlercode(sicherung, `insert into public.sm24_zaehler (schluessel, wert) values ('x', 1)`)).toBe('25006');
    await sicherung.query('begin read write');
    await sicherung.query(`select intern.lebenszeichen_setzen('sicherung-db', '{}'::jsonb)`);
    await sicherung.query('commit');
    expect(await fehlercode(sicherung, `begin read write; insert into public.sm24_zaehler (schluessel, wert) values ('x', 1)`)).toBe('42501');
    await sicherung.query('rollback');
  });
});

describe('Rechte-Prüfung (supabase/pruefungen/rechte.sql)', () => {
  it('hat in der wie Supabase aufgesetzten Datenbank keine Befunde', async () => {
    expect(await pruefen(adresse('DATABASE_URL'), LEER)).toEqual([]);
  });

  it('jede Tabelle hat RLS und gehört sm24_migration', async () => {
    const { rows } = await superuser.query(`
      select count(*)::int as tabellen,
             count(*) filter (where c.relrowsecurity)::int as mit_rls,
             array_agg(distinct pg_get_userbyid(c.relowner)::text) as eigentuemer
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind in ('r', 'p')`);
    expect(rows[0].tabellen).toBeGreaterThan(90);
    expect(rows[0].mit_rls).toBe(rows[0].tabellen);
    expect(rows[0].eigentuemer).toEqual(['sm24_migration']);
  });

  it('meldet ein versehentliches Recht für anon genau einmal', async () => {
    await superuser.query('grant select on public.vorgaenge to anon');
    try {
      const befunde = await pruefen(adresse('DATABASE_URL'), LEER);
      expect(befunde).toEqual([{ art: 'api-recht-tabelle', objekt: 'public.vorgaenge → anon' }]);
    } finally {
      await superuser.query('revoke select on public.vorgaenge from anon');
    }
  });

  it('neue Tabellen bekommen RLS automatisch (Event-Trigger)', async () => {
    await superuser.query('begin');
    try {
      await superuser.query('set local role sm24_migration');
      await superuser.query('create table public.rollentest (id int primary key)');
      const { rows } = await superuser.query(
        `select relrowsecurity from pg_class where oid = 'public.rollentest'::regclass`,
      );
      expect(rows[0].relrowsecurity).toBe(true);
    } finally {
      await superuser.query('rollback');
    }
  });
});
