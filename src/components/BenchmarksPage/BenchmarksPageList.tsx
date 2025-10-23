import { ReactNode } from "react";

type Props = {
  title: ReactNode;
  controls: ReactNode;
};

export default function BenchmarksPageList({ title, controls }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
      }}
    >
      <h3>{title}</h3>
      <ul
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        {controls}
      </ul>
    </div>
  );
}
