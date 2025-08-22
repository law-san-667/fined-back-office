// middleware.ts
import { JwtPayload } from "@supabase/supabase-js";
import { isBefore } from "date-fns";
import { decodeJwt, JWTPayload, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "accessToken";

const PUBLIC_PATHS = [
  "/",
  "/_next",
  "/favicon.ico",
  "/api/auth",
  "/api/health",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function redirectTo(req: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, req.nextUrl.origin));
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

function getIssuer() {
  const iss = process.env.JWT_ISSUER;
  if (!iss) throw new Error("JWT_ISSUER is not set");
  return iss;
}

function getRefreshUrl() {
  const url = process.env.AUTH_REFRESH_URL;
  if (!url) throw new Error("AUTH_REFRESH_URL is not set");
  return url;
}

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret(), {
    issuer: getIssuer(), // jose enforces issuer
  });
  return payload as JwtPayload;
}

function isExpired(payload: JWTPayload) {
  if (!payload.exp) return false;
  // exp is seconds since epoch → ms
  const expDate = new Date(payload.exp);
  return isBefore(expDate, new Date());
}

async function tryRefresh(req: NextRequest) {
  const res = await fetch(getRefreshUrl(), {
    method: "POST",
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      "content-type": "application/json",
    },
    // If your refresh API strictly uses cookie, the body can be {}.
    body: JSON.stringify({
      refreshToken: req.cookies.get(COOKIE_NAME)?.value, // keep if your API expects it
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const newToken: string | null = data?.accessToken ?? null;
  return newToken;
}

async function getActiveTokenOrNull(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const decoded = decodeJwt(token);
  if (isExpired(decoded)) {
    const refreshed = await tryRefresh(req);
    if (!refreshed) return null;

    // Verify refreshed token before accepting
    await verifyToken(refreshed);
    return refreshed;
  } else {
    // Verify current token
    await verifyToken(token);
    return token;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Special case: homepage redirect if already authenticated ---
  if (pathname === "/") {
    const active = await getActiveTokenOrNull(req);
    if (active) {
      // Set refreshed token if we obtained a new one during getActiveTokenOrNull
      const res = redirectTo(req, "/dashboard");
      if (active !== req.cookies.get(COOKIE_NAME)?.value) {
        res.cookies.set(COOKIE_NAME, active, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        });
      }
      return res;
    }
    // Not logged in → let the homepage load normally
    return NextResponse.next();
  }

  // Allow other public paths through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // --- Protected areas ---
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return redirectTo(req, "/");
  }

  // Check expiry (date-fns) and refresh if needed
  const decoded = decodeJwt(token);
  if (isExpired(decoded)) {
    const refreshed = await tryRefresh(req);
    if (!refreshed) return redirectTo(req, "/");

    try {
      const payload = await verifyToken(refreshed);

      // Enforce ADMIN here
      if (payload.iss !== getIssuer()) return redirectTo(req, "/");
      if (payload.role !== "ADMIN") return redirectTo(req, "/");

      const nextRes = NextResponse.next();
      nextRes.cookies.set(COOKIE_NAME, refreshed, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
      return nextRes;
    } catch {
      return redirectTo(req, "/");
    }
  }

  // Not expired — verify signature & issuer
  try {
    const payload = await verifyToken(token);

    if (payload.iss !== getIssuer()) return redirectTo(req, "/");
    if (payload.role !== "ADMIN") return redirectTo(req, "/");

    return NextResponse.next();
  } catch {
    return redirectTo(req, "/");
  }
}

// Include "/" so the middleware can run the home redirect logic.
export const config = {
  matcher: ["/", "/admin/:path*", "/dashboard/:path*", "/settings/:path*"],
};
