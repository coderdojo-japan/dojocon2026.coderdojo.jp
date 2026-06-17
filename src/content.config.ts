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
    // カテゴリ（任意）。例: "お知らせ" "登壇者" "セッション"
    category: z.string().default("お知らせ"),
    // 下書き（true にすると本番ビルドで非表示にできる）
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
