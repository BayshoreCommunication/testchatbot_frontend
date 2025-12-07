"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ChatbotRightSideView from "./ChatbotRighSIdeView";
import TrainLeftSideForm from "./TrainLeftSideForm";

// --- Training Data Interface ---
interface TrainingData {
  totalSources?: number;
  quality?: string;
  qualityPercentage?: number;
  companyName?: string;
  alreadyTrained?: boolean;
}

// --- Session Interface ---
interface Session {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    accessToken?: string;
  };
}

// --- Main Component ---
const FreeTrailMainPage = ({ session }: { session: Session | null }) => {
  const [companyName, setCompanyName] = useState("");
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);

  const handleTrainingComplete = (data: TrainingData) => {
    setTrainingData(data);
    setIsTrainingComplete(true);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white text-slate-900 dark:bg-black dark:text-white pt-36">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-blue-100/50 via-white to-gray-50 opacity-70 dark:from-blue-900/20 dark:via-black dark:to-gray-900" />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Training Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <TrainLeftSideForm
              session={session}
              companyName={companyName}
              setCompanyName={setCompanyName}
              onTrainingComplete={handleTrainingComplete}
            />
          </motion.div>

          {/* Right Column - Chatbot Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-start lg:sticky lg:top-8"
          >
            <ChatbotRightSideView
              companyName={companyName}
              isTrainingComplete={isTrainingComplete}
              trainingData={trainingData}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FreeTrailMainPage;
