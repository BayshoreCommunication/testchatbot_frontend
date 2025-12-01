"use client";

import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { PricingPlan } from "@/config/pricing";
import { motion } from "framer-motion";
import { memo } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";

interface User {
  name?: string | null;
  email?: string | null;
  has_paid_subscription?: boolean | null;
  id?: string | null;
}

interface PricingCardProps {
  plan: PricingPlan;
  loading: string | null;
  handleSubscribe: (plan: PricingPlan, billingCycle: "monthly" | "yearly") => void;
  isAuthenticated: boolean;
  user: User | null;
  isYearly: boolean;
}

export const PricingCard = memo(
  ({
    plan,
    loading,
    handleSubscribe,
    isAuthenticated,
    user,
    isYearly,
  }: PricingCardProps) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const displayPrice = isYearly && plan.id !== "trial" ? price / 12 : price;

    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`relative ${
          plan.recommended ? "lg:-my-8 lg:h-[calc(100%+4rem)]" : "h-full"
        }`}
      >
        {plan.recommended && (
          <Badge
            variant="gradient"
            className="absolute -top-1 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-2 text-sm font-medium text-white shadow-lg"
          >
            Most Popular
          </Badge>
        )}

        <Card
          className={`relative flex h-full flex-col overflow-hidden border backdrop-blur-xl ${
            plan.recommended
              ? "mt-4 border-blue-500/50 bg-gradient-to-br from-blue-50 to-purple-50 shadow-[0_0_30px_rgba(59,130,246,0.2)] dark:from-gray-900 dark:to-black"
              : "border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-gray-300 dark:border-gray-800 dark:from-gray-900 dark:to-black dark:hover:border-gray-700"
          }`}
        >
          <CardHeader className="relative z-10 pb-8 pt-8 text-center">
            <CardTitle className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {plan.name}
            </CardTitle>
            <CardDescription className="mb-6 text-gray-600 dark:text-gray-400">
              {plan.description}
            </CardDescription>
            <div className="mb-6 flex items-baseline justify-center">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-gray-300">
                ${displayPrice.toFixed(0)}
              </span>
              <span className="ml-2 text-lg text-gray-600 dark:text-gray-400">
                /month
              </span>
            </div>
            {isYearly && plan.id !== "trial" && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Billed ${price} annually
              </p>
            )}
          </CardHeader>

          <CardContent className="relative z-10 flex flex-grow flex-col">
            <ul className="mb-8 flex-grow space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="group flex items-center text-gray-700 dark:text-gray-300"
                >
                  <BiCheckCircle
                    className={`mr-3 h-5 w-5 ${
                      plan.recommended ? "text-blue-400" : "text-blue-500"
                    }`}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <Button
                variant={plan.recommended ? "gradient" : "outline"}
                size="xl"
                className="w-full"
                onClick={() =>
                  handleSubscribe(plan, isYearly ? "yearly" : "monthly")
                }
                disabled={loading === plan.id}
              >
                {loading === plan.id ? (
                  <span className="flex items-center">Processing...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isAuthenticated
                      ? user?.has_paid_subscription
                        ? "Access Dashboard"
                        : "Get Started"
                      : "Sign In"}
                    <BsArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

PricingCard.displayName = "PricingCard";