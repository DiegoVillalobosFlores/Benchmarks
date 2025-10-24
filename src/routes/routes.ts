import benchmarksRoutes from "@/routes/api/benchmarks";
import applicationPagesRoutes from "@/routes/app";
import AppAssetMap from "@/types/AppAssetMap";
import AppRouteScripts from "@/types/AppRouteScripts";
import { SQL } from "bun";
import { staticFilesRoutes } from "./static/files";
import BenchmarksServiceInstance from "@/core/services/benchmarks";
import readCache from "@/utils/readCache";
import buildClientBundle from "@/utils/buildClientBundle";

type Props = {
  SQLClientInstance: SQL;
};

export default async function routesServer({
  SQLClientInstance,
}: Props): Promise<Bun.Serve.Options<any>> {
  const benchmarksServiceInstance = await BenchmarksServiceInstance({
    sqlClient: SQLClientInstance,
  });

  const cache = await readCache();

  const { scripts, assets } = await buildClientBundle();

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
  };
}
