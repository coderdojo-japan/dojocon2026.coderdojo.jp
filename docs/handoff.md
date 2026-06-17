# :handshake: 引き継ぎメモ（コーダー向け）

このサイトの実装を引き継ぐ方へ。**最初に読むページ**です。
ここを上から順にやれば、迷わず作業を始められます。

<br>

## :one: まず読むドキュメント

| 順番 | ドキュメント                                 | 内容                                      |
| ---- | -------------------------------------------- | ----------------------------------------- |
| 1    | [README](../README.md)                       | セットアップ・コマンド・公開の仕組み      |
| 2    | [Astro 入門スライド](./astro-onboarding.md)  | Astro / Tailwind の基礎（初めてならここ） |
| 3    | [構成と仕組み](./architecture.md)            | ルーティング、**デザイン↔ファイル対応表** |
| 4    | [コンテンツ編集ガイド](./content-editing.md) | 文言・お知らせ・データの更新方法          |

「デザインのこの部分はどのファイル？」は **[architecture.md の対応表](./architecture.md#4-トップページの組み立てデザイン--ファイル対応表)** を見れば一発です。

<br>

## :two: 環境構築（最初の1回）

```bash
git clone git@github.com:coderdojo-japan/dojocon2026.coderdojo.jp.git
cd dojocon2026.coderdojo.jp
npm install      # Node.js 22.12 以上が必要
npm run dev      # http://localhost:4321/
```

VS Code を使う場合は、推奨拡張（Astro / Tailwind / Prettier / Marp）の
インストール提案が出るので入れておくと快適です。

<br>

## :three: 運営から受け取るもの（リポジトリ外）

作業前に、主催者から以下を共有してもらってください。

- [ ] **デザインのモック / Figma**（色・余白・カードの見た目を再現するために必須）
- [ ] **確定コンテンツ**：各セクションの正式な文章
- [ ] **実データ**：セッション・イベント・スポンサー・スタッフの一覧
- [ ] **画像素材**：スポンサーロゴ、スタッフ写真、セッション画像など

<br>

## :four: やることリスト（TODO）

現状は「骨組み + 仮の内容」です。以下が主な残作業です。

### コンテンツの差し替え

- [ ] 仮テキストを正式な文章に（`Hero` / `AboutCoderDojo` / `AboutDojoCon` / `Contact` など `src/components/sections/`）
- [ ] 開催情報の最終確認（`src/data/site.ts`）

### データの投入（決まり次第）

- [ ] セッション・イベント（`src/data/program.ts`）
- [ ] スポンサー（`src/data/sponsors.ts`、ロゴは `public/images/sponsors/`）
- [ ] スタッフ（`src/data/staff.ts`、写真は `public/images/staff/`）
- [ ] お知らせ（`src/content/news/` に Markdown を追加）

### 未実装セクション

- [ ] **Countdown DojoCon Japan**（過去動画の紹介）セクションを追加
      → `src/data/program.ts` と同様のデータ配列を作り、新しいセクションコンポーネントを実装
      （手順は [architecture.md「新しいセクションを追加する手順」](./architecture.md#6-新しいセクションを追加する手順)）

### デザインの作り込み

- [ ] モックに合わせて各セクションの見た目を調整（`src/components/sections/`）
- [ ] 色・フォントの最終調整は `src/styles/global.css` の `@theme` で
- [ ] スマホ表示（レスポンシブ）の確認

<br>

## :five: 進め方（おすすめ）

1. `main` から作業ブランチを切る
   ```bash
   git switch main && git pull
   git switch -c feat/sessions-section
   ```
2. 実装して `npm run dev` で確認
3. コミットして push → **Pull Request** を作成（公開前にレビューできる）
4. マージされると **GitHub Actions が自動でビルド & 公開**（数分で反映）

> push 先の `main` にマージされると、ステージング（https://dojocon2026-test.coderdojo.jp）に反映されます。

<br>

## :six: 困ったら

- 仕組みの疑問 → [architecture.md](./architecture.md)
- Astro の書き方 → [Astro 公式ドキュメント（日本語）](https://docs.astro.build/ja/)
- Tailwind のクラス → [Tailwind 公式](https://tailwindcss.com/docs)
- それでも分からなければ、遠慮なくチームに質問してください 🙆

---

**わかちあう、わかりあう** — DojoCon Japan 2026 in 岩手
