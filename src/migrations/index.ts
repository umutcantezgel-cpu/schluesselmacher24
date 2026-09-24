import * as migration_20260924_001201_initial from './20260924_001201_initial';
import * as migration_20260924_004222_datenmodell from './20260924_004222_datenmodell';
import * as migration_20260924_042804_auftraege_und_nachweise from './20260924_042804_auftraege_und_nachweise';
import * as migration_20260924_042900_sm24_tabellen from './20260924_042900_sm24_tabellen';

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
    name: '20260924_042804_auftraege_und_nachweise'
  },
  {
    up: migration_20260924_042900_sm24_tabellen.up,
    down: migration_20260924_042900_sm24_tabellen.down,
    name: '20260924_042900_sm24_tabellen',
  },
];
