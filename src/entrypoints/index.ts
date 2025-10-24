import { readdirSync } from "fs";

const contentTypeMap = {
  css: "text/css",
  js: "application/javascript",
  svg: "image/svg+xml",
  ttf: "font/ttf",
  woff2: "font/woff2",
};

const entrypoints = readdirSync("./src/entrypoints", { withFileTypes: true })
  .filter((entry) => !entry.isDirectory() && entry.name !== "index.ts")
  .reduce(
    (acc, entry) => {
      const extension = entry.name.split(".").pop() as
        | keyof typeof contentTypeMap
        | undefined;
      if (!extension) {
        throw new Error(`Invalid asset name: ${entry.name}`);
      }

      return {
        ...acc,
        [extension]: [
          ...(acc[extension] || []),
          `${entry.parentPath}/${entry.name}`,
        ],
      };
    },
    {} as Record<string, string[]>,
  );

export const assetMapStaticFiles = async () => {
  const staticFiles = readdirSync("./dist", { withFileTypes: true }).filter(
    (entry) => entry.isFile(),
  );

  const router: Record<string, Response> = {};

  const enableCompression = true;

  for (const entry of staticFiles) {
    const readFile = await Bun.file(`dist/${entry.name}`).bytes();

    const response = enableCompression
      ? Bun.gzipSync(readFile, {
          level: 9,
          memLevel: 9,
          windowBits: 31,
        })
      : readFile;

    const headers: HeadersInit = {
      "Content-Type":
        contentTypeMap[
          entry.name.split(".").pop() as keyof typeof contentTypeMap
        ],
    };

    if (enableCompression) {
      headers["Content-Encoding"] = "gzip";
    }

    router[`/${entry.name}`] = new Response(response, {
      headers,
    });
  }

  return router;
};

export default entrypoints;
