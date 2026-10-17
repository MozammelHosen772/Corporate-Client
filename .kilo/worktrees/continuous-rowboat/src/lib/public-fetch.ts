type PublicFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

const createFailedResponse = (message: string, status = 503): Response => {
  return new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

const request = async (
  method: string,
  endpoint: string,
  options: PublicFetchOptions = {},
): Promise<Response> => {
  try {
    return await fetch(`${BACKEND_API_URL}${endpoint}`, {
      ...options,
      method,
    });
  } catch (networkError) {
    console.error(`[publicFetch] Network error on ${endpoint}:`, networkError);
    return createFailedResponse(
      "সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।",
    );
  }
};

export const publicFetch = {
  get: (endpoint: string, options?: PublicFetchOptions) =>
    request("GET", endpoint, options),
  post: (endpoint: string, options?: PublicFetchOptions) =>
    request("POST", endpoint, options),
  put: (endpoint: string, options?: PublicFetchOptions) =>
    request("PUT", endpoint, options),
  patch: (endpoint: string, options?: PublicFetchOptions) =>
    request("PATCH", endpoint, options),
  delete: (endpoint: string, options?: PublicFetchOptions) =>
    request("DELETE", endpoint, options),
};
