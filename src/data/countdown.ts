/**
 * カウントダウン DojoCon Japan 2026（YouTube ライブ配信のアーカイブ）。
 * 回を追加するときはここに 1 行足すだけでトップページに反映される。
 * サムネイルは YouTube の videoId から自動で組み立てる。
 */
export interface CountdownEpisode {
  /** 回数（#1, #2 …） */
  number: number;
  /** 回のテーマ */
  title: string;
  /** 配信日（"YYYY.MM.DD"） */
  onAir: string;
  /** YouTube の動画 ID（watch?v= の後ろ） */
  videoId: string;
}

export const countdownEpisodes: CountdownEpisode[] = [
  { number: 1, title: "今年のテーマ", onAir: "2026.10.03", videoId: "lrayMf04c3M" },
  { number: 2, title: "セッション", onAir: "2026.10.11", videoId: "PyDHXX_FgW4" },
  { number: 3, title: "企画", onAir: "2026.10.18", videoId: "Pc3gV0cs1Jo" },
  { number: 4, title: "当日のご案内", onAir: "2026.10.25", videoId: "AXhTIc9YVSk" },
];

export const countdownPlaylistUrl = "https://www.youtube.com/@dojoconjapan/streams";

export const youtubeUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
export const youtubeThumbnail = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
