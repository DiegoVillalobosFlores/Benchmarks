import buildClientBundle from "./buildClientBundle";
import log from "./logger";
import { rm } from "node:fs/promises";

export default async function buildServer() {
  const buildStart = new Date();

  log("Removing old files...");
  await Promise.all([
    rm("./dist", { recursive: true, force: true }),
    rm("./cache", { recursive: true, force: true }),
    rm("./build", { recursive: true, force: true }),
  ]);
  log("✅ Files removed");

  const buildManifest = await buildClientBundle();
  const buildEnd = new Date();

  log(`🏁 Server built in ${buildEnd.getTime() - buildStart.getTime()}ms`);

  return buildManifest;
}
