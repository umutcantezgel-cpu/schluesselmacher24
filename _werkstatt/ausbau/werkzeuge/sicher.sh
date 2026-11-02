#!/usr/bin/env bash
# =============================================================================
# Datenweiche des Ausbaulaufs (Auftrag 8.4)
#
#   sicher.sh [--json | --pg] [--als-root] [--trocken] -- <befehl> [argumente…]
#   --trocken: Postgres nicht starten (nur für den Selbsttest der Umgebung)
#
# Jeder Projektbefehl (dev, build, test, seed, migrate, payload, Projektskripte)
# läuft nur hierüber. Das Skript
#   1. setzt jede Variable, die auf Datenbank, Supabase, Ablage, Stripe, Resend,
#      Analyse, Crons oder Vercel zeigen kann, ausdrücklich auf lokale Werte oder
#      leere Platzhalter, auch gegenüber Werten aus .env-Dateien (Next und die
#      Payload-CLI überschreiben gesetzte Variablen nicht, auch keine leeren),
#   2. leert zusätzlich jede Variable, die in einer .env-Datei der Wurzel steht,
#   3. nutzt den JSON-Modus (--json, Standard) oder das eingebettete Postgres
#      auf 127.0.0.1 (--pg),
#   4. bricht ab, wenn danach irgendwo ein Datenbank- oder Ablage-Host außerhalb
#      von localhost übrig bleibt,
#   5. schreibt jede Ausführung nach protokolle/datenweiche.log.
#
# Als root: initdb lehnt root ab, und gemischte Besitzer in .next brechen Builds.
# Darum führt sicher.sh jeden Befehl als Nutzer ubuntu aus (runuser), außer mit
# --als-root, und macht den Arbeitsbaum einmalig für ubuntu beschreibbar
# (chmod a+rwX ohne .git; Git erfasst davon nichts). Mit --pg startet es ein
# eigenes Postgres als ubuntu (Port 5433, Daten unter /home/ubuntu/sm24-pg).
# db.mjs hält DATABASE_URL dann für extern (SM24_PG_PORT=5499) und startet kein
# zweites.
#
# Umgebungsvariablen nur für dieses Skript:
#   SICHER_WURZEL   Wurzelordner (Standard: Repository), für den Selbsttest
#   SICHER_PORT     Port der Seite (Standard 3000)
#   SICHER_NUTZER   Nutzer für --pg als root (Standard ubuntu)
# =============================================================================
set -euo pipefail

HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUSBAU="$(cd "$HIER/.." && pwd)"
WURZEL="${SICHER_WURZEL:-$(cd "$AUSBAU/../.." && pwd)}"
PROTOKOLL="$AUSBAU/protokolle/datenweiche.log"
MODUS=json
ALS_ROOT=0
TROCKEN=0
NUTZER="${SICHER_NUTZER:-ubuntu}"
SEITEN_PORT="${SICHER_PORT:-3000}"
PG_PORT=5433
PG_DIR="/home/${NUTZER}/sm24-pg/daten"
PG_BIN="$WURZEL/node_modules/@embedded-postgres/linux-x64/native/bin"

while [ $# -gt 0 ]; do
  case "$1" in
    --json) MODUS=json; shift ;;
    --pg) MODUS=pg; shift ;;
    --als-root) ALS_ROOT=1; shift ;;
    --trocken) TROCKEN=1; shift ;;
    --) shift; break ;;
    -h|--help) sed -n '2,30p' "$0"; exit 0 ;;
    *) break ;;
  esac
done
if [ $# -eq 0 ]; then
  echo "sicher.sh: kein Befehl. Aufruf: sicher.sh [--json|--pg] -- <befehl>" >&2
  exit 2
fi

fehler() { echo "DATENWEICHE ABBRUCH: $*" >&2; mkdir -p "$(dirname "$PROTOKOLL")"; printf '%s\tABBRUCH\t%s\t%s\n' "$(date -Iseconds)" "$MODUS" "$*" >>"$PROTOKOLL"; exit 3; }

# --- 1. Alles, was nach außen zeigen kann, leeren -----------------------------
LEEREN=(
  # Datenbank (eigene Namen, Vercel-, Supabase- und Neon-Integrationen, libpq)
  DATABASE_URL DATABASE_URL_UNPOOLED DATABASE_CA_CERT DIRECT_URL
  POSTGRES_URL POSTGRES_URL_NON_POOLING POSTGRES_PRISMA_URL POSTGRES_URL_NO_SSL
  POSTGRES_HOST POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DATABASE
  SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY SUPABASE_JWT_SECRET SUPABASE_SECRET_KEY
  NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  # Ablage
  STORAGE_ENDPOINT STORAGE_REGION STORAGE_BUCKET STORAGE_ACCESS_KEY STORAGE_SECRET_KEY
  AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_REGION AWS_DEFAULT_REGION AWS_ENDPOINT_URL AWS_PROFILE
  BLOB_READ_WRITE_TOKEN S3_ENDPOINT S3_BUCKET S3_ACCESS_KEY S3_SECRET_KEY
  # Zahlung
  PAYMENT_PROVIDER PAYMENT_API_KEY PAYMENT_WEBHOOK_SECRET PAYMENT_METHODS PAYMENT_INVOICES
  STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY STRIPE_API_KEY
  # Mail
  MAIL_PROVIDER MAIL_API_KEY MAIL_FROM_ADDRESS MAIL_FROM_NAME MAIL_REPLY_TO MAIL_TEAM_ADDRESS MAIL_REDIRECT_TO
  RESEND_API_KEY SMTP_HOST SMTP_USER SMTP_PASS SMTP_PASSWORD SMTP_PORT
  # Versand (künftiger Adapter)
  VERSAND_PROVIDER VERSAND_API_KEY VERSAND_API_SECRET VERSAND_KUNDENNUMMER DHL_API_KEY DHL_API_SECRET DHL_USER DHL_PASSWORD
  # Analyse und Suchmaschinen
  NEXT_PUBLIC_GA_MEASUREMENT_ID GOOGLE_SITE_VERIFICATION INDEXNOW_KEY BING_SITE_VERIFICATION
  # Crons und Vercel
  CRON_SECRET VERCEL VERCEL_ENV VERCEL_URL VERCEL_BRANCH_URL VERCEL_PROJECT_PRODUCTION_URL
  VERCEL_GIT_COMMIT_REF VERCEL_OIDC_TOKEN VERCEL_TOKEN
  # Sonstiges der Seite
  NEXT_PUBLIC_SERVER_URL SM24_PREVIEW_MIGRATE SM24_READONLY_CONTENT SICHERUNG_ZIEL
)
for name in "${LEEREN[@]}"; do export "$name="; done
# libpq-Variablen nicht leeren (ein leeres PGPORT bricht initdb und postgres ab),
# sondern auf das lokale Postgres setzen bzw. entfernen.
export PGHOST=127.0.0.1 PGPORT=5433 PGUSER=postgres PGPASSWORD=postgres PGDATABASE=schluesselmacher24 PGSSLMODE=disable
unset PGHOSTADDR PGSERVICE PGPASSFILE PGSSLROOTCERT PGSSLCERT PGSSLKEY

# --- 2. Jede Variable aus .env-Dateien der Wurzel leeren ----------------------
ENV_HINWEIS=""
shopt -s nullglob
for datei in "$WURZEL"/.env "$WURZEL"/.env.*; do
  case "$(basename "$datei")" in .env.example) continue ;; esac
  [ -f "$datei" ] || continue
  while IFS= read -r zeile; do
    zeile="${zeile#export }"
    name="${zeile%%=*}"
    name="${name//[[:space:]]/}"
    [[ "$name" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || continue
    case "$name" in NODE_ENV|PATH|HOME|PGHOST|PGPORT|PGUSER|PGPASSWORD|PGDATABASE|PGSSLMODE) continue ;; esac
    export "$name="
    ENV_HINWEIS="$ENV_HINWEIS $name"
  done < <(grep -E '^[[:space:]]*(export[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=' "$datei" || true)
done
shopt -u nullglob

# --- 3. Lokale Werte ----------------------------------------------------------
export NEXT_TELEMETRY_DISABLED=1
export SM24_STORAGE=lokal
export NEXT_PUBLIC_SITE_URL="http://localhost:${SEITEN_PORT}"
export PAYLOAD_SECRET="nur-lokal-datenweiche-0123456789abcdef"
# Erfundene Testzugänge für den Admin (Probelauf Z-19); nie echte Daten.
export SEED_ADMIN_EMAIL="inhaber@beispiel.test"
export SEED_ADMIN_PASSWORD="nur-lokal-Test-2026"
export SM24_TEST_PG_PORT=5434

if [ "$MODUS" = json ]; then
  export SM24_DATA=json
else
  export SM24_DATA=
  export DATABASE_URL="postgres://postgres:postgres@127.0.0.1:${PG_PORT}/schluesselmacher24"
  export DATABASE_URL_UNPOOLED="$DATABASE_URL"
  # db.mjs hält DATABASE_URL damit für extern und startet kein eigenes Postgres
  # (initdb lehnt root ab); sicher.sh stellt die Instanz selbst bereit.
  export SM24_PG_PORT=5499
fi

# --- 4. Prüfung: kein Host außerhalb von localhost ----------------------------
lokal_host() {
  case "$1" in ''|localhost|127.0.0.1|::1|'[::1]'|0.0.0.0) return 0 ;; *) return 1 ;; esac
}
host_aus_url() {
  # schema://[nutzer[:pw]@]host[:port]/… → host
  local rest="${1#*://}"
  rest="${rest%%/*}"
  rest="${rest%%\?*}"
  rest="${rest##*@}"
  if [[ "$rest" == \[* ]]; then rest="${rest%%]*}]"; else rest="${rest%%:*}"; fi
  printf '%s' "$rest"
}
while IFS='=' read -r name wert; do
  [ -n "$wert" ] || continue
  # Datenbank-URLs in jeder Variable
  if [[ "$wert" =~ ^(postgres|postgresql|mysql|mongodb|redis|rediss)(\+[a-z]+)?:// ]]; then
    h="$(host_aus_url "$wert")"
    lokal_host "$h" || fehler "$name zeigt auf Datenbank-Host $h"
  fi
  # Bekannte Fremddienste in jeder Variable (Ablage, Datenbank, Zahlung, Mail)
  if [[ "$wert" =~ (supabase\.co|supabase\.com|pooler\.supabase|amazonaws\.com|r2\.cloudflarestorage\.com|neon\.tech|blob\.vercel-storage\.com|api\.stripe\.com|api\.resend\.com) ]]; then
    fehler "$name enthält die Adresse eines Fremddienstes (${BASH_REMATCH[1]})"
  fi
  # Schlüssel von Stripe und Resend in jeder Variable
  if [[ "$wert" =~ ^(sk_live_|sk_test_|rk_live_|rk_test_|whsec_|re_[A-Za-z0-9]{8}) ]]; then
    fehler "$name enthält einen Zahlungs- oder Mailschlüssel"
  fi
done < <(env)
for name in DATABASE_URL DATABASE_URL_UNPOOLED POSTGRES_URL POSTGRES_URL_NON_POOLING; do
  wert="${!name:-}"
  [ -z "$wert" ] && continue
  h="$(host_aus_url "$wert")"
  lokal_host "$h" || fehler "$name zeigt auf $h"
done
for name in STORAGE_ENDPOINT PGHOST POSTGRES_HOST; do
  wert="${!name:-}"
  [ -z "$wert" ] && continue
  h="$wert"; [[ "$wert" == *://* ]] && h="$(host_aus_url "$wert")"
  lokal_host "$h" || fehler "$name zeigt auf $h"
done

# --- 5. Postgres bereitstellen (--pg) ------------------------------------------
pg_ctl_als() {
  if [ "$(id -u)" = 0 ]; then runuser -u "$NUTZER" -- "$PG_BIN/$1" "${@:2}"; else "$PG_BIN/$1" "${@:2}"; fi
}
pg_bereit() {
  [ -x "$PG_BIN/pg_ctl" ] || fehler "Postgres-Binärdateien fehlen ($PG_BIN), zuerst npm ci"
  if [ "$(id -u)" != 0 ]; then PG_DIR="${HOME}/sm24-pg/daten"; fi
  if [ ! -f "$PG_DIR/PG_VERSION" ]; then
    local pw
    pw="$(mktemp)"; printf 'postgres' >"$pw"; chmod 644 "$pw"
    if [ "$(id -u)" = 0 ]; then runuser -u "$NUTZER" -- mkdir -p "$PG_DIR"; else mkdir -p "$PG_DIR"; fi
    pg_ctl_als initdb -D "$PG_DIR" -U postgres --pwfile "$pw" --auth=scram-sha-256 --encoding=UTF8 --no-locale >/dev/null
    rm -f "$pw"
  fi
  if ! pg_ctl_als pg_ctl -D "$PG_DIR" status >/dev/null 2>&1; then
    pg_ctl_als pg_ctl -D "$PG_DIR" -l "$PG_DIR.log" -w \
      -o "-p ${PG_PORT} -c listen_addresses=127.0.0.1 -c unix_socket_directories=" start >/dev/null
  fi
  # Datenbank anlegen, falls sie fehlt (psql aus denselben Binärdateien)
  if [ -x "$PG_BIN/psql" ]; then
    if ! PGPASSWORD=postgres "$PG_BIN/psql" -h 127.0.0.1 -p "$PG_PORT" -U postgres -d postgres -tAc \
      "select 1 from pg_database where datname='schluesselmacher24'" | grep -q 1; then
      PGPASSWORD=postgres "$PG_BIN/psql" -h 127.0.0.1 -p "$PG_PORT" -U postgres -d postgres -c 'create database "schluesselmacher24"' >/dev/null
    fi
  else
    node -e "
      const {Client}=require('$WURZEL/node_modules/pg');
      (async()=>{const c=new Client({host:'127.0.0.1',port:$PG_PORT,user:'postgres',password:'postgres',database:'postgres'});
      await c.connect();const r=await c.query(\"select 1 from pg_database where datname='schluesselmacher24'\");
      if(!r.rowCount) await c.query('create database \"schluesselmacher24\"');await c.end();})().catch(e=>{console.error(e.message);process.exit(1)});"
  fi
}

mkdir -p "$(dirname "$PROTOKOLL")"
ALS="$(id -un)"
if [ "$(id -u)" = 0 ] && [ "$ALS_ROOT" = 0 ]; then
  ALS="$NUTZER"
  # Arbeitsbaum einmalig für den Nutzer beschreibbar machen (nur Rechte, kein Inhalt).
  if ! runuser -u "$NUTZER" -- test -w "$WURZEL"; then
    find "$WURZEL" -path "$WURZEL/.git" -prune -o -exec chmod a+rwX {} + 2>/dev/null || true
  fi
fi
printf '%s\t%s\tals=%s\thosts=localhost\tenv-dateien=%s\t%s\n' \
  "$(date -Iseconds)" "$MODUS" "$ALS" "${ENV_HINWEIS:- keine}" "$*" >>"$PROTOKOLL"
if [ "$MODUS" = pg ] && [ "$TROCKEN" = 0 ]; then
  pg_bereit || fehler "Postgres ließ sich nicht bereitstellen"
fi
# Das CA-Bündel des Proxys liegt unter /root und ist für ubuntu nicht lesbar: Kopie bereitstellen.
if [ "$(id -u)" = 0 ] && [ "$ALS_ROOT" = 0 ] && [ -n "${NODE_EXTRA_CA_CERTS:-}" ] && [ -r "$NODE_EXTRA_CA_CERTS" ]; then
  install -m 644 -o "$NUTZER" "$NODE_EXTRA_CA_CERTS" "/home/$NUTZER/.sm24-ca-bundle.crt" 2>/dev/null && export NODE_EXTRA_CA_CERTS="/home/$NUTZER/.sm24-ca-bundle.crt"
fi
[ -n "$ENV_HINWEIS" ] && echo "Datenweiche: Variablen aus .env-Dateien geleert:$ENV_HINWEIS" >&2

cd "$WURZEL"
if [ "$(id -u)" = 0 ] && [ "$ALS_ROOT" = 0 ]; then
  # Umgebung vollständig an den Nutzer weiterreichen (runuser behält sie ohne -l).
  exec runuser -u "$NUTZER" -- env HOME="/home/$NUTZER" npm_config_cache="/home/$NUTZER/.npm" "$@"
fi
exec "$@"
