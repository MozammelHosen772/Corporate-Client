import { Button } from "@/components/ui/button";
import AllCouponManage from "@/modules/AdminDashboard/AdminCouponManagement/AllCouponManage";
import { CouponTableSkeleton } from "@/modules/AdminDashboard/AdminCouponManagement/components/CouponTableSkeleton";
import { getAllCoupons } from "@/services/coupon/coupon.service";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
};

async function CouponsContent({
  page,
  search,
  status,
}: {
  page: number;
  search?: string;
  status?: string;
}) {
  const { data, meta } = await getAllCoupons({
    page,
    limit: 10,
    search: search || undefined,
    status: status as "active" | "inactive" | undefined,
  });

  return <AllCouponManage coupons={data} meta={meta} />;
}

export default async function AdminCouponsPage({ searchParams }: Props) {
  const { page: pageStr, search, status } = await searchParams;
  const page = Number(pageStr) || 1;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
            Coupon Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage discount coupons
          </p>
        </div>

        <Button asChild className="bg-[#0f3ea9] hover:bg-[#0c2d7a]">
          <Link href="/admin/dashboard/coupons-management/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Coupon
          </Link>
        </Button>
      </div>

      <section id="coupons-table" aria-label="Coupons List">
        <Suspense
          //   key={`${page}-${search}-${status}`}
          fallback={<CouponTableSkeleton />}
        >
          <CouponsContent page={page} search={search} status={status} />
        </Suspense>
      </section>
    </div>
  );
}
