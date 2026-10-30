-- 0002 Rollen
--
-- Rollentrennung (docs/SUPABASE.md):
--   sm24_migration  Eigentümer aller Tabellen. Nur im Build (Migrationen über
--                   DATABASE_URL_UNPOOLED, Session-Pooler Port 5432).
--   sm24_app        Laufzeit (DATABASE_URL, Transaction-Pooler Port 6543). Nur
--                   Daten lesen und schreiben, kein DDL. BYPASSRLS, weil RLS auf
--                   allen Tabellen ohne Policies sonst jede Zeile verbirgt – RLS
--                   sperrt so nur die API-Rollen.
--   sm24_sicherung  Nur Lesen für die nächtliche Sicherung (pg_dump braucht
--                   BYPASSRLS, sonst bricht es bei RLS-Tabellen ab).
--
-- KEINE Passwörter in dieser Datei. Der Inhaber setzt sie als SCRAM-Verifier
-- (scripts/scram-verifier.mjs), damit nie Klartext in SQL-Historie oder Logs
-- steht. Idempotent; angewendet als `sm24_0002_rollen`.

do $$
begin
  if not exists (select from pg_roles where rolname = 'sm24_migration') then
    create role sm24_migration login noinherit;
  end if;
  if not exists (select from pg_roles where rolname = 'sm24_app') then
    create role sm24_app login noinherit;
  end if;
  if not exists (select from pg_roles where rolname = 'sm24_sicherung') then
    create role sm24_sicherung login noinherit;
  end if;
end
$$;

-- Eigentümer umgehen RLS auf eigenen Tabellen ohnehin; BYPASSRLS braucht nur,
-- wer nicht Eigentümer ist. Das Verbindungslimit von sm24_app liegt mindestens
-- bei der Pool-Größe des Poolers, sonst gäbe es unter Last Fehler.
alter role sm24_migration nobypassrls connection limit 5;
alter role sm24_app bypassrls connection limit 25;
alter role sm24_sicherung bypassrls connection limit 3;

-- Eine Migration darf die Seite nicht lange blockieren.
alter role sm24_migration set statement_timeout = '10min';
alter role sm24_migration set lock_timeout = '30s';
alter role sm24_migration set search_path = public;
-- Admin-Hooks rufen Stripe und Resend innerhalb einer Transaktion auf
-- (bis zu 20 s je Versuch), daher 2 Minuten für offene Transaktionen.
alter role sm24_app set statement_timeout = '30s';
alter role sm24_app set lock_timeout = '15s';
alter role sm24_app set idle_in_transaction_session_timeout = '2min';
alter role sm24_app set search_path = public;
-- Das Lebenszeichen schreibt die Sicherung ausdrücklich mit BEGIN READ WRITE.
alter role sm24_sicherung set default_transaction_read_only = on;
alter role sm24_sicherung set statement_timeout = '10min';
alter role sm24_sicherung set search_path = public;

-- postgres verwaltet die Objekte von sm24_migration mit: Der Event-Trigger
-- aus 0003 schaltet RLS auf deren Tabellen ein, und die Default-Rechte unten
-- gelten für Objekte, die sm24_migration anlegt.
grant sm24_migration to postgres with inherit true, set true;

grant usage, create on schema public to sm24_migration;
grant usage on schema public to sm24_app, sm24_sicherung;

-- Vorhandene Objekte (etwa nach einer Wiederherstellung oder erneutem Anwenden)
grant select, insert, update, delete on all tables in schema public to sm24_app;
grant usage, select on all sequences in schema public to sm24_app;
grant select on all tables in schema public to sm24_sicherung;
grant select on all sequences in schema public to sm24_sicherung;

-- Künftige Objekte der Migrationen …
alter default privileges for role sm24_migration in schema public
  grant select, insert, update, delete on tables to sm24_app;
alter default privileges for role sm24_migration in schema public
  grant usage, select on sequences to sm24_app;
alter default privileges for role sm24_migration in schema public
  grant select on tables to sm24_sicherung;
alter default privileges for role sm24_migration in schema public
  grant select on sequences to sm24_sicherung;
alter default privileges for role sm24_migration in schema public
  revoke execute on functions from public;

-- … und als Rückfall die von postgres (etwa eine Wiederherstellung als postgres)
alter default privileges for role postgres in schema public
  grant select, insert, update, delete on tables to sm24_app;
alter default privileges for role postgres in schema public
  grant usage, select on sequences to sm24_app;
alter default privileges for role postgres in schema public
  grant select on tables to sm24_sicherung;
alter default privileges for role postgres in schema public
  grant select on sequences to sm24_sicherung;
