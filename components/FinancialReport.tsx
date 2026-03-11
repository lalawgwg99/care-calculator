"use client";

import { useState } from "react";
import { type CareType, getCareTypeName } from "@/lib/careLogic";

interface FinancialReportProps {
  careType: CareType;
  monthlyGovSubsidy: number;
  monthlyOutOfPocket: number;
  shoppingCartTotal?: number;
}

export default function FinancialReport({ careType, monthlyGovSubsidy, monthlyOutOfPocket, shoppingCartTotal }: FinancialReportProps) {
  const [familyMembers, setFamilyMembers] = useState(1);
  
  const actualMonthlyPaid = shoppingCartTotal !== undefined ? shoppingCartTotal : monthlyOutOfPocket;
  const foreignCaregiverSalary = careType === "foreign-caregiver" ? 30000 : 0;
  const totalMonthlyBurden = actualMonthlyPaid + foreignCaregiverSalary;
  
  const months = 60;
  const total5YearPaid = totalMonthlyBurden * months;
  const total5YearGov = monthlyGovSubsidy * months;
  const perPersonMonthly = Math.round(totalMonthlyBurden / familyMembers);

  const formatCompactMoney = (amount: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-apple-gray-900 mb-3">
          長照是一場馬拉松
        </h2>
        <p className="text-[16px] sm:text-[18px] text-apple-gray-500">
          以平均 5 年的照顧期計算，這是您家庭未來的財務總覽。
        </p>
      </div>

      {/* Main Report Card */}
      <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden relative mb-6">
        <div className="h-2 bg-gradient-to-r from-apple-orange via-apple-pink to-apple-purple w-full"></div>
        
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-apple-gray-200/60">
            <div>
              <div className="text-[14px] text-apple-gray-500 font-medium mb-1 uppercase tracking-wider">選擇方案</div>
              <div className="text-[22px] font-bold text-apple-gray-900">{getCareTypeName(careType)}</div>
            </div>
            <div className="text-right">
              <div className="text-[14px] text-apple-gray-500 font-medium mb-1 uppercase tracking-wider">計算區間</div>
              <div className="text-[22px] font-bold text-apple-gray-900">5 年 (60期)</div>
            </div>
          </div>

          <div className="space-y-5 mb-8">
            <div className="flex items-center justify-between p-5 rounded-[20px] bg-apple-green/5 border border-apple-green/10">
              <div>
                <div className="text-[16px] font-semibold text-apple-green mb-1">政府 5 年總補助</div>
                <div className="text-[13px] text-apple-gray-500 hidden sm:block">包含照顧、接送、喘息額度</div>
              </div>
              <div className="text-[24px] sm:text-[28px] font-mono font-bold text-apple-green tracking-tight">
                {formatCompactMoney(total5YearGov)}
              </div>
            </div>
            <div className="flex items-center justify-between p-5 rounded-[20px] bg-apple-red/5 border border-apple-red/10">
              <div>
                <div className="text-[16px] font-semibold text-apple-red mb-1">家庭 5 年總支出</div>
                <div className="text-[13px] text-apple-gray-500 hidden sm:block">
                  自付額 {formatCompactMoney(actualMonthlyPaid)}/月
                  {careType === "foreign-caregiver" && ` + 看護薪資預估 ${formatCompactMoney(foreignCaregiverSalary)}/月`}
                </div>
              </div>
              <div className="text-[24px] sm:text-[28px] font-mono font-bold text-apple-red tracking-tight">
                {formatCompactMoney(total5YearPaid)}
              </div>
            </div>
          </div>

          {/* Family Cost Splitting */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[24px] p-6 border border-orange-100/50 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[24px]">👨‍👩‍👧‍👦</span>
              <div>
                <h4 className="text-[17px] font-bold text-apple-gray-900">家庭分攤計算</h4>
                <p className="text-[13px] text-amber-800/60">多人一起分攤，每個人的負擔就更輕。</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <span className="text-[15px] text-apple-gray-700 font-medium whitespace-nowrap">分攤人數</span>
              <div className="flex items-center gap-3 bg-white rounded-full px-3 py-1.5 shadow-sm border border-apple-gray-200/60">
                <button
                  onClick={() => setFamilyMembers(Math.max(1, familyMembers - 1))}
                  disabled={familyMembers <= 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[20px] font-medium text-apple-orange disabled:text-apple-gray-300 transition-colors"
                >−</button>
                <div className="w-8 text-center text-[20px] font-bold text-apple-gray-900 font-mono">{familyMembers}</div>
                <button
                  onClick={() => setFamilyMembers(familyMembers + 1)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[20px] font-medium text-apple-orange transition-colors"
                >+</button>
              </div>
              <span className="text-[14px] text-apple-gray-500">人</span>
            </div>

            <div className="bg-white rounded-[16px] p-5 border border-orange-100/30">
              <div className="flex items-center justify-between">
                <span className="text-[16px] text-apple-gray-700">每人每月只要</span>
                <span className="text-[28px] font-mono font-bold text-apple-orange tracking-tight">
                  {formatCompactMoney(perPersonMonthly)}
                </span>
              </div>
              {familyMembers > 1 && (
                <p className="text-[13px] text-apple-gray-500 mt-2 text-right">
                  {familyMembers} 人分攤 ÷ 原本 {formatCompactMoney(totalMonthlyBurden)}/月
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[16px] font-semibold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
              style={{ WebkitTapHighlightColor: "transparent" }}
              onClick={() => alert("功能建置中：圖片產生服務")}
            >
              📤 匯出圖卡至 LINE
            </button>
            <button
              className="w-full sm:w-auto px-8 py-3.5 bg-apple-gray-50 text-apple-gray-900 text-[16px] font-semibold rounded-full hover:bg-apple-gray-200 transition-colors border border-apple-gray-200/60"
              style={{ WebkitTapHighlightColor: "transparent" }}
              onClick={() => window.location.reload()}
            >
              🔄 重新評估
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

