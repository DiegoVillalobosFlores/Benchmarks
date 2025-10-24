import { serve } from "bun";
import SQLiteClient from "./core/clients/sql/sqlite";
import { watch } from "fs";
import { rm } from "node:fs/promises";
import routesServer from "./routes/routes";

await rm("dist", { recursive: true, force: true });
await rm("cache", { recursive: true, force: true });

await Bun.write("dist/_init", "");
await Bun.write("cache/_init", "");

const SQLClientInstance = await SQLiteClient();

const routes = await routesServer({
  SQLClientInstance,
});

const server = serve(routes);

const cacheWatcher = watch("./cache", async (event, filename) => {
  console.log(`Detected ${event} in ${filename}`);
  const routes = await routesServer({
    SQLClientInstance,
  });

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
