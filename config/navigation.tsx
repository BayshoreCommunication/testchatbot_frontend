import {
  BiBrain,
  BiBulb,
  BiCalendar,
  BiCode,
  BiCog,
  BiGridAlt,
  BiHelpCircle,
  BiHome,
  BiListUl,
  BiMessage,
  BiPalette,
  BiUser,
  BiUserCircle,
} from "react-icons/bi";

export interface SubNavItem {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  label?: string;
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  label?: string;
  badge?: number;
  sub?: SubNavItem[];
}

export const navigationConfig: NavItem[] = [
  // Dashboard
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: <BiHome size={20} />,
  },
  // Chats
  {
    id: "chats",
    title: "Chats",
    href: "/chats",
    icon: <BiMessage size={20} />,
  },
  // Leads
  {
    id: "leads",
    title: "Leads",
    href: "/leads",
    icon: <BiListUl size={20} />,
  },
  // Settings with sub-menu
  {
    id: "settings",
    title: "Settings",
    href: "/dashboard/settings",
    icon: <BiCog size={20} />,
    sub: [
      {
        id: "user-profile",
        title: "User Profile",
        href: "/user-profile",
        icon: <BiUser size={18} />,
      },
      {
        id: "account-settings",
        title: "Account Settings",
        href: "/user-settings",
        icon: <BiUserCircle size={18} />,
      },
      {
        id: "widget-appearance",
        title: "Widget Appearance",
        href: "/chat-widget-update",
        icon: <BiPalette size={18} />,
      },
      {
        id: "widget-installation",
        title: "Widget Installation",
        href: "/create-chat-widget",
        icon: <BiCode size={18} />,
      },
    ],
  },
  // AI with sub-menu
  {
    id: "ai",
    title: "AI",
    href: "/ai",
    icon: <BiBrain size={20} />,
    sub: [
      {
        id: "train-ai",
        title: "Train AI",
        href: "/train-ai",
        icon: <BiBulb size={18} />,
      },
      {
        id: "apps",
        title: "Apps",
        href: "/apps",
        icon: <BiGridAlt size={18} />,
      },
      {
        id: "appointments",
        title: "Appointments",
        href: "/appointments",
        icon: <BiCalendar size={18} />,
      },
      {
        id: "unknown-questions",
        title: "Unknown Questions",
        href: "/unknown-questions",
        icon: <BiHelpCircle size={18} />,
      },
      {
        id: "ai-intelligence",
        title: "AI Intelligence",
        href: "/ai-intelligence",
        icon: <BiBrain size={18} />,
      },
    ],
  },
];
