import { getEvents, getSessions } from "./program";
import { timetableConfig, type TimetableSlot } from "../data/timetable";

/** 表に置く1コマ分。セッションとイベントを同じ形にそろえたもの */
export interface TimetableEntry {
  /** コレクション内のスラッグ */
  id: string;
  /** セッションかイベントか（色分けとバッジに使う） */
  kind: "session" | "event";
  title: string;
  /** 詳細ページへのリンク先 */
  href: string;
  /** 種別（"対話" "ワークショップ" など） */
  type: string;
  target: string;
  speaker?: string;
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
  entries: TimetableEntry[];
}

/** 左の時間軸に出す目盛り1つ分 */
export interface TimetableTick {
  /** "13:00" */
  label: string;
  /** CSS Grid の grid-row */
  row: number;
}

export interface TimetableData {
  columns: TimetableColumn[];
  ticks: TimetableTick[];
  /** 表全体の行数（grid-template-rows の repeat 回数） */
  totalRows: number;
  /** 1目盛りが何行分か（横罫線の間隔の計算に使う） */
  rowsPerTick: number;
  /** 表に置けたコマが1つもないか */
  isEmpty: boolean;
}

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
  const { startTime, endTime, tickMinutes, stepMinutes, slots } = timetableConfig;
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
    type: string;
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
      target: source.target,
      speaker: source.speaker,
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
      target: item.data.target,
      placement: item.data.timetable,
    });
  }

  const columns: TimetableColumn[] = slots.map((slot) => ({
    slot,
    entries: (buckets.get(slot.id) ?? []).sort((a, b) => a.rowStart - b.rowStart),
  }));

  const ticks: TimetableTick[] = [];
  for (let minutes = tableStart; minutes <= tableEnd; minutes += tickMinutes) {
    ticks.push({ label: toLabel(minutes), row: Math.floor((minutes - tableStart) / stepMinutes) + 1 });
  }

  return {
    columns,
    ticks,
    totalRows,
    rowsPerTick,
    isEmpty: columns.every((column) => column.entries.length === 0),
  };
}
