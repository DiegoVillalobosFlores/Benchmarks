import { pagesRouter } from "@/routes/app";
import AppAssetMap from "@/types/AppAssetMap";
import { readdirSync } from "fs";

const entrypoints = readdirSync("./src/entrypoints", { withFileTypes: true })
  .filter(
    (entry) =>
      !entry.isDirectory() &&
      entry.name !== "index.ts" &&
      entry.name !== "favicon.svg" &&
      entry.name !== "font.woff2",
  )
  .reverse()
  .map((entry) => {
    return `${entry.parentPath}/${entry.name}`;
  });

export const assetMap: AppAssetMap = {
  globalStyles: "globalStyles.css",
  favicon: "favicon.svg",
  font: "font.woff2",
  ...Object.entries(pagesRouter).reduce(
    (acc, [key, value]) => {
      acc[key] = value.hydrationScript;
      return acc;
    },
    {} as Record<string, string>,
  ),
};

const contentTypeMap = {
  css: "text/css",
  js: "application/javascript",
  svg: "image/svg+xml",
  ttf: "font/ttf",
  woff2: "font/woff2",
};

export const assetMapStaticFiles = async () => {
  const staticFiles = await Promise.all(
    Object.values<string>(assetMap).map(async (assetName) => {
      const assetExtension = assetName.split(".").pop() as
        | keyof typeof contentTypeMap
        | undefined;

      if (!assetExtension) {
        throw new Error(`Invalid asset name: ${assetName}`);
      }

      if (!contentTypeMap[assetExtension]) {
        throw new Error(`Unsupported asset type: ${assetExtension}`);
      }

      return {
        [`/${assetName}`]: new Response(
          await Bun.file(`dist/${assetName}`).bytes(),
          {
            headers: {
              "Content-Type": contentTypeMap[assetExtension],
              "Content-Encoding": "gzip",
            },
          },
        ),
      };
    }),
  );

  return Object.assign({}, ...staticFiles);
};

export default entrypoints;
