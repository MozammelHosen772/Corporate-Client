import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Wallet } from "lucide-react";

interface Props {
  totalSaleAmount: number;
  totalSaleCount: number;
}

export function RevenueHeroCard({ totalSaleAmount, totalSaleCount }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#12141A] p-7">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#C9972E]/30 motion-safe:animate-[pulse_3.5s_ease-in-out_infinite]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-[#C9972E]/20"
      />

      <div className="relative flex items-center gap-2 text-[#C9972E]">
        <Wallet className="h-4 w-4" />
        <span className="font-mono text-xs uppercase tracking-[0.2em]">
          Total Revenue
        </span>
      </div>

      <p className="relative mt-4 font-mono text-4xl font-medium text-white sm:text-5xl">
        {formatCurrency(totalSaleAmount)}
      </p>

      <p className="relative mt-3 text-sm text-white/50">
        থেকে{" "}
        <span className="font-mono text-white/80">
          {formatNumber(totalSaleCount)}
        </span>{" "}
        টা successful order
      </p>
    </div>
  );
}
