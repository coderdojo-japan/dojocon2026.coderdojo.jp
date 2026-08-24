/**
 * スポンサー情報。確定したらここに追加する。
 * logo は public/images/sponsors/ に画像を置いてパスを指定する。
 * 各 tier の sponsors 配列が空のときは、その段はセクションに表示されない。
 * すべて空のときは「募集中」メッセージを表示する。
 *
 * ティアは上位から Diamond → Platinum → Gold → Silver → Bronze → In-Kind → Individual。
 * 上位ティア（Diamond / Platinum）を追加する場合は、この配列の先頭に足し、
 * ロゴ表示サイズを変えたいときは _front.scss に .p-sponsor__logos--<key> を1つ追加する。
 */
export type Sponsor = {
  name: string;
  /** リンク先（任意）。個人スポンサーで未指定ならテキストのみ表示 */
  url?: string;
  /** 例: "/images/sponsors/example.png"。ロゴ表示ティアでは必須 */
  logo?: string;
};

export type SponsorTier = {
  /** クラス修飾子・識別子。例: "gold"（.p-sponsor__logos--gold に対応） */
  key: string;
  /** 英語表記の見出し。例: "Gold Sponsor" */
  title: string;
  /** 日本語表記の見出し。例: "ゴールドスポンサー" */
  subtitle: string;
  /** "logo"=ロゴグリッド表示 / "name"=名前リスト表示（個人スポンサー） */
  display: "logo" | "name";
  sponsors: Sponsor[];
};

// NOTE: 以下はモックデザイン確認用のダミーです。実スポンサーが確定したら差し替え、
//       未確定の段は sponsors を [] にすると非表示になります。
export const sponsorTiers: SponsorTier[] = [
  {
    key: "gold",
    title: "Gold Sponsor",
    subtitle: "ゴールドスポンサー",
    display: "logo",
    sponsors: [],
  },
  {
    key: "silver",
    title: "Silver Sponsor",
    subtitle: "シルバースポンサー",
    display: "logo",
    sponsors: [
      {
        name: "さくらインターネット株式会社",
        url: "https://www.sakura.ad.jp/",
        logo: "/images/sponsors/sakura-internet.svg",
      },
      { name: "株式会社Geolonia", url: "https://www.geolonia.com/", logo: "/images/sponsors/geolonia.svg" },
    ],
  },
  {
    key: "bronze",
    title: "Bronze Sponsor",
    subtitle: "ブロンズスポンサー",
    display: "logo",
    sponsors: [
      {
        name: "アールスリーインスティテュート",
        url: "https://www.r3it.com/",
        logo: "/images/sponsors/r3-institute.svg",
      },
      { name: "特定非営利活動法人codeMo", url: "https://codemo.jp/", logo: "/images/sponsors/codemo.webp" },
      {
        name: "株式会社ソニックガーデン",
        url: "https://www.sonicgarden.jp/",
        logo: "/images/sponsors/sonic-garden.webp",
      },
      {
        name: "キッズAIプログラミングスクール ハック",
        url: "https://8x9.jp/",
        logo: "/images/sponsors/89.svg",
      },
    ],
  },
  {
    key: "inkind",
    title: "In-Kind Sponsor",
    subtitle: "インカインドスポンサー",
    display: "logo",
    sponsors: [
      { name: "YassLab 株式会社", url: "https://yasslab.jp/", logo: "/images/sponsors/yasslab.webp" },
      { name: "Backlog 株式会社ヌーラボ", url: "https://backlog.com/ja/", logo: "/images/sponsors/backlog.svg" },
    ],
  },
  {
    key: "individual",
    title: "Individual Sponsor",
    subtitle: "個人スポンサー",
    display: "name",
    sponsors: [{ name: "細谷崇", url: "https://ht79.info/" }],
  },
];
