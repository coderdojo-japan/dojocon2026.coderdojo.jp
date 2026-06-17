import { getCollection } from "astro:content";

/**
 * 公開対象のお知らせを、日付の新しい順で取得する。
 * - draft: true の記事は本番ビルドでは除外（開発中は表示）
 * @param limit 取得件数の上限（省略時は全件）
 */
export async function getNews(limit?: number) {
  const posts = await getCollection("news", ({ data }) => {
    return import.meta.env.DEV || !data.draft;
  });

  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return limit ? posts.slice(0, limit) : posts;
}

/** 日付を「2026.06.18」形式の文字列にする */
export function formatNewsDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}
