# :building_construction: 構成と仕組み（コーダー向け）

デザインをベースに**コーディングしていく開発者向け**のガイドです。
「Astro がどう動くか」と「デザインのこの部分はどのファイルを直せばよいか」をまとめています。

> 前提知識（Astro / Tailwind の基礎）は [Astro 入門スライド](./astro-onboarding.md) を、
> 文言・データだけ直したい場合は [コンテンツ編集ガイド](./content-editing.md) を参照してください。

<br>

## 1. 全体像：ソース → ページ表示まで

Astro は **ビルド時に全ページを静的 HTML へ変換**する静的サイトジェネレーターです。

```
src/ のソース（.astro / .md / .ts）
        │  npm run build（GitHub Actions が自動実行）
        ▼
Astro がビルド → dist/ に HTML/CSS/JS を生成
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
| `src/layouts/`             | ページ共通の枠（`<head>`・Header・Footer） | ⭕ 各ページが import          |
| `src/components/`          | 再利用する UI 部品                         | ⭕ 使う側が import            |
| `src/components/sections/` | トップページの各セクション                 | ⭕ `index.astro` が import    |
| `src/content/`             | お知らせ本文（Markdown）                   | ❌ Content Collections が読む |
| `src/data/`                | 編集用データ（イベント情報・スポンサー等） | ⭕ 各コンポーネントが import  |
| `src/lib/`                 | 補助コード（お知らせ取得など）             | ⭕ import して使う            |
| `src/styles/`              | Tailwind 読み込み・テーマ定義              | ⭕ `BaseLayout` が import     |

**ポイント:** `src/pages/` だけは「import されない」特別なフォルダ。
置くだけで Astro が URL に変換します（後述）。それ以外は普通の JS のように import して使います。

<br>

## 3. ルーティングの仕組み（`src/pages/`）

### ファイル＝URL

`src/pages/` のファイルパスが、そのまま URL になります。

| ファイル                     | URL       |
| ---------------------------- | --------- |
| `src/pages/index.astro`      | `/`       |
| `src/pages/access.astro`     | `/access` |
| `src/pages/news/index.astro` | `/news`   |

### 動的ルート（`[ ]` 付きファイル）

1 ファイルから**複数ページを生成**したいときは、ファイル名に角カッコを使います。

| ファイル名      | 意味                                       | 例                            |
| --------------- | ------------------------------------------ | ----------------------------- |
| `[id].astro`    | 1 階層ぶんの可変部分                       | `/news/abc`                   |
| `[...id].astro` | スラッシュを含む複数階層（キャッチオール） | `/news/abc`, `/news/2026/abc` |

動的ルートのファイルは、`getStaticPaths()` で「どのページを作るか」を返します。
**この関数は Astro がビルド時に呼びます**（あなたのコードが呼ぶわけではない）。

例: `src/pages/news/[...id].astro`

```astro
---
import { getCollection, render } from "astro:content";

// Astro がビルド時にこれを呼び、「作るページの一覧」を受け取る
export async function getStaticPaths() {
  const posts = await getCollection("news");
  return posts.map((post) => ({
    params: { id: post.id }, // ← params.id が URL になる
    props: { post }, // ← 各ページに渡すデータ
  }));
}

const { post } = Astro.props; // 上の props.post を受け取る
const { Content } = await render(post); // 本文(Markdown)を描画用に変換
---
```

> なぜ誰も import しないのに動くのか：Astro が `src/pages/` をスキャンして、
> 角カッコ付きファイルを見つけたら `getStaticPaths()` を呼び、返り値の数だけ
> ページを生成します。利用者は `NewsList.astro` のリンクや URL 直打ちで到達します。

<br>

## 4. トップページの組み立て（デザイン ↔ ファイル対応表）

トップページ `src/pages/index.astro` は、**セクションを縦に並べているだけ**です。

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/sections/Hero.astro";
import Outline from "../components/sections/Outline.astro";
// ...
---

<BaseLayout>
  <Hero />
  <Outline />
  <News />
  <Keynote />
  <!-- ... -->
</BaseLayout>
```

**デザインの各セクションは、以下のファイルに対応します。** 「ここを直したい」の入口にしてください。

| デザインのセクション     | 編集するファイル                                        | データの出どころ        |
| ------------------------ | ------------------------------------------------------- | ----------------------- |
| ヘッダー（ナビ）         | `src/components/Header.astro`                           | —                       |
| Theme（ヒーロー）        | `src/components/sections/Hero.astro`                    | `src/data/site.ts`      |
| Outline（開催概要）      | `src/components/sections/Outline.astro`                 | `src/data/site.ts`      |
| About CoderDojo          | `src/components/sections/AboutCoderDojo.astro`          | （文章は直書き）        |
| DojoCon Japan とは       | `src/components/sections/AboutDojoCon.astro`            | （文章は直書き）        |
| News（お知らせ）         | `src/components/sections/News.astro` + `NewsList.astro` | `src/content/news/*.md` |
| Keynote（基調講演）      | `src/components/sections/Keynote.astro`                 | （ファイル先頭で定義）  |
| Session（セッション）    | `src/components/sections/ProgramSection.astro`          | `src/data/program.ts`   |
| Event（イベント）        | `src/components/sections/ProgramSection.astro`          | `src/data/program.ts`   |
| Organized / Supported by | `src/components/sections/Organizers.astro`              | `src/data/site.ts`      |
| Sponsor                  | `src/components/sections/Sponsors.astro`                | `src/data/sponsors.ts`  |
| Contact                  | `src/components/sections/Contact.astro`                 | `src/data/site.ts`      |
| Staff                    | `src/components/sections/Staff.astro`                   | `src/data/staff.ts`     |
| フッター                 | `src/components/Footer.astro`                           | `src/data/site.ts`      |
| `<head>`・全体の枠       | `src/layouts/BaseLayout.astro`                          | —                       |
| 色・フォント             | `src/styles/global.css`                                 | —                       |
| セクションの並び順       | `src/pages/index.astro`                                 | —                       |

> **Countdown DojoCon Japan セクションは未実装**です。動画 URL が決まったら、
> `src/data/program.ts` と同様にデータ配列を作り、新しいセクションコンポーネントを
> 追加する想定です（下記「新しいセクションの追加」を参照）。

<br>

## 5. セクションの共通部品

各セクションは、見た目をそろえるために共通部品を使っています。

- **`src/components/Section.astro`** — 見出し付きのセクション枠。
  `id`（アンカー）・`title`（英語見出し）・`subtitle`（日本語）・`alt`（背景を薄グレーに）を受け取り、
  中身を `<slot />` に流し込む。
- **`src/components/SectionHeading.astro`** — `Section` が内部で使う見出し（✎ Title ✎ + サブタイトル）。

新しいセクションも `Section` を使うと、既存とデザインがそろいます。

```astro
---
import Section from "../Section.astro";
---

<Section id="access" title="Access" subtitle="アクセス" alt>
  <!-- ここに中身。max-w-5xl の中央寄せコンテナは Section 側で用意済み -->
</Section>
```

<br>

## 6. 新しいセクションを追加する手順

例: 「Access（アクセス）」セクションを足す場合。

1. **コンポーネントを作る**: `src/components/sections/Access.astro`
   （上記のように `Section` を使うと楽）
2. **トップに差し込む**: `src/pages/index.astro` で import して、好きな位置に `<Access />` を置く
3. **ナビに追加（任意）**: `src/components/Header.astro` の `nav` 配列に
   `{ href: "/#access", label: "アクセス" }` を足す
4. `npm run dev` で確認 → コミット → push

データが増えるセクション（カード一覧など）は、先に `src/data/` に配列を用意して、
コンポーネントからそれを `import` して `map()` で並べると、後からの追加が楽になります
（`ProgramSection` + `program.ts` がその実例）。

<br>

## 7. スタイリング（Tailwind + テーマトークン）

- スタイルは基本 **Tailwind のユーティリティクラス**（`class="px-6 py-16 text-navy"` など）で当てます。
- ブランドカラー・フォントは **`src/styles/global.css` の `@theme`** で定義しています。
  ここに定義した名前が、そのまま Tailwind クラスとして使えます。

```css
@theme {
  --color-navy: #002244; /* → bg-navy / text-navy */
  --color-accent: #1f7fe5; /* → bg-accent / text-accent */
  --color-surface: #f6f9fc; /* → bg-surface */
  --font-sans: "Noto Sans JP", ...; /* → font-sans */
}
```

- 色を増やしたい・変えたいときは、まず `@theme` を編集します（全体に効く）。
- そのコンポーネント限定の凝ったスタイルは、`.astro` 内に `<style>` を書けば
  **自動でそのコンポーネントだけにスコープ**されます（他に影響しない）。

<br>

## 8. News（Content Collections）の仕組み

お知らせは Markdown で管理し、**スキーマ → 取得 → 表示**の流れで動いています。

```
src/content.config.ts        ← お知らせの「型（スキーマ）」を定義
        │  （title / date / category / draft）
        ▼
src/content/news/*.md        ← 記事の実体（1ファイル＝1記事）
        │
        ▼
src/lib/news.ts              ← getNews(): draft 除外＋日付降順で取得
        │
        ├─► src/components/sections/News.astro  → トップに最新5件
        ├─► src/pages/news/index.astro          → 一覧ページ
        └─► src/pages/news/[...id].astro         → 個別記事ページ（getStaticPaths）
```

スキーマ（`content.config.ts`）に項目を足すと、frontmatter で使えるフィールドが増えます。
型は `astro:schema` の `z`（Zod）で定義します。

<br>

## 9. データ駆動セクションの仕組み

Session / Event / Sponsor / Staff は、`src/data/` の配列を `map()` で並べているだけです。

```
src/data/program.ts (sessions / events)   ──► ProgramSection.astro
src/data/sponsors.ts (sponsorTiers)        ──► Sponsors.astro
src/data/staff.ts (staff)                  ──► Staff.astro
```

各コンポーネントは「配列が空なら準備中表示、要素があればカードを並べる」という分岐になっています。
**見た目（カードのデザイン）を変えるならコンポーネント側、中身を足すならデータ側**を編集します。

<br>

## 10. よく使う作業の早見表（コーダー向け）

| やりたいこと                       | 編集する場所                                            |
| ---------------------------------- | ------------------------------------------------------- |
| あるセクションの見た目を変える     | `src/components/sections/◯◯.astro`                      |
| セクションの並び替え・表示/非表示  | `src/pages/index.astro`                                 |
| 新しいセクションを追加             | `sections/` にコンポーネント作成 → `index.astro` に追加 |
| 新しいページを追加                 | `src/pages/` に `.astro` を追加                         |
| 色・フォントを変える               | `src/styles/global.css` の `@theme`                     |
| ヘッダー / フッターを変える        | `src/components/Header.astro` / `Footer.astro`          |
| `<head>`・OGP・共通レイアウト      | `src/layouts/BaseLayout.astro`                          |
| カード一覧の中身を足す             | `src/data/` の各ファイル                                |
| お知らせの項目（スキーマ）を増やす | `src/content.config.ts`                                 |

<br>

## 11. 触るときの注意

- `dist/` `node_modules/` `.astro/` は**自動生成**。コミットしない（`.gitignore` 済み）。
- `public/CNAME` は公開ドメイン設定。**むやみに変えない**。
- `src/layouts/BaseLayout.astro` は全ページ共通。崩すと全ページに影響するので慎重に。
- 大きな変更は **作業ブランチ + Pull Request** で進めると安全（公開前にレビューできる）。

---

関連: [README](../README.md) / [Astro 入門スライド](./astro-onboarding.md) / [コンテンツ編集ガイド](./content-editing.md) / [Astro 公式ドキュメント](https://docs.astro.build/ja/)
