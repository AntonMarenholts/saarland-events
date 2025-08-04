// src/app/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Этот макет применяется только к админке.
  // Главный хедер здесь не появится.
  return <>{children}</>;
}