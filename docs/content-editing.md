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

<br>

## どこに何があるか（早見表）

| やりたいこと                     | 編集するファイル                        |
| -------------------------------- | --------------------------------------- |
| 開催日・会場・テーマ・各種リンク | `src/data/site.ts`                      |
| お知らせ（News）を追加・編集     | `src/content/news/` に Markdown を追加  |
| セッション／イベントを追加       | `src/data/program.ts`                   |
| スポンサーを追加                 | `src/data/sponsors.ts`                  |
| スタッフを追加                   | `src/data/staff.ts`                     |
| 基調講演の登壇者情報             | `src/components/sections/Keynote.astro` |
| 各セクションの説明文             | `src/components/sections/` の各ファイル |
| セクションの並び順               | `src/pages/index.astro`                 |
| ヘッダーのナビゲーション         | `src/components/Header.astro`           |
| 新しいページを追加               | `src/pages/` にファイルを追加           |

<br>

## 1. 開催情報を変更する — `src/data/site.ts`

開催日・会場・テーマ・SNS リンクなどは、すべてこのファイルに集約されています。
**ここを直すとサイト全体（トップ・概要・フッターなど）に反映されます。**

```ts
export const site = {
  title: "DojoCon Japan 2026 in 岩手",
  theme: "わかちあう、わかりあう",
  // ...
  event: {
    dateLabel: "2026.11.01 SUN", // トップに大きく出る日付
    dateText: "2026年11月1日（日）", // 概要欄の日付
    timeLabel: "10:00 - 17:00",
    isFree: true, // false にすると「参加無料」バッジが消える
    venueName: "プラザおでって",
    venueArea: "岩手県盛岡市",
    venueUrl: "https://www.odette.or.jp/plaza-odette/",
  },
  links: {
    x: "https://x.com/CoderDojoJapan",
    // ...
  },
};
```

`"..."` で囲まれた部分（値）だけを書き換えてください。項目名やカンマ・記号は触らないこと。

<br>

## 2. お知らせ（News）を追加・編集する — Markdown

`src/content/news/` に Markdown ファイルを 1 つ追加すると、それが 1 件のお知らせになります。
トップの News 欄・`/news` 一覧・個別記事ページが**自動で生成**されます。

### 手順

1. `src/content/news/` に新しいファイルを作る
   - ファイル名は `2026-07-01-session-call.md` のように **`日付-内容.md`** がおすすめ
   - ファイル名（`.md` を除いた部分）がそのまま URL になります
2. 次のテンプレートを貼り付けて編集する

```markdown
---
title: お知らせのタイトル
date: 2026-07-01
category: お知らせ
---

ここに本文を **Markdown** で書きます。

- 箇条書きも使えます
- [リンク](https://example.com) も書けます
```

### frontmatter（先頭の `---` で囲んだ部分）

| 項目       | 必須 | 説明                                                        |
| ---------- | ---- | ----------------------------------------------------------- |
| `title`    | ○    | 見出し                                                      |
| `date`     | ○    | 公開日。`2026-07-01` の形式                                 |
| `category` | -    | カテゴリ（例: お知らせ / 登壇者 / セッション）。省略可      |
| `draft`    | -    | `true` にすると本番サイトで非表示（書きかけの記事を隠せる） |

> 本文の Markdown 記法は [Markdown 早見表](https://www.markdownguide.org/cheat-sheet/) が参考になります。

<br>

## 3. セッション／イベントを追加する — `src/data/program.ts`

確定したら、`sessions`（セッション）または `events`（イベント）の配列に追記します。
**配列が空の間は、自動で「準備中」と表示されます。**

```ts
export const sessions: ProgramItem[] = [
  {
    title: "Scratch ではじめる creative coding",
    speaker: "山田 太郎（CoderDojo 盛岡）",
    description: "Scratch を使った創作プログラミングの実践紹介です。",
    image: "/images/sessions/creative-coding.png", // 任意。public/images/ に画像を置く
    url: "https://example.com/detail", // 任意
  },
  // ↑ このまとまり（{ ... },）を増やせばカードが増えます
];
```

`speaker` `description` `image` `url` は任意です。不要なら行ごと消して構いません。

<br>

## 4. スポンサーを追加する — `src/data/sponsors.ts`

tier（Gold / Silver / Bronze / IN-KIND）ごとの `sponsors` 配列に追記します。
**1 社も登録がない tier は表示されません。**

```ts
export const sponsorTiers: SponsorTier[] = [
  {
    key: "gold",
    label: "Gold Sponsor",
    sponsors: [{ name: "Example Inc.", url: "https://example.com", logo: "/images/sponsors/example.png" }],
  },
  // ...
];
```

- ロゴ画像は `public/images/sponsors/` に置き、`logo` にそのパスを書きます
- `logo` を省略すると、ロゴの代わりに `name`（社名テキスト）が表示されます

<br>

## 5. スタッフを追加する — `src/data/staff.ts`

`staff` 配列に追記します。**配列が空の間は「準備中」と表示されます。**

```ts
export const staff: Staff[] = [
  {
    name: "山田 太郎",
    role: "実行委員長", // 任意
    avatar: "/images/staff/yamada.png", // 任意。未指定なら頭文字を表示
    url: "https://example.com", // 任意
  },
];
```

アバター画像は `public/images/staff/` に置くのがおすすめです。

<br>

## 6. 基調講演を変更する — `src/components/sections/Keynote.astro`

ファイル先頭の `keynote` を書き換えます。写真は `public/images/` に置いてパスを指定します。

```astro
---
const keynote = {
  name: "上田 信行",
  nameKana: "ウエダ ノブユキ",
  title: "同志社女子大学 名誉教授 / ネオミュージアム 館長",
  photo: "/images/keynote-ueda.jpg",
  profileUrl: "https://nobuyukiueda.com/about",
};
---
```

<br>

## 7. 各セクションの文章を直す — `src/components/sections/`

「コーダー道場とは？」などの説明文は、それぞれのセクションファイルにあります。

| セクション           | ファイル                                       |
| -------------------- | ---------------------------------------------- |
| トップ（テーマ）     | `src/components/sections/Hero.astro`           |
| 開催概要             | `src/components/sections/Outline.astro`        |
| コーダー道場とは？   | `src/components/sections/AboutCoderDojo.astro` |
| DojoCon Japan とは？ | `src/components/sections/AboutDojoCon.astro`   |
| お問い合わせ         | `src/components/sections/Contact.astro`        |

`---` で囲まれた部分より下の、日本語の文章を書き換えてください。
HTML タグ（`<p>` など）や `class="..."` の部分は触らないのが安全です。

<br>

## 8. セクションの並び順を変える・消す — `src/pages/index.astro`

トップページは、セクションを縦に並べているだけです。
順番を入れ替えたり、不要なセクションの行を消したり（コメントアウトしたり）できます。

```astro
<BaseLayout>
  <Hero />
  <Outline />
  <News />
  <Keynote />
  <!-- <Sponsors />  ← 行頭に <!-- を付けると一時的に非表示にできます -->
</BaseLayout>
```

<br>

## 9. 新しいページを追加する — `src/pages/`

`src/pages/` にファイルを置くと、それがそのまま URL になります。
（例: `src/pages/access.astro` → `/access`）

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="アクセス | DojoCon Japan 2026">
  <section class="px-6 py-16">
    <div class="mx-auto max-w-3xl">
      <h1 class="text-navy text-2xl font-bold">会場へのアクセス</h1>
      <p class="mt-4">ここに本文を書きます。</p>
    </div>
  </section>
</BaseLayout>
```

---

困ったときは [README](../README.md) や [Astro 入門スライド](./astro-onboarding.md)、
[Astro 公式ドキュメント（日本語）](https://docs.astro.build/ja/) を参照してください。
