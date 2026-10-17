import WhatsAppButton from "@/modules/HomePages/Whatsappbutton";
import PublicFooter from "@/modules/PublicFooter/PublicFooter";
import PublicNavbar from "@/modules/publicNavbar/PublicNavbar";
import FloatingCartButton from "@/shared/FloatingCartButton";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <FloatingCartButton />
      <WhatsAppButton />
      <main className="flex-1 mt-0 md:mt-20 ">{children}</main>
      <footer className="mt-auto">
        <PublicFooter />
      </footer>
    </div>
  );
}
