import contentTypeMap from "@/utils/contentTypeMap";
import { readdirSync } from "fs";

export const staticFilesRoutes = async () => {
  console.time("reading dir");
  const staticFiles = readdirSync("./dist", {
    withFileTypes: true,
    recursive: true,
  })
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath}/${entry.name}`);
  console.timeEnd("reading dir");

  const enableCompression = process.env.ENABLE_ASSET_COMPRESSION
    ? process.env.ENABLE_ASSET_COMPRESSION === "true"
    : true;

  const promises = staticFiles.map(
    (staticFile) =>
      new Promise<{ url: string; response: Response }>(async (resolve) => {
        console.time(`reading file ${staticFile}`);
        const readFile = await Bun.file(staticFile).bytes();
        console.timeEnd(`reading file ${staticFile}`);

        const response = enableCompression
          ? Bun.zstdCompressSync(readFile, {
              level: 3,
            })
          : readFile;

        const headers: HeadersInit = {
          "Content-Type":
            contentTypeMap[
              staticFile.split(".").pop() as keyof typeof contentTypeMap
            ],
        };

        if (enableCompression) {
          headers["Content-Encoding"] = "zstd";
        }

        resolve({
          url: `/${staticFile}`,
          response: new Response(response, { headers }),
        });
      }),
  );

  console.time("compressing files");
  const results = await Promise.all(promises);

  console.timeEnd("compressing files");

  return results.reduce(
    (acc, result) => {
      acc[result.url] = result.response;
      return acc;
    },
    {} as Record<string, Response>,
  );
};
