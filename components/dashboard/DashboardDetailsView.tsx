"use client";

import { useState } from "react";
import {
  BiCheck,
  BiData,
  BiDollar,
  BiFile,
  BiMessageDetail,
  BiPhone,
  BiTrendingUp,
  BiUser,
} from "react-icons/bi";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Dummy data for the chart
const chartData = [
  { month: "Feb", visitors: 5000, chats: 3000 },
  { month: "Mar", visitors: 8000, chats: 5000 },
  { month: "Apr", visitors: 6000, chats: 4000 },
  { month: "May", visitors: 9000, chats: 6000 },
  { month: "Jun", visitors: 12000, chats: 8000 },
  { month: "Jul", visitors: 15000, chats: 11000 },
  { month: "Aug", visitors: 22000, chats: 16000 },
  { month: "Sep", visitors: 28000, chats: 20000 },
  { month: "Oct", visitors: 18000, chats: 13000 },
  { month: "Nov", visitors: 14000, chats: 10000 },
  { month: "Dec", visitors: 10000, chats: 7000 },
];

// Dummy notifications data
const notifications = [
  {
    id: 1,
    title: "New message from John Doe",
    time: "Just now",
    icon: <BiMessageDetail size={16} />,
  },
  {
    id: 2,
    title: "New user registered",
    time: "5 minutes ago",
    icon: <BiUser size={16} />,
  },
  {
    id: 3,
    title: "System update completed",
    time: "1 hour ago",
    icon: <BiCheck size={16} />,
  },
  {
    id: 4,
    title: "Payment received",
    time: "2 hours ago",
    icon: <BiDollar size={16} />,
  },
  {
    id: 5,
    title: "New lead generated",
    time: "3 hours ago",
    icon: <BiTrendingUp size={16} />,
  },
];

// Dummy active users data
const activeUsers = [
  { id: 1, name: "John Doe", initials: "JD", active: true },
  { id: 2, name: "Jane Smith", initials: "JS", active: true },
  { id: 3, name: "Mike Johnson", initials: "MJ", active: false },
  { id: 4, name: "Sarah Wilson", initials: "SW", active: true },
  { id: 5, name: "David Brown", initials: "DB", active: true },
];

const DashboardDetailsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"year" | "last-year">(
    "year"
  );
  const [selectedTab, setSelectedTab] = useState<
    "total-chat" | "total-visitors"
  >("total-chat");

  // Statistics cards data
  const stats = [
    {
      title: "Total Users",
      value: "743",
      subtitle: "Unique visitors",
      icon: <BiUser size={24} />,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "API Calls",
      value: "1,806",
      subtitle: "Total conversations",
      icon: <BiPhone size={24} />,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Storage Used",
      value: "0.38 MB",
      subtitle: "Vector embeddings",
      icon: <BiData size={24} />,
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Documents",
      value: "20",
      subtitle: "Uploaded files",
      icon: <BiFile size={24} />,
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="flex gap-6 bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="flex-1">
        {/* Analytics Header */}
        <div className="mb-6 flex items-center justify-between rounded border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <button className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition-colors">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow"
            >
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                {stat.title}
              </h3>
              <p className="mb-1 text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="rounded border border-gray-200 bg-white p-6">
          {/* Chart Header */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-6 border-b border-gray-200">
              <button
                onClick={() => setSelectedTab("total-chat")}
                className={`pb-3 text-sm font-semibold transition-all relative ${
                  selectedTab === "total-chat"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Total Chat
                {selectedTab === "total-chat" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
              <button
                onClick={() => setSelectedTab("total-visitors")}
                className={`pb-3 text-sm font-semibold transition-all relative ${
                  selectedTab === "total-visitors"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Total Visitors
                {selectedTab === "total-visitors" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                <div className="relative">
                  <input
                    type="radio"
                    name="period"
                    checked={selectedPeriod === "year"}
                    onChange={() => setSelectedPeriod("year")}
                    className="peer sr-only"
                  />
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:border-[5px] transition-all" />
                </div>
                This year
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                <div className="relative">
                  <input
                    type="radio"
                    name="period"
                    checked={selectedPeriod === "last-year"}
                    onChange={() => setSelectedPeriod("last-year")}
                    className="peer sr-only"
                  />
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:border-[5px] transition-all" />
                </div>
                Last year
              </label>
            </div>
          </div>

          {/* Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="5 5"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (value >= 10000) {
                      return `${value / 1000}M`;
                    }
                    return value;
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "13px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedTab === "total-chat" ? "chats" : "visitors"}
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 flex flex-col gap-5">
        {/* Notifications */}
        <div className="rounded border border-gray-200 bg-white overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="overflow-y-auto max-h-[305px] p-4">
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-gray-50 cursor-pointer group border border-transparent hover:border-gray-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 flex-shrink-0 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="rounded border border-gray-200 bg-white overflow-y-auto flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-900">Active</h2>
          </div>
          <div className="overflow-y-auto p-4 max-h-[305px] ">
            <div className="space-y-1">
              {activeUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-gray-50 cursor-pointer group border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 flex-shrink-0 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                        {user.initials}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ${
                          user.active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDetailsView;
