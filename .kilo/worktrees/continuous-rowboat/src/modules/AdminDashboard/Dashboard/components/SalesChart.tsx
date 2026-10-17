"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { TSalesTrend } from "@/types/AdminDashboard/adminDashboard.interface";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

interface Props {
  trend: TSalesTrend;
}

type Period = "7D" | "30D" | "12M";
type Metric = "amount" | "count";

const PERIODS: Period[] = ["7D", "30D", "12M"];

const chartConfig: ChartConfig = {
  amount: {
    label: "Revenue",
    color: "hsl(38 66% 49%)", // gold accent
  },
  count: {
    label: "Orders",
    color: "hsl(238 62% 60%)", // info accent
  },
};

const formatDailyLabel = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

const formatMonthlyLabel = (monthStr: string) => {
  const [year, month] = monthStr.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "en-GB",
    {
      month: "short",
      year: "2-digit",
    },
  );
};
interface ChartPoint {
  label: string;
  amount: number;
  count: number;
}
export function SalesChart({ trend }: Props) {
  const [period, setPeriod] = useState<Period>("30D");
  const [metric, setMetric] = useState<Metric>("amount");

  const { chartData, current, previous } = useMemo(() => {
    if (period === "12M") {
      const current12 = trend.monthly.slice(-12);
      const previous12 = trend.monthly.slice(-24, -12);
      return {
        chartData: current12.map(
          (p): ChartPoint => ({
            amount: p.amount,
            count: p.count,
            label: formatMonthlyLabel(p.month),
          }),
        ),
        current: current12,
        previous: previous12,
      };
    }

    const days = period === "7D" ? 7 : 30;
    const currentSlice = trend.daily.slice(-days);
    const previousSlice = trend.daily.slice(-days * 2, -days);

    return {
      chartData: currentSlice.map(
        (p): ChartPoint => ({
          amount: p.amount,
          count: p.count,
          label: formatDailyLabel(p.date),
        }),
      ),
      current: currentSlice,
      previous: previousSlice,
    };
  }, [trend, period]);

  const sumBy = (arr: { amount: number; count: number }[], key: Metric) =>
    arr.reduce((acc, item) => acc + item[key], 0);

  const currentTotal = sumBy(current, metric);
  const previousTotal = sumBy(previous, metric);
  const change =
    previousTotal === 0
      ? currentTotal > 0
        ? 100
        : 0
      : ((currentTotal - previousTotal) / previousTotal) * 100;
  const isUp = change >= 0;

  return (
    <div className="rounded-2xl border border-[#E7E8EC] bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#12141A]">
            {chartConfig[metric].label} Overview
          </h2>
          <div className="mt-2 flex items-baseline gap-3">
            <p className="font-mono text-2xl font-semibold text-[#12141A]">
              {metric === "amount"
                ? formatCurrency(currentTotal)
                : formatNumber(currentTotal)}
            </p>
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                isUp
                  ? "bg-[#1F9D6C]/10 text-[#1F9D6C]"
                  : "bg-[#D6465F]/10 text-[#D6465F]"
              }`}
            >
              {isUp ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-[#6B7280]">
            আগের সমান period এর তুলনায়
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg bg-[#F3F4F7] p-1">
            {(["amount", "count"] as Metric[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  metric === m
                    ? "bg-white text-[#12141A] shadow-sm"
                    : "text-[#6B7280] hover:text-[#12141A]"
                }`}
              >
                {chartConfig[m].label}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-lg bg-[#F3F4F7] p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-white text-[#12141A] shadow-sm"
                    : "text-[#6B7280] hover:text-[#12141A]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="mt-6 h-72 w-full">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={`var(--color-${metric})`}
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${metric})`}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#F0F1F4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={period === "30D" ? 3 : 0}
          />
          <ChartTooltip
            cursor={{ stroke: `var(--color-${metric})`, strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                labelKey="label"
                formatter={(value) => (
                  <span className="font-mono font-medium text-[#12141A]">
                    {metric === "amount"
                      ? formatCurrency(Number(value))
                      : `${formatNumber(Number(value))} orders`}
                  </span>
                )}
              />
            }
          />
          <Area
            dataKey={metric}
            type="monotone"
            fill="url(#fillMetric)"
            stroke={`var(--color-${metric})`}
            strokeWidth={2}
            animationDuration={500}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
