import { SQL } from "bun";

type Props = {
  filename: string;
};

export default async function SQLiteClient({ filename }: Props) {
  const client = new SQL({
    adapter: "sqlite",
    filename,
    readwrite: true,
  });

  await client`PRAGMA foreign_keys = ON`;

  // Set journal mode to WAL for better concurrency
  await client`PRAGMA journal_mode = WAL`;

  return client;
}
