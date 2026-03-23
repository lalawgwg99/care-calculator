"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { CMS_LEVELS } from "@/constants/careData";
import { calculateCareBudget, formatCurrency, type CareBudgetResult } from "@/lib/careCalculator";
import { IncomeStatus, CareType } from "@/constants/careData";
import { logError, getUserErrorMessage } from "@/lib/errors";

const CARE_TYPES: { value: CareType; label: string; description: string }[] = [
  {
    value: "home-care",
    label: "居家照顧",
    description: "在家接受照顧服務",
  },
  {
    value: "day-care",
    label: "日間照顧",
    description: "白天到照顧中心，晚上回家",
  },
  {
    value: "foreign-caregiver",
    label: "聘僱外籍看護工",
    description: "自行聘僱外籍看護（補助額度為 30%）",
  },
  {
    value: "institution",
    label: "住宿式機構",
    description: "全日型住宿長照機構",
  },
];

const INCOME_STATUSES: { value: IncomeStatus; label: string }[] = [
  { value: "general", label: "一般戶" },
  { value: "midLow", label: "中低收入戶" },
  { value: "low", label: "低收入戶" },
];

const COLORS = {
  subsidy: "#1F9D66", // 綠色：政府補助
  outOfPocket: "#C4493B", // 紅色：自付額
};

export default function CareCalculator() {
  const [selectedCmsLevel, setSelectedCmsLevel] = useState<number | null>(null);
  const [selectedIncomeStatus, setSelectedIncomeStatus] = useState<IncomeStatus>("general");
  const [selectedCareType, setSelectedCareType] = useState<CareType>("home-care");
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // 無障礙：焦點管理
  const resultRef = useRef<HTMLDivElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

  // 計算結果
  const result: CareBudgetResult | null = useMemo(() => {
    if (selectedCmsLevel === null) return null;
    
    try {
      setCalculationError(null);
      return calculateCareBudget(selectedCmsLevel, selectedIncomeStatus, selectedCareType);
    } catch (error) {
      const errorMessage = getUserErrorMessage(error);
      setCalculationError(errorMessage);
      logError(error as Error, {
        cmsLevel: selectedCmsLevel,
        incomeStatus: selectedIncomeStatus,
        careType: selectedCareType,
      });
      return null;
    }
  }, [selectedCmsLevel, selectedIncomeStatus, selectedCareType]);

  // 無障礙：當結果產生時，自動聚焦並報讀
  useEffect(() => {
    if (result && resultRef.current) {
      // 聚焦到結果區域
      resultRef.current.focus();
      
      // 更新螢幕閱讀器報讀內容
      if (announcementRef.current) {
        announcementRef.current.textContent = 
          `計算完成。政府每月補助 ${formatCurrency(result.totalSubsidyMonthly)}，您每月自付額 ${formatCurrency(result.outOfPocketMonthly)}`;
      }
    }
  }, [result]);

  // 無障礙：鍵盤導航處理
  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  // 圓餅圖資料
  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: "政府補助",
        value: result.totalSubsidyMonthly,
        fill: COLORS.subsidy,
      },
      {
        name: "自付額",
        value: result.outOfPocketMonthly,
        fill: COLORS.outOfPocket,
      },
    ].filter((item) => item.value > 0);
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* 螢幕閱讀器專用：動態報讀區域 */}
      <div
        ref={announcementRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            長照 3.0 財務決策引擎
          </h1>
          <p className="text-lg text-gray-600">
            快速了解您的政府補助與自付額
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側：輸入區塊 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* 失能等級選擇 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4" id="cms-level-label">
                1. 您的失能等級
              </h2>
              <div 
                className="grid grid-cols-2 gap-3"
                role="radiogroup"
                aria-labelledby="cms-level-label"
              >
                {CMS_LEVELS.map((level) => (
                  <motion.button
                    key={level.level}
                    role="radio"
                    aria-checked={selectedCmsLevel === level.level}
                    aria-label={`選擇失能等級第 ${level.level} 級：${level.name}`}
                    tabIndex={selectedCmsLevel === level.level ? 0 : -1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCmsLevel(level.level)}
                    onKeyDown={(e) => handleKeyDown(e, () => setSelectedCmsLevel(level.level))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCmsLevel === level.level
                        ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-300"
                        : "border-gray-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      第 {level.level} 級
                    </div>
                    <div className="text-sm text-gray-600">{level.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 照顧方式選擇 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4" id="care-type-label">
                2. 照顧方式
              </h2>
              <div 
                className="space-y-3"
                role="radiogroup"
                aria-labelledby="care-type-label"
              >
                {CARE_TYPES.map((type) => (
                  <motion.button
                    key={type.value}
                    role="radio"
                    aria-checked={selectedCareType === type.value}
                    aria-label={`選擇照顧方式：${type.label}，${type.description}`}
                    tabIndex={selectedCareType === type.value ? 0 : -1}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCareType(type.value)}
                    onKeyDown={(e) => handleKeyDown(e, () => setSelectedCareType(type.value))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedCareType === type.value
                        ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-300"
                        : "border-gray-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {type.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {type.description}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 收入身份選擇 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4" id="income-status-label">
                3. 家庭收入身份
              </h2>
              <div 
                className="grid grid-cols-3 gap-3"
                role="radiogroup"
                aria-labelledby="income-status-label"
              >
                {INCOME_STATUSES.map((status) => (
                  <motion.button
                    key={status.value}
                    role="radio"
                    aria-checked={selectedIncomeStatus === status.value}
                    aria-label={`選擇收入身份：${status.label}`}
                    tabIndex={selectedIncomeStatus === status.value ? 0 : -1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedIncomeStatus(status.value)}
                    onKeyDown={(e) => handleKeyDown(e, () => setSelectedIncomeStatus(status.value))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedIncomeStatus === status.value
                        ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-300"
                        : "border-gray-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 text-sm">
                      {status.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右側：結果展示區塊 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {calculationError ? (
              <div 
                className="bg-red-50 border-2 border-red-200 rounded-lg p-6"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">計算錯誤</h3>
                    <p className="text-sm text-red-700">{calculationError}</p>
                  </div>
                </div>
              </div>
            ) : result ? (
              <>
              <div
                ref={resultRef}
                tabIndex={-1}
                aria-label="計算結果"
                className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
              >
                {/* 圓餅圖 */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    每月補助與自付額
                  </h2>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(value as number)}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      此等級無補助
                    </div>
                  )}
                </div>

                {/* 金額明細卡片 */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 border-2 border-green-200"
                  >
                    <div className="text-sm text-green-700 font-semibold mb-1">
                      政府每月補助
                    </div>
                    <div className="text-3xl font-bold text-green-900">
                      {formatCurrency(result.totalSubsidyMonthly)}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg p-6 border-2 border-red-200"
                  >
                    <div className="text-sm text-red-700 font-semibold mb-1">
                      您每月自付額
                    </div>
                    <div className="text-3xl font-bold text-red-900">
                      {formatCurrency(result.outOfPocketMonthly)}
                    </div>
                  </motion.div>
                </div>

                {/* 詳細明細 */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    補助明細
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">照顧及專業服務</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(result.breakdown.careServiceSubsidy)}
                      </span>
                    </div>
                    {result.hasTransportation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">交通接送服務</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(result.breakdown.transportSubsidy)}
                        </span>
                      </div>
                    )}
                    {result.breakdown.respiteSubsidy > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">喘息服務（月攤）</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(result.breakdown.respiteSubsidy)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 輔具及無障礙改造額度 */}
                {result.assistiveDeviceQuota > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 rounded-lg shadow-lg p-6 border-2 border-blue-200"
                  >
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      💡 一次性額度
                    </h3>
                    <p className="text-blue-800">
                      您目前有{" "}
                      <span className="font-bold">
                        {formatCurrency(result.assistiveDeviceQuota)}
                      </span>
                      的輔具及無障礙改造額度，每 3 年可申請一次。
                    </p>
                  </motion.div>
                )}

                {/* 機構住宿補助資訊 */}
                {result.institutionInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 rounded-lg shadow-lg p-6 border-2 border-amber-200"
                  >
                    <h3 className="text-lg font-semibold text-amber-900 mb-3">
                      🏥 住宿式機構補助方案
                    </h3>
                    <div className="space-y-2 text-sm text-amber-800">
                      <div className="flex justify-between">
                        <span>政府年度補助</span>
                        <span className="font-semibold">
                          {formatCurrency(result.institutionInfo.yearlySubsidy)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>政府月度補助</span>
                        <span className="font-semibold">
                          {formatCurrency(result.institutionInfo.monthlySubsidy)}
                        </span>
                      </div>
                      <div className="border-t border-amber-300 pt-2 mt-2">
                        <p className="text-xs">
                          機構平均月費：{formatCurrency(result.institutionInfo.estimatedMonthlyFee.min)} ~{" "}
                          {formatCurrency(result.institutionInfo.estimatedMonthlyFee.max)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  請先選擇失能等級，開始試算
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* 免責聲明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gray-100 rounded-lg p-4 text-center text-xs text-gray-600"
        >
          <p>
            本試算機基於 2026 年台灣長照 3.0 公開資料，僅供參考。實際補助額度以各縣市政府核定為準。
          </p>
        </motion.div>
      </div>
    </div>
  );
}
