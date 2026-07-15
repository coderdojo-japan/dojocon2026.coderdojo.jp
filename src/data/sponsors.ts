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
    sponsors: [
      { name: "企業名", url: "#", logo: "/images/sponsors/gold_logo.png" },
      { name: "企業名", url: "#", logo: "/images/sponsors/gold_logo2.png" },
    ],
  },
  {
    key: "silver",
    title: "Silver Sponsor",
    subtitle: "シルバースポンサー",
    display: "logo",
    sponsors: [
      { name: "企業名", url: "#", logo: "/images/sponsors/silver_logo.png" },
      { name: "企業名", url: "#", logo: "/images/sponsors/silver_logo.png" },
    ],
  },
  {
    key: "bronze",
    title: "Bronze Sponsor",
    subtitle: "ブロンズスポンサー",
    display: "logo",
    sponsors: [
      { name: "企業名", url: "#", logo: "/images/sponsors/bronze_logo.png" },
      { name: "企業名", url: "#", logo: "/images/sponsors/bronze_logo.png" },
      { name: "企業名", url: "#", logo: "/images/sponsors/bronze_logo.png" },
      { name: "企業名", url: "#", logo: "/images/sponsors/bronze_logo.png" },
    ],
  },
  {
    key: "inkind",
    title: "In-Kind Sponsor",
    subtitle: "インカインドスポンサー",
    display: "logo",
    sponsors: [
      { name: "企業名", url: "#", logo: "/images/sponsors/bronze_logo.png" },
      { name: "企業名", url: "#", logo: "/images/sponsors/bronze_logo.png" },
      { name: "企業名", url: "#", logo: "/images/sponsors/bronze_logo.png" },
      { name: "企業名", url: "#", logo: "/images/sponsors/bronze_logo.png" },
    ],
  },
  {
    key: "individual",
    title: "Individual Sponsor",
    subtitle: "個人スポンサー",
    display: "name",
    sponsors: [{ name: "細谷崇", url: "#" }, { name: "山田花子" }, { name: "田中太郎", url: "#" }],
  },
];
