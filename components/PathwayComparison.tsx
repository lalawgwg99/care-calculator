"use client";

import { calculateCareBudget, type CMSLevel, type IncomeStatus, type CareType } from "@/lib/careLogic";
import { useState } from "react";

interface PathwayComparisonProps {
  cmsLevel: CMSLevel;
  incomeStatus: IncomeStatus;
  onSelectPathway: (type: CareType) => void;
}

export default function PathwayComparison({ cmsLevel, incomeStatus, onSelectPathway }: PathwayComparisonProps) {
  // Calculate for all three options
  const homeCareResult = calculateCareBudget(cmsLevel, incomeStatus, "home-care");
  const institutionResult = calculateCareBudget(cmsLevel, incomeStatus, "institution");
  const foreignResult = calculateCareBudget(cmsLevel, incomeStatus, "foreign-caregiver");

  // Formatting helper
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
    }).format(Math.round(amount));
  };

  const pathways = [
    {
      id: "home-care" as CareType,
      title: "🏠 居家與社區照顧",
      subtitle: "政府資源最大化",
      monthlySubsidy: homeCareResult.totalSubsidyMonthly,
      estimatedOutPocket: homeCareResult.outOfPocketMonthly,
      features: ["專員到府提供服務", "白天可送至日間照顧", "家屬需承擔部分夜間照顧"],
      primaryColor: "text-apple-green",
      bgGradient: "bg-gradient-to-br from-white to-apple-green/5",
    },
    {
      id: "institution" as CareType,
      title: "🏥 全日型住宿機構",
      subtitle: "家屬零體力負擔",
      monthlySubsidy: institutionResult.totalSubsidyMonthly,
      estimatedOutPocket: institutionResult.outOfPocketMonthly, // Usually ~40k
      features: ["24小時專業團隊接手", "最高年補貼 $120,000", "適合極重度失能長輩"],
      primaryColor: "text-apple-purple",
      bgGradient: "bg-gradient-to-br from-white to-apple-purple/5",
    },
    {
      id: "foreign-caregiver" as CareType,
      title: "🧑‍🤝‍🧑 聘僱外籍看護",
      subtitle: "一對一專屬陪伴",
      monthlySubsidy: foreignResult.totalSubsidyMonthly,
      estimatedOutPocket: foreignResult.outOfPocketMonthly + 30000, // 30k estimated salary + fees
      features: ["24小時在家一對一", "政府補助僅剩原本的 30%", "需等待至少 3 個月媒合"],
      primaryColor: "text-apple-orange",
      bgGradient: "bg-gradient-to-br from-white to-apple-orange/5",
    }
  ];

  return (
    <div className="w-full animation-fade-in">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-apple-gray-900 mb-3">
          這是一段不簡單的旅程，<br className="sm:hidden" />您打算選擇哪一條路？
        </h2>
        <p className="text-[16px] sm:text-[18px] text-apple-gray-500 max-w-2xl mx-auto">
          系統已根據您長輩的等級 (<strong className="text-apple-gray-800">CMS {cmsLevel}</strong>) 試算出三種主要照顧模式的財務差異。點擊卡片以深入規劃。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pathways.map((path) => (
          <button
            key={path.id}
            onClick={() => onSelectPathway(path.id)}
            className={`
              relative flex flex-col text-left rounded-[24px] shadow-apple-warm border border-apple-gray-100 overflow-hidden
              transition-all duration-300 transform hover:-translate-y-1 hover:shadow-apple-hover
              ${path.bgGradient}
            `}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div className="p-6 sm:p-8 flex-1">
              <h3 className="text-[20px] font-bold text-apple-gray-900 mb-1">{path.title}</h3>
              <p className={`text-[14px] font-medium mb-6 ${path.primaryColor}`}>{path.subtitle}</p>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-[13px] text-apple-gray-500 mb-1">政府每月補助額度上限</div>
                  <div className="text-[22px] font-mono font-bold text-apple-gray-900 tracking-tight">
                    {formatMoney(path.monthlySubsidy)}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-apple-gray-500 mb-1">預估家屬每月自掏腰包</div>
                  <div className="text-[26px] font-mono font-bold text-apple-red tracking-tight">
                    {formatMoney(path.estimatedOutPocket)}
                    {path.id === "foreign-caregiver" && <span className="text-[14px] text-apple-gray-400 font-normal ml-1">(含薪資)</span>}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-apple-gray-200/50">
                <ul className="space-y-3">
                  {path.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start text-[14px] text-apple-gray-600 leading-snug">
                      <span className="mr-2 opacity-60">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-white border-t border-apple-gray-100 text-center text-[15px] font-medium text-apple-blue group-hover:bg-apple-gray-50 transition-colors">
              選擇此方案 →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
