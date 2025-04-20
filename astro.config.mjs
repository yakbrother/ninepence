import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://mostlytrue.life",
  integrations: [sitemap(), mdx()],

  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
