/**
 * Markdown 本文から meta description 用の抜粋（プレーンテキスト）を作る。
 * 記事ごとに手で description を書かなくても、本文の冒頭から自動生成する。
 *   - 見出し記号・強調・リンク・画像・コード・引用などの記法を取り除く
 *   - 改行や連続スペースを 1 つの空白にまとめる
 *   - 指定文字数を超えたら末尾を「…」で省略する
 *
 * @param body  記事の生 Markdown（コレクションエントリの item.body）
 * @param max   最大文字数（既定 120）。検索結果・SNSシェアの説明文に収まる長さ
 */
export function excerpt(body: string | undefined, max = 120): string {
  const text = (body ?? "")
    // コードブロックを丸ごと除去
    .replace(/```[\s\S]*?```/g, " ")
    // 画像 ![alt](url) を除去
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    // リンク [text](url) は表示テキストだけ残す
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // 見出し・引用・リスト記号を行頭から除去
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    // 強調・インラインコードの記号を除去
    .replace(/[*_`~]/g, "")
    // 水平線を除去
    .replace(/^\s*([-*_])\1{2,}\s*$/gm, " ")
    // 残った HTML タグを除去
    .replace(/<[^>]+>/g, " ")
    // 改行・連続空白を 1 つの空白に
    .replace(/\s+/g, " ")
    .trim();

  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}
