import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { generateOGImages } from "./scripts/generate-og-images.js";

// https://astro.build/config
export default defineConfig({
  site: "https://mostlytrue.life",
  integrations: [sitemap(), mdx()],

  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },

  build: {
    // Generate OG images during build
    hooks: {
      "astro:build:start": async () => {
        await generateOGImages();
      },
    },
  },
});
