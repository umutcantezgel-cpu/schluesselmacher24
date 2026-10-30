-- Nachbildung der Supabase-Rollen für lokale Datenbanken, die DB-Tests in CI
-- und die Probe-Wiederherstellung der Sicherung.
--
-- Supabase legt die API-Rollen an und gibt ihnen in `public` standardmäßig
-- alles. Genau diesen Ausgangszustand bildet die Datei nach, damit die
-- Rücknahme durch 0001 wirklich getestet wird. Nur als Superuser einspielen
-- (embedded Postgres, Service-Container) – nie bei Supabase selbst.

do $$
declare
  rolle text;
begin
  foreach rolle in array array['anon', 'authenticated', 'service_role'] loop
    if not exists (select from pg_roles where rolname = rolle) then
      execute format('create role %I nologin noinherit', rolle);
    end if;
  end loop;
end
$$;

grant usage on schema public to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on functions to anon, authenticated, service_role;
