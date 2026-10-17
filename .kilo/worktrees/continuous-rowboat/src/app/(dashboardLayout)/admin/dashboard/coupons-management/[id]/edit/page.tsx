import CouponForm from "@/modules/AdminDashboard/AdminCouponManagement/components/CouponForm";
import { getCouponById } from "@/services/coupon/coupon.service";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCouponPage({ params }: Props) {
  const { id } = await params;

  const coupon = await getCouponById(id).catch(() => null);
  if (!coupon) return notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
          Edit Coupon
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update details for {coupon.code}
        </p>
      </div>

      <CouponForm coupon={coupon} />
    </div>
  );
}
