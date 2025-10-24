import contentTypeMap from "@/utils/contentTypeMap";
import { readdirSync } from "fs";

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

export default entrypoints;
