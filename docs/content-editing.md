# :memo: コンテンツ編集ガイド

「サイトの○○を直したい」ときに、**どのファイルを編集すればよいか**をまとめたガイドです。
プログラミングに詳しくなくても、ここを見れば主要なコンテンツを更新できます。

> 編集の流れ（共通）
>
> 1. `npm run dev` で開発サーバーを起動（http://localhost:4321/）
> 2. 下記の該当ファイルを編集して保存 → 画面が自動で更新される
> 3. 問題なければコミットして push（→ 自動で公開）
>
> Astro の基本操作は [Astro 入門スライド](./astro-onboarding.md) を参照してください。
> デザインを実装する（見た目をコードで変える・セクションを足す）場合は
> [構成と仕組み（コーダー向け）](./architecture.md) を参照してください。

<br>

## どこに何があるか（早見表）

| やりたいこと                               | 編集するファイル                                          |
| ------------------------------------------ | --------------------------------------------------------- |
| 開催日・会場・テーマ・各種リンク           | `src/data/site.ts`                                        |
| お知らせ（News）を追加・編集               | `src/content/news/` に Markdown を追加                    |
| セッションを追加・編集                     | `src/content/sessions/` に Markdown を追加                |
| イベントを追加・編集                       | `src/content/events/` に Markdown を追加                  |
| タイムテーブルに載せる・時間や場所を変える | 各セッション / イベントの Markdown に `timetable:` を追記 |
| タイムテーブルの時間の範囲・場所の並び順   | `src/data/timetable.ts`                                   |
| スポンサーを追加                           | `src/data/sponsors.ts`                                    |
| スタッフを追加                             | `src/data/staff.ts`                                       |
| 基調講演の登壇者情報                       | `src/data/keynote.ts`                                     |
| 各セクションの説明文                       | `src/components/sections/` の各ファイル                   |
| セクションの並び順                         | `src/pages/index.astro`                                   |
| ヘッダーのナビゲーション                   | `src/components/Header.astro`                             |
| 固定ページ（規約など）を追加               | `src/pages/` に Markdown を追加（`SingleLayout` を使う）  |

> このサイトのデザインは **FLOCSS 設計の SCSS**（`src/styles/scss/`）で組まれています。
> 文章・データを直すだけなら SCSS を触る必要はありません。`class="..."` はそのままにしてください。

<br>

## 1. 開催情報を変更する — `src/data/site.ts`

開催日・会場・テーマ・SNS リンクなどは、このファイルに集約されています。
**ここを直すとサイト全体（トップ・概要・フッターなど）に反映されます。**

```ts
export const site = {
  title: "DojoCon Japan 2026 in 岩手",
  shortTitle: "DojoCon Japan 2026",
  theme: "わかちあう、わかりあう",
  description: "...", // meta description / OGP に使われる
  event: {
    dateLabel: "2026.11.01 SUN",
    timeLabel: "10:00 - 17:00",
    isFree: true,
    venueName: "プラザおでって",
    venueArea: "岩手県盛岡市",
    venueUrl: "https://www.odette.or.jp/plaza-odette/",
  },
  links: {
    x: "https://x.com/CoderDojoJapan",
    // ...
  },
} as const;
```

`"..."` で囲まれた部分（値）だけを書き換えてください。項目名やカンマ・記号は触らないこと。

> 開催概要（Outline）セクションの日時・会場テキストは現在デザイン優先で
> `src/components/sections/Outline.astro` に直書きしています。ここを変えるときはその
> ファイルを編集してください。

<br>

## 2. お知らせ（News）を追加・編集する — Markdown

`src/content/news/` に Markdown ファイルを 1 つ追加すると、それが 1 件のお知らせになります。
トップの News 欄・`/news/` 一覧・個別記事ページが**自動で生成**されます。

### 手順

1. `src/content/news/` に新しいファイルを作る
   - ファイル名は `2026-07-01-session-call.md` のように **`日付-内容.md`** がおすすめ
   - ファイル名（`.md` を除いた部分）がそのまま URL になります
2. 次のテンプレートを貼り付けて編集する

```markdown
---
title: お知らせのタイトル
date: 2026-07-01
label: お知らせ
color: news
---

ここに本文を **Markdown** で書きます。

- 箇条書きも使えます
- [リンク](https://example.com) も書けます
```

### frontmatter（先頭の `---` で囲んだ部分）

| 項目    | 必須 | 説明                                                                           |
| ------- | ---- | ------------------------------------------------------------------------------ |
| `title` | ○    | 見出し                                                                         |
| `date`  | ○    | 公開日。`2026-07-01` の形式                                                    |
| `label` | -    | カテゴリの**表示名**（自由記入）。例: お知らせ / 登壇者 / スタッフ募集。省略可 |
| `color` | -    | カテゴリの**色**（下記の5つから選ぶ）。省略時は `news`（青）                   |
| `draft` | -    | `true` にすると本番サイトで非表示（書きかけの記事を隠せる）                    |

**`color` の選択肢（バッジの色）** — 名前（`label`）が違っても、同じ `color` なら同じ色で表示されます。

| color       | 色         | 使いどころの例                   |
| ----------- | ---------- | -------------------------------- |
| `session`   | ピンク     | セッション・登壇者関連           |
| `event`     | 紫         | イベント・ワークショップ関連     |
| `sponsor`   | 緑         | スポンサー関連                   |
| `news`      | 青（既定） | その他のお知らせ全般             |
| `highlight` | 黄         | 特に目立たせたいお知らせ（予備） |

> 本文の Markdown 記法は [Markdown 早見表](https://www.markdownguide.org/cheat-sheet/) が参考になります。

<br>

## 3. セッションを追加する — `src/content/sessions/` に Markdown

セッションも 1 ファイル＝1 件です。`/sessions/` 一覧・個別ページ・トップの Session 欄が自動生成されます。
**1 件も無い間は「準備中」と表示されます。**

```markdown
---
title: Scratch ではじめる creative coding
type: セミナー
theme: ふかめる
speaker: 山田 太郎（CoderDojo 盛岡）
target: メンター
image: /images/sessions/creative-coding.png
timetable:
  slot: ホール
  start: "13:00"
  end: "14:30"
draft: false
---

ここにセッションの説明を Markdown で書きます。
```

| 項目        | 必須 | 説明                                                                                                  |
| ----------- | ---- | ----------------------------------------------------------------------------------------------------- |
| `title`     | ○    | タイトル                                                                                              |
| `type`      | ○    | 種別。**決められた種別から1つ選ぶ**（→ 下記「種別と speaker の見出し」）                              |
| `theme`     | -    | テーマ。**決められたテーマから1つ選ぶ**（→ 下記「テーマ」）。タイムテーブルの色分けに使う             |
| `speaker`   | -    | 登壇者など。カードでの見出しは種別で変わる（対話なら「話題提供：」）                                  |
| `target`    | ○    | 対象。例: メンター / ニンジャ / チャンピオン                                                          |
| `image`     | -    | カード・アイキャッチ画像。**省略すると `no_image` になる**                                            |
| `timetable` | -    | タイムテーブルに載せる時間と場所（→ 下記「5. タイムテーブルに載せる」）。**省略すると表には載らない** |
| `draft`     | -    | `true` で本番非表示                                                                                   |

<br>

## 4. イベントを追加する — `src/content/events/` に Markdown

セッションとほぼ同じですが、`needsReservation`（要申し込み）が加わります。

```markdown
---
title: micro:bit ではじめる電子工作ワークショップ
type: ワークショップ
speaker: CoderDojo 盛岡
target: ニンジャ
needsReservation: true
image: /images/events/microbit.png
timetable:
  slot: ワークショップ
  start: "10:30"
  end: "12:00"
draft: false
---

ここにイベントの説明を Markdown で書きます。
```

| 項目               | 必須 | 説明                                                                                                  |
| ------------------ | ---- | ----------------------------------------------------------------------------------------------------- |
| `title`            | ○    | タイトル                                                                                              |
| `type`             | ○    | 種別。セッションと同じく**決められた種別から1つ選ぶ**                                                 |
| `theme`            | -    | テーマ。セッションと同じく**決められたテーマから1つ選ぶ**                                             |
| `speaker`          | -    | 出展者など。カードでの見出しは種別で変わる（展示なら「担当：」）                                      |
| `target`           | ○    | 対象                                                                                                  |
| `needsReservation` | -    | `true` でカード・詳細に「要申し込み」バッジが付く（既定 false）                                       |
| `image`            | -    | 画像。省略すると `no_image`                                                                           |
| `timetable`        | -    | タイムテーブルに載せる時間と場所（→ 下記「5. タイムテーブルに載せる」）。**省略すると表には載らない** |
| `draft`            | -    | `true` で本番非表示                                                                                   |

### 種別（speaker の見出しと色） — `src/data/programTypes.ts`

セッション / イベントの `type` には、次の種別のどれか1つを書きます。**一覧にない種別を書くと、`npm run dev` / ビルドがエラーで止まります。**
`speaker` を書くと、カードには種別に応じた見出しで表示されます。

| `type`         | `speaker` の見出し |
| -------------- | ------------------ |
| ワークショップ | ファシリテーター   |
| 対話           | 話題提供           |
| 聴講           | 登壇               |
| セミナー       | 登壇               |
| 展示           | 担当               |
| イベント       | 担当               |
| セッション     | 担当               |

種別を増やす・見出しや色を変えるときは、`src/data/programTypes.ts` の一覧を編集します。
1 行が 1 種別で、**種別名・`speaker` の見出し・色をセットで書きます**。色はタイムテーブルを種別で色分けするとき（→「コマの色分けを変える」）に使います。

```ts
export const programTypes = [
  { name: "ワークショップ", speakerLabel: "ファシリテーター", color: "#89c3a0" },
  { name: "対話", speakerLabel: "話題提供", color: "#ee859a" },
  // 追加するときは同じ形で1行足す
] as const satisfies readonly { name: string; speakerLabel: string; color: string }[];
```

### テーマ（と色） — `src/data/programThemes.ts`

セッション / イベントの `theme`（任意）には、`src/data/programThemes.ts` にあるテーマのどれか1つを書きます。**一覧にないテーマを書くと、`npm run dev` / ビルドがエラーで止まります。**
1 行が 1 テーマで、**テーマ名と色をセットで書きます**。色はタイムテーブルをテーマで色分けするときに使います。

```ts
export const programThemes = [
  { name: "わかちあう", color: "#f0a33a" },
  { name: "はじめる", color: "#00b1a9" },
  { name: "つづける", color: "#89c3a0" },
  { name: "ふかめる", color: "#ee859a" },
  { name: "ひろげる", color: "#9699cb" },
] as const satisfies readonly { name: string; color: string }[];
```

各テーマの内容は次のとおりです。セッション / イベントを追加するときは、内容に合うものを選んでください。

| `theme`    | 内容                                           |
| ---------- | ---------------------------------------------- |
| わかちあう | 基調ワークショップなど、全員が対象のプログラム |
| はじめる   | 道場の立ち上げ・これから関わる人向けの基本     |
| つづける   | 運営やメンターを無理なく続けるための工夫       |
| ふかめる   | ニンジャの学びや道場の中での関わりを深める     |
| ひろげる   | 地域・社会・これからの時代へ視野を広げる       |

<br>

## 5. タイムテーブルに載せる — 各 Markdown ＋ `src/data/timetable.ts`

`/timetable` のタイムテーブル（時間割表）は、**セッション / イベントの Markdown を集めて自動で組み立てられます**。
専用の一覧ファイルはありません。載せたいものの Markdown に `timetable:` を書き足すだけです。

### 表に 1 コマ載せる

```markdown
---
title: Scratch ではじめる creative coding
type: セミナー
target: メンター
timetable:
  slot: ホール
  start: "13:00"
  end: "14:30"
draft: false
---
```

| 項目    | 必須 | 説明                                                         |
| ------- | ---- | ------------------------------------------------------------ |
| `slot`  | ○    | 場所（表の横の列）。`src/data/timetable.ts` にある名前を書く |
| `start` | ○    | 開始時刻。`"13:00"` のように **`"HH:MM"`（24時間表記）**     |
| `end`   | ○    | 終了時刻。開始より後にすること                               |

**注意点**

- **`timetable:` を書かなければ、表には載りません。** セッション / イベントの一覧カードには従来どおり表示されます。「まだ時間が決まっていない」ものは書かずに置いておけば大丈夫です
- **時刻は必ずクォート（`"`）で囲んでください。** `start: 13:00` とクォートなしで書いたり、`end` を `start` より前にしたりすると、**`npm run dev` / ビルドがエラーで止まり**、どのファイルのどこが悪いか教えてくれます。慌てずメッセージのとおりに直してください
- 次の 3 つは**エラーにならず、ターミナルに `[timetable]` で始まる警告が出るだけ**です。表に出ないときはターミナルを確認してください
  - `slot` に `src/data/timetable.ts` に無い場所名を書いた → **そのコマは表から外れます**
  - `start` / `end` が表の範囲（既定 10:00〜17:00）からはみ出している → **そのコマは表から外れます**
  - 同じ場所で時間が重なっている → 警告は出ますが**表には両方描かれ、重なって表示されます**

### 表の枠組みを変える — `src/data/timetable.ts`

「表の上端と下端の時刻」「どんな場所を、どの順番で横に並べるか」は、このファイルにまとまっています。

```ts
export const timetableConfig: TimetableConfig = {
  startTime: "10:00", // 表の上端の時刻
  endTime: "17:00", // 表の下端の時刻
  tickMinutes: 30, // 左の時間軸に目盛りを入れる間隔（分）
  stepMinutes: 5, // コマの高さ・位置の最小単位（分）

  slots: [
    { id: "hall", name: "ホール", color: "#00b1a9" },
    { id: "room-a", name: "大会議室A", color: "#ee859a" },
    { id: "room-b", name: "大会議室B", color: "#9699cb" },
    { id: "workshop", name: "ワークショップ", color: "#89c3a0" },
  ],
};
```

- **`slots` に並べた順番が、そのまま表の左から右の順番**になります。部屋を足す・並べ替えるときはこの配列を編集します
- 1 行が 1 場所で、**`id`・表示名（`name`）・色（`color`）をセットで書きます**。色は場所で色分けするときに使います
- Markdown の `slot:` には、`id`（`hall`）と `name`（`ホール`）の**どちらを書いても構いません**
- `name` の後ろに `note: "3F"` を足すと、見出しの下に補足として表示されます
- まだ 1 コマも入っていない場所も、`slots` に書いてあれば**空の列として表示**されます
- 1 コマも `timetable:` が書かれていない間は、ページ全体が「タイムテーブルは準備中です。」の表示になります

### コマの色分けを変える — `colorBy`

コマの色を「場所」「種別」「テーマ」のどれで分けるかを、同じファイルの `colorBy` で選べます。

```ts
  colorBy: "type", // "slot"（場所）/ "type"（種別）/ "theme"（テーマ）
```

| `colorBy` | 何で分けるか        | 色の定義                                      |
| --------- | ------------------- | --------------------------------------------- |
| `"slot"`  | 場所                | `src/data/timetable.ts` の `slots` の `color` |
| `"type"`  | Markdown の `type`  | `src/data/programTypes.ts` の `color`         |
| `"theme"` | Markdown の `theme` | `src/data/programThemes.ts` の `color`        |

- `"theme"` のとき、**`theme` を書いていないコマはグレー（「テーマなし」）**になります
- `"type"` / `"theme"` のときは、表の上に**色の凡例**が出ます。列の見出しは場所を区別しないメインカラーになります

> **現在の部屋名は仮です。** 会場のレイアウトが決まったら `src/data/timetable.ts` の `slots` を実際の部屋名に差し替えてください（ファイル内に TODO コメントがあります）。
> 差し替えたら、各 Markdown の `slot:` も合わせて直すのを忘れずに。

<br>

## 6. スポンサーを追加する — `src/data/sponsors.ts`

tier（Gold / Silver / Bronze / In-Kind / Individual）ごとの `sponsors` 配列に追記します。
**1 件も登録がない tier は表示されません。**

```ts
export const sponsorTiers: SponsorTier[] = [
  {
    key: "gold",
    title: "Gold Sponsor",
    subtitle: "ゴールドスポンサー",
    display: "logo", // "logo"=ロゴ画像で表示 / "name"=名前テキストで表示（個人向け）
    sponsors: [{ name: "Example Inc.", url: "https://example.com", logo: "/images/sponsors/example.png" }],
  },
  // ...
];
```

- ロゴ画像は `public/images/sponsors/` に置き、`logo` にそのパスを書きます
- 個人スポンサー（`display: "name"`）は `logo` 不要。`url` があればリンクになります
- 現在は Diamond / Platinum 上位ティアは未使用ですが、`sponsorTiers` の先頭に足せば拡張できます

<br>

## 7. スタッフを追加する — `src/data/staff.ts`

`staff` 配列に追記します。**配列が空の間は「準備中」と表示されます。**

```ts
export const staff: Staff[] = [
  {
    name: "山田 太郎",
    role: "実行委員長", // 任意
    avatar: "/images/staff/yamada.png", // 任意。未指定なら no_image を表示
    url: "https://example.com", // 任意。指定するとカードがリンクになる
  },
];
```

アバター画像は `public/images/staff/` に置くのがおすすめです（未指定なら `staff_noimage.webp`）。

<br>

## 8. 基調講演を変更する — `src/data/keynote.ts`

```ts
export const keynote = {
  name: "上田 信行 / ウエダ ノブユキ",
  role: "同志社女子大学名誉教授、ネオミュージアム館長",
  profile: [
    "1段落目の紹介文…",
    "2段落目の紹介文…", // 段落ごとに配列で足す
  ],
  imageSp: "/images/front/keynote_ueda_sp.webp", // スマホ用の顔写真
  imagePc: "/images/front/keynote_ueda.webp", // PC 用の背景写真
  moreUrl: "#", // 「基調講演を詳しくみる」のリンク先
} as const;
```

写真は `public/images/front/` に置いてパスを指定します。

<br>

## 9. 各セクションの文章を直す — `src/components/sections/`

「コーダー道場とは？」などの説明文は、それぞれのセクションファイルにあります。

| セクション                        | ファイル                                   |
| --------------------------------- | ------------------------------------------ |
| ヒーロー（最上部）                | `src/components/sections/Hero.astro`       |
| テーマ紹介                        | `src/components/sections/Theme.astro`      |
| 開催概要                          | `src/components/sections/Outline.astro`    |
| コーダー道場とは？/ DojoConとは？ | `src/components/sections/About.astro`      |
| お問い合わせ                      | `src/components/sections/Contact.astro`    |
| 主催・後援                        | `src/components/sections/Organizers.astro` |

`---` で囲まれた部分より下の、日本語の文章を書き換えてください。
HTML タグ（`<p>` など）や `class="..."` の部分は触らないのが安全です。

<br>

## 10. セクションの並び順を変える・消す — `src/pages/index.astro`

トップページは、セクションを縦に並べているだけです。
順番を入れ替えたり、不要なセクションの行を消したり（コメントアウトしたり）できます。

```astro
<main id="home">
  <Hero />
  <Theme />
  <Outline />
  <News />
  <Keynote />
  <!-- <Sponsors />  ← 行頭に コメント記号を付けると一時的に非表示にできます -->
</main>
```

<br>

## 11. 固定ページ（規約など）を追加する — `src/pages/` に Markdown

プライバシーポリシー・行動規範のような「タイトル＋文章」のページは、Markdown で作れます。
`src/pages/privacy.md` / `src/pages/code-of-conduct.md` が実例です。

```markdown
---
layout: ../layouts/SingleLayout.astro
title: ページタイトル
description: このページの説明（meta / OGP に使われる）
---

ここに本文を Markdown で書きます。見出し・リスト・リンクなどに自動でスタイルが当たります。
```

- ファイル名がそのまま URL になります（`src/pages/about.md` → `/about`）
- 作ったページへのリンクは、ヘッダー（`Header.astro`）やフッター（`Footer.astro`）に足します

---

困ったときは [README](../README.md) や [Astro 入門スライド](./astro-onboarding.md)、
[Astro 公式ドキュメント（日本語）](https://docs.astro.build/ja/) を参照してください。
