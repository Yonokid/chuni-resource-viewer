// Fuzzy-ish Japanese search: hiragana/katakana/half-width/romaji all fold to the same
// katakana form. Dakuten and small kana are dropped because game sortNames omit them
// (e.g. フィーネ → フイウネ), so "kanji" matches カンシ and "fiine" matches フイイネ.

const ROWS: Record<string, string> = {
  "": "ア イ ウ エ オ",
  k: "カ キ ク ケ コ",
  s: "サ シ ス セ ソ",
  t: "タ チ ツ テ ト",
  n: "ナ ニ ヌ ネ ノ",
  h: "ハ ヒ フ ヘ ホ",
  m: "マ ミ ム メ モ",
  y: "ヤ イ ユ イェ ヨ",
  r: "ラ リ ル レ ロ",
  l: "ラ リ ル レ ロ",
  w: "ワ ウィ ウ ウェ ヲ",
  g: "ガ ギ グ ゲ ゴ",
  z: "ザ ジ ズ ゼ ゾ",
  d: "ダ ヂ ヅ デ ド",
  b: "バ ビ ブ ベ ボ",
  p: "パ ピ プ ペ ポ",
  v: "ヴァ ヴィ ヴ ヴェ ヴォ",
  f: "ファ フィ フ フェ フォ",
  j: "ジャ ジ ジュ ジェ ジョ",
  sh: "シャ シ シュ シェ ショ",
  ch: "チャ チ チュ チェ チョ",
  ts: "ツァ ツィ ツ ツェ ツォ",
};
const ROMAJI: Record<string, string> = {};
for (const [c, kana] of Object.entries(ROWS)) {
  kana.split(" ").forEach((k, i) => (ROMAJI[c + "aiueo"[i]] = k));
}
for (const c of ["k", "g", "s", "z", "t", "d", "n", "h", "b", "p", "m", "r"]) {
  const i = ROMAJI[c + "i"];
  Object.assign(ROMAJI, { [c + "ya"]: i + "ャ", [c + "yu"]: i + "ュ", [c + "yo"]: i + "ョ" });
}

function toKana(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; ) {
    const c = s[i];
    if (c === "n" && (i + 1 === s.length || !/[aiueoy]/.test(s[i + 1]))) {
      out += "ン";
      i += s[i + 1] === "n" ? 2 : 1;
    } else if (/[b-df-hj-np-tv-z]/.test(c) && s[i + 1] === c) {
      out += "ッ";
      i++;
    } else {
      const len = [3, 2, 1].find((l) => ROMAJI[s.slice(i, i + l)]);
      out += len ? ROMAJI[s.slice(i, i + len)] : c;
      i += len ?? 1;
    }
  }
  return out;
}

const SMALL: Record<string, string> = Object.fromEntries(
  [..."ァィゥェォッャュョヮヵヶ"].map((k, i) => [k, "アイウエオツヤユヨワカケ"[i]]),
);

export function fold(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ぁ-ゖ]/g, (h) => String.fromCharCode(h.charCodeAt(0) + 0x60))
    .normalize("NFD")
    .replace(/[゙゚\sー]/g, "")
    .replace(/[ァィゥェォッャュョヮヵヶ]/g, (k) => SMALL[k]);
}

/** Folded haystack for an item; build once per item, then test with matches(). */
export const searchKey = (...fields: (string | null | undefined)[]) =>
  fields.filter(Boolean).map((f) => fold(f!)).join("\n");

/** Folded needles for a query: as typed, and read as romaji. */
export function needles(query: string): string[] {
  const q = fold(query);
  return [...new Set([q, fold(toKana(q))])];
}

export const matches = (key: string, ns: string[]) => ns.some((n) => key.includes(n));
