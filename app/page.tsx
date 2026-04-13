"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type CMSLevel, type IncomeStatus, type CareType, calculateCareBudget, getCMSLevelName } from "@/lib/careLogic";
import { CONDITION_OPTIONS, type ConditionId } from "@/lib/conditionProfiles";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

const STORAGE_KEY = "care-calc-last-v1";
const INCOME_LABELS: Record<IncomeStatus, string> = {
  general: "一般戶",
  "mid-low": "中低收入",
  low: "低收入戶",
};
const INCOME_OPTIONS: Array<{ value: IncomeStatus; label: string; sub: string }> = [
  { value: "general", label: "一般戶", sub: "自付 16%" },
  { value: "mid-low", label: "中低收入戶", sub: "自付 5%" },
  { value: "low", label: "低收入戶", sub: "全額補助" },
];

const StepLoader = () => (
  <div className="flex justify-center items-center py-24">
    <div className="w-8 h-8 border-4 border-orange-200 border-t-apple-orange rounded-full animate-spin" />
  </div>
);

const CMSEstimator = dynamic(() => import("@/components/CMSEstimator"), { loading: StepLoader });
const PathwayComparison = dynamic(() => import("@/components/PathwayComparison"), { loading: StepLoader });
const ServiceCart = dynamic(() => import("@/components/ServiceCart"), { loading: StepLoader });
const FinancialReport = dynamic(() => import("@/components/FinancialReport"), { loading: StepLoader });
const ApplicationGuide = dynamic(() => import("@/components/ApplicationGuide"), { loading: StepLoader });
import FAQ from "@/components/FAQ";
import CaregiverTips from "@/components/CaregiverTips";
import EmergencyAccordion from "@/components/EmergencyAccordion";

type WizardStep = 'landing' | 'pathway' | 'cart' | 'report';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('landing');
  const [cmsLevel, setCmsLevel] = useState<CMSLevel | null>(null);
  const [incomeStatus, setIncomeStatus] = useState<IncomeStatus | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<CareType | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<ConditionId[]>([]);
  const [showEstimatorModal, setShowEstimatorModal] = useState(false);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [activeGuide, setActiveGuide] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [isCalculatorInView, setIsCalculatorInView] = useState(false);

  // 讀取上次試算
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { cmsLevel: c, incomeStatus: i } = JSON.parse(saved);
        if (c && i) {
          setCmsLevel(c as CMSLevel);
          setIncomeStatus(i as IncomeStatus);
          setShowResumeBanner(true);
        }
      }
    } catch {}
  }, []);

  // 儲存試算選擇
  useEffect(() => {
    if (cmsLevel && incomeStatus) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cmsLevel, incomeStatus }));
    }
  }, [cmsLevel, incomeStatus]);

  useEffect(() => {
    if (currentStep !== "landing") {
      setShowStickyCta(false);
      return;
    }
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 420);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== "landing") {
      setIsCalculatorInView(false);
      return;
    }
    const target = document.getElementById("calculator");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsCalculatorInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "-10% 0px -30% 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [currentStep]);

  const baseCopayRate = useMemo(() => {
    if (incomeStatus === "general") return 0.16;
    if (incomeStatus === "mid-low") return 0.05;
    return 0;
  }, [incomeStatus]);

  const handleStartAnalysis = () => {
    if (cmsLevel && incomeStatus) {
      setCurrentStep('pathway');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.gtag?.('event', 'calculation_start', { cms_level: cmsLevel, income_status: incomeStatus });
    }
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCmsLevel(null);
    setIncomeStatus(null);
    setSelectedPathway(null);
    setSelectedConditions([]);
    setShowResumeBanner(false);
    setCurrentStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResume = () => {
    setShowResumeBanner(false);
    handleStartAnalysis();
    window.gtag?.('event', 'calculation_resume', { cms_level: cmsLevel, income_status: incomeStatus });
  };

  const scrollToCalculator = () => {
    const el = document.getElementById("calculator");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.gtag?.("event", "landing_cta_click");
  };

  const currentResult = useMemo(() => (
    (cmsLevel && incomeStatus && selectedPathway)
      ? calculateCareBudget(cmsLevel, incomeStatus, selectedPathway)
      : null
  ), [cmsLevel, incomeStatus, selectedPathway]);
  const canStart = Boolean(cmsLevel && incomeStatus);
  const missingFields = [
    cmsLevel ? null : "失能等級",
    incomeStatus ? null : "收入身分",
  ].filter((field): field is string => Boolean(field));

  const pathwayLabel: Record<CareType, string> = {
    "home-care": "居家照顧",
    "day-care": "日間照顧",
    institution: "住宿機構",
    "foreign-caregiver": "外籍看護",
  };

  const guideItems = [
    {
      title: "四條路，一次比",
      desc: "居家照顧、日間照顧、住宿機構、外籍看護 — 不用各別查資料，系統同時幫您算好四種方案的費用差異。",
      result: "30 秒產出四條路徑的月支出比較",
    },
    {
      title: "服務購物車",
      desc: "算出補助金額後，直接挑選實際的長照服務項目（洗澡、就醫陪同等），計算真正要花多少錢。",
      result: "把補助變成可執行的照顧清單",
    },
    {
      title: "5 年財務預測",
      desc: "長照不是一個月的事。系統會幫您推算未來 5 年的總支出，方便跟家人討論分攤。",
      result: "一次看懂未來 5 年總支出",
    },
    {
      title: "不懂等級？幫您評估",
      desc: "透過 4 個簡單的日常生活問題（吃飯、走路、洗澡、認知），自動算出最可能的失能等級。",
      result: "不用懂規則也能快速得到級數",
    },
  ];

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

          <h1 className="text-[36px] sm:text-[48px] font-bold tracking-tight text-apple-gray-900 mb-5 leading-[1.15] animation-fade-in">
            讓我們一起<br />為長輩找到最好的照顧
          </h1>
          <p className="text-[17px] sm:text-[20px] text-amber-900/70 max-w-xl mx-auto leading-relaxed mb-10 animation-fade-in">
            不用再翻法規、不用再猜數字。只要回答兩個問題，<br className="hidden sm:block" />
            系統就能幫您算出政府補助多少、自己要付多少。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              onClick={scrollToCalculator}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[16px] font-semibold shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
            >
              30 秒開始試算 →
            </button>
            <Link
              href="/tools"
              className="px-6 py-3 rounded-full border border-orange-200 text-[15px] font-semibold text-amber-800 hover:bg-orange-50 transition-colors"
            >
              先看看有哪些工具
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <span className="px-3 py-1 rounded-full bg-white/75 border border-orange-100 text-[12px] text-amber-800">不需註冊</span>
            <span className="px-3 py-1 rounded-full bg-white/75 border border-orange-100 text-[12px] text-amber-800">30 秒完成第一輪比較</span>
            <span className="px-3 py-1 rounded-full bg-white/75 border border-orange-100 text-[12px] text-amber-800">依 2026 長照規範設計</span>
          </div>

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

      {/* ====== RESUME BANNER ====== */}
      {showResumeBanner && cmsLevel && incomeStatus && (
        <div className="max-w-2xl mx-auto px-4 mb-4 mt-[-20px]">
          <div className="bg-amber-50 border border-orange-200/70 rounded-[18px] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[20px]">👋</span>
              <div>
                <span className="text-[14px] font-semibold text-amber-900">繼續上次試算</span>
                <span className="text-[13px] text-amber-700/70 ml-2">
                  CMS {cmsLevel} 級 · {INCOME_LABELS[incomeStatus]}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleResume}
                className="px-4 py-2 rounded-full bg-apple-orange text-white text-[13px] font-semibold shadow-sm hover:shadow-md transition-shadow"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                一鍵繼續
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-full text-[12px] font-semibold text-amber-700 hover:bg-amber-100/60 transition-colors"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                重新開始
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== ASSESSMENT FORM ====== */}
      <section className="max-w-2xl mx-auto px-4 mb-16" id="calculator">
        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 sm:px-10 py-6 border-b border-orange-100/50">
            <h2 className="text-[22px] font-bold tracking-tight text-apple-gray-900">
              📋 快速試算您的長照補助
            </h2>
            <p className="text-[15px] text-amber-800/60 mt-1">只需要 2 個步驟，30 秒完成</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-amber-800/70">
              <span className="px-3 py-1 rounded-full bg-white/80 border border-orange-100">步驟 1：選擇等級</span>
              <span className="px-3 py-1 rounded-full bg-white/80 border border-orange-100">步驟 2：選擇收入身份</span>
              <span className="px-3 py-1 rounded-full bg-white/80 border border-orange-100">完成後：比較四種照顧路徑</span>
            </div>
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
                    aria-pressed={cmsLevel === level}
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
                {INCOME_OPTIONS.map((option) => {
                  return (
                    <button
                    key={option.value}
                    onClick={() => setIncomeStatus(option.value)}
                    aria-pressed={incomeStatus === option.value}
                    className={`
                        p-4 rounded-[16px] text-center transition-all duration-200 border
                        ${incomeStatus === option.value
                          ? "bg-apple-orange/10 border-apple-orange text-apple-orange shadow-sm"
                          : "bg-white border-apple-gray-200 text-apple-gray-700 hover:bg-orange-50 hover:border-orange-200"}
                      `}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <div className="text-[15px] sm:text-[16px] font-semibold">{option.label}</div>
                      <div className={`text-[12px] mt-1 ${incomeStatus === option.value ? "text-apple-orange/70" : "text-apple-gray-500"}`}>
                        {option.sub}
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
                      aria-pressed={isSelected}
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
              disabled={!canStart}
              className={`
                w-full py-4.5 text-[17px] font-bold rounded-full transition-all transform active:scale-[0.98]
                ${canStart
                  ? "bg-gradient-to-r from-apple-orange to-apple-pink text-white shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50"
                  : "bg-apple-gray-200 text-apple-gray-400 cursor-not-allowed"
                }
              `}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {canStart ? "查看 4 種照顧方案的財務對比 →" : `請先完成：${missingFields.join("、")}`}
            </button>
            {canStart && (
              <div className="mt-3 text-center text-[13px] text-apple-gray-500">
                已完成設定：CMS {cmsLevel} 級・{incomeStatus ? INCOME_LABELS[incomeStatus] : ""}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====== FEATURE HIGHLIGHTS ====== */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h3 className="text-[22px] sm:text-[26px] font-bold text-center text-apple-gray-900 tracking-tight mb-8">
          這個工具能幫您做什麼？
        </h3>
        <div className="bg-white rounded-[28px] border border-apple-gray-200/60 shadow-sm p-5 sm:p-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {guideItems.map((item, idx) => (
              <button
                key={item.title}
                onClick={() => setActiveGuide(idx)}
                aria-pressed={activeGuide === idx}
                className={`
                  rounded-[16px] p-4 text-left border transition-all
                  ${activeGuide === idx
                    ? "bg-apple-orange/10 border-apple-orange text-apple-orange shadow-sm"
                    : "bg-apple-gray-50 border-apple-gray-200 text-apple-gray-700 hover:bg-orange-50 hover:border-orange-200"}
                `}
              >
                <div className="text-[14px] font-semibold">{item.title}</div>
                <div className={`text-[12px] mt-1 ${activeGuide === idx ? "text-apple-orange/80" : "text-apple-gray-500"}`}>
                  點選查看細節
                </div>
              </button>
            ))}
          </div>
          <div className="rounded-[20px] border border-orange-100 bg-amber-50/50 p-5 sm:p-6">
            <div className="text-[18px] font-bold text-apple-gray-900 mb-2">{guideItems[activeGuide].title}</div>
            <p className="text-[14px] text-apple-gray-600 leading-relaxed mb-4">
              {guideItems[activeGuide].desc}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-orange-100 text-[13px] text-amber-800">
              ✅ {guideItems[activeGuide].result}
            </div>
          </div>
        </div>
      </section>

      {/* ====== APPLICATION GUIDE ====== */}
      <ApplicationGuide />

      {/* ====== EMERGENCY ACCORDION ====== */}
      <EmergencyAccordion />

      {/* ====== FAQ ====== */}
      <FAQ />

      {/* ====== CAREGIVER TIPS ====== */}
      <CaregiverTips />

      {/* ====== MORE TOOLS SECTION ====== */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h3 className="text-[20px] font-bold text-center text-apple-gray-900 mb-6">
          更多照顧工具
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/insurance", emoji: "🛡️", label: "保險補充計算" },
            { href: "/tools/conditions", emoji: "🫀", label: "疾病照顧檔案" },
            { href: "/tools/caregiverhealth", emoji: "💆", label: "倦怠檢測" },
            { href: "/tools/reablement", emoji: "🌟", label: "復能任務卡" },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-white border border-apple-gray-200 rounded-[18px] p-4 text-center hover:shadow-apple-warm hover:border-orange-100 transition-all group"
            >
              <div className="text-[28px] mb-2">{tool.emoji}</div>
              <div className="text-[13px] font-semibold text-apple-gray-700 group-hover:text-amber-700 transition-colors">
                {tool.label}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link href="/tools" className="text-[13px] text-amber-600 hover:text-amber-700 font-medium">
            查看全部工具 →
          </Link>
        </div>
      </section>

      {/* ====== TRUST / FOOTER ====== */}
      <section className="max-w-2xl mx-auto px-4 text-center pb-12">
        <div className="bg-amber-50/50 rounded-[20px] p-6 border border-orange-100/50">
          <p className="text-[14px] text-amber-800/60 leading-relaxed">
            📌 本工具依據 <strong>衛生福利部 2026 年長照 3.0 最新法規</strong> 設計。所有數據僅供參考，實際補助金額以各縣市照顧管理中心核定為準。如有任何疑問，請撥打長照專線 <a href="tel:1966" className="font-bold text-apple-orange hover:underline underline-offset-2">1966</a>。
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
          window.gtag?.('event', 'pathway_selected', { care_type: path });
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
          baseCopayRate={baseCopayRate}
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
        cmsLevel={cmsLevel ?? undefined}
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

      {/* Step Summary */}
      {currentStep !== 'landing' && (
        <div className="pt-8 sm:pt-10 px-4">
          <div className="max-w-5xl mx-auto bg-white border border-apple-gray-200/60 rounded-[20px] shadow-sm px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-[13px] text-apple-gray-500">目前步驟</div>
              <div className="text-[18px] font-bold text-apple-gray-900">
                {currentStep === 'pathway' && "Step 2／4：照顧路徑比較"}
                {currentStep === 'cart' && "Step 3／4：服務購物車"}
                {currentStep === 'report' && "Step 4／4：5 年財務報表"}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-apple-gray-600">
              <span className="px-3 py-1 rounded-full bg-apple-gray-50 border border-apple-gray-200">
                CMS {cmsLevel ?? "-"} 級
              </span>
              <span className="px-3 py-1 rounded-full bg-apple-gray-50 border border-apple-gray-200">
                {incomeStatus ? INCOME_LABELS[incomeStatus] : "未選擇收入"}
              </span>
              <span className="px-3 py-1 rounded-full bg-apple-gray-50 border border-apple-gray-200">
                {selectedPathway ? pathwayLabel[selectedPathway] : "尚未選擇路徑"}
              </span>
              <span className="px-3 py-1 rounded-full bg-apple-gray-50 border border-apple-gray-200">
                健康狀況已選 {selectedConditions.length} 項
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={currentStep === 'landing' ? '' : 'pt-8 sm:pt-12 pb-24 px-4'}>
        {currentStep === 'landing' && renderLandingPage()}
        {currentStep === 'pathway' && renderPathwayStep()}
        {currentStep === 'cart' && renderCartStep()}
        {currentStep === 'report' && renderReportStep()}
      </div>

      {/* Sticky CTA for Landing */}
      {currentStep === 'landing' && showStickyCta && !isCalculatorInView && (
        <div className="fixed bottom-4 left-0 right-0 px-4 z-40">
          <div className="max-w-2xl mx-auto bg-white border border-apple-gray-200 shadow-lg rounded-full px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-[13px] text-apple-gray-700">
              已經滑到中段了，現在就 30 秒完成試算
            </div>
            <button
              onClick={scrollToCalculator}
              className="px-4 py-2 rounded-full bg-apple-orange text-white text-[13px] font-semibold shadow-sm hover:shadow-md transition-shadow"
            >
              立即開始 →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
