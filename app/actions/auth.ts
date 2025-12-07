"use server";

import { signIn, signOut } from "@/auth";

export async function userLogOut(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

export async function socialAuthLogin(formData: FormData): Promise<void> {
  const action = formData.get("action") as string | null;

  if (!action) {
    throw new Error("Action is required for social login.");
  }

  await signIn(action, { redirectTo: "/" });
}

/**
 * Google OAuth - Handles both signin and signup automatically
 * Backend checks if user exists and either logs them in or creates new account
 * Redirects based on subscription status:
 * - Active subscription → /dashboard
 * - No subscription → / (home page)
 */
export async function googleAuthLogin(): Promise<void> {
  console.log("check this googlesingup");

  await signIn("google", {
    redirectTo: "/auth/callback",
  });
}

export async function credentialLogin(
  prevState: any,
  formData: FormData
): Promise<{
  error?: string;
  ok: boolean;
  redirectTo?: string;
}> {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  console.log("🔐 [credentialLogin] Starting login for:", email);

  if (!email || !password) {
    console.log("❌ [credentialLogin] Missing credentials");
    return { error: "Email and password are required.", ok: false };
  }

  try {
    console.log("📡 [credentialLogin] Calling NextAuth signIn...");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("📥 [credentialLogin] NextAuth result:", result);

    // Check if signin was successful
    if (result?.error) {
      console.log("❌ [credentialLogin] Error from NextAuth:", result.error);
      return { error: "Invalid email or password.", ok: false };
    }

    console.log("✅ [credentialLogin] Login successful!");

    // Fetch session to get subscription status
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const sessionResponse = await fetch(`${apiUrl}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (sessionResponse.ok) {
        const userData = await sessionResponse.json();
        const hasActiveSubscription = userData?.subscription?.isActive;
        const redirectPath = hasActiveSubscription ? "/dashboard" : "/";

        console.log("📍 [credentialLogin] Redirect to:", redirectPath);
        return { ok: true, redirectTo: redirectPath };
      }
    } catch (err) {
      console.log(
        "⚠️ [credentialLogin] Could not fetch subscription status, defaulting to /dashboard"
      );
    }

    return { ok: true, redirectTo: "/dashboard" };
  } catch (error: any) {
    console.error("💥 [credentialLogin] Exception caught:", error);
    console.error("Error type:", error?.type);
    console.error("Error message:", error?.message);
    console.error("Full error:", JSON.stringify(error, null, 2));

    // Handle specific error types
    if (error?.message?.includes("CredentialsSignin")) {
      console.log("❌ [credentialLogin] CredentialsSignin error");
      return { error: "Invalid email or password.", ok: false };
    }

    if (error?.type === "CredentialsSignin") {
      console.log("❌ [credentialLogin] CredentialsSignin type error");
      return { error: "Invalid email or password.", ok: false };
    }

    return {
      error: "An error occurred during login. Please try again.",
      ok: false,
    };
  }
}

export async function userSignUp(
  formData: FormData
): Promise<{ error?: string; ok: boolean; url?: string }> {
  const requiredFields = ["email", "password", "phone", "businessName"];
  const data = Object.fromEntries(formData.entries());

  for (const field of requiredFields) {
    if (!data[field]) {
      return { error: `${field} is required.`, ok: false };
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/api/user/register`, {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const { error } = await response.json().catch(() => ({}));
      return {
        error: error || "Failed to register. Please try again.",
        ok: false,
      };
    }

    return {
      ok: true,
      url: response.url,
    };
  } catch (err) {
    console.error("Error during user sign-up:", err);
    return {
      error: "A network error occurred. Please try again later.",
      ok: false,
    };
  }
}

export async function userForgetPasswordProcess(
  formData: FormData
): Promise<{ error?: string; ok: boolean; url?: string }> {
  const email = formData.get("email") as string | null;

  if (!email) {
    return {
      error: "Email is required.",
      ok: false,
    };
  }

  // Check API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined in environment variables.");
    return {
      error: "Internal server error. Please try again later.",
      ok: false,
    };
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/forget-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        error:
          responseData?.error ||
          "Failed to process your request. Please try again.",
        ok: false,
      };
    }
    return {
      ok: true,
      url: responseData?.url || response.url,
    };
  } catch (err) {
    console.error("Error during forget password process:", err);
    return {
      error: "An unexpected error occurred. Please try again later.",
      ok: false,
    };
  }
}

export async function userForgetPasswordProcessOtpCheck(
  formData: FormData
): Promise<{ error?: string; ok: boolean; url?: string }> {
  console.log("FormData Entries:", Object.fromEntries(formData.entries()));
  const email = formData.get("email") as string | null;
  const otp = formData.get("otp") as string | null;

  if (!email || !otp) {
    return { error: "Email and OTP are required.", ok: false };
  }

  // Check API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("API URL is not defined in environment variables.");
    return {
      error: "Internal server error. Please try again later.",
      ok: false,
    };
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/forget-password/verify`, {
      method: "POST", // Corrected the HTTP method capitalization
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      // Attempt to parse error details from the response
      const errorData = await response.json().catch(() => null);
      return {
        error:
          errorData?.error ||
          "Failed to process your request. Please try again.",
        ok: false,
      };
    }

    const responseData = await response.json();
    return {
      ok: true,
      url: responseData?.url || "",
    };
  } catch (err) {
    console.error("Error during OTP verification:", err);
    return {
      error: "An unexpected error occurred during OTP verification.",
      ok: false,
    };
  }
}

export async function userForgetPasswordRecovery(
  formData: FormData
): Promise<{ error?: string; ok: boolean; url?: string }> {
  console.log("FormData Entries:", Object.fromEntries(formData.entries()));

  const email = formData.get("email") as string | null;
  const newPassword = formData.get("newPassword") as string | null;

  if (!email || !newPassword) {
    return { error: "Email and New Password are required.", ok: false };
  }

  // Check API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined in environment variables.");
    return {
      error: "Internal server error. Please try again later.",
      ok: false,
    };
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/user/forget-password/recovery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData?.message || "Invalid New Password or server error.",
        ok: false,
      };
    }

    const responseData = await response.json();
    return {
      ok: true,
      url: responseData?.url || "",
    };
  } catch (err) {
    console.error("Error during New Password verification:", err);

    return {
      error: "An unexpected error occurred during New Password verification.",
      ok: false,
    };
  }
}

export async function signUpWithCompany(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; ok: boolean; message?: string }> {
  "use server";

  const data = Object.fromEntries(formData.entries());
  const {
    companyName,
    companyType,
    website,
    email,
    password,
    confirmPassword,
  } = data;

  // 1. Validation
  if (
    !companyName ||
    !companyType ||
    !website ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    return { error: "All fields are required.", ok: false };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", ok: false };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined in environment variables.");
    return {
      error: "Internal server error. Please try again later.",
      ok: false,
    };
  }

  try {
    const response = await fetch(`${apiUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName,
        companyType,
        website,
        email,
        password,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        error: responseData.message || "Failed to sign up. Please try again.",
        ok: false,
      };
    }
    return {
      ok: true,
      message: "Sign up successful! Please sign in.",
    };
  } catch (err) {
    console.error("Error during company sign-up:", err);
    return {
      error: "A network error occurred. Please try again later.",
      ok: false,
    };
  }
}

/**
 * @desc    Send OTP for signup verification
 * @route   POST /api/auth/send-otp
 * @access  Public
 * @param   email - User's email address
 * @returns { error?: string; ok: boolean; message?: string; expiresIn?: number }
 */
export async function sendOTPAction(
  email: string
): Promise<{ error?: string; ok: boolean; message?: string; expiresIn?: number }> {
  if (!email) {
    return { error: "Email is required.", ok: false };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined in environment variables.");
    return {
      error: "Internal server error. Please try again later.",
      ok: false,
    };
  }

  try {
    const response = await fetch(`${apiUrl}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        error: responseData.message || "Failed to send OTP. Please try again.",
        ok: false,
      };
    }

    return {
      ok: true,
      message: responseData.message || "OTP sent successfully to your email.",
      expiresIn: responseData.expiresIn || 120,
    };
  } catch (err) {
    console.error("Error sending OTP:", err);
    return {
      error: "A network error occurred. Please try again later.",
      ok: false,
    };
  }
}

/**
 * @desc    Verify OTP and create user account
 * @route   POST /api/auth/verify-otp
 * @access  Public
 * @param   data - User registration data with OTP
 * @returns { error?: string; ok: boolean; user?: object; token?: string; message?: string }
 */
export async function verifyOTPAndSignupAction(data: {
  email: string;
  otp: string;
  password: string;
  companyName: string;
  companyType?: string;
  website?: string;
  language?: string;
  timezone?: string;
}): Promise<{
  error?: string;
  ok: boolean;
  user?: {
    _id: string;
    email: string;
    companyName: string;
    companyType?: string;
    website?: string;
    subscription?: {
      plan: string;
      isActive: boolean;
      startDate?: Date;
      endDate?: Date;
    };
  };
  token?: string;
  message?: string;
}> {
  // Validate required fields
  if (!data.email || !data.otp || !data.password || !data.companyName) {
    return {
      error: "Email, OTP, password, and company name are required.",
      ok: false,
    };
  }

  if (data.password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
      ok: false,
    };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined in environment variables.");
    return {
      error: "Internal server error. Please try again later.",
      ok: false,
    };
  }

  try {
    const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        error: responseData.message || "Failed to verify OTP. Please try again.",
        ok: false,
      };
    }

    return {
      ok: true,
      user: responseData.user,
      token: responseData.token,
      message: responseData.message || "Account created successfully!",
    };
  } catch (err) {
    console.error("Error verifying OTP and creating account:", err);
    return {
      error: "A network error occurred. Please try again later.",
      ok: false,
    };
  }
}
