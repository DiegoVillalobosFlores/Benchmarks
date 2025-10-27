import { SQL } from "bun";
import { renderToReadableStream } from "react-dom/server";
import generateClientProps from "@/utils/generateClientProps";
import { StrictMode } from "react";
import BenchmarksPage from "@/components/BenchmarksPage/BenchmarksPage";
import UploadPage from "@/components/UploadPage/UploadPage";
import RoutesCache from "@/types/RoutesCache";
import AppAssetMap from "@/types/AppAssetMap";

type Page = {
  url: string;
  hydrationScripts: string[];
};

type Router = {
  root: Page;
  upload: Page;
};

const pagesRouter: Router = {
  root: {
    url: "/",
    hydrationScripts: ["root.js", "chunk-fxed1csc.js"],
  },
  upload: {
    url: "/upload",
    hydrationScripts: ["upload.js", "chunk-fxed1csc.js"],
  },
} as const;

export default async function applicationPagesRoutes({
  SQLClientInstance,
  cache,
  scripts,
  assets,
}: {
  SQLClientInstance: SQL;
  cache: RoutesCache;
  scripts: {
    root: string[];
    upload: string[];
  };
  assets: AppAssetMap;
}) {
  return {
    [pagesRouter.root.url]: cache.root.hit
      ? new Response(await cache.root.file.bytes(), {
          headers: {
            "Content-Type": "text/html",
            "Content-Encoding": "gzip",
          },
        })
      : async () => {
          console.time("Compiled /");
          const benchmarks = await SQLClientInstance`
        select b.id, g.name, b.created_at from Benchmark b join main.Game G on G.id = b.game_id order by b.created_at desc;
      `;

          const stream = await renderToReadableStream(
            <StrictMode>
              <BenchmarksPage assetMap={assets} benchmarks={benchmarks} />
            </StrictMode>,
            {
              bootstrapScriptContent: generateClientProps({
                assetMap: assets,
                benchmarks,
              }),
              bootstrapModules: scripts.root,
            },
          );

          const response = new Response(stream);
          const buffer = await response.arrayBuffer();
          const compressed = Bun.gzipSync(buffer);
          await cache.root.file.write(compressed);

          console.timeEnd("Compiled /");

          return new Response(compressed, {
            headers: {
              "Content-Type": "text/html",
              "Content-Encoding": "gzip",
            },
          });
        },
    [pagesRouter.upload.url]: cache.upload.hit
      ? new Response(await cache.upload.file.bytes(), {
          headers: {
            "Content-Type": "text/html",
            "Content-Encoding": "gzip",
          },
        })
      : async () => {
          console.time("Compiled /upload");

          const stream = await renderToReadableStream(
            <StrictMode>
              <UploadPage assetMap={assets} />
            </StrictMode>,
            {
              bootstrapScriptContent: generateClientProps({ assetMap: assets }),
              bootstrapModules: scripts.upload,
            },
          );

          const response = new Response(stream);
          const buffer = await response.arrayBuffer();
          const compressed = Bun.gzipSync(buffer);
          await cache.upload.file.write(compressed);

          console.timeEnd("Compiled /upload");

          return new Response(compressed, {
            headers: {
              "Content-Type": "text/html",
              "Content-Encoding": "gzip",
            },
          });
        },
  };
}
