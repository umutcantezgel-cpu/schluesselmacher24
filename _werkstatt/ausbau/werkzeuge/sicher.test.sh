#!/usr/bin/env bash
# Selbsttest der Datenweiche: sicher.test.sh  (Exit 0 = alle Fälle bestanden)
set -uo pipefail
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
S="$HIER/sicher.sh"
FEHLER=0
pruef() { # name erwarteter_exit erwartete_ausgabe(leer = egal) -- befehl…
  local name="$1" soll="$2" muster="$3"; shift 3
  local aus code
  aus="$("$@" 2>&1)"; code=$?
  if [ "$code" != "$soll" ] || { [ -n "$muster" ] && ! grep -qF -- "$muster" <<<"$aus"; }; then
    echo "FEHLER  $name (Exit $code, erwartet $soll): $aus"; FEHLER=1
  else
    echo "ok      $name"
  fi
}
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Gefälschte Produktionsadresse in einer unbekannten Variable: Abbruch
pruef "fremde Datenbankadresse bricht ab" 3 "DATENWEICHE ABBRUCH" \
  env FREMD_DB='postgresql://nutzer:pw@db.gefaelscht-produktion.supabase.co:5432/postgres' "$S" --json --als-root -- true
# 2. Gefälschte Produktionsadresse mit Port des Poolers, beliebiger Host: Abbruch
pruef "fremder Postgres-Host bricht ab" 3 "Datenbank-Host" \
  env ALT_URL='postgres://u:p@prod.beispiel-firma.de:6543/x' "$S" --json --als-root -- true
# 3. Ablage-Adresse eines Fremddienstes: Abbruch
pruef "fremde Ablage bricht ab" 3 "Fremddienstes" \
  env MEIN_BUCKET='https://abc.r2.cloudflarestorage.com/sm24' "$S" --json --als-root -- true
# 4. Zahlungsschlüssel in einer unbekannten Variable: Abbruch
pruef "Stripe-Schlüssel bricht ab" 3 "Zahlungs- oder Mailschlüssel" \
  env IRGENDWAS='sk_live_gefaelscht123' "$S" --json --als-root -- true
# 5. Produktionswerte in bekannten Variablen werden überschrieben, nicht durchgereicht
pruef "DATABASE_URL aus der Shell wird geleert" 0 "[]" \
  env DATABASE_URL='postgres://u:p@db.gefaelscht.supabase.co:5432/x' STORAGE_BUCKET=echt PAYMENT_API_KEY=sk_test_x \
  "$S" --json --als-root -- sh -c 'echo "[$DATABASE_URL$STORAGE_BUCKET$PAYMENT_API_KEY]"'
# 6. .env-Dateien: jede dort genannte Variable wird geleert
mkdir -p "$TMP/wurzel"
printf 'DATABASE_URL=postgres://u:p@db.gefaelscht.supabase.co:5432/x\nGEHEIM_NEU=abc\nexport NOCH_EINS=1\n' >"$TMP/wurzel/.env.local"
pruef ".env.local wird neutralisiert" 0 "[|||]" \
  env SICHER_WURZEL="$TMP/wurzel" "$S" --json --als-root -- sh -c 'echo "[$DATABASE_URL|$GEHEIM_NEU|$NOCH_EINS|]"'
# 7. JSON-Modus setzt SM24_DATA=json und lokale Ablage
pruef "JSON-Modus" 0 "json lokal http://localhost:3000" \
  "$S" --json --als-root -- sh -c 'echo "$SM24_DATA $SM24_STORAGE $NEXT_PUBLIC_SITE_URL"'
# 8. Postgres-Modus zeigt nur auf 127.0.0.1
pruef "Postgres-Modus nur localhost" 0 "postgres://postgres:postgres@127.0.0.1:5433/schluesselmacher24" \
  "$S" --pg --als-root --trocken -- sh -c 'echo "$DATABASE_URL"'
# 9. Ohne Befehl: Bedienfehler
pruef "ohne Befehl" 2 "" "$S" --json

[ "$FEHLER" = 0 ] && echo "DATENWEICHE: alle Fälle bestanden" || echo "DATENWEICHE: FEHLER"
exit "$FEHLER"
