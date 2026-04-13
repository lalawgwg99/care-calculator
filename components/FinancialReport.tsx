"use client";

import { useState } from "react";
import { type CareType, getCareTypeName } from "@/lib/careLogic";
import { type ConditionId, CONDITION_PROFILES, getAdditionalMonthlyCost } from "@/lib/conditionProfiles";
import CareTimeline from "@/components/CareTimeline";
import FacilityChecklist from "@/components/FacilityChecklist";
import HiddenSavingsPanel from "@/components/HiddenSavingsPanel";
import InsuranceAddon from "@/components/InsuranceAddon";
import LegalNavigator from "@/components/LegalNavigator";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

const SITE_URL = "https://care-calculator.vercel.app";

interface FinancialReportProps {
  careType: CareType;
  monthlyGovSubsidy: number;
  monthlyOutOfPocket: number;
  shoppingCartTotal?: number;
  assistiveDeviceQuota?: number;
  selectedConditions?: ConditionId[];
  cmsLevel?: number;
}

// True cost breakdown for foreign caregiver (real-world numbers from labor ministry)
const FOREIGN_CAREGIVER_REAL_COSTS = [
  { label: "基本薪資（2026 基本工資）", amount: 27470 },
  { label: "就業安定費（雇主負擔）", amount: 2000 },
  { label: "健保費（雇主自付）", amount: 826 },
  { label: "假日加班費估算（每週 2 小時）", amount: 1200 },
  { label: "仲介費月攤+機票費月攤", amount: 800 },
];
const FOREIGN_REAL_MONTHLY = FOREIGN_CAREGIVER_REAL_COSTS.reduce((s, i) => s + i.amount, 0);

// 住宿式機構實際費用明細
const INSTITUTION_REAL_COSTS = [
  { label: "機構基本月費（含住宿、三餐）", amount: 28000 },
  { label: "護理照顧費", amount: 8000 },
  { label: "日常耗材（尿布、護墊等）", amount: 4000 },
  { label: "其他雜費（洗衣、理髮、代購）", amount: 2000 },
];
const INSTITUTION_REAL_MONTHLY = INSTITUTION_REAL_COSTS.reduce((s, i) => s + i.amount, 0);

function formatMoney(amount: number) {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export default function FinancialReport({
  careType,
  monthlyGovSubsidy,
  monthlyOutOfPocket,
  shoppingCartTotal,
  assistiveDeviceQuota = 0,
  selectedConditions = [],
  cmsLevel,
}: FinancialReportProps) {
  const [familyMembers, setFamilyMembers] = useState(1);
  const [elderlyAssets, setElderlyAssets] = useState(0);
  const [showOpportunityCost, setShowOpportunityCost] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(45000);
  const [showForeignBreakdown, setShowForeignBreakdown] = useState(false);
  const [showInstitutionBreakdown, setShowInstitutionBreakdown] = useState(false);

  const isForeignCaregiver = careType === "foreign-caregiver";
  const isInstitution = careType === "institution";

  // Use real total cost for foreign caregiver
  const actualMonthlyPaid =
    shoppingCartTotal !== undefined ? shoppingCartTotal : monthlyOutOfPocket;
  const foreignExtraMonthly = isForeignCaregiver
    ? Math.max(0, FOREIGN_REAL_MONTHLY - actualMonthlyPaid)
    : 0;
  const totalMonthlyBurden = actualMonthlyPaid + foreignExtraMonthly;

  const months = 60;
  const total5YearPaid = totalMonthlyBurden * months;
  const total5YearGov = monthlyGovSubsidy * months;

  // Elderly assets deduction
  const elderlyAssetsCover = Math.min(elderlyAssets, total5YearPaid);
  const familyNet5Year = Math.max(0, total5YearPaid - elderlyAssetsCover);
  const monthsFromAssets = totalMonthlyBurden > 0 ? Math.floor(elderlyAssets / totalMonthlyBurden) : 0;

  // Per-person after elderly assets cover
  const perPersonMonthly = familyMembers > 0
    ? Math.round(familyNet5Year / months / familyMembers)
    : totalMonthlyBurden;

  // Opportunity cost (quit job)
  const quitJobLoss5Year = monthlyIncome * months;
  const savingFromNotQuitting = quitJobLoss5Year - total5YearPaid;
  const extraConditionMonthlyCost = getAdditionalMonthlyCost(selectedConditions);
  const adjustedMonthlyBurden = totalMonthlyBurden + extraConditionMonthlyCost;
  const adjustedPerPersonMonthly = Math.max(
    0,
    familyMembers > 0
      ? Math.round((adjustedMonthlyBurden * months - elderlyAssetsCover) / months / familyMembers)
      : adjustedMonthlyBurden
  );
  const burdenRatio = monthlyIncome > 0 ? adjustedPerPersonMonthly / monthlyIncome : 0;
  const burdenLevel = burdenRatio <= 0.2
    ? { label: "負擔可控", style: "bg-emerald-100 text-emerald-700", note: "以目前設定，家庭分攤壓力在可控區間。" }
    : burdenRatio <= 0.35
    ? { label: "負擔偏高", style: "bg-amber-100 text-amber-800", note: "建議調整服務組合，優先降低固定月支出。" }
    : { label: "負擔高壓", style: "bg-red-100 text-apple-red", note: "建議重新配置方案或提高分攤人數，避免長期財務風險。" };

  const actionItems = [
    "先用目前方案執行 1 個月，核對實際帳單與試算差異。",
    familyMembers > 1
      ? `與家人確認每人每月分攤 ${formatMoney(Math.max(0, adjustedPerPersonMonthly))} 是否可行。`
      : "建議增加家庭分攤者，降低單一照顧者長期壓力。",
    extraConditionMonthlyCost > 0
      ? `已含疾病相關額外支出 ${formatMoney(extraConditionMonthlyCost)}/月，建議納入家庭固定預算。`
      : "若後續出現新疾病照顧需求，請即時回來更新估算。",
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-apple-gray-900 to-apple-gray-700 rounded-[26px] p-6 sm:p-7 text-white border border-apple-gray-600/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <div className="text-[12px] tracking-wider uppercase text-white/70">結論先看</div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight">
              {getCareTypeName(careType)} 財務決策摘要
            </h2>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${burdenLevel.style}`}>
            {burdenLevel.label}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-[14px] bg-white/10 border border-white/15 p-4">
            <div className="text-[12px] text-white/70 mb-1">家庭每月總支出</div>
            <div className="text-[21px] font-mono font-bold">{formatMoney(adjustedMonthlyBurden)}</div>
          </div>
          <div className="rounded-[14px] bg-white/10 border border-white/15 p-4">
            <div className="text-[12px] text-white/70 mb-1">每人月分攤（含疾病）</div>
            <div className="text-[21px] font-mono font-bold">{formatMoney(Math.max(0, adjustedPerPersonMonthly))}</div>
          </div>
          <div className="rounded-[14px] bg-white/10 border border-white/15 p-4">
            <div className="text-[12px] text-white/70 mb-1">5 年家庭總支出</div>
            <div className="text-[21px] font-mono font-bold">{formatMoney(total5YearPaid + extraConditionMonthlyCost * months)}</div>
          </div>
        </div>
        <p className="text-[13px] text-white/80 mb-3">{burdenLevel.note}</p>
        <div className="space-y-1.5">
          {actionItems.map((item) => (
            <p key={item} className="text-[13px] text-white/85">
              • {item}
            </p>
          ))}
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-apple-gray-900 mb-3">
          長照是一場馬拉松
        </h2>
        <p className="text-[16px] sm:text-[18px] text-apple-gray-500">
          以平均 5 年的照顧期計算，這是您家庭未來的財務總覽。
        </p>
      </div>

      {/* ====== MAIN REPORT CARD ====== */}
      <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-apple-orange via-apple-pink to-apple-purple w-full" />
        <div className="p-7 sm:p-9">
          <div className="flex items-center justify-between mb-7 pb-7 border-b border-apple-gray-200/60">
            <div>
              <div className="text-[13px] text-apple-gray-500 font-medium mb-1 uppercase tracking-wider">選擇方案</div>
              <div className="text-[21px] font-bold text-apple-gray-900">{getCareTypeName(careType)}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] text-apple-gray-500 font-medium mb-1 uppercase tracking-wider">計算區間</div>
              <div className="text-[21px] font-bold text-apple-gray-900">5 年 (60期)</div>
            </div>
          </div>

          <div className="space-y-4 mb-7">
            <div className="flex items-center justify-between p-5 rounded-[20px] bg-apple-green/5 border border-apple-green/10">
              <div>
                <div className="text-[16px] font-semibold text-apple-green mb-1">政府 5 年總補助</div>
                <div className="text-[13px] text-apple-gray-500">包含照顧、接送、喘息額度</div>
              </div>
              <div className="text-[24px] sm:text-[28px] font-mono font-bold text-apple-green">
                {formatMoney(total5YearGov)}
              </div>
            </div>
            <div className="flex items-center justify-between p-5 rounded-[20px] bg-apple-red/5 border border-apple-red/10">
              <div>
                <div className="text-[16px] font-semibold text-apple-red mb-1">家庭 5 年總支出</div>
                <div className="text-[13px] text-apple-gray-500">
                  月自付 {formatMoney(totalMonthlyBurden)}
                  {isForeignCaregiver && "（含外看真實成本）"}
                </div>
              </div>
              <div className="text-[24px] sm:text-[28px] font-mono font-bold text-apple-red">
                {formatMoney(total5YearPaid)}
              </div>
            </div>
          </div>

          {/* Foreign caregiver real cost breakdown */}
          {isForeignCaregiver && (
            <div className="bg-blue-50/60 rounded-[20px] p-5 border border-blue-100/50 mb-7">
              <button
                onClick={() => setShowForeignBreakdown(!showForeignBreakdown)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[18px]">🧾</span>
                  <span className="text-[15px] font-bold text-blue-900">外籍看護　真實月支出明細</span>
                </div>
                <span className={`text-blue-500 text-[18px] transition-transform duration-300 ${showForeignBreakdown ? "rotate-45" : ""}`}>+</span>
              </button>
              {showForeignBreakdown && (
                <div className="mt-4 space-y-2">
                  {FOREIGN_CAREGIVER_REAL_COSTS.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[14px]">
                      <span className="text-blue-800">{item.label}</span>
                      <span className="font-mono font-bold text-blue-900">{formatMoney(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-blue-200/60 text-[16px] font-bold">
                    <span className="text-blue-900">合計真實月支出</span>
                    <span className="font-mono text-blue-700">{formatMoney(FOREIGN_REAL_MONTHLY)}</span>
                  </div>
                  <p className="text-[12px] text-blue-600/60 mt-1">
                    * 帳面月薪看似 $27,470，實際家庭每月需支出約 <strong>${FOREIGN_REAL_MONTHLY.toLocaleString()}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Institution real cost breakdown */}
          {isInstitution && (
            <div className="space-y-4 mb-7">
              <div className="bg-violet-50/60 rounded-[20px] p-5 border border-violet-100/50">
                <button
                  onClick={() => setShowInstitutionBreakdown(!showInstitutionBreakdown)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[18px]">🏥</span>
                    <span className="text-[15px] font-bold text-violet-900">住宿式機構　每月費用明細</span>
                  </div>
                  <span className={`text-violet-500 text-[18px] transition-transform duration-300 ${showInstitutionBreakdown ? "rotate-45" : ""}`}>+</span>
                </button>
                {showInstitutionBreakdown && (
                  <div className="mt-4 space-y-2">
                    {INSTITUTION_REAL_COSTS.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[14px]">
                        <span className="text-violet-800">{item.label}</span>
                        <span className="font-mono font-bold text-violet-900">{formatMoney(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-violet-200/60 text-[16px] font-bold">
                      <span className="text-violet-900">機構每月總費用</span>
                      <span className="font-mono text-violet-700">{formatMoney(INSTITUTION_REAL_MONTHLY)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[14px] text-emerald-700 font-medium">
                      <span>政府每月補助</span>
                      <span className="font-mono">-{formatMoney(monthlyGovSubsidy)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[16px] font-bold pt-2 border-t border-violet-200/40">
                      <span className="text-apple-red">家庭每月實付</span>
                      <span className="font-mono text-apple-red">{formatMoney(Math.max(0, INSTITUTION_REAL_MONTHLY - monthlyGovSubsidy))}</span>
                    </div>
                    <p className="text-[12px] text-violet-600/60 mt-1">
                      * 費用因機構等級、地區而異，以上為全國平均估算
                    </p>
                  </div>
                )}
              </div>

              {/* 180 天入住門檻提醒 */}
              <div className="bg-amber-50/80 rounded-[20px] p-5 border border-amber-200/50">
                <div className="flex items-start gap-3">
                  <span className="text-[22px] flex-shrink-0">📅</span>
                  <div>
                    <h4 className="text-[15px] font-bold text-amber-900 mb-1.5">180 天入住門檻提醒</h4>
                    <p className="text-[13px] text-amber-800/80 leading-relaxed mb-2">
                      住宿式機構補助需<strong>當年度累計入住滿 180 天</strong>才能領取全額 $120,000 年度補助。
                      未滿 180 天則按月計算（每住滿半個月曆天 = 補助 $10,000）。
                    </p>
                    <div className="bg-white/60 rounded-[12px] p-3 border border-amber-100/50">
                      <p className="text-[12px] text-amber-700/70">
                        💡 <strong>建議：</strong>若預計入住，盡量在年初辦理以確保當年度達 180 天門檻。
                        年中入住者，第一年補助可能較少，但次年起即可領全額。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====== DISEASE-SPECIFIC COSTS ====== */}
      {selectedConditions.length > 0 && (
        <div className="bg-white rounded-[24px] border border-apple-gray-200/60 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[24px]">🩺</span>
            <div>
              <h4 className="text-[16px] font-bold text-apple-gray-900">疾病相關額外支出</h4>
              <p className="text-[13px] text-apple-gray-500">
                依您選擇的健康狀況，可能產生的額外費用
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {selectedConditions.map((condId) => {
              const profile = CONDITION_PROFILES[condId];
              if (!profile || profile.additionalCosts.length === 0) return null;
              return (
                <div key={condId} className="bg-apple-gray-50/80 rounded-[16px] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[16px]">{profile.icon}</span>
                    <span className="text-[14px] font-bold text-apple-gray-800">{profile.name}</span>
                  </div>
                  <div className="space-y-1.5">
                    {profile.additionalCosts.map((cost, i) => (
                      <div key={i} className="flex items-center justify-between text-[13px]">
                        <div>
                          <span className="text-apple-gray-700">{cost.label}</span>
                          <span className="text-apple-gray-400 ml-1.5 text-[11px]">{cost.note}</span>
                        </div>
                        <span className="font-mono font-semibold text-apple-gray-800 whitespace-nowrap ml-2">
                          {formatMoney(cost.monthlyEstimate)}/月
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {getAdditionalMonthlyCost(selectedConditions) > 0 && (
            <div className="mt-4 flex items-center justify-between p-4 rounded-[14px] bg-amber-50/60 border border-amber-200/30">
              <span className="text-[14px] font-semibold text-amber-900">疾病額外月支出估算</span>
              <span className="text-[20px] font-mono font-bold text-apple-orange">
                +{formatMoney(getAdditionalMonthlyCost(selectedConditions))}/月
              </span>
            </div>
          )}

          <p className="text-[12px] text-apple-gray-400 mt-3">
            * 以上為概估，實際費用因個案差異很大。此金額未計入前方的 5 年總支出中，僅供參考。
          </p>
        </div>
      )}

      {/* ====== DISEASE COMMUNICATION TIPS ====== */}
      {selectedConditions.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/30 rounded-[24px] p-6 border border-purple-100/40">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[24px]">💬</span>
            <h4 className="text-[16px] font-bold text-apple-gray-900">跟長輩溝通的小提醒</h4>
          </div>
          <div className="space-y-3">
            {selectedConditions.map((condId) => {
              const profile = CONDITION_PROFILES[condId];
              if (!profile || profile.communicationTips.length === 0) return null;
              return (
                <div key={condId}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[14px]">{profile.icon}</span>
                    <span className="text-[13px] font-semibold text-purple-800">{profile.name}</span>
                  </div>
                  <div className="space-y-1.5 ml-5">
                    {profile.communicationTips.map((tip, i) => (
                      <p key={i} className="text-[13px] text-purple-700/80 leading-relaxed">
                        <span className="text-purple-400 mr-1.5">•</span>{tip}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====== CARE TIMELINE (照顧時間軸) ====== */}
      {selectedConditions.length > 0 && (
        <CareTimeline selectedConditions={selectedConditions} currentCmsLevel={cmsLevel} />
      )}

      {/* ====== FACILITY CHECKLIST (機構檢核表) ====== */}
      {isInstitution && (
        <FacilityChecklist selectedConditions={selectedConditions} />
      )}

      {/* ====== ELDERLY ASSETS + FAMILY SPLIT ====== */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[28px] p-7 sm:p-8 border border-orange-100/50">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[26px]">👨‍👩‍👧‍👦</span>
          <div>
            <h4 className="text-[18px] font-bold text-apple-gray-900">家庭財務規劃</h4>
            <p className="text-[13px] text-amber-800/60">先用長輩的積蓄，不足再由子女平分。</p>
          </div>
        </div>

        {/* Elderly assets input */}
        <div className="bg-white/70 rounded-[18px] p-5 border border-orange-100/30 mb-5">
          <label className="block text-[14px] font-semibold text-apple-gray-700 mb-3">
            💰 長輩可動用的積蓄／退休金／保險
          </label>
          <div className="flex items-center gap-3">
            <span className="text-[16px] text-apple-gray-500 whitespace-nowrap">NT$</span>
            <input
              type="number"
              value={elderlyAssets}
              onChange={(e) => setElderlyAssets(Math.max(0, Number(e.target.value)))}
              step={50000}
              min={0}
              className="flex-1 bg-apple-gray-50 border border-apple-gray-200/60 rounded-[12px] px-4 py-2.5 text-[17px] font-mono font-bold text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-orange/30"
              placeholder="0"
            />
          </div>
          {elderlyAssets > 0 && (
            <p className="text-[13px] text-amber-700 mt-3">
              ✅ 長輩的積蓄可支撐 <strong>{monthsFromAssets} 個月</strong>的費用
              {monthsFromAssets >= 60
                ? "，5 年內子女無需分攤！"
                : `，第 ${monthsFromAssets + 1} 個月後才需子女接手。`}
            </p>
          )}
        </div>

        {/* Siblings split */}
        <div className="bg-white/70 rounded-[18px] p-5 border border-orange-100/30">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[14px] font-semibold text-apple-gray-700 whitespace-nowrap">子女分攤人數</span>
            <div className="flex items-center gap-3 bg-white rounded-full px-3 py-1.5 shadow-sm border border-apple-gray-200/60">
              <button onClick={() => setFamilyMembers(Math.max(1, familyMembers - 1))} disabled={familyMembers <= 1}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[20px] text-apple-orange disabled:text-apple-gray-300">−</button>
              <div className="w-8 text-center text-[20px] font-bold text-apple-gray-900 font-mono">{familyMembers}</div>
              <button onClick={() => setFamilyMembers(familyMembers + 1)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[20px] text-apple-orange">+</button>
            </div>
            <span className="text-[14px] text-apple-gray-500">人</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-apple-gray-700">每人每月只要</span>
            <span className="text-[30px] font-mono font-bold text-apple-orange tracking-tight">
              {formatMoney(perPersonMonthly)}
            </span>
          </div>
          {(familyMembers > 1 || elderlyAssets > 0) && (
            <p className="text-[12px] text-apple-gray-500 mt-2 text-right">
              子女 5 年共需負擔 {formatMoney(familyNet5Year)}
              {elderlyAssets > 0 && `（長輩已支付 ${formatMoney(elderlyAssetsCover)}）`}
              {familyMembers > 1 && ` ÷ ${familyMembers} 人`}
            </p>
          )}
        </div>
      </div>

      {/* ====== HIDDEN SAVINGS PANEL (隱形省下的錢) ====== */}
      <HiddenSavingsPanel
        hasLongTermCareQualification={true}
        monthlyOutOfPocket={totalMonthlyBurden}
        monthlyGovSubsidy={monthlyGovSubsidy}
      />

      {/* ====== INSURANCE ADDON (商業保險外掛) ====== */}
      <InsuranceAddon
        monthlyOutOfPocket={totalMonthlyBurden}
        monthlyGovSubsidy={monthlyGovSubsidy}
      />

      {/* ====== LEGAL NAVIGATOR (法律文件導航) ====== */}
      <LegalNavigator elderlyAssets={elderlyAssets} />

      {/* ====== OPPORTUNITY COST WARNING ====== */}
      <div className="bg-white rounded-[24px] border border-apple-gray-200/60 overflow-hidden shadow-sm">
        <button
          onClick={() => setShowOpportunityCost(!showOpportunityCost)}
          className="w-full flex items-center justify-between p-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-[24px]">⚠️</span>
            <div className="text-left">
              <h4 className="text-[16px] font-bold text-apple-gray-900">考慮辭職自己照顧？</h4>
              <p className="text-[13px] text-apple-gray-500">先看看你可能沒算到的隱形代價</p>
            </div>
          </div>
          <span className={`text-apple-gray-400 text-[20px] transition-transform duration-300 ${showOpportunityCost ? "rotate-45" : ""}`}>+</span>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${showOpportunityCost ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-6 pb-6 space-y-4">
            <div className="bg-apple-gray-50 rounded-[16px] p-4">
              <label className="block text-[13px] font-semibold text-apple-gray-700 mb-2">您目前的月薪（辭職後的機會成本）</label>
              <div className="flex items-center gap-2">
                <span className="text-apple-gray-500">NT$</span>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                  step={5000}
                  min={0}
                  className="flex-1 bg-white border border-apple-gray-200/60 rounded-[10px] px-3 py-2 text-[16px] font-mono font-bold text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-orange/30"
                />
                <span className="text-apple-gray-500">/月</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-red-50/60 rounded-[14px]">
                <span className="text-[14px] text-apple-red font-medium">辭職 5 年薪水損失</span>
                <span className="text-[18px] font-mono font-bold text-apple-red">{formatMoney(quitJobLoss5Year)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-apple-gray-50 rounded-[14px]">
                <span className="text-[14px] text-apple-gray-700 font-medium">若善用長照服務，5 年總支出</span>
                <span className="text-[18px] font-mono font-bold text-apple-gray-900">{formatMoney(total5YearPaid)}</span>
              </div>
            </div>

            {savingFromNotQuitting > 0 && (
              <div className="bg-green-50 rounded-[16px] p-5 border border-green-100/50">
                <p className="text-[15px] font-bold text-green-800 mb-1">
                  不辭職，繼續上班 + 善用長照 2.0，5 年可多留住
                </p>
                <p className="text-[32px] font-mono font-bold text-apple-green">{formatMoney(savingFromNotQuitting)}</p>
                <p className="text-[13px] text-green-700/70 mt-2">
                  （薪水損失 − 長照自付費用 = 您真正可以保住的財富）
                </p>
              </div>
            )}

            <div className="bg-amber-50/60 rounded-[14px] p-4 border border-orange-100/30">
              <p className="text-[13px] text-amber-800/70 leading-relaxed">
                💡 <strong>另外別忘了：</strong>辭職會中斷勞保年資，影響您未來的老年年金，
                以及不孝的標籤還沒算…善用政府長照資源，才是對全家最好的選擇。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====== NEXT STEPS ====== */}
      <div id="next-steps" className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100/60 rounded-[24px] p-6 sm:p-7 mb-4">
        <h3 className="text-[17px] font-bold text-emerald-800 mb-4">✅ 算完了，接下來怎麼做？</h3>
        <div className="space-y-3">
          {[
            {
              step: "1",
              title: "撥打長照專線",
              desc: "告知長輩狀況，預約照管專員到府評估",
              cta: "📞 1966（免費）",
              href: "tel:1966",
            },
            {
              step: "2",
              title: "準備文件",
              desc: "身分證、診斷書或出院病摘、健保卡",
              cta: null,
              href: null,
            },
            {
              step: "3",
              title: "等待到府評估",
              desc: "約 1-2 週完成評估，再 1-3 週開始服務",
              cta: null,
              href: null,
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[13px] font-bold flex-shrink-0 flex items-center justify-center mt-0.5">
                {item.step}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-apple-gray-900">{item.title}</div>
                <div className="text-[13px] text-apple-gray-500 mt-0.5">{item.desc}</div>
              </div>
              {item.href && item.cta && (
                <a
                  href={item.href}
                  className="flex-shrink-0 text-[14px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors px-4 py-1.5 rounded-full"
                >
                  {item.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ====== ACTIONS ====== */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {/* LINE 分享 */}
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(
            `我用長照計算機試算了「${getCareTypeName(careType)}」的費用：\n政府每月補助 ${formatMoney(monthlyGovSubsidy)}，家庭自付約 ${formatMoney(totalMonthlyBurden)}/月\n5 年政府共補助 ${formatMoney(total5YearGov)} 🎉\n\n幫你也試算看看 👉 ${SITE_URL}\n長照專線 1966 免費諮詢`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#06C755] text-white text-[16px] font-semibold rounded-full shadow-lg shadow-green-200/50 hover:shadow-xl hover:bg-[#05b34c] transition-all"
          onClick={() => window.gtag?.('event', 'report_shared', { method: 'line', care_type: careType })}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.365 9.89c.50 0 .906.406.906.906s-.406.907-.906.907H17.78v1.047h1.585c.5 0 .906.406.906.907s-.406.906-.906.906H16.875a.906.906 0 0 1-.906-.906V9.89c0-.5.406-.906.906-.906h2.49zm-5.023 0c.5 0 .906.406.906.906v3.767a.906.906 0 0 1-1.812 0V9.89c0-.5.406-.906.906-.906zm-2.1 0c.5 0 .906.406.906.906v2.338l-1.835-2.867a.906.906 0 0 0-.78-.44.906.906 0 0 0-.906.906v3.767a.906.906 0 0 0 1.812 0v-2.328l1.835 2.867c.164.25.44.4.734.4h.027a.906.906 0 0 0 .906-.906V9.89a.906.906 0 0 0-.7-.882zm-4.53.906v3.767a.906.906 0 0 1-.905.906H5.22a.906.906 0 0 1 0-1.812h1.582V9.89a.906.906 0 0 1 1.812 0zM12 2C6.477 2 2 6.145 2 11.25c0 4.57 3.67 8.385 8.647 9.107.336.072.793.22.909.506.104.26.068.668.033.93l-.147.882c-.045.26-.207 1.02.894.556 1.1-.463 5.938-3.497 8.1-5.99C21.683 15.294 22 13.323 22 11.25 22 6.145 17.523 2 12 2z"/>
          </svg>
          LINE 分享給家人
        </a>

        {/* 複製 / 原生分享 */}
        <button
          className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[16px] font-semibold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
          onClick={() => {
            const summary = [
              `📋 長照財務試算摘要`,
              `方案：${getCareTypeName(careType)}`,
              ``,
              `💰 每月費用`,
              `  政府補助：${formatMoney(monthlyGovSubsidy)}/月`,
              `  家庭自付：${formatMoney(totalMonthlyBurden)}/月`,
              familyMembers > 1 ? `  每人分攤：${formatMoney(perPersonMonthly)}/月（${familyMembers} 人）` : '',
              ``,
              `📊 5 年總覽`,
              `  政府總補助：${formatMoney(total5YearGov)}`,
              `  家庭總支出：${formatMoney(total5YearPaid)}`,
              elderlyAssets > 0 ? `  長輩積蓄可撐：${monthsFromAssets} 個月` : '',
              ``,
              `🔗 試算工具：${SITE_URL}`,
              `📞 長照專線 1966（免費）`,
            ].filter(Boolean).join('\n');

            window.gtag?.('event', 'report_shared', { method: 'share' in navigator ? 'native' : 'clipboard', care_type: careType });

            if (navigator.share) {
              navigator.share({ title: '長照財務試算', text: summary, url: SITE_URL }).catch(() => {});
            } else {
              navigator.clipboard.writeText(summary).then(() => {
                const btn = document.activeElement as HTMLButtonElement;
                const original = btn?.textContent;
                if (btn) {
                  btn.textContent = '✅ 已複製到剪貼簿！';
                  setTimeout(() => { btn.textContent = original; }, 2000);
                }
              });
            }
          }}
        >
          📤 複製摘要
        </button>

        <button
          className="w-full sm:w-auto px-7 py-3.5 bg-apple-gray-50 text-apple-gray-900 text-[16px] font-semibold rounded-full hover:bg-apple-gray-200 transition-colors border border-apple-gray-200/60"
          onClick={() => window.location.reload()}
        >
          🔄 重新評估
        </button>
      </div>
    </div>
  );
}
