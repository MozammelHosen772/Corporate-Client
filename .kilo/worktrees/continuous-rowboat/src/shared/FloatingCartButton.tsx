"use client";

import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const CartDrawer = dynamic(() => import("./CartDrawer"), {
  ssr: false,
});

export default function FloatingCartButton() {
  const [open, setOpen] = useState(false);
  const { cartItems } = useCart();

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);
  return (
    <>
      {/* FLOATING CART */}
      <div className="block">
        <button
          onClick={() => setOpen(true)}
          suppressHydrationWarning
          className="fixed right-0.5 md:right-5 top-1/2 -translate-y-1/2 z-[999] group"
        >
          <div className="w-[50px] md:w-[65px] rounded-l-2xl rounded-r-md bg-[#0f3ea9] shadow-2xl overflow-hidden border border-white/20 transition-all duration-300 hover:scale-105">
            {/* ICON */}
            <div className="flex flex-col items-center justify-center py-0.5 md:py-1 border-b border-white/10">
              <ShoppingBag className="w-3 h-4 md:w-4 md:h-4 text-white" />
            </div>

            {/* ITEM COUNT */}
            <div className="py-0.5 md:py-1 bg-[#082c7c] border-b border-white/10">
              <p className="text-center text-white font-bold text-[14px] md:text-[16px]">
                {totalItems}
              </p>
            </div>

            {/* TOTAL */}
            <div className="py-0.5 md:py-1 bg-orange-500">
              <p className="text-center text-white font-bold text-[11px] md:text-[13px] px-1 truncate">
                ৳{totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* DRAWER */}
      <CartDrawer open={open} setOpen={setOpen} />
    </>
  );
}
