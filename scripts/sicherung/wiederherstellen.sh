#!/usr/bin/env bash
# Datenbank aus einer Sicherung zurückspielen (docs/SUPABASE.md, Wiederherstellung).
# Läuft auf dem Rechner des Inhabers, nie in CI – nur dort liegt der private age-Schlüssel.
#
#   AGE_SCHLUESSEL=schluessel.txt scripts/sicherung/wiederherstellen.sh sm24-datenbank-….dump.age
#   scripts/sicherung/wiederherstellen.sh datenbank.dump [--ersetzen]
#
# Ziel über die libpq-Variablen, als sm24_migration über den Session-Pooler:
#   export PGHOST=<pooler-host> PGPORT=5432 PGDATABASE=postgres
#   export PGUSER=sm24_migration.<ref> PGSSLMODE=verify-full PGSSLROOTCERT=supabase-ca.crt
# Das Passwort fragen psql und pg_restore ab (oder PGPASSWORD). Werkzeuge in
# Version 17: PG_BIN zeigt auf deren Ordner (Standard: Debian/Ubuntu-Pfad, sonst PATH).
#
# Ohne --ersetzen nur in ein leeres Schema public (neues Projekt mit
# supabase/sql/0001–0005). --ersetzen löscht vorher die Objekte der Sicherung
# (pg_restore --clean); Tabellen, die erst nach der Sicherung entstanden sind,
# bleiben dann stehen – im Zweifel in ein neues Projekt wiederherstellen.
# pg_dump --schema=public schreibt „CREATE SCHEMA public“; das Skript lässt
# diesen Eintrag weg, weil es das Schema überall schon gibt.
# Danach: npm run pruefen:supabase, dann auf Vercel neu deployen.
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"

datei="${1:-}"
ersetzen=false
[[ "${2:-}" == --ersetzen ]] && ersetzen=true
[[ -f "$datei" ]] || fehler "Aufruf: wiederherstellen.sh <sicherung.dump.age|datenbank.dump> [--ersetzen]"
if [[ ! -x "$PG_BIN/pg_restore" ]]; then
  PG_BIN="$(dirname "$(command -v pg_restore || echo /fehlt/pg_restore)")"
fi
[[ -x "$PG_BIN/pg_restore" && -x "$PG_BIN/psql" ]] || fehler "pg_restore und psql (Version 17) nicht gefunden – PG_BIN setzen."
[[ "$(pg pg_restore --version)" =~ \)\ (1[7-9]|[2-9][0-9])\. ]] || fehler "pg_restore ist älter als Version 17."

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
dump="$datei"
if [[ "$datei" == *.age ]]; then
  [[ -n "${AGE_SCHLUESSEL:-}" ]] || fehler "AGE_SCHLUESSEL (Datei mit dem privaten age-Schlüssel) fehlt."
  dump="$tmp/datenbank.dump"
  age --decrypt --identity "$AGE_SCHLUESSEL" --output "$dump" "$datei" || fehler "Entschlüsseln fehlgeschlagen."
fi
pg pg_restore --list "$dump" | grep -v -E '^[0-9]+; [0-9]+ [0-9]+ SCHEMA - public ' >"$tmp/liste.txt" \
  || fehler "Die Datei ist kein lesbarer Abzug."

lage="$(sql --command "SELECT current_user || ' ' || (SELECT count(*) FROM pg_tables WHERE schemaname = 'public')")" \
  || fehler "Keine Verbindung zur Zieldatenbank (PGHOST, PGUSER, PGSSLROOTCERT, Passwort)."
rolle="${lage% *}"
tabellen="${lage##* }"
[[ "$rolle" == sm24_migration ]] || fehler "Bitte als sm24_migration verbinden, nicht als $rolle – sie muss Eigentümerin aller Tabellen werden."
if [[ "$tabellen" != 0 && "$ersetzen" != true ]]; then
  fehler "Schema public ist nicht leer. In ein neues Projekt wiederherstellen oder bewusst --ersetzen angeben."
fi

optionen=(--no-owner --no-privileges --single-transaction --exit-on-error --use-list="$tmp/liste.txt")
if [[ "$ersetzen" == true ]]; then optionen+=(--clean --if-exists); fi
pg pg_restore "${optionen[@]}" --dbname="${PGDATABASE:-postgres}" "$dump" || fehler "Wiederherstellung fehlgeschlagen – nichts geändert (eine Transaktion)."
meldung "Datenbank wiederhergestellt. Jetzt: npm run pruefen:supabase, danach auf Vercel neu deployen."
