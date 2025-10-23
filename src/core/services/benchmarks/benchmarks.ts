import Benchmark from "@/types/Benchmark";
import { sql, SQL } from "bun";

type ServiceResult<T> =
  | {
      result: T;
      error?: undefined;
    }
  | {
      result?: undefined;
      error?: { status: number; message: string };
    };

export default function BenchmarksService({ sqlClient }: { sqlClient: SQL }) {
  return {
    createBenchmark: async ({
      benchmarkFile,
      game_id,
    }: {
      benchmarkFile: File;
      game_id: number;
    }): Promise<ServiceResult<{ id: number }>> => {
      const data = await benchmarkFile.text();

      const splitData = data.split("\n").map((line) => line.trim());

      const valuesWithHeader = splitData.toSpliced(0, 6);

      const header = valuesWithHeader[0].split(",");

      console.log(header);

      const dataPoints = valuesWithHeader.toSpliced(0, 1).map((line) => {
        const dataPoint = {};

        const values = line.split(",").map(Number);

        for (const value of values) {
          dataPoint[header[values.indexOf(value)]] = value;
        }

        return dataPoint;
      });

      // console.log(dataPoints);

      const [benchmark] = await sqlClient<Array<{ id: number }>>`
        INSERT INTO "Benchmark" ${sql({ game_id })}
        RETURNING id;
      `;

      if (!benchmark) {
        return {
          error: { status: 500, message: "Failed to create benchmark" },
        };
      }

      console.log(dataPoints.length);

      await sqlClient.begin(async (tx) => {
        for (const metric of dataPoints) {
          await tx`INSERT INTO "BenchmarkMetric" ${sql({ benchmark_id: benchmark.id, ...metric })} RETURNING id`;
        }
      });

      const metrics = await sqlClient<Array<{ id: number }>>`
        select AVG(frametime), AVG(fps), AVG(gpu_power), AVG(gpu_core_clock) from BenchmarkMetric where benchmark_id = ${benchmark.id};
      `;

      console.log(metrics);

      return { result: metrics };
    },
  };
}
