"use client";

import { userLogOut } from "@/actions/auth";
import { getUserData } from "@/actions/user";
import { useSidebarContext } from "@/lib/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BiBell,
  BiChevronDown,
  BiCog,
  BiLogOut,
  BiSearch,
  BiUser,
} from "react-icons/bi";

interface User {
  name?: string;
  email?: string;
  avatar?: string;
  companyName?: string;
}

const Topbar = () => {
  const { isExpanded } = useSidebarContext();
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Get current route name
  const getCurrentRoute = () => {
    const pathSegments = pathname.split("/").filter(Boolean);

    // If the path is just "/" or empty, return Dashboard
    if (pathSegments.length === 0) {
      return "Dashboard";
    }

    // For paths like /chat, /leads, /dashboard/chat, /dashboard/leads
    // We want to get the main section (not "dashboard")
    let mainSection = pathSegments[0];

    // If first segment is "dashboard", get the next segment
    if (mainSection === "dashboard" && pathSegments.length > 1) {
      mainSection = pathSegments[1];
    }

    // If we're exactly on /dashboard, show Dashboard
    if (mainSection === "dashboard") {
      return "Dashboard";
    }

    // Map routes to their parent sections
    const routeMap: { [key: string]: string } = {
      // Settings sub-routes
      "user-profile": "Settings",
      "user-settings": "Settings",
      "chat-widget-update": "Settings",
      "create-chat-widget": "Settings",
      settings: "Settings",
      profile: "Settings",

      // AI sub-routes
      "train-ai": "AI",
      apps: "AI",
      appointments: "AI",
      "unknown-questions": "AI",
      "ai-intelligence": "AI",
      ai: "AI",

      // Main routes
      chats: "Chats",
      chat: "Chat",
      leads: "Leads",
      dashboard: "Dashboard",
    };

    // Check if the route has a custom mapping
    if (routeMap[mainSection]) {
      return routeMap[mainSection];
    }

    // Capitalize first letter as fallback
    return mainSection.charAt(0).toUpperCase() + mainSection.slice(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserData();
        if (response.ok && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await userLogOut();
  };

  return (
    <div
      className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 transition-all duration-300"
      style={{ left: isExpanded ? "256px" : "80px" }}
    >
      {/* Current Route */}
      <div className="flex items-center">
        <span className="text-lg font-semibold text-gray-900">
          {getCurrentRoute()}
        </span>
      </div>

      {/* Right side - Search, Notifications and User */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative w-80">
          <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
          <BiBell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User Info */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 overflow-hidden relative border border-gray-200">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-white">
                  {(user?.companyName || user?.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <BiChevronDown
              className={`text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.companyName || user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
              <Link
                href="/dashboard/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <BiUser className="mr-3 h-5 w-5 text-gray-400" />
                Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <BiCog className="mr-3 h-5 w-5 text-gray-400" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <BiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
