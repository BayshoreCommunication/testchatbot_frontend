"use client";

import { useState } from "react";
import {
  BiBell,
  BiDotsVerticalRounded,
  BiPaperclip,
  BiSearch,
  BiSend,
} from "react-icons/bi";

// Dummy messages data
const dummyMessages = [
  {
    id: 1,
    text: "Hello",
    sender: "visitor",
    time: "11:31 AM",
  },
  {
    id: 2,
    text: "How may I assist you today?",
    sender: "ai",
    time: "11:31 AM",
  },
];

interface ChatHistoryBodyProps {
  selectedChatId: number | null;
}

const ChatHistoryBody = ({ selectedChatId }: ChatHistoryBodyProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  if (!selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">
            Select a conversation to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white border border-gray-200">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
            V
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Visitor e1be90c6
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-gray-600"
            >
              <rect
                x="2"
                y="3"
                width="12"
                height="10"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M5 3V2C5 1.44772 5.44772 1 6 1H10C10.5523 1 11 1.44772 11 2V3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Take Over
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <BiBell size={20} className="text-gray-600" />
          </button>
          <button className="px-3 py-2 bg-green-50 text-green-600 text-sm font-medium rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Live
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <BiSearch size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <BiDotsVerticalRounded size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {/* Date Header */}
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
            Wednesday, November 26, 2025
          </span>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {dummyMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "ai" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "visitor" && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    V
                  </div>
                  <div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-md">
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {msg.time}
                    </span>
                  </div>
                </div>
              )}
              {msg.sender === "ai" && (
                <div className="flex items-start gap-2 flex-row-reverse">
                  <div className="flex flex-col items-end">
                    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-tr-sm max-w-md">
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{msg.time}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
                        AI
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <BiPaperclip size={20} className="text-gray-600" />
          </button>
          <input
            type="text"
            placeholder="Agent mode required to send messages"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            disabled
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BiSend size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryBody;
