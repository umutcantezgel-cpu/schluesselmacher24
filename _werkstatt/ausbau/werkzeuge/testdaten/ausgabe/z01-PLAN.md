# Plan des Ausbaulaufs

Stand: 2026-11-02T20:00:00.000Z

Etappe 1/2 · Welle 2 · Pflicht 2/5 · Kür 0/1 · läuft 0 · blockiert 0

## E1 · Testfundament

Tor: Alle Prüfungen grün
Kriterien: Z-01, Z-02, Z-03
Geplante Tage: 2

### Welle 1

| Kennung | Titel | Modell | Klasse | Art | Wirkung | Status | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E1-A-01 | Erster Baustein | opus-5.5 | M | pflicht | 5 | committet | a1b2c3d |
| E1-B-02 | Zweiter Baustein | haiku-5.5 | S | pflicht | 4 | committet | b2c3d4e |

### Welle 2

| Kennung | Titel | Modell | Klasse | Art | Wirkung | Status | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E1-C-03 | Dritter Baustein | haiku-5.5 | S | pflicht | 3 | offen |  |
| E1-D-04 | Vierter Baustein | haiku-5.5 | S | pflicht | 4 | offen |  |

## E2 · Testausbau

Tor: Probelauf bestanden
Kriterien: Z-17, Z-18, Z-19
Geplante Tage: 1.5

### Welle 1

| Kennung | Titel | Modell | Klasse | Art | Wirkung | Status | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2-E-05 | Fünfter Baustein | opus-5.5 | L | pflicht | 5 | bereit |  |
| E2-F-06 | Sechster Baustein | haiku-5.5 | S | kuer | 2 | offen |  |

## Kritischer Pfad

E1-A-01 → E1-B-02 → E1-C-03 → E2-E-05

## Vorrat

E2-F-06
