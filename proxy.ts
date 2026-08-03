import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

// 1. Specify protected
const protectedRoutes = ["/profile"];
const loginRoutes = ["/sign-in", "/sign-up"];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isLoginRoute = loginRoutes.includes(path);

  const sessionData = await auth.api.getSession({
    headers: req.headers,
  });

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !sessionData?.user) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // 5. Redirect to / if the user is authenticated
  if (isLoginRoute && sessionData?.user) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
