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
import * as migration_20261115_111543_erreichbarkeit from './20261115_111543_erreichbarkeit';
import * as migration_20261115_120000_rubrik_nach_vorlage from './20261115_120000_rubrik_nach_vorlage';
import * as migration_20261115_130000_musterdaten_beispiel from './20261115_130000_musterdaten_beispiel';
import * as migration_20261115_140000_fahrzeugklasse from './20261115_140000_fahrzeugklasse';
import * as migration_20261115_165108_steckplaetze from './20261115_165108_steckplaetze';
import * as migration_20261115_182441_rubrik_symbole_fahrzeugklassen from './20261115_182441_rubrik_symbole_fahrzeugklassen';
import * as migration_20261115_191734_auftragsweg from './20261115_191734_auftragsweg';
import * as migration_20261115_200046_vermittlung_auszahlung from './20261115_200046_vermittlung_auszahlung';
import * as migration_20261115_210337_admin_alltag from './20261115_210337_admin_alltag';
import * as migration_20261115_215557_shop_grundlage from './20261115_215557_shop_grundlage';
import * as migration_20261116_021014_zylinder_bestaetigt from './20261116_021014_zylinder_bestaetigt';
import * as migration_20261116_023442_einsende_varianten from './20261116_023442_einsende_varianten';
import * as migration_20261116_033126_einsende_sendung from './20261116_033126_einsende_sendung';
import * as migration_20261116_042326_gehaeuse from './20261116_042326_gehaeuse';

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
    name: '20261103_033531_partnerbetriebe',
  },
  {
    up: migration_20261115_111543_erreichbarkeit.up,
    down: migration_20261115_111543_erreichbarkeit.down,
    name: '20261115_111543_erreichbarkeit',
  },
  {
    up: migration_20261115_120000_rubrik_nach_vorlage.up,
    down: migration_20261115_120000_rubrik_nach_vorlage.down,
    name: '20261115_120000_rubrik_nach_vorlage',
  },
  {
    up: migration_20261115_130000_musterdaten_beispiel.up,
    down: migration_20261115_130000_musterdaten_beispiel.down,
    name: '20261115_130000_musterdaten_beispiel',
  },
  {
    up: migration_20261115_140000_fahrzeugklasse.up,
    down: migration_20261115_140000_fahrzeugklasse.down,
    name: '20261115_140000_fahrzeugklasse',
  },
  {
    up: migration_20261115_165108_steckplaetze.up,
    down: migration_20261115_165108_steckplaetze.down,
    name: '20261115_165108_steckplaetze',
  },
  {
    up: migration_20261115_182441_rubrik_symbole_fahrzeugklassen.up,
    down: migration_20261115_182441_rubrik_symbole_fahrzeugklassen.down,
    name: '20261115_182441_rubrik_symbole_fahrzeugklassen',
  },
  {
    up: migration_20261115_191734_auftragsweg.up,
    down: migration_20261115_191734_auftragsweg.down,
    name: '20261115_191734_auftragsweg',
  },
  {
    up: migration_20261115_200046_vermittlung_auszahlung.up,
    down: migration_20261115_200046_vermittlung_auszahlung.down,
    name: '20261115_200046_vermittlung_auszahlung',
  },
  {
    up: migration_20261115_210337_admin_alltag.up,
    down: migration_20261115_210337_admin_alltag.down,
    name: '20261115_210337_admin_alltag',
  },
  {
    up: migration_20261115_215557_shop_grundlage.up,
    down: migration_20261115_215557_shop_grundlage.down,
    name: '20261115_215557_shop_grundlage',
  },
  {
    up: migration_20261116_021014_zylinder_bestaetigt.up,
    down: migration_20261116_021014_zylinder_bestaetigt.down,
    name: '20261116_021014_zylinder_bestaetigt',
  },
  {
    up: migration_20261116_023442_einsende_varianten.up,
    down: migration_20261116_023442_einsende_varianten.down,
    name: '20261116_023442_einsende_varianten',
  },
  {
    up: migration_20261116_033126_einsende_sendung.up,
    down: migration_20261116_033126_einsende_sendung.down,
    name: '20261116_033126_einsende_sendung',
  },
  {
    up: migration_20261116_042326_gehaeuse.up,
    down: migration_20261116_042326_gehaeuse.down,
    name: '20261116_042326_gehaeuse',
  },
];
