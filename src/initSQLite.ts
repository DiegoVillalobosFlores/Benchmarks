import SQLiteClient from "./core/clients/sql/sqlite";
import log from "./utils/logger";
import runMigrations from "./utils/runMigrations";

const fileDir = process.env.SQLITE_DIR;

if (!fileDir) {
  console.error("SQLITE_DIR environment variable is not set");
  process.exit(1);
}

log("Initializing SQLite database...");

const startTime = Date.now();

await Bun.write(`${fileDir}/_init`, "");

const client = await SQLiteClient({ filename: `${fileDir}/benchmarks.db` });

await runMigrations(client, "./src/core/sql/migrations");

log(`SQLite database initialized in ${Date.now() - startTime}ms`);

process.exit(0);
