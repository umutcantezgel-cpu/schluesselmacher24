-- Fingerabdruck der Daten in `public` für die nächtliche Sicherung
-- (scripts/sicherung/abzug.sh und probe.sh, docs/SUPABASE.md).
--
-- Ein psql-Skript (\pset, \gexec), kein reines SQL. Es läuft zweimal: in der
-- Live-Datenbank im selben Snapshot wie pg_dump und nach der
-- Probe-Wiederherstellung. Beide Ausgaben müssen Zeile für Zeile gleich sein.
-- Je Tabelle eine Zeile `tabelle|zeilen|prüfsumme`; die Prüfsumme hängt
-- nicht von der Reihenfolge der Zeilen ab. Die Ausgabe enthält Zählungen und
-- bleibt deshalb in Dateien – ins öffentliche Log kommen nur Tabellennamen.
--
-- sm24_ratenbegrenzung sichert der Abzug ohne Daten (--exclude-table-data);
-- für sie zählt nur, dass es die Tabelle gibt.

\pset format unaligned
\pset tuples_only on
\pset fieldsep '|'

-- Gleiche Textform auf beiden Seiten, unabhängig von Server und Rolle.
SET TIME ZONE 'UTC';
SET datestyle = 'ISO, YMD';
SET intervalstyle = 'postgres';
SET extra_float_digits = 1;
SET bytea_output = 'hex';
-- Lieber ein Fehler als eine Prüfsumme über nur sichtbare Zeilen (RLS).
SET row_security = off;

SELECT format(
  $sql$SELECT %L, count(*), coalesce(md5(string_agg(md5(sm24_zeile::text), '' ORDER BY md5(sm24_zeile::text) COLLATE "C")), '-') FROM %I.%I AS sm24_zeile$sql$,
  c.relname, n.nspname, c.relname
)
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind IN ('r', 'p')
  AND c.relname <> 'sm24_ratenbegrenzung'
ORDER BY c.relname
\gexec

SELECT 'sm24_ratenbegrenzung', 'nur-struktur', to_regclass('public.sm24_ratenbegrenzung') IS NOT NULL;
