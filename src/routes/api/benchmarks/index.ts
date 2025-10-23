import { BenchmarksService } from "@/types/BenchmarkService";
import createBenchmarkRouteHandler from "./create";

export const benchmarkRoutePaths = {
  create: "/benchmarks/create",
};

export default function benchmarksRoutes({
  benchmarksServiceInstance,
}: {
  benchmarksServiceInstance: BenchmarksService;
}) {
  return {
    [benchmarkRoutePaths.create]: async (request: Request) =>
      createBenchmarkRouteHandler({
        request,
        benchmarksServiceInstance,
      }),
  };
}
