import TrackOrderForm from "@/modules/TrackOrder/components/TrackOrderForm";
import { Suspense } from "react";

export const metadata = {
  title: "Track Your Order | Taqwa Tech",
  description: "Enter your Order ID and phone number to see live status",
};

export default function TrackOrderPage() {
  return (
    <main className="flex min-h-[80vh] items-start justify-center bg-slate-50 px-2 py-12">
      <Suspense fallback={null}>
        <TrackOrderForm />
      </Suspense>
    </main>
  );
}
