import buildClientBundle from "./utils/buildClientBundle";
import { rm } from "node:fs/promises";

const buildStart = new Date();

await rm("./dist", { recursive: true, force: true });
await rm("./cache", { recursive: true, force: true });
await rm("./build", { recursive: true, force: true });

const build = await buildClientBundle();
const buildEnd = new Date();
const buildDurationMs = buildEnd.getTime() - buildStart.getTime();

console.log("Client bundle built successfully in ", buildDurationMs, "ms");
console.log(`Assets: `, build);

process.exit(0);
