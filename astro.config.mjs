// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // 本番の公開 URL（独立ドメインをルートで使うため base は "/" のまま）。
  // sitemap や canonical URL の生成に使われる。
  // ステージング (dojocon2026-test.coderdojo.jp) に出している間も、
  // 生成される絶対 URL は本番ドメインを指す（ステージングの誤インデックスを避けられる）。
  site: "https://dojocon2026.coderdojo.jp",

  integrations: [sitemap()],

  vite: {
    build: {
      // CSS の圧縮ターゲットを明示的に古めに固定する。
      // 指定しないと Vite 8 の既定では @media (max-width:599px) が
      // Media Queries Level 4 のレンジ構文 @media (width<=599px) に書き換えられ、
      // Safari 16.3 以前 / iOS 15 系の端末でレスポンシブが一切効かなくなる。
      // CoderDojo は世代の古い端末で見る子も多いため、旧構文のまま出力する。
      cssTarget: ["chrome87", "edge88", "firefox78", "safari14"],
    },
  },
});
