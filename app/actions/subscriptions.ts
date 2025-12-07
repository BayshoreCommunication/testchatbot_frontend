"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

interface ActionResponse {
  error?: string;
  ok: boolean;
  message?: string;
  url?: string;
}

export async function createSubscriptionCheckoutSession(
  planId: string,
  interval: "month" | "year"
): Promise<ActionResponse> {
  const session = await auth();

  if (!session || !session.user || !(session.user as any).accessToken) {
    return { error: "You must be logged in to subscribe.", ok: false };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined in environment variables.");
    return { error: "Internal server error.", ok: false };
  }

  try {
    const token = (session.user as any).accessToken;

    const response = await fetch(`${apiUrl}/api/subscription/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        planId,
        interval,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Failed to create checkout session.",
        ok: false,
      };
    }

    // We can either return the URL for the client to redirect, or redirect from here
    // If we redirect from here, the client-side promise won't resolve with the URL.
    // Usually, returning the URL is better for client-side handling (e.g. generic loading states).
    return {
      ok: true,
      url: data.url,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      error: "An unexpected error occurred.",
      ok: false,
    };
  }
}

export async function cancelSubscription(): Promise<ActionResponse> {
  const session = await auth();

  if (!session || !session.user || !(session.user as any).accessToken) {
    return { error: "You must be logged in to perform this action.", ok: false };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const token = (session.user as any).accessToken;

    const response = await fetch(`${apiUrl}/api/subscription/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Failed to cancel subscription.",
        ok: false,
      };
    }

    return {
      ok: true,
      message: data.message || "Subscription cancelled successfully.",
    };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return {
      error: "An unexpected error occurred.",
      ok: false,
    };
  }
}
