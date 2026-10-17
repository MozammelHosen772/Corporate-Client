import { getNewAccessToken } from "@/services/auth/auth.service";
import { getCookie } from "@/services/auth/tokenHandlers";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { SessionExpiredError } from "./SessionExpiredError";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

const isServer = () => typeof window === "undefined";

const OPTIONAL_AUTH_ENDPOINTS = [
  "GET:/user/me",
  "POST:/auth/login",
  "POST:/auth/register",
];

// ✅ নতুন: network/connection error হলে একটা fake Response বানাবো
// এতে call site গুলো সবসময় Response object পাবে, throw এর কারণে crash হবে না
const createFailedResponse = (message: string, status = 503): Response => {
  return new Response(
    JSON.stringify({
      success: false,
      message,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
};

const handleServerError = (error: unknown): never => {
  if (isRedirectError(error)) throw error;
  if (error instanceof SessionExpiredError) {
    throw { isSessionExpired: true, message: error.message };
  }
  throw error;
};

const serverFetchHelper = async (
  endpoint: string,
  options: RequestInit,
  isRetry = false,
): Promise<Response> => {
  const { headers, ...restOptions } = options;

  // ─── ✅ এখানে fetch কে আলাদা try/catch এ রাখলাম ─────────────────────
  let response: Response;
  try {
    const accessToken = await getCookie("accessToken");

    response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        Cookie: accessToken ? `accessToken=${accessToken}` : "",
        ...headers,
      },
      ...restOptions,
    });
  } catch (networkError) {
    // ✅ server off / DNS fail / connection refused — এখানে ধরা পড়বে
    console.error(`[serverFetch] Network error on ${endpoint}:`, networkError);
    return createFailedResponse(
      "সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।",
    );
  }

  // ─── বাকি লজিক (401/403 handling) আগের মতোই, কিন্তু try/catch এ রাখলাম
  // যাতে redirect() বা SessionExpiredError ছাড়া অন্য কোনো unexpected error
  // ও silently fail response এ কনভার্ট হয়ে যায়, পুরো app crash না করে
  try {
    const methodEndpoint = `${restOptions.method}:${endpoint}`;

    if (
      response.status === 401 &&
      !isRetry &&
      endpoint !== "/auth/refresh-token"
    ) {
      if (OPTIONAL_AUTH_ENDPOINTS.includes(methodEndpoint)) {
        return response;
      }

      const refreshToken = await getCookie("refreshToken");

      if (!refreshToken) {
        const errorData = await response
          .clone()
          .json()
          .catch(() => ({}));
        const message =
          errorData?.message || "Session expired. Please login again.";
        throw new SessionExpiredError(message);
      }

      const result = await getNewAccessToken();

      if (result?.tokenRefreshed === true) {
        return serverFetchHelper(endpoint, options, true);
      }

      const errorData = await response
        .clone()
        .json()
        .catch(() => ({}));
      const message =
        errorData?.message || "Session expired. Please login again.";

      if (isServer()) {
        redirect("/session-expired");
      } else {
        throw new SessionExpiredError(message);
      }
    }

    if (response.status === 403) {
      if (OPTIONAL_AUTH_ENDPOINTS.includes(methodEndpoint)) {
        return response;
      }

      const errorData = await response
        .clone()
        .json()
        .catch(() => ({}));
      const message = errorData?.message || "Access denied.";

      if (isServer()) {
        redirect("/session-expired");
      } else {
        throw new SessionExpiredError(message);
      }
    }

    return response;
  } catch (error) {
    handleServerError(error);
    throw new Error("Unreachable");
  }
};

export const serverFetch = {
  get: (endpoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endpoint, { ...options, method: "POST" }),
  put: (endpoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endpoint, { ...options, method: "PUT" }),
  patch: (endpoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endpoint, { ...options, method: "PATCH" }),
  delete: (endpoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};
