/**
 * スタッフ情報。確定したらここに追加する。
 * avatar は public/images/staff/ に画像を置いてパスを指定する。
 * 未指定なら staff_noimage.webp（フォールバック）を表示する。
 * url を指定するとカードがリンクになる。配列が空のときは「準備中」と表示。
 */
export type Staff = {
  name: string;
  /** 役割（任意）。例: "実行委員長" */
  role?: string;
  /** 例: "/images/staff/example.png"。未指定なら staff_noimage.webp */
  avatar?: string;
  /** プロフィール等へのリンク（任意）。指定するとカードがリンクになる */
  url?: string;
};

/** スタッフ画像が未設定のときのフォールバック */
export const STAFF_NO_IMAGE = "/images/staff/staff_noimage.webp";

// NOTE: 一部はモック確認用のダミー名です。実データに合わせて調整してください。
export const staff: Staff[] = [
  { name: "若林健一", avatar: "/images/staff/kwaka1208.png" },
  { name: "細谷崇", avatar: "/images/staff/hosoya.jpeg" },
  { name: "Katz Ueno" },
  { name: "森崎詩穂" },
  { name: "安川要平" },
  { name: "井上一" },
  { name: "あすか" },
  { name: "おごもり" },
  { name: "とがその" },
  { name: "橋立千賀子" },
  { name: "渕崎愛" },
  { name: "天沼倫太郎" },
];
