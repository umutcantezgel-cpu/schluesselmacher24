# shellcheck shell=bash
# Gemeinsame Helfer der nächtlichen Sicherung (.github/workflows/sicherung.yml,
# docs/SUPABASE.md). Wird von den anderen Skripten per `source` geladen.
#
# Log-Hygiene – Repo und Actions-Logs sind öffentlich:
# - kein `set -x`; auf die Konsole kommen nur feste Texte (`meldung`, `fehler`),
# - Ausgaben der Werkzeuge gehen nach $LOGS; schlägt ein Lauf fehl, legt
#   fehlerprotokoll.sh sie verschlüsselt nach fehler/ in R2,
# - keine Zählungen, Größen oder Objektschlüssel (die tragen Dateinamen von Kunden).
#
# Für einen Probelauf außerhalb von GitHub lassen sich Verbindung, Probe und
# Ablage umlenken: SB_BENUTZER, SB_PORT, SB_SSLMODE, SB_DATENBANK; PROBE_HOST,
# PROBE_PORT, PROBE_BENUTZER, PROBE_PASSWORT, PROBE_DATENBANK (probe.sh);
# ZIEL_LOKAL und QUELLE_LOKAL (Ordner statt R2 bzw. Supabase-Bucket).

set -euo pipefail
umask 077

SKRIPTE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WURZEL="$(cd "$SKRIPTE/../.." && pwd)"
ARBEIT="${ARBEIT:-${RUNNER_TEMP:-/tmp}/sm24-sicherung}"
LOGS="$ARBEIT/logs"
EMPFAENGER="$WURZEL/supabase/sicherung/empfaenger.txt"
FINGERABDRUCK_SQL="$WURZEL/supabase/sicherung/fingerabdruck.sql"
# pg_dump muss mindestens so neu sein wie der Server (Supabase: Postgres 17).
PG_BIN="${PG_BIN:-/usr/lib/postgresql/17/bin}"
ZIEL_BUCKET_DB="${ZIEL_BUCKET_DB:-sm24-sicherung-db}"
ZIEL_BUCKET_DATEIEN="${ZIEL_BUCKET_DATEIEN:-sm24-sicherung-dateien}"
export SKRIPTE WURZEL ARBEIT LOGS EMPFAENGER FINGERABDRUCK_SQL PG_BIN ZIEL_BUCKET_DB ZIEL_BUCKET_DATEIEN
mkdir -p "$LOGS"

meldung() { printf '%s\n' "$*"; }

fehler() {
  if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
    printf '::error::%s\n' "$*"
  else
    printf 'Fehler: %s\n' "$*" >&2
  fi
  exit 1
}

# Abgeleitete Geheimnisse (Zufallspasswörter, verschleierte Schlüssel) aus dem Log halten.
maskieren() {
  if [[ -n "${GITHUB_ACTIONS:-}" && -n "${1:-}" ]]; then printf '::add-mask::%s\n' "$1"; fi
}

# Bricht ab, wenn eine der genannten Variablen leer ist (nennt nur die Namen).
benoetigt() {
  local fehlend=() name
  for name in "$@"; do
    [[ -n "${!name:-}" ]] || fehlend+=("$name")
  done
  if ((${#fehlend[@]} > 0)); then
    fehler "Nicht gesetzt: ${fehlend[*]} (Environment sicherung, docs/SUPABASE.md)."
  fi
}

# Datum der Sicherung: deutsche Zeit, wie die Lebenszeichen-Prüfung in frisch.sh.
heute() { TZ=Europe/Berlin date +%F; }

pg() {
  local werkzeug=$1
  shift
  "$PG_BIN/$werkzeug" "$@"
}

# psql ohne Begrüßung und Ausrichtung; bricht beim ersten Fehler ab.
sql() { pg psql --no-psqlrc --quiet --tuples-only --no-align --set ON_ERROR_STOP=1 "$@"; }

# Supabase als sm24_sicherung über den Session-Pooler (Port 5432), TLS mit
# Zertifikatsprüfung gegen das CA-Zertifikat aus werkzeuge.sh. Die Rolle ist
# nur lesend (default_transaction_read_only); Schreiben nur mit BEGIN READ WRITE.
supabase_verbindung() {
  benoetigt SB_POOLER_HOST SICHERUNG_DB_PASSWORT
  [[ -n "${SB_BENUTZER:-}" ]] || benoetigt SB_PROJEKT_REF
  export PGHOST="$SB_POOLER_HOST"
  export PGPORT="${SB_PORT:-5432}"
  export PGDATABASE="${SB_DATENBANK:-postgres}"
  export PGUSER="${SB_BENUTZER:-sm24_sicherung.${SB_PROJEKT_REF:-}}"
  export PGPASSWORD="$SICHERUNG_DB_PASSWORT"
  export PGSSLMODE="${SB_SSLMODE:-verify-full}"
  export PGAPPNAME=sm24-sicherung
  export PGCONNECT_TIMEOUT=30
  if [[ "$PGSSLMODE" == verify-* ]]; then
    export PGSSLROOTCERT="$ARBEIT/supabase-ca.crt"
    [[ -s "$PGSSLROOTCERT" ]] || fehler "CA-Zertifikat fehlt (Variable SB_CA_CERT, siehe werkzeuge.sh)."
  fi
}

# R2 (Cloudflare, S3-kompatibel) als rclone-Remote „ziel:“ – nur über
# Umgebungsvariablen, nie in einer Konfigurationsdatei mit Inhalt.
ziel_einrichten() {
  export RCLONE_CONFIG="$ARBEIT/rclone.conf"
  : >"$RCLONE_CONFIG"
  if [[ -n "${ZIEL_LOKAL:-}" ]]; then
    export RCLONE_CONFIG_ZIEL_TYPE=alias RCLONE_CONFIG_ZIEL_REMOTE="$ZIEL_LOKAL"
    return 0
  fi
  benoetigt ZIEL_S3_ENDPOINT ZIEL_S3_ZUGANG ZIEL_S3_GEHEIMNIS
  export RCLONE_CONFIG_ZIEL_TYPE=s3
  export RCLONE_CONFIG_ZIEL_PROVIDER=Cloudflare
  export RCLONE_CONFIG_ZIEL_ENDPOINT="$ZIEL_S3_ENDPOINT"
  export RCLONE_CONFIG_ZIEL_REGION=auto
  export RCLONE_CONFIG_ZIEL_ACCESS_KEY_ID="$ZIEL_S3_ZUGANG"
  export RCLONE_CONFIG_ZIEL_SECRET_ACCESS_KEY="$ZIEL_S3_GEHEIMNIS"
  # Der R2-Token darf nur Objekte lesen und schreiben, keine Buckets anlegen.
  export RCLONE_CONFIG_ZIEL_NO_CHECK_BUCKET=true
}

# rclone mit Protokoll in $LOGS/rclone-<name>.log statt auf der Konsole.
r2() {
  local name=$1
  shift
  rclone --log-file "$LOGS/rclone-$name.log" --log-level INFO --stats 0 "$@"
}

# Gibt es mindestens einen öffentlichen Schlüssel für age?
empfaenger_vorhanden() {
  grep -Eq '^[[:space:]]*(age1[02-9ac-hj-np-z]{58}|ssh-ed25519 |ssh-rsa )' "$EMPFAENGER" 2>/dev/null
}
