import { BenchmarksService } from "@/types/BenchmarksService";
import createBenchmarkRouteHandler from "./create";
import RoutesCache from "@/types/RoutesCache";

export const benchmarksAPIRouter = {
  create: "/benchmarks/create",
};

export default function benchmarksRoutes({
  benchmarksServiceInstance,
  cache,
}: {
  benchmarksServiceInstance: BenchmarksService;
  cache: RoutesCache;
}) {
  return {
    [benchmarksAPIRouter.create]: async (request: Request) => {
      console.log(cache);
      return createBenchmarkRouteHandler({
        request,
        benchmarksServiceInstance,
        cache,
      });
    },
  };
}
