"use client";

import { useState } from "react";

interface Question {
  id: number;
  category: "emotional" | "physical" | "social";
  text: string;
}

const QUESTIONS: Question[] = [
  { id: 1, category: "emotional", text: "我常常感到精疲力竭，即使睡醒後也沒有恢復感" },
  { id: 2, category: "emotional", text: "我對照顧長輩這件事感到麻木或失去熱情" },
  { id: 3, category: "emotional", text: "我有時候會對長輩感到不耐煩或憤怒，並對此感到內疚" },
  { id: 4, category: "physical", text: "我的身體健康因照顧工作而受到影響（頭痛、失眠、背痛等）" },
  { id: 5, category: "physical", text: "我幾乎沒有時間照顧自己的飲食、運動或健康檢查" },
  { id: 6, category: "physical", text: "我長時間處於高度警覺狀態，無法真正放鬆" },
  { id: 7, category: "social", text: "我已經很長時間沒有參加自己喜歡的活動或見朋友" },
  { id: 8, category: "social", text: "我感到與外界脫節，沒有人真正理解我的處境" },
  { id: 9, category: "social", text: "我擔心自己的工作、財務或家庭關係因照顧而受損" },
  { id: 10, category: "emotional", text: "我有時候會有逃離或放棄一切的念頭" },
];

const SCALE = [
  { value: 1, label: "從不" },
  { value: 2, label: "偶爾" },
  { value: 3, label: "有時" },
  { value: 4, label: "經常" },
  { value: 5, label: "總是" },
];

const SUPPORT_RESOURCES = [
  { level: "all", icon: "📞", title: "長照喘息服務", desc: "申請短期替代照顧，給自己休息空間", action: "撥打 1966 申請" },
  { level: "medium", icon: "👥", title: "照顧者支持團體", desc: "與有相同處境的人交流，不再孤單", action: "詢問各縣市長照中心" },
  { level: "high", icon: "🧘", title: "心理諮商服務", desc: "專業心理師協助處理壓力與情緒", action: "衛福部安心專線 1925" },
  { level: "high", icon: "🏥", title: "照顧者健康檢查", desc: "關注自身健康，才能長期照顧長輩", action: "預約健康檢查" },
];

export default function BurnoutCheck() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [scores, setScores] = useState<Record<number, number>>({});

  const totalAnswered = Object.keys(scores).length;
  const totalScore = Object.values(scores).reduce((sum, v) => sum + v, 0);
  const maxPossible = QUESTIONS.length * 5;
  const burnoutRate = Math.round((totalScore / maxPossible) * 100);

  const categoryScores = {
    emotional: QUESTIONS.filter((q) => q.category === "emotional").map((q) => scores[q.id] ?? 0).reduce((a, b) => a + b, 0),
    physical: QUESTIONS.filter((q) => q.category === "physical").map((q) => scores[q.id] ?? 0).reduce((a, b) => a + b, 0),
    social: QUESTIONS.filter((q) => q.category === "social").map((q) => scores[q.id] ?? 0).reduce((a, b) => a + b, 0),
  };

  const burnoutLevel =
    burnoutRate >= 70 ? { label: "高度倦怠", color: "text-rose-700", bg: "bg-rose-50", emoji: "🆘", advice: "您正面臨嚴重的照顧倦怠，請立即尋求專業支持。照顧好自己，才能照顧長輩。" }
    : burnoutRate >= 45 ? { label: "中度倦怠", color: "text-amber-700", bg: "bg-amber-50", emoji: "⚠️", advice: "您已有明顯倦怠跡象。請積極利用喘息服務，並與家人分擔照顧責任。" }
    : { label: "低度風險", color: "text-emerald-700", bg: "bg-emerald-50", emoji: "✅", advice: "目前狀況還好，但請繼續關注自身健康，適時使用支持資源。" };

  const handleAnswer = (questionId: number, value: number) => {
    setScores((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = totalAnswered === QUESTIONS.length;

  const categoryLabels = { emotional: "情緒健康", physical: "身體健康", social: "社交健康" };
  const categoryMax = { emotional: 20, physical: 15, social: 15 };

  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-5 border-b border-rose-100/50">
        <div className="flex items-center gap-3">
          <span className="text-[28px]">💆</span>
          <div>
            <h2 className="text-[18px] font-bold text-apple-gray-900">照顧者倦怠檢測</h2>
            <p className="text-[13px] text-rose-800/60 mt-0.5">了解自己的身心狀態，適時尋求支持</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Intro */}
        {phase === "intro" && (
          <div className="text-center space-y-4">
            <div className="text-[48px]">🤗</div>
            <h3 className="text-[20px] font-bold text-apple-gray-900">您還好嗎？</h3>
            <p className="text-[15px] text-apple-gray-600 max-w-md mx-auto leading-relaxed">
              照顧家人是一份充滿愛的工作，但也可能讓自己身心俱疲。
              以下 10 個問題，幫助您評估目前的照顧壓力程度。
            </p>
            <div className="bg-pink-50 border border-pink-100 rounded-[16px] p-4 text-sm text-rose-800 text-left">
              此評估不作為醫療診斷，如有嚴重情緒困擾，請諮詢心理健康專業人員。
            </div>
            <button
              onClick={() => setPhase("quiz")}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3 rounded-full text-[15px] transition-colors shadow-md"
            >
              開始評估
            </button>
          </div>
        )}

        {/* Quiz */}
        {phase === "quiz" && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <div className="text-[14px] text-apple-gray-500">{totalAnswered} / {QUESTIONS.length} 題已完成</div>
              <div className="h-2 w-32 bg-apple-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full transition-all"
                  style={{ width: `${(totalAnswered / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-5">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="bg-apple-gray-50 rounded-[18px] p-4">
                  <p className="text-[14px] text-apple-gray-800 font-medium mb-3 leading-relaxed">
                    <span className="text-rose-400 font-bold mr-2">Q{q.id}.</span>
                    {q.text}
                  </p>
                  <div className="flex gap-2">
                    {SCALE.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => handleAnswer(q.id, s.value)}
                        className={`flex-1 py-2 rounded-[10px] text-[12px] font-medium transition-all ${
                          scores[q.id] === s.value
                            ? "bg-rose-500 text-white shadow-sm"
                            : "bg-white border border-apple-gray-200 text-apple-gray-600 hover:border-rose-200"
                        }`}
                      >
                        <div className="text-[10px] mb-0.5">{s.value}</div>
                        <div>{s.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPhase("result")}
              disabled={!allAnswered}
              className={`mt-6 w-full py-3 rounded-full font-bold text-[15px] transition-all ${
                allAnswered
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-md"
                  : "bg-apple-gray-100 text-apple-gray-400 cursor-not-allowed"
              }`}
            >
              {allAnswered ? "查看評估結果 →" : `還剩 ${QUESTIONS.length - totalAnswered} 題未完成`}
            </button>
          </div>
        )}

        {/* Result */}
        {phase === "result" && (
          <div className="space-y-5">
            <div className={`rounded-[20px] p-5 text-center ${burnoutLevel.bg}`}>
              <div className="text-[40px] mb-2">{burnoutLevel.emoji}</div>
              <div className={`text-[28px] font-bold ${burnoutLevel.color}`}>{burnoutRate}%</div>
              <div className={`text-[16px] font-semibold ${burnoutLevel.color} mb-2`}>
                倦怠指數：{burnoutLevel.label}
              </div>
              <p className="text-[13px] text-apple-gray-700 leading-relaxed max-w-sm mx-auto">
                {burnoutLevel.advice}
              </p>
            </div>

            {/* Category breakdown */}
            <div className="bg-apple-gray-50 rounded-[20px] p-4">
              <div className="text-[13px] font-semibold text-apple-gray-600 mb-3">各面向分析</div>
              {(["emotional", "physical", "social"] as const).map((cat) => {
                const score = categoryScores[cat];
                const max = categoryMax[cat];
                const pct = Math.round((score / max) * 100);
                const color = pct >= 70 ? "bg-rose-400" : pct >= 45 ? "bg-amber-400" : "bg-emerald-400";
                return (
                  <div key={cat} className="mb-3">
                    <div className="flex justify-between text-[13px] mb-1">
                      <span className="text-apple-gray-700">{categoryLabels[cat]}</span>
                      <span className="text-apple-gray-500">{score}/{max}</span>
                    </div>
                    <div className="h-2.5 bg-apple-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resources */}
            <div>
              <div className="text-[14px] font-semibold text-apple-gray-700 mb-3">建議支持資源</div>
              <div className="space-y-2">
                {SUPPORT_RESOURCES.filter((r) =>
                  r.level === "all" ||
                  (r.level === "medium" && burnoutRate >= 45) ||
                  (r.level === "high" && burnoutRate >= 70)
                ).map((r) => (
                  <div key={r.title} className="bg-rose-50 border border-rose-100 rounded-[14px] p-3 flex items-start gap-3">
                    <span className="text-[22px] shrink-0">{r.icon}</span>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-rose-800">{r.title}</div>
                      <div className="text-[12px] text-rose-600">{r.desc}</div>
                    </div>
                    <div className="text-[11px] text-rose-500 shrink-0 font-medium">{r.action}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setPhase("intro"); setScores({}); }}
              className="w-full py-3 rounded-full border-2 border-rose-200 text-rose-600 font-semibold text-[14px] hover:bg-rose-50 transition-colors"
            >
              重新評估
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
