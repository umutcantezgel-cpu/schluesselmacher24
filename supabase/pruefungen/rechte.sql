-- Rechte-Prüfung (scripts/supabase-rechte.mjs pruefen)
--
-- Jede Ergebniszeile ist ein Befund; ein leeres Ergebnis heißt: alles in
-- Ordnung. Liest nur den Katalog, läuft also auch als Laufzeitrolle sm24_app.
-- Die Prüfungen der Laufzeitrolle selbst greifen nur, wenn sm24_app sie
-- ausführt (im Build nach den Migrationen); als postgres (MCP) entfallen sie.
--
-- Spalten: art (kurzer Schlüssel), objekt (was betroffen ist).

with
api_rollen as (
  select oid, rolname from pg_roles where rolname in ('anon', 'authenticated', 'service_role')
),
tabellen as (
  select c.oid, format('%I.%I', n.nspname, c.relname) as name, c.relrowsecurity, c.relowner
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r', 'p')
),
sequenzen as (
  select c.oid, format('%I.%I', n.nspname, c.relname) as name
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'S'
),
laufzeit as (
  select r.oid, r.rolname, r.rolsuper, r.rolbypassrls
  from pg_roles r
  where r.rolname = current_user and current_user = 'sm24_app'
)

-- RLS muss auf jeder Tabelle an sein (Stolperdraht, siehe 0003).
select 'rls-aus' as art, t.name as objekt
from tabellen t
where not t.relrowsecurity

-- Die API-Rollen dürfen in public nichts (0001).
union all
select 'api-recht-tabelle', t.name || ' → ' || r.rolname
from tabellen t cross join api_rollen r
where has_table_privilege(r.oid, t.oid, 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER')

union all
select 'api-recht-sequenz', s.name || ' → ' || r.rolname
from sequenzen s cross join api_rollen r
where has_sequence_privilege(r.oid, s.oid, 'USAGE, SELECT, UPDATE')

union all
select 'api-recht-funktion', p.oid::regprocedure::text || ' → ' || r.rolname
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
cross join api_rollen r
where n.nspname = 'public' and has_function_privilege(r.oid, p.oid, 'EXECUTE')

-- Nur ausdrückliche Rechte auf das Schema: USAGE über PUBLIC (Postgres-Standard)
-- öffnet ohne Tabellenrechte nichts.
union all
select 'api-recht-schema', 'public → ' || r.rolname
from pg_namespace n
cross join lateral aclexplode(n.nspacl) a
join api_rollen r on r.oid = a.grantee
where n.nspname = 'public' and r.rolname <> 'service_role'

-- Default-Rechte der Rollen, die in public anlegen, geben den API-Rollen nichts.
union all
select 'api-default-recht', pg_get_userbyid(d.defaclrole) || ' → ' || r.rolname
from pg_default_acl d
join pg_namespace n on n.oid = d.defaclnamespace
cross join lateral aclexplode(d.defaclacl) a
join api_rollen r on r.oid = a.grantee
where n.nspname = 'public'
  and pg_get_userbyid(d.defaclrole) in ('postgres', 'sm24_migration')

-- Der Event-Trigger aus 0003 ist da und aktiv.
union all
select 'event-trigger-fehlt', 'sm24_rls_automatik'
where not exists (select from pg_event_trigger where evtname = 'sm24_rls_automatik' and evtenabled <> 'D')

-- Alle Tabellen gehören sm24_migration (Migrationen laufen als sm24_migration).
union all
select 'eigentuemer', t.name || ' gehört ' || pg_get_userbyid(t.relowner)
from tabellen t
where pg_get_userbyid(t.relowner) <> 'sm24_migration'

-- Die Lebenszeichen-Funktion aus 0004 existiert.
union all
select 'lebenszeichen-fehlt', 'intern.lebenszeichen_setzen(text, jsonb)'
where to_regprocedure('intern.lebenszeichen_setzen(text, jsonb)') is null

-- Laufzeitrolle: kein Superuser, kein Eigentümer, kein DDL, aber BYPASSRLS
-- und volle Datenrechte auf jeder Tabelle und Sequenz.
union all
select 'laufzeit-superuser', l.rolname from laufzeit l where l.rolsuper

union all
select 'laufzeit-ohne-bypassrls', l.rolname from laufzeit l where not l.rolbypassrls

union all
select 'laufzeit-darf-anlegen', 'public' from laufzeit l where has_schema_privilege(l.oid, 'public', 'CREATE')

union all
select 'laufzeit-ist-eigentuemer', t.name
from tabellen t cross join laufzeit l
where pg_has_role(l.oid, t.relowner, 'USAGE')

union all
select 'laufzeit-recht-fehlt', t.name
from tabellen t cross join laufzeit l
where not (
  has_table_privilege(l.oid, t.oid, 'SELECT')
  and has_table_privilege(l.oid, t.oid, 'INSERT')
  and has_table_privilege(l.oid, t.oid, 'UPDATE')
  and has_table_privilege(l.oid, t.oid, 'DELETE')
)

union all
select 'laufzeit-sequenz-fehlt', s.name
from sequenzen s cross join laufzeit l
where not has_sequence_privilege(l.oid, s.oid, 'USAGE')

order by 1, 2;
