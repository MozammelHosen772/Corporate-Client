export const getInitials = (name?: string): string => {
  if (!name) return "?"; // ✅ undefined/null handle
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function queryStringFormatter(searchParamsObj: {
  [key: string]: string | string[] | undefined;
}): string {
  let queryString = "";

  const queryArray = Object.entries(searchParamsObj).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
    } else if (value !== undefined) {
      return `${key}=${encodeURIComponent(value)}`;
    }
    return "";
  });
  queryString = queryArray.filter((q) => q !== "").join("&");
  return queryString;
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("BDT", "৳");
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const formatCompact = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};
