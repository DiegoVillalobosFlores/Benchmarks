import generateClientProps from "@/utils/generateClientProps";
import log from "@/utils/logger";
import serverContext from "@/utils/serverContext";
import { prerender } from "react-dom/static";
import { snapshot } from "valtio/vanilla";

export default async function HomeRoutes() {
  const serverContextSnapshot = snapshot(serverContext);
  const { sqlClient, buildManifest, serviceInstances } = serverContextSnapshot;

  if (!sqlClient || !buildManifest || !serviceInstances)
    throw new Error("Context is not initialized");

  const homePage = await import("./home.page");

  const filePath = Bun.fileURLToPath(import.meta.url.split(".")[0]);

  const pageBuildContext =
    buildManifest[filePath.split("app/").pop().split(".")[0]];

  log(pageBuildContext);

  const { prelude } = await prerender(
    homePage.default({
      assetLinks: pageBuildContext.assets,
    }),
    {
      bootstrapScriptContent: generateClientProps({
        assetLinks: pageBuildContext.assets,
      }),
      bootstrapModules: pageBuildContext.scripts,
    },
  );

  const response = new Response(prelude);
  const buffer = await response.arrayBuffer();

  const cache = Bun.zstdCompressSync(buffer, {
    level: 22,
  });

  return {
    "/": new Response(cache, {
      headers: {
        "Content-Type": "text/html",
        "Content-Encoding": "zstd",
      },
    }),
  };
}
