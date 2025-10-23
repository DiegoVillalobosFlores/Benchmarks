import { SQL } from "bun";
import BenchmarksService from "./benchmarks";
import SQLiteClient from "@/core/clients/sql/sqlite";

export default async function BenchmarksServiceInstance({
  sqlClient,
}: {
  sqlClient?: SQL;
}) {
  const client = sqlClient || (await SQLiteClient());

  return BenchmarksService({ sqlClient: client });
}
