import { SQL } from "bun";
import { renderToReadableStream } from "react-dom/server";
import App from "./root";
import { assetMap } from "@/entrypoints";
import generateClientProps from "@/utils/generateClientProps";

const pagesRouter = {
  root: "/",
};

export default function applicationPagesRoutes(SQLClientInstance: SQL) {
  return {
    [pagesRouter.root]: async () => {
      const benchmarks = await SQLClientInstance`
        select b.id, g.name, b.created_at from Benchmark b join main.Game G on G.id = b.game_id;
      `;

      const stream = await renderToReadableStream(
        <App assetMap={assetMap} benchmarks={benchmarks} />,
        {
          bootstrapScriptContent: generateClientProps({ assetMap, benchmarks }),
          bootstrapModules: ["hydrationScript.js"],
        },
      );

      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      });
    },
  };
}
