import BenchmarkListItem from "./BenchmarkListItem";

type Benchmark = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  benchmarks: Array<Benchmark>;
  selectedBenchmarkIndex: number | null;
  onBenchmarkFocus: (index: number) => void;
};

export default function BenchmarkList({
  benchmarks,
  selectedBenchmarkIndex,
  onBenchmarkFocus,
}: Props) {
  return (
    <div>
      {benchmarks.map((benchmark, index) => (
        <BenchmarkListItem
          onFocus={() => onBenchmarkFocus(index)}
          isSelected={selectedBenchmarkIndex === index}
          key={benchmark.id}
          benchmark={benchmark}
        />
      ))}
    </div>
  );
}
