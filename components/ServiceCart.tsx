"use client";

import { useState } from "react";

export interface CareServiceItem {
  id: string;
  code: string;
  name: string;
  cost: number;
}

interface ServiceCategory {
  label: string;
  icon: string;
  items: CareServiceItem[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    label: "居家照顧服務",
    icon: "🏠",
    items: [
      { id: "h1", code: "BA05", name: "基本日常照顧（洗澡、換衣、餵食）", cost: 500 },
      { id: "h2", code: "BA07", name: "陪同外出或就醫", cost: 680 },
      { id: "h3", code: "BA08", name: "家事服務（整理生活環境）", cost: 380 },
      { id: "h4", code: "BA11", name: "協助沐浴（到宅沐浴車）", cost: 325 },
      { id: "h5", code: "BA17", name: "餐食照顧（代購或備餐）", cost: 310 },
      { id: "h6", code: "BA12", name: "翻身拍背及肢體關節活動", cost: 195 },
    ],
  },
  {
    label: "專業服務",
    icon: "👩‍⚕️",
    items: [
      { id: "p1", code: "BD01", name: "護理師到宅評估指導", cost: 1250 },
      { id: "p2", code: "BD04", name: "物理 / 職能治療師到宅復健", cost: 1125 },
      { id: "p3", code: "BD07", name: "營養師到宅飲食指導", cost: 1000 },
      { id: "p4", code: "BD09", name: "藥師到宅用藥指導", cost: 800 },
      { id: "p5", code: "BD11", name: "心理師到宅心理諮商", cost: 1500 },
    ],
  },
  {
    label: "社區式服務",
    icon: "🏘️",
    items: [
      { id: "c1", code: "CA01", name: "日間照顧中心（全日）", cost: 1200 },
      { id: "c2", code: "CA02", name: "日間照顧中心（半日）", cost: 700 },
      { id: "c3", code: "CB01", name: "社區巷弄長照站課程", cost: 350 },
      { id: "c4", code: "CC01", name: "小規模多機能服務（整合包）", cost: 950 },
    ],
  },
];

const ALL_SERVICES = SERVICE_CATEGORIES.flatMap(c => c.items);

export interface ServiceCartProps {
  totalSubsidyMonthly: number;
  baseCopayRate: number;
}

export default function ServiceCart({ totalSubsidyMonthly, baseCopayRate }: ServiceCartProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [consumablesMonthly, setConsumablesMonthly] = useState(3000);
  const [expandedCategory, setExpandedCategory] = useState<number>(0);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalServiceCost = ALL_SERVICES.reduce((sum, item) => {
    return sum + (quantities[item.id] || 0) * item.cost;
  }, 0);

  const coveredBySubsidy = Math.min(totalServiceCost, totalSubsidyMonthly);
  const exceedingCost = Math.max(0, totalServiceCost - totalSubsidyMonthly);
  const requiredCopayForCovered = coveredBySubsidy * baseCopayRate;
  const finalOutOfPocket = requiredCopayForCovered + exceedingCost + consumablesMonthly;
  const subsidyUsagePercent = totalSubsidyMonthly > 0
    ? Math.min(100, Math.round((totalServiceCost / totalSubsidyMonthly) * 100))
    : 0;

  const selectedCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
    }).format(Math.round(amount));
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 sm:p-8 mt-6 border border-apple-gray-200/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-apple-gray-900 mb-1">
            長照服務購物車 🛒
          </h2>
          <p className="text-[15px] text-apple-gray-500">
            依照需求調配每月服務次數，即時查看自付額。
          </p>
        </div>
        <div className="bg-apple-gray-50 px-4 py-2 rounded-[12px] text-right flex-shrink-0">
          <div className="text-[13px] text-apple-gray-500 mb-0.5">剩餘政府額度</div>
          <div className={`text-[17px] font-mono font-bold ${
            totalSubsidyMonthly - coveredBySubsidy > 0 ? "text-apple-green" : "text-apple-red"
          }`}>
            {formatMoney(Math.max(0, totalSubsidyMonthly - coveredBySubsidy))}
          </div>
        </div>
      </div>

      {/* 額度使用進度條 */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-[13px] mb-1.5">
          <span className="text-apple-gray-500">已使用額度 {subsidyUsagePercent}%</span>
          <span className="text-apple-gray-500">
            {formatMoney(totalServiceCost)} / {formatMoney(totalSubsidyMonthly)}
          </span>
        </div>
        <div className="h-2 bg-apple-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              subsidyUsagePercent > 100 ? "bg-apple-red" : subsidyUsagePercent > 80 ? "bg-amber-400" : "bg-apple-green"
            }`}
            style={{ width: `${Math.min(100, subsidyUsagePercent)}%` }}
          />
        </div>
        {subsidyUsagePercent > 100 && (
          <p className="text-[12px] text-apple-red mt-1">
            ⚠ 已超出額度 {formatMoney(exceedingCost)}，超出部分需全額自付
          </p>
        )}
      </div>

      {/* Service Categories */}
      <div className="space-y-4 mb-8">
        {SERVICE_CATEGORIES.map((category, catIdx) => {
          const isExpanded = expandedCategory === catIdx;
          const categoryItemCount = category.items.reduce(
            (sum, item) => sum + (quantities[item.id] || 0),
            0
          );
          return (
            <div key={catIdx} className="rounded-[18px] border border-apple-gray-200/60 overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded ? -1 : catIdx)}
                className="w-full flex items-center justify-between p-4 bg-apple-gray-50/50 hover:bg-apple-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[18px]">{category.icon}</span>
                  <span className="text-[15px] font-bold text-apple-gray-900">{category.label}</span>
                  {categoryItemCount > 0 && (
                    <span className="text-[12px] font-bold bg-apple-blue/10 text-apple-blue px-2 py-0.5 rounded-full">
                      {categoryItemCount} 次
                    </span>
                  )}
                </div>
                <span className={`text-apple-gray-400 text-[16px] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-3 space-y-2">
                  {category.items.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 rounded-[14px] bg-white border border-apple-gray-100 hover:border-apple-gray-200 transition-colors">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-mono bg-apple-gray-200 text-apple-gray-600 px-1.5 py-0.5 rounded">{service.code}</span>
                          <span className="text-[14px] sm:text-[15px] font-semibold text-apple-gray-900 leading-tight">{service.name}</span>
                        </div>
                        <div className="text-[13px] text-apple-gray-500 font-mono">{formatMoney(service.cost)} / 次</div>
                      </div>
                      <div className="flex items-center gap-2 bg-apple-gray-50 rounded-full px-2 py-1 border border-apple-gray-200/60">
                        <button onClick={() => updateQuantity(service.id, -1)} disabled={!quantities[service.id]}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[18px] text-apple-blue disabled:text-apple-gray-300 transition-colors">−</button>
                        <div className="w-5 text-center text-[16px] font-semibold text-apple-gray-900 font-mono">{quantities[service.id] || 0}</div>
                        <button onClick={() => updateQuantity(service.id, 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[18px] text-apple-blue transition-colors">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====== Daily Consumables Slider ====== */}
      <div className="bg-amber-50/60 rounded-[20px] p-5 sm:p-6 border border-orange-100/50 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[22px]">🧴</span>
          <h4 className="text-[16px] font-bold text-apple-gray-900">日常耗材估算</h4>
        </div>
        <p className="text-[13px] text-amber-800/60 mb-4">
          尿布、護墊、管灌牛奶、傷口敷料等耗材費用<strong>不在政府補助範圍內</strong>，需全額自費。
        </p>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="range"
            min={0}
            max={8000}
            step={500}
            value={consumablesMonthly}
            onChange={(e) => setConsumablesMonthly(Number(e.target.value))}
            className="flex-1 accent-apple-orange h-2 rounded-full"
          />
          <div className="w-24 text-right text-[16px] font-mono font-bold text-apple-orange">
            {formatMoney(consumablesMonthly)}
          </div>
        </div>
        <div className="flex justify-between text-[12px] text-apple-gray-400">
          <span>$0（無需要）</span>
          <span>$8,000（重度需求）</span>
        </div>
        <p className="text-[12px] text-amber-800/50 mt-3">💡 一般家庭耗材費約 $3,000～$6,000/月</p>
      </div>

      {/* Summary */}
      <div className="border-t border-apple-gray-100 pt-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-apple-gray-500">
              長照服務自付（{selectedCount} 項，自付 {Math.round(baseCopayRate * 100)}%）
            </span>
            <span className="text-[16px] font-mono text-apple-gray-900">{formatMoney(requiredCopayForCovered)}</span>
          </div>
          {exceedingCost > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-apple-red">超出額度（全額自費）</span>
              <span className="text-[16px] font-mono text-apple-red">{formatMoney(exceedingCost)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-apple-gray-500">日常耗材（全額自費）</span>
            <span className="text-[16px] font-mono text-apple-gray-900">{formatMoney(consumablesMonthly)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-apple-gray-100">
          <span className="text-[18px] font-semibold text-apple-gray-900">每月實際自掏腰包</span>
          <span className="text-[28px] font-mono font-bold text-apple-red tracking-tight">
            {formatMoney(finalOutOfPocket)}
          </span>
        </div>
        <p className="text-[12px] text-apple-gray-400 text-right mt-2">
          (僅為模擬估算，實際費用依各縣市服務單位核定)
        </p>
      </div>
    </div>
  );
}
