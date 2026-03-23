"use client";

import { useState } from "react";

interface Question {
  text: string;
  category: "physical" | "emotional" | "social" | "financial";
}

const QUESTIONS: Question[] = [
  { text: "覺得睡眠嚴重不足，常常半夜醒來", category: "physical" },
  { text: "身體出現新的疼痛或不適（頭痛、腰痛、胃痛）", category: "physical" },
  { text: "對長輩失去耐心後，感到強烈的愧疚", category: "emotional" },
  { text: "覺得不管怎麼努力，狀況都不會變好", category: "emotional" },
  { text: "心裡想過「如果長輩不在了，我就解脫了」然後為此自責", category: "emotional" },
  { text: "社交生活幾乎消失，很久沒見朋友了", category: "social" },
  { text: "覺得其他家人都不夠幫忙，只有自己在扛", category: "social" },
  { text: "為了照顧費用感到焦慮或壓力", category: "financial" },
  { text: "曾經考慮辭職來全職照顧", category: "financial" },
  { text: "覺得自己的人生被「照顧」這件事綁住了", category: "emotional" },
];

const ANSWER_OPTIONS = [
  { label: "從不", value: 0 },
  { label: "偶爾", value: 1 },
  { label: "經常", value: 2 },
  { label: "總是", value: 3 },
];

const RESULT_LEVELS = [
  {
    min: 0,
    max: 10,
    level: "low" as const,
    title: "目前狀況良好",
    emoji: "💚",
    color: "text-apple-green",
    bg: "bg-green-50",
    message: "你目前的壓力在可控範圍內。繼續保持，也別忘了定期給自己充電。",
  },
  {
    min: 11,
    max: 18,
    level: "medium" as const,
    title: "中度負荷，需要注意",
    emoji: "💛",
    color: "text-amber-600",
    bg: "bg-amber-50",
    message: "你已經承受了不少壓力。建議開始使用喘息服務，讓自己有固定的休息時間。照顧者也需要被照顧。",
  },
  {
    min: 19,
    max: 24,
    level: "high" as const,
    title: "高度負荷，請尋求支援",
    emoji: "🧡",
    color: "text-apple-orange",
    bg: "bg-orange-50",
    message: "你的壓力指數偏高。這不是你不夠堅強，而是照顧的負擔本來就不該一個人扛。請務必善用喘息服務、聯繫家屬支持團體。",
  },
  {
    min: 25,
    max: 30,
    level: "critical" as const,
    title: "燃盡警報，請立即求助",
    emoji: "❤️",
    color: "text-apple-red",
    bg: "bg-red-50",
    message: "你的身心已經處於高度透支狀態。這不是你的錯。請立刻撥打照顧者專線 0800-507-272，或聯繫鄰近的家庭照顧者支持中心。你值得被幫助。",
  },
];

const CATEGORY_LABELS = {
  physical: { label: "身體健康", icon: "🏥" },
  emotional: { label: "情緒狀態", icon: "💭" },
  social: { label: "社交生活", icon: "👥" },
  financial: { label: "經濟壓力", icon: "💰" },
};

export default function BurnoutCheckPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const totalScore = answers.reduce((s, v) => s + v, 0);
  const resultLevel = RESULT_LEVELS.find((r) => totalScore >= r.min && totalScore <= r.max) || RESULT_LEVELS[0];

  const categoryScores = (Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((cat) => {
    const catQuestions = QUESTIONS.map((q, i) => ({ ...q, index: i })).filter((q) => q.category === cat);
    const catScore = catQuestions.reduce((s, q) => s + (answers[q.index] || 0), 0);
    const maxScore = catQuestions.length * 3;
    return {
      ...CATEGORY_LABELS[cat],
      category: cat,
      score: catScore,
      maxScore,
      percentage: maxScore > 0 ? Math.round((catScore / maxScore) * 100) : 0,
    };
  });

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentQ + 1 >= QUESTIONS.length) {
      setCompleted(true);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  // ========== QUESTION VIEW ==========
  if (!completed) {
    return (
      <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-16 pb-24 px-4">
        <div className="max-w-lg mx-auto">
          <a href="/" className="inline-flex items-center gap-2 text-[14px] text-apple-gray-500 hover:text-apple-gray-900 mb-6">← 回到試算引擎</a>

          {currentQ === 0 && (
            <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden mb-6">
              <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-8 text-center">
                <div className="text-[48px] mb-4">💛</div>
                <h1 className="text-[28px] font-bold text-apple-gray-900 mb-3">照顧者壓力自我檢測</h1>
                <p className="text-[15px] text-rose-800/70 leading-relaxed">
                  10 個問題，1 分鐘完成。<br />
                  照顧別人之前，先看看自己還好嗎。
                </p>
              </div>
              <div className="p-6">
                <p className="text-[13px] text-apple-gray-500 leading-relaxed text-center">
                  改編自國際照顧者負荷量表 (ZBI)。此量表僅供自我覺察參考，不能取代專業診斷。
                </p>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 bg-apple-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-orange-400 transition-all duration-300 rounded-full"
                style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span className="text-[13px] text-apple-gray-500 font-mono">{currentQ + 1}/{QUESTIONS.length}</span>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-[24px] shadow-sm border border-apple-gray-200/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[14px]">{CATEGORY_LABELS[QUESTIONS[currentQ].category].icon}</span>
              <span className="text-[12px] text-apple-gray-500 font-medium">
                {CATEGORY_LABELS[QUESTIONS[currentQ].category].label}
              </span>
            </div>
            <p className="text-[17px] font-semibold text-apple-gray-900 mb-6 leading-relaxed">
              最近兩週，你是否<br />
              <span className="text-rose-600">「{QUESTIONS[currentQ].text}」</span>？
            </p>

            <div className="grid grid-cols-4 gap-2">
              {ANSWER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="py-3 px-2 rounded-[14px] border-2 border-apple-gray-200/60 hover:border-rose-300 hover:bg-rose-50/30 transition-all text-center"
                >
                  <div className="text-[15px] font-semibold text-apple-gray-800">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ========== RESULT VIEW ==========
  return (
    <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-12 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Score card */}
        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden">
          <div className={`${resultLevel.bg} p-8 text-center`}>
            <div className="text-[56px] mb-2">{resultLevel.emoji}</div>
            <h2 className={`text-[24px] font-bold ${resultLevel.color} mb-1`}>{resultLevel.title}</h2>
            <p className="text-[36px] font-mono font-bold text-apple-gray-900">
              {totalScore} <span className="text-[16px] text-apple-gray-500">/ 30</span>
            </p>
          </div>

          <div className="p-6">
            <p className="text-[14px] text-apple-gray-700 leading-relaxed mb-6">{resultLevel.message}</p>

            {/* Category breakdown */}
            <div className="space-y-3">
              {categoryScores.map((cat) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <span className="text-[16px] w-6">{cat.icon}</span>
                  <span className="text-[13px] text-apple-gray-700 w-16">{cat.label}</span>
                  <div className="flex-1 h-2.5 bg-apple-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.percentage > 66 ? "bg-apple-red" : cat.percentage > 33 ? "bg-apple-orange" : "bg-apple-green"
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-mono text-apple-gray-500 w-8 text-right">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-[24px] border border-apple-gray-200/60 p-6 shadow-sm">
          <h4 className="text-[15px] font-bold text-apple-gray-900 mb-4">照顧者支援資源</h4>
          <div className="space-y-3">
            <a href="tel:0800507272" className="flex items-center gap-3 p-4 rounded-[14px] bg-rose-50/60 border border-rose-100/50 hover:bg-rose-50 transition-colors">
              <span className="text-[22px]">📞</span>
              <div>
                <p className="text-[14px] font-semibold text-rose-900">家庭照顧者關懷專線</p>
                <p className="text-[13px] text-rose-700/70">0800-507-272（免費）</p>
              </div>
            </a>
            <a href="tel:1966" className="flex items-center gap-3 p-4 rounded-[14px] bg-green-50/60 border border-green-100/50 hover:bg-green-50 transition-colors">
              <span className="text-[22px]">🏥</span>
              <div>
                <p className="text-[14px] font-semibold text-green-900">申請喘息服務</p>
                <p className="text-[13px] text-green-700/70">撥打 1966 長照專線</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-4 rounded-[14px] bg-blue-50/60 border border-blue-100/50">
              <span className="text-[22px]">👥</span>
              <div>
                <p className="text-[14px] font-semibold text-blue-900">家屬支持團體</p>
                <p className="text-[13px] text-blue-700/70">各縣市家庭照顧者支持中心，定期舉辦紓壓活動</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              const summary = [
                `💛 照顧者壓力自我檢測結果`,
                ``,
                `${resultLevel.emoji} ${resultLevel.title}`,
                `壓力指數：${totalScore}/30`,
                ``,
                `📞 照顧者專線 0800-507-272`,
                `📞 長照專線 1966`,
                ``,
                `你也來測測看 👉 長照 3.0 財務決策引擎`,
              ].join("\n");
              if (navigator.share) {
                navigator.share({ title: "照顧者壓力檢測", text: summary }).catch(() => {});
              } else {
                navigator.clipboard.writeText(summary).then(() => alert("已複製到剪貼簿！"));
              }
            }}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[16px] font-bold rounded-full shadow-lg shadow-rose-200/50"
          >
            📤 分享結果
          </button>
          <button
            onClick={() => { setCompleted(false); setCurrentQ(0); setAnswers([]); }}
            className="w-full py-4 bg-white text-rose-700 text-[16px] font-bold rounded-full border-2 border-rose-200 hover:bg-rose-50 transition-colors"
          >
            🔄 重新測試
          </button>
          <a
            href="/"
            className="w-full py-4 bg-apple-gray-50 text-apple-gray-700 text-[16px] font-semibold rounded-full border border-apple-gray-200/60 text-center hover:bg-apple-gray-100 transition-colors"
          >
            ← 回到試算引擎
          </a>
        </div>
      </div>
    </main>
  );
}
