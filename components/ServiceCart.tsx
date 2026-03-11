"use client";

import { useState } from "react";

export interface CareServiceItem {
  id: string;
  code: string;
  name: string;
  cost: number;
}

const AVAILABLE_SERVICES: CareServiceItem[] = [
  { id: "s1", code: "BA05", name: "基本日常照顧 (洗澡、換衣、餵食)", cost: 500 },
  { id: "s2", code: "BA07", name: "陪同外出或就醫", cost: 680 },
  { id: "s3", code: "BA08", name: "家事服務 (整理生活環境)", cost: 380 },
  { id: "s4", code: "BA11", name: "協助沐浴", cost: 325 },
  { id: "s5", code: "BA17", name: "餐食照顧 (代購或備餐)", cost: 310 },
];

export interface ServiceCartProps {
  totalSubsidyMonthly: number;
  baseCopayRate: number; // 照顧服務自付比例 (一般戶 16%, 中低 5%, 低 0%)
}

export default function ServiceCart({ totalSubsidyMonthly, baseCopayRate }: ServiceCartProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [consumablesMonthly, setConsumablesMonthly] = useState(3000);

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

  const totalServiceCost = AVAILABLE_SERVICES.reduce((sum, item) => {
    return sum + (quantities[item.id] || 0) * item.cost;
  }, 0);

  const coveredBySubsidy = Math.min(totalServiceCost, totalSubsidyMonthly);
  const exceedingCost = Math.max(0, totalServiceCost - totalSubsidyMonthly);
  const requiredCopayForCovered = coveredBySubsidy * baseCopayRate;
  // Consumables are always 100% out of pocket (not covered by long-care subsidy)
  const finalOutOfPocket = requiredCopayForCovered + exceedingCost + consumablesMonthly;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
    }).format(Math.round(amount));
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 sm:p-8 mt-6 border border-apple-gray-200/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-apple-gray-900 mb-1">
            長照服務購物車 🛒
          </h2>
          <p className="text-[15px] text-apple-gray-500">
            依照需求調配服務，即時查看自付額。
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

      {/* Service List */}
      <div className="space-y-3 mb-8">
        {AVAILABLE_SERVICES.map((service) => (
          <div key={service.id} className="flex items-center justify-between p-4 rounded-[16px] bg-apple-gray-50 border border-transparent hover:border-apple-gray-200 transition-colors">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-mono bg-apple-gray-200 text-apple-gray-600 px-2 py-0.5 rounded-md">{service.code}</span>
                <span className="text-[15px] sm:text-[16px] font-semibold text-apple-gray-900 leading-tight">{service.name}</span>
              </div>
              <div className="text-[14px] text-apple-gray-500 font-mono">{formatMoney(service.cost)} / 次</div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1 shadow-sm border border-apple-gray-200/60">
              <button onClick={() => updateQuantity(service.id, -1)} disabled={!quantities[service.id]}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[20px] text-apple-blue disabled:text-apple-gray-300 transition-colors">−</button>
              <div className="w-6 text-center text-[17px] font-semibold text-apple-gray-900 font-mono">{quantities[service.id] || 0}</div>
              <button onClick={() => updateQuantity(service.id, 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[20px] text-apple-blue transition-colors">+</button>
            </div>
          </div>
        ))}
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
            <span className="text-[15px] text-apple-gray-500">長照服務自付</span>
            <span className="text-[16px] font-mono text-apple-gray-900">{formatMoney(requiredCopayForCovered + exceedingCost)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-apple-gray-500">日常耗材（全額自費）</span>
            <span className="text-[16px] font-mono text-apple-gray-900">{formatMoney(consumablesMonthly)}</span>
          </div>
          {exceedingCost > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-apple-red">❗ 超出補助額度（全額自費）</span>
              <span className="text-[16px] font-mono text-apple-red">{formatMoney(exceedingCost)}</span>
            </div>
          )}
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
