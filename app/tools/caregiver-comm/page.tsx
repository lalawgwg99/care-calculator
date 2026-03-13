"use client";

import { useState } from "react";
import { CARE_PHRASES, PHRASE_CATEGORIES } from "@/constants/bilingualPhrases";

type Language = "indonesian" | "vietnamese";

export default function CaregiverCommPage() {
  const [language, setLanguage] = useState<Language>("indonesian");
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");
  const [generated, setGenerated] = useState(false);

  const togglePhrase = (id: string) => {
    setSelectedPhrases((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selected = CARE_PHRASES.filter((p) => selectedPhrases.includes(p.id));

  const langLabel = language === "indonesian" ? "印尼文" : "越南文";

  const generateCard = () => {
    const lines = [
      `━━━ 照顧聯絡簿 ━━━`,
      `📅 ${new Date().toLocaleDateString("zh-TW")}`,
      ``,
      ...selected.map((p) => {
        const translation = language === "indonesian" ? p.indonesian : p.vietnamese;
        return `☐ ${p.chinese}\n   ${translation}`;
      }),
      ...(customNote ? [``, `📝 備註 / Catatan / Ghi chú:`, customNote] : []),
      ``,
      `━━━━━━━━━━━━━━━━━━`,
    ];
    return lines.join("\n");
  };

  // ========== GENERATED VIEW ==========
  if (generated && selected.length > 0) {
    const card = generateCard();

    return (
      <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-12 pb-24 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          <a href="/tools" className="inline-flex items-center gap-2 text-[14px] text-apple-gray-500 hover:text-apple-gray-900">← 回到工具箱</a>

          <div className="bg-white rounded-[24px] shadow-apple-warm border border-apple-gray-200/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-[24px]">🗣️</span>
                <h2 className="text-[20px] font-bold text-apple-gray-900">照顧聯絡簿</h2>
              </div>
              <span className="text-[13px] px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                中文 + {langLabel}
              </span>
            </div>

            <div className="space-y-3">
              {selected.map((phrase) => {
                const translation = language === "indonesian" ? phrase.indonesian : phrase.vietnamese;
                return (
                  <div key={phrase.id} className="bg-apple-gray-50 rounded-[14px] p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-[18px] mt-0.5">☐</span>
                      <div>
                        <p className="text-[16px] font-semibold text-apple-gray-900">{phrase.chinese}</p>
                        <p className="text-[15px] text-blue-700 mt-1">{translation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {customNote && (
              <div className="mt-4 bg-amber-50/60 rounded-[14px] p-4">
                <p className="text-[13px] font-semibold text-amber-800 mb-1">📝 備註</p>
                <p className="text-[14px] text-amber-900">{customNote}</p>
              </div>
            )}
          </div>

          <div className="bg-amber-50/60 rounded-[16px] p-4 border border-amber-100/50">
            <p className="text-[13px] text-amber-800/80 leading-relaxed">
              💡 <strong>使用方式：</strong>截圖貼冰箱，或複製傳到 LINE 群組給看護。
              每天更新要注意的事項。
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "照顧聯絡簿", text: card }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(card).then(() => alert("已複製到剪貼簿！"));
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-[16px] font-bold rounded-full shadow-lg shadow-green-200/50"
            >
              📤 複製 / 分享給看護
            </button>
            <button
              onClick={() => window.print()}
              className="w-full py-4 bg-white text-apple-gray-700 text-[16px] font-semibold rounded-full border border-apple-gray-200/60 hover:bg-apple-gray-50 transition-colors"
            >
              🖨️ 列印貼冰箱
            </button>
            <button
              onClick={() => setGenerated(false)}
              className="w-full py-3 text-[14px] text-apple-gray-500 hover:text-apple-gray-700"
            >
              ← 返回修改
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ========== FORM VIEW ==========
  return (
    <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-12 pb-24 px-4">
      <div className="max-w-lg mx-auto">
        <a href="/tools" className="inline-flex items-center gap-2 text-[14px] text-apple-gray-500 hover:text-apple-gray-900 mb-6">← 回到工具箱</a>

        <div className="bg-white rounded-[32px] shadow-apple-warm border border-apple-gray-200/60 overflow-hidden mb-6">
          <div className="bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-8 text-center">
            <div className="text-[48px] mb-3">🗣️</div>
            <h1 className="text-[28px] font-bold text-apple-gray-900 mb-2">看護溝通卡</h1>
            <p className="text-[15px] text-green-800/70">
              勾選今天的照顧重點<br />
              一鍵生成中印/中越雙語對照清單
            </p>
          </div>
        </div>

        {/* Language toggle */}
        <div className="bg-white rounded-[16px] border border-apple-gray-200/60 p-4 mb-6">
          <p className="text-[13px] text-apple-gray-600 mb-3">看護的母語是？</p>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage("indonesian")}
              className={`flex-1 py-3 rounded-[12px] text-[15px] font-semibold transition-all ${
                language === "indonesian"
                  ? "bg-green-500 text-white shadow-sm"
                  : "bg-apple-gray-50 text-apple-gray-600 border border-apple-gray-200/60"
              }`}
            >
              🇮🇩 印尼文
            </button>
            <button
              onClick={() => setLanguage("vietnamese")}
              className={`flex-1 py-3 rounded-[12px] text-[15px] font-semibold transition-all ${
                language === "vietnamese"
                  ? "bg-green-500 text-white shadow-sm"
                  : "bg-apple-gray-50 text-apple-gray-600 border border-apple-gray-200/60"
              }`}
            >
              🇻🇳 越南文
            </button>
          </div>
        </div>

        {/* Phrase categories */}
        <div className="space-y-4 mb-6">
          {PHRASE_CATEGORIES.map((cat) => {
            const phrases = CARE_PHRASES.filter((p) => p.category === cat);
            return (
              <div key={cat} className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5">
                <h3 className="text-[15px] font-bold text-apple-gray-900 mb-3">{cat}</h3>
                <div className="space-y-1.5">
                  {phrases.map((phrase) => {
                    const isSelected = selectedPhrases.includes(phrase.id);
                    const translation = language === "indonesian" ? phrase.indonesian : phrase.vietnamese;
                    return (
                      <button
                        key={phrase.id}
                        onClick={() => togglePhrase(phrase.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-[12px] text-left transition-colors ${
                          isSelected ? "bg-green-50 border border-green-200/50" : "bg-apple-gray-50/40 hover:bg-apple-gray-50"
                        }`}
                      >
                        <span className={`text-[16px] mt-0.5 ${isSelected ? "text-apple-green" : "text-apple-gray-300"}`}>
                          {isSelected ? "✅" : "☐"}
                        </span>
                        <div>
                          <p className="text-[14px] font-medium text-apple-gray-900">{phrase.chinese}</p>
                          <p className="text-[12px] text-blue-600/70 mt-0.5">{translation}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom note */}
        <div className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5 mb-6">
          <h3 className="text-[15px] font-bold text-apple-gray-900 mb-3">📝 自由備註</h3>
          <textarea
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="其他要跟看護說的事（中文即可）"
            rows={3}
            className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[10px] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-300/30 resize-none"
          />
        </div>

        {/* Generate */}
        <button
          onClick={() => {
            if (selected.length > 0) setGenerated(true);
          }}
          disabled={selected.length === 0}
          className={`w-full py-4 text-[17px] font-bold rounded-full shadow-lg transition-shadow ${
            selected.length > 0
              ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-green-200/50 hover:shadow-xl"
              : "bg-apple-gray-200 text-apple-gray-400 cursor-not-allowed"
          }`}
        >
          {selected.length > 0
            ? `生成雙語照顧卡（${selected.length} 項）→`
            : "請先勾選至少一項"}
        </button>
      </div>
    </main>
  );
}
