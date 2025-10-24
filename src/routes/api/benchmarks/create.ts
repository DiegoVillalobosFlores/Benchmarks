import { BenchmarksService } from "@/types/BenchmarksService";
import RoutesCache from "@/types/RoutesCache";

export default async function createBenchmarkRouteHandler({
  request,
  benchmarksServiceInstance,
  cache,
}: {
  request: Request;
  benchmarksServiceInstance: BenchmarksService;
  cache: RoutesCache;
}): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get("benchmark") as File | null;

  if (!file) {
    return new Response("No file provided", { status: 400 });
  }

  const { result, error } = await benchmarksServiceInstance.createBenchmark({
    benchmarkFile: file,
    game_id: 1,
  });

  if (error) {
    return new Response(error.message, { status: error.status });
  }

  console.log({ cache });

  if (cache.root.hit) {
    await cache.root.file.delete();
  }

  return Response.json(result);
}
