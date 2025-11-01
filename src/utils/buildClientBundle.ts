import { readdirSync } from "fs";
import getHydrationScript from "./getHydrationScript";
import BuildManifest from "@/types/BundleManifest";
import log from "./logger";

export default async function buildClientBundle(): Promise<BuildManifest> {
  await Bun.write("./dist/_init", "");
  await Bun.write("./cache/_init", "");
  await Bun.write("./build/_init", "");

  const appPages = readdirSync("./src/routes/app", {
    withFileTypes: true,
    recursive: true,
  })
    .filter((entry) => !entry.isDirectory() && entry.name.includes(".page.tsx"))
    .map((entry) => `${entry.parentPath}/${entry.name}`);

  const appEntryppoints: string[] = [];
  const appPagePaths: string[] = [];

  for (const page of appPages) {
    const hydrationScript = getHydrationScript(page);
    await Bun.write(`./build/${page}`, hydrationScript);

    appEntryppoints.push(`./build/${page}`);
    appPagePaths.push(page.split("app/").pop()?.split(".")[0]);
  }

  const result = await Bun.build({
    entrypoints: appEntryppoints,
    minify: true,
    outdir: "dist",
    sourcemap: "linked",
    splitting: true,
    packages: "bundle",
    target: "browser",
    env: "inline",
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  });

  // We konw that these chunks are used for all the pages
  const chunks = result.outputs
    .filter((output) => output.kind === "chunk")
    .map((chunk) => chunk.path);

  // CSS, etc...
  const buildAssets = result.outputs
    .filter((output) => output.kind === "asset")
    .map((asset) => asset.path);

  const bundleManifest = result.outputs
    .filter((output) => output.kind === "entry-point")
    .reduce((acc, output) => {
      const outputKey = output.path.split(".")[0] as string;
      const appPageKey = output.path.split("dist/").pop().split(".")[0];

      // log(distPath);
      acc[appPageKey] = {
        scripts: [
          ...chunks.map((chunk) => `/dist/${chunk.split("dist/").pop()}`),
          `/dist/${output.path.split("dist/").pop()}`,
        ],
        assets: buildAssets
          .filter((asset) => asset.startsWith(outputKey))
          .map((asset) => `/dist/${asset.split("dist/").pop()}`),
      };
      return acc;
    }, {} as BuildManifest);

  Bun.write("./build/manifest.json", JSON.stringify(bundleManifest, null, 2));

  const publicFiles = readdirSync("./src/public", {
    withFileTypes: true,
    recursive: true,
  }).filter((entry) => !entry.isDirectory());

  for (const file of publicFiles) {
    Bun.write(
      `./dist/${file.name}`,
      await Bun.file(`${file.parentPath}/${file.name}`).arrayBuffer(),
    );
  }

  return bundleManifest;
}
