#!/usr/bin/env bash
# Verschlüsselt den geprüften Abzug mit age an die öffentlichen Schlüssel in
# supabase/sicherung/empfaenger.txt (CI kann nur verschlüsseln, nie
# entschlüsseln) und legt ihn mit SHA-256 in R2 ab:
#   taeglich/<datum>/      jede Sicherung
#   woechentlich/<datum>/  zusätzlich sonntags (Kopie im Bucket, ohne neuen Upload)
#   monatlich/<datum>/     zusätzlich am Monatsersten
# Aufbewahrung und Löschsperre regeln Lifecycle-Regeln und Bucket-Lock in R2
# (docs/SUPABASE.md). Der Klartext wird gleich nach dem Verschlüsseln gelöscht.
source "$(dirname "${BASH_SOURCE[0]}")/gemeinsam.sh"

DUMP="$ARBEIT/datenbank.dump"
[[ -s "$DUMP" ]] || fehler "Hochladen: kein geprüfter Abzug vorhanden."
empfaenger_vorhanden || fehler "Hochladen: supabase/sicherung/empfaenger.txt enthält keinen öffentlichen age-Schlüssel."
ziel_einrichten

datum="$(heute)"
name="sm24-datenbank-$(date -u +%Y%m%dT%H%M%SZ).dump.age"
verschluesselt="$ARBEIT/$name"

age --encrypt --recipients-file "$EMPFAENGER" --output "$verschluesselt" "$DUMP" 2>>"$LOGS/age.log" \
  || fehler "Hochladen: Verschlüsseln fehlgeschlagen."
rm -f "$DUMP"
(cd "$ARBEIT" && sha256sum "$name" >"$name.sha256")

ablegen() {
  local ordner=$1 datei
  for datei in "$name" "$name.sha256"; do
    r2 hochladen copyto "$ARBEIT/$datei" "ziel:$ZIEL_BUCKET_DB/$ordner/$datum/$datei" \
      || fehler "Hochladen: Ablage in $ordner/ fehlgeschlagen."
  done
}
kopieren() {
  local ordner=$1 datei
  for datei in "$name" "$name.sha256"; do
    r2 hochladen copyto "ziel:$ZIEL_BUCKET_DB/taeglich/$datum/$datei" "ziel:$ZIEL_BUCKET_DB/$ordner/$datum/$datei" \
      || fehler "Hochladen: Kopie nach $ordner/ fehlgeschlagen."
  done
}

ablegen taeglich
if [[ "$(TZ=Europe/Berlin date +%u)" == 7 ]]; then kopieren woechentlich; fi
if [[ "$(TZ=Europe/Berlin date +%d)" == 01 ]]; then kopieren monatlich; fi
rm -f "$verschluesselt" "$verschluesselt.sha256"
meldung "Hochladen: verschlüsselt in R2 abgelegt ($datum)."
