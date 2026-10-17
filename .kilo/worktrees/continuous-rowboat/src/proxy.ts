import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/auth-utils";

import { verifyResetPasswordToken } from "./lib/jwtHanlders";

const routeAccessMap: Record<string, UserRole[]> = {
  ADMIN: ["SUPER_ADMIN", "ADMIN"],
  MODERATOR: ["MODERATOR"],
  USER: ["USER"],
};

const SKIP_ROUTES = ["/forgot-password", "/session-expired"];

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  path: "/",
};

const clearCookiesAndRedirect = (url: string, request: NextRequest) => {
  const response = NextResponse.redirect(new URL(url, request.url));
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
};

const tryRefreshToken = async (
  refreshToken: string,
  request: NextRequest,
): Promise<{ role: UserRole; response: NextResponse } | null> => {
  try {
    const refreshResponse = await fetch(
      `${BACKEND_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { Cookie: `refreshToken=${refreshToken}` },
        credentials: "include",
      },
    );

    if (!refreshResponse.ok) return null;

    const setCookieHeaders = refreshResponse.headers.getSetCookie();

    let newAccessToken: string | null = null;
    let newRefreshToken: string | null = null;
    let accessMaxAge = 60 * 15;
    let refreshMaxAge = 60 * 60 * 24;

    setCookieHeaders.forEach((cookie) => {
      const parts = cookie.split(";").map((p) => p.trim());
      const [keyVal] = parts;
      const [key, val] = keyVal.split("=");
      const maxAgePart = parts.find((p) =>
        p.toLowerCase().startsWith("max-age="),
      );
      const maxAge = maxAgePart
        ? parseInt(maxAgePart.split("=")[1])
        : undefined;

      if (key === "accessToken") {
        newAccessToken = val;
        if (maxAge) accessMaxAge = maxAge;
      }
      if (key === "refreshToken") {
        newRefreshToken = val;
        if (maxAge) refreshMaxAge = maxAge;
      }
    });

    if (!newAccessToken) return null;

    const verified = jwt.verify(
      newAccessToken,
      process.env.JWT_ACCESS_SECRET as string,
    ) as JwtPayload;

    if (!verified || typeof verified === "string") return null;

    const response = NextResponse.next();
    response.cookies.set("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: accessMaxAge,
    });
    if (newRefreshToken) {
      response.cookies.set("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: refreshMaxAge,
      });
    }

    return { role: verified.role as UserRole, response };
  } catch {
    return null;
  }
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // ── Step 1: Auth routes — logged in user ঢুকতে পারবে না
  if (isAuthRoute(pathname)) {
    if (accessToken) {
      try {
        const verified = jwt.verify(
          accessToken,
          process.env.JWT_ACCESS_SECRET as string,
        ) as JwtPayload;

        if (verified && typeof verified !== "string") {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(verified.role as UserRole),
              request.url,
            ),
          );
        }
      } catch {
        if (refreshToken) {
          const refreshResult = await tryRefreshToken(refreshToken, request);
          if (refreshResult) {
            return NextResponse.redirect(
              new URL(
                getDefaultDashboardRoute(refreshResult.role),
                request.url,
              ),
            );
          }
        }
        return clearCookiesAndRedirect("/login", request);
      }
    } else if (refreshToken) {
      const refreshResult = await tryRefreshToken(refreshToken, request);
      if (refreshResult) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(refreshResult.role), request.url),
        );
      }
    }
    return NextResponse.next();
  }

  // ── Step 2: Skip routes
  const isSkipRoute = SKIP_ROUTES.some((route) => {
    if (pathname === route) return true;
    if (pathname.startsWith(`${route}/`)) return true;
    return false;
  });
  // if (isSkipRoute) return NextResponse.next();
  if (isSkipRoute) {
    const response = NextResponse.next();
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
  // ── Step 3: Reset password
  if (pathname.startsWith("/reset-password")) {
    const phone = request.nextUrl.searchParams.get("phone");
    const token = request.nextUrl.searchParams.get("token");
    if (phone && token) {
      try {
        const verifiedToken = await verifyResetPasswordToken(token);
        if (!verifiedToken.success) {
          return NextResponse.redirect(
            new URL("/forgot-password?error=expired-link", request.url),
          );
        }
        if (verifiedToken.payload!.phone !== phone) {
          return NextResponse.redirect(
            new URL("/forgot-password?error=invalid-link", request.url),
          );
        }
        return NextResponse.next();
      } catch {
        return NextResponse.redirect(
          new URL("/forgot-password?error=expired-link", request.url),
        );
      }
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const routeOwner = getRouteOwner(pathname);

  // ── Step 4: accessToken নেই কিন্তু refreshToken আছে
  if (!accessToken && refreshToken) {
    const refreshResult = await tryRefreshToken(refreshToken, request);

    if (refreshResult) {
      if (routeOwner && routeOwner !== "COMMON") {
        const allowedRoles = routeAccessMap[routeOwner] ?? [];
        if (!allowedRoles.includes(refreshResult.role)) {
          // ✅ role mismatch — নিজের dashboard এ পাঠাও, loop নয়
          return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(refreshResult.role), request.url),
          );
        }
      }
      return refreshResult.response;
    }

    if (routeOwner === null) return NextResponse.next();
    return clearCookiesAndRedirect("/session-expired", request);
  }

  // ── Step 5: Token নেই + protected route
  if (!accessToken && !refreshToken && routeOwner !== null) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Step 6: Public route, token নেই
  if (routeOwner === null) return NextResponse.next();

  // ── Step 7: Access token verify
  let userRole: UserRole | null = null;

  if (accessToken) {
    try {
      const verified = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;

      if (typeof verified === "string") {
        return clearCookiesAndRedirect("/login", request);
      }

      userRole = verified.role as UserRole;
    } catch {
      if (refreshToken) {
        const refreshResult = await tryRefreshToken(refreshToken, request);

        if (refreshResult) {
          userRole = refreshResult.role;

          if (routeOwner && routeOwner !== "COMMON") {
            const allowedRoles = routeAccessMap[routeOwner] ?? [];
            if (!allowedRoles.includes(userRole)) {
              // ✅ নিজের dashboard এ পাঠাও
              return NextResponse.redirect(
                new URL(getDefaultDashboardRoute(userRole), request.url),
              );
            }
          }

          return refreshResult.response;
        }
      }
      return clearCookiesAndRedirect("/session-expired", request);
    }
  }

  // ── Step 8: userRole null হলে — token ছিল কিন্তু verify হয়নি
  if (!userRole) {
    return clearCookiesAndRedirect("/session-expired", request);
  }

  // ── Step 9: Common authenticated route
  if (routeOwner === "COMMON") return NextResponse.next();

  // ── Step 10: Role based protection
  const allowedRoles = routeAccessMap[routeOwner] ?? [];

  if (!allowedRoles.includes(userRole)) {
    // ✅ loop এড়াতে — redirect target আর current path একই হলে next() করো
    const dashboardRoute = getDefaultDashboardRoute(userRole);
    if (pathname === dashboardRoute) return NextResponse.next();

    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
