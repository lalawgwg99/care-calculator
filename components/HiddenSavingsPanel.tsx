"use client";

import { useState, useMemo } from "react";
import {
  calculateHiddenSavings,
  SUPPORTED_CITIES,
  TAX_BRACKET_OPTIONS,
  DISABILITY_LEVEL_OPTIONS,
  type DisabilityLevel,
  type TaxBracket,
  type HiddenSavingsInput,
} from "@/lib/hiddenSavingsCalculator";

interface HiddenSavingsPanelProps {
  /** 是否符合長照資格（CMS 2+） */
  hasLongTermCareQualification: boolean;
  /** 每月長照支出（自付額），用於計算淨現金流 */
  monthlyOutOfPocket: number;
  /** 每月政府補助 */
  monthlyGovSubsidy: number;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export default function HiddenSavingsPanel({
  hasLongTermCareQualification,
  monthlyOutOfPocket,
  monthlyGovSubsidy,
}: HiddenSavingsPanelProps) {
  // ====== 使用者輸入狀態 ======
  const [age, setAge] = useState(75);
  const [isIndigenous, setIsIndigenous] = useState(false);
  const [city, setCity] = useState("台北市");
  const [disabilityLevel, setDisabilityLevel] = useState<DisabilityLevel>("none");
  const [isStillInsuredByLabor, setIsStillInsuredByLabor] = useState(false);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [taxBracket, setTaxBracket] = useState<TaxBracket>(0.12);
  const [isClaiming, setIsClaiming] = useState(true);

  // ====== 展開/收合狀態 ======
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // ====== 計算 ======
  const input: HiddenSavingsInput = useMemo(() => ({
    elderly: {
      age,
      isIndigenous,
      city,
      disabilityLevel,
      hasLongTermCareQualification,
      isStillInsuredByLabor,
      hasVehicleUnder2400cc: hasVehicle,
    },
    taxPayer: {
      taxBracket,
      isClaiming,
    },
  }), [age, isIndigenous, city, disabilityLevel, hasLongTermCareQualification, isStillInsuredByLabor, hasVehicle, taxBracket, isClaiming]);

  const savings = useMemo(() => calculateHiddenSavings(input), [input]);

  // ====== 淨現金流計算 ======
  const yearlyExpense = monthlyOutOfPocket * 12;
  const yearlySubsidy = monthlyGovSubsidy * 12;
  const netYearlyCost = yearlyExpense - savings.totalYearlySavings;
  const netMonthlyCost = Math.round(netYearlyCost / 12);

  // ====== 四大類數據 ======
  const categories = [
    {
      icon: "🏥",
      title: "健保費減免",
      yearlyAmount: savings.nhiTotalYearly,
      color: "emerald",
      details: (
        <div className="space-y-3">
          {savings.nhiAgeSavingsMonthly > 0 && (
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-emerald-800">年齡減免（{city}地方政府補助）</span>
              <span className="font-mono font-bold text-emerald-700">{formatMoney(savings.nhiAgeSavingsMonthly)}/月</span>
            </div>
          )}
          {savings.nhiDisabilitySavingsMonthly > 0 && (
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-emerald-800">身障減免（中央政府補助）</span>
              <span className="font-mono font-bold text-emerald-700">{formatMoney(savings.nhiDisabilitySavingsMonthly)}/月</span>
            </div>
          )}
          {savings.nhiTotalYearly > 0 ? (
            <p className="text-[12px] text-emerald-600/70 pt-2 border-t border-emerald-100">
              年齡減免與身障減免取較高者計算，每年可省 {formatMoney(savings.nhiTotalYearly)}
            </p>
          ) : (
            <p className="text-[13px] text-apple-gray-500">目前長輩條件不符合健保減免資格</p>
          )}
        </div>
      ),
    },
    {
      icon: "💼",
      title: "勞保/國保減免",
      yearlyAmount: savings.laborInsuranceTotalYearly,
      color: "blue",
      details: (
        <div className="space-y-3">
          {savings.laborInsuranceSavingsMonthly > 0 && (
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-blue-800">國民年金保費減免</span>
              <span className="font-mono font-bold text-blue-700">{formatMoney(savings.laborInsuranceSavingsMonthly)}/月</span>
            </div>
          )}
          {savings.laborDisabilityBenefitAlert && (
            <div className="bg-red-50 rounded-[12px] p-3 border border-red-200/50">
              <p className="text-[13px] text-red-800 font-medium">
                ⚠️ 長輩發生失能當下仍在勞保加保期間！請務必評估申請「勞保失能給付」（一次金或年金），
                這可能是一筆數十萬元的隱藏現金。
              </p>
            </div>
          )}
          {savings.laborInsuranceTotalYearly === 0 && !savings.laborDisabilityBenefitAlert && (
            <p className="text-[13px] text-apple-gray-500">長輩無身障證明，不適用保費減免</p>
          )}
        </div>
      ),
    },
    {
      icon: "📊",
      title: "報稅扣除額（最強！）",
      yearlyAmount: savings.taxActualSaving,
      color: "orange",
      details: (
        <div className="space-y-3">
          {savings.taxDependentExemption > 0 && (
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-orange-800">
                扶養親屬免稅額{age >= 70 ? "（70歲以上加碼）" : ""}
              </span>
              <span className="font-mono font-bold text-orange-700">{formatMoney(savings.taxDependentExemption)}</span>
            </div>
          )}
          {savings.taxDisabilityDeduction > 0 && (
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-orange-800">身心障礙特別扣除額</span>
              <span className="font-mono font-bold text-orange-700">{formatMoney(savings.taxDisabilityDeduction)}</span>
            </div>
          )}
          {savings.taxLongTermCareDeduction > 0 && (
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-orange-800">長期照顧特別扣除額</span>
              <span className="font-mono font-bold text-orange-700">{formatMoney(savings.taxLongTermCareDeduction)}</span>
            </div>
          )}
          {savings.taxTotalDeduction > 0 && (
            <>
              <div className="flex items-center justify-between pt-3 border-t border-orange-200/60 text-[15px] font-bold">
                <span className="text-orange-900">扣除總額</span>
                <span className="font-mono text-orange-800">{formatMoney(savings.taxTotalDeduction)}</span>
              </div>
              <div className="bg-orange-50 rounded-[12px] p-3 border border-orange-200/50">
                <p className="text-[13px] text-orange-800">
                  以您的稅率 {Math.round(taxBracket * 100)}% 計算，明年 5 月報稅可實際拿回{" "}
                  <strong className="text-apple-orange">{formatMoney(savings.taxActualSaving)}</strong>
                </p>
              </div>
            </>
          )}
          {savings.taxTotalDeduction === 0 && (
            <p className="text-[13px] text-apple-gray-500">請勾選「列報扶養」以計算稅務減免</p>
          )}
        </div>
      ),
    },
    {
      icon: "🚗",
      title: "日常生活減免",
      yearlyAmount:
        savings.vehicleTaxSavingsYearly +
        savings.seniorCardMonthly * 12 +
        Math.round(savings.assistiveDeviceQuota / 3),
      color: "violet",
      details: (
        <div className="space-y-2.5">
          {savings.vehicleTaxSavingsYearly > 0 && (
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-violet-800">汽車牌照稅免徵（2400cc 以下）</span>
              <span className="font-mono font-bold text-violet-700">{formatMoney(savings.vehicleTaxSavingsYearly)}/年</span>
            </div>
          )}
          {savings.seniorCardMonthly > 0 && (
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-violet-800">敬老卡/愛心卡（{city}）</span>
              <span className="font-mono font-bold text-violet-700">{formatMoney(savings.seniorCardMonthly)}/月</span>
            </div>
          )}
          {savings.parkingBenefit && (
            <div className="flex items-center gap-2 text-[13px] text-violet-700">
              <span>✓</span>
              <span>身障停車位識別證（公有停車場前幾小時免費或半價）</span>
            </div>
          )}
          {savings.assistiveDeviceQuota > 0 && (
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-violet-800">輔具及無障礙修繕</span>
              <span className="font-mono font-bold text-violet-700">{formatMoney(savings.assistiveDeviceQuota)}/3年</span>
            </div>
          )}
          {savings.vehicleTaxSavingsYearly === 0 && savings.seniorCardMonthly === 0 && !savings.parkingBenefit && savings.assistiveDeviceQuota === 0 && (
            <p className="text-[13px] text-apple-gray-500">目前長輩條件不符合日常減免資格</p>
          )}
        </div>
      ),
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    emerald: { bg: "bg-emerald-50/60", border: "border-emerald-200/50", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" },
    blue: { bg: "bg-blue-50/60", border: "border-blue-200/50", text: "text-blue-700", badge: "bg-blue-100 text-blue-800" },
    orange: { bg: "bg-orange-50/60", border: "border-orange-200/50", text: "text-orange-700", badge: "bg-orange-100 text-orange-800" },
    violet: { bg: "bg-violet-50/60", border: "border-violet-200/50", text: "text-violet-700", badge: "bg-violet-100 text-violet-800" },
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-[32px] border border-emerald-200/50 overflow-hidden shadow-sm">
      {/* ====== HEADER ====== */}
      <div className="p-7 sm:p-9">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[28px]">💎</span>
          <h3 className="text-[22px] sm:text-[26px] font-bold text-apple-gray-900 tracking-tight">
            隱形省下的錢
          </h3>
        </div>
        <p className="text-[15px] text-emerald-800/60 mb-6">
          除了長照補助，您的家庭可能還有這些「看不見的省錢」正在等您領取。
        </p>

        {/* ====== 總金額預覽 ====== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[24px] p-6 border border-emerald-100/50 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[13px] text-apple-gray-500 mb-1">每年可省下</div>
              <div className="text-[32px] sm:text-[38px] font-mono font-bold text-apple-green tracking-tight">
                {formatMoney(savings.totalYearlySavings)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] text-apple-gray-500 mb-1">相當於每月</div>
              <div className="text-[22px] font-mono font-bold text-apple-green">
                {formatMoney(savings.totalMonthlySavings)}
              </div>
            </div>
          </div>

          {/* 淨現金流 */}
          {monthlyOutOfPocket > 0 && (
            <div className="pt-4 border-t border-emerald-100/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] text-apple-gray-600">每月長照自付額</span>
                <span className="font-mono text-[15px] text-apple-red">{formatMoney(monthlyOutOfPocket)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] text-apple-gray-600">每月隱形省下</span>
                <span className="font-mono text-[15px] text-apple-green">-{formatMoney(savings.totalMonthlySavings)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-emerald-100/60">
                <span className="text-[16px] font-semibold text-apple-gray-900">每月實際淨支出</span>
                <span className="text-[24px] font-mono font-bold text-apple-orange">
                  {formatMoney(Math.max(0, netMonthlyCost))}
                </span>
              </div>
              <p className="text-[12px] text-emerald-700/60 mt-2 text-right">
                原本月付 {formatMoney(monthlyOutOfPocket)}，扣除各項減免後降至 {formatMoney(Math.max(0, netMonthlyCost))}
              </p>
            </div>
          )}
        </div>

        {/* ====== 快速設定表單 ====== */}
        <div className="bg-white/70 rounded-[20px] border border-emerald-100/50 overflow-hidden mb-6">
          <button
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="w-full flex items-center justify-between p-5"
          >
            <div className="flex items-center gap-2">
              <span className="text-[18px]">⚙️</span>
              <span className="text-[15px] font-bold text-apple-gray-900">設定長輩與稅務資料</span>
              <span className="text-[12px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                {age}歲 · {city} · 稅率{Math.round(taxBracket * 100)}%
              </span>
            </div>
            <span className={`text-apple-gray-400 text-[16px] transition-transform duration-300 ${isFormExpanded ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isFormExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="px-5 pb-5 space-y-5">
              {/* 第一列：年齡 + 縣市 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-apple-gray-700 mb-2">長輩年齡</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Math.max(0, Math.min(120, Number(e.target.value))))}
                    className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[12px] px-4 py-2.5 text-[16px] font-mono font-bold text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-apple-gray-700 mb-2">設籍縣市</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[12px] px-4 py-2.5 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                  >
                    {SUPPORTED_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 第二列：身障等級 + 稅率 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-apple-gray-700 mb-2">身心障礙等級</label>
                  <select
                    value={disabilityLevel}
                    onChange={(e) => setDisabilityLevel(e.target.value as DisabilityLevel)}
                    className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[12px] px-4 py-2.5 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                  >
                    {DISABILITY_LEVEL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-apple-gray-700 mb-2">子女適用稅率</label>
                  <select
                    value={taxBracket}
                    onChange={(e) => setTaxBracket(Number(e.target.value) as TaxBracket)}
                    className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[12px] px-4 py-2.5 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                  >
                    {TAX_BRACKET_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}（{opt.description}）
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 第三列：勾選項 */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isIndigenous}
                    onChange={(e) => setIsIndigenous(e.target.checked)}
                    className="w-5 h-5 rounded border-apple-gray-300 text-emerald-500 focus:ring-emerald-300/50"
                  />
                  <span className="text-[14px] text-apple-gray-700">長輩為原住民（健保減免門檻降至 55 歲）</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isClaiming}
                    onChange={(e) => setIsClaiming(e.target.checked)}
                    className="w-5 h-5 rounded border-apple-gray-300 text-emerald-500 focus:ring-emerald-300/50"
                  />
                  <span className="text-[14px] text-apple-gray-700">子女有列報扶養長輩</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isStillInsuredByLabor}
                    onChange={(e) => setIsStillInsuredByLabor(e.target.checked)}
                    className="w-5 h-5 rounded border-apple-gray-300 text-emerald-500 focus:ring-emerald-300/50"
                  />
                  <span className="text-[14px] text-apple-gray-700">長輩失能時仍在勞保加保期間</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasVehicle}
                    onChange={(e) => setHasVehicle(e.target.checked)}
                    className="w-5 h-5 rounded border-apple-gray-300 text-emerald-500 focus:ring-emerald-300/50"
                  />
                  <span className="text-[14px] text-apple-gray-700">同戶有 2400cc 以下汽車（可免牌照稅）</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ====== 四大類明細 ====== */}
        <div className="space-y-3">
          {categories.map((cat, idx) => {
            const colors = colorMap[cat.color];
            const isOpen = expandedSection === idx;
            return (
              <div key={idx} className={`rounded-[20px] ${colors.bg} border ${colors.border} overflow-hidden`}>
                <button
                  onClick={() => setExpandedSection(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[22px]">{cat.icon}</span>
                    <span className="text-[15px] font-bold text-apple-gray-900">{cat.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {cat.yearlyAmount > 0 && (
                      <span className={`text-[14px] font-mono font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
                        {formatMoney(cat.yearlyAmount)}/年
                      </span>
                    )}
                    <span className={`text-apple-gray-400 text-[14px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-5 pb-5">
                    {cat.details}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ====== 提醒文字 ====== */}
        <div className="mt-6 bg-white/60 rounded-[16px] p-4 border border-emerald-100/50">
          <p className="text-[12px] text-emerald-700/60 leading-relaxed">
            * 以上數字為依據 2025-2026 年法規估算，實際金額以各主管機關核定為準。
            稅務扣除額以最新年度標準計算，實際節稅金額視個人綜合所得稅申報情形而定。
            各縣市敬老卡額度可能因政策調整而異動。
          </p>
        </div>
      </div>
    </div>
  );
}
