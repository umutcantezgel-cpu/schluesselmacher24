-- 0003 RLS-Automatik
--
-- Jede neue Tabelle in `public` und `intern` bekommt sofort Row Level
-- Security. Ohne Policies sperrt das alle API-Rollen; Payload ist nicht
-- betroffen (Migrationen als Eigentümer sm24_migration, Laufzeit als sm24_app
-- mit BYPASSRLS). RLS ist hier ein Stolperdraht zusätzlich zur abgeschalteten
-- Data API und den entzogenen Rechten (0001).
--
-- Anders als das Doku-Muster von Supabase (`rls_auto_enable`) schluckt die
-- Funktion keine Fehler: Lieber bricht eine Migration ab, als dass eine
-- Tabelle ohne RLS entsteht. Der Trigger feuert bei jedem CREATE TABLE der
-- Datenbank; deshalb filtert die Funktion zuerst nach Schema und bleibt
-- für alle anderen Schemas wirkungslos.
--
-- Idempotent; angewendet als `sm24_0003_rls_automatik`.

create schema if not exists intern;
revoke all on schema intern from public;

create or replace function intern.rls_automatisch()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  befehl record;
begin
  for befehl in
    select object_identity
    from pg_event_trigger_ddl_commands()
    where schema_name in ('public', 'intern')
      and command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      and object_type in ('table', 'partitioned table')
  loop
    execute format('alter table %s enable row level security', befehl.object_identity);
  end loop;
end
$$;

revoke all on function intern.rls_automatisch() from public;

drop event trigger if exists sm24_rls_automatik;
create event trigger sm24_rls_automatik
  on ddl_command_end
  when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  execute function intern.rls_automatisch();

-- Schon vorhandene Tabellen nachziehen (etwa nach einer Wiederherstellung).
do $$
declare
  tabelle record;
begin
  for tabelle in
    select format('%I.%I', n.nspname, c.relname) as name
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname in ('public', 'intern')
      and c.relkind in ('r', 'p')
      and not c.relrowsecurity
  loop
    execute format('alter table %s enable row level security', tabelle.name);
  end loop;
end
$$;
