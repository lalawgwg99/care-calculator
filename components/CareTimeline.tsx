"use client";

import { CARE_TIMELINE } from "@/constants/conditionData";
import type { ConditionId } from "@/lib/conditionProfiles";

function fmt(n: number) {
  return new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(n);
}

interface CareTimelineProps {
  selectedConditions?: ConditionId[];
  currentCmsLevel?: number;
}

export default function CareTimeline({ selectedConditions: _selectedConditions, currentCmsLevel: _currentCmsLevel }: CareTimelineProps) {
  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-6 py-5 border-b border-teal-100/50">
        <div className="flex items-center gap-3">
          <span className="text-[28px]">📅</span>
          <div>
            <h2 className="text-[18px] font-bold text-apple-gray-900">照顧歷程時間軸</h2>
            <p className="text-[13px] text-teal-800/60 mt-0.5">各階段照顧需求與費用預估</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[13px] text-apple-gray-500 mb-6 leading-relaxed">
          長照需求通常會隨時間增加。以下依 CMS 等級分為三個階段，幫助家庭提前規劃財務與照顧安排。
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-apple-gray-200 hidden sm:block" />

          <div className="space-y-4">
            {CARE_TIMELINE.map((stage, i) => (
              <div key={i} className="flex gap-4">
                {/* Circle */}
                <div className={`hidden sm:flex shrink-0 w-10 h-10 rounded-full border-2 items-center justify-center text-[14px] font-bold z-10 bg-white ${stage.color.includes("emerald") ? "border-emerald-400 text-emerald-600" : stage.color.includes("amber") ? "border-amber-400 text-amber-600" : "border-rose-400 text-rose-600"}`}>
                  {i + 1}
                </div>

                {/* Card */}
                <div className={`flex-1 rounded-[20px] border-2 p-4 ${stage.color}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-bold text-[16px]">{stage.stage}</div>
                      <div className="text-[13px] opacity-70">{stage.cmsRange} · 持續時間：{stage.duration}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] opacity-60 mb-0.5">月費估算</div>
                      <div className="font-bold text-[14px]">
                        {fmt(stage.monthlyCost.low)}
                      </div>
                      <div className="text-[11px] opacity-60">~ {fmt(stage.monthlyCost.high)}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[12px] font-semibold opacity-70 mb-2">主要照顧需求：</div>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.keyNeeds.map((need, j) => (
                        <span key={j} className="text-[12px] bg-white/60 px-2.5 py-1 rounded-full font-medium">
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mt-5 bg-amber-50 border border-amber-100 rounded-[16px] p-4">
          <p className="text-[13px] text-amber-800 leading-relaxed">
            💡 <strong>提醒：</strong>以上費用為估算範圍，實際費用依地區、照顧類型及個人需求而異。政府補助可降低約 30~50% 的自付費用。建議盡早透過首頁試算工具計算實際補助金額。
          </p>
        </div>
      </div>
    </div>
  );
}
