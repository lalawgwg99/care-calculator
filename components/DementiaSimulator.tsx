"use client";

import { useState } from "react";

interface Scenario {
  id: number;
  situation: string;
  question: string;
  options: { text: string; score: number; insight: string }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: "早上七點，您醒來，看著天花板，試著想起今天是幾號、星期幾……",
    question: "在這個時刻，您腦海中的感受是什麼？",
    options: [
      { text: "想不起來，感到焦慮和不安，不知道該怎麼辦", score: 3, insight: "時間迷失是失智症早期症狀，讓患者感到極度困惑與焦慮。" },
      { text: "模糊地知道大概日期，稍微想想就想起來了", score: 1, insight: "輕度記憶困難，稍作提示即可定向，是早期常見現象。" },
      { text: "完全不知道，也不在乎，繼續待在床上", score: 2, insight: "對時間失去感知，同時情感平淡，常見於中度失智症患者。" },
    ],
  },
  {
    id: 2,
    situation: "家人叫您去吃早餐，您走向廚房，走到一半突然停下來……",
    question: "您停下來的原因最可能是？",
    options: [
      { text: "忘記自己要去哪裡，站在走廊中間不知所措", score: 3, insight: "「遺忘目的地」是失智症的典型行為，患者對此感到害怕和羞恥。" },
      { text: "想起要先去廁所，先去了再回來", score: 0, insight: "有意圖的行動改變，認知功能正常。" },
      { text: "被牆上的舊照片吸引，停下來端詳", score: 1, insight: "注意力分散是老化常見現象，但過度分散可能是早期信號。" },
    ],
  },
  {
    id: 3,
    situation: "吃飯時，家人問您昨天看了什麼電視節目……",
    question: "您的真實狀況是？",
    options: [
      { text: "完全記不得，即使昨天才看，也想不起任何片段", score: 3, insight: "短期記憶損失是阿茲海默症最核心的症狀，對患者日常生活影響深遠。" },
      { text: "記得看了電視，但忘記是什麼節目", score: 2, insight: "整體記憶保留，細節記憶減退，屬於中度記憶障礙。" },
      { text: "記得節目名稱，但忘記了幾個情節", score: 1, insight: "輕微記憶困難，屬於正常老化範疇，不一定是失智症。" },
    ],
  },
  {
    id: 4,
    situation: "下午，家人要帶您去熟悉的公園散步，但走到一半，您突然……",
    question: "您最可能出現的情況是？",
    options: [
      { text: "認不出這條路，覺得走錯了，想往回走回家", score: 3, insight: "地點迷失（空間定向障礙）讓患者在熟悉環境中也感到迷路，極度恐慌。" },
      { text: "走路比以前慢，容易覺得累，需要休息", score: 1, insight: "體力下降是老化現象，與認知障礙可能無關。" },
      { text: "覺得無聊，想早點回家", score: 0, insight: "情緒表達清晰，認知功能正常運作。" },
    ],
  },
  {
    id: 5,
    situation: "晚上，家人聚在一起，有人說了個大家都哈哈笑的笑話……",
    question: "您的反應是？",
    options: [
      { text: "沒有聽懂，跟著大家笑，但心裡其實很迷惑", score: 3, insight: "語言理解困難讓患者感到孤立，常以社交性微笑掩蓋不理解的困境。" },
      { text: "聽懂了笑話，跟大家一起笑，感到開心", score: 0, insight: "語言與社交功能完整，認知正常。" },
      { text: "大概聽懂了，但思考速度較慢，笑得稍慢", score: 1, insight: "認知速度減慢，是正常老化或輕度認知障礙的表現。" },
    ],
  },
];

const RESOURCES = [
  { icon: "📞", name: "長照專線 1966", desc: "免費諮詢長照服務" },
  { icon: "🏥", name: "失智症照顧資源中心", desc: "各縣市均有設置" },
  { icon: "👥", name: "家屬支持團體", desc: "與其他照顧者交流分享" },
  { icon: "📚", name: "台灣失智症協會", desc: "dementia.org.tw" },
];

export default function DementiaSimulator() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ score: number; insight: string }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const maxScore = SCENARIOS.length * 3;
  const empathyRate = Math.round(((maxScore - totalScore) / maxScore) * 100);

  const handleSelect = (optionIndex: number) => {
    setSelected(optionIndex);
  };

  const handleNext = () => {
    if (selected === null) return;
    const option = SCENARIOS[current].options[selected];
    const newAnswers = [...answers, { score: option.score, insight: option.insight }];
    setAnswers(newAnswers);
    setSelected(null);

    if (current + 1 >= SCENARIOS.length) {
      setPhase("result");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handleReset = () => {
    setPhase("intro");
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
  };

  const empathyLevel =
    empathyRate >= 80 ? { label: "深度同理", color: "text-purple-700", bg: "bg-purple-50" }
    : empathyRate >= 60 ? { label: "良好理解", color: "text-blue-700", bg: "bg-blue-50" }
    : empathyRate >= 40 ? { label: "初步認識", color: "text-amber-700", bg: "bg-amber-50" }
    : { label: "建議深入了解", color: "text-rose-700", bg: "bg-rose-50" };

  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-5 border-b border-purple-100/50">
        <div className="flex items-center gap-3">
          <span className="text-[28px]">🧠</span>
          <div>
            <h2 className="text-[18px] font-bold text-apple-gray-900">失智症體驗模擬</h2>
            <p className="text-[13px] text-purple-800/60 mt-0.5">體驗失智症長輩的日常挑戰，培養同理心</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Intro */}
        {phase === "intro" && (
          <div className="text-center space-y-5">
            <div className="text-[48px]">🌟</div>
            <h3 className="text-[20px] font-bold text-apple-gray-900">想像您是失智症患者</h3>
            <p className="text-[15px] text-apple-gray-600 max-w-md mx-auto leading-relaxed">
              接下來的 5 個情境，請試著以失智症患者的角度思考和感受。
              沒有標準答案——這個練習是為了幫助您更理解長輩的內心世界。
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-[16px] p-4 text-left">
              <p className="text-[13px] text-amber-800">
                ⚠️ 此工具僅為教育目的，幫助照顧者培養同理心，<strong>無法作為醫療診斷依據</strong>。
                若擔心家人認知狀況，請諮詢醫師。
              </p>
            </div>
            <button
              onClick={() => setPhase("quiz")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-8 py-3 rounded-full text-[15px] transition-colors shadow-md"
            >
              開始體驗 →
            </button>
          </div>
        )}

        {/* Quiz */}
        {phase === "quiz" && (
          <div>
            {/* Progress */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-2 bg-apple-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full transition-all"
                  style={{ width: `${((current) / SCENARIOS.length) * 100}%` }}
                />
              </div>
              <span className="text-[13px] text-apple-gray-400 shrink-0">
                {current + 1} / {SCENARIOS.length}
              </span>
            </div>

            {/* Scenario */}
            <div className="bg-purple-50 border border-purple-100 rounded-[20px] p-5 mb-5">
              <p className="text-[15px] text-purple-900 leading-relaxed italic">
                「{SCENARIOS[current].situation}」
              </p>
            </div>

            <p className="font-semibold text-[15px] text-apple-gray-900 mb-4">
              {SCENARIOS[current].question}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {SCENARIOS[current].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-[16px] border-2 transition-all text-[14px] leading-relaxed ${
                    selected === i
                      ? "border-purple-400 bg-purple-50 text-purple-800"
                      : "border-apple-gray-200 bg-apple-gray-50 hover:border-purple-200 text-apple-gray-700"
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            {/* Insight (show after selection) */}
            {selected !== null && (
              <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-[16px] p-4">
                <p className="text-[13px] text-indigo-800 leading-relaxed">
                  💡 <strong>洞察：</strong>{SCENARIOS[current].options[selected].insight}
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={selected === null}
              className={`mt-5 w-full py-3 rounded-full font-bold text-[15px] transition-all ${
                selected !== null
                  ? "bg-purple-500 hover:bg-purple-600 text-white shadow-md"
                  : "bg-apple-gray-100 text-apple-gray-400 cursor-not-allowed"
              }`}
            >
              {current + 1 < SCENARIOS.length ? "下一個情境 →" : "查看結果 →"}
            </button>
          </div>
        )}

        {/* Result */}
        {phase === "result" && (
          <div className="space-y-5">
            <div className={`rounded-[20px] p-5 text-center ${empathyLevel.bg}`}>
              <div className="text-[48px] mb-2">
                {empathyRate >= 80 ? "💜" : empathyRate >= 60 ? "💙" : empathyRate >= 40 ? "💛" : "🧡"}
              </div>
              <div className={`text-[28px] font-bold ${empathyLevel.color}`}>{empathyRate}%</div>
              <div className={`text-[16px] font-semibold ${empathyLevel.color} mb-2`}>
                同理心指數：{empathyLevel.label}
              </div>
              <p className="text-[13px] text-apple-gray-600 leading-relaxed">
                {empathyRate >= 80
                  ? "您展現了深刻的同理心，能夠理解失智症患者的內心困境。這樣的理解是給長輩最好的照顧基礎。"
                  : empathyRate >= 60
                  ? "您對失智症有基本的認識與同理。繼續學習，您將能給予長輩更貼心的照顧。"
                  : "失智症的世界對許多人來說很陌生。建議多了解相關知識，可以大大改善照顧品質。"}
              </p>
            </div>

            {/* Insights */}
            <div>
              <div className="text-[14px] font-semibold text-apple-gray-700 mb-3">您在每個情境的選擇讓您了解到：</div>
              <div className="space-y-2">
                {answers.map((a, i) => (
                  <div key={i} className="flex gap-3 bg-apple-gray-50 rounded-[14px] p-3">
                    <span className="text-[13px] text-purple-500 font-bold shrink-0">情境 {i + 1}</span>
                    <span className="text-[13px] text-apple-gray-600">{a.insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="text-[14px] font-semibold text-apple-gray-700 mb-3">推薦照顧資源</div>
              <div className="grid grid-cols-2 gap-2">
                {RESOURCES.map((r) => (
                  <div key={r.name} className="bg-purple-50 border border-purple-100 rounded-[14px] p-3">
                    <span className="text-[20px]">{r.icon}</span>
                    <div className="text-[13px] font-semibold text-purple-800 mt-1">{r.name}</div>
                    <div className="text-[12px] text-purple-600">{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-full border-2 border-purple-200 text-purple-600 font-semibold text-[14px] hover:bg-purple-50 transition-colors"
            >
              重新體驗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
