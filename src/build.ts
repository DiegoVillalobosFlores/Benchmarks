import buildClientBundle from "./utils/buildClientBundle";
import { rm } from "node:fs/promises";
import log from "./utils/logger";

const buildStart = new Date();

await rm("./dist", { recursive: true, force: true });
await rm("./cache", { recursive: true, force: true });
await rm("./build", { recursive: true, force: true });

const build = await buildClientBundle();
const buildEnd = new Date();
const buildDurationMs = buildEnd.getTime() - buildStart.getTime();

log(`Client bundle built successfully in ${buildDurationMs}ms`);
log(`Assets: `, build);

process.exit(0);
