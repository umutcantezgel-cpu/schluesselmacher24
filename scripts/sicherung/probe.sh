#!/usr/bin/env bash
# Probe-Wiederherstellung vor dem Hochladen (docs/SUPABASE.md, Sicherung):
# Der Abzug wird in einen leeren Postgres-17-Container eingespielt wie im
# Ernstfall bei Supabase – Supabase-Rollen nachgebildet (supabase/nachbildung.sql),
# Härtung aus supabase/sql/, dann pg_restore als Eigentümer sm24_migration,
# nicht als Superuser. Danach muss der Fingerabdruck dem der Live-Datenbank
# gleichen, und die Rechte-Prüfung (supabase/pruefungen/rechte.sql) bleibt als
# Laufzeitrolle sm24_app ohne Befund. Nur dann wird verschlüsselt und hochgeladen.
#
# Ohne Docker (Probelauf auf einem eigenen Rechner): PROBE_PASSWORT und
# PROBE_PORT einer leeren Instanz setzen, dazu nach Bedarf PROBE_HOST,
# PROBE_BENUTZER (Superuser) und PROBE_DATENBANK.
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"

DUMP="$ARBEIT/datenbank.dump"
for datei in "$DUMP" "$ARBEIT/inhalt.txt" "$ARBEIT/fingerabdruck-live.txt"; do
  [[ -s "$datei" ]] || fehler "Probe: Abzug unvollständig – erst abzug.sh."
done

zufall() { openssl rand -hex 24; }
port="${PROBE_PORT:-55432}"
datenbank="${PROBE_DATENBANK:-postgres}"
superuser="${PROBE_BENUTZER:-postgres}"
migration_passwort="$(zufall)"
app_passwort="$(zufall)"
maskieren "$migration_passwort"
maskieren "$app_passwort"

if [[ -n "${PROBE_PASSWORT:-}" ]]; then
  host="${PROBE_HOST:-127.0.0.1}"
  superuser_passwort="$PROBE_PASSWORT"
else
  host=127.0.0.1
  superuser_passwort="$(zufall)"
  maskieren "$superuser_passwort"
  behaelter="sm24-probe-$$"
  trap 'docker rm --force "$behaelter" >/dev/null 2>&1 || true' EXIT
  # Nur an localhost gebunden; das Passwort geht über die Umgebung, nicht über die Befehlszeile.
  POSTGRES_PASSWORD="$superuser_passwort" docker run --detach --rm --name "$behaelter" \
    --env POSTGRES_PASSWORD --publish "127.0.0.1:$port:5432" "${PROBE_BILD:-postgres:17}" >>"$LOGS/probe.log" 2>&1 \
    || fehler "Probe: Container mit postgres:17 startet nicht."
fi

# Befehl mit der Verbindung zur Probe-Datenbank als <benutzer> ausführen.
als() {
  local benutzer=$1 passwort=$2
  shift 2
  (
    unset PGSERVICE PGSSLROOTCERT PGSSLCERT PGSSLKEY PGOPTIONS PGSERVICEFILE
    export PGHOST="$host" PGPORT="$port" PGDATABASE="$datenbank" PGSSLMODE=disable \
      PGUSER="$benutzer" PGPASSWORD="$passwort" PGAPPNAME=sm24-probe PGCONNECT_TIMEOUT=10
    "$@"
  )
}
als_superuser() { als "$superuser" "$superuser_passwort" "$@"; }

bereit=false
for _ in $(seq 1 90); do
  if als_superuser pg pg_isready --quiet; then
    bereit=true
    break
  fi
  sleep 1
done
$bereit || fehler "Probe: Datenbank im Container antwortet nicht."

# Ausgangslage wie bei Supabase, dann dieselben Dateien, die Claude dort per MCP einspielt.
for datei in "$WURZEL/supabase/nachbildung.sql" "$WURZEL"/supabase/sql/[0-9]*.sql; do
  als_superuser sql --file="$datei" >>"$LOGS/probe.log" 2>&1 \
    || fehler "Probe: ${datei#"$WURZEL"/} lässt sich nicht einspielen."
done
(
  export PROBE_MIGRATION_PASSWORT="$migration_passwort" PROBE_APP_PASSWORT="$app_passwort"
  als_superuser sql --file=- >>"$LOGS/probe.log" 2>&1 <<'SQL'
\getenv migration PROBE_MIGRATION_PASSWORT
\getenv app PROBE_APP_PASSWORT
ALTER ROLE sm24_migration PASSWORD :'migration';
ALTER ROLE sm24_app PASSWORD :'app';
SQL
) || fehler "Probe: Rollenpasswörter nicht setzbar."

# pg_dump --schema=public schreibt „CREATE SCHEMA public“; das Schema gibt es
# in jeder Datenbank schon (bei Supabase gehört es nicht sm24_migration).
grep -v -E '^[0-9]+; [0-9]+ [0-9]+ SCHEMA - public ' "$ARBEIT/inhalt.txt" >"$ARBEIT/inhalt-probe.txt" \
  || fehler "Probe: Inhaltsverzeichnis des Abzugs leer."
als sm24_migration "$migration_passwort" pg pg_restore --no-password --no-owner --no-privileges \
  --single-transaction --exit-on-error --use-list="$ARBEIT/inhalt-probe.txt" \
  --dbname="$datenbank" "$DUMP" >>"$LOGS/probe.log" 2>&1 \
  || fehler "Probe: Wiederherstellung als sm24_migration fehlgeschlagen."

als_superuser sql --file="$FINGERABDRUCK_SQL" >"$ARBEIT/fingerabdruck-probe.txt" 2>>"$LOGS/probe.log" \
  || fehler "Probe: Fingerabdruck der Wiederherstellung fehlgeschlagen."
sort "$ARBEIT/fingerabdruck-live.txt" >"$ARBEIT/fingerabdruck-live.sortiert"
sort "$ARBEIT/fingerabdruck-probe.txt" >"$ARBEIT/fingerabdruck-probe.sortiert"
if ! cmp -s "$ARBEIT/fingerabdruck-live.sortiert" "$ARBEIT/fingerabdruck-probe.sortiert"; then
  # Nur die Tabellennamen – Zählungen und Prüfsummen bleiben in den Dateien.
  abweichend="$(comm -3 "$ARBEIT/fingerabdruck-live.sortiert" "$ARBEIT/fingerabdruck-probe.sortiert" \
    | tr -d '\t' | cut -d '|' -f 1 | sort -u | paste -sd ' ' -)"
  fehler "Probe: Daten weichen von der Live-Datenbank ab – Tabellen: $abweichend"
fi

befunde="$(als sm24_app "$app_passwort" sql --field-separator=' ' --file="$WURZEL/supabase/pruefungen/rechte.sql" 2>>"$LOGS/probe.log")" \
  || fehler "Probe: Rechte-Prüfung nicht ausführbar."
if [[ -n "$befunde" ]]; then
  # Art und Objekt (Tabellen- und Rollennamen), keine Daten.
  printf '%s\n' "$befunde" | sed 's/^/  /'
  fehler "Probe: Rechte-Prüfung mit Befunden (supabase/pruefungen/rechte.sql)."
fi

meldung "Probe: wiederhergestellt als sm24_migration, Fingerabdruck gleich, Rechte ohne Befund."
