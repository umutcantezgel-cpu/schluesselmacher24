#!/usr/bin/env bash
# Abzug der Live-Datenbank als sm24_sicherung (docs/SUPABASE.md, Sicherung):
# 1. Rohgröße der Tabellen gegen SICHERUNG_GRENZE_MB (Standard 200) – jeder
#    Abzug zählt zum Egress-Kontingent der ganzen Supabase-Organisation.
# 2. In einer Transaktion: Snapshot exportieren, Fingerabdruck
#    (supabase/sicherung/fingerabdruck.sql) bilden und pg_dump mit genau
#    diesem Snapshot laufen lassen – Fingerabdruck und Abzug zeigen denselben
#    Stand, auch wenn die Website währenddessen schreibt.
# Ergebnis: $ARBEIT/datenbank.dump und $ARBEIT/fingerabdruck-live.txt.
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"

DUMP="$ARBEIT/datenbank.dump"
STATUS="$ARBEIT/abzug.status"

if [[ "${1:-}" == --im-snapshot ]]; then
  # Aufruf aus der psql-Sitzung unten (\!), solange deren Transaktion offen ist.
  if pg pg_dump \
    --no-password \
    --snapshot="$SICHERUNG_SNAPSHOT" \
    --format=custom \
    --schema=public \
    --no-owner \
    --no-privileges \
    --no-comments \
    --no-publications \
    --no-subscriptions \
    --no-security-labels \
    --no-tablespaces \
    --exclude-table-data=public.sm24_ratenbegrenzung \
    --lock-wait-timeout=120s \
    --file="$DUMP" >>"$LOGS/pg_dump.log" 2>&1; then
    echo ok >"$STATUS"
  else
    echo fehler >"$STATUS"
  fi
  exit 0
fi

# Ohne Empfänger scheiterte erst das Hochladen – dann wäre der Abzug umsonst gelaufen (Egress).
empfaenger_vorhanden || fehler "Abzug: supabase/sicherung/empfaenger.txt enthält keinen öffentlichen age-Schlüssel."
supabase_verbindung
grenze_mb="${SICHERUNG_GRENZE_MB:-200}"
[[ "$grenze_mb" =~ ^[0-9]+$ ]] || fehler "SICHERUNG_GRENZE_MB ist keine Zahl."

rohgroesse="$(
  sql --file=- 2>>"$LOGS/abzug.log" <<'SQL'
SELECT coalesce(sum(pg_table_size(c.oid)), 0)::bigint
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p');
SQL
)" || fehler "Abzug: Datenbank nicht erreichbar."
[[ "$rohgroesse" =~ ^[0-9]+$ ]] || fehler "Abzug: Rohgröße nicht lesbar."
if ((rohgroesse > grenze_mb * 1024 * 1024)); then
  fehler "Abzug: Tabellen größer als ${grenze_mb} MB – abgebrochen, um das Egress-Kontingent zu schützen (docs/SUPABASE.md, Kontingente)."
fi

rm -f "$DUMP" "$STATUS" "$ARBEIT/fingerabdruck-live.txt"
# Ungequotetes Heredoc: bash setzt die Pfade ein, psql-Variablen (:snapshot) bleiben.
# Während pg_dump läuft, wartet diese Sitzung in offener Transaktion; pg_dump
# übernimmt den Snapshot gleich zu Beginn. Maßgeblich ist deshalb $STATUS:
# Ein Fehler vor dem Abzug lässt ihn fehlen, das COMMIT einer nur lesenden
# Transaktion ändert nichts mehr.
sql --file=- >>"$LOGS/abzug.log" 2>&1 <<SQL || :
SET idle_in_transaction_session_timeout = 0;
BEGIN ISOLATION LEVEL REPEATABLE READ, READ ONLY;
SELECT pg_export_snapshot() AS snapshot \gset
\setenv SICHERUNG_SNAPSHOT :snapshot
\o '$ARBEIT/fingerabdruck-live.txt'
\i '$FINGERABDRUCK_SQL'
\o
\! '$SKRIPTE/abzug.sh' --im-snapshot </dev/null
COMMIT;
SQL

case "$(cat "$STATUS" 2>/dev/null)" in
  ok) ;;
  fehler) fehler "Abzug: pg_dump fehlgeschlagen." ;;
  *) fehler "Abzug: Verbindung, Snapshot oder Fingerabdruck fehlgeschlagen." ;;
esac
[[ -s "$ARBEIT/fingerabdruck-live.txt" ]] || fehler "Abzug: Fingerabdruck leer."
pg pg_restore --list "$DUMP" >"$ARBEIT/inhalt.txt" 2>>"$LOGS/abzug.log" || fehler "Abzug: Datei nicht lesbar."
meldung "Abzug: OK."
