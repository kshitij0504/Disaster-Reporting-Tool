"use client";

import { useState } from "react";
import { ReportForm } from "./reportForm";
import { ReportSubmitted } from "./ReportFormCompleted";

type ReportType = "NON_EMERGENCY" | "LOW_PRIORITY" | "EMERGENCY" | "CRITICAL";

interface ReportData {
  reportId: string;
  type: ReportType;
  specificType: string;
  title: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  status: "PENDING";
  userId: string | undefined;
}

const ReportLayout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<ReportData | null>(null); // Initialize with null

  const handleStepComplete = async (data: ReportData) => {
    setReportData((prevData) => ({ ...prevData, ...data })); // Spread previous data

    if (currentStep === 4) {
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="rounded-2xl bg-zinc-900 p-8">
      {currentStep === 1 && <ReportForm onComplete={handleStepComplete} />}
      {currentStep === 2 && reportData && ( // Check if reportData is not null
        <ReportSubmitted data={reportData} onComplete={handleStepComplete} />
      )}
    </div>
  );
}

export default ReportLayout