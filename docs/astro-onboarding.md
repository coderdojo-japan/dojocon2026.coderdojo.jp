---
marp: true
paginate: true
size: 16:9
title: DojoCon Japan 2026 公式サイト開発ガイド（Astro 入門）
description: チーム向け Astro オンボーディング・スライド
---

<!--
このファイルは Marp 形式のスライドです。
- VS Code 拡張「Marp for VS Code」を入れると、右上のプレビューアイコンでスライド表示できます。
- PDF / HTML への書き出しは `npm run slides:pdf` / `npm run slides:html`。
スライドは「---」で区切ります。各見出しがそのまま 1 枚のスライドになります。
-->

<style>
:root {
  --navy: #002244;
  --navy-dark: #001a33;
  --accent: #4aa3ff;
}
section {
  font-family: "Hiragino Sans", "Noto Sans JP", sans-serif;
  font-size: 26px;
  padding: 60px 70px;
}
section h1, section h2 { color: var(--navy); }
section h1 { font-size: 48px; }
section h2 { font-size: 38px; border-bottom: 4px solid var(--accent); padding-bottom: 8px; }
section code { background: #eef4fb; color: var(--navy-dark); padding: 2px 6px; border-radius: 4px; }
section pre { background: var(--navy-dark); border-radius: 8px; }
section pre code { background: transparent; color: #e8eef5; }
section a { color: var(--accent); }
section.lead { background: var(--navy); color: #fff; display: flex; flex-direction: column; justify-content: center; }
section.lead h1, section.lead h2 { color: #fff; border: none; }
section.lead code { background: rgba(255,255,255,0.15); color: #fff; }
table { font-size: 22px; }
section::after { color: #6b7c93; }
</style>

<!-- _class: lead -->

# DojoCon Japan 2026<br>公式サイト開発ガイド

## はじめての Astro 🚀

このスライドは「Astro を触るのが初めて」のチームメンバー向けの入門資料です。
これを一通り見れば、開発に参加できるようになります。

---

<!-- _class: lead -->

# 目次

1. **Astro とは・なぜ使うのか** 🤔
2. **開発の始め方・日常フロー** 🛠️
3. **コンポーネントと Tailwind** 🧩
4. **デプロイと Git 運用** 🚢

---

<!-- _class: lead -->

# 1. Astro とは・なぜ使うのか 🤔

---

## Web サイトの作り方は色々ある

| 方法         | こんな感じ                              | 向いている用途            |
| ------------ | --------------------------------------- | ------------------------- |
| 素の HTML    | `.html` を手書き（＝ティザーサイト）    | 1〜2 ページの簡単なサイト |
| WordPress    | サーバー上で毎回ページを組み立てる      | ブログ・更新が多いサイト  |
| **Astro** ⭐ | 部品を組んで **事前に** HTML を書き出す | ページが増える静的サイト  |

公式サイトは **ページが増えていく** ので、部品（コンポーネント）に分けて
管理できる Astro を選びました。

---

## Astro とは？

> **コンテンツ重視の Web サイトを作るための、静的サイトジェネレーター**

- 📦 **静的サイトジェネレーター (SSG)**
  → 公開前に全ページを **HTML に変換（ビルド）** しておく方式
- ⚡ **デフォルトで JavaScript をほぼ送らない** → 表示が速い
- 🧩 **コンポーネント指向** → ヘッダーやカードなどを部品化して再利用
- 📝 **Markdown が得意** → 記事やお知らせを書きやすい

---

## 「ビルド」ってなに？

書いたソース（人間が読みやすい形）を、ブラウザが理解できる
**素の HTML/CSS/JS に変換する作業**のこと。

```
src/pages/index.astro   ──[ astro build ]──►   dist/index.html
（開発で書くファイル）                          （実際に配信されるファイル）
```

- ブラウザは `.astro` ファイルを直接読めません
- だから公開前に必ず **ビルド** が必要
- このビルドは **自動** で走るので、普段は意識しなくて OK（後述）

---

## なぜ今回 Astro なのか（まとめ）

- ✅ ページが増えても **部品の使い回し** で破綻しにくい
- ✅ **表示が速い**（イベントサイトは初見の人が多い → 第一印象が大事）
- ✅ **GitHub Pages で無料**ホスティング
- ✅ Markdown でお知らせ等を **非エンジニアでも更新しやすく** できる
- ✅ 学習コストが比較的低い（HTML / CSS が分かれば入りやすい）

---

<!-- _class: lead -->

# 2. 開発の始め方・日常フロー 🛠️

---

## 必要なもの

- 🟢 **Node.js 22 以上**（[nodejs.org](https://nodejs.org/) からインストール）
  - 確認: `node -v` → `v22.x` 以上ならOK
- 📝 **エディタ: VS Code 推奨**
  - 拡張「**Astro**」と「**Tailwind CSS IntelliSense**」を入れると快適
- 🐙 **Git / GitHub アカウント**

---

## 最初の 1 回だけやること

```bash
# 1. リポジトリを手元にコピー（clone）
git clone git@github.com:coderdojo-japan/dojocon2026.coderdojo.jp.git
cd dojocon2026.coderdojo.jp

# 2. 必要なライブラリをインストール
npm install
```

> `npm install` は依存ライブラリを `node_modules/` にダウンロードします。
> 少し時間がかかりますが、最初の 1 回だけです。

---

## 毎日の開発フロー

```bash
# 開発サーバーを起動
npm run dev
```

→ ブラウザで **http://localhost:4321/** を開く

- ファイルを **保存すると即座に画面に反映**される（ホットリロード）🔥
- 止めるときは `Ctrl + C`
- これだけ！ ビルドや公開は手動でやらなくて大丈夫

---

## フォルダの地図 🗺️

```
public/          そのまま配信される静的ファイル（画像・CNAME 等）
  images/
src/
  layouts/       ページ共通の枠（<head> や全体レイアウト）
    BaseLayout.astro
  components/    再利用する部品（ヘッダー・カードなど）
  pages/         ★ファイル＝URL になる（ルーティング）
    index.astro          → トップページ「/」
  styles/
    global.css   Tailwind の読み込み・色などの定義
astro.config.mjs サイト全体の設定
```

**まず触るのは `src/pages/` と `src/components/`** です。

---

## ページの増やし方

`src/pages/` にファイルを置くと、それがそのまま URL になります。

| 作るファイル                     | できる URL  |
| -------------------------------- | ----------- |
| `src/pages/index.astro`          | `/`         |
| `src/pages/about.astro`          | `/about`    |
| `src/pages/access.astro`         | `/access`   |
| `src/pages/sessions/index.astro` | `/sessions` |

ルーター設定は不要。**ファイルを置くだけ** でページが増えます。

---

## よく使うコマンド

| コマンド          | いつ使う？                               |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | **開発中**（普段はこれだけ）             |
| `npm run build`   | 公開と同じ状態を手元で作る（確認用）     |
| `npm run preview` | `build` 結果をローカルで表示して最終確認 |
| `npm run check`   | 型・記述ミスのチェック                   |
| `npm run format`  | Prettier でコードを自動整形              |

> 公開（デプロイ）は **GitHub に push すれば自動** なので、
> 手元で `build` する必要は普段ありません（確認したいとき用）。

---

<!-- _class: lead -->

# 3. コンポーネントと Tailwind 🧩

---

## `.astro` ファイルの構造

```astro
---
// ① フロントマター（--- で囲む）= JavaScript を書く場所
// データ取得・props の受け取り・変数定義など
const title = "DojoCon Japan 2026";
---

<!-- ② テンプレート = 見た目の HTML を書く場所 -->
<h1>{title}</h1>
<p>ようこそ！</p>
```

- 上半分（`---` の中）＝ **ロジック**（JavaScript / TypeScript）
- 下半分＝ **見た目**（HTML。`{ }` で変数を埋め込める）

---

## コンポーネント＝再利用できる部品

例: お知らせカードを部品にする

```astro
---
// src/components/NewsCard.astro
const { date, title } = Astro.props; // 親から値を受け取る
---

<article class="rounded border p-4">
  <time>{date}</time>
  <h3>{title}</h3>
</article>
```

```astro
---
// 使う側（ページ）
import NewsCard from "../components/NewsCard.astro";
---

<NewsCard date="2026-06-18" title="登壇者を発表しました" />
```

---

## レイアウト＝ページ共通の枠

`src/layouts/BaseLayout.astro` が `<head>` や OGP などの共通部分を持っています。
各ページは中身（`<slot />`）だけ書けば OK。

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="アクセス">
  <main>
    <h1>会場へのアクセス</h1>
    <!-- ここがページ固有の中身 -->
  </main>
</BaseLayout>
```

> `<head>` やメタタグを毎ページ書かなくて済む！

---

## Tailwind CSS とは

**クラス名を付けるだけでスタイルが当たる** 仕組み。
別ファイルに CSS を書かず、HTML の中で完結します。

```html
<!-- 従来: 別ファイルに CSS を書く -->
<div class="card">...</div>
<style>
  .card {
    padding: 1rem;
    border-radius: 8px;
  }
</style>

<!-- Tailwind: クラスだけで指定 -->
<div class="rounded-lg p-4">...</div>
```

---

## よく使う Tailwind クラスの例

| クラス       | 意味                               |
| ------------ | ---------------------------------- |
| `p-4`        | padding: 1rem                      |
| `rounded-lg` | 角丸                               |
| `bg-navy`    | 背景色（このプロジェクトの定義色） |
| `flex`       | 横並び（フレックスボックス）       |
| `sm:text-lg` | 画面が広いとき文字を大きく         |

> どんなクラスがあるかは [Tailwind 公式ドキュメント](https://tailwindcss.com/docs) で検索できます。

---

## Tailwind のうれしいポイント

- 🎨 **クラスを見れば見た目が分かる**（CSS ファイルを行き来しない）
- 📱 **レスポンシブが簡単**: `sm:` `md:` `lg:` を付けるだけ
- 🧹 **使った分だけ** CSS が出力される（軽い）
- 🧭 VS Code の **Tailwind 拡張**で入力補完が効く

色やフォントの共通定義は `src/styles/global.css` の `@theme { ... }` にあります。
（例: `--color-navy: #002244;` → `bg-navy` `text-navy` として使える）

---

<!-- _class: lead -->

# 4. デプロイと Git 運用 🚢

---

## 公開（デプロイ）の仕組み

**`main` ブランチに push するだけ** で、あとは全部自動です。

```
git push          GitHub Actions が起動
  │                  │
  ▼                  ▼
main ブランチ ──► ① npm install ──► ② npm run build ──► ③ GitHub Pages へ公開
                                    （dist/ を生成）
```

- 設定は `.github/workflows/deploy.yml` に書いてあります
- 進行状況は GitHub の **Actions タブ** で見られます（数分で完了）

---

## 公開 URL（今とこれから）

| 時期                   | 公開 URL                              |
| ---------------------- | ------------------------------------- |
| 開発中（ステージング） | https://dojocon2026-test.coderdojo.jp |
| 公式サイト完成後       | https://dojocon2026.coderdojo.jp/     |

- いまは **テスト用ドメイン**で公開して確認しています
- 完成したら `public/CNAME` を本番ドメインに切り替えて移行します

---

## Git の進め方（おすすめ）

`main` に直接コミットせず、**作業用ブランチ**を切るのが安全です。

```bash
# 1. 最新の main を取得
git switch main && git pull

# 2. 作業ブランチを作る（名前は内容が分かるものに）
git switch -c feat/access-page

# 3. 変更したらコミット
git add -A
git commit -m "feat: アクセスページを追加"

# 4. GitHub に push して Pull Request を作る
git push -u origin feat/access-page
```

→ レビューして問題なければ `main` にマージ → 自動で公開 🚀

---

## やってはいけないこと ⚠️

- ❌ `dist/` や `node_modules/` を **コミットしない**
  （`.gitignore` で除外済み。自動生成物なので不要）
- ❌ `public/CNAME` を**勝手に変えない**（公開ドメインが切り替わってしまう）
- ❌ 確認せずに大きな変更を `main` へ直接 push しない
  → 作業ブランチ＋PR で進める

---

## このサイトのコンテンツを編集する 📝

「○○を直したい」ときの編集場所は決まっています（詳細は **`docs/content-editing.md`**）。

| やりたいこと                     | 編集する場所                           |
| -------------------------------- | -------------------------------------- |
| 開催日・会場・テーマ・各種リンク | `src/data/site.ts`                     |
| お知らせを追加                   | `src/content/news/` に Markdown を追加 |
| セッション／イベントを追加       | `src/data/program.ts`                  |
| スポンサー／スタッフを追加       | `src/data/sponsors.ts` / `staff.ts`    |

> Session / Sponsor / Staff などは、データが空の間は自動で「準備中」と表示されます。
> `src/data/` に追記すれば、そのままサイトに反映されます。

---

## 困ったときは

- 📖 **Astro 公式ドキュメント（日本語）**: https://docs.astro.build/ja/
- 🎨 **Tailwind 公式（クラス検索）**: https://tailwindcss.com/docs
- 📁 **このリポジトリの README** に環境構築・コマンドまとめあり
- 🙋 分からないことは **遠慮なくチームに質問**！

---

<!-- _class: lead -->

# さあ、始めましょう！ 🎉

```bash
git clone git@github.com:coderdojo-japan/dojocon2026.coderdojo.jp.git
cd dojocon2026.coderdojo.jp
npm install
npm run dev
```

→ http://localhost:4321/ が開けば準備完了です。

**わかちあう、わかりあう** — DojoCon Japan 2026 in 岩手
