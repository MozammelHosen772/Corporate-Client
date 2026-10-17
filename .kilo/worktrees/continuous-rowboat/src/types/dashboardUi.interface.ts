export interface IDashboardOverview {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growthPercent: number; // % vs last month, can be negative
  };
  orders: {
    total: number;
    pending: number;
    thisMonth: number;
    lastMonth: number;
    growthPercent: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  users: {
    total: number;
  };
  blogs: {
    total: number;
  };
  repairBookings: {
    total: number;
    pending: number;
  };
}

// ─── Revenue Trend (line/area chart) ────────────────────────────────────────

export interface IRevenueTrendPoint {
  date: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
}

// ─── Monthly Revenue (bar chart) ────────────────────────────────────────────

export interface IMonthlyRevenuePoint {
  month: string; // "YYYY-MM"
  revenue: number;
}

// ─── Order Status Distribution (pie/donut chart) ────────────────────────────

export interface IOrderStatusDistribution {
  status: string;
  count: number;
  revenue: number;
}

// ─── Top Selling Products ───────────────────────────────────────────────────

export interface ITopSellingProduct {
  productId: string;
  title: string;
  image: string;
  quantitySold: number;
  revenue: number;
}

// ─── Recent Orders ───────────────────────────────────────────────────────────

export interface IRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  createdAt: string; // ISO date
  _count: {
    items: number;
  };
}

// ─── User Growth ─────────────────────────────────────────────────────────────

export interface IUserGrowthPoint {
  month: string; // "YYYY-MM"
  newUsers: number;
}

// ─── Combined payload (getFullDashboard) ────────────────────────────────────

export interface IFullDashboardData {
  overview: IDashboardOverview;
  revenueTrend: IRevenueTrendPoint[];
  monthlyRevenue: IMonthlyRevenuePoint[];
  orderStatusDistribution: IOrderStatusDistribution[];
  topProducts: ITopSellingProduct[];
  recentOrders: IRecentOrder[];
  userGrowth: IUserGrowthPoint[];
}

export interface IModeratorDashboardStats {
  pending: number;
  accepted: number;
  completed: number;
}
export interface IUserDashboardStats {
  repairBookings: {
    pending: number;
    accepted: number;
    completed: number;
  };
  orders: {
    total: number;
    pending: number;
    totalProductsOrdered: number;
  };
}
