"use client";

// ============================================================================
// IMPORTS
// ============================================================================
import Link from "next/link";
import { memo, startTransition, Suspense, useEffect, useState } from "react";

// Framer Motion
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

// UI Components
import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";

// Icons
import {
  BiBarChart,
  BiBarChartAlt,
  BiBot,
  BiCog,
  BiData,
  BiRocket,
  BiShield,
  BiSolidMessageSquareAdd,
  BiSolidQuoteAltLeft,
  BiSolidShieldPlus,
} from "react-icons/bi";
import { BsArrowRight, BsArrowRightShort } from "react-icons/bs";
import { FiZap } from "react-icons/fi";
import { GiSparkles } from "react-icons/gi";
import { GrUserSettings } from "react-icons/gr";
import { HiSparkles } from "react-icons/hi";
import { PiUserCircle } from "react-icons/pi";

// Local Components
import SubscriptionSection from "./SubscriptionSection";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const floatAnimation = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity as number,
      ease: "easeInOut" as const,
    },
  },
};

// ============================================================================
// FEATURE DATA
// ============================================================================
const FEATURES = [
  {
    icon: BiSolidMessageSquareAdd,
    title: "Smart Conversations",
    desc: "Natural language processing for human-like interactions.",
    color: "bg-blue-500",
  },
  {
    icon: FiZap,
    title: "Instant Responses",
    desc: "Lightning-fast responses to never miss a customer.",
    color: "bg-yellow-500",
  },
  {
    icon: BiBarChartAlt,
    title: "Advanced Analytics",
    desc: "Detailed insights into interactions and performance.",
    color: "bg-green-500",
  },
  {
    icon: PiUserCircle,
    title: "Lead Management",
    desc: "Automatically capture and qualify leads from visitors.",
    color: "bg-purple-500",
  },
  {
    icon: GrUserSettings,
    title: "Easy Integration",
    desc: "Seamlessly integrate with your existing tools.",
    color: "bg-indigo-500",
  },
  {
    icon: BiSolidShieldPlus,
    title: "Enterprise Security",
    desc: "Bank-level security with end-to-end encryption.",
    color: "bg-red-500",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: BiData,
    title: "1. Connect Data",
    desc: "Upload documents or link your website URL to train your assistant.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: BiCog,
    title: "2. Customize",
    desc: "Adjust the tone, personality, and branding to match your company.",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: BiRocket,
    title: "3. Deploy",
    desc: "Embed the chat widget on your site with a single line of code.",
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-900/20",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "This AI assistant cut our support tickets by 60% in the first week. It's incredible.",
    author: "Sarah J.",
    role: "CTO, TechFlow",
  },
  {
    quote:
      "Setting it up was ridiculously easy. It knew our entire documentation instantly.",
    author: "Mark R.",
    role: "Founder, DevScale",
  },
  {
    quote: "The ROI is undeniable. We're capturing leads while we sleep.",
    author: "Emily C.",
    role: "Marketing Dir, GrowthCo",
  },
];

const TRUSTED_COMPANIES = [
  "Acme Corp",
  "GlobalTech",
  "Nebula",
  "Circle",
  "FoxRun",
];

// ============================================================================
// BACKGROUND COMPONENTS
// ============================================================================
const SpotlightBackground = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black">
      <div className="absolute h-[40rem] w-[40rem] rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-500/20" />
      <div className="absolute right-0 top-0 h-[30rem] w-[30rem] rounded-full bg-purple-500/10 blur-[100px] dark:bg-purple-500/20" />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

const GlobalBackgroundGradient = () => (
  <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-white to-gray-50 opacity-80 dark:from-gray-900 dark:via-black dark:to-black" />
);

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

// Hero Section
// ----------------------------------------------------------------------------
const HeroSection = () => (
  <section className="relative z-10">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative text-center">
        {/* Floating Decorative Elements */}
        <motion.div
          variants={floatAnimation}
          animate="animate"
          className="absolute -left-4 top-0 hidden lg:block"
        >
          <div className="rounded-2xl bg-white/50 p-3 shadow-xl backdrop-blur-sm dark:bg-gray-800/50 lg:p-4">
            <BiBot className="h-6 w-6 text-blue-500 lg:h-8 lg:w-8" />
          </div>
        </motion.div>

        <motion.div
          variants={floatAnimation}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute right-0 top-20 hidden lg:block"
        >
          <div className="rounded-2xl bg-white/50 p-3 shadow-xl backdrop-blur-sm dark:bg-gray-800/50 lg:p-4">
            <BiBarChart className="h-6 w-6 text-purple-500 lg:h-8 lg:w-8" />
          </div>
        </motion.div>

        {/* Main Hero Content */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex justify-center sm:mb-8"
          >
            <Badge
              variant="gradient"
              className="rounded-full px-3 py-1.5 text-xs backdrop-blur-md sm:px-4 sm:text-sm"
            >
              <HiSparkles className="mr-2 h-3 w-3 text-blue-400 sm:h-4 sm:w-4" />
              Powered by GPT-4 & Advanced AI
            </Badge>
          </motion.div>

          {/* Hero Title */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block text-gray-900 dark:text-white">
              Transform Your
            </span>
            <span className="relative inline-block">
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
                style={{ backgroundSize: "200% auto" }}
              >
                Business
              </motion.span>
              <GiSparkles className="absolute -right-6 -top-6 h-6 w-6 text-yellow-400 sm:-right-8 sm:-top-8 sm:h-8 sm:w-8 lg:-right-12 lg:-top-6" />
            </span>
          </h1>

          {/* Hero Description */}
          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg md:mb-10 md:text-xl lg:text-2xl">
            Revolutionize customer engagement with our{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              AI-powered assistant
            </span>
            . Automate support, capture leads, and boost sales 24/7.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 md:gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/start-free-trial">
                <Button
                  size="xl"
                  className="h-12 w-full rounded-full bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
                >
                  Start Free Trial
                  <BsArrowRightShort className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="xl"
                className="h-12 w-full rounded-full border-gray-200 bg-white/50 px-6 text-base font-semibold text-gray-900 backdrop-blur-sm hover:bg-gray-100 dark:border-gray-800 dark:bg-black/50 dark:text-white dark:hover:bg-gray-800 sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// Trusted By Section
// ----------------------------------------------------------------------------
const TrustedBySection = () => (
  <section className="relative border-y border-gray-100 bg-gray-50/50 backdrop-blur-sm dark:border-gray-800 dark:bg-white/5 py-4 md:py-8 lg:py-10 xl:py-16">
    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 sm:mb-8"
      >
        Trusted by innovative teams at
      </motion.p>
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16"
      >
        {TRUSTED_COMPANIES.map((name) => (
          <motion.span
            key={name}
            variants={fadeInUp}
            className="flex items-center text-base font-bold text-gray-500 transition-all duration-300 hover:text-gray-900 dark:text-gray-600 dark:hover:text-gray-300 sm:text-lg md:text-xl"
          >
            {name}
          </motion.span>
        ))}
      </motion.div>
    </div>
  </section>
);

// Features Section
// ----------------------------------------------------------------------------
const FeaturesSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <SpotlightBackground className="pb-6 md:pb-32 lg:pb-36 xl:pb-48">
      <motion.div
        style={{ y: y1 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center"
        >
          {/* Section Header */}
          <motion.h2
            variants={fadeInUp}
            className="mb-3 text-2xl font-bold sm:text-3xl md:mb-4 lg:text-4xl xl:text-5xl"
          >
            <span className="text-gray-900 dark:text-white">
              Everything you need to{" "}
            </span>
            <span className="text-blue-600 dark:text-blue-400">succeed</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mb-10 max-w-2xl text-base text-gray-600 dark:text-gray-400 sm:mb-12 sm:text-lg lg:mb-16"
          >
            Our AI assistant comes packed with powerful features designed to
            automate and accelerate your business growth.
          </motion.p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="group relative h-full overflow-hidden border-gray-200 bg-white/60 backdrop-blur-sm transition-colors hover:border-blue-500/50 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-blue-500/50">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div
                      className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color.replace(
                        "bg-",
                        "bg-"
                      )}/10 shadow-sm transition-all duration-300 group-hover:scale-110 sm:mb-4 sm:h-14 sm:w-14`}
                    >
                      <feature.icon
                        className={`h-6 w-6 ${feature.color.replace(
                          "bg-",
                          "text-"
                        )} sm:h-7 sm:w-7`}
                      />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                      {feature.desc}
                    </p>
                  </CardContent>
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:from-blue-500/5 group-hover:to-purple-500/5 group-hover:opacity-100" />
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </SpotlightBackground>
  );
};

// How It Works Section
// ----------------------------------------------------------------------------
const HowItWorksSection = () => (
  <section className="relative overflow-hidden bg-white  dark:bg-black pb-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-12 text-center sm:mb-16">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-400 sm:mt-4 sm:text-lg">
          Get your AI assistant up and running in minutes, not days.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="relative grid gap-8 sm:gap-10 md:grid-cols-3 lg:gap-12">
        {/* Connecting Line (Desktop) */}
        <div className="absolute left-[16%] right-[16%] top-12 hidden h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 md:block" />

        {HOW_IT_WORKS_STEPS.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="relative flex flex-col items-center text-center"
          >
            <div
              className={`z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${step.bg} shadow-sm backdrop-blur-sm sm:mb-6 sm:h-24 sm:w-24`}
            >
              <step.icon className={`h-8 w-8 ${step.color} sm:h-10 sm:w-10`} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
              {step.title}
            </h3>
            <p className="max-w-xs text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Testimonials Section
// ----------------------------------------------------------------------------
const TestimonialsSection = () => (
  <section className="bg-gray-50 dark:bg-gray-900/30 py-10 lg:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:mb-12 sm:text-3xl lg:mb-16 lg:text-4xl">
        Loved by businesses everywhere
      </h2>
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full border-none bg-white shadow-lg dark:bg-gray-800">
              <CardContent className="pt-6 sm:pt-8">
                <BiSolidQuoteAltLeft className="mb-3 h-6 w-6 text-blue-200 dark:text-blue-900 sm:mb-4 sm:h-8 sm:w-8" />
                <p className="mb-4 text-base italic text-gray-700 dark:text-gray-300 sm:mb-6 sm:text-lg">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 sm:h-10 sm:w-10" />
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                      {item.author}
                    </p>
                    <p className="text-xs text-gray-500 sm:text-sm">
                      {item.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// CTA Section
// ----------------------------------------------------------------------------
const CTASection = memo(() => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(closest-side,rgba(59,130,246,0.1)_0%,transparent_100%)]" />

      <h2 className="mb-4 text-3xl font-bold tracking-tight sm:mb-6 sm:text-4xl lg:text-5xl">
        <span className="block text-gray-900 dark:text-white">
          Ready to transform
        </span>
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          your business?
        </span>
      </h2>

      <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:mb-10 sm:text-lg lg:text-xl">
        Join thousands of businesses already using our AI assistant to automate
        customer interactions and boost revenue.
      </p>

      <motion.div
        whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
        whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
      >
        <Link href="/start-free-trial" className="cursor-pointer">
          <Button
            variant="gradient"
            size="xl"
            className="relative overflow-hidden rounded-full bg-blue-600 px-6 py-5 text-base font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:bg-blue-700 sm:px-8 sm:py-6 sm:text-lg cursor-pointer"
          >
            <span className="relative z-10 flex items-center">
              Start Your Free Trial
              <BsArrowRight className="ml-2 h-4 w-4 sm:ml-3 sm:h-5 sm:w-5" />
            </span>
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
});

CTASection.displayName = "CTASection";

// Subscription Alert
// ----------------------------------------------------------------------------
const SubscriptionAlert = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed left-0 right-0 top-20 z-50 mx-auto w-full max-w-md px-4 sm:top-24"
  >
    <div className="flex items-start rounded-xl border border-yellow-200 bg-yellow-50/90 p-4 shadow-2xl backdrop-blur-md dark:border-yellow-900/50 dark:bg-yellow-900/40">
      <BiShield className="mr-3 mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400 sm:h-6 sm:w-6" />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 sm:text-base">
          Subscription Required
        </h3>
        <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300 sm:text-sm">
          Please choose a plan below to access the dashboard.
        </p>
      </div>
      <button
        onClick={onClose}
        className="ml-3 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
        aria-label="Close alert"
      >
        ✕
      </button>
    </div>
  </motion.div>
);

// ============================================================================
// TYPES
// ============================================================================
interface LandingPageProps {
  session: {
    user?: {
      id?: string;
      email?: string;
      name?: string;
      [key: string]: any;
    };
  } | null;
}

// ============================================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================================
export default function LandingPage({ session }: LandingPageProps) {
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);

  // Authentication State
  const isAuthenticated = !!session?.user;
  const user = session?.user || null;

  // Check for subscription requirement on mount
  useEffect(() => {
    const subscriptionRequired = localStorage.getItem("subscription_required");

    if (subscriptionRequired === "true") {
      localStorage.removeItem("subscription_required");

      startTransition(() => {
        setShowSubscriptionAlert(true);
      });

      const timer = setTimeout(() => {
        startTransition(() => {
          setShowSubscriptionAlert(false);
        });
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Suspense
      fallback={<div className="min-h-screen bg-white dark:bg-black" />}
    >
      <div className="relative min-h-screen overflow-hidden bg-white selection:bg-blue-500/30 dark:bg-black">
        {/* Global Background Gradient */}
        <GlobalBackgroundGradient />

        {/* Subscription Alert */}
        {showSubscriptionAlert && (
          <SubscriptionAlert onClose={() => setShowSubscriptionAlert(false)} />
        )}

        {/* Hero Section */}
        <div className="pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-40">
          <HeroSection />
        </div>

        {/* Trusted By Section */}
        <TrustedBySection />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Subscription Section */}
        <section className="relative z-10">
          <SubscriptionSection isAuthenticated={isAuthenticated} user={user} />
        </section>

        {/* CTA Section */}
        <section className="relative z-10 overflow-hidden bg-gray-50/50 dark:bg-black/50 pb-20 pt-6">
          <CTASection />
        </section>
      </div>
    </Suspense>
  );
}
