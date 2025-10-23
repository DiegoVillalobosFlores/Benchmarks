import { useEffect, useState } from "react";
import BenchmarkListItem from "./BenchmarkListItem";
import useKeyboardNavigation from "@/utils/useKeyboardNavigation";

type Benchmark = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  benchmarks: Array<Benchmark>;
};

export default function BenchmarkList({ benchmarks }: Props) {
  const { selectedIndex, setSelectedIndex } = useKeyboardNavigation(
    null,
    benchmarks.length - 1,
  );

  return (
    <div>
      {benchmarks.map((benchmark, index) => (
        <BenchmarkListItem
          onFocus={() => setSelectedIndex(index)}
          isSelected={selectedIndex === index}
          key={benchmark.id}
          benchmark={benchmark}
        />
      ))}
    </div>
  );
}
