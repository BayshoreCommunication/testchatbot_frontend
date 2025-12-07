"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface CheckOrSignupResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  isNewUser?: boolean;
  defaultPassword?: string;
}

interface SendOTPResponse {
  success: boolean;
  message?: string;
  otp?: string; // Only in development
}

interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Check if email exists and auto-signup if not
 * Creates user with default password: companyname!123
 */
export async function checkOrSignupAction(email: string, companyName: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth-check/check-or-signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, companyName }),
      cache: "no-store",
    });

    const data: CheckOrSignupResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to check or signup",
      };
    }

    return data;
  } catch (error) {
    console.error("Check or signup error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Send OTP for email verification
 * Prevents spam by rate limiting
 */
export async function sendOTPQuickAction(email: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth-check/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    const data: SendOTPResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to send OTP",
      };
    }

    return data;
  } catch (error) {
    console.error("Send OTP error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Verify OTP and get auth token
 */
export async function verifyOTPQuickAction(email: string, otp: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth-check/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
      cache: "no-store",
    });

    const data: VerifyOTPResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to verify OTP",
      };
    }

    return data;
  } catch (error) {
    console.error("Verify OTP error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
