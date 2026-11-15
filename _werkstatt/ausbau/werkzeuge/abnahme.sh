#!/usr/bin/env bash
# Abnahmekette nach einem Paket oder einer Welle (FA-Lauf): Typprüfung, Lint, Unit-Tests,
# Datenbanktests, Build ohne Datenbank. Alles über die Datenweiche, nacheinander (wenige Kerne).
#
#   bash _werkstatt/ausbau/werkzeuge/abnahme.sh <kennung> [ohne-db] [ohne-build]
#
# Rohprotokolle nach _werkstatt/ausbau/protokolle/roh/ (nicht committet); die Ausgabe ist die
# Kurzfassung. Rückgabewert 0 nur, wenn jeder Schritt grün ist.
cd "$(dirname "$0")/../../.." || exit 2
kennung="${1:?Kennung fehlt}"
shift
ohne_db=0
ohne_build=0
for arg in "$@"; do
  [ "$arg" = "ohne-db" ] && ohne_db=1
  [ "$arg" = "ohne-build" ] && ohne_build=1
done
weiche=_werkstatt/ausbau/werkzeuge/sicher.sh
roh=_werkstatt/ausbau/protokolle/roh
mkdir -p "$roh"
rot=0
ohne_farbe() { sed 's/\x1b\[[0-9;]*m//g' "$1"; }

schritt() { # name, protokoll, befehl…
  local name="$1" datei="$roh/$kennung-$2.log"
  shift 2
  "$@" >"$datei" 2>&1
  local code=$?
  echo "EXIT $code" >>"$datei"
  if [ "$code" -eq 0 ]; then echo "GRÜN  $name"; else echo "ROT   $name (Protokoll: $datei)"; rot=1; fi
  return "$code"
}

schritt "Typprüfung" typecheck "$weiche" --json -- npm run typecheck || ohne_farbe "$roh/$kennung-typecheck.log" | grep -E "error TS" | head -15
schritt "Lint" lint "$weiche" --json -- npm run lint || ohne_farbe "$roh/$kennung-lint.log" | grep -E "error|✖" | head -15
schritt "Unit-Tests" unit "$weiche" --json -- npx vitest run
ohne_farbe "$roh/$kennung-unit.log" | grep -E "^ FAIL |Test Files|Tests " | sort -u | head -15
if [ "$ohne_db" -eq 0 ]; then
  schritt "Datenbanktests" db "$weiche" --pg -- npx vitest run -c vitest.db.config.ts
  ohne_farbe "$roh/$kennung-db.log" | grep -E "^ FAIL |Test Files|Tests |Error:|error:" | sort -u | head -15
fi
if [ "$ohne_build" -eq 0 ]; then
  # SM24_INDEXIERUNG=an: Der Prüfbuild bildet die Produktion ab (FA-SEO-01C). Ohne den Schalter stünde jede
  # Seite außerhalb von Vercel auf noindex, und die Onpage-Messung sähe nicht, was Suchmaschinen sehen.
  # Der Schalter wirkt beim Build; localhost ist von der noindex-Kopfzeile ausgenommen und von außen nicht erreichbar.
  schritt "Build ohne Datenbank" build env SM24_INDEXIERUNG=an "$weiche" --json -- npm run build
  grep -E "Generating static pages|Failed|Error occurred|Type error" "$roh/$kennung-build.log" | tail -4
fi
if [ "$rot" -eq 0 ]; then echo "ABNAHME $kennung: GRÜN"; else echo "ABNAHME $kennung: ROT"; fi
exit "$rot"
