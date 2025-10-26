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
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
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
