import AppAssetMap from "@/types/AppAssetMap";
import { readdirSync } from "fs";

const entrypoints = readdirSync("./src/entrypoints", { withFileTypes: true })
  .filter(
    (entry) =>
      !entry.isDirectory() &&
      entry.name !== "index.ts" &&
      entry.name !== "favicon.svg" &&
      entry.name !== "font.ttf",
  )
  .reverse()
  .map((entry) => {
    return `${entry.parentPath}/${entry.name}`;
  });

export const assetMap: AppAssetMap = {
  globalStyles: "globalStyles.css",
  hydrationScript: "hydrationScript.js",
  hydrationScriptCSS: "hydrationScript.css",
  favicon: "favicon.svg",
  font: "font.ttf",
};

const contentTypeMap = {
  css: "text/css",
  js: "application/javascript",
  svg: "image/svg+xml",
  ttf: "font/ttf",
};

export const assetMapStaticFiles = Object.values<string>(assetMap).reduce(
  (acc, assetName) => {
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
      ...acc,
      [`/${assetName}`]: async () =>
        new Response(await Bun.file(`dist/${assetName}`).bytes(), {
          headers: {
            "Content-Type": contentTypeMap[assetExtension],
          },
        }),
    };
  },
  {},
);

export default entrypoints;
