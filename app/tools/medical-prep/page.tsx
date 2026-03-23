"use client";

import { useState } from "react";

interface Medication {
  name: string;
  dosage: string;
}

const SYMPTOM_OPTIONS = [
  { id: "appetite", label: "食慾下降", icon: "🍽️" },
  { id: "sleep", label: "睡眠問題", icon: "😴" },
  { id: "pain", label: "身體疼痛", icon: "😣" },
  { id: "mood", label: "情緒不穩", icon: "😢" },
  { id: "bowel", label: "排便異常", icon: "🚽" },
  { id: "fall", label: "跌倒", icon: "⚠️" },
  { id: "fever", label: "發燒", icon: "🌡️" },
  { id: "cough", label: "咳嗽/呼吸", icon: "😮‍💨" },
  { id: "skin", label: "皮膚問題", icon: "🩹" },
  { id: "confusion", label: "意識混亂", icon: "😵" },
  { id: "swallow", label: "吞嚥困難", icon: "💧" },
  { id: "weight", label: "體重變化", icon: "⚖️" },
];

export default function MedicalPrepPage() {
  const [elderName, setElderName] = useState("");
  const [elderAge, setElderAge] = useState("");
  const [department, setDepartment] = useState("");
  const [medications, setMedications] = useState<Medication[]>([{ name: "", dosage: "" }]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomDetails, setSymptomDetails] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [allergies, setAllergies] = useState("");
  const [generated, setGenerated] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const addMedication = () => setMedications((prev) => [...prev, { name: "", dosage: "" }]);
  const updateMedication = (i: number, field: keyof Medication, value: string) => {
    setMedications((prev) => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  };

  const addQuestion = () => setQuestions((prev) => [...prev, ""]);
  const updateQuestion = (i: number, value: string) => {
    setQuestions((prev) => prev.map((q, idx) => idx === i ? value : q));
  };

  const validMeds = medications.filter((m) => m.name.trim());
  const validQuestions = questions.filter((q) => q.trim());
  const symptomLabels = selectedSymptoms.map((id) => SYMPTOM_OPTIONS.find((s) => s.id === id)?.label).filter(Boolean);

  const generateSummary = () => {
    return [
      `━━━ 就醫提問單 ━━━`,
      ``,
      `👤 ${elderName || "長輩"}（${elderAge ? elderAge + " 歲" : ""}）`,
      `🏥 看診科別：${department || "未填"}`,
      `📅 日期：${new Date().toLocaleDateString("zh-TW")}`,
      ``,
      ...(validMeds.length > 0 ? [
        `💊 目前用藥：`,
        ...validMeds.map((m) => `  • ${m.name}${m.dosage ? `（${m.dosage}）` : ""}`),
        ``,
      ] : []),
      ...(allergies ? [`⚠️ 過敏/特殊提醒：${allergies}`, ``] : []),
      ...(symptomLabels.length > 0 ? [
        `📋 最近一週的狀況：`,
        ...symptomLabels.map((s) => `  • ${s}`),
        ...(symptomDetails ? [`  備註：${symptomDetails}`] : []),
        ``,
      ] : []),
      ...(validQuestions.length > 0 ? [
        `❓ 想問醫生的問題：`,
        ...validQuestions.map((q, i) => `  ${i + 1}. ${q}`),
        ``,
      ] : []),
      `━━━━━━━━━━━━━━━━━━`,
      `由「長照 3.0 財務決策引擎」生成`,
    ].join("\n");
  };

  // ========== GENERATED VIEW ==========
  if (generated) {
    const summary = generateSummary();

    return (
      <main className="min-h-screen bg-apple-gray-50 pt-6 sm:pt-12 pb-24 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          <a href="/tools" className="inline-flex items-center gap-2 text-[14px] text-apple-gray-500 hover:text-apple-gray-900">← 回到工具箱</a>

          {/* Preview card */}
          <div className="bg-white rounded-[24px] shadow-apple-warm border border-apple-gray-200/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[24px]">🏥</span>
              <h2 className="text-[20px] font-bold text-apple-gray-900">就醫提問單</h2>
            </div>
            <pre className="text-[14px] text-apple-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
              {summary}
            </pre>
          </div>

          <div className="bg-amber-50/60 rounded-[16px] p-4 border border-amber-100/50">
            <p className="text-[13px] text-amber-800/80 leading-relaxed">
              💡 <strong>使用方式：</strong>看診時直接打開這個畫面給醫生看，或複製傳到 LINE。
              醫生看到這張提問單，會覺得你很專業 👍
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "就醫提問單", text: summary }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(summary).then(() => alert("已複製到剪貼簿！"));
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[16px] font-bold rounded-full shadow-lg shadow-blue-200/50"
            >
              📤 複製 / 分享提問單
            </button>
            <button
              onClick={() => window.print()}
              className="w-full py-4 bg-white text-apple-gray-700 text-[16px] font-semibold rounded-full border border-apple-gray-200/60 hover:bg-apple-gray-50 transition-colors"
            >
              🖨️ 列印
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
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 p-8 text-center">
            <div className="text-[48px] mb-3">🏥</div>
            <h1 className="text-[28px] font-bold text-apple-gray-900 mb-2">就醫神隊友</h1>
            <p className="text-[15px] text-blue-800/70">
              看診前填寫，自動生成「就醫提問單」<br />
              拿手機畫面給醫生看就好
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5">
            <h3 className="text-[15px] font-bold text-apple-gray-900 mb-4">👤 基本資料</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[12px] text-apple-gray-500 mb-1 block">長輩姓名</label>
                <input
                  type="text"
                  value={elderName}
                  onChange={(e) => setElderName(e.target.value)}
                  placeholder="王媽媽"
                  className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[10px] px-3 py-2.5 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300/30"
                />
              </div>
              <div>
                <label className="text-[12px] text-apple-gray-500 mb-1 block">年齡</label>
                <input
                  type="number"
                  value={elderAge}
                  onChange={(e) => setElderAge(e.target.value)}
                  placeholder="78"
                  className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[10px] px-3 py-2.5 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300/30"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] text-apple-gray-500 mb-1 block">看哪一科</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="神經內科、家醫科..."
                className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[10px] px-3 py-2.5 text-[15px] text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300/30"
              />
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5">
            <h3 className="text-[15px] font-bold text-apple-gray-900 mb-4">💊 目前用藥</h3>
            <div className="space-y-2">
              {medications.map((med, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => updateMedication(i, "name", e.target.value)}
                    placeholder="藥名"
                    className="flex-1 bg-apple-gray-50 border border-apple-gray-200/60 rounded-[10px] px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300/30"
                  />
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                    placeholder="劑量/頻率"
                    className="w-32 bg-apple-gray-50 border border-apple-gray-200/60 rounded-[10px] px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300/30"
                  />
                </div>
              ))}
            </div>
            <button onClick={addMedication} className="mt-2 text-[13px] text-blue-600 font-medium hover:text-blue-800">
              + 新增用藥
            </button>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5">
            <h3 className="text-[15px] font-bold text-apple-gray-900 mb-3">⚠️ 過敏 / 特殊提醒</h3>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="例：對盤尼西林過敏、有做過心臟手術"
              className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[10px] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300/30"
            />
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5">
            <h3 className="text-[15px] font-bold text-apple-gray-900 mb-4">📋 最近一週的狀況（可複選）</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {SYMPTOM_OPTIONS.map((sym) => (
                <button
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-2.5 rounded-[12px] text-center transition-all border text-[13px] ${
                    selectedSymptoms.includes(sym.id)
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                      : "bg-apple-gray-50 border-apple-gray-200/60 text-apple-gray-600"
                  }`}
                >
                  <div className="text-[16px] mb-0.5">{sym.icon}</div>
                  {sym.label}
                </button>
              ))}
            </div>
            <textarea
              value={symptomDetails}
              onChange={(e) => setSymptomDetails(e.target.value)}
              placeholder="補充說明（選填）：例如「痛在右膝蓋，走路時特別痛」"
              rows={2}
              className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[10px] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300/30 resize-none"
            />
          </div>

          {/* Questions for doctor */}
          <div className="bg-white rounded-[20px] border border-apple-gray-200/60 p-5">
            <h3 className="text-[15px] font-bold text-apple-gray-900 mb-4">❓ 想問醫生的問題</h3>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <input
                  key={i}
                  type="text"
                  value={q}
                  onChange={(e) => updateQuestion(i, e.target.value)}
                  placeholder={`問題 ${i + 1}：例如「這個藥可以跟血壓藥一起吃嗎？」`}
                  className="w-full bg-apple-gray-50 border border-apple-gray-200/60 rounded-[10px] px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300/30"
                />
              ))}
            </div>
            {questions.length < 5 && (
              <button onClick={addQuestion} className="mt-2 text-[13px] text-blue-600 font-medium hover:text-blue-800">
                + 新增問題（最多 5 題）
              </button>
            )}
          </div>

          {/* Generate */}
          <button
            onClick={() => setGenerated(true)}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[17px] font-bold rounded-full shadow-lg shadow-blue-200/50 hover:shadow-xl transition-shadow"
          >
            生成就醫提問單 →
          </button>
        </div>
      </div>
    </main>
  );
}
