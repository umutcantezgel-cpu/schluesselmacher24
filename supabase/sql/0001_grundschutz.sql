-- 0001 Grundschutz
--
-- Die API-Rollen von Supabase (anon, authenticated, service_role) erhalten in
-- `public` keinerlei Rechte – weder auf vorhandene noch auf künftige Objekte.
-- Die Data API ist zusätzlich im Dashboard abgeschaltet; diese Datei sorgt
-- dafür, dass auch ein versehentliches Wiedereinschalten nichts freigibt.
--
-- Idempotent. Ohne diese Rollen (lokale Datenbank, CI) passiert nichts.
-- Angewendet per Supabase-MCP `apply_migration` als `sm24_0001_grundschutz`.

do $$
declare
  rolle text;
begin
  foreach rolle in array array['anon', 'authenticated', 'service_role'] loop
    continue when not exists (select from pg_roles where rolname = rolle);

    execute format('revoke all on all tables in schema public from %I', rolle);
    execute format('revoke all on all sequences in schema public from %I', rolle);
    execute format('revoke all on all functions in schema public from %I', rolle);
    execute format('alter default privileges for role postgres in schema public revoke all on tables from %I', rolle);
    execute format('alter default privileges for role postgres in schema public revoke all on sequences from %I', rolle);
    execute format('alter default privileges for role postgres in schema public revoke all on functions from %I', rolle);
    -- service_role behält USAGE auf dem Schema: Supabase-Dienste prüfen es teils.
    if rolle <> 'service_role' then
      execute format('revoke all on schema public from %I', rolle);
    end if;
  end loop;
end
$$;

-- Neue Funktionen in `public` sind nicht mehr automatisch für alle ausführbar.
alter default privileges for role postgres in schema public revoke execute on functions from public;
