"use client";

import { useState } from "react";
import { BiRefresh, BiSearch } from "react-icons/bi";

// Dummy chat data
const dummyChats = [
  {
    id: 1,
    name: "Visitor e1be90c6",
    lastMessage: "How may I assist you today?",
    time: "11:31 AM",
    initials: "V",
    isOnline: true,
  },
  {
    id: 2,
    name: "Safe",
    lastMessage: "Thanks Safe! If you'd like me to se...",
    time: "10:45 AM",
    initials: "S",
    isOnline: true,
  },
  {
    id: 3,
    name: "Yes Please",
    lastMessage: "You can reach our lawyer at (813)...",
    time: "Yesterday",
    initials: "YP",
    isOnline: true,
  },
  {
    id: 4,
    name: "Hello",
    lastMessage: "How can I assist you today? If yo...",
    time: "Yesterday",
    initials: "H",
    isOnline: true,
  },
  {
    id: 5,
    name: "Visitor 1b328ed0",
    lastMessage: "Clients praise their communication...",
    time: "2 days ago",
    initials: "V",
    isOnline: true,
  },
  {
    id: 6,
    name: "Great",
    lastMessage: "Our firm handles a variety of case...",
    time: "3 days ago",
    initials: "G",
    isOnline: true,
  },
  {
    id: 7,
    name: "Wityh Your Name",
    lastMessage: "It seems like you're open to answ...",
    time: "3 days ago",
    initials: "WY",
    isOnline: true,
  },
  {
    id: 8,
    name: "Connect",
    lastMessage: "The user's name is Connect.",
    time: "4 days ago",
    initials: "C",
    isOnline: true,
  },
  {
    id: 9,
    name: "Yes",
    lastMessage: "I understand you need assistance...",
    time: "5 days ago",
    initials: "Y",
    isOnline: false,
  },
];

interface ChatHistoryListProps {
  onChatSelect: (chatId: number) => void;
  selectedChatId: number | null;
}

const ChatHistoryList = ({
  onChatSelect,
  selectedChatId,
}: ChatHistoryListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const filteredChats = dummyChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-l border-t border-b border-gray-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <BiRefresh size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <BiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Sort by</span>
          <button
            onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
            className="text-gray-900 font-medium hover:text-gray-700"
          >
            {sortBy === "newest" ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-b border-gray-100 ${
              selectedChatId === chat.id ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                {chat.initials}
              </div>
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {chat.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="inline-block w-4 h-3">
                  <svg
                    viewBox="0 0 16 12"
                    fill="none"
                    className="w-full h-full"
                  >
                    <path
                      d="M2 2L8 8L14 2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <p className="truncate flex-1">{chat.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistoryList;
