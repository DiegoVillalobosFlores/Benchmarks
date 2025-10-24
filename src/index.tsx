import { serve } from "bun";
import entrypoints, { assetMapStaticFiles } from "./entrypoints";
import benchmarksRoutes from "./routes/api/benchmarks";
import BenchmarksServiceInstance from "./core/services/benchmarks";
import SQLiteClient from "./core/clients/sql/sqlite";
import applicationPagesRoutes from "./routes/app/index";
import { watch } from "fs";
import readCache from "./utils/readCache";

const gzipCompressionOptions = {
  level: 9,
  memLevel: 9,
  windowBits: 31,
} as const;

try {
  for (const entrypoint of entrypoints) {
    const result = await Bun.build({
      entrypoints: [entrypoint],
      outdir: "dist",
      minify: true,
      sourcemap: "linked",
    });
    const file = Bun.file(result.outputs[0]?.path);
    await file.write(
      Bun.gzipSync(await file.arrayBuffer(), gzipCompressionOptions),
    );
  }
} catch (error) {
  console.log(error);
}

const faviconFile = Bun.file("./src/entrypoints/favicon.svg");
await Bun.write(
  "./dist/favicon.svg",
  Bun.gzipSync(await faviconFile.arrayBuffer(), gzipCompressionOptions),
);

const fontFile = Bun.file("./src/entrypoints/font.woff2");
await Bun.write(
  "./dist/font.woff2",
  Bun.gzipSync(await fontFile.arrayBuffer(), gzipCompressionOptions),
);

const SQLClientInstance = await SQLiteClient();

const benchmarksServiceInstance = await BenchmarksServiceInstance({
  sqlClient: SQLClientInstance,
});

const cache = await readCache();

const server = serve({
  routes: {
    ...(await applicationPagesRoutes(SQLClientInstance, cache)),
    ...benchmarksRoutes({
      benchmarksServiceInstance,
      cache,
    }),
    ...(await assetMapStaticFiles()),
  },

  async fetch(req) {
    const url = new URL(req.url).pathname;
    console.log(url);

    return new Response();
  },

  development: process.env.NODE_ENV !== "production" && {
    // Echo console logs from the browser to the server
    console: true,
  },
});

const watcher = watch("./cache", async (event, filename) => {
  console.log(`Detected ${event} in ${filename}`);
  const cache = await readCache();

  server.reload({
    routes: {
      ...(await applicationPagesRoutes(SQLClientInstance, cache)),
      ...benchmarksRoutes({
        benchmarksServiceInstance,
        cache,
      }),
      ...(await assetMapStaticFiles()),
    },

    async fetch(req) {
      const url = new URL(req.url).pathname;
      console.log(url);

      return new Response();
    },

    development: process.env.NODE_ENV !== "production" && {
      // Echo console logs from the browser to the server
      console: true,
    },
  });
});

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});

console.log(`🚀 Server running at ${server.url}`);
