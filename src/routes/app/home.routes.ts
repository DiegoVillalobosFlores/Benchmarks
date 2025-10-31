import generateClientProps from "@/utils/generateClientProps";
import serverContext from "@/utils/serverContext";
import { prerender } from "react-dom/static";
import { snapshot } from "valtio/vanilla";

export default async function HomeRoutes() {
  const serverContextSnapshot = snapshot(serverContext);
  const { sqlClient, buildManifest, serviceInstances } = serverContextSnapshot;

  if (!sqlClient || !buildManifest || !serviceInstances)
    throw new Error("Context is not initialized");

  const homePage = await import("./home.page");

  const contextKey = "home";

  const pageBuildContext = buildManifest[contextKey];

  if (!pageBuildContext)
    throw new Error(
      "Unable to find page build context with key: " + contextKey,
    );

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
