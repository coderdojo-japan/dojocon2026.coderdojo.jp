# :inbox_tray: 静的HTMLモック → Astro化 申し送りガイド

`src/static-html/` に組んだ**静的HTMLモック**を Astro 化する人（およびその作業で使う Claude Code）への引き継ぎドキュメントです。
モックの構成・スタイル設計・JS・アセットと、**Astro 化するときの進め方**をまとめています。

> [!NOTE]
> このドキュメントは「モック → Astro 化」の申し送りです。
> 現状の Astro 実装（`src/pages/` `src/components/` の Tailwind ダミー）を説明する [architecture.md](./architecture.md) とは**別物**です。
> モックは **Astro とは独立した別トラック**（`src/static-html/`）で、デザインの完成形はこちらにあります。現状の Astro はデザインの異なる仮実装で、置き換え対象です。

<br>

## :robot: AI向け1行サマリ

> `src/static-html/`（静的HTML＋FLOCSSのSCSS）が**デザインの正**。Astro化は「**SCSSをそのまま持ち込み**、`src/static-html/` の各ページを Astro のレイアウト/コンポーネント/コンテンツコレクションに分解して移植」する。Tailwindベースの既存ダミー（`global.css`・`components/`・`pages/`）は置き換える。新規スタイルは `src/styles/scss/modules/` に足して `style.scss` で `@use`、ビルドは `npm run sass-all`。

**まず見るべきパス**

| 対象                 | パス                                        |
| -------------------- | ------------------------------------------- |
| モックのHTML         | `src/static-html/`                          |
| SCSS（デザインの正） | `src/styles/scss/`（エントリ `style.scss`） |
| コンパイル済みCSS    | `src/styles/style.css`                      |
| モックのJS           | `src/static-html/js/main.js`                |
| 画像など             | `public/images/`                            |

<br>

## 1. モックの全体像

- **場所**: `src/static-html/`。ブラウザで各 `*.html` を直接開けばプレビューできる（ビルド不要）。
- **スタイル**: `src/styles/scss/` を Dart Sass でコンパイルした `src/styles/style.css` を各HTMLが読み込む。設計は **FLOCSS**。
- **JS**: `src/static-html/js/main.js`（バニラJS）。ヘッダー・ハンバーガー・トップへ戻る等の最小限。
- **画像**: `public/images/` を相対パスで参照。

> [!IMPORTANT]
> モック内の相対パス（例 `../../styles/style.css`、`../../../public/images/...`）は**モック専用**です。
> Astro 化後は `public/` がサイトルート配信になるため、画像は `/images/...`、CSSは Astro の import に置き換わります。

<br>

## 2. ページ一覧 / URL 対応表

| モックのファイル                       | 想定URL            | 種別           | 主な中身                                                                                            |
| -------------------------------------- | ------------------ | -------------- | --------------------------------------------------------------------------------------------------- |
| `src/static-html/index.html`           | `/`                | トップ         | 全セクション（Hero/Theme/Outline/About/News/Keynote/Session/Event/Sponsor/Organizer/Contact/Staff） |
| `src/static-html/sessions/index.html`  | `/sessions/`       | 一覧           | セッションカードのグリッド                                                                          |
| `src/static-html/sessions/single.html` | `/sessions/{slug}` | 詳細           | セッション詳細（アイキャッチ＋本文）                                                                |
| `src/static-html/events/index.html`    | `/events/`         | 一覧           | イベントカードのグリッド                                                                            |
| `src/static-html/events/single.html`   | `/events/{slug}`   | 詳細           | イベント詳細                                                                                        |
| `src/static-html/news/index.html`      | `/news/`           | 一覧           | お知らせリスト                                                                                      |
| `src/static-html/news/single.html`     | `/news/{slug}`     | 詳細           | お知らせ詳細                                                                                        |
| `src/static-html/page/index.html`      | `/{任意}`          | 固定ページ雛形 | タイトル＋本文だけの汎用テンプレ（プライバシーポリシー・行動規範などに複製して使う）                |

- **一覧ページ**（`*/index.html`）は共通枠 `.p-archive` を使い、中身だけ差し替え（セッション/イベント＝カードグリッド、お知らせ＝リスト）。
- **詳細ページ**（`*/single.html`）は共通枠 `.p-single` ＋本文プロース `.c-prose`。セッションとイベントはほぼ同型（イベントに「要申し込み」バッジが増える）。
- **固定ページ**（`page/index.html`）は詳細ページからメタ・アイキャッチ・戻るリンクを外した最小形。

> Astro では一覧・詳細は**動的ルート**（例 `src/pages/sessions/[...id].astro`）でコンテンツから生成するのが自然です（→ 9章）。

<br>

## 3. スタイル設計（FLOCSS）

クラス名の接頭辞で役割が分かります。

| 接頭辞 | 意味                            | 例                                                  |
| ------ | ------------------------------- | --------------------------------------------------- |
| `l-`   | Layout（大枠）                  | `l-header` `l-footer` `l-inner`                     |
| `p-`   | Project（ページ固有のまとまり） | `p-hero` `p-archive` `p-single` `p-news`            |
| `c-`   | Component（再利用部品）         | `c-heading` `c-front-btn` `c-back-to-top` `c-prose` |
| `u-`   | Utility（単一目的）             | `u-pink` `u-hidden--sp` `u-br--pc-tab-none`         |
| `is-`  | State（状態、JSで付け外し）     | `is-scrolled` `is-open` `is-visible`                |

BEM準拠で `__`＝要素、`--`＝モディファイア（例 `p-single__title`、`p-event__type--required`）。

### SCSS構成

```
src/styles/scss/
├── style.scss              … エントリ。@use で各モジュールを読み込む
├── settings/
│   ├── _variables.scss     … 色・ブレークポイント
│   ├── _function.scss      … fz() / darken() / lighten()
│   ├── _mixin.scss         … mq-up() / mq-down() / mq-between()
│   └── _settings.scss      … 上記3つを @forward（`@use '...settings' as s;` で使う）
└── modules/
    ├── _reset.scss         … リセット（margin/padding/list-style/見出しを初期化）
    ├── _common.scss        … ヘッダー・フッター・ユーティリティ・戻るボタン
    ├── _front.scss         … トップページ各セクション
    ├── _archive.scss       … 一覧ページ共通枠（.p-archive）
    └── _single.scss        … 詳細/固定ページ共通枠（.p-single）＋本文プロース（.c-prose）
```

### トークン / ヘルパー（`as s` で参照）

| 種類           | 定義                                                                                                                                          | 使い方                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 色             | `$main-pink #ee859a` / `$main-violet #9699cb` / `$main-yellow #fdd34e` / `$main-blue #00b1a9` / `$main-green #89c3a0` / `$text-color #231815` | `s.$main-blue`                 |
| フォントサイズ | `fz($px)` = px÷16 rem                                                                                                                         | `s.fz(18)`                     |
| 色調整         | `darken()` / `lighten()`（Dart Sass の `color.adjust` ラッパ。グローバルの `darken()` は非推奨なので**必ず `s.` 付き**で使う）                | `s.darken(s.$main-blue, 10%)`  |
| メディアクエリ | `mq-down($bp)` / `mq-up($bp)`。ブレークポイント `md=600` `lg=960` `xl=1200`。引数なしは `md`                                                  | `@include s.mq-down() { ... }` |

### ビルド

```bash
npm run sass-all   # scss をコンパイル → src/styles/style.css を生成（autoprefixer込み）
npm run sass       # 上記 + ファイル監視（watch）
```

新しいスタイルは **`modules/` にファイルを足して `style.scss` で `@use`** する（既存の `archive`/`single` と同じ流儀）。

<br>

## 4. コンポーネント / パーツ早見表

| クラス                                                                             | 役割                                                                                                                                                              | 定義ファイル    | 使用ページ       |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------- |
| `l-header` / `l-header__*`                                                         | ヘッダー・ナビ・ハンバーガー                                                                                                                                      | `_common.scss`  | 全ページ         |
| `l-footer` / `l-footer__*`                                                         | フッター（ロゴ・SNS・ナビ・コピーライト）                                                                                                                         | `_common.scss`  | 全ページ         |
| `l-inner`                                                                          | 最大幅1200px＋中央寄せ                                                                                                                                            | `_common.scss`  | 各セクション内側 |
| `c-heading` / `__title` `__subtitle`                                               | セクション見出し（英題＋日本語）                                                                                                                                  | `_front.scss`   | 全体             |
| `c-front-btn`                                                                      | 大きめの丸ボタン（背景SVG）                                                                                                                                       | `_front.scss`   | トップ・各所     |
| `c-back-to-top`                                                                    | 右下の「トップへ戻る」ボタン                                                                                                                                      | `_common.scss`  | 全ページ         |
| `c-prose`                                                                          | **本文プロース**。Markdown由来の h2/h3/h4・p・a・ul/ol・blockquote・code/pre・img・hr・table にスタイル                                                           | `_single.scss`  | 詳細・固定ページ |
| `p-archive` / `__inner`                                                            | 一覧ページ共通枠（ヘッダー直下の余白＋パディング）                                                                                                                | `_archive.scss` | 各一覧           |
| `p-single` / `__inner` `__head` `__title` `__meta` `__badge` `__eyecatch` `__back` | 詳細/固定ページ共通枠                                                                                                                                             | `_single.scss`  | 各詳細・固定     |
| `p-program` / `__grid` `__item` `__link` `__title` `__img-wrap` `__type` `__meta*` | セッション/イベントの**カード**（共通部分）                                                                                                                       | `_front.scss`   | トップ・一覧     |
| `p-event` / `__meta-wrap` `__type` `__type--required`                              | イベント**固有**（種別バッジ・要申し込みバッジ）                                                                                                                  | `_front.scss`   | イベント         |
| `p-news` / `__list` `__item` `__date` `__category` `__category--*`                 | お知らせ**リスト**。カテゴリバッジの色は**色グループ**（`--session`/`--event`/`--sponsor`/`--news`/`--highlight`、→ 8章）。お知らせ詳細のバッジもこのクラスを共用 | `_front.scss`   | トップ・お知らせ |

> [!NOTE]
> `p-program` と `p-event` の切り分け：**セッションとイベントで共通のカード構造は `p-program__*`、イベント固有は `p-event__*`**。
> `p-single` は「詳細ページ」用だが、`page/index.html`（固定ページ）でも同じ枠を流用しています（メタ等を省くだけ）。専用クラス（例 `.p-page`）に分けたくなったら別出し可。

<br>

## 5. JavaScript（`src/static-html/js/main.js`）

バニラJSで以下の4つだけ。対応する `id`／状態クラスも記載します。

| 機能                 | 概要                                                                                | 使う id                 | 状態クラス    |
| -------------------- | ----------------------------------------------------------------------------------- | ----------------------- | ------------- |
| スクロールパディング | ヘッダー高さ＋余白を CSS変数 `--header-height` に反映（アンカー移動時のオフセット） | `js-header`             | —             |
| ヘッダー影           | スクロールすると影を付ける                                                          | `js-header`             | `is-scrolled` |
| トップへ戻る         | 300px以上スクロールで表示、クリックで先頭へ                                         | `js-back-to-top`        | `is-visible`  |
| ハンバーガー         | 開閉トグル／外クリックで閉じる／リンククリックで閉じる                              | `js-hamburger` `js-nav` | `is-open`     |

Astro でもこのJSはほぼそのまま使えます（クライアントスクリプトとして読み込む、または各挙動を小さなコンポーネントに移す）。

<br>

## 6. head / メタ（OGP・favicon）

各HTMLの `<head>` に、description・OGP・Twitter Card・favicon・theme-color を記載済みです。

- `description` / `og:description`・`og:title` は**ページ固有**（一覧＝「〜一覧」、詳細＝記事タイトルをそのまま、トップ＝サイト説明）。
- `og:image` / `og:url` は**本番の絶対URL**（`https://dojocon2026.coderdojo.jp/...`）。
- favicon は `public/images/common/` の `favicon.ico` と `apple-touch-icon-180x180.png`（モックでは相対パス参照）。
- OGP画像（`og:image`）は既定で `public/images/common/ogp.webp`（モックの全ページはこれ固定）。
- **詳細ページはそのページのアイキャッチを `og:image` にする。** Astro なら「アイキャッチがあればそれ、無ければ `ogp.webp`」と出し分ける：`new URL(post.data.image ?? '/images/common/ogp.webp', Astro.site)`。

> Astro では `BaseLayout.astro` の `Props`（title/description、必要なら任意の `ogImage`）で**一元管理**し、`og:image`/`og:url` は `Astro.site` から絶対URLを生成するのが定石（既存 `BaseLayout.astro` が既にこの実装）。モックの各ページの値を Props に落とし込めばOK。詳細ページはアイキャッチを `ogImage` として渡せば、そのページ固有のOGP画像になる。

<br>

## 7. アセット（`public/images/`）

```
public/images/
├── common/     … logo.webp / ogp.webp / favicon.ico / apple-touch-icon-180x180.png / icon_x.svg / icon_facebook.svg / icon_youtube.svg
├── front/      … bg_iwate.webp / tagline.svg / btn.svg / btn_sp.svg / keynote_ueda(_sp).webp / coderdojo_logo(_mark) など
├── sessions/   … no_image.webp / session_dammy01.png / session_dammy02.png
├── events/     … no_image.webp / event_dammy01.png / event_dammy02.png
├── staff/      … スタッフ写真（未設定は staff_noimage.webp）
└── sponsors/   … スポンサーロゴ
```

- 画像は基本 **webp**。
- **`no_image.webp`（`sessions/` `events/` 各カテゴリ）は「画像未設定時のフォールバック」**。ダミーではなく仕様として残す画像で、記事に画像が無いときに出力する（→ 9章）。
- `*_dammy*` はダミー画像。実データに差し替え前提。

<br>

## 8. Astro化の進め方（推奨：SCSSをそのまま持ち込む）

**方針**: モックの SCSS 設計（FLOCSS・トークン・コンポーネント）を Astro にそのまま持ち込み、Tailwindベースのダミー（`src/styles/global.css`／`src/components/`／`src/components/sections/`）を置き換える。デザインを完全再現でき、作り直しが最小で済みます。Astro は既に `sass` を依存に持つので SCSS 導入は容易です。

> [!IMPORTANT]
> **`src/styles/scss/` の中身は変更しない。** 個々のCSSを読み解いて再現・調整する作業は不要で、そのままコンパイルして適用する。
> Astro化でやることは「**HTMLマークアップを Astro の構造（レイアウト／コンポーネント／コンテンツコレクション）に載せ替える**」ことだけ。見た目は変えない。

### 手順の目安

1. **SCSSを取り込む**
   - `src/styles/scss/` をそのまま採用。`BaseLayout.astro` で `src/styles/style.css`（コンパイル結果）を import するか、`style.scss` を直接 import（Vite/astro が SCSS を処理）。
   - ダミーの `src/styles/global.css`（Tailwind `@theme`）は不要になったら外す。**Tailwind は必須ではない**（SCSSが主。残す/外すは任意）。

2. **共通レイアウトへ分解**
   - `BaseLayout.astro` … `<head>`（メタは Props で一元化）＋ `l-header` ＋ `<slot />` ＋ `l-footer` ＋ `c-back-to-top` ＋ `main.js`。
   - `Header.astro` / `Footer.astro` … モックの `l-header` / `l-footer` のマークアップをそのまま移植。
   - 一覧レイアウト … `p-archive`、詳細レイアウト … `p-single`、固定ページ … `page`。

3. **コンテンツをデータ化（Content Collections）**
   - お知らせは既存の `src/content/news/*.md` ＋ `src/content.config.ts` を流用。詳細は `src/pages/news/[...id].astro` で生成（既にある）。**本文を `.c-prose` でラップ**してモックのプローススタイルを当てる。
     - **カテゴリは「名前(label)」と「色(color)」を分ける**（自由記入だと色が決まらないため）。現行の `category: z.string()` を廃し、`label`（表示名・自由）＋ `color`（色グループ・**選択式**）にする：
       ```ts
       label: z.string().default("お知らせ"),
       color: z.enum(["session", "event", "sponsor", "news", "highlight"]).default("news"),
       ```
       表示：`<span class={`p-news**category p-news**category--${color}`}>{label}</span>`。**名前が違っても同じ `color` なら同色**になる（例：`label: 登壇者` を `color: session` にすればセッション色）。
     - **色グループ**（`.p-news__category--*`、色は既存トークン）：`session`=ピンク / `event`=紫 / `sponsor`=緑 / **`news`=青（既定・その他の受け皿）** / `highlight`=黄（予備・文字色のみ濃色）。カテゴリ名は自由に増やせるが、色はこの5グループに収束するので破綻しない。
     - ⚠ 既存の `src/content/news/*.md` は `category:`（例 `登壇者`）で書かれているので、移行時に `label`＋`color` へ置換が必要（例：`label: 登壇者` / `color: session`）。
   - **セッション・イベントも frontmatter＋Markdown 化**（現在は空の `src/data/program.ts`）。`title` / `category`（種別）/ `target`（対象）/ `image` / イベントは `needsReservation`（要申し込み）などを frontmatter に。`image` は**任意**にして、未指定なら `no_image.webp` を既定値にする（`post.data.image ?? '/images/sessions/no_image.webp'`）。
   - 一覧（カードグリッド）と詳細を collection から生成。動的ルート例：`src/pages/sessions/[...id].astro`、`src/pages/events/[...id].astro`。カードのマークアップは `p-program__*` / `p-event__*` をそのまま使う。

4. **固定ページ**
   - プライバシーポリシー・行動規範などは、`page/index.html` を型に **Markdown＋共通レイアウト**（例 `src/pages/privacy.md` に `layout:` を指定）で作るのが素直。本文は `.c-prose` を当てる。

5. **メタ / OGP / favicon**
   - `BaseLayout.astro` に集約（既存実装がベース）。favicon は `public/images/common/` のものに差し替え。

<br>

## 9. 申し送り・既知の注意点

- **ダミーデータ**: カードの件数・タイトル・登壇者・日付・ダミー画像（`*_dammy*`）は仮。実データに差し替え前提。
- **`no_image.webp` はダミーではなく「画像未設定時のフォールバック」**: 記事に画像を入れなかったときに各カテゴリ（`sessions/` `events/`）の `no_image.webp` を出す、という**仕様上の既定画像**。差し替えて消すものではない。Astro でも実現可能で、frontmatter の `image` を**任意**にして、コンポーネント側で既定値を与えればよい（例：`const image = post.data.image ?? '/images/sessions/no_image.webp'`）。
- **未接続リンク（`href="#"`）**: 参加登録・お問い合わせ・タイムテーブル・フッターの行動規範/プライバシーポリシー・詳細ページのスラッグなどは未設定。Astro化時に実URL/ルートへ。（※フッターのSNSアイコン3種は実URL設定済み）
- **固定ページ**: `page/index.html` は**どこからもリンクされていない**テンプレート。プライバシーポリシー・行動規範等はまだ作っていない（`page/` を複製して本文差し替え＋フッターリンク接続する想定）。
- **相対パス**: 前述の通りモック専用。Astro では絶対パス/importに変換。
- **命名**: FLOCSS を維持。`p-program`（セッション/イベント共通カード）と `p-event`（イベント固有）の使い分け、`p-single` を固定ページにも流用している点に注意。

<br>

## 10. AI（Claude Code）向けのヒント

- **デザインの正は `src/static-html/` ＋ `src/styles/scss/`**。ここに合わせる。現状 Astro の Tailwind ダミーに引きずられない。**スタイル（SCSS）は一切変更せずそのまま使う**（個々のCSSを再現・調整する必要はない）。
- スタイルを足すときは **FLOCSS命名を踏襲**し、`src/styles/scss/modules/` にファイル追加 → `style.scss` で `@use`。設定値は `settings`（`as s`）から。**`darken()` は必ず `s.darken()`**（グローバルは非推奨警告）。
- 変更後は **`npm run sass-all`** でコンパイル（エラー/警告ゼロを確認）。
- マークアップはモックの各HTMLをソース・オブ・トゥルースとしてコピーし、繰り返し部分（カード・リスト・記事）を Astro コンポーネント／`map()`／Content Collections に置き換える。
- 既存 `docs/architecture.md`・`docs/content-editing.md` は**現状のダミー Astro** の説明なので、Astro化後は実装に合わせて更新が必要（このモック移植と整合するよう書き換える）。
