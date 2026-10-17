// src/types/adminDashboard/adminDashboard.interface.ts (FULL FILE)

export interface TSalePeriod {
  count: number;
  amount: number;
}

export interface TOrderStatusCounts {
  PENDING: number;
  CONFIRMED: number;
  PROCESSING: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
}

export interface TDailyPoint {
  date: string;
  amount: number;
  count: number;
}

export interface TMonthlyPoint {
  month: string;
  amount: number;
  count: number;
}

export interface TSalesTrend {
  daily: TDailyPoint[];
  monthly: TMonthlyPoint[];
}

export interface TAdminDashboardStats {
  totalUsers: number;
  totalModerators: number;
  totalActiveProducts: number;
  totalOfferProducts: number;
  totalFlashSaleProducts: number;
  totalSaleCount: number;
  totalSaleAmount: number;
  totalCancelledOrders: number;
  totalDeliveredOrders: number;
  dailySale: TSalePeriod;
  monthlySale: TSalePeriod;
  yearlySale: TSalePeriod;
  statusCounts: TOrderStatusCounts;
  salesTrend: TSalesTrend | undefined;
}
