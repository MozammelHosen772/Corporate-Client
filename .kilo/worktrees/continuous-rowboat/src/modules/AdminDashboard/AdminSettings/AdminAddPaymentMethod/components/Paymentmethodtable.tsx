"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TPaymentMethod } from "@/services/paymentMethod/paymentmethods.service";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ALL_PROVIDERS } from "../constants/Paymentmethod.constants";

type Props = {
  paymentMethods: TPaymentMethod[];
  fetching: boolean;
  onDelete: (method: TPaymentMethod) => void;
};

export default function PaymentMethodTable({
  paymentMethods,
  fetching,
  onDelete,
}: Props) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? paymentMethods
      : paymentMethods.filter((m) => m.provider === activeFilter);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 md:p-5 shadow-sm">
      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {["All", ...ALL_PROVIDERS].map((tab) => (
          <Badge
            key={tab}
            onClick={() => setActiveFilter(tab)}
            variant={activeFilter === tab ? "default" : "secondary"}
            className="cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium"
          >
            {tab}
          </Badge>
        ))}
      </div>

      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Payment Method History
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-3 pr-4 font-medium">#</th>
              <th className="py-3 pr-4 font-medium">Type</th>
              <th className="py-3 pr-4 font-medium">Amount</th>
              <th className="py-3 pr-4 font-medium">Account</th>
              <th className="py-3 pr-4 font-medium">Number</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No payment methods found
                </td>
              </tr>
            ) : (
              filtered.map((method, index) => (
                <tr
                  key={method.id}
                  className="border-b border-slate-100 text-slate-700"
                >
                  <td className="py-3 pr-4">{index + 1}</td>
                  <td className="py-3 pr-4">{method.provider}</td>
                  <td className="py-3 pr-4">
                    {method.amount != null ? method.amount : "—"}
                  </td>
                  <td className="py-3 pr-4">{method.accountType}</td>
                  <td className="py-3 pr-4">{method.accountNumber}</td>
                  <td className="py-3 pr-4">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(method)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
