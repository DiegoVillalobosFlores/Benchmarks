import { BenchmarksService } from "@/types/BenchmarkService";

export default async function createBenchmarkRouteHandler({
  request,
  benchmarksServiceInstance,
}: {
  request: Request;
  benchmarksServiceInstance: BenchmarksService;
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

  return Response.json(result);
}
