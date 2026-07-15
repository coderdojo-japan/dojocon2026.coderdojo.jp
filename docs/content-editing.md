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

| やりたいこと                     | 編集するファイル                                         |
| -------------------------------- | -------------------------------------------------------- |
| 開催日・会場・テーマ・各種リンク | `src/data/site.ts`                                       |
| お知らせ（News）を追加・編集     | `src/content/news/` に Markdown を追加                   |
| セッションを追加・編集           | `src/content/sessions/` に Markdown を追加               |
| イベントを追加・編集             | `src/content/events/` に Markdown を追加                 |
| スポンサーを追加                 | `src/data/sponsors.ts`                                   |
| スタッフを追加                   | `src/data/staff.ts`                                      |
| 基調講演の登壇者情報             | `src/data/keynote.ts`                                    |
| 各セクションの説明文             | `src/components/sections/` の各ファイル                  |
| セクションの並び順               | `src/pages/index.astro`                                  |
| ヘッダーのナビゲーション         | `src/components/Header.astro`                            |
| 固定ページ（規約など）を追加     | `src/pages/` に Markdown を追加（`SingleLayout` を使う） |

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
speaker: 山田 太郎（CoderDojo 盛岡）
target: メンター
image: /images/sessions/creative-coding.png
draft: false
---

ここにセッションの説明を Markdown で書きます。
```

| 項目      | 必須 | 説明                                                       |
| --------- | ---- | ---------------------------------------------------------- |
| `title`   | ○    | タイトル                                                   |
| `type`    | ○    | 種別。例: セミナー / パネルディスカッション / 対話         |
| `speaker` | -    | 登壇者                                                     |
| `target`  | ○    | 対象。例: メンター / ニンジャ / チャンピオン               |
| `image`   | -    | カード・アイキャッチ画像。**省略すると `no_image` になる** |
| `draft`   | -    | `true` で本番非表示                                        |

<br>

## 4. イベントを追加する — `src/content/events/` に Markdown

セッションとほぼ同じですが、`speaker` の代わりに `needsReservation`（要申し込み）があります。

```markdown
---
title: micro:bit ではじめる電子工作ワークショップ
type: ワークショップ
target: ニンジャ
needsReservation: true
image: /images/events/microbit.png
draft: false
---

ここにイベントの説明を Markdown で書きます。
```

| 項目               | 必須 | 説明                                                            |
| ------------------ | ---- | --------------------------------------------------------------- |
| `title`            | ○    | タイトル                                                        |
| `type`             | ○    | 種別。例: 展示 / ワークショップ / 企画                          |
| `target`           | ○    | 対象                                                            |
| `needsReservation` | -    | `true` でカード・詳細に「要申し込み」バッジが付く（既定 false） |
| `image`            | -    | 画像。省略すると `no_image`                                     |
| `draft`            | -    | `true` で本番非表示                                             |

<br>

## 5. スポンサーを追加する — `src/data/sponsors.ts`

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

## 6. スタッフを追加する — `src/data/staff.ts`

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

## 7. 基調講演を変更する — `src/data/keynote.ts`

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

## 8. 各セクションの文章を直す — `src/components/sections/`

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

## 9. セクションの並び順を変える・消す — `src/pages/index.astro`

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

## 10. 固定ページ（規約など）を追加する — `src/pages/` に Markdown

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
