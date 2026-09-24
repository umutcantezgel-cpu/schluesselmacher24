import type { ComponentType } from 'react';

import type { AreaKey } from '@/lib/types';

import type { IconProps } from './icons/icon-base';
import { IconAutoschluessel } from './icons/autoschluessel';
import { IconElektronischeZutrittsloesungen } from './icons/elektronische-zutrittsloesungen';
import { IconGleichschliessendeZylinder } from './icons/gleichschliessende-zylinder';
import { IconSchliessanlagen } from './icons/schliessanlagen';
import { IconSchluesselNachCode } from './icons/schluessel-nach-code';
import { IconSchluesselNachVorlage } from './icons/schluessel-nach-vorlage';
import { IconServiceUndTermin } from './icons/service-und-termin';
import { IconSicherheitstechnik } from './icons/sicherheitstechnik';
import { IconTuerUndSchliesstechnik } from './icons/tuer-und-schliesstechnik';

/**
 * Fach-Icon je Leistungsbereich. `Record<AreaKey, …>` sorgt dafür, dass ein
 * neuer Bereich ohne Icon gar nicht erst kompiliert.
 */
export const BEREICH_ICONS: Readonly<Record<AreaKey, ComponentType<IconProps>>> = {
  autoschluessel: IconAutoschluessel,
  'schluessel-nach-vorlage': IconSchluesselNachVorlage,
  'schluessel-nach-code': IconSchluesselNachCode,
  'gleichschliessende-zylinder': IconGleichschliessendeZylinder,
  schliessanlagen: IconSchliessanlagen,
  'elektronische-zutrittsloesungen': IconElektronischeZutrittsloesungen,
  'tuer-und-schliesstechnik': IconTuerUndSchliesstechnik,
  sicherheitstechnik: IconSicherheitstechnik,
  'service-und-termin': IconServiceUndTermin,
};

export interface BereichIconProps extends IconProps {
  area: AreaKey;
}

/**
 * Fach-Icon des Bereichs `area` — für Navigation, Kacheln und Überschriften.
 * Ohne `title` dekorativ, mit `title` als Bild angesagt (wie alle Fach-Icons).
 * Ein unbekannter Bereich (etwa aus fehlerhaften Inhalten) ergibt `null`.
 */
export function BereichIcon({ area, ...props }: BereichIconProps) {
  const Icon = Object.prototype.hasOwnProperty.call(BEREICH_ICONS, area)
    ? BEREICH_ICONS[area]
    : undefined;
  return Icon ? <Icon {...props} /> : null;
}
