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

## :rocket: 公開 URL

| 時期                   | 公開 URL                              | 配信元リポジトリ                      |
| ---------------------- | ------------------------------------- | ------------------------------------- |
| 現在（ティザー期間中） | https://dojocon2026.coderdojo.jp/     | `dojocon2026-teaser.coderdojo.jp`     |
| 開発中（ステージング） | https://dojocon2026-test.coderdojo.jp | 本リポジトリ（`public/CNAME` で指定） |
| 公式サイト完成後       | https://dojocon2026.coderdojo.jp/     | 本リポジトリ（CNAME を切り替え）      |

公式サイトが完成したら、`public/CNAME` を `dojocon2026.coderdojo.jp` に切り替えて公開を移行します。

<br>

## :wrench: 開発環境のセットアップ

Node.js 20 以上（推奨: 22+）が必要です。

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
│   ├── layouts/         # ページ共通の枠（<head>・OGP など）
│   │   └── BaseLayout.astro
│   ├── components/      # 再利用するコンポーネント
│   ├── pages/           # ルーティング（ファイル＝URL）
│   │   └── index.astro  # トップページ
│   └── styles/
│       └── global.css   # Tailwind の読み込み・テーマ定義
├── astro.config.mjs     # Astro 設定（site URL・統合）
└── .github/workflows/
    └── deploy.yml       # GitHub Pages への自動デプロイ
```

ページを追加するには `src/pages/` に `.astro` ファイルを置きます（例: `src/pages/about.astro` → `/about`）。

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
