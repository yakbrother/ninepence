import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs/promises";
import path from "path";

// Load fonts
async function loadFonts() {
  const [interRegular, interBold] = await Promise.all([
    fs.readFile(path.join(process.cwd(), "public/fonts/epilogue-webfont.woff")),
    fs.readFile(path.join(process.cwd(), "public/fonts/epilogue-webfont.woff")),
  ]);

  return [
    {
      name: "Epilogue",
      data: interRegular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Epilogue",
      data: interBold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

interface OGImageOptions {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
}

export async function generateOGImage(
  options: OGImageOptions,
): Promise<Buffer> {
  const { title, description, date, tags } = options;

  const fonts = await loadFonts();

  // Format date
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "1200",
          height: "630",
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          padding: "60px",
          fontFamily: "Epilogue, system-ui, sans-serif",
        },
        children: [
          // Header with title
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              },
              children: [
                {
                  type: "h1",
                  props: {
                    style: {
                      fontSize: "64px",
                      fontWeight: "700",
                      lineHeight: "1.1",
                      margin: "0",
                      color: "#ffffff",
                    },
                    children: title,
                  },
                },
                ...(description
                  ? [
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: "28px",
                            fontWeight: "400",
                            lineHeight: "1.4",
                            margin: "0",
                            color: "#cccccc",
                            maxWidth: "1000px",
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Footer with date and tags
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "auto",
              },
              children: [
                // Date
                ...(formattedDate
                  ? [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "24px",
                            fontWeight: "400",
                            color: "#888888",
                          },
                          children: formattedDate,
                        },
                      },
                    ]
                  : []),
                // Tags
                ...(tags && tags.length > 0
                  ? [
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                          },
                          children: tags.slice(0, 3).map((tag) => ({
                            type: "span",
                            props: {
                              style: {
                                fontSize: "18px",
                                fontWeight: "400",
                                color: "#ffffff",
                                backgroundColor: "#333333",
                                padding: "8px 16px",
                                borderRadius: "20px",
                              },
                              children: tag,
                            },
                          })),
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts,
    },
  );

  const resvg = new Resvg(svg);
  const png = resvg.render();
  return png.asPng();
}
