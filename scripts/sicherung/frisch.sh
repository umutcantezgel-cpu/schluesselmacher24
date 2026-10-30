#!/usr/bin/env bash
# Braucht es heute (deutsche Zeit) noch eine Sicherung der Datenbank? Der
# Lauf um 00:41 UTC sichert, der um 12:41 UTC holt nur Verpasstes nach.
# Die Abfrage läuft bei jedem Lauf – sie ist zugleich Datenbank-Aktivität,
# die das Free-Projekt wach hält. Ergebnis: `noetig=true|false` in $GITHUB_OUTPUT.
#   ERZWINGEN=true  sichert auch, wenn es heute schon eine Sicherung gibt.
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"
supabase_verbindung

ausgabe() {
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then printf 'noetig=%s\n' "$1" >>"$GITHUB_OUTPUT"; else meldung "noetig=$1"; fi
}

heute_gesichert="$(
  sql --file=- 2>>"$LOGS/frisch.log" <<'SQL'
SELECT coalesce(bool_or((zuletzt AT TIME ZONE 'Europe/Berlin')::date = (now() AT TIME ZONE 'Europe/Berlin')::date), false)
FROM intern.lebenszeichen
WHERE quelle = 'sicherung-db';
SQL
)" || fehler "Datenbank nicht erreichbar oder intern.lebenszeichen fehlt (Pooler, Passwort, Zertifikat, supabase/sql/0004)."

if [[ "${ERZWINGEN:-false}" == true ]]; then
  meldung "Datenbank: Sicherung von Hand erzwungen."
  ausgabe true
elif [[ "$heute_gesichert" == t ]]; then
  meldung "Datenbank: heute schon gesichert – nichts zu tun."
  ausgabe false
else
  meldung "Datenbank: Sicherung fällig."
  ausgabe true
fi
