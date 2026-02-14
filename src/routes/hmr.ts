import { serve } from "bun";
import websocketRoutes from "./websockets/websockets";
import log from "@/utils/logger";

const HMR_PORT = process.env.HMR_PORT || 3001;

export default async function hmrRoutes() {
  log("Starting HMR server...");
  serve({
    port: HMR_PORT,
    routes: {
      ...websocketRoutes(),
    },
    async fetch(req) {
      const url = new URL(req.url).pathname;
      log(`Found unhandled route: ${url}`);

      return new Response("Not Found", { status: 404 });
    },
    websocket: {
      message: (ws, message) => {
        ws.send(message);
      },
      open: () => {},
      close: () => {},
    },
  });
  log("✅ HMR server started");

  log("Connecting to HMR websocket...");
  const socket = new WebSocket(
    `ws://localhost:${HMR_PORT}/websockets/__dev/hmr`,
  );

  socket.addEventListener("open", () => {
    log("✅ HMR websocket connected");
    socket.send(JSON.stringify({ type: "reload" }));
  });
}
