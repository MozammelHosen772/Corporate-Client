"use client";

import { useScrollDirection } from "@/lib/useScrollDirection";
import { HelpCircle, Mail, Phone, Truck, User } from "lucide-react";
import Link from "next/link";

export function TopNavbar() {
  const direction = useScrollDirection();
  const isHidden = direction === "down";

  return (
    <div
      className={`hidden overflow-hidden bg-black text-white transition-[max-height,opacity] duration-300 ease-in-out sm:block ${
        isHidden ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-2 text-xs sm:text-sm">
        {/* Left: help + my account */}
        <div className="flex items-center gap-4">
          <Link
            href="/help"
            className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white sm:flex"
          >
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Help
          </Link>

          <Link
            href="/account"
            className="flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
          >
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            My Account
          </Link>
        </div>

        {/* Right: phone / email / track order */}
        <div className="flex items-center gap-4">
          <Link
            href="tel:01970605584"
            className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white md:flex"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            01970-605584
          </Link>

          <Link
            href="mailto:support@sheitech.com.bd"
            className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white lg:flex"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            support@sheitech.com.bd
          </Link>

          <Link
            href="/track-order"
            className="flex items-center gap-1.5 font-medium text-white transition-colors hover:text-white/80"
          >
            <Truck className="h-3.5 w-3.5" aria-hidden="true" />
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
