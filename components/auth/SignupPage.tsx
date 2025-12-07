"use client";

import { googleAuthLogin, sendOTPAction, verifyOTPAndSignupAction } from "@/app/actions/auth";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BiBuilding,
  BiCategory,
  BiEnvelope,
  BiGlobe,
  BiLockAlt,
  BiShield,
  BiX,
} from "react-icons/bi";
import { FiEye, FiEyeOff } from "react-icons/fi";

const companyTypes = [
  { label: "Law Firm", value: "law-firm" },
  { label: "Tech Company", value: "tech-company" },
  { label: "Healthcare Provider", value: "healthcare" },
  { label: "Consulting", value: "consulting" },
  { label: "Non-profit", value: "non-profit" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Education", value: "education" },
  { label: "Financial Services", value: "financial" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Other", value: "other" },
] as const;

const SignupPage = () => {
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // OTP Flow States
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  // Form Data States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    companyType: "",
    website: "",
  });

  // Form States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // Step 1: Submit Form and Send OTP
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Store form data
    const data = {
      email: form.get("email") as string,
      password: password,
      companyName: form.get("companyName") as string,
      companyType: form.get("companyType") as string,
      website: form.get("website") as string,
    };

    try {
      // Send OTP to email
      const result = await sendOTPAction(data.email);

      if (!result.ok) {
        throw new Error(result.error || "Failed to send OTP");
      }

      // Store form data and show OTP modal
      setFormData(data);
      setSuccess(result.message || "OTP sent successfully! Check your email.");
      setShowOTPModal(true);

      // Start 2-minute countdown timer
      const timerDuration = result.expiresIn || 120;
      setOtpTimer(timerDuration);
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Create Account
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      email: formData.email,
      otp,
      password: formData.password,
      companyName: formData.companyName,
      companyType: formData.companyType,
      website: formData.website,
    };

    try {
      const result = await verifyOTPAndSignupAction(payload);

      if (!result.ok) {
        throw new Error(result.error || "Failed to create account");
      }

      setSuccess(result.message || "Account created successfully! Redirecting to sign in...");

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create account";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      await googleAuthLogin();
    } catch (error) {
      console.error("Google signup error:", error);
      setIsGoogleLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await sendOTPAction(formData.email);

      if (!result.ok) {
        throw new Error(result.error || "Failed to resend OTP");
      }

      setSuccess(result.message || "OTP resent successfully!");
      const timerDuration = result.expiresIn || 120;
      setOtpTimer(timerDuration);

      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend OTP";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reusable styles
  const inputClasses =
    "w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:bg-black/40";
  const labelClasses =
    "mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400";

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 dark:bg-[#050505] pt-8">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/10" />
        <div className="absolute -right-[10%] bottom-[20%] h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-[120px] dark:bg-indigo-600/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:invert" />
      </div>

      <div className="container relative z-10 mx-auto flex w-full max-w-2xl flex-col justify-center space-y-8 px-4 py-12">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4 text-center pt-4">
          <div className="space-y-2">
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              Create Company Account
            </motion.h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 dark:text-gray-400"
            >
              Join us to manage your AI integration effortlessly
            </motion.p>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40"
        >
          {/* Registration Form */}
          <form onSubmit={handleSubmitForm} className="space-y-5">
            {/* Company Name */}
            <div className="space-y-1">
              <label className={labelClasses} htmlFor="companyName">
                <BiBuilding /> Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Acme Inc."
                required
                className={inputClasses}
              />
            </div>

            {/* Company Type */}
            <div className="space-y-1">
              <label className={labelClasses} htmlFor="companyType">
                <BiCategory /> Company Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="companyType"
                  name="companyType"
                  defaultValue=""
                  required
                  className={`${inputClasses} appearance-none`}
                >
                  <option value="" disabled>Select Company Type</option>
                  {companyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Company Website URL */}
            <div className="space-y-1">
              <label className={labelClasses} htmlFor="website">
                <BiGlobe /> Company Website URL <span className="text-red-500">*</span>
              </label>
              <input
                id="website"
                name="website"
                type="url"
                placeholder="https://acme.com"
                required
                className={inputClasses}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className={labelClasses} htmlFor="email">
                <BiEnvelope /> Work Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className={inputClasses}
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClasses} htmlFor="password">
                  <BiLockAlt /> Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses} htmlFor="confirmPassword">
                  <BiLockAlt /> Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    required
                    minLength={6}
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {error && !showOTPModal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="rounded-lg px-4 py-3 text-sm font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <BiShield className="inline mr-2" />
                    Create Account
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 dark:bg-white/70 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
              >
                {isGoogleLoading ? (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Google</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Already registered?{" "}
            </span>
            <Link
              href="/sign-in"
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Sign In to dashboard
            </Link>
          </div>
        </motion.div>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => !loading && setShowOTPModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => !loading && setShowOTPModal(false)}
                  disabled={loading}
                  className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  <BiX className="h-5 w-5" />
                </button>

                {/* Modal Header */}
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <BiShield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Verify Your Email
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    We&apos;ve sent a 6-digit code to <strong>{formData.email}</strong>
                  </p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  {/* OTP Input */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      maxLength={6}
                      required
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-center text-3xl font-bold tracking-widest text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
                    />

                    {/* Timer and Resend */}
                    <div className="flex items-center justify-between text-sm">
                      {otpTimer > 0 ? (
                        <p className="font-mono text-blue-600 dark:text-blue-400">
                          Code expires in {formatTime(otpTimer)}
                        </p>
                      ) : (
                        <p className="text-red-600 dark:text-red-400">
                          Code expired
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading || otpTimer > 0}
                        className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {(error || success) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className={`rounded-lg px-4 py-3 text-sm font-medium ${
                        error
                          ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      }`}
                    >
                      {error || success}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      "Verify & Create Account"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignupPage;
