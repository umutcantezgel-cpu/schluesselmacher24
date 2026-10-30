#!/usr/bin/env bash
# Kreuzprüfung (docs/SUPABASE.md, Überwachung): Die Sicherung prüft das
# Lebenszeichen des täglichen Crons der Website, so wie der Cron die der
# Sicherung prüft. Fehlt es, ist es älter als CRON_GRENZE_STUNDEN (Standard 36)
# oder meldet der letzte Lauf Fehler, schlägt der Job fehl – GitHub mailt.
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"
supabase_verbindung

grenze="${CRON_GRENZE_STUNDEN:-36}"
[[ "$grenze" =~ ^[0-9]+$ ]] || fehler "CRON_GRENZE_STUNDEN ist keine Zahl."

zustand="$(
  sql --set grenze="$grenze" --file=- 2>>"$LOGS/cron.log" <<'SQL'
SELECT CASE
  WHEN l.quelle IS NULL THEN 'fehlt'
  WHEN l.zuletzt < now() - make_interval(hours => :grenze) THEN 'veraltet'
  WHEN coalesce(l.details ->> 'status', '') <> 'ok' THEN 'fehler'
  ELSE 'ok'
END
FROM (SELECT) AS eins
LEFT JOIN intern.lebenszeichen AS l ON l.quelle = 'cron-taeglich';
SQL
)" || fehler "Täglicher Cron: Lebenszeichen nicht lesbar."

case "$zustand" in
  ok) meldung "Täglicher Cron: OK." ;;
  fehlt) fehler "Täglicher Cron: noch kein Lebenszeichen – läuft /api/cron/taeglich auf Vercel (Deploy mit Betriebsprüfung, CRON_SECRET)?" ;;
  veraltet) fehler "Täglicher Cron: seit über $grenze Stunden kein Lauf – Vercel → Cron Jobs und Logs prüfen." ;;
  fehler) fehler "Täglicher Cron: letzter Lauf mit Fehlern – Vercel → Logs von /api/cron/taeglich prüfen." ;;
  *) fehler "Täglicher Cron: unerwartete Antwort." ;;
esac
