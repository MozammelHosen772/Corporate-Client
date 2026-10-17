export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "USER";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

export const authRoutes = ["/login", "/register", "/forgot-password"];

export const commonProtectedRoutes: RouteConfig = {
  exact: [
    "/my-profile",
    "/settings",
    "/change-password",
    "/reset-password",
    "/repair-booking",
  ],
  // ✅ /account/* সব route protected — login ছাড়া access নেই
  // ভবিষ্যতে /account/orders, /account/address যোগ করলে আলাদা কিছু লাগবে না
  patterns: [/^\/account/],
};

export const adminProtectedRoutes: RouteConfig = {
  patterns: [/^\/admin/],
  exact: [],
};

export const moderatorProtectedRoutes: RouteConfig = {
  patterns: [/^\/moderator/],
  exact: [],
};

export const userProtectedRoutes: RouteConfig = {
  patterns: [/^\/dashboard/],
  exact: [],
};

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
};

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig,
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
): "ADMIN" | "MODERATOR" | "USER" | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  if (isRouteMatches(pathname, moderatorProtectedRoutes)) {
    return "MODERATOR";
  }
  if (isRouteMatches(pathname, userProtectedRoutes)) {
    return "USER";
  }
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "MODERATOR") {
    return "/moderator/dashboard";
  }
  if (role === "USER") {
    return "/dashboard";
  }
  return "/";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  if (routeOwner === "ADMIN") {
    return role === "SUPER_ADMIN" || role === "ADMIN";
  }

  if (routeOwner === "MODERATOR") {
    return role === "MODERATOR";
  }

  if (routeOwner === "USER") {
    return role === "USER";
  }

  return false;
};
