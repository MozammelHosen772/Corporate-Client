import SessionExpiredModal from "@/components/SessionExpiredHandler";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SessionExpiredModal />
      {children}
    </div>
  );
}
