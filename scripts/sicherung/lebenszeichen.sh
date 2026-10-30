#!/usr/bin/env bash
# Setzt nach einer erfolgreichen Sicherung das Lebenszeichen in
# intern.lebenszeichen (supabase/sql/0004). Der tägliche Cron der Website
# meldet, wenn es älter als 36 Stunden wird.
#   lebenszeichen.sh sicherung-db | sicherung-dateien
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"

quelle="${1:-}"
case "$quelle" in
  sicherung-db | sicherung-dateien) ;;
  *) fehler "Lebenszeichen: Quelle sicherung-db oder sicherung-dateien angeben." ;;
esac
supabase_verbindung

# sm24_sicherung liest sonst nur (default_transaction_read_only).
sql --set quelle="$quelle" --set lauf="${GITHUB_RUN_ID:-lokal}" --file=- >>"$LOGS/lebenszeichen.log" 2>&1 <<'SQL' \
  || fehler "Lebenszeichen $quelle: nicht gesetzt (Rechte aus supabase/sql/0004?)."
BEGIN READ WRITE;
SELECT intern.lebenszeichen_setzen(:'quelle', jsonb_build_object('lauf', :'lauf'));
COMMIT;
SQL
meldung "Lebenszeichen $quelle: gesetzt."
