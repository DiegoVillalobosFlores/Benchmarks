import { SQL } from "bun";
import BenchmarksService from "./benchmarks";

export default async function BenchmarksServiceInstance({
  sqlClient,
}: {
  sqlClient: SQL;
}) {
  return BenchmarksService({ sqlClient });
}
