import { readdirSync } from "fs";

const entrypoints = readdirSync("./src/entrypoints", { withFileTypes: true })
  .filter(
    (entry) =>
      !entry.isDirectory() &&
      entry.name !== "index.ts" &&
      entry.name !== "favicon.svg" &&
      entry.name !== "font.ttf",
  )
  .reverse()
  .map((entry) => {
    return `${entry.parentPath}/${entry.name}`;
  });

export default entrypoints;
