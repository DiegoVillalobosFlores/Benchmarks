export default function PageNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <nav
      style={{
        display: "flex",
        border: "2px solid gray",
        borderRadius: "16px",
        padding: "32px",
        gap: "16px",
      }}
    >
      {children}
    </nav>
  );
}
