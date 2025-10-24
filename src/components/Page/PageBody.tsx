type Props = {
  children: React.ReactNode;
};

export default function PageBody({ children }: Props) {
  return (
    <body
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        backgroundColor: "black",
        color: "white",
        padding: "32px",
        gap: "16px",
      }}
    >
      {children}
    </body>
  );
}
