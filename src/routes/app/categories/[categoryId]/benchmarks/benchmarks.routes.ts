import generateClientProps from "@/utils/generateClientProps";
import log from "@/utils/logger";
import serverContext from "@/utils/serverContext";
import { BunRequest, Server } from "bun";
import { renderToReadableStream } from "react-dom/server.bun";
import { prerender } from "react-dom/static";
import { snapshot } from "valtio/vanilla";

export default async function BenchmarksRoutes() {
  const serverContextSnapshot = snapshot(serverContext);
  const { sqlClient, serviceInstances, buildManifest } = serverContextSnapshot;

  if (!sqlClient || !serviceInstances || !buildManifest)
    throw new Error("Context is not initialized");

  const page = await import("./benchmarks.page");

  const benchmarksApi = await import("./benchmarks.api");
  const benchmarksRoutes = await benchmarksApi.default({
    context: {
      benchmarksServiceInstance: serviceInstances.benchmarksServiceInstance,
    },
  });

  const benchmarks = await sqlClient`
          select b.id, g.name, b.created_at from Benchmark b join main.Game G on G.id = b.game_id order by b.created_at desc;
        `;

  const filePath = Bun.fileURLToPath(import.meta.url.split(".")[0]);

  const pageBuildContext =
    buildManifest[filePath.split("app/").pop().split(".")[0]];

  const { prelude } = await prerender(
    page.default({
      benchmarks,
      assetLinks: pageBuildContext.assets,
    }),
    {
      bootstrapScriptContent: generateClientProps({
        benchmarks,
        assetLinks: pageBuildContext.assets,
      }),
      bootstrapModules: pageBuildContext.scripts,
    },
  );

  const response = new Response(prelude);
  const buffer = await response.arrayBuffer();
  const cache = Bun.zstdCompressSync(buffer, {
    level: 22,
  });

  return {
    "/categories/:categoryId/benchmarks": cache
      ? new Response(cache, {
          headers: {
            "Content-Type": "text/html",
            "Content-Encoding": "zstd",
          },
        })
      : async () => {
          console.time("benchmarks");
          const benchmarks = await sqlClient`
              select b.id, g.name, b.created_at from Benchmark b join main.Game G on G.id = b.game_id order by b.created_at desc;
            `;
          const stream = await renderToReadableStream(
            page.default({
              benchmarks,
            }),
            {
              bootstrapScriptContent: generateClientProps({
                benchmarks,
              }),
              bootstrapModules: pageBuildContext.scripts,
            },
          );
          console.timeEnd("benchmarks");
          return new Response(stream, {
            headers: {
              "Content-Type": "text/html",
            },
          });
        },
    ...Object.entries(benchmarksRoutes).reduce(
      (acc, [path, handler]) => {
        acc[path] = async (req, server) => {
          const { server: globalServer } = snapshot(serverContext);
          if (!globalServer) throw new Error("Server not initialized");
          const response = await handler(req, server);
          log("Invalidating cache, reloading server", path);
          server.reload(globalServer);
          return response;
        };
        return acc;
      },
      {} as Record<
        string,
        (req: BunRequest, server: Server<any>) => Promise<Response>
      >,
    ),
  };
}
