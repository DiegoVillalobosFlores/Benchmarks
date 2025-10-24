import { useRef, useState } from "react";

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
      border: "2px solid lightseagreen",
    },
    hovered: {
      border: "2px solid lightseagreen",
    },
  },
};

export default function BenchmarkListItem({
  benchmark,
  isSelected,
  onFocus,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (isSelected && !hovered) {
    ref.current?.focus();
    ref.current?.scrollIntoView({ behavior: "auto", block: "center" });
  }

  const style = {
    ...styles.root.default,
    ...(isSelected ? styles.root.focused : {}),
    ...(hovered ? styles.root.hovered : {}),
  };

  return (
    <div
      ref={ref}
      key={benchmark.id}
      style={style}
      onFocus={onFocus}
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseOut={() => {
        setHovered(false);
      }}
    >
      <h2>{benchmark.id}</h2>
      <h3>{benchmark.name}</h3>
      <p>{benchmark.created_at}</p>
    </div>
  );
}
