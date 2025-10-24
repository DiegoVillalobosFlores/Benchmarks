import { serve } from "bun";
import entrypoints, { assetMapStaticFiles } from "./entrypoints";
import benchmarksRoutes from "./routes/api/benchmarks";
import BenchmarksServiceInstance from "./core/services/benchmarks";
import SQLiteClient from "./core/clients/sql/sqlite";
import applicationPagesRoutes from "./routes/app/index";
import { watch } from "fs";
import readCache from "./utils/readCache";
import { rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await rm("cache", { recursive: true, force: true });

const bundledEntrypoints = Object.values<string[]>(entrypoints);

const scripts: {
  root: string[];
  upload: string[];
} = {
  root: [],
  upload: [],
};

for (const extensionBundle of bundledEntrypoints) {
  const result = await Bun.build({
    entrypoints: extensionBundle,
    minify: true,
    outdir: "dist",
    sourcemap: "linked",
    splitting: true,
    packages: "bundle",
    target: "browser",
  });

  const chunks = result.outputs.filter((output) => output.kind === "chunk");

  for (const scriptExtension of extensionBundle) {
    if (!scriptExtension.endsWith(".tsx")) continue;
    const scriptName = scriptExtension.split("/").pop() as string;
    const scriptNameWithoutExtension = scriptName.split(".")[0];

    if (!scriptNameWithoutExtension) continue;
    if (
      !scriptNameWithoutExtension.startsWith("root") &&
      !scriptNameWithoutExtension.startsWith("upload")
    )
      continue;

    scripts[scriptNameWithoutExtension as keyof typeof scripts] = [
      `${scriptNameWithoutExtension}.js`,
      ...chunks.map((chunk) => chunk.path.split("/").pop() as string),
    ];
  }
}

const SQLClientInstance = await SQLiteClient();

const benchmarksServiceInstance = await BenchmarksServiceInstance({
  sqlClient: SQLClientInstance,
});

const cache = await readCache();

const server = serve({
  routes: {
    ...(await applicationPagesRoutes({ SQLClientInstance, cache, scripts })),
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
      ...(await applicationPagesRoutes({ SQLClientInstance, cache, scripts })),
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
