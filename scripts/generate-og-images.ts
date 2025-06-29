import { generateOGImage } from "../src/lib/og-image.js";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export async function generateOGImages() {
  console.log("🖼️  Generating OG images for blog posts...");

  // Create the og-images directory if it doesn't exist
  const ogImagesDir = path.join(process.cwd(), "public", "og-images");
  try {
    await fs.mkdir(ogImagesDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  // Get all blog posts by reading the content directory directly
  const contentDir = path.join(process.cwd(), "src", "content", "stories");
  const entries = await fs.readdir(contentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const postDir = path.join(contentDir, entry.name);
    const indexPath = path.join(postDir, "index.md");
    const indexMdxPath = path.join(postDir, "index.mdx");

    let postPath = "";
    if (
      await fs
        .access(indexMdxPath)
        .then(() => true)
        .catch(() => false)
    ) {
      postPath = indexMdxPath;
    } else if (
      await fs
        .access(indexPath)
        .then(() => true)
        .catch(() => false)
    ) {
      postPath = indexPath;
    } else {
      continue;
    }

    try {
      const content = await fs.readFile(postPath, "utf-8");
      const { data } = matter(content);

      // Skip drafts
      if (data.draft) {
        console.log(`⏭️  Skipping draft: ${entry.name}`);
        continue;
      }

      console.log(`📝 Generating OG image for: ${entry.name}`);

      const imageBuffer = await generateOGImage({
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date).toISOString() : undefined,
        tags: data.tags,
      });

      // Save the image
      const imagePath = path.join(ogImagesDir, `${entry.name}.png`);
      await fs.writeFile(imagePath, imageBuffer);

      console.log(`✅ Generated: ${entry.name}.png`);
    } catch (error) {
      console.error(`❌ Error generating OG image for ${entry.name}:`, error);
    }
  }

  console.log("🎉 OG image generation complete!");
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOGImages().catch(console.error);
}
