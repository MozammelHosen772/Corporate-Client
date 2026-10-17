"use client";
import { Badge } from "@/components/ui/badge";
import { TOrderStatus } from "@/services/orders/orders.service";
import { Check, X } from "lucide-react";
import { ORDER_STATUS_STEPS } from "../constants/trackOrder.constants";

interface Props {
  status: TOrderStatus;
}

export default function OrderStatusStepper({ status }: Props) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
          <X className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-500">This order has been cancelled.</p>
        </div>
        <Badge className="border border-red-200 bg-red-100 text-red-700">
          Cancelled
        </Badge>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_STEPS.findIndex((s) => s.value === status);

  return (
    <div className="flex items-start justify-between">
      {ORDER_STATUS_STEPS.map((step, idx) => {
        const isDone = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isLast = idx === ORDER_STATUS_STEPS.length - 1;
        const isActive = isDone || isCurrent;

        return (
          <div key={step.value} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {/* Left connector line */}
              {idx !== 0 && (
                <div
                  className={`h-0.5 flex-1 transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-red-500"
                      : "bg-slate-200"
                  }`}
                />
              )}

              {/* Circle */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isDone
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : isCurrent
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white ring-4 ring-orange-100"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : idx + 1}
              </div>

              {/* Right connector line */}
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 transition-colors ${
                    isDone
                      ? "bg-gradient-to-r from-orange-500 to-red-500"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>

            <span
              className={`mt-2 text-center text-[11px] font-medium ${
                isActive ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
