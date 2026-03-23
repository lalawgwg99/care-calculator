"use client";

import { useState } from "react";
import { FACILITY_CHECKLIST } from "@/constants/conditionData";

export default function FacilityChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalItems = FACILITY_CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const score = Math.round((checkedCount / totalItems) * 100);

  const scoreInfo =
    score >= 80
      ? { label: "優良機構", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" }
      : score >= 60
      ? { label: "基本合格", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" }
      : score >= 40
      ? { label: "需再評估", color: "text-orange-600", bg: "bg-orange-50 border-orange-100" }
      : { label: "建議謹慎", color: "text-rose-600", bg: "bg-rose-50 border-rose-100" };

  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-5 border-b border-slate-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[28px]">📋</span>
            <div>
              <h2 className="text-[18px] font-bold text-apple-gray-900">機構評估清單</h2>
              <p className="text-[13px] text-slate-600/60 mt-0.5">參觀機構時逐項確認</p>
            </div>
          </div>
          {checkedCount > 0 && (
            <div className="text-right">
              <div className="text-[24px] font-bold text-apple-gray-900">{score}%</div>
              <div className={`text-[12px] font-semibold ${scoreInfo.color}`}>{scoreInfo.label}</div>
            </div>
          )}
        </div>
      </div>

      {/* Score bar */}
      {checkedCount > 0 && (
        <div className="px-5 pt-4">
          <div className="h-2 bg-apple-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 80 ? "bg-emerald-400" : score >= 60 ? "bg-amber-400" : "bg-rose-400"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="text-[12px] text-apple-gray-400 mt-1">{checkedCount} / {totalItems} 項已確認</div>
        </div>
      )}

      <div className="p-5 space-y-5">
        {FACILITY_CHECKLIST.map((cat) => {
          const catChecked = cat.items.filter((_, i) => checked[`${cat.category}-${i}`]).length;
          return (
            <div key={cat.category} className="bg-apple-gray-50 rounded-[20px] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[20px]">{cat.icon}</span>
                  <span className="font-semibold text-[14px] text-apple-gray-800">{cat.category}</span>
                </div>
                <span className="text-[12px] text-apple-gray-400">{catChecked}/{cat.items.length}</span>
              </div>
              <div className="space-y-2">
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  return (
                    <label key={i} className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={!!checked[key]}
                        onChange={() => toggleItem(key)}
                        className="mt-0.5 accent-blue-500 w-4 h-4 shrink-0"
                      />
                      <span className={`text-[13px] transition-colors leading-relaxed ${
                        checked[key] ? "line-through text-apple-gray-400" : "text-apple-gray-700 group-hover:text-apple-gray-900"
                      }`}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Result */}
        {checkedCount > 0 && (
          <div className={`rounded-[16px] border p-4 ${scoreInfo.bg}`}>
            <div className={`font-bold text-[15px] ${scoreInfo.color} mb-1`}>
              評估結果：{scoreInfo.label}（{score}%）
            </div>
            <p className="text-[13px] text-apple-gray-600">
              {score >= 80
                ? "這間機構在各項指標表現良好，可以進一步了解費用與入住條件。"
                : score >= 60
                ? "整體尚可，但建議針對未勾選項目進一步追問，確認是否符合長輩需求。"
                : score >= 40
                ? "有幾個重要面向需要確認，建議多參觀幾間機構再做比較。"
                : "目前勾選項目較少，建議多詢問未確認的項目，不要操之過急。"}
            </p>
          </div>
        )}

        <div className="text-[12px] text-apple-gray-400 text-center">
          此清單僅供參考，建議親自參觀並與家人討論後再做決定
        </div>
      </div>
    </div>
  );
}
