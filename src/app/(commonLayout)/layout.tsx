import PublicFooter from "@/modules/PublicFooter/PublicFooter";
import PublicNavbar from "@/modules/publicNavbar/PublicNavbar";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />

      <main className="flex-1 mt-0  ">{children}</main>
      <footer className="mt-auto">
        <PublicFooter />
      </footer>
    </div>
  );
}
