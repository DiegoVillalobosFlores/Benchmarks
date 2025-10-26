import SQLiteClient from "./core/clients/sql/sqlite";

const fileDir = process.env.SQLITE_DIR;

if (!fileDir) {
  console.error("SQLITE_DIR environment variable is not set");
  process.exit(1);
}

console.log("Initializing SQLite database...");

const startTime = Date.now();

await Bun.write(`${fileDir}/_init`, "");

const client = await SQLiteClient({ filename: `${fileDir}/benchmarks.db` });

await client.file("./src/core/sql/migrations/1.sql");

console.log(`SQLite database initialized in ${Date.now() - startTime}ms`);

process.exit(0);
