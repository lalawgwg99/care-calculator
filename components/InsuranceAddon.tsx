"use client";

import { useState, useMemo } from "react";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

// 保險合作方案：目前無。未來若有真實合作，在此補上實際連結後再渲染按鈕，
// 切勿先放佔位連結＋傭金聲明（虛假聲明會毀掉網站信任）。

function fmt(n: number) {
  return new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(Math.round(n));
}

const CMS_TYPICAL_COSTS: Record<number, number> = {
  2: 12000, 3: 18000, 4: 25000, 5: 32000, 6: 42000, 7: 55000, 8: 70000,
};
const CMS_GOV_SUBSIDY: Record<number, number> = {
  2: 8417, 3: 12986, 4: 15607, 5: 20244, 6: 23579, 7: 26956, 8: 30391,
};

interface InsuranceAddonProps {
  monthlyOutOfPocket?: number;
  monthlyGovSubsidy?: number;
}

export default function InsuranceAddon({
  monthlyOutOfPocket: _monthlyOutOfPocket,
  monthlyGovSubsidy: _monthlyGovSubsidy,
}: InsuranceAddonProps) {
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

        {/* ====== 保險缺口指引（中立資訊：本站目前沒有保險合作方案） ====== */}
        {gap > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[20px] border border-blue-100/60 p-5">
            <p className="text-[15px] font-bold text-apple-gray-900 mb-1">
              填補缺口：你還差 <span className="text-blue-600">{fmt(gap)} / 月</span>
            </p>
            <p className="text-[13px] text-apple-gray-500 leading-relaxed mb-4">
              現有保障不足以覆蓋自付費用。先搞懂兩種保單的差別，再去問業務員：
            </p>

            <div className="space-y-2.5 mb-4">
              <div className="bg-white/70 rounded-xl px-4 py-3">
                <p className="text-[13px] font-semibold text-apple-gray-900 mb-0.5">長照險</p>
                <p className="text-[13px] text-apple-gray-500 leading-relaxed">
                  符合保單條款的「長期照顧狀態」才理賠，多為分期給付，適合補每月的照顧缺口。
                </p>
              </div>
              <div className="bg-white/70 rounded-xl px-4 py-3">
                <p className="text-[13px] font-semibold text-apple-gray-900 mb-0.5">失能險</p>
                <p className="text-[13px] text-apple-gray-500 leading-relaxed">
                  按失能等級表理賠；舊式終身型多已停售，現售多為一年期附約，買前先問保費會不會隨年齡調漲。
                </p>
              </div>
            </div>

            <p className="text-[13px] font-semibold text-apple-gray-900 mb-2">問業務員的 3 個問題</p>
            <ol className="text-[13px] text-apple-gray-500 leading-relaxed list-decimal list-inside space-y-1.5 mb-4">
              <li>理賠看的是「失能等級」還是「長照狀態」？認定標準是什麼？</li>
              <li>理賠金一次給還是分期給？金額跟我每月 {fmt(gap)} 的缺口對得上嗎？</li>
              <li>保費固定還是會漲？要繳到幾歲？</li>
            </ol>

            <a
              href="https://www.ib.gov.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white border border-blue-200 rounded-full text-[14px] font-semibold text-blue-700 hover:bg-blue-50 shadow-sm transition-all"
            >
              金管會保險局 →
            </a>
            <p className="text-[11px] text-apple-gray-400 leading-relaxed mt-3">
              本站目前沒有保險合作方案，以上為中立資訊整理，實際商品以各保險公司條款為準。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
