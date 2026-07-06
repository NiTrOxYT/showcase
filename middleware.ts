import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Security Headers Configuration
  const securityHeaders = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "origin-when-cross-origin",
    "X-XSS-Protection": "1; mode=block",
    "Content-Security-Policy": "frame-ancestors 'none';",
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 2. Future Authentication and Protection placeholders
  const { pathname } = request.nextUrl;
  if (pathname === "/about") {
    return NextResponse.redirect(new URL("/#about", request.url));
  }
  if (pathname === "/contact") {
    return NextResponse.redirect(new URL("/#contact", request.url));
  }

  // 2. Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const { supabaseMiddleware } = await import("@/lib/supabase/middleware");
    const { isAuthenticated } = await supabaseMiddleware(request);

    if (pathname === "/admin/login") {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } else {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
