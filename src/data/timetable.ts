/**
 * タイムテーブル（時間割表）の設定（単一の情報源）。
 *
 * 各セッション / イベントの Markdown のフロントマターに
 *
 *   timetable:
 *     slot: ホール
 *     start: "13:00"
 *     end: "14:30"
 *
 * と書くと、この設定に従って表に配置される。
 * 「表の縦の範囲」「横に並べる場所の順番」「色分けのしかた」「色」を変えたいときは、
 * まずこのファイルを直す。
 */

/** 表の横軸に並べる場所（スロット）1つ分 */
export interface TimetableSlot {
  /** フロントマターの slot に書ける短い識別子（英数字） */
  id: string;
  /** 表の見出しに出す表示名。フロントマターの slot にはこちらを書いてもよい */
  name: string;
  /** 見出しの下に添える補足（任意）。例: "3F" */
  note?: string;
  /**
   * この場所の色（CSS の色値。例: "#00b1a9"）。colorBy が "slot" のときに使う。
   * 見出しの色帯・コマの背景と文字・種別バッジが、この色から自動で作られる。
   * 濃すぎる色より、メインカラー程度の濃さの色のほうが表が見やすい。
   */
  color: string;
}

/**
 * コマの色を何で分けるか。
 * - "slot":  場所ごと（下の slots の color）
 * - "type":  種別ごと（フロントマターの type。色は src/data/programTypes.ts）
 * - "theme": テーマごと（フロントマターの theme。色は src/data/programThemes.ts）
 */
export type TimetableColorBy = "slot" | "type" | "theme";

export interface TimetableConfig {
  /** 表の上端の時刻（"HH:MM"）。開催時間に合わせる */
  startTime: string;
  /** 表の下端の時刻（"HH:MM"） */
  endTime: string;
  /** 左の時間軸に目盛りと時刻ラベルを入れる間隔（分） */
  tickMinutes: number;
  /**
   * 表の行の最小単位（分）。コマの高さと位置はこの単位で決まる。
   * tickMinutes はこの値の倍数にすること（30 と 5 なら 1 目盛り = 6 行）。
   */
  stepMinutes: number;
  /**
   * 横軸に並べる場所。**この配列の順番がそのまま左から右の列の順番になる。**
   * セッションがまだ入っていない場所も、ここに書いてあれば空の列として表示される。
   */
  slots: TimetableSlot[];
  /** コマの色を何で分けるか（→ TimetableColorBy）。"slot" 以外では表の上に凡例が出る */
  colorBy: TimetableColorBy;
}

export const timetableConfig: TimetableConfig = {
  startTime: "10:00",
  endTime: "17:00",
  tickMinutes: 30,
  stepMinutes: 5,

  // TODO: 会場のレイアウトが決まったら実際の部屋名に差し替える（現在は仮）
  slots: [
    { id: "hall", name: "ホール", color: "#00b1a9" },
    { id: "room-a", name: "大会議室A", color: "#ee859a" },
    { id: "room-b", name: "大会議室B", color: "#9699cb" },
    { id: "workshop", name: "ワークショップ", color: "#89c3a0" },
  ],

  // 色分けのしかた。"slot"（場所）/ "type"（種別）/ "theme"（テーマ）
  colorBy: "theme",
};
