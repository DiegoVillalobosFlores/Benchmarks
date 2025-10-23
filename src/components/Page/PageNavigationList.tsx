import { ReactNode } from "react";

type Props = {
  title: ReactNode;
  children: ReactNode;
};

export default function PageNavigationList({ title, children }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      <h3>{title}</h3>
      <ul
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {children}
      </ul>
    </div>
  );
}
