/**
 * セッション / イベントのテーマ（フロントマターの theme）の定義（単一の情報源）。
 *
 * Markdown の theme（任意）には、ここに書いたテーマのどれか1つしか書けない。
 * それ以外を書くと `npm run dev` / ビルドがエラーで止まる。
 * テーマを増やすときは、この一覧に1行足す。
 *
 * - name:  テーマ名。Markdown の theme に書く文字列
 * - color: タイムテーブルをテーマで色分けするとき（src/data/timetable.ts の colorBy が "theme"）の色
 */
export const programThemes = [
  { name: "わかちあう", color: "#f0a33a" },
  { name: "はじめる", color: "#00b1a9" },
  { name: "つづける", color: "#89c3a0" },
  { name: "ふかめる", color: "#ee859a" },
  { name: "ひろげる", color: "#9699cb" },
] as const satisfies readonly { name: string; color: string }[];

export type ProgramTheme = (typeof programThemes)[number]["name"];

/** テーマ名の一覧（スキーマの択一に使う） */
export const programThemeNames = programThemes.map((item) => item.name) as [ProgramTheme, ...ProgramTheme[]];

/** テーマの色。"はじめる" → "#00b1a9" */
export function themeColor(theme: ProgramTheme): string {
  return programThemes.find((item) => item.name === theme)!.color;
}

/** theme を書いていないコマに使う色と、凡例での名前（colorBy が "theme" のとき） */
export const noThemeColor = "#9a9a9a";
export const noThemeLabel = "テーマなし";
