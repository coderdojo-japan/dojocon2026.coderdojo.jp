import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro:schema";
import { programTypeNames } from "./data/programTypes";
import { programThemeNames } from "./data/programThemes";

/** "HH:MM"（24時間表記）だけを受け付ける */
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * タイムテーブル掲載用の情報（任意）。
 * 書かなければタイムテーブルには載らない（カード一覧には従来どおり表示される）。
 *   timetable:
 *     slot: ホール      # 場所。src/data/timetable.ts の slots にある id か name
 *     start: "13:00"    # 開始時刻（"HH:MM"。クォートを付ける）
 *     end: "14:30"      # 終了時刻（開始より後）
 */
const timetable = z
  .object({
    // 場所（表の横軸）。src/data/timetable.ts に登録した id または name を書く
    slot: z.string(),
    // 開始時刻
    start: z.string().regex(TIME_PATTERN, '開始時刻は "13:00" のように "HH:MM" で書いてください'),
    // 終了時刻
    end: z.string().regex(TIME_PATTERN, '終了時刻は "14:30" のように "HH:MM" で書いてください'),
  })
  .refine((v) => v.start < v.end, {
    message: "終了時刻は開始時刻より後にしてください",
    path: ["end"],
  });

/**
 * お知らせ（News）コレクション。
 * src/content/news/ に Markdown ファイルを置くと、自動でお知らせとして扱われる。
 * ファイル名（拡張子を除く）がそのまま URL のスラッグになる。
 *   例: src/content/news/2026-06-18-keynote.md → /news/2026-06-18-keynote
 */
const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    // 見出し（必須）
    title: z.string(),
    // 公開日（必須）。"2026-06-18" のような文字列を書けば日付に変換される
    date: z.coerce.date(),
    // カテゴリの表示名（任意・自由記入）。例: "お知らせ" "登壇者" "スタッフ募集"
    label: z.string().default("お知らせ"),
    // カテゴリの色グループ（任意・選択式）。名前が違っても同じ color なら同色で表示される。
    //   session=ピンク / event=紫 / sponsor=緑 / news=青（既定）/ highlight=黄
    color: z.enum(["session", "event", "sponsor", "news", "highlight"]).default("news"),
    // 下書き（true にすると本番ビルドで非表示にできる）
    draft: z.boolean().default(false),
  }),
});

/**
 * セッション（Session）コレクション。
 * src/content/sessions/ に Markdown ファイルを置く。ファイル名がスラッグになる。
 *   例: src/content/sessions/sample-session.md → /sessions/sample-session
 */
const sessions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sessions" }),
  schema: z.object({
    // タイトル（必須）
    title: z.string(),
    // 種別（必須・択一）。src/data/programTypes.ts にある種別のどれか。例: "対話" "聴講"
    type: z.enum(programTypeNames),
    // テーマ（任意・択一）。src/data/programThemes.ts にあるテーマのどれか
    // タイムテーブルを theme で色分けするときに使う（src/data/timetable.ts の colorBy）
    theme: z.enum(programThemeNames).optional(),
    // 登壇者など（任意）。見出しは種別で変わる（対話なら「話題提供」。src/data/programTypes.ts）
    speaker: z.string().optional(),
    // 対象（必須）。例: "メンター" "ニンジャ" "チャンピオン"
    target: z.string(),
    // アイキャッチ画像（任意）。未指定なら no_image.webp を使う
    image: z.string().optional(),
    // タイムテーブル掲載情報（任意。未記入ならタイムテーブルには載らない）
    timetable: timetable.optional(),
    // 下書き
    draft: z.boolean().default(false),
  }),
});

/**
 * イベント（Event）コレクション。
 * src/content/events/ に Markdown ファイルを置く。ファイル名がスラッグになる。
 */
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    // タイトル（必須）
    title: z.string(),
    // 種別（必須・択一）。セッションと同じく src/data/programTypes.ts にある種別のどれか
    type: z.enum(programTypeNames),
    // テーマ（任意・択一）。セッションの theme と同じ使い方
    theme: z.enum(programThemeNames).optional(),
    // 出展者など（任意）。見出しは種別で変わる（展示なら「担当」。src/data/programTypes.ts）
    speaker: z.string().optional(),
    // 対象（必須）
    target: z.string(),
    // 要申し込みかどうか（true でカードと詳細に「要申し込み」バッジを表示）
    needsReservation: z.boolean().default(false),
    // アイキャッチ画像（任意）。未指定なら no_image.webp を使う
    image: z.string().optional(),
    // タイムテーブル掲載情報（任意。未記入ならタイムテーブルには載らない）
    timetable: timetable.optional(),
    // 下書き
    draft: z.boolean().default(false),
  }),
});

export const collections = { news, sessions, events };
