"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Icon, { type IconName } from "../components/Icon";
import { type CMSLevel, type IncomeStatus, type CareType, calculateCareBudget } from "@/lib/careLogic";
import { CONDITION_OPTIONS, type ConditionId } from "@/lib/conditionProfiles";
import {
  ASSISTIVE_DEVICE_GROUPS,
  POLICY_SOURCES,
  POLICY_VERSION,
  TRANSPORT_REGIONS,
  type AssistiveDeviceGroup,
  type TransportRegion,
} from "@/lib/policyData";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

const STORAGE_KEY = "care-calc-last-v1";
const WIZARD_KEY = "care-calc-wizard-v1";
const INCOME_LABELS: Record<IncomeStatus, string> = {
  general: "一般戶",
  "mid-low": "中低收入",
  low: "低收入戶",
};
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
import QuickWizard, { type WizardProgress } from "@/components/QuickWizard";
import CaregiverTips from "@/components/CaregiverTips";
import EmergencyAccordion from "@/components/EmergencyAccordion";

type WizardStep = 'landing' | 'pathway' | 'cart' | 'report';
const FLOW_STEPS: Array<{ id: WizardStep; title: string; helper: string }> = [
  { id: "landing", title: "基本設定", helper: "輸入長輩條件" },
  { id: "pathway", title: "方案比較", helper: "先看推薦方案" },
  { id: "cart", title: "服務配置", helper: "客製月支出" },
  { id: "report", title: "財務報表", helper: "輸出 5 年結論" },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('landing');
  const [cmsLevel, setCmsLevel] = useState<CMSLevel | null>(null);
  const [incomeStatus, setIncomeStatus] = useState<IncomeStatus | null>(null);
  const [transportRegion, setTransportRegion] = useState<TransportRegion>("region1");
  const [assistiveDeviceGroup, setAssistiveDeviceGroup] = useState<AssistiveDeviceGroup>("group1");
  const [selectedPathway, setSelectedPathway] = useState<CareType | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<ConditionId[]>([]);
  const [showEstimatorModal, setShowEstimatorModal] = useState(false);
  const [wizardProgress] = useState<WizardProgress | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(WIZARD_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.step === "number" && parsed.step >= 0 && parsed.step <= 2) return parsed as WizardProgress;
      return null;
    } catch { return null; }
  });
  const [estimatorFromWizard, setEstimatorFromWizard] = useState(false);
  const [wizardCmsSignal, setWizardCmsSignal] = useState<CMSLevel | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [activeGuide, setActiveGuide] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [isCalculatorInView, setIsCalculatorInView] = useState(false);

  // 讀取上次試算
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { cmsLevel: c, incomeStatus: i, transportRegion: t, assistiveDeviceGroup: a } = JSON.parse(saved);
        if (c && i) {
          setCmsLevel(c as CMSLevel);
          setIncomeStatus(i as IncomeStatus);
          if (t && t in TRANSPORT_REGIONS) setTransportRegion(t as TransportRegion);
          if (a && a in ASSISTIVE_DEVICE_GROUPS) setAssistiveDeviceGroup(a as AssistiveDeviceGroup);
          setShowResumeBanner(true);
        }
      }
    } catch {}
  }, []);

  // 儲存試算選擇
  useEffect(() => {
    if (cmsLevel && incomeStatus) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cmsLevel, incomeStatus, transportRegion, assistiveDeviceGroup }));
    }
  }, [cmsLevel, incomeStatus, transportRegion, assistiveDeviceGroup]);

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

  const handleQuickComplete = (careType: CareType, cms: CMSLevel, income: IncomeStatus) => {
    try { localStorage.removeItem(WIZARD_KEY); } catch {}
    setSelectedPathway(careType);
    setCmsLevel(cms);
    setIncomeStatus(income);
    setCurrentStep('pathway');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.gtag?.('event', 'quick_wizard_start', { care_type: careType, cms_level: cms, income_status: income });
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    try { localStorage.removeItem(WIZARD_KEY); } catch {}
    setCmsLevel(null);
    setIncomeStatus(null);
    setTransportRegion("region1");
    setAssistiveDeviceGroup("group1");
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
      ? calculateCareBudget(cmsLevel, incomeStatus, selectedPathway, { transportRegion, assistiveDeviceGroup })
      : null
  ), [cmsLevel, incomeStatus, selectedPathway, transportRegion, assistiveDeviceGroup]);
  const currentStepIndex = FLOW_STEPS.findIndex((step) => step.id === currentStep);
  const progressPct = ((currentStepIndex + 1) / FLOW_STEPS.length) * 100;

  const pathwayLabel: Record<CareType, string> = {
    "home-care": "居家照顧",
    "day-care": "日間照顧",
    institution: "住宿機構",
    "foreign-caregiver": "外籍看護",
  };

  const guideItems = [
    {
      title: "四條路，一次比",
      desc: "居家照顧、日間照顧、住宿機構、外籍看護 — 不用各別查資料，系統同時幫你算好四種方案的費用差異。",
      result: "30 秒產出四條路徑的月支出比較",
    },
    {
      title: "服務購物車",
      desc: "算出補助金額後，直接挑選實際的長照服務項目（洗澡、就醫陪同等），計算真正要花多少錢。",
      result: "把補助變成可執行的照顧清單",
    },
    {
      title: "5 年財務預測",
      desc: "長照不是一個月的事。系統會幫你推算未來 5 年的總支出，方便跟家人討論分攤。",
      result: "一次看懂未來 5 年總支出",
    },
    {
      title: "不懂等級？幫你評估",
      desc: "透過 4 個簡單的日常生活問題（吃飯、走路、洗澡、認知），自動算出最可能的失能等級。",
      result: "不用懂規則也能快速得到級數",
    },
  ];

  const renderFlowFrame = (isLanding: boolean) => (
    <section className={`${isLanding ? "max-w-5xl mx-auto px-4 mb-10" : "pt-8 sm:pt-10 px-4"}`}>
      <div className="max-w-5xl mx-auto section-surface rounded-[22px] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <div>
            <div className="text-[12px] text-amber-700 font-semibold tracking-wide">決策流程</div>
            <h2 className="text-[20px] sm:text-[22px] font-bold text-apple-gray-900">
              {isLanding ? "先設定條件，再進入推薦比較" : "進度與決策摘要"}
            </h2>
          </div>
          <div className="text-[13px] text-apple-gray-500">
            目前完成 {currentStepIndex + 1}/{FLOW_STEPS.length} 步
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-apple-gray-100 overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-apple-orange to-apple-pink transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {FLOW_STEPS.map((step, idx) => {
            const state = idx < currentStepIndex ? "done" : idx === currentStepIndex ? "active" : "todo";
            return (
              <div
                key={step.id}
                className={`rounded-[16px] border px-3 py-3 ${
                  state === "active"
                    ? "border-apple-orange bg-orange-50"
                    : state === "done"
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-apple-gray-200 bg-apple-gray-50"
                }`}
              >
                <div className="text-[12px] text-apple-gray-500">Step {idx + 1}</div>
                <div className="text-[14px] font-semibold text-apple-gray-900">{step.title}</div>
                <div className={`text-[12px] mt-1 ${state === "active" ? "text-apple-orange" : "text-apple-gray-500"}`}>
                  {step.helper}
                </div>
              </div>
            );
          })}
        </div>
        {!isLanding && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-apple-gray-600">
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
        )}
      </div>
    </section>
  );

  // ========== STEP 1: LANDING PAGE ========== //
  const renderLandingPage = () => (
    <div className="w-full">
      {/* ====== HERO SECTION ====== */}
      <section className="hero-surface relative overflow-hidden rounded-b-[40px] pt-16 pb-20 px-6 sm:px-10 mb-12">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Warm Emoji Badge */}
          <div className="inline-flex items-center gap-2 glass-chip rounded-full px-5 py-2.5 shadow-sm mb-8">
            <Icon name="heart" size={18} className="text-amber-700 shrink-0" />
            <span className="text-[14px] font-semibold text-amber-800">台灣長照 3.0 ｜ 資料核對至 {POLICY_VERSION}</span>
          </div>

          <h1 className="text-[36px] sm:text-[48px] font-bold tracking-tight text-apple-gray-900 mb-5 leading-[1.15] animation-fade-in">
            長照一個月<br />到底要花多少錢？
          </h1>
          <p className="text-[17px] sm:text-[20px] text-amber-900/70 max-w-xl mx-auto leading-relaxed mb-10 animation-fade-in">
            輸入失能等級和收入狀況，30 秒算出政府補助多少、自己要貼多少。<br className="hidden sm:block" />
            居家、日照、機構、外看，四種方式一次比給你看。
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
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="glass-chip rounded-[20px] p-4">
              <div className="text-[28px] font-bold text-apple-orange">4 種</div>
              <div className="text-[13px] text-amber-800/60 mt-1">照顧路徑比較</div>
            </div>
            <div className="glass-chip rounded-[20px] p-4">
              <div className="text-[28px] font-bold text-apple-green">4 包</div>
              <div className="text-[13px] text-amber-800/60 mt-1">長照補助試算</div>
            </div>
            <div className="glass-chip rounded-[20px] p-4">
              <div className="text-[28px] font-bold text-apple-pink">5 年</div>
              <div className="text-[13px] text-amber-800/60 mt-1">財務預測報表</div>
            </div>
          </div>
        </div>

        {/* Decorative geometry */}
        <div className="absolute -top-16 -right-10 w-64 h-64 border border-sky-300/30 rounded-full" />
        <div className="absolute -top-8 -right-2 w-44 h-44 border border-orange-300/30 rounded-full" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-orange-200/30 rounded-full blur-3xl" />
      </section>

      {/* ====== RESUME BANNER ====== */}
      {showResumeBanner && cmsLevel && incomeStatus && (
        <div className="max-w-2xl mx-auto px-4 mb-4 mt-[-20px]">
          <div className="bg-amber-50 border border-orange-200/70 rounded-[18px] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm gap-3">
            <div className="flex items-center gap-3">
              <Icon name="hand" size={20} className="text-amber-700 shrink-0" />
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

      {renderFlowFrame(true)}

      {/* ====== ASSESSMENT FORM ====== */}
      <section className="max-w-2xl mx-auto px-4 mb-16" id="calculator">
        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 sm:px-10 py-6 border-b border-orange-100/50">
            <h2 className="text-[22px] font-bold tracking-tight text-apple-gray-900 flex items-center gap-2">
              <Icon name="clipboard" size={22} className="text-amber-700 shrink-0" />
              快速試算你的長照補助
            </h2>
            <p className="text-[15px] text-amber-800/60 mt-1">3 個問題，約 30 秒完成</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-amber-800/70">
              <span className="px-3 py-1 rounded-full bg-white/80 border border-orange-100">步驟 1：選擇等級</span>
              <span className="px-3 py-1 rounded-full bg-white/80 border border-orange-100">步驟 2：選擇收入身份</span>
              <span className="px-3 py-1 rounded-full bg-white/80 border border-orange-100">步驟 3：交通與輔具組別</span>
              <span className="px-3 py-1 rounded-full bg-white/80 border border-orange-100">完成後：比較四種照顧路徑</span>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <QuickWizard
              onComplete={handleQuickComplete}
              onOpenEstimator={() => { setEstimatorFromWizard(true); setShowEstimatorModal(true); }}
              estimatorResult={wizardCmsSignal}
              onEstimatorConsumed={() => setWizardCmsSignal(null)}
              initialProgress={wizardProgress}
              onProgress={(prog) => { try { localStorage.setItem(WIZARD_KEY, JSON.stringify(prog)); } catch {} }}
            />

            {/* 進階設定：交通分區、輔具、疾病勾選 */}
            <details className="mt-8 rounded-[18px] border border-apple-gray-200 bg-apple-gray-50/60 px-5 py-4 group">
              <summary className="cursor-pointer list-none flex items-center justify-between text-[14px] font-semibold text-apple-gray-600 hover:text-apple-gray-900">
                <span>進階設定：交通分區、輔具額度、疾病勾選（可不填）</span>
                <span className="text-apple-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="pt-6">
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-[15px] font-semibold text-apple-gray-800 mb-2">3. 交通接送分區</span>
                <select
                  value={transportRegion}
                  onChange={(event) => setTransportRegion(event.target.value as TransportRegion)}
                  className="w-full rounded-[14px] border border-apple-gray-200 bg-white px-4 py-3 text-[14px] text-apple-gray-800 focus:border-apple-orange focus:outline-none focus:ring-2 focus:ring-orange-100"
                >
                  {Object.entries(TRANSPORT_REGIONS).map(([value, region]) => (
                    <option key={value} value={value}>{region.label}・每月 {region.monthlyQuota.toLocaleString()} 元</option>
                  ))}
                </select>
                <span className="block text-[12px] text-apple-gray-500 mt-2">分區以照管中心依居住鄉鎮核定為準。</span>
              </label>
              <label className="block">
                <span className="block text-[15px] font-semibold text-apple-gray-800 mb-2">4. 輔具額度組別</span>
                <select
                  value={assistiveDeviceGroup}
                  onChange={(event) => setAssistiveDeviceGroup(event.target.value as AssistiveDeviceGroup)}
                  className="w-full rounded-[14px] border border-apple-gray-200 bg-white px-4 py-3 text-[14px] text-apple-gray-800 focus:border-apple-orange focus:outline-none focus:ring-2 focus:ring-orange-100"
                >
                  {Object.entries(ASSISTIVE_DEVICE_GROUPS).map(([value, group]) => (
                    <option key={value} value={value}>{group.short}・3 年 {group.threeYearQuota.toLocaleString()} 元</option>
                  ))}
                </select>
                <span className="block text-[12px] text-apple-gray-500 mt-2">第二組自 2026/7/1 實施，適用資格與換組時點以核定為準。</span>
              </label>
            </div>

            {/* Condition Selection (Optional) */}
            <div className="mb-10">
              <label className="block text-[16px] font-semibold text-apple-gray-800 mb-2">
                5. 長輩的主要健康狀況 <span className="text-[14px] font-normal text-apple-gray-500">(可複選，選填)</span>
              </label>
              <p className="text-[13px] text-apple-gray-500 mb-4">
                選填。選了會給你對應疾病的照顧建議和注意事項。
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
                      <div className="mb-1 flex justify-center"><Icon name={condition.icon} size={22} /></div>
                      <div className="text-[13px] font-semibold">{condition.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ====== FEATURE HIGHLIGHTS ====== */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h3 className="text-[22px] sm:text-[26px] font-bold text-center text-apple-gray-900 tracking-tight mb-8">
          你會先得到什麼，再做什麼？
        </h3>
        <div className="section-surface rounded-[28px] p-5 sm:p-7">
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
                  查看輸出成果
                </div>
              </button>
            ))}
          </div>
          <div className="rounded-[20px] border border-orange-100 bg-white/80 p-5 sm:p-6">
            <div className="text-[18px] font-bold text-apple-gray-900 mb-2">{guideItems[activeGuide].title}</div>
            <p className="text-[14px] text-apple-gray-600 leading-relaxed mb-4">
              {guideItems[activeGuide].desc}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-orange-100 text-[13px] text-amber-800">
              <Icon name="checkCircle" size={16} className="text-emerald-600 shrink-0" /> {guideItems[activeGuide].result}
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
          {([
            { href: "/insurance", icon: "shield", label: "保險補充計算" },
            { href: "/tools/conditions", icon: "hospital", label: "疾病照顧檔案" },
            { href: "/tools/caregiverhealth", icon: "users", label: "倦怠檢測" },
            { href: "/tools/reablement", icon: "sparkles", label: "復能任務卡" },
          ] as { href: string; icon: IconName; label: string }[]).map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="section-surface rounded-[18px] p-4 text-center hover:shadow-apple-warm hover:border-orange-100 transition-all group"
            >
              <div className="mb-2 flex justify-center text-amber-600"><Icon name={tool.icon} size={30} /></div>
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

      {/* ====== 照顧日記 AI 亮點 ====== */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <Link href="/diary" className="block rounded-[28px] overflow-hidden group">
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8 sm:p-10 text-center border border-orange-200/60">
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-amber-600 mb-2">別家沒有的</p>
            <h3 className="text-[22px] sm:text-[26px] font-bold text-apple-gray-900 mb-3">
              不只試算，還陪你每天記錄
            </h3>
            <p className="text-[15px] text-apple-gray-600 leading-relaxed max-w-lg mx-auto mb-6">
              照顧是每天的事。每天花 1 分鐘記下長輩的食慾、精神和狀況，週末 AI 幫你整理成摘要，變化不對勁會提醒你回診時跟醫生提。
            </p>
            <span className="inline-flex items-center justify-center rounded-full bg-apple-orange px-6 py-3 text-[15px] font-bold text-white shadow-md group-hover:shadow-lg transition-shadow">
              開始寫照顧日記 →
            </span>
          </div>
        </Link>
      </section>

      {/* ====== TRUST / FOOTER ====== */}
      <section className="max-w-2xl mx-auto px-4 text-center pb-12">
        <div className="section-surface rounded-[20px] p-6">
          <p className="text-[14px] text-amber-800/60 leading-relaxed">
            政策資料最後核對：<strong>{POLICY_VERSION}</strong>。依據衛福部公開資料，實際補助仍以照管中心核定為準。<a href={POLICY_SOURCES.longTermCare} target="_blank" rel="noopener noreferrer" className="font-semibold text-apple-orange hover:underline underline-offset-2">查看官方額度表</a>，或撥打 <a href="tel:1966" className="font-bold text-apple-orange hover:underline underline-offset-2">1966</a>。
          </p>
        </div>
      </section>

      {/* CMS Estimator Modal */}
      {showEstimatorModal && (
        <CMSEstimator
          onComplete={(level) => {
            setCmsLevel(level);
            setShowEstimatorModal(false);
            if (estimatorFromWizard) {
              setWizardCmsSignal(level);
              setEstimatorFromWizard(false);
            }
          }}
          onCancel={() => { setShowEstimatorModal(false); setEstimatorFromWizard(false); }}
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
        transportRegion={transportRegion}
        assistiveDeviceGroup={assistiveDeviceGroup}
        initialSelectedPathway={selectedPathway}
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
          <h2 className="text-[24px] font-bold text-apple-gray-900">客製化你的服務計畫</h2>
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
        transportRegion={transportRegion}
        assistiveDeviceGroup={assistiveDeviceGroup}
      />
    );
  };

  // ========== MAIN RENDER ========== //
  return (
    <main className="min-h-screen">
      {currentStep !== 'landing' && renderFlowFrame(false)}

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
