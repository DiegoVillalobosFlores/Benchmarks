import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function PageHeader({ title, children }: Props) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h1>{title}</h1>
      </div>
      {children}
    </header>
  );
}
