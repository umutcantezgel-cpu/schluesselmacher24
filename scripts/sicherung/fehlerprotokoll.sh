#!/usr/bin/env bash
# Nach einem Fehlschlag: die Protokolle aus $LOGS (können Dateinamen und
# Datenbank-Meldungen mit Kundendaten enthalten) mit age verschlüsseln und
# nach fehler/<datum>/ im Datenbank-Bucket legen. Das öffentliche Log erfährt
# nur, ob das geklappt hat. Bricht nie ab – der Job ist ohnehin rot.
#   fehlerprotokoll.sh <job>
# Entschlüsseln: age -d -i schluessel.txt <datei> | tar -xz
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"
set +e

job="${1:-lauf}"
if [[ -z "$(ls -A "$LOGS" 2>/dev/null)" ]]; then
  meldung "Fehlerprotokoll: keine Protokolle vorhanden."
  exit 0
fi
if ! command -v age >/dev/null || ! command -v rclone >/dev/null || ! empfaenger_vorhanden; then
  meldung "Fehlerprotokoll: nicht gesichert (Werkzeuge oder Empfänger fehlen)."
  exit 0
fi
for name in ZIEL_S3_ENDPOINT ZIEL_S3_ZUGANG ZIEL_S3_GEHEIMNIS; do
  if [[ -z "${ZIEL_LOKAL:-}" && -z "${!name:-}" ]]; then
    meldung "Fehlerprotokoll: nicht gesichert (Zugang zu R2 fehlt)."
    exit 0
  fi
done
ziel_einrichten

archiv="$ARBEIT/fehler-$job.tar.gz.age"
if ! tar -C "$LOGS" -czf - . | age --encrypt --recipients-file "$EMPFAENGER" --output "$archiv"; then
  meldung "Fehlerprotokoll: Verschlüsseln fehlgeschlagen."
  exit 0
fi
objekt="fehler/$(heute)/${GITHUB_RUN_ID:-lokal}-${GITHUB_RUN_ATTEMPT:-1}-$job.tar.gz.age"
# Eigenes Protokoll außerhalb von $LOGS: das Archiv ist schon geschlossen.
if rclone --log-file "$ARBEIT/rclone-fehlerprotokoll.log" --log-level INFO copyto "$archiv" "ziel:$ZIEL_BUCKET_DB/$objekt"; then
  meldung "Fehlerprotokoll: verschlüsselt in R2 unter fehler/ abgelegt (Lauf ${GITHUB_RUN_ID:-lokal})."
else
  meldung "Fehlerprotokoll: Upload nach R2 fehlgeschlagen."
fi
exit 0
