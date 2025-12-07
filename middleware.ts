import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

<<<<<<< HEAD
  // 1. PUBLIC PATHS: Accessible to everyone (Guests + Users)
  // Removed "/start-free-trial" so it forces a login first.
=======
  // Public paths that don't require authentication
>>>>>>> 05e847bffaa46c60d6eb4783bf6314aa62c272f8
  const publicPaths = [
    "/",
    "/sign-in",
    "/sign-up",
<<<<<<< HEAD
    "/start-free-trial",
    "/google",
=======
    "/forget-password",
>>>>>>> 05e847bffaa46c60d6eb4783bf6314aa62c272f8
    "/create-assistent",
    "/chatbot",
  ];

  // 2. STATIC ASSETS: Always allow
  const excludedPaths = [
    "/_next/",
    "/favicon.ico",
    "/opengraph-image.png",
    "/assets/",
  ];

  // Check for static assets
  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

<<<<<<< HEAD
  // --- OAUTH CALLBACK HANDLING ---
  if (pathname === "/auth/callback") {
    try {
      const session = await auth();

      if (!session || !session.user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      const user = session.user as any;
      const hasActiveSubscription = user?.subscription?.isActive;

      if (hasActiveSubscription) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        // Redirect to start-free-trial if no sub, otherwise home
        return NextResponse.redirect(new URL("/start-free-trial", request.url));
      }
    } catch (error) {
      console.error("💥 [Middleware] Callback Error:", error);
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  const session = await auth();

  // --- AUTH PAGE REDIRECT (UX Improvement) ---
  // If user is already logged in, don't let them see Sign-In/Up pages
  if (session?.user && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow other public paths
  if (
    publicPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
=======
  // Allow public paths without authentication or subscription
  if (publicPaths.includes(pathname)) {
>>>>>>> 05e847bffaa46c60d6eb4783bf6314aa62c272f8
    return NextResponse.next();
  }

  // --- PROTECTED ROUTES ---

  // 1. Require Authentication
  if (!session || !session.user) {
    // Redirect to sign-in, but remember where they wanted to go
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Subscription Check logic
  // These paths are protected (require auth) but allowed WITHOUT an active subscription
  // This allows the user to actually access the page to buy the subscription.
  const subscriptionExemptPaths = [
    "/start-free-trial",
    "/confirm-subscription",
    "/paymenttest",
  ];

<<<<<<< HEAD
  // Check if current path matches any exempt path
  if (subscriptionExemptPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }
=======
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
>>>>>>> 05e847bffaa46c60d6eb4783bf6314aa62c272f8

  // For all other protected paths (like /dashboard), require Active Subscription
  if (!session.user.subscription?.isActive) {
    // Optional: Double check with backend API to prevent stale session data
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

<<<<<<< HEAD
    // If still no subscription, redirect them to the trial/pricing page instead of home
    return NextResponse.redirect(new URL("/start-free-trial", request.url));
=======
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
>>>>>>> 05e847bffaa46c60d6eb4783bf6314aa62c272f8
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|assets/).*)"],
};

export default middleware;
