import { SQL } from "bun";
import { renderToReadableStream } from "react-dom/server";
import { assetMap } from "@/entrypoints";
import generateClientProps from "@/utils/generateClientProps";
import { StrictMode } from "react";
import BenchmarksPage from "@/components/BenchmarksPage/BenchmarksPage";

type Page = {
  url: string;
  hydrationScript: string;
};

type Router = {
  root: Page;
};

export const pagesRouter: Router = {
  root: {
    url: "/",
    hydrationScript: "root.js",
  },
} as const;

export default function applicationPagesRoutes(SQLClientInstance: SQL) {
  return {
    [pagesRouter.root.url]: async () => {
      console.time("Compiled /");
      const benchmarks = await SQLClientInstance`
        select b.id, g.name, b.created_at from Benchmark b join main.Game G on G.id = b.game_id;
      `;

      const stream = await renderToReadableStream(
        <StrictMode>
          <BenchmarksPage assetMap={assetMap} benchmarks={benchmarks} />
        </StrictMode>,
        {
          bootstrapScriptContent: generateClientProps({ assetMap, benchmarks }),
          bootstrapModules: [pagesRouter.root.hydrationScript],
        },
      );

      console.timeEnd("Compiled /");

      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      });
    },
  };
}
