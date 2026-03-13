"use client";

import { useState } from "react";
import { type ConditionId, CONDITION_PROFILES } from "@/lib/conditionProfiles";

interface CareTimelineProps {
  selectedConditions: ConditionId[];
  currentCmsLevel?: number;
}

export default function CareTimeline({ selectedConditions, currentCmsLevel }: CareTimelineProps) {
  const [expandedCondition, setExpandedCondition] = useState<ConditionId | null>(
    selectedConditions.length === 1 ? selectedConditions[0] : null
  );

  if (selectedConditions.length === 0) return null;

  return (
    <div className="bg-white rounded-[24px] border border-apple-gray-200/60 overflow-hidden shadow-sm">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[24px]">📅</span>
          <h4 className="text-[16px] font-bold text-apple-gray-900">照顧時間軸</h4>
        </div>
        <p className="text-[13px] text-apple-gray-500 ml-[36px]">
          根據疾病特性，看看未來每個階段該準備什麼
        </p>
      </div>

      <div className="px-6 pb-6 space-y-3 mt-3">
        {selectedConditions.map((condId) => {
          const profile = CONDITION_PROFILES[condId];
          if (!profile || profile.timeline.length === 0) return null;

          const isExpanded = expandedCondition === condId;

          return (
            <div key={condId} className="rounded-[16px] border border-apple-gray-200/40 overflow-hidden">
              <button
                onClick={() => setExpandedCondition(isExpanded ? null : condId)}
                className="w-full flex items-center justify-between p-4 hover:bg-apple-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[20px]">{profile.icon}</span>
                  <div className="text-left">
                    <span className="text-[15px] font-bold text-apple-gray-900">{profile.name}</span>
                    <p className="text-[12px] text-apple-gray-500">
                      平均病程 {profile.avgDurationYears[0]}-{profile.avgDurationYears[1]} 年 · {profile.timeline.length} 個階段
                    </p>
                  </div>
                </div>
                <span className={`text-apple-gray-400 text-[18px] transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`}>+</span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 pb-5">
                  {/* Trajectory description */}
                  <div className="bg-apple-gray-50/60 rounded-[12px] p-3 mb-4">
                    <p className="text-[13px] text-apple-gray-600 leading-relaxed">
                      {profile.description}
                    </p>
                    <p className="text-[12px] text-apple-orange font-medium mt-1">
                      💰 {profile.financialNote}
                    </p>
                  </div>

                  {/* Timeline phases */}
                  <div className="space-y-0">
                    {profile.timeline.map((phase, i) => {
                      const isCurrentPhase = currentCmsLevel !== undefined &&
                        currentCmsLevel >= phase.cmsRange[0] &&
                        currentCmsLevel <= phase.cmsRange[1];

                      const phaseColor = i === 0 ? "green" : i === profile.timeline.length - 1 ? "red" : "amber";
                      const dotColor = { green: "bg-apple-green", amber: "bg-apple-orange", red: "bg-apple-red" }[phaseColor];
                      const bgColor = { green: "bg-green-50/60", amber: "bg-amber-50/60", red: "bg-red-50/60" }[phaseColor];
                      const textColor = { green: "text-green-800", amber: "text-amber-800", red: "text-red-800" }[phaseColor];

                      return (
                        <div key={i} className="flex gap-3">
                          {/* Timeline line */}
                          <div className="flex flex-col items-center w-6">
                            <div className={`w-3 h-3 rounded-full ${dotColor} flex-shrink-0 ${isCurrentPhase ? "ring-4 ring-offset-1 ring-apple-orange/30" : ""}`} />
                            {i < profile.timeline.length - 1 && (
                              <div className="w-0.5 flex-1 bg-apple-gray-200 min-h-[20px]" />
                            )}
                          </div>

                          {/* Phase content */}
                          <div className={`flex-1 rounded-[14px] p-4 mb-3 ${isCurrentPhase ? "border-2 border-apple-orange/30 " + bgColor : bgColor}`}>
                            {isCurrentPhase && (
                              <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-apple-orange text-white font-bold">📍 你在這裡</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between mb-2">
                              <h6 className={`text-[14px] font-bold ${textColor}`}>{phase.phase}</h6>
                              <span className="text-[11px] text-apple-gray-500">
                                CMS {phase.cmsRange[0]}-{phase.cmsRange[1]} 級 · {phase.durationHint}
                              </span>
                            </div>

                            <div className="space-y-1.5 mb-3">
                              {phase.keyActions.map((action, j) => (
                                <div key={j} className="flex items-start gap-2 text-[13px]">
                                  <span className="text-apple-gray-400 mt-0.5">☐</span>
                                  <span className="text-apple-gray-700">{action}</span>
                                </div>
                              ))}
                            </div>

                            <div className="bg-white/60 rounded-[10px] px-3 py-2 border border-amber-200/30">
                              <p className="text-[12px] text-amber-800/80">
                                ⚠️ {phase.warning}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dietary flags */}
                  {profile.dietaryFlags.length > 0 && (
                    <div className="bg-sky-50/40 rounded-[12px] p-3 mt-2">
                      <p className="text-[12px] font-semibold text-sky-800 mb-1.5">🍽️ 飲食注意事項</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.dietaryFlags.map((flag, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100/60 text-sky-700">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
