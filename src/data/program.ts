/**
 * セッション・イベントのプログラム情報。確定したらここに追加する。
 * 配列が空のときは各セクションに「準備中」と表示される。
 */
export type ProgramItem = {
  title: string;
  /** 登壇者・出演者など（任意） */
  speaker?: string;
  /** 概要（任意） */
  description?: string;
  /** カード画像（任意）。例: "/images/sessions/example.png" */
  image?: string;
  /** 詳細リンク（任意） */
  url?: string;
};

/** セッション（登壇・発表） */
export const sessions: ProgramItem[] = [];

/** イベント（ワークショップ・体験など） */
export const events: ProgramItem[] = [];
