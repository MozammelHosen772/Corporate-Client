import { UserOrderCardSkeleton } from "@/modules/UserDashboard/UserOrderss/components/UserOrderCardSkeleton";
import UserOrdersList from "@/modules/UserDashboard/UserOrderss/UserOrdersList";
import { getMyOrders } from "@/services/orders/orders.service";
import { PackageSearch } from "lucide-react";
import { Suspense } from "react";

async function OrdersContent() {
  const result = await getMyOrders({ page: 1, limit: 100 });
  const orders = result.data ?? [];

  return <UserOrdersList orders={orders} />;
}

export default function UserOrdersPage() {
  return (
    <main className="py-3">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0f3ea9]/10">
          <PackageSearch className="h-5 w-5 text-[#0f3ea9]" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">My Orders</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Track and manage your orders
          </p>
        </div>
      </div>

      <Suspense fallback={<UserOrderCardSkeleton />}>
        <OrdersContent />
      </Suspense>
    </main>
  );
}
