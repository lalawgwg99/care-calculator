"use client";

import { useEffect, useState } from "react";
import type { CMSLevel, IncomeStatus, CareType } from "@/lib/careLogic";
import Icon, { type IconName } from "./Icon";

// 一次一題的快速試算：3 個白話問題，不秀 CMS 術語。
// 完成後把 careType / cmsLevel / incomeStatus 交給父層，沿用既有試算流程。

interface Option<T> {
  value: T;
  title: string;
  desc: string;
  icon?: IconName;
}

const CARE_OPTIONS: Option<CareType>[] = [
  { value: "home-care", title: "在自己家", desc: "照服員到家裡幫忙", icon: "home" },
  { value: "day-care", title: "白天去日照中心", desc: "白天在中心活動，晚上回家", icon: "users" },
  { value: "foreign-caregiver", title: "請外籍看護", desc: "住在家裡，全天照顧", icon: "heart" },
  { value: "institution", title: "住機構", desc: "護理之家、安養中心", icon: "hospital" },
];

const CMS_OPTIONS: Option<CMSLevel>[] = [
  { value: 2, title: "自己走、自己洗澡吃飯都沒問題", desc: "輕度失能" },
  { value: 4, title: "走路要人扶，洗澡穿衣要幫忙", desc: "中度失能" },
  { value: 6, title: "大多躺床，要人餵飯、翻身", desc: "重度失能" },
  { value: 8, title: "長期臥床，認不得人", desc: "極重度失能" },
];

const INCOME_OPTIONS: Option<IncomeStatus>[] = [
  { value: "general", title: "一般家庭", desc: "沒有中低收、低收證明" },
  { value: "mid-low", title: "中低收入戶", desc: "有縣市政府核定的證明" },
  { value: "low", title: "低收入戶", desc: "有縣市政府核定的證明" },
];

const QUESTIONS = ["長輩現在主要在哪裡接受照顧？", "長輩的生活自理狀況比較像哪一種？", "家裡的收入狀況是？"];

export default function QuickWizard({
  onComplete,
  onOpenEstimator,
  estimatorResult,
  onEstimatorConsumed,
}: {
  onComplete: (careType: CareType, cmsLevel: CMSLevel, incomeStatus: IncomeStatus) => void;
  onOpenEstimator: () => void;
  estimatorResult: CMSLevel | null;
  onEstimatorConsumed: () => void;
}) {
  const [step, setStep] = useState(0);
  const [careType, setCareType] = useState<CareType | null>(null);
  const [cms, setCms] = useState<CMSLevel | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  // 從 30 秒評估回來：直接跳到第 3 題
  useEffect(() => {
    if (estimatorResult && step === 1) {
      setCms(estimatorResult);
      onEstimatorConsumed();
      setStep(2);
    }
  }, [estimatorResult, step, onEstimatorConsumed]);

  const pick = (value: CareType | CMSLevel | IncomeStatus) => {
    setFlash(String(value));
    window.setTimeout(() => {
      setFlash(null);
      if (step === 0) {
        setCareType(value as CareType);
        setStep(1);
      } else if (step === 1) {
        setCms(value as CMSLevel);
        setStep(2);
      } else {
        const income = value as IncomeStatus;
        window.gtag?.("event", "quick_wizard_complete", {
          care_type: careType,
          cms_level: cms,
          income_status: income,
        });
        onComplete(careType!, cms!, income);
      }
    }, 220);
  };

  const options =
    step === 0 ? CARE_OPTIONS : step === 1 ? CMS_OPTIONS : INCOME_OPTIONS;

  return (
    <div>
      {/* 進度 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-apple-gray-500">
          第 {step + 1} / 3 題
        </span>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="text-[13px] font-medium text-apple-gray-500 hover:text-apple-gray-900 transition-colors"
          >
            ← 上一題
          </button>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-apple-gray-100 overflow-hidden mb-6">
        <div
          className="h-full rounded-full bg-gradient-to-r from-apple-orange to-apple-pink transition-all duration-300"
          style={{ width: `${((step + 1) / 3) * 100}%` }}
        />
      </div>

      <h3 className="text-[20px] sm:text-[22px] font-bold text-apple-gray-900 tracking-tight mb-5">
        {QUESTIONS[step]}
      </h3>

      <div className="space-y-3">
        {options.map((opt) => {
          const active = flash === String(opt.value);
          return (
            <button
              key={String(opt.value)}
              onClick={() => pick(opt.value)}
              className={`w-full flex items-center gap-4 p-5 rounded-[18px] text-left border-2 transition-all duration-200 active:scale-[0.99] ${
                active
                  ? "border-apple-orange bg-apple-orange/10 shadow-md"
                  : "border-apple-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {opt.icon && (
                <span className={`shrink-0 ${active ? "text-apple-orange" : "text-amber-600"}`}>
                  <Icon name={opt.icon} size={28} />
                </span>
              )}
              <span>
                <span className="block text-[16px] font-semibold text-apple-gray-900">
                  {opt.title}
                </span>
                <span className="block text-[13px] text-apple-gray-500 mt-0.5">
                  {opt.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {step === 1 && (
        <div className="mt-5 text-center">
          <button
            onClick={onOpenEstimator}
            className="text-[14px] font-medium text-apple-orange hover:underline underline-offset-4"
          >
            不確定？30 秒幫你快速評估 →
          </button>
          <p className="text-[12px] text-apple-gray-400 mt-2">
            這是粗估，實際等級以照管中心評估為準。
          </p>
        </div>
      )}
    </div>
  );
}
