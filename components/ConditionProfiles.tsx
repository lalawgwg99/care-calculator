"use client";

import { useState } from "react";
import { CONDITION_PROFILES, type ConditionProfile } from "@/constants/conditionData";

export default function ConditionProfiles() {
  const [selected, setSelected] = useState<string | null>(null);

  const profile = CONDITION_PROFILES.find((c) => c.id === selected);

  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-5 border-b border-purple-100/50">
        <div className="flex items-center gap-3">
          <span className="text-[28px]">🫀</span>
          <div>
            <h2 className="text-[18px] font-bold text-apple-gray-900">疾病照顧檔案</h2>
            <p className="text-[13px] text-purple-800/60 mt-0.5">選擇疾病類型，了解照顧要點</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Disease Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {CONDITION_PROFILES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-[16px] border-2 transition-all ${
                selected === c.id
                  ? `${c.bgColor} border-current shadow-md`
                  : "bg-apple-gray-50 border-apple-gray-200 hover:border-apple-gray-300"
              }`}
            >
              <span className="text-[28px]">{c.icon}</span>
              <span className={`text-[13px] font-semibold ${selected === c.id ? c.color : "text-apple-gray-700"}`}>
                {c.name}
              </span>
            </button>
          ))}
        </div>

        {/* Profile Detail */}
        {profile && (
          <div className={`rounded-[20px] border p-5 space-y-5 ${profile.bgColor}`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[22px]">{profile.icon}</span>
                <h3 className={`text-[17px] font-bold ${profile.color}`}>{profile.name}</h3>
                <span className="text-[13px] text-apple-gray-400">{profile.englishName}</span>
              </div>
              <p className="text-[13px] text-apple-gray-500 mb-2">📊 盛行率：{profile.prevalence}</p>
              <p className="text-[14px] text-apple-gray-700 leading-relaxed">{profile.description}</p>
            </div>

            {/* CMS Progression */}
            <div>
              <div className="text-[13px] font-semibold text-apple-gray-600 mb-3">📈 病程與 CMS 等級進展</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {(["early", "moderate", "advanced"] as const).map((stage) => {
                  const s = profile.cmsProgression[stage];
                  const labels = { early: "早期", moderate: "中期", advanced: "晚期" };
                  const colors = { early: "bg-emerald-100 text-emerald-800", moderate: "bg-amber-100 text-amber-800", advanced: "bg-rose-100 text-rose-800" };
                  return (
                    <div key={stage} className={`rounded-[14px] p-3 ${colors[stage]}`}>
                      <div className="font-semibold text-[12px] mb-1">{labels[stage]} · {s.range}</div>
                      <div className="text-[12px] leading-relaxed opacity-90">{s.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Needs */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[13px] font-semibold text-apple-gray-600 mb-2">⭐ 特殊照護需求</div>
                <ul className="space-y-1">
                  {profile.specialNeeds.map((n, i) => (
                    <li key={i} className="text-[13px] text-apple-gray-700 flex gap-2">
                      <span className="text-apple-gray-400 shrink-0">•</span>{n}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-apple-gray-600 mb-2">🏥 建議申請服務</div>
                <ul className="space-y-1">
                  {profile.recommendedServices.map((s, i) => (
                    <li key={i} className="text-[13px] text-apple-gray-700 flex gap-2">
                      <span className="text-emerald-500 shrink-0">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/70 rounded-[16px] p-4">
              <div className="text-[13px] font-semibold text-apple-gray-600 mb-2">💡 照顧者小提醒</div>
              {profile.caregiverTips.map((t, i) => (
                <p key={i} className="text-[13px] text-apple-gray-700 mb-1">· {t}</p>
              ))}
            </div>

            {/* Red Flags */}
            <div className="bg-red-50 border border-red-100 rounded-[16px] p-4">
              <div className="text-[13px] font-semibold text-red-700 mb-2">🚨 需立即就醫的警示症狀</div>
              <div className="flex flex-wrap gap-2">
                {profile.redFlags.map((f, i) => (
                  <span key={i} className="text-[12px] bg-red-100 text-red-700 px-2 py-1 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {!selected && (
          <div className="text-center py-8 text-apple-gray-400 text-[14px]">
            請選擇疾病類型以查看詳細照顧指引
          </div>
        )}
      </div>
    </div>
  );
}
