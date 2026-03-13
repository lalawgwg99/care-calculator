"use client";

import { useState } from "react";

interface InsuranceAddonProps {
  monthlyOutOfPocket: number;
  monthlyGovSubsidy: number;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export default function InsuranceAddon({
  monthlyOutOfPocket,
  monthlyGovSubsidy,
}: InsuranceAddonProps) {
  const [expanded, setExpanded] = useState(false);
  const [hasLtcInsurance, setHasLtcInsurance] = useState(false);
  const [ltcMonthly, setLtcMonthly] = useState(0);
  const [hasDisabilityInsurance, setHasDisabilityInsurance] = useState(false);
  const [disabilityLumpSum, setDisabilityLumpSum] = useState(0);
  const [hasMedicalInsurance, setHasMedicalInsurance] = useState(false);
  const [medicalDaily, setMedicalDaily] = useState(0);

  // 失能險一次性理賠攤到 60 個月
  const disabilityMonthly = disabilityLumpSum > 0 ? Math.round(disabilityLumpSum / 60) : 0;
  // 醫療險日額轉月額（住院式機構才適用，這裡簡化為 30 天）
  const medicalMonthly = medicalDaily * 30;

  const totalInsuranceMonthly = ltcMonthly + disabilityMonthly + medicalMonthly;
  const netGap = Math.max(0, monthlyOutOfPocket - totalInsuranceMonthly);

  const hasAnyInsurance = hasLtcInsurance || hasDisabilityInsurance || hasMedicalInsurance;

  // 瀑布圖資料
  const waterfallItems = [
    { label: "每月自付總額", amount: monthlyOutOfPocket, color: "text-apple-red", bg: "bg-apple-red" },
    ...(monthlyGovSubsidy > 0 ? [{ label: "政府補助抵扣", amount: -monthlyGovSubsidy, color: "text-apple-green", bg: "bg-apple-green" }] : []),
    ...(ltcMonthly > 0 ? [{ label: "長照險理賠", amount: -ltcMonthly, color: "text-blue-600", bg: "bg-blue-500" }] : []),
    ...(disabilityMonthly > 0 ? [{ label: "失能險（月攤）", amount: -disabilityMonthly, color: "text-purple-600", bg: "bg-purple-500" }] : []),
    ...(medicalMonthly > 0 ? [{ label: "醫療險日額", amount: -medicalMonthly, color: "text-teal-600", bg: "bg-teal-500" }] : []),
  ];

  return (
    <div className="bg-white rounded-[24px] border border-apple-gray-200/60 overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-[24px]">💼</span>
          <div className="text-left">
            <h4 className="text-[16px] font-bold text-apple-gray-900">有買商業保險嗎？</h4>
            <p className="text-[13px] text-apple-gray-500">算出保險能補多少、真正的缺口有多大</p>
          </div>
        </div>
        <span className={`text-apple-gray-400 text-[20px] transition-transform duration-300 ${expanded ? "rotate-45" : ""}`}>+</span>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 pb-6 space-y-4">

          {/* 長照險 */}
          <div className="bg-blue-50/60 rounded-[16px] p-4 border border-blue-100/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-semibold text-blue-900">長照險（每月理賠）</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHasLtcInsurance(false)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${!hasLtcInsurance ? "bg-apple-gray-200 text-apple-gray-700" : "bg-white text-apple-gray-500 border border-apple-gray-200"}`}
                >沒有</button>
                <button
                  onClick={() => setHasLtcInsurance(true)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${hasLtcInsurance ? "bg-blue-500 text-white" : "bg-white text-apple-gray-500 border border-apple-gray-200"}`}
                >有</button>
              </div>
            </div>
            {hasLtcInsurance && (
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-blue-800">每月理賠</span>
                <span className="text-apple-gray-500">NT$</span>
                <input
                  type="number"
                  value={ltcMonthly || ""}
                  onChange={(e) => setLtcMonthly(Math.max(0, Number(e.target.value)))}
                  step={5000}
                  min={0}
                  placeholder="例：20,000"
                  className="flex-1 bg-white border border-blue-200/60 rounded-[10px] px-3 py-2 text-[15px] font-mono font-bold text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300/30"
                />
              </div>
            )}
          </div>

          {/* 失能險 */}
          <div className="bg-purple-50/60 rounded-[16px] p-4 border border-purple-100/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-semibold text-purple-900">失能險（一次性理賠）</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHasDisabilityInsurance(false)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${!hasDisabilityInsurance ? "bg-apple-gray-200 text-apple-gray-700" : "bg-white text-apple-gray-500 border border-apple-gray-200"}`}
                >沒有</button>
                <button
                  onClick={() => setHasDisabilityInsurance(true)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${hasDisabilityInsurance ? "bg-purple-500 text-white" : "bg-white text-apple-gray-500 border border-apple-gray-200"}`}
                >有</button>
              </div>
            </div>
            {hasDisabilityInsurance && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-purple-800">一次性理賠</span>
                  <span className="text-apple-gray-500">NT$</span>
                  <input
                    type="number"
                    value={disabilityLumpSum || ""}
                    onChange={(e) => setDisabilityLumpSum(Math.max(0, Number(e.target.value)))}
                    step={100000}
                    min={0}
                    placeholder="例：1,000,000"
                    className="flex-1 bg-white border border-purple-200/60 rounded-[10px] px-3 py-2 text-[15px] font-mono font-bold text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300/30"
                  />
                </div>
                {disabilityLumpSum > 0 && (
                  <p className="text-[12px] text-purple-600/70 mt-2">
                    攤到 5 年 = 每月 {formatMoney(disabilityMonthly)}
                  </p>
                )}
              </>
            )}
          </div>

          {/* 醫療險 */}
          <div className="bg-teal-50/60 rounded-[16px] p-4 border border-teal-100/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-semibold text-teal-900">醫療險（住院日額）</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHasMedicalInsurance(false)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${!hasMedicalInsurance ? "bg-apple-gray-200 text-apple-gray-700" : "bg-white text-apple-gray-500 border border-apple-gray-200"}`}
                >沒有</button>
                <button
                  onClick={() => setHasMedicalInsurance(true)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${hasMedicalInsurance ? "bg-teal-500 text-white" : "bg-white text-apple-gray-500 border border-apple-gray-200"}`}
                >有</button>
              </div>
            </div>
            {hasMedicalInsurance && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-teal-800">每日給付</span>
                  <span className="text-apple-gray-500">NT$</span>
                  <input
                    type="number"
                    value={medicalDaily || ""}
                    onChange={(e) => setMedicalDaily(Math.max(0, Number(e.target.value)))}
                    step={500}
                    min={0}
                    placeholder="例：2,000"
                    className="flex-1 bg-white border border-teal-200/60 rounded-[10px] px-3 py-2 text-[15px] font-mono font-bold text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300/30"
                  />
                </div>
                <p className="text-[12px] text-teal-600/70 mt-2">
                  * 住院日額通常僅在住院期間理賠，此處以每月 30 天概估上限
                </p>
              </>
            )}
          </div>

          {/* 結果：瀑布圖 */}
          {hasAnyInsurance && totalInsuranceMonthly > 0 && (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-[20px] p-5 border border-slate-200/50">
              <h5 className="text-[15px] font-bold text-apple-gray-900 mb-4">每月費用抵扣瀑布</h5>

              <div className="space-y-2">
                {waterfallItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[14px]">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.bg}`} />
                      <span className="text-apple-gray-700">{item.label}</span>
                    </div>
                    <span className={`font-mono font-bold ${item.color}`}>
                      {item.amount > 0 ? "" : ""}{formatMoney(Math.abs(item.amount))}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-dashed border-slate-200">
                  <span className="text-[15px] font-bold text-apple-gray-900">真正的每月缺口</span>
                  <span className={`text-[22px] font-mono font-bold ${netGap > 0 ? "text-apple-orange" : "text-apple-green"}`}>
                    {formatMoney(netGap)}
                  </span>
                </div>
              </div>

              {netGap === 0 && (
                <div className="mt-3 bg-green-50 rounded-[12px] p-3 border border-green-100/50">
                  <p className="text-[13px] text-green-800 font-medium">
                    ✅ 恭喜！您的商業保險加上政府補助，已完全覆蓋每月照顧費用。
                  </p>
                </div>
              )}

              {netGap > 0 && (
                <div className="mt-3 bg-amber-50/60 rounded-[12px] p-3 border border-amber-100/50">
                  <p className="text-[13px] text-amber-800/80">
                    💡 每月仍有 {formatMoney(netGap)} 缺口需自費。
                    5 年共計 {formatMoney(netGap * 60)}。
                    可考慮從長輩積蓄或家人分攤來補足。
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 沒保險的建議 */}
          {!hasAnyInsurance && (
            <div className="bg-amber-50/60 rounded-[14px] p-4 border border-orange-100/30">
              <p className="text-[13px] text-amber-800/70 leading-relaxed">
                💡 <strong>沒有商業保險也沒關係。</strong>台灣的長照 2.0 補助已經相當完善。
                但如果長輩還在 65 歲以下，可考慮投保「長照險」或「失能險」，
                趁健康時保費較低，未來可有效降低家庭負擔。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
