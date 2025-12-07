"use client";

import { sendOTPAction, verifyOTPAction } from "@/actions/auth"; // Import Auth Actions
import { runUnifiedScraping } from "@/actions/unifiedScraping"; // Import Unified Scraping Action
import { motion } from "framer-motion";
import { useState } from "react";
import {
  BiBot,
  BiBuilding,
  BiCheck,
  BiCheckCircle,
  BiEnvelope,
  BiGlobe,
  BiLinkExternal,
  BiLoaderAlt,
  BiLockAlt,
  BiSend,
  BiX,
} from "react-icons/bi";
import { FiCpu } from "react-icons/fi";

// --- Animation Constants ---
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// --- Main Component ---
const FreeTrailMainPage = ({ session }: { session: any }) => {
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp" | "progress" | "success">(
    "form"
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [scrapingResults, setScrapingResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const chatbotDisplayName = companyName.trim() || "Your Company";
  const isUserLoggedIn = !!session?.user;

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  // 3. Unified Scraping Process
  const startUnifiedProcess = async (token: string) => {
    setStep("progress");
    addLog("✅ Authenticated Successfully");
    addLog(`🚀 Starting Unified Analysis for "${companyName}"...`);

    try {
      // Optimistic logs
      addLog("🔍 Searching Google for official website and social profiles...");
      setTimeout(
        () => addLog("🌐 Found targets. Starting deep crawl..."),
        1500
      );
      setTimeout(
        () => addLog("🧠 Vectorizing content for AI knowledge base..."),
        3500
      );

      // Call Server Action
      const result = await runUnifiedScraping(companyName, token);

      if (result.success) {
        addLog(`✅ Process Completed!`);
        const totalUrls = result.data?.searchResults?.totalUrls || 0;
        const totalChunks = result.data?.knowledgeBase?.totalChunks || 0;

        addLog(`📄 Scraped: ${totalUrls} Sources`);
        addLog(`📚 Knowledge Chunks: ${totalChunks}`);

        setScrapingResults(result.data); // Store the results
        setStep("success");
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error(error);
      addLog(`❌ Process Failed: ${error.message}`);
    }
  };

  // 1. Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSendOTP called");
    if (!email || !companyName || !website) {
      console.log("Form not filled completely");
      setError("Please fill out all fields.");
      return;
    }
    setError(null);

    // Check if user is already logged in (check for token in localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      console.log("User already has a token. Starting process directly.");
      // If logged in, skip OTP and go straight to processing
      startUnifiedProcess(token);
      return;
    }

    setIsLoading(true);
    console.log(`Attempting to send OTP to: ${email}`);
    try {
      const data = await sendOTPAction(email);
      console.log("Received response from sendOTPAction:", data);

      if (data.success) {
        console.log("OTP request successful. Moving to OTP verification step.");
        setStep("otp");
      } else {
        console.error("OTP request failed:", data.message);
        setError(
          data.message || "An unknown error occurred while sending OTP."
        );
      }
    } catch (err: any) {
      console.error("An exception occurred in handleSendOTP:", err);
      setError(err.message || "A network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP & Start Process
  const handleVerifyAndStart = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleVerifyAndStart called");
    if (!otp) {
      console.log("OTP not provided");
      setError("Please enter the verification code.");
      return;
    }
    setIsLoading(true);
    setError(null);
    console.log(`Attempting to verify OTP: ${otp} for email: ${email}`);
    try {
      // Verify OTP & Signup/Login (Pass website now)
      const verifyData = await verifyOTPAction(
        email,
        otp,
        companyName,
        website
      );
      console.log("Received response from verifyOTPAction:", verifyData);

      if (!verifyData.success) {
        throw new Error(
          verifyData.message || "Invalid OTP or verification failed."
        );
      }

      console.log(
        "OTP verification successful. Storing token and starting process."
      );
      // Store token
      localStorage.setItem("token", verifyData.token);

      // Start the main process
      await startUnifiedProcess(verifyData.token);
    } catch (error: any) {
      console.error("An exception occurred in handleVerifyAndStart:", error);
      addLog(`❌ Error: ${error.message}`);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("check step my", step);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white text-slate-900 dark:bg-black dark:text-white">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-blue-100/50 via-white to-gray-50 opacity-70 dark:from-blue-900/20 dark:via-black dark:to-gray-900" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
        {/* Left Side */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex w-full flex-col justify-center lg:w-1/2 lg:pr-12"
        >
          <motion.div variants={fadeInUp} className="mb-6 flex justify-start">
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <FiCpu className="mr-1.5 h-3.5 w-3.5" />
              1,000 Free Test Tokens
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
              Test Drive Your
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              AI Assistant
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mb-8 text-lg text-gray-600 dark:text-gray-400"
          >
            Experience the power of our AI with{" "}
            <strong>1,000 free tokens</strong>. No credit card needed.
          </motion.p>

          {/* STEP 1: FORM OR LOGGED IN MESSAGE */}
          {step === "form" && (
            <>
              {isUserLoggedIn ? (
                <motion.div
                  variants={fadeInUp}
                  className="text-center space-y-6"
                >
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <BiCheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Training is Complete!
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    You can now test your AI chatbot
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    Go to Dashboard
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  variants={staggerContainer}
                  className="space-y-5"
                  onSubmit={handleSendOTP}
                >
                  <motion.div variants={fadeInUp}>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Company Name
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-blue-500">
                        <BiBuilding className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 pl-10 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        placeholder="Acme Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Company Website URL
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-blue-500">
                        <BiGlobe className="h-5 w-5" />
                      </div>
                      <input
                        type="url"
                        className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 pl-10 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        placeholder="https://acme.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Work Email
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-blue-500">
                        <BiEnvelope className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 pl-10 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  {error && (
                    <motion.div
                      variants={fadeInUp}
                      className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20"
                    >
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    </motion.div>
                  )}

                  <motion.div variants={fadeInUp} className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Start Test Run"}
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && (
            <motion.form
              // --- FIX START: Add these props ---
              initial="hidden"
              animate="visible"
              exit="hidden" // Optional: if you use AnimatePresence
              // --- FIX END ---

              // If you uncomment this, make sure staggerContainer is defined
              // variants={staggerContainer}
              className="space-y-5" // I uncommented this as it usually provides needed spacing
              onSubmit={handleVerifyAndStart}
            >
              <motion.div variants={fadeInUp}>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Enter Verification Code
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-blue-500">
                    <BiLockAlt className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 pl-10 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Code sent to {email}
                </p>
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {error}
                  </p>
                )}
              </motion.div>

              <motion.div variants={fadeInUp} className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Start AI Training"}
                </motion.button>
              </motion.div>
            </motion.form>
          )}

          {/* STEP 3: PROGRESS */}
          {step === "progress" && (
            <motion.div
              variants={fadeInUp}
              // --- FIX START: Add these props ---
              initial="hidden"
              animate="visible"
              exit="hidden"
              // --- FIX END ---
              className="w-full rounded-xl border border-gray-200 bg-white/50 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50"
            >
              <div className="mb-4 flex items-center gap-3">
                <BiLoaderAlt className="h-6 w-6 animate-spin text-blue-500" />
                <h3 className="text-lg font-semibold">Building Your AI...</h3>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 font-mono text-sm text-gray-600 dark:text-gray-400">
                {logs.map((log, i) => (
                  <div key={i} className="border-l-2 border-blue-500 pl-3">
                    {log}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS & RESULTS */}
          {step === "success" && (
            <motion.div variants={fadeInUp} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <BiCheckCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">Success!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your AI has been trained on data from{" "}
                <strong>{companyName}</strong>.
              </p>

              {/* VISUALIZATION: SCRAPED URLS */}
              {scrapingResults?.deepScraping?.scrapedUrls?.length > 0 && (
                <div className="mt-6 mb-6">
                  <h4 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Scraped Knowledge Sources
                  </h4>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2 text-left text-sm dark:border-gray-700 dark:bg-gray-800">
                    {scrapingResults.deepScraping.scrapedUrls.map(
                      (urlData: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-700"
                        >
                          <a
                            href={urlData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 truncate text-blue-600 hover:underline dark:text-blue-400"
                            title={urlData.url}
                          >
                            <BiLinkExternal className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate max-w-[250px]">
                              {urlData.pageTitle || urlData.url}
                            </span>
                          </a>
                          <span className="flex items-center gap-1 text-xs">
                            {urlData.success ? (
                              <span className="flex items-center text-green-600 dark:text-green-400">
                                <BiCheck className="h-4 w-4" />{" "}
                                {urlData.totalChunks} Chunks
                              </span>
                            ) : (
                              <span className="flex items-center text-red-500">
                                <BiX className="h-4 w-4" /> Failed
                              </span>
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <p className="mt-4 text-sm text-gray-500">
                Account Created for: <strong>{email}</strong>
                <br />
                Password: <strong>{companyName.replace(/\s+/g, "")}@123</strong>
              </p>
              <button
                className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Right Side: Demo Chatbot (Same as before) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 flex w-full justify-center lg:mt-0 lg:w-1/2"
        >
          {/* Spotlight Effect Wrapper */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-2xl dark:opacity-40" />
            <div className="relative mx-auto h-[600px] w-full max-w-[360px] overflow-hidden rounded-[2rem] border-[8px] border-gray-900 bg-gray-50 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-5 pb-6 text-white shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <BiBot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{chatbotDisplayName}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                      </span>
                      <p className="text-xs text-blue-100">
                        AI Online • Test Mode
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-3 left-0 right-0 h-3 bg-gray-50 rounded-t-xl dark:bg-gray-900/95" />
              </div>
              <div className="flex h-full flex-col justify-between p-4 pb-20 pt-2 dark:bg-gray-900/95">
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <BiBot className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white p-3.5 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                      <p className="text-sm">
                        Welcome to <strong>{chatbotDisplayName}</strong>! 👋
                        <br />I can answer questions about your data instantly.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-blue-600 p-3.5 text-white shadow-sm">
                      <p className="text-sm">How does the free test work?</p>
                    </div>
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white p-4 dark:bg-gray-900">
                  <div className="relative flex items-center">
                    <input
                      disabled
                      type="text"
                      placeholder="Type a message..."
                      className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-4 pr-12 text-sm focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button className="absolute right-2 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                      <BiSend className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FreeTrailMainPage;
