import * as migration_20260924_001201_initial from './20260924_001201_initial';
import * as migration_20260924_004222_datenmodell from './20260924_004222_datenmodell';

export const migrations = [
  {
    up: migration_20260924_001201_initial.up,
    down: migration_20260924_001201_initial.down,
    name: '20260924_001201_initial',
  },
  {
    up: migration_20260924_004222_datenmodell.up,
    down: migration_20260924_004222_datenmodell.down,
    name: '20260924_004222_datenmodell'
  },
];
