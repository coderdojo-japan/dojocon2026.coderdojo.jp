import { getEvents, getSessions } from "./program";
import { programTypes, typeColor, type ProgramType } from "../data/programTypes";
import { noThemeColor, noThemeLabel, programThemes, themeColor, type ProgramTheme } from "../data/programThemes";
import { timetableConfig, type TimetableSlot } from "../data/timetable";

/** 表に置く1コマ分。セッションとイベントを同じ形にそろえたもの */
export interface TimetableEntry {
  /** コレクション内のスラッグ */
  id: string;
  /** セッションかイベントか（リンク先の区別に使う。色は colorBy の設定で決まる） */
  kind: "session" | "event";
  title: string;
  /** 詳細ページへのリンク先 */
  href: string;
  /** 種別（"対話" "ワークショップ" など） */
  type: ProgramType;
  /** テーマ（未記入なら undefined） */
  theme?: ProgramTheme;
  target: string;
  speaker?: string;
  /** このコマの色。colorBy に応じて場所・種別・テーマのどれかから決まる */
  color: string;
  /** "13:00 - 14:30" のような表示用ラベル */
  timeLabel: string;
  /** CSS Grid の grid-row の開始行（1 始まり） */
  rowStart: number;
  /** CSS Grid の grid-row の終了行（この行の直前までを占める） */
  rowEnd: number;
}

/** 1つの場所（列）とそこに入るコマ */
export interface TimetableColumn {
  slot: TimetableSlot;
  /**
   * この列の見出し・背景・タブに使う色。colorBy が "slot" なら slot.color、
   * それ以外なら場所で色を分けないので columnNeutralColor
   */
  color: string;
  entries: TimetableEntry[];
}

/** 凡例1項目分（colorBy が "slot" 以外のときに表の上に出す） */
export interface TimetableLegendItem {
  label: string;
  color: string;
}

/** 左の時間軸に出す目盛り1つ分 */
export interface TimetableTick {
  /** "13:00" */
  label: string;
  /** CSS Grid の grid-row */
  row: number;
  /** 毎時00分か。時間の区切りを濃く見せるのに使う */
  isHour: boolean;
}

export interface TimetableData {
  columns: TimetableColumn[];
  /** 色の凡例。colorBy が "slot" のときは空（場所は列の見出しでわかるため） */
  legend: TimetableLegendItem[];
  ticks: TimetableTick[];
  /** 表全体の行数（grid-template-rows の repeat 回数） */
  totalRows: number;
  /** 1目盛りが何行分か（横罫線の間隔の計算に使う） */
  rowsPerTick: number;
  /** 毎時00分の区切り線を引く行（CSS Grid の grid-row） */
  hourRows: number[];
  /** 表に置けたコマが1つもないか */
  isEmpty: boolean;
}

/** colorBy が "slot" 以外のとき、列の見出し・背景・タブに使う色（$main-blue） */
const columnNeutralColor = "#00b1a9";

/** "13:05" → 785（0時からの分数） */
function toMinutes(time: string): number {
  const [hour = "0", minute = "0"] = time.split(":");
  return Number(hour) * 60 + Number(minute);
}

/** 785 → "13:05" */
function toLabel(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** ビルドログに出す注意書き。データの書き間違いに気づけるようにする */
function warn(message: string): void {
  console.warn(`[timetable] ${message}`);
}

/**
 * セッションとイベントのフロントマターからタイムテーブルを組み立てる。
 * - timetable を書いていないものは対象外（カード一覧には従来どおり出る）
 * - slot が src/data/timetable.ts に無い、時刻が表の範囲外、同じ場所で時間が重なる、
 *   といった場合はビルド時に警告を出す
 */
export async function getTimetable(): Promise<TimetableData> {
  const { startTime, endTime, tickMinutes, stepMinutes, slots, colorBy } = timetableConfig;
  const tableStart = toMinutes(startTime);
  const tableEnd = toMinutes(endTime);
  const totalRows = Math.ceil((tableEnd - tableStart) / stepMinutes);
  const rowsPerTick = tickMinutes / stepMinutes;

  // slot に id と表示名のどちらを書いても引けるようにする
  const slotById = new Map<string, TimetableSlot>();
  for (const slot of slots) {
    slotById.set(slot.id, slot);
    slotById.set(slot.name, slot);
  }

  const buckets = new Map<string, TimetableEntry[]>(slots.map((slot) => [slot.id, []]));

  /** 1件をしかるべき場所のバケツに入れる。置けなかったときは警告して捨てる */
  function place(source: {
    id: string;
    kind: TimetableEntry["kind"];
    base: string;
    title: string;
    type: ProgramType;
    theme?: ProgramTheme;
    target: string;
    speaker?: string;
    placement: { slot: string; start: string; end: string };
  }): void {
    const { placement } = source;
    const where = `${source.base}/${source.id}`;

    const slot = slotById.get(placement.slot);
    if (!slot) {
      warn(`${where}: 場所 "${placement.slot}" は src/data/timetable.ts の slots にありません。表から除外します。`);
      return;
    }

    const start = toMinutes(placement.start);
    const end = toMinutes(placement.end);
    if (start < tableStart || end > tableEnd) {
      warn(
        `${where}: ${placement.start}-${placement.end} は表の範囲（${startTime}-${endTime}）に収まりません。表から除外します。`,
      );
      return;
    }

    const entry: TimetableEntry = {
      id: source.id,
      kind: source.kind,
      title: source.title,
      href: where,
      type: source.type,
      theme: source.theme,
      target: source.target,
      speaker: source.speaker,
      // 色は全部置き終わってから決める（出てきた順に既定パレットを配るため）
      color: "",
      timeLabel: `${toLabel(start)} - ${toLabel(end)}`,
      rowStart: Math.floor((start - tableStart) / stepMinutes) + 1,
      rowEnd: Math.ceil((end - tableStart) / stepMinutes) + 1,
    };

    // 同じ場所で時間が重なっていないか確認する（重なると表示が重なってしまう）
    const bucket = buckets.get(slot.id) ?? [];
    for (const other of bucket) {
      if (entry.rowStart < other.rowEnd && other.rowStart < entry.rowEnd) {
        warn(`${slot.name}: 「${other.title}」と「${entry.title}」の時間が重なっています。`);
      }
    }
    bucket.push(entry);
    buckets.set(slot.id, bucket);
  }

  const [sessions, events] = await Promise.all([getSessions(), getEvents()]);

  for (const item of sessions) {
    if (!item.data.timetable) continue;
    place({
      id: item.id,
      kind: "session",
      base: "/sessions",
      title: item.data.title,
      type: item.data.type,
      theme: item.data.theme,
      target: item.data.target,
      speaker: item.data.speaker,
      placement: item.data.timetable,
    });
  }

  for (const item of events) {
    if (!item.data.timetable) continue;
    place({
      id: item.id,
      kind: "event",
      base: "/events",
      title: item.data.title,
      type: item.data.type,
      theme: item.data.theme,
      target: item.data.target,
      speaker: item.data.speaker,
      placement: item.data.timetable,
    });
  }

  const columns: TimetableColumn[] = slots.map((slot) => ({
    slot,
    color: colorBy === "slot" ? slot.color : columnNeutralColor,
    entries: (buckets.get(slot.id) ?? []).sort((a, b) => a.rowStart - b.rowStart),
  }));

  // コマの色を決める。種別・テーマの色は src/data/programTypes.ts / programThemes.ts の定義から引く
  const used = new Set<string>();
  for (const column of columns) {
    for (const entry of column.entries) {
      if (colorBy === "slot") {
        entry.color = column.color;
      } else if (colorBy === "type") {
        entry.color = typeColor(entry.type);
        used.add(entry.type);
      } else {
        entry.color = entry.theme ? themeColor(entry.theme) : noThemeColor;
        used.add(entry.theme ?? noThemeLabel);
      }
    }
  }

  // 凡例は表に出てくるものだけを、定義の順に並べる。「テーマなし」は最後
  const legend: TimetableLegendItem[] = [];
  if (colorBy !== "slot") {
    for (const item of colorBy === "type" ? programTypes : programThemes) {
      if (used.has(item.name)) legend.push({ label: item.name, color: item.color });
    }
    if (used.has(noThemeLabel)) legend.push({ label: noThemeLabel, color: noThemeColor });
  }

  /** 分数 → grid-row。表の上端を 1 行目とする */
  const toRow = (minutes: number): number => Math.floor((minutes - tableStart) / stepMinutes) + 1;

  const ticks: TimetableTick[] = [];
  for (let minutes = tableStart; minutes <= tableEnd; minutes += tickMinutes) {
    ticks.push({ label: toLabel(minutes), row: toRow(minutes), isHour: minutes % 60 === 0 });
  }

  // 毎時00分の区切り線。表の上端が半端な時刻でもよいよう、最初の正時から数える。
  // 表の一番上（1行目）は見出しの下線がその役目を果たすので線は引かない
  const hourRows: number[] = [];
  const firstHour = Math.ceil(tableStart / 60) * 60;
  for (let minutes = firstHour; minutes <= tableEnd; minutes += 60) {
    const row = toRow(minutes);
    if (row > 1) hourRows.push(row);
  }

  return {
    columns,
    legend,
    ticks,
    totalRows,
    rowsPerTick,
    hourRows,
    isEmpty: columns.every((column) => column.entries.length === 0),
  };
}
