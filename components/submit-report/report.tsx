"use client";

import { useState } from "react";
import { ReportForm } from "./reportForm";
import { ReportSubmitted } from "./ReportFormCompleted";
import { report } from "process";

export function ReportLayout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<any>(null);

  const handleStepComplete = async (data: any) => {
    setReportData({ ...reportData, ...data });

    if (currentStep === 4) {
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="rounded-2xl bg-zinc-900 p-8">
      {currentStep === 1 && <ReportForm onComplete={handleStepComplete} />}
      {currentStep === 2 &&  <ReportSubmitted data={reportData} onComplete={handleStepComplete}/>}
    </div>
  );
}