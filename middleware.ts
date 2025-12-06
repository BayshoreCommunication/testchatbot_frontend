import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/sign-in",
    "/sign-up",
    "/forget-password",
    "/create-assistent",
    "/chatbot",
  ];

  // Static assets and Next.js internal paths
  const excludedPaths = [
    "/_next/",
    "/favicon.ico",
    "/opengraph-image.png",
    "/assets/",
  ];

  // Allow static assets and Next.js internal paths
  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow public paths without authentication or subscription
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // For all other paths (dashboard, etc.), require authentication and subscription
  try {
    const session = await auth();

    // Redirect to sign-in if no session
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If accessing confirm-subscription page, allow it
    if (pathname === "/confirm-subscription" || pathname === "/paymenttest") {
      return NextResponse.next();
    }

    // For other protected routes (like /dashboard), check subscription
    if (!session.user.subscription?.isActive) {
      // Double check with backend before redirecting
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/user`, {
          headers: {
            Authorization: session.user.accessToken || "",
          },
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.payload?.user?.subscription?.isActive) {
            return NextResponse.next();
          }
        }
      } catch (error) {
        console.error("Middleware subscription check error:", error);
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|assets/).*)"],
};

export default middleware;
