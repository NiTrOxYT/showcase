import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  const response = NextResponse.redirect(new URL("/portal/login", _req.url));
  // Clear all Supabase auth cookies
  const allCookies = _req.cookies.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.startsWith("sb-")) {
      response.cookies.delete(cookie.name);
    }
  }
  return response;
}
