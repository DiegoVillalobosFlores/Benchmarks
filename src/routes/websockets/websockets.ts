import { Server } from "bun";

export default function websocketRoutes() {
  return {
    "/websockets/__dev/hmr": async (req: Request, server: Server<any>) => {
      if (server.upgrade(req)) {
        return;
      }

      return new Response("Upgrade failed");
    },
  };
}
