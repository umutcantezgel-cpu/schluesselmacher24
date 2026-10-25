import type { CodeLine, Guide, ShippingOption } from '@/lib/types';
import { generatorTexte } from '@/lib/data/defaults/code-lines';
import { formatCents, formatNumber } from '@/lib/format';
import { unitPriceForCodeLine } from '@/lib/pricing';
import {
  anwendungKurz,
  codelinienFamilie,
  codelinienKennung,
  codelinienTitel,
  gepflegt,
} from '@/lib/codelinie';

/* ==========================================================================
   Texte der Produktseiten „Schlüssel nach Code“

   Jede Seite setzt ihre Texte aus den echten Feldern genau dieser Linie
   zusammen: Anwendung, Schlüsseltyp, Kennung, Codeformat mit Beispiel,
   Fundstelle laut Ratgeber, Preis und Staffel, Versandarten, Foto-Upload,
   verwandte Linien derselben Familie. Hersteller, Profil und Codeserie nur,
   wenn sie gepflegt sind. Erfunden wird nichts.

   Vorrang: Ein im Backend gepflegter Text gewinnt immer. Als „nicht
   gepflegt“ gilt ein leeres Feld oder der Startwert des Generators für genau
   diese Linie (`generatorTexte`), verglichen ohne Groß- und Kleinschreibung.
   ========================================================================== */

/** Höchstlänge des Titels ohne den Markenzusatz der Vorlage. */
export const TITEL_MAX = 60;
/** Höchstlänge der Meta-Beschreibung. */
export const BESCHREIBUNG_MAX = 160;

function normal(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

/** Ist der Text (noch) der Startwert des Generators? Leere Texte sind es nicht. */
export function istGeneratorText(text: string | null | undefined, vorlage: string): boolean {
  if (!text?.trim()) return false;
  return normal(text) === normal(vorlage);
}

export interface EigeneTexte {
  beschreibung?: string;
  titel?: string;
  metaBeschreibung?: string;
}

/** Im Backend gepflegte Texte der Linie — alles, was weder leer noch Generator-Text ist. */
export function eigeneTexte(line: CodeLine): EigeneTexte {
  const vorlage = generatorTexte(line);
  const eigen: EigeneTexte = {};
  const beschreibung = line.description.trim();
  if (beschreibung && !istGeneratorText(beschreibung, vorlage.description)) eigen.beschreibung = beschreibung;
  const titel = line.seo.title.trim();
  // Ohne eigenen Titel trägt die Datenschicht den Namen ein — das ist kein gepflegter Titel.
  if (titel && titel !== line.name.trim() && !istGeneratorText(titel, vorlage.seoTitle)) eigen.titel = titel;
  const metaBeschreibung = line.seo.description.trim();
  if (metaBeschreibung && !istGeneratorText(metaBeschreibung, vorlage.seoDescription)) {
    eigen.metaBeschreibung = metaBeschreibung;
  }
  return eigen;
}

/* ---------- Bausteine ---------------------------------------------------- */

/** Pflichtteil plus so viele der optionalen Teile (in Reihenfolge), wie in die Länge passen. */
function bisLaenge(pflicht: string, optional: string[], max: number): string {
  let text = pflicht;
  for (const teil of optional) {
    if (`${text} ${teil}`.length <= max) text = `${text} ${teil}`;
  }
  return text;
}

/** Staffelstufen unterhalb der Höchstmenge, die wirklich günstiger sind. */
export function staffelStufen(line: CodeLine): { minQty: number; priceCents: number }[] {
  return [...(line.bulkPrices ?? [])]
    .filter((stufe) => stufe.minQty > 1 && stufe.minQty <= line.maxQty)
    .sort((a, b) => a.minQty - b.minQty)
    .map((stufe) => ({ minQty: stufe.minQty, priceCents: unitPriceForCodeLine(line, stufe.minQty) }))
    .filter((stufe) => stufe.priceCents < line.priceCents);
}

function staffelText(line: CodeLine): string | undefined {
  const stufen = staffelStufen(line);
  if (!stufen.length) return undefined;
  return stufen.map((s) => `ab ${formatNumber(s.minQty)} Stück ${formatCents(s.priceCents)} je Stück`).join(', ');
}

/** Versandarten, die zur Versandklasse der Linie passen, günstigste zuerst. */
export function versandFuerLinie(line: Pick<CodeLine, 'shippingClass'>, versand: ShippingOption[]): ShippingOption[] {
  return versand
    .filter((option) => option.productClasses.includes(line.shippingClass))
    .sort((a, b) => a.priceCents - b.priceCents);
}

function versandText(optionen: ShippingOption[]): string | undefined {
  if (!optionen.length) return undefined;
  return optionen
    .map((o) => (o.priceCents > 0 ? `${o.label} ${formatCents(o.priceCents)}` : `${o.label} ohne Versandkosten`))
    .join(', ');
}

function saetze(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((satz) => satz.trim())
    .filter(Boolean);
}

function maskiert(wort: string): string {
  return wort.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Fundstelle des Codes aus dem Ratgeber „Wo finde ich den Schlüsselcode?“:
 * der erste Satz, der die Familie oder Anwendung dieser Linie beim Namen
 * nennt (Wortanfang, mindestens fünf Buchstaben) — etwa „Bei Möbel-, Spind-
 * und Briefkastenschlössern steht der Code häufig …“. Nennt der Ratgeber
 * die Art nicht, gibt es keinen Satz; dann gilt allein der Hinweis der Linie.
 */
export function fundstelleAusRatgeber(
  ratgeber: Pick<Guide, 'body'> | null | undefined,
  line: Pick<CodeLine, 'tags' | 'application'>,
): string | undefined {
  if (!ratgeber) return undefined;
  const woerter = [
    ...new Set(
      [codelinienFamilie(line), line.application]
        .flatMap((text) => text.match(/\p{L}+/gu) ?? [])
        .filter((wort) => wort.length >= 5),
    ),
  ];
  if (!woerter.length) return undefined;
  const muster = new RegExp(`(?:^|[^\\p{L}])(?:${woerter.map(maskiert).join('|')})`, 'iu');
  for (const abschnitt of ratgeber.body) {
    const treffer = saetze(abschnitt.text).find((satz) => muster.test(satz));
    if (treffer) return treffer;
  }
  return undefined;
}

/** Andere aktive Linien derselben Anwendungsfamilie, in der Reihenfolge der Daten. */
export function verwandteLinien(line: CodeLine, alle: CodeLine[]): CodeLine[] {
  const familie = codelinienFamilie(line);
  return alle.filter((l) => l.active && l.id !== line.id && codelinienFamilie(l) === familie);
}

/** „Hersteller ABUS, Profil X, Codeserie Y“ — nur gepflegte Angaben. */
export function zuordnungText(line: Pick<CodeLine, 'manufacturer' | 'profile' | 'codeSeries'>): string | undefined {
  const teile = [
    gepflegt(line.manufacturer) && `Hersteller ${gepflegt(line.manufacturer)}`,
    gepflegt(line.profile) && `Profil ${gepflegt(line.profile)}`,
    gepflegt(line.codeSeries) && `Codeserie ${gepflegt(line.codeSeries)}`,
  ].filter(Boolean);
  return teile.length ? teile.join(', ') : undefined;
}

/* ---------- Zusammensetzen ----------------------------------------------- */

export interface CodelinienKontext {
  /** Alle aktiven Codelinien — für die verwandten Linien derselben Familie. */
  alle: CodeLine[];
  /** Versandarten aus den Einstellungen. */
  versand: ShippingOption[];
  /** Ratgeber „Wo finde ich den Schlüsselcode?“, falls vorhanden. */
  ratgeber?: Pick<Guide, 'body'> | null;
}

export interface CodelinienTexte {
  /** Seitentitel ohne Markenzusatz. */
  metaTitel: string;
  metaBeschreibung: string;
  /** Unterzeile im Seitenkopf. */
  einleitung: string;
  /** Beschreibung auf der Seite und in den strukturierten Daten. */
  beschreibung: string;
  /** Satz zur Fundstelle des Codes aus dem Ratgeber. */
  fundstelle?: string;
  faq: { question: string; answer: string }[];
  verwandte: CodeLine[];
  versand: ShippingOption[];
  /** Welche Texte aus dem Backend stammen. */
  eigen: { beschreibung: boolean; titel: boolean; metaBeschreibung: boolean };
}

export function codelinienTexte(line: CodeLine, kontext: CodelinienKontext): CodelinienTexte {
  const eigen = eigeneTexte(line);
  const kennung = codelinienKennung(line);
  const kurz = anwendungKurz(line) || codelinienTitel(line);
  const familie = codelinienFamilie(line);
  const art = gepflegt(line.keyType) ?? 'Schlüssel';
  const format = gepflegt(line.codeFormatLabel);
  const beispiel = gepflegt(line.codeExample);
  const hersteller = gepflegt(line.manufacturer);
  const serie = gepflegt(line.codeSeries);
  const marke = [hersteller, serie].filter(Boolean).join(' ');
  const zuordnung = zuordnungText(line);
  const preis = formatCents(line.priceCents);
  const stufen = staffelStufen(line);
  const staffel = staffelText(line);
  const versand = versandFuerLinie(line, kontext.versand);
  const versandListe = versandText(versand);
  const fundstelle = fundstelleAusRatgeber(kontext.ratgeber, line);
  const verwandte = verwandteLinien(line, kontext.alle);
  const hinweisFoto = gepflegt(line.photoUploadHint);

  /* Titel: der erste Vorschlag, der in 60 Zeichen passt. */
  const titelVorschlaege = [
    ...(marke ? [`${art} ${marke} nach Code – ${kurz}`, `${art} ${marke} nach Code (${kennung})`] : []),
    `${kurz} – ${art} nach Code (${kennung})`,
    `${kurz} – ${art} nach Code`,
    `${kurz} – Schlüssel nach Code`,
    `${kurz} – nach Code`,
    `${kurz} (${kennung})`,
  ];
  const metaTitel = eigen.titel ?? titelVorschlaege.find((t) => t.length <= TITEL_MAX) ?? kurz;

  const metaBeschreibung =
    eigen.metaBeschreibung
    ?? bisLaenge(
      `${art} für ${kurz} nach Code bestellen – Codelinie ${kennung}${marke ? `, ${marke}` : ''}.`,
      [
        ...(format ? [`Codeformat: ${format}${beispiel ? `, z. B. ${beispiel}` : ''}.`] : []),
        `${preis} je Stück.`,
        'Ohne Einsendung des Originalschlüssels.',
        ...(stufen[0] ? [`Ab ${formatNumber(stufen[0].minQty)} Stück ${formatCents(stufen[0].priceCents)}.`] : []),
      ],
      BESCHREIBUNG_MAX,
    );

  const einleitung =
    `${art} für ${kurz}, gefertigt nach dem Code, den Sie eingeben${format ? ` (${format})` : ''}. `
    + `${preis} je Stück – Ihr Originalschlüssel bleibt bei Ihnen.`;

  const fotoSatz =
    line.photoUpload === 'pflicht'
      ? 'Für diese Linie ist ein Foto Pflicht.'
      : line.photoUpload === 'optional'
        ? 'Ein Foto ist freiwillig.'
        : 'Ein Foto ist nicht nötig.';

  const beschreibung =
    eigen.beschreibung
    ?? [
      `Die Codelinie ${kennung} gehört zur Anwendungsfamilie „${familie}“ und ist für ${kurz} vorgesehen.`,
      zuordnung && `Hinterlegt sind: ${zuordnung}.`,
      `Wir fertigen den ${art} allein nach Ihrer Codeangabe; den Originalschlüssel müssen Sie nicht einsenden.`,
      format && `Das Codeformat lautet „${format}“${beispiel ? `, zum Beispiel ${beispiel}` : ''}.`,
      `Ein Schlüssel kostet ${preis}${staffel ? `, ${staffel}` : ''}; je Bestellung sind bis zu ${formatNumber(line.maxQty)} Stück möglich.`,
      fotoSatz,
    ]
      .filter(Boolean)
      .join(' ');

  const faq: CodelinienTexte['faq'] = [];
  if (format) {
    faq.push({
      question: `Wie sieht ein gültiger Code für ${kennung} aus?`,
      answer:
        `Für ${kennung} erwartet das Bestellformular: ${format}${beispiel ? `, zum Beispiel ${beispiel}` : ''}. `
        + 'Eine Eingabe in einem anderen Format nimmt es nicht an.',
    });
  }
  const fundstellenAntwort = [fundstelle, gepflegt(line.codeHint)].filter(Boolean).join(' ');
  if (fundstellenAntwort) {
    faq.push({ question: `Wo steht der Code bei ${kurz}?`, answer: fundstellenAntwort });
  }
  faq.push({
    question: `Was kostet ein ${art} der Codelinie ${kennung}?`,
    answer: [
      `${preis} je Stück einschließlich 19 % Umsatzsteuer${staffel ? `, ${staffel}` : ''};`,
      `bis zu ${formatNumber(line.maxQty)} Stück je Bestellung.`,
      versandListe && `Versand: ${versandListe}.`,
    ]
      .filter(Boolean)
      .join(' '),
  });
  faq.push({
    question: `Brauche ich für ${kennung} ein Foto meines Schlüssels?`,
    answer:
      line.photoUpload === 'pflicht'
        ? hinweisFoto ?? 'Ja, für diese Linie ist ein Foto Pflicht.'
        : line.photoUpload === 'optional'
          ? [`Nein, für ${kennung} ist ein Foto freiwillig.`, hinweisFoto?.replace(/^Ein Foto ist freiwillig\.\s*/i, '')]
              .filter(Boolean)
              .join(' ')
          : 'Nein, für diese Linie ist kein Foto nötig. Wir fertigen allein nach dem Code.',
  });
  if (zuordnung) {
    faq.push({
      question: `Für welche Schlösser ist ${kennung} hinterlegt?`,
      answer: `Hinterlegt sind: ${zuordnung}. Im Zweifel vergleichen Sie die Angaben mit der Prägung an Schloss oder Schlüssel.`,
    });
  }

  return {
    metaTitel,
    metaBeschreibung,
    einleitung,
    beschreibung,
    ...(fundstelle ? { fundstelle } : {}),
    faq,
    verwandte,
    versand,
    eigen: {
      beschreibung: Boolean(eigen.beschreibung),
      titel: Boolean(eigen.titel),
      metaBeschreibung: Boolean(eigen.metaBeschreibung),
    },
  };
}

/* ---------- Kategorie- und Herstellerseiten ------------------------------ */

/** „a“, „a und b“, „a, b und c“. */
export function aufzaehlung(werte: string[]): string {
  if (werte.length <= 1) return werte[0] ?? '';
  return `${werte.slice(0, -1).join(', ')} und ${werte[werte.length - 1]}`;
}

function eindeutig(werte: Array<string | undefined>): string[] {
  return [...new Set(werte.filter((wert): wert is string => Boolean(wert)))];
}

function preisSpanne(lines: CodeLine[]): string {
  const preise = lines.map((line) => line.priceCents);
  const von = Math.min(...preise);
  const bis = Math.max(...preise);
  return von === bis ? formatCents(von) : `${formatCents(von)} bis ${formatCents(bis)}`;
}

export interface GruppenTexte {
  metaTitel: string;
  metaBeschreibung: string;
  einleitung: string;
  /** Absätze aus den Daten der Linien. */
  absaetze: string[];
  /** Satz zur Fundstelle laut Ratgeber, falls die Familie dort genannt ist. */
  fundstelle?: string;
}

/**
 * Texte einer Kategorieseite (Anwendungsfamilie) — aus den Linien der
 * Familie: Zahl, Anwendungen, Schlüsseltypen, Codeformate, Preisspanne,
 * Staffel, Foto-Pflicht, gepflegte Hersteller und die Fundstelle laut Ratgeber.
 */
export function kategorieTexte(
  name: string,
  lines: CodeLine[],
  ratgeber?: Pick<Guide, 'body'> | null,
): GruppenTexte {
  const zahl = lines.length;
  const nomen = zahl === 1 ? 'Codelinie' : 'Codelinien';
  const typen = eindeutig(lines.map((line) => gepflegt(line.keyType)));
  const typText = typen.length ? aufzaehlung(typen) : 'Schlüssel';
  const anwendungen = eindeutig(lines.map((line) => anwendungKurz(line)));
  const formate = eindeutig(lines.map((line) => gepflegt(line.codeFormatLabel)));
  const spanne = preisSpanne(lines);
  const staffelAb = eindeutig(lines.map((line) => staffelStufen(line)[0]?.minQty.toString()));
  const pflicht = lines.filter((line) => line.photoUpload === 'pflicht').map((line) => codelinienKennung(line));
  const hersteller = eindeutig(lines.map((line) => gepflegt(line.manufacturer)));
  const fundstelle = lines.map((line) => fundstelleAusRatgeber(ratgeber, line)).find(Boolean);

  const titelVorschlaege = [`${name} – Schlüssel nach Code`, `${name} nach Code`, name];
  const metaTitel = titelVorschlaege.find((t) => t.length <= TITEL_MAX) ?? name;

  const metaBeschreibung = bisLaenge(
    `${typText} nach Code für ${name}: ${formatNumber(zahl)} ${nomen}, ${spanne} je Stück.`,
    [`Für ${aufzaehlung(anwendungen)}.`, 'Ohne Einsendung des Originalschlüssels.'],
    BESCHREIBUNG_MAX,
  );

  const einleitung =
    `${formatNumber(zahl)} ${nomen} für ${aufzaehlung(anwendungen)}. `
    + 'Sie geben den Code ein, wir fertigen danach — Ihr Originalschlüssel bleibt bei Ihnen.';

  const absaetze = [
    [
      `Schlüsseltyp: ${typText}.`,
      formate.length === 1
        ? `Alle Linien erwarten das Codeformat „${formate[0]}“.`
        : formate.length > 1
          ? `Die Codeformate reichen von „${formate[0]}“ bis „${formate[formate.length - 1]}“ — welches zu Ihrem Schloss gehört, steht bei jeder Linie mit Beispiel.`
          : undefined,
      `Preise je Stück: ${spanne}.`,
      staffelAb.length === 1 ? `Staffelpreise gelten ab ${staffelAb[0]} Stück.` : undefined,
    ]
      .filter(Boolean)
      .join(' '),
    pflicht.length
      ? `Bei ${aufzaehlung(pflicht)} ist ein Foto Pflicht; bei den übrigen Linien ist es freiwillig oder nicht nötig.`
      : '',
    hersteller.length ? `Hinterlegte Hersteller: ${aufzaehlung(hersteller)}.` : '',
  ].filter(Boolean);

  return { metaTitel, metaBeschreibung, einleitung, absaetze, ...(fundstelle ? { fundstelle } : {}) };
}

/** Texte einer Herstellerseite — aus den Linien, bei denen dieser Hersteller gepflegt ist. */
export function herstellerTexte(name: string, lines: CodeLine[]): GruppenTexte {
  const zahl = lines.length;
  const nomen = zahl === 1 ? 'Codelinie' : 'Codelinien';
  const familien = eindeutig(lines.map((line) => codelinienFamilie(line)));
  const typen = eindeutig(lines.map((line) => gepflegt(line.keyType)));
  const profile = eindeutig(lines.map((line) => gepflegt(line.profile)));
  const serien = eindeutig(lines.map((line) => gepflegt(line.codeSeries)));
  const spanne = preisSpanne(lines);

  const titelVorschlaege = [`${name}: Schlüssel nach Code bestellen`, `${name}: Schlüssel nach Code`, name];
  const metaTitel = titelVorschlaege.find((t) => t.length <= TITEL_MAX) ?? name;
  const metaBeschreibung = bisLaenge(
    `Schlüssel nach Code für Schlösser von ${name}: ${formatNumber(zahl)} ${nomen}, ${spanne} je Stück.`,
    [
      ...(typen.length ? [`${aufzaehlung(typen)}.`] : []),
      'Ohne Einsendung des Originalschlüssels.',
    ],
    BESCHREIBUNG_MAX,
  );
  const einleitung =
    `${formatNumber(zahl)} ${nomen} für Schlösser von ${name}${familien.length ? ` aus ${aufzaehlung(familien)}` : ''}. `
    + 'Bestellt wird nach dem Code — ohne Einsendung des Originalschlüssels.';
  const absaetze = [
    [
      typen.length ? `Schlüsseltyp: ${aufzaehlung(typen)}.` : undefined,
      profile.length ? `Profile: ${aufzaehlung(profile)}.` : undefined,
      serien.length ? `Codeserien: ${aufzaehlung(serien)}.` : undefined,
      `Preise je Stück: ${spanne}.`,
    ]
      .filter(Boolean)
      .join(' '),
  ];
  return { metaTitel, metaBeschreibung, einleitung, absaetze };
}
