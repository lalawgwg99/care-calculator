"use client";

import { calculateCareBudget, type CMSLevel, type IncomeStatus, type CareType } from "@/lib/careLogic";

interface PathwayComparisonProps {
  cmsLevel: CMSLevel;
  incomeStatus: IncomeStatus;
  onSelectPathway: (type: CareType) => void;
}

// 外籍看護真實月支出（含薪資、安定費、健保、加班、仲介）
// 與 FinancialReport.tsx 中的 FOREIGN_CAREGIVER_REAL_COSTS 明細加總一致
// 27470 + 2000 + 826 + 1200 + 800 = 32296
const FOREIGN_REAL_MONTHLY = 32296;

// 機構平均月費範圍
const INSTITUTION_FEE = { min: 35000, max: 45000 };

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
      // 真實自付 = max(長照自付, 外看真實總成本)，與 FinancialReport 計算方式一致
      monthlyOutPocket: Math.max(foreignResult.outOfPocketMonthly, FOREIGN_REAL_MONTHLY),
      totalMonthly: foreignResult.totalSubsidyMonthly + Math.max(foreignResult.outOfPocketMonthly, FOREIGN_REAL_MONTHLY),
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

  // 找出自付額最低的方案作為推薦
  const lowestOutPocket = Math.min(...pathways.map(p => p.monthlyOutPocket));
  const recommendedId = pathways.find(p => p.monthlyOutPocket === lowestOutPocket)?.id;

  // CMS 1 級：無補助資格
  if (cmsLevel === 1) {
    return (
      <div className="w-full animation-fade-in max-w-2xl mx-auto">
        <div className="bg-amber-50 rounded-[28px] p-8 sm:p-10 border border-amber-200/60 text-center">
          <div className="text-[48px] mb-4">📋</div>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-apple-gray-900 mb-3">
            CMS 第 1 級：尚未達補助門檻
          </h2>
          <p className="text-[16px] text-amber-800/70 leading-relaxed mb-6 max-w-lg mx-auto">
            CMS 第 1 級屬「輕度失能」，目前<strong>尚未達到長照補助門檻</strong>（需 CMS 2 級以上）。
            現在是延緩失能、提前做好準備的重要時機。
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
          4 條路，一次看清楚
        </h2>
        <p className="text-[16px] sm:text-[18px] text-apple-gray-500 max-w-2xl mx-auto">
          系統已根據 <strong className="text-apple-gray-800">CMS {cmsLevel} 級</strong> 試算出四種照顧模式的財務差異。
        </p>
      </div>

      {/* 5 年總費用速覽 */}
      <div className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5 sm:p-6 mb-8 shadow-sm">
        <h3 className="text-[15px] font-bold text-apple-gray-700 mb-4">📊 5 年（60 個月）自付總費用速覽</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pathways.map((path) => {
            const total5Year = path.monthlyOutPocket * 60;
            const isRecommended = path.id === recommendedId;
            return (
              <div key={path.id} className={`rounded-[16px] p-4 text-center border ${isRecommended ? "border-emerald-300 bg-emerald-50/50" : "border-apple-gray-100 bg-apple-gray-50/50"}`}>
                <div className="text-[20px] mb-1">{path.icon}</div>
                <div className="text-[13px] font-medium text-apple-gray-600 mb-1">{path.title}</div>
                <div className={`text-[18px] sm:text-[20px] font-mono font-bold ${isRecommended ? "text-emerald-700" : "text-apple-gray-900"}`}>
                  {formatMoney(total5Year)}
                </div>
                {isRecommended && (
                  <span className="inline-block mt-2 text-[11px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    最省方案
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 方案卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {pathways.map((path) => {
          const isRecommended = path.id === recommendedId;
          return (
            <button
              key={path.id}
              onClick={() => onSelectPathway(path.id)}
              className={`
                relative flex flex-col text-left rounded-[24px] shadow-sm border overflow-hidden
                transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
                ${isRecommended ? `${path.borderColor} ring-2 ring-emerald-200` : `border-apple-gray-100`}
                ${path.bgGradient}
              `}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {/* 推薦標籤 */}
              {isRecommended && (
                <div className="absolute top-3 right-3 text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-sm z-10">
                  CP 值最高
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
        })}
      </div>

      {/* 提示 */}
      <div className="mt-6 text-center text-[13px] text-apple-gray-400">
        * 外籍看護自付含薪資、就業安定費、健保費等實際支出約 ${FOREIGN_REAL_MONTHLY.toLocaleString()}/月
        {cmsLevel < 4 && "　* 住宿式機構補助需 CMS 4 級以上"}
      </div>
    </div>
  );
}
