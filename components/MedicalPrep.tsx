"use client";

import { useState } from "react";

interface VitalRecord {
  date: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  bloodSugar: string;
  weight: string;
  temperature: string;
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
}

const VISIT_CHECKLIST = [
  "確認並攜帶所有藥袋或藥單",
  "帶齊健保卡與就醫記錄",
  "記錄近期症狀變化（何時開始、頻率、嚴重程度）",
  "寫下想問醫生的問題（至少 3 個）",
  "準備最新的生命徵象紀錄",
  "確認有陪同家屬（需要時）",
  "預留足夠時間（含等待與往返）",
];

const SAMPLE_QUESTIONS = [
  "這個藥物的副作用是什麼？有哪些需要特別注意？",
  "目前的症狀有可能是哪些原因造成的？",
  "除了藥物，生活上還需要注意什麼？",
  "下次回診需要做哪些檢查？需要空腹嗎？",
  "如果症狀加重，什麼情況下需要立即就醫或急診？",
  "目前這些藥物之間有沒有交互作用的疑慮？",
];

export default function MedicalPrep() {
  const [activeTab, setActiveTab] = useState<"vitals" | "meds" | "checklist">("vitals");
  const [vitals, setVitals] = useState<VitalRecord>({
    date: new Date().toLocaleDateString("zh-TW"),
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    bloodSugar: "",
    weight: "",
    temperature: "",
  });
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: "", dosage: "", frequency: "", purpose: "" },
  ]);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [customQuestion, setCustomQuestion] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);

  const toggleCheck = (i: number) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  const addMed = () => setMedications((prev) => [...prev, { id: Date.now(), name: "", dosage: "", frequency: "", purpose: "" }]);
  const removeMed = (id: number) => setMedications((prev) => prev.filter((m) => m.id !== id));
  const updateMed = (id: number, field: keyof Medication, value: string) =>
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  const addQuestion = () => {
    if (customQuestion.trim()) {
      setQuestions((prev) => [...prev, customQuestion.trim()]);
      setCustomQuestion("");
    }
  };

  const handlePrint = () => window.print();

  const tabs = [
    { id: "vitals", label: "生命徵象", icon: "📊" },
    { id: "meds", label: "藥物清單", icon: "💊" },
    { id: "checklist", label: "就診清單", icon: "✅" },
  ] as const;

  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-sky-50 px-6 py-5 border-b border-cyan-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[28px]">🏥</span>
            <div>
              <h2 className="text-[18px] font-bold text-apple-gray-900">就診準備清單</h2>
              <p className="text-[13px] text-cyan-800/60 mt-0.5">讓每次就醫更有效率</p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="text-[13px] bg-white border border-cyan-200 text-cyan-700 px-3 py-1.5 rounded-full hover:bg-cyan-50 transition-colors font-medium"
          >
            列印 🖨️
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-apple-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-[14px] font-medium transition-colors ${
              activeTab === tab.id
                ? "text-cyan-700 border-b-2 border-cyan-500"
                : "text-apple-gray-500 hover:text-apple-gray-700"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* Vitals Tab */}
        {activeTab === "vitals" && (
          <div className="space-y-4">
            <div className="text-[13px] text-apple-gray-500 mb-3">記錄就診前的生命徵象，帶給醫師參考</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-apple-gray-600 mb-1.5">量測日期</label>
                <input
                  type="text"
                  value={vitals.date}
                  onChange={(e) => setVitals({ ...vitals, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[14px] focus:outline-none focus:border-cyan-300"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-apple-gray-600 mb-1.5">體溫 (°C)</label>
                <input
                  type="text"
                  placeholder="例：36.5"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                  className="w-full px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[14px] focus:outline-none focus:border-cyan-300"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-apple-gray-600 mb-1.5">收縮壓 (mmHg)</label>
                <input
                  type="text"
                  placeholder="例：130"
                  value={vitals.bloodPressureSystolic}
                  onChange={(e) => setVitals({ ...vitals, bloodPressureSystolic: e.target.value })}
                  className="w-full px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[14px] focus:outline-none focus:border-cyan-300"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-apple-gray-600 mb-1.5">舒張壓 (mmHg)</label>
                <input
                  type="text"
                  placeholder="例：80"
                  value={vitals.bloodPressureDiastolic}
                  onChange={(e) => setVitals({ ...vitals, bloodPressureDiastolic: e.target.value })}
                  className="w-full px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[14px] focus:outline-none focus:border-cyan-300"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-apple-gray-600 mb-1.5">心跳 (次/分)</label>
                <input
                  type="text"
                  placeholder="例：72"
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                  className="w-full px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[14px] focus:outline-none focus:border-cyan-300"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-apple-gray-600 mb-1.5">血糖 (mg/dL)</label>
                <input
                  type="text"
                  placeholder="例：110（空腹）"
                  value={vitals.bloodSugar}
                  onChange={(e) => setVitals({ ...vitals, bloodSugar: e.target.value })}
                  className="w-full px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[14px] focus:outline-none focus:border-cyan-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-apple-gray-600 mb-1.5">體重 (公斤)</label>
              <input
                type="text"
                placeholder="例：58"
                value={vitals.weight}
                onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                className="w-full px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[14px] focus:outline-none focus:border-cyan-300"
              />
            </div>
            <div className="bg-cyan-50 border border-cyan-100 rounded-[16px] p-3">
              <p className="text-[12px] text-cyan-800">
                💡 建議在就診前 1~2 天及當天早上各量測一次，取平均值更準確。
              </p>
            </div>
          </div>
        )}

        {/* Meds Tab */}
        {activeTab === "meds" && (
          <div className="space-y-4">
            <div className="text-[13px] text-apple-gray-500 mb-3">列出目前所有藥物，包含中藥、保健食品</div>
            {medications.map((med, i) => (
              <div key={med.id} className="bg-apple-gray-50 rounded-[16px] p-4 relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[13px] font-semibold text-apple-gray-600">藥物 {i + 1}</span>
                  {medications.length > 1 && (
                    <button onClick={() => removeMed(med.id)} className="text-[12px] text-rose-400 hover:text-rose-600">
                      移除
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="藥品名稱"
                    value={med.name}
                    onChange={(e) => updateMed(med.id, "name", e.target.value)}
                    className="col-span-2 px-3 py-2 rounded-[10px] border border-apple-gray-200 text-[13px] focus:outline-none focus:border-cyan-300"
                  />
                  <input
                    placeholder="劑量（例：1顆）"
                    value={med.dosage}
                    onChange={(e) => updateMed(med.id, "dosage", e.target.value)}
                    className="px-3 py-2 rounded-[10px] border border-apple-gray-200 text-[13px] focus:outline-none focus:border-cyan-300"
                  />
                  <input
                    placeholder="頻率（例：一天3次）"
                    value={med.frequency}
                    onChange={(e) => updateMed(med.id, "frequency", e.target.value)}
                    className="px-3 py-2 rounded-[10px] border border-apple-gray-200 text-[13px] focus:outline-none focus:border-cyan-300"
                  />
                  <input
                    placeholder="用途（例：降血壓）"
                    value={med.purpose}
                    onChange={(e) => updateMed(med.id, "purpose", e.target.value)}
                    className="col-span-2 px-3 py-2 rounded-[10px] border border-apple-gray-200 text-[13px] focus:outline-none focus:border-cyan-300"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addMed}
              className="w-full py-2.5 rounded-[14px] border-2 border-dashed border-cyan-200 text-cyan-600 text-[14px] font-medium hover:bg-cyan-50 transition-colors"
            >
              + 新增藥物
            </button>
          </div>
        )}

        {/* Checklist Tab */}
        {activeTab === "checklist" && (
          <div className="space-y-5">
            <div>
              <div className="text-[13px] font-semibold text-apple-gray-600 mb-3">就診前確認事項</div>
              <div className="space-y-2">
                {VISIT_CHECKLIST.map((item, i) => (
                  <label key={i} className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!checked[i]}
                      onChange={() => toggleCheck(i)}
                      className="mt-0.5 accent-cyan-500 w-4 h-4 shrink-0"
                    />
                    <span className={`text-[13px] transition-colors ${checked[i] ? "line-through text-apple-gray-400" : "text-apple-gray-700"}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[13px] font-semibold text-apple-gray-600 mb-3">要問醫生的問題</div>
              <div className="space-y-1.5 mb-3">
                {SAMPLE_QUESTIONS.slice(0, 3).map((q, i) => (
                  <div key={i} className="text-[12px] text-apple-gray-500 bg-apple-gray-50 rounded-[10px] px-3 py-2">
                    範例：{q}
                  </div>
                ))}
              </div>
              {questions.map((q, i) => (
                <div key={i} className="flex items-start gap-2 bg-cyan-50 rounded-[10px] px-3 py-2 mb-1.5">
                  <span className="text-cyan-500">Q{i + 1}.</span>
                  <span className="text-[13px] text-cyan-800">{q}</span>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="新增問題..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addQuestion()}
                  className="flex-1 px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[13px] focus:outline-none focus:border-cyan-300"
                />
                <button
                  onClick={addQuestion}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-[12px] text-[13px] font-medium hover:bg-cyan-600 transition-colors"
                >
                  新增
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
