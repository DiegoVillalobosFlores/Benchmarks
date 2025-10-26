import { serve } from "bun";
import SQLiteClient from "./core/clients/sql/sqlite";
import { watch } from "fs";
import routesServer from "./routes/routes";
import { rm } from "node:fs/promises";
import buildClientBundle from "./utils/buildClientBundle";

const fileDir = process.env.SQLITE_DIR;

if (!fileDir) {
  throw new Error("SQLITE_DIR environment variable not set");
}

const SQLClientInstance = await SQLiteClient({
  filename: `${fileDir}/benchmarks.db`,
});

console.log("Starting server...");
if (process.env.NODE_ENV === "development") {
  console.log("Building client bundle...");

  await rm("dist", { recursive: true, force: true });
  await rm("cache", { recursive: true, force: true });
  await rm("build", { recursive: true, force: true });

  await buildClientBundle();
  console.log("Client bundle built");

  console.log("Running db migrations");
  await SQLClientInstance.file("./src/core/sql/migrations/1.sql");
  console.log("Migrations completed");
}

const { scripts, assets } = await Bun.file("./build/manifest.json").json();

const routes = await routesServer({
  SQLClientInstance,
  scripts,
  assets,
});

const server = serve(routes);

const cacheWatcher = watch("./cache", async (event, filename) => {
  console.clear();
  const startTime = Date.now();
  console.log(`Cached saved in ${filename}`, "reloading server");
  const routes = await routesServer({
    SQLClientInstance,
    scripts,
    assets,
  });
  console.log(`🏁 Reloaded in ${Date.now() - startTime}ms`);

  server.reload(routes);
});

const socket = new WebSocket("ws://localhost:3000/websockets/__dev/hmr");

socket.addEventListener("open", () => {
  console.log("Socket opened");
  socket.send(JSON.stringify({ type: "reload" }));
});

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  cacheWatcher.close();

  process.exit(0);
});

console.log(`🚀 Server running at ${server.url}`);
