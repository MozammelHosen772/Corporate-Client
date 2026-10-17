import AdminPaymentMethod from "@/modules/AdminDashboard/AdminSettings/AdminAddPaymentMethod/Adminpaymentmethod";
import AdminPaymentMethodSkeleton from "@/modules/AdminDashboard/AdminSettings/AdminAddPaymentMethod/components/Adminpaymentmethodskeleton";
import { getAllPaymentMethods } from "@/services/paymentMethod/paymentmethods.service";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Payment Method Management",
  description: "Add or manage payout accounts (Mobile Wallet / Bank)",
  robots: {
    index: false,
    follow: false,
  },
};

async function PaymentMethodContent() {
  const { data: initialPaymentMethods } = await getAllPaymentMethods();
  return (
    <AdminPaymentMethod initialPaymentMethods={initialPaymentMethods ?? []} />
  );
}

export default function AdminPaymentMethodPage() {
  return (
    <section aria-label="Payment Method Management">
      <Suspense fallback={<AdminPaymentMethodSkeleton />}>
        <PaymentMethodContent />
      </Suspense>
    </section>
  );
}
