"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BiBot,
  BiLogoGithub,
  BiLogoLinkedin,
  BiLogoTwitter,
} from "react-icons/bi";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white/50 pt-10 pb-6 backdrop-blur-sm dark:border-gray-800 dark:bg-black/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left: Brand */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md transition-transform group-hover:scale-110">
                <BiBot className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-gray-400">
                Bay AI
              </span>
            </Link>
          </div>

          {/* Center: Simple Links */}
          <div className="flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Link
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Right: Socials */}
          <div className="flex space-x-6">
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <BiLogoTwitter className="h-5 w-5" />
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <BiLogoGithub className="h-5 w-5" />
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-600 transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <BiLogoLinkedin className="h-5 w-5" />
            </motion.a>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-8 border-t border-gray-200/50 pt-6 text-center dark:border-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Bay AI Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
