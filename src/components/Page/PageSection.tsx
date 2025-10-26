export default function PageSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        border: "2px solid lightseagreen",
        borderRadius: "16px",
        padding: "32px",
        height: "100%",
        gap: "8px",
        overflowY: "auto",
      }}
    >
      {children}
    </section>
  );
}
