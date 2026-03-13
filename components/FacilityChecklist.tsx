"use client";

import { useState } from "react";
import { type ConditionId, CONDITION_PROFILES } from "@/lib/conditionProfiles";

interface FacilityChecklistProps {
  selectedConditions: ConditionId[];
}

interface CheckItem {
  text: string;
  checked: boolean;
}

const BASE_CHECKLIST = [
  { category: "基本照顧", items: [
    "長輩身上乾淨、無異味",
    "指甲有修剪",
    "床單看起來有定期更換",
    "尿布有及時更換（無紅疹）",
  ]},
  { category: "飲食品質", items: [
    "餐點看起來新鮮、份量足夠",
    "有提供適合長輩的食物質地",
    "水分攝取充足（水杯有水）",
  ]},
  { category: "環境安全", items: [
    "走廊和房間沒有障礙物",
    "浴室有扶手和防滑設施",
    "緊急呼叫鈴在長輩伸手可及處",
  ]},
  { category: "人員態度", items: [
    "護理師能叫出長輩的名字",
    "工作人員態度親切、有耐心",
    "有定時帶長輩出房間活動",
  ]},
  { category: "精神狀態", items: [
    "長輩看起來情緒穩定",
    "沒有新的瘀青或無法解釋的傷口",
    "長輩見到你時有正面反應",
  ]},
];

export default function FacilityChecklist({ selectedConditions }: FacilityChecklistProps) {
  const [expanded, setExpanded] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);

  // 取得疾病專屬的檢核項目
  const diseaseSpecificItems = selectedConditions.flatMap((condId) => {
    const profile = CONDITION_PROFILES[condId];
    if (!profile || profile.warningSignsForFacility.length === 0) return [];
    return [{
      category: `${profile.icon} ${profile.name}專屬檢查`,
      items: profile.warningSignsForFacility,
    }];
  });

  const allCategories = [...BASE_CHECKLIST, ...diseaseSpecificItems];
  const totalItems = allCategories.reduce((s, c) => s + c.items.length, 0);
  const checkedCount = Object.values(checks).filter(Boolean).length;

  const toggleCheck = (key: string) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getScore = () => {
    if (totalItems === 0) return 0;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const score = getScore();
  const scoreColor = score >= 80 ? "text-apple-green" : score >= 60 ? "text-apple-orange" : "text-apple-red";
  const scoreLabel = score >= 80 ? "良好" : score >= 60 ? "需注意" : "需改善";

  return (
    <div className="bg-white rounded-[24px] border border-apple-gray-200/60 overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-[24px]">📋</span>
          <div className="text-left">
            <h4 className="text-[16px] font-bold text-apple-gray-900">機構探訪檢核表</h4>
            <p className="text-[13px] text-apple-gray-500">每次探望時花 3 分鐘勾一下，追蹤照顧品質</p>
          </div>
        </div>
        <span className={`text-apple-gray-400 text-[20px] transition-transform duration-300 ${expanded ? "rotate-45" : ""}`}>+</span>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 pb-6 space-y-4">
          {/* Visit date */}
          <div className="flex items-center gap-3 bg-apple-gray-50 rounded-[12px] p-3">
            <span className="text-[13px] text-apple-gray-600">探訪日期</span>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="bg-white border border-apple-gray-200/60 rounded-[8px] px-3 py-1.5 text-[14px] font-mono text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-orange/30"
            />
          </div>

          {/* Checklist categories */}
          {allCategories.map((category, ci) => (
            <div key={ci}>
              <h6 className="text-[13px] font-bold text-apple-gray-700 mb-2">{category.category}</h6>
              <div className="space-y-1">
                {category.items.map((item, ii) => {
                  const key = `${ci}-${ii}`;
                  const isChecked = checks[key] || false;
                  return (
                    <button
                      key={key}
                      onClick={() => toggleCheck(key)}
                      className={`w-full flex items-center gap-3 p-3 rounded-[10px] text-left transition-colors ${
                        isChecked ? "bg-green-50/60" : "bg-apple-gray-50/40 hover:bg-apple-gray-50"
                      }`}
                    >
                      <span className={`text-[16px] ${isChecked ? "text-apple-green" : "text-apple-gray-300"}`}>
                        {isChecked ? "✅" : "☐"}
                      </span>
                      <span className={`text-[13px] ${isChecked ? "text-green-800" : "text-apple-gray-700"}`}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Score summary */}
          <div className="bg-apple-gray-50 rounded-[16px] p-4 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-semibold text-apple-gray-700">本次探訪評分</span>
              <div className="flex items-center gap-2">
                <span className={`text-[24px] font-mono font-bold ${scoreColor}`}>{checkedCount}/{totalItems}</span>
                <span className={`text-[13px] font-medium px-2 py-0.5 rounded-full ${
                  score >= 80 ? "bg-green-100 text-green-700" : score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                }`}>
                  {scoreLabel}
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-apple-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  score >= 80 ? "bg-apple-green" : score >= 60 ? "bg-apple-orange" : "bg-apple-red"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Share */}
          <button
            onClick={() => {
              const summary = [
                `📋 機構探訪檢核結果`,
                `日期：${visitDate}`,
                `評分：${checkedCount}/${totalItems}（${scoreLabel}）`,
                ``,
                ...allCategories.map((cat) => {
                  const catItems = cat.items.map((item, ii) => {
                    const key = `${allCategories.indexOf(cat)}-${ii}`;
                    return `  ${checks[key] ? "✅" : "☐"} ${item}`;
                  });
                  return `${cat.category}\n${catItems.join("\n")}`;
                }),
              ].join("\n");

              if (navigator.share) {
                navigator.share({ title: "機構探訪檢核", text: summary }).catch(() => {});
              } else {
                navigator.clipboard.writeText(summary).then(() => alert("已複製到剪貼簿！"));
              }
            }}
            className="w-full py-3 bg-apple-gray-50 text-apple-gray-700 text-[14px] font-semibold rounded-full border border-apple-gray-200/60 hover:bg-apple-gray-100 transition-colors"
          >
            📤 傳給其他家人
          </button>
        </div>
      </div>
    </div>
  );
}
