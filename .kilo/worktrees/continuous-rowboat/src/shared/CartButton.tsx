"use client";

import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const CartDrawer = dynamic(() => import("./CartDrawer"), {
  ssr: false,
});

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const { cartItems } = useCart();

  const count = cartItems?.length ?? 0;

  return (
    <>
      {/* ONLY DESKTOP BUTTON */}
      <button onClick={() => setOpen(true)} className="relative">
        <ShoppingBag className="h-6 w-6" />

        {/* COUNT */}
        <span className="absolute -top-1 -right-1 text-[10px] bg-orange-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
          {count}
        </span>
      </button>

      {/* DRAWER */}
      <CartDrawer open={open} setOpen={setOpen} />
    </>
  );
}
