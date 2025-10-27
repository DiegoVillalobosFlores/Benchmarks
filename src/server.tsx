import { serve } from "bun";
import SQLiteClient from "./core/clients/sql/sqlite";
import { watch } from "fs";
import routesServer from "./routes/routes";
import { rm } from "node:fs/promises";
import buildClientBundle from "./utils/buildClientBundle";
import log from "./utils/logger";

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
  log("Building client bundle...");

  await rm("dist", { recursive: true, force: true });
  await rm("cache", { recursive: true, force: true });
  await rm("build", { recursive: true, force: true });

  await buildClientBundle();
  log("✅ Client bundle built");

  log("Running db migrations...");
  await SQLClientInstance.file("./src/core/sql/migrations/1.sql");
  log("✅ Migrations completed");
}

const { scripts, assets } = await Bun.file("./build/manifest.json").json();

const routes = await routesServer({
  SQLClientInstance,
  scripts,
  assets,
});

const server = serve(routes);

const cacheWatcher = watch("./cache", async (event, filename) => {
  const startTime = Date.now();
  const routes = await routesServer({
    SQLClientInstance,
    scripts,
    assets,
  });
  log(
    `🏁 Reloaded server in ${Date.now() - startTime}ms with new cache ${filename}`,
  );

  server.reload(routes);
});

if (process.env.NODE_ENV === "development") {
  log("Connecting to HMR websocket...");
  const socket = new WebSocket("ws://localhost:3000/websockets/__dev/hmr");

  socket.addEventListener("open", () => {
    log("✅ HMR websocket connected");
    socket.send(JSON.stringify({ type: "reload" }));
  });
}

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  log("Closing cache watcher...");
  cacheWatcher.close();

  process.exit(0);
});

const serverStartEndTime = Date.now();
log(
  `🚀 Server started in ${serverStartEndTime - serverStartTime}ms at ${server.url}`,
);
