"use client";

import { createSubscriptionCheckoutSession } from "@/app/actions/subscriptions";
import { PricingPlan, pricingPlans } from "@/config/pricing";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoSparkles } from "react-icons/io5";
import { LuSparkles } from "react-icons/lu";
import { PricingCard } from "./PricingCard";

interface User {
  name?: string | null;
  email?: string | null;
  has_paid_subscription?: boolean | null;
  id?: string | null;
}

interface SubscriptionSectionProps {
  isAuthenticated: boolean;
  user: User | null;
}

const SubscriptionSection = ({
  isAuthenticated,
  user,
}: SubscriptionSectionProps) => {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (
    plan: PricingPlan,
    billingCycle: "monthly" | "yearly"
  ) => {
    if (!isAuthenticated) {
      router.push(
        `/sign-in?redirect=landing&plan=${plan.id}&billing=${billingCycle}`
      );
      return;
    }

    if (user?.has_paid_subscription) {
      router.push("/dashboard");
      return;
    }

    setLoading(plan.id);

    try {
      const result = await createSubscriptionCheckoutSession(
        plan.id,
        billingCycle === "yearly" ? "year" : "month"
      );

      if (result.ok && result.url) {
        window.location.href = result.url;
      } else {
        alert(result.error || "Failed to start subscription.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-white pb-32 dark:bg-black"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 opacity-50 dark:from-gray-900 dark:via-black dark:to-black" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center"
        >
          <h2 className="mb-6 mt-10 text-4xl font-bold sm:text-6xl">
            <span className="block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              Choose your
            </span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              perfect plan
            </span>
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-400">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mx-auto mb-6 flex w-fit flex-col items-center gap-4">
            <motion.div
              className="relative flex items-center justify-center gap-3 rounded-full border border-gray-300 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
              layout
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  background: isYearly
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))"
                    : "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
                }}
                transition={{ duration: 0.3 }}
              />

              <motion.button
                onClick={() => setIsYearly(false)}
                className="relative z-10 rounded-full px-6 py-2.5 text-sm font-semibold transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {!isYearly && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    !isYearly
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Monthly
                </span>
              </motion.button>

              <motion.button
                onClick={() => setIsYearly(true)}
                className="relative z-10 flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isYearly && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isYearly ? "text-white" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Yearly
                </span>
                <motion.span
                  className="relative z-10 rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white shadow-md"
                  animate={{ scale: isYearly ? [1, 1.1, 1] : 1 }}
                  transition={{
                    duration: 0.5,
                    repeat: isYearly ? Infinity : 0,
                    repeatDelay: 2,
                  }}
                >
                  Save 17%
                </motion.span>
              </motion.button>
            </motion.div>

            {/* Savings Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: isYearly ? 1 : 0,
                y: isYearly ? 0 : -10,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-center"
            >
              <motion.div
                animate={{ rotate: isYearly ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <IoSparkles className="h-4 w-4 text-green-500" />
              </motion.div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-sm font-semibold text-transparent dark:from-green-400 dark:to-emerald-400">
                Save $118/year with Professional plan or $178/year with
                Enterprise plan!
              </span>
              <motion.div
                animate={{ rotate: isYearly ? -360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <LuSparkles className="h-4 w-4 text-green-500" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          key={isYearly ? "yearly" : "monthly"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 pt-6 lg:grid-cols-3"
        >
          {/* Simple glow effect */}
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 opacity-20 blur-[120px]" />

          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              loading={loading}
              handleSubscribe={handleSubscribe}
              isAuthenticated={isAuthenticated}
              user={user}
              isYearly={isYearly}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
