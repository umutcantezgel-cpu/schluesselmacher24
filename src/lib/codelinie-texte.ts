import type { CodeLine, Guide, ShippingOption } from '@/lib/types';
import { generatorTexte } from '@/lib/data/defaults/code-lines';
import { formatCents, formatNumber } from '@/lib/format';
import { unitPriceForCodeLine } from '@/lib/pricing';
import { MARKENZUSATZ, TITEL_MAX_ZEICHEN, titelPasst } from '@/lib/titelbreite';
import {
  anwendungKurz,
  codelinienFamilie,
  codelinienKennung,
  eigeneFamilie,
  codelinienTitel,
  gepflegt,
  verfuegbarkeitVon,
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

/**
 * Höchstlänge des Titels ohne den Markenzusatz der Vorlage. Der fertige Titel samt
 * „ | SCHLÜSSELMACHER24“ bleibt zusätzlich in 60 Zeichen und 580 px (`titelPasst`, FA-SEO-01B).
 */
export const TITEL_MAX = TITEL_MAX_ZEICHEN - [...MARKENZUSATZ].length;
/** Mindest- und Höchstlänge der Meta-Beschreibung. */
export const BESCHREIBUNG_MIN = 120;
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

/**
 * Beschreibung zwischen `BESCHREIBUNG_MIN` und `BESCHREIBUNG_MAX` Zeichen: Pflichtsatz und so viele
 * der weiteren Sätze, wie hineinpassen, frühere vor späteren. Reicht keine Auswahl in den Rahmen,
 * gilt die längste Auswahl bis zur Höchstlänge (FA-SEO-01B).
 */
function imRahmen(pflicht: string, optional: Array<string | undefined>): string {
  const teile = optional.filter((teil): teil is string => Boolean(teil));
  const suche = (text: string, i: number): string | undefined => {
    if (i === teile.length) return text.length >= BESCHREIBUNG_MIN && text.length <= BESCHREIBUNG_MAX ? text : undefined;
    const mit = `${text} ${teile[i]}`;
    return (mit.length <= BESCHREIBUNG_MAX ? suche(mit, i + 1) : undefined) ?? suche(text, i + 1);
  };
  return suche(pflicht, 0) ?? bisLaenge(pflicht, teile, BESCHREIBUNG_MAX);
}

/** Erster Titelvorschlag, der samt Markenzusatz in 580 px und 60 Zeichen passt, sonst der letzte. */
function ersterPassender(vorschlaege: string[]): string {
  return vorschlaege.find(titelPasst) ?? vorschlaege[vorschlaege.length - 1];
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

/** Hersteller und System als Vergleichswert; ohne System zählt die Anwendungsfamilie. */
function gruppeVon(line: CodeLine): string {
  const system = gepflegt(line.system);
  if (!system) return `familie:${codelinienFamilie(line)}`;
  return `system:${line.manufacturerId ?? gepflegt(line.manufacturer) ?? ''}|${system}`;
}

/**
 * Andere aktive Linien derselben Gruppe, in der Reihenfolge der Daten: bei
 * gepflegtem System dieselbe Kombination aus Hersteller und System (FA-11-04),
 * sonst dieselbe Anwendungsfamilie.
 */
export function verwandteLinien(line: CodeLine, alle: CodeLine[]): CodeLine[] {
  const gruppe = gruppeVon(line);
  return alle.filter((l) => l.active && l.id !== line.id && gruppeVon(l) === gruppe);
}

/** „Hersteller ABUS, System X, Codebereich 1 bis 500, Profil Y, Codeserie Z“: nur gepflegte Angaben. */
export function zuordnungText(
  line: Pick<CodeLine, 'manufacturer' | 'profile' | 'codeSeries'> & Partial<Pick<CodeLine, 'system' | 'codeRange'>>,
): string | undefined {
  const teile = [
    gepflegt(line.manufacturer) && `Hersteller ${gepflegt(line.manufacturer)}`,
    gepflegt(line.system) && `System ${gepflegt(line.system)}`,
    gepflegt(line.codeRange) && `Codebereich ${gepflegt(line.codeRange)}`,
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
  // Familie nur, wenn sie nicht bloß System oder „Hersteller System“ wiederholt (Linien aus dem Import).
  const familie = eigeneFamilie(line);
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
  // Texte nach Verfügbarkeit (FA-22-10): Die Seite beschreibt keinen Direktkauf, den der Server ablehnt (R4).
  const verfuegbarkeit = verfuegbarkeitVon(line);
  const lieferbar = verfuegbarkeit === 'lieferbar';
  const aufAnfrage = verfuegbarkeit === 'auf-anfrage';

  /* Titel: der erste Vorschlag, der samt Markenzusatz in 580 px und 60 Zeichen passt; ohne Gedankenstrich. */
  const titelVorschlaege = [
    ...(marke
      ? [
          `${art} ${marke} nach Code: ${kurz}`,
          `${art} ${marke} nach Code (${kennung})`,
          `${art} ${marke} (${kennung})`,
          ...(hersteller ? [`${hersteller} ${art} (${kennung})`] : []),
        ]
      : []),
    `${kurz}: ${art} nach Code`,
    `${kurz}: Schlüssel nach Code`,
    `${kurz} nach Code`,
    `${art} nach Code (${kennung})`,
    `${art} (${kennung})`,
  ];
  const metaTitel = eigen.titel ?? ersterPassender(titelVorschlaege);

  // Beschreibung aus den Angaben der Seite, ohne Beträge (FA-SEO-01B); Preis und Staffel stehen auf der Seite.
  const metaBeschreibung =
    eigen.metaBeschreibung
    ?? imRahmen(
      lieferbar
        ? `${art} für ${kurz} nach Code bestellen: Schlüssel ${kennung}${marke ? `, ${marke}` : ''}.`
        : aufAnfrage
          ? `${art} für ${kurz} nach Code anfragen: Schlüssel ${kennung}${marke ? `, ${marke}` : ''}.`
          : `${art} für ${kurz} nach Code: Schlüssel ${kennung}${marke ? `, ${marke}` : ''}, derzeit nicht lieferbar.`,
      [
        format ? `Codeformat: ${format}${beispiel ? `, z. B. ${beispiel}` : ''}.` : undefined,
        // Wie in der Einleitung und im Bestellformular; ein Satz, nicht zwei gleichbedeutende.
        'Ihr Originalschlüssel bleibt bei Ihnen.',
        lieferbar && stufen[0] ? `Staffelpreis ab ${formatNumber(stufen[0].minQty)} Stück.` : undefined,
        lieferbar
          ? 'Sie geben den Code ein, wir fertigen danach.'
          : aufAnfrage
            ? 'Sie nennen den Code, wir prüfen ihn und melden uns.'
            : 'Fragen Sie gern nach einem anderen Schlüssel.',
      ],
    );

  const einleitung = lieferbar
    ? `${art} für ${kurz}, gefertigt nach dem Code, den Sie eingeben${format ? ` (${format})` : ''}. `
      + `${preis} je Stück. Ihr Originalschlüssel bleibt bei Ihnen.`
    : aufAnfrage
      ? `${art} für ${kurz}, gefertigt nach dem Code Ihres Schlosses${format ? ` (${format})` : ''}. `
        + 'Bitte fragen Sie bei uns an, wir prüfen Ihren Code. Ihr Originalschlüssel bleibt bei Ihnen.'
      : `${art} für ${kurz}, gefertigt nach dem Code Ihres Schlosses${format ? ` (${format})` : ''}. `
        + 'Diesen Schlüssel können Sie zurzeit nicht bestellen.';

  const fotoSatz =
    line.photoUpload === 'pflicht'
      ? 'Für diesen Schlüssel ist ein Foto Pflicht.'
      : line.photoUpload === 'optional'
        ? 'Ein Foto ist freiwillig.'
        : 'Ein Foto ist nicht nötig.';

  const beschreibung =
    eigen.beschreibung
    ?? [
      familie
        ? `Der Schlüssel ${kennung} ist für ${kurz} gedacht. Er gehört zur Anwendungsfamilie „${familie}“.`
        : kurz.toLowerCase() !== kennung.toLowerCase()
          ? `Der Schlüssel ${kennung} ist für ${kurz} gedacht.`
          : undefined,
      zuordnung && `Angaben zum Schloss: ${zuordnung}.`,
      `Wir fertigen den ${art} nur nach Ihrem Code. Ihren Originalschlüssel müssen Sie nicht einschicken.`,
      format && `Das Codeformat lautet „${format}“${beispiel ? `, zum Beispiel ${beispiel}` : ''}.`,
      lieferbar
        ? `Ein Schlüssel kostet ${preis}${staffel ? `, ${staffel}` : ''}. Je Bestellung sind bis zu ${formatNumber(line.maxQty)} Stück möglich.`
        : aufAnfrage
          ? 'Diesen Schlüssel bestellen Sie nicht direkt. Sie fragen ihn bei uns an. Wir prüfen den Code und melden uns mit einem Angebot.'
          : 'Diesen Schlüssel können Sie zurzeit nicht bestellen.',
      lieferbar ? fotoSatz : undefined,
    ]
      .filter(Boolean)
      .join(' ');

  const faq: CodelinienTexte['faq'] = [];
  if (format) {
    faq.push({
      question: `Wie sieht ein gültiger Code für ${kennung} aus?`,
      answer: lieferbar
        ? `Für ${kennung} erwartet das Bestellformular: ${format}${beispiel ? `, zum Beispiel ${beispiel}` : ''}. `
          + 'Eine Eingabe in einem anderen Format nimmt es nicht an.'
        : `Für ${kennung} gilt das Codeformat: ${format}${beispiel ? `, zum Beispiel ${beispiel}` : ''}.`
          + (aufAnfrage ? ' Nennen Sie den Code in Ihrer Anfrage genau so, wie er aufgedruckt ist.' : ''),
    });
  }
  const fundstellenAntwort = [fundstelle, gepflegt(line.codeHint)].filter(Boolean).join(' ');
  if (fundstellenAntwort) {
    faq.push({ question: `Wo steht der Code bei ${kurz}?`, answer: fundstellenAntwort });
  }
  // Preis, Stückzahl und Foto nur, wenn direkt bestellt werden kann; bei „auf Anfrage“ nennt das Angebot den Preis.
  if (lieferbar) {
    faq.push({
      question: `Was kostet ein ${art} ${kennung}?`,
      answer: [
        `${preis} je Stück einschließlich 19 % Umsatzsteuer${staffel ? `, ${staffel}` : ''}.`,
        `Je Bestellung sind bis zu ${formatNumber(line.maxQty)} Stück möglich.`,
        versandListe && `Versand: ${versandListe}.`,
      ]
        .filter(Boolean)
        .join(' '),
    });
    faq.push({
      question: `Brauche ich für ${kennung} ein Foto meines Schlüssels?`,
      answer:
        line.photoUpload === 'pflicht'
          ? hinweisFoto ?? 'Ja, für diesen Schlüssel ist ein Foto Pflicht.'
          : line.photoUpload === 'optional'
            ? [`Nein, für ${kennung} ist ein Foto freiwillig.`, hinweisFoto?.replace(/^Ein Foto ist freiwillig\.\s*/i, '')]
                .filter(Boolean)
                .join(' ')
            : 'Nein, für diesen Schlüssel ist kein Foto nötig. Wir fertigen nur nach dem Code.',
    });
  } else if (aufAnfrage) {
    faq.push({
      question: `Was kostet ein ${art} ${kennung}?`,
      answer: 'Den Preis nennen wir Ihnen mit unserem Angebot, nachdem wir Ihren Code geprüft haben.',
    });
  }
  if (zuordnung) {
    faq.push({
      question: `Für welche Schlösser ist ${kennung} gedacht?`,
      answer: `Angaben zum Schloss: ${zuordnung}. Im Zweifel vergleichen Sie diese mit der Prägung an Schloss oder Schlüssel.`,
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

/** Preisspanne der lieferbaren Linien; ohne lieferbare Linie keine (auf Anfrage nennt das Angebot den Preis). */
function preisSpanne(lines: CodeLine[]): string | undefined {
  const preise = lines.filter((line) => verfuegbarkeitVon(line) === 'lieferbar').map((line) => line.priceCents);
  if (!preise.length) return undefined;
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

/** Kann in dieser Gruppe direkt bestellt werden? Nur dann beschreiben Seite und Kopfzeile einen Direktkauf. */
export function gruppeLieferbar(lines: CodeLine[]): boolean {
  return lines.some((line) => verfuegbarkeitVon(line) === 'lieferbar');
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
  // Sichtbarer Text und Suchtexte sagen „Produkt“; „Codelinie“ bleibt nur der Name im Code.
  const produkte = zahl === 1 ? 'Produkt' : 'Produkte';
  const typen = eindeutig(lines.map((line) => gepflegt(line.keyType)));
  const typText = typen.length ? aufzaehlung(typen) : 'Schlüssel';
  const anwendungen = eindeutig(lines.map((line) => anwendungKurz(line)));
  const formate = eindeutig(lines.map((line) => gepflegt(line.codeFormatLabel)));
  const spanne = preisSpanne(lines);
  // Staffel nur aus lieferbaren Produkten: ohne Direktkauf gibt es keinen Staffelpreis zu nennen (R9).
  const staffelAb = eindeutig(
    lines.filter((line) => verfuegbarkeitVon(line) === 'lieferbar').map((line) => staffelStufen(line)[0]?.minQty.toString()),
  );
  const pflicht = lines.filter((line) => line.photoUpload === 'pflicht').map((line) => codelinienKennung(line));
  const hersteller = eindeutig(lines.map((line) => gepflegt(line.manufacturer)));
  const fundstelle = lines.map((line) => fundstelleAusRatgeber(ratgeber, line)).find(Boolean);
  // Direktkauf nur, wenn mindestens eine Linie lieferbar ist; sonst die Anfrage-Fassung (R4).
  const lieferbar = gruppeLieferbar(lines);

  const titelVorschlaege = [`${name}: Schlüssel nach Code`, `${name} nach Code`, `${typText} nach Code`, name];
  const metaTitel = ersterPassender(titelVorschlaege);

  // Ohne Beträge (FA-SEO-01B); die Preisspanne steht auf der Seite.
  const metaBeschreibung = imRahmen(`${typText} nach Code für ${name}: ${formatNumber(zahl)} ${produkte}.`, [
    `Für ${aufzaehlung(anwendungen)}.`,
    'Ohne Einsendung des Originalschlüssels.',
    ...(lieferbar
      ? ['Den Preis je Stück sehen Sie bei jedem Produkt.', 'Sie geben den Code ein, wir fertigen danach.']
      : ['Sie nennen den Code in einer Anfrage, wir prüfen ihn und melden uns.']),
  ]);

  const einleitung =
    `${formatNumber(zahl)} ${produkte} für ${aufzaehlung(anwendungen)}. `
    + (lieferbar
      ? 'Sie geben den Code ein, wir fertigen danach. Ihr Originalschlüssel bleibt bei Ihnen.'
      : 'Sie nennen den Code in einer Anfrage, wir prüfen ihn und melden uns. Ihr Originalschlüssel bleibt bei Ihnen.');

  const absaetze = [
    [
      `Schlüsseltyp: ${typText}.`,
      formate.length === 1
        ? `Alle Produkte haben das Codeformat „${formate[0]}“.`
        : formate.length > 1
          ? `Die Codeformate sind verschieden, etwa „${formate[0]}“ oder „${formate[formate.length - 1]}“. Bei jedem Produkt steht sein Format mit einem Beispiel.`
          : undefined,
      spanne ? `Preise je Stück: ${spanne}.` : undefined,
      staffelAb.length === 1 ? `Staffelpreise gelten ab ${staffelAb[0]} Stück.` : undefined,
    ]
      .filter(Boolean)
      .join(' '),
    pflicht.length
      ? `Bei ${aufzaehlung(pflicht)} ist ein Foto Pflicht. Bei den übrigen Produkten ist es freiwillig oder nicht nötig.`
      : '',
    hersteller.length ? `Hersteller: ${aufzaehlung(hersteller)}.` : '',
  ].filter(Boolean);

  return { metaTitel, metaBeschreibung, einleitung, absaetze, ...(fundstelle ? { fundstelle } : {}) };
}

/** Texte einer Herstellerseite — aus den Linien, bei denen dieser Hersteller gepflegt ist. */
export function herstellerTexte(name: string, lines: CodeLine[]): GruppenTexte {
  const zahl = lines.length;
  const produkte = zahl === 1 ? 'Produkt' : 'Produkte';
  const familien = eindeutig(lines.map((line) => codelinienFamilie(line)));
  const typen = eindeutig(lines.map((line) => gepflegt(line.keyType)));
  const profile = eindeutig(lines.map((line) => gepflegt(line.profile)));
  const serien = eindeutig(lines.map((line) => gepflegt(line.codeSeries)));
  const systeme = eindeutig(lines.map((line) => gepflegt(line.system)));
  const spanne = preisSpanne(lines);
  // Direktkauf nur, wenn mindestens eine Linie lieferbar ist; sonst die Anfrage-Fassung (R4).
  const lieferbar = gruppeLieferbar(lines);

  const titelVorschlaege = lieferbar
    ? [`${name}: Schlüssel nach Code bestellen`, `${name}: Schlüssel nach Code`, name]
    : [`${name}: Schlüssel nach Code`, name];
  const metaTitel = ersterPassender(titelVorschlaege);
  // Ohne Beträge (FA-SEO-01B); die Preisspanne steht auf der Seite.
  const metaBeschreibung = imRahmen(
    `Schlüssel nach Code für Schlösser von ${name}: ${formatNumber(zahl)} ${produkte}.`,
    [
      typen.length ? `${aufzaehlung(typen)}.` : undefined,
      'Ohne Einsendung des Originalschlüssels.',
      ...(lieferbar
        ? ['Den Preis je Stück sehen Sie bei jedem Produkt.', 'Sie geben den Code ein, wir fertigen danach.']
        : ['Sie nennen den Code in einer Anfrage, wir prüfen ihn und melden uns.']),
    ],
  );
  const einleitung =
    `${formatNumber(zahl)} ${produkte} für Schlösser von ${name}`
    + (systeme.length
      ? `${systeme.length === 1 ? ' im System' : ' in den Systemen'} ${aufzaehlung(systeme)}. `
      : `${familien.length ? ` aus ${aufzaehlung(familien)}` : ''}. `)
    + (lieferbar
      ? 'Sie bestellen nach dem Code. Ihren Originalschlüssel behalten Sie.'
      : 'Sie nennen den Code in einer Anfrage. Ihren Originalschlüssel behalten Sie.');
  const absaetze = [
    [
      systeme.length ? `${systeme.length === 1 ? 'System' : 'Systeme'}: ${aufzaehlung(systeme)}.` : undefined,
      typen.length ? `Schlüsseltyp: ${aufzaehlung(typen)}.` : undefined,
      profile.length ? `Profile: ${aufzaehlung(profile)}.` : undefined,
      serien.length ? `Codeserien: ${aufzaehlung(serien)}.` : undefined,
      spanne ? `Preise je Stück: ${spanne}.` : undefined,
    ]
      .filter(Boolean)
      .join(' '),
  ];
  return { metaTitel, metaBeschreibung, einleitung, absaetze };
}
