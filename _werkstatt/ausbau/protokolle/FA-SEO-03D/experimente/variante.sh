#!/usr/bin/env bash
# Baut im Versuchsordner den Stand vor dem Paket plus die Dateien eines Kandidaten.
set -euo pipefail
K="$1"; V=/home/user/sm24-versuch; M=/home/user/sm24-messstand; W=/home/user/schluesselmacher24
rm -rf "$V/src"; cp -a "$M/src" "$V/src"
for f in package.json next.config.ts tailwind.config.ts tsconfig.json postcss.config.mjs; do cp -a "$M/$f" "$V/$f"; done
case "$K" in
  k1) DATEIEN=(src/components/forms/photo-upload.tsx src/components/forms/upload-beispiel.tsx src/components/forms/photo-upload-voll.tsx "src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx") ;;
  k2) DATEIEN=(src/lib/wege/naechste-schritte.ts src/lib/wege/naechste-schritte-listen.ts src/components/konfigurator/schliessplan-planer.tsx "src/app/(site)/service-und-termin/vor-ort/einsatz-formular.tsx" "src/app/(site)/service-und-termin/kontakt/kontakt-formular.tsx" "src/app/(site)/partner-werden/partner-formular.tsx" "src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx" "src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx" "src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx" "src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx" "src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx" "src/app/(site)/beratung/beratung-formular.tsx") ;;
  k3) DATEIEN=(src/lib/pricing.ts src/lib/fahrzeug-vor-ort.ts src/components/autoschluessel/optionen.ts) ;;
  *) echo "unbekannt"; exit 1 ;;
esac
for d in "${DATEIEN[@]}"; do mkdir -p "$V/$(dirname "$d")"; cp "$W/$d" "$V/$d"; done
chown -R ubuntu:ubuntu "$V/src"
diff -rq "$M/src" "$V/src" || true
