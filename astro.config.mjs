import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: "https://mostlytrue.life",
  integrations: [sitemap(), mdx(), pagefind()],

  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
