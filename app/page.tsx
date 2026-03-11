"use client";

import { useState } from "react";
import {
  calculateCareBudget,
  getCMSLevelName,
  getIncomeStatusName,
  getCareTypeName,
  type CMSLevel,
  type IncomeStatus,
  type CareType,
} from "@/lib/careLogic";

export default function Home() {
  // 狀態管理
  const [selectedCMS, setSelectedCMS] = useState<CMSLevel | null>(null);
  const [selectedIncome, setSelectedIncome] = useState<IncomeStatus | null>(null);
  const [selectedCare, setSelectedCare] = useState<CareType | null>(null);

  // 即時計算結果
  const result =
    selectedCMS && selectedIncome && selectedCare
      ? calculateCareBudget(selectedCMS, selectedIncome, selectedCare)
      : null;

  // 格式化金額
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 頂部標題 */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            長照 3.0 財務決策引擎
          </h1>
          <p className="text-slate-600 text-lg">
            快速試算您的政府補助與自付額
          </p>
        </div>

        {/* 選擇區塊容器 */}
        <div className="space-y-8">
          {/* 1. 失能等級選擇 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              1. 您的失能等級
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([1, 2, 3, 4, 5, 6, 7, 8] as CMSLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedCMS(level)}
                  className={`
                    p-6 rounded-xl border-2 transition-all duration-200
                    hover:scale-105 active:scale-95
                    ${
                      selectedCMS === level
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      第 {level} 級
                    </div>
                    <div className="text-xs text-slate-600">
                      {getCMSLevelName(level)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. 家庭收入身份選擇 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              2. 家庭收入身份
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["general", "mid-low", "low"] as IncomeStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedIncome(status)}
                  className={`
                    p-6 rounded-xl border-2 transition-all duration-200
                    hover:scale-105 active:scale-95
                    ${
                      selectedIncome === status
                        ? "border-emerald-500 bg-emerald-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-900 mb-1">
                      {getIncomeStatusName(status)}
                    </div>
                    <div className="text-xs text-slate-600">
                      {status === "general" && "多數家庭適用"}
                      {status === "mid-low" && "自付額約 5-7%"}
                      {status === "low" && "免自付額"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. 照顧方式選擇 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              3. 照顧方式
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                ["home-care", "day-care", "foreign-caregiver", "institution"] as CareType[]
              ).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCare(type)}
                  className={`
                    p-6 rounded-xl border-2 transition-all duration-200 text-left
                    hover:scale-105 active:scale-95
                    ${
                      selectedCare === type
                        ? "border-violet-500 bg-violet-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }
                  `}
                >
                  <div className="text-lg font-semibold text-slate-900 mb-1">
                    {getCareTypeName(type)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {type === "home-care" && "照顧服務員到府協助"}
                    {type === "day-care" && "白天到照顧中心"}
                    {type === "foreign-caregiver" && "24小時外籍看護（補助30%）"}
                    {type === "institution" && "全日型住宿機構"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 結果儀表板 */}
        {result && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg border border-slate-200 p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              試算結果
            </h2>

            {/* 主要金額顯示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* 政府補助 */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-8 border-2 border-emerald-200">
                <div className="text-sm text-emerald-700 font-medium mb-2">
                  政府每月幫你出
                </div>
                <div className="text-4xl font-mono font-bold text-emerald-900">
                  {formatMoney(result.totalSubsidyMonthly)}
                </div>
              </div>

              {/* 自付額 */}
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-8 border-2 border-rose-200">
                <div className="text-sm text-rose-700 font-medium mb-2">
                  您每月自付額
                </div>
                <div className="text-4xl font-mono font-bold text-rose-900">
                  {formatMoney(result.outOfPocketMonthly)}
                </div>
              </div>
            </div>

            {/* 詳細資訊 */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              {/* 交通接送 */}
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-700">交通接送服務</span>
                <span
                  className={`font-semibold ${
                    result.hasTransportation ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {result.hasTransportation ? "✓ 符合資格" : "✗ 不符合"}
                </span>
              </div>

              {/* 輔具額度 */}
              {result.assistiveDeviceQuota > 0 && (
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-700">輔具及無障礙改造</span>
                  <span className="font-semibold text-indigo-600">
                    {formatMoney(result.assistiveDeviceQuota)} / 3年
                  </span>
                </div>
              )}
            </div>

            {/* 重新試算按鈕 */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setSelectedCMS(null);
                  setSelectedIncome(null);
                  setSelectedCare(null);
                }}
                className="px-8 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                重新試算
              </button>
            </div>
          </div>
        )}

        {/* 提示訊息 */}
        {!result && (
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-lg">
              請選擇上方三個選項，開始試算
            </p>
          </div>
        )}

        {/* 免責聲明 */}
        <div className="mt-16 text-center text-xs text-slate-500">
          <p>
            本試算機基於 2026 年台灣長照 3.0 公開資料，僅供參考。
            <br />
            實際補助額度以各縣市政府核定為準。
          </p>
        </div>
      </div>
    </div>
  );
}
