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
  return (
    <div
      style={{
        border: "2px solid lightseagreen",
        borderRadius: "14px",
        padding: "8px 32px",
        height: "100%",
      }}
    >
      {benchmarks.map((benchmark) => (
        <BenchmarkListItem key={benchmark.id} benchmark={benchmark} />
      ))}
    </div>
  );
}
