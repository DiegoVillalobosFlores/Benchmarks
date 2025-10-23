import { useEffect, useState } from "react";
import BenchmarkListItem from "./BenchmarkListItem";

type Benchmark = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  benchmarks: Array<Benchmark>;
};

export default function BenchmarkList({ benchmarks }: Props) {
  const [selectedBenchmarkIndex, setSelectedBenchmarkIndex] =
    useState<number>(0);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "ArrowUp") {
        if (selectedBenchmarkIndex > 0) {
          setSelectedBenchmarkIndex((currentIndex) => {
            return currentIndex - 1;
          });
        }

        if (selectedBenchmarkIndex === 0) {
          setSelectedBenchmarkIndex(benchmarks.length - 1);
        }

        console.log("ArrowUp key pressed");
      }

      if (e.key === "ArrowDown") {
        if (selectedBenchmarkIndex < benchmarks.length - 1) {
          setSelectedBenchmarkIndex((currentIndex) => {
            return currentIndex + 1;
          });
        }

        if (selectedBenchmarkIndex === benchmarks.length - 1) {
          setSelectedBenchmarkIndex(0);
        }
        console.log("ArrowDown key pressed");
      }

      if (e.key === "Enter") {
        console.log("Enter key pressed");
      }

      if (e.key === "Escape") {
        console.log("Escape key pressed");
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [selectedBenchmarkIndex]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "2px solid lightseagreen",
        borderRadius: "16px",
        padding: "32px",
        height: "100%",
        gap: "8px",
      }}
    >
      {benchmarks.map((benchmark, index) => (
        <BenchmarkListItem
          onFocus={() => setSelectedBenchmarkIndex(index)}
          isSelected={selectedBenchmarkIndex === index}
          key={benchmark.id}
          benchmark={benchmark}
        />
      ))}
    </div>
  );
}
