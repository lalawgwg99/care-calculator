"use client";

import { useState, useMemo } from "react";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

// TODO: 申請到聯盟帳號後，替換為帶有 tracking 參數的實際 affiliate URL
const AFFILIATE_LINKS = {
  ltc: "https://www.comparemo.com.tw/ltc?ref=care-calculator",
  disability: "https://www.comparemo.com.tw/disability?ref=care-calculator",
};

function fmt(n: number) {
  return new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(Math.round(n));
}

const CMS_TYPICAL_COSTS: Record<number, number> = {
  2: 12000, 3: 18000, 4: 25000, 5: 32000, 6: 42000, 7: 55000, 8: 70000,
};
const CMS_GOV_SUBSIDY: Record<number, number> = {
  2: 8417, 3: 12986, 4: 15607, 5: 20244, 6: 23579, 7: 26956, 8: 30391,
};

export default function InsuranceAddon() {
  const [cmsLevel, setCmsLevel] = useState(4);
  const [insurance, setInsurance] = useState(10000);
  const [incomeType, setIncomeType] = useState<"general" | "mid-low" | "low">("general");

  const copayRate = incomeType === "general" ? 0.84 : incomeType === "mid-low" ? 0.16 : 0;

  const govSubsidy = useMemo(() => {
    const base = CMS_GOV_SUBSIDY[cmsLevel] ?? 0;
    return base;
  }, [cmsLevel]);

  const totalCost = CMS_TYPICAL_COSTS[cmsLevel] ?? 0;
  const outOfPocket = Math.round(totalCost * copayRate);
  const covered = govSubsidy + insurance;
  const gap = Math.max(0, outOfPocket - insurance);
  const coverRate = Math.min(100, Math.round((covered / totalCost) * 100));

  const bars = [
    { label: "政府補助", value: govSubsidy, color: "bg-emerald-400", textColor: "text-emerald-700" },
    { label: "保險補充", value: insurance, color: "bg-blue-400", textColor: "text-blue-700" },
    { label: "自付缺口", value: gap, color: "bg-rose-300", textColor: "text-rose-700" },
  ];
  const maxBar = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-indigo-100/50">
        <div className="flex items-center gap-3">
          <span className="text-[28px]">🛡️</span>
          <div>
            <h2 className="text-[18px] font-bold text-apple-gray-900">保險補充計算</h2>
            <p className="text-[13px] text-blue-800/60 mt-0.5">估算私人保險能填補多少長照缺口</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* CMS Level */}
        <div>
          <label className="block text-[14px] font-semibold text-apple-gray-700 mb-2">失能等級 (CMS)</label>
          <div className="flex gap-2 flex-wrap">
            {[2, 3, 4, 5, 6, 7, 8].map((l) => (
              <button
                key={l}
                onClick={() => setCmsLevel(l)}
                className={`w-10 h-10 rounded-full text-[14px] font-semibold transition-all ${
                  cmsLevel === l
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Income */}
        <div>
          <label className="block text-[14px] font-semibold text-apple-gray-700 mb-2">收入身份</label>
          <div className="flex gap-2">
            {(["general", "mid-low", "low"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setIncomeType(t)}
                className={`flex-1 py-2 rounded-[12px] text-[13px] font-medium transition-all ${
                  incomeType === t ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {t === "general" ? "一般戶" : t === "mid-low" ? "中低收入" : "低收入戶"}
              </button>
            ))}
          </div>
        </div>

        {/* Insurance amount slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[14px] font-semibold text-apple-gray-700">每月保險給付</label>
            <span className="text-[15px] font-bold text-blue-600">{fmt(insurance)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={50000}
            step={1000}
            value={insurance}
            onChange={(e) => setInsurance(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-[12px] text-apple-gray-400 mt-1">
            <span>$0</span><span>$50,000</span>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-apple-gray-50 rounded-[20px] p-4 space-y-3">
          <div className="text-[13px] font-semibold text-apple-gray-600 mb-3">每月費用結構（CMS {cmsLevel}）</div>
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-[13px] mb-1">
                <span className={`font-medium ${bar.textColor}`}>{bar.label}</span>
                <span className="font-semibold text-apple-gray-700">{fmt(bar.value)}</span>
              </div>
              <div className="h-3 bg-apple-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${bar.color} rounded-full transition-all duration-500`}
                  style={{ width: `${(bar.value / maxBar) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className={`rounded-[16px] p-4 ${coverRate >= 80 ? "bg-emerald-50 border border-emerald-100" : coverRate >= 50 ? "bg-amber-50 border border-amber-100" : "bg-rose-50 border border-rose-100"}`}>
          <div className="text-[13px] text-apple-gray-500 mb-1">保障覆蓋率</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-[32px] font-bold ${coverRate >= 80 ? "text-emerald-600" : coverRate >= 50 ? "text-amber-600" : "text-rose-600"}`}>
              {coverRate}%
            </span>
            <span className="text-[13px] text-apple-gray-500">
              {coverRate >= 80 ? "保障充足 ✓" : coverRate >= 50 ? "建議增加保障" : "缺口偏大，建議規劃"}
            </span>
          </div>
          {gap > 0 && (
            <p className="text-[13px] text-rose-700 mt-2">
              每月仍需自付約 <strong>{fmt(gap)}</strong>，可考慮增加長照險保額。
            </p>
          )}
        </div>

        {/* ====== 保險聯盟 CTA ====== */}
        {gap > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[20px] border border-blue-100/60 p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-[22px] flex-shrink-0">💡</span>
              <div>
                <p className="text-[15px] font-bold text-apple-gray-900 mb-1">
                  填補缺口：您還差 <span className="text-blue-600">{fmt(gap)} / 月</span>
                </p>
                <p className="text-[13px] text-apple-gray-500 leading-relaxed">
                  現有保障不足以覆蓋自付費用。以下是適合您情況的長照保障方案供參考：
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
              <a
                href={AFFILIATE_LINKS.ltc}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white border border-blue-200 rounded-full text-[14px] font-semibold text-blue-700 hover:bg-blue-50 shadow-sm transition-all"
                onClick={() => window.gtag?.('event', 'insurance_cta_click', {
                  insurance_type: 'ltc', gap_amount: gap, cms_level: cmsLevel,
                })}
              >
                🔍 比較長照險方案 →
              </a>
              <a
                href={AFFILIATE_LINKS.disability}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white border border-blue-200 rounded-full text-[14px] font-semibold text-blue-700 hover:bg-blue-50 shadow-sm transition-all"
                onClick={() => window.gtag?.('event', 'insurance_cta_click', {
                  insurance_type: 'disability', gap_amount: gap, cms_level: cmsLevel,
                })}
              >
                🔍 比較失能險 →
              </a>
            </div>

            <p className="text-[11px] text-apple-gray-400 leading-relaxed">
              以上為合作夥伴推薦連結，點擊可能使本站獲得少量佣金，不影響您的費用與選擇。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
