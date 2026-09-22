# Architecture Matrix & Audit Report

## Übersicht
- **Routen:** 55
- **Komponenten:** 31
- **Datum:** 2026-09-22T17:29:40.289Z

## Routen-Transformationen

| Route | Ist-Zustand (Wörter) | Soll-Zustand (Wörter) | Geplantes Modul |
|-------|---------------------|----------------------|-----------------|
| `/admin/einstellungen` | 267 | 900 | AdminEinstellungenWidget |
| `/admin/fahrzeugdaten` | 285 | 900 | AdminFahrzeugdatenWidget |
| `/admin/inhalte` | 242 | 900 | AdminInhalteWidget |
| `/admin` | 1571 | 2071 | AdminWidget |
| `/admin/preise` | 238 | 900 | AdminPreiseWidget |
| `/admin/produkte` | 265 | 900 | AdminProdukteWidget |
| `/admin/termine` | 515 | 1015 | AdminTermineWidget |
| `/admin/vorgaenge/[id]` | 1932 | 2432 | AdminVorgaenge[id]Widget |
| `/admin/vorgaenge` | 364 | 900 | AdminVorgaengeWidget |
| `/autoschluessel/anfrage` | 555 | 1055 | AutoschluesselAnfrageWidget |
| `/autoschluessel/fahrzeugoeffnung` | 1091 | 1591 | AutoschluesselFahrzeugoeffnungWidget |
| `/autoschluessel/funkschluessel` | 1057 | 1557 | AutoschluesselFunkschluesselWidget |
| `/autoschluessel/kopieren` | 1110 | 1610 | AutoschluesselKopierenWidget |
| `/autoschluessel/marken/[make]/[model]` | 1433 | 1933 | AutoschluesselMarken[make][model]Widget |
| `/autoschluessel/marken/[make]` | 1281 | 1781 | AutoschluesselMarken[make]Widget |
| `/autoschluessel/marken` | 882 | 1382 | AutoschluesselMarkenWidget |
| `/autoschluessel/nachmachen` | 1154 | 1654 | AutoschluesselNachmachenWidget |
| `/autoschluessel` | 2318 | 2818 | AutoschluesselWidget |
| `/autoschluessel/programmieren` | 1176 | 1676 | AutoschluesselProgrammierenWidget |
| `/autoschluessel/schluesselbart-fraesen` | 1017 | 1517 | AutoschluesselSchluesselbartFraesenWidget |
| `/autoschluessel/smart-key` | 1165 | 1665 | AutoschluesselSmartKeyWidget |
| `/bestellung/[id]` | 1203 | 1703 | Bestellung[id]Widget |
| `/elektronische-zutrittsloesungen/konfigurator` | 419 | 919 | ElektronischeZutrittsloesungenKonfiguratorWidget |
| `/elektronische-zutrittsloesungen` | 2736 | 3236 | ElektronischeZutrittsloesungenWidget |
| `/gleichschliessende-zylinder/konfigurator` | 355 | 900 | GleichschliessendeZylinderKonfiguratorWidget |
| `/gleichschliessende-zylinder` | 2712 | 3212 | GleichschliessendeZylinderWidget |
| `/kasse` | 271 | 900 | KasseWidget |
| `/` | 1646 | 2146 | HomeWidget |
| `/ratgeber/[slug]` | 465 | 965 | Ratgeber[slug]Widget |
| `/ratgeber` | 277 | 900 | RatgeberWidget |
| `/rechtliches/agb` | 490 | 990 | RechtlichesAgbWidget |
| `/rechtliches/cookie-einstellungen` | 246 | 900 | RechtlichesCookieEinstellungenWidget |
| `/rechtliches/datenschutz` | 867 | 1367 | RechtlichesDatenschutzWidget |
| `/rechtliches/impressum` | 300 | 900 | RechtlichesImpressumWidget |
| `/rechtliches/versand-und-zahlung` | 532 | 1032 | RechtlichesVersandUndZahlungWidget |
| `/rechtliches/widerruf` | 434 | 934 | RechtlichesWiderrufWidget |
| `/schliessanlagen/konfigurator` | 425 | 925 | SchliessanlagenKonfiguratorWidget |
| `/schliessanlagen` | 1858 | 2358 | SchliessanlagenWidget |
| `/schluessel-nach-code/[slug]` | 925 | 1425 | SchluesselNachCode[slug]Widget |
| `/schluessel-nach-code` | 552 | 1052 | SchluesselNachCodeWidget |
| `/schluessel-nach-vorlage/anfrage` | 274 | 900 | SchluesselNachVorlageAnfrageWidget |
| `/schluessel-nach-vorlage` | 2064 | 2564 | SchluesselNachVorlageWidget |
| `/service-und-termin/anfrage` | 145 | 900 | ServiceUndTerminAnfrageWidget |
| `/service-und-termin/kontakt` | 622 | 1122 | ServiceUndTerminKontaktWidget |
| `/service-und-termin` | 1912 | 2412 | ServiceUndTerminWidget |
| `/service-und-termin/terminstatus` | 104 | 900 | ServiceUndTerminTerminstatusWidget |
| `/service-und-termin/vor-ort` | 804 | 1304 | ServiceUndTerminVorOrtWidget |
| `/sicherheitstechnik/[slug]` | 798 | 1298 | Sicherheitstechnik[slug]Widget |
| `/sicherheitstechnik` | 1281 | 1781 | SicherheitstechnikWidget |
| `/sicherheitstechnik/sicherheitscheck` | 369 | 900 | SicherheitstechnikSicherheitscheckWidget |
| `/standorte/[city]` | 506 | 1006 | Standorte[city]Widget |
| `/standorte` | 318 | 900 | StandorteWidget |
| `/tuer-und-schliesstechnik/[slug]` | 621 | 1121 | TuerUndSchliesstechnik[slug]Widget |
| `/tuer-und-schliesstechnik` | 2378 | 2878 | TuerUndSchliesstechnikWidget |
| `/warenkorb` | 299 | 900 | WarenkorbWidget |
