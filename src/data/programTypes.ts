/**
 * セッション / イベントの種別（フロントマターの type）の定義（単一の情報源）。
 *
 * Markdown の type には、ここに書いた種別のどれか1つしか書けない。
 * それ以外を書くと `npm run dev` / ビルドがエラーで止まる。
 * 種別を増やすときは、この一覧に1行足す。
 *
 * - name:         種別名。Markdown の type に書く文字列
 * - speakerLabel: その種別での speaker（人の名前）の見出し。
 *                 カードでは「ファシリテーター：山田 太郎」のように表示される
 * - color:        タイムテーブルを種別で色分けするとき（src/data/timetable.ts の colorBy が "type"）の色
 */
export const programTypes = [
  { name: "ワークショップ", speakerLabel: "ファシリテーター", color: "#89c3a0" },
  { name: "対話", speakerLabel: "話題提供", color: "#ee859a" },
  { name: "聴講", speakerLabel: "登壇", color: "#00b1a9" },
  { name: "セミナー", speakerLabel: "登壇", color: "#5b8fd6" },
  { name: "展示", speakerLabel: "担当", color: "#9699cb" },
  { name: "イベント", speakerLabel: "担当", color: "#e8a33d" },
  { name: "セッション", speakerLabel: "担当", color: "#c98a5e" },
] as const satisfies readonly { name: string; speakerLabel: string; color: string }[];

export type ProgramType = (typeof programTypes)[number]["name"];

/** 種別名の一覧（スキーマの択一に使う） */
export const programTypeNames = programTypes.map((item) => item.name) as [ProgramType, ...ProgramType[]];

/** 種別名から定義を引く */
function findType(type: ProgramType) {
  return programTypes.find((item) => item.name === type)!;
}

/** 種別に応じた speaker の見出し。"対話" → "話題提供" */
export function speakerLabel(type: ProgramType): string {
  return findType(type).speakerLabel;
}

/** 種別の色。"対話" → "#ee859a" */
export function typeColor(type: ProgramType): string {
  return findType(type).color;
}
