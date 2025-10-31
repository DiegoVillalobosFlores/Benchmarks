import { staticFilesRoutes } from "./static/files";
import websocketRoutes from "./websockets/websockets";
import log from "@/utils/logger";
import BenchmarksRoutes from "./app/categories/[categoryId]/benchmarks/benchmarks.routes";
import HomeRoutes from "./app/home.routes";

const initialStaticRoutes = await staticFilesRoutes();

export default async function routesServer(): Promise<Bun.Serve.Options<any>> {
  const benchmarkRoutes = await BenchmarksRoutes();
  const homeRoutes = await HomeRoutes();

  console.time("staticRoutes");
  const staticRoutes =
    process.env.NODE_ENV === "development"
      ? await staticFilesRoutes()
      : initialStaticRoutes;
  console.timeEnd("staticRoutes");

  const routes: Bun.Serve.Options<any>["routes"] = {
    ...benchmarkRoutes,
    ...staticRoutes,
    ...homeRoutes,
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
