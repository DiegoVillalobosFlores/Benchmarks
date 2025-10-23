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
      }}
    >
      <h3>{title}</h3>
      <ul
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        {children}
      </ul>
    </div>
  );
}
