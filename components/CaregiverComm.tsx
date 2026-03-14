"use client";

import { useState } from "react";

interface Template {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  fields: { id: string; label: string; placeholder: string; multiline?: boolean }[];
  template: (values: Record<string, string>) => string;
}

const TEMPLATES: Template[] = [
  {
    id: "handoff",
    icon: "📝",
    title: "交班訊息",
    subtitle: "照顧班次結束時，傳給接手家人",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-100",
    fields: [
      { id: "caregiver", label: "今日照顧者", placeholder: "例：爸爸" },
      { id: "date", label: "日期時間", placeholder: "例：3月14日 下午2點" },
      { id: "condition", label: "長輩今日狀況", placeholder: "例：今天精神還不錯，吃了三餐，中午睡了一個小時", multiline: true },
      { id: "meds", label: "用藥情況", placeholder: "例：早上9點服藥：降血壓藥×1、安眠藥×0.5（晚上再吃）" },
      { id: "issues", label: "需要注意事項", placeholder: "例：下午3點半有複診，記得帶健保卡。腳踝有輕微水腫，需觀察。" },
      { id: "nextAction", label: "交給誰 / 下一步", placeholder: "例：交給媽媽接手，記得晚上9點前提醒睡前藥" },
    ],
    template: (v) => `【交班訊息】${v.date || ""}
照顧者：${v.caregiver || "___"}

📋 今日狀況
${v.condition || "（請填寫）"}

💊 用藥情況
${v.meds || "（請填寫）"}

⚠️ 注意事項
${v.issues || "（請填寫）"}

➡️ 後續安排
${v.nextAction || "（請填寫）"}`,
  },
  {
    id: "meeting",
    icon: "👨‍👩‍👧",
    title: "家庭會議議程",
    subtitle: "整合家人共同討論照顧計畫",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-100",
    fields: [
      { id: "meetingDate", label: "會議日期地點", placeholder: "例：3月20日晚上7點，視訊" },
      { id: "attendees", label: "與會家人", placeholder: "例：大哥、二姊、弟弟、媽媽" },
      { id: "topic1", label: "議題一：目前照顧狀況", placeholder: "例：討論阿公最近身體狀況與日常照顧需求" },
      { id: "topic2", label: "議題二：照顧分工", placeholder: "例：重新分配每週照顧時間與責任" },
      { id: "topic3", label: "議題三：財務規劃", placeholder: "例：討論是否申請外籍看護或日照中心" },
      { id: "decision", label: "需要做的決定", placeholder: "例：決定是否申請長照服務，由誰負責聯絡1966" },
    ],
    template: (v) => `【家庭照顧會議議程】
日期/地點：${v.meetingDate || "___"}
與會成員：${v.attendees || "___"}

─────────────────
議程一：照顧現況
${v.topic1 || "（請填寫）"}

議程二：照顧分工
${v.topic2 || "（請填寫）"}

議程三：財務與服務規劃
${v.topic3 || "（請填寫）"}

─────────────────
本次需決定事項：
${v.decision || "（請填寫）"}

請各位盡量出席，讓我們一起做出最好的決定。`,
  },
  {
    id: "emergency",
    icon: "🚨",
    title: "緊急聯絡通知",
    subtitle: "長輩緊急就醫時，快速通知家人",
    color: "text-rose-700",
    bgColor: "bg-rose-50 border-rose-100",
    fields: [
      { id: "sender", label: "通知者", placeholder: "例：二女兒 小美" },
      { id: "time", label: "發生時間", placeholder: "例：今天下午3點20分" },
      { id: "incident", label: "發生狀況", placeholder: "例：阿嬤突然跌倒，右腿疼痛無法站立", multiline: true },
      { id: "location", label: "目前位置", placeholder: "例：已送至台大醫院急診室，正在等待X光" },
      { id: "stable", label: "目前情況", placeholder: "例：意識清楚，醫生說可能是右股骨骨折，正在安排住院" },
      { id: "needed", label: "需要的協助", placeholder: "例：希望哥哥盡快趕來，還需要有人通知其他親戚" },
    ],
    template: (v) => `🚨【緊急通知】
通知人：${v.sender || "___"}｜時間：${v.time || "___"}

發生狀況：
${v.incident || "（請填寫）"}

目前位置：${v.location || "___"}

目前情況：
${v.stable || "（請填寫）"}

需要協助：
${v.needed || "（請填寫）"}

如需進一步聯繫，請盡速回覆。`,
  },
];

export default function CaregiverComm() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const template = TEMPLATES.find((t) => t.id === selectedTemplate);
  const currentValues = values[selectedTemplate ?? ""] ?? {};
  const generatedText = template ? template.template(currentValues) : "";

  const updateValue = (templateId: string, fieldId: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [templateId]: { ...(prev[templateId] ?? {}), [fieldId]: value },
    }));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(selectedTemplate);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 border-b border-green-100/50">
        <div className="flex items-center gap-3">
          <span className="text-[28px]">💬</span>
          <div>
            <h2 className="text-[18px] font-bold text-apple-gray-900">家庭溝通模板</h2>
            <p className="text-[13px] text-green-800/60 mt-0.5">快速產生照顧溝通訊息，減少溝通摩擦</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Template Selection */}
        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(selectedTemplate === t.id ? null : t.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-[18px] border-2 transition-all text-center ${
                selectedTemplate === t.id ? `${t.bgColor} border-current` : "border-apple-gray-200 hover:border-apple-gray-300 bg-apple-gray-50"
              }`}
            >
              <span className="text-[28px]">{t.icon}</span>
              <div className={`font-semibold text-[13px] ${selectedTemplate === t.id ? t.color : "text-apple-gray-700"}`}>{t.title}</div>
              <div className="text-[11px] text-apple-gray-400 leading-snug">{t.subtitle}</div>
            </button>
          ))}
        </div>

        {/* Template Editor */}
        {template && (
          <div>
            <div className={`rounded-[20px] border p-4 mb-4 ${template.bgColor}`}>
              <div className="text-[13px] font-semibold text-apple-gray-600 mb-3">填入資訊</div>
              <div className="space-y-3">
                {template.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-[12px] font-medium text-apple-gray-600 mb-1">{field.label}</label>
                    {field.multiline ? (
                      <textarea
                        placeholder={field.placeholder}
                        value={currentValues[field.id] ?? ""}
                        onChange={(e) => updateValue(template.id, field.id, e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[13px] focus:outline-none focus:border-green-300 resize-none bg-white"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={currentValues[field.id] ?? ""}
                        onChange={(e) => updateValue(template.id, field.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-[12px] border border-apple-gray-200 text-[13px] focus:outline-none focus:border-green-300 bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-apple-gray-50 rounded-[16px] p-4 mb-3">
              <div className="text-[12px] font-semibold text-apple-gray-500 mb-2">訊息預覽</div>
              <pre className="text-[13px] text-apple-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {generatedText}
              </pre>
            </div>

            <button
              onClick={copyToClipboard}
              className={`w-full py-2.5 rounded-full font-semibold text-[14px] transition-all ${
                copied === selectedTemplate
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-green-500 hover:bg-green-600 text-white shadow-sm"
              }`}
            >
              {copied === selectedTemplate ? "✓ 已複製到剪貼板" : "複製訊息 📋"}
            </button>
          </div>
        )}

        {!selectedTemplate && (
          <div className="text-center py-6 text-apple-gray-400 text-[14px]">
            請選擇上方的訊息模板
          </div>
        )}
      </div>
    </div>
  );
}
