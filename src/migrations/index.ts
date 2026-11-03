import * as migration_20260924_001201_initial from './20260924_001201_initial';
import * as migration_20260924_004222_datenmodell from './20260924_004222_datenmodell';
import * as migration_20260924_042804_auftraege_und_nachweise from './20260924_042804_auftraege_und_nachweise';
import * as migration_20260924_042900_sm24_tabellen from './20260924_042900_sm24_tabellen';
import * as migration_20261024_213449_livegang from './20261024_213449_livegang';
import * as migration_20261025_132045_leitfaden from './20261025_132045_leitfaden';
import * as migration_20261025_132935_leitfaden_daten from './20261025_132935_leitfaden_daten';
import * as migration_20261103_014640_rubriken from './20261103_014640_rubriken';
import * as migration_20261103_030613_einsenden from './20261103_030613_einsenden';
import * as migration_20261103_031720_fahrzeugreihen from './20261103_031720_fahrzeugreihen';
import * as migration_20261103_032353_nachweise from './20261103_032353_nachweise';
import * as migration_20261103_033531_partnerbetriebe from './20261103_033531_partnerbetriebe';

export const migrations = [
  {
    up: migration_20260924_001201_initial.up,
    down: migration_20260924_001201_initial.down,
    name: '20260924_001201_initial',
  },
  {
    up: migration_20260924_004222_datenmodell.up,
    down: migration_20260924_004222_datenmodell.down,
    name: '20260924_004222_datenmodell',
  },
  {
    up: migration_20260924_042804_auftraege_und_nachweise.up,
    down: migration_20260924_042804_auftraege_und_nachweise.down,
    name: '20260924_042804_auftraege_und_nachweise',
  },
  {
    up: migration_20260924_042900_sm24_tabellen.up,
    down: migration_20260924_042900_sm24_tabellen.down,
    name: '20260924_042900_sm24_tabellen',
  },
  {
    up: migration_20261024_213449_livegang.up,
    down: migration_20261024_213449_livegang.down,
    name: '20261024_213449_livegang',
  },
  {
    up: migration_20261025_132045_leitfaden.up,
    down: migration_20261025_132045_leitfaden.down,
    name: '20261025_132045_leitfaden',
  },
  {
    up: migration_20261025_132935_leitfaden_daten.up,
    down: migration_20261025_132935_leitfaden_daten.down,
    name: '20261025_132935_leitfaden_daten',
  },
  {
    up: migration_20261103_014640_rubriken.up,
    down: migration_20261103_014640_rubriken.down,
    name: '20261103_014640_rubriken',
  },
  {
    up: migration_20261103_030613_einsenden.up,
    down: migration_20261103_030613_einsenden.down,
    name: '20261103_030613_einsenden',
  },
  {
    up: migration_20261103_031720_fahrzeugreihen.up,
    down: migration_20261103_031720_fahrzeugreihen.down,
    name: '20261103_031720_fahrzeugreihen',
  },
  {
    up: migration_20261103_032353_nachweise.up,
    down: migration_20261103_032353_nachweise.down,
    name: '20261103_032353_nachweise',
  },
  {
    up: migration_20261103_033531_partnerbetriebe.up,
    down: migration_20261103_033531_partnerbetriebe.down,
    name: '20261103_033531_partnerbetriebe'
  },
];
