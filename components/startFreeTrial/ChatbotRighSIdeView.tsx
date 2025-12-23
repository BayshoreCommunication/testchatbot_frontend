"use client";

import { askChatbot } from "@/app/actions/chatbot";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BiBot, BiSend, BiUser } from "react-icons/bi";
import { IoSparkles } from "react-icons/io5";

// --- Types ---
interface TrainingData {
  totalSources?: number;
  quality?: string;
  qualityPercentage?: number;
  companyName?: string;
  alreadyTrained?: boolean;
}

interface ChatbotRightSideViewProps {
  companyName: string;
  isTrainingComplete?: boolean;
  trainingData?: TrainingData | null;
  apiKey?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

// --- Helper Component: Typing Effect ---
const TypewriterText = ({
  text,
  onComplete,
  scrollToBottom,
}: {
  text: string;
  onComplete?: () => void;
  scrollToBottom: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        // Trigger a tiny scroll adjustment on every character to keep view at bottom
        scrollToBottom();
      }, 15);
      return () => clearTimeout(timeout);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, onComplete, scrollToBottom]);

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed">
      {displayedText}
    </p>
  );
};

// --- Helper Function: Clean markdown ---
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/^```\w*\n?/gm, "")
    .replace(/\n?```$/gm, "")
    .replace(/```\n?/g, "")
    .trim();
};

// --- Main Component ---
const ChatbotRightSideView = ({
  companyName,
  isTrainingComplete = false,
  trainingData = null,
  apiKey,
}: ChatbotRightSideViewProps) => {
  const displayName = companyName || "Your Company";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => "test_session_721457542591636141");

  // Ref for the scrollable container (the div with overflow-y-auto)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Smooth Scroll Function ---
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      const maxScrollTop = scrollHeight - clientHeight;

      // Only scroll if there is actually content to scroll
      if (maxScrollTop > 0) {
        scrollContainerRef.current.scrollTo({
          top: maxScrollTop,
          behavior: behavior,
        });
      }
    }
  };

  // Scroll when messages change or loading starts
  useEffect(() => {
    // Use a small timeout to ensure DOM has updated with new message height
    const timeoutId = setTimeout(() => {
      scrollToBottom("smooth");
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  // Initialize Welcome Message
  useEffect(() => {
    const welcomeMsg: Message = {
      id: "welcome",
      role: "assistant",
      content: `Welcome to **${displayName}**! 👋\n\n${
        isTrainingComplete
          ? "I'm trained on your data. How can I help you today?"
          : "I can answer questions about your data instantly."
      }`,
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages([welcomeMsg]);
  }, [displayName, isTrainingComplete]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue("");

    // 1. Add User Message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askChatbot(userText, sessionId, apiKey);

      let botContent = "Sorry, I encountered an error.";
      if (response.ok && response.data) {
        botContent = cleanMarkdown(response.data.answer);
      } else if (response.error) {
        botContent = `Error: ${response.error}`;
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: botContent,
        timestamp: new Date(),
        isTyping: true,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
        isTyping: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex w-full justify-center p-4"
    >
      <div className="relative w-full max-w-[380px]">
        {/* Decorative Glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

        {/* Main Phone Container */}
        <div className="relative mx-auto flex h-[650px] flex-col overflow-hidden rounded-[2.5rem] border-[6px] border-gray-900 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
          {/* --- Header --- */}
          <div className="absolute top-0 z-10 w-full border-b border-white/10 bg-blue-600/95 px-5 py-4 text-white backdrop-blur-md dark:bg-gray-900/90">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 shadow-inner">
                <BiBot className="h-6 w-6 text-white" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-blue-600 bg-green-400"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide">
                  {displayName}
                </h3>
                <p className="flex items-center gap-1 text-xs text-blue-100 opacity-80">
                  <IoSparkles className="h-3 w-3" />
                  AI Assistant
                </p>
              </div>
            </div>
          </div>

          {/* --- Messages Area --- */}
          {/* ADDED REF HERE */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto bg-gray-50 p-4 pt-20 dark:bg-gray-950/50"
            style={{ scrollBehavior: "auto" }} // We handle smooth scroll manually via JS
          >
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    layout
                    className={`flex items-end gap-2 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                        msg.role === "assistant"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <BiBot size={18} />
                      ) : (
                        <BiUser size={18} />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`relative max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200 rounded-bl-none"
                      }`}
                    >
                      {msg.role === "assistant" && msg.isTyping ? (
                        <TypewriterText
                          text={msg.content}
                          scrollToBottom={() => scrollToBottom("auto")} // Use 'auto' (instant) for typing updates to prevent lag
                          onComplete={() => {
                            // Optional completion logic
                          }}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-end gap-2"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                    <BiBot size={18} />
                  </div>
                  <div className="rounded-2xl rounded-bl-none border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                        className="h-2 w-2 rounded-full bg-blue-400"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="h-2 w-2 rounded-full bg-blue-400"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="h-2 w-2 rounded-full bg-blue-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Added a bit of bottom padding instead of a Ref div for cleaner scrolling */}
              <div className="h-4" />
            </div>
          </div>

          {/* --- Input Area --- */}
          <div className="relative border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="relative flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-2 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-900">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent px-3 text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                  !inputValue.trim() || isLoading
                    ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                    : "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:scale-105 active:scale-95"
                }`}
              >
                <BiSend
                  className={`h-4 w-4 ${!inputValue.trim() && "ml-0.5"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatbotRightSideView;
