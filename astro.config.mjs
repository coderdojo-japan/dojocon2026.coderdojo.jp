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
});
