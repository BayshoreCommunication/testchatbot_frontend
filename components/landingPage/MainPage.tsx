"use client";

import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { userLogOut } from "@/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, Suspense, useEffect, useState } from "react";
import {
  BiBarChart,
  BiBot,
  BiLogOut,
  BiMessageSquare,
  BiShield,
  BiShieldPlus,
} from "react-icons/bi";
import { BsArrowRight, BsArrowRightShort } from "react-icons/bs";
import { FiZap } from "react-icons/fi";
import { GiBottleCap, GiSparkles } from "react-icons/gi";
import { GrSettingsOption } from "react-icons/gr";
import { HiSparkles } from "react-icons/hi";
import { PiSignpostLight, PiUserSoundDuotone } from "react-icons/pi";
import { SiSpotlight, SiTarget } from "react-icons/si";
import SubscriptionSection from "./SubscriptionSection";

// Optimized animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 },
};

const glowAnimation = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.3)",
      "0 0 40px rgba(59, 130, 246, 0.6)",
      "0 0 20px rgba(59, 130, 246, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const sparkleVariants = {
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: Math.random() * 2,
    },
  },
};

// Create a separate CTA section component
const CTASection = memo(() => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
    >
      <h2 className="mb-8 text-4xl font-bold sm:text-6xl">
        <span className="mt-16 block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
          Ready to transform
        </span>
        <span className="block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          your business?
        </span>
      </h2>

      <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-600 dark:text-gray-400 sm:text-2xl">
        Join thousands of businesses already using our AI assistant to
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {" "}
          automate customer interactions{" "}
        </span>
        and
        <span className="font-semibold text-purple-600 dark:text-purple-400">
          {" "}
          boost revenue
        </span>
        .
      </p>

      <Button
        variant="gradient"
        size="xl"
        className={`mb-16 ${
          !prefersReducedMotion && "transform hover:scale-105"
        }`}
      >
        Start Your Free Trial
        <BsArrowRight className="ml-3 h-6 w-6" />
      </Button>
    </motion.div>
  );
});

CTASection.displayName = "CTASection";

export default function LandingPage({ session }: { session: any }) {
  const router = useRouter();
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Get user authentication state from session
  const isAuthenticated = !!session?.user;
  const user = session?.user || null;

  // Check if user was redirected due to missing subscription
  useEffect(() => {
    const subscriptionRequired = localStorage.getItem("subscription_required");
    if (subscriptionRequired === "true") {
      setShowSubscriptionAlert(true);
      localStorage.removeItem("subscription_required");

      // Auto-hide alert after 10 seconds
      const timer = setTimeout(() => {
        setShowSubscriptionAlert(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(
    scrollY,
    [0, 300],
    prefersReducedMotion ? [0, 0] : [0, -25]
  );
  const y2 = useTransform(
    scrollY,
    [0, 300],
    prefersReducedMotion ? [0, 0] : [0, -50]
  );

  return (
    <Suspense
      fallback={<div className="min-h-screen bg-white dark:bg-black" />}
    >
      <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black">
        {/* Subscription Required Alert */}
        {showSubscriptionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed left-1/2 top-20 z-50 mx-4 w-full max-w-lg -translate-x-1/2 transform"
          >
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-lg dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start">
                <BiShield className="mr-3 mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                    Subscription Required
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    You need an active subscription to access the dashboard.
                    Please choose a plan below to continue.
                  </p>
                </div>
                <button
                  onClick={() => setShowSubscriptionAlert(false)}
                  className="ml-3 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                >
                  <span className="sr-only">Close</span>✕
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Optimized background with reduced layers */}
        <div
          className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-white to-gray-50 opacity-50 dark:from-gray-900 dark:via-black dark:to-black"
          style={{ willChange: "opacity" }}
        />

        {/* Navigation */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800/50 dark:bg-black/80"
          style={{ translateZ: 0 }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  variants={glowAnimation}
                  animate="animate"
                  className="relative"
                >
                  <BiBot className="h-6 w-6 text-blue-400 sm:h-8 sm:w-8" />
                  <div className="absolute inset-0 bg-blue-400 opacity-30 blur-xl" />
                </motion.div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-gray-300 sm:text-xl">
                  AI Assistant
                </span>
              </motion.div>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    {/* User Email/Name */}
                    {user?.email && (
                      <span className="hidden text-sm text-gray-700 dark:text-gray-300 md:block">
                        {user.email}
                      </span>
                    )}

                    {/* Dashboard Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => router.push("/dashboard")}
                      >
                        Dashboard
                      </Button>
                    </motion.div>

                    {/* Sign Out Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="gradient"
                        onClick={async () => {
                          await userLogOut();
                        }}
                        className="flex items-center gap-2"
                      >
                        <BiLogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <>
                    <Link href="/sign-in">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="ghost">Sign In</Button>
                      </motion.div>
                    </Link>
                    <Link href="/sign-up">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="gradient">Get Started</Button>
                      </motion.div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section with optimized animations */}
        <section className="relative">
          <div className=" inset-0 z-30 flex items-center justify-center pt-36">
            <motion.div
              style={{ y: y1, translateZ: 0 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
            >
              <motion.div
                variants={fadeInUp}
                className="relative z-10 text-center"
              >
                <motion.div
                  variants={sparkleVariants}
                  animate="animate"
                  className="absolute -left-10 -top-10"
                >
                  <GiSparkles className="h-6 w-6 text-blue-400" />
                </motion.div>
                <motion.div
                  variants={sparkleVariants}
                  animate="animate"
                  className="absolute -top-5 right-20"
                >
                  <SiTarget className="h-4 w-4 text-purple-400" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <Badge variant="gradient" className="mb-8">
                    <HiSparkles className="mr-2 h-4 w-4" />
                    Powered by Advanced AI
                  </Badge>
                </motion.div>
                <motion.h1
                  className="mb-8 text-5xl font-bold leading-tight sm:text-7xl lg:text-8xl"
                  variants={fadeInUp}
                >
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent dark:from-white dark:via-gray-100 dark:to-gray-300">
                    Transform Your
                  </span>
                  <br />
                  <motion.span
                    className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    Business
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-700 dark:text-gray-300 sm:text-2xl"
                  variants={fadeInUp}
                >
                  Revolutionize customer engagement with our{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    AI-powered assistant
                  </span>
                  . Automate support, capture leads, and boost sales
                  effortlessly.
                </motion.p>
                <div className="h-8 sm:h-12" />
                <motion.div
                  className="flex flex-col items-center justify-center gap-6 sm:flex-row"
                  variants={staggerContainer}
                >
                  <motion.div
                    variants={scaleIn}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="gradient"
                      size="xl"
                      onClick={() =>
                        document
                          .getElementById("pricing")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Start Free Trial
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <BsArrowRightShort className="ml-2 h-5 w-5" />
                      </motion.div>
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={scaleIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="xl">
                      Watch Demo
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section with optimized animations */}
        <Suspense fallback={null}>
          <SiSpotlight
            className="relative bg-gray-50 pt-32 dark:bg-black"
            fill="rgba(59, 130, 246, 0.08)"
          >
            <motion.div
              style={{ y: y2, translateZ: 0 }}
              className="will-change-transform"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInUp}
                  className="mb-20 text-center"
                >
                  <motion.h2
                    className="mb-6 text-4xl font-bold sm:text-6xl"
                    variants={fadeInUp}
                  >
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                      Everything you need to
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      succeed
                    </span>
                  </motion.h2>
                  <motion.p
                    className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
                    variants={fadeInUp}
                  >
                    Our AI assistant comes packed with powerful features
                    designed to automate and accelerate your business growth.
                  </motion.p>
                </motion.div>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                  {[
                    {
                      icon: BiMessageSquare,
                      title: "Smart Conversations",
                      description:
                        "Natural language processing for human-like interactions with your customers.",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      icon: FiZap,
                      title: "Instant Responses",
                      description:
                        "24/7 availability with lightning-fast response times to never miss a customer.",
                      color: "from-yellow-500 to-orange-500",
                    },
                    {
                      icon: BiBarChart,
                      title: "Advanced Analytics",
                      description:
                        "Detailed insights into customer interactions and business performance.",
                      color: "from-green-500 to-emerald-500",
                    },
                    {
                      icon: PiUserSoundDuotone,
                      title: "Lead Management",
                      description:
                        "Automatically capture and qualify leads from your website visitors.",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      icon: GrSettingsOption,
                      title: "Easy Integration",
                      description:
                        "Seamlessly integrate with your existing tools and workflows.",
                      color: "from-indigo-500 to-blue-500",
                    },
                    {
                      icon: BiShieldPlus,
                      title: "Enterprise Security",
                      description:
                        "Bank-level security with end-to-end encryption for all communications.",
                      color: "from-red-500 to-pink-500",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={scaleIn}
                      whileHover={{
                        scale: 1.05,
                        rotateY: 5,
                        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                      }}
                      className="group"
                    >
                      <Card className="relative h-full overflow-hidden border border-gray-200 bg-gradient-to-br from-white to-gray-50 transition-all duration-500 hover:border-gray-300 dark:border-gray-800 dark:from-gray-900 dark:to-black dark:hover:border-gray-700">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                        />
                        <CardHeader className="relative z-10">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className={`h-14 w-14 rounded-lg bg-gradient-to-br ${feature.color} mx-auto mb-4 p-3`}
                          >
                            <feature.icon className="h-8 w-8 text-white" />
                          </motion.div>
                          <CardTitle className="text-center text-xl text-gray-900 dark:text-white">
                            {feature.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <p className="text-center leading-relaxed text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </SiSpotlight>
        </Suspense>

        <SubscriptionSection
          isAuthenticated={isAuthenticated}
          user={user}
        />

        {/* Optimized CTA Section */}
        <section className="relative overflow-hidden bg-gray-50 dark:bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 opacity-50 dark:from-black dark:to-gray-900" />
          <CTASection />
        </section>

        {/* Footer */}
        <Suspense fallback={null}>
          <PiSignpostLight
            className="relative border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-black"
            fill="rgba(59, 130, 246, 0.05)"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center justify-between md:flex-row"
              >
                <motion.div
                  className="mb-8 flex items-center space-x-3 md:mb-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    variants={glowAnimation}
                    animate="animate"
                    className="relative"
                  >
                    <GiBottleCap className="h-8 w-8 text-blue-400" />
                    <div className="absolute inset-0 bg-blue-400 opacity-30 blur-xl" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-gray-300">
                    AI Assistant
                  </span>
                </motion.div>
                <motion.div
                  className="text-lg text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  © 2025 AI Assistant. All rights reserved.
                </motion.div>
              </motion.div>
            </div>
          </PiSignpostLight>
        </Suspense>
      </div>
    </Suspense>
  );
}
