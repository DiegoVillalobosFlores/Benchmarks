import SQLiteClient from "@/core/clients/sql/sqlite";
import BenchmarksServiceInstance from "@/core/services/benchmarks";
import { BenchmarksService } from "@/types/BenchmarksService";
import { BunRequest, Server } from "bun";

type Props = {
  context: {
    benchmarksServiceInstance: BenchmarksService;
  };
};

export default async function BenchmarksAPI({
  context: { benchmarksServiceInstance },
}: Props) {
  return {
    "/categories/:categoryId/benchmarks/create": async (
      request: BunRequest<"/categories/:categoryId/benchmarks/create">,
      server: Server<never>,
    ) => {
      const { categoryId } = request.params;
      const formData = await request.formData();
      const file = formData.get("benchmark") as File | null;

      if (!file) {
        return new Response("No file provided", { status: 400 });
      }

      const { result, error } = await benchmarksServiceInstance.createBenchmark(
        {
          benchmarkFile: file,
          game_id: +categoryId,
        },
      );

      if (error) {
        return new Response(error.message, { status: error.status });
      }

      return Response.json(result);
    },
  };
}
