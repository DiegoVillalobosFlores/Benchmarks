type Benchmark = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  benchmark: Benchmark;
};

export default function BenchmarkListItem({ benchmark }: Props) {
  return (
    <div
      key={benchmark.id}
      style={{ display: "flex", gap: "2rem", alignItems: "center" }}
    >
      <h2>{benchmark.id}</h2>
      <h3>{benchmark.name}</h3>
      <p>{benchmark.created_at}</p>
    </div>
  );
}
