import CouponForm from "@/modules/AdminDashboard/AdminCouponManagement/components/CouponForm";

export default function CreateCouponPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
          Add New Coupon
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a new discount coupon for your store
        </p>
      </div>

      <CouponForm />
    </div>
  );
}
