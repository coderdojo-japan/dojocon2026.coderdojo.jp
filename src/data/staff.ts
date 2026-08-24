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
  { name: "天沼倫太郎", avatar: "/images/staff/amanuma.jpg", url: "https://coderdojo-takizawa.doorkeeper.jp/" },
  { name: "柳原央子" },
  { name: "日脇隆弘", avatar: "/images/staff/hiwaki.jpg" },
  { name: "細谷崇", avatar: "/images/staff/hosoya.jpeg", url: "https://ht79.info/" },
  { name: "石橋優希", avatar: "/images/staff/ishibashi.jpg", url: "https://www.dropin8.jp/owner" },
  { name: "井上一", avatar: "/images/staff/inoue.png", url: "https://xn--coderdojo-ef6q138l.jp/" },
  { name: "澤佳祐", avatar: "/images/staff/sawa.jpg", url: "https://coderdojo-tamachi.github.io/" },
  { name: "高田悠", avatar: "/images/staff/takada.jpg", url: "https://coderdojo-iwata.connpass.com/" },
  { name: "遠藤雅敬", avatar: "/images/staff/endou.jpg", url: "https://flyby.jp/" },
  { name: "吉川圭太", avatar: "/images/staff/yoshikawa.jpg", url: "https://deradesign.jp/" },
  { name: "横川裕隆", avatar: "/images/staff/yokokawa.png" },
  { name: "Jun1", avatar: "/images/staff/Jun1.jpg", url: "https://coderdojokibi.connpass.com/" },
  { name: "渕崎愛", avatar: "/images/staff/shinozaki.jpg", url: "https://deradesign.jp/" },
  { name: "Katz Ueno", avatar: "/images/staff/katzueno.jpg", url: "https://coderdojoowari.org/" },
  { name: "高井和之", avatar: "/images/staff/takai.jpg", url: "https://coderdojo-koga.hyasynth.com/" },
  { name: "土居安佳里", avatar: "/images/staff/doi.jpg", url: "https://akarihonokani.com/" },
  { name: "長嶺建市", avatar: "/images/staff/nagamine.jpg", url: "https://www.sstn.jp/" },
  { name: "井川健一", avatar: "/images/staff/igawa.jpg", url: "https://coderdojo-mito.com/" },
  { name: "若林健一", avatar: "/images/staff/kwaka1208.png", url: "https://crssrds.jp/" },
];
