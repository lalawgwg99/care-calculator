"use client";

import { useState } from "react";
import { type CMSLevel } from "@/lib/careLogic";

interface Question {
  id: string;
  title: string;
  options: {
    label: string;
    description?: string;
    points: number; // Higher points = higher assistance needed
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "eat",
    title: "1. 進食能力",
    options: [
      { label: "完全獨立", description: "自己用筷子或湯匙吃飯，不用幫忙", points: 0 },
      { label: "需要協助", description: "需別人幫忙夾菜、切碎或餵食", points: 3 },
      { label: "管灌進食", description: "使用鼻胃管或胃造口進食", points: 5 },
    ],
  },
  {
    id: "move",
    title: "2. 移位與行走",
    options: [
      { label: "自由走動", description: "自己走得很好，或自己推輪椅", points: 0 },
      { label: "需要攙扶", description: "需要別人攙扶或使用助行器", points: 3 },
      { label: "完全臥床", description: "無法下床，需要別人抱上抱下", points: 5 },
    ],
  },
  {
    id: "toilet",
    title: "3. 如廁與洗澡",
    options: [
      { label: "完全自理", description: "自己去廁所、自己洗澡", points: 0 },
      { label: "部分協助", description: "需幫忙脫衣褲、清潔或準備洗澡水", points: 3 },
      { label: "完全依賴", description: "包尿布、洗澡需要別人全身擦洗", points: 5 },
    ],
  },
  {
    id: "cognition",
    title: "4. 意識與情緒",
    options: [
      { label: "意識清楚", description: "對答如流，沒有情緒失控", points: 0 },
      { label: "偶爾混亂", description: "有時會忘記事情，或輕微妄想", points: 3 },
      { label: "嚴重失智", description: "認不得家人、日夜顛倒或有攻擊行為", points: 5 },
    ],
  },
];

interface CMSEstimatorProps {
  onComplete: (estimatedCMS: CMSLevel) => void;
  onCancel: () => void;
}

export default function CMSEstimator({ onComplete, onCancel }: CMSEstimatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSelect = (points: number) => {
    const newAnswers = [...answers, points];
    if (currentStep < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate final score
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      let estimatedCMS: CMSLevel = 1;
      
      // Rough estimation logic based on ADL/IADL points
      if (totalScore === 0) estimatedCMS = 1;      // No issues
      else if (totalScore <= 4) estimatedCMS = 2; // Mild issues
      else if (totalScore <= 8) estimatedCMS = 4; // Moderate
      else if (totalScore <= 14) estimatedCMS = 6; // Severe
      else estimatedCMS = 8;                      // Profound/Bedridden

      onComplete(estimatedCMS);
    }
  };

  const currentQ = QUESTIONS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-apple-gray-900/40 backdrop-blur-sm">
      <div className="w-full max-w-[500px] bg-white rounded-[24px] shadow-apple overflow-hidden pb-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-apple-gray-50">
          <div className="text-[15px] font-semibold text-apple-gray-400">
            失能等級評估 ({currentStep + 1}/{QUESTIONS.length})
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-apple-gray-50 text-apple-gray-500 hover:bg-apple-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Question Area */}
        <div className="p-6 sm:p-8">
          <h3 className="text-[24px] sm:text-[28px] font-bold text-apple-gray-900 mb-8 tracking-tight">
            {currentQ.title}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(option.points)}
                className="w-full text-left p-4 sm:p-5 rounded-[16px] bg-apple-gray-50 hover:bg-apple-gray-100 border border-transparent hover:border-apple-gray-200 transition-all duration-200"
              >
                <div className="text-[17px] font-semibold text-apple-gray-900 mb-1">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-[14px] text-apple-gray-500 leading-relaxed">
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
