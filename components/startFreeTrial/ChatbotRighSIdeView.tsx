"use client";

import { motion } from "framer-motion";
import { BiBot, BiSend } from "react-icons/bi";

// --- Training Data Interface ---
interface TrainingData {
  totalSources?: number;
  quality?: string;
  qualityPercentage?: number;
  companyName?: string;
  alreadyTrained?: boolean;
}

// --- Props Interface ---
interface ChatbotRightSideViewProps {
  companyName: string;
  isTrainingComplete?: boolean;
  trainingData?: TrainingData | null;
}

const ChatbotRightSideView = ({
  companyName,
  isTrainingComplete = false,
  trainingData = null,
}: ChatbotRightSideViewProps) => {
  // Use default company name if not provided
  const displayName = companyName || "Your Company";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex w-full justify-center"
    >
      {/* Chatbot Preview Container */}
      <div className="relative">
        {/* Spotlight Effect */}
        <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-2xl dark:opacity-40" />

        {/* Phone-like Chatbot Container */}
        <div className="relative mx-auto h-[600px] w-full max-w-[360px] overflow-hidden rounded-[2rem] border-8 border-gray-900 bg-gray-50 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          {/* Header with Company Info */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-5 pb-6 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <BiBot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{displayName}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                  </span>
                  <p className="text-xs text-blue-100">
                    {isTrainingComplete ? "AI Ready" : "AI Online • Test Mode"}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 left-0 right-0 h-3 rounded-t-xl bg-gray-50 dark:bg-gray-900/95" />
          </div>

          {/* Chat Messages Area */}
          <div className="flex h-full flex-col justify-between p-4 pb-20 pt-2 dark:bg-gray-900/95">
            <div className="space-y-4">
              {/* Bot Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-2.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <BiBot className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white p-3.5 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                  <p className="text-sm">
                    Welcome to <strong>{displayName}</strong>! 👋
                    <br />
                    {isTrainingComplete
                      ? "I'm now trained with your company data and ready to answer questions!"
                      : "I can answer questions about your data instantly."}
                  </p>
                </div>
              </motion.div>

              {/* User Demo Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-blue-600 p-3.5 text-white shadow-sm">
                  <p className="text-sm">
                    {isTrainingComplete
                      ? "Tell me about your services"
                      : "How does the free test work?"}
                  </p>
                </div>
              </motion.div>

              {/* Training Complete Indicator */}
              {isTrainingComplete && trainingData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <BiBot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-blue-50 p-4 shadow-sm dark:bg-blue-900/20 dark:text-gray-200">
                    <p className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-300">
                      {trainingData.alreadyTrained
                        ? "Welcome back!"
                        : "🎉 Training Complete!"}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {trainingData.alreadyTrained
                        ? `Your AI assistant is ready with knowledge from ${
                            trainingData.companyName || "your company"
                          }.`
                        : `Your AI has been trained with ${
                            trainingData.totalSources || 0
                          } sources from ${
                            trainingData.companyName || "your company"
                          }.`}
                    </p>
                    <p className="mt-3 text-sm font-medium text-blue-700 dark:text-blue-400">
                      ✨ You can start your conversation now!
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 dark:bg-gray-900">
              <div className="relative flex items-center">
                <input
                  disabled
                  type="text"
                  placeholder="Type a message..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-4 pr-12 text-sm focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button className="absolute right-2 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                  <BiSend className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatbotRightSideView;
