#!/usr/bin/env bash
# GitHub schaltet Zeitpläne in öffentlichen Repos nach 60 Tagen ohne Aktivität
# im Repo ab. Ein Aufruf der Enable-API für den eigenen Workflow gilt als
# Lebenszeichen (Wirkung nicht garantiert; docs/SUPABASE.md, Wachhalten).
# Ein Fehlschlag ist nur eine Warnung – die Sicherung selbst hängt nicht daran.
set -euo pipefail

: "${GITHUB_TOKEN:?}" "${GITHUB_REPOSITORY:?}"
workflow="${WORKFLOW_DATEI:-sicherung.yml}"

# Kopfzeilen über die Standardeingabe, damit das Token nicht in der Prozessliste steht.
status="$(
  printf 'header = "Authorization: Bearer %s"\n' "$GITHUB_TOKEN" \
    | curl --silent --show-error --config - --request PUT --output /dev/null --write-out '%{http_code}' \
      --header 'Accept: application/vnd.github+json' --header 'X-GitHub-Api-Version: 2022-11-28' \
      "${GITHUB_API_URL:-https://api.github.com}/repos/$GITHUB_REPOSITORY/actions/workflows/$workflow/enable"
)" || status="keine Verbindung"

if [[ "$status" == 204 ]]; then
  echo "Wachhalten: Zeitplan von $workflow bestätigt."
else
  echo "::warning::Wachhalten: GitHub antwortet mit $status – Zeitplan unter Actions prüfen."
fi
