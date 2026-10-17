"use server";
import { serverFetch } from "@/lib/server-fetch";
import {
  IDashboardOverview,
  IFullDashboardData,
  IModeratorDashboardStats,
  IMonthlyRevenuePoint,
  IOrderStatusDistribution,
  IRecentOrder,
  IRevenueTrendPoint,
  ITopSellingProduct,
  IUserDashboardStats,
  IUserGrowthPoint,
} from "@/types/dashboardUi.interface";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Full Dashboard (single call — overview + all charts) ─────────────────────

export const getFullDashboard = async (): Promise<IFullDashboardData> => {
  const res = await serverFetch.get("/dashboard/full");

  const json: IApiResponse<IFullDashboardData> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch dashboard data");
  }

  return json.data;
};

// ─── Overview (KPI cards only) ─────────────────────────────────────────────────

export const getDashboardOverview = async (): Promise<IDashboardOverview> => {
  const res = await serverFetch.get("/dashboard/overview");

  const json: IApiResponse<IDashboardOverview> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch overview");
  }

  return json.data;
};

// ─── Revenue Trend ──────────────────────────────────────────────────────────────

export const getRevenueTrend = async (
  days = 30,
): Promise<IRevenueTrendPoint[]> => {
  const res = await serverFetch.get(`/dashboard/revenue-trend?days=${days}`);

  const json: IApiResponse<IRevenueTrendPoint[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch revenue trend");
  }

  return json.data;
};

// ─── Monthly Revenue ────────────────────────────────────────────────────────────

export const getMonthlyRevenue = async (
  months = 12,
): Promise<IMonthlyRevenuePoint[]> => {
  const res = await serverFetch.get(
    `/dashboard/monthly-revenue?months=${months}`,
  );

  const json: IApiResponse<IMonthlyRevenuePoint[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch monthly revenue");
  }

  return json.data;
};

// ─── Order Status Distribution ─────────────────────────────────────────────────

export const getOrderStatusDistribution = async (): Promise<
  IOrderStatusDistribution[]
> => {
  const res = await serverFetch.get("/dashboard/order-status");

  const json: IApiResponse<IOrderStatusDistribution[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(
      json.message || "Failed to fetch order status distribution",
    );
  }

  return json.data;
};

// ─── Top Selling Products ───────────────────────────────────────────────────────

export const getTopSellingProducts = async (
  limit = 5,
): Promise<ITopSellingProduct[]> => {
  const res = await serverFetch.get(`/dashboard/top-products?limit=${limit}`);

  const json: IApiResponse<ITopSellingProduct[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch top selling products");
  }

  return json.data;
};

// ─── Recent Orders ───────────────────────────────────────────────────────────────

export const getRecentOrders = async (limit = 8): Promise<IRecentOrder[]> => {
  const res = await serverFetch.get(`/dashboard/recent-orders?limit=${limit}`);

  const json: IApiResponse<IRecentOrder[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch recent orders");
  }

  return json.data;
};

// ─── User Growth ─────────────────────────────────────────────────────────────────

export const getUserGrowth = async (
  months = 6,
): Promise<IUserGrowthPoint[]> => {
  const res = await serverFetch.get(`/dashboard/user-growth?months=${months}`);

  const json: IApiResponse<IUserGrowthPoint[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch user growth");
  }

  return json.data;
};

// MODERATOR Dashboard Stats ────────────────────────────────────────────────

export const getModeratorDashboardStats =
  async (): Promise<IModeratorDashboardStats> => {
    const res = await serverFetch.get(
      "/repair-bookings/moderator/dashboard-stats",
    );

    const json: IApiResponse<IModeratorDashboardStats> = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to fetch dashboard stats");
    }

    return json.data;
  };
// ─── User Dashboard Stats ──────────────────────────────────────────────────────

export const getUserDashboardStats = async (): Promise<IUserDashboardStats> => {
  const res = await serverFetch.get("/dashboard/my/dashboard-stats");

  const json: IApiResponse<IUserDashboardStats> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch dashboard stats");
  }

  return json.data;
};
