#!/usr/bin/env bash
# Sicherung der Dateiablage (docs/SUPABASE.md, Sicherung): rclone gleicht den
# privaten Bucket von Supabase (S3-Schlüssel „sicherung“) mit einem
# verschlüsselten Remote in R2 ab. Dateinamen und Inhalte sind verschlüsselt
# (rclone crypt), nur die Ordner der Sammlungen (medien/, kundendateien/,
# intern/) bleiben lesbar, damit die Lifecycle-Regel für geloescht/ greift:
#   aktuell/               Stand des Buckets
#   geloescht/<datum>/     was seit dem letzten Lauf gelöscht oder ersetzt
#                          wurde; R2 löscht es nach 31 Tagen – so gelten die
#                          Löschfristen auch für die Sicherung
# MAX_LOESCHUNGEN (Standard 50) bricht bei einer Massenlöschung ab; ein
# bewusster großer Löschlauf geht über einen manuellen Start mit höherem Wert.
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"

benoetigt ZIEL_CRYPT_PASSWORT ZIEL_CRYPT_SALZ
ziel_einrichten
max_loeschungen="${MAX_LOESCHUNGEN:-50}"
[[ "$max_loeschungen" =~ ^[0-9]+$ ]] || fehler "MAX_LOESCHUNGEN ist keine Zahl."

if [[ -n "${QUELLE_LOKAL:-}" ]]; then
  export RCLONE_CONFIG_QUELLE_TYPE=alias RCLONE_CONFIG_QUELLE_REMOTE="$QUELLE_LOKAL"
else
  benoetigt QUELLE_S3_ENDPOINT QUELLE_S3_ZUGANG QUELLE_S3_GEHEIMNIS
  export RCLONE_CONFIG_QUELLE_TYPE=s3
  export RCLONE_CONFIG_QUELLE_PROVIDER=Other
  export RCLONE_CONFIG_QUELLE_ENDPOINT="$QUELLE_S3_ENDPOINT"
  export RCLONE_CONFIG_QUELLE_REGION="${QUELLE_S3_REGION:-eu-central-1}"
  export RCLONE_CONFIG_QUELLE_ACCESS_KEY_ID="$QUELLE_S3_ZUGANG"
  export RCLONE_CONFIG_QUELLE_SECRET_ACCESS_KEY="$QUELLE_S3_GEHEIMNIS"
  export RCLONE_CONFIG_QUELLE_FORCE_PATH_STYLE=true
fi

# rclone erwartet die crypt-Schlüssel „verschleiert“; im Passwortmanager und
# im Environment stehen sie im Klartext (ohne sie ist die Sicherung wertlos).
krypt_passwort="$(printf '%s' "$ZIEL_CRYPT_PASSWORT" | rclone obscure -)" || fehler "Dateien: crypt-Passwort nicht verwendbar."
krypt_salz="$(printf '%s' "$ZIEL_CRYPT_SALZ" | rclone obscure -)" || fehler "Dateien: crypt-Salz nicht verwendbar."
maskieren "$krypt_passwort"
maskieren "$krypt_salz"
export RCLONE_CONFIG_ZIELKRYPT_TYPE=crypt
export RCLONE_CONFIG_ZIELKRYPT_REMOTE="ziel:$ZIEL_BUCKET_DATEIEN"
export RCLONE_CONFIG_ZIELKRYPT_FILENAME_ENCRYPTION=standard
export RCLONE_CONFIG_ZIELKRYPT_DIRECTORY_NAME_ENCRYPTION=false
export RCLONE_CONFIG_ZIELKRYPT_PASSWORD="$krypt_passwort"
export RCLONE_CONFIG_ZIELKRYPT_PASSWORD2="$krypt_salz"

# --update mit --use-server-modtime: Änderungszeit aus der Auflistung, keine
# Einzelabfragen je Objekt; kopiert wird, was fehlt oder an der Quelle neuer ist.
if ! r2 dateien sync "quelle:${QUELLE_BUCKET:-sm24-dateien}" zielkrypt:aktuell \
  --backup-dir "zielkrypt:geloescht/$(heute)" \
  --max-delete "$max_loeschungen" \
  --fast-list \
  --update \
  --use-server-modtime; then
  if grep -q -- '--max-delete' "$LOGS/rclone-dateien.log" 2>/dev/null; then
    fehler "Dateien: mehr als $max_loeschungen Löschungen – abgebrochen (Schutz vor Massenlöschung). Prüfen und bei Absicht den Workflow von Hand mit höherem Wert starten."
  fi
  fehler "Dateien: Abgleich fehlgeschlagen."
fi
meldung "Dateien: OK."
