import { serve } from "bun";
import SQLiteClient from "./core/clients/sql/sqlite";
import routesServer from "./routes/routes";
import hmrServer from "./routes/hmr";
import log from "./utils/logger";
import { subscribe } from "valtio/vanilla";
import serverContext, {
  initServerContext,
  setServerContextRoutes,
} from "./utils/serverContext";
import BenchmarksServiceInstance from "./core/services/benchmarks";
import runMigrations from "./utils/runMigrations";
import buildServer from "./utils/buildServer";

const serverStartTime = Date.now();
const fileDir = process.env.SQLITE_DIR;

if (!fileDir) {
  throw new Error("SQLITE_DIR environment variable not set");
}

const SQLClientInstance = await SQLiteClient({
  filename: `${fileDir}/benchmarks.db`,
});

log("Starting server...");
if (process.env.NODE_ENV === "development") {
  await Promise.all([
    buildServer(),
    runMigrations(SQLClientInstance, "./src/core/sql/migrations"),
    hmrServer(),
  ]);
}

const buildManifest = await Bun.file("./build/manifest.json").json();

initServerContext({
  buildManifest,
  serviceInstances: {
    benchmarksServiceInstance: await BenchmarksServiceInstance({
      sqlClient: SQLClientInstance,
    }),
  },
  sqlClient: SQLClientInstance,
});

const routes = await routesServer();

const server = serve(routes);

setServerContextRoutes({
  ...routes,
});

const serverContextSubscriber = subscribe(
  serverContext,
  async () => {
    // log("Server context updated", "new context", serverContext);
    const startTime = Date.now();
    const routes = await routesServer();
    log(`🏁 Reloaded server in ${Date.now() - startTime}ms with new context`);

    server.reload(routes);
  },
  true,
);

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  log("Closing cache watcher...");
  serverContextSubscriber();

  process.exit(0);
});

const serverStartEndTime = Date.now();
log(
  `🚀 Server started in ${serverStartEndTime - serverStartTime}ms at ${server.url}`,
);
