import * as migration_20260924_001201_initial from './20260924_001201_initial';
import * as migration_20260924_004222_datenmodell from './20260924_004222_datenmodell';
import * as migration_20260924_042804_auftraege_und_nachweise from './20260924_042804_auftraege_und_nachweise';
import * as migration_20260924_042900_sm24_tabellen from './20260924_042900_sm24_tabellen';
import * as migration_20261024_213449_livegang from './20261024_213449_livegang';
import * as migration_20261025_132045_leitfaden from './20261025_132045_leitfaden';
import * as migration_20261025_132935_leitfaden_daten from './20261025_132935_leitfaden_daten';

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
    name: '20261025_132935_leitfaden_daten'
  },
];
