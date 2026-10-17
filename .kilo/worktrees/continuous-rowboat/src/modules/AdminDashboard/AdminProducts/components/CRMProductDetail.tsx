"use client";

import { TCRMProductDetail } from "@/services/products/crm.service";
import { Package, ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import Image from "next/image";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  product: TCRMProductDetail;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div
      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}
    >
      <Icon className="h-4.5 w-4.5" />
    </div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-0.5 text-xl font-bold text-slate-900">{value}</p>
  </div>
);

export default function CRMProductDetail({ product }: Props) {
  const price = product.sellingPrice ?? product.mrpPrice;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-7 w-7 text-slate-300" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-800">
            {product.name}
          </h1>
          <p className="mt-0.5 font-mono text-xs text-slate-400">
            {product.sku}
          </p>
          <p className="mt-1 text-sm font-medium text-orange-600">
            ৳ {price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Sold"
          value={product.totalSold.toString()}
          accent="bg-orange-50 text-orange-600"
        />
        <StatCard
          icon={Wallet}
          label="Total Revenue"
          value={`৳ ${product.totalRevenue.toLocaleString()}`}
          accent="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={Package}
          label="Stock Remaining"
          value={product.stock.toString()}
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Status"
          value={product.status}
          accent="bg-slate-50 text-slate-600"
        />
      </div>

      {/* ── Chart ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          Sales Trend (Monthly Units Sold)
        </h3>
        {product.salesTrend.length === 0 ? (
          <div className="flex h-56 items-center justify-center text-sm text-slate-400">
            No sales data yet
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={product.salesTrend}>
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="quantity"
                  stroke="#ea580c"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
