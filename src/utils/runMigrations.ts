import fs from "fs";
import { SQL } from "bun";
import log from "./logger";

export default async function runMigrations(
  sqlClient: SQL,
  migrationsFolder: string,
) {
  log("Running db migrations...");
  const files = fs.readdirSync(migrationsFolder);

  for (const file of files) {
    log(`Running migration ${file}`);
    await sqlClient.file(`${migrationsFolder}/${file}`);
  }

  log("✅ Migrations completed");
}
