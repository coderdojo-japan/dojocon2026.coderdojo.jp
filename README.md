# :yin_yang: DojoCon Japan 2026 公式サイト

[DojoCon Japan 2026 in 岩手](https://dojocon2026.coderdojo.jp/) 公式サイトのソースコードです。
[Astro](https://astro.build/) で構築し、[GitHub Pages](https://docs.github.com/ja/pages) で公開しています。

| 項目     | 内容                        |
| -------- | --------------------------- |
| イベント | DojoCon Japan 2026 in 岩手  |
| 開催日   | 2026年11月1日（日）         |
| 会場     | 岩手県盛岡市 プラザおでって |
| テーマ   | わかちあう、わかりあう      |

<br>

## :wave: はじめての方へ（Astro が初めてでも大丈夫）

Astro を触るのが初めてのメンバー向けに、**入門スライド**を用意しています。
「Astro とは何か」から「開発の始め方・コンポーネント・デプロイ」まで、
これを一通り見れば開発に参加できます。

- :sparkles: **入門スライド**: [`docs/astro-onboarding.md`](./docs/astro-onboarding.md)
  - VS Code 拡張「[Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)」を入れると、エディタ上でスライド表示できます
  - もしくは `npm run slides` でブラウザにライブプレビュー表示
  - PDF / HTML で配りたいときは `npm run slides:pdf` / `npm run slides:html`
- :memo: **コンテンツ編集ガイド**: [`docs/content-editing.md`](./docs/content-editing.md)
  - 開催情報・お知らせ・スポンサーなど「どこを直せば何が変わるか」をまとめています

その後、下記の「開発環境のセットアップ」に進んでください。

<br>

## :rocket: 公開 URL

| 時期                   | 公開 URL                              | 配信元リポジトリ                      |
| ---------------------- | ------------------------------------- | ------------------------------------- |
| 現在（ティザー期間中） | https://dojocon2026.coderdojo.jp/     | `dojocon2026-teaser.coderdojo.jp`     |
| 開発中（ステージング） | https://dojocon2026-test.coderdojo.jp | 本リポジトリ（`public/CNAME` で指定） |
| 公式サイト完成後       | https://dojocon2026.coderdojo.jp/     | 本リポジトリ（CNAME を切り替え）      |

公式サイトが完成したら、`public/CNAME` を `dojocon2026.coderdojo.jp` に切り替えて公開を移行します。

<br>

## :wrench: 開発環境のセットアップ

Node.js **22.12 以上**が必要です（Astro 6 の要件）。

```shell
# 依存関係をインストール
npm install

# 開発サーバーを起動（http://localhost:4321/）
npm run dev
```

### npm スクリプト

| コマンド          | 内容                                 |
| ----------------- | ------------------------------------ |
| `npm run dev`     | 開発サーバーを起動（ホットリロード） |
| `npm run build`   | 本番ビルドを `dist/` に出力          |
| `npm run preview` | ビルド結果をローカルでプレビュー     |
| `npm run check`   | 型チェック・Astro の診断             |
| `npm run format`  | Prettier で整形                      |
| `npm run slides`  | 入門スライドをブラウザにライブ表示   |

<br>

## :file_folder: ディレクトリ構成

```
.
├── public/              # そのまま配信される静的ファイル
│   ├── CNAME            # GitHub Pages のカスタムドメイン
│   ├── images/          # 画像・OGP・ファビコン類
│   ├── favicon.ico
│   └── site.webmanifest
├── src/
│   ├── layouts/         # ページ共通の枠（<head>・Header・Footer など）
│   │   └── BaseLayout.astro
│   ├── components/      # 再利用するコンポーネント（Header / Footer など）
│   │   └── sections/    # トップページの各セクション（Hero / Outline / News …）
│   ├── content/         # お知らせの本文（Markdown）
│   │   └── news/        # ここに .md を足すとお知らせが増える
│   ├── data/            # サイトの編集データ（下記参照）
│   │   ├── site.ts      # 開催日・会場・テーマ・リンク（単一の情報源）
│   │   ├── program.ts   # セッション / イベント
│   │   ├── sponsors.ts  # スポンサー
│   │   └── staff.ts     # スタッフ
│   ├── lib/             # 補助コード（お知らせの取得など）
│   ├── pages/           # ルーティング（ファイル＝URL）
│   │   ├── index.astro  # トップページ
│   │   └── news/        # お知らせ一覧・個別記事
│   ├── styles/
│   │   └── global.css   # Tailwind の読み込み・テーマ定義（色・フォント）
│   └── content.config.ts # お知らせ（Content Collections）の定義
├── docs/                # チーム向けドキュメント
│   ├── astro-onboarding.md  # Astro 入門スライド（Marp）
│   └── content-editing.md   # コンテンツ編集ガイド
├── astro.config.mjs     # Astro 設定（site URL・統合）
└── .github/workflows/
    └── deploy.yml       # GitHub Pages への自動デプロイ
```

<br>

## :memo: コンテンツの編集

「サイトの○○を直したい」ときの編集場所は **[コンテンツ編集ガイド](./docs/content-editing.md)** にまとめています。
よく使うものは以下のとおりです。

| やりたいこと                     | 編集する場所                           |
| -------------------------------- | -------------------------------------- |
| 開催日・会場・テーマ・各種リンク | `src/data/site.ts`                     |
| お知らせを追加                   | `src/content/news/` に Markdown を追加 |
| セッション／イベントを追加       | `src/data/program.ts`                  |
| スポンサーを追加                 | `src/data/sponsors.ts`                 |
| スタッフを追加                   | `src/data/staff.ts`                    |
| ページを追加                     | `src/pages/` に `.astro` を追加        |

> Session / Event / Sponsor / Staff は、データが空の間は自動で「準備中」と表示されます。
> `src/data/` の各ファイルに追記すると、その内容がそのままサイトに反映されます。

<br>

## :art: 技術スタック

- [Astro](https://astro.build/) — 静的サイトジェネレーター
- [Tailwind CSS v4](https://tailwindcss.com/) — ユーティリティ CSS（`@tailwindcss/vite` 経由）
- [@astrojs/sitemap](https://docs.astro.build/ja/guides/integrations-guide/sitemap/) — `sitemap-index.xml` を自動生成
- Prettier + husky + lint-staged — コミット時に自動整形

> **メモ:** Astro 6 は rolldown 版 Vite (v7) を使うため、`package.json` の `overrides` で
> `vite` を `^7.3.2` に固定し、Tailwind プラグインと Vite のバージョンを一致させています。

<br>

## :package: デプロイ

`main` ブランチへ push すると、GitHub Actions（`.github/workflows/deploy.yml`）が
自動でビルドして GitHub Pages へデプロイします。

> **初回のみ:** リポジトリの `Settings` → `Pages` → `Build and deployment` の
> `Source` を **GitHub Actions** に設定してください。

<br>

## :handshake: Credits & License

- :yin_yang: The CoderDojo logo - See the [CoderDojo Charter](https://coderdojo.jp/charter).
- :camera_flash: The CoderDojo object photo by [@yasulab](https://github.com/yasulab) ([DojoCon Japan 2016](https://dojocon2016.coderdojo.jp/) team).

ロゴ・写真を除くソースコード（HTML / CSS 等）は [The MIT License](./LICENSE.md) で公開しています。

---

Copyright © [DojoCon Japan](https://dojocon.coderdojo.jp/) & [CoderDojo Japan](https://github.com/coderdojo-japan)
