import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. PUBLIC PATHS: Accessible to everyone (Guests + Users)
  // Removed "/start-free-trial" so it forces a login first.
  const publicPaths = [
    "/",
    "/sign-in",
    "/sign-up",
    "/start-free-trial",
    "/google",
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

  // Check if current path matches any exempt path
  if (subscriptionExemptPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

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

    // If still no subscription, redirect them to the trial/pricing page instead of home
    return NextResponse.redirect(new URL("/start-free-trial", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|assets/).*)"],
};

export default middleware;
