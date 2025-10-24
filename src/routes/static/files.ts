import contentTypeMap from "@/utils/contentTypeMap";
import { readdirSync } from "fs";

export const staticFilesRoutes = async () => {
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
