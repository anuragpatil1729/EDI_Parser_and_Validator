import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = new Set(["/login", "/register", "/auth/callback"]);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (PUBLIC_ROUTES.has(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("sb-access-token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"],
};
