type Benchmark = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  benchmark: Benchmark;
  isSelected: boolean;
  onFocus: () => void;
};

const styles = {
  root: {
    default: {
      display: "flex",
      gap: "2rem",
      alignItems: "center",
      border: "2px solid transparent",
      borderRadius: "8px",
      cursor: "pointer",
    },
    focused: {
      display: "flex",
      gap: "2rem",
      alignItems: "center",
      border: "2px solid lightseagreen",
      borderRadius: "8px",
      cursor: "pointer",
      paddingLeft: "8px",
    },
  },
};

export default function BenchmarkListItem({
  benchmark,
  isSelected,
  onFocus,
}: Props) {
  return (
    <div
      key={benchmark.id}
      style={isSelected ? styles.root.focused : styles.root.default}
      onFocus={onFocus}
      onMouseEnter={onFocus}
    >
      <h2>{benchmark.id}</h2>
      <h3>{benchmark.name}</h3>
      <p>{benchmark.created_at}</p>
    </div>
  );
}
