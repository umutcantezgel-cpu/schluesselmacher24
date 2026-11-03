import { createElement, type ComponentType } from 'react';

import type { IconProps } from './icons/icon-base';
import { IconAlarmtechnik } from './icons/alarmtechnik';
import { IconAnzahlung } from './icons/anzahlung';
import { IconAussenhautsicherung } from './icons/aussenhautsicherung';
import { IconAutoschluessel } from './icons/autoschluessel';
import { IconBeratungTelefon } from './icons/beratung-telefon';
import { IconDatenschutz } from './icons/datenschutz';
import { IconEinsteckschloss } from './icons/einsteckschloss';
import { IconElektronischeZutrittsloesungen } from './icons/elektronische-zutrittsloesungen';
import { IconFahrzeugmarke } from './icons/fahrzeugmarke';
import { IconFahrzeugoeffnung } from './icons/fahrzeugoeffnung';
import { IconFotoHochladen } from './icons/foto-hochladen';
import { IconFunkschluessel } from './icons/funkschluessel';
import { IconGleichschliessendeZylinder } from './icons/gleichschliessende-zylinder';
import { IconHalbzylinder } from './icons/halbzylinder';
import { IconKarte } from './icons/karte';
import { IconKlappschluessel } from './icons/klappschluessel';
import { IconKnaufzylinder } from './icons/knaufzylinder';
import { IconKombinierteKonzepte } from './icons/kombinierte-konzepte';
import { IconLieferung } from './icons/lieferung';
import { IconMechanischerSchutz } from './icons/mechanischer-schutz';
import { IconMehrfachverriegelung } from './icons/mehrfachverriegelung';
import { IconMontage } from './icons/montage';
import { IconMotorradschluessel } from './icons/motorradschluessel';
import { IconNachweis } from './icons/nachweis';
import { IconPanikAlarmtaster } from './icons/panik-alarmtaster';
import { IconPanikFluchttuer } from './icons/panik-fluchttuer';
import { IconProfilzylinder } from './icons/profilzylinder';
import { IconPruefung } from './icons/pruefung';
import { IconReparaturAustausch } from './icons/reparatur-austausch';
import { IconRueckgabe } from './icons/rueckgabe';
import { IconSchliessanlagen } from './icons/schliessanlagen';
import { IconSchluesselKopieren } from './icons/schluessel-kopieren';
import { IconSchluesselNachCode } from './icons/schluessel-nach-code';
import { IconSchluesselNachVorlage } from './icons/schluessel-nach-vorlage';
import { IconSchluesselProgrammieren } from './icons/schluessel-programmieren';
import { IconSchluesselbartFraesen } from './icons/schluesselbart-fraesen';
import { IconSchluesselfinder } from './icons/schluesselfinder';
import { IconSchluesselgehaeuse } from './icons/schluesselgehaeuse';
import { IconSchutzbeschlag } from './icons/schutzbeschlag';
import { IconServiceUndTermin } from './icons/service-und-termin';
import { IconSicherheitscheck } from './icons/sicherheitscheck';
import { IconSicherheitstechnik } from './icons/sicherheitstechnik';
import { IconSicherungskarte } from './icons/sicherungskarte';
import { IconSmartKey } from './icons/smart-key';
import { IconSmarteFunktionen } from './icons/smarte-funktionen';
import { IconStandort } from './icons/standort';
import { IconTechnischeBeratung } from './icons/technische-beratung';
import { IconTermin } from './icons/termin';
import { IconTransponderKopie } from './icons/transponder-kopie';
import { IconTransponder } from './icons/transponder';
import { IconTuerUndSchliesstechnik } from './icons/tuer-und-schliesstechnik';
import { IconTuerschliesser } from './icons/tuerschliesser';
import { IconTuerzusatzschloss } from './icons/tuerzusatzschloss';
import { IconVersandPaket } from './icons/versand-paket';
import { IconVideo } from './icons/video';
import { IconVideoueberwachung } from './icons/videoueberwachung';
import { IconVorOrt } from './icons/vor-ort';
import { IconWarenkorb } from './icons/warenkorb';
import { IconWerkstatt } from './icons/werkstatt';
import { IconZahlung } from './icons/zahlung';
import { IconZylinderMass } from './icons/zylinder-mass';

/**
 * Registry aller Fach-Icons (K-008, eine Familie über `IconBase`): Name der Datei in `icons/` → Komponente.
 * Rubriken, Hub, Navigation und Rubrikköpfe wählen ihr Icon über den Namen aus den Daten
 * (`Rubrik.icon`, G-11). Erzeugt aus den Dateien in `icons/`; ein Test hält Ordner,
 * Registry und `RUBRIK_ICONS` gleich. Die Datei liegt bewusst neben dem Ordner, der nur Icons enthält.
 */
export const FACH_ICON_REGISTRY = {
  'alarmtechnik': IconAlarmtechnik,
  'anzahlung': IconAnzahlung,
  'aussenhautsicherung': IconAussenhautsicherung,
  'autoschluessel': IconAutoschluessel,
  'beratung-telefon': IconBeratungTelefon,
  'datenschutz': IconDatenschutz,
  'einsteckschloss': IconEinsteckschloss,
  'elektronische-zutrittsloesungen': IconElektronischeZutrittsloesungen,
  'fahrzeugmarke': IconFahrzeugmarke,
  'fahrzeugoeffnung': IconFahrzeugoeffnung,
  'foto-hochladen': IconFotoHochladen,
  'funkschluessel': IconFunkschluessel,
  'gleichschliessende-zylinder': IconGleichschliessendeZylinder,
  'halbzylinder': IconHalbzylinder,
  'karte': IconKarte,
  'klappschluessel': IconKlappschluessel,
  'knaufzylinder': IconKnaufzylinder,
  'kombinierte-konzepte': IconKombinierteKonzepte,
  'lieferung': IconLieferung,
  'mechanischer-schutz': IconMechanischerSchutz,
  'mehrfachverriegelung': IconMehrfachverriegelung,
  'montage': IconMontage,
  'motorradschluessel': IconMotorradschluessel,
  'nachweis': IconNachweis,
  'panik-alarmtaster': IconPanikAlarmtaster,
  'panik-fluchttuer': IconPanikFluchttuer,
  'profilzylinder': IconProfilzylinder,
  'pruefung': IconPruefung,
  'reparatur-austausch': IconReparaturAustausch,
  'rueckgabe': IconRueckgabe,
  'schliessanlagen': IconSchliessanlagen,
  'schluessel-kopieren': IconSchluesselKopieren,
  'schluessel-nach-code': IconSchluesselNachCode,
  'schluessel-nach-vorlage': IconSchluesselNachVorlage,
  'schluessel-programmieren': IconSchluesselProgrammieren,
  'schluesselbart-fraesen': IconSchluesselbartFraesen,
  'schluesselfinder': IconSchluesselfinder,
  'schluesselgehaeuse': IconSchluesselgehaeuse,
  'schutzbeschlag': IconSchutzbeschlag,
  'service-und-termin': IconServiceUndTermin,
  'sicherheitscheck': IconSicherheitscheck,
  'sicherheitstechnik': IconSicherheitstechnik,
  'sicherungskarte': IconSicherungskarte,
  'smart-key': IconSmartKey,
  'smarte-funktionen': IconSmarteFunktionen,
  'standort': IconStandort,
  'technische-beratung': IconTechnischeBeratung,
  'termin': IconTermin,
  'transponder-kopie': IconTransponderKopie,
  'transponder': IconTransponder,
  'tuer-und-schliesstechnik': IconTuerUndSchliesstechnik,
  'tuerschliesser': IconTuerschliesser,
  'tuerzusatzschloss': IconTuerzusatzschloss,
  'versand-paket': IconVersandPaket,
  'video': IconVideo,
  'videoueberwachung': IconVideoueberwachung,
  'vor-ort': IconVorOrt,
  'warenkorb': IconWarenkorb,
  'werkstatt': IconWerkstatt,
  'zahlung': IconZahlung,
  'zylinder-mass': IconZylinderMass,
} satisfies Record<string, ComponentType<IconProps>>;

export type FachIconName = keyof typeof FACH_ICON_REGISTRY;

/** Komponente zum Namen oder `undefined`, wenn es kein Fach-Icon dieses Namens gibt. */
export function fachIconKomponente(name: string | null | undefined): ComponentType<IconProps> | undefined {
  if (!name) return undefined;
  return (FACH_ICON_REGISTRY as Record<string, ComponentType<IconProps>>)[name];
}

/**
 * Fach-Icon zum Namen aus den Daten. Das Nachschlagen geschieht hier und nicht im Aufrufer,
 * damit beim Rendern keine Komponente entsteht (Regel react-hooks/static-components).
 */
export function FachIcon({ name, ...props }: IconProps & { name: string | null | undefined }) {
  const komponente = fachIconKomponente(name);
  return komponente ? createElement(komponente, props) : null;
}
