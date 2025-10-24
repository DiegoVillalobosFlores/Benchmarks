import RoutesCache from "@/types/RoutesCache";

export default async function readCache(): Promise<RoutesCache> {
  await Bun.write("./cache/_init", "");

  const cachedRoot = Bun.file("./cache/root.page");
  const cachedUpload = Bun.file("./cache/upload.page");

  const cache: RoutesCache = {
    root: {
      hit: await cachedRoot.exists(),
      file: cachedRoot,
      url: "/",
    },
    upload: {
      hit: await cachedUpload.exists(),
      file: cachedUpload,
      url: "/upload",
    },
  };

  return cache;
}
