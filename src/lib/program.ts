import { getCollection } from "astro:content";

/** カード画像が未設定のときのフォールバック画像 */
export const SESSION_NO_IMAGE = "/images/sessions/no_image.webp";
export const EVENT_NO_IMAGE = "/images/events/no_image.webp";

/**
 * 公開対象のセッションを取得する。
 * - draft: true の記事は本番ビルドでは除外（開発中は表示）
 * @param limit 取得件数の上限（省略時は全件）
 */
export async function getSessions(limit?: number) {
  const items = await getCollection("sessions", ({ data }) => {
    return import.meta.env.DEV || !data.draft;
  });

  items.sort((a, b) => a.data.title.localeCompare(b.data.title, "ja"));

  return limit ? items.slice(0, limit) : items;
}

/**
 * 公開対象のイベントを取得する。
 * - draft: true の記事は本番ビルドでは除外（開発中は表示）
 * @param limit 取得件数の上限（省略時は全件）
 */
export async function getEvents(limit?: number) {
  const items = await getCollection("events", ({ data }) => {
    return import.meta.env.DEV || !data.draft;
  });

  items.sort((a, b) => a.data.title.localeCompare(b.data.title, "ja"));

  return limit ? items.slice(0, limit) : items;
}
