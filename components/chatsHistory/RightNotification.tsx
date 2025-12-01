"use client";

import {
  BiCheck,
  BiDollar,
  BiMessageDetail,
  BiTrendingUp,
  BiUser,
} from "react-icons/bi";

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
  { id: 5, name: "David Brown", initials: "DB", active: true },
];

const RightNotification = () => {
  return (
    <div className="w-80 rounded  bg-white overflow-hidden flex flex-col">
      {/* Right Sidebar */}
      <div className="w-80 flex flex-col gap-5">
        {/* Notifications */}
        <div className="rounded border border-gray-200 bg-white overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="overflow-y-auto p-4">
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
          <div className="overflow-y-auto">
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

export default RightNotification;
