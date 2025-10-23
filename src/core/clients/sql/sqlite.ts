import { SQL } from "bun";

export default async function SQLiteClient() {
  const client = new SQL({
    adapter: "sqlite",
    filename: "benchmarks.db",
    create: true,
    readwrite: true,
  });

  await client`PRAGMA foreign_keys = ON`;

  // Set journal mode to WAL for better concurrency
  await client`PRAGMA journal_mode = WAL`;

  await client.file("src/core/clients/sql/migrations/1.sql");

  return client;
}
