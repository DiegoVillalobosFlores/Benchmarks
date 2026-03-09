import fs from "fs";
import { SQL, BunFile } from "bun";
import log from "./logger";

async function hashMigration(file: BunFile) {
  const content = await file.text();

  const sha = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content),
  );

  const hash = Array.from(new Uint8Array(sha))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hash;
}

export default async function runMigrations(
  sqlClient: SQL,
  migrationsFolder: string,
) {
  log("Running db migrations...");
  log("Reading migration files...");
  const files = fs.readdirSync(migrationsFolder);
  log("Migration files:", files);

  log("Checking existing migrations...");
  const existingMigrations =
    await sqlClient`SELECT * FROM sqlite_master WHERE type='table' AND name='_Migrations';`;

  if (existingMigrations.length === 0) {
    log("No existing migrations found, creating migration table...");
    await sqlClient`CREATE TABLE IF NOT EXISTS "_Migrations"
    (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
        name          TEXT        NOT NULL,
        sha_hash      TEXT UNIQUE NOT NULL,
        applied_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
        prev_sha_hash TEXT UNIQUE
    );`;
  }

  log("Fetching applied migrations...");
  const appliedMigrations = await sqlClient`SELECT * FROM _Migrations;`;
  log("Applied migrations:", appliedMigrations);

  log("Hashing migration files...");
  const orderedFiles = files.sort((a, b) => a.localeCompare(b));

  const hashedMigrations = await Promise.all(
    orderedFiles.map(async (file) => {
      const hash = await hashMigration(Bun.file(`${migrationsFolder}/${file}`));
      return { name: file, hash };
    }),
  );
  log("Hashed migrations:", hashedMigrations);

  log("Applying migrations...");
  for (let i = 0; i < hashedMigrations.length; i++) {
    const pendingMigration = hashedMigrations[i];
    if (!pendingMigration) throw new Error(`Migration ${i} is undefined`);

    const { name, hash } = pendingMigration;

    const prevHash = hashedMigrations[i - 1]?.hash;

    const appliedMigration = appliedMigrations.find((m) => m.name === name);

    if (!appliedMigration) {
      log(`Running migration ${name}`);

      await sqlClient.begin(async (tx) => {
        await tx`INSERT INTO _Migrations (name, sha_hash, prev_sha_hash) VALUES (${name}, ${hash}, ${prevHash});`;
        await tx.file(`${migrationsFolder}/${name}`);
      });

      continue;
    }

    if (appliedMigration.sha_hash !== hash) {
      throw new Error(
        `Migration ${name} has a different hash than the one in the database`,
      );
    }

    log(`Skipping migration ${name} (already applied)`);
  }

  log("✅ Migrations completed");
}
