export default function PageNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <nav
      style={{
        display: "flex",
        gap: "16px",
      }}
    >
      {children}
    </nav>
  );
}
