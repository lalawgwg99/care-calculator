"use client";

import { useState, useMemo } from "react";
import { SCENARIOS, SCORE_TITLES, type Scenario, type DialogOption } from "@/constants/dementiaScenarios";

type GameState = "intro" | "playing" | "feedback" | "result";

interface AnswerRecord {
  scenarioId: string;
  chosenIndex: number;
  stressDelta: number;
  technique: string;
}

function shuffleAndPick(arr: Scenario[], count: number): Scenario[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function DementiaSimPage() {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [stress, setStress] = useState(50); // Start at 50/100

  const currentScenario = scenarios[currentIndex];
  const totalQuestions = scenarios.length;

  const startGame = (difficulty: "easy" | "all") => {
    const pool = difficulty === "easy"
      ? SCENARIOS.filter((s) => s.difficulty <= 2)
      : SCENARIOS;
    const picked = shuffleAndPick(pool, 5);
    setScenarios(picked);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setStress(50);
    setGameState("playing");
  };

  const handleChoice = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);

    const option = currentScenario.options[optionIndex];
    const newStress = Math.max(0, Math.min(100, stress + option.stressDelta * 10));
    setStress(newStress);

    setAnswers((prev) => [
      ...prev,
      {
        scenarioId: currentScenario.id,
        chosenIndex: optionIndex,
        stressDelta: option.stressDelta,
        technique: option.technique,
      },
    ]);
    setGameState("feedback");
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setGameState("result");
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setGameState("playing");
    }
  };

  // Calculate final score
  const finalScore = useMemo(() => {
    if (answers.length === 0) return 0;
    const totalPossible = answers.length * 2; // best case: -2 per question
    const totalGot = answers.reduce((sum, a) => sum - a.stressDelta, 0);
    const normalized = Math.round(((totalGot + totalPossible) / (totalPossible * 2)) * 100);
    return Math.max(0, Math.min(100, normalized));
  }, [answers]);

  const scoreTitle = SCORE_TITLES.find((s) => finalScore >= s.min && finalScore <= s.max) || SCORE_TITLES[0];

  const goodAnswers = answers.filter((a) => a.stressDelta < 0).length;
  const badAnswers = answers.filter((a) => a.stressDelta > 1).length;

  // ========== INTRO ==========
  if (gameState === "intro") {
    return (
      <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-16 pb-24 px-4">
        <div className="max-w-lg mx-auto">
          <a href="/" className="inline-flex items-center gap-2 text-[14px] text-apple-gray-500 hover:text-apple-gray-900 mb-6">← 回到試算引擎</a>

          <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden">
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-8 text-center">
              <div className="text-[48px] mb-4">🧠</div>
              <h1 className="text-[28px] font-bold text-apple-gray-900 mb-3">失智溝通模擬器</h1>
              <p className="text-[15px] text-purple-800/70 leading-relaxed">
                長輩說「存摺被偷了」、「我要回家」，<br />
                你會怎麼回應？
              </p>
            </div>

            <div className="p-8 space-y-4">
              <div className="bg-purple-50/40 rounded-[16px] p-4">
                <p className="text-[14px] text-purple-800/80 leading-relaxed">
                  透過 <strong>5 個真實情境</strong>，學習專業照顧者的溝通技巧。
                  每個選擇都會影響你的「壓力值」，最後會得到你的照顧溝通力評分。
                </p>
              </div>

              <button
                onClick={() => startGame("easy")}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[16px] font-bold rounded-full shadow-lg shadow-purple-200/50 hover:shadow-xl transition-shadow"
              >
                🌱 初階挑戰（適合新手家屬）
              </button>
              <button
                onClick={() => startGame("all")}
                className="w-full py-4 bg-white text-purple-700 text-[16px] font-bold rounded-full border-2 border-purple-200 hover:bg-purple-50 transition-colors"
              >
                🔥 完整挑戰（含高難度情境）
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ========== PLAYING ==========
  if (gameState === "playing" && currentScenario) {
    const stressColor = stress > 70 ? "bg-apple-red" : stress > 40 ? "bg-apple-orange" : "bg-apple-green";

    return (
      <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-12 pb-24 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[14px] text-apple-gray-500">
              情境 {currentIndex + 1}/{totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-apple-gray-500">壓力值</span>
              <div className="w-24 h-2.5 bg-apple-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stressColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${stress}%` }}
                />
              </div>
              <span className="text-[13px] font-mono font-bold text-apple-gray-700">{stress}%</span>
            </div>
          </div>

          {/* Scenario Card */}
          <div className="bg-white rounded-[28px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden">
            {/* Context */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-purple-100/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                  {currentScenario.category}
                </span>
                <span className="text-[12px] text-purple-600/60">
                  {"⭐".repeat(currentScenario.difficulty)}
                </span>
              </div>
              <p className="text-[14px] text-purple-800/70">{currentScenario.context}</p>
            </div>

            {/* Elder speaks */}
            <div className="px-6 py-5">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[18px] flex-shrink-0">
                  👵
                </div>
                <div className="bg-amber-50 rounded-[16px] rounded-tl-[4px] px-4 py-3 border border-amber-100/50 flex-1">
                  <p className="text-[13px] text-amber-700/60 mb-1">{currentScenario.elderName}（{currentScenario.elderAge}歲）</p>
                  <p className="text-[16px] text-apple-gray-900 font-medium leading-relaxed">
                    「{currentScenario.elderSays}」
                  </p>
                </div>
              </div>

              {/* Options */}
              <p className="text-[14px] font-semibold text-apple-gray-700 mb-3">你會怎麼回應？</p>
              <div className="space-y-3">
                {currentScenario.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(i)}
                    className="w-full text-left p-4 rounded-[16px] border-2 border-apple-gray-200/60 hover:border-purple-300 hover:bg-purple-50/30 transition-all text-[14px] text-apple-gray-800 leading-relaxed"
                  >
                    <span className="text-purple-500 font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ========== FEEDBACK ==========
  if (gameState === "feedback" && currentScenario && selectedOption !== null) {
    const chosen = currentScenario.options[selectedOption];
    const isGood = chosen.stressDelta < 0;
    const isBad = chosen.stressDelta > 1;

    return (
      <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-12 pb-24 px-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Elder reaction */}
          <div className="bg-white rounded-[24px] shadow-sm border border-apple-gray-200/60 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[18px] flex-shrink-0">
                👵
              </div>
              <div className="bg-amber-50 rounded-[16px] rounded-tl-[4px] px-4 py-3 border border-amber-100/50 flex-1">
                <p className="text-[15px] text-apple-gray-800 leading-relaxed">{chosen.reaction}</p>
              </div>
            </div>

            {/* Stress change */}
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${isGood ? "bg-green-50 text-green-700" : isBad ? "bg-red-50 text-apple-red" : "bg-amber-50 text-amber-700"}`}>
              <span className="text-[18px]">{isGood ? "😌" : isBad ? "😰" : "😐"}</span>
              <span className="text-[14px] font-semibold">
                壓力值 {chosen.stressDelta > 0 ? "+" : ""}{chosen.stressDelta * 10}%
              </span>
              <span className="text-[13px] ml-auto font-medium">{chosen.technique}</span>
            </div>
          </div>

          {/* Expert analysis */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-[24px] p-6 border border-blue-100/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[20px]">💡</span>
              <span className="text-[15px] font-bold text-blue-900">專家解析</span>
            </div>
            <p className="text-[14px] text-blue-800/80 leading-relaxed">{chosen.expertNote}</p>
          </div>

          {/* All options comparison */}
          <div className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5">
            <p className="text-[13px] font-semibold text-apple-gray-700 mb-3">三個選項的比較：</p>
            <div className="space-y-2">
              {currentScenario.options.map((opt, i) => {
                const isChosen = i === selectedOption;
                const optIsGood = opt.stressDelta < 0;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] ${
                      isChosen ? "bg-purple-50 border border-purple-200/50" : "bg-apple-gray-50"
                    }`}
                  >
                    <span className={`font-bold ${optIsGood ? "text-apple-green" : "text-apple-gray-400"}`}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <span className="text-apple-gray-700 flex-1 truncate">{opt.text.slice(0, 30)}…</span>
                    <span className={`text-[12px] font-medium whitespace-nowrap ${optIsGood ? "text-apple-green" : "text-apple-red"}`}>
                      {opt.technique}
                    </span>
                    {isChosen && <span className="text-purple-500 text-[11px]">你的選擇</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[16px] font-bold rounded-full shadow-lg shadow-purple-200/50 hover:shadow-xl transition-shadow"
          >
            {currentIndex + 1 >= totalQuestions ? "查看我的成績 →" : "下一題 →"}
          </button>
        </div>
      </main>
    );
  }

  // ========== RESULT ==========
  if (gameState === "result") {
    const shareSummary = [
      `🧠 失智溝通模擬器 — 我的成績`,
      ``,
      `${scoreTitle.emoji} ${scoreTitle.title}`,
      `📊 照顧溝通力：${finalScore} 分`,
      `✅ 正確應對：${goodAnswers}/${answers.length} 題`,
      ``,
      `你也來測測看 👉 長照 3.0 財務決策引擎`,
    ].join("\n");

    return (
      <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-12 pb-24 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Score card */}
          <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden">
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-8 text-center">
              <div className="text-[56px] mb-2">{scoreTitle.emoji}</div>
              <h2 className="text-[28px] font-bold text-apple-gray-900 mb-1">{scoreTitle.title}</h2>
              <p className="text-[15px] text-purple-700/70">{scoreTitle.subtitle}</p>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-[36px] font-mono font-bold text-purple-600">{finalScore}</div>
                  <div className="text-[13px] text-apple-gray-500">照顧溝通力</div>
                </div>
                <div className="w-px h-12 bg-apple-gray-200" />
                <div className="text-center">
                  <div className="text-[36px] font-mono font-bold text-apple-green">{goodAnswers}/{answers.length}</div>
                  <div className="text-[13px] text-apple-gray-500">正確應對</div>
                </div>
              </div>

              {/* Per-question breakdown */}
              <div className="space-y-2">
                {answers.map((ans, i) => {
                  const scenario = scenarios[i];
                  const isGood = ans.stressDelta < 0;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-[12px] bg-apple-gray-50">
                      <span className={`text-[16px] ${isGood ? "text-apple-green" : "text-apple-red"}`}>
                        {isGood ? "✅" : "❌"}
                      </span>
                      <span className="text-[13px] text-apple-gray-700 flex-1">{scenario.category}</span>
                      <span className={`text-[12px] font-medium ${isGood ? "text-apple-green" : "text-apple-red"}`}>
                        {ans.technique}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Key takeaway */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[24px] p-6 border border-orange-100/50">
            <h4 className="text-[15px] font-bold text-amber-900 mb-2">💡 最重要的一件事</h4>
            <p className="text-[14px] text-amber-800/80 leading-relaxed">
              失智症照顧的核心技巧就是三個字：<strong className="text-apple-orange">不爭辯</strong>。
              進入長輩的世界、同理他的情緒、用行動轉移注意力，
              比任何「講道理」都有效。你做不到也沒關係——照顧者也是人，也會有崩潰的時候。
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "失智溝通模擬器成績", text: shareSummary }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(shareSummary).then(() => {
                    alert("已複製到剪貼簿！");
                  });
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[16px] font-bold rounded-full shadow-lg shadow-purple-200/50"
            >
              📤 分享成績給其他家屬
            </button>
            <button
              onClick={() => {
                setGameState("intro");
                setAnswers([]);
              }}
              className="w-full py-4 bg-white text-purple-700 text-[16px] font-bold rounded-full border-2 border-purple-200 hover:bg-purple-50 transition-colors"
            >
              🔄 再挑戰一次
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

  return null;
}
