/**
 * スポンサー情報。確定したらここに追加する。
 * logo は public/images/sponsors/ などに画像を置いてパスを指定する。
 * 各 tier の配列が空のときは、その段はセクションに表示されない。
 */
export type Sponsor = {
  name: string;
  url: string;
  /** 例: "/images/sponsors/example.png"。未指定なら名前をテキスト表示 */
  logo?: string;
};

export type SponsorTier = {
  key: string;
  label: string;
  sponsors: Sponsor[];
};

export const sponsorTiers: SponsorTier[] = [
  { key: "gold", label: "Gold Sponsor", sponsors: [] },
  { key: "silver", label: "Silver Sponsor", sponsors: [] },
  { key: "bronze", label: "Bronze Sponsor", sponsors: [] },
  { key: "in-kind", label: "IN-KIND SPONSOR", sponsors: [] },
];
