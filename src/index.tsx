import { serve } from "bun";
import { renderToReadableStream, renderToString } from "react-dom/server";
import App from "./routes/app/index";
import entrypoints, { assetMap, assetMapStaticFiles } from "./entrypoints";
import clientProps from "./clientProps";
import benchmarksRoutes from "./routes/api/benchmarks";
import BenchmarksServiceInstance from "./core/services/benchmarks";
import SQLiteClient from "./core/clients/sql/sqlite";
import BenchmarkSection from "./components/BenchmarkSection/BenchmarkSection";

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
    "/": async () => {
      const benchmarks = await SQLClientInstance`
        select b.id, g.name, b.created_at from Benchmark b join main.Game G on G.id = b.game_id;
      `;

      const stream = await renderToReadableStream(
        <App assetMap={assetMap}>
          <BenchmarkSection benchmarks={benchmarks} />
        </App>,
        {
          bootstrapScriptContent: clientProps({ assetMap, benchmarks }),
          bootstrapModules: ["hydrationScript.js"],
        },
      );

      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      });
    },
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
