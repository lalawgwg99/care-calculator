"use client";

import { useState } from "react";
import { type CMSLevel, type IncomeStatus, type CareType, calculateCareBudget, getCMSLevelName } from "@/lib/careLogic";
import { type ConditionId, CONDITION_OPTIONS } from "@/lib/conditionProfiles";
import CMSEstimator from "@/components/CMSEstimator";
import PathwayComparison from "@/components/PathwayComparison";
import ServiceCart from "@/components/ServiceCart";
import FinancialReport from "@/components/FinancialReport";
import FAQ from "@/components/FAQ";
import ApplicationGuide from "@/components/ApplicationGuide";
import CaregiverTips from "@/components/CaregiverTips";

type WizardStep = 'landing' | 'pathway' | 'cart' | 'report';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('landing');
  const [cmsLevel, setCmsLevel] = useState<CMSLevel | null>(null);
  const [incomeStatus, setIncomeStatus] = useState<IncomeStatus | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<CareType | null>(null);
  const [showEstimatorModal, setShowEstimatorModal] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<ConditionId[]>([]);

  const getBaseCopayRate = () => {
    if (incomeStatus === "general") return 0.16;
    if (incomeStatus === "mid-low") return 0.05;
    return 0;
  };

  const handleStartAnalysis = () => {
    if (cmsLevel && incomeStatus) {
      setCurrentStep('pathway');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentResult = (cmsLevel && incomeStatus && selectedPathway)
    ? calculateCareBudget(cmsLevel, incomeStatus, selectedPathway)
    : null;

  // ========== STEP 1: LANDING PAGE ========== //
  const renderLandingPage = () => (
    <div className="w-full">
      {/* ====== HERO SECTION ====== */}
      <section className="relative overflow-hidden rounded-b-[40px] bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16 pb-20 px-6 sm:px-10 mb-12">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Warm Emoji Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2.5 shadow-sm mb-8 border border-orange-100">
            <span className="text-[20px]">🧡</span>
            <span className="text-[14px] font-semibold text-amber-800">台灣長照 3.0 ｜ 2026 年最新法規</span>
          </div>

          <h1 className="text-[36px] sm:text-[48px] font-bold tracking-tight text-apple-gray-900 mb-5 leading-[1.15]">
            讓我們一起<br />為長輩找到最好的照顧
          </h1>
          <p className="text-[17px] sm:text-[20px] text-amber-900/70 max-w-xl mx-auto leading-relaxed mb-10">
            不用再翻法規、不用再猜數字。只要回答兩個問題，<br className="hidden sm:block" />
            系統就能幫您算出政府補助多少、自己要付多少。
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 border border-orange-100/50">
              <div className="text-[28px] font-bold text-apple-orange">4 種</div>
              <div className="text-[13px] text-amber-800/60 mt-1">照顧路徑比較</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 border border-orange-100/50">
              <div className="text-[28px] font-bold text-apple-green">4 包</div>
              <div className="text-[13px] text-amber-800/60 mt-1">長照補助試算</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 border border-orange-100/50">
              <div className="text-[28px] font-bold text-apple-pink">5 年</div>
              <div className="text-[13px] text-amber-800/60 mt-1">財務預測報表</div>
            </div>
          </div>
        </div>

        {/* Decorative warm circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-rose-200/30 rounded-full blur-3xl" />
      </section>

      {/* ====== ASSESSMENT FORM ====== */}
      <section className="max-w-2xl mx-auto px-4 mb-16" id="calculator">
        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 sm:px-10 py-6 border-b border-orange-100/50">
            <h2 className="text-[22px] font-bold tracking-tight text-apple-gray-900">
              📋 快速試算您的長照補助
            </h2>
            <p className="text-[15px] text-amber-800/60 mt-1">只需要 2 個步驟，30 秒完成</p>
          </div>

          <div className="p-8 sm:p-10">
            {/* CMS Level */}
            <div className="mb-8">
              <label className="block text-[16px] font-semibold text-apple-gray-800 mb-4">
                ❶ 長輩的失能等級 <span className="text-[14px] font-normal text-apple-gray-500">(CMS 等級)</span>
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
                {([1, 2, 3, 4, 5, 6, 7, 8] as CMSLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setCmsLevel(level)}
                    className={`
                      py-3 sm:py-4 rounded-[14px] text-center transition-all duration-200 border
                      ${cmsLevel === level
                        ? "bg-apple-orange text-white border-apple-orange shadow-md font-bold"
                        : "bg-apple-gray-50 text-apple-gray-700 border-apple-gray-200 hover:bg-orange-50 hover:border-orange-200"
                      }
                    `}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <div className="text-[16px] sm:text-[18px] font-semibold">{level} 級</div>
                    <div className={`text-[11px] sm:text-[12px] mt-0.5 ${cmsLevel === level ? "text-white/80" : "text-apple-gray-500"}`}>
                      {getCMSLevelName(level)}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowEstimatorModal(true)}
                className="w-full py-3 rounded-[14px] border-2 border-dashed border-orange-200 text-apple-orange text-[15px] font-semibold hover:bg-orange-50 transition-colors"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                🤔 不知道等級？ 花 30 秒幫您免費評估
              </button>
            </div>

            {/* Income */}
            <div className="mb-10">
              <label className="block text-[16px] font-semibold text-apple-gray-800 mb-4">
                ❷ 家庭收入身分
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["general", "mid-low", "low"] as IncomeStatus[]).map((status) => {
                  const config: Record<IncomeStatus, { label: string; sub: string }> = {
                    "general": { label: "一般戶", sub: "自付 16%" },
                    "mid-low": { label: "中低收入戶", sub: "自付 5%" },
                    "low": { label: "低收入戶", sub: "全額補助" }
                  };
                  return (
                    <button
                      key={status}
                      onClick={() => setIncomeStatus(status)}
                      className={`
                        p-4 rounded-[16px] text-center transition-all duration-200 border
                        ${incomeStatus === status
                          ? "bg-apple-orange/10 border-apple-orange text-apple-orange shadow-sm"
                          : "bg-white border-apple-gray-200 text-apple-gray-700 hover:bg-orange-50 hover:border-orange-200"}
                      `}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <div className="text-[15px] sm:text-[16px] font-semibold">{config[status].label}</div>
                      <div className={`text-[12px] mt-1 ${incomeStatus === status ? "text-apple-orange/70" : "text-apple-gray-500"}`}>
                        {config[status].sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Condition Selection (Optional) */}
            <div className="mb-10">
              <label className="block text-[16px] font-semibold text-apple-gray-800 mb-2">
                ❸ 長輩的主要健康狀況 <span className="text-[14px] font-normal text-apple-gray-500">(可複選，選填)</span>
              </label>
              <p className="text-[13px] text-apple-gray-500 mb-4">
                選擇後，系統會針對疾病給出專屬的照顧建議、時間軸和注意事項。
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONDITION_OPTIONS.map((condition) => {
                  const isSelected = selectedConditions.includes(condition.id);
                  return (
                    <button
                      key={condition.id}
                      onClick={() => {
                        setSelectedConditions((prev) =>
                          isSelected
                            ? prev.filter((c) => c !== condition.id)
                            : [...prev, condition.id]
                        );
                      }}
                      className={`
                        p-3 rounded-[14px] text-center transition-all duration-200 border
                        ${isSelected
                          ? "bg-apple-orange/10 border-apple-orange text-apple-orange shadow-sm"
                          : "bg-white border-apple-gray-200 text-apple-gray-700 hover:bg-orange-50 hover:border-orange-200"}
                      `}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <div className="text-[20px] mb-1">{condition.icon}</div>
                      <div className="text-[13px] font-semibold">{condition.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit CTA */}
            <button
              onClick={handleStartAnalysis}
              disabled={!cmsLevel || !incomeStatus}
              className={`
                w-full py-4.5 text-[17px] font-bold rounded-full transition-all transform active:scale-[0.98]
                ${cmsLevel && incomeStatus
                  ? "bg-gradient-to-r from-apple-orange to-apple-pink text-white shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50"
                  : "bg-apple-gray-200 text-apple-gray-400 cursor-not-allowed"
                }
              `}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {cmsLevel && incomeStatus ? "查看 4 種照顧方案的財務對比 →" : "請先完成上方兩個選項"}
            </button>
          </div>
        </div>
      </section>

      {/* ====== FEATURE HIGHLIGHTS ====== */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h3 className="text-[22px] sm:text-[26px] font-bold text-center text-apple-gray-900 tracking-tight mb-10">
          這個工具能幫您做什麼？
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { emoji: "🏠", title: "四條路，一次比", desc: "居家照顧、日間照顧、住宿機構、外籍看護 — 不用各別查資料，系統同時幫您算好四種方案的費用差異。" },
            { emoji: "🛒", title: "服務購物車", desc: "算出補助金額後，直接挑選實際的長照服務項目（洗澡、就醫陪同等），計算真正要花多少錢。" },
            { emoji: "📊", title: "5 年財務預測", desc: "長照不是一個月的事。系統會幫您推算未來 5 年的總支出，方便跟家人討論分攤。" },
            { emoji: "🤔", title: "不懂等級？幫您評估", desc: "透過 4 個簡單的日常生活問題（吃飯、走路、洗澡、認知），自動算出最可能的失能等級。" },
          ].map((feat, i) => (
            <div key={i} className="bg-white rounded-[24px] p-6 sm:p-7 border border-apple-gray-200/50 shadow-sm hover:shadow-apple-warm transition-shadow">
              <div className="text-[32px] mb-3">{feat.emoji}</div>
              <h4 className="text-[17px] font-bold text-apple-gray-900 mb-2">{feat.title}</h4>
              <p className="text-[14px] text-apple-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== APPLICATION GUIDE ====== */}
      <ApplicationGuide />

      {/* ====== FAQ ====== */}
      <FAQ />

      {/* ====== CAREGIVER TIPS ====== */}
      <CaregiverTips />

      {/* ====== TRUST / FOOTER ====== */}
      <section className="max-w-2xl mx-auto px-4 text-center pb-12">
        <div className="bg-amber-50/50 rounded-[20px] p-6 border border-orange-100/50">
          <p className="text-[14px] text-amber-800/60 leading-relaxed">
            📌 本工具依據 <strong>衛生福利部 2026 年長照 3.0 最新法規</strong> 設計。所有數據僅供參考，實際補助金額以各縣市照顧管理中心核定為準。如有任何疑問，請撥打長照專線 <strong className="text-apple-orange">1966</strong>。
          </p>
        </div>
      </section>

      {/* CMS Estimator Modal */}
      {showEstimatorModal && (
        <CMSEstimator
          onComplete={(level) => {
            setCmsLevel(level);
            setShowEstimatorModal(false);
          }}
          onCancel={() => setShowEstimatorModal(false)}
        />
      )}
    </div>
  );

  // ========== STEP 2: PATHWAY COMPARISON ========== //
  const renderPathwayStep = () => (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mb-6">
        <button
          onClick={() => { setCurrentStep('landing'); window.scrollTo(0, 0); }}
          className="inline-flex items-center gap-2 text-[15px] text-apple-gray-500 hover:text-apple-gray-900 transition-colors"
        >
          ← 回到首頁
        </button>
      </div>
      <PathwayComparison
        cmsLevel={cmsLevel!}
        incomeStatus={incomeStatus!}
        onSelectPathway={(path) => {
          setSelectedPathway(path);
          if (path === 'institution') {
            setCurrentStep('report');
          } else {
            setCurrentStep('cart');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );

  // ========== STEP 3: SERVICE CART ========== //
  const renderCartStep = () => {
    if (!currentResult) return null;
    return (
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentStep('pathway')}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-apple-gray-500 hover:text-apple-gray-900 border border-apple-gray-200"
          >
            ←
          </button>
          <h2 className="text-[24px] font-bold text-apple-gray-900">客製化您的服務計畫</h2>
        </div>
        <ServiceCart
          totalSubsidyMonthly={currentResult.totalSubsidyMonthly}
          baseCopayRate={getBaseCopayRate()}
        />
        <div className="mt-8 text-center">
          <button
            onClick={() => { setCurrentStep('report'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-10 py-4 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[17px] font-bold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
          >
            產生 5 年財務報表 →
          </button>
        </div>
      </div>
    );
  };

  // ========== STEP 4: REPORT ========== //
  const renderReportStep = () => {
    if (!currentResult || !selectedPathway) return null;
    return (
      <FinancialReport
        careType={selectedPathway}
        monthlyGovSubsidy={currentResult.totalSubsidyMonthly}
        monthlyOutOfPocket={currentResult.outOfPocketMonthly}
        assistiveDeviceQuota={currentResult.assistiveDeviceQuota}
        selectedConditions={selectedConditions}
      />
    );
  };

  // ========== MAIN RENDER ========== //
  return (
    <main className="min-h-screen bg-apple-gray-50">
      {/* Progress Bar */}
      {currentStep !== 'landing' && (
        <div className="fixed top-0 left-0 w-full h-1 bg-apple-gray-200 z-50">
          <div
            className="h-full bg-gradient-to-r from-apple-orange to-apple-pink transition-all duration-500 ease-out"
            style={{
              width: currentStep === 'pathway' ? '33%' :
                     currentStep === 'cart' ? '66%' : '100%'
            }}
          />
        </div>
      )}

      <div className={currentStep === 'landing' ? '' : 'pt-8 sm:pt-12 pb-24 px-4'}>
        {currentStep === 'landing' && renderLandingPage()}
        {currentStep === 'pathway' && renderPathwayStep()}
        {currentStep === 'cart' && renderCartStep()}
        {currentStep === 'report' && renderReportStep()}
      </div>
    </main>
  );
}
