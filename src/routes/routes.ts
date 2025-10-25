import benchmarksRoutes from "@/routes/api/benchmarks";
import applicationPagesRoutes from "@/routes/app";
import { SQL } from "bun";
import { staticFilesRoutes } from "./static/files";
import BenchmarksServiceInstance from "@/core/services/benchmarks";
import readCache from "@/utils/readCache";
import websocketRoutes from "./websockets/websockets";
import AppRouteScripts from "@/types/AppRouteScripts";
import AppAssetMap from "@/types/AppAssetMap";

type Props = {
  SQLClientInstance: SQL;
  scripts: AppRouteScripts;
  assets: AppAssetMap;
};

export default async function routesServer({
  SQLClientInstance,
  scripts,
  assets,
}: Props): Promise<Bun.Serve.Options<any>> {
  const benchmarksServiceInstance = await BenchmarksServiceInstance({
    sqlClient: SQLClientInstance,
  });

  const cache = await readCache();

  return {
    routes: {
      ...(await applicationPagesRoutes({
        SQLClientInstance,
        cache,
        scripts,
        assets,
      })),
      ...benchmarksRoutes({
        benchmarksServiceInstance,
        cache,
      }),
      ...(await staticFilesRoutes()),
      ...websocketRoutes(),
      "/.well-known/appspecific/com.chrome.devtools.json": new Response(
        JSON.stringify({
          workspace: {
            root: process.cwd(),
            uuid: Bun.randomUUIDv7(),
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
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

    websocket: {
      message: (ws, message) => {
        ws.send(message);
      },
      open: () => {},
      close: () => {},
    },
  };
}
