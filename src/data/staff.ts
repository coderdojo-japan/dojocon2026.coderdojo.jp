/**
 * スタッフ情報。確定したらここに追加する。
 * avatar は public/images/staff/ などに画像を置いてパスを指定する。
 * 配列が空のときは「準備中」と表示される。
 */
export type Staff = {
  name: string;
  /** 役割（任意）。例: "実行委員長" */
  role?: string;
  /** 例: "/images/staff/example.png"。未指定なら頭文字を表示 */
  avatar?: string;
  /** プロフィール等へのリンク（任意） */
  url?: string;
};

export const staff: Staff[] = [];
