"use client";

import { useCart } from "@/hooks/useCart";
import CheckoutForm from "@/modules/Checkout/components/CheckoutForm";
import OrderTable from "@/modules/Checkout/components/OrderTable";
import OrderSummary from "@/modules/Checkout/OrderSummary";
import {
  getActivePaymentMethods,
  TActivePaymentMethod,
} from "@/services/paymentMethod/paymentmethods.service";
import { CheckoutFormData } from "@/types/checkout.interface";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    district: "",
    upazila: "",
    address: "",
    notes: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // ✅ Condition: cart খালি অবস্থায় সরাসরি checkout page-এ এলে
  // shop page-এ redirect করে দাও
  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace("/");
    }
  }, [cartItems.length, router]);

  // ✅ Admin Dashboard থেকে যোগ করা active payment methods — page mount হলে একবার fetch
  const [paymentMethods, setPaymentMethods] = useState<TActivePaymentMethod[]>(
    [],
  );

  useEffect(() => {
    getActivePaymentMethods()
      .then(setPaymentMethods)
      .catch(() => setPaymentMethods([])); // fail করলে শুধু COD দেখাবে
  }, []);

  const handleFormChange = (data: CheckoutFormData, valid: boolean) => {
    setFormData(data);
    setIsFormValid(valid);
  };

  if (cartItems.length === 0) {
    return null; // redirect চলাকালীন blank render, flash এড়াতে
  }

  return (
    <section className="bg-[#f5f7fb] min-h-screen">
      <div className="border-y bg-white">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-[14px] text-gray-600 px-3 py-1.5">
          <div className="w-6 h-6 flex items-center justify-center border rounded-md text-gray-600">
            <ShoppingBag size={14} />
          </div>
          <Link
            href="/checkout"
            className="font-medium text-gray-800 hover:text-[#0f3ea9] transition"
          >
            Checkout
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-[13px] text-gray-500">
            {cartItems.length} items
          </span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-1.5 md:p-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-8 space-y-6">
            <CheckoutForm onChange={handleFormChange} />
            <OrderTable />
          </div>

          <div className="lg:col-span-4">
            <OrderSummary
              formData={formData}
              isFormValid={isFormValid}
              paymentMethods={paymentMethods}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
