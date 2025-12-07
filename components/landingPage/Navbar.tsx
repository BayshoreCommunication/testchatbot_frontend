"use client";

import { userLogOut } from "@/app/actions/auth";
import { Button } from "@/components/shared/ui/button";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiBot, BiLogOut } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";

interface NavbarProps {
  isAuthenticated: boolean;
  user: {
    email?: string;
    name?: string;
    [key: string]: any;
  } | null;
  glowAnimation: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Navbar = ({ isAuthenticated, user, glowAnimation }: NavbarProps) => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to toggle glass effect
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  const handleSignOut = async () => {
    await userLogOut();
    router.refresh();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", damping: 20 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? " bg-white/70 py-4 shadow backdrop-blur-xl dark:border-gray-800/50 dark:bg-black/70"
          : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* --- Logo Area --- */}
        <Link href="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20"
          >
            <BiBot className="h-6 w-6 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-xl font-bold text-transparent transition-all group-hover:to-blue-600 dark:from-white dark:to-gray-400">
            Bay AI
          </span>
        </Link>

        {/* --- Action Buttons --- */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-5"
            >
              {/* User Info (Desktop) */}
              {user?.email && (
                <div className="hidden flex-col items-end md:flex">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user.companyName || "Company Name"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </span>
                </div>
              )}

              {/* Dashboard Button */}
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="group relative overflow-hidden border-gray-200 bg-white/50 backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-blue-50/50 hover:text-blue-600 dark:border-gray-800 dark:bg-black/50 dark:hover:bg-blue-900/20 cursor-pointer"
                title="Dashboard"
              >
                <LuLayoutDashboard className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>

              {/* Sign Out */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 cursor-pointer"
                title="Sign Out"
              >
                <BiLogOut className="h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="font-medium text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="relative overflow-hidden rounded-full bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition-opacity hover:opacity-100" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
