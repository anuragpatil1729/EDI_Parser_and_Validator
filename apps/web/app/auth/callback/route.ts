import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("access_token");
  const response = NextResponse.redirect(new URL("/", request.url));
  if (token) {
    response.cookies.set("sb-access-token", token, { path: "/", httpOnly: false, sameSite: "lax" });
  }
  return response;
}
