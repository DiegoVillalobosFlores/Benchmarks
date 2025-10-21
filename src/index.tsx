import { serve } from "bun";
import { renderToReadableStream } from "react-dom/server";
import App from "./app/index";
import AppAssetMap from "./types/AppAssetMap";
import entrypoints from "./entrypoints";
import clientProps from "./clientProps";

await Bun.build({
  entrypoints,
  outdir: "dist",
});

const faviconFile = Bun.file("./src/entrypoints/favicon.svg");
await Bun.write("./dist/favicon.svg", faviconFile);

const assetMap: AppAssetMap = {
  globalStyles: "globalStyles.css",
  hydrationScript: "hydrationScript.js",
  favicon: "favicon.svg",
};

const contentTypeMap = {
  css: "text/css",
  js: "application/javascript",
  svg: "image/svg+xml",
};

const assetMapStaticFiles = Object.values(assetMap).reduce((acc, assetName) => {
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
}, {});

const server = serve({
  routes: {
    "/": async () => {
      const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
        bootstrapScriptContent: clientProps({ assetMap }),
        bootstrapModules: ["hydrationScript.js"],
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      });
    },
    ...assetMapStaticFiles,
  },

  async fetch(req) {
    const url = new URL(req.url).pathname;
    console.log(url);

    return new Response();
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
