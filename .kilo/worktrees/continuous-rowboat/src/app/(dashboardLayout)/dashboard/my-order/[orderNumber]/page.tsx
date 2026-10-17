import OrderDetailsView from "@/modules/UserDashboard/Userorders/components/Orderdetailsview";
import { getMyOrderByNumber } from "@/services/orders/orders.service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderDetailsPage({ params }: Props) {
  const { orderNumber } = await params;

  let order;
  try {
    order = await getMyOrderByNumber(orderNumber);
  } catch (error) {
    console.error("Order fetch failed:", error);
    return notFound();
  }

  return (
    <main className=" py-3">
      <Link
        href="/dashboard/my-order"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Order Details
      </Link>

      <OrderDetailsView order={order} />
    </main>
  );
}
