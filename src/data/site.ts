/**
 * サイト・イベントの基本情報（単一の情報源）。
 * 開催日や会場などを変えるときは、まずここを直せば全体に反映される。
 */
export const site = {
  title: "DojoCon Japan 2026 in 岩手",
  shortTitle: "DojoCon Japan 2026",
  theme: "わかちあう、わかりあう",
  description:
    "DojoCon Japan とは日本の CoderDojo コミュニティメンバーが全国から集まるカンファレンスイベント (CoderDojo Conference) です。2026年11月1日（日）、岩手県盛岡市 プラザおでってで開催します。",

  event: {
    dateLabel: "2026.11.01 SUN",
    dateText: "2026年11月1日（日）",
    timeLabel: "10:00 - 17:00",
    isFree: true,
    venueName: "プラザおでって",
    venueArea: "岩手県盛岡市",
    venueUrl: "https://www.odette.or.jp/plaza-odette/",
  },

  links: {
    dojoconJapan: "https://dojocon.coderdojo.jp/",
    coderdojoJapan: "https://coderdojo.jp/",
    coderdojoFoundation: "https://coderdojo.com/",
    x: "https://x.com/CoderDojoJapan",
    github: "https://github.com/coderdojo-japan/dojocon2026.coderdojo.jp",
  },
} as const;
