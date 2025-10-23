import { serve } from "bun";
import entrypoints, { assetMapStaticFiles } from "./entrypoints";
import benchmarksRoutes from "./routes/api/benchmarks";
import BenchmarksServiceInstance from "./core/services/benchmarks";
import SQLiteClient from "./core/clients/sql/sqlite";
import applicationPagesRoutes from "./routes/app/index";

await Bun.build({
  entrypoints,
  outdir: "dist",
});

const faviconFile = Bun.file("./src/entrypoints/favicon.svg");
await Bun.write("./dist/favicon.svg", faviconFile);

const fontFile = Bun.file("./src/entrypoints/font.ttf");
await Bun.write("./dist/font.ttf", fontFile);

const SQLClientInstance = await SQLiteClient();

const benchmarksServiceInstance = await BenchmarksServiceInstance({
  sqlClient: SQLClientInstance,
});

const server = serve({
  routes: {
    ...applicationPagesRoutes(SQLClientInstance),
    ...benchmarksRoutes({
      benchmarksServiceInstance,
    }),
    ...assetMapStaticFiles,
  },

  async fetch(req) {
    const url = new URL(req.url).pathname;
    console.log(url);

    return new Response();
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: false,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
