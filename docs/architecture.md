# :building_construction: 構成と仕組み（コーダー向け）

デザインをベースに**コーディングしていく開発者向け**のガイドです。
「Astro がどう動くか」と「デザインのこの部分はどのファイルを直せばよいか」をまとめています。

> このサイトのデザインは **FLOCSS 設計の SCSS**（`src/styles/scss/`）で組まれています。
> スタイルの基礎知識は [静的HTMLモック → Astro化 申し送りガイド](./static-html-to-astro.md) を、
> 文言・データだけ直したい場合は [コンテンツ編集ガイド](./content-editing.md) を参照してください。

<br>

## 1. 全体像：ソース → ページ表示まで

Astro は **ビルド時に全ページを静的 HTML へ変換**する静的サイトジェネレーターです。

```
src/ のソース（.astro / .md / .ts / .scss）
        │  npm run build（GitHub Actions が自動実行）
        ▼
Astro がビルド → dist/ に HTML/CSS/JS を生成（SCSS も Vite がコンパイル）
        │
        ▼
GitHub Pages が dist/ を配信 → 利用者のブラウザ
```

ブラウザは `.astro` を直接読めません。**必ずビルドを通して HTML になったものが配信**されます。

<br>

## 2. ファイルの種類と役割

`src/` 以下は、フォルダごとに役割が決まっています。

| フォルダ / ファイル        | 役割                                       | コードから import する？      |
| -------------------------- | ------------------------------------------ | ----------------------------- |
| `src/pages/`               | **ルーティング**。ファイル＝URL になる     | ❌ Astro が自動で発見         |
| `src/layouts/`             | ページ共通の枠（`<head>`・一覧枠・詳細枠） | ⭕ 各ページが import          |
| `src/components/`          | 再利用する UI 部品                         | ⭕ 使う側が import            |
| `src/components/sections/` | トップページの各セクション                 | ⭕ `index.astro` が import    |
| `src/content/`             | お知らせ・セッション・イベント（Markdown） | ❌ Content Collections が読む |
| `src/data/`                | 編集用データ（イベント情報・スポンサー等） | ⭕ 各コンポーネントが import  |
| `src/lib/`                 | 補助コード（お知らせ・プログラム取得など） | ⭕ import して使う            |
| `src/styles/scss/`         | **FLOCSS の SCSS**（デザインの実体）       | ⭕ `BaseLayout` が import     |

**ポイント:** `src/pages/` だけは「import されない」特別なフォルダ。
置くだけで Astro が URL に変換します（後述）。それ以外は普通の JS のように import して使います。

<br>

## 3. ルーティングの仕組み（`src/pages/`）

### ファイル＝URL

`src/pages/` のファイルパスが、そのまま URL になります。

| ファイル                         | URL          |
| -------------------------------- | ------------ |
| `src/pages/index.astro`          | `/`          |
| `src/pages/privacy.md`           | `/privacy`   |
| `src/pages/news/index.astro`     | `/news/`     |
| `src/pages/sessions/index.astro` | `/sessions/` |

### 動的ルート（`[ ]` 付きファイル）

1 ファイルから**複数ページを生成**したいときは、ファイル名に角カッコを使います。
このサイトでは news / sessions / events の個別ページがこれです。

| ファイル名                         | 生成される URL の例        |
| ---------------------------------- | -------------------------- |
| `src/pages/news/[...id].astro`     | `/news/2026-05-20-keynote` |
| `src/pages/sessions/[...id].astro` | `/sessions/sample-session` |
| `src/pages/events/[...id].astro`   | `/events/sample-event`     |

動的ルートのファイルは、`getStaticPaths()` で「どのページを作るか」を返します。
**この関数は Astro がビルド時に呼びます**（あなたのコードが呼ぶわけではない）。

例: `src/pages/sessions/[...id].astro`

```astro
---
import { render } from "astro:content";
import SingleLayout from "../../layouts/SingleLayout.astro";
import { getSessions, SESSION_NO_IMAGE } from "../../lib/program";

// Astro がビルド時にこれを呼び、「作るページの一覧」を受け取る（draft は本番で除外）
export async function getStaticPaths() {
  const items = await getSessions();
  return items.map((item) => ({ params: { id: item.id }, props: { item } }));
}

const { item } = Astro.props;
const { Content } = await render(item); // 本文(Markdown)を描画用に変換
---
```

<br>

## 4. トップページの組み立て（デザイン ↔ ファイル対応表）

トップページ `src/pages/index.astro` は、**セクションを縦に並べているだけ**です。
（全体は `<main id="home">` で包み、各セクションを並べています）

**デザインの各セクションは、以下のファイルに対応します。** 「ここを直したい」の入口にしてください。

| デザインのセクション      | 編集するファイル                                                    | データの出どころ            |
| ------------------------- | ------------------------------------------------------------------- | --------------------------- |
| ヘッダー（ナビ）          | `src/components/Header.astro`                                       | —                           |
| ヒーロー（最上部）        | `src/components/sections/Hero.astro`                                | （直書き）                  |
| Theme（テーマ）           | `src/components/sections/Theme.astro`                               | （直書き）                  |
| Outline（開催概要）       | `src/components/sections/Outline.astro`                             | （直書き）                  |
| About（道場/DojoConとは） | `src/components/sections/About.astro`                               | （直書き）                  |
| News（お知らせ）          | `src/components/sections/News.astro` + `NewsList.astro`             | `src/content/news/*.md`     |
| Keynote（基調講演）       | `src/components/sections/Keynote.astro`                             | `src/data/keynote.ts`       |
| Session（セッション）     | `src/components/sections/ProgramSection.astro`（variant="session"） | `src/content/sessions/*.md` |
| Event（イベント）         | `src/components/sections/ProgramSection.astro`（variant="event"）   | `src/content/events/*.md`   |
| Sponsor                   | `src/components/sections/Sponsors.astro`                            | `src/data/sponsors.ts`      |
| Organized / Supported by  | `src/components/sections/Organizers.astro`                          | （直書き）                  |
| Contact                   | `src/components/sections/Contact.astro`                             | （直書き）                  |
| Staff                     | `src/components/sections/Staff.astro`                               | `src/data/staff.ts`         |
| フッター                  | `src/components/Footer.astro`                                       | —                           |
| `<head>`・全体の枠        | `src/layouts/BaseLayout.astro`                                      | —                           |
| 色・レイアウト・見た目    | `src/styles/scss/`（FLOCSS）                                        | —                           |
| セクションの並び順        | `src/pages/index.astro`                                             | —                           |

<br>

## 5. 共通レイアウトと共通部品

### レイアウト（`src/layouts/`）

| ファイル              | 役割                                                                                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BaseLayout.astro`    | 全ページ共通の枠。`<head>`（メタ/OGP/favicon）＋ Header ＋ `<slot />` ＋ Footer ＋ 戻るボタン ＋ ハンバーガー等の `<script>`。**ここで SCSS を import**（`import "../styles/scss/style.scss"`） |
| `ArchiveLayout.astro` | 一覧ページ共通枠（`p-archive`）。見出しを `h1` で出す。sessions/events/news 一覧が使用                                                                                                          |
| `SingleLayout.astro`  | 詳細・固定ページ共通枠（`p-single` ＋ 本文プロース `c-prose`）。詳細ページと Markdown 固定ページの両方で使う                                                                                    |

`SingleLayout` は 2 通りの使い方があります。

- **詳細ページ**（`.astro`）から `<SingleLayout title=... eyecatch=... back=...>` として呼ぶ。メタ情報は `slot="meta"` に入れる
- **固定ページ**（`.md`）の `layout:` に指定する。frontmatter の `title` が見出しに、本文が `c-prose` に入る（例: `src/pages/privacy.md`）

### 共通部品（`src/components/`）

| ファイル            | 役割（対応する FLOCSS クラス）                                     |
| ------------------- | ------------------------------------------------------------------ |
| `Header.astro`      | ヘッダー・ナビ・ハンバーガー（`l-header`）                         |
| `Footer.astro`      | フッター（`l-footer`）                                             |
| `BackToTop.astro`   | 右下の「トップへ戻る」ボタン（`c-back-to-top`）                    |
| `Heading.astro`     | セクション見出し（`c-heading`）。`as="h1" / "h2"` を切替           |
| `FrontButton.astro` | 大きめの丸ボタン（`c-front-btn`）                                  |
| `ProgramCard.astro` | セッション/イベントのカード（`p-program__item`）。`variant` で分岐 |
| `NewsList.astro`    | お知らせリスト（`p-news__list`）。カテゴリ色を `color` で決定      |
| `Prose.astro`       | 本文プロースのラッパー（`c-prose`）                                |

<br>

## 6. 新しいセクションを追加する手順

例: 「Access（アクセス）」セクションを足す場合。

1. **コンポーネントを作る**: `src/components/sections/Access.astro`
   （見出しは `Heading`、ボタンは `FrontButton` を使うと既存とそろう。FLOCSS 命名で `p-access__*` を使う）
2. **トップに差し込む**: `src/pages/index.astro` で import して、好きな位置に `<Access />` を置く
3. **ナビに追加（任意）**: `src/components/Header.astro` の `navItems` 配列に足す
4. **スタイルが必要なら**: `src/styles/scss/modules/_access.scss` を作り、`style.scss` で `@use` する（7章）
5. `npm run dev` で確認 → コミット → push

データが増えるセクション（カード一覧など）は、先にデータ（`src/data/` の配列 or `src/content/` のコレクション）を用意して、`map()` で並べると後からの追加が楽です（`ProgramSection` がその実例）。

<br>

## 7. スタイリング（FLOCSS + SCSS）

このサイトのデザインは **`src/styles/scss/` の SCSS が唯一の情報源**です（Tailwind は使っていません）。
`src/styles/scss/style.scss` を `BaseLayout` が import し、Vite（`sass-embedded`）がビルド時にコンパイルします。

### 構成

```
src/styles/scss/
├── style.scss              … エントリ。@use で各モジュールを読み込む
├── settings/               … 色・ブレークポイント・関数・mixin（`@use '...settings' as s;`）
└── modules/
    ├── _reset.scss         … リセット
    ├── _common.scss        … ヘッダー・フッター・戻るボタン・ユーティリティ
    ├── _front.scss         … トップページ各セクション
    ├── _archive.scss       … 一覧ページ共通枠（.p-archive）
    └── _single.scss        … 詳細/固定ページ共通枠（.p-single）＋本文プロース（.c-prose）
```

### FLOCSS 命名（接頭辞で役割が分かる）

| 接頭辞 | 意味                        | 例                                       |
| ------ | --------------------------- | ---------------------------------------- |
| `l-`   | Layout（大枠）              | `l-header` `l-footer` `l-inner`          |
| `p-`   | Project（ページ固有）       | `p-hero` `p-archive` `p-single` `p-news` |
| `c-`   | Component（再利用部品）     | `c-heading` `c-front-btn` `c-prose`      |
| `u-`   | Utility（単一目的）         | `u-pink` `u-hidden--sp`                  |
| `is-`  | State（状態、JSで付け外し） | `is-scrolled` `is-open` `is-visible`     |

### スタイルを足すとき

- 既存モジュールに追記するか、`modules/` に新ファイルを作って `style.scss` で `@use` する
- 色・ブレークポイント・関数は `settings`（`@use '...settings' as s;`）から使う（例: `s.$main-blue` / `s.fz(18)` / `@include s.mq-down()`）
- 色調整は必ず `s.darken()` / `s.lighten()`（グローバルの `darken()` は非推奨警告が出る）
- 変更後は `npm run dev`（Vite が自動再コンパイル）で確認

> 画像を `url()` で参照するときは、`public/` はサイトルート配信なので `url('/images/...')` の**絶対パス**で書きます。

<br>

## 8. Content Collections（News / Sessions / Events）の仕組み

お知らせ・セッション・イベントは Markdown で管理し、**スキーマ → 取得 → 表示**の流れで動いています。

```
src/content.config.ts        ← 3コレクションの「型（スキーマ）」を定義
        │  news:     title / date / label / color / draft
        │  sessions: title / type / speaker? / target / image? / draft
        │  events:   title / type / target / needsReservation / image? / draft
        ▼
src/content/{news,sessions,events}/*.md   ← 記事の実体（1ファイル＝1件）
        │
        ▼
src/lib/news.ts     … getNews()      （draft 除外＋日付降順）
src/lib/program.ts  … getSessions() / getEvents()（draft 除外）
        │
        ├─► src/components/sections/*.astro  → トップに最新数件
        ├─► src/pages/{news,sessions,events}/index.astro    → 一覧ページ
        └─► src/pages/{news,sessions,events}/[...id].astro  → 個別ページ（getStaticPaths）
```

- スキーマ（`content.config.ts`）に項目を足すと、frontmatter で使えるフィールドが増えます。型は `astro:schema` の `z`（Zod）で定義
- **News のカテゴリは `label`（表示名・自由）＋ `color`（色・選択式 enum）の2軸**。色は `p-news__category--{color}` に対応（session/event/sponsor/news/highlight）
- **画像は任意**。未指定なら `no_image.webp` にフォールバック（`src/lib/program.ts` の `SESSION_NO_IMAGE` / `EVENT_NO_IMAGE`）
- **OGP画像**は詳細ページのアイキャッチを使い、無ければ共通の `ogp.webp`（`BaseLayout` の `ogImage` 既定値）

<br>

## 9. データ駆動セクションの仕組み（`src/data/`）

Sponsor / Staff / Keynote は、`src/data/` の値をコンポーネントが読んで表示します。

```
src/data/sponsors.ts (sponsorTiers)   ──► Sponsors.astro   （tier ごとにロゴ or 名前）
src/data/staff.ts    (staff)          ──► Staff.astro      （空なら準備中）
src/data/keynote.ts  (keynote)        ──► Keynote.astro
src/data/site.ts     (site)           ──► 各所（サイト共通情報）
```

Sponsor / Staff は「配列が空なら準備中/募集中、要素があれば並べる」分岐です。
**見た目（カードのデザイン）を変えるならコンポーネント側、中身を足すならデータ側**を編集します。

<br>

## 10. よく使う作業の早見表（コーダー向け）

| やりたいこと                       | 編集する場所                                               |
| ---------------------------------- | ---------------------------------------------------------- |
| あるセクションの見た目を変える     | `src/styles/scss/modules/_front.scss`（該当クラス）        |
| セクションのマークアップを変える   | `src/components/sections/◯◯.astro`                         |
| セクションの並び替え・表示/非表示  | `src/pages/index.astro`                                    |
| 新しいセクションを追加             | `sections/` にコンポーネント作成 → `index.astro` に追加    |
| 新しいページを追加                 | `src/pages/` に `.astro` / `.md` を追加                    |
| スタイルを足す                     | `src/styles/scss/modules/` に追記 → `style.scss` で `@use` |
| ヘッダー / フッターを変える        | `src/components/Header.astro` / `Footer.astro`             |
| `<head>`・OGP・共通レイアウト      | `src/layouts/BaseLayout.astro`                             |
| カード一覧の中身を足す             | `src/content/{sessions,events}/` に Markdown               |
| お知らせ・プログラムの項目を増やす | `src/content.config.ts`（スキーマ）                        |

<br>

## 11. 触るときの注意

- `dist/` `node_modules/` `.astro/` は**自動生成**。コミットしない（`.gitignore` 済み）。
- `public/CNAME` は公開ドメイン設定。**むやみに変えない**。
- `src/styles/scss/` はデザインの実体。命名（FLOCSS）を崩さないこと。**Tailwind は使いません**。
- `src/layouts/BaseLayout.astro` は全ページ共通。崩すと全ページに影響するので慎重に。
- 大きな変更は **作業ブランチ + Pull Request** で進めると安全（公開前にレビューできる）。

---

関連: [README](../README.md) / [静的HTMLモック → Astro化 申し送りガイド](./static-html-to-astro.md) / [コンテンツ編集ガイド](./content-editing.md) / [Astro 公式ドキュメント](https://docs.astro.build/ja/)
