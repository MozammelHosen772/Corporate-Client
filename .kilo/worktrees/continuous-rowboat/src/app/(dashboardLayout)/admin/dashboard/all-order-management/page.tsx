import AdminOrdersList, {
  IOrderMeta,
} from "@/modules/AdminDashboard/AdminOrders/AdminOrdersList";
import { OrderTableSkeleton } from "@/modules/AdminDashboard/AdminOrders/components/OrderTableSkeleton";
import {
  getAllOrders,
  TOrderStatus,
  TPaymentStatus,
} from "@/services/orders/orders.service";

import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    paymentType?: string;
    paymentStatus?: string;
    sortOrder?: string;
  }>;
};

const ORDER_LIMIT = 10;

async function OrdersContent({
  page,
  search,
  status,
  paymentType,
  paymentStatus,
  sortOrder,
}: {
  page: number;
  search?: string;
  status?: TOrderStatus;
  paymentType?: "cod" | "manual";
  paymentStatus?: TPaymentStatus;
  sortOrder?: string;
}) {
  const result = await getAllOrders({
    page,
    limit: ORDER_LIMIT,
    status,
    paymentType,
    paymentStatus,
    search,
    sortOrder: sortOrder === "oldest" ? "oldest" : "newest",
  });

  // ⚠️ আগের ভার্সনে এখানে frontend-এ আবার .sort() করা হচ্ছিল —
  // এখন backend-ই sort করছে, তাই সেটা বাদ দিতে হবে
  return (
    <AdminOrdersList orders={result.data} meta={result.meta as IOrderMeta} />
  );
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const {
    page: pageStr,
    search,
    status,
    paymentType,
    paymentStatus,
    sortOrder,
  } = await searchParams;
  const page = Number(pageStr) || 1;

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800 md:text-2xl">
          Orders
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track customer orders
        </p>
      </div>
      <section id="orders-table" aria-label="Orders list">
        <Suspense fallback={<OrderTableSkeleton />}>
          <OrdersContent
            page={page}
            search={search}
            status={status as TOrderStatus | undefined}
            paymentType={paymentType as "cod" | "manual" | undefined}
            paymentStatus={paymentStatus as TPaymentStatus | undefined}
            sortOrder={sortOrder}
          />
        </Suspense>
      </section>
    </main>
  );
}
