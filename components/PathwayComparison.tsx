"use client";

import { useState } from "react";
import { calculateCareBudget, type CMSLevel, type IncomeStatus, type CareType } from "@/lib/careLogic";

interface PathwayComparisonProps {
  cmsLevel: CMSLevel;
  incomeStatus: IncomeStatus;
  onSelectPathway: (type: CareType) => void;
}

// 外籍看護真實月支出（含薪資、安定費、健保、加班、仲介）
const FOREIGN_CAREGIVER_EXTRA = 30000;

export default function PathwayComparison({ cmsLevel, incomeStatus, onSelectPathway }: PathwayComparisonProps) {
  const homeCareResult = calculateCareBudget(cmsLevel, incomeStatus, "home-care");
  const dayCareResult = calculateCareBudget(cmsLevel, incomeStatus, "day-care");
  const institutionResult = calculateCareBudget(cmsLevel, incomeStatus, "institution");
  const foreignResult = calculateCareBudget(cmsLevel, incomeStatus, "foreign-caregiver");

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
      title: "居家照顧",
      icon: "🏠",
      subtitle: "政府資源最大化",
      monthlySubsidy: homeCareResult.totalSubsidyMonthly,
      monthlyOutPocket: homeCareResult.outOfPocketMonthly,
      totalMonthly: homeCareResult.totalSubsidyMonthly + homeCareResult.outOfPocketMonthly,
      waitTime: "⏱ 約 2-4 週開始服務",
      features: [
        "專員到府提供洗澡、餵食等服務",
        "彈性安排服務時段",
        "家屬需承擔部分夜間照顧",
      ],
      cons: "需家屬配合夜間照顧",
      primaryColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      bgGradient: "bg-gradient-to-br from-white to-emerald-50/50",
      badgeBg: "bg-emerald-50 text-emerald-700",
    },
    {
      id: "day-care" as CareType,
      title: "日間照顧",
      icon: "🌤️",
      subtitle: "白天托顧、晚上回家",
      monthlySubsidy: dayCareResult.totalSubsidyMonthly,
      monthlyOutPocket: dayCareResult.outOfPocketMonthly,
      totalMonthly: dayCareResult.totalSubsidyMonthly + dayCareResult.outOfPocketMonthly,
      waitTime: "⏱ 約 2-4 週，視床位而定",
      features: [
        "白天到日照中心，享專業團體活動",
        "延緩失能退化效果佳",
        "家屬白天可正常上班",
      ],
      cons: "需每日接送，晚上仍需照顧",
      primaryColor: "text-sky-600",
      borderColor: "border-sky-200",
      bgGradient: "bg-gradient-to-br from-white to-sky-50/50",
      badgeBg: "bg-sky-50 text-sky-700",
    },
    {
      id: "institution" as CareType,
      title: "住宿式機構",
      icon: "🏥",
      subtitle: "24H 專業全照顧",
      monthlySubsidy: institutionResult.totalSubsidyMonthly,
      monthlyOutPocket: institutionResult.outOfPocketMonthly,
      totalMonthly: institutionResult.outOfPocketMonthly + institutionResult.totalSubsidyMonthly,
      waitTime: "⏱ 排隊等候，通常需 1-6 個月",
      features: [
        "24 小時專業護理團隊",
        cmsLevel >= 4 ? "每年最高補助 $120,000（已取消排富）" : "CMS 4 級以上才有年度補助",
        "適合重度以上失能長輩",
      ],
      cons: cmsLevel < 4 ? "⚠️ 目前等級未達補助門檻 (需 CMS 4+)" : "月費較高，但家屬零體力負擔",
      primaryColor: "text-violet-600",
      borderColor: "border-violet-200",
      bgGradient: "bg-gradient-to-br from-white to-violet-50/50",
      badgeBg: "bg-violet-50 text-violet-700",
    },
    {
      id: "foreign-caregiver" as CareType,
      title: "外籍看護",
      icon: "🧑‍🤝‍🧑",
      subtitle: "一對一專屬陪伴",
      monthlySubsidy: foreignResult.totalSubsidyMonthly,
      // 真實自付 = 長照自付 + 外看薪資等
      monthlyOutPocket: foreignResult.outOfPocketMonthly + FOREIGN_CAREGIVER_EXTRA,
      totalMonthly: foreignResult.outOfPocketMonthly + FOREIGN_CAREGIVER_EXTRA + foreignResult.totalSubsidyMonthly,
      waitTime: "⏱ 仲介媒合需 2-4 個月",
      features: [
        "24 小時在家一對一照顧",
        "政府補助僅原本的 30%",
        "需等待 2～4 個月媒合期",
      ],
      cons: "語言溝通障礙、需自行管理",
      primaryColor: "text-amber-600",
      borderColor: "border-amber-200",
      bgGradient: "bg-gradient-to-br from-white to-amber-50/50",
      badgeBg: "bg-amber-50 text-amber-700",
    },
  ];

  // 找出自付額最低的方案
  const lowestOutPocket = Math.min(...pathways.map(p => p.monthlyOutPocket));
  const lowestOutPocketId = pathways.find(p => p.monthlyOutPocket === lowestOutPocket)?.id;

  const getMatchScore = (type: CareType) => {
    let score = 55;
    if (type === "institution" && cmsLevel >= 6) score += 30;
    if (type === "day-care" && cmsLevel >= 4 && cmsLevel <= 6) score += 18;
    if (type === "home-care" && cmsLevel <= 3) score += 20;
    if (type === "foreign-caregiver" && cmsLevel >= 4) score += 10;
    if (incomeStatus === "low" && type === lowestOutPocketId) score += 25;
    if (incomeStatus === "mid-low" && type === "day-care") score += 10;
    if (type === "institution" && cmsLevel < 4) score -= 25;
    if (type === "foreign-caregiver" && incomeStatus === "low") score -= 10;
    return Math.max(35, Math.min(95, score));
  };

  // 根據 CMS 等級與收入身分給出決策推薦
  const getRecommendation = () => {
    if (incomeStatus === "low") {
      return {
        id: lowestOutPocketId ?? "home-care",
        reason: "低收入戶以自付最低為優先，確保長期可負擔。",
      };
    }
    if (cmsLevel >= 6) {
      return {
        id: "institution" as CareType,
        reason: "失能等級較高，優先考量 24 小時專業照護與安全。",
      };
    }
    if (cmsLevel >= 4) {
      return {
        id: "day-care" as CareType,
        reason: "中重度失能且仍需生活支援，日照可兼顧成本與白天照護。",
      };
    }
    return {
      id: "home-care" as CareType,
      reason: "失能程度較輕，居家服務彈性高、成本相對可控。",
    };
  };

  const recommendation = getRecommendation();
  const recommendedId = recommendation.id;
  const recommendedPath = pathways.find((p) => p.id === recommendedId) ?? pathways[0];
  const recommendedScore = getMatchScore(recommendedId);
  const [showAlternativeDetails, setShowAlternativeDetails] = useState(false);
  const otherPathways = pathways.filter((path) => path.id !== recommendedId);

  const renderPathCard = (path: (typeof pathways)[number], isRecommended: boolean) => (
    <button
      key={path.id}
      onClick={() => onSelectPathway(path.id)}
      aria-label={`選擇 ${path.title} 方案`}
      className={`
        relative flex flex-col text-left rounded-[24px] shadow-sm border overflow-hidden
        transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
        ${isRecommended ? `${path.borderColor} ring-2 ring-emerald-200 soft-glow` : `border-apple-gray-100`}
        ${path.bgGradient}
      `}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {isRecommended && (
        <div className="absolute top-3 right-3 text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-sm z-10">
          推薦方案
        </div>
      )}
      <div className="p-5 sm:p-6 flex-1">
        <div className="text-[28px] mb-2">{path.icon}</div>
        <h3 className="text-[18px] font-bold text-apple-gray-900 mb-1">{path.title}</h3>
        <p className={`text-[13px] font-medium mb-2 ${path.primaryColor}`}>{path.subtitle}</p>
        <span className="inline-block text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 mb-4">
          {path.waitTime}
        </span>
        <div className="space-y-3 mb-5">
          <div>
            <div className="text-[12px] text-apple-gray-500 mb-0.5">政府每月補助</div>
            <div className="text-[20px] font-mono font-bold text-emerald-600 tracking-tight">
              {formatMoney(path.monthlySubsidy)}
            </div>
          </div>
          <div>
            <div className="text-[12px] text-apple-gray-500 mb-0.5">家庭每月自付</div>
            <div className="text-[22px] font-mono font-bold text-apple-red tracking-tight">
              {formatMoney(path.monthlyOutPocket)}
              {path.id === "foreign-caregiver" && <span className="text-[12px] text-apple-gray-400 font-normal ml-1">(含薪資)</span>}
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-apple-gray-200/50">
          <ul className="space-y-2">
            {path.features.map((feat, idx) => (
              <li key={idx} className="flex items-start text-[13px] text-apple-gray-600 leading-snug">
                <span className="mr-1.5 opacity-60 flex-shrink-0">✓</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          {path.cons && (
            <p className={`mt-3 text-[12px] leading-snug ${
              path.cons.startsWith("⚠️") ? "text-orange-600 font-medium" : "text-apple-gray-400"
            }`}>
              {path.cons}
            </p>
          )}
        </div>
      </div>
      <div className="p-4 bg-white/80 border-t border-apple-gray-100 text-center text-[15px] font-medium text-apple-blue hover:bg-apple-gray-50 transition-colors">
        選擇此方案 →
      </div>
    </button>
  );

  // CMS 1 級：無補助資格
  if (cmsLevel === 1) {
    return (
      <div className="w-full animation-fade-in max-w-2xl mx-auto">
        <div className="bg-amber-50 rounded-[28px] p-8 sm:p-10 border border-amber-200/60 text-center">
          <div className="text-[48px] mb-4">🤗</div>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-apple-gray-900 mb-3">
            好消息！長輩目前狀況不錯
          </h2>
          <p className="text-[16px] text-amber-800/70 leading-relaxed mb-6 max-w-lg mx-auto">
            CMS 第 1 級屬於「輕度失能」，目前<strong>尚未達到長照補助的門檻</strong>（需 CMS 2 級以上）。
            但這代表長輩的身體功能還不錯，是延緩退化的好時機！
          </p>
          <div className="bg-white/80 rounded-[20px] p-6 border border-amber-100/50 text-left mb-6">
            <h4 className="text-[16px] font-bold text-apple-gray-900 mb-3">建議您現在可以做的事：</h4>
            <ul className="space-y-2.5">
              {[
                "帶長輩到社區的「巷弄長照站」參加免費活動，延緩失能",
                "評估居家環境安全（浴室防滑、走廊扶手等）",
                "鼓勵長輩每天走路、做簡單運動，維持肌力",
                "若狀況轉變，隨時可撥打 1966 重新申請評估",
              ].map((tip, i) => (
                <li key={i} className="flex items-start text-[14px] text-apple-gray-600 leading-snug">
                  <span className="text-amber-500 mr-2 mt-0.5 flex-shrink-0">●</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <a
            href="tel:1966"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3.5 rounded-full text-[16px] font-bold shadow-lg hover:bg-amber-700 transition-colors"
          >
            📞 撥打 1966 諮詢或重新評估
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animation-fade-in">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-apple-gray-900 mb-3">
          推薦優先，再展開比較
        </h2>
        <p className="text-[16px] sm:text-[18px] text-apple-gray-500 max-w-2xl mx-auto">
          已根據 <strong className="text-apple-gray-800">CMS {cmsLevel} 級</strong> 與收入身分先給建議，再讓你比較其他方案。
        </p>
      </div>

      {/* 決策推薦提示 */}
      <div className="bg-emerald-50 border border-emerald-200/70 rounded-[20px] p-5 sm:p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-[13px] text-emerald-700 font-semibold mb-1">決策推薦提示</div>
            <div className="text-[18px] font-bold text-apple-gray-900">
              {recommendedPath.icon} 建議優先考量「{recommendedPath.title}」
            </div>
            <p className="text-[13px] text-emerald-800/80 mt-1">
              {recommendation.reason}
            </p>
            <div className="mt-3">
              <div className="text-[12px] text-emerald-700 mb-1">適配指數（依失能等級與收入推估）</div>
              <div className="w-full max-w-xs h-2 rounded-full bg-emerald-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  style={{ width: `${recommendedScore}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-emerald-900">
            <div className="px-3 py-2 rounded-[14px] bg-white border border-emerald-100">
              政府補助：<strong>{formatMoney(recommendedPath.monthlySubsidy)}</strong>/月
            </div>
            <div className="px-3 py-2 rounded-[14px] bg-white border border-emerald-100">
              家庭自付：<strong>{formatMoney(recommendedPath.monthlyOutPocket)}</strong>/月
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => onSelectPathway(recommendedId)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-600 text-white text-[14px] font-semibold shadow-sm hover:bg-emerald-700 transition-colors"
          >
            採用推薦方案並繼續 →
          </button>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-[18px] font-bold text-apple-gray-900 mb-3">推薦方案詳情</h3>
        <div className="grid grid-cols-1">
          {renderPathCard(recommendedPath, true)}
        </div>
      </section>

      <section className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5 sm:p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-[16px] font-bold text-apple-gray-900">其他方案快速比較</h3>
          <button
            onClick={() => setShowAlternativeDetails((prev) => !prev)}
            className="text-[13px] font-semibold text-apple-blue hover:text-apple-indigo transition-colors"
          >
            {showAlternativeDetails ? "收合詳細比較" : "展開詳細比較"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {otherPathways.map((path) => {
            const monthlyDiff = path.monthlyOutPocket - recommendedPath.monthlyOutPocket;
            return (
              <button
                key={path.id}
                onClick={() => onSelectPathway(path.id)}
                className="rounded-[14px] border border-apple-gray-200 bg-apple-gray-50/70 px-4 py-4 text-left hover:border-apple-blue/40 hover:bg-white transition-colors"
              >
                <div className="text-[13px] text-apple-gray-500 mb-1">{path.icon} {path.title}</div>
                <div className="text-[18px] font-bold text-apple-gray-900">{formatMoney(path.monthlyOutPocket)}/月</div>
                <div className={`text-[12px] mt-1 ${monthlyDiff >= 0 ? "text-apple-red" : "text-emerald-700"}`}>
                  {monthlyDiff >= 0 ? `比推薦多 ${formatMoney(Math.abs(monthlyDiff))}/月` : `比推薦少 ${formatMoney(Math.abs(monthlyDiff))}/月`}
                </div>
              </button>
            );
          })}
        </div>
        {showAlternativeDetails && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {otherPathways.map((path) => renderPathCard(path, false))}
          </div>
        )}
      </section>

      {/* 5 年總費用速覽 */}
      <div className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5 sm:p-6 mb-8 shadow-sm">
        <h3 className="text-[15px] font-bold text-apple-gray-700 mb-4">5 年（60 個月）自付總費用速覽</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pathways.map((path) => {
            const total5Year = path.monthlyOutPocket * 60;
            const isRecommended = path.id === recommendedId;
            const isLowestOutPocket = path.id === lowestOutPocketId;
            return (
              <div key={path.id} className={`rounded-[16px] p-4 text-center border ${isRecommended ? "border-emerald-300 bg-emerald-50/50" : "border-apple-gray-100 bg-apple-gray-50/50"}`}>
                <div className="text-[20px] mb-1">{path.icon}</div>
                <div className="text-[13px] font-medium text-apple-gray-600 mb-1">{path.title}</div>
                <div className={`text-[18px] sm:text-[20px] font-mono font-bold ${isRecommended ? "text-emerald-700" : "text-apple-gray-900"}`}>
                  {formatMoney(total5Year)}
                </div>
                <div className="mt-2 flex items-center justify-center gap-1">
                  {isRecommended && (
                    <span className="text-[11px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      推薦
                    </span>
                  )}
                  {isLowestOutPocket && (
                    <span className="text-[11px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                      最省
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 提示 */}
      <div className="mt-6 text-center text-[13px] text-apple-gray-400">
        * 外籍看護自付含薪資、就業安定費、健保費等實際支出約 ${FOREIGN_CAREGIVER_EXTRA.toLocaleString()}/月
        {cmsLevel < 4 && "　* 住宿式機構補助需 CMS 4 級以上"}
      </div>
    </div>
  );
}
