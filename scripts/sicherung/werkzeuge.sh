#!/usr/bin/env bash
# Werkzeuge der Sicherung per apt: postgresql-client-17 (aus dem PGDG-Repository
# von postgresql-common, falls das Runner-Image das Paket nicht kennt), age und
# rclone. Legt danach das CA-Zertifikat von Supabase (SB_CA_CERT) für die
# TLS-Prüfung ab. Die Ausgaben von apt landen nur in $LOGS/apt.log.
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"

als_root() {
  if [[ $(id -u) -eq 0 ]]; then "$@"; else sudo "$@"; fi
}

vorhanden() {
  [[ -x "$PG_BIN/pg_dump" && -x "$PG_BIN/pg_restore" && -x "$PG_BIN/psql" ]] \
    && command -v age >/dev/null && command -v rclone >/dev/null
}

if ! vorhanden; then
  export DEBIAN_FRONTEND=noninteractive
  log="$LOGS/apt.log"
  als_root apt-get update -q >>"$log" 2>&1 || fehler "Werkzeuge: apt-get update fehlgeschlagen."
  if ! apt-cache show postgresql-client-17 >/dev/null 2>&1; then
    if ! als_root apt-get install -y -q --no-install-recommends postgresql-common >>"$log" 2>&1 \
      || ! als_root /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y >>"$log" 2>&1; then
      fehler "Werkzeuge: PGDG-Repository für postgresql-client-17 nicht einrichtbar."
    fi
  fi
  als_root apt-get install -y -q --no-install-recommends postgresql-client-17 age rclone >>"$log" 2>&1 \
    || fehler "Werkzeuge: Installation von postgresql-client-17, age oder rclone fehlgeschlagen."
fi
vorhanden || fehler "Werkzeuge: pg_dump 17, age oder rclone fehlen nach der Installation."

pg_version="$(pg pg_dump --version)"
[[ "$pg_version" =~ ^pg_dump\ \(PostgreSQL\)\ (17\.[0-9]+) ]] || fehler "Werkzeuge: pg_dump ist nicht Version 17."
meldung "Werkzeuge: pg_dump ${BASH_REMATCH[1]}, age $(age --version), $(rclone version | head -n 1)."

if [[ -n "${SB_CA_CERT:-}" ]]; then
  # Als Variable mehrzeilig oder mit „\n“ eingetragen – beides geht.
  printf '%s\n' "$SB_CA_CERT" | sed 's/\\n/\n/g' >"$ARBEIT/supabase-ca.crt"
  grep -q -- '-----BEGIN CERTIFICATE-----' "$ARBEIT/supabase-ca.crt" \
    || fehler "SB_CA_CERT ist kein PEM-Zertifikat (Supabase → Database → Settings → Download certificate)."
  meldung "CA-Zertifikat: abgelegt."
fi
