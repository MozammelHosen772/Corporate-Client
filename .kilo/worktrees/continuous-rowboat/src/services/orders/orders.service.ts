/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type TPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type TPaymentMethodInput =
  | { type: "cod" }
  | {
      type: "manual";
      paymentMethodId?: string;
      provider?: string;
      receivingAccountNumber?: string;
      senderNumber: string;
      transactionId: string;
    };

export interface TCreateOrderPayload {
  customer: {
    name: string;
    phone: string;
    district: string;
    upazila: string;
    address: string;
    notes?: string;
  };
  cart: {
    productId: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
    selectedColor?: string | null;
    selectedSize?: string | null;
    shippingType?: string;
    shippingCost?: number;
  }[];
  coupon?: {
    code: string;
    type: string;
    discount: number;
    freeDelivery: boolean;
  } | null;
  paymentMethod: TPaymentMethodInput;
  summary: {
    subtotal: number;
    delivery: number;
    discount: number;
    total: number;
    totalQuantity: number;
  };
}

export interface TOrderItem {
  id: string;
  orderId: string;
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor: string | null;
  selectedSize: string | null;
  shippingType: string;
  shippingCost: number;
}

export interface TOrder {
  id: string;
  orderNumber: string;
  userId: number | null;

  customerName: string;
  customerPhone: string;
  district: string;
  upazila: string;
  address: string;
  notes: string | null;

  paymentType: string;
  paymentMethodId: string | null;
  provider: string | null;
  receivingAccountNumber: string | null;
  senderNumber: string | null;
  transactionId: string | null;
  paymentStatus: TPaymentStatus;

  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode: string | null;
  couponType: string | null;
  freeDelivery: boolean;
  total: number;
  totalQuantity: number;

  status: TOrderStatus;
  items: TOrderItem[];

  createdAt: string;
  updatedAt: string;
}

export interface TOrderMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TOrderMeta;
}
export interface TCreateOrderResponse {
  success: boolean;
  message?: string;
  isSessionExpired?: boolean;
  data?: TOrder;
}
const revalidateOrders = () =>
  revalidatePath("/admin/dashboard/all-order-management", "page");

// Public Route
export const trackOrder = async (params: {
  orderNumber: string;
  phone: string;
}): Promise<TOrder> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/orders/track-order`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      cache: "no-store",
    },
  );

  const data: TApiResponse<TOrder> = await res.json();
  if (!res.ok) throw new Error(data.message || "Order not found");

  return data.data;
};

// ─── Create Order (Public / Optional Auth) ────────────────────────────────────

export const createOrder = async (
  payload: TCreateOrderPayload,
): Promise<TCreateOrderResponse> => {
  try {
    const res = await serverFetch.post("/orders", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: TApiResponse<TOrder> = await res.json();

    if (!res.ok) {
      if (res.status === 401 || (data as any)?.isSessionExpired) {
        return {
          success: false,
          isSessionExpired: true,
          message: "Please log in to place your order",
        };
      }

      const rawMessage = data?.message as unknown;
      const message = Array.isArray(rawMessage)
        ? (rawMessage[0] as any)?.message || "Invalid order data"
        : (rawMessage as string) || "Failed to place order";

      return { success: false, message };
    }

    return { success: true, data: data.data };
  } catch (error: any) {
    // ✅ CRITICAL: Next.js এর redirect() throw করা special error — এটা কখনো
    // ধরা যাবে না, নাহলে navigation ভেঙে যায়। এটা আগেই re-throw করতে হবে।
    if (isRedirectError(error)) throw error;

    console.error("createOrder error:", error);

    // ✅ server-fetch.ts এর handleServerError plain object throw করে:
    // { isSessionExpired: true, message: "..." }
    if (error?.isSessionExpired) {
      return {
        success: false,
        isSessionExpired: true,
        message: error.message || "Please log in to place your order",
      };
    }

    return {
      success: false,
      message:
        (typeof error?.message === "string" && error.message) ||
        "Something went wrong, please try again",
    };
  }
};
export const getMyOrderByNumber = async (
  orderNumber: string,
): Promise<TOrder> => {
  const res = await serverFetch.get(`/orders/my-orders/number/${orderNumber}`, {
    cache: "no-store",
  });

  const data: TApiResponse<TOrder> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch order");

  return data.data;
};
// ─── Get My Orders (User) ──────────────────────────────────────────────────────

export const getMyOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: TOrderStatus;
}): Promise<{ data: TOrder[]; meta: TOrderMeta }> => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);

  const res = await serverFetch.get(`/orders/my-orders?${query.toString()}`, {
    cache: "no-store",
  });

  const data: TApiResponse<TOrder[]> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch your orders");

  return {
    data: data.data ?? [],
    meta: data.meta ?? { total: 0, page: 1, limit: 100, totalPages: 1 },
  };
};

// ─── Get All Orders (Admin) ────────────────────────────────────────────────────

export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: TOrderStatus;
  paymentType?: "cod" | "manual";
  paymentStatus?: TPaymentStatus;
  search?: string;
  sortOrder?: "newest" | "oldest";
}): Promise<{ data: TOrder[]; meta: TOrderMeta }> => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.paymentType) query.set("paymentType", params.paymentType);
  if (params?.paymentStatus) query.set("paymentStatus", params.paymentStatus);
  if (params?.search) query.set("search", params.search);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const res = await serverFetch.get(`/orders?${query.toString()}`, {
    cache: "no-store",
  });
  console.log("🔍 getAllOrders query:", query.toString());
  const data: TApiResponse<TOrder[]> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

  return {
    data: data.data ?? [],
    meta: data.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
};

// ─── Get Single Order (Admin) ──────────────────────────────────────────────────

export const getOrderById = async (id: string): Promise<TOrder> => {
  const res = await serverFetch.get(`/orders/${id}`, {
    cache: "no-store",
  });

  const data: TApiResponse<TOrder> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch order");

  return data.data;
};

// ─── Update Order Status (Admin) ───────────────────────────────────────────────

export const updateOrderStatus = async (
  id: string,
  status: TOrderStatus,
): Promise<TOrder> => {
  const res = await serverFetch.patch(`/orders/${id}/status`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const data: TApiResponse<TOrder> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update order status");
  revalidateOrders();
  return data.data;
};

// ─── Update Payment Status (Admin — manual payment verify) ────────────────────

export const updatePaymentStatus = async (
  id: string,
  paymentStatus: TPaymentStatus,
): Promise<TOrder> => {
  const res = await serverFetch.patch(`/orders/${id}/payment-status`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentStatus }),
  });

  const data: TApiResponse<TOrder> = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to update payment status");
  revalidateOrders();
  return data.data;
};

// ─── Delete Order (Admin) ──────────────────────────────────────────────────────

export const deleteOrder = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/orders/${id}`);

  const data: TApiResponse<null> = await res.json();
  revalidateOrders();
  if (!res.ok) throw new Error(data.message || "Failed to delete order");
};
export const getOrderInvoiceBlob = async (orderId: string): Promise<Blob> => {
  const res = await serverFetch.get(`/orders/${orderId}/invoice`, {
    cache: "no-store",
  });

  if (!res.ok) {
    // এরর হলে সাধারণত JSON response আসবে
    let message = "Failed to fetch invoice";
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {
      // JSON parse না হলে (raw error) ডিফল্ট মেসেজই থাকবে
    }
    throw new Error(message);
  }

  return res.blob();
};
export const getOrderInvoicePdfBase64 = async (
  orderId: string,
): Promise<{ base64: string; fileName: string }> => {
  const res = await serverFetch.get(`/orders/${orderId}/invoice`, {
    cache: "no-store",
  });

  if (!res.ok) {
    let message = "Failed to generate invoice";
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      // response was binary/empty, ignore
    }
    throw new Error(message);
  }

  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const disposition = res.headers.get("content-disposition") || "";
  const match = disposition.match(/filename="(.+)"/);
  const fileName = match ? match[1] : `invoice-${orderId}.pdf`;

  return { base64, fileName };
};
