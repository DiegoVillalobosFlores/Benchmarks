import benchmarksRoutes from "@/routes/api/benchmarks";
import applicationPagesRoutes from "@/routes/app";
import { SQL, serve } from "bun";
import { staticFilesRoutes } from "./static/files";
import BenchmarksServiceInstance from "@/core/services/benchmarks";
import readCache from "@/utils/readCache";
import websocketRoutes from "./websockets/websockets";
import AppRouteScripts from "@/types/AppRouteScripts";
import AppAssetMap from "@/types/AppAssetMap";
import log from "@/utils/logger";

type Props = {
  SQLClientInstance: SQL;
  scripts: AppRouteScripts;
  assets: AppAssetMap;
};

const initialStaticRoutes = await staticFilesRoutes();

export default async function routesServer({
  SQLClientInstance,
  scripts,
  assets,
}: Props): Promise<Bun.Serve.Options<any>> {
  const benchmarksServiceInstance = await BenchmarksServiceInstance({
    sqlClient: SQLClientInstance,
  });

  const cache = await readCache();

  const appRoutes = await applicationPagesRoutes({
    SQLClientInstance,
    cache,
    scripts,
    assets,
  });

  const staticRoutes =
    process.env.NODE_ENV === "development"
      ? await staticFilesRoutes()
      : initialStaticRoutes;

  const routes: Parameters<typeof serve<any>>[0]["routes"] = {
    ...appRoutes,
    ...benchmarksRoutes({
      benchmarksServiceInstance,
      cache,
    }),
    ...staticRoutes,
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
  };

  return {
    routes,

    async fetch(req) {
      const url = new URL(req.url).pathname;
      log(`Found unhandled route: ${url}`);

      return new Response("Not Found", { status: 404 });
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
