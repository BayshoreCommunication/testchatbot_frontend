"use client";

import { useState } from "react";
import ChatHistoryBody from "./ChatHistoryBody";
import ChatHistoryList from "./ChatHistoryList";
import RightNotification from "./RightNotification";

const ChatHistoryView = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(1);

  return (
    <div className="flex h-screen bg-gray-50 rounded ">
      {/* Left Sidebar - Chat List */}
      <ChatHistoryList
        onChatSelect={setSelectedChatId}
        selectedChatId={selectedChatId}
      />

      {/* Center - Chat Body */}
      <ChatHistoryBody selectedChatId={selectedChatId} />

      {/* Right Sidebar - Notifications */}
      <div className="flex items-start pl-4">
        <RightNotification />
      </div>
    </div>
  );
};

export default ChatHistoryView;
