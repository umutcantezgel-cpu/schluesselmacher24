import * as migration_20260924_001201_initial from './20260924_001201_initial';

export const migrations = [
  {
    up: migration_20260924_001201_initial.up,
    down: migration_20260924_001201_initial.down,
    name: '20260924_001201_initial'
  },
];
