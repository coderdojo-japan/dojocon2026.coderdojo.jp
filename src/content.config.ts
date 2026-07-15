import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro:schema";

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
    // 種別（必須）。例: "セミナー" "パネルディスカッション" "対話"
    type: z.string(),
    // 登壇者（任意）
    speaker: z.string().optional(),
    // 対象（必須）。例: "メンター" "ニンジャ" "チャンピオン"
    target: z.string(),
    // アイキャッチ画像（任意）。未指定なら no_image.webp を使う
    image: z.string().optional(),
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
    // 種別（必須）。例: "展示" "ワークショップ" "企画"
    type: z.string(),
    // 対象（必須）
    target: z.string(),
    // 要申し込みかどうか（true でカードと詳細に「要申し込み」バッジを表示）
    needsReservation: z.boolean().default(false),
    // アイキャッチ画像（任意）。未指定なら no_image.webp を使う
    image: z.string().optional(),
    // 下書き
    draft: z.boolean().default(false),
  }),
});

export const collections = { news, sessions, events };
