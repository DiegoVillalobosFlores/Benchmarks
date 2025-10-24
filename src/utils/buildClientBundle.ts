import entrypoints from "@/entrypoints";
import AppAssetMap from "@/types/AppAssetMap";
import AppRouteScripts from "@/types/AppRouteScripts";

export default async function buildClientBundle(): Promise<{
  scripts: AppRouteScripts;
  assets: AppAssetMap;
}> {
  const bundledEntrypoints = Object.values<string[]>(entrypoints);

  const scripts: AppRouteScripts = {
    root: [],
    upload: [],
  };

  const assets: AppAssetMap = {
    favicon: "",
    globalStyles: "",
    font: "",
  } as const;

  for (const extensionBundle of bundledEntrypoints) {
    const result = await Bun.build({
      entrypoints: extensionBundle,
      minify: true,
      outdir: "dist",
      sourcemap: "linked",
      splitting: true,
      packages: "bundle",
      target: "browser",
    });

    const chunks = result.outputs.filter((output) => output.kind === "chunk");

    for (const scriptExtension of extensionBundle) {
      if (!scriptExtension.endsWith(".tsx")) continue;
      const scriptName = scriptExtension.split("/").pop() as string;
      const scriptNameWithoutExtension = scriptName.split(".")[0];

      if (!scriptNameWithoutExtension) continue;
      if (
        !scriptNameWithoutExtension.startsWith("root") &&
        !scriptNameWithoutExtension.startsWith("upload")
      )
        continue;

      scripts[scriptNameWithoutExtension as keyof typeof scripts] = [
        `${scriptNameWithoutExtension}.js`,
        ...chunks.map((chunk) => chunk.path.split("/").pop() as string),
      ];
    }

    for (const assetExtensions of extensionBundle) {
      if (assetExtensions.endsWith(".tsx")) continue;
      const assetName = assetExtensions.split("/").pop() as string;
      const assetNameWithoutExtension = assetName.split(".")[0];

      const buildAssets = result.outputs.filter(
        (output) => output.kind === "asset",
      );

      if (!assetNameWithoutExtension) continue;
      if (!Object.keys(assets).includes(assetNameWithoutExtension)) continue;

      assets[assetNameWithoutExtension as keyof typeof assets] =
        buildAssets[0]?.path.split("/").pop();
    }
  }

  return {
    scripts,
    assets,
  };
}
