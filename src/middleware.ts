import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("JWT_TOKEN")?.value;
  const role = request.cookies.get("USER_ROLE")?.value;
  
  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname === "/" || pathname.startsWith("/auth/") || pathname.startsWith("/courses") || pathname.startsWith("/subjects");
  
  const isStudentRoute = pathname.startsWith("/student");
  const isTeacherRoute = pathname.startsWith("/teacher");
  const isAdminRoute = pathname.startsWith("/admin");

  // Protect dashboard routes
  if (!token && (isStudentRoute || isTeacherRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect to correct dashboard based on role
  if (token && role) {
    if (isStudentRoute && role !== "STUDENT") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, request.url));
    }
    if (isTeacherRoute && role !== "TEACHER") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, request.url));
    }
    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, request.url));
    }
    
    // Redirect away from auth pages if logged in
    if (pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
