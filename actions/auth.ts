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

export async function googleSignUp(): Promise<void> {
  await signIn("google", { redirectTo: "/" });
}

export async function credentialLogin(
  prevState: any,
  formData: FormData
): Promise<{
  error?: string;
  ok: boolean;
}> {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required.", ok: false };
}

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { ok: true };
  } catch (error) {
    // console.error("Login error:", error);
    if ((error as Error).message.includes("CredentialsSignin")) {
      return { error: "Invalid email or password.", ok: false };
    }
    // NextAuth throws an error even on success if redirect is true, 
    // but here redirect is false. 
    // However, it might still throw a CallbackRouteError or similar if authorize fails.
    // We'll catch generic errors here.
     return { error: "Invalid email or password.", ok: false };
  }
}

export async function credentialLoginOtpCheck(
  formData: FormData
): Promise<{ error?: string; ok: boolean; url?: string }> {
  console.log("FormData Entries:", Object.fromEntries(formData.entries())); // Debugging

  const email = formData.get("email") as string | null;
  const otp = formData.get("otp") as string | null;

  // Validate input
  if (!email || !otp) {
    return { error: "Email and otp are required.", ok: false };
  }

  try {
    // Call NextAuth signIn with credentials
    const response = await signIn("credentials", {
      email,
      otp,
      redirect: false, // Prevent automatic redirection
    });

    console.log("check this message 99", response);

    // Ensure a valid response is returned
    if (!response) {
      return {
        error: "Unexpected error: No response from signIn.",
        ok: false,
      };
    }

    if (!response) {
      return {
        error: response.error || "Invalid login credentials.",
        ok: false,
      };
    }

    // Successful login
    return {
      ok: true,
      url: response.url, // Redirect URL if provided
    };
  } catch (err) {
    console.error("Error during credential login:", err);
    return {
      error: "An unexpected error occurred during login.",
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

export async function userSignUpOtpCheck(
  formData: FormData
): Promise<{ error?: string; ok: boolean; url?: string }> {
  console.log("FormData Entries:", Object.fromEntries(formData.entries()));
  const email = formData.get("email") as string | null;
  const otp = formData.get("otp") as string | null;

  if (!email || !otp) {
    return { error: "Email and OTP are required.", ok: false };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/api/user/verify`, {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData?.message || "Invalid OTP or server error.",
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